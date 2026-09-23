import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { defaultAi, defaultContact, defaultHero, defaultWork, type AiSettings, type ContactSettings, type HeroSettings, type WorkSettings } from '../lib/siteSettings';

type Log = (action: string, entity: string, entityId?: string) => Promise<void>;

const inputClass =
  'mt-2 w-full rounded-xl border border-white/8 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#40E0D0]/50';

function TextField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-[0.16em] text-white/35">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} className={`${inputClass} resize-none`} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} className={inputClass} />
      )}
    </label>
  );
}

function HeroEditor({ user, log }: { user: User; log: Log }) {
  const [hero, setHero] = useState<HeroSettings>(defaultHero);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    void client
      .from('site_settings')
      .select('value')
      .eq('key', 'hero')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value && typeof data.value === 'object') {
          setHero({ ...defaultHero, ...(data.value as Partial<HeroSettings>) });
        }
      });
  }, []);

  const save = async () => {
    const client = supabase;
    if (!client) return;
    const { error } = await client
      .from('site_settings')
      .upsert({ key: 'hero', value: hero, updated_by: user.id, updated_at: new Date().toISOString() });
    if (!error) {
      await log('UPDATE', 'site_settings', 'hero');
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-6">
      <div className="flex items-center justify-between border-b border-white/8 pb-5">
        <div>
          <p className="text-[9px] tracking-[0.18em] text-[#40E0D0]">01 · HERO</p>
          <h2 className="mt-2 font-editorial text-3xl">Opening statement</h2>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        <TextField label="Label" value={hero.label} onChange={value => setHero({ ...hero, label: value })} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Title start" value={hero.titleA} onChange={value => setHero({ ...hero, titleA: value })} />
          <TextField label="Title end" value={hero.titleB} onChange={value => setHero({ ...hero, titleB: value })} />
        </div>
        <TextField label="Supporting line" value={hero.sub} onChange={value => setHero({ ...hero, sub: value })} textarea />
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-[#40E0D0] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#0A0A0A]"
        >
          <Save size={13} />
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </section>
  );
}

function WorkEditor({ user, log }: { user: User; log: Log }) {
  const [work, setWork] = useState<WorkSettings>(defaultWork);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    void client
      .from('site_settings')
      .select('value')
      .eq('key', 'work')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value && typeof data.value === 'object') {
          const v = data.value as Partial<WorkSettings>;
          if (Array.isArray(v.items) && v.items.length === 3) {
            setWork({ items: v.items.map((c, i) => ({ ...defaultWork.items[i], ...(c as object) })) });
          }
        }
      });
  }, []);

  const save = async () => {
    const client = supabase;
    if (!client) return;
    const { error } = await client
      .from('site_settings')
      .upsert({ key: 'work', value: work, updated_by: user.id, updated_at: new Date().toISOString() });
    if (!error) {
      await log('UPDATE', 'site_settings', 'work');
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    }
  };

  const setCard = (index: number, patch: Partial<{ name: string; category: string; meta: string; outcome: string; url: string; domain: string; logoText: string; note: string }>) => {
    setWork(current => ({
      ...current,
      items: current.items.map((card, i) => (i === index ? { ...card, ...patch } : card)),
    }));
  };

  const setList = (index: number, field: 'tags' | 'fonts' | 'colors' | 'images', raw: string) => {
    const list = raw.split(',').map(t => t.trim()).filter(Boolean);
    setWork(current => ({
      ...current,
      items: current.items.map((card, i) => {
        if (i !== index) return card;
        if (field === 'tags') return { ...card, tags: list };
        if (field === 'fonts') return { ...card, fonts: list };
        if (field === 'colors') return { ...card, colors: list };
        return { ...card, images: list };
      }),
    }));
  };

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-6">
      <div className="flex items-center justify-between border-b border-white/8 pb-5">
        <div>
          <p className="text-[9px] tracking-[0.18em] text-[#40E0D0]">02 · SELECTED WORK</p>
          <h2 className="mt-2 font-editorial text-3xl">Project cards</h2>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        {work.items.map((card, index) => (
          <div key={card.id} className="grid gap-5 rounded-xl border border-white/8 p-4 sm:grid-cols-2">
            <TextField label={`Card 0${index + 1} name`} value={card.name} onChange={value => setCard(index, { name: value })} />
            <TextField label={`Card 0${index + 1} category`} value={card.category} onChange={value => setCard(index, { category: value })} />
            <TextField label={`Card 0${index + 1} eyebrow`} value={card.meta} onChange={value => setCard(index, { meta: value })} />
            <TextField label={`Card 0${index + 1} preview URL`} value={card.url} onChange={value => setCard(index, { url: value })} />
            <div className="sm:col-span-2">
              <TextField label={`Card 0${index + 1} outcome`} value={card.outcome} onChange={value => setCard(index, { outcome: value })} />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label={`Card 0${index + 1} tags (comma separated)`}
                value={card.tags.join(', ')}
                onChange={value => setList(index, 'tags', value)}
              />
            </div>
            <TextField label={`Card 0${index + 1} domain`} value={card.domain} onChange={value => setCard(index, { domain: value })} />
            <TextField label={`Card 0${index + 1} logo letter`} value={card.logoText} onChange={value => setCard(index, { logoText: value })} />
            <div className="sm:col-span-2">
              <TextField
                label={`Card 0${index + 1} fonts (comma separated)`}
                value={card.fonts.join(', ')}
                onChange={value => setList(index, 'fonts', value)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label={`Card 0${index + 1} colors (comma separated hex)`}
                value={card.colors.join(', ')}
                onChange={value => setList(index, 'colors', value)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField
                label={`Card 0${index + 1} images (comma separated URLs)`}
                value={card.images.join(', ')}
                onChange={value => setList(index, 'images', value)}
              />
            </div>
            <div className="sm:col-span-2">
              <TextField label={`Card 0${index + 1} footer note`} value={card.note} onChange={value => setCard(index, { note: value })} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-[#40E0D0] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#0A0A0A]"
        >
          <Save size={13} />
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </section>
  );
}

function AiEditor({ user, log }: { user: User; log: Log }) {
  const [ai, setAi] = useState<AiSettings>(defaultAi);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    void client
      .from('site_settings')
      .select('value')
      .eq('key', 'ai_approach')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value && typeof data.value === 'object') {
          setAi({ ...defaultAi, ...(data.value as Partial<AiSettings>) });
        }
      });
  }, []);

  const save = async () => {
    const client = supabase;
    if (!client) return;
    const { error } = await client
      .from('site_settings')
      .upsert({ key: 'ai_approach', value: ai, updated_by: user.id, updated_at: new Date().toISOString() });
    if (!error) {
      await log('UPDATE', 'site_settings', 'ai_approach');
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    }
  };

  const setCard = (index: number, patch: Partial<{ title: string; body: string }>) => {
    setAi(current => ({
      ...current,
      cards: current.cards.map((card, i) => (i === index ? { ...card, ...patch } : card)),
    }));
  };

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-6">
      <div className="flex items-center justify-between border-b border-white/8 pb-5">
        <div>
          <p className="text-[9px] tracking-[0.18em] text-[#40E0D0]">03 · AI APPROACH</p>
          <h2 className="mt-2 font-editorial text-3xl">Manifesto section</h2>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        <TextField label="Eyebrow" value={ai.eyebrow} onChange={value => setAi({ ...ai, eyebrow: value })} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Headline start" value={ai.headlineA} onChange={value => setAi({ ...ai, headlineA: value })} />
          <TextField label="Strike word" value={ai.strike} onChange={value => setAi({ ...ai, strike: value })} />
          <TextField label="Headline end" value={ai.headlineB} onChange={value => setAi({ ...ai, headlineB: value })} />
          <TextField label="Accent word" value={ai.accent} onChange={value => setAi({ ...ai, accent: value })} />
        </div>
        <TextField label="Body" value={ai.body} onChange={value => setAi({ ...ai, body: value })} textarea />
        {ai.cards.map((card, index) => (
          <div key={index} className="grid gap-5 rounded-xl border border-white/8 p-4 sm:grid-cols-[120px_1fr]">
            <TextField label={`Card 0${index + 1} title`} value={card.title} onChange={value => setCard(index, { title: value })} />
            <TextField label={`Card 0${index + 1} body`} value={card.body} onChange={value => setCard(index, { body: value })} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-[#40E0D0] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#0A0A0A]"
        >
          <Save size={13} />
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </section>
  );
}

function ContactEditor({ user, log }: { user: User; log: Log }) {
  const [contact, setContact] = useState<ContactSettings>(defaultContact);
  const [saved, setSaved] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    void client
      .from('site_settings')
      .select('value')
      .eq('key', 'contact')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value && typeof data.value === 'object') {
          setContact({ ...defaultContact, ...(data.value as Partial<ContactSettings>) });
        }
      });
  }, []);

  const save = async () => {
    if (!/^\S+@\S+\.\S+$/.test(contact.studioEmail.trim())) {
      setEmailError('Enter a valid studio email.');
      return;
    }
    setEmailError('');
    const client = supabase;
    if (!client) return;
    const { error } = await client
      .from('site_settings')
      .upsert({ key: 'contact', value: contact, updated_by: user.id, updated_at: new Date().toISOString() });
    if (!error) {
      await log('UPDATE', 'site_settings', 'contact');
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    }
  };

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.025] p-6">
      <div className="flex items-center justify-between border-b border-white/8 pb-5">
        <div>
          <p className="text-[9px] tracking-[0.18em] text-[#40E0D0]">04 · CONTACT</p>
          <h2 className="mt-2 font-editorial text-3xl">Inquiry section</h2>
        </div>
      </div>
      <div className="mt-6 space-y-5">
        <TextField label="Eyebrow" value={contact.eyebrow} onChange={value => setContact({ ...contact, eyebrow: value })} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Title start" value={contact.titleA} onChange={value => setContact({ ...contact, titleA: value })} />
          <TextField label="Title end" value={contact.titleB} onChange={value => setContact({ ...contact, titleB: value })} />
        </div>
        <TextField label="Supporting line" value={contact.sub} onChange={value => setContact({ ...contact, sub: value })} textarea />
        <TextField
          label="Studio email (drives every mailto + inquiry recipient)"
          value={contact.studioEmail}
          onChange={value => setContact({ ...contact, studioEmail: value })}
        />
        {emailError && <p role="alert" className="text-[10px] text-red-200/80">{emailError}</p>}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-[#40E0D0] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#0A0A0A]"
        >
          <Save size={13} />
          {saved ? 'Saved' : 'Save changes'}
        </button>
      </div>
    </section>
  );
}

export default function SiteSections({ user, log }: { user: User; log: Log }) {
  return (
    <div className="space-y-6">
      <HeroEditor user={user} log={log} />
      <WorkEditor user={user} log={log} />
      <AiEditor user={user} log={log} />
      <ContactEditor user={user} log={log} />
    </div>
  );
}
