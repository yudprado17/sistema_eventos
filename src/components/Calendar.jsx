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
      <div className="flex justify-between items-center mb-8 px-4">
        <h2 className="text-2xl font-bold capitalize text-gradient">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <div className="flex gap-3">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-icon">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-icon">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day, idx) => (
          <div className="text-center text-muted font-bold text-tiny uppercase tracking-widest opacity-60" key={idx}>
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
      <div className="calendar-grid">
        {calendarDays.map((day, idx) => {
          const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={idx}
              className={`calendar-cell relative cursor-pointer transition-all ${
                !isCurrentMonth ? 'opacity-20 grayscale' : ''
              } ${isSelected ? 'bg-primary/10' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              <div className="flex justify-end mb-1">
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                  isSelected ? 'bg-primary text-white' : isSameDay(day, new Date()) ? 'bg-accent text-bg-dark' : 'text-muted'
                }`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event, eIdx) => (
                  <Link 
                    key={eIdx} 
                    to={`/event/${event.id}`}
                    className="text-tiny badge-primary px-1.5 py-0.5 rounded-md truncate hover:brightness-125 transition-all"
                  >
                    {event.title}
                  </Link>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-tiny text-muted font-semibold pl-1">+{dayEvents.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
