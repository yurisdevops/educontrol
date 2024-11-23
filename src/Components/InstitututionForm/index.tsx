import { UseFormRegister } from "react-hook-form";
import { Input } from "../Input";
import { Select } from "../Select";

interface InstitutionFormProps {
  user: any;
  register: UseFormRegister<any>;
  errors: any;
}

export function InstitutionForm({
  register,
  errors,
  user,
}: InstitutionFormProps) {
  return (
    <section>
      <div className="w-full flex flex-col -mt-2 xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="name" className="ml-1 text-base">
            Nome da Instituição:
          </label>
          <Input
            type="text"
            placeholder="ex: Escola Santa Maria"
            name="name"
            error={errors.name?.message}
            register={register}
            value={user?.displayName || ""} // Use defaultValue
          />
        </div>
        <div className="flex-1">
          <label htmlFor="director" className="ml-1 text-base">
            Nome do Diretor/Responsável:
          </label>
          <Input
            type="text"
            placeholder="ex: Carlos Almeida Campos"
            name="director"
            register={register}
            error={errors.director?.message}
          />
        </div>
      </div>
      <div className="w-full flex flex-col -mt-2 xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="cnpj" className="ml-1 text-base">
            CNPJ:
          </label>
          <Input
            type="text"
            placeholder="ex: 25689549/0001-25"
            name="cnpj"
            error={errors.cnpj?.message}
            register={register}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="inscricao" className="ml-1 text-base">
            Inscrição Estadual:
          </label>
          <Input
            type="text"
            placeholder="ex: 25981-9"
            name="inscricao"
            register={register}
            error={errors.inscricao?.message}
          />
        </div>
      </div>
      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="registration" className="ml-1 text-base">
            Código INEP:
          </label>
          <Input
            type="text"
            placeholder="ex: 2024567890"
            name="registration"
            register={register}
            error={errors.registration?.message}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="active" className="ml-1 text-base">
            Instituição Ativa No Momento:
          </label>
          <Select name="active" register={register}>
            <option value="" disabled>
              Selecione uma opção
            </option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </Select>
        </div>
      </div>
      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="typeTeaching" className="ml-1 text-base">
            Tipo de Ensino:
          </label>
          <Select name="typeTeaching" register={register}>
            <option value="" disabled>
              Selecione uma opção
            </option>
            <option value="fundamental">Ensino Fundamental</option>
            <option value="medio">Ensino Médio</option>
            <option value="tecnico">Ensino Técnico</option>
            <option value="superior">Ensino Superior</option>
            <option value="todos">Ensino Fundamental ao Médio</option>
          </Select>
        </div>
        <div className="flex-1">
          <label htmlFor="birthdate" className="ml-1 text-base">
            Ano de Fundação:
          </label>
          <Input
            type="date"
            name="birthdate"
            register={register}
            error={errors.birthdate?.message}
            placeholder={"02/10/2000"}
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
            name="email"
            value={user?.email} // Use defaultValue
            register={register}
            error={errors.email?.message}
            placeholder={"yuri@live.com"}
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
