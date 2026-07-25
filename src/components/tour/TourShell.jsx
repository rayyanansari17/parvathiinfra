'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import tourData from '@/data/tour.json';
import TourPreloader from './TourPreloader';
import TopBar from './TopBar';
import ProgressLine from './ProgressLine';
import ChapterRail from './ChapterRail';
import MiniMap from './MiniMap';
import InfoPanel from './InfoPanel';
import CTACard from './CTACard';
import TourNode from './TourNode';
import MasterPlan from './MasterPlan';

const NODES = tourData.nodes;
const MASTERPLAN_INDEX = NODES.findIndex((n) => n.id === 'masterplan');

export default function TourShell() {
        const [preloaderDone, setPreloaderDone] = useState(false);
        const [index, setIndex] = useState(0);
        const [autoplay, setAutoplay] = useState(false);
        const [muted, setMuted] = useState(true);
        const [reducedMotion, setReducedMotion] = useState(false);
        const [activeInfo, setActiveInfo] = useState(null);
        const [loadedImages, setLoadedImages] = useState(() => new Set());

        const [ctaDismissed, setCtaDismissed] = useState(false);
        const [manualCtaOpen, setManualCtaOpen] = useState(false);
        const [mpExpanded, setMpExpanded] = useState(false);

        const audioRef = useRef(null);
        const swipeRef = useRef(null);

        // Respect prefers-reduced-motion.
        useEffect(() => {
                const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
                setReducedMotion(mq.matches);
                const onChange = (e) => setReducedMotion(e.matches);
                mq.addEventListener?.('change', onChange);
                return () => mq.removeEventListener?.('change', onChange);
        }, []);

        // Lock body scroll while the tour is mounted.
        useEffect(() => {
                const original = document.documentElement.style.overflow;
                document.documentElement.style.overflow = 'hidden';
                return () => {
                        document.documentElement.style.overflow = original;
                };
        }, []);

        const goTo = useCallback((i, { fromAutoplay = false } = {}) => {
                setIndex((prev) => {
                        const clamped = Math.max(0, Math.min(NODES.length - 1, i));
                        return clamped === prev ? prev : clamped;
                });
                setActiveInfo(null);
                if (!fromAutoplay) setAutoplay(false);
        }, []);

        const advance = useCallback(
                (opts) => goTo(index + 1, opts),
                [index, goTo],
        );

        // Keyboard navigation.
        useEffect(() => {
                const onKey = (e) => {
                        if (e.key === 'ArrowRight') goTo(index + 1);
                        else if (e.key === 'ArrowLeft') goTo(index - 1);
                        else if (e.key === 'Escape') setActiveInfo(null);
                };
                window.addEventListener('keydown', onKey);
                return () => window.removeEventListener('keydown', onKey);
        }, [index, goTo]);

        // Swipe navigation (disabled on the interactive Master Plan node).
        useEffect(() => {
                if (NODES[index].id === 'masterplan') return undefined;
                const onDown = (e) => {
                        swipeRef.current = { x: e.clientX, y: e.clientY };
                };
                const onUp = (e) => {
                        if (!swipeRef.current) return;
                        const dx = e.clientX - swipeRef.current.x;
                        const dy = e.clientY - swipeRef.current.y;
                        swipeRef.current = null;
                        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                                if (dx < 0) goTo(index + 1);
                                else goTo(index - 1);
                        }
                };
                window.addEventListener('pointerdown', onDown);
                window.addEventListener('pointerup', onUp);
                return () => {
                        window.removeEventListener('pointerdown', onDown);
                        window.removeEventListener('pointerup', onUp);
                };
        }, [index, goTo]);

        // Preload the next node's image.
        useEffect(() => {
                const next = NODES[index + 1];
                if (next) {
                        const img = new Image();
                        img.src = next.image;
                }
        }, [index]);

        // Autoplay, advancing every 8s; disabled entirely under reduced motion.
        useEffect(() => {
                if (!autoplay || reducedMotion) return undefined;
                const t = setInterval(() => {
                        setIndex((i) => {
                                if (i >= NODES.length - 1) return i;
                                return i + 1;
                        });
                        setActiveInfo(null);
                }, 8000);
                return () => clearInterval(t);
        }, [autoplay, reducedMotion]);

        // Reset the Master-Plan CTA chip expansion when leaving/entering it.
        useEffect(() => {
                setMpExpanded(false);
        }, [index]);

        const onImageLoad = useCallback((src) => {
                setLoadedImages((prev) => {
                        if (prev.has(src)) return prev;
                        const next = new Set(prev);
                        next.add(src);
                        return next;
                });
        }, []);

        const jumpToNodeId = useCallback(
                (id) => {
                        const i = NODES.findIndex((n) => n.id === id);
                        if (i >= 0) goTo(i);
                },
                [goTo],
        );

        const node = NODES[index];
        const isMasterPlan = node.id === 'masterplan';

        const ctaVisible = manualCtaOpen || (!ctaDismissed && (index === MASTERPLAN_INDEX - 1 || index === MASTERPLAN_INDEX));
        const ctaCollapsed = !manualCtaOpen && index === MASTERPLAN_INDEX && !mpExpanded;

        return (
                <div data-testid="tour-shell" className="fixed inset-0 z-[80] overflow-hidden bg-ink text-ivory">
                        <TourPreloader firstImage={NODES[0].image} onDone={() => setPreloaderDone(true)} />

                        {preloaderDone && (
                                <>
                                        <ProgressLine index={index} total={NODES.length} />
                                        <TopBar
                                                autoplay={autoplay}
                                                onToggleAutoplay={() => setAutoplay((a) => !a)}
                                                muted={muted}
                                                onToggleMuted={() => setMuted((m) => !m)}
                                                onEnquire={() => setManualCtaOpen(true)}
                                                reducedMotion={reducedMotion}
                                        />
                                </>
                        )}

                        <div className="absolute inset-0">
                                <AnimatePresence mode="wait">
                                        {isMasterPlan ? (
                                                <MasterPlanWrap key={node.id} onJumpToNode={jumpToNodeId} />
                                        ) : (
                                                <TourNode
                                                        key={node.id}
                                                        node={node}
                                                        reducedMotion={reducedMotion}
                                                        onAdvance={() => advance()}
                                                        onInfoOpen={setActiveInfo}
                                                        onImageLoad={onImageLoad}
                                                        loaded={loadedImages.has(node.image)}
                                                />
                                        )}
                                </AnimatePresence>
                        </div>

                        {preloaderDone && (
                                <>
                                        <InfoPanel hotspot={activeInfo} onClose={() => setActiveInfo(null)} />
                                        <MiniMap node={node} onOpen={() => goTo(MASTERPLAN_INDEX)} />
                                        <ChapterRail nodes={NODES} index={index} onJump={(i) => goTo(i)} />
                                        <CTACard
                                                open={ctaVisible}
                                                collapsed={ctaCollapsed}
                                                onExpand={() => setMpExpanded(true)}
                                                onDismiss={() => {
                                                        setManualCtaOpen(false);
                                                        setCtaDismissed(true);
                                                }}
                                        />
                                </>
                        )}

                        {/* Ambient audio stub: graceful no-op if the file is absent. */}
                        <audio
                                ref={audioRef}
                                src="/assets/tour/ambient.mp3"
                                loop
                                muted={muted}
                                data-testid="tour-ambient-audio"
                                onError={(e) => {
                                        e.currentTarget.removeAttribute('src');
                                }}
                        />
                </div>
        );
}

function MasterPlanWrap({ onJumpToNode }) {
        return (
                <motion.div
                        data-testid="tour-node-masterplan"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.15 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 overflow-hidden bg-ink"
                >
                        <MasterPlan onJumpToNode={onJumpToNode} />
                </motion.div>
        );
}
