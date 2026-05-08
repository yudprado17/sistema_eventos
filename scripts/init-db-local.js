import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

async function init() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('Creando tabla events...');
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

    console.log('Creando tabla attendees...');
    await sql`
      CREATE TABLE IF NOT EXISTS attendees (
        id VARCHAR(255) PRIMARY KEY,
        event_id VARCHAR(255) REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Tablas creadas correctamente.');
  } catch (err) {
    console.error('Error:', err);
  }
}

init();
