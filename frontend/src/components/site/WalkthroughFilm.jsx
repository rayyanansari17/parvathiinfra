import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FILM_SCENES } from '@/lib/walkthroughData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed cinematic image film for THE VIEW.
 * Pins a section for (scenes * 100vh); scroll progress drives:
 *   1. crossfades between successive high-res JPGs
 *   2. per-scene Ken Burns (scale + translate) motion
 *   3. caption / chapter / progress-bar state
 * Zero <video>. Fully deterministic, resolution-independent.
 */
export default function WalkthroughFilm() {
        const wrapRef = useRef(null);
        const pinRef = useRef(null);
        const layerRefs = useRef([]);
        const imgRefs = useRef([]);

        const scenes = FILM_SCENES;
        const sceneCount = scenes.length;

        const [progress, setProgress] = useState(0); // 0..1 across whole film
        const [ready, setReady] = useState(false);
        const [loaded, setLoaded] = useState(0);

        const reduced = useMemo(
                () =>
                        typeof window !== 'undefined' &&
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                [],
        );

        // Preload all images before wiring ScrollTrigger — avoids pop-in.
        useEffect(() => {
                let cancelled = false;
                let done = 0;
                scenes.forEach((s) => {
                        const im = new Image();
                        im.onload = () => {
                                done += 1;
                                if (!cancelled) {
                                        setLoaded(done);
                                        if (done === sceneCount) setReady(true);
                                }
                        };
                        im.onerror = () => {
                                done += 1;
                                if (!cancelled) {
                                        setLoaded(done);
                                        if (done === sceneCount) setReady(true);
                                }
                        };
                        im.src = s.src;
                });
                return () => {
                        cancelled = true;
                };
        }, [scenes, sceneCount]);

        // GSAP scroll-scrub: opacities of layers + Ken Burns transforms.
        useLayoutEffect(() => {
                if (!ready || reduced) return undefined;
                const ctx = gsap.context(() => {
                        const st = ScrollTrigger.create({
                                trigger: wrapRef.current,
                                start: 'top top',
                                end: () => `+=${window.innerHeight * sceneCount}`,
                                pin: pinRef.current,
                                scrub: 0.8,
                                anticipatePin: 1,
                                invalidateOnRefresh: true,
                                onUpdate: (self) => {
                                        const p = self.progress;
                                        setProgress(p);
                                        // Segment progress: which scene + local t within it.
                                        const segLen = 1 / sceneCount;
                                        for (let i = 0; i < sceneCount; i += 1) {
                                                const segStart = i * segLen;
                                                const local = (p - segStart) / segLen; // -inf..+inf
                                                // Opacity: fade in over first 30% of segment, hold, fade out over last 30%.
                                                let op;
                                                if (i === 0) {
                                                        // First scene: full opacity at start, fade near end.
                                                        op = local < 0.7 ? 1 : Math.max(0, 1 - (local - 0.7) / 0.3);
                                                } else if (i === sceneCount - 1) {
                                                        // Last scene: fade in, then hold.
                                                        op = local < 0 ? 0 : Math.min(1, local / 0.3);
                                                } else {
                                                        if (local < 0) op = 0;
                                                        else if (local < 0.3) op = local / 0.3;
                                                        else if (local < 0.7) op = 1;
                                                        else if (local < 1) op = 1 - (local - 0.7) / 0.3;
                                                        else op = 0;
                                                }
                                                const layer = layerRefs.current[i];
                                                if (layer) layer.style.opacity = op.toFixed(3);

                                                // Ken Burns: interpolate x/y/scale from .from → .to across the segment
                                                // (kept alive during hold + fade for smoothness).
                                                const t = Math.max(0, Math.min(1, local));
                                                const { from, to } = scenes[i];
                                                const x = from.x + (to.x - from.x) * t;
                                                const y = from.y + (to.y - from.y) * t;
                                                const sc = from.scale + (to.scale - from.scale) * t;
                                                const img = imgRefs.current[i];
                                                if (img) {
                                                        img.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${sc.toFixed(4)})`;
                                                }
                                        }
                                },
                        });
                        // Refresh once after mount to catch any layout shift.
                        requestAnimationFrame(() => ScrollTrigger.refresh());
                        return () => st.kill();
                }, wrapRef);
                return () => ctx.revert();
        }, [ready, reduced, sceneCount, scenes]);

        // Active scene index derived from progress.
        const activeIdx = Math.min(
                sceneCount - 1,
                Math.max(0, Math.floor(progress * sceneCount + 0.0001)),
        );
        const activeScene = scenes[activeIdx];

        // Parvathi flags visible during "Entering the Gate" scene (index 2).
        const flagsVisible = activeIdx === 2;

        const jumpToScene = (i) => {
                const wrap = wrapRef.current;
                if (!wrap) return;
                const totalScroll = window.innerHeight * sceneCount;
                const y = wrap.offsetTop + (i / sceneCount) * totalScroll + 4;
                window.scrollTo({ top: y, behavior: 'smooth' });
        };

        const progressPct = Math.min(100, Math.max(0, progress * 100));

        return (
                <section
                        ref={wrapRef}
                        data-testid="walkthrough-film-wrap"
                        className="relative w-full"
                        style={{ height: reduced ? '100svh' : `${sceneCount * 100}vh` }}
                >
                        <div
                                ref={pinRef}
                                className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-ink"
                        >
                                {/* Image layers */}
                                {scenes.map((s, i) => (
                                        <div
                                                key={s.src}
                                                ref={(el) => (layerRefs.current[i] = el)}
                                                className="absolute inset-0"
                                                style={{
                                                        opacity: i === 0 ? 1 : 0,
                                                        willChange: 'opacity',
                                                }}
                                                data-testid={`film-layer-${i}`}
                                        >
                                                <img
                                                        ref={(el) => (imgRefs.current[i] = el)}
                                                        src={s.src}
                                                        alt={s.title}
                                                        draggable={false}
                                                        className="absolute inset-0 h-full w-full object-cover select-none"
                                                        style={{
                                                                transform: `translate3d(${s.from.x}%, ${s.from.y}%, 0) scale(${s.from.scale})`,
                                                                transformOrigin: 'center center',
                                                                willChange: 'transform',
                                                        }}
                                                />
                                        </div>
                                ))}

                                {/* Cinematic gradient + grain */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink/95" />
                                <div className="pointer-events-none absolute inset-0 grain-overlay" />
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-[#020202]" />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-[#020202]" />

                                {/* Preload indicator */}
                                {!ready && (
                                        <div
                                                data-testid="film-loading"
                                                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-ink text-ivory-dim"
                                        >
                                                <div className="micro-label">Loading Cinematic Film</div>
                                                <div className="h-px w-40 bg-white/10">
                                                        <div
                                                                className="h-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] transition-[width]"
                                                                style={{ width: `${(loaded / sceneCount) * 100}%` }}
                                                        />
                                                </div>
                                        </div>
                                )}

                                {/* Parvathi flags at gate scene */}
                                <AnimatePresence>
                                        {flagsVisible && (
                                                <>
                                                        <ParvathiFlag key="flag-left" side="left" />
                                                        <ParvathiFlag key="flag-right" side="right" />
                                                </>
                                        )}
                                </AnimatePresence>

                                {/* Caption card */}
                                <AnimatePresence mode="wait">
                                        <motion.div
                                                key={activeIdx}
                                                initial={{ opacity: 0, y: 22 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                                data-testid={`caption-${activeIdx}`}
                                                className="pointer-events-none absolute left-6 bottom-24 max-w-xl md:left-16 md:bottom-32"
                                        >
                                                <div className="micro-label mb-3">
                                                        Chapter {String(activeIdx + 1).padStart(2, '0')} /
                                                        {String(sceneCount).padStart(2, '0')}
                                                </div>
                                                <h2 className="font-display text-3xl leading-tight tracking-[0.06em] text-ivory md:text-5xl">
                                                        <span className="gold-foil-text">{activeScene.title}</span>
                                                </h2>
                                                <p className="mt-4 max-w-md font-serif-elegant text-lg italic text-ivory-dim md:text-xl">
                                                        {activeScene.copy}
                                                </p>
                                        </motion.div>
                                </AnimatePresence>

                                {/* Vertical chapter rail */}
                                <div className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 md:right-10">
                                        {scenes.map((s, i) => {
                                                const active = i === activeIdx;
                                                return (
                                                        <button
                                                                key={s.src}
                                                                type="button"
                                                                onClick={() => jumpToScene(i)}
                                                                data-testid={`chapter-dot-${i}`}
                                                                aria-label={`Jump to ${s.chapter}`}
                                                                className="group flex items-center gap-3"
                                                        >
                                                                <span
                                                                        className={`hidden text-right font-ui text-[0.6rem] uppercase tracking-[0.32em] transition-opacity md:block ${
                                                                                active
                                                                                        ? 'opacity-100 text-gold'
                                                                                        : 'opacity-0 text-ivory-dim group-hover:opacity-70'
                                                                        }`}
                                                                >
                                                                        {String(i + 1).padStart(2, '0')} · {s.chapter}
                                                                </span>
                                                                <span
                                                                        className={`h-2 w-2 rounded-full border transition-all ${
                                                                                active
                                                                                        ? 'border-gold bg-gold scale-125'
                                                                                        : 'border-[rgba(201,162,75,0.5)] bg-transparent'
                                                                        }`}
                                                                />
                                                        </button>
                                                );
                                        })}
                                </div>

                                {/* Bottom controls */}
                                <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex items-center gap-4 md:bottom-8">
                                        <button
                                                type="button"
                                                onClick={() => jumpToScene(Math.max(0, activeIdx - 1))}
                                                data-testid="film-prev"
                                                className="gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                        >
                                                ← Prev
                                        </button>
                                        <div className="h-px w-40 bg-white/15 md:w-64">
                                                <div
                                                        className="h-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] transition-[width]"
                                                        style={{ width: `${progressPct}%` }}
                                                />
                                        </div>
                                        <button
                                                type="button"
                                                onClick={() => jumpToScene(Math.min(sceneCount - 1, activeIdx + 1))}
                                                data-testid="film-next"
                                                className="gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                        >
                                                Next →
                                        </button>
                                </div>

                                {/* Skip to layout */}
                                <button
                                        type="button"
                                        data-testid="film-skip-to-layout"
                                        onClick={() => {
                                                const el = document.querySelector('[data-testid="layout-explorer"]');
                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className="absolute right-6 top-6 z-10 border border-[rgba(201,162,75,0.4)] bg-ink/70 px-4 py-2 text-[0.6rem] uppercase tracking-[0.32em] text-ivory backdrop-blur-md hover:border-gold hover:text-gold md:right-10 md:top-10"
                                >
                                        Skip to Layout ↓
                                </button>

                                {/* Scroll hint (first chapter only) */}
                                {activeIdx === 0 && (
                                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center text-ivory-dim md:bottom-32">
                                                <div className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll to Enter</div>
                                                <ChevronDown className="mx-auto mt-2 animate-bounce" size={16} />
                                        </div>
                                )}
                        </div>
                </section>
        );
}

// ------------------------------------------------------------------
// Parvathi Infra flag — vector logo (no text/AI rendering).
// ------------------------------------------------------------------
function ParvathiFlag({ side }) {
        const isLeft = side === 'left';
        return (
                <motion.div
                        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isLeft ? -40 : 40 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        data-testid={`gate-flag-${side}`}
                        className={`pointer-events-none absolute top-[15%] hidden h-[64%] w-40 md:block ${
                                isLeft ? 'left-[6%]' : 'right-[6%]'
                        }`}
                        style={{ transformOrigin: isLeft ? 'left top' : 'right top' }}
                >
                        {/* Pole */}
                        <div
                                className="absolute top-0 h-full w-[3px]"
                                style={{
                                        left: isLeft ? '10px' : 'auto',
                                        right: isLeft ? 'auto' : '10px',
                                        background:
                                                'linear-gradient(180deg,#3A2E19,#B38728 25%,#FCF6BA 50%,#B38728 75%,#3A2E19)',
                                        boxShadow: '0 0 8px rgba(201,162,75,0.5)',
                                }}
                        />
                        {/* Finial */}
                        <div
                                className="absolute top-[-6px] h-4 w-2"
                                style={{
                                        left: isLeft ? '5px' : 'auto',
                                        right: isLeft ? 'auto' : '5px',
                                        clipPath: 'polygon(50% 0, 100% 60%, 50% 100%, 0 60%)',
                                        background: 'linear-gradient(180deg,#FCF6BA,#BF953F 60%,#8A6D2F)',
                                }}
                        />
                        {/* Fabric */}
                        <div
                                className="absolute top-6 h-[70%] w-[130px]"
                                style={{
                                        left: isLeft ? '14px' : 'auto',
                                        right: isLeft ? 'auto' : '14px',
                                        transformOrigin: isLeft ? 'left top' : 'right top',
                                        animation: 'wtFlagWaveBig 3.6s ease-in-out infinite',
                                }}
                        >
                                <div
                                        className="relative h-full w-full overflow-hidden"
                                        style={{
                                                background:
                                                        'linear-gradient(180deg,#0D2447 0%,#0A1B33 60%,#050E1F 100%)',
                                                border: '1px solid rgba(232,201,120,0.55)',
                                                boxShadow:
                                                        'inset 0 0 28px rgba(0,0,0,0.55), 0 8px 22px rgba(0,0,0,0.5)',
                                                clipPath: isLeft
                                                        ? 'polygon(0 0, 100% 4%, 96% 96%, 0 100%)'
                                                        : 'polygon(0 4%, 100% 0, 100% 100%, 4% 96%)',
                                        }}
                                >
                                        <div
                                                className="absolute inset-x-0 top-0 h-[3px]"
                                                style={{
                                                        background:
                                                                'linear-gradient(90deg,#8A6D2F,#FCF6BA 50%,#8A6D2F)',
                                                }}
                                        />
                                        <div
                                                className="absolute inset-x-0 bottom-0 h-[3px]"
                                                style={{
                                                        background:
                                                                'linear-gradient(90deg,#8A6D2F,#FCF6BA 50%,#8A6D2F)',
                                                }}
                                        />
                                        <svg
                                                viewBox="0 0 130 180"
                                                className="absolute inset-0 h-full w-full"
                                                style={{ animation: 'wtFlagInnerWave 3.6s ease-in-out infinite' }}
                                        >
                                                <defs>
                                                        <linearGradient id={`piCrestG-${side}`} x1="0" y1="0" x2="1" y2="1">
                                                                <stop offset="0%" stopColor="#FCF6BA" />
                                                                <stop offset="55%" stopColor="#BF953F" />
                                                                <stop offset="100%" stopColor="#6B4E1C" />
                                                        </linearGradient>
                                                </defs>
                                                <path
                                                        d="M45 42 L52 30 L58 40 L65 26 L72 40 L78 30 L85 42 L82 52 L48 52 Z"
                                                        fill={`url(#piCrestG-${side})`}
                                                        stroke="#8A6D2F"
                                                        strokeWidth="0.6"
                                                />
                                                <circle cx="65" cy="24" r="2" fill="#FCF6BA" />
                                                <g fill="none" stroke={`url(#piCrestG-${side})`} strokeWidth="1.2">
                                                        <rect x="46" y="60" width="10" height="30" />
                                                        <rect x="58" y="52" width="14" height="38" />
                                                        <rect x="74" y="58" width="10" height="32" />
                                                        <line x1="42" y1="90" x2="88" y2="90" />
                                                </g>
                                                <text
                                                        x="65"
                                                        y="118"
                                                        textAnchor="middle"
                                                        fontFamily="Cinzel, serif"
                                                        fontSize="10"
                                                        letterSpacing="3.5"
                                                        fill="#F5F1E8"
                                                >
                                                        PARVATHI
                                                </text>
                                                <text
                                                        x="65"
                                                        y="132"
                                                        textAnchor="middle"
                                                        fontFamily="Cinzel, serif"
                                                        fontSize="10"
                                                        letterSpacing="3.5"
                                                        fill="#F5F1E8"
                                                >
                                                        INFRA
                                                </text>
                                                <line
                                                        x1="46"
                                                        y1="142"
                                                        x2="84"
                                                        y2="142"
                                                        stroke={`url(#piCrestG-${side})`}
                                                        strokeWidth="0.8"
                                                />
                                                <text
                                                        x="65"
                                                        y="156"
                                                        textAnchor="middle"
                                                        fontFamily="Cinzel, serif"
                                                        fontSize="8"
                                                        letterSpacing="4"
                                                        fill={`url(#piCrestG-${side})`}
                                                >
                                                        THE VIEW
                                                </text>
                                        </svg>
                                </div>
                        </div>
                        <style>{`
                                @keyframes wtFlagWaveBig {
                                        0%, 100% { transform: rotate(-2deg) skewY(-1deg); }
                                        50%      { transform: rotate(2deg)  skewY(1deg); }
                                }
                                @keyframes wtFlagInnerWave {
                                        0%, 100% { transform: skewY(-0.6deg); }
                                        50%      { transform: skewY(0.6deg); }
                                }
                        `}</style>
                </motion.div>
        );
}
