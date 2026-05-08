import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  try {
    const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
    
    // Create Events Table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(255) NOT NULL,
        time VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create Attendees Table
    await sql`
      CREATE TABLE IF NOT EXISTS attendees (
        id VARCHAR(255) PRIMARY KEY,
        event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return response.status(200).json({ message: 'Base de datos inicializada correctamente en Vercel Postgres/Neon' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return response.status(500).json({ error: 'Fallo al inicializar la base de datos', details: error.message });
  }
}
