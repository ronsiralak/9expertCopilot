import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const shortenedLinks = pgTable(
  "shortened_links",
  {
    shortCode: text("short_code").primaryKey(),
    url: text("url").notNull(),
    clerkUserId: text("clerk_user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => [index("shortened_links_clerk_user_id_idx").on(table.clerkUserId)],
);
