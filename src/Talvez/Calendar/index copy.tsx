import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarComponent: React.FC = () => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendar = useRef<Calendar>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState([
    {
      title: "Evento 1",
      start: "2022-01-01",
      backgroundColor: "green",
      editable: true,
    },
    {
      title: "Evento 2",
      start: "2022-01-05",
      backgroundColor: "green",
      editable: true,
    },
  ]);

  useEffect(() => {
    if (showCalendar) {
      calendar.current = new Calendar(calendarRef.current!, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        locale: "pt-BR",
        customButtons: {
          customPrev: {
            text: "<",
            click: function () {
              calendar.current?.prev();
            },
          },
          customNext: {
            text: ">",
            click: function () {
              calendar.current?.next();
            },
          },
        },
        headerToolbar: {
          left: "customPrev",
          center: "title",
          right: "customNext",
        },
        events: events,
      });

      calendar.current.render();

      return () => {
        calendar.current?.destroy();
      };
    }
  }, [showCalendar, events]);
  const addEventToList = (title: string, date: string) => {
    const newEvent = {
      title,
      start: date,
      backgroundColor: "green",
      editable: true,
    };
    setEvents([...events, newEvent]);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div className="w-96 flex flex-col justify-center ml-60">
      <button
        onClick={toggleCalendar}
        className="text-whiteEdu font-bold text-xl w-44 bg-greenEdu border-2 border-whiteEdu rounded-full text-center"
      >
        Calendário
      </button>
      <div>
        <div>
          <input type="text" placeholder="Event Title" />
          <input type="date" />
          <button onClick={() => addEventToList("New Event", "2022-01-15")}>
            Add Event
          </button>
        </div>
        <div ref={calendarRef}></div>
      </div>
      {showCalendar && (
        <div
          className="-ml-60 uppercase bg-whiteEdu border-2 p-5 mt-5 border-greenEdu "
          ref={calendarRef}
        ></div>
      )}
    </div>
  );
};

export default CalendarComponent;
