import { db } from '@/db/dbConfig';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { eq } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 64 }).notNull().unique(),
  displayName: varchar('display_name', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }).notNull(),
});

export type User = typeof users.$inferSelect;

export async function getUser(username: string) {
  return await db.select().from(users).where(eq(users.username, username));
}

export async function createUser(username: string, displayName: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({username, displayName, password: hash });
}