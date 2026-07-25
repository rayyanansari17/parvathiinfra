'use client';

import { useProgress } from '@react-three/drei';

// Shown while the 3D bundle (three / fiber / drei / our scene code) is
// still downloading and while any THREE loader work is in flight. The
// scene itself is procedural (no textures/models to fetch), so
// `progress` mostly reflects the JS chunk arriving, not asset loading,
// but useProgress is still the right primitive per the spec and degrades
// gracefully to a plain shimmer if nothing is ever tracked.
export default function LoadingScreen3D() {
        const { progress } = useProgress();
        return (
                <div
                        data-testid="exp3d-loading"
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
                >
                        <div className="micro-label mb-4 animate-pulse">The View · Loading The Model</div>
                        <div className="relative h-px w-56 overflow-hidden bg-[rgba(201,162,75,0.2)]">
                                <div
                                        className="absolute inset-y-0 left-0 bg-gold-foil transition-[width] duration-300 ease-out"
                                        style={{ width: `${Math.max(8, progress)}%` }}
                                />
                        </div>
                        <div className="mt-3 font-display text-xs tracking-[0.3em] text-gold">
                                {Math.round(progress)}%
                        </div>
                </div>
        );
}
