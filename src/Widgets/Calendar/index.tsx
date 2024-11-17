import { useCallback, useEffect, useState } from "react"; // Importa a função useState do React para gerenciar estado
import Calendar from "react-calendar"; // Importa o componente de calendário de uma biblioteca externa
import "react-calendar/dist/Calendar.css"; // Importa o CSS padrão para o estilo do calendário
import styles from "./Calendar.module.css"; // Importa estilos personalizados para o calendário
import { GrFormNext, GrFormPrevious } from "react-icons/gr"; // Importa ícones para navegação do calendário
import { useAuth } from "../../Context/AuthContext";
import { v4 as uuidV4 } from "uuid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

// Define a interface 'Event' que descreve a estrutura de cada evento
interface Event {
  date: Date; // A data do evento
  title: string; // O título do evento
  uid?: string; // O ID do evento (somente para eventos salvos)
}

// Função principal que renderiza o calendário e os eventos
export function CalendarDisplay() {
  const { user, uidContextInstitution, uidContextGeral } = useAuth(); // Obtém o contexto de autenticação
  const [date] = useState<Date>(new Date()); // Estado que armazena a data atual
  const [events, setEvents] = useState<Event[]>([]); // Estado que armazena a lista de eventos
  const [, setLoading] = useState(true); // Estado que controla a visibilidade do loading spinner
  const [calendarVisible, setCalendarVisible] = useState(false); // Estado que controla a visibilidade do calendário
  const [eventsVisible, setEventsVisible] = useState(false); // Estado que controla a visibilidade da lista de eventos
  const [, setEventsUpdate] = useState(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchDataTypeUser = useCallback(async (uid: string) => {
    if (typeof uid !== "string") {
      throw new Error("O ID fornecido não é uma string válida");
    }

    const searchTypeInstitution = async () => {
      const dataRefInstituicao = doc(db, "institutions", uid);
      const dataInstitution = await getDoc(dataRefInstituicao);
      if (dataInstitution.exists()) {
        setIsAdmin(dataInstitution.data()?.userTypeAdmin);
        return true;
      }
      return false;
    };
    try {
      const typeFound = await searchTypeInstitution();
      if (!typeFound) {
        throw new Error("Usuário não encontrado em nenhuma das coleções.");
      }
    } catch (error) {
      console.error("Erro ao obter status:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDataTypeUser(user.uid);
    }
  }, [user, fetchDataTypeUser]);

  const openBoxInput = async (selectedDate: Date) => {
    const { value: texto } = await Swal.fire({
      title: "Seu Novo Evento",
      input: "text",

      inputPlaceholder: "Digite um novo evento aqui...",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancelar",
      width: "400px",
    });

    if (texto) {
      saveEvents({ date: selectedDate, title: texto }); // Salva o evento no Firestore
    }
  };

  const saveEvents = async (evento: Event) => {
    try {
      if (!user?.uid) {
        throw new Error("User não encontrado.");
      }

      const uidEvent: string = uuidV4();

      const dataRefEvents = collection(
        db,
        "institutions",
        uidContextInstitution,
        "events"
      );

      await addDoc(dataRefEvents, {
        uid: uidEvent,
        date: Timestamp.fromDate(evento.date),
        title: evento.title,
      });

      setEventsUpdate((prev) => !prev);
      toast.success("Evento Adicionado");

      // Re-fetch the updated events list after adding a new event
      await searchDataEvents();
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
    }
  };

  const searchDataEvents = useCallback(async () => {
    try {
      setLoading(true);

      const dataRefEvents = collection(
        db,
        "institutions",
        uidContextGeral,
        "events"
      );

      const snapshot = await getDocs(dataRefEvents);
      const dataEvents = snapshot.docs.map((event) => ({
        uid: event.id,
        title: event.data().title,
        date: event.data().date.toDate(),
      }));

      setEvents(dataEvents);
    } catch (err) {
      console.error("Erro ao buscar eventos:", err);
    } finally {
      setLoading(false);
    }
  }, [uidContextGeral]);

  useEffect(() => {
    searchDataEvents();
  }, [searchDataEvents]);

  const deleteEvent = useCallback(
    async (uid: string) => {
      try {
        const eventoRef = doc(
          db,
          "institutions",
          uidContextInstitution,
          "events",
          uid
        );
        await deleteDoc(eventoRef);

        setEvents((prevEventos) =>
          prevEventos.filter((evento) => evento.uid !== uid)
        );
        toast.error("Evento Excluído");
      } catch (error) {
        console.error("Erro ao excluir documento:", error);
      }
    },
    [uidContextInstitution]
  );

  function onClickDay(selectedDate: Date) {
    return isAdmin ? openBoxInput(selectedDate) : null; // Passa a data selecionada para a função
  }

  // Função que obtém todos os eventos do ano atual
  function getEventsForYear(
    date: Date
  ): { uid: string | any; title: string; date: Date }[] {
    return events
      .filter((event) => event.date.getFullYear() === date.getFullYear())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((event) => ({
        uid: event.uid,
        title: event.title,
        date: event.date,
      }));
  }

  const eventsForYear = getEventsForYear(date); // Obtém a lista de eventos para o ano atual

  // Função que alterna a visibilidade do calendário
  function toggleCalendarVisibility() {
    setCalendarVisible(!calendarVisible); // Atualiza o estado para mostrar ou esconder o calendário
  }

  // Função que alterna a visibilidade da lista de eventos
  function toggleEventsVisibility() {
    setEventsVisible(!eventsVisible); // Atualiza o estado para mostrar ou esconder a lista de eventos
  }

  useEffect(() => {
    events;
  }, [saveEvents, deleteEvent]);

  return (
    <div
      className={`flex flex-col justify-center items-center bg-gray-100 z-10`}
    >
      <div
        className={`w-85 flex flex-col max-w-sm p-6 items-center bg-white border-2 border-greenEdu rounded-lg shadow-md bg-whiteEdu`}
      >
        <button
          className="w-full border-2 mb-2 border-whiteEdu bg-greenEdu rounded-full p-1 font-bold text-whiteEdu"
          onClick={toggleCalendarVisibility} // Chama a função para alternar a visibilidade do calendário ao clicar
        >
          {calendarVisible ? "Fechar Calendário" : "Mostrar Calendário"}
        </button>
        {calendarVisible && ( // Renderiza o calendário somente se 'calendarVisible' for verdadeiro
          <Calendar
            value={date}
            onClickDay={onClickDay} // Define a função a ser chamada quando um dia do calendário é clicado
            locale="pt-BR" // Define o locale para formatar datas em português
            className={styles.reactCalendar} // Aplica estilos personalizados ao calendário
            navigationLabel={({ date }) => (
              <span className={styles.navigationLabel}>
                {date.toLocaleDateString("pt-BR", {
                  month: "long", // Formata o mês em extenso
                  year: "numeric", // Formata o ano como numérico
                })}
              </span>
            )}
            tileClassName={(
              { date } //* Define classes CSS para cada tile (dia)
            ) =>
              `${styles.tile} ${
                events.some(
                  //* A função some é um método de array que verifica se pelo menos um elemento do array atende à condição especificada. Nesse caso, estamos verificando se algum dos eventos na lista eventos ocorre no dia representado por date.
                  (event) =>
                    event.date.getFullYear() === date.getFullYear() && //* Verifica se o ano do evento é o mesmo ano do tile (data do dia).
                    event.date.getMonth() === date.getMonth() && //* Verifica se o mês do evento é o mesmo mês do tile.
                    event.date.getDate() === date.getDate() //*Verifica se o dia do evento é o mesmo dia do tile.
                ) //* Se todas as três condições forem verdadeiras, significa que temos um evento para esse dia específico.
                  ? styles.eventDay //* Se houver um evento nesse dia, adiciona a classe específica
                  : ""
              }`
            }
            formatShortWeekday={(
              locale,
              date //* Formata o mês com o formato curto
            ) =>
              new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(
                date
              )
            }
            next2Label={null} // Remove os botões de navegação rápida (dois meses à frente/trás)
            prev2Label={null} // Remove os botões de navegação rápida (dois meses à frente/trás)
            nextLabel={
              <span className="flex items-center w-12 justify-center">
                <GrFormNext size={24} />
              </span>
            } // Define o ícone para o botão de próximo mês
            prevLabel={
              <span className="flex items-center w-12 justify-center">
                <GrFormPrevious size={24} />
              </span>
            } // Define o ícone para o botão do mês anterior
          />
        )}
        {calendarVisible && ( // Renderiza a opção para exibir ou fechar eventos somente se o calendário estiver visível
          <div>
            <button
              className="border-2 p-1 px-2 mt-2 text-greenEdu font-bold shadow-md border-whiteEdu rounded-full"
              onClick={toggleEventsVisibility} // Alterna a visibilidade da lista de eventos ao clicar
            >
              {eventsVisible ? "Fechar Eventos" : "Exibir Eventos"}
            </button>
          </div>
        )}
      </div>
      {calendarVisible && ( // Renderiza a lista de eventos somente se o calendário estiver visível
        <div>
          {eventsVisible && ( // Renderiza a lista de eventos somente se 'eventsVisible' for verdadeiro
            <div className="w-96 max-h-96 overflow-y-auto border-greenEdu border-2 bg-whiteEdu rounded-2xl -mt-88 text-center text-whiteEdu">
              <div className="realtive">
                <h2
                  className={`${styles.heading} sticky top-0 bg-whiteEdu shadow-md text-greenEdu p-4`}
                >
                  Eventos de {date.toLocaleString("pt-BR", { year: "numeric" })}
                  :
                </h2>
                <div className="w-94 border border-greenEdu absolute"></div>
                <ul className={styles.eventList}>
                  {eventsForYear.map((event) => (
                    <li key={event.uid} className={styles.eventItem}>
                      <span className={styles.eventDate}>
                        {event.date.toLocaleDateString("pt-BR")}
                      </span>
                      <span className={styles.eventTitle}>
                        {" "}
                        - {event.title}
                      </span>
                      {isAdmin && (
                        <button
                          className="ml-2 mb-2 text-greenEdu font-bold border-whiteEdu border-2 px-1 rounded-3xl hover:text-blackEdu"
                          onClick={() => deleteEvent(event.uid)}
                        >
                          Remover
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
