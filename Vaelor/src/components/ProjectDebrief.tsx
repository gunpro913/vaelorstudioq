import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import type { WorkCard } from '../lib/siteSettings';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProjectDebrief({ card, onClose }: { card: WorkCard; onClose: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-4 backdrop-blur-md sm:items-center sm:p-8"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${card.name} project debrief`}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 36, scale: reduceMotion ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.98 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.45, ease: EASE }}
        onClick={e => e.stopPropagation()}
        className="grid max-h-[90vh] w-full max-w-5xl gap-3 overflow-y-auto rounded-[26px] border border-white/10 bg-[#0e1111] p-4 sm:p-6 md:grid-cols-[1.25fr_.75fr]"
      >
        <div className="grid content-start gap-3">
          <div className="rounded-[18px] border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-editorial text-4xl md:text-5xl">{card.name}</h3>
                <a
                  href={`https://${card.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="mt-2 inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] text-white/40 transition hover:text-aer-blue"
                >
                  {card.domain} <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </div>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                aria-label={`Close ${card.name} debrief`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-aer-blue/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-6 text-white/45">{card.outcome}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[7px] uppercase tracking-[.22em] text-white/25">
              {card.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[130px_1fr]">
            <div className="flex min-h-[130px] items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] p-6">
              <span className="font-editorial text-6xl text-white/90">{card.logoText}</span>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[8px] uppercase tracking-[0.25em] text-aer-blue">Fonts</p>
              <div className="mt-4 flex gap-8">
                {card.fonts.map((font, i) => (
                  <div key={font} className="text-center">
                    <p className={i === 0 ? 'font-editorial text-4xl text-white/85' : 'text-4xl text-white/85'}>Aa</p>
                    <p className="mt-2 text-[9px] tracking-[0.08em] text-white/40">{font}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-white/[0.02] p-6">
            <p className="text-[8px] uppercase tracking-[0.25em] text-aer-blue">Colors</p>
            <div className="mt-4 flex flex-wrap gap-5">
              {card.colors.map(hex => (
                <div key={hex} className="text-center">
                  <span
                    aria-hidden="true"
                    className="block h-11 w-11 rounded-full border border-white/15"
                    style={{ backgroundColor: hex }}
                  />
                  <p className="mt-2 text-[8px] tracking-[0.06em] text-white/40">{hex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid content-start gap-3">
          <div className="rounded-[18px] border border-white/10 bg-white/[0.02] p-6">
            <p className="text-[8px] uppercase tracking-[0.25em] text-aer-blue">Images</p>
            {card.images.length > 0 ? (
              <div className="mt-4 columns-2 gap-3 [&>img]:mb-3">
                {card.images.map(src => (
                  <img
                    key={src}
                    src={src}
                    alt={`${card.name} visual`}
                    loading="lazy"
                    className="w-full rounded-xl border border-white/10 object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-xs leading-6 text-white/35">Visuals ship with the full case study.</p>
            )}
          </div>
          <div className="rounded-[18px] border border-aer-blue/20 bg-aer-blue/[0.04] p-6 text-center">
            <p className="text-[10px] leading-6 tracking-[0.04em] text-white/50">{card.note}</p>
            <a
              href="#contact"
              onClick={onClose}
              className="mt-5 inline-flex items-center gap-3 rounded-full bg-aer-blue px-6 py-3 text-[9px] uppercase tracking-[0.24em] text-black transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Start one like this <ArrowRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
