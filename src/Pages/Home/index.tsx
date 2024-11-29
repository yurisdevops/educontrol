import { useEffect } from "react";
import HomeIMG from "../../Images/home.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export function Home() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);
  return (
    <main className="w-full h-screen bg-greenEdu flex flex-col xl:flex-row 2xl:flex-row xl:gap-40 items-center 2xl:pl-48 py-20 ">
      <img
        className="w-44 xl:w-96 2xl:w-100 rotate-12 2xl:pl-4 2xl:ml-10 xl:ml-44 2xl:-mr-10 drop-shadow-2xl "
        src={HomeIMG}
        alt="Home"
      />
      <div className="text-white text-whiteEdu flex flex-col gap-10 2xl:w-5/6 justify-center items-center -mt-24 2xl:-ml-48 2xl:pl-60 2xl:-mt-32 xl:pl-10 xl:-mt-52">
        <h1 className="2xl:-ml-7 text-3xl mt-52 2xl:mt-20 2xl:text-8xl font-sans font-bold drop-shadow-2xl">
          EduControl
        </h1>
        <span className="max-w-80 2xl:max-w-lg text-whiteEdu text-lg 2xl:text-3xl">
          O <strong>Educontrol</strong> é uma aplicação desenvolvida para
          facilitar o controle de alunos, turmas e pendências acadêmicas de
          forma eficiente para professores e instituições de ensino.
        </span>
        <div className="flex 2xl:gap-24 gap-6 font-bold text-center">
          <Link
            className="flex justify-center items-center border-2 p-1 px-6 2xl:w-52 w-32 rounded-md 2xl:text-2xl text-xs text-greenEdu bg-whiteEdu"
            to="/loginInstitution"
          >
            Instituição
          </Link>
          <Link
            className="flex justify-center items-center border-2 p-1 px-6 2xl:w-52 w-32 rounded-md 2xl:text-2xl text-xs text-greenEdu bg-whiteEdu"
            to="/loginTeacher"
          >
            Professor
          </Link>
        </div>
      </div>
    </main>
  );
}
