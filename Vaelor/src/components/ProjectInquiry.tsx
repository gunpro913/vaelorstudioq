import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FALLBACK_EMAIL } from '../lib/siteSettings';
const EASE = [0.16, 1, 0.3, 1] as const;

const BUILD_OPTIONS = ['Brand identity', 'Website', 'Digital product', 'Campaign', 'Something else'];
const STAGE_OPTIONS = ['Just an idea', 'Planning', 'Already building', 'Existing brand/product that needs a new direction'];
const SUPPORT_OPTIONS = ['Strategy', 'Creative direction', 'Design', 'Development', 'Full project'];
const TIMELINE_OPTIONS = ['As soon as possible', 'Within 1 month', '1–3 months', '3+ months', 'Just exploring'];

const STEP_LABELS = [
  'What are you looking to build?',
  'Tell us a little about it.',
  'Where are you in the process?',
  'What kind of support are you looking for?',
  'When would you like to start?',
  'How can we reach you?',
];

function OptionRow({
  selected,
  onSelect,
  children,
  multi = false,
}: {
  selected: boolean;
  onSelect: () => void;
  children: string;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? undefined : 'radio'}
      aria-checked={multi ? undefined : selected}
      aria-pressed={multi ? selected : undefined}
      onClick={onSelect}
      className={`group flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1111] ${
        selected
          ? 'border-aer-blue/60 bg-aer-blue/[0.06] text-white'
          : 'border-white/10 bg-transparent text-white/60 hover:border-white/25 hover:text-white'
      }`}
    >
      <span className="text-sm tracking-wide">{children}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition duration-300 ${
          selected ? 'border-aer-blue bg-aer-blue text-black' : 'border-white/20 text-transparent'
        }`}
        aria-hidden="true"
      >
        <Check size={12} strokeWidth={3} />
      </span>
    </button>
  );
}

export default function ProjectInquiry({ studioEmail = FALLBACK_EMAIL }: { studioEmail?: string }) {
  const reduceMotion = useReducedMotion();
  const D = reduceMotion ? 0.01 : 0.3;
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [build, setBuild] = useState('');
  const [details, setDetails] = useState('');
  const [stage, setStage] = useState('');
  const [support, setSupport] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [link, setLink] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mailed, setMailed] = useState(false);
  const [error, setError] = useState('');

  const go = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setError('');
    setStep(next);
  };

  const toggleSupport = (option: string) => {
    setSupport((prev) => (prev.includes(option) ? prev.filter((s) => s !== option) : [...prev, option]));
  };

  const stepValid = () => {
    switch (step) {
      case 0:
        return build !== '';
      case 1:
        return details.trim().length >= 10;
      case 2:
        return stage !== '';
      case 3:
        return support.length > 0;
      case 4:
        return timeline !== '';
      case 5:
        return name.trim() !== '' && /^\S+@\S+\.\S+$/.test(email.trim());
      default:
        return false;
    }
  };

  const submit = async () => {
    if (!stepValid()) {
      setError(
        step === 1
          ? 'Give us a little more — at least a sentence or two.'
          : 'Please add your name and a valid email so we can reply.',
      );
      return;
    }
    const subject = `Project Inquiry: ${build} — ${name}`;
    const body = [
      `Looking to build: ${build}`,
      `About the project: ${details.trim()}`,
      `Current stage: ${stage}`,
      `Support needed: ${support.join(', ')}`,
      `Timeline: ${timeline}`,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Company / brand: ${company.trim() || '—'}`,
      `Website / social: ${link.trim() || '—'}`,
    ].join('\n\n');

    let useMailto = true;
    if (supabase) {
      const { error: insertError } = await supabase.from('inquiries').insert({
        name: name.trim(),
        email: email.trim(),
        project_type: build,
        timeline,
        details: details.trim(),
        stage,
        support,
        company: company.trim(),
        link: link.trim(),
      });
      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
        setError(insertError.message || 'Failed to submit inquiry to database.');
        return;
      }
      useMailto = false;
      void supabase.from('analytics_events').insert({ event_name: 'inquiry_submitted', path: window.location.pathname });
    }
    if (useMailto) {
      window.setTimeout(() => {
        window.location.href = `mailto:${studioEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }, 350);
    }
    setMailed(useMailto);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-[26px] border border-white/10 bg-[#0e1111] p-6 text-center md:mt-14 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: EASE }}
          className="flex min-h-[40vh] flex-col items-center justify-center"
        >
          <span className="inline-flex h-2 w-2 rounded-full bg-aer-blue shadow-[0_0_18px_rgba(64,224,208,.9)]" aria-hidden="true" />
          <p className="mt-6 text-[9px] uppercase tracking-[0.32em] text-aer-blue">Inquiry received</p>
          <h3 className="mt-5 max-w-xl font-editorial text-5xl leading-[0.9] md:text-7xl">
            Thanks. We have
            <br />
            <span className="italic text-aer-blue">what we need.</span>
          </h3>
          <p className="mx-auto mt-6 max-w-md text-xs leading-6 text-white/45">
            We&rsquo;ll review your project and get back to you with the next step.{' '}
            {mailed
              ? 'Your email client should have opened with everything prefilled — just hit send.'
              : 'Your inquiry is saved in the studio inbox.'}
          </p>
          <div className="mt-8 flex max-w-lg flex-wrap justify-center gap-x-4 gap-y-2 border-t border-white/10 pt-6 text-[8px] uppercase tracking-[0.2em] text-white/35">
            <span>{build}</span>
            <span className="text-aer-blue">·</span>
            <span>{stage}</span>
            <span className="text-aer-blue">·</span>
            <span>{timeline}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              go(0);
            }}
            className="mt-8 text-[9px] uppercase tracking-[0.28em] text-white/40 underline decoration-aer-blue/50 underline-offset-4 transition hover:text-aer-blue"
          >
            Start another inquiry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 w-full max-w-4xl overflow-hidden rounded-[26px] border border-white/10 bg-[#0e1111] p-6 md:mt-14 md:p-10">
      <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <span className="text-[9px] tracking-[0.22em] text-aer-blue">INITIATE</span>
          <span className="hidden text-[8px] tracking-[0.16em] text-white/20 sm:inline">PROJECT INQUIRY</span>
        </div>
        <span className="text-[9px] tracking-[0.18em] text-white/25" aria-live="polite">
          0{step + 1} / 06
        </span>
      </div>
      <div className="mb-8 h-px w-full bg-white/10" aria-hidden="true">
        <motion.div
          animate={{ scaleX: (step + 1) / 6 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: EASE }}
          style={{ transformOrigin: 'left center' }}
          className="h-full w-full bg-aer-blue"
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: reduceMotion ? 0 : 24 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduceMotion ? 0 : -24 * direction }}
          transition={{ duration: D, ease: EASE }}
        >
          <p className="mb-3 text-[9px] tracking-[0.2em] text-white/30">
            0{step + 1} — {STEP_LABELS[step].toUpperCase()}
          </p>
          <h3 className="font-editorial text-3xl leading-tight text-white/90 md:text-4xl">{STEP_LABELS[step]}</h3>

          <div className="mt-7">
            {step === 0 && (
              <div role="radiogroup" aria-label={STEP_LABELS[0]} className="grid gap-2.5">
                {BUILD_OPTIONS.map((option) => (
                  <OptionRow key={option} selected={build === option} onSelect={() => setBuild(option)}>
                    {option}
                  </OptionRow>
                ))}
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="mb-4 max-w-xl text-xs leading-6 text-white/40">
                  What are you building, and what do you want it to achieve?
                </p>
                <label htmlFor="project-details" className="sr-only">
                  Project details
                </label>
                <textarea
                  id="project-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us about the project, the audience, and what success looks like…"
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-aer-blue/60"
                />
              </div>
            )}

            {step === 2 && (
              <div role="radiogroup" aria-label={STEP_LABELS[2]} className="grid gap-2.5">
                {STAGE_OPTIONS.map((option) => (
                  <OptionRow key={option} selected={stage === option} onSelect={() => setStage(option)}>
                    {option}
                  </OptionRow>
                ))}
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="mb-4 max-w-xl text-xs leading-6 text-white/40">Select all that apply.</p>
                <div className="grid gap-2.5">
                  {SUPPORT_OPTIONS.map((option) => (
                    <OptionRow key={option} multi selected={support.includes(option)} onSelect={() => toggleSupport(option)}>
                      {option}
                    </OptionRow>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div role="radiogroup" aria-label={STEP_LABELS[4]} className="grid gap-2.5">
                {TIMELINE_OPTIONS.map((option) => (
                  <OptionRow key={option} selected={timeline === option} onSelect={() => setTimeline(option)}>
                    {option}
                  </OptionRow>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="grid gap-2.5">
                <div className="grid gap-2.5 md:grid-cols-2">
                  <div>
                    <label htmlFor="inquiry-name" className="sr-only">
                      Your name
                    </label>
                    <input
                      id="inquiry-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="YOUR NAME *"
                      autoComplete="name"
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-xs tracking-[0.08em] text-white outline-none placeholder:text-white/25 focus:border-aer-blue/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiry-email" className="sr-only">
                      Your email
                    </label>
                    <input
                      id="inquiry-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="YOUR EMAIL *"
                      autoComplete="email"
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-xs tracking-[0.08em] text-white outline-none placeholder:text-white/25 focus:border-aer-blue/60"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="inquiry-company" className="sr-only">
                    Company or brand
                  </label>
                  <input
                    id="inquiry-company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="COMPANY / BRAND"
                    autoComplete="organization"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-xs tracking-[0.08em] text-white outline-none placeholder:text-white/25 focus:border-aer-blue/60"
                  />
                </div>
                <div>
                  <label htmlFor="inquiry-link" className="sr-only">
                    Website or social link (optional)
                  </label>
                  <input
                    id="inquiry-link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="WEBSITE OR SOCIAL LINK (OPTIONAL)"
                    autoComplete="url"
                    inputMode="url"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-xs tracking-[0.08em] text-white outline-none placeholder:text-white/25 focus:border-aer-blue/60"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {error !== '' && (
        <p role="alert" className="mt-5 text-[10px] tracking-[0.08em] text-aer-blue">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={() => (step > 0 ? go(step - 1) : undefined)}
          disabled={step === 0}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[9px] uppercase tracking-[0.24em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue ${
            step === 0
              ? 'cursor-default border-transparent text-white/15'
              : 'border-white/15 text-white/60 hover:border-white/30 hover:text-white'
          }`}
        >
          <ArrowLeft size={13} aria-hidden="true" /> Back
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={() => stepValid() && go(step + 1)}
            disabled={!stepValid()}
            className={`inline-flex items-center gap-3 rounded-full px-6 py-3 text-[9px] uppercase tracking-[0.24em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1111] ${
              stepValid()
                ? 'bg-white text-[#0a0b0b] hover:bg-aer-blue'
                : 'cursor-not-allowed bg-white/10 text-white/25'
            }`}
          >
            Continue <ArrowRight size={13} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-[9px] uppercase tracking-[0.24em] text-white transition hover:border-aer-blue hover:bg-aer-blue hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aer-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1111]"
          >
            Submit Project <ArrowRight size={13} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
