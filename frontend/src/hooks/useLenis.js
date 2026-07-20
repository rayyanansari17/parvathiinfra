import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useLenis() {
        const lenisRef = useRef(null);
        useEffect(() => {
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
        }, []);
        return lenisRef;
}
