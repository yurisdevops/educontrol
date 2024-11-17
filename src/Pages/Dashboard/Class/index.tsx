import { useCallback, useEffect, useState } from "react";
import { Container } from "../../../Components/Container";
import { HeaderForm } from "../../../Components/HeaderForm";

import { TitleBar } from "../../../Components/TitleBar";
import { CalendarDisplay } from "../../../Widgets/Calendar";

import { useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StudentForm } from "../../../Components/StudentForm";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";

import { v4 as uuidV4 } from "uuid";

import { useAuth } from "../../../Context/AuthContext";

const studentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  surname: z.string().min(1, "Sobrenome é obrigatório"),
  gender: z.string().min(1, "Sexo é obrigatório"),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
});

type StudentFormClass = z.infer<typeof studentSchema>;

export function Class() {
  const [newStudent, setNewStudent] = useState(false);
  const [classUid, setClassUid] = useState("");
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const { user, uidContextInstitution, uidContextGeral } = useAuth();
  const navigate = useNavigate();
  const { uid }: string | any = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormClass>({
    resolver: zodResolver(studentSchema),
    mode: "onChange",
  });

  const toggleNewStudent = () => {
    setNewStudent(!newStudent);
  };

  const back = () => {
    navigate("/dashboard");
  };

  const searchClassesByInstitution = useCallback(
    async (institutionId: string) => {
      try {
        const classesRefData = collection(
          db,
          "institutions",
          institutionId,
          "classes"
        );

        const classesInfo: any[] = [];
        const snapshotClasses = await getDocs(classesRefData);

        snapshotClasses.forEach((doc) => {
          const data = doc.data();

          const classInfo = {
            nameClass: data.nameClass,
            uid: doc.id,
          };

          classesInfo.push(classInfo);
        });

        const selectedClass = classesInfo.find((cls) => cls.uid === uid);
        if (selectedClass) {
          setClassUid(selectedClass.uid);
          setClassName(selectedClass.nameClass);
        } else {
          console.log("Classe não encontrada!");
        }
      } catch (error) {
        console.error("Erro ao obter nomes das turmas:", error);
      }
    },
    []
  );

  useEffect(() => {
    searchClassesByInstitution(uidContextGeral);
  }, [searchClassesByInstitution, uidContextGeral]);

  const addStudentToClass = useCallback(
    async (data: StudentFormClass) => {
      try {
        if (!uidContextInstitution || !classUid) {
          console.error("UID do contexto ou UID da classe não encontrado!");
          return;
        }

        const studentUid: string = uuidV4();

        const institutionDocRef = doc(
          db,
          "institutions",
          uidContextInstitution
        );
        const classDocRef = doc(institutionDocRef, "classes", classUid);
        const studentsCollectionRef = collection(classDocRef, "students");

        const dataSave = { ...data, uid: studentUid };
        console.log("Dados a serem salvos:", dataSave);

        await addDoc(studentsCollectionRef, dataSave);
        console.log("Aluno adicionado com sucesso!");

        setNewStudent(false);
        reset();
      } catch (error) {
        console.error("Erro ao adicionar aluno à turma:", error);
      }
    },
    [classUid, uidContextInstitution, reset]
  );

  const searchStudents = useCallback(
    async (uidGeral: string) => {
      try {
        const dataStudentsRef = collection(
          db,
          "institutions",
          uidGeral,
          "classes",
          uid,
          "students"
        );

        const accessDataStudents = await getDocs(dataStudentsRef);

        if (!accessDataStudents.empty) {
          const dadosAlunos: { id: string }[] = [];
          accessDataStudents.forEach((doc) => {
            dadosAlunos.push({ id: doc.id, ...doc.data() });
          });
          setStudents(dadosAlunos);
        }
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    },
    [uidContextInstitution, uid]
  );

  useEffect(() => {
    searchStudents(user?.uid);
  }, [searchStudents, user?.uid, uid]);

  return (
    <main className="h-full">
      <TitleBar
        title={"Turma"}
        user={className}
        onClose={back}
        nameButton={"Voltar"}
        message={""}
        icon={undefined}
      />

      <Container>
        <section className="mt-5 flex flex-col-reverse xl:flex-row xl:gap-40">
          <aside className="border-greenEdu border-2 h-128 w-300 rounded-b-2xl -mr-16 mt-10 xl:mt-0">
            <HeaderForm>Alunos</HeaderForm>
            <div className="w-full h-72 flex justify-center">
              <table className="mt-4 ">
                <thead>
                  <tr className="bg-greenEdu text-whiteEdu">
                    <th className="w-96 border border-b-0 border-t-0 border-l-0 border-r-whiteEdu">
                      Nome
                    </th>
                    <th className="w-32 border border-b-0 border-t-0 border-l-0 border-r-whiteEdu">
                      Presença
                    </th>
                    <th className="w-20 border border-b-0 border-t-0 border-l-0 border-r-whiteEdu">
                      Falta
                    </th>
                    <th className="w-32">Justificativa</th>
                  </tr>
                </thead>
                <tbody className="border border-greenEdu  ">
                  {students.map((name, index) => (
                    <tr
                      key={index}
                      className="border border-greenEdu text-center text-xs"
                    >
                      <td className="border border-greenEdu">
                        {name.name} {name.surname}
                      </td>
                      <td className="border border-greenEdu">Presente</td>
                      <td className="border border-greenEdu">0</td>
                      <td className="border border-greenEdu">Justificativa</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </aside>

          <aside className="w-96 flex flex-col items-center ">
            <CalendarDisplay />

            <div className="border-2 border-greenEdu rounded-b-xl w-full absolute xl:w-85 xl:h-32 mt-32 xl:mt-44">
              <HeaderForm>Chamada</HeaderForm>
              <div className="flex justify-center items-center p-2 mt-4">
                <button className="border-2 border-greenEdu p-2 px-24 rounded-md text-greenEdu font-bold text-lg">
                  Iniciar
                </button>
              </div>
            </div>

            <div className="border-2 border-greenEdu rounded-b-xl w-full absolute xl:w-85 xl:h-32 mt-32 xl:mt-96">
              <HeaderForm>Novo Aluno</HeaderForm>
              <div className="flex justify-center items-center p-2 mt-4">
                <button
                  onClick={toggleNewStudent}
                  className="border-2 border-greenEdu p-2 px-24 rounded-md text-greenEdu font-bold text-lg"
                >
                  Adicionar
                </button>
              </div>
            </div>

            {newStudent && (
              <div className="w-128 z-10 border-4 rounded-2xl bg-whiteEdu border-greenEdu h-80 -ml-128">
                <div className="px-4 py-2 flex justify-end font-bold hover:text-greenEdu cursor-pointer">
                  <button onClick={() => setNewStudent(!newStudent)}>X</button>
                </div>
                <form
                  onSubmit={handleSubmit(addStudentToClass)}
                  className="flex flex-col items-center gap-4 px-4 py-2"
                >
                  <StudentForm register={register} errors={errors} />
                </form>
              </div>
            )}
          </aside>
        </section>
      </Container>
    </main>
  );
}
