import { ReactNode } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectProps {
  children: ReactNode;
  name: string;
  disabled?: boolean;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
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
    <div>
      <select
        {...register(name, rules)}
        id={name}
        className="opacity-90 w-full border-b-2 border-greenEdu mb-1 xl:w-full p-1 font-bold rounded-md drop-shadow-xl outline-none"
        disabled={disabled}
        multiple={multiple}
      >
        {children}
      </select>
      {error && <p className="text-redEdu">{error}</p>}
    </div>
  );
}
