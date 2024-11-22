import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import { Input } from "../../../Components/Input";
import { Button } from "../../../Components/Button";
import { Select } from "../../../Components/Select";
import { TitleBar } from "../../../Components/TitleBar";
import { useAuth } from "../../../Context/AuthContext";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  surname: z.string().min(1, "Sobrenome é obrigatório"),
  gender: z.string().min(1, "Sexo é obrigatório"),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(1, "O campo telefone é obrigatório"),
  registration: z.string().min(1, "CNE é obrigatória"),

  placeOfBirth: z.string().min(1, "Naturalidade é obrigatória"),
  cep: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  discipline: z.string().min(1, "Disciplina é obrigatória"),
});

export type FormDataProfileInformation = z.infer<typeof profileSchema>;

interface UidProps {
  uid: string | any;
}

export function ProfileInformation() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uidTeacher, setUidTeacher] = useState<UidProps[] | any>([]);
  const [teachersData, setTeachersData] = useState<
    Array<{
      uid: string;
      name: string;
    }>
  >([]);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const navigate = useNavigate();
  const { uidContextGeral } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormDataProfileInformation>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  const searchUidTeachers = async () => {
    try {
      setLoading(true);

      if (!uidContextGeral) {
        throw new Error("O uidContextGeral não está definido.");
      }

      const uidTeachersRef = collection(
        db,
        "institutions",
        uidContextGeral,
        "uidTeachers"
      );

      const snapshot = await getDocs(uidTeachersRef);

      const dadosUidTeachers = snapshot.docs.map((doc) => {
        return {
          uid: doc.data().uid, // Usar doc.id para obter o ID do documento
        };
      });

      setUidTeacher(dadosUidTeachers);
    } catch (error) {
      console.error("Erro ao buscar UIDs dos professores:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    searchUidTeachers();
  }, [uidContextGeral]);

  const searchDocsProfiles = async () => {
    try {
      const teachersPromisesData = uidTeacher.map(
        async (teacher: { uid: string }) => {
          const teachersRefData = doc(db, "teachers", teacher.uid);
          const teacherDoc = await getDoc(teachersRefData);

          if (teacherDoc.exists()) {
            return { uid: teacher.uid, ...teacherDoc.data() };
          } else {
            console.warn(
              `Documento do professor com UID ${teacher.uid} não encontrado`
            );
          }
        }
      );

      const teachersData = await Promise.all(teachersPromisesData);

      const validTeachers = teachersData.filter((teacher) => teacher);

      setTeachersData(validTeachers);
    } catch (error) {
      console.error("Erro ao buscar dados dos professores:", error);
    }
  };

  useEffect(() => {
    if (uidTeacher.length > 0) {
      searchDocsProfiles();
    }
  }, [uidTeacher]);

  const handleTeacherSelect = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsEditing(true);

    for (const key in teacher) {
      setValue(key as keyof FormDataProfileInformation, teacher[key]);
    }
  };

  const onSubmit = async (data: FormDataProfileInformation) => {
    try {
      const teacherDocRef = doc(db, "teachers", selectedTeacher.uid);

      await updateDoc(teacherDocRef, data);
      toast.success("Perfil Atualizado!");
      setIsEditing(false);
      setSelectedTeacher(null);
      reset();
    } catch (error: any) {
      console.error("Erro ao atualizar o perfil:", error);
      alert(
        "Erro ao atualizar o perfil: " +
          (error.message ? error.message : JSON.stringify(error))
      );
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <main>
      <TitleBar
        title="Perfil"
        message=""
        user=""
        onClose={() => {
          navigate("/dashboard");
        }}
        onProfile={() => {}}
        nameButton="Voltar"
        icon={""}
      />

      <section className="max-h-full w-full flex flex-col items-center justify-center mt-10">
        <div className="-mb-10 mt-7 -ml-96 border px-4 border-greenEdu rounded-full font-medium text-greenEdu">
          <label className="mr-3 hover:bg-whiteEdu" htmlFor="teacherSelect">
            Professores:
          </label>
          <select
            className=" text-blackEdu"
            id="teacherSelect"
            onChange={(e) => {
              const selectedTeacher = teachersData.find(
                (teacher) => teacher.uid === e.target.value
              );
              if (selectedTeacher) {
                handleTeacherSelect(selectedTeacher);
              }
            }}
            disabled={loading}
          >
            <option value="">Selecione um professor</option>
            {!loading ? (
              teachersData.map((teacher: any) => (
                <option key={teacher.uid} value={teacher.uid}>
                  {teacher.name} {teacher.surname}
                </option>
              ))
            ) : (
              <option disabled>Carregando professores...</option>
            )}
          </select>
        </div>
        <button
          className="-mb-10 mt-5 ml-100 border px-4 border-greenEdu rounded-md font-medium text-whiteEdu bg-greenEdu hover:opacity-90 "
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancelar" : "Editar"}
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col mt-28 items-center gap-4 px-4 py-5"
        >
          <div className="w-full flex flex-col -mt-2 xl:flex-row xl:gap-4">
            <div className="flex-1">
              <label htmlFor="name" className="ml-1 text-sm">
                NOME:
              </label>
              <Input
                type="text"
                placeholder="ex: Luis Henrique"
                name="name"
                error={errors.name?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="surname" className="ml-1 text-sm">
                SOBRENOME:
              </label>
              <Input
                type="text"
                placeholder="ex: Almeida Campos"
                name="surname"
                error={errors.surname?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row xl:gap-4">
            <div className="flex-1">
              <label htmlFor="gender" className="ml-1 text-sm">
                SEXO:
              </label>
              <Select name="gender" register={register} disabled={!isEditing}>
                <option value="" disabled selected>
                  Selecione uma opção
                </option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </Select>
            </div>
            <div className="flex-1">
              <label htmlFor="birthdate" className="ml-1 text-sm">
                DATA DE NASCIMENTO:
              </label>
              <Input
                type="date"
                placeholder="ex: 23/12/1994"
                name="birthdate"
                error={errors.birthdate?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row xl:gap-4">
            <div className="flex-1">
              <label htmlFor="email" className="ml-1 text-sm">
                E-MAIL:
              </label>
              <Input
                type="email"
                placeholder="ex: gustavo@live.com"
                name="email"
                error={errors.email?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="phone" className="ml-1 text-sm">
                TELEFONE:
              </label>
              <Input
                type="tel"
                placeholder="ex: (21) 99035-2415"
                name="phone"
                error={errors.phone?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row xl:gap-4">
            <div className="flex-1">
              <label htmlFor="registration" className="ml-1 text-sm">
                Nº CNE:
              </label>
              <Input
                type="text"
                placeholder="ex: 2024567890"
                name="registration"
                error={errors.registration?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="placeOfBirth" className="ml-1 text-sm">
                NATURALIDADE:
              </label>
              <Input
                type="text"
                placeholder="ex: Rio de Janeiro"
                name="placeOfBirth"
                error={errors.placeOfBirth?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row xl:gap-4">
            <div className="flex-1">
              <label htmlFor="cep" className="ml-1 text-sm">
                CEP:
              </label>
              <Input
                type="text"
                placeholder="ex: 23066-070"
                name="cep"
                error={errors.cep?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="street" className="ml-1 text-sm">
                RUA:
              </label>
              <Input
                type="text"
                placeholder="ex: Rua Cabo Saulo de Vasconcelos"
                name="street"
                error={errors.street?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
          </div>

          <div className="w-full flex flex-col xl:flex-row xl:gap-4">
            <div className="flex-1">
              <label htmlFor="number" className="ml-1 text-sm">
                NÚMERO:
              </label>
              <Input
                type="text"
                placeholder="ex: 639"
                name="number"
                error={errors.number?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="complement" className="ml-1 text-sm">
                COMPLEMENTO:
              </label>
              <Input
                type="text"
                placeholder="ex: BL04 APTO 509"
                name="complement"
                error={errors.complement?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="class" className="ml-1 text-sm">
                DISCIPLINA:
              </label>
              <Input
                type="text"
                placeholder="ex: Ed. Física"
                name="discipline"
                error={errors.discipline?.message}
                register={register}
                disable={!isEditing}
              />
            </div>
          </div>

          {isEditing && <Button>Salvar</Button>}
        </form>
      </section>
    </main>
  );
}
