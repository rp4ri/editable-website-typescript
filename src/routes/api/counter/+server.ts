import { createOrUpdateCounter } from '$lib/api';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
  const counterId = url.searchParams.get('c');
  if (!counterId) {
    return json({ error: 'counter_id is required' }, { status: 400 });
  }
  return json(await createOrUpdateCounter(counterId));
}
