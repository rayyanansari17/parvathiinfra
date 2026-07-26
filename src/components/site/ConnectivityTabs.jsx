'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Milestone, Building2, Sparkles, GraduationCap, Landmark, MapPin } from 'lucide-react';
import { CONNECTIVITY_GROUPS } from '@/lib/siteData';
import { useCountUp } from '@/hooks/useCountUp';

const ICONS = { Milestone, Building2, Sparkles, GraduationCap, Landmark };

function CountTime({ minutes }) {
        const v = useCountUp(minutes, { duration: 1000 });
        return (
                <span className="font-display text-lg tracking-[0.12em] text-gold md:text-xl">
                        {String(Math.round(v)).padStart(2, '0')}
                        <span className="ml-1 text-[0.6rem] uppercase tracking-[0.2em] text-ivory-dim">min</span>
                </span>
        );
}

/**
 * Section 7, Location & Connectivity. Sticky dark map on the left; categorised
 * connectivity on the right as swipeable tabs. Switching a tab re-mounts the
 * rows so the travel times count up each time. Reduced motion is handled inside
 * useCountUp (values jump straight to target).
 */
export default function ConnectivityTabs() {
        const [active, setActive] = useState(CONNECTIVITY_GROUPS[0].key);
        const group = CONNECTIVITY_GROUPS.find((g) => g.key === active) || CONNECTIVITY_GROUPS[0];

        return (
                <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
                        {/* Map, sticky on desktop */}
                        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
                                <div className="aspect-[4/3] overflow-hidden border border-[rgba(201,162,75,0.25)] lg:aspect-[4/5]">
                                        <iframe
                                                data-testid="theview-connectivity-map"
                                                title="THE VIEW Location Map"
                                                src="https://www.google.com/maps?q=Kadthal,+Telangana&output=embed"
                                                className="h-full w-full grayscale contrast-125"
                                                loading="lazy"
                                        />
                                </div>
                                <a
                                        href="https://www.google.com/maps/search/?api=1&query=Kadthal,+Telangana"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.28em] text-gold gold-underline"
                                >
                                        <MapPin size={13} /> View on Google Maps
                                </a>
                        </div>

                        {/* Categorised tabs */}
                        <div className="min-w-0">
                                <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-[rgba(201,162,75,0.15)] pb-3">
                                        {CONNECTIVITY_GROUPS.map((g) => {
                                                const Icon = ICONS[g.icon] || Milestone;
                                                const on = g.key === active;
                                                return (
                                                        <button
                                                                key={g.key}
                                                                type="button"
                                                                onClick={() => setActive(g.key)}
                                                                data-testid={`theview-connectivity-tab-${g.key}`}
                                                                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border px-4 py-2 text-[0.58rem] uppercase tracking-[0.18em] transition-colors ${
                                                                        on
                                                                                ? 'border-gold bg-gold text-ink'
                                                                                : 'border-[rgba(201,162,75,0.3)] bg-ink/40 text-ivory-dim hover:border-gold hover:text-ivory'
                                                                }`}
                                                        >
                                                                <Icon size={13} strokeWidth={1.6} />
                                                                {g.label}
                                                        </button>
                                                );
                                        })}
                                </div>

                                <AnimatePresence mode="wait">
                                        <motion.ul
                                                key={group.key}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                className="mt-2 divide-y divide-[rgba(201,162,75,0.12)]"
                                        >
                                                {group.rows.map((r) => (
                                                        <li
                                                                key={r.place}
                                                                className="flex items-center justify-between gap-4 py-5"
                                                        >
                                                                <div className="flex items-center gap-3">
                                                                        <span className="h-px w-5 bg-gold" />
                                                                        <span className="font-sans text-base font-light text-ivory">{r.place}</span>
                                                                </div>
                                                                <CountTime minutes={r.time} />
                                                        </li>
                                                ))}
                                        </motion.ul>
                                </AnimatePresence>

                                <p className="mt-8 border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-6 font-sans text-sm font-light leading-relaxed text-ivory-dim">
                                        The View sits at the intersection of Hyderabad&apos;s most significant
                                        infrastructure story, the Regional Ring Road, the proposed Ratan Tata
                                        Greenfield corridor, and the Fourth City growth region. Employment hubs at
                                        Fab City, Amazon&apos;s data centre and Foxconn are within a comfortable
                                        drive, while the airport is under an hour away. This is a location the city
                                        is actively moving toward.
                                </p>
                        </div>
                </div>
        );
}
