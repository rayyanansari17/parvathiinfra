'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Auto-looping crossfade of the project's real renders for the home-page
 * flagship section. Advances on its own, pauses on hover, and holds on the
 * first frame under prefers-reduced-motion. Keeps the gold-framed, captioned
 * look of the card it replaces.
 */
export default function FlagshipShowcase({ images, interval = 4000 }) {
        const [active, setActive] = useState(0);
        const [reduced, setReduced] = useState(false);
        const pausedRef = useRef(false);

        useEffect(() => {
                const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
                setReduced(mq.matches);
                const onChange = (e) => setReduced(e.matches);
                mq.addEventListener?.('change', onChange);
                return () => mq.removeEventListener?.('change', onChange);
        }, []);

        useEffect(() => {
                if (reduced || images.length <= 1) return undefined;
                const id = setInterval(() => {
                        if (!pausedRef.current) setActive((i) => (i + 1) % images.length);
                }, interval);
                return () => clearInterval(id);
        }, [reduced, images.length, interval]);

        return (
                <div
                        data-testid="flagship-showcase"
                        className="group relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.25)] bg-obsidian-2"
                        onMouseEnter={() => {
                                pausedRef.current = true;
                        }}
                        onMouseLeave={() => {
                                pausedRef.current = false;
                        }}
                >
                        {images.map((img, i) => (
                                <img
                                        key={img.src}
                                        src={img.src}
                                        alt={img.alt}
                                        data-testid={`flagship-slide-${i}`}
                                        loading={i === 0 ? 'eager' : 'lazy'}
                                        className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-1000 ease-out ${
                                                i === active ? 'opacity-100' : 'opacity-0'
                                        }`}
                                />
                        ))}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                        {/* Per-render label, top-left */}
                        <div className="absolute left-6 top-6">
                                <div className="micro-label border border-[rgba(201,162,75,0.35)] bg-ink/60 px-3 py-1.5 backdrop-blur-md">
                                        {images[active]?.label}
                                </div>
                        </div>

                        {/* Fixed brand caption, bottom */}
                        <div className="absolute bottom-6 left-6 right-6">
                                <div className="micro-label mb-2">Kadthal · NH-44</div>
                                <div className="font-display text-xl tracking-[0.16em] text-ivory">
                                        HMDA · FCDA (HMDA) · CLEAR TITLE
                                </div>
                        </div>

                        {/* Progress dots */}
                        <div className="absolute bottom-6 right-6 flex items-center gap-1.5">
                                {images.map((img, i) => (
                                        <button
                                                key={img.src}
                                                type="button"
                                                onClick={() => setActive(i)}
                                                data-testid={`flagship-dot-${i}`}
                                                aria-label={`Show ${img.label}`}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                                        i === active ? 'w-5 bg-gold' : 'w-1.5 bg-ivory/40 hover:bg-ivory/70'
                                                }`}
                                        />
                                ))}
                        </div>
                </div>
        );
}
