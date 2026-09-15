'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when the element first enters the viewport.
 * Adds `in-view` class via the returned `inView` flag for CSS animation triggers.
 */
export function useInView<T extends HTMLElement = HTMLElement>(
  threshold  = 0.12,
  rootMargin = '0px 0px -32px 0px',
) {
  const ref              = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
