import { getAsset } from '$lib/api';
import { error } from '@sveltejs/kit';

export const GET = async ({ params, setHeaders }) => {
	const path = params.path as string;
	const file = await getAsset(path);

	if (!file || !file.data) {
		throw error(404, 'Asset not found');
	}

	// Set response headers
	setHeaders({
		'Content-Type': file.mimeType,
		'Content-Length': file.size.toString(),
		'Last-Modified': new Date(file.lastModified).toUTCString(),
		'Cache-Control': 'public, max-age=600'
	});

	return new Response(file.data);
};
