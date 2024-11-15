import { useNavigate } from "react-router-dom";
import { Input } from "../../../Components/Input";
import { Button } from "../../../Components/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { TitleBar } from "../../../Components/TitleBar";
import { useState } from "react";

// Importação da biblioteca Zod para validação
const registerValidationSchema = z
  .object({
    // Definindo um objeto de validação
    name: z.string().min(3, "Deve conter no mínimo 3 caracteres").max(100), // Nome: deve ter entre 3 e 100 caracteres
    email: z.string().email("Digite um email válido"), // E-mail: deve ser um endereço de email válido
    password: z.string().min(6, "Deve conter no mínimo 6 caracteres"), // Senha: deve ter pelo menos 6 caracteres
    confirmPassword: z.string().min(6, "Deve conter no mínimo 6 caracteres"), // Confirmação de senha
  })
  // Validação adicional: senha e confirmação de senha devem ser iguais
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais", // Mensagem de erro
    path: ["confirmPassword"], // Campo onde a mensagem de erro deve ser exibida
  });

// Inferência do tipo de dados com base no esquema de validação
type FormDataRegisterTeachers = z.infer<typeof registerValidationSchema>;

// Componente para registro de professores
export function RegisterTeacher() {
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagens de sucesso
  // const { setUidTeacher } = useAuth();
  const navigate = useNavigate(); // Hook para navegação no React Router

  // Inicialização do hook de formulário com validação Zod
  const {
    register,
    handleSubmit,
    formState: { errors }, // Captura o estado de erros do formulário
  } = useForm<FormDataRegisterTeachers>({
    resolver: zodResolver(registerValidationSchema), // Resolvedor para a validação usando Zod
    mode: "onChange", // Modo de validação: valida com cada mudança no formulário
  });

  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user?.uid);

  // !Função a ser chamada ao submeter o formulário
  const onSubmit = async (data: FormDataRegisterTeachers) => {
    setLoading(true); // Iniciar o estado de carregamento
    try {
      // Tentativa de criação de usuário com email e senha fornecidos
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.name,
      }); // Atualizar o perfil do usuário com o nome fornecido

      // Definir mensagem de sucesso
      setSuccessMessage(
        "Usuário registrado com sucesso! Você será redirecionado."
      );

      // Redirecionar para o dashboard após um atraso de 2 segundos
      setTimeout(() => {
        navigate("/dashboard/registerTeacher/profileTeacher", {
          replace: true,
        });
      }, 2000);
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error); // Logar erro no console
      alert("Erro ao registrar o usuário. Tente novamente."); // Mensagem de erro ao usuário
    } finally {
      setLoading(false); // Finalizar o estado de carregamento
    }
  };

  // !Função para voltar ao dashboard
  const back = () => {
    navigate("/dashboard"); // Navegar de volta ao dashboard
  };

  return (
    <main className="h-full w-full">
      <TitleBar
        title="Registro"
        user=""
        onClose={back}
        nameButton="Voltar"
        message="Novo professor(a)"
        icon={undefined}
      />
      <div className="xl:flex xl:flex-row flex flex-col-reverse">
        <div className="w-full">
          <div className="h-96 mt-72 flex gap-20 flex-col justify-center items-center">
            <h1 className="text-greenEdu font-bold font-sans text-5xl -mt-40 drop-shadow-xl">
              Crie uma conta Professor(a)
            </h1>
            {successMessage && (
              <div className="text-green-500">{successMessage}</div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6 items-center"
            >
              <div className="flex flex-col gap-4 w-80 xl:w-96">
                <Input
                  error={errors.name?.message}
                  register={register}
                  type="text"
                  name="name"
                  placeholder="Nome"
                  aria-invalid={!!errors.name}
                />
                <Input
                  error={errors.email?.message}
                  register={register}
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  aria-invalid={!!errors.email}
                />
                <Input
                  error={errors.password?.message}
                  register={register}
                  type="password"
                  name="password"
                  placeholder="Senha"
                  aria-invalid={!!errors.password}
                />
                <Input
                  error={errors.confirmPassword?.message}
                  register={register}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirme sua senha"
                  aria-invalid={!!errors.confirmPassword}
                />
              </div>
              <Button disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar-se"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
