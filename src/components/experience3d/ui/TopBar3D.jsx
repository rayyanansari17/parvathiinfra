'use client';

import Link from 'next/link';
import { X, Move3d, Footprints } from 'lucide-react';

// Top bar for the 3D experience: exit, wordmark, camera-mode toggle and
// enquire, matching the scroll tour's TopBar language exactly (same
// hairline/backdrop-blur treatment, same logo).
export default function TopBar3D({ mode, onSetMode, onEnquire }) {
        return (
                <div
                        data-testid="exp3d-topbar"
                        className="pointer-events-none fixed inset-x-0 top-0 z-[85] flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6"
                >
                        <Link
                                href="/the-view"
                                data-testid="exp3d-exit"
                                className="pointer-events-auto group flex items-center gap-3 border border-[rgba(201,162,75,0.35)] bg-ink/60 px-3 py-2 backdrop-blur-md transition-colors hover:border-gold md:px-4"
                        >
                                <X size={14} className="text-ivory-dim transition-colors group-hover:text-gold" />
                                <span className="hidden text-[0.62rem] uppercase tracking-[0.3em] text-ivory-dim transition-colors group-hover:text-ivory sm:inline">
                                        Exit
                                </span>
                        </Link>

                        <Link
                                href="/the-view"
                                data-testid="exp3d-wordmark"
                                className="pointer-events-auto absolute left-1/2 top-4 -translate-x-1/2 md:top-6"
                                aria-label="THE VIEW"
                        >
                                <img
                                        src="/assets/tour/logo-theview.jpg"
                                        alt="THE VIEW · A Scenic Address for a Selective Few"
                                        className="h-7 w-auto object-contain mix-blend-screen md:h-9"
                                />
                        </Link>

                        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
                                <div className="flex overflow-hidden border border-[rgba(201,162,75,0.35)] bg-ink/60 backdrop-blur-md">
                                        <button
                                                type="button"
                                                onClick={() => onSetMode('orbit')}
                                                data-testid="exp3d-mode-orbit"
                                                aria-pressed={mode === 'orbit'}
                                                className={`flex h-9 min-w-[44px] items-center justify-center gap-1.5 px-3 text-[0.6rem] uppercase tracking-[0.2em] transition-colors ${
                                                        mode === 'orbit' ? 'bg-gold text-ink' : 'text-ivory-dim hover:text-ivory'
                                                }`}
                                        >
                                                <Move3d size={13} />
                                                <span className="hidden sm:inline">Orbit</span>
                                        </button>
                                        <button
                                                type="button"
                                                onClick={() => onSetMode('walk')}
                                                data-testid="exp3d-mode-walk"
                                                aria-pressed={mode === 'walk'}
                                                className={`flex h-9 min-w-[44px] items-center justify-center gap-1.5 px-3 text-[0.6rem] uppercase tracking-[0.2em] transition-colors ${
                                                        mode === 'walk' ? 'bg-gold text-ink' : 'text-ivory-dim hover:text-ivory'
                                                }`}
                                        >
                                                <Footprints size={13} />
                                                <span className="hidden sm:inline">Walk</span>
                                        </button>
                                </div>
                                <button
                                        type="button"
                                        onClick={onEnquire}
                                        data-testid="exp3d-enquire"
                                        className="hidden border border-gold px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.3em] text-gold backdrop-blur-md transition-colors hover:bg-gold hover:text-ink sm:inline-block"
                                >
                                        Enquire
                                </button>
                        </div>
                </div>
        );
}
