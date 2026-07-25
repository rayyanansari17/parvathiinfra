'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Small frosted-glass detail panel for info hotspots on a tour node.
export default function InfoPanel({ hotspot, onClose }) {
        return (
                <AnimatePresence>
                        {hotspot && (
                                <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        data-testid="tour-info-panel"
                                        className="pointer-events-auto fixed bottom-28 left-1/2 z-[88] w-[min(88vw,360px)] -translate-x-1/2 border border-[rgba(201,162,75,0.35)] bg-[rgba(18,18,18,0.85)] p-5 backdrop-blur-xl md:bottom-32"
                                >
                                        <button
                                                type="button"
                                                onClick={onClose}
                                                data-testid="tour-info-panel-close"
                                                className="absolute right-3 top-3 text-ivory-dim hover:text-ivory"
                                                aria-label="Close"
                                        >
                                                <X size={15} />
                                        </button>
                                        <div className="micro-label mb-2 pr-6 text-gold">{hotspot.title}</div>
                                        <p className="font-serif-elegant text-base italic leading-snug text-ivory">
                                                {hotspot.body}
                                        </p>
                                </motion.div>
                        )}
                </AnimatePresence>
        );
}
