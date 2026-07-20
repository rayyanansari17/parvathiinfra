import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRELOADER } from '@/constants/testIds';

// Cinematic SVG stroke-draw preloader for the Parvathi Infra brand.
export default function Preloader() {
        const [visible, setVisible] = useState(true);
        const [progress, setProgress] = useState(0);

        useEffect(() => {
                const start = Date.now();
                const duration = 2400;
                const interval = setInterval(() => {
                        const p = Math.min(100, ((Date.now() - start) / duration) * 100);
                        setProgress(p);
                        if (p >= 100) clearInterval(interval);
                }, 40);
                const timeout = setTimeout(() => setVisible(false), duration + 400);
                return () => {
                        clearInterval(interval);
                        clearTimeout(timeout);
                };
        }, []);

        return (
                <AnimatePresence>
                        {visible && (
                                <motion.div
                                        data-testid={PRELOADER.root}
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
                                        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-ink"
                                >
                                        <div className="absolute inset-0 grain-overlay" />
                                        <svg
                                                width="640"
                                                height="140"
                                                viewBox="0 0 640 140"
                                                className="max-w-[88vw]"
                                                fill="none"
                                        >
                                                <defs>
                                                        <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="#BF953F" />
                                                                <stop offset="30%" stopColor="#FCF6BA" />
                                                                <stop offset="60%" stopColor="#B38728" />
                                                                <stop offset="100%" stopColor="#AA771C" />
                                                        </linearGradient>
                                                </defs>
                                                <motion.text
                                                        x="50%"
                                                        y="62%"
                                                        textAnchor="middle"
                                                        fontFamily="Cinzel, serif"
                                                        fontSize="58"
                                                        letterSpacing="10"
                                                        fill="transparent"
                                                        stroke="url(#goldStroke)"
                                                        strokeWidth="1.2"
                                                        initial={{ strokeDasharray: 1600, strokeDashoffset: 1600 }}
                                                        animate={{ strokeDashoffset: 0 }}
                                                        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                        PARVATHI INFRA
                                                </motion.text>
                                        </svg>
                                        <motion.p
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6, duration: 0.8 }}
                                                className="mt-6 text-[0.7rem] tracking-[0.4em] text-ivory-dim uppercase"
                                        >
                                                Creating Landmarks · Building Trust
                                        </motion.p>
                                        <div className="mt-10 h-px w-64 overflow-hidden bg-white/10">
                                                <div
                                                        data-testid={PRELOADER.progress}
                                                        style={{ width: `${progress}%` }}
                                                        className="h-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] transition-[width] duration-100"
                                                />
                                        </div>
                                </motion.div>
                        )}
                </AnimatePresence>
        );
}
