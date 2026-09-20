import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

export const SPRING_SOFT = { type: 'spring', stiffness: 350, damping: 32 } as const;

export const staggerParent = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const riseChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.25 } },
};

export function SplitWords({
  text,
  className = '',
  delay = 0,
  stagger = 0.035,
  as = 'span',
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2';
  immediate?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');
  if (reduceMotion) {
    const Tag = as === 'h1' ? 'span' : 'span';
    return <Tag className={className}>{text}</Tag>;
  }
  const Container = as === 'h1' ? motion.span : motion.span;
  const trigger = immediate
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const };
  return (
    <Container
      className={className}
      initial="hidden"
      {...trigger}
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Container>
  );
}

export function MaskReveal({
  children,
  className = '',
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  const trigger = immediate
    ? { animate: { y: '0%', opacity: 1 } as const }
    : { whileInView: { y: '0%', opacity: 1 } as const };
  return (
    <span className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: '105%', opacity: 0 }}
        {...trigger}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}
