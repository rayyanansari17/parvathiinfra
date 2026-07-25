'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Plus } from 'lucide-react';
import gsap from 'gsap';

/**
 * A single full-bleed tour scene: Ken Burns background, 2.5D parallax,
 * grain + vignette, caption block, forward hotspot and info hotspots.
 */
export default function TourNode({ node, reducedMotion, onAdvance, onInfoOpen, onImageLoad, loaded }) {
        const layerRef = useRef(null);
        const kenBurnsRef = useRef(null);
        const imgRef = useRef(null);
        const rafRef = useRef(null);

        // Images served from cache can already be `.complete` by the time the
        // <img> mounts, in which case the browser never fires a fresh `load`
        // event and onLoad below would never run, leaving the shimmer stuck.
        useEffect(() => {
                if (imgRef.current?.complete) onImageLoad?.(node.image);
                // Safety net: never let a missed load event hide the scene forever.
                const t = setTimeout(() => onImageLoad?.(node.image), 3000);
                return () => clearTimeout(t);
        }, [node.image, onImageLoad]);
        const targetRef = useRef({ x: 0, y: 0 });
        const currentRef = useRef({ x: 0, y: 0 });

        // GSAP Ken Burns loop.
        useEffect(() => {
                if (reducedMotion || !node.camera || !kenBurnsRef.current) return undefined;
                const { fromScale, toScale, xDrift, yDrift, duration } = node.camera;
                const state = { scale: fromScale, x: -xDrift / 2, y: -yDrift / 2 };
                gsap.set(kenBurnsRef.current, { scale: state.scale, xPercent: state.x, yPercent: state.y });
                const tween = gsap.to(state, {
                        scale: toScale,
                        x: xDrift / 2,
                        y: yDrift / 2,
                        duration,
                        ease: 'sine.inOut',
                        yoyo: true,
                        repeat: -1,
                        onUpdate: () => {
                                gsap.set(kenBurnsRef.current, {
                                        scale: state.scale,
                                        xPercent: state.x,
                                        yPercent: state.y,
                                });
                        },
                });
                return () => tween.kill();
        }, [node, reducedMotion]);

        // 2.5D parallax: mousemove (desktop) / deviceorientation (mobile).
        useEffect(() => {
                if (reducedMotion || !layerRef.current) return undefined;
                const el = layerRef.current;

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
        }, [reducedMotion]);

        return (
                <motion.div
                        data-testid={`tour-node-${node.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.15 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 overflow-hidden bg-ink"
                >
                        {/* Parallax wrapper */}
                        <div ref={layerRef} className="absolute inset-[-4%]">
                                {/* Ken Burns wrapper */}
                                <div ref={kenBurnsRef} className="absolute inset-0 will-change-transform">
                                        <img
                                                ref={imgRef}
                                                src={node.image}
                                                alt={node.title}
                                                draggable={false}
                                                onLoad={() => onImageLoad?.(node.image)}
                                                className="h-full w-full select-none object-cover"
                                                style={!node.camera || reducedMotion ? { transform: 'scale(1.02)' } : undefined}
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

                        {/* Forward hotspot */}
                        {node.forwardHotspot && (
                                <button
                                        type="button"
                                        onClick={onAdvance}
                                        data-testid="tour-forward-hotspot"
                                        aria-label={`Continue to ${node.forwardHotspot.label}`}
                                        className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 focus:outline-none"
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

                        {/* Info hotspots */}
                        {(node.infoHotspots || []).map((h, i) => (
                                <button
                                        key={`${node.id}-info-${i}`}
                                        type="button"
                                        onClick={() => onInfoOpen(h)}
                                        data-testid={`tour-info-hotspot-${i}`}
                                        aria-label={h.title}
                                        className="group absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(201,162,75,0.7)] bg-ink/40 text-gold backdrop-blur-sm transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                                        style={{ left: `${h.x}%`, top: `${h.y}%` }}
                                >
                                        <Plus size={14} />
                                </button>
                        ))}

                        {/* Caption */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-24 px-6 md:bottom-28 md:px-16">
                                <div className="micro-label mb-3">{node.chapter}</div>
                                <h1 className="max-w-2xl font-display text-3xl leading-tight tracking-[0.06em] text-ivory md:text-5xl">
                                        <span className="gold-foil-text">{node.title}</span>
                                </h1>
                                <p className="mt-4 max-w-lg font-serif-elegant text-lg italic text-ivory-dim md:text-xl">
                                        {node.copy}
                                </p>
                        </div>
                </motion.div>
        );
}
