import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type AiCard = { title: string; body: string };

export type AiSettings = {
  eyebrow: string;
  headlineA: string;
  strike: string;
  headlineB: string;
  accent: string;
  body: string;
  cards: AiCard[];
};

export type ContactSettings = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  sub: string;
  studioEmail: string;
};

export type HeroSettings = {
  label: string;
  titleA: string;
  titleB: string;
  sub: string;
};

export type WorkCard = {
  id: string;
  name: string;
  category: string;
  meta: string;
  outcome: string;
  tags: string[];
  url: string;
  domain: string;
  logoText: string;
  fonts: string[];
  colors: string[];
  images: string[];
  note: string;
};

export type WorkSettings = { items: WorkCard[] };

export const FALLBACK_EMAIL = 'yunusfawzan9@gmail.com';

export const defaultAi: AiSettings = {
  eyebrow: 'AI Approach',
  headlineA: 'AI generates the',
  strike: 'slop',
  headlineB: 'We curate the',
  accent: 'masterpiece',
  body: 'We do not reject AI; we subjugate it to taste. It is a precision instrument for executing complex visions, rectified entirely by profound human intent.',
  cards: [
    { title: 'Explore', body: 'Expand possibilities quickly. Generate directions, prototypes, and variants at speed.' },
    { title: 'Direct', body: 'Choose the direction with intent. Human judgment decides what deserves attention.' },
    { title: 'Refine', body: 'Edit, test, and sharpen the result into a connected system built to last.' },
  ],
};

export const defaultContact: ContactSettings = {
  eyebrow: 'Start a project',
  titleA: 'Let’s build',
  titleB: 'what comes next.',
  sub: 'Have a product, brand or experience in mind? Tell us what you are trying to make. We will take it from there.',
  studioEmail: FALLBACK_EMAIL,
};

export const defaultHero: HeroSettings = {
  label: 'Digital studio',
  titleA: 'Ideas, engineered',
  titleB: 'for what’s next.',
  sub: 'AER × VÆLOR is a digital studio combining strategy, design and engineering to build intelligent products for ambitious brands.',
};

export const defaultWork: WorkSettings = {
  items: [
    {
      id: 'velora',
      name: 'Velora',
      category: 'Commerce',
      meta: '01 / Commerce / System',
      outcome: 'A commerce system exploring speed, hierarchy and confident decision-making.',
      tags: ['Direction', 'UX / UI', 'Engineering'],
      url: 'velora.studio',
      domain: 'velora.studio',
      logoText: 'V',
      fonts: ['Cormorant Garamond', 'Inter'],
      colors: ['#40E0D0', '#FAF8F5', '#0A0B0B'],
      images: [],
      note: 'Full case study ships with the system documentation.',
    },
    {
      id: 'nimble',
      name: 'Nimble',
      category: 'Brand',
      meta: '02 / Brand / Experience',
      outcome: 'A brand experience turning a complex offer into a clearer, more confident journey.',
      tags: ['Positioning', 'Identity', 'Experience'],
      url: 'nimble.studio',
      domain: 'nimble.studio',
      logoText: 'N',
      fonts: ['Cormorant Garamond', 'Inter'],
      colors: ['#FAF8F5', '#40E0D0', '#0D1010'],
      images: [],
      note: 'Full case study ships with the identity guidelines.',
    },
    {
      id: 'flux',
      name: 'Flux',
      category: 'Product',
      meta: '03 / Product / Interface',
      outcome: 'A product direction focused on reducing noise and making the next action obvious.',
      tags: ['Product', 'UX', 'Interface'],
      url: 'flux.studio',
      domain: 'flux.studio',
      logoText: 'F',
      fonts: ['Cormorant Garamond', 'Inter'],
      colors: ['#0A0B0B', '#40E0D0', '#FFFFFF'],
      images: [],
      note: 'Full case study ships with the interface system.',
    },
  ],
};

type SiteSettings = { ai: AiSettings; contact: ContactSettings; hero: HeroSettings; work: WorkSettings };

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

function sanitizeAi(value: unknown): AiSettings {
  if (!value || typeof value !== 'object') return defaultAi;
  const v = value as Partial<AiSettings>;
  const cards = Array.isArray(v.cards) && v.cards.length === 3 ? (v.cards as AiCard[]) : defaultAi.cards;
  return {
    eyebrow: typeof v.eyebrow === 'string' && v.eyebrow ? v.eyebrow : defaultAi.eyebrow,
    headlineA: typeof v.headlineA === 'string' && v.headlineA ? v.headlineA : defaultAi.headlineA,
    strike: typeof v.strike === 'string' && v.strike ? v.strike : defaultAi.strike,
    headlineB: typeof v.headlineB === 'string' && v.headlineB ? v.headlineB : defaultAi.headlineB,
    accent: typeof v.accent === 'string' && v.accent ? v.accent : defaultAi.accent,
    body: typeof v.body === 'string' && v.body ? v.body : defaultAi.body,
    cards: cards.map((card, i) => ({
      title: card && typeof card.title === 'string' && card.title ? card.title : defaultAi.cards[i].title,
      body: card && typeof card.body === 'string' && card.body ? card.body : defaultAi.cards[i].body,
    })),
  };
}

function sanitizeWork(value: unknown): WorkSettings {
  if (!value || typeof value !== 'object') return defaultWork;
  const v = value as Partial<WorkSettings>;
  if (!Array.isArray(v.items) || v.items.length !== 3) return defaultWork;
  return {
    items: v.items.map((card, i) => {
      const fallback = defaultWork.items[i];
      const c = (card && typeof card === 'object' ? card : {}) as Partial<WorkCard>;
      const strings = (val: unknown): string[] =>
        Array.isArray(val) ? val.filter((t): t is string => typeof t === 'string') : [];
      return {
        id: typeof c.id === 'string' && c.id ? c.id : fallback.id,
        name: typeof c.name === 'string' && c.name ? c.name : fallback.name,
        category: typeof c.category === 'string' && c.category ? c.category : fallback.category,
        meta: typeof c.meta === 'string' && c.meta ? c.meta : fallback.meta,
        outcome: typeof c.outcome === 'string' && c.outcome ? c.outcome : fallback.outcome,
        tags: strings(c.tags).length > 0 ? strings(c.tags) : fallback.tags,
        url: typeof c.url === 'string' && c.url ? c.url : fallback.url,
        domain: typeof c.domain === 'string' && c.domain ? c.domain : fallback.domain,
        logoText: typeof c.logoText === 'string' && c.logoText ? c.logoText : fallback.logoText,
        fonts: strings(c.fonts).length > 0 ? strings(c.fonts) : fallback.fonts,
        colors: strings(c.colors).length > 0 ? strings(c.colors) : fallback.colors,
        images: strings(c.images),
        note: typeof c.note === 'string' && c.note ? c.note : fallback.note,
      };
    }),
  };
}

function sanitizeHero(value: unknown): HeroSettings {
  if (!value || typeof value !== 'object') return defaultHero;
  const v = value as Partial<HeroSettings>;
  return {
    label: typeof v.label === 'string' && v.label ? v.label : defaultHero.label,
    titleA: typeof v.titleA === 'string' && v.titleA ? v.titleA : defaultHero.titleA,
    titleB: typeof v.titleB === 'string' && v.titleB ? v.titleB : defaultHero.titleB,
    sub: typeof v.sub === 'string' && v.sub ? v.sub : defaultHero.sub,
  };
}

function sanitizeContact(value: unknown): ContactSettings {
  if (!value || typeof value !== 'object') return defaultContact;
  const v = value as Partial<ContactSettings>;
  return {
    eyebrow: typeof v.eyebrow === 'string' && v.eyebrow ? v.eyebrow : defaultContact.eyebrow,
    titleA: typeof v.titleA === 'string' && v.titleA ? v.titleA : defaultContact.titleA,
    titleB: typeof v.titleB === 'string' && v.titleB ? v.titleB : defaultContact.titleB,
    sub: typeof v.sub === 'string' && v.sub ? v.sub : defaultContact.sub,
    studioEmail:
      typeof v.studioEmail === 'string' && /^\S+@\S+\.\S+$/.test(v.studioEmail) ? v.studioEmail : defaultContact.studioEmail,
  };
}

export function loadSiteSettings(): Promise<SiteSettings> {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = (async () => {
    const fallback: SiteSettings = { ai: defaultAi, contact: defaultContact, hero: defaultHero, work: defaultWork };
    try {
      if (!supabase) return fallback;
      const { data, error } = await supabase.from('site_settings').select('key, value').in('key', ['hero', 'ai_approach', 'contact', 'work']);
      if (error || !data) return fallback;
      const rows = data as { key: string; value: unknown }[];
      const byKey = new Map(rows.map((row: { key: string; value: unknown }) => [row.key, row.value]));
      const next: SiteSettings = {
        ai: sanitizeAi(byKey.get('ai_approach')),
        contact: sanitizeContact(byKey.get('contact')),
        hero: sanitizeHero(byKey.get('hero')),
        work: sanitizeWork(byKey.get('work')),
      };
      cache = next;
      return next;
    } catch {
      return fallback;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(cache ?? { ai: defaultAi, contact: defaultContact, hero: defaultHero, work: defaultWork });
  useEffect(() => {
    let active = true;
    void loadSiteSettings().then(next => {
      if (active) setSettings(next);
    });
    return () => {
      active = false;
    };
  }, []);
  return settings;
}

export function useStudioEmail(): string {
  return useSiteSettings().contact.studioEmail;
}
