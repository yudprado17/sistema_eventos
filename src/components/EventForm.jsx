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
    category: 'General'
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        category: event.category || 'General'
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
      description: sanitizeInput(formData.description)
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
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-white"
      >
        <X size={20} />
      </button>

      <h2 className="text-2xl font-bold mb-6">
        {event ? 'Editar Evento' : 'Crear Nuevo Evento'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-2 block flex items-center gap-2">
            <Type size={14} /> Título del Evento
          </label>
          <input 
            type="text" 
            placeholder="Ej. Conferencia Anual"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-2 block flex items-center gap-2">
            <Calendar size={14} /> Fecha
          </label>
          <input 
            type="date" 
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-2 block flex items-center gap-2">
            <AlignLeft size={14} /> Descripción
          </label>
          <textarea 
            rows="3"
            placeholder="Detalles del evento..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-muted uppercase mb-2 block">Categoría</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="General">General</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Social">Social</option>
            <option value="Importante">Importante</option>
          </select>
        </div>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="btn-primary flex-1 py-3">
            {event ? 'Guardar Cambios' : 'Crear Evento'}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 py-3 glass hover:bg-white-10 text-text-muted"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
