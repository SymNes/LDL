import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const players = sqliteTable('players', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  photoUrl: text('photo_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const events = sqliteTable('events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['saison-solo', 'saison-equipe', 'tournois-solo', 'tournois-equipe', 'celebration'] }).notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  season: text('season').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const stats = sqliteTable('stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playerId: integer('player_id').notNull().references(() => players.id, { onDelete: 'cascade' }),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  points: integer('points').notNull().default(0),
  wins: integer('wins').notNull().default(0),
  losses: integer('losses').notNull().default(0),
  bullseyes: integer('bullseyes').notNull().default(0),
  triples: integer('triples').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Relations
export const playersRelations = relations(players, ({ many }) => ({
  stats: many(stats),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  stats: many(stats),
}));

export const statsRelations = relations(stats, ({ one }) => ({
  player: one(players, {
    fields: [stats.playerId],
    references: [players.id],
  }),
  event: one(events, {
    fields: [stats.eventId],
    references: [events.id],
  }),
}));

export type Player = typeof players.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Stat = typeof stats.$inferSelect;
