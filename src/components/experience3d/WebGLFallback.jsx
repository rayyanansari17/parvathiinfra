'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

// Rendered instead of the 3D scene when the browser/device has no usable
// WebGL context. Never a blank canvas or a crash, just a clear, on-brand
// dead end back to the 2D walkthrough.
export default function WebGLFallback() {
        return (
                <div
                        data-testid="exp3d-webgl-fallback"
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-6 text-center"
                >
                        <AlertTriangle className="mb-6 text-gold" size={32} />
                        <div className="micro-label mb-3">The View · 3D Experience</div>
                        <h1 className="max-w-lg font-display text-2xl tracking-[0.06em] text-ivory">
                                This device can’t run the 3D model
                        </h1>
                        <p className="mt-4 max-w-md font-serif-elegant text-lg italic text-ivory-dim">
                                Your browser does not support WebGL, so the interactive 3D site model cannot run
                                here. The full walkthrough is still available.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                                <Link
                                        href="/the-view/walkthrough"
                                        data-testid="exp3d-fallback-walkthrough"
                                        className="border border-[rgba(201,162,75,0.5)] bg-gold-foil px-6 py-3 text-[0.65rem] uppercase tracking-[0.28em] text-ink"
                                >
                                        Take the 2D Walkthrough
                                </Link>
                                <Link
                                        href="/the-view"
                                        data-testid="exp3d-fallback-exit"
                                        className="border border-[rgba(201,162,75,0.4)] px-6 py-3 text-[0.65rem] uppercase tracking-[0.28em] text-ivory-dim hover:border-gold hover:text-ivory"
                                >
                                        Back to The View
                                </Link>
                        </div>
                </div>
        );
}
