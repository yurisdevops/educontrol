import { RegisterOptions, UseFormRegister } from "react-hook-form";

type MiniInputProps = {
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

export function InputMini({
  name,
  placeholder,
  type,
  register,
  rules,

  value,
  disable,
  pattern,
}: MiniInputProps) {
  return (
    <div>
      <input
        className="opacity-90 text-base border-b-2 border-greenEdu font-bold mb-1 w-full xl:w-full p-1 rounded-md drop-shadow-2xl outline-none"
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
        value={value}
        disabled={disable}
        pattern={pattern}
      />
    </div>
  );
}
