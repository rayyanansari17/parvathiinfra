import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal, SectionIndex } from '@/components/site/Reveal';
import LeadForm from '@/components/site/LeadForm';
import { openBrochureModal } from '@/components/site/SiteLayout';
import {
        HERO_VIDEO,
        STATS,
        APPROVALS,
        SITE,
        STOCK,
        MASTER_PLAN_IMAGE,
        SCALE_MODEL_IMAGE,
} from '@/lib/siteData';
import { HOME_PAGE, BROCHURE } from '@/constants/testIds';

export default function Home() {
        return (
                <div data-testid={HOME_PAGE.root} className="bg-ink">
                        {/* ------------------------------ HERO ------------------------------ */}
                        <section className="relative h-[100svh] w-full overflow-hidden">
                                <video
                                        data-testid={HOME_PAGE.heroVideo}
                                        src={HERO_VIDEO}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        poster={STOCK.heroFallback}
                                        className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink/95" />
                                <div className="absolute inset-0 grain-overlay" />

                                <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-24 md:px-12 lg:px-24">
                                        <motion.div
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 2.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                                <div className="micro-label mb-4">A Parvathi Infra Presentation</div>
                                                <h1
                                                        data-testid={HOME_PAGE.heroTitle}
                                                        className="max-w-4xl font-display text-4xl leading-[1.05] tracking-[0.06em] text-ivory sm:text-6xl md:text-7xl lg:text-[6.5rem]"
                                                >
                                                        A Scenic Address
                                                        <br />
                                                        for a <span className="gold-foil-text italic font-serif-elegant">Selective</span> Few
                                                </h1>
                                                <p className="mt-8 max-w-xl font-serif-elegant text-xl italic text-ivory-dim md:text-2xl">
                                                        45 exclusive villa plots. 3.6 acres. One view that reshapes
                                                        how you see home.
                                                </p>
                                                <div className="mt-10 flex flex-wrap items-center gap-4">
                                                        <Link
                                                                to="/the-view"
                                                                className="group inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.32em] text-ink transition-transform hover:-translate-y-0.5"
                                                        >
                                                                Enter The View
                                                                <span className="h-px w-6 bg-ink transition-all group-hover:w-10" />
                                                        </Link>
                                                        <button
                                                                type="button"
                                                                onClick={openBrochureModal}
                                                                data-testid={BROCHURE.openButton}
                                                                className="gold-underline text-[0.7rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                        >
                                                                Download Brochure
                                                        </button>
                                                </div>
                                        </motion.div>
                                </div>

                                <div
                                        data-testid={HOME_PAGE.heroScrollHint}
                                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
                                >
                                        <div className="text-[0.6rem] uppercase tracking-[0.4em] text-ivory-dim">
                                                Scroll
                                        </div>
                                        <div className="mx-auto mt-3 h-10 w-px bg-gradient-to-b from-gold to-transparent" />
                                </div>
                        </section>

                        {/* ------------------------------ MARQUEE ------------------------------ */}
                        <div className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian-2 py-6 overflow-hidden">
                                <div className="marquee-track">
                                        {[...Array(2)].map((_, dup) => (
                                                <div key={dup} className="flex items-center gap-16 pr-16">
                                                        {APPROVALS.concat(['Vastu Compliant', 'Gated Villa Plots', 'HMDA Layout']).map(
                                                                (a, i) => (
                                                                        <span
                                                                                key={`${dup}-${i}`}
                                                                                className="whitespace-nowrap font-display text-lg tracking-[0.32em] text-ivory-dim"
                                                                        >
                                                                                {a} <span className="mx-6 text-gold">◆</span>
                                                                        </span>
                                                                ),
                                                        )}
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* ------------------------------ PULL QUOTE ------------------------------ */}
                        <section className="mx-auto max-w-[1200px] px-6 py-32 md:px-12 md:py-40">
                                <Reveal>
                                        <SectionIndex n={1} label="Prologue" />
                                        <p className="font-serif-elegant text-3xl italic leading-[1.35] text-ivory md:text-5xl">
                                                “Some homes are addresses. A rare few are{' '}
                                                <span className="gold-foil-text not-italic font-display tracking-[0.06em]">
                                                        landmarks
                                                </span>
                                                . THE VIEW is the latter — where the horizon meets the hearth,
                                                and every plot is drawn like a sonnet.”
                                        </p>
                                        <div className="mt-8 flex items-center gap-4">
                                                <div className="h-px w-16 bg-gold" />
                                                <span className="micro-label">The Parvathi Studio</span>
                                        </div>
                                </Reveal>
                        </section>

                        {/* ------------------------------ STATS ------------------------------ */}
                        <section
                                data-testid={HOME_PAGE.statsBand}
                                className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian"
                        >
                                <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-[rgba(201,162,75,0.1)] md:grid-cols-4">
                                        {STATS.map((s, i) => (
                                                <div
                                                        key={i}
                                                        className="bg-obsidian px-6 py-14 text-center md:px-10 md:py-20"
                                                >
                                                        <div className="font-display text-4xl tracking-[0.06em] text-ivory md:text-6xl">
                                                                <span className="gold-foil-text">{s.value}</span>
                                                        </div>
                                                        <div className="mt-3 text-sm text-ivory-dim">{s.suffix}</div>
                                                        <div className="mt-4 micro-label">{s.label}</div>
                                                </div>
                                        ))}
                                </div>
                        </section>

                        {/* ------------------------------ FLAGSHIP TEASER ------------------------------ */}
                        <section className="relative overflow-hidden bg-ink py-32 md:py-40">
                                <div className="mx-auto grid max-w-[1440px] items-center gap-20 px-6 md:grid-cols-2 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={2} label="Flagship Venture" />
                                                <h2 className="font-display text-4xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                        THE <span className="gold-foil-text">VIEW</span>
                                                </h2>
                                                <p className="mt-6 font-serif-elegant text-2xl italic leading-relaxed text-ivory-dim">
                                                        Kadthal’s most quietly celebrated address — a gated 3.6 acre
                                                        canvas of 45 villa plots overlooking the ridgeline, moments
                                                        from the Srisailam Highway and the emerging Fourth City.
                                                </p>
                                                <ul className="mt-8 space-y-3 text-sm text-ivory-dim">
                                                        {[
                                                                '2,220 sq.ft. clubhouse & signature swimming pool',
                                                                '100% Vastu-compliant, HMDA & TG RERA approved',
                                                                'RGI Airport · 45 min. Fab City · 35 min. 4th City · 25 min',
                                                        ].map((b) => (
                                                                <li key={b} className="flex items-start gap-3">
                                                                        <span className="mt-2 h-px w-6 bg-gold" />
                                                                        <span>{b}</span>
                                                                </li>
                                                        ))}
                                                </ul>
                                                <div className="mt-10">
                                                        <Link
                                                                to="/the-view"
                                                                className="group inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.32em] text-ivory hover:border-gold hover:text-gold"
                                                        >
                                                                Discover The View
                                                                <span className="h-px w-6 bg-gold transition-all group-hover:w-10" />
                                                        </Link>
                                                </div>
                                        </Reveal>

                                        <Reveal delay={0.15}>
                                                <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.25)]">
                                                        <img
                                                                src={SCALE_MODEL_IMAGE}
                                                                alt="THE VIEW scale model"
                                                                className="h-full w-full object-cover transition-transform duration-[1.6s] hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                                                        <div className="absolute bottom-6 left-6 right-6">
                                                                <div className="micro-label mb-2">Scale Model · Kadthal</div>
                                                                <div className="font-display text-xl tracking-[0.16em] text-ivory">
                                                                        45 PLOTS · 3.6 ACRES
                                                                </div>
                                                        </div>
                                                </div>
                                        </Reveal>
                                </div>
                        </section>

                        {/* ------------------------------ PROJECTS ------------------------------ */}
                        <section
                                data-testid={HOME_PAGE.projectsGrid}
                                className="border-t border-[rgba(201,162,75,0.15)] bg-obsidian py-32 md:py-40"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <div className="flex items-end justify-between gap-6">
                                                        <div>
                                                                <SectionIndex n={3} label="Portfolio" />
                                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                                        Selected <span className="gold-foil-text">Works</span>
                                                                </h2>
                                                        </div>
                                                        <Link
                                                                to="/projects"
                                                                className="gold-underline hidden text-[0.72rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory md:inline-block"
                                                        >
                                                                All Projects →
                                                        </Link>
                                                </div>
                                        </Reveal>

                                        <div className="mt-16 grid gap-8 md:grid-cols-3">
                                                {[
                                                        {
                                                                title: 'THE VIEW',
                                                                sub: 'Kadthal · Villa Plots',
                                                                img: MASTER_PLAN_IMAGE,
                                                                to: '/the-view',
                                                        },
                                                        {
                                                                title: 'STUDIO ARCHIVE',
                                                                sub: 'Selected Land Portfolio',
                                                                img: STOCK.hills,
                                                                to: '/projects',
                                                        },
                                                        {
                                                                title: 'UPCOMING',
                                                                sub: 'Estate · By Invitation',
                                                                img: STOCK.architecture,
                                                                to: '/projects',
                                                        },
                                                ].map((p, i) => (
                                                        <Reveal key={p.title} delay={i * 0.1}>
                                                                <Link to={p.to} className="group block">
                                                                        <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.2)]">
                                                                                <img
                                                                                        src={p.img}
                                                                                        alt={p.title}
                                                                                        className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
                                                                                />
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                                                                                <div className="absolute bottom-6 left-6 right-6">
                                                                                        <div className="micro-label mb-2">{p.sub}</div>
                                                                                        <div className="font-display text-2xl tracking-[0.14em] text-ivory">
                                                                                                {p.title}
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </Link>
                                                        </Reveal>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* ------------------------------ CONTACT CTA ------------------------------ */}
                        <section className="relative overflow-hidden py-32 md:py-40">
                                <div className="absolute inset-0">
                                        <img
                                                src={STOCK.hills}
                                                alt=""
                                                className="h-full w-full object-cover opacity-30"
                                        />
                                        <div className="absolute inset-0 bg-ink/85" />
                                </div>
                                <div className="relative mx-auto max-w-[1000px] px-6 md:px-12">
                                        <Reveal>
                                                <SectionIndex n={4} label="Enquire" />
                                                <h2 className="font-display text-4xl leading-tight tracking-[0.1em] text-ivory md:text-6xl">
                                                        A private preview,
                                                        <br />
                                                        <span className="gold-foil-text">on your terms.</span>
                                                </h2>
                                                <p className="mt-6 max-w-2xl font-serif-elegant text-xl italic text-ivory-dim md:text-2xl">
                                                        Share your details. Our concierge will call within the hour to
                                                        arrange a chauffeured site visit to Kadthal.
                                                </p>
                                        </Reveal>
                                        <div className="mt-14">
                                                <LeadForm source="home_cta" />
                                        </div>
                                        <div className="mt-8 text-xs uppercase tracking-[0.3em] text-ivory-dim/70">
                                                Or write to us · {SITE.email}
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
