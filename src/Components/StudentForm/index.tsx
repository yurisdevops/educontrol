import { UseFormRegister } from "react-hook-form";
import { Button } from "../Button";
import { Input } from "../Input";
import { Select } from "../Select";

interface StudentFormProps {
  register: UseFormRegister<any>;
  errors: any;
}

export function StudentForm({ register }: StudentFormProps) {
  return (
    <section>
      <div className="flex flex-col items-center">
        {" "}
        <div className="w-full flex flex-col -mt-6 xl:flex-row xl:gap-4">
          <div className="flex-1">
            <label
              htmlFor="name"
              className="ml-1 font-bold text-sm text-greenEdu "
            >
              NOME:
            </label>
            <Input
              type="text"
              placeholder="ex: Luis Henrique"
              name="name"
              register={register}
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="surname"
              className="ml-1 font-bold text-sm text-greenEdu"
            >
              SOBRENOME:
            </label>
            <Input
              register={register}
              type="text"
              placeholder="ex: Almeida Campos"
              name="surname"
            />
          </div>
        </div>
        <div className="w-full flex flex-col xl:flex-row xl:gap-4">
          <div className="flex-1">
            <label
              htmlFor="gender"
              className="ml-1 font-bold text-sm text-greenEdu"
            >
              SEXO:
            </label>
            <Select
              name="gender"
              register={register}
              rules={{ required: "Este campo é obrigatório" }}
            >
              <option value="none" disabled selected>
                Selecione uma opção
              </option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </Select>
          </div>
          <div className="flex-1">
            <label
              htmlFor="birthdate"
              className="ml-1 font-bold text-sm text-greenEdu"
            >
              DATA DE NASCIMENTO:
            </label>
            <Input
              register={register}
              type="date"
              placeholder="ex: 23/12/1994"
              name="birthdate"
            />
          </div>
        </div>
        <div className="mt-6">
          <Button>Enviar</Button>
        </div>
      </div>
    </section>
  );
}
