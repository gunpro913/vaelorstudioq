import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useStudioEmail } from '../lib/siteSettings';

const faqs = [
  ['What does working with Vaelorstudio look like?', 'We start with context and direction, then move through design, build and refinement as one connected process. You always know what we are solving, what comes next and why.'],
  ['How do you approach a new project?', 'We first understand the product, audience, constraints and opportunity. From there we establish a clear direction, prototype the strongest ideas and refine the system before it ships.'],
  ['How long does a project usually take?', 'It depends on scope and complexity. We break the work into clear stages with milestones agreed up front, so the timeline stays visible as the project develops.'],
  ['What can you help us with?', 'Strategy, positioning, UX/UI, design systems, motion, frontend engineering, backend integration and product refinement can be combined around what the project actually needs.'],
  ['Can you work with an existing brand?', 'Yes. We can extend an established visual language or evolve it when the current system no longer supports the product or experience.'],
  ['Who will I work with?', 'You work directly with the studio throughout the project. That keeps decisions, feedback and direction close to the work rather than passing through layers.'],
  ['Can you stay involved after launch?', 'Yes, when it makes sense. We can continue with optimisation, new experiences, motion, feature work or ongoing product refinement.'],
  ['Do you build what you design?', 'Yes. We can take a project from strategy and interface design through production frontend and integration, keeping the final experience faithful to the original direction.'],
  ['What tools and technology do you use?', 'The stack follows the project. We choose tools for the right balance of speed, maintainability, performance and quality rather than forcing a fixed stack.'],
  ['How do you price projects?', 'Projects are scoped around the work involved rather than a fixed menu. Once we understand the brief, we define the scope, stages and investment clearly before work begins.'],
  ['Can I see relevant work before we start?', 'Yes. The selected work above is a starting point, and we can share relevant examples based on the type of product, brand or experience you are looking to build.'],
];

export default function Footer() {
  const [open, setOpen] = useState<number | null>(null);
  const year = new Date().getFullYear();
  const studioEmail = useStudioEmail();

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-white/[.06] bg-[#080d0e] text-aer-cream">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_35%,rgba(64,224,208,.03),transparent_26%),radial-gradient(circle_at_88%_75%,rgba(16,91,94,.08),transparent_32%)]" />
      <section id="faq" className="relative mx-auto max-w-[1500px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[.55fr_1.45fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-6 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[.32em] text-white/35"><span className="h-px w-7 bg-aer-blue/55" />Before we start</div>
            <h2 className="max-w-xl font-editorial text-6xl leading-[.84] tracking-[-.04em] md:text-8xl">Before<br /><span className="text-white/20">we start.</span></h2>
            <p className="mt-7 max-w-sm text-sm leading-7 text-white/35">The practical details, without the noise. If the right question is not here, ask us directly.</p>
          </div>
          <div className="border-t border-white/[.07]">
            {faqs.map(([question, answer], index) => {
              const isOpen = open === index;
              return (
                <div key={question} className="border-b border-white/[.07]">
                  <button type="button" aria-expanded={isOpen} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(isOpen ? null : index)} className="group flex w-full items-center justify-between gap-8 py-5 text-left md:py-6">
                    <span className="flex items-start gap-5"><span className="pt-1 text-[8px] tracking-[.25em] text-aer-blue/55">{String(index + 1).padStart(2, '0')}</span><span className="text-sm leading-6 text-white/65 transition-colors group-hover:text-white/90 md:text-[15px]">{question}</span></span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[.07] text-white/25 transition-all duration-300 group-hover:border-aer-blue/30 group-hover:text-aer-blue"><ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-aer-blue' : ''}`} /></span>
                  </button>
                  <div id={`faq-answer-${index}`} className={`grid transition-[grid-template-rows,opacity] duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden"><p className="max-w-2xl pb-6 pl-10 text-xs leading-6 text-white/35 md:pl-[3.75rem]">{answer}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <div className="relative mx-auto max-w-[1500px] border-t border-white/[.07] px-5 py-6 md:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <a href="#top" className="font-editorial text-2xl tracking-[-.03em] text-white/70 transition-colors hover:text-aer-blue">AER × VÆLOR</a>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[8px] uppercase tracking-[.24em] text-white/25" aria-label="Footer navigation">
            <a href="#work" className="transition hover:text-aer-blue">Work</a><a href="#studio" className="transition hover:text-aer-blue">About</a><a href="#ai-approach" className="transition hover:text-aer-blue">AI Approach</a><a href="#capabilities" className="transition hover:text-aer-blue">Capabilities</a><a href="#faq" className="transition hover:text-aer-blue">FAQ</a>
          </nav>
          <div className="flex items-center gap-4 text-[8px] uppercase tracking-[.24em] text-white/15 md:text-right"><a href={`mailto:${studioEmail}?subject=AER%20×%20VÆLOR%20Project%20Inquiry`} className="flex items-center gap-2 transition hover:text-aer-blue">Contact <ArrowUpRight size={12} /></a><span>© {year}</span></div>
        </div>
      </div>
    </footer>
  );
}
