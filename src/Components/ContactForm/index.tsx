import { UseFormRegister } from "react-hook-form";
import { Input } from "../Input";
type ContactFormProps = {
  register: UseFormRegister<any>;
  errors: any;
  user: any;
};

export function ContactForm({ register, errors, user }: ContactFormProps) {
  return (
    <section>
      <div className="w-full flex flex-col xl:flex-row xl:gap-4">
        <div className="flex-1">
          <label htmlFor="email" className="ml-1 text-base">
            E-mail:
          </label>
          <Input
            type="email"
            placeholder=""
            name="email"
            value={user?.email}
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
