import { UseFormRegister } from "react-hook-form";
import { Input } from "../Input";
import { Select } from "../Select";
import { useAuth } from "../../Context/AuthContext";

interface TeacherFormProps {
  user: any;
  errors: any;
  register: UseFormRegister<any>;
  value?: any;
  classes?: any;
}

export function TeacherForm({
  register,
  errors,
  value,
  classes,
}: TeacherFormProps) {
  const { teacherName, teacherEmail } = useAuth();
  return (
    <section>
      <div className="w-full flex flex-col -mt-2 xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="name" className="ml-1 text-base">
            NOME:
          </label>
          <Input
            type="text"
            placeholder="ex: Luis Henrique"
            name="name"
            value={teacherName}
            error={errors.name?.message}
            register={register}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="surname" className="ml-1 text-base">
            SOBRENOME:
          </label>
          <Input
            type="text"
            placeholder="ex: Almeida Campos"
            name="surname"
            error={errors.name?.message}
            register={register}
          />
        </div>
      </div>
      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="gender" className="ml-1 text-base">
            SEXO:
          </label>
          <Select name="gender" register={register}>
            <option value="" disabled selected>
              Selecione uma opção
            </option>
            <option value={classes}>Masculino</option>
            <option value="feminino">Feminino</option>
          </Select>
        </div>
        <div className="flex-1">
          <label htmlFor="birthdate" className="ml-1 text-base">
            DATA DE NASCIMENTO:
          </label>
          <Input
            type="date"
            placeholder="ex: 23/12/1994"
            name="birthdate"
            register={register}
          />
        </div>
      </div>
      <div className=" flex flex-col xl:flex-row xl:gap-4 items-center">
        <div className="flex flex-1 gap-4 items-center">
          <div className="flex-1">
            <label htmlFor="registration" className="ml-1 text-base">
              Registro Nacional:
            </label>
            <Input
              type="text"
              placeholder="ex: 2024567890"
              name="registration"
              register={register}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="pdc" className="ml-1 text-base">
              Instituição:
            </label>
            <Input
              type="text"
              placeholder="ex: CIEP Major Manuel Gomes Archer"
              name="instituionName"
              register={register}
              value={value}
            />
          </div>
        </div>
        <div className="flex flex-1 gap-4 items-center">
          <div className="flex-1">
            <label htmlFor="class" className="ml-1 text-base">
              DISCIPLINA:
            </label>
            <Input
              type="text"
              placeholder="ex: Ed. Física"
              name="discipline"
              register={register}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="cpf" className="ml-1 text-base">
            CPF:
          </label>
          <Input
            type="text"
            placeholder="ex:159.333.217-42"
            name="cpf"
            error={errors.cpf?.message}
            register={register}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="placeOfBirth" className="ml-1 text-base">
            NATURALIDADE:
          </label>
          <Input
            type="text"
            placeholder="ex: Rio de Janeiro"
            name="placeOfBirth"
            register={register}
          />
        </div>
      </div>
      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="email" className="ml-1 text-base">
            E-mail:
          </label>
          <Input
            type="email"
            placeholder=""
            name="email"
            value={teacherEmail}
            register={register}
            error={errors.email?.message}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="phone" className="ml-1 text-base">
            Telefone:
          </label>
          <Input
            type="tel"
            placeholder="ex: (21) 99035-2415"
            name="phone"
            register={register}
            error={errors.phone?.message}
          />
        </div>
      </div>
    </section>
  );
}
