import { Button } from "../../../Components/Button";
import { TitleBar } from "../../../Components/TitleBar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { auth, db } from "../../../services/firebaseConnection";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { AdressForm } from "../../../Components/AdressForm";
import { ContactForm } from "../../../Components/ContactForm";
import { InstitutionForm } from "../../../Components/InstitututionForm";

const profileinstitutionSchema = z.object({
  name: z.string().min(1, "O campo nome da instituição é obrigatório"),
  director: z.string().min(1, "O campo nome do Diretor é obrigatório"),
  cnpj: z.string().min(1, "O campo  CNPJ é obrigatório"),
  inscricao: z.string().min(1, "O campo  Inscrição Estadual é obrigatória"),
  email: z.string().email("O campo e-mail inválido"),
  registration: z.string().min(1, "O campo código INEP é obrigatório"),
  phone: z
    .string()
    .min(1, "O campo telefone é obrigatório")
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: "Numero de telefone invalido.",
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
  const { setUidContextInstitution } = useAuth();

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
      await auth.signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
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
