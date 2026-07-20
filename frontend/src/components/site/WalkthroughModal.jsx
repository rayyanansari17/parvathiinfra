import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import { HERO_VIDEO } from '@/lib/siteData';

/**
 * Cinematic three-scene walkthrough modal.
 *   Scene 1 · Branded arch entrance (SVG animated wordmark).
 *   Scene 2 · Video walkthrough (hero-video.mp4 muted, autoplay).
 *   Scene 3 · Explore CTAs (plots, amenities).
 * Auto-progresses; user can also skip ahead.
 */
export default function WalkthroughModal({ open, onClose }) {
        const [scene, setScene] = useState(0);
        const videoRef = useRef(null);
        const navigate = useNavigate();

        useEffect(() => {
                if (!open) return undefined;
                setScene(0);
                document.body.style.overflow = 'hidden';
                return () => {
                        document.body.style.overflow = '';
                };
        }, [open]);

        useEffect(() => {
                if (!open) return undefined;
                if (scene === 0) {
                        const t = setTimeout(() => setScene(1), 3600);
                        return () => clearTimeout(t);
                }
                if (scene === 1) {
                        const v = videoRef.current;
                        if (v) {
                                v.currentTime = 0;
                                v.play().catch(() => {});
                                const onEnded = () => setScene(2);
                                v.addEventListener('ended', onEnded);
                                return () => v.removeEventListener('ended', onEnded);
                        }
                }
                return undefined;
        }, [scene, open]);

        const jumpTo = (path, hash) => {
                onClose?.();
                navigate(path);
                if (hash) {
                        setTimeout(() => {
                                const el = document.querySelector(hash);
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 500);
                }
        };

        return (
                <AnimatePresence>
                        {open && (
                                <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        data-testid="walkthrough-modal"
                                        className="fixed inset-0 z-[85] flex items-center justify-center bg-ink"
                                >
                                        <button
                                                type="button"
                                                onClick={onClose}
                                                data-testid="walkthrough-close"
                                                aria-label="Close walkthrough"
                                                className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center border border-[rgba(201,162,75,0.4)] bg-ink/70 text-ivory backdrop-blur-md hover:border-gold hover:text-gold"
                                        >
                                                <X size={18} />
                                        </button>

                                        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2">
                                                {[0, 1, 2].map((i) => (
                                                        <span
                                                                key={i}
                                                                className={`h-[2px] w-10 transition-colors ${
                                                                        scene >= i ? 'bg-gold' : 'bg-white/20'
                                                                }`}
                                                        />
                                                ))}
                                        </div>

                                        {/* --- Scene 1 · Branded Arch Entrance --- */}
                                        <AnimatePresence mode="wait">
                                                {scene === 0 && (
                                                        <motion.div
                                                                key="scene-1"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                                                className="relative flex h-full w-full items-center justify-center overflow-hidden"
                                                        >
                                                                <div className="absolute inset-0 grain-overlay" />
                                                                <div
                                                                        className="absolute inset-0"
                                                                        style={{
                                                                                background:
                                                                                        'radial-gradient(ellipse at 50% 60%, rgba(201,162,75,0.14) 0%, transparent 55%), linear-gradient(180deg, #050505 0%, #0A0A0A 55%, #050505 100%)',
                                                                        }}
                                                                />

                                                                <div className="relative z-10 flex flex-col items-center px-6 text-center">
                                                                        {/* SVG Arch */}
                                                                        <svg
                                                                                width="520"
                                                                                height="320"
                                                                                viewBox="0 0 520 320"
                                                                                className="max-w-[80vw]"
                                                                                fill="none"
                                                                        >
                                                                                <defs>
                                                                                        <linearGradient id="archGold" x1="0" y1="0" x2="1" y2="0">
                                                                                                <stop offset="0%" stopColor="#BF953F" />
                                                                                                <stop offset="30%" stopColor="#FCF6BA" />
                                                                                                <stop offset="60%" stopColor="#B38728" />
                                                                                                <stop offset="100%" stopColor="#AA771C" />
                                                                                        </linearGradient>
                                                                                </defs>
                                                                                {/* Ground line */}
                                                                                <motion.line
                                                                                        x1="40" y1="300" x2="480" y2="300"
                                                                                        stroke="url(#archGold)" strokeWidth="1.2"
                                                                                        initial={{ pathLength: 0 }}
                                                                                        animate={{ pathLength: 1 }}
                                                                                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                                                                                />
                                                                                {/* Left pillar */}
                                                                                <motion.line
                                                                                        x1="120" y1="300" x2="120" y2="120"
                                                                                        stroke="url(#archGold)" strokeWidth="1.2"
                                                                                        initial={{ pathLength: 0 }}
                                                                                        animate={{ pathLength: 1 }}
                                                                                        transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                                                                                />
                                                                                {/* Right pillar */}
                                                                                <motion.line
                                                                                        x1="400" y1="300" x2="400" y2="120"
                                                                                        stroke="url(#archGold)" strokeWidth="1.2"
                                                                                        initial={{ pathLength: 0 }}
                                                                                        animate={{ pathLength: 1 }}
                                                                                        transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                                                                                />
                                                                                {/* Arch curve */}
                                                                                <motion.path
                                                                                        d="M120 120 Q260 20 400 120"
                                                                                        stroke="url(#archGold)"
                                                                                        strokeWidth="1.4"
                                                                                        fill="none"
                                                                                        initial={{ pathLength: 0 }}
                                                                                        animate={{ pathLength: 1 }}
                                                                                        transition={{ delay: 1.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                                                                                />
                                                                                {/* Ornament */}
                                                                                <motion.circle
                                                                                        cx="260" cy="90" r="4" fill="#E8C978"
                                                                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                                                        transition={{ delay: 2.1, duration: 0.4 }}
                                                                                />
                                                                                {/* Brand plaque */}
                                                                                <motion.text
                                                                                        x="260" y="170" textAnchor="middle"
                                                                                        fontFamily="Cinzel, serif" fontSize="20" letterSpacing="8"
                                                                                        fill="#F5F1E8"
                                                                                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                                                                        transition={{ delay: 1.9, duration: 0.7 }}
                                                                                >PARVATHI INFRA</motion.text>
                                                                                <motion.text
                                                                                        x="260" y="215" textAnchor="middle"
                                                                                        fontFamily="Cinzel, serif" fontSize="44" letterSpacing="12"
                                                                                        fill="transparent" stroke="url(#archGold)" strokeWidth="1"
                                                                                        initial={{ strokeDashoffset: 500, strokeDasharray: 500 }}
                                                                                        animate={{ strokeDashoffset: 0 }}
                                                                                        transition={{ delay: 2.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                                                                >THE VIEW</motion.text>
                                                                        </svg>
                                                                        <motion.p
                                                                                initial={{ opacity: 0, y: 8 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ delay: 2.6, duration: 0.8 }}
                                                                                className="mt-6 text-[0.65rem] uppercase tracking-[0.44em] text-ivory-dim"
                                                                        >
                                                                                Presents the Walkthrough
                                                                        </motion.p>
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => setScene(1)}
                                                                                data-testid="walkthrough-skip-intro"
                                                                                className="mt-10 gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                                        >
                                                                                Skip Intro
                                                                        </button>
                                                                </div>
                                                        </motion.div>
                                                )}

                                                {/* --- Scene 2 · Video Walkthrough --- */}
                                                {scene === 1 && (
                                                        <motion.div
                                                                key="scene-2"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.9 }}
                                                                className="relative flex h-full w-full items-center justify-center"
                                                        >
                                                                <video
                                                                        ref={videoRef}
                                                                        data-testid="walkthrough-video"
                                                                        src={HERO_VIDEO}
                                                                        autoPlay
                                                                        muted
                                                                        playsInline
                                                                        controls
                                                                        className="max-h-[86vh] max-w-[92vw] border border-[rgba(201,162,75,0.3)]"
                                                                />
                                                                <div className="absolute left-6 top-6 text-[0.65rem] uppercase tracking-[0.4em] text-ivory-dim">
                                                                        Site Walkthrough · Kadthal
                                                                </div>
                                                                <button
                                                                        type="button"
                                                                        onClick={() => setScene(2)}
                                                                        data-testid="walkthrough-skip-video"
                                                                        className="absolute right-6 bottom-16 gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                                >
                                                                        Skip to Explore
                                                                </button>
                                                        </motion.div>
                                                )}

                                                {/* --- Scene 3 · Explore CTAs --- */}
                                                {scene === 2 && (
                                                        <motion.div
                                                                key="scene-3"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.9 }}
                                                                className="relative flex h-full w-full flex-col items-center justify-center px-6 text-center"
                                                        >
                                                                <div className="absolute inset-0 grain-overlay" />
                                                                <div
                                                                        className="absolute inset-0"
                                                                        style={{
                                                                                background:
                                                                                        'radial-gradient(ellipse at 50% 40%, rgba(201,162,75,0.15) 0%, transparent 55%), linear-gradient(180deg,#050505,#0A0A0A)',
                                                                        }}
                                                                />
                                                                <div className="relative z-10">
                                                                        <div className="micro-label mb-4">Continue Exploring</div>
                                                                        <h3 className="font-display text-3xl leading-tight tracking-[0.1em] text-ivory md:text-5xl">
                                                                                Where would you like
                                                                                <br />
                                                                                to go <span className="gold-foil-text italic font-serif-elegant">next?</span>
                                                                        </h3>
                                                                        <div className="mt-12 grid gap-6 md:grid-cols-2">
                                                                                <button
                                                                                        type="button"
                                                                                        onClick={() => jumpTo('/the-view', '[data-testid="theview-master-plan"]')}
                                                                                        data-testid="walkthrough-goto-plots"
                                                                                        className="group border border-[rgba(201,162,75,0.4)] bg-obsidian-2 p-10 text-left hover:border-gold"
                                                                                >
                                                                                        <div className="micro-label mb-3">Master Plan</div>
                                                                                        <div className="font-display text-2xl tracking-[0.14em] text-ivory">
                                                                                                Explore <span className="gold-foil-text">Plots</span>
                                                                                        </div>
                                                                                        <p className="mt-3 font-serif-elegant text-base italic text-ivory-dim">
                                                                                                45 plots · availability · orientation
                                                                                        </p>
                                                                                        <div className="mt-6 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.32em] text-gold">
                                                                                                Enter
                                                                                                <span className="h-px w-6 bg-gold transition-all group-hover:w-12" />
                                                                                        </div>
                                                                                </button>
                                                                                <button
                                                                                        type="button"
                                                                                        onClick={() => jumpTo('/the-view', '[data-testid="theview-amenities"]')}
                                                                                        data-testid="walkthrough-goto-amenities"
                                                                                        className="group border border-[rgba(201,162,75,0.4)] bg-obsidian-2 p-10 text-left hover:border-gold"
                                                                                >
                                                                                        <div className="micro-label mb-3">Amenities</div>
                                                                                        <div className="font-display text-2xl tracking-[0.14em] text-ivory">
                                                                                                See <span className="gold-foil-text">Amenities</span>
                                                                                        </div>
                                                                                        <p className="mt-3 font-serif-elegant text-base italic text-ivory-dim">
                                                                                                Clubhouse · pool · amphitheatre
                                                                                        </p>
                                                                                        <div className="mt-6 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.32em] text-gold">
                                                                                                Enter
                                                                                                <span className="h-px w-6 bg-gold transition-all group-hover:w-12" />
                                                                                        </div>
                                                                                </button>
                                                                        </div>
                                                                        <button
                                                                                type="button"
                                                                                onClick={() => setScene(1)}
                                                                                data-testid="walkthrough-replay"
                                                                                className="mt-10 inline-flex items-center gap-3 gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                                        >
                                                                                <Play size={12} /> Replay Walkthrough
                                                                        </button>
                                                                </div>
                                                        </motion.div>
                                                )}
                                        </AnimatePresence>
                                </motion.div>
                        )}
                </AnimatePresence>
        );
}
