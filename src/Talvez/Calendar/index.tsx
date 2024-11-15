import React, { useState, useRef, useEffect } from "react";
import { DateSelectArg, EventContentArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import EventModal from "../EventModal";
import listPlugin from "@fullcalendar/list"; // Import the list plugin

const CalendarComponent: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);

  //TODO-> Estados do componente
  const [events, setEvents] = useState<any[]>([]); // Estado para armazenar os eventos
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar a abertura do modal de evento
  const [currentDate, setCurrentDate] = useState<DateSelectArg | null>(null); // Estado para armazenar a data selecionada
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false); // Estado para controlar a visibilidade do calendário
  const [isListView, setIsListView] = useState<boolean>(false); // Estado para alternar entre vários modos de visualização
  const [eventIdToDelete, setEventIdToDelete] = useState<string | null>(null); // Estado para armazenar o ID do evento a ser excluído

  //TODO-> Função para lidar com a seleção de data no calendário
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setCurrentDate(selectInfo);
    setModalOpen(true);
  };
  /**
   ** A função recebe um parâmetro chamado selectInfo, do tipo DateSelectArg.
      **DateSelectArg é um tipo de objeto que provavelmente contém informações sobre a data selecionada no calendário, como a data de início e fim da seleção.

      **Quando um usuário seleciona uma data no calendário, esta função é acionada.
      **setCurrentDate(selectInfo): Atualiza o estado currentDate com as informações contidas em selectInfo, que provavelmente incluem a data selecionada no calendário.
      **setModalOpen(true): Define o estado modalOpen como true, o que resulta na abertura do modal para adicionar um novo evento no calendário.
      **Resumindo, a função handleDateSelect é responsável por atualizar o estado currentDate com as informações da data selecionada no calendário e abrir o modal para adicionar um novo evento quando uma data é selecionada. Isso permite que os usuários interajam com o calendário e adicionem novos eventos de forma intuitiva.
   */

  //TODO-> Função para salvar um novo evento no calendário
  const handleModalSave = (title: string) => {
    if (currentDate) {
      const calendarApi = currentDate.view.calendar;

      calendarApi.unselect(); // clear date selection

      if (title) {
        const newEvent = {
          id: String(events.length + 1),
          title,
          start: currentDate.startStr,
          end: currentDate.endStr,
          allDay: currentDate.allDay,
        };

        console.log(newEvent);

        setEvents([...events, newEvent]);
      }
    }
    setModalOpen(false);
  };
  /**
   *
      ** Funcionamento da Função:

      **Verifica se existe uma data selecionada (currentDate) no calendário.
     ** Acessa a API do calendário a partir do objeto currentDate.view.calendar.
      **calendarApi.unselect(): Limpa a seleção de data no calendário, caso haja alguma.
      **Verifica se o título do evento não está vazio (title).
      **Cria um novo evento com um ID único (baseado no comprimento da lista de eventos), o título fornecido, a data de início e fim da seleção atual, e se é um evento de dia inteiro ou não.
      **O novo evento é então adicionado à lista de eventos utilizando o setEvents([...events, newEvent]).
      **O modal é fechado, independentemente de ter sido adicionado um novo evento, ao definir setModalOpen(false).
      **Resumindo, a função handleModalSave é responsável por criar um novo evento com base no título fornecido e nas informações da data selecionada no calendário. Após adicionar o evento à lista de eventos, o modal é fechado. Isso permite que os usuários salvem novos eventos no calendário de forma interativa. 
   */

  //TODO-> Função para marcar um evento para exclusão
  const handleDeleteEvent = (eventId: string) => {
    setEventIdToDelete(eventId);
  };

  //TODO-> Função para confirmar a exclusão de um evento
  const handleConfirmDelete = () => {
    const updatedEvents = events.filter(
      (event) => event.id !== eventIdToDelete
    );
    setEvents(updatedEvents);
    setEventIdToDelete(null);
  };

  //TODO-> Função para cancelar a exclusão de um evento
  const handleCancelDelete = () => {
    setEventIdToDelete(null);
  };
  /**
   **Função handleDeleteEvent:

        **handleDeleteEvent recebe um parâmetro eventId que é uma string representando o ID do evento que será marcado para exclusão.
        **Quando chamada, a função define o eventIdToDelete, que provavelmente é utilizado para armazenar temporariamente o ID do evento a ser excluído.

        **Função handleConfirmDelete:
        **handleConfirmDelete é chamada para confirmar a exclusão do evento marcado anteriormente para exclusão.
        **Primeiro, a função filtra os eventos existentes, removendo o evento com o ID igual a eventIdToDelete.
       ** Em seguida, atualiza o estado events com a lista de eventos filtrada, efetivamente removendo o evento marcado para exclusão.
        **Por fim, redefine eventIdToDelete como null para limpar o ID do evento marcado para exclusão.
        
        **Função handleCancelDelete:
        **handleCancelDelete é chamada quando o usuário decide cancelar a exclusão do evento.
        **Simplesmente redefine eventIdToDelete como null, cancelando a marcação de exclusão do evento.

        **Em resumo, essas funções em conjunto permitem marcar um evento para exclusão, confirmar a exclusão desse evento e cancelar a exclusão se desejado. Isso oferece uma maneira interativa para gerenciar eventos no calendário, permitindo que os usuários decidam se desejam excluir ou não um evento marcado.
   */

  //TODO-> Função para renderizar o conteúdo de um evento no calendário
  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <div className="flex w-full justify-between items-center">
        <div className="flex justify-between w-full">
          {" "}
          <div className="flex">
            <p>{eventContent.event.title}</p>
          </div>
          <div className="flex">
            {isListView && (
              <button
                className="bg-greenEdu font-medium px-1 rounded-xl text-xs text-whiteEdu"
                onClick={() => handleDeleteEvent(eventContent.event.id)}
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  /**
   * *A função recebe um parâmetro chamado eventContent, que provavelmente é um objeto do tipo    
   * 
   *  *EventContentArg contendo informações sobre o conteúdo do evento a ser renderizado.
   * 
      **Funcionamento da Função:
      **A função retorna um JSX que representa o conteúdo visual de um evento a ser exibido.
      **O conteúdo do evento é estruturado em uma <div> com classes CSS para estilização.
      **Dentro dessa <div>, existem duas seções principais:
      **A primeira seção exibe o horário do evento (eventContent.timeText) em negrito e o título do evento (eventContent.event.title) em itálico.
      **A segunda seção contém um botão "Excluir" que só é exibido se a variável isListView for verdadeira. Ao clicar no botão, a função handleDeleteEvent é chamada, passando o ID do evento (eventContent.event.id) como parâmetro.
      **A estrutura do evento é organizada em um layout flexível com elementos alinhados horizontalmente e verticalmente.

      **Resumindo, a função renderEventContent é responsável por renderizar o conteúdo visual de um evento, exibindo o horário e o título do evento, juntamente com um botão de exclusão (se estiver no modo de exibição de lista) para interagir com o evento.
   */

  const toggleCalendarVisibility = () => {
    setCalendarVisible(!calendarVisible);
  };
  /**
   ** Quando chamada, a função atualiza o estado calendarVisible usando a função setCalendarVisible.
      **O valor passado para setCalendarVisible é o oposto do valor atual de calendarVisible, que é obtido usando o operador de negação !.
      **Ou seja, se calendarVisible for true, a função definirá calendarVisible como false, e vice-versa.
      **Portanto, a função alterna a visibilidade do calendário de visível para oculto ou de oculto para visível, dependendo de seu estado atual.
      
      **Em resumo, a função toggleCalendarVisibility é utilizada para alternar a visibilidade do calendário, permitindo que os usuários mostrem ou ocultem o calendário com um simples clique ou interação com um elemento na interface.
   */

  //  Função para lidar com o redimensionamento da janela
  const handleWindowResize = () => {
    console.log("Window resized");
    // Adicione qualquer lógica que você queira executar quando a janela for redimensionada
  };

  return (
    //TODO-> Componente principal que renderiza o calendário e outros elementos com base nos estados definidos
    <div className="flex flex-col justify-center items-center">
      {/* //* Botão para mostrar ou esconder o calendário com base na variável calendarVisible */}
      <button
        className="w-96 border-2 border-whiteEdu bg-greenEdu rounded-full p-1 font-bold text-whiteEdu"
        onClick={toggleCalendarVisibility}
      >
        {calendarVisible ? "Fechar Calendário" : "Mostrar Calendário"}
        {/* Se for visivel então o botão recebe o nome de Fechar Calendário mas se não estiver visivel então recebe Mostrar Calendário/* */}
      </button>
      {calendarVisible && (
        //* Renderização do calendário quando calendarVisible é verdadeiro
        <div className="w-full md:w-128 mb-2 border-2 z-30 border-greenEdu bg-whiteEdu mt-1 p-1 ">
          {/* //* FullCalendar component com integração de plugins e configurações */}
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, listPlugin]} //*Aqui você está integrando os plugins necessários para o FullCalendar funcionar corretamente. No seu caso, está utilizando os plugins dayGridPlugin, interactionPlugin e listPlugin.
            customButtons={{
              //*Define botões personalizados para o calendário. No seu código, você tem um botão listViewButton que ao ser clicado altera o estado de isListView, provavelmente para alternar entre visualização de lista e visualização de mês.
              listViewButton: {
                text: "X",
                click: () => setIsListView(!isListView),
              },
            }}
            headerToolbar={{
              //*Configura a barra de ferramentas do calendário, especificando os botões e títulos exibidos. Aqui, você definiu os botões de navegação (prev, next), o título central e o botão personalizado listViewButton.
              left: "prev,next".replace(",", " "),
              center: "title",
              right: "dayGridMonth,listMonth listViewButton".replace(",", " "),
            }}
            buttonText={{
              //* Define os textos exibidos nos botões do calendário para diferentes visualizações, como mês, semana, dia e lista de eventos.
              dayGridMonth: "Mês",
              dayGridWeek: "Semana",
              dayGridDay: "Dia",
              listMonth: "Lista de Eventos",
            }}
            locale={"pt-BR"} //*Define o idioma utilizado no calendário. No seu caso, está definido como "pt-BR" para português do Brasil.
            initialView="dayGridMonth" //*Define a visualização inicial do calendário. Aqui, está configurado para exibir o mês (dayGridMonth) inicialmente.
            selectable={true} //*Permite a seleção de datas no calendário.
            selectMirror={true} //* Mostra um espelho da seleção feita no calendário.
            dayMaxEvents={true} //* Mostra o número máximo de eventos por dia.
            weekends={true} //*Define se os fins de semana devem ser exibidos no calendário.
            events={events} //*Fornece os eventos a serem exibidos no calendário.
            select={handleDateSelect} //*Define a função a ser chamada quando uma data é selecionada no calendário.
            eventContent={renderEventContent} //*Permite personalizar o conteúdo dos eventos exibidos no calendário.
            windowResize={handleWindowResize}
            views={{
              //* Permite configurar diferentes visualizações no calendário. Aqui, você configurou a visualização de lista (list) com um limite de eventos e sem exibição do horário do evento.
              list: {
                eventLimit: true, // Adjust as needed
                displayEventTime: false,
              },
            }}
          />
        </div>
      )}
      {/*//* Modal para confirmação de exclusão de evento */}
      {eventIdToDelete && (
        <div className="flex flex-col w-60 justify-center items-center relative gap-4 -top-72 border-2 p-4 rounded-2xl border-whiteEdu bg-greenEdu text-whiteEdu font-bold drop-shadow-xl">
          <p className="drop-shadow-xl">
            Você tem certeza de que deseja excluir este evento?
          </p>
          <div className="flex gap-4 text-2xl drop-shadow-xl">
            {" "}
            <button onClick={handleConfirmDelete}>Sim</button>
            <button onClick={handleCancelDelete}>Não</button>
          </div>
        </div>
      )}
      {calendarVisible && (
        //* Modal de edição de evento (salvar ou não o evento)
        <div className="relative z-10 -top-72">
          <EventModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleModalSave}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
