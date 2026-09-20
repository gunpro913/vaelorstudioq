import { useEffect } from 'react';

type ImageMap = { velora: string | null; nimble: string | null; flux: string | null };

export default function PortfolioImageHydrator() {
  useEffect(() => {
    let active = true;

    void fetch('/api/images', { cache: 'no-store' })
      .then(response => response.ok ? response.json() as Promise<ImageMap> : null)
      .then(images => {
        if (!active || !images) return;
        const cards = Array.from(document.querySelectorAll<HTMLElement>('#work article'));
        const urls = [images.velora, images.nimble, images.flux];

        cards.slice(0, 3).forEach((card, index) => {
          const url = urls[index];
          if (!url) return;
          const visual = card.querySelector<HTMLElement>('.absolute.inset-0');
          if (!visual) return;
          visual.style.backgroundImage = `linear-gradient(rgba(5,7,8,.28), rgba(5,7,8,.36)), url("${url}")`;
          visual.style.backgroundSize = 'cover';
          visual.style.backgroundPosition = 'center';
        });
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return null;
}
