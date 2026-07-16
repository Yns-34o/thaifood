import { useEffect, useRef } from 'react';

// Image qui devient visible (fondu) une fois chargee.
// Gerer aussi le cas ou l'image est deja en cache (complete) au montage.
export default function Img({ className, src, alt, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.complete) {
      ref.current.classList.add('loaded');
    }
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onLoad={(e) => e.currentTarget.classList.add('loaded')}
      {...props}
    />
  );
}
