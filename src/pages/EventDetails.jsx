import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { ArrowLeft, UserPlus, Trash2, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, attendees, registerAttendee, removeAttendee } = useEvents();
  
  const event = events.find(e => e.id === id);
  const eventAttendees = attendees.filter(a => a.eventId === id);
  
  const [newAttendee, setNewAttendee] = useState({ name: '', email: '' });

  if (!event) return <div className="container">Evento no encontrado.</div>;

  const handleAddAttendee = (e) => {
    e.preventDefault();
    if (!newAttendee.name || !newAttendee.email) return;
    registerAttendee({ ...newAttendee, eventId: id });
    setNewAttendee({ name: '', email: '' });
  };

  return (
    <div className="container">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Volver al Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass p-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
             <span className="text-xs font-bold text-primary uppercase tracking-widest">{event.category}</span>
             <h1 className="text-4xl font-bold mt-2 mb-4">{event.title}</h1>
             <p className="text-text-muted leading-relaxed">{event.description}</p>
             
             <div className="mt-8 flex gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase">Fecha</span>
                  <span className="font-semibold">{format(new Date(event.date), "PPP", { locale: es })}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase">Asistentes</span>
                  <span className="font-semibold">{eventAttendees.length} registrados</span>
                </div>
             </div>
          </div>

          <div className="glass p-8">
            <h2 className="text-2xl font-bold mb-6">Lista de Asistentes</h2>
            <div className="flex flex-col gap-4">
              {eventAttendees.length === 0 ? (
                <p className="text-text-muted italic">No hay asistentes registrados aún.</p>
              ) : (
                eventAttendees.map(a => (
                  <div key={a.id} className="flex justify-between items-center p-4 rounded-lg bg-white-5 border border-white-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-20 flex items-center justify-center text-primary font-bold">
                        {a.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{a.name}</p>
                        <p className="text-xs text-text-muted">{a.email}</p>
                      </div>
                    </div>
                    <button onClick={() => removeAttendee(a.id)} className="text-text-muted hover:text-danger p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-primary" /> Registrar Asistente
            </h3>
            <form onSubmit={handleAddAttendee} className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-text-muted uppercase mb-1 block">Nombre Completo</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    className="pl-10"
                    placeholder="Nombre"
                    value={newAttendee.name}
                    onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-text-muted uppercase mb-1 block">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="email" 
                    className="pl-10"
                    placeholder="correo@ejemplo.com"
                    value={newAttendee.email}
                    onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary py-3 mt-2">
                Añadir a la lista
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
