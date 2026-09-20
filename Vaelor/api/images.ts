import { createClient } from '@supabase/supabase-js';

const bucket = 'portfolio-images';
const slots = ['velora', 'nimble', 'flux'] as const;
type Slot = (typeof slots)[number];
type ImageMap = Record<Slot, string | null>;
type ServerClient = ReturnType<typeof createClient>;

const emptyImages: ImageMap = { velora: null, nimble: null, flux: null };

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

function getServerClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function isSlot(value: string): value is Slot {
  return slots.includes(value as Slot);
}

async function readImages(client: ServerClient): Promise<ImageMap> {
  const { data } = await client.from('site_settings').select('value').eq('key', 'selected_direction_images').maybeSingle();
  if (!data?.value || typeof data.value !== 'object') return emptyImages;
  return { ...emptyImages, ...(data.value as Partial<ImageMap>) };
}

async function writeImages(client: ServerClient, images: ImageMap) {
  return client.from('site_settings').upsert({
    key: 'selected_direction_images',
    value: images,
    updated_at: new Date().toISOString(),
  });
}

export async function GET(request: Request) {
  const client = getServerClient();
  if (!client) return json({ error: 'Server storage is not configured.' }, 503);

  const { searchParams } = new URL(request.url);
  if (searchParams.get('action') === 'list') {
    const { data, error } = await client.storage.from(bucket).list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'updated_at', order: 'desc' },
    });
    if (error) return json({ error: error.message }, 500);
    const files = (data ?? []).map(file => {
      const { data: publicData } = client.storage.from(bucket).getPublicUrl(file.name);
      const size = file.metadata && typeof file.metadata === 'object' ? (file.metadata as Record<string, unknown>).size : null;
      return {
        name: file.name,
        url: publicData.publicUrl,
        size: typeof size === 'number' ? size : null,
        updatedAt: file.updated_at ?? null,
      };
    });
    return json({ files });
  }

  return json(await readImages(client));
}

export async function POST(request: Request) {
  const client = getServerClient();
  if (!client) return json({ error: 'Server storage is not configured.' }, 503);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Invalid upload request.' }, 400);
  }

  const action = String(form.get('action') || 'upload');

  if (action === 'assign') {
    const slot = String(form.get('slot') || '');
    const url = String(form.get('url') || '');
    if (!isSlot(slot)) return json({ error: 'Invalid image slot.' }, 400);
    if (!url || !url.includes(`/${bucket}/`)) return json({ error: 'URL is not a library image.' }, 400);
    const images = await readImages(client);
    images[slot] = `${url.split('?')[0]}?v=${Date.now()}`;
    const { error: settingsError } = await writeImages(client, images);
    if (settingsError) return json({ error: settingsError.message }, 500);
    return json({ images });
  }

  const slot = String(form.get('slot') || '');
  const file = form.get('file');

  if (!isSlot(slot)) return json({ error: 'Invalid image slot.' }, 400);
  if (!(file instanceof File)) return json({ error: 'Please upload an image.' }, 400);

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) return json({ error: 'Use JPG, PNG or WebP.' }, 400);
  if (file.size > 3 * 1024 * 1024) return json({ error: 'Image must be 3 MB or smaller.' }, 400);

  const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
  const path = `${slot}.${extension}`;
  const binary = Buffer.from(await file.arrayBuffer());

  const existing = await client.storage.getBucket(bucket);
  if (existing.error) {
    const created = await client.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 3 * 1024 * 1024,
      allowedMimeTypes: allowed,
    });
    if (created.error && !created.error.message.toLowerCase().includes('already')) {
      return json({ error: `Could not create image storage: ${created.error.message}` }, 500);
    }
  }

  const { error: uploadError } = await client.storage.from(bucket).upload(path, binary, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: true,
  });
  if (uploadError) return json({ error: uploadError.message }, 500);

  const { data: publicData } = client.storage.from(bucket).getPublicUrl(path);
  const images = await readImages(client);
  images[slot] = `${publicData.publicUrl}?v=${Date.now()}`;

  const { error: settingsError } = await writeImages(client, images);
  if (settingsError) return json({ error: settingsError.message }, 500);

  return json({ images });
}

export async function DELETE(request: Request) {
  const client = getServerClient();
  if (!client) return json({ error: 'Server storage is not configured.' }, 503);

  let body: { path?: string };
  try {
    body = (await request.json()) as { path?: string };
  } catch {
    return json({ error: 'Invalid delete request.' }, 400);
  }
  const path = typeof body.path === 'string' ? body.path : '';
  if (!path || path.includes('..') || path.includes('/')) return json({ error: 'Invalid image path.' }, 400);

  const { error: removeError } = await client.storage.from(bucket).remove([path]);
  if (removeError) return json({ error: removeError.message }, 500);

  const images = await readImages(client);
  let changed = false;
  for (const slot of slots) {
    if (images[slot] && images[slot]?.includes(`/${bucket}/${path}`)) {
      images[slot] = null;
      changed = true;
    }
  }
  if (changed) {
    const { error: settingsError } = await writeImages(client, images);
    if (settingsError) return json({ error: settingsError.message }, 500);
  }

  return json({ images, deleted: path });
}
