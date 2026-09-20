import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { ImagePlus, Link2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Slot = 'velora' | 'nimble' | 'flux';
type ImageMap = Record<Slot, string | null>;
type LibraryFile = { name: string; url: string; size: number | null; updatedAt: string | null };

const slots: { id: Slot; title: string; meta: string }[] = [
  { id: 'velora', title: 'Velora', meta: '01 / Commerce / Concept' },
  { id: 'nimble', title: 'Nimble', meta: '02 / Brand / Experience' },
  { id: 'flux', title: 'Flux', meta: '03 / Product / Interface' },
];

const emptyImages: ImageMap = { velora: null, nimble: null, flux: null };

async function authHeaders(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatSize(bytes: number | null): string {
  if (bytes === null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaLibrary() {
  const [images, setImages] = useState<ImageMap>(emptyImages);
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const headers = await authHeaders();
    const [mapResponse, listResponse] = await Promise.all([
      fetch('/api/images', { cache: 'no-store' }),
      fetch('/api/images?action=list', { cache: 'no-store', headers }),
    ]);
    if (mapResponse.ok) setImages({ ...emptyImages, ...((await mapResponse.json()) as Partial<ImageMap>) });
    if (listResponse.ok) {
      const result = (await listResponse.json()) as { files?: LibraryFile[] };
      setFiles(result.files ?? []);
    } else if (listResponse.status === 401) {
      setError('Library listing needs an admin session — try signing out and back in.');
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upload = async (slot: Slot, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Use JPG, PNG or WebP.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Image must be 3 MB or smaller.');
      return;
    }
    setBusy(`upload:${slot}`);
    setError('');
    setMessage('Uploading…');
    try {
      const form = new FormData();
      form.append('slot', slot);
      form.append('file', file, file.name);
      const response = await fetch('/api/images', { method: 'POST', headers: await authHeaders(), body: form });
      const result = (await response.json()) as { images?: ImageMap; error?: string };
      if (response.status === 401) throw new Error('Session expired — sign out and sign back in.');
      if (!response.ok) throw new Error(result.error || 'Upload failed.');
      if (result.images) setImages(result.images);
      setMessage(`${slot.toUpperCase()} updated.`);
      void refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
      setMessage('');
    } finally {
      setBusy(null);
    }
  };

  const assign = async (slot: Slot, url: string) => {
    setBusy(`assign:${slot}:${url}`);
    setError('');
    try {
      const form = new FormData();
      form.append('action', 'assign');
      form.append('slot', slot);
      form.append('url', url);
      const response = await fetch('/api/images', { method: 'POST', headers: await authHeaders(), body: form });
      const result = (await response.json()) as { images?: ImageMap; error?: string };
      if (response.status === 401) throw new Error('Session expired — sign out and sign back in.');
      if (!response.ok) throw new Error(result.error || 'Assign failed.');
      if (result.images) setImages(result.images);
      setMessage(`${slot.toUpperCase()} now uses ${url.split('/').pop()}.`);
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : 'Assign failed.');
    } finally {
      setBusy(null);
    }
  };

  const remove = async (path: string) => {
    if (!window.confirm(`Delete ${path} from the library?`)) return;
    setBusy(`delete:${path}`);
    setError('');
    try {
      const response = await fetch('/api/images', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', ...(await authHeaders()) },
        body: JSON.stringify({ path }),
      });
      const result = (await response.json()) as { images?: ImageMap; error?: string };
      if (response.status === 401) throw new Error('Session expired — sign out and sign back in.');
      if (!response.ok) throw new Error(result.error || 'Delete failed.');
      if (result.images) setImages(result.images);
      setFiles(current => current.filter(file => file.name !== path));
      setMessage(`${path} deleted.`);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Delete failed.');
    } finally {
      setBusy(null);
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Link copied.');
    } catch {
      setError('Could not copy — copy the URL manually.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[9px] tracking-[0.2em] text-[#40E0D0]">LIBRARY</p>
        <h1 className="mt-2 font-editorial text-5xl">Media</h1>
        <p className="mt-2 max-w-2xl text-[10px] leading-6 tracking-[0.06em] text-white/30">
          Upload portfolio visuals, assign them to the three Selected Directions slots, or remove what you no longer need.
        </p>
      </div>

      {message && <p className="text-[9px] uppercase tracking-[0.18em] text-[#40E0D0]">{message}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-[10px] text-red-200/80">{error}</p>}

      <div className="grid gap-5 lg:grid-cols-3">
        {slots.map(slot => (
          <section key={slot.id} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025]">
            <div className="aspect-video bg-[#050708]">
              {images[slot.id] ? (
                <img src={images[slot.id] as string} alt={`${slot.title} project preview`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-[0.2em] text-white/20">No image assigned</div>
              )}
            </div>
            <div className="p-5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#40E0D0]">{slot.meta}</p>
              <h2 className="mt-2 font-editorial text-3xl">{slot.title}</h2>
              <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-white/55 transition hover:border-[#40E0D0]/50 hover:text-white">
                <ImagePlus size={14} aria-hidden="true" />
                {busy === `upload:${slot.id}` ? 'Uploading…' : images[slot.id] ? 'Replace image' : 'Upload image'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy !== null}
                  onChange={event => void upload(slot.id, event)}
                  className="sr-only"
                />
              </label>
              <p className="mt-3 text-center text-[8px] leading-5 text-white/20">JPG, PNG or WebP · max 3 MB</p>
            </div>
          </section>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025]">
        <div className="border-b border-white/8 px-5 py-4">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">Library files · {files.length}</p>
        </div>
        {!files.length && <p className="px-5 py-10 text-center text-[10px] text-white/25">No library files yet — upload above.</p>}
        <ul className="divide-y divide-white/8">
          {files.map(file => (
            <li key={file.name} className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center">
              <img src={file.url} alt="" aria-hidden="true" className="h-14 w-24 shrink-0 rounded-lg border border-white/10 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-white/75">{file.name}</p>
                <p className="mt-1 text-[9px] tracking-[0.08em] text-white/25">
                  {formatSize(file.size)}
                  {file.updatedAt ? ` · ${new Date(file.updatedAt).toLocaleDateString()}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {slots.map(slot => (
                  <button
                    key={slot.id}
                    disabled={busy !== null}
                    onClick={() => void assign(slot.id, file.url)}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-white/45 transition hover:border-[#40E0D0]/50 hover:text-white disabled:opacity-40"
                  >
                    → {slot.title}
                  </button>
                ))}
                <button
                  onClick={() => void copyLink(file.url)}
                  aria-label={`Copy link for ${file.name}`}
                  className="rounded-full border border-white/10 p-2 text-white/45 transition hover:border-[#40E0D0]/50 hover:text-white"
                >
                  <Link2 size={13} aria-hidden="true" />
                </button>
                <button
                  disabled={busy !== null}
                  onClick={() => void remove(file.name)}
                  aria-label={`Delete ${file.name}`}
                  className="rounded-full border border-white/10 p-2 text-white/45 transition hover:border-red-300/40 hover:text-red-200 disabled:opacity-40"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
