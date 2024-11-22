import { Container } from "../../Components/Container";
import { FiTrash, FiUpload } from "react-icons/fi";
import { TitleBar } from "../../Components/TitleBar";
import { CalendarDisplay } from "../../Widgets/Calendar";
import { HeaderForm } from "../../Components/HeaderForm";
import { Link, useNavigate } from "react-router-dom";
import { db, storage } from "../../services/firebaseConnection";
import { useAuth } from "../../Context/AuthContext";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

SwiperCore.use([Navigation, Pagination]);
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import { v4 as uuidV4 } from "uuid";

import { ImProfile } from "react-icons/im";
import { useCallback, useEffect, useState, ChangeEvent, useMemo } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { InputMini } from "../../Components/InputMini";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../Components/Button";
import toast from "react-hot-toast";

const registroTurmasSchema = z.object({
  nameClass: z.string(),
  maxStudent: z.string().min(1),
});

const registroProfessorSchema = z
  .object({
    name: z.string().min(3, "Deve conter no mínimo 3 caracteres").max(100),
    email: z.string().email("Digite um email válido"),
    password: z.string().min(6, "Deve conter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Deve conter no mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
  });

type FormDataRegisterTeachers = z.infer<typeof registroProfessorSchema>;

type FormDataClass = z.infer<typeof registroTurmasSchema>;

interface ImagensEventosProps {
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function Dashboard() {
  const {
    register: registerClass,
    handleSubmit: handleSubmitClass,
    reset,
  } = useForm<FormDataClass>({
    resolver: zodResolver(registroTurmasSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegisterTeachers>({
    resolver: zodResolver(registroProfessorSchema),
  });

  const {
    user,
    logout,
    getUIDS,
    uidContextGeral,
    uidContextTeacher,
    uidContextInstitution,
    setUidContextTeacher,
    fetchDataTypeUser,
    isAdmin,
    isUser,
  } = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();
  const [userUid, setUserUid] = useState<string | any>("");
  const [loading, setLoading] = useState(false);
  const [isImagens, setIsImagens] = useState<ImagensEventosProps[]>([]);
  const [maxAlunos, setMaxAlunos] = useState<number>();

  const [classes, setClasses] = useState<
    Array<{ nameClass: string; uid: string; maxStudent: number }>
  >([]);
  const [classesTeachers, setClassesTeachers] = useState<
    Array<{ nameClass: string; uid: string; maxStudent: number }>
  >([]);

  useEffect(() => {
    if (user) {
      fetchDataTypeUser(user.uid);
    }
  }, [user.uid, fetchDataTypeUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUid(user.uid);
      } else {
        setUserUid(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    if (userUid) {
      getUIDS(userUid);
    }
  }, [userUid]);

  const searchClassesByInstitution = (institutionId: string) => {
    const classesRefData = collection(
      db,
      "institutions",
      institutionId,
      "classes"
    );

    return onSnapshot(classesRefData, (snapshot) => {
      const dataClasses = snapshot.docs.map((doc) => ({
        nameClass: doc.data().nameClass,
        uid: doc.id,
        maxStudent: doc.data().maxStudent,
      }));

      dataClasses.sort((a, b) => parseInt(a.nameClass) - parseInt(b.nameClass));

      setClasses(dataClasses);
    });
  };

  const totalMaxStudents = useMemo(() => {
    if (user?.uid === uidContextInstitution) {
      return classes.reduce((accum, turma) => {
        return accum + (Number(turma.maxStudent) || 0);
      }, 0);
    } else {
      return classesTeachers.reduce((accum, turma) => {
        return accum + (Number(turma.maxStudent) || 0);
      }, 0);
    }
  }, [classes, classesTeachers]);

  useEffect(() => {
    setMaxAlunos(totalMaxStudents);
  }, [totalMaxStudents]);

  useEffect(() => {
    if (uidContextGeral === user?.uid) {
      searchClassesByInstitution(uidContextGeral);
    }
  }, [searchClassesByInstitution, uidContextGeral]);

  const searchClassesByTeachers = async (teacherUid: string) => {
    const classesRefData = doc(db, "teachers", teacherUid);

    try {
      const snapshotClassesData = await getDoc(classesRefData);
      if (snapshotClassesData.exists()) {
        const classes = snapshotClassesData.data().classes;
        const classesArray = Array.isArray(classes) ? classes : [];

        // Transformar todas as classes em objetos com nameClass, uid e maxStudents
        const classesObjects = classesArray.map((classe) => {
          const [nameClass, uid, maxStudent] = classe.split(" "); // Dividindo a string em partes
          return {
            nameClass: nameClass, // O primeiro elemento
            uid: uid, // O segundo elemento
            maxStudent: parseInt(maxStudent), // O terceiro elemento convertido para número
          };
        });

        setClassesTeachers(classesObjects); // Exibindo o result como objetos

        return classesObjects; // Retornando o novo array de objetos
      } else {
        console.log("Nenhum documento encontrado com esse ID.");
        return [];
      }
    } catch (error) {
      console.error("Erro ao buscar o documento:", error);
      return [];
    }
  };

  useEffect(() => {
    if (uidContextTeacher === user?.uid) {
      searchClassesByTeachers(user?.uid);
    }
  }, [searchClassesByTeachers, user?.uid, uidContextTeacher]);

  const registrationClasses = async (data: FormDataClass) => {
    try {
      if (!userUid) {
        throw new Error("ID da instituição não encontrado.");
      }
      const uidClass: string = uuidV4();

      const classesRefData = collection(
        db,
        "institutions",
        uidContextGeral,
        "classes"
      );

      await addDoc(classesRefData, {
        nameClass: data.nameClass,
        maxStudent: data.maxStudent,
        uid: uidClass,
      });
      reset();
    } catch (error) {
      console.error("Erro ao adicionar turma:", error);
    }
  };

  const deleteClass = useCallback(
    async (uid: string) => {
      try {
        const classesRefData = doc(
          db,
          "institutions",
          uidContextInstitution,
          "classes",
          uid
        );
        await deleteDoc(classesRefData);
      } catch (error) {
        console.error("Erro ao excluir documento:", error);
      }
    },
    [userUid]
  );

  const handleLogout = async () => {
    try {
      await logout;
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  const saveUidTeacher = async (uid: string) => {
    try {
      if (!user?.uid) {
        throw new Error("User não encontrado.");
      }

      const dataRefTeacherUid = collection(
        db,
        "institutions",
        uidContextInstitution,
        "uidTeachers"
      );

      await addDoc(dataRefTeacherUid, {
        uid: uid,
      });

      console.log("Uid Salvo");
    } catch (error) {
      console.error("Erro ao adicionar uid:", error);
    }
  };

  const registrationTeacher = async (data: FormDataRegisterTeachers) => {
    setLoading(true);

    try {
      const authenticationUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const datatUser = authenticationUser.user;
      const newUid = datatUser?.uid; // Captura o novo UID
      setUidContextTeacher(newUid); // Atualiza o UID do professor
      await updateProfile(datatUser, {
        displayName: data.name,
      });

      await saveUidTeacher(newUid); // Salva o UID imediatamente após a criação

      reset();

      setTimeout(() => {
        navigate("/profileTeacher", { replace: true });
      }, 2000);
      toast.success("Conta criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const changeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (
        image.type === "image/jpeg" ||
        image.type === "image/png" ||
        "image/webp"
      ) {
        uploadImage(image);
        setTimeout(() => {
          toast.success("Upload Realizado!");
        }, 1500);
      } else {
        toast.error("Formato de imagem inválido... Apenas JPEG ou PNG ou Webp");
        return;
      }
    }
  };

  const uploadImage = (image: File) => {
    if (!user?.uid) {
      toast.error("Você precisa estar logado para fazer essa ação!");
      return;
    }

    const uidLogged = user?.uid;
    const uidImage = uuidV4();

    const uploadRefImage = ref(storage, `imagens/${uidLogged}/${uidImage}`);

    uploadBytes(uploadRefImage, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const dataImage = {
          uid: uidLogged,
          id: user?.uid,
          name: uidImage,
          previewUrl: URL.createObjectURL(image),
          url: downloadURL,
        };
        setIsImagens((imagens) => [...imagens, dataImage]);
      });
    });
  };

  const catchImages = useCallback(() => {
    const catchImagesRef = ref(storage, `imagens/${uidContextGeral}`);

    listAll(catchImagesRef)
      .then(async (result) => {
        const urls = await Promise.all(
          result.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { uid: item.name, name: item.name, url };
          })
        );
        setIsImagens(urls as ImagensEventosProps[]);
      })
      .catch((error) => {
        console.error("Erro ao pegar imagens:", error);
      });
  }, [uidContextGeral]);

  const deleteImage = useCallback(
    async (imagem: ImagensEventosProps) => {
      const catchImagesStorageRef = `imagens/${user?.uid}/${imagem.name}`;
      const imagesStorageRef = ref(storage, catchImagesStorageRef);

      try {
        await deleteObject(imagesStorageRef);
        setIsImagens((imagens) =>
          imagens.filter((image) => image.url !== imagem.url)
        );

        setTimeout(() => {
          toast.success("Imagem Deletada");
        }, 500);
      } catch (error) {
        console.log(error);
      }
    },
    [user?.uid]
  );

  useEffect(() => {
    catchImages();
  }, [catchImages]);

  return (
    <main className="max-h-full">
      {isUser && (
        <>
          <section>
            <TitleBar
              title="Dashboard"
              message="Seja Bem-vindo, Professor(a)"
              user={user.displayName}
              onClose={() => {
                handleLogout();
              }}
              nameButton="Sair"
              icon={""}
            />
          </section>
          <Container>
            <div className="flex xl:flex-row flex-col-reverse gap-3">
              <aside className="flex flex-row xl:flex-col gap-4 mr-6 ml-6">
                <section className="xl:m-5 w-52 h-85 border-2 rounded-b-xl border-greenEdu overflow-y-auto">
                  <HeaderForm children={"Turma"} />
                  <div className="flex flex-col justify-center items-center mt-5 gap-3 text-greenEdu font-medium">
                    {classesTeachers.length > 0 && (
                      <div className="flex flex-col justify-center items-center mt-5 gap-3 text-greenEdu font-medium">
                        {classesTeachers.map((classInfo: any) => (
                          <div
                            key={classInfo.uid}
                            className="flex gap-3 items-center justify-center"
                          >
                            {" "}
                            <Link
                              to={`/dashboard/class/${classInfo.uid}`}
                              className="text-center w-24 border-2 border-greenEdu rounded-full"
                            >
                              {classInfo.nameClass}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </aside>

              <article className="border-2 rounded-2xl border-greenEdu h-96 xl:h-128 xl:w-1/2 xl:m-5 flex flex-col gap-3 justify-center items-center">
                <div className="rounded-2xl bg-greenEdu w-72 xl:w-128 h-5/6 border-2 border-greenEdu flex flex-col justify-center items-center">
                  <Swiper
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    className="w-full h-full" // Certifique-se de que este Swiper ocupa o espaço
                    slidesPerView={1}
                  >
                    {isImagens.map((image: any) => (
                      <SwiperSlide
                        key={image.uid}
                        className="flex justify-center items-center"
                      >
                        <img
                          src={image.url}
                          alt={image.name}
                          className="rounded-2xl w-full h-full object-cover" // Assegura que a imagem preencha o slide
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </article>

              <div className="flex flex-col items-center 2xl:ml-5 xl:ml-10 xl:w-1/4 mt-5">
                <div className="relative z-50 w-44 xl:w-96">
                  <CalendarDisplay />
                </div>
                <div className="border-2 border-greenEdu xl:absolute  rounded-b-xl w-full xl:w-85 xl:h-32 mt-8 xl:mt-44">
                  <HeaderForm children={"N° Máximo ALunos"} />
                  <div className="flex justify-center items-center p-2 xl:mt-7">
                    <span className="text-greenEdu text-3xl font-bold">
                      {maxAlunos}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </>
      )}

      {isAdmin && (
        <>
          <section>
            <TitleBar
              title="Dashboard"
              message="Seja Bem-vindo, "
              user={user.displayName}
              onClose={() => {
                handleLogout();
              }}
              onProfile={() => {
                navigate("/dashboard/profile");
              }}
              nameButton="Sair"
              icon={<ImProfile size={24} />}
            />
          </section>
          <Container>
            <div className="flex xl:flex-row flex-col-reverse xl:gap-3 gap-4 ">
              <aside className="flex flex-row  xl:flex-col gap-4 mr-2 ml-2">
                <section className="xl:m-5 xl:w-52 w-72 h-56 xl:h-85 border-2 rounded-b-xl border-greenEdu overflow-y-auto">
                  <HeaderForm children={"Turma"} />
                  {classes.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-5 gap-3 text-greenEdu font-medium">
                      {classes.map((classInfo: any) => (
                        <div
                          key={classInfo.uid}
                          className="flex gap-3 items-center justify-center"
                        >
                          {" "}
                          <Link
                            to={`/dashboard/class/${classInfo.uid}`}
                            className="text-center w-24 border-2 border-greenEdu rounded-full"
                          >
                            {classInfo.nameClass}
                          </Link>
                          <button
                            className="hover:text-redEdu"
                            onClick={() => {
                              deleteClass(classInfo.uid);
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section className="xl:m-5 xl:-mt-4 xl:w-52  w-32 xl:h-56 border-2 rounded-b-xl border-greenEdu">
                  <HeaderForm children={"Nova Turma"} />
                  <div className="flex mt-2 gap-2 justify-center items-center">
                    <form
                      onSubmit={handleSubmitClass(registrationClasses)}
                      className="flex flex-col items-center"
                    >
                      <label htmlFor="turma" className="opacity-45 font-medium">
                        Turma
                      </label>
                      <div className="w-24 text-center">
                        <InputMini
                          type="text"
                          placeholder="ex: 901"
                          name="nameClass"
                          register={registerClass}
                        />
                      </div>
                      <label
                        htmlFor="maxAlunos"
                        className="opacity-45 font-medium"
                      >
                        Qtd Alunos
                      </label>
                      <div className="w-24 text-center">
                        <InputMini
                          type="text"
                          placeholder="ex: 38"
                          name="maxStudent"
                          register={registerClass}
                        />
                      </div>

                      <button
                        className="xl:w-52 xl:mt-2 p-1 h-12 rounded-b-xl text-whiteEdu bg-greenEdu font-bold hover:opacity-90"
                        type="submit"
                      >
                        Adicionar
                      </button>
                    </form>
                  </div>
                </section>
              </aside>

              <article className="border-2 rounded-2xl border-greenEdu h-96 xl:h-128 xl:w-1/2 xl:m-5 flex flex-col gap-3 justify-center items-center">
                <div className="rounded-2xl mt-10 bg-greenEdu w-72 xl:w-130 h-5/6 border-2 border-greenEdu flex flex-col justify-center items-center">
                  <Swiper
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    className="w-full h-full" // Certifique-se de que este Swiper ocupa o espaço
                    slidesPerView={1}
                  >
                    {isImagens.map((image: any) => (
                      <SwiperSlide
                        key={image.uid}
                        className="flex justify-center items-center"
                      >
                        <button
                          onClick={() => {
                            deleteImage(image);
                          }}
                          className="fixed top-0 right-0 mr-4 mt-2 cursor-pointer"
                        >
                          <FiTrash />
                        </button>
                        <img
                          src={image.url}
                          alt={image.name}
                          className="rounded-2xl w-full h-full object-cover" // Assegura que a imagem preencha o slide
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
                <button className="border-2 border-greenEdu rounded-lg w-16 mb-4 flex justify-center items-center cursor-pointer border-gray-600 h-16 md:w-48 relative">
                  <FiUpload size={30} color="#097d5e" className="absolute" />
                  <input
                    type="file"
                    accept="image/*"
                    className="opacity-0 w-72  -ml-40 h-full cursor-pointer"
                    onChange={changeFile}
                  />
                </button>
              </article>

              <div className="flex flex-col items-center 2xl:ml-5 xl:ml-10 xl:w-1/4 mt-5">
                <div className="relative z-50 w-44 xl:w-96">
                  <CalendarDisplay />
                </div>
                <div className="border-2 border-greenEdu absolute rounded-b-xl w-85 xl:w-85 xl:h-32 mt-32 xl:mt-32">
                  <HeaderForm children={"N° Máximo ALunos"} />
                  <div className="flex justify-center items-center p-2 xl:mt-7">
                    <span className="text-greenEdu text-3xl font-bold">
                      {maxAlunos}
                    </span>
                  </div>
                </div>
                <div className="border-greenEdu w-85 xl:absolute xl:w-85 xl:h-72 xl:mt-72 mt-40 border-2 rounded-b-xl pb-10 ">
                  <h2 className="flex justify-center items-center h-9 bg-greenEdu sticky top-0 text-whiteEdu font-medium text-xl">
                    Novo Professor(a)
                  </h2>
                  <div className="flex justify-center items-center p-2 ">
                    <form
                      onSubmit={handleSubmit(registrationTeacher)}
                      className="mt-1 items-center justify-center flex flex-col"
                    >
                      <div className="flex flex-col gap-1 w-80 xl:w-60">
                        <InputMini
                          error={errors.name?.message}
                          register={register}
                          type="text"
                          name="name"
                          placeholder="Nome"
                          aria-invalid={!!errors.name}
                        />
                        <InputMini
                          error={errors.email?.message}
                          register={register}
                          type="email"
                          name="email"
                          placeholder="E-mail"
                          aria-invalid={!!errors.email}
                        />
                        <InputMini
                          error={errors.password?.message}
                          register={register}
                          type="password"
                          name="password"
                          placeholder="Senha"
                          aria-invalid={!!errors.password}
                        />
                        <InputMini
                          error={errors.confirmPassword?.message}
                          register={register}
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirme sua senha"
                          aria-invalid={!!errors.confirmPassword}
                        />
                      </div>
                      <div className="mt-2">
                        <Button disabled={loading}>
                          {loading ? "Cadastrando..." : "Cadastrar-se"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </>
      )}
    </main>
  );
}
