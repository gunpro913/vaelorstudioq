import { motion, useReducedMotion } from 'framer-motion';

const capabilities = [
  {
    id: '01',
    title: 'DIRECTION',
    desc: 'Turning an idea into a clear digital point of view — structure, narrative, and visual language.'
  },
  {
    id: '02',
    title: 'INTERFACE',
    desc: 'Designing precise interfaces where typography, hierarchy, and interaction work as one system.'
  },
  {
    id: '03',
    title: 'MOTION',
    desc: 'Using movement with intention — transitions, pacing, and spatial cues that support the experience.'
  },
  {
    id: '04',
    title: 'ENGINEERING',
    desc: 'Building the front end with clean architecture, responsive behavior, and performance in mind.'
  }
];

export default function Capabilities() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="capabilities" className="relative overflow-hidden bg-aer-black px-6 py-24 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.8fr_1.8fr] md:gap-24">
          <div className="md:sticky md:top-32 md:self-start">
            <p className="text-xs tracking-[0.24em] text-aer-blue">CAPABILITIES</p>
            <p className="mt-3 max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.2em] text-aer-cream/35">
              A focused system for building digital experiences with character.
            </p>
          </div>

          <div className="border-t border-aer-cream/10">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.id}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.7, delay: reduceMotion ? 0 : i * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="group grid grid-cols-[44px_1fr] gap-4 border-b border-aer-cream/10 py-7 md:grid-cols-[56px_0.8fr_1.2fr] md:items-start md:gap-8 md:py-9"
              >
                <span className="pt-1 text-[10px] tracking-[0.2em] text-aer-blue">{cap.id}</span>

                <h3 className="font-editorial text-2xl uppercase leading-none text-aer-cream transition-[letter-spacing] duration-500 group-hover:tracking-[0.06em] md:text-4xl">
                  {cap.title}
                </h3>

                <p className="col-start-2 max-w-md text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-aer-cream/45 transition-colors duration-500 group-hover:text-aer-cream/70 md:col-start-auto md:pt-1">
                  {cap.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
