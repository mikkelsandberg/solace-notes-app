'use server';

import { db } from '@/db/dbConfig';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import sanitizeHtml from 'sanitize-html';

const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull(),
  content: varchar('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Note = typeof notes.$inferSelect;

export async function getAllNotesForUser(userId: string) {
  return await db.select().from(notes).where(eq(notes.userId, userId)).orderBy(desc(notes.updatedAt));
}

export async function searchNotesForUser(userId: string, query: string) {
  return await db.select().from(notes).where(and(
    eq(notes.userId, userId),
    or(
      sql`to_tsvector(${notes.content}) @@ to_tsquery(${query.trim().split(' ').join(' & ')})`,
      ilike(notes.content, `%${query}%`),
    ),
  )).orderBy(desc(notes.updatedAt));
}

export async function createNoteForUser(userId: string, content: string) {
  const sanitizedContent = sanitizeHtml(content);

  await db.insert(notes).values({ userId, content: sanitizedContent });
}

export async function updateNoteById(id: number, content: string) {
  const sanitizedContent = sanitizeHtml(content);
  const now = new Date();

  await db.update(notes).set({ content: sanitizedContent, updatedAt: now }).where(eq(notes.id, id));
}

export async function deleteNoteById(id: number) {
  await db.delete(notes).where(eq(notes.id, id));
}