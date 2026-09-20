import { motion } from 'framer-motion';

export default function Statement() {
  return (
    <section id="studio" className="relative py-32 md:py-48 px-6 md:px-12 bg-aer-charcoal flex items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl text-center"
      >
        <h2 className="font-editorial text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-wide uppercase">
          We design digital <span className="italic text-aer-cream/70">experiences</span> that deserve to be remembered.
        </h2>
      </motion.div>
    </section>
  );
}