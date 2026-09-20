import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const principles = [
  {
    index: '01',
    title: 'CLARITY',
    body: 'Every interface starts with a clear idea. We remove noise until the purpose is obvious.'
  },
  {
    index: '02',
    title: 'SYSTEMS',
    body: 'A strong digital experience is more than a screen. We build rules, structure, and rhythm that hold together.'
  },
  {
    index: '03',
    title: 'CRAFT',
    body: 'Details are not decoration. Type, motion, spacing, and interaction are where the character becomes visible.'
  }
];

export default function Philosophy() {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['4%', '-4%']);

  return (
    <section ref={containerRef} id="studio" className="relative overflow-hidden border-t border-aer-cream/10 bg-aer-black px-6 py-24 md:px-12 md:py-32">
      <motion.div style={{ y }} className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-5 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-aer-blue">STUDIO / PHILOSOPHY</p>
            <h2 className="mt-5 max-w-4xl font-editorial text-4xl uppercase leading-[1.05] text-aer-cream md:text-6xl lg:text-7xl">
              Make the idea<br />
              <span className="italic text-aer-cream/45">impossible to miss.</span>
            </h2>
          </div>
          <p className="max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.16em] text-aer-cream/45 md:pb-1">
            We design digital experiences where strategy, interface, and craft move as one.
          </p>
        </div>

        <div className="grid border-t border-aer-cream/10 md:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.article
              key={principle.index}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="border-b border-aer-cream/10 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.2em] text-aer-cream/35">{principle.index}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-aer-blue/70" />
              </div>
              <h3 className="mt-10 font-editorial text-2xl uppercase text-aer-cream">{principle.title}</h3>
              <p className="mt-4 max-w-sm text-[11px] uppercase leading-[1.8] tracking-[0.12em] text-aer-cream/50">{principle.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
