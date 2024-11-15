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
import { useCallback, useEffect, useState, ChangeEvent } from "react";
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
    getUIDS,
    uidContextGeral,
    uidContextTeacher,
    uidContextInstitution,
    setUidContextTeacher,
  } = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();
  const [userUid, setUserUid] = useState<string | any>("");
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isImagens, setIsImagens] = useState<ImagensEventosProps[]>([]);

  const [classes, setClasses] = useState<
    Array<{ nameClass: string; uid: string; maxStudent: number }>
  >([]);
  const [classesTeachers, setClassesTeachers] = useState<
    Array<{ nameClass: string; uid: string; maxStudent: number }>
  >([]);

  const buscarDadosTipoUser = useCallback(async (uid: string) => {
    if (typeof uid !== "string") {
      throw new Error("O ID fornecido não é uma string válida");
    }

    const buscarTipoInstituicao = async () => {
      const dadosRefInstituicao = doc(db, "institutions", uid);
      const dadosInstituicao = await getDoc(dadosRefInstituicao);
      if (dadosInstituicao.exists()) {
        setIsAdmin(dadosInstituicao.data()?.userTypeAdmin);
        return true;
      }
      return false;
    };

    const buscarTipoProfessor = async () => {
      const dadosRefProfessor = doc(db, "teachers", uid);
      const dadosProfessor = await getDoc(dadosRefProfessor);

      if (dadosProfessor.exists()) {
        setIsUser(dadosProfessor.data()?.userTypeNormal);
        return true;
      }
      return false;
    };

    try {
      const tipoEncontrado =
        (await buscarTipoInstituicao()) || (await buscarTipoProfessor());
      if (!tipoEncontrado) {
        throw new Error("Usuário não encontrado em nenhuma das coleções.");
      }
    } catch (error) {
      console.error("Erro ao obter status:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      buscarDadosTipoUser(user.uid);
    }
  }, [user, buscarDadosTipoUser]);

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

  const buscarTurmasPorInstituicao = (institutionId: string) => {
    const turmasRef = collection(db, "institutions", institutionId, "classes");

    return onSnapshot(turmasRef, (snapshot) => {
      const dadosTurmas = snapshot.docs.map((doc) => ({
        nameClass: doc.data().nameClass,
        uid: doc.id,
        maxStudent: doc.data().maxStudent,
      }));

      // Ordenar se necessário
      dadosTurmas.sort((a, b) => parseInt(a.nameClass) - parseInt(b.nameClass));
      setClasses(dadosTurmas);
    });
  };

  useEffect(() => {
    if (uidContextInstitution === user?.uid) {
      buscarTurmasPorInstituicao(uidContextInstitution);
    }
  }, [buscarTurmasPorInstituicao, uidContextInstitution]);

  const buscarTurmasParaProfessores = async (institutionId: string) => {
    const turmasRef = doc(db, "teachers", institutionId);

    try {
      const docSnap = await getDoc(turmasRef);
      if (docSnap.exists()) {
        const classes = docSnap.data().classes;
        const classesArray = Array.isArray(classes) ? classes : [];

        // Transformar todas as classes em objetos com nameClass, uid e maxStudents
        const classesObjetos = classesArray.map((classe) => {
          const [nameClass, uid, maxStudent] = classe.split(" "); // Dividindo a string em partes
          return {
            nameClass: nameClass, // O primeiro elemento
            uid: uid, // O segundo elemento
            maxStudent: parseInt(maxStudent), // O terceiro elemento convertido para número
          };
        });

        setClassesTeachers(classesObjetos); // Exibindo o resultado como objetos

        return classesObjetos; // Retornando o novo array de objetos
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
      buscarTurmasParaProfessores(uidContextGeral);
    }
  }, [buscarTurmasParaProfessores, uidContextGeral, uidContextTeacher]);

  const cadastroTurmas = async (data: FormDataClass) => {
    try {
      if (!userUid) {
        throw new Error("ID da instituição não encontrado.");
      }
      const uidTurma: string = uuidV4();

      const dadosRefTurmas = collection(
        db,
        "institutions",
        uidContextInstitution,
        "classes"
      );

      await addDoc(dadosRefTurmas, {
        nameClass: data.nameClass,
        maxStudent: data.maxStudent,
        uid: uidTurma,
      });
      reset();
    } catch (error) {
      console.error("Erro ao adicionar turma:", error);
    }
  };

  const deleteTurma = useCallback(
    async (uid: string) => {
      try {
        const turmaRef = doc(
          db,
          "institutions",
          uidContextInstitution,
          "classes",
          uid
        );
        await deleteDoc(turmaRef);
      } catch (error) {
        console.error("Erro ao excluir documento:", error);
      }
    },
    [userUid]
  );

  const logout = useCallback(async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }, [auth]);

  const salvarUidProfessor = async () => {
    try {
      if (!user?.uid) {
        throw new Error("User não encontrado.");
      }

      const dadosRefTeacher = collection(
        db,
        "institutions",
        uidContextInstitution,
        "uidTeachers"
      );

      await addDoc(dadosRefTeacher, {
        uid: uidContextTeacher,
      });

      console.log("Uid Salvo");
    } catch (error) {
      console.error("Erro ao adicionar uid:", error);
    }
  };

  const cadastroProfessor = async (data: FormDataRegisterTeachers) => {
    setLoading(true);

    try {
      const autentificacaoUsuario = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const dadostUsuario = autentificacaoUsuario.user;
      setUidContextTeacher(dadostUsuario?.uid);
      await updateProfile(dadostUsuario, {
        displayName: data.name,
      });

      salvarUidProfessor();
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

  const mudancaArquivo = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      if (
        image.type === "image/jpeg" ||
        image.type === "image/png" ||
        "image/webp"
      ) {
        uploadImagem(image);
        setTimeout(() => {
          toast.success("Upload Realizado!");
        }, 1500);
      } else {
        toast.error("Formato de imagem inválido... Apenas JPEG ou PNG ou Webp");
        return;
      }
    }
  };

  const uploadImagem = (image: File) => {
    if (!user?.uid) {
      toast.error("Você precisa estar logado para fazer essa ação!");
      return;
    }

    const uidLogado = user?.uid;
    const uidImagem = uuidV4();

    const uploadRef = ref(storage, `imagens/${uidLogado}/${uidImagem}`);

    uploadBytes(uploadRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        const imagem = {
          uid: uidLogado,
          id: user?.uid,
          name: uidImagem,
          previewUrl: URL.createObjectURL(image),
          url: downloadURL,
        };
        setIsImagens((imagens) => [...imagens, imagem]);
      });
    });
  };

  const pegarImagens = useCallback(() => {
    const imagesRef = ref(storage, `imagens/${uidContextGeral}`);

    listAll(imagesRef)
      .then(async (resultado) => {
        const urls = await Promise.all(
          resultado.items.map(async (item) => {
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

  const deletarImagem = useCallback(
    async (imagem: ImagensEventosProps) => {
      const imagemStorage = `imagens/${user?.uid}/${imagem.name}`;
      const storageRefImagem = ref(storage, imagemStorage);

      try {
        await deleteObject(storageRefImagem);
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
    pegarImagens();
  }, [pegarImagens]);

  return (
    <main className="max-h-full">
      {isUser === true && (
        <>
          <section>
            <TitleBar
              title="Dashboard"
              message="Seja Bem-vindo, Professor(a)"
              user={user.displayName}
              onClose={() => {
                logout();
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
                    <span className="text-greenEdu text-3xl font-bold">38</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </>
      )}

      {isAdmin === true && (
        <>
          <section>
            <TitleBar
              title="Dashboard"
              message="Seja Bem-vindo, "
              user={user.displayName}
              onClose={() => {
                logout();
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
                              deleteTurma(classInfo.uid);
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
                      onSubmit={handleSubmitClass(cadastroTurmas)}
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
                      <div className="border-2 border-greenEdu xl:w-48 w-32"></div>
                      <button
                        className="px-8 py-2 font-bold opacity-55"
                        type="submit"
                      >
                        Adicionar
                      </button>
                    </form>
                  </div>
                </section>
              </aside>

              {/* <News
                images={"imagens de noticias e eventos"}
                swipper={"opcoes de troca swipper"}
              /> */}
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
                            deletarImagem(image);
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
                  <FiUpload
                    size={30}
                    color="rgb(93 239 213)"
                    className="absolute"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="opacity-0 w-72  -ml-40 h-full cursor-pointer"
                    onChange={mudancaArquivo}
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
                    <span className="text-greenEdu text-3xl font-bold">38</span>
                  </div>
                </div>
                <div className="border-greenEdu w-85 xl:absolute xl:w-85 xl:h-72 xl:mt-72 mt-40 border-2 rounded-b-xl pb-10 ">
                  <h2 className="flex justify-center items-center h-9 bg-greenEdu sticky top-0 text-whiteEdu font-medium text-xl">
                    Novo Professor(a)
                  </h2>
                  <div className="flex justify-center items-center p-2 ">
                    <form
                      onSubmit={handleSubmit(cadastroProfessor)}
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
                      <Button disabled={loading}>
                        {loading ? "Cadastrando..." : "Cadastrar-se"}
                      </Button>
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
