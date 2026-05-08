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
    <div className="container">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-title">
            Gestión de Eventos
          </h1>
          <p className="text-text-muted mt-2">Organiza tus actividades con elegancia.</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Nuevo Evento
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon size={20} className="text-primary" /> Próximos Eventos
            </h3>
            <div className="flex flex-col gap-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-text-muted text-sm italic">No hay eventos programados.</p>
              ) : (
                upcomingEvents.slice(0, 5).map(event => (
                  <div key={event.id} className="p-4 rounded-lg bg-white-5 border border-white-5 hover:border-white-10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/event/${event.id}`} className="hover:text-primary transition-colors">
                          <h4 className="font-semibold text-white">{event.title}</h4>
                        </Link>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider">
                          {format(new Date(event.date), "PPP", { locale: es })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(event)} className="text-text-muted hover:text-white">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteEvent(event.id)} className="text-text-muted hover:text-danger">
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
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users size={20} className="text-primary" /> Estadísticas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white-5 text-center">
                <span className="block text-2xl font-bold">{events.length}</span>
                <span className="text-[10px] text-text-muted uppercase">Eventos</span>
              </div>
              <div className="p-4 rounded-lg bg-white-5 text-center">
                <span className="block text-2xl font-bold">
                  {upcomingEvents.length}
                </span>
                <span className="text-[10px] text-text-muted uppercase">Activos</span>
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
