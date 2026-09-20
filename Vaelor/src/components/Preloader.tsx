import { motion, useReducedMotion } from 'framer-motion';
import { SplitWords } from './Kinetic';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Preloader() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b0b] text-aer-cream">
        <span className="font-editorial text-4xl uppercase tracking-widest md:text-6xl">
          AER × VÆLOR
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b0b] text-aer-cream"
      aria-hidden="true"
    >
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeIn' }}
        className="flex flex-col items-center px-6 text-center"
      >
        <div className="overflow-hidden">
          <SplitWords
            text="AER × VÆLOR"
            as="h1"
            immediate
            stagger={0.06}
            className="font-editorial text-4xl uppercase tracking-widest md:text-6xl"
          />
        </div>

        <div className="mt-6 h-px w-48 overflow-hidden bg-white/10 md:w-64">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            style={{ transformOrigin: 'left center' }}
            className="h-full w-full bg-aer-blue"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
          className="mt-5 text-[9px] uppercase leading-relaxed tracking-[0.32em] text-white/40"
        >
          Ideas, engineered for what&rsquo;s next
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
