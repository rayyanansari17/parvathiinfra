'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SITE } from '@/lib/siteData';

// Elegant glass CTA card, auto-appears after Node 9 and can be collapsed
// into a small chip (used pinned on Node 10 / Master Plan).
export default function CTACard({ open, collapsed, onDismiss, onExpand }) {
        return (
                <AnimatePresence>
                        {open && collapsed && (
                                <motion.button
                                        key="chip"
                                        type="button"
                                        onClick={onExpand}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 16 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        data-testid="tour-cta-chip"
                                        className="pointer-events-auto fixed bottom-24 left-6 z-[87] flex items-center gap-2 border border-gold bg-ink/80 px-4 py-2.5 text-[0.6rem] uppercase tracking-[0.24em] text-gold backdrop-blur-md transition-colors hover:bg-gold hover:text-ink md:bottom-28"
                                >
                                        Own before the city arrives
                                </motion.button>
                        )}
                        {open && !collapsed && (
                                <motion.div
                                        key="card"
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 24 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        data-testid="tour-cta-card"
                                        className="pointer-events-auto fixed bottom-24 left-1/2 z-[87] w-[min(92vw,480px)] -translate-x-1/2 border border-[rgba(201,162,75,0.4)] bg-[rgba(18,18,18,0.88)] p-6 backdrop-blur-xl md:bottom-28 md:p-7"
                                >
                                        <button
                                                type="button"
                                                onClick={onDismiss}
                                                data-testid="tour-cta-dismiss"
                                                className="absolute right-4 top-4 text-ivory-dim hover:text-ivory"
                                                aria-label="Dismiss"
                                        >
                                                <X size={16} />
                                        </button>
                                        <div className="micro-label mb-2">The Next Step</div>
                                        <h3 className="font-display text-xl tracking-[0.08em] text-ivory md:text-2xl">
                                                Own <span className="gold-foil-text">before the city arrives.</span>
                                        </h3>
                                        <div className="mt-5 flex flex-wrap items-center gap-3">
                                                <a
                                                        href="/contact"
                                                        data-testid="tour-cta-book"
                                                        className="border border-[rgba(201,162,75,0.5)] bg-gold-foil px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-ink"
                                                >
                                                        Book a Site Visit
                                                </a>
                                                <a
                                                        href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
                                                                "Hi, I'm interested in The View villa plots.",
                                                        )}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        data-testid="tour-cta-whatsapp"
                                                        className="border border-[rgba(201,162,75,0.5)] px-5 py-2.5 text-[0.62rem] uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-ink"
                                                >
                                                        WhatsApp
                                                </a>
                                        </div>
                                </motion.div>
                        )}
                </AnimatePresence>
        );
}
