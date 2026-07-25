'use client';

import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import plotsData from '@/data/plots.json';
import site3d from '@/data/site3d.json';
import { buildAllPlotsReal } from '@/lib/site3dGeometry';
import SceneContent from './SceneContent';
import TopBar3D from './ui/TopBar3D';
import ViewpointRail from './ui/ViewpointRail';
import Joystick from './ui/Joystick';
import PlotPanel3D from './ui/PlotPanel3D';
import AmenityPanel3D from './ui/AmenityPanel3D';
import CTACard from '@/components/tour/CTACard';

export default function Experience3D() {
        const [mode, setMode] = useState('orbit');
        const [viewpointKey, setViewpointKey] = useState(null);
        const [flightNonce, setFlightNonce] = useState(0);
        const [hoveredId, setHoveredId] = useState(null);
        const [selectedPlot, setSelectedPlot] = useState(null);
        const [selectedAmenity, setSelectedAmenity] = useState(null);
        const [reducedMotion, setReducedMotion] = useState(false);
        const [isMobile, setIsMobile] = useState(false);
        const [ctaOpen, setCtaOpen] = useState(false);
        const joystickRef = useRef({ x: 0, y: 0 });

        useEffect(() => {
                const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
                setReducedMotion(mq.matches);
                const onChange = (e) => setReducedMotion(e.matches);
                mq.addEventListener?.('change', onChange);
                const onResize = () => setIsMobile(window.innerWidth < 768);
                onResize();
                window.addEventListener('resize', onResize);
                return () => {
                        mq.removeEventListener?.('change', onChange);
                        window.removeEventListener('resize', onResize);
                };
        }, []);

        const realPlotsById = useMemo(() => {
                const map = new Map();
                buildAllPlotsReal(plotsData).forEach((p) => map.set(p.id, p));
                return map;
        }, []);

        const handleSelectPlot3D = useCallback(
                (plot3D) => {
                        setSelectedPlot(realPlotsById.get(plot3D.id) ?? plot3D);
                },
                [realPlotsById],
        );

        const jump = useCallback((key) => {
                setMode('orbit');
                setViewpointKey(key);
                setFlightNonce((n) => n + 1);
        }, []);

        const handleFlyFromAmenity = useCallback(() => {
                if (selectedAmenity?.viewpoint) jump(selectedAmenity.viewpoint);
                setSelectedAmenity(null);
        }, [selectedAmenity, jump]);

        return (
                <div data-testid="exp3d-root" className="fixed inset-0 z-[70] overflow-hidden bg-ink">
                        <Canvas
                                shadows={!isMobile}
                                dpr={isMobile ? [1, 1.5] : [1, 2]}
                                frameloop="demand"
                                camera={{ fov: 50, near: 0.4, far: 650 }}
                                gl={{ antialias: true, powerPreference: 'high-performance' }}
                                data-testid="exp3d-canvas"
                        >
                                <Suspense fallback={null}>
                                        <SceneContent
                                                site3d={site3d}
                                                plotsData={plotsData}
                                                mode={mode}
                                                viewpointKey={viewpointKey}
                                                flightNonce={flightNonce}
                                                reducedMotion={reducedMotion}
                                                hoveredId={hoveredId}
                                                selectedId={selectedPlot?.id ?? null}
                                                onHoverPlot={setHoveredId}
                                                onSelectPlot={handleSelectPlot3D}
                                                onSelectAmenity={setSelectedAmenity}
                                                joystickRef={joystickRef}
                                        />
                                </Suspense>
                        </Canvas>

                        <TopBar3D mode={mode} onSetMode={setMode} onEnquire={() => setCtaOpen(true)} />
                        <ViewpointRail viewpoints={site3d.camera.viewpoints} active={viewpointKey} onJump={jump} />
                        {mode === 'walk' && isMobile && <Joystick joystickRef={joystickRef} />}

                        <div
                                data-testid="exp3d-hint"
                                className="pointer-events-none fixed left-1/2 top-20 z-[80] -translate-x-1/2 whitespace-nowrap border border-[rgba(201,162,75,0.25)] bg-ink/55 px-4 py-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-ivory-dim backdrop-blur-md md:top-24"
                        >
                                {mode === 'orbit'
                                        ? 'Drag to orbit · Scroll or pinch to zoom'
                                        : isMobile
                                                ? 'Drag to look · Joystick to walk'
                                                : 'WASD to walk · Drag to look'}
                        </div>

                        <AnimatePresence>
                                {selectedPlot && <PlotPanel3D plot={selectedPlot} onClose={() => setSelectedPlot(null)} />}
                        </AnimatePresence>
                        <AnimatePresence>
                                {selectedAmenity && (
                                        <AmenityPanel3D
                                                amenity={selectedAmenity}
                                                onClose={() => setSelectedAmenity(null)}
                                                onFly={handleFlyFromAmenity}
                                        />
                                )}
                        </AnimatePresence>

                        <CTACard open={ctaOpen} collapsed={false} onExpand={() => {}} onDismiss={() => setCtaOpen(false)} />
                </div>
        );
}
