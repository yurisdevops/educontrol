import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../Components/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { auth, db } from "../../../services/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { LoginForm } from "../../../Components/LoginForm";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "Deve conter no mínimo 6 caracteres"),
});

type FormDataLoginInstitution = z.infer<typeof loginSchema>;

export function LoginInstitution() {
  const navigate = useNavigate();
  const { setUidContextInstitution } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userUidInstitution, setUserUidInstitution] = useState<string | any>(
    ""
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLoginInstitution>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  useEffect(() => {
    setUidContextInstitution(userUidInstitution);
  }, [userUidInstitution]);

  const handleNavigation = async (uid: string) => {
    try {
      const userDocRefTeachers = doc(db, "teachers", uid);
      const userDocRefInstitution = doc(db, "institutions", uid);

      const [userDocTeachers, userDocInstitution] = await Promise.all([
        getDoc(userDocRefTeachers),
        getDoc(userDocRefInstitution),
      ]);

      // Verifica se o documento do professor ou da instituição existe
      if (userDocTeachers.exists() || userDocInstitution.exists()) {
        if (userDocInstitution.exists()) {
          toast.success("Logado com sucesso");
          navigate("/dashboard", { replace: true });
        } else {
          toast.error("Erro ao logar");
          navigate("/loginTeacher", { replace: true });
        }
      } else {
        navigate("/profileInstitution", { replace: true });
      }
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      toast.error("Ocorreu um erro ao tentar logar. Tente novamente.");
    }
  };

  const onSubmit = async (data: FormDataLoginInstitution) => {
    setLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      setUserUidInstitution(user.uid);
      await handleNavigation(user.uid);
    } catch (error) {
      toast.error(
        "Erro ao fazer login. Verifique suas credenciais e tente novamente."
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="2xl:h-screen w-full flex flex-col-reverse xl:flex-row 2xl:flex-row">
      <div className="xl:w-2/3 2xl:w-2/3 h-screen bg-greenEdu flex flex-col items-center justify-center text-whiteEdu gap-4">
        <h1 className="font-bold font-sans text-3xl 2xl:text-5xl">
          Ainda não tem acesso?
        </h1>
        <span className="max-w-80 2xl:max-w-lg 2xl:text-2xl ml-7">
          "É ótimo ter você conosco aqui no Educontrol! Faça seu cadastro e
          aproveite todas as ferramentas e recursos disponíveis para enriquecer
          sua experiência de aprendizado."
        </span>
        <Link
          to="/registerInstitution"
          className="border-2 bg-whiteEdu text-greenEdu p-1 px-6 w-48 rounded-md xl:text-xl 2xl:text-2xl text-center font-bold mt-5 hover:opacity-90"
        >
          Cadastre-se
        </Link>
      </div>
      <div className="xl:w-full 2xl:w-full h-screen 2xl:bg-whiteEdu flex flex-col justify-center items-center gap-6">
      <h1 className="text-greenEdu font-bold ml-10 text-4xl 2xl:text-5xl drop-shadow-2xl">
      Acesse sua conta Instituição
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 items-center"
        >
          <LoginForm register={register} errors={errors} />
          <Button disabled={loading}>
            {loading ? "Entrando..." : "Entre"}
          </Button>{" "}
          {/* Botão com feedback de carregamento */}
        </form>
      </div>
    </main>
  );
}
