'use client';

import { useEffect, useRef, useState } from 'react';

// Count a number up from 0 to `target` once, when triggered. Respects
// prefers-reduced-motion (jumps straight to the target). Returns the current
// display value; call the returned start() when the element becomes visible.
export function useCountUp(target, { duration = 1200, start = true } = {}) {
        const [value, setValue] = useState(0);
        const rafRef = useRef(null);

        useEffect(() => {
                if (!start) return undefined;
                const reduce =
                        typeof window !== 'undefined' &&
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (reduce) {
                        setValue(target);
                        return undefined;
                }
                const t0 = performance.now();
                const tick = (now) => {
                        const p = Math.min(1, (now - t0) / duration);
                        // ease-out cubic
                        const eased = 1 - Math.pow(1 - p, 3);
                        setValue(target * eased);
                        if (p < 1) rafRef.current = requestAnimationFrame(tick);
                        else setValue(target);
                };
                rafRef.current = requestAnimationFrame(tick);
                return () => rafRef.current && cancelAnimationFrame(rafRef.current);
        }, [target, duration, start]);

        return value;
}

// Small helper: fires `onEnter` once when the ref first scrolls into view.
export function useInViewOnce(ref, onEnter, { threshold = 0.3 } = {}) {
        const firedRef = useRef(false);
        useEffect(() => {
                const el = ref.current;
                if (!el) return undefined;
                const io = new IntersectionObserver(
                        ([entry]) => {
                                if (entry.isIntersecting && !firedRef.current) {
                                        firedRef.current = true;
                                        onEnter();
                                }
                        },
                        { threshold },
                );
                io.observe(el);
                return () => io.disconnect();
        }, [ref, onEnter, threshold]);
}
