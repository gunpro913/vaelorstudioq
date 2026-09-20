import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Preloader from './components/Preloader';
import LandingPage from './components/LandingPage';
import LandingParticles from './components/LandingParticles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Admin from './components/Admin';
import PortfolioImageHydrator from './components/PortfolioImageHydrator';
import ExperienceManifesto from './components/ExperienceManifesto';
import { supabase } from './lib/supabase';

function PublicSite() {
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), reduceMotion ? 0 : 1100);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (!supabase) return;
    void supabase.from('analytics_events').insert({
      event_name: 'page_view',
      path: window.location.pathname,
    });
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-aer-cream px-4 py-2 text-[10px] font-medium uppercase tracking-[.2em] text-[#071011] shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>
      {!loading && (
        <motion.main
          id="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.8, ease: 'easeOut' }}
          className="relative w-full"
        >
          <Navbar />
          <LandingPage />
          <ExperienceManifesto />
          <Footer />
          <LandingParticles />
          <PortfolioImageHydrator />
        </motion.main>
      )}
    </>
  );
}

function App() {
  if (window.location.pathname.startsWith('/admin/images')) {
    window.location.replace('/admin');
    return null;
  }
  if (window.location.pathname.startsWith('/admin')) return <Admin />;
  return <PublicSite />;
}

export default App;
