'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ArrowRight } from 'lucide-react';
import plotsData from '@/data/plots.json';
import tourData from '@/data/tour.json';
import { SITE } from '@/lib/siteData';

const SIZE_BANDS = [
        { k: 'all', label: 'All Sizes' },
        { k: '166-200', label: '166 – 200 sq.yd', min: 166, max: 200.5 },
        { k: '233-267', label: '233 – 267 sq.yd', min: 233, max: 267 },
        { k: '290-320', label: '290 – 320 sq.yd', min: 289, max: 320 },
        { k: '346-398', label: '346 – 398 sq.yd', min: 346, max: 398 },
];

function bucketOf(sqyd) {
        if (sqyd == null) return null;
        const band = SIZE_BANDS.slice(1).find((b) => sqyd >= b.min && sqyd <= b.max);
        return band ? band.k : null;
}

function nearestAmenities(id) {
        if (id >= 33 && id <= 41) return ['H · Amphitheatre', 'D · Clubhouse', 'E · Pool & Amphitheatre Entry'];
        if (id >= 24 && id <= 32) return ['B · 30ft Roads', 'F · Sitting Area', 'I · View Point'];
        return ['A · Grand Entrance', "C · Children's Play Area"];
}

// Combine verified + unverified plots into one flat, position-sorted list.
const ALL_PLOTS = [
        ...plotsData.plots.map((p) => ({ ...p, verified: true })),
        ...plotsData.unverifiedPositions.map((u) => ({ id: u.id, sqyd: null, sqft: null, pos: u.pos, verified: false })),
].sort((a, b) => a.id - b.id);

export default function MasterPlan({ onJumpToNode }) {
        const containerRef = useRef(null);
        const [scale, setScale] = useState(1);
        const [tx, setTx] = useState(0);
        const [ty, setTy] = useState(0);
        const dragRef = useRef(null);
        const pinchRef = useRef(null);

        const [sizeBand, setSizeBand] = useState('all');
        const [verifiedOnly, setVerifiedOnly] = useState(false);
        const [selectedPlot, setSelectedPlot] = useState(null);
        const [selectedAmenity, setSelectedAmenity] = useState(null);

        const clampScale = (s) => Math.min(4, Math.max(1, s));

        const zoomAt = useCallback((clientX, clientY, factor) => {
                const el = containerRef.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const localX = clientX - rect.left;
                const localY = clientY - rect.top;
                setScale((prevScale) => {
                        const next = clampScale(prevScale * factor);
                        setTx((prevTx) => localX - ((localX - prevTx) / prevScale) * next);
                        setTy((prevTy) => localY - ((localY - prevTy) / prevScale) * next);
                        return next;
                });
        }, []);

        const onWheel = (e) => {
                e.preventDefault();
                const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
                zoomAt(e.clientX, e.clientY, factor);
        };

        const onPointerDown = (e) => {
                const el = containerRef.current;
                if (!el) return;
                el.setPointerCapture(e.pointerId);
                if (!pinchRef.current) pinchRef.current = new Map();
                pinchRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

                if (pinchRef.current.size === 1) {
                        dragRef.current = { startX: e.clientX, startY: e.clientY, tx, ty };
                } else if (pinchRef.current.size === 2) {
                        dragRef.current = null;
                }
        };

        const onPointerMove = (e) => {
                if (!pinchRef.current || !pinchRef.current.has(e.pointerId)) return;
                pinchRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

                if (pinchRef.current.size === 2) {
                        const pts = Array.from(pinchRef.current.values());
                        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
                        if (dragRef.current?.pinchDist) {
                                const factor = dist / dragRef.current.pinchDist;
                                const midX = (pts[0].x + pts[1].x) / 2;
                                const midY = (pts[0].y + pts[1].y) / 2;
                                zoomAt(midX, midY, factor);
                        }
                        dragRef.current = { pinchDist: dist };
                        return;
                }

                if (dragRef.current && dragRef.current.startX != null) {
                        const dx = e.clientX - dragRef.current.startX;
                        const dy = e.clientY - dragRef.current.startY;
                        setTx(dragRef.current.tx + dx);
                        setTy(dragRef.current.ty + dy);
                }
        };

        const onPointerUp = (e) => {
                if (pinchRef.current) pinchRef.current.delete(e.pointerId);
                if (!pinchRef.current || pinchRef.current.size === 0) dragRef.current = null;
        };

        const reset = () => {
                setScale(1);
                setTx(0);
                setTy(0);
        };

        const focusPlot = (plot) => {
                const el = containerRef.current;
                if (!el) return;
                const W = el.clientWidth;
                const H = el.clientHeight;
                const s = 2.4;
                const px = (plot.pos.x / 100) * W;
                const py = (plot.pos.y / 100) * H;
                setScale(s);
                setTx(W / 2 - px * s);
                setTy(H / 2 - py * s);
                setSelectedPlot(plot);
        };

        const filteredMeta = useMemo(() => {
                const map = new Map();
                ALL_PLOTS.forEach((p) => {
                        let dim = false;
                        if (sizeBand !== 'all' && bucketOf(p.sqyd) !== sizeBand) dim = true;
                        if (verifiedOnly && !p.verified) dim = true;
                        map.set(p.id, dim);
                });
                return map;
        }, [sizeBand, verifiedOnly]);

        return (
                <div data-testid="tour-masterplan" className="absolute inset-0 overflow-hidden bg-ink">
                        {/* Pan/zoom viewport */}
                        <div
                                ref={containerRef}
                                onWheel={onWheel}
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={onPointerUp}
                                onPointerCancel={onPointerUp}
                                className="absolute inset-0 touch-none"
                                data-testid="tour-masterplan-viewport"
                        >
                                <div
                                        className="absolute inset-0"
                                        style={{
                                                transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                                                transformOrigin: '0 0',
                                        }}
                                >
                                        <img
                                                src="/assets/tour/10-layout-plan.jpg"
                                                alt="THE VIEW · sanctioned layout plan, 41 plots"
                                                draggable={false}
                                                className="h-full w-full select-none object-contain"
                                        />

                                        {/* Plot hotspots */}
                                        {ALL_PLOTS.map((p) => {
                                                const dim = filteredMeta.get(p.id);
                                                return (
                                                        <button
                                                                key={p.id}
                                                                type="button"
                                                                onClick={() => setSelectedPlot(p)}
                                                                data-testid={`tour-plot-${p.id}`}
                                                                aria-label={`Plot ${p.id}${p.sqyd ? ` · ${p.sqyd} sq.yd` : ''}`}
                                                                className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all"
                                                                style={{
                                                                        left: `${p.pos.x}%`,
                                                                        top: `${p.pos.y}%`,
                                                                        borderColor: 'rgba(201,162,75,0.75)',
                                                                        background: 'rgba(201,162,75,0.12)',
                                                                        opacity: dim ? 0.3 : 1,
                                                                }}
                                                        >
                                                                <span className="font-display text-[0.6rem] tracking-[0.05em] text-ivory">
                                                                        {p.id}
                                                                </span>
                                                                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap border border-[rgba(201,162,75,0.5)] bg-ink/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ivory backdrop-blur-md group-hover:block">
                                                                        Plot {p.id} ·{' '}
                                                                        {p.sqyd ? `${p.sqyd} sq.yd` : 'Size on request'}
                                                                </span>
                                                        </button>
                                                );
                                        })}

                                        {/* Amenity pins */}
                                        {tourData.amenityPins.map((a) => (
                                                <button
                                                        key={a.code}
                                                        type="button"
                                                        onClick={() => setSelectedAmenity(a)}
                                                        data-testid={`tour-amenity-${a.code}`}
                                                        aria-label={`${a.code} · ${a.name}`}
                                                        className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-ink text-[0.55rem] font-display tracking-[0.05em] text-gold shadow-[0_0_10px_rgba(201,162,75,0.5)]"
                                                        style={{ left: `${a.x}%`, top: `${a.y}%` }}
                                                >
                                                        {a.code}
                                                </button>
                                        ))}
                                </div>
                        </div>

                        {/* Zoom controls */}
                        <div className="pointer-events-auto absolute bottom-40 right-4 z-20 flex flex-col gap-2 md:bottom-6 md:right-6">
                                <button
                                        type="button"
                                        onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.3)}
                                        data-testid="tour-masterplan-zoomin"
                                        className="flex h-9 w-9 items-center justify-center border border-[rgba(201,162,75,0.4)] bg-ink/70 text-ivory backdrop-blur-md hover:border-gold"
                                        aria-label="Zoom in"
                                >
                                        +
                                </button>
                                <button
                                        type="button"
                                        onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1 / 1.3)}
                                        data-testid="tour-masterplan-zoomout"
                                        className="flex h-9 w-9 items-center justify-center border border-[rgba(201,162,75,0.4)] bg-ink/70 text-ivory backdrop-blur-md hover:border-gold"
                                        aria-label="Zoom out"
                                >
                                        −
                                </button>
                                <button
                                        type="button"
                                        onClick={reset}
                                        data-testid="tour-masterplan-reset"
                                        className="flex h-9 w-9 items-center justify-center border border-[rgba(201,162,75,0.4)] bg-ink/70 text-ivory backdrop-blur-md hover:border-gold"
                                        aria-label="Reset view"
                                >
                                        <RotateCcw size={14} />
                                </button>
                        </div>

                        {/* Stat strip + filters */}
                        <div className="pointer-events-auto absolute inset-x-0 top-16 z-20 flex flex-col gap-3 px-4 md:top-20 md:px-8">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border border-[rgba(201,162,75,0.3)] bg-ink/70 px-4 py-2.5 text-[0.6rem] uppercase tracking-[0.18em] text-ivory-dim backdrop-blur-md">
                                        <span className="text-gold">{plotsData.project.siteAreaAcres} acres</span>
                                        <span className="h-3 w-px bg-[rgba(201,162,75,0.3)]" />
                                        <span>{plotsData.project.totalPlots} plots</span>
                                        <span className="h-3 w-px bg-[rgba(201,162,75,0.3)]" />
                                        <span>{plotsData.project.plottedPct}% plotted</span>
                                        <span className="h-3 w-px bg-[rgba(201,162,75,0.3)]" />
                                        <span>30 ft CC roads</span>
                                        <span className="h-3 w-px bg-[rgba(201,162,75,0.3)]" />
                                        <span>100 ft HMDA road</span>
                                        <img
                                                src="/assets/tour/badge-fcda.jpg"
                                                alt="FCDA approved layout"
                                                className="ml-auto hidden h-9 w-9 rounded-full object-cover sm:block"
                                        />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                        {SIZE_BANDS.map((b) => (
                                                <button
                                                        key={b.k}
                                                        type="button"
                                                        onClick={() => setSizeBand(b.k)}
                                                        data-testid={`tour-filter-${b.k}`}
                                                        className={`border px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors ${
                                                                sizeBand === b.k
                                                                        ? 'border-gold bg-gold text-ink'
                                                                        : 'border-[rgba(201,162,75,0.3)] bg-ink/60 text-ivory-dim backdrop-blur-md hover:border-gold hover:text-ivory'
                                                        }`}
                                                >
                                                        {b.label}
                                                </button>
                                        ))}
                                        <button
                                                type="button"
                                                onClick={() => setVerifiedOnly((v) => !v)}
                                                data-testid="tour-filter-verified"
                                                className={`border px-3 py-1.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors ${
                                                        verifiedOnly
                                                                ? 'border-gold bg-gold text-ink'
                                                                : 'border-[rgba(201,162,75,0.3)] bg-ink/60 text-ivory-dim backdrop-blur-md hover:border-gold hover:text-ivory'
                                                }`}
                                        >
                                                Verified sizes only
                                        </button>
                                </div>
                        </div>

                        {/* Mobile plot list */}
                        <div className="pointer-events-auto absolute inset-x-0 bottom-16 z-20 max-h-[30vh] overflow-y-auto border-t border-[rgba(201,162,75,0.25)] bg-ink/85 px-4 py-3 backdrop-blur-md lg:hidden" data-lenis-prevent>
                                <div className="micro-label mb-2">Plot List · Tap To Locate</div>
                                <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                                        {ALL_PLOTS.map((p) => (
                                                <li key={p.id}>
                                                        <button
                                                                type="button"
                                                                onClick={() => focusPlot(p)}
                                                                data-testid={`tour-plot-list-${p.id}`}
                                                                className="flex w-full flex-col items-center border border-[rgba(201,162,75,0.3)] px-1.5 py-1.5 text-[0.58rem] uppercase tracking-[0.1em] text-ivory-dim hover:border-gold hover:text-ivory"
                                                        >
                                                                <span className="font-display text-gold">{String(p.id).padStart(2, '0')}</span>
                                                                <span>{p.sqyd ? `${p.sqyd}` : 'On req.'}</span>
                                                        </button>
                                                </li>
                                        ))}
                                </ul>
                        </div>

                        {/* Plot side panel */}
                        <AnimatePresence>
                                {selectedPlot && (
                                        <PlotPanel plot={selectedPlot} onClose={() => setSelectedPlot(null)} />
                                )}
                        </AnimatePresence>

                        {/* Amenity side panel */}
                        <AnimatePresence>
                                {selectedAmenity && (
                                        <AmenityPanel
                                                amenity={selectedAmenity}
                                                onClose={() => setSelectedAmenity(null)}
                                                onVisit={() => {
                                                        if (selectedAmenity.jumpTo) onJumpToNode(selectedAmenity.jumpTo);
                                                        setSelectedAmenity(null);
                                                }}
                                        />
                                )}
                        </AnimatePresence>
                </div>
        );
}

function PlotPanel({ plot, onClose }) {
        const nearby = nearestAmenities(plot.id);
        return (
                <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="tour-plot-panel"
                        className="pointer-events-auto fixed inset-y-0 right-0 z-[92] flex w-full max-w-sm flex-col border-l border-[rgba(201,162,75,0.4)] bg-obsidian shadow-2xl"
                >
                        <div className="flex items-start justify-between border-b border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <div>
                                        <div className="micro-label">Plot Detail</div>
                                        <div className="mt-2 font-display text-3xl tracking-[0.08em] text-ivory">
                                                <span className="gold-foil-text">{String(plot.id).padStart(2, '0')}</span>
                                        </div>
                                </div>
                                <button type="button" onClick={onClose} data-testid="tour-plot-panel-close" className="text-ivory-dim hover:text-ivory">
                                        <X size={20} />
                                </button>
                        </div>
                        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6" data-lenis-prevent>
                                <div className="grid grid-cols-2 gap-3">
                                        <Cell label="Sq. Yards">{plot.sqyd ? plot.sqyd : 'Size on request'}</Cell>
                                        <Cell label="Sq. Feet">{plot.sqft ? plot.sqft : 'Size on request'}</Cell>
                                        {plot.level != null && <Cell label="Level">{plot.level} m</Cell>}
                                        <Cell label="Status"><span className="text-gold">Available · Enquire</span></Cell>
                                </div>
                                <div>
                                        <div className="micro-label mb-3">Nearest Amenities</div>
                                        <ul className="space-y-2 text-sm text-ivory">
                                                {nearby.map((n) => (
                                                        <li key={n} className="flex items-center gap-3">
                                                                <span className="h-px w-6 bg-gold" /> {n}
                                                        </li>
                                                ))}
                                        </ul>
                                </div>
                        </div>
                        <div className="border-t border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <a
                                        href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
                                                `Hi, I'm interested in Plot ${plot.id} at The View.`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-testid="tour-plot-panel-enquire"
                                        className="block w-full border border-[rgba(201,162,75,0.5)] bg-gold-foil px-6 py-3 text-center text-[0.68rem] uppercase tracking-[0.28em] text-ink"
                                >
                                        Enquire about Plot {plot.id}
                                </a>
                        </div>
                </motion.aside>
        );
}

function Cell({ label, children }) {
        return (
                <div className="border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-3">
                        <div className="micro-label mb-1.5">{label}</div>
                        <div className="font-display text-base tracking-[0.05em] text-ivory">{children}</div>
                </div>
        );
}

function AmenityPanel({ amenity, onClose, onVisit }) {
        return (
                <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="tour-amenity-panel"
                        className="pointer-events-auto fixed inset-y-0 right-0 z-[92] flex w-full max-w-sm flex-col border-l border-[rgba(201,162,75,0.4)] bg-obsidian shadow-2xl"
                >
                        <div className="flex items-start justify-between border-b border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <div>
                                        <div className="micro-label">Amenity {amenity.code}</div>
                                        <div className="mt-2 font-display text-xl tracking-[0.08em] text-ivory">
                                                <span className="gold-foil-text">{amenity.name}</span>
                                        </div>
                                </div>
                                <button type="button" onClick={onClose} data-testid="tour-amenity-panel-close" className="text-ivory-dim hover:text-ivory">
                                        <X size={20} />
                                </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
                                <div className="mb-6 aspect-video overflow-hidden border border-[rgba(201,162,75,0.25)] bg-obsidian-2">
                                        <img src={amenity.image} alt={amenity.name} className="h-full w-full object-cover" />
                                </div>
                                <p className="font-serif-elegant text-lg italic leading-relaxed text-ivory">{amenity.body}</p>
                        </div>
                        {amenity.jumpTo && (
                                <div className="border-t border-[rgba(201,162,75,0.2)] px-6 py-5">
                                        <button
                                                type="button"
                                                onClick={onVisit}
                                                data-testid="tour-amenity-visit"
                                                className="flex w-full items-center justify-center gap-2 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-6 py-3 text-[0.68rem] uppercase tracking-[0.28em] text-ink"
                                        >
                                                Visit this place <ArrowRight size={14} />
                                        </button>
                                </div>
                        )}
                </motion.aside>
        );
}
