'use client';

import { motion } from 'framer-motion';

// Thin gold progress line across the very top of the tour viewport. Driven
// by continuous overall scroll progress (0..1, track + master plan) when
// `progress` is given; falls back to a discrete index/total step (used by
// the reduced-motion fallback, which has no scroll progress to scrub).
export default function ProgressLine({ progress, index, total }) {
        const continuous = typeof progress === 'number';
        const pct = continuous ? progress * 100 : total > 1 ? (index / (total - 1)) * 100 : 0;
        return (
                <div
                        data-testid="tour-progress-line"
                        className="pointer-events-none fixed inset-x-0 top-0 z-[86] h-[2px] bg-white/10"
                >
                        <motion.div
                                animate={{ width: `${pct}%` }}
                                transition={
                                        continuous
                                                ? { duration: 0.12, ease: 'linear' }
                                                : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
                                }
                                className="h-full bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C]"
                        />
                </div>
        );
}
