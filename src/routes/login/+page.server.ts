import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { authenticate } from '$lib/api';

export const actions: Actions = {
	default: async ({ cookies, request }: RequestEvent) => {
		const data = await request.formData();
		const password = data.get('password');

		if (!password || typeof password !== 'string') {
			return fail(400, { incorrect: true });
		}
		const sessionTimeout = 60 * 24 * 7;

		try {
			const { sessionId } = await authenticate(password, sessionTimeout);

			console.log('... sessionId', sessionId);

			cookies.set('sessionid', sessionId, {
				path: '/',
				maxAge: sessionTimeout * 60
			});
		} catch (err) {
			console.error(err);
			return fail(400, { incorrect: true });
		}

		throw redirect(303, '/');
	}
} satisfies Actions;
