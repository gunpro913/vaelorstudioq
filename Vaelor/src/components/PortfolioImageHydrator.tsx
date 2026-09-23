import { useEffect } from 'react';

type ImageMap = { velora: string | null; nimble: string | null; flux: string | null };

const slots: (keyof ImageMap)[] = ['velora', 'nimble', 'flux'];

export default function PortfolioImageHydrator() {
  useEffect(() => {
    let active = true;

    void fetch('/api/images', { cache: 'no-store' })
      .then(response => (response.ok ? (response.json() as Promise<ImageMap>) : null))
      .then(images => {
        if (!active || !images) return;
        for (const slot of slots) {
          const url = images[slot];
          if (!url) continue;
          const visual = document.querySelector<HTMLElement>(`#work [data-slot="${slot}"] .work-visual-bg`);
          if (!visual) continue;
          visual.style.backgroundImage = `linear-gradient(rgba(5,7,8,.28), rgba(5,7,8,.36)), url("${url}")`;
          visual.style.backgroundSize = 'cover';
          visual.style.backgroundPosition = 'center';
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return null;
}
