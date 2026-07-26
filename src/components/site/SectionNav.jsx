'use client';

import { useEffect, useState } from 'react';

const LINKS = [
        { id: 'overview', label: 'Overview' },
        { id: 'highlights', label: 'Highlights' },
        { id: 'masterplan', label: 'Master Plan' },
        { id: 'clubhouse', label: 'Clubhouse' },
        { id: 'amenities', label: 'Amenities' },
        { id: 'location', label: 'Location' },
        { id: 'enquire', label: 'Enquire' },
];

/**
 * Sticky in-page nav for THE VIEW. Sits below the main site nav, smooth-scrolls
 * to each section and highlights the one currently in view. Horizontally
 * scrollable on small screens.
 */
export default function SectionNav() {
        const [active, setActive] = useState('overview');

        useEffect(() => {
                const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
                if (!sections.length) return undefined;
                const io = new IntersectionObserver(
                        (entries) => {
                                entries.forEach((e) => {
                                        if (e.isIntersecting) setActive(e.target.id);
                                });
                        },
                        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
                );
                sections.forEach((s) => io.observe(s));
                return () => io.disconnect();
        }, []);

        const go = (id) => {
                const el = document.getElementById(id);
                if (!el) return;
                const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        };

        return (
                <div
                        data-testid="theview-section-nav"
                        className="sticky top-[68px] z-[55] border-y border-[rgba(201,162,75,0.18)] bg-ink/85 backdrop-blur-md md:top-[76px]"
                >
                        <nav className="no-scrollbar mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 md:justify-center md:px-12">
                                {LINKS.map((l) => (
                                        <button
                                                key={l.id}
                                                type="button"
                                                onClick={() => go(l.id)}
                                                data-testid={`theview-nav-${l.id}`}
                                                className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3.5 text-[0.6rem] uppercase tracking-[0.24em] transition-colors ${
                                                        active === l.id
                                                                ? 'border-gold text-gold'
                                                                : 'border-transparent text-ivory-dim hover:text-ivory'
                                                }`}
                                        >
                                                {l.label}
                                        </button>
                                ))}
                        </nav>
                </div>
        );
}
