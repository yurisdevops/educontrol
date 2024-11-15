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
      {" "}
      <div className="w-full flex flex-col -mt-2 xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="name" className="ml-1 text-base">
            Nome Da Institução:
          </label>
          <Input
            type="text"
            placeholder="ex: Escola Santa Maria "
            name="name"
            error={errors.name?.message}
            register={register}
            value={user?.displayName}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="surname" className="ml-1 text-base">
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
          <label htmlFor="name" className="ml-1 text-base">
            CNPJ:
          </label>
          <Input
            type="text"
            placeholder="ex: 25689549/0001-25 "
            name="cnpj"
            error={errors.cnpj?.message}
            register={register}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="surname" className="ml-1 text-base">
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
          <label htmlFor="pdc" className="ml-1 text-base">
            Instituição Ativa No Momento:
          </label>
          <Select name="active" register={register}>
            <option value="" disabled selected>
              Selecione uma opção
            </option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </Select>
        </div>
      </div>
      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="gender" className="ml-1 text-base">
            Tipo de Ensino:
          </label>
          <Select name="typeTeaching" register={register}>
            <option value="" disabled selected>
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
            placeholder="ex: 23/12/1994"
            name="birthdate"
            register={register}
            error={errors.birthdate?.message}
          />
        </div>
      </div>
    </section>
  );
}
