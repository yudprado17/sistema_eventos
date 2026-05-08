import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import { X, Calendar, Type, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';

const EventForm = ({ event, onClose, selectedDate }) => {
  const { addEvent, updateEvent } = useEvents();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(selectedDate || new Date(), 'yyyy-MM-dd'),
    time: '12:00',
    location: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date,
        time: event.time || '12:00',
        location: event.location || ''
      });
    }
  }, [event]);

  const sanitizeInput = (str) => {
    return str ? str.replace(/<[^>]*>?/gm, '') : '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const sanitizedData = {
      ...formData,
      title: sanitizeInput(formData.title),
      description: sanitizeInput(formData.description),
      location: sanitizeInput(formData.location)
    };

    if (event) {
      updateEvent(event.id, sanitizedData);
    } else {
      addEvent(sanitizedData);
    }
    onClose();
  };

  return (
    <div className="glass p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 btn-icon"
      >
        <X size={18} />
      </button>

      <h2 className="text-2xl font-bold mb-8 text-gradient">
        {event ? 'Editar Evento' : 'Nuevo Evento'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="text-xs font-bold text-muted uppercase mb-2 block flex items-center gap-2 tracking-widest">
            <Type size={14} className="text-primary" /> Título
          </label>
          <input 
            type="text" 
            placeholder="Nombre del evento..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block flex items-center gap-2 tracking-widest">
              <Calendar size={14} className="text-primary" /> Fecha
            </label>
            <input 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block flex items-center gap-2 tracking-widest">
              <span className="text-primary">🕒</span> Hora
            </label>
            <input 
              type="time" 
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted uppercase mb-2 block flex items-center gap-2 tracking-widest">
            <span className="text-primary">📍</span> Ubicación
          </label>
          <input 
            type="text" 
            placeholder="Lugar del evento..."
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted uppercase mb-2 block flex items-center gap-2 tracking-widest">
            <AlignLeft size={14} className="text-primary" /> Descripción
          </label>
          <textarea 
            rows="3"
            placeholder="Detalles adicionales..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" className="btn-primary flex-1">
            {event ? 'Actualizar' : 'Crear Evento'}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="btn-icon flex-1"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
