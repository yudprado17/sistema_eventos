import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';

const Calendar = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { events } = useEvents();

  const renderHeader = () => {
    return (
      <div className="header row flex-middle flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 glass hover:bg-white-10">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 glass hover:bg-white-10">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return (
      <div className="days row grid grid-cols-7 mb-2">
        {days.map((day, idx) => (
          <div className="col col-center text-center text-text-muted font-semibold text-sm" key={idx}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="body grid grid-cols-7 gap-1">
        {calendarDays.map((day, idx) => {
          const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
          return (
            <div
              key={idx}
              className={`p-4 h-32 glass relative cursor-pointer transition-all hover:border-primary-50 ${
                !isSameMonth(day, monthStart) ? 'opacity-30' : ''
              } ${isSameDay(day, selectedDate) ? 'border-primary bg-primary-5' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              <span className="text-sm font-medium">{format(day, 'd')}</span>
              <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((event, eIdx) => (
                  <Link 
                    key={eIdx} 
                    to={`/event/${event.id}`}
                    className="text-[10px] bg-primary-20 text-primary-light px-1 rounded truncate border border-primary-20 hover:bg-primary-30 transition-colors"
                  >
                    {event.title}
                  </Link>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-[10px] text-text-muted">+{dayEvents.length - 2} más</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="calendar animate-fade">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
