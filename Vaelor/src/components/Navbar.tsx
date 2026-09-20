import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BookOpen, BriefcaseBusiness, FlaskConical, Mail, Menu, Pause, Send, Sparkles, UserRound, X } from 'lucide-react';
import { useStudioEmail } from '../lib/siteSettings';

const links = [
  { name: 'Work', href: '#work', icon: BriefcaseBusiness },
  { name: 'Capabilities', href: '#capabilities', icon: BookOpen },
  { name: 'Process', href: '#process', icon: Sparkles },
  { name: 'Studio', href: '#studio', icon: UserRound },
  { name: 'AI Approach', href: '#ai-approach', icon: FlaskConical },
  { name: 'Pause', href: '#pause', icon: Pause },
  { name: 'Contact', href: '#contact', icon: Send },
];

const itemTransition = { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const };
const navTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };
const menuList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};
const menuItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.16 } },
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
    let frame = 0;
    let collapsed = window.scrollY > 72;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const next = collapsed ? y > 48 : y > 96;
      if (next !== collapsed) {
        collapsed = next;
        setScrolled(next);
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    setScrolled(collapsed);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const ids = ['work', 'capabilities', 'process', 'studio', 'ai-approach', 'pause', 'contact'];
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const studioEmail = useStudioEmail();

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 top-4 z-50 mx-auto w-fit max-w-[calc(100vw-32px)] rounded-full border border-white/[0.12] bg-[#071011]/45 p-1.5 text-white shadow-[0_12px_36px_rgba(0,0,0,0.24),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl backdrop-saturate-125"
        aria-label="Primary navigation"
      >
        <div className={`flex min-h-10 items-center gap-1 ${scrolled ? '' : 'justify-between'}`}>
          <a href="#top" aria-label="Home" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white text-[#0a0b0b] transition-transform duration-300 ease-out hover:scale-[1.04] focus-visible:outline focus-visible:outline-1 focus-visible:outline-aer-blue" onClick={closeMenu}>
            <span className="font-editorial text-[23px] font-semibold leading-none">A</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const showLabel = !scrolled || activeItem === link.name;
              const isActive = activeSection === link.href.slice(1);
              return (
                <motion.a
                  key={link.name}
                  href={link.href}
                  aria-label={scrolled ? link.name : undefined}
                  aria-current={isActive ? 'true' : undefined}
                  onHoverStart={() => setActiveItem(link.name)}
                  onHoverEnd={() => setActiveItem(null)}
                  onFocus={() => setActiveItem(link.name)}
                  onBlur={() => setActiveItem(null)}
                  className={`group relative flex h-9 items-center overflow-hidden rounded-full border border-transparent text-white/70 transition-colors duration-300 ease-out hover:border-white/10 hover:bg-white/[0.065] hover:text-white focus-visible:border-white/15 focus-visible:bg-white/[0.065] focus-visible:text-white focus-visible:outline-none ${showLabel ? 'px-2.5' : 'w-9 justify-center px-0'}`}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  transition={itemTransition}
                >
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.85 }}
                    transition={reduceMotion ? { duration: 0.01 } : { duration: 0.25 }}
                    className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.07]"
                  />
                  <Icon size={15} strokeWidth={1.7} className="relative shrink-0" aria-hidden="true" />
                  <span aria-hidden={!showLabel} className={`grid transition-all duration-300 ease-out motion-reduce:transition-none ${showLabel ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0'}`}>
                    <span className="ml-2 overflow-hidden whitespace-nowrap text-[10px] font-medium tracking-[0.02em]">{link.name}</span>
                  </span>
                </motion.a>
              );
            })}
          </div>

          <motion.a href={`mailto:${studioEmail}`} onHoverStart={() => setActiveItem('Email')} onHoverEnd={() => setActiveItem(null)} onFocus={() => setActiveItem('Email')} onBlur={() => setActiveItem(null)} className="hidden h-9 shrink-0 items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.045] px-3 text-white/80 transition-colors duration-300 ease-out hover:bg-white/[0.085] hover:text-white focus-visible:outline-none md:flex" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} transition={itemTransition}>
            <Mail size={15} strokeWidth={1.7} className="shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap text-[10px] font-medium tracking-wide" style={{ marginLeft: 8 }}>{studioEmail}</span>
          </motion.a>

          <motion.button type="button" animate={{ scale: scrolled ? 0.96 : 1 }} transition={navTransition} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className="flex"
              >
                {menuOpen ? <X size={18} strokeWidth={1.7} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.7} aria-hidden="true" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-[#080b0c]/95 px-6 pb-10 pt-24 text-white backdrop-blur-xl md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <motion.nav variants={menuList} initial="hidden" animate="show" exit="exit" className="m-auto flex w-full max-w-sm flex-col gap-1" aria-label="Mobile">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href.slice(1);
              return <motion.a key={link.name} href={link.href} variants={menuItem} onClick={closeMenu} className={`flex items-center gap-3 rounded-2xl px-3 py-3 font-editorial text-2xl transition-colors duration-200 hover:bg-white/[0.05] hover:text-aer-blue focus-visible:outline focus-visible:outline-1 focus-visible:outline-aer-blue ${isActive ? 'text-aer-blue' : ''}`}><Icon size={20} strokeWidth={1.5} aria-hidden="true" />{link.name}</motion.a>;
            })}
            </motion.nav>
            <motion.a href={`mailto:${studioEmail}`} onClick={closeMenu} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ delay: 0.3, duration: 0.3 }} className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[10px] font-medium text-[#0a0b0b]"><Mail size={14} aria-hidden="true" />Email</motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
