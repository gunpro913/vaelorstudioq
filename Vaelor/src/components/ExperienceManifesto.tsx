import { motion } from 'framer-motion';

const principles = [
  { index: '01', title: 'GOOD WORK', accent: 'LEAVES A TRACE.', body: 'Not every interaction needs to demand attention. The right ones stay with you.' },
  { index: '02', title: 'EVERY DETAIL', accent: 'HAS WEIGHT.', body: 'Typography, motion, space and sound should feel considered — never accidental.' },
  { index: '03', title: 'THE RESULT', accent: 'SHOULD FEEL INEVITABLE.', body: 'We remove what does not belong until the idea and the experience become one.' },
];

export default function ExperienceManifesto() {
  return (
    <section id="pause" className="relative overflow-hidden border-t border-white/[.05] bg-[#0a0a0a] px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-6xl">
        <div className="mb-24 flex items-center justify-between border-b border-white/[.08] pb-6 md:mb-32">
          <span className="text-[10px] uppercase tracking-[0.3em] text-aer-blue">THE PAUSE</span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">VAELOR / PRINCIPLES</span>
        </div>
        <div className="space-y-0">
          {principles.map((principle, index) => (
            <motion.article key={principle.index} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.7, delay: index * 0.08, ease: 'easeOut' }} className="grid min-h-[45vh] items-center border-b border-white/[.08] py-16 md:grid-cols-[100px_1fr_280px] md:gap-12 md:py-20">
              <span className="mb-8 self-start pt-2 font-mono text-[10px] tracking-[0.2em] text-white/25 md:mb-0">{principle.index}</span>
              <h2 className="font-editorial text-5xl uppercase leading-[0.95] tracking-[-0.02em] md:text-7xl lg:text-8xl">{principle.title}<br /><span className="italic text-aer-blue">{principle.accent}</span></h2>
              <p className="mt-10 max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/45 md:mt-0">{principle.body}</p>
            </motion.article>
          ))}
        </div>
        <div className="flex justify-end pt-16"><p className="max-w-md text-right font-editorial text-2xl leading-tight text-white/60 md:text-3xl">Good work does not need to explain itself.</p></div>
      </div>
    </section>
  );
}
