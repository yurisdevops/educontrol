import { ReactNode } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

export type InputProps = {
  type: string;

  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  value?: string;
  disable?: boolean;
  childre?: ReactNode;
  checked?: boolean | any;
  onChange?: (value: any) => void;
};

export function Checkbox({
  name,

  type,
  register,
  rules,
  error,
  value,
  disable,
  childre,
  checked,
  onChange,
}: InputProps) {
  return (
    <div className="bg-greenEdu rounded-xl border-2 border-greenEdu mb-2 ">
      <input
        className="opacity-90 text-base w-20 font-bold mb-1  p-1 rounded-xl drop-shadow-xl outline-none"
        type={type}
        {...register(name, rules)}
        id={name}
        value={value}
        disabled={disable}
        checked={checked}
        onChange={onChange}
      />
      {childre}
      {error && <p className="text-redEdu ml-2">{error}</p>}
    </div>
  );
}
