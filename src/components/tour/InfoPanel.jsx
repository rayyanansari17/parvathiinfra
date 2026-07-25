'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Small frosted-glass detail panel for a tour node's notes. In `auto` mode it
// appears on its own while the tour plays (top-centre, non-interactive, no
// close control); otherwise it is a dismissible panel near the caption.
export default function InfoPanel({ hotspot, onClose, auto = false }) {
        return (
                <AnimatePresence mode="wait">
                        {hotspot && (
                                <motion.div
                                        key={auto ? `${hotspot.title}-${hotspot.body}` : 'info'}
                                        initial={{ opacity: 0, y: auto ? -12 : 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: auto ? -8 : 10 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        data-testid="tour-info-panel"
                                        className={
                                                auto
                                                        ? 'pointer-events-none fixed inset-x-0 top-20 z-[88] mx-auto w-[min(88vw,360px)] border border-[rgba(201,162,75,0.35)] bg-[rgba(18,18,18,0.82)] p-5 text-center backdrop-blur-xl md:top-24'
                                                        : 'pointer-events-auto fixed inset-x-0 bottom-28 z-[88] mx-auto w-[min(88vw,360px)] border border-[rgba(201,162,75,0.35)] bg-[rgba(18,18,18,0.85)] p-5 backdrop-blur-xl md:bottom-32'
                                        }
                                >
                                        {!auto && (
                                                <button
                                                        type="button"
                                                        onClick={onClose}
                                                        data-testid="tour-info-panel-close"
                                                        className="absolute right-3 top-3 text-ivory-dim hover:text-ivory"
                                                        aria-label="Close"
                                                >
                                                        <X size={15} />
                                                </button>
                                        )}
                                        <div className={`micro-label mb-2 text-gold ${auto ? '' : 'pr-6'}`}>{hotspot.title}</div>
 <p className="font-sans font-light text-base leading-snug text-ivory">
                                                {hotspot.body}
                                        </p>
                                </motion.div>
                        )}
                </AnimatePresence>
        );
}
