'use client';

import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

// Same panel idiom as MasterPlan's AmenityPanel, driven by the amenity
// marker's real photoreal render + tour copy from AMENITY_DEFS.
export default function AmenityPanel3D({ amenity, onClose, onFly }) {
        return (
                <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="exp3d-amenity-panel"
                        className="pointer-events-auto fixed inset-y-0 right-0 z-[92] flex w-full max-w-sm flex-col border-l border-[rgba(201,162,75,0.4)] bg-obsidian shadow-2xl"
                >
                        <div className="flex items-start justify-between border-b border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <div>
                                        <div className="micro-label">Amenity {amenity.code}</div>
                                        <div className="mt-2 font-display text-xl tracking-[0.08em] text-ivory">
                                                <span className="gold-foil-text">{amenity.name}</span>
                                        </div>
                                </div>
                                <button type="button" onClick={onClose} data-testid="exp3d-amenity-panel-close" className="text-ivory-dim hover:text-ivory">
                                        <X size={20} />
                                </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                                <div className="mb-6 aspect-video overflow-hidden border border-[rgba(201,162,75,0.25)] bg-obsidian-2">
                                        <img src={amenity.image} alt={amenity.name} className="h-full w-full object-cover" />
                                </div>
 <p className="font-sans font-light text-base leading-relaxed text-ivory">{amenity.body}</p>
                        </div>
                        {amenity.viewpoint && (
                                <div className="border-t border-[rgba(201,162,75,0.2)] px-6 py-5">
                                        <button
                                                type="button"
                                                onClick={onFly}
                                                data-testid="exp3d-amenity-fly"
                                                className="flex w-full items-center justify-center gap-2 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-6 py-3 text-[0.68rem] uppercase tracking-[0.28em] text-ink"
                                        >
                                                Fly to this spot <ArrowRight size={14} />
                                        </button>
                                </div>
                        )}
                </motion.aside>
        );
}
