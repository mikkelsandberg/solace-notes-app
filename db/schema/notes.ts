'use server';

import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { db } from '@/db/dbConfig';
import { desc, eq } from 'drizzle-orm';

const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull(),
  content: varchar('content', { length: 300 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Note = typeof notes.$inferSelect;

export async function getAllNotesForUser(userId: string) {
  return await db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt));
}

export async function createNoteForUser(userId: string, content: string) {
  await db.insert(notes).values({userId, content});
}