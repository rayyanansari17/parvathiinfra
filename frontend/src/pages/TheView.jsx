import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { Reveal, SectionIndex } from '@/components/site/Reveal';
import LeadForm from '@/components/site/LeadForm';
import { openBrochureModal } from '@/components/site/SiteLayout';
import {
        HERO_VIDEO,
        MASTER_PLAN_IMAGE,
        AMENITIES,
        INFRASTRUCTURE,
        CONNECTIVITY,
        STATS,
        FAQS,
        STOCK,
        SITE,
} from '@/lib/siteData';
import { THE_VIEW_PAGE, BROCHURE } from '@/constants/testIds';
import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
} from '@/components/ui/accordion';

// Simple plot polygons over the master plan (approximate placement).
// data-testid on each is derived from plot number for testing.
const PLOTS = Array.from({ length: 45 }, (_, i) => {
        const idx = i;
        const col = idx % 9;
        const row = Math.floor(idx / 9);
        const w = 8;
        const h = 12;
        const x = 8 + col * 9;
        const y = 15 + row * 14;
        const size = 200 + ((idx * 17) % 190); // pseudo-random 200-388
        const status = idx % 5 === 0 ? 'sold' : 'available';
        return { number: idx + 1, x, y, w, h, size, status };
});

function MasterPlanInteractive() {
        const [filter, setFilter] = useState('all');
        const [hover, setHover] = useState(null);
        const visible = PLOTS.filter((p) => filter === 'all' || p.status === filter);

        return (
                <div
                        data-testid={THE_VIEW_PAGE.masterPlan}
                        className="relative w-full overflow-hidden border border-[rgba(201,162,75,0.25)] bg-obsidian"
                >
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(201,162,75,0.2)] bg-ink px-6 py-4">
                                <div className="micro-label">Master Layout · 45 Plots · 3.6 Acres</div>
                                <div className="flex gap-2">
                                        {[
                                                { k: 'all', label: 'All' },
                                                { k: 'available', label: 'Available' },
                                                { k: 'sold', label: 'Sold' },
                                        ].map((b) => (
                                                <button
                                                        key={b.k}
                                                        type="button"
                                                        data-testid={`masterplan-filter-${b.k}`}
                                                        onClick={() => setFilter(b.k)}
                                                        className={`border px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.28em] transition-colors ${
                                                                filter === b.k
                                                                        ? 'border-gold bg-gold text-ink'
                                                                        : 'border-[rgba(201,162,75,0.3)] text-ivory-dim hover:border-gold hover:text-ivory'
                                                        }`}
                                                >
                                                        {b.label}
                                                </button>
                                        ))}
                                </div>
                        </div>

                        <div className="relative">
                                <img
                                        src={MASTER_PLAN_IMAGE}
                                        alt="THE VIEW master plan"
                                        className="w-full opacity-90"
                                />
                                <svg
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        className="absolute inset-0 h-full w-full"
                                >
                                        {visible.map((p) => (
                                                <g
                                                        key={p.number}
                                                        onMouseEnter={() => setHover(p)}
                                                        onMouseLeave={() => setHover(null)}
                                                        style={{ cursor: 'pointer' }}
                                                >
                                                        <rect
                                                                data-testid={`plot-${p.number}`}
                                                                x={p.x}
                                                                y={p.y}
                                                                width={p.w}
                                                                height={p.h}
                                                                fill={
                                                                        p.status === 'sold'
                                                                                ? 'rgba(120,0,0,0.35)'
                                                                                : 'rgba(201,162,75,0.18)'
                                                                }
                                                                stroke={
                                                                        p.status === 'sold' ? '#8A1F1F' : '#C9A24B'
                                                                }
                                                                strokeWidth="0.15"
                                                                style={{ transition: 'fill 0.4s ease' }}
                                                                onMouseEnter={(e) =>
                                                                        e.currentTarget.setAttribute(
                                                                                'fill',
                                                                                p.status === 'sold'
                                                                                        ? 'rgba(120,0,0,0.6)'
                                                                                        : 'rgba(232,201,120,0.55)',
                                                                        )
                                                                }
                                                                onMouseLeave={(e) =>
                                                                        e.currentTarget.setAttribute(
                                                                                'fill',
                                                                                p.status === 'sold'
                                                                                        ? 'rgba(120,0,0,0.35)'
                                                                                        : 'rgba(201,162,75,0.18)',
                                                                        )
                                                                }
                                                        />
                                                </g>
                                        ))}
                                </svg>

                                {hover && (
                                        <div
                                                className="pointer-events-none absolute top-4 right-4 border border-[rgba(201,162,75,0.5)] bg-ink/90 px-4 py-3 text-xs backdrop-blur-md"
                                                style={{ minWidth: 200 }}
                                        >
                                                <div className="micro-label mb-1">Plot {hover.number}</div>
                                                <div className="text-ivory">{hover.size} sq. yards</div>
                                                <div className="mt-1 text-[0.65rem] uppercase tracking-[0.28em]">
                                                        <span className={hover.status === 'sold' ? 'text-red-400' : 'text-gold'}>
                                                                {hover.status === 'sold' ? 'Reserved' : 'Available'}
                                                        </span>
                                                </div>
                                        </div>
                                )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 border-t border-[rgba(201,162,75,0.2)] bg-ink px-6 py-4 text-[0.65rem] uppercase tracking-[0.28em]">
                                <span className="flex items-center gap-2 text-ivory-dim">
                                        <span className="h-3 w-3 border border-gold bg-gold/20" /> Available
                                </span>
                                <span className="flex items-center gap-2 text-ivory-dim">
                                        <span className="h-3 w-3 border border-red-500 bg-red-900/40" /> Reserved
                                </span>
                                <span className="text-ivory-dim">Hover a plot for details · Indicative</span>
                        </div>
                </div>
        );
}

export default function TheView() {
        const heroRef = useRef(null);
        const { scrollYProgress } = useScroll({
                target: heroRef,
                offset: ['start start', 'end start'],
        });
        const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
        const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

        // Auto-play + mute enforced
        useEffect(() => {
                const v = document.querySelector(`[data-testid="${THE_VIEW_PAGE.heroVideo}"]`);
                if (v && v.play) v.play().catch(() => {});
        }, []);

        return (
                <div data-testid={THE_VIEW_PAGE.root} className="bg-ink">
                        {/* HERO video pin */}
                        <section ref={heroRef} className="relative h-[110svh] w-full overflow-hidden" style={{ position: 'relative' }}>
                                <motion.video
                                        data-testid={THE_VIEW_PAGE.heroVideo}
                                        src={HERO_VIDEO}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster={STOCK.heroFallback}
                                        style={{ scale: heroScale, opacity: heroOpacity }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink" />
                                <div className="absolute inset-0 grain-overlay" />

                                <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 md:px-12 lg:px-24">
                                        <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 2.6, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                                <div className="micro-label mb-4">Flagship · Kadthal</div>
                                                <h1 className="max-w-5xl font-display text-5xl leading-[1.02] tracking-[0.08em] text-ivory sm:text-7xl md:text-8xl lg:text-[8.5rem]">
                                                        THE <span className="gold-foil-text">VIEW</span>
                                                </h1>
                                                <p className="mt-6 max-w-2xl font-serif-elegant text-xl italic text-ivory-dim md:text-3xl">
                                                        45 villa plots. 3.6 acres of ridgeline stillness. Approvals in
                                                        order. Vastu, honoured.
                                                </p>
                                                <div className="mt-10 flex flex-wrap items-center gap-4">
                                                        <button
                                                                type="button"
                                                                onClick={openBrochureModal}
                                                                data-testid={BROCHURE.openButton + '-view'}
                                                                className="group inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.32em] text-ink transition-transform hover:-translate-y-0.5"
                                                        >
                                                                Download Brochure
                                                                <span className="h-px w-6 bg-ink transition-all group-hover:w-10" />
                                                        </button>
                                                        <a
                                                                href={SITE.whatsappLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="gold-underline text-[0.7rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                        >
                                                                Chat on WhatsApp
                                                        </a>
                                                </div>
                                        </motion.div>
                                </div>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory-dim">
                                        <ChevronDown className="animate-bounce" size={22} />
                                </div>
                        </section>

                        {/* Overture stats */}
                        <section className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian">
                                <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-[rgba(201,162,75,0.1)] md:grid-cols-4">
                                        {STATS.map((s, i) => (
                                                <div
                                                        key={i}
                                                        className="bg-obsidian px-6 py-14 text-center md:px-10 md:py-20"
                                                >
                                                        <div className="font-display text-3xl tracking-[0.06em] md:text-5xl">
                                                                <span className="gold-foil-text">{s.value}</span>
                                                        </div>
                                                        <div className="mt-2 text-sm text-ivory-dim">{s.suffix}</div>
                                                        <div className="mt-4 micro-label">{s.label}</div>
                                                </div>
                                        ))}
                                </div>
                        </section>

                        {/* Editorial / Manifesto */}
                        <section className="mx-auto max-w-[1200px] px-6 py-32 md:px-12 md:py-40">
                                <Reveal>
                                        <SectionIndex n={1} label="Manifesto" />
                                        <p className="font-serif-elegant text-3xl italic leading-[1.35] text-ivory md:text-5xl">
                                                “There are places you buy. And places you{' '}
                                                <span className="gold-foil-text not-italic font-display tracking-[0.06em]">
                                                        belong to.
                                                </span>
                                                ” THE VIEW is drawn for the latter — a scenic address for people
                                                who measure luxury in stillness, not square footage.
                                        </p>
                                </Reveal>
                        </section>

                        {/* Master plan */}
                        <section className="border-t border-[rgba(201,162,75,0.15)] bg-obsidian py-32 md:py-40">
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={2} label="Master Plan" />
                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                        Choose <span className="gold-foil-text">your ridge.</span>
                                                </h2>
                                                <p className="mt-4 max-w-2xl font-serif-elegant text-lg italic text-ivory-dim">
                                                        Hover any plot for size, orientation and availability. All plots
                                                        are 100% Vastu compliant.
                                                </p>
                                        </Reveal>

                                        <Reveal delay={0.1}>
                                                <div className="mt-14">
                                                        <MasterPlanInteractive />
                                                </div>
                                        </Reveal>
                                </div>
                        </section>

                        {/* Amenities */}
                        <section
                                data-testid={THE_VIEW_PAGE.amenities}
                                className="bg-ink py-32 md:py-40"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={3} label="Amenities" />
                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                        A <span className="gold-foil-text">private</span> promenade.
                                                </h2>
                                        </Reveal>

                                        <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-4">
                                                {AMENITIES.map((a, i) => (
                                                        <Reveal key={a.title} delay={(i % 4) * 0.06}>
                                                                <div className="group h-full border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-8 transition-colors hover:border-gold">
                                                                        <div className="font-display text-[0.75rem] tracking-[0.32em] text-gold">
                                                                                0{(i + 1).toString().padStart(2, '0')}
                                                                        </div>
                                                                        <div className="mt-6 font-display text-xl tracking-[0.14em] text-ivory">
                                                                                {a.title}
                                                                        </div>
                                                                        <p className="mt-4 font-serif-elegant text-base italic leading-relaxed text-ivory-dim">
                                                                                {a.copy}
                                                                        </p>
                                                                </div>
                                                        </Reveal>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* Infrastructure */}
                        <section className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian py-32 md:py-40">
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={4} label="Infrastructure" />
                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                        Built to <span className="gold-foil-text">outlast trends.</span>
                                                </h2>
                                        </Reveal>

                                        <div className="mt-14 grid gap-px bg-[rgba(201,162,75,0.15)] sm:grid-cols-2 md:grid-cols-4">
                                                {INFRASTRUCTURE.map((it, i) => (
                                                        <div
                                                                key={it}
                                                                className="bg-obsidian px-6 py-10 text-center"
                                                        >
                                                                <div className="font-display text-[0.7rem] tracking-[0.32em] text-gold">
                                                                        {String(i + 1).padStart(2, '0')}
                                                                </div>
                                                                <div className="mt-4 font-serif-elegant text-lg text-ivory">
                                                                        {it}
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* Connectivity */}
                        <section
                                data-testid={THE_VIEW_PAGE.connectivity}
                                className="bg-ink py-32 md:py-40"
                        >
                                <div className="mx-auto grid max-w-[1440px] gap-16 px-6 md:grid-cols-2 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={5} label="Location & Connectivity" />
                                                <h2 className="font-display text-3xl leading-tight tracking-[0.12em] text-ivory md:text-5xl">
                                                        Kadthal —
                                                        <br />
                                                        <span className="gold-foil-text">the coordinates matter.</span>
                                                </h2>
                                                <p className="mt-6 max-w-md font-serif-elegant text-lg italic text-ivory-dim">
                                                        On the Srisailam Highway, minutes from the Regional Ring Road
                                                        and moments from the emerging Fourth City.
                                                </p>

                                                <div className="mt-10 aspect-video overflow-hidden border border-[rgba(201,162,75,0.25)]">
                                                        <iframe
                                                                data-testid="theview-map-embed"
                                                                title="THE VIEW Location Map"
                                                                src="https://www.google.com/maps?q=Kadthal,+Telangana&output=embed"
                                                                className="h-full w-full grayscale"
                                                                loading="lazy"
                                                        />
                                                </div>
                                        </Reveal>

                                        <Reveal delay={0.1}>
                                                <div className="grid gap-0 border border-[rgba(201,162,75,0.2)] bg-obsidian-2">
                                                        {CONNECTIVITY.map((c, i) => (
                                                                <div
                                                                        key={c.place}
                                                                        className={`flex items-center justify-between px-8 py-6 ${
                                                                                i !== 0 ? 'border-t border-[rgba(201,162,75,0.15)]' : ''
                                                                        }`}
                                                                >
                                                                        <div className="flex items-center gap-4">
                                                                                <MapPin size={16} className="text-gold" />
                                                                                <span className="font-serif-elegant text-lg text-ivory">
                                                                                        {c.place}
                                                                                </span>
                                                                        </div>
                                                                        <div className="font-display text-xl tracking-[0.14em] text-ivory">
                                                                                <span className="gold-foil-text">{c.time}</span>{' '}
                                                                                <span className="text-xs text-ivory-dim">{c.unit}</span>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                </div>
                                        </Reveal>
                                </div>
                        </section>

                        {/* Gallery / editorial */}
                        <section
                                data-testid={THE_VIEW_PAGE.gallery}
                                className="border-t border-[rgba(201,162,75,0.15)] bg-obsidian py-32 md:py-40"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={6} label="Editorial" />
                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                        The <span className="gold-foil-text">frame</span> beyond the frame.
                                                </h2>
                                        </Reveal>
                                        <div className="mt-16 grid gap-6 md:grid-cols-6">
                                                <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.2)] md:col-span-4">
                                                        <img src={STOCK.pool} alt="Signature pool" className="h-full w-full object-cover transition-transform duration-[1.6s] hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                                                        <div className="absolute bottom-5 left-5 micro-label">Artist Impression · Signature Pool</div>
                                                </div>
                                                <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.2)] md:col-span-2">
                                                        <img src={STOCK.clubhouse} alt="Clubhouse" className="h-full w-full object-cover transition-transform duration-[1.6s] hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                                                        <div className="absolute bottom-5 left-5 micro-label">Artist Impression · Clubhouse</div>
                                                </div>
                                                <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.2)] md:col-span-2">
                                                        <img src={STOCK.bar} alt="Lounge" className="h-full w-full object-cover transition-transform duration-[1.6s] hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                                                        <div className="absolute bottom-5 left-5 micro-label">Artist Impression · Private Lounge</div>
                                                </div>
                                                <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.2)] md:col-span-4">
                                                        <img src={STOCK.hills} alt="Ridgeline view" className="h-full w-full object-cover transition-transform duration-[1.6s] hover:scale-110" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                                                        <div className="absolute bottom-5 left-5 micro-label">Site · Ridgeline View</div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        {/* FAQ */}
                        <section
                                data-testid={THE_VIEW_PAGE.faq}
                                className="bg-ink py-32 md:py-40"
                        >
                                <div className="mx-auto max-w-[1000px] px-6 md:px-12">
                                        <Reveal>
                                                <SectionIndex n={7} label="Frequently Asked" />
                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                        The <span className="gold-foil-text">fine print</span>, made warm.
                                                </h2>
                                        </Reveal>
                                        <div className="mt-14">
                                                <Accordion type="single" collapsible className="w-full">
                                                        {FAQS.map((f, i) => (
                                                                <AccordionItem
                                                                        key={f.q}
                                                                        value={`item-${i}`}
                                                                        className="border-b border-[rgba(201,162,75,0.2)]"
                                                                >
                                                                        <AccordionTrigger
                                                                                data-testid={`faq-trigger-${i}`}
                                                                                className="font-display text-left text-base tracking-[0.14em] text-ivory hover:text-gold md:text-lg"
                                                                        >
                                                                                {f.q}
                                                                        </AccordionTrigger>
                                                                        <AccordionContent
                                                                                data-testid={`faq-content-${i}`}
                                                                                className="font-serif-elegant text-lg italic text-ivory-dim"
                                                                        >
                                                                                {f.a}
                                                                        </AccordionContent>
                                                                </AccordionItem>
                                                        ))}
                                                </Accordion>
                                        </div>
                                </div>
                        </section>

                        {/* Contact CTA */}
                        <section className="border-t border-[rgba(201,162,75,0.15)] bg-obsidian py-32 md:py-40">
                                <div className="mx-auto max-w-[1000px] px-6 md:px-12">
                                        <Reveal>
                                                <SectionIndex n={8} label="Book a Private Preview" />
                                                <h2 className="font-display text-3xl leading-tight tracking-[0.12em] text-ivory md:text-5xl">
                                                        Walk the <span className="gold-foil-text">ridge</span> with us.
                                                </h2>
                                                <p className="mt-4 max-w-xl font-serif-elegant text-xl italic text-ivory-dim">
                                                        Chauffeured site visits by appointment.
                                                </p>
                                        </Reveal>
                                        <div className="mt-14">
                                                <LeadForm source="theview_cta" />
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
