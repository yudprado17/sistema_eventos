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

  if (!event) return <div className="container text-center py-20 animate-in">Evento no encontrado.</div>;

  const handleAddAttendee = (e) => {
    e.preventDefault();
    if (!newAttendee.name || !newAttendee.email) return;
    registerAttendee({ ...newAttendee, eventId: id });
    setNewAttendee({ name: '', email: '' });
  };

  return (
    <div className="container animate-in">
      <button 
        onClick={() => navigate('/')} 
        className="btn-icon mb-8"
      >
        <ArrowLeft size={18} /> Volver al Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass p-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
             <div className="flex justify-between items-start mb-4">
                <span className="badge badge-primary">Evento Activo</span>
                <span className="text-xs text-muted font-bold tracking-widest uppercase">ID: {event.id.slice(0, 8)}</span>
             </div>
             <h1 className="text-4xl font-bold mb-4 text-gradient">{event.title}</h1>
             <p className="text-muted leading-relaxed text-lg mb-8">{event.description || 'Sin descripción adicional.'}</p>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white-5 pt-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">📅 Fecha</span>
                  <span className="font-semibold text-white">{format(new Date(event.date), "PPP", { locale: es })}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">🕒 Hora</span>
                  <span className="font-semibold text-white">{event.time}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">📍 Ubicación</span>
                  <span className="font-semibold text-white">{event.location || 'No especificada'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">👥 Registro</span>
                  <span className="font-semibold text-primary">{eventAttendees.length} personas</span>
                </div>
             </div>
          </div>

          <div className="glass p-8">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <User size={24} className="text-primary" /> Lista de Asistentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventAttendees.length === 0 ? (
                <p className="text-muted italic col-span-2 py-10 text-center glass bg-white-5">Todavía no hay nadie registrado en este evento.</p>
              ) : (
                eventAttendees.map(a => (
                  <div key={a.id} className="flex justify-between items-center p-4 rounded-2xl bg-white-5 border border-white-5 glass-hover">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">
                        {a.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white">{a.name}</p>
                        <p className="text-xs text-muted">{a.email}</p>
                      </div>
                    </div>
                    <button onClick={() => removeAttendee(a.id)} className="btn-icon danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass p-8 sticky top-8">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <UserPlus size={22} className="text-primary" /> Registrarse
            </h3>
            <form onSubmit={handleAddAttendee} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-muted uppercase mb-2 block tracking-widest">Nombre Completo</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Tu nombre"
                    value={newAttendee.name}
                    onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase mb-2 block tracking-widest">Email Profesional</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="correo@ejemplo.com"
                    value={newAttendee.email}
                    onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-4">
                Confirmar Registro
              </button>
              <p className="text-[10px] text-center text-muted mt-2">Al registrarte, confirmas tu asistencia a este evento.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
;

export default EventDetails;
