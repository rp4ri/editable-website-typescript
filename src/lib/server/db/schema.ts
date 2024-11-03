import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const articles = sqliteTable('articles', {
	article_id: integer('article_id').primaryKey(),
	slug: text('slug').unique().notNull(),
	title: text('title').notNull(),
	teaser: text('teaser').notNull(),
	content: text('content'),
	created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	published_at: text('published_at').default(sql`CURRENT_TIMESTAMP`),
	updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date().toISOString())
});

export const sessions = sqliteTable('sessions', {
	session_id: text('session_id').primaryKey(),
	expires: text('expires').notNull(),
});

export const pages = sqliteTable('pages', {
	page_id: text('page_id').primaryKey(),
	data: text('data').notNull(),
	updated_at: text('updated_at').notNull(),
});

export const counters = sqliteTable('counters', {
	counter_id: text('counter_id').primaryKey(),
	count: integer('count').notNull().default(1),
});

export const assets = sqliteTable('assets', {
	asset_id: text('asset_id').primaryKey(),
	mime_type: text('mime_type').notNull(),
	updated_at: text('updated_at').notNull(),
	size: integer('size').notNull(),
	data: blob('data').notNull(),
});
