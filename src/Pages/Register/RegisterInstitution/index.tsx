import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../Components/Button";
import { ZodError, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../services/firebaseConnection";
import { RegisterForm } from "../../../Components/RegisterForm";

const registerValidationSchema = z
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

type FormDataRegisterInstitutions = z.infer<typeof registerValidationSchema>;

export function RegisterInstitution() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegisterInstitutions>({
    resolver: zodResolver(registerValidationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormDataRegisterInstitutions) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      });
      navigate("/profileInstitution", { replace: true });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Erro de validação:", error.errors);
      } else {
        console.error("Erro ao criar a conta do usuário:", error);
      }
    }
  };

  return (
    <main className="xl:h-screen xl:w-full flex flex-col-reverse xl:flex-row">
      <div className="xl:w-2/3 h-screen bg-greenEdu flex flex-col items-center justify-center text-whiteEdu gap-4">
        <h1 className="font-bold font-sans text-2xl xl:text-5xl">
          Seja bem-vindo de volta!
        </h1>
        <span className="max-w-80 xl:max-w-lg xl:text-2xl text-sm ml-7 opacity-80">
          "É ótimo ter você de volta ao Educontrol! Faça seu login e aproveite
          todas as ferramentas e recursos disponíveis para enriquecer sua
          experiência de aprendizado."
        </span>
        <Link
          to="/loginInstitution"
          className="border-2 bg-whiteEdu text-greenEdu p-1 px-6 w-48 rounded-md text-xl text-center font-bold mt-5 hover:opacity-90"
        >
          Entre
        </Link>
      </div>
      <div className="xl:w-full xl:bg-whiteEdu h-screen flex flex-col justify-center items-center gap-6">
        <h1 className="text-greenEdu font-bold ml-16 text-4xl xl:text-5xl drop-shadow-xl">
          Crie sua conta Instituição
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 items-center"
        >
          <RegisterForm register={register} errors={errors} />
          <Button>Cadastrar-se</Button>
        </form>
      </div>
    </main>
  );
}
