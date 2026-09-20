import { useRef } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring, useReducedMotion } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const letterSpacing = useTransform(smoothVelocity, [-1000, 1000], ['-0.025em', '0.025em']);

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '14%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '32%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.94]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const splitText = (text: string) => text.split('').map((char, i) => (
    <span key={i} className="inline-block cursor-default transition-transform duration-500 hover:-translate-y-1 hover:text-aer-blue md:hover:-translate-y-2">
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <section ref={containerRef} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-aer-black">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(250,248,245,0.045),transparent_38%)]" />
        <div className="absolute inset-x-0 top-[28%] border-t border-aer-cream/[0.055]" />
        <div className="absolute inset-x-0 bottom-[18%] border-t border-aer-cream/[0.035]" />
        <div className="absolute left-[9%] top-0 h-full border-l border-aer-cream/[0.04]" />
        <div className="absolute right-[9%] top-0 h-full border-r border-aer-cream/[0.04]" />
      </div>

      <div className="absolute left-6 top-32 hidden flex-col gap-1 text-[9px] tracking-[0.3em] text-aer-cream/30 md:left-12 md:flex">
        <span>IDX: 001</span>
        <span>SYS: ONLINE</span>
        <span>LAT: 40.7128° N</span>
      </div>

      <div className="absolute bottom-12 right-6 hidden flex-col gap-1 text-right text-[9px] tracking-[0.3em] text-aer-cream/30 md:right-12 md:flex">
        <span>AER × VÆLOR</span>
        <span>EST. 2026</span>
      </div>

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 flex w-full flex-col items-center px-4 text-center md:px-12"
      >
        <motion.div style={{ letterSpacing }} className="mx-auto flex max-w-[96vw] flex-col items-center font-editorial text-[15vw] uppercase leading-[0.9] md:max-w-[90vw] md:text-[8vw]">
          <motion.div style={{ y: y1 }} className="flex gap-2 md:gap-4">
            <div>{splitText('Make')}</div>
            <div>{splitText('Your')}</div>
          </motion.div>
          <motion.div style={{ y: y2 }} className="italic text-aer-cream/90 transition-all duration-700 hover:scale-[1.02] md:hover:scale-105">
            {splitText('Website')}
          </motion.div>
          <motion.div style={{ y: y3 }} className="flex gap-2 md:gap-4">
            <div>{splitText('Hit The')}</div>
          </motion.div>
          <motion.div style={{ y: y1 }} className="flex gap-2 md:gap-4">
            <div>{splitText('Spotlight')}</div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-12 md:gap-4"
      >
        <span className="text-center text-[8px] uppercase tracking-[0.3em] text-aer-cream/40 md:text-[9px] md:tracking-[0.4em]">Scroll to explore</span>
        {!reduceMotion && (
          <motion.div
            animate={{ height: ['0px', '40px', '0px'], opacity: [0, 1, 0], y: [0, 20, 40] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px bg-aer-cream/40"
          />
        )}
      </motion.div>
    </section>
  );
}
