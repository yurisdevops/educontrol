import { ReactNode } from "react";
interface ContainerProsp {
  children: ReactNode;
}

export function Container({ children }: ContainerProsp) {
  return (
    <section className="flex flex-col xl:flex-row justify-center items-center mt-8 pb-10 xl:pb-0">
      <div className=" w-5/6 max-h-full">{children}</div>
    </section>
  );
}
