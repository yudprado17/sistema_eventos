import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import EventForm from '../components/EventForm';
import { useEvents } from '../context/EventContext';
import { Plus, Calendar as CalendarIcon, Users, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { events, deleteEvent } = useEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="container animate-in">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gradient">
            Gestión de Eventos
          </h1>
          <p className="text-muted mt-2">Organiza tus actividades con elegancia y precisión.</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary">
          <Plus size={20} /> Nuevo Evento
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-2">
          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CalendarIcon size={20} className="text-primary" /> Próximos Eventos
            </h3>
            <div className="flex flex-col gap-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted text-sm italic">No hay eventos programados.</p>
              ) : (
                upcomingEvents.slice(0, 5).map(event => (
                  <div key={event.id} className="p-4 rounded-lg bg-white-5 border border-white-5 hover:border-white-10 transition-colors glass-hover">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/event/${event.id}`} className="hover:text-primary transition-colors">
                          <h4 className="font-semibold text-white truncate">{event.title}</h4>
                        </Link>
                        <p className="text-xs text-muted uppercase mt-1">
                          {format(new Date(event.date), "PPP", { locale: es })}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button onClick={() => handleEdit(event)} className="btn-icon">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteEvent(event.id)} className="btn-icon danger">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users size={20} className="text-primary" /> Estadísticas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white-5 text-center border border-white-5">
                <span className="block text-3xl font-bold text-white">{events.length}</span>
                <span className="text-xs text-muted uppercase font-semibold">Eventos</span>
              </div>
              <div className="p-4 rounded-2xl bg-white-5 text-center border border-white-5">
                <span className="block text-3xl font-bold text-primary">
                  {upcomingEvents.length}
                </span>
                <span className="text-xs text-muted uppercase font-semibold">Activos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="w-full max-w-md animate-fade">
            <EventForm 
              event={editingEvent} 
              onClose={() => setShowForm(false)} 
              selectedDate={selectedDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
