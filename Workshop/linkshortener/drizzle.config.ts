import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',          // โฟลเดอร์เก็บ migration files
  schema: './db/schema.ts',  // ไฟล์ schema ของ database
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});