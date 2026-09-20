import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Manifesto() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.3, 1], [0, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.15, 0.3, 1], ["50%", "0%", "-50%", "-50%"]);

  const opacity2 = useTransform(scrollYProgress, [0.25, 0.45, 0.6, 1], [0, 1, 0, 0]);
  const y2 = useTransform(scrollYProgress, [0.25, 0.45, 0.6, 1], ["50%", "0%", "-50%", "-50%"]);

  const opacity3 = useTransform(scrollYProgress, [0.55, 0.75, 0.95, 1], [0, 1, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0.55, 0.75, 0.95, 1], ["50%", "0%", "0%", "0%"]);

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);

  return (
    <section ref={containerRef} className="h-[200vh] relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 md:px-12 text-center overflow-hidden">
        
        <motion.div style={{ scale }} className="max-w-4xl flex flex-col relative z-10 w-full h-[300px] items-center justify-center">
          
          <motion.h2 
            style={{ opacity: opacity1, y: y1 }} 
            className="absolute font-editorial text-4xl md:text-6xl lg:text-7xl uppercase leading-tight"
          >
            THE WEBSITE ISN'T THE PRODUCT.
          </motion.h2>
          
          <motion.h2 
            style={{ opacity: opacity2, y: y2 }} 
            className="absolute font-editorial text-4xl md:text-6xl lg:text-7xl uppercase leading-tight text-aer-blue italic"
          >
            THE EXPERIENCE IS.
          </motion.h2>
          
          <motion.p 
            style={{ opacity: opacity3, y: y3 }} 
            className="absolute text-xs md:text-sm tracking-[0.2em] text-aer-cream/60 max-w-lg mx-auto leading-relaxed"
          >
            MINIMALISM DOES NOT MEAN EMPTY. EXPERIMENTAL DOES NOT MEAN CHAOTIC. EVERY ELEMENT MUST HAVE A PURPOSE.
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
}