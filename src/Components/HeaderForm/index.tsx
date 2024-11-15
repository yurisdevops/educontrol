import { ReactNode } from "react";

interface HeaderFormProps {
  children: ReactNode;
}

export function HeaderForm({ children }: HeaderFormProps) {
  return (
    <header className="flex justify-center items-center h-9 bg-greenEdu sticky top-0">
      <h2 className="text-whiteEdu text-xl font-medium">{children}</h2>
    </header>
  );
}
