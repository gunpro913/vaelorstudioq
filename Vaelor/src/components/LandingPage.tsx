import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowDownRight, ArrowRight, ChevronDown } from 'lucide-react';
import { MaskReveal, riseChild, SplitWords, staggerParent } from './Kinetic';
import { Tilt } from './Interactive';
import ProjectInquiry from './ProjectInquiry';
import WorkSection from './WorkSection';
import { useSiteSettings } from '../lib/siteSettings';
import { supabase } from '../lib/supabase';

const capabilities = [
  ['01', 'DIRECTION', 'Know what deserves to exist.', 'Strategy · Positioning · Product vision', 'Clearer decisions.', 'A focused direction your team can actually build against.'],
  ['02', 'INTERFACE', 'Make complex products feel obvious.', 'UX · UI · Design systems', 'Less friction.', 'People understand what matters and what to do next.'],
  ['03', 'MOTION', 'Give interaction a reason to exist.', 'Interaction · Animation · Prototyping', 'More meaningful interaction.', 'Motion reinforces hierarchy, feedback and product character.'],
  ['04', 'ENGINEERING', 'Make the idea real, fast and resilient.', 'Frontend · Backend · Performance', 'A system that holds up.', 'Fast, maintainable technology without compromising the original idea.'],
];

const process = [
  ['01', 'DISCOVER', 'Uncover the signal.', 'What matters?', 'Research · Context · Opportunity', 'CLARITY'],
  ['02', 'DEFINE', 'Give it structure.', 'What are we solving?', 'Strategy · Scope · Direction', 'DIRECTION'],
  ['03', 'DESIGN', 'Make the system visible.', 'How should it feel?', 'UX · UI · Prototyping', 'CONFIDENCE'],
  ['04', 'BUILD', 'Turn intent into product.', 'How should it work?', 'Engineering · Integration · Performance', 'REALITY'],
  ['05', 'REFINE', 'Make every detail count.', 'What can be better?', 'Testing · Motion · Optimisation', 'PRECISION'],
];

function SectionLabel({ children }: { children: string }) {
  return <div className="mb-6 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.32em] text-aer-cream/55"><span className="h-px w-7 bg-aer-blue/70" />{children}</div>;
}

function Signal({ className = '' }: { className?: string }) {
  return <span className={`inline-flex h-2 w-2 rounded-full bg-aer-blue shadow-[0_0_18px_rgba(64,224,208,.9)] ${className}`} />;
}

function ProjectVisual({ variant }: { variant: number }) {
  return (
    <Tilt className="h-full" max={5}>
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0d1112] transition duration-500 hover:border-aer-blue/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(235,250,255,.34),transparent_18%),radial-gradient(circle_at_25%_80%,rgba(64,224,208,.16),transparent_30%),linear-gradient(135deg,#050708,#101b20_55%,#070909)]" />
      <div className="absolute inset-8 rounded-[14px] border border-white/10 bg-black/35 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-sm">
        {variant === 0 ? (
          <>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[7px] uppercase tracking-[.28em] text-white/45"><span>VELORA / SYSTEM</span><Signal /></div>
            <div className="flex h-[calc(100%-38px)] flex-col justify-end p-6"><div className="mb-3 text-[9px] uppercase tracking-[.25em] text-aer-blue">commerce / concept</div><div className="font-editorial text-5xl leading-[.88] text-white/90 md:text-7xl">Built for<br />movement.</div><div className="mt-8 h-px w-2/3 bg-white/15" /><div className="mt-3 flex gap-2"><span className="h-1 w-12 rounded bg-white/60" /><span className="h-1 w-5 rounded bg-aer-blue" /></div></div>
          </>
        ) : (
          <div className="absolute inset-0 p-5"><div className="flex justify-between text-[7px] uppercase tracking-[.25em] text-white/40"><span>{variant === 1 ? 'NIMBLE / BRAND' : 'FLUX / PRODUCT'}</span><span>CONCEPT</span></div><div className="absolute left-8 right-8 top-1/2 -translate-y-1/2"><div className="font-editorial text-4xl text-white/90">{variant === 1 ? 'Make room.' : 'See clearly.'}</div><div className="mt-5 grid grid-cols-3 gap-2"><span className="h-14 rounded border border-white/10 bg-white/[.03]" /><span className="h-14 rounded border border-aer-blue/30 bg-aer-blue/[.04]" /><span className="h-14 rounded border border-white/10 bg-white/[.03]" /></div></div></div>
        )}
      </div>
      <div className="absolute bottom-5 right-5 text-[8px] uppercase tracking-[.3em] text-white/35">AER / {String(variant + 1).padStart(2, '0')}</div>
    </div>
    </Tilt>
  );
}

function CapabilityRow({ num, title, outcome, detail, result, resultDetail, delay, reduceMotion }: { num: string; title: string; outcome: string; detail: string; result: string; resultDetail: string; delay: number; reduceMotion: boolean | null }) {
  return (
    <motion.article variants={reduceMotion ? undefined : riseChild} className="group border-t border-white/10 py-8 md:py-10">
      <div className="grid gap-7 md:grid-cols-[64px_minmax(0,1fr)_minmax(260px,.65fr)_auto] md:items-start">
        <span className="pt-2 text-[8px] tracking-[.28em] text-aer-blue">{num}</span>
        <div>
          <div className="flex items-center gap-3"><h3 className="font-editorial text-4xl tracking-[-.02em] transition duration-300 group-hover:text-white md:text-6xl">{title}</h3><Signal className="opacity-20 transition duration-300 group-hover:opacity-100" /></div>
          <p className="mt-3 max-w-2xl font-editorial text-2xl leading-tight text-white/65 transition duration-300 group-hover:text-white/85 md:text-3xl">{outcome}</p>
          <p className="mt-4 text-[8px] uppercase tracking-[.22em] text-white/25">{detail}</p>
        </div>
        <div className="border-l border-white/10 pl-5 md:min-h-[104px] md:pt-1 transition-colors duration-300 group-hover:border-aer-blue/35">
          <div className="text-[8px] uppercase tracking-[.25em] text-white/25">Outcome</div>
          <div className="mt-3 font-editorial text-2xl leading-none text-white/75 transition duration-300 group-hover:text-aer-blue md:text-3xl">{result}</div>
          <p className="mt-2 max-w-sm text-xs leading-5 text-white/35">{resultDetail}</p>
        </div>
        <ArrowRight size={17} className="mt-2 shrink-0 text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-aer-blue" />
      </div>
    </motion.article>
  );
}

function ProcessStage({ item, index, reduceMotion }: { item: string[]; index: number; reduceMotion: boolean | null }) {
  const [num, title, statement, question, disciplines, outcome] = item;
  return (
    <motion.article variants={reduceMotion ? undefined : riseChild} tabIndex={0} className="group relative border-t border-white/10 py-8 outline-none md:py-10">
      <div className="grid gap-6 md:grid-cols-[72px_1fr_210px] md:items-start">
        <div className="relative hidden h-full md:block"><span className="absolute left-[3px] top-2 h-2 w-2 rounded-full border border-aer-blue bg-[#0a0b0b] transition group-hover:bg-aer-blue group-focus-visible:bg-aer-blue" /><span className="absolute left-[6px] top-5 h-[calc(100%+44px)] w-px bg-white/10 transition-colors group-hover:bg-aer-blue/25 group-focus-visible:bg-aer-blue/25" /></div>
        <div className="md:-ml-12 md:pl-12"><div className="mb-3 flex flex-wrap items-center gap-3"><span className="text-[8px] tracking-[.28em] text-aer-blue">{num}</span><span className="text-[8px] uppercase tracking-[.3em] text-white/25">{disciplines}</span></div><h3 className="font-editorial text-4xl leading-none tracking-[-.02em] transition group-hover:text-white md:text-6xl">{title}</h3><p className="mt-4 max-w-xl font-editorial text-2xl leading-tight text-white/60 transition group-hover:text-white/80 md:text-3xl">{statement}</p></div>
        <div className="border-l border-white/10 pl-5 md:pt-2 transition-colors duration-300 group-hover:border-aer-blue/35 group-focus-visible:border-aer-blue/35"><div className="text-[8px] uppercase tracking-[.25em] text-white/25">The decision</div><p className="mt-3 text-xs leading-5 text-white/50 transition group-hover:text-aer-blue group-focus-visible:text-aer-blue">{question}</p><div className="mt-6 border-t border-white/10 pt-4"><div className="text-[8px] uppercase tracking-[.25em] text-white/25">Result</div><p className="mt-2 font-editorial text-2xl leading-none text-white/65 transition group-hover:text-white/90 md:text-3xl">{outcome}</p></div></div>
      </div>
    </motion.article>
  );
}

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const reveal = (delay = 0) => ({ initial: { opacity: 0, y: reduceMotion ? 0 : 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: reduceMotion ? 0.01 : 0.8, delay } });
  const aiRef = useRef<HTMLElement>(null);
  const { scrollYProgress: aiProgress } = useScroll({ target: aiRef, offset: ['start end', 'end start'] });
  const aiX1 = useTransform(aiProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['4%', '-4%']);
  const aiX2 = useTransform(aiProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-4%', '4%']);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { ai, contact, hero } = useSiteSettings();
  const trackWorkView = () => {
    if (supabase) void supabase.from('analytics_events').insert({ event_name: 'project_view', path: '#work' });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0b0b] text-aer-cream selection:bg-aer-blue selection:text-black">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_75%_10%,rgba(64,224,208,.08),transparent_22%),radial-gradient(circle_at_10%_45%,rgba(255,255,255,.025),transparent_25%)]" />
      <main id="top" className="relative z-10">
        <section className="relative flex min-h-screen items-end overflow-hidden border-b border-white/[.07] px-5 pb-16 pt-32 md:px-10 md:pb-24"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(120,210,225,.16),transparent_22%),radial-gradient(ellipse_at_82%_30%,rgba(255,255,255,.13),transparent_13%),linear-gradient(110deg,#0a0b0b_30%,#081215_62%,#0a0b0b)]" /><div className="absolute right-[13%] top-[13%] h-[48vw] w-[20vw] max-h-[640px] rounded-[50%_50%_6%_6%] border border-white/20 bg-black/20 shadow-[0_0_100px_rgba(64,224,208,.09)]" /><div className="absolute right-[14%] top-[16%] h-[42vw] w-[17vw] max-h-[560px] rounded-[50%_50%_3%_3%] bg-[radial-gradient(ellipse_at_70%_25%,rgba(255,255,255,.5),transparent_18%),linear-gradient(90deg,transparent,rgba(64,224,208,.08),transparent)] blur-[1px]" /><div className="absolute left-[7%] right-[7%] top-[24%] h-px bg-white/[.06]" /><div className="absolute bottom-[19%] left-[7%] right-[7%] h-px bg-white/[.06]" /><div className="relative mx-auto w-full max-w-[1500px]"><div className="grid items-end gap-12 md:grid-cols-[1.1fr_.55fr]"><div><SectionLabel>{hero.label}</SectionLabel><h1 className="max-w-5xl font-editorial text-[clamp(4rem,8.8vw,10rem)] leading-[.82] tracking-[-.045em]"><SplitWords text={hero.titleA} as="h1" immediate /><br /><MaskReveal delay={0.15} immediate><span className="text-white/35">{hero.titleB}</span></MaskReveal></h1><motion.p {...reveal(.12)} className="mt-8 max-w-lg text-sm leading-7 text-white/55 md:mt-9 md:max-w-xl md:text-base">{hero.sub}</motion.p><motion.a {...reveal(.2)} href="#work" className="mt-8 inline-flex items-center gap-4 rounded-full border border-white/20 px-5 py-3 text-[9px] uppercase tracking-[.28em] transition duration-300 hover:border-aer-blue hover:bg-aer-blue hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0b]">Explore our work <ArrowDownRight size={14} /></motion.a></div><div className="hidden pb-3 md:block"><div className="ml-auto max-w-[180px] border-l border-white/10 pl-5 text-[8px] uppercase leading-5 tracking-[.25em] text-white/35">Strategy<br />Design<br />Motion<br />Engineering<br /><span className="text-aer-blue">—</span><br />Systems that feel inevitable.</div></div></div></div></section>

        <WorkSection />

        <section id="capabilities" className="border-y border-white/[.07] bg-[#0d1010] px-5 py-28 md:px-10 md:py-36"><div className="mx-auto max-w-[1500px]"><motion.div {...reveal()} className="grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:items-end"><div><SectionLabel>Capabilities</SectionLabel><h2 className="max-w-xl font-editorial text-6xl leading-[.84] tracking-[-.04em] md:text-8xl"><SplitWords text="We make" /><br /><MaskReveal delay={0.12}><span className="text-white/30">things clear.</span></MaskReveal></h2></div><div className="max-w-xl text-sm leading-7 text-white/40 lg:pb-2">The capability is not the deliverable. The outcome is. We connect strategy, design and engineering so the final product feels like one decision.</div></motion.div><div className="mt-14 border-b border-white/10"><motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={reduceMotion ? undefined : staggerParent(0.09)}>{capabilities.map(([num, title, outcome, detail, result, resultDetail], i) => <CapabilityRow key={num} num={num} title={title} outcome={outcome} detail={detail} result={result} resultDetail={resultDetail} delay={i * .06} reduceMotion={reduceMotion} />)}</motion.div></div></div></section>

        <section id="process" className="mx-auto max-w-[1500px] px-5 py-28 md:px-10 md:py-40"><div className="grid gap-16 lg:grid-cols-[.55fr_1.45fr]"><motion.div {...reveal()} className="lg:sticky lg:top-32 lg:self-start"><SectionLabel>Process</SectionLabel><h2 className="max-w-xl font-editorial text-6xl leading-[.84] tracking-[-.04em] md:text-8xl"><SplitWords text="Better decisions," /><br /><MaskReveal delay={0.12}><span className="text-white/25">by design.</span></MaskReveal></h2><p className="mt-8 max-w-sm text-sm leading-7 text-white/40">We do not move from brief to pixels on autopilot. We create enough clarity at each stage to make the next decision obvious.</p></motion.div><div className="relative border-b border-white/10"><motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={reduceMotion ? undefined : staggerParent(0.07)}>{process.map((item, index) => <ProcessStage key={item[0]} item={item} index={index} reduceMotion={reduceMotion} />)}</motion.div><motion.div {...reveal(.18)} className="grid gap-4 border-t border-aer-blue/20 py-12 md:grid-cols-[72px_1fr] md:py-16"><div className="hidden md:block"><Signal /></div><div><div className="text-[8px] uppercase tracking-[.3em] text-aer-blue">The outcome</div><p className="mt-5 max-w-2xl font-editorial text-4xl leading-[.92] text-white/80 md:text-6xl">Good work isn't a straight line.<br /><span className="text-white/30">It’s a series of better decisions.</span></p></div></motion.div></div></div></section>

        <section id="studio" className="border-y border-white/[.07] bg-[#0d1010] px-5 py-28 md:px-10 md:py-36"><div className="mx-auto max-w-[1500px]"><motion.div {...reveal()} className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><SectionLabel>Studio</SectionLabel><h2 className="font-editorial text-6xl leading-[.84] md:text-8xl"><SplitWords text="Why we" /><br /><MaskReveal delay={0.12}><span className="text-white/25">work this way.</span></MaskReveal></h2><p className="mt-7 max-w-md text-sm leading-7 text-white/40">We stay close to the idea from first question to final detail. That continuity is what keeps strategy, design and technology from becoming separate layers.</p></div><div className="grid gap-8 md:grid-cols-2"><div className="border-t border-white/10 pt-5"><div className="text-[8px] tracking-[.25em] text-aer-blue">01 / CLARITY</div><p className="mt-5 text-sm leading-7 text-white/45">Start with the problem, not the production. Find the decision that actually matters.</p></div><div className="border-t border-white/10 pt-5"><div className="text-[8px] tracking-[.25em] text-aer-blue">02 / CONTINUITY</div><p className="mt-5 text-sm leading-7 text-white/45">Keep strategy, interface and engineering connected so nothing gets lost between handoffs.</p></div><div className="border-t border-white/10 pt-5 md:col-span-2"><div className="text-[8px] tracking-[.25em] text-aer-blue">03 / CRAFT</div><p className="mt-5 max-w-2xl font-editorial text-3xl leading-tight text-white/70 md:text-4xl">The detail is the proof. If the thinking is right, the smallest interaction should still feel intentional.</p></div></div></motion.div></div></section>

        <section ref={aiRef} id="ai-approach" aria-labelledby="ai-approach-title" className="relative scroll-mt-24 overflow-hidden border-y border-white/[.07] bg-[#0d1010] px-5 py-28 md:px-10 md:py-36"><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center overflow-hidden opacity-[0.03]" aria-hidden="true"><motion.span style={{ x: aiX1 }} className="whitespace-nowrap font-editorial text-[12vw] leading-none">ARTIFICIAL INTELLIGENCE</motion.span><motion.span style={{ x: aiX2 }} className="whitespace-nowrap font-editorial text-[12vw] leading-none">HUMAN CURATION</motion.span></div><div className="relative mx-auto max-w-[1500px]"><motion.div {...reveal()} className="flex flex-col items-center gap-12 text-center"><div className="flex flex-col items-center"><div className="flex justify-center"><SectionLabel>{ai.eyebrow}</SectionLabel></div><h2 id="ai-approach-title" className="text-center font-editorial text-6xl leading-[.84] md:text-8xl">{ai.headlineA} <span className="relative inline-block italic text-white/40">{ai.strike}<motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }} style={{ transformOrigin: 'left center' }} className="absolute left-0 top-1/2 h-[2px] w-full bg-aer-blue" aria-hidden="true" /></span>.<br /><span className="text-white/25">{ai.headlineB} <span className="italic text-aer-blue">{ai.accent}</span>.</span></h2><p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-7 text-white/40">{ai.body}</p></div><motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reduceMotion ? undefined : staggerParent(0.1)} className="mx-auto grid w-full max-w-5xl gap-3 text-left md:grid-cols-3"><motion.div variants={reduceMotion ? undefined : riseChild} className="group rounded-[22px] border border-white/10 p-6 transition duration-500 hover:-translate-y-1 hover:border-aer-blue/40"><div className="text-[8px] tracking-[.25em] text-aer-blue">01</div><h3 className="mt-14 font-editorial text-3xl">{ai.cards[0].title}</h3><p className="mt-3 text-xs leading-5 text-white/35">{ai.cards[0].body}</p></motion.div><motion.div variants={reduceMotion ? undefined : riseChild} className="group rounded-[22px] border border-white/10 bg-white/[.02] p-6 transition duration-500 hover:-translate-y-1 hover:border-aer-blue/40"><div className="text-[8px] tracking-[.25em] text-aer-blue">02</div><h3 className="mt-14 font-editorial text-3xl">{ai.cards[1].title}</h3><p className="mt-3 text-xs leading-5 text-white/35">{ai.cards[1].body}</p></motion.div><motion.div variants={reduceMotion ? undefined : riseChild} className="group rounded-[22px] border border-white/10 p-6 transition duration-500 hover:-translate-y-1 hover:border-aer-blue/40"><div className="text-[8px] tracking-[.25em] text-aer-blue">03</div><h3 className="mt-14 font-editorial text-3xl">{ai.cards[2].title}</h3><p className="mt-3 text-xs leading-5 text-white/35">{ai.cards[2].body}</p></motion.div></motion.div></motion.div></div></section>

        <section id="contact" className="border-t border-white/[.07] px-5 py-32 md:px-10 md:py-44"><div className="mx-auto max-w-[1500px]"><motion.div {...reveal()} className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end"><div><SectionLabel>{contact.eyebrow}</SectionLabel><h2 className="max-w-5xl font-editorial text-[clamp(4rem,9vw,9rem)] leading-[.8] tracking-[-.05em]"><SplitWords text={contact.titleA} /><br /><MaskReveal delay={0.12}><span className="text-white/25">{contact.titleB}</span></MaskReveal></h2><p className="mt-9 max-w-xl text-sm leading-7 text-white/40">{contact.sub}</p></div><div><button type="button" onClick={() => { if (!inquiryOpen && supabase) void supabase.from('analytics_events').insert({ event_name: 'contact_started', path: window.location.pathname }); setInquiryOpen(!inquiryOpen); }} aria-expanded={inquiryOpen} aria-controls="project-inquiry" className="group inline-flex items-center gap-4 rounded-full border border-white/20 px-6 py-4 text-[9px] uppercase tracking-[.28em] transition duration-300 hover:border-aer-blue hover:bg-aer-blue hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0b]">{inquiryOpen ? 'Close' : 'Start a Project'}<ChevronDown size={15} aria-hidden="true" className={`transition-transform duration-300 ${inquiryOpen ? 'rotate-180' : ''}`} /></button></div></motion.div><AnimatePresence initial={false}>{inquiryOpen && (<motion.div key="project-inquiry" id="project-inquiry" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] }} className="scroll-mt-28 overflow-hidden"><ProjectInquiry studioEmail={contact.studioEmail} /><div className="mt-8 text-center"><a href={`mailto:${contact.studioEmail}?subject=AER%20×%20VÆLOR%20Project%20Inquiry`} className="text-[9px] uppercase tracking-[0.28em] text-white/35 underline decoration-aer-blue/50 underline-offset-4 transition hover:text-aer-blue">Prefer email? {contact.studioEmail}</a></div></motion.div>)}</AnimatePresence></div></section>
      </main>
    </div>
  );
}
