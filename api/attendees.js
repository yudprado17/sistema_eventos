import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);

  try {
    if (req.method === 'GET') {
      const attendees = await sql`SELECT * FROM attendees ORDER BY created_at DESC`;
      // Map event_id to eventId for frontend compatibility
      const formattedAttendees = attendees.map(a => ({
        ...a,
        eventId: a.event_id
      }));
      return res.status(200).json(formattedAttendees);
    } 
    
    if (req.method === 'POST') {
      const { id, eventId, name, email } = req.body;
      const newAttendee = await sql`
        INSERT INTO attendees (id, event_id, name, email)
        VALUES (${id}, ${eventId}, ${name}, ${email})
        RETURNING *
      `;
      const formattedAttendee = { ...newAttendee[0], eventId: newAttendee[0].event_id };
      return res.status(201).json(formattedAttendee);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM attendees WHERE id = ${id}`;
      return res.status(200).json({ message: 'Attendee deleted successfully' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Database Error in attendees.js:', error);
    return res.status(500).json({ error: 'Database operation failed', details: error.message });
  }
}
