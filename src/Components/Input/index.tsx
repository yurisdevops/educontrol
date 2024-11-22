import { RegisterOptions, UseFormRegister } from "react-hook-form";

export type InputProps = {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  value?: string;
  disable?: boolean;
  pattern?: string | any;
};

export function Input({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
  value,
  disable,
}: InputProps) {
  return (
    <div>
      <input
        className="opacity-90 text-base border-b-2 border-greenEdu font-bold mb-1 w-full xl:w-full p-1 rounded-sm drop-shadow-2xl outline-none"
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
        value={value}
        disabled={disable}
      />

      {error && <p className="text-redEdu ml-2">{error}</p>}
    </div>
  );
}
