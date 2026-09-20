import { motion } from 'framer-motion';

const directions = [
  {
    number: '01',
    name: 'WEBSITE DESIGN',
    desc: 'Brand-led digital identities and editorial interfaces built with clarity and intent.'
  },
  {
    number: '02',
    name: 'INTERACTIVE EXPERIENCES',
    desc: 'Scroll, interaction and narrative used deliberately to turn attention into engagement.'
  },
  {
    number: '03',
    name: '3D & MOTION',
    desc: 'Spatial systems, motion and atmosphere that give digital experiences a stronger presence.'
  },
  {
    number: '04',
    name: 'WEBSITE REDESIGN',
    desc: 'Existing platforms reframed through stronger visual direction, UX and performance.'
  },
  {
    number: '05',
    name: 'CREATIVE DEVELOPMENT',
    desc: 'Experimental front-end work that extends the visual language through technology.'
  }
];

export default function Services() {
  return (
    <section id="services" className="bg-aer-charcoal px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-aer-cream/10 pb-16 md:grid-cols-[0.7fr_1.3fr] md:pb-24">
          <div className="flex items-start justify-between md:block">
            <p className="text-xs tracking-[0.24em] text-aer-blue">02 — SELECTED DIRECTION</p>
            <p className="hidden pt-4 text-[9px] tracking-[0.28em] text-aer-cream/30 md:block">WHAT WE MAKE</p>
          </div>

          <div className="max-w-4xl">
            <h2 className="font-editorial text-4xl leading-[0.98] tracking-[-0.02em] text-aer-cream md:text-6xl lg:text-7xl">
              Digital experiences built with intention.
            </h2>
            <p className="mt-8 max-w-2xl text-sm leading-7 tracking-[0.04em] text-aer-cream/50 md:text-base md:leading-8">
              We design and develop distinctive websites where visual identity, interaction and technology work as one.
            </p>
          </div>
        </div>

        <div className="divide-y divide-aer-cream/10">
          {directions.map((direction, i) => (
            <motion.div
              key={direction.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: 'easeOut' }}
              className="group grid gap-6 py-8 md:grid-cols-[0.7fr_1.3fr] md:py-10 lg:grid-cols-[0.7fr_1.3fr_1fr]"
            >
              <div className="flex items-start gap-4">
                <span className="pt-2 text-[9px] tracking-[0.2em] text-aer-blue">{direction.number}</span>
                <h3 className="font-editorial text-2xl leading-none tracking-[-0.01em] text-aer-cream/75 transition-all duration-500 group-hover:translate-x-2 group-hover:text-aer-cream md:text-4xl lg:text-5xl">
                  {direction.name}
                </h3>
              </div>

              <p className="max-w-xl text-xs leading-6 tracking-[0.08em] text-aer-cream/35 transition-colors duration-500 group-hover:text-aer-cream/60 md:text-sm md:leading-7">
                {direction.desc}
              </p>

              <div className="hidden items-end justify-end lg:flex">
                <span className="text-[9px] tracking-[0.25em] text-aer-cream/20 transition-colors duration-500 group-hover:text-aer-blue">
                  EXPLORE —›
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
