import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export default function Anatomy() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  
  const [hovered, setHovered] = useState<string | null>(null);

  const definitions = {
    aer: {
      title: "AER",
      phonetic: "AIR / FORMLESS",
      desc: "The atmosphere; the intangible space where ideas breathe and take form. Representing lightness, motion, and the invisible forces of digital design."
    },
    x: {
      title: "×",
      phonetic: "MULTIPLY / COEXIST",
      desc: "The intersection. A point of synthesis where form meets function, art coexists with technology, and collaboration multiplies impact."
    },
    vaelor: {
      title: "VÆLOR",
      phonetic: "VALOR / STRUCTURE",
      desc: "Strength, courage, and structural integrity. Representing the bold, brutalist, and uncompromising foundation of our visual language."
    }
  };

  return (
    <section ref={containerRef} className="py-24 md:py-48 px-6 md:px-12 bg-aer-charcoal relative border-t border-aer-cream/5 min-h-[60vh] md:min-h-[80vh] flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl w-full mx-auto flex flex-col relative">
        
        <div className="absolute top-0 left-0 w-full flex justify-between items-start">
          <p className="text-aer-blue text-xs tracking-[0.2em]">ANATOMY</p>
          <p className="text-[9px] tracking-[0.3em] text-aer-cream/30 uppercase hidden md:block">
            SYS_LOG: NOMENCLATURE
          </p>
        </div>

        <motion.div style={{ y }} className="w-full flex flex-col items-center justify-center relative mt-20 md:mt-24">
          
          <div 
            className="flex flex-col md:flex-row items-center justify-center font-editorial text-[16vw] md:text-[11vw] leading-none uppercase z-10 cursor-crosshair w-full"
            onMouseLeave={() => setHovered(null)}
          >
            <span 
              onMouseEnter={() => setHovered('aer')} 
              className={`w-full md:w-auto text-center py-2 md:py-8 md:px-8 transition-all duration-500 ${hovered === 'aer' ? 'text-aer-blue italic tracking-widest' : hovered ? 'text-aer-cream/20' : 'text-aer-cream'}`}
            >
              AER
            </span>
            <span 
              onMouseEnter={() => setHovered('x')} 
              className={`w-full md:w-auto text-center py-2 md:py-8 md:px-8 font-sans font-light transition-all duration-500 ${hovered === 'x' ? 'text-aer-blue scale-125' : hovered ? 'text-aer-cream/20' : 'text-aer-cream/50'}`}
            >
              ×
            </span>
            <span 
              onMouseEnter={() => setHovered('vaelor')} 
              className={`w-full md:w-auto text-center py-2 md:py-8 md:px-8 transition-all duration-500 ${hovered === 'vaelor' ? 'text-aer-blue italic tracking-widest' : hovered ? 'text-aer-cream/20' : 'text-aer-cream'}`}
            >
              VÆLOR
            </span>
          </div>

          <div className="h-40 md:h-48 w-full max-w-2xl mt-8 md:mt-16 relative flex items-start justify-center">
            <AnimatePresence mode="wait">
              {hovered ? (
                <motion.div
                  key={hovered}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="flex flex-col items-center text-center gap-4 md:gap-6 absolute w-full px-4"
                >
                  <div className="flex items-center gap-4 border-b border-aer-cream/20 pb-4">
                    <span className="font-editorial text-xl md:text-3xl text-aer-cream tracking-[0.2em]">{definitions[hovered as keyof typeof definitions].title}</span>
                    <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-aer-blue font-mono uppercase">{definitions[hovered as keyof typeof definitions].phonetic}</span>
                  </div>
                  <p className="text-[10px] md:text-xs tracking-[0.2em] text-aer-cream/60 leading-relaxed max-w-md uppercase">
                    {definitions[hovered as keyof typeof definitions].desc}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute flex flex-col items-center text-center"
                >
                  <p className="text-[9px] md:text-[10px] tracking-[0.3em] text-aer-cream/30 uppercase animate-pulse">
                    [ HOVER TO DECODE ]
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}