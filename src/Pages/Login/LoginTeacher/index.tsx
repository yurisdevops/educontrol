import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../../Components/Input";
import { Button } from "../../../Components/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { auth, db } from "../../../services/firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../Context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "Deve conter no mínimo 6 caracteres"),
});

type FormDataLoginTeachers = z.infer<typeof loginSchema>;

export function LoginTeacher() {
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading feedback
  const { setUidContextTeacher } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLoginTeachers>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const handleNavigation = async (uid: string) => {
    const userDocRefTeachers = doc(db, "teachers", uid);
    const userDocRefInstitution = doc(db, "institutions", uid);

    const [userDocTeachers, userDocInstitution] = await Promise.all([
      getDoc(userDocRefTeachers),
      getDoc(userDocRefInstitution),
    ]);

    if (userDocTeachers.exists() || userDocInstitution.exists()) {
      setTimeout(() => {
        // navigate(
        //   userDocTeachers.exists() ? "/dashboard" : "/loginInstitution",
        //   {
        //     replace: true,
        //   }
        // );
        if (userDocTeachers.exists()) {
          navigate("/dashboard", { replace: true });
          toast.success("Logado com sucesso");
        } else {
          navigate("/loginInstitution", { replace: true });
          toast.error("Erro ao logar");
        }
      }, 1500);
    } else {
      navigate("/profileTeacher", { replace: true });
    }
  };

  const onSubmit = async (data: FormDataLoginTeachers) => {
    setLoading(true); // Set loading to true

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      setUidContextTeacher(user.uid);
      await handleNavigation(user.uid);
    } catch (error) {
      setErrorMessage(
        "Erro ao fazer login. Verifique suas credenciais e tente novamente."
      );
      console.error("Login error:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <main className="h-screen w-full flex flex-col xl:flex-row">
      <div className="xl:w-2/3 bg-greenEdu flex flex-col items-center justify-center text-whiteEdu gap-4">
        <h1 className="font-bold font-sans text-3xl xl:text-5xl">
          Ainda não tem acesso?
        </h1>
        <span className="max-w-80 xl:max-w-lg xl:text-2xl ml-7 opacity-80">
          "É ótimo ter você conosco aqui no Educontrol! Aproveite todas as
          ferramentas e recursos disponíveis para enriquecer sua experiência de
          aprendizado."
        </span>
        <Link
          to="/"
          className="border-2 p-1 px-6 w-48 rounded-3xl text-xl text-center font-bold mt-5 hover:bg-whiteEdu hover:text-greenEdu"
        >
          Home
        </Link>
      </div>
      <div className="w-full bg-whiteEdu flex flex-col justify-center items-center gap-6">
        <h1 className="text-greenEdu font-bold text-4xl xl:text-5xl drop-shadow-xl">
          Acesse sua conta Professor(a)
        </h1>
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}{" "}
        {/* Error message display */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 items-center"
        >
          <div className="flex flex-col gap-4 w-80 xl:w-96">
            <Input
              register={register}
              error={errors.email?.message}
              type="email"
              name="email"
              placeholder="E-mail"
            />
            <Input
              register={register}
              error={errors.password?.message}
              type="password"
              name="password"
              placeholder="Senha"
            />
          </div>
          <Button disabled={loading}>
            {loading ? "Entrando..." : "Entre"}
          </Button>{" "}
          {/* Button text changes based on loading state */}
        </form>
      </div>
    </main>
  );
}
