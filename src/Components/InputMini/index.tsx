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
    <div className="bg-greenEdu rounded-xl  border-greenEdu mb-2 ">
      <input
        className="opacity-90 h-3 font-bold mb-1 w-full xl:w-full p-4 rounded-xl drop-shadow-xl outline-none text-center placeholder-greenEdu"
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
