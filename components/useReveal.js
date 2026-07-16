import { useEffect, useRef } from 'react';

// Ajoute la classe "active" aux elements .reveal quand ils entrent dans le viewport.
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const els = root.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('active'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}
