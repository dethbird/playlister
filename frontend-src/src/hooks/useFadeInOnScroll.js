import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Applies a batched fade-in animation to any element matching the selector.
 * Intended for components that mark nodes with data-animate="fade-in".
 */
export function useFadeInOnScroll(selector = '[data-animate="fade-in"]') {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    if (!gsap.core.globals().ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const elements = gsap.utils.toArray(selector);
    if (!elements.length) {
      return undefined;
    }

    gsap.set(elements, { autoAlpha: 0, y: 20 });

    const triggers = ScrollTrigger.batch(elements, {
      start: 'top 85%',
      onEnter: (batch) => {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.125,
          ease: 'power2.out'
        });
      },
      once: true
    }) || [];

    return () => {
      if (Array.isArray(triggers)) {
        triggers.forEach(trigger => trigger.kill());
      } else if (triggers?.kill) {
        triggers.kill();
      }
    };
  }, [selector]);
}
