import { UseFormRegister } from "react-hook-form";
import { Input } from "../Input";

type AddressFormProps = {
  register: UseFormRegister<any>; // Adicione o tipo correto para o register
  errors: any; // Adicione o tipo correto para os errors
};

export function AdressForm({ register, errors }: AddressFormProps) {
  return (
    <section>
      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="placeOfBirth" className="ml-1 text-base">
            Estado:
          </label>
          <Input
            type="text"
            placeholder="ex: RJ"
            name="openingHours"
            register={register}
            error={errors.openingHours?.message}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cep" className="ml-1 text-base">
            Municipio:
          </label>
          <Input
            type="text"
            placeholder="ex: Rio de Janeiro"
            name="neighborhood"
            register={register}
            error={errors.neighborhood?.message}
          />
        </div>
      </div>

      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="placeOfBirth" className="ml-1 text-base">
            Bairro:
          </label>
          <Input
            type="text"
            placeholder="ex: Campo Grande"
            name="county"
            register={register}
            error={errors.county?.message}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="cep" className="ml-1 text-base">
            Cep:
          </label>
          <Input
            type="text"
            placeholder="ex: 23066-070"
            name="cep"
            register={register}
            error={errors.cep?.message}
          />
        </div>
      </div>

      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="street" className="ml-1 text-base">
            Rua:
          </label>
          <Input
            type="text"
            placeholder="ex: Rua Cabo Saulo de Vasconcelos"
            name="street"
            register={register}
            error={errors.street?.message}
          />
        </div>
        <div className="flex-2">
          <label htmlFor="number" className="ml-1 text-base">
            Número:
          </label>
          <Input
            type="text"
            placeholder="ex: 639"
            name="number"
            register={register}
            error={errors.number?.message}
          />
        </div>
        <div className="w-100 ml-2">
          <label htmlFor="complement" className="ml-1 text-base">
            Complemento:
          </label>
          <Input
            type="text"
            placeholder="ex: Apartamento"
            name="complement"
            register={register}
            error={errors.complement?.message}
          />
        </div>
      </div>
    </section>
  );
}
