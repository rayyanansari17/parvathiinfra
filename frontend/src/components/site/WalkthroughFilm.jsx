import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { CAPTIONS, CHAPTERS, WALKTHROUGH_FILM } from '@/lib/walkthroughData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed cinematic film for THE VIEW.
 * Pins a 500vh tall section; scroll progress scrubs video.currentTime.
 * Captions fade in synced to currentTime waypoints. Symmetrical
 * Parvathi Infra flags animate in at the "Entering the Gate" chapter.
 */
export default function WalkthroughFilm({ src = WALKTHROUGH_FILM }) {
        const wrapRef = useRef(null);
        const pinRef = useRef(null);
        const videoRef = useRef(null);
        const [duration, setDuration] = useState(0);
        const [current, setCurrent] = useState(0);
        const [muted, setMuted] = useState(true);
        const [reduced] = useState(
                () =>
                        typeof window !== 'undefined' &&
                        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        );

        // Discover duration once metadata is loaded.
        useEffect(() => {
                const v = videoRef.current;
                if (!v) return undefined;
                const onLoaded = () => setDuration(v.duration || 0);
                v.addEventListener('loadedmetadata', onLoaded);
                if (v.readyState >= 1) onLoaded();
                return () => v.removeEventListener('loadedmetadata', onLoaded);
        }, []);

        // ScrollTrigger scrub wiring.
        useLayoutEffect(() => {
                if (!duration || reduced) return undefined;
                const v = videoRef.current;
                const ctx = gsap.context(() => {
                        const st = ScrollTrigger.create({
                                trigger: wrapRef.current,
                                start: 'top top',
                                end: () => `+=${window.innerHeight * 5}`,
                                pin: pinRef.current,
                                scrub: 0.6,
                                anticipatePin: 1,
                                onUpdate: (self) => {
                                        if (!v) return;
                                        const t = self.progress * duration;
                                        v.currentTime = t;
                                        setCurrent(t);
                                },
                        });
                        return () => st.kill();
                }, wrapRef);
                return () => ctx.revert();
        }, [duration, reduced]);

        // Reduced-motion → let the video autoplay naturally; skip pinning.
        useEffect(() => {
                if (!reduced) return undefined;
                const v = videoRef.current;
                if (v) {
                        v.loop = true;
                        v.play().catch(() => {});
                        const onT = () => setCurrent(v.currentTime);
                        v.addEventListener('timeupdate', onT);
                        return () => v.removeEventListener('timeupdate', onT);
                }
                return undefined;
        }, [reduced]);

        // Which caption is active right now?
        const activeCaptionIdx = (() => {
                let idx = 0;
                for (let i = 0; i < CAPTIONS.length; i += 1) {
                        if (current >= CAPTIONS[i].time) idx = i;
                }
                return idx;
        })();
        const activeCaption = CAPTIONS[activeCaptionIdx];

        // Flags are visible during the "Entering the Gate" chapter (roughly 8s-13s).
        const flagsVisible = current >= 7.5 && current <= 13.5;

        const progressPct = duration ? (current / duration) * 100 : 0;

        const jumpTo = (t) => {
                const wrap = wrapRef.current;
                if (!wrap || !duration) return;
                const totalScroll = window.innerHeight * 5;
                const y = wrap.offsetTop + (t / duration) * totalScroll;
                window.scrollTo({ top: y, behavior: 'smooth' });
        };

        return (
                <section
                        ref={wrapRef}
                        data-testid="walkthrough-film-wrap"
                        className="relative w-full"
                        style={{ height: reduced ? '100svh' : '600vh' }}
                >
                        <div
                                ref={pinRef}
                                className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-ink"
                        >
                                {/* Video */}
                                <video
                                        ref={videoRef}
                                        data-testid="walkthrough-film-video"
                                        src={src}
                                        muted={muted}
                                        playsInline
                                        preload="auto"
                                        className="absolute inset-0 h-full w-full object-cover"
                                        poster="/assets/walkthrough/aerial-master-plan.jpeg"
                                />

                                {/* Cinematic gradient + grain */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/95" />
                                <div className="pointer-events-none absolute inset-0 grain-overlay" />
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-[#020202]" />
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-[#020202]" />

                                {/* Flags overlay — visible during Gate chapter */}
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
                                                key={activeCaptionIdx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                                data-testid={`caption-${activeCaptionIdx}`}
                                                className="pointer-events-none absolute left-6 bottom-24 max-w-xl md:left-16 md:bottom-32"
                                        >
                                                <div className="micro-label mb-3">
                                                        Chapter {String(activeCaptionIdx + 1).padStart(2, '0')} /
                                                        {String(CAPTIONS.length).padStart(2, '0')}
                                                </div>
                                                <h2 className="font-display text-3xl leading-tight tracking-[0.06em] text-ivory md:text-5xl">
                                                        <span className="gold-foil-text">{activeCaption.title}</span>
                                                </h2>
                                                <p className="mt-4 max-w-md font-serif-elegant text-lg italic text-ivory-dim md:text-xl">
                                                        {activeCaption.copy}
                                                </p>
                                        </motion.div>
                                </AnimatePresence>

                                {/* Vertical progress rail */}
                                <div className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 md:right-10">
                                        {CHAPTERS.map((ch, i) => {
                                                const active = i === activeCaptionIdx;
                                                const seek = CAPTIONS[Math.min(i, CAPTIONS.length - 1)]?.time || 0;
                                                return (
                                                        <button
                                                                key={ch.n}
                                                                type="button"
                                                                onClick={() => jumpTo(seek)}
                                                                data-testid={`chapter-dot-${i}`}
                                                                aria-label={`Jump to ${ch.label}`}
                                                                className="group flex items-center gap-3"
                                                        >
                                                                <span
                                                                        className={`hidden text-right font-ui text-[0.6rem] uppercase tracking-[0.32em] transition-opacity md:block ${
                                                                                active ? 'opacity-100 text-gold' : 'opacity-0 text-ivory-dim group-hover:opacity-70'
                                                                        }`}
                                                                >
                                                                        {String(ch.n).padStart(2, '0')} · {ch.label}
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
                                                onClick={() => jumpTo(CAPTIONS[Math.max(0, activeCaptionIdx - 1)].time)}
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
                                                onClick={() =>
                                                        jumpTo(
                                                                CAPTIONS[Math.min(CAPTIONS.length - 1, activeCaptionIdx + 1)].time,
                                                        )
                                                }
                                                data-testid="film-next"
                                                className="gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                        >
                                                Next →
                                        </button>
                                        <button
                                                type="button"
                                                onClick={() => setMuted((m) => !m)}
                                                data-testid="film-mute"
                                                aria-label={muted ? 'Unmute' : 'Mute'}
                                                className="ml-2 flex h-8 w-8 items-center justify-center border border-[rgba(201,162,75,0.4)] text-ivory-dim hover:border-gold hover:text-gold"
                                        >
                                                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                        </button>
                                </div>

                                {/* Top-right skip to layout */}
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

                                {/* Scroll hint (only on chapter 1) */}
                                {activeCaptionIdx === 0 && (
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
// A deep-blue banner with a gold crown + skyline crest and the wordmark.
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
                                        {/* Gold fringe top + bottom */}
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
                                        {/* Crest — gold crown + skyline */}
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
                                                {/* Crown */}
                                                <path
                                                        d="M45 42 L52 30 L58 40 L65 26 L72 40 L78 30 L85 42 L82 52 L48 52 Z"
                                                        fill={`url(#piCrestG-${side})`}
                                                        stroke="#8A6D2F"
                                                        strokeWidth="0.6"
                                                />
                                                <circle cx="65" cy="24" r="2" fill="#FCF6BA" />
                                                {/* Skyline / buildings */}
                                                <g fill="none" stroke={`url(#piCrestG-${side})`} strokeWidth="1.2">
                                                        <rect x="46" y="60" width="10" height="30" />
                                                        <rect x="58" y="52" width="14" height="38" />
                                                        <rect x="74" y="58" width="10" height="32" />
                                                        <line x1="42" y1="90" x2="88" y2="90" />
                                                </g>
                                                {/* Text */}
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
