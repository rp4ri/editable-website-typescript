import { json } from '@sveltejs/kit';
import { storeAsset } from '$lib/api';

export async function PUT({ request }: { request: Request }) {
  const data = await request.formData();
  const asset_id = data.get('path') as string | null;
  const file = data.get('file') as File | null;

  if (!asset_id || !file) {
    return json({ error: 'Invalid data' }, { status: 400 });
  }

  // console.log(
  //   file.name, // filename
  //   file.type, // mime type
  //   file.size, // file size in bytes
  //   file.lastModified, // last modified date
  //   await file.arrayBuffer() // ArrayBuffer with the file contents
  // );

  await storeAsset(asset_id, file);
  return json({ path: asset_id });
}
