import { ReactNode } from "react";

type ButtonChildren = {
  children: ReactNode;
  disabled?: boolean;
};

export function Button({ children, disabled }: ButtonChildren) {
  return (
    <button
      disabled={disabled}
      type="submit"
      className="-mb-2 p-1 px-6 w-48 font-bold border-2 bg-greenEdu rounded-md text-xl text-whiteEdu hover:opacity-90"
    >
      {children}
    </button>
  );
}
