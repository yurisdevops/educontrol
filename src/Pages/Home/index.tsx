import HomeIMG from "../../Images/home.png";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <main className="w-full h-screen bg-greenEdu flex items-center">
      <img
        className="2xl:max-w-3xl xl:max-w-lg max-w-0 rotate-12 pt-12 pl-4"
        src={HomeIMG}
        alt="Home"
      />
      <div className="text-white text-whiteEdu flex flex-col gap-10 justify-center items-center 2xl:pl-60 2xl:-mt-32 xl:pl-36 xl:mt-16">
        <h1 className="-ml-3 text-6xl mt-52 xl:mt-20 xl:text-9xl font-sans font-bold drop-shadow-xl">
          EduControl
        </h1>
        <span className="w-3/4 xl:max-w-lg xl:-ml-32 text-lg xl:text-3xl opacity-70">
          O Educontrol é uma aplicação desenvolvida para facilitar o controle de
          alunos, turmas e pendências acadêmicas de forma eficiente para
          professores e instituições de ensino.
        </span>
        <div className="flex gap-3 -ml-3 xl:-ml-24 font-bold text-center">
          <Link
            className="border-2 p-1 px-6 w-52 rounded-3xl text-xl hover:bg-whiteEdu hover:text-greenEdu"
            to="/loginTeacher"
          >
            Sou Professor(a)
          </Link>
          <span className="text-lg">ou</span>
          <Link
            className="border-2 p-1 px-6 w-52 rounded-3xl text-xl hover:bg-whiteEdu hover:text-greenEdu"
            to="/loginInstitution"
          >
            Sou Instituição
          </Link>
        </div>
      </div>
    </main>
  );
}
