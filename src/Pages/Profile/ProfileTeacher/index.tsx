import { Button } from "../../../Components/Button";
import { TitleBar } from "../../../Components/TitleBar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { db } from "../../../services/firebaseConnection";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

import { AdressForm } from "../../../Components/AdressForm";
import { TeacherForm } from "../../../Components/TeacherForm";
import { useEffect, useState } from "react";

import { Checkbox } from "../../../Components/Checkbox";

const validarCPF = (cpf: any | string[]) => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, "");

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Checa se todos os dígitos são iguais (ex.: 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) return false;

  // Validação dos dígitos verificadores
  const calcularDígito = (cpf: string[], posicao: number) => {
    let soma = 0;
    let peso = posicao + 1;

    for (let i = 0; i < posicao; i++) {
      soma += parseInt(cpf[i]) * peso;
      peso--;
    }

    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDígito = calcularDígito(cpf, 9);
  const segundoDígito = calcularDígito(cpf, 10);

  return (
    parseInt(cpf[9], 10) === primeiroDígito &&
    parseInt(cpf[10], 10) === segundoDígito
  );
};

// Definindo o Schema de validação
const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  surname: z.string().min(1, "Sobrenome é obrigatório"),
  gender: z.string().min(1, "Sexo é obrigatório"),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
  email: z.string().email("E-mail inválido"),
  phone: z
    .string()
    .min(1, "O campo telefone é obrigatório")
    .refine(
      (value) => {
        const cleaned = value.replace(/\D/g, ""); // Remove tudo que não for número
        return /^\d{11,12}$/.test(cleaned);
      },
      {
        message: "Número de telefone inválido.",
      }
    ),
  cpf: z.string().refine(validarCPF, {
    message: "CPF inválido",
  }),
  registration: z.string().min(1, "Registro Nacional é obrigatório"),
  instituionName: z.string().min(1, "Instituição é obrigatório"),
  placeOfBirth: z.string().min(1, "Naturalidade é obrigatória"),
  cep: z.string().min(1, "CEP é obrigatório"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  discipline: z.string().min(1, "Disciplina é obrigatória"),
  classes: z.array(z.string()).min(1, "Selecione ao menos uma turma"),
});

export type FormDataProfileTeachers = z.infer<typeof profileSchema>;

export function ProfileTeacher() {
  const navigate = useNavigate();
  const {
    user,
    uidContextGeral,
    uidContextTeacher,
    logout,
    dataTeacherinInstitutions,
  } = useAuth();
  const [institutionName, setInstitutionName] = useState<string | null>(null);
  const [classes, setClasses] = useState<
    Array<{ nameClass: string; uid: string; maxStudent: number }>
  >([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]); // Estado para as classes selecionadas

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProfileTeachers>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormDataProfileTeachers) => {
    if (uidContextTeacher) {
      const dataToSave = {
        ...data,
        userTypeNormal: true,
        uidInstitution: uidContextGeral,
      };
      try {
        console.log("Dados a serem salvos:", dataToSave);
        const teachersRef = collection(db, "teachers");
        await setDoc(doc(teachersRef, uidContextTeacher), dataToSave);

        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Erro ao salvar dados do perfil:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout;
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro ao sair:", err);
    }
  };

  const getDataInstitution = async (institutionId: string) => {
    try {
      const institutionRefData = doc(db, "institutions", institutionId);
      const snapshotInstitution = await getDoc(institutionRefData);
      if (snapshotInstitution.exists()) {
        setInstitutionName(snapshotInstitution.data()?.name || null);
      }
    } catch (error) {
      console.error("Erro ao obter dados da instituição:", error);
    }
  };

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

  useEffect(() => {
    dataTeacherinInstitutions(uidContextGeral);
  }, []);

  const handleClassesChange = (uid: string) => {
    setSelectedClasses((prev) => {
      if (prev.includes(uid)) {
        // Remove a classe se já estiver selecionada
        return prev.filter((currentUid) => currentUid !== uid);
      } else {
        // Adiciona a classe se não estiver selecionada
        return [...prev, uid];
      }
    });
  };

  useEffect(() => {
    searchClassesByInstitution(uidContextGeral);
    return () => {
      searchClassesByInstitution(uidContextGeral);
    };
  }, [uidContextGeral]);

  useEffect(() => {
    if (uidContextGeral) {
      getDataInstitution(uidContextGeral);
    }
  }, [getDataInstitution, uidContextGeral]);

  return (
    <main>
      <TitleBar
        title="Perfil"
        message="Complete o seu cadastro"
        onClose={handleLogout}
        onProfile={() => {}}
        nameButton="Sair"
        icon={""}
        user={""}
      />

      <section className="flex flex-col xl:flex justify-center items-center pb-10 xl:pb-0">
        <div className="mt-8 w-85 xl:w-5/6 border-2 rounded-3xl border-greenEdu max-h-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-1 px-4 py-5"
          >
            <div className="w-full">
              <TeacherForm
                user={user}
                errors={errors}
                register={register}
                value={institutionName}
              />
            </div>

            <div className="w-full">
              <AdressForm register={register} errors={errors} />
            </div>

            <div className="flex-col">
              <div>
                {" "}
                <label htmlFor="classes" className="ml-1 text-base">
                  TURMAS:
                </label>
              </div>
              <div className="flex w-full gap-5">
                {classes.map((classItem) => (
                  <div
                    key={classItem.uid}
                    className="flex flex-col items-center font-medium"
                  >
                    <div>{classItem.nameClass}</div>
                    <label>
                      <Checkbox
                        type="checkbox"
                        name="classes"
                        value={`${classItem.nameClass} ${classItem.uid} ${classItem.maxStudent}`}
                        register={register}
                        checked={selectedClasses.includes(classItem.uid)}
                        onChange={() => handleClassesChange(classItem.uid)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Button>Enviar</Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
