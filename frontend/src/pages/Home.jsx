import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { Reveal, SectionIndex } from '@/components/site/Reveal';
import LeadForm from '@/components/site/LeadForm';
import {
        STATS,
        APPROVALS,
        PARVATHI_HIGHLIGHTS,
        PAST_PROJECTS,
        JOURNEY,
        SITE,
        STOCK,
        MASTER_PLAN_IMAGE,
        SCALE_MODEL_IMAGE,
} from '@/lib/siteData';
import { HOME_PAGE } from '@/constants/testIds';

export default function Home() {
        return (
                <div data-testid={HOME_PAGE.root} className="bg-ink">
                        {/* ============================ HERO ============================ */}
                        <section className="relative min-h-[100svh] w-full overflow-hidden">
                                {/* Layered background */}
                                <div
                                        className="absolute inset-0"
                                        style={{
                                                background:
                                                        'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,162,75,0.16) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 90%, rgba(232,201,120,0.10) 0%, transparent 55%), linear-gradient(180deg, #050505 0%, #0A0A0A 60%, #050505 100%)',
                                        }}
                                />
                                {/* Ridge silhouette */}
                                <svg
                                        viewBox="0 0 1440 400"
                                        preserveAspectRatio="none"
                                        className="absolute bottom-0 left-0 h-[42vh] w-full"
                                        aria-hidden
                                >
                                        <defs>
                                                <linearGradient id="ridge1" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#161513" stopOpacity="0" />
                                                        <stop offset="100%" stopColor="#161513" stopOpacity="0.85" />
                                                </linearGradient>
                                                <linearGradient id="ridge2" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0" />
                                                        <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
                                                </linearGradient>
                                        </defs>
                                        <path
                                                d="M0 320 L120 260 L260 300 L400 200 L560 250 L720 180 L900 240 L1080 170 L1260 220 L1440 190 L1440 400 L0 400 Z"
                                                fill="url(#ridge1)"
                                        />
                                        <path
                                                d="M0 360 L160 320 L320 340 L500 280 L680 310 L860 260 L1040 300 L1240 260 L1440 290 L1440 400 L0 400 Z"
                                                fill="url(#ridge2)"
                                        />
                                </svg>
                                <div className="absolute inset-0 grain-overlay" />

                                {/* Hair-line horizon */}
                                <div className="absolute left-0 right-0 top-[46%] mx-auto h-px w-[86%] max-w-[1200px] bg-gradient-to-r from-transparent via-[rgba(201,162,75,0.35)] to-transparent" />

                                <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-6 pb-24 pt-32 md:px-12 lg:px-24">
                                        <motion.div
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 2.8, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                                <div className="micro-label mb-6">Parvathi Infra Developers · Est. 2019</div>
                                                <h1
                                                        data-testid={HOME_PAGE.heroTitle}
                                                        className="max-w-5xl font-display text-4xl leading-[1.05] tracking-[0.06em] text-ivory sm:text-6xl md:text-7xl lg:text-[6.25rem]"
                                                >
                                                        Creating <span className="gold-foil-text italic font-serif-elegant">Landmarks.</span>
                                                        <br />
                                                        Building Trust.
                                                </h1>

                                                <p className="mt-8 max-w-2xl font-serif-elegant text-xl italic text-ivory-dim md:text-2xl">
                                                        Premium HMDA &amp; FCDA Approved developments with high-quality
                                                        infrastructure — legally transparent, strategically located, built to appreciate.
                                                </p>

                                                <div className="mt-10 flex flex-wrap items-center gap-5">
                                                        <Link
                                                                to="/projects"
                                                                data-testid="home-hero-portfolio-button"
                                                                className="group inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.32em] text-ink transition-transform hover:-translate-y-0.5"
                                                        >
                                                                Explore Our Portfolio
                                                                <span className="h-px w-6 bg-ink transition-all group-hover:w-10" />
                                                        </Link>
                                                        <Link
                                                                to="/the-view"
                                                                data-testid="home-hero-theview-button"
                                                                className="group inline-flex items-center gap-3 gold-underline text-[0.7rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                        >
                                                                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(201,162,75,0.5)] transition-colors group-hover:border-gold">
                                                                        <ArrowRight size={12} className="text-gold" />
                                                                </span>
                                                                Meet our Flagship · THE VIEW
                                                        </Link>
                                                </div>
                                        </motion.div>
                                </div>

                                <div
                                        data-testid={HOME_PAGE.heroScrollHint}
                                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
                                >
                                        <div className="text-[0.6rem] uppercase tracking-[0.4em] text-ivory-dim">Scroll</div>
                                        <div className="mx-auto mt-3 h-10 w-px bg-gradient-to-b from-gold to-transparent" />
                                </div>
                        </section>

                        {/* ============================ APPROVALS MARQUEE ============================ */}
                        <div
                                data-testid="approvals-marquee"
                                className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian-2 py-6 overflow-hidden"
                        >
                                <div className="marquee-track">
                                        {[...Array(2)].map((_, dup) => (
                                                <div key={dup} className="flex items-center gap-16 pr-16">
                                                        {APPROVALS.map((a, i) => (
                                                                <span
                                                                        key={`${dup}-${i}`}
                                                                        className="whitespace-nowrap font-display text-lg tracking-[0.32em] text-ivory-dim"
                                                                >
                                                                        {a} <span className="mx-6 text-gold">◆</span>
                                                                </span>
                                                        ))}
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* ============================ HIGHLIGHTS BAND ============================ */}
                        <section
                                data-testid="home-highlights"
                                className="border-b border-[rgba(201,162,75,0.15)] bg-ink py-20 md:py-24"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={1} label="Why Parvathi Infra" />
                                                <h2 className="max-w-3xl font-display text-3xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                        Eight years of quiet, deliberate <span className="gold-foil-text">landmark-making</span>.
                                                </h2>
                                                <p className="mt-6 max-w-2xl font-serif-elegant text-lg italic text-ivory-dim md:text-xl">
                                                        Founded in 2019 in Hyderabad under the leadership of {SITE.founder},
                                                        Parvathi Infra Developers delivers premium plotted developments that
                                                        combine legal transparency, superior infrastructure, strategic
                                                        locations and exceptional investment potential.
                                                </p>
                                        </Reveal>

                                        <div className="mt-14 grid grid-cols-2 gap-px bg-[rgba(201,162,75,0.12)] md:grid-cols-3 lg:grid-cols-6">
                                                {PARVATHI_HIGHLIGHTS.map((h, i) => (
                                                        <div
                                                                key={h.label}
                                                                data-testid={`home-highlight-${i}`}
                                                                className="bg-ink px-5 py-8 text-center md:px-6 md:py-10"
                                                        >
                                                                <div className="font-display text-2xl leading-none tracking-[0.04em] md:text-3xl">
                                                                        <span className="gold-foil-text">{h.k}</span>
                                                                </div>
                                                                <div className="mt-4 text-[0.65rem] uppercase tracking-[0.28em] text-ivory-dim">
                                                                        {h.label}
                                                                </div>
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* ============================ STATS ============================ */}
                        <section
                                data-testid={HOME_PAGE.statsBand}
                                className="border-b border-[rgba(201,162,75,0.15)] bg-obsidian"
                        >
                                <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-[rgba(201,162,75,0.1)] md:grid-cols-4">
                                        {STATS.map((s, i) => (
                                                <div
                                                        key={i}
                                                        className="bg-obsidian px-6 py-12 text-center md:px-10 md:py-16"
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

                        {/* ============================ JOURNEY TEASER ============================ */}
                        <section
                                data-testid="home-journey"
                                className="bg-ink py-24 md:py-28"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                                                        <div>
                                                                <SectionIndex n={2} label="Our Journey" />
                                                                <h2 className="font-display text-3xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                                        From a Hyderabad studio,
                                                                        <br />
                                                                        to a <span className="gold-foil-text">2 Lakh+ sq. yd</span> footprint.
                                                                </h2>
                                                        </div>
                                                        <Link
                                                                to="/about"
                                                                className="gold-underline text-[0.72rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                        >
                                                                Read the full story →
                                                        </Link>
                                                </div>
                                        </Reveal>

                                        <div className="mt-14 grid gap-8 md:grid-cols-3">
                                                {JOURNEY.map((j, i) => (
                                                        <Reveal key={j.year} delay={i * 0.08}>
                                                                <div className="group h-full border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-8 transition-colors hover:border-gold">
                                                                        <div className="font-display text-[0.75rem] tracking-[0.32em] text-gold">
                                                                                {j.year}
                                                                        </div>
                                                                        <div className="mt-4 font-display text-xl tracking-[0.14em] text-ivory md:text-2xl">
                                                                                {j.title}
                                                                        </div>
                                                                        <p className="mt-4 font-serif-elegant text-base italic leading-relaxed text-ivory-dim">
                                                                                {j.copy}
                                                                        </p>
                                                                </div>
                                                        </Reveal>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* ============================ FLAGSHIP TEASER ============================ */}
                        <section className="relative overflow-hidden border-y border-[rgba(201,162,75,0.15)] bg-obsidian py-24 md:py-28">
                                <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 md:grid-cols-2 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={3} label="Flagship Venture" />
                                                <h2 className="font-display text-4xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                        THE <span className="gold-foil-text">VIEW</span>
                                                        <br />
                                                        <span className="text-2xl md:text-3xl">at Kothur</span>
                                                </h2>
                                                <p className="mt-6 font-serif-elegant text-xl italic leading-relaxed text-ivory-dim md:text-2xl">
                                                        Tomorrow’s landmark, today. An HMDA &amp; FCDA approved premium
                                                        venture on NH-44 (Bengaluru Highway) — one of Telangana’s fastest-growing investment corridors.
                                                </p>
                                                <ul className="mt-8 space-y-3 text-sm text-ivory-dim">
                                                        {[
                                                                'HMDA & FCDA Approved · Clear legal title',
                                                                'Wide blacktop roads, underground services, avenue plantation',
                                                                '~30 min to RGI Airport · Direct NH-44 access · Near Fourth City corridor',
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
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                                                        <div className="absolute bottom-6 left-6 right-6">
                                                                <div className="micro-label mb-2">Kothur · NH-44</div>
                                                                <div className="font-display text-xl tracking-[0.16em] text-ivory">
                                                                        HMDA · FCDA · CLEAR TITLE
                                                                </div>
                                                        </div>
                                                </div>
                                        </Reveal>
                                </div>
                        </section>

                        {/* ============================ WALKTHROUGH TEASER ============================ */}
                        <section className="bg-obsidian-2">
                                <Link
                                        to="/the-view/walkthrough"
                                        data-testid="home-walkthrough-card"
                                        className="group relative block w-full overflow-hidden"
                                        aria-label="Take the cinematic walkthrough of THE VIEW"
                                >
                                        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:px-12 md:py-24 lg:px-24">
                                                <div className="text-left">
                                                        <div className="micro-label mb-4">Cinematic Walkthrough</div>
                                                        <h2 className="font-display text-3xl leading-tight tracking-[0.1em] text-ivory md:text-5xl">
                                                                Step through the{' '}
                                                                <span className="gold-foil-text italic font-serif-elegant">gates</span>,
                                                                without leaving your chair.
                                                        </h2>
                                                        <p className="mt-6 max-w-md font-serif-elegant text-lg italic text-ivory-dim">
                                                                A cinematic scroll-driven tour of THE VIEW — from the entrance
                                                                arch to the ridge, in seven curated scenes.
                                                        </p>
                                                        <div className="mt-8 inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.32em] text-ink">
                                                                <Play size={14} />
                                                                Take the Walkthrough
                                                                <span className="h-px w-6 bg-ink transition-all group-hover:w-12" />
                                                        </div>
                                                </div>
                                                <div className="relative aspect-[16/10] overflow-hidden border border-[rgba(201,162,75,0.25)] bg-ink">
                                                        <div
                                                                className="absolute inset-0"
                                                                style={{
                                                                        background:
                                                                                'radial-gradient(circle at 50% 55%, rgba(201,162,75,0.25) 0%, transparent 60%), linear-gradient(180deg,#0A0A0A,#050505)',
                                                                }}
                                                        />
                                                        <div className="absolute inset-0 grain-overlay" />
                                                        <svg
                                                                viewBox="0 0 400 250"
                                                                className="absolute inset-0 h-full w-full"
                                                                fill="none"
                                                        >
                                                                <defs>
                                                                        <linearGradient id="teaserGold" x1="0" y1="0" x2="1" y2="0">
                                                                                <stop offset="0%" stopColor="#BF953F" />
                                                                                <stop offset="50%" stopColor="#FCF6BA" />
                                                                                <stop offset="100%" stopColor="#AA771C" />
                                                                        </linearGradient>
                                                                </defs>
                                                                <line x1="60" y1="220" x2="340" y2="220" stroke="url(#teaserGold)" strokeWidth="0.8" />
                                                                <line x1="110" y1="220" x2="110" y2="110" stroke="url(#teaserGold)" strokeWidth="0.8" />
                                                                <line x1="290" y1="220" x2="290" y2="110" stroke="url(#teaserGold)" strokeWidth="0.8" />
                                                                <path d="M110 110 Q200 40 290 110" stroke="url(#teaserGold)" strokeWidth="1.1" />
                                                                <text x="200" y="140" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="9" letterSpacing="3" fill="#F5F1E8">PARVATHI INFRA</text>
                                                                <text x="200" y="168" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="18" letterSpacing="7" fill="transparent" stroke="url(#teaserGold)" strokeWidth="0.6">THE VIEW</text>
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-ink/60 backdrop-blur-md transition-transform group-hover:scale-110">
                                                                        <Play size={22} className="text-gold ml-1" />
                                                                </div>
                                                        </div>
                                                        <div className="absolute bottom-5 left-5 text-[0.6rem] uppercase tracking-[0.32em] text-ivory-dim">
                                                                Duration · 3 min
                                                        </div>
                                                </div>
                                        </div>
                                </Link>
                        </section>

                        {/* ============================ PORTFOLIO GRID ============================ */}
                        <section
                                data-testid={HOME_PAGE.projectsGrid}
                                className="border-t border-[rgba(201,162,75,0.15)] bg-ink py-24 md:py-28"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                                                        <div>
                                                                <SectionIndex n={4} label="Portfolio" />
                                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                                        Selected <span className="gold-foil-text">Works</span>
                                                                </h2>
                                                                <p className="mt-4 max-w-xl font-serif-elegant text-base italic text-ivory-dim md:text-lg">
                                                                        Delivered ventures and the flagship in the making.
                                                                </p>
                                                        </div>
                                                        <Link
                                                                to="/projects"
                                                                className="gold-underline text-[0.72rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                        >
                                                                All Projects →
                                                        </Link>
                                                </div>
                                        </Reveal>

                                        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-4">
                                                {[
                                                        {
                                                                title: 'THE VIEW',
                                                                sub: 'Kothur · Flagship · HMDA & FCDA',
                                                                img: MASTER_PLAN_IMAGE,
                                                                to: '/the-view',
                                                                status: 'Now Selling',
                                                        },
                                                        {
                                                                title: PAST_PROJECTS[0].title,
                                                                sub: PAST_PROJECTS[0].sub,
                                                                img: STOCK.architecture,
                                                                to: '/projects',
                                                                status: PAST_PROJECTS[0].status,
                                                        },
                                                        {
                                                                title: PAST_PROJECTS[1].title,
                                                                sub: PAST_PROJECTS[1].sub,
                                                                img: STOCK.clubhouse,
                                                                to: '/projects',
                                                                status: PAST_PROJECTS[1].status,
                                                        },
                                                        {
                                                                title: PAST_PROJECTS[2].title,
                                                                sub: PAST_PROJECTS[2].sub,
                                                                img: STOCK.hills,
                                                                to: '/projects',
                                                                status: PAST_PROJECTS[2].status,
                                                        },
                                                ].map((p, i) => (
                                                        <Reveal key={p.title} delay={i * 0.08}>
                                                                <Link to={p.to} data-testid={`home-project-card-${i}`} className="group block h-full">
                                                                        <div className="relative aspect-[4/5] w-full overflow-hidden border border-[rgba(201,162,75,0.2)]">
                                                                                <img
                                                                                        src={p.img}
                                                                                        alt={p.title}
                                                                                        className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
                                                                                />
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                                                                                <span className="absolute right-4 top-4 border border-[rgba(201,162,75,0.5)] bg-ink/60 px-3 py-1 text-[0.55rem] uppercase tracking-[0.28em] text-gold backdrop-blur-md">
                                                                                        {p.status}
                                                                                </span>
                                                                                <div className="absolute bottom-6 left-6 right-6">
                                                                                        <div className="micro-label mb-2">{p.sub}</div>
                                                                                        <div className="font-display text-lg tracking-[0.14em] text-ivory md:text-2xl">
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

                        {/* ============================ CONTACT CTA ============================ */}
                        <section className="relative overflow-hidden py-24 md:py-28">
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
                                                <SectionIndex n={5} label="Enquire" />
                                                <h2 className="font-display text-4xl leading-tight tracking-[0.1em] text-ivory md:text-6xl">
                                                        A private preview,
                                                        <br />
                                                        <span className="gold-foil-text">on your terms.</span>
                                                </h2>
                                                <p className="mt-6 max-w-2xl font-serif-elegant text-xl italic text-ivory-dim md:text-2xl">
                                                        Share your details. Our team will reach out to arrange a chauffeured site visit to Kothur.
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
