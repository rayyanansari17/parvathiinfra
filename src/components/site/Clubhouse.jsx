'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expand, X, Check } from 'lucide-react';

const TABS = [
        {
                key: 'ground',
                label: 'Ground Floor',
                img: '/assets/tour/clubhouse-ground.jpg',
                features: ['Hall', 'Bedroom', 'Powder Room', '8 ft Wide Deck'],
        },
        {
                key: 'deck',
                label: 'Deck Area',
                img: '/assets/tour/clubhouse-deck.jpg',
                features: [
                        'Swimming Pool', "Kid's Pool", 'Cabana Seating', 'Lobby', 'Bar',
                        'Changing Rooms', 'Toilets', 'Bedroom', 'Semi-Open Kitchen',
                        'Seating with Pergola', 'Barbeque', 'Shower',
                ],
        },
];

export default function Clubhouse() {
        const [tab, setTab] = useState('ground');
        const [zoom, setZoom] = useState(false);
        const active = TABS.find((t) => t.key === tab) || TABS[0];

        return (
                <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                        {/* Tabbed plan viewer */}
                        <div className="min-w-0">
                                <div className="flex gap-2">
                                        {TABS.map((t) => (
                                                <button
                                                        key={t.key}
                                                        type="button"
                                                        onClick={() => setTab(t.key)}
                                                        data-testid={`clubhouse-tab-${t.key}`}
                                                        className={`border px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.24em] transition-colors ${
                                                                tab === t.key
                                                                        ? 'border-gold bg-gold text-ink'
                                                                        : 'border-[rgba(201,162,75,0.3)] text-ivory-dim hover:border-gold hover:text-ivory'
                                                        }`}
                                                >
                                                        {t.label}
                                                </button>
                                        ))}
                                </div>

                                <div className="relative mt-4 overflow-hidden border border-[rgba(201,162,75,0.25)] bg-[#e9e9e9]">
                                        <AnimatePresence mode="wait">
                                                <motion.img
                                                        key={active.key}
                                                        src={active.img}
                                                        alt={`Clubhouse ${active.label} plan`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="block max-h-[520px] w-full object-contain"
                                                />
                                        </AnimatePresence>
                                        <button
                                                type="button"
                                                onClick={() => setZoom(true)}
                                                data-testid="clubhouse-expand"
                                                aria-label="Expand plan"
                                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-[rgba(201,162,75,0.5)] bg-ink/70 text-gold backdrop-blur-md transition-colors hover:bg-gold hover:text-ink"
                                        >
                                                <Expand size={15} />
                                        </button>
                                </div>
                        </div>

                        {/* Render + feature list */}
                        <div className="min-w-0">
                                <div className="aspect-[4/3] overflow-hidden border border-[rgba(201,162,75,0.25)]">
                                        <img
                                                src="/assets/tour/06-clubhouse.jpg"
                                                alt="Clubhouse render"
                                                className="h-full w-full object-cover"
                                        />
                                </div>
                                <div className="mt-6 micro-label text-gold">{active.label} · Provisions</div>
                                <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                                        {active.features.map((f) => (
                                                <li key={f} className="flex items-center gap-2.5 text-sm text-ivory">
                                                        <Check size={13} className="shrink-0 text-gold" strokeWidth={2} />
                                                        <span className="font-sans font-light">{f}</span>
                                                </li>
                                        ))}
                                </ul>
                                <p className="mt-8 font-sans text-base font-light leading-relaxed text-ivory-dim">
                                        A 2,220 sq.ft clubhouse designed as the social heart of the community,
                                        where the pool deck, the bar and the shaded seating all open toward the
                                        view.
                                </p>
                        </div>

                        {/* Fullscreen plan overlay */}
                        <AnimatePresence>
                                {zoom && (
                                        <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                data-testid="clubhouse-zoom"
                                                className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/95 p-4"
                                                onClick={() => setZoom(false)}
                                        >
                                                <button
                                                        type="button"
                                                        onClick={() => setZoom(false)}
                                                        aria-label="Close"
                                                        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-[rgba(201,162,75,0.5)] text-gold hover:bg-gold hover:text-ink"
                                                >
                                                        <X size={18} />
                                                </button>
                                                <img
                                                        src={active.img}
                                                        alt={`Clubhouse ${active.label} plan, enlarged`}
                                                        className="max-h-[90vh] max-w-[95vw] object-contain"
                                                        onClick={(e) => e.stopPropagation()}
                                                />
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </div>
        );
}
