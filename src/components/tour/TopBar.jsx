'use client';

import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

// Fixed top bar for the tour: exit + wordmark + play/audio controls + enquire CTA.
export default function TopBar({ autoplay, onToggleAutoplay, muted, onToggleMuted, onEnquire, reducedMotion }) {
        return (
                <div
                        data-testid="tour-topbar"
                        className="pointer-events-none fixed inset-x-0 top-0 z-[85] flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6"
                >
                        <Link
                                href="/the-view"
                                data-testid="tour-exit"
                                className="pointer-events-auto group flex items-center gap-3 border border-[rgba(201,162,75,0.35)] bg-ink/60 px-3 py-2 backdrop-blur-md transition-colors hover:border-gold md:px-4"
                        >
                                <X size={14} className="text-ivory-dim transition-colors group-hover:text-gold" />
                                <span className="hidden text-[0.62rem] uppercase tracking-[0.3em] text-ivory-dim transition-colors group-hover:text-ivory sm:inline">
                                        Exit Tour
                                </span>
                        </Link>

                        <Link
                                href="/the-view"
                                data-testid="tour-wordmark"
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
                                {!reducedMotion && (
                                        <button
                                                type="button"
                                                onClick={onToggleAutoplay}
                                                data-testid="tour-autoplay-toggle"
                                                aria-label={autoplay ? 'Pause tour' : 'Play tour'}
                                                className="flex h-9 w-9 items-center justify-center border border-[rgba(201,162,75,0.35)] bg-ink/60 text-ivory-dim backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
                                        >
                                                {autoplay ? <Pause size={13} /> : <Play size={13} />}
                                        </button>
                                )}
                                <button
                                        type="button"
                                        onClick={onToggleMuted}
                                        data-testid="tour-audio-toggle"
                                        aria-label={muted ? 'Unmute ambient audio' : 'Mute ambient audio'}
                                        className="flex h-9 w-9 items-center justify-center border border-[rgba(201,162,75,0.35)] bg-ink/60 text-ivory-dim backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
                                >
                                        {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                </button>
                                <button
                                        type="button"
                                        onClick={onEnquire}
                                        data-testid="tour-enquire"
                                        className="hidden border border-gold px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.3em] text-gold backdrop-blur-md transition-colors hover:bg-gold hover:text-ink sm:inline-block"
                                >
                                        Enquire
                                </button>
                        </div>
                </div>
        );
}
