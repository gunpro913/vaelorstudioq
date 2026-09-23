import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MaskReveal, SplitWords } from './Kinetic';
import ProjectDebrief from './ProjectDebrief';
import { supabase } from '../lib/supabase';
import { useSiteSettings, type WorkCard } from '../lib/siteSettings';

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.32em] text-aer-cream/55">
      <span className="h-px w-7 bg-aer-blue/70" />
      {children}
    </div>
  );
}

function BrowserVisual({ item, variant }: { item: WorkCard; variant: number }) {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0d1112] shadow-[0_40px_120px_rgba(0,0,0,.55)] md:min-h-[420px]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-3" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-aer-blue/50" />
        <span className="ml-3 hidden flex-1 truncate rounded-full bg-white/[0.04] px-3 py-1 text-center text-[8px] tracking-[0.18em] text-white/30 sm:block">
          {item.url}
        </span>
      </div>
      <div className="work-visual-bg absolute inset-0 top-[41px] bg-[radial-gradient(circle_at_72%_24%,rgba(235,250,255,.34),transparent_18%),radial-gradient(circle_at_25%_80%,rgba(64,224,208,.16),transparent_30%),linear-gradient(135deg,#050708,#101b20_55%,#070909)]" />
      <div className="absolute inset-8 top-[73px] rounded-[14px] border border-white/10 bg-black/35 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-sm">
        {variant === 0 ? (
          <div className="flex h-full flex-col justify-end p-6">
            <div className="mb-3 text-[9px] uppercase tracking-[.25em] text-aer-blue">commerce / concept</div>
            <div className="font-editorial text-5xl leading-[.88] text-white/90 md:text-7xl">
              Built for
              <br />
              movement.
            </div>
            <div className="mt-8 h-px w-2/3 bg-white/15" />
            <div className="mt-3 flex gap-2">
              <span className="h-1 w-12 rounded bg-white/60" />
              <span className="h-1 w-5 rounded bg-aer-blue" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 p-5">
            <div className="flex justify-between text-[7px] uppercase tracking-[.25em] text-white/40">
              <span>{variant === 1 ? 'NIMBLE / BRAND' : 'FLUX / PRODUCT'}</span>
              <span>CONCEPT</span>
            </div>
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2">
              <div className="font-editorial text-4xl text-white/90">{variant === 1 ? 'Make room.' : 'See clearly.'}</div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <span className="h-14 rounded border border-white/10 bg-white/[.03]" />
                <span className="h-14 rounded border border-aer-blue/30 bg-aer-blue/[.04]" />
                <span className="h-14 rounded border border-white/10 bg-white/[.03]" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-5 right-5 text-[8px] uppercase tracking-[.3em] text-white/35">AER / {item.meta.slice(0, 2)}</div>
    </div>
  );
}

export default function WorkSection() {
  const reduceMotion = useReducedMotion();
  const [[active, direction], setActive] = useState<[number, number]>([0, 0]);
  const { items } = useSiteSettings().work;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [openIndex]);
  // ponytail: coverflow poses tuned for 3 items; more items stack on the left pose

  const track = useCallback(() => {
    if (supabase) void supabase.from('analytics_events').insert({ event_name: 'project_view', path: '#work' });
  }, []);

  const go = useCallback(
    (dir: number) => {
      setActive(([a]) => [(a + dir + items.length) % items.length, dir]);
      track();
    },
    [track]
  );

  const select = useCallback(
    (index: number) => {
      setActive(([a]) => (index === a ? [a, 0] : [index, index > a ? 1 : -1]));
      track();
    },
    [track]
  );

  const spring = reduceMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 260, damping: 30 } as const;

  const pose = (offset: number) => {
    if (reduceMotion) {
      return offset === 0 ? { x: '0%', opacity: 1, zIndex: 3 } : { x: offset === 1 ? '60%' : '-60%', opacity: 0, zIndex: 1 };
    }
    if (offset === 0) return { x: '0%', y: '0%', scale: 1, rotateY: 0, rotate: 0, zIndex: 3, opacity: 1, filter: 'brightness(1)' };
    if (offset === 1) return { x: '38%', y: '9%', scale: 0.8, rotateY: -22, rotate: 3, zIndex: 2, opacity: 0.9, filter: 'brightness(0.7)' };
    return { x: '-38%', y: '9%', scale: 0.8, rotateY: 22, rotate: -3, zIndex: 2, opacity: 0.9, filter: 'brightness(0.7)' };
  };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduceMotion ? 0.01 : 0.8, delay },
  });

  const item = items[active];

  return (
    <section id="work" className="mx-auto max-w-[1500px] scroll-mt-24 overflow-hidden px-5 py-28 md:px-10 md:py-36">
      <motion.div {...reveal()} className="mb-10 md:mb-12">
        <SectionLabel>Selected directions</SectionLabel>
        <h2 className="max-w-3xl font-editorial text-5xl leading-[.9] tracking-[-.03em] md:text-7xl">
          <SplitWords text="Work with" />
          <br />
          <MaskReveal delay={0.12}>
            <span className="text-white/35">a point of view.</span>
          </MaskReveal>
        </h2>
      </motion.div>

      <motion.div
        {...reveal(0.08)}
        drag={reduceMotion ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_e, info) => {
          if (info.offset.x < -70) go(1);
          else if (info.offset.x > 70) go(-1);
        }}
        className="relative h-[330px] cursor-grab touch-pan-y active:cursor-grabbing sm:h-[420px] md:h-[500px] [perspective:1400px]"
        aria-roledescription="carousel"
        aria-label="Selected work"
      >
        {items.map((entry, i) => {
          const offset = (i - active + items.length) % items.length;
          const isCenter = offset === 0;
          return (
            <motion.div
              key={entry.id}
              data-slot={entry.id}
              className={`absolute inset-y-0 left-0 right-0 mx-auto w-[min(640px,88%)] ${isCenter ? '' : 'cursor-pointer'}`}
              initial={false}
              animate={pose(offset)}
              transition={spring}
              onClick={() => {
                if (!isCenter) select(i);
                else {
                  track();
                  setOpenIndex(i);
                }
              }}
              aria-hidden={!isCenter}
            >
              <BrowserVisual item={entry} variant={i % 3} />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-6 flex flex-col items-center gap-4 md:mt-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous project"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-aer-blue/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue"
          >
            <ArrowLeft size={15} aria-hidden="true" />
          </button>
          <div role="tablist" aria-label="Choose project" className="flex gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1.5">
            {items.map((entry, i) => {
              const selected = i === active;
              return (
                <button
                  key={entry.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => select(i)}
                  className={`relative rounded-full px-3 py-2.5 text-[8px] uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue sm:px-5 sm:text-[9px] sm:tracking-[0.2em] ${
                    selected ? 'text-black' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="work-tab"
                      aria-hidden="true"
                      transition={reduceMotion ? { duration: 0.01 } : { type: 'spring', stiffness: 350, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-aer-blue"
                    />
                  )}
                  <span className="relative">{entry.category}</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next project"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-aer-blue/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue"
          >
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
        <p className="text-[8px] uppercase tracking-[0.25em] text-white/25" aria-live="polite">
          {direction === 0 ? `${item.meta}` : direction > 0 ? `→ ${item.meta}` : `${item.meta} ←`}
        </p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 grid max-w-4xl gap-5 text-center md:mt-8"
        >
          <div>
            <h3 className="font-editorial text-4xl md:text-5xl">{item.name}</h3>
            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/45 md:text-sm md:leading-7">{item.outcome}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[7px] uppercase tracking-[.22em] text-white/25">
              {item.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[9px] uppercase tracking-[0.24em] text-[#0a0b0b] transition hover:bg-aer-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0b]"
            >
              Start one like this <ArrowRight size={13} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div {...reveal(0.1)} className="mt-6 flex flex-col gap-4 rounded-[26px] border border-white/10 bg-white/[0.015] px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:mt-8 md:px-8">
        <p className="max-w-xl text-xs leading-6 text-white/45">
          Every direction ships with its rationale — positioning, interface and system, decided together.
        </p>
        <a
          href="#contact"
          className="inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-6 py-3 text-[9px] uppercase tracking-[0.24em] text-[#0a0b0b] transition hover:bg-aer-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0b]"
        >
          Discuss your project <ArrowRight size={13} aria-hidden="true" />
        </a>
      </motion.div>

      <AnimatePresence>
        {openIndex !== null && items[openIndex] && (
          <ProjectDebrief key={items[openIndex].id} card={items[openIndex]} onClose={() => setOpenIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
