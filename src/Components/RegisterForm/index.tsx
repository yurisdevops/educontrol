import { UseFormRegister } from "react-hook-form";
import { Input } from "../Input";

interface RegisterFormProps {
  register: UseFormRegister<any>;
  errors: any;
}
export function RegisterForm({ register, errors }: RegisterFormProps) {
  return (
    <section>
      <div className="flex flex-col gap-4 w-80 xl:w-96">
        <Input
          error={errors.name?.message}
          register={register}
          type="text"
          name="name"
          placeholder="    Nome"
        />
        <Input
          error={errors.email?.message}
          register={register}
          type="email"
          name="email"
          placeholder="    E-mail"
        />
        <Input
          error={errors.password?.message}
          register={register}
          type="password"
          name="password"
          placeholder="    Senha"
        />
        <Input
          error={errors.confirmPassword?.message}
          register={register}
          type="password"
          name="confirmPassword"
          placeholder="   Confirme sua senha"
        />
      </div>
    </section>
  );
}
