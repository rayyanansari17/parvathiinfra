import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import { HERO_VIDEO } from '@/lib/siteData';
import WalkthroughScene1 from '@/components/site/WalkthroughScene1';

/**
 * Cinematic three-scene walkthrough modal.
 *   Scene 1 · 3D grand arrival through the Parvathi Infra arch (with flags).
 *   Scene 2 · Video walkthrough of the site.
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
                                        {/* Close button */}
                                        <button
                                                type="button"
                                                onClick={onClose}
                                                data-testid="walkthrough-close"
                                                aria-label="Close walkthrough"
                                                className="absolute right-6 top-6 z-30 flex h-11 w-11 items-center justify-center border border-[rgba(201,162,75,0.4)] bg-ink/70 text-ivory backdrop-blur-md hover:border-gold hover:text-gold"
                                        >
                                                <X size={18} />
                                        </button>

                                        {/* Scene indicator */}
                                        <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 flex items-center gap-2">
                                                {[0, 1, 2].map((i) => (
                                                        <span
                                                                key={i}
                                                                className={`h-[2px] w-10 transition-colors ${
                                                                        scene >= i ? 'bg-gold' : 'bg-white/20'
                                                                }`}
                                                        />
                                                ))}
                                        </div>

                                        <AnimatePresence mode="wait">
                                                {/* --- Scene 1 · 3D Grand Arrival --- */}
                                                {scene === 0 && (
                                                        <motion.div
                                                                key="scene-1"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                                                className="relative h-full w-full"
                                                        >
                                                                <WalkthroughScene1
                                                                        onFinished={() => setScene(1)}
                                                                />
                                                                <button
                                                                        type="button"
                                                                        onClick={() => setScene(1)}
                                                                        data-testid="walkthrough-skip-intro"
                                                                        className="absolute right-6 bottom-16 z-20 gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                                >
                                                                        Skip Intro
                                                                </button>
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
                                                                className="relative flex h-full w-full items-center justify-center bg-[#050505]"
                                                        >
                                                                <div className="absolute inset-0 pointer-events-none grain-overlay" />
                                                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-[#020202]" />
                                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-[#020202]" />
                                                                <div className="relative border border-[rgba(201,162,75,0.35)] shadow-[0_0_80px_rgba(201,162,75,0.15)]">
                                                                        <video
                                                                                ref={videoRef}
                                                                                data-testid="walkthrough-video"
                                                                                src={HERO_VIDEO}
                                                                                autoPlay
                                                                                muted
                                                                                playsInline
                                                                                controls
                                                                                className="block max-h-[74vh] max-w-[86vw]"
                                                                        />
                                                                        {/* corner accents */}
                                                                        <span className="absolute -left-[1px] -top-[1px] h-4 w-4 border-l border-t border-gold" />
                                                                        <span className="absolute -right-[1px] -top-[1px] h-4 w-4 border-r border-t border-gold" />
                                                                        <span className="absolute -left-[1px] -bottom-[1px] h-4 w-4 border-l border-b border-gold" />
                                                                        <span className="absolute -right-[1px] -bottom-[1px] h-4 w-4 border-r border-b border-gold" />
                                                                </div>
                                                                <div className="absolute left-6 top-8 text-[0.6rem] uppercase tracking-[0.44em] text-ivory-dim/80 md:left-10 md:top-10">
                                                                        Scene 02 · Site Walkthrough · Kadthal
                                                                </div>
                                                                <button
                                                                        type="button"
                                                                        onClick={() => setScene(2)}
                                                                        data-testid="walkthrough-skip-video"
                                                                        className="absolute right-6 bottom-16 z-20 gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
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
                                                                                        'radial-gradient(ellipse at 50% 40%, rgba(201,162,75,0.16) 0%, transparent 55%), linear-gradient(180deg,#050505,#0A0A0A)',
                                                                        }}
                                                                />
                                                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-[#020202]" />
                                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-[#020202]" />
                                                                <div className="relative z-10 max-w-3xl">
                                                                        <div className="micro-label mb-4">Scene 03 · Continue Exploring</div>
                                                                        <h3 className="font-display text-3xl leading-tight tracking-[0.1em] text-ivory md:text-5xl">
                                                                                Where would you like
                                                                                <br />
                                                                                to go <span className="gold-foil-text italic font-serif-elegant">next?</span>
                                                                        </h3>
                                                                        <div className="mt-12 grid gap-6 md:grid-cols-2">
                                                                                <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                                jumpTo('/the-view', '[data-testid="theview-master-plan"]')
                                                                                        }
                                                                                        data-testid="walkthrough-goto-plots"
                                                                                        className="group border border-[rgba(201,162,75,0.4)] bg-obsidian-2/90 p-10 text-left hover:border-gold"
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
                                                                                        onClick={() =>
                                                                                                jumpTo('/the-view', '[data-testid="theview-amenities"]')
                                                                                        }
                                                                                        data-testid="walkthrough-goto-amenities"
                                                                                        className="group border border-[rgba(201,162,75,0.4)] bg-obsidian-2/90 p-10 text-left hover:border-gold"
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
                                                                                onClick={() => setScene(0)}
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
