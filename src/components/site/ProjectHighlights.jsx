'use client';

import { motion } from 'framer-motion';
import {
        Trees, ToyBrick, Tent, Armchair, Landmark, FileCheck, Sofa, Droplet,
        Accessibility, PartyPopper, DoorOpen, Lightbulb, Compass, Hammer, Waves,
        Droplets, Hash, ShieldCheck, Container, Sprout, Route, Zap, LandPlot, Cctv,
} from 'lucide-react';
import { PROJECT_HIGHLIGHTS } from '@/lib/siteData';

const ICONS = {
        Trees, ToyBrick, Tent, Armchair, Landmark, FileCheck, Sofa, Droplet,
        Accessibility, PartyPopper, DoorOpen, Lightbulb, Compass, Hammer, Waves,
        Droplets, Hash, ShieldCheck, Container, Sprout, Route, Zap, LandPlot, Cctv,
};

/**
 * Section 3, the interactive highlights grid: 24 feature cards, 6 across on
 * desktop / 3 on tablet / 2 on mobile. Cards lift and glow on hover, with the
 * explanation revealed on hover (desktop) or always shown (mobile). Cards
 * stagger in on scroll; reduced motion falls back to a plain reveal.
 */
export default function ProjectHighlights() {
        return (
                <div
                        data-testid="theview-highlights-grid"
                        className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6"
                >
                        {PROJECT_HIGHLIGHTS.map((h, i) => {
                                const Icon = ICONS[h.icon] || Landmark;
                                return (
                                        <motion.div
                                                key={h.name}
                                                initial={{ opacity: 0, y: 24 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: '-40px' }}
                                                transition={{ duration: 0.6, delay: (i % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                                                data-testid={`theview-highlight-${i}`}
                                                className="group relative flex flex-col items-center overflow-hidden border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-4 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-gold md:p-5"
                                        >
                                                {/* soft gold glow behind the icon on hover */}
                                                <span className="pointer-events-none absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rounded-full bg-gold/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                                                <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(201,162,75,0.35)] text-gold transition-colors duration-500 group-hover:border-gold">
                                                        <Icon size={20} strokeWidth={1.4} />
                                                </span>
                                                <h3 className="relative mt-4 font-display text-[0.72rem] uppercase leading-tight tracking-[0.12em] text-ivory">
                                                        {h.name}
                                                </h3>
                                                {/* explanation: always visible on mobile, reveals on hover on desktop */}
                                                <p className="relative mt-2 font-sans text-[0.72rem] font-light leading-snug text-ivory-dim md:mt-0 md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-500 md:group-hover:mt-2 md:group-hover:max-h-24 md:group-hover:opacity-100">
                                                        {h.desc}
                                                </p>
                                        </motion.div>
                                );
                        })}
                </div>
        );
}
