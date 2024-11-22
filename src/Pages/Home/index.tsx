import HomeIMG from "../../Images/home.png";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="w-full h-screen bg-whiteEdu flex items-center pl-48  ">
      <img
        className="2xl:max-w-3xl xl:max-w-lg w-100 rotate-12 pl-10 drop-shadow-2xl"
        src={HomeIMG}
        alt="Home"
      />
      <div className="text-white text-greenEdu flex flex-col gap-10 w-5/6 justify-center items-center -ml-48 2xl:pl-60 2xl:-mt-32 xl:pl-36 xl:mt-16">
        <h1 className="-ml-7 text-5xl mt-52 xl:mt-20 xl:text-8xl font-sans font-bold drop-shadow-xl">
          EduControl
        </h1>
        <span className=" xl:max-w-lg text-blackEdu text-lg xl:text-3xl opacity-70">
          O <strong>Educontrol</strong> é uma aplicação desenvolvida para
          facilitar o controle de alunos, turmas e pendências acadêmicas de
          forma eficiente para professores e instituições de ensino.
        </span>
        <div className="flex gap-24 font-bold text-center">
          <Link
            className="border-2 p-1 px-6 w-52 rounded-md text-xl text-whiteEdu bg-greenEdu"
            to="/loginInstitution"
          >
            Sou Instituição
          </Link>
          <Link
            className="border-2 p-1 px-6 w-52 rounded-md text-xl text-whiteEdu bg-greenEdu"
            to="/loginTeacher"
          >
            Sou Professor
          </Link>
        </div>
      </div>
    </main>
  );
}
