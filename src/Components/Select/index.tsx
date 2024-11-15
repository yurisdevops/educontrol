import { ReactNode } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectProps {
  children: ReactNode;
  name: string;
  disabled?: boolean;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  value?: string;
  multiple?: boolean;
}

export function Select({
  children,
  name,
  register,
  error,
  rules,
  disabled,
  multiple,
}: SelectProps) {
  return (
    <div className="bg-greenEdu rounded-xl border-2 border-greenEdu mb-2">
      <select
        {...register(name, rules)}
        id={name}
        className="opacity-90 w-full mb-1 xl:w-full p-1 font-bold rounded-xl drop-shadow-xl outline-none"
        disabled={disabled}
        multiple={multiple}
      >
        {children}
      </select>
      {error && <p className="text-redEdu">Escolha uma opção</p>}
    </div>
  );
}
