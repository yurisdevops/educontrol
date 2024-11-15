import React, { useState } from "react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");

  const handleSave = () => {
    onSave(title);
    setTitle("");
  };

  if (!isOpen) return null;

  return (
    <div className="border-2 border-greenEdu rounded-xl">
      <div className="bg-greenEdu rounded-t-lg text-center text-whiteEdu font-medium">
        <h2>Novo Evento</h2>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Digite o evento"
        className="outline-none"
      />
      <div className="flex gap-2 justify-center bg-greenEdu rounded-b-lg text-whiteEdu font-medium">
        <button onClick={handleSave}>Salvar</button>
        <div className="h-6 border-2 border-whiteEdu"></div>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default EventModal;
