import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const events = await sql`SELECT * FROM events ORDER BY date ASC, time ASC`;
      return res.status(200).json(events);
    } 
    
    if (req.method === 'POST') {
      const { id, title, date, time, location, description } = req.body;
      const newEvent = await sql`
        INSERT INTO events (id, title, date, time, location, description)
        VALUES (${id}, ${title}, ${date}, ${time}, ${location}, ${description})
        RETURNING *
      `;
      return res.status(201).json(newEvent[0]);
    }

    if (req.method === 'PUT') {
      const { id, title, date, time, location, description } = req.body;
      const updatedEvent = await sql`
        UPDATE events
        SET title = ${title}, date = ${date}, time = ${time}, location = ${location}, description = ${description}
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json(updatedEvent[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM events WHERE id = ${id}`;
      return res.status(200).json({ message: 'Event deleted successfully' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Database Error in events.js:', error);
    return res.status(500).json({ error: 'Database operation failed', details: error.message });
  }
}
