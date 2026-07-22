'use client';

import { useEffect, useRef } from 'react';

// Gold dot + trailing ring cursor. Auto-disabled on touch / small screens.
export default function CustomCursor() {
        const dotRef = useRef(null);
        const ringRef = useRef(null);

        useEffect(() => {
                const isTouch = window.matchMedia('(pointer: coarse)').matches;
                if (isTouch) return undefined;

                document.body.classList.add('has-custom-cursor');

                let mx = window.innerWidth / 2;
                let my = window.innerHeight / 2;
                let rx = mx;
                let ry = my;

                const onMove = (e) => {
                        mx = e.clientX;
                        my = e.clientY;
                        if (dotRef.current) {
                                dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
                        }
                };

                const onEnter = () => {
                        if (ringRef.current) {
                                ringRef.current.style.width = '52px';
                                ringRef.current.style.height = '52px';
                                ringRef.current.style.borderColor = '#E8C978';
                        }
                };
                const onLeave = () => {
                        if (ringRef.current) {
                                ringRef.current.style.width = '32px';
                                ringRef.current.style.height = '32px';
                                ringRef.current.style.borderColor = '#C9A24B';
                        }
                };

                let raf;
                const tick = () => {
                        rx += (mx - rx) * 0.15;
                        ry += (my - ry) * 0.15;
                        if (ringRef.current) {
                                ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
                        }
                        raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);

                window.addEventListener('mousemove', onMove);
                document
                        .querySelectorAll('a, button, [role="button"], input, textarea')
                        .forEach((el) => {
                                el.addEventListener('mouseenter', onEnter);
                                el.addEventListener('mouseleave', onLeave);
                        });

                // Re-scan for interactive elements when DOM updates.
                const observer = new MutationObserver(() => {
                        document
                                .querySelectorAll('a, button, [role="button"], input, textarea')
                                .forEach((el) => {
                                        el.addEventListener('mouseenter', onEnter);
                                        el.addEventListener('mouseleave', onLeave);
                                });
                });
                observer.observe(document.body, { childList: true, subtree: true });

                return () => {
                        cancelAnimationFrame(raf);
                        window.removeEventListener('mousemove', onMove);
                        observer.disconnect();
                        document.body.classList.remove('has-custom-cursor');
                };
        }, []);

        return (
                <>
                        <div ref={dotRef} className="custom-cursor-dot" aria-hidden />
                        <div ref={ringRef} className="custom-cursor-ring" aria-hidden />
                </>
        );
}
