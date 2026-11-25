import { drizzle } from "drizzle-orm/neon-http";
import { getDatabase } from "../lib/db";

export const db = drizzle(getDatabase());
