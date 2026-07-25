'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
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

if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// Layout effects don't run during SSR; fall back to a plain effect there.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const NODES = tourData.nodes;
const PINNED_NODES = NODES.filter((n) => n.id !== 'masterplan');
const PINNED_COUNT = PINNED_NODES.length; // 9 cinematic scenes
const MASTERPLAN_ACTIVE = PINNED_COUNT; // sentinel activeIndex value for "master plan is dominant"
const MASTERPLAN_NODE = NODES.find((n) => n.id === 'masterplan');
const SEGMENT_VH_FACTOR = 1.2; // each node "owns" 120vh of scroll, per spec
const DISSOLVE_START = 0.8; // last 20% of a segment cross-dissolves to the next node
const AUTOPLAY_SECONDS_PER_NODE = 5;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;

// Given a node's Ken Burns camera params and its local segment progress
// (localT: -0.2..0 is the incoming preroll during the previous node's
// dissolve, 0..0.8 is the node's own active push-in, 0.8..1 is its own
// dissolve into the next node), compute the scene opacity, image scale,
// drift (xPercent/yPercent) and caption opacity for this frame.
function computeVisual(camera, localT) {
        if (localT < -0.2 || localT > 1) {
                return {
                        opacity: 0,
                        scale: camera.fromScale,
                        xPercent: -camera.xDrift / 2,
                        yPercent: -camera.yDrift / 2,
                        captionOpacity: 0,
                };
        }
        if (localT < 0) {
                const p = (localT + 0.2) / 0.2;
                return {
                        opacity: p,
                        scale: lerp(0.95, camera.fromScale, p),
                        xPercent: -camera.xDrift / 2,
                        yPercent: -camera.yDrift / 2,
                        captionOpacity: 0,
                };
        }
        if (localT <= DISSOLVE_START) {
                const p = localT / DISSOLVE_START;
                let captionOpacity = 1;
                if (localT < 0.06) captionOpacity = localT / 0.06;
                else if (localT > 0.6) captionOpacity = Math.max(0, 1 - (localT - 0.6) / 0.2);
                return {
                        opacity: 1,
                        scale: lerp(camera.fromScale, camera.toScale, p),
                        xPercent: lerp(-camera.xDrift / 2, camera.xDrift / 2, p),
                        yPercent: lerp(-camera.yDrift / 2, camera.yDrift / 2, p),
                        captionOpacity,
                };
        }
        const p2 = (localT - DISSOLVE_START) / (1 - DISSOLVE_START);
        return {
                opacity: 1 - p2,
                scale: lerp(camera.toScale, 1.15, p2),
                xPercent: camera.xDrift / 2,
                yPercent: camera.yDrift / 2,
                captionOpacity: 0,
        };
}

export default function TourShell() {
        const [preloaderDone, setPreloaderDone] = useState(false);
        const [reducedMotion, setReducedMotion] = useState(false);
        const [autoplay, setAutoplay] = useState(false);
        const [muted, setMuted] = useState(true);
        const [activeInfo, setActiveInfo] = useState(null);
        const [loadedImages, setLoadedImages] = useState(() => new Set());

        const [ctaDismissed, setCtaDismissed] = useState(false);
        const [manualCtaOpen, setManualCtaOpen] = useState(false);
        const [mpExpanded, setMpExpanded] = useState(false);

        // 0..PINNED_COUNT-1 = which pinned scene is dominant; MASTERPLAN_ACTIVE
        // (== PINNED_COUNT) = the master plan section is dominant.
        const [activeIndex, setActiveIndex] = useState(0);
        // Which pinned scenes are mounted (current +/- 1); others aren't rendered.
        const [mountedRange, setMountedRange] = useState([0, Math.min(1, PINNED_COUNT - 1)]);
        const [overallProgress, setOverallProgress] = useState(0);

        const audioRef = useRef(null);
        const wrapperRef = useRef(null);
        const pinStageRef = useRef(null);
        const mpSectionRef = useRef(null);

        const sceneRefs = useRef({});
        const lastSceneFloatRef = useRef(0);
        const pinnedSTRef = useRef(null);
        const inMasterplanRef = useRef(false);
        const autoplayRef = useRef(false);
        const autoplayTweenRef = useRef(null);
        const autoplayCleanupRef = useRef(null);

        // Respect prefers-reduced-motion.
        useEffect(() => {
                const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
                setReducedMotion(mq.matches);
                const onChange = (e) => setReducedMotion(e.matches);
                mq.addEventListener?.('change', onChange);
                return () => mq.removeEventListener?.('change', onChange);
        }, []);

        const registerSceneRefs = useCallback((id, refs) => {
                if (refs) sceneRefs.current[id] = refs;
                else delete sceneRefs.current[id];
        }, []);

        // Imperative, per-frame visual update for the currently mounted window of
        // nodes. Runs off the GSAP ScrollTrigger onUpdate, never through React
        // state, so scroll stays smooth regardless of render cost elsewhere.
        const applyTransforms = useCallback((sceneFloat) => {
                const centerIdx = clamp(Math.floor(sceneFloat), 0, PINNED_COUNT - 1);
                const lo = clamp(centerIdx - 1, 0, PINNED_COUNT - 1);
                const hi = clamp(centerIdx + 1, 0, PINNED_COUNT - 1);
                for (let i = lo; i <= hi; i += 1) {
                        const n = PINNED_NODES[i];
                        const refs = sceneRefs.current[n.id];
                        if (!refs || !refs.scene || !refs.kenBurns || !n.camera) continue;
                        const localT = sceneFloat - i;
                        const v = computeVisual(n.camera, localT);
                        gsap.set(refs.scene, { opacity: v.opacity });
                        gsap.set(refs.kenBurns, { scale: v.scale, xPercent: v.xPercent, yPercent: v.yPercent });
                        if (refs.caption) gsap.set(refs.caption, { opacity: v.captionOpacity });
                }
        }, []);

        const updateMountedRange = useCallback((sceneFloat) => {
                const centerIdx = clamp(Math.floor(sceneFloat), 0, PINNED_COUNT - 1);
                const lo = clamp(centerIdx - 1, 0, PINNED_COUNT - 1);
                const hi = clamp(centerIdx + 1, 0, PINNED_COUNT - 1);
                setMountedRange((prev) => (prev && prev[0] === lo && prev[1] === hi ? prev : [lo, hi]));
        }, []);

        // A newly-mounted node's DOM refs only get registered with sceneRefs
        // after React actually commits the new mountedRange, which is one tick
        // after the ScrollTrigger onUpdate that requested it. On a large jump
        // (e.g. a chapter-rail/mini-map scrollTo, or a snapshot right after a
        // fast scroll) that node would otherwise sit at its default (invisible)
        // style for a frame. Re-apply transforms once mountedRange actually
        // changes so a freshly-mounted node is caught up immediately.
        useEffect(() => {
                applyTransforms(lastSceneFloatRef.current);
        }, [mountedRange, applyTransforms]);

        const stopAutoplay = useCallback(() => {
                if (autoplayTweenRef.current) {
                        autoplayTweenRef.current.kill();
                        autoplayTweenRef.current = null;
                }
                if (autoplayCleanupRef.current) {
                        autoplayCleanupRef.current();
                        autoplayCleanupRef.current = null;
                }
                autoplayRef.current = false;
                setAutoplay(false);
        }, []);

        const startAutoplay = useCallback(() => {
                if (reducedMotion) return;
                const st = pinnedSTRef.current;
                if (!st) return;
                autoplayRef.current = true;
                setAutoplay(true);

                const remaining = Math.max(0, 1 - st.progress);
                const duration = Math.max(1, remaining * PINNED_COUNT * AUTOPLAY_SECONDS_PER_NODE);
                const tween = gsap.to(window, {
                        duration,
                        ease: 'none',
                        scrollTo: { y: st.end, autoKill: true },
                        onComplete: () => {
                                autoplayRef.current = false;
                                setAutoplay(false);
                                if (autoplayCleanupRef.current) {
                                        autoplayCleanupRef.current();
                                        autoplayCleanupRef.current = null;
                                }
                        },
                        onInterrupt: () => {
                                autoplayRef.current = false;
                                setAutoplay(false);
                        },
                });
                autoplayTweenRef.current = tween;

                const onUserScroll = () => stopAutoplay();
                window.addEventListener('wheel', onUserScroll, { passive: true });
                window.addEventListener('touchstart', onUserScroll, { passive: true });
                autoplayCleanupRef.current = () => {
                        window.removeEventListener('wheel', onUserScroll);
                        window.removeEventListener('touchstart', onUserScroll);
                };
        }, [reducedMotion, stopAutoplay]);

        useEffect(() => () => stopAutoplay(), [stopAutoplay]);

        // Start the tour playing on arrival (once), rather than parked on the
        // first scene waiting for a Play click. Waits a beat for the pinned
        // ScrollTrigger to exist. Skipped under reduced motion.
        const autoStartedRef = useRef(false);
        useEffect(() => {
                if (!preloaderDone || reducedMotion || autoStartedRef.current) return undefined;
                autoStartedRef.current = true;
                const t = setTimeout(() => startAutoplay(), 700);
                return () => clearTimeout(t);
        }, [preloaderDone, reducedMotion, startAutoplay]);

        // Smooth-scroll to a given pinned-node index (0..PINNED_COUNT-1) or to
        // MASTERPLAN_ACTIVE for the master plan section. Used by the chapter
        // rail, mini-map, forward hotspot and arrow keys.
        const scrollToIndex = useCallback(
                (i) => {
                        const target = clamp(i, 0, MASTERPLAN_ACTIVE);
                        stopAutoplay();
                        setActiveInfo(null);
                        if (reducedMotion) {
                                const id = target === MASTERPLAN_ACTIVE ? 'masterplan' : PINNED_NODES[target].id;
                                document
                                        .querySelector(`[data-section-id="${id}"]`)
                                        ?.scrollIntoView({ behavior: 'auto', block: 'start' });
                                return;
                        }
                        const st = pinnedSTRef.current;
                        if (!st) return;
                        let targetY;
                        if (target === MASTERPLAN_ACTIVE) {
                                // The pin-spacer reserves the pinned stage's own natural height
                                // *plus* the scrub distance, so "st.end" (where scrub progress
                                // hits 1) lands a full viewport height short of where the
                                // master plan section's top actually is. Measure it directly
                                // instead of trying to re-derive it from the pin math.
                                const rect = mpSectionRef.current?.getBoundingClientRect();
                                targetY = rect ? rect.top + window.scrollY + 4 : st.end + window.innerHeight + 4;
                        } else {
                                const p = (target + 0.05) / PINNED_COUNT;
                                targetY = st.start + p * (st.end - st.start);
                        }
                        gsap.to(window, { duration: 1.1, ease: 'power3.out', scrollTo: { y: targetY, autoKill: true } });
                },
                [reducedMotion, stopAutoplay],
        );

        const jumpToNodeId = useCallback(
                (id) => {
                        if (id === 'masterplan') {
                                scrollToIndex(MASTERPLAN_ACTIVE);
                                return;
                        }
                        const i = PINNED_NODES.findIndex((n) => n.id === id);
                        if (i >= 0) scrollToIndex(i);
                },
                [scrollToIndex],
        );

        // Keyboard navigation.
        useEffect(() => {
                const onKey = (e) => {
                        if (e.key === 'ArrowRight') scrollToIndex(activeIndex + 1);
                        else if (e.key === 'ArrowLeft') scrollToIndex(activeIndex - 1);
                        else if (e.key === 'Escape') setActiveInfo(null);
                };
                window.addEventListener('keydown', onKey);
                return () => window.removeEventListener('keydown', onKey);
        }, [activeIndex, scrollToIndex]);

        // Preload the next node's image.
        useEffect(() => {
                const next = NODES[activeIndex + 1];
                if (next) {
                        const img = new Image();
                        img.src = next.image;
                }
        }, [activeIndex]);

        // Reset the Master-Plan CTA chip expansion when leaving/entering it.
        useEffect(() => {
                setMpExpanded(false);
        }, [activeIndex]);

        // While the tour is playing, surface each scene's detail notes on their
        // own, cycling through them, instead of hiding them behind clickable
        // hotspots. Cleared when paused, in the master plan, or on a scene with
        // no notes.
        useEffect(() => {
                if (!autoplay || reducedMotion || activeIndex >= PINNED_COUNT) {
                        setActiveInfo(null);
                        return undefined;
                }
                const notes = PINNED_NODES[activeIndex]?.infoHotspots || [];
                if (!notes.length) {
                        setActiveInfo(null);
                        return undefined;
                }
                let i = 0;
                setActiveInfo(notes[0]);
                const id = setInterval(() => {
                        i = (i + 1) % notes.length;
                        setActiveInfo(notes[i]);
                }, 2600);
                return () => clearInterval(id);
        }, [autoplay, reducedMotion, activeIndex]);

        const onImageLoad = useCallback((src) => {
                setLoadedImages((prev) => {
                        if (prev.has(src)) return prev;
                        const next = new Set(prev);
                        next.add(src);
                        return next;
                });
        }, []);

        // GSAP ScrollTrigger setup: a pinned + scrubbed stage for the 9 cinematic
        // nodes, then plain document scroll into the Master Plan section. Skipped
        // entirely under reduced motion (see the fallback render branch below).
        useIsoLayoutEffect(() => {
                if (!preloaderDone || reducedMotion) return undefined;
                if (!pinStageRef.current || !wrapperRef.current || !mpSectionRef.current) return undefined;

                const ctx = gsap.context(() => {
                        const pinnedST = ScrollTrigger.create({
                                trigger: pinStageRef.current,
                                start: 'top top',
                                end: () => `+=${PINNED_COUNT * window.innerHeight * SEGMENT_VH_FACTOR}`,
                                pin: true,
                                pinSpacing: true,
                                scrub: true,
                                anticipatePin: 1,
                                snap: {
                                        snapTo: (value) =>
                                                autoplayRef.current ? value : Math.round(value * PINNED_COUNT) / PINNED_COUNT,
                                        duration: 0.4,
                                        ease: 'power1.inOut',
                                },
                                onUpdate: (self) => {
                                        const sceneFloat = clamp(self.progress * PINNED_COUNT, 0, PINNED_COUNT);
                                        lastSceneFloatRef.current = sceneFloat;
                                        applyTransforms(sceneFloat);
                                        updateMountedRange(sceneFloat);
                                        if (!inMasterplanRef.current) {
                                                const na = clamp(Math.floor(sceneFloat + 0.1), 0, PINNED_COUNT - 1);
                                                setActiveIndex((prev) => (prev === na ? prev : na));
                                        }
                                },
                        });
                        pinnedSTRef.current = pinnedST;

                        // The master plan is the last section and is exactly one viewport
                        // tall, so "top top" would only be crossed on the final pixel of
                        // the document and the enter can be missed entirely. Treat it as
                        // dominant once it covers the lower half of the screen instead,
                        // which is comfortably reachable and matches how it reads.
                        ScrollTrigger.create({
                                trigger: mpSectionRef.current,
                                start: 'top 55%',
                                onEnter: () => {
                                        inMasterplanRef.current = true;
                                        setActiveIndex(MASTERPLAN_ACTIVE);
                                },
                                onEnterBack: () => {
                                        inMasterplanRef.current = true;
                                        setActiveIndex(MASTERPLAN_ACTIVE);
                                },
                                onLeaveBack: () => {
                                        inMasterplanRef.current = false;
                                        setActiveIndex(PINNED_COUNT - 1);
                                },
                        });

                        ScrollTrigger.create({
                                trigger: wrapperRef.current,
                                start: 'top top',
                                end: 'bottom bottom',
                                scrub: true,
                                onUpdate: (self) => setOverallProgress(self.progress),
                        });

                        // Prime the first frame so nothing flashes at the wrong opacity.
                        applyTransforms(0);
                        updateMountedRange(0);
                }, wrapperRef);

                const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

                return () => {
                        cancelAnimationFrame(raf);
                        ctx.revert();
                        pinnedSTRef.current = null;
                        inMasterplanRef.current = false;
                };
        }, [preloaderDone, reducedMotion, applyTransforms, updateMountedRange]);

        const currentNode = activeIndex === MASTERPLAN_ACTIVE ? MASTERPLAN_NODE : PINNED_NODES[activeIndex];
        const ctaVisible =
                manualCtaOpen || (!ctaDismissed && (activeIndex === PINNED_COUNT - 1 || activeIndex === MASTERPLAN_ACTIVE));
        const ctaCollapsed = !manualCtaOpen && activeIndex === MASTERPLAN_ACTIVE && !mpExpanded;

        return (
                <div data-testid="tour-shell" data-active-index={activeIndex} className="relative bg-ink text-ivory">
                        <TourPreloader firstImage={NODES[0].image} onDone={() => setPreloaderDone(true)} />

                        {preloaderDone && (
                                <>
                                        <ProgressLine
                                                progress={reducedMotion ? undefined : overallProgress}
                                                index={activeIndex}
                                                total={NODES.length}
                                        />
                                        <TopBar
                                                autoplay={autoplay}
                                                onToggleAutoplay={() => (autoplay ? stopAutoplay() : startAutoplay())}
                                                muted={muted}
                                                onToggleMuted={() => setMuted((m) => !m)}
                                                onEnquire={() => setManualCtaOpen(true)}
                                                reducedMotion={reducedMotion}
                                        />
                                </>
                        )}

                        {reducedMotion ? (
                                <ReducedMotionTrack
                                        activeIndex={activeIndex}
                                        onActivate={setActiveIndex}
                                        onAdvance={(i) => scrollToIndex(i)}
                                        onInfoOpen={setActiveInfo}
                                        onImageLoad={onImageLoad}
                                        loadedImages={loadedImages}
                                        onJumpToNode={jumpToNodeId}
                                />
                        ) : (
                                <div ref={wrapperRef} className="relative">
                                        <div
                                                ref={pinStageRef}
                                                data-testid="tour-pin-stage"
                                                className="relative z-[65] h-screen w-full overflow-hidden bg-ink"
                                        >
                                                {Array.from(
                                                        { length: mountedRange[1] - mountedRange[0] + 1 },
                                                        (_, k) => mountedRange[0] + k,
                                                ).map((i) => {
                                                        const n = PINNED_NODES[i];
                                                        return (
                                                                <TourNode
                                                                        key={n.id}
                                                                        mode="scroll"
                                                                        node={n}
                                                                        active={activeIndex === i}
                                                                        reducedMotion={false}
                                                                        onAdvance={() => scrollToIndex(i + 1)}
                                                                        onInfoOpen={setActiveInfo}
                                                                        onImageLoad={onImageLoad}
                                                                        loaded={loadedImages.has(n.image)}
                                                                        registerRefs={registerSceneRefs}
                                                                />
                                                        );
                                                })}
                                        </div>

                                        <section
                                                ref={mpSectionRef}
                                                data-testid="tour-node-masterplan"
                                                className="relative z-[65] h-screen w-full bg-ink"
                                        >
                                                <MasterPlan onJumpToNode={jumpToNodeId} />
                                        </section>
                                </div>
                        )}

                        {preloaderDone && (
                                <>
                                        <InfoPanel hotspot={activeInfo} auto onClose={() => setActiveInfo(null)} />
                                        <MiniMap node={currentNode} onOpen={() => scrollToIndex(MASTERPLAN_ACTIVE)} />
                                        <ChapterRail nodes={NODES} index={activeIndex} onJump={(i) => scrollToIndex(i)} />
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

// prefers-reduced-motion fallback: plain stacked full-viewport sections that
// cross-fade on intersection. No GSAP pin/scrub, no parallax, no autoplay.
function ReducedMotionTrack({ activeIndex, onActivate, onAdvance, onInfoOpen, onImageLoad, loadedImages, onJumpToNode }) {
        return (
                <div className="relative z-[65]">
                        {PINNED_NODES.map((n, i) => (
                                <ReducedSection key={n.id} id={n.id} index={i} onActivate={onActivate}>
                                        <TourNode
                                                mode="simple"
                                                node={n}
                                                active={activeIndex === i}
                                                reducedMotion
                                                onAdvance={() => onAdvance(i + 1)}
                                                onInfoOpen={onInfoOpen}
                                                onImageLoad={onImageLoad}
                                                loaded={loadedImages.has(n.image)}
                                        />
                                </ReducedSection>
                        ))}
                        <ReducedSection id="masterplan" index={MASTERPLAN_ACTIVE} onActivate={onActivate}>
                                <MasterPlan onJumpToNode={onJumpToNode} />
                        </ReducedSection>
                </div>
        );
}

function ReducedSection({ id, index, onActivate, children }) {
        const ref = useRef(null);
        const [visible, setVisible] = useState(false);

        useEffect(() => {
                const el = ref.current;
                if (!el) return undefined;
                const io = new IntersectionObserver(
                        ([entry]) => {
                                const dominant = entry.isIntersecting && entry.intersectionRatio >= 0.5;
                                setVisible(dominant);
                                if (dominant) onActivate(index);
                        },
                        { threshold: [0, 0.5, 1] },
                );
                io.observe(el);
                return () => io.disconnect();
        }, [index, onActivate]);

        return (
                <section
                        ref={ref}
                        data-section-id={id}
                        data-testid={`tour-section-${id}`}
                        className={`relative h-screen w-full bg-ink transition-opacity duration-700 ease-out ${
                                visible ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                        {children}
                </section>
        );
}
