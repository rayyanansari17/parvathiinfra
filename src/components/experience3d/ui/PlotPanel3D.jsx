'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SITE } from '@/lib/siteData';

// Same dark frosted glass + gold hairline panel used in the scroll tour's
// MasterPlan, reused verbatim in the 3D experience so the two feel like
// one product. `plot` is always the REAL plots.json record (sqyd/sqft/
// level null when unverified), never the interpolated 3D copy.
function nearestAmenities(id) {
        if (id >= 33 && id <= 41) return ['H · Amphitheatre', 'D · Clubhouse', 'E · Pool & Amphitheatre Entry'];
        if (id >= 24 && id <= 32) return ['B · 30ft Roads', 'F · Sitting Area', 'I · View Point'];
        return ['A · Grand Entrance', "C · Children's Play Area"];
}

export default function PlotPanel3D({ plot, onClose }) {
        const nearby = nearestAmenities(plot.id);
        return (
                <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="exp3d-plot-panel"
                        className="pointer-events-auto fixed inset-y-0 right-0 z-[92] flex w-full max-w-sm flex-col border-l border-[rgba(201,162,75,0.4)] bg-obsidian shadow-2xl"
                >
                        <div className="flex items-start justify-between border-b border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <div>
                                        <div className="micro-label">Plot Detail</div>
                                        <div className="mt-2 font-display text-3xl tracking-[0.08em] text-ivory">
                                                <span className="gold-foil-text">{String(plot.id).padStart(2, '0')}</span>
                                        </div>
                                </div>
                                <button type="button" onClick={onClose} data-testid="exp3d-plot-panel-close" className="text-ivory-dim hover:text-ivory">
                                        <X size={20} />
                                </button>
                        </div>
                        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                                <div className="grid grid-cols-2 gap-3">
                                        <Cell label="Sq. Yards">{plot.sqyd ? plot.sqyd : 'Size on request'}</Cell>
                                        <Cell label="Sq. Feet">{plot.sqft ? plot.sqft : 'Size on request'}</Cell>
                                        {plot.level != null && <Cell label="Level">{plot.level} m</Cell>}
                                        <Cell label="Status"><span className="text-gold">Available · Enquire</span></Cell>
                                </div>
                                <div>
                                        <div className="micro-label mb-3">Nearest Amenities</div>
                                        <ul className="space-y-2 text-sm text-ivory">
                                                {nearby.map((n) => (
                                                        <li key={n} className="flex items-center gap-3">
                                                                <span className="h-px w-6 bg-gold" /> {n}
                                                        </li>
                                                ))}
                                        </ul>
                                </div>
                        </div>
                        <div className="border-t border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <a
                                        href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
                                                `Hi, I'm interested in Plot ${plot.id} at The View.`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-testid="exp3d-plot-panel-enquire"
                                        className="block w-full border border-[rgba(201,162,75,0.5)] bg-gold-foil px-6 py-3 text-center text-[0.68rem] uppercase tracking-[0.28em] text-ink"
                                >
                                        Enquire about Plot {plot.id}
                                </a>
                        </div>
                </motion.aside>
        );
}

function Cell({ label, children }) {
        return (
                <div className="border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-3">
                        <div className="micro-label mb-1.5">{label}</div>
                        <div className="font-display text-base tracking-[0.05em] text-ivory">{children}</div>
                </div>
        );
}
