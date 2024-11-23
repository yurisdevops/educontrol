import HomeIMG from "../../Images/home.png";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="w-full h-screen xl:bg-greenEdu flex flex-col xl:flex-row items-center xl:pl-48 py-20 ">
      <img
        className=" xl:w-100 w-44  rotate-12 xl:pl-4 xl:ml-10 xl:-mr-10 drop-shadow-2xl "
        src={HomeIMG}
        alt="Home"
      />
      <div className="text-white text-whiteEdu flex flex-col gap-10 xl:w-5/6 justify-center items-center -mt-24 xl:-ml-48 2xl:pl-60 2xl:-mt-32 xl:pl-36 xl:mt-16">
        <h1 className="xl:-ml-7 text-3xl mt-52 xl:mt-20 xl:text-8xl font-sans font-bold drop-shadow-xl">
          EduControl
        </h1>
        <span className="max-w-80 xl:max-w-lg text-whiteEdu text-lg xl:text-3xl">
          O <strong>Educontrol</strong> é uma aplicação desenvolvida para
          facilitar o controle de alunos, turmas e pendências acadêmicas de
          forma eficiente para professores e instituições de ensino.
        </span>
        <div className="flex xl:gap-24 gap-6 font-bold text-center">
          <Link
            className="border-2 p-1 px-6 xl:w-52 w-32 rounded-md xl:text-xl text-xs text-greenEdu bg-whiteEdu"
            to="/loginInstitution"
          >
            Sou Instituição
          </Link>
          <Link
            className="border-2 p-1 px-6 xl:w-52 w-32 rounded-md xl:text-xl text-xs text-greenEdu bg-whiteEdu"
            to="/loginTeacher"
          >
            Sou Professor
          </Link>
        </div>
      </div>
    </main>
  );
}
