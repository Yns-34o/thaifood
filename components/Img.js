'use client';

import { useEffect, useRef, useState } from 'react';

// Image robuste :
//  - fondu à l'apparition (classe `loaded` ajoutée au chargement) ;
//  - placeholder (fond dégradé) visible pendant le chargement ;
//  - repli gracieux (emoji sur dégradé) si l'image distante échoue.
//
// IMPORTANT : le CSS global met toutes les <img> à `opacity:0` tant que la
// classe `loaded` n'est pas posée. Une image cassée ne déclenche jamais
// `onLoad` → elle restait invisible (carte vide). Le repli `onError` corrige
// définitivement ce cas.
export default function Img({ className = '', src, alt, fallback = '🍽️', ...props }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    if (ref.current && ref.current.complete) {
      ref.current.classList.add('loaded');
    }
  }, [src]);

  return (
    <div className={`img-wrap relative overflow-hidden ${className}`}>
      <div className="img-ph absolute inset-0" aria-hidden="true" />
      {failed ? (
        <div
          className="img-fallback absolute inset-0 flex items-center justify-center"
          role="img"
          aria-label={alt}
        >
          <span className="text-5xl drop-shadow-lg">{fallback}</span>
        </div>
      ) : (
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          className="relative w-full h-full object-cover"
          onLoad={(e) => e.currentTarget.classList.add('loaded')}
          onError={() => setFailed(true)}
          {...props}
        />
      )}
    </div>
  );
}
