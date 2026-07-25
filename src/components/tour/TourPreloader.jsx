'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEEN_KEY = 'theview-tour-seen';

/**
 * Full-screen preloader for the tour. Tracks real preload progress of the
 * first node's image; skips itself (after a brief flash) on repeat visits
 * within the same session.
 */
export default function TourPreloader({ firstImage, onDone }) {
        const [progress, setProgress] = useState(0);
        const [visible, setVisible] = useState(true);
        const [skip, setSkip] = useState(false);

        useEffect(() => {
                let seen = false;
                try {
                        seen = sessionStorage.getItem(SEEN_KEY) === '1';
                } catch {
                        // sessionStorage unavailable, treat as unseen
                }
                if (seen) setSkip(true);
        }, []);

        useEffect(() => {
                let cancelled = false;
                const start = Date.now();
                const minDuration = skip ? 200 : 2500;

                const img = new Image();
                img.onload = tick;
                img.onerror = tick;
                img.src = firstImage;

                function tick() {
                        if (cancelled) return;
                        setProgress(100);
                }

                const raf = () => {
                        if (cancelled) return;
                        const elapsed = Date.now() - start;
                        const t = Math.min(1, elapsed / minDuration);
                        setProgress((p) => Math.max(p, Math.round(t * (skip ? 100 : 92))));
                        if (t < 1) requestAnimationFrame(raf);
                };
                requestAnimationFrame(raf);

                const done = setTimeout(() => {
                        if (cancelled) return;
                        setProgress(100);
                        try {
                                sessionStorage.setItem(SEEN_KEY, '1');
                        } catch {
                                // ignore
                        }
                        setTimeout(() => {
                                if (!cancelled) setVisible(false);
                        }, 350);
                }, minDuration);

                return () => {
                        cancelled = true;
                        clearTimeout(done);
                };
        }, [firstImage, skip]);

        useEffect(() => {
                if (!visible) onDone?.();
        }, [visible, onDone]);

        return (
                <AnimatePresence>
                        {visible && (
                                <motion.div
                                        data-testid="tour-preloader"
                                        initial={{ y: 0 }}
                                        exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                                        className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-ink"
                                >
                                        <div className="absolute inset-0 grain-overlay" />
                                        <svg width="480" height="110" viewBox="0 0 480 110" className="max-w-[80vw]" fill="none">
                                                <defs>
                                                        <linearGradient id="tourGoldStroke" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="#BF953F" />
                                                                <stop offset="30%" stopColor="#FCF6BA" />
                                                                <stop offset="60%" stopColor="#B38728" />
                                                                <stop offset="100%" stopColor="#AA771C" />
                                                        </linearGradient>
                                                </defs>
                                                <motion.text
                                                        x="50%"
                                                        y="60%"
                                                        textAnchor="middle"
                                                        fontFamily="Cinzel, serif"
                                                        fontSize="46"
                                                        letterSpacing="10"
                                                        fill="transparent"
                                                        stroke="url(#tourGoldStroke)"
                                                        strokeWidth="1.2"
                                                        initial={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
                                                        animate={{ strokeDashoffset: 0 }}
                                                        transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                        THE VIEW
                                                </motion.text>
                                        </svg>
                                        <motion.p
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5, duration: 0.8 }}
 className="mt-4 font-sans font-light text-base text-ivory-dim"
                                        >
                                                A Scenic Address for a Selective Few
                                        </motion.p>
                                        <div className="mt-10 h-px w-64 overflow-hidden bg-white/10">
                                                <div
                                                        data-testid="tour-preloader-progress"
                                                        style={{ width: `${progress}%` }}
                                                        className="h-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] transition-[width] duration-150"
                                                />
                                        </div>
                                </motion.div>
                        )}
                </AnimatePresence>
        );
}
