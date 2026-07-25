import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// `enabled` lets routes that drive their own scroll animation (e.g. the GSAP
// ScrollTrigger-based virtual tour) opt out of Lenis's smoothed wheel/scroll
// handling, which otherwise fights the pin/scrub/snap timing.
export function useLenis(enabled = true) {
        const lenisRef = useRef(null);
        useEffect(() => {
                if (!enabled) return undefined;
                const lenis = new Lenis({
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        smoothWheel: true,
                        wheelMultiplier: 1.0,
                });
                lenisRef.current = lenis;

                let rafId;
                const raf = (time) => {
                        lenis.raf(time);
                        rafId = requestAnimationFrame(raf);
                };
                rafId = requestAnimationFrame(raf);

                return () => {
                        cancelAnimationFrame(rafId);
                        lenis.destroy();
                };
        }, [enabled]);
        return lenisRef;
}
