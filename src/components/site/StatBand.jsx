'use client';

import { useRef, useState } from 'react';
import { useCountUp, useInViewOnce } from '@/hooks/useCountUp';

// Project-at-a-glance figures. `target` drives the count-up; `display` is used
// verbatim for non-numeric values (ranges, symbols).
const STATS = [
        { target: 41, label: 'Premium Villa Plots' },
        { target: 3.62, decimals: 2, label: 'Acres' },
        { display: '166–398', label: 'Sq. Yd Plot Sizes' },
        { target: 30, suffix: ' ft', label: 'Wide Internal CC Roads' },
        { display: '10%+', label: 'Open Space' },
        { target: 2220, comma: true, label: 'Sq.Ft Clubhouse' },
];

const BADGES = ['HMDA Approved', 'FCDA (HMDA) Approved', 'TG-RERA', '100% Vastu', 'Clear Title'];

function StatCell({ stat, started }) {
        const v = useCountUp(stat.target ?? 0, { start: started, duration: 1400 });
        let shown = stat.display;
        if (shown == null) {
                let n = stat.decimals ? v.toFixed(stat.decimals) : String(Math.round(v));
                if (stat.comma) n = Math.round(v).toLocaleString('en-IN');
                shown = `${n}${stat.suffix || ''}`;
        }
        return (
                <div className="bg-obsidian px-6 py-12 text-center md:px-8 md:py-16">
                        <div className="font-display text-3xl tracking-[0.06em] md:text-5xl">
                                <span className="gold-foil-text">{shown}</span>
                        </div>
                        <div className="mt-4 micro-label">{stat.label}</div>
                </div>
        );
}

export default function StatBand() {
        const ref = useRef(null);
        const [started, setStarted] = useState(false);
        useInViewOnce(ref, () => setStarted(true), { threshold: 0.25 });

        return (
                <div ref={ref} data-testid="theview-statband">
                        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-[rgba(201,162,75,0.12)] md:grid-cols-3 lg:grid-cols-6">
                                {STATS.map((s) => (
                                        <StatCell key={s.label} stat={s} started={started} />
                                ))}
                        </div>
                        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-3 bg-obsidian px-6 py-8">
                                {BADGES.map((b) => (
                                        <span
                                                key={b}
                                                className="border border-[rgba(201,162,75,0.4)] px-4 py-2 text-[0.6rem] uppercase tracking-[0.28em] text-ivory-dim"
                                        >
                                                {b}
                                        </span>
                                ))}
                        </div>
                </div>
        );
}
