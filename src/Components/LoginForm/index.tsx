import { UseFormRegister } from "react-hook-form";
import { Input } from "../Input";

interface LoginFormProps {
  register: UseFormRegister<any>;
  errors: any;
}

export function LoginForm({ register, errors }: LoginFormProps) {
  return (
    <section>
      <div className="flex flex-col gap-4 w-80 xl:w-96">
        <Input
          register={register}
          error={errors.email?.message}
          type="email"
          name="email"
          placeholder="    E-mail"
        />
        <Input
          register={register}
          error={errors.password?.message}
          type="password"
          name="password"
          placeholder="    Senha"
        />
      </div>
    </section>
  );
}
