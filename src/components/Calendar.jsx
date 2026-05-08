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
          <div className="text-center text-muted font-bold text-xs uppercase tracking-widest" key={idx}>
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
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div
              key={idx}
              className={`p-3 min-h-[120px] glass relative cursor-pointer transition-all ${
                !isCurrentMonth ? 'opacity-20 grayscale' : 'glass-hover'
              } ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''}`}
              onClick={() => onDateSelect(day)}
            >
              <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-white'}`}>
                {format(day, 'd')}
              </span>
              <div className="mt-2 flex flex-col gap-sm overflow-hidden">
                {dayEvents.slice(0, 3).map((event, eIdx) => (
                  <Link 
                    key={eIdx} 
                    to={`/event/${event.id}`}
                    className="text-[10px] badge-primary px-2 py-xs rounded-md truncate hover:brightness-125 transition-all"
                  >
                    {event.title}
                  </Link>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[9px] text-muted font-semibold pl-1">+{dayEvents.length - 3} más</span>
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
