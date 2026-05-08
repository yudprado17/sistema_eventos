import React, { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within an EventProvider');
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales desde Postgres a través de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, attendeesRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/attendees')
        ]);
        
        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (attendeesRes.ok) setAttendees(await attendeesRes.json());
      } catch (error) {
        console.error('Error fetching data from Postgres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addEvent = async (event) => {
    // Generamos el ID en el cliente para actualización optimista o lo hace la BD
    const id = Date.now().toString(); 
    const newEvent = { ...event, id };
    
    // Optimistic update
    setEvents([...events, newEvent]);

    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
    } catch (error) {
      console.error('Error adding event:', error);
      // Revert in case of failure (simplified)
    }
  };

  const updateEvent = async (id, updatedEvent) => {
    // Optimistic update
    setEvents(events.map(e => e.id === id ? { ...updatedEvent, id } : e));

    try {
      await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedEvent, id })
      });
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (id) => {
    // Optimistic update
    setEvents(events.filter(e => e.id !== id));
    setAttendees(attendees.filter(a => a.eventId !== id));

    try {
      await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const registerAttendee = async (attendee) => {
    const id = Date.now().toString();
    const newAttendee = { ...attendee, id };
    
    // Optimistic update
    setAttendees([...attendees, newAttendee]);

    try {
      await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAttendee)
      });
    } catch (error) {
      console.error('Error registering attendee:', error);
    }
  };

  const removeAttendee = async (id) => {
    // Optimistic update
    setAttendees(attendees.filter(a => a.id !== id));

    try {
      await fetch(`/api/attendees?id=${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error removing attendee:', error);
    }
  };

  return (
    <EventContext.Provider value={{ 
      events, 
      loading,
      addEvent, 
      updateEvent, 
      deleteEvent,
      attendees,
      registerAttendee,
      removeAttendee
    }}>
      {children}
    </EventContext.Provider>
  );
};
