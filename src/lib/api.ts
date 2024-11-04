import { db } from './server/db';
import { articles, sessions, pages, counters, assets } from './server/db/schema';
import { nanoid } from '$lib/utils';
import { ADMIN_PASSWORD } from '$env/static/private';
import slugify from 'slugify';
import { eq, lt, isNotNull, desc, sql, gt, ne, and } from 'drizzle-orm';
import { SHORTCUTS } from './constants';
import type { CurrentUser } from '$lib/types/user';
import type { PageEditor } from './types/pages';

/**
 * Creates a new article
 */
export async function createArticle(
	title: string,
	content: string,
	teaser: string,
	currentUser: CurrentUser
) {
	if (!currentUser) throw new Error('Not authorized');

	let slug = slugify(title, { lower: true, strict: true });

	// Check if slug is already used
	const articleExists = await db.select().from(articles).where(eq(articles.slug, slug));

	if (articleExists.length > 0) {
		slug = `${slug}-${nanoid()}`;
	}

	await db.insert(articles).values({
		slug,
		title,
		content,
		teaser,
		published_at: new Date().toISOString(),
		created_at: new Date().toISOString()
	});

	const newArticle = await db
		.select({ slug: articles.slug, created_at: articles.created_at })
		.from(articles)
		.where(eq(articles.slug, slug));

	return newArticle[0];
}

/**
 * Updates an article
 */
export async function updateArticle(
	slug: string,
	title: string,
	content: string,
	teaser: string,
	currentUser: CurrentUser
) {
	if (!currentUser) throw new Error('Not authorized');

	await db
		.update(articles)
		.set({
			title,
			content,
			teaser,
			updated_at: new Date().toISOString()
		})
		.where(eq(articles.slug, slug));

	const updatedArticle = await db
		.select({ slug: articles.slug, updated_at: articles.updated_at })
		.from(articles)
		.where(eq(articles.slug, slug));

	return updatedArticle[0];
}

/**
 * Authentication
 */
export async function authenticate(password: string, sessionTimeout: number) {
	const expires = __getDateTimeMinutesAfter(sessionTimeout);
	if (password === ADMIN_PASSWORD) {
		const sessionId = nanoid();

		// Delete expired sessions
		await db.delete(sessions).where(lt(sessions.expires, new Date().toISOString()));

		// Insert new session
		await db.insert(sessions).values({
			session_id: sessionId,
			expires: expires
		});

		return { sessionId };
	} else {
		throw new Error('Authentication failed.');
	}
}

/**
 * Destroy session
 */
export async function destroySession(sessionId: string) {
	await db.delete(sessions).where(eq(sessions.session_id, sessionId));
	return true;
}

/**
 * Get all articles
 */
export async function getArticles(currentUser: CurrentUser) {
	let articlesData;
	if (currentUser) {
		articlesData = await db
			.select()
			.from(articles)
			.orderBy(
				desc(
					sql`COALESCE(${articles.published_at}, ${articles.updated_at}, ${articles.created_at})`
				)
			);
	} else {
		articlesData = await db
			.select()
			.from(articles)
			.where(isNotNull(articles.published_at))
			.orderBy(desc(articles.published_at));
	}
	return articlesData;
}

/**
 * Get the next article by slug
 */
export async function getNextArticle(slug: string) {
	// Get the published_at of the current article
	const currentArticle = await db
		.select({ published_at: articles.published_at })
		.from(articles)
		.where(eq(articles.slug, slug))
		.limit(1);

	if (currentArticle.length === 0) {
		throw new Error('Article not found');
	}

	const publishedAt = currentArticle[0].published_at;

	if (!publishedAt) {
		throw new Error('Article has no published date');
	}

	// Try to find the previous article
	let nextArticle = await db
		.select({
			title: articles.title,
			teaser: articles.teaser,
			slug: articles.slug,
			published_at: articles.published_at
		})
		.from(articles)
		.where(and(isNotNull(articles.published_at), lt(articles.published_at, publishedAt)))
		.orderBy(desc(articles.published_at))
		.limit(1);

	if (nextArticle.length === 0) {
		// If no previous article, get the latest article excluding the current one
		nextArticle = await db
			.select({
				title: articles.title,
				teaser: articles.teaser,
				slug: articles.slug,
				published_at: articles.published_at
			})
			.from(articles)
			.where(and(isNotNull(articles.published_at), ne(articles.slug, slug)))
			.orderBy(desc(articles.published_at))
			.limit(1);
	}

	return nextArticle[0] || null;
}

/**
 * Search articles
 */

interface SearchResult {
	name: string;
	url: string;
	modified_at: string | null;
}

interface Shortcut {
	name: string;
	url: string;
}

export async function search(q: string, currentUser: CurrentUser): Promise<SearchResult[]> {
	const searchTerm = `%${q}%`;
	const modifiedAt = sql`COALESCE(${articles.published_at}, ${articles.updated_at}, ${articles.created_at})`;

	const urlExpression = sql<string>`'/blog/' || ${articles.slug}`;

	const baseQuery = db
		.select({
			name: articles.title,
			url: urlExpression.as('url'),
			modified_at: modifiedAt.as('modified_at')
		})
		.from(articles);

	const results = await (
		currentUser
			? baseQuery.where(sql`${articles.title} LIKE ${searchTerm} COLLATE NOCASE`)
			: baseQuery.where(
					and(
						sql`${articles.title} LIKE ${searchTerm} COLLATE NOCASE`,
						isNotNull(articles.published_at)
					)
				)
	).orderBy(desc(modifiedAt));

	const rows: SearchResult[] = results.map((result) => ({
		name: result.name,
		url: result.url,
		modified_at: result.modified_at as string | null
	}));

	SHORTCUTS.forEach((shortcut: Shortcut) => {
		if (shortcut.name.toLowerCase().includes(q.toLowerCase())) {
			rows.push({
				name: shortcut.name,
				url: shortcut.url,
				modified_at: null
			});
		}
	});

	return rows;
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string) {
	const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);

	return result[0] || null;
}

/**
 * Delete article
 */
export async function deleteArticle(slug: string, currentUser: CurrentUser) {
	if (!currentUser) throw new Error('Not authorized');

	const result = await db.delete(articles).where(eq(articles.slug, slug));

	const affectedRows = result.rowsAffected;
	return affectedRows > 0;
}

/**
 * Get current user by session
 */
export async function getCurrentUser(session_id: string) {
	const result = await db
		.select({
			session_id: sessions.session_id,
			expires: sessions.expires
		})
		.from(sessions)
		.where(and(eq(sessions.session_id, session_id), gt(sessions.expires, new Date().toISOString())))
		.limit(1);

	return result.length ? { name: 'Admin' } : null;
}

/**
 * Create or update page
 */
export async function createOrUpdatePage(
	page_id: string,
	page: PageEditor,
	currentUser: CurrentUser
) {
	if (!currentUser) throw new Error('Not authorized');

	const pageExists = await db
		.select({ page_id: pages.page_id })
		.from(pages)
		.where(eq(pages.page_id, page_id))
		.limit(1);

	const updated_at = new Date().toISOString();

	if (pageExists.length > 0) {
		await db
			.update(pages)
			.set({
				data: JSON.stringify(page),
				updated_at
			})
			.where(eq(pages.page_id, page_id));

		return { page_id };
	} else {
		await db.insert(pages).values({
			page_id,
			data: JSON.stringify(page),
			updated_at
		});

		return { page_id };
	}
}

/**
 * Get page by ID
 */
export async function getPage(page_id: string) {
	const result = await db
		.select({ data: pages.data })
		.from(pages)
		.where(eq(pages.page_id, page_id))
		.limit(1);

	if (result.length > 0) {
		return JSON.parse(result[0].data);
	} else {
		return null;
	}
}

/**
 * Create or update counter
 */
export async function createOrUpdateCounter(counter_id: string) {
	const counterExists = await db
		.select({ counter_id: counters.counter_id })
		.from(counters)
		.where(eq(counters.counter_id, counter_id))
		.limit(1);

	if (counterExists.length > 0) {
		await db
			.update(counters)
			.set({ count: sql`${counters.count} + 1` })
			.where(eq(counters.counter_id, counter_id));

		const updatedCounter = await db
			.select({ count: counters.count })
			.from(counters)
			.where(eq(counters.counter_id, counter_id))
			.limit(1);

		return updatedCounter[0];
	} else {
		await db.insert(counters).values({ counter_id, count: 1 });

		return { count: 1 };
	}
}

/**
 * Store an asset
 */
export async function storeAsset(asset_id: string, file: File) {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	await db
		.insert(assets)
		.values({
			asset_id,
			mime_type: file.type,
			updated_at: new Date().toISOString(),
			size: file.size,
			data: buffer
		})
		.onConflictDoUpdate({
			target: assets.asset_id,
			set: {
				mime_type: sql`excluded.mime_type`,
				updated_at: sql`excluded.updated_at`,
				size: sql`excluded.size`,
				data: sql`excluded.data`
			}
		});
}

/**
 * Get asset by ID
 */
export async function getAsset(asset_id: string) {
	const result = await db
		.select({
			asset_id: assets.asset_id,
			mime_type: assets.mime_type,
			updated_at: assets.updated_at,
			size: assets.size,
			data: assets.data
		})
		.from(assets)
		.where(eq(assets.asset_id, asset_id))
		.limit(1);

	if (result.length > 0) {
		const row = result[0];

		const blobData = new Uint8Array(row.data as ArrayBuffer);

		return {
			filename: row.asset_id.split('/').slice(-1)[0],
			mimeType: row.mime_type,
			lastModified: row.updated_at,
			size: row.size,
			data: new Blob([blobData], { type: row.mime_type })
		};
	} else {
		return null;
	}
}

/**
 * Helpers
 */
function __getDateTimeMinutesAfter(minutes: number): string {
	return new Date(Date.now() + minutes * 60000).toISOString();
}
