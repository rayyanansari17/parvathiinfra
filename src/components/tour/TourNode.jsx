'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

// Layout effects don't run during SSR; falling back to a plain effect there
// avoids the React warning while keeping the child-before-parent commit
// ordering layout effects give us on the client (TourShell's ScrollTrigger
// setup depends on these refs already being registered).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * A single cinematic scene. Two render modes:
 *  - "scroll" (default): mounted inside the pinned GSAP ScrollTrigger stage.
 *    Opacity/scale/drift are driven imperatively by the parent every scroll
 *    frame via the refs handed back through `registerRefs`; this component
 *    never re-renders for that motion.
 *  - "simple": used for the prefers-reduced-motion fallback, a plain static
 *    full-viewport section with no scroll-linked transforms or parallax.
 */
export default function TourNode({
        node,
        mode = 'scroll',
        active,
        reducedMotion,
        onAdvance,
        onImageLoad,
        loaded,
        registerRefs,
}) {
        const sceneRef = useRef(null);
        const parallaxRef = useRef(null);
        const kenBurnsRef = useRef(null);
        const captionRef = useRef(null);
        const imgRef = useRef(null);
        const rafRef = useRef(null);
        const targetRef = useRef({ x: 0, y: 0 });
        const currentRef = useRef({ x: 0, y: 0 });

        const simple = mode !== 'scroll';

        // Images served from cache can already be `.complete` by the time the
        // <img> mounts, in which case the browser never fires a fresh `load`
        // event and onLoad below would never run, leaving the shimmer stuck.
        useEffect(() => {
                if (imgRef.current?.complete) onImageLoad?.(node.image);
                const t = setTimeout(() => onImageLoad?.(node.image), 3000);
                return () => clearTimeout(t);
        }, [node.image, onImageLoad]);

        // Hand the raw DOM nodes up to TourShell so its ScrollTrigger onUpdate
        // can gsap.set() them directly every frame (no React re-render on scroll).
        useIsoLayoutEffect(() => {
                if (simple || !registerRefs) return undefined;
                registerRefs(node.id, {
                        scene: sceneRef.current,
                        kenBurns: kenBurnsRef.current,
                        caption: captionRef.current,
                });
                return () => registerRefs(node.id, null);
        }, [simple, node.id, registerRefs]);

        // 2.5D parallax on mousemove (desktop) / deviceorientation (mobile),
        // applied to its own inner wrapper so it composes with the scroll-driven
        // scale/opacity on the Ken Burns layer instead of fighting it.
        useEffect(() => {
                if (simple || reducedMotion || !parallaxRef.current) return undefined;
                const el = parallaxRef.current;

                const apply = () => {
                        currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.08;
                        currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.08;
                        el.style.transform = `translate3d(${currentRef.current.x}px, ${currentRef.current.y}px, 0)`;
                        rafRef.current = requestAnimationFrame(apply);
                };
                rafRef.current = requestAnimationFrame(apply);

                const onMouseMove = (e) => {
                        const nx = e.clientX / window.innerWidth - 0.5;
                        const ny = e.clientY / window.innerHeight - 0.5;
                        targetRef.current = { x: -nx * 20, y: -ny * 16 };
                };
                const onOrient = (e) => {
                        const gamma = Math.max(-20, Math.min(20, e.gamma || 0));
                        const beta = Math.max(-20, Math.min(20, (e.beta || 0) - 40));
                        targetRef.current = { x: -(gamma / 20) * 8, y: -(beta / 20) * 6 };
                };

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('deviceorientation', onOrient);
                return () => {
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('deviceorientation', onOrient);
                        if (rafRef.current) cancelAnimationFrame(rafRef.current);
                };
        }, [simple, reducedMotion]);

        return (
                <div
                        ref={sceneRef}
                        data-testid={`tour-node-${node.id}`}
                        data-active={active ? 'true' : 'false'}
                        className={
                                simple
                                        ? 'relative h-screen w-full overflow-hidden bg-ink'
                                        : 'absolute inset-0 overflow-hidden bg-ink'
                        }
                        style={simple ? undefined : { opacity: 0 }}
                >
                        {/* Parallax wrapper */}
                        <div ref={parallaxRef} className="absolute inset-[-4%]">
                                {/* Ken Burns wrapper: scale/drift set imperatively from scroll progress */}
                                <div ref={kenBurnsRef} className="absolute inset-0 will-change-transform">
                                        <img
                                                ref={imgRef}
                                                src={node.image}
                                                alt={node.title}
                                                draggable={false}
                                                loading="lazy"
                                                onLoad={() => onImageLoad?.(node.image)}
                                                className="h-full w-full select-none object-cover"
                                                style={simple || reducedMotion ? { transform: 'scale(1.02)' } : undefined}
                                        />
                                </div>
                        </div>

                        {/* Gold shimmer placeholder while the image loads */}
                        {!loaded && (
                                <div
                                        aria-hidden
                                        data-testid="tour-node-shimmer"
                                        className="absolute inset-0 z-[5] animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-obsidian via-[#1c1811] to-obsidian"
                                />
                        )}

                        {/* Vignette + grain */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/85" />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
                        <div className="pointer-events-none absolute inset-0 grain-overlay" />

                        {/* Forward hotspot: visible/clickable only while this node is dominant */}
                        {node.forwardHotspot && (
                                <button
                                        type="button"
                                        onClick={onAdvance}
                                        data-testid="tour-forward-hotspot"
                                        aria-label={`Continue to ${node.forwardHotspot.label}`}
                                        className={`group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 transition-opacity duration-500 focus:outline-none ${
                                                active || simple ? 'opacity-100' : 'pointer-events-none opacity-0'
                                        }`}
                                        style={{ left: `${node.forwardHotspot.x}%`, top: `${node.forwardHotspot.y}%` }}
                                >
                                        <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gold bg-ink/50 text-gold backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-gold">
                                                <span className="absolute inset-0 animate-gold-pulse rounded-full" />
                                                <ChevronRight size={18} />
                                        </span>
                                        <span className="rounded-sm bg-ink/70 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.24em] text-ivory opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                                                {node.forwardHotspot.label}
                                        </span>
                                </button>
                        )}

                        {/* Caption: opacity set imperatively from scroll progress in scroll mode */}
                        <div
                                ref={captionRef}
                                data-testid="tour-caption"
                                className="pointer-events-none absolute inset-x-0 bottom-24 px-6 md:bottom-28 md:px-16"
                                style={simple ? undefined : { opacity: 0 }}
                        >
                                <div className="micro-label mb-3">{node.chapter}</div>
                                <h1 className="max-w-2xl font-display text-3xl leading-tight tracking-[0.06em] text-ivory md:text-5xl">
                                        <span className="gold-foil-text">{node.title}</span>
                                </h1>
 <p className="mt-4 max-w-lg font-sans font-light text-base text-ivory-dim md:text-lg">
                                        {node.copy}
                                </p>
                        </div>
                </div>
        );
}
