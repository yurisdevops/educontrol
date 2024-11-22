import { ReactNode } from "react";

interface TitleBarProps {
  title: string;
  message: string;
  user: string;
  onClose: () => void;
  nameButton: string;
  onProfile?: () => void;
  icon: ReactNode;
}

export function TitleBar({
  title,
  message,
  user,
  nameButton,
  icon,
  onClose,
  onProfile,
}: TitleBarProps) {
  return (
    <div>
      <header className="flex -mt-14 ml-3 xl:ml-8 gap-4 items-center">
        <h1 className="font-bold  text-sm xl:text-4xl text-whiteEdu">
          {title}
        </h1>
        <div className="flex font-bold flex-row justify-between w-full items-center">
          <div className="flex flex-col items-center mt xl:flex xl:flex-row ">
            <p className="mt-2 opacity-90 text-xp xl:text-base text-blackEdu">{message}</p>
            <p className="mt-1 ml-2 text-xp text-whiteEdu xl:text-2xl">
              {user}
            </p>
          </div>
          <div className="flex items-center gap-2 xl:gap-8">
            <button
              onClick={onProfile}
              className="text-whiteEdu hover:text-blackEdu"
            >
              {icon}
            </button>
            <button
              onClick={onClose}
              className="p-2 mr-5 xl:mr-10 xl:text-2xl text-whiteEdu hover:text-blackEdu"
            >
              {nameButton}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
