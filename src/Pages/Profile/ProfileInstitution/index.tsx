import { Button } from "../../../Components/Button";
import { TitleBar } from "../../../Components/TitleBar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { db } from "../../../services/firebaseConnection";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { AdressForm } from "../../../Components/AdressForm";
import { ContactForm } from "../../../Components/ContactForm";
import { InstitutionForm } from "../../../Components/InstitututionForm";

function validarCNPJ(cnpj: any | string[]) {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) return false;

  // Cálculo dos dígitos verificadores
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const calcularDigito = (cnpj: string, pesos: string | any[]) => {
    let soma = 0;
    for (let i = 0; i < pesos.length; i++) {
      soma += parseInt(cnpj[i]) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const digito1 = calcularDigito(cnpj, pesos1);
  const digito2 = calcularDigito(cnpj + digito1, pesos2);

  return cnpj.endsWith(digito1.toString() + digito2.toString());
}

const profileinstitutionSchema = z.object({
  name: z.string().min(1, "O campo nome da instituição é obrigatório"),
  director: z.string().min(1, "O campo nome do Diretor é obrigatório"),
  cpf: z.string().refine(validarCNPJ, {
    message: "CNPJ inválido",
  }),
  inscricao: z.string().min(1, "O campo  Inscrição Estadual é obrigatória"),
  email: z.string().email("O campo e-mail inválido"),
  registration: z.string().min(1, "O campo código INEP é obrigatório"),
  phone: z
  .string()
  .min(1, "O campo telefone é obrigatório")
  .refine((value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove tudo que não for número
    return /^\d{11,12}$/.test(cleaned);
  }, {
    message: "Número de telefone inválido.",
  }),
  typeTeaching: z.string().min(1, ""),
  openingHours: z
    .string()
    .min(1, "O campo horáirio de funcionamento é obrigatória"),
  cep: z.string().min(1, "O campo cep é obrigatório"),
  street: z.string().min(1, "O campo rua é obrigatória"),
  number: z.string().min(1, "O campo número é obrigatório"),
  active: z.string(),
  complement: z.string().optional(),
  birthdate: z.string().min(1, "O campo ano de fundação é obrigatória"),
  neighborhood: z.string().min(1, "O campo bairro é obrigatório"),
  county: z.string().min(1, "O campo municipio é obrigatório"),
});

type FormDataProfileInstitutions = z.infer<typeof profileinstitutionSchema>;

export function ProfileInstituion() {
  const navigate = useNavigate();
  const { setUidContextInstitution, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProfileInstitutions>({
    resolver: zodResolver(profileinstitutionSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormDataProfileInstitutions) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;

      const validadUser = true;
      const dataSave = { ...data, userTypeAdmin: validadUser, uid: uid };

      await setDoc(doc(db, "institutions", uid), dataSave);
      console.log("Dados do perfil salvos com sucesso!");
      setUidContextInstitution(uid);
      navigate("/dashboard", { replace: true });
    } else {
      console.log("Nenhum usuário autenticado encontrado!");
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

  const { user } = useAuth();

  return (
    <main>
      <TitleBar
        title="Perfil"
        message="complete o seu cadastro"
        user=""
        onClose={() => {
          handleLogout();
        }}
        onProfile={() => {}}
        nameButton="Sair"
        icon={""}
      />

      <section className="flex flex-col xl:flex justify-center items-center pb-10 xl:pb-0">
        <div className="mt-8 w-85 xl:w-5/6 border-2 rounded-3xl border-greenEdu max-h-full ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-1 px-4 py-5"
          >
            <div className="w-full">
              <InstitutionForm
                user={user}
                register={register}
                errors={errors}
              />
            </div>
            <div className="w-full">
              {" "}
              <ContactForm register={register} errors={errors} user={user} />
            </div>

            <div className="w-full">
              <AdressForm register={register} errors={errors} />
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
