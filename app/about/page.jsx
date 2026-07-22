'use client';

import { Reveal, SectionIndex } from '@/components/site/Reveal';
import LeadForm from '@/components/site/LeadForm';
import {
        STOCK,
        SCALE_MODEL_IMAGE,
        CORE_VALUES,
        JOURNEY,
        PAST_PROJECTS,
        COLLABORATION_LOCATIONS,
        SITE,
} from '@/lib/siteData';
import { ABOUT_PAGE } from '@/constants/testIds';

export default function About() {
        return (
                <div data-testid={ABOUT_PAGE.root} className="bg-ink pt-28">
                        {/* ============================ HERO ============================ */}
                        <section className="relative overflow-hidden">
                                <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 py-20 md:grid-cols-12 md:px-12 md:py-28 lg:px-24">
                                        <div className="md:col-span-7">
                                                <Reveal>
                                                        <SectionIndex n={1} label="About Parvathi Infra" />
                                                        <h1
                                                                data-testid={ABOUT_PAGE.heroTitle}
                                                                className="font-display text-4xl leading-[1.05] tracking-[0.06em] text-ivory md:text-6xl lg:text-7xl"
                                                        >
                                                                Creating <span className="gold-foil-text italic font-serif-elegant">Landmarks.</span>
                                                                <br />
                                                                Building Legacies.
                                                        </h1>
                                                        <p className="mt-8 max-w-xl font-serif-elegant text-xl italic leading-relaxed text-ivory-dim md:text-2xl">
                                                                Parvathi Infra Developers was founded in 2019 in Hyderabad
                                                                under the leadership of <span className="not-italic text-ivory">{SITE.founder}</span>.
                                                                Every venture reflects our commitment to quality,
                                                                transparency, innovation and customer satisfaction.
                                                        </p>
                                                        <div className="mt-10 flex flex-wrap gap-3">
                                                                {['HMDA Approved', 'FCDA Approved', 'Clear Title', '2 Lakh+ Sq. Yds'].map((c) => (
                                                                        <span
                                                                                key={c}
                                                                                className="border border-[rgba(201,162,75,0.4)] px-4 py-2 text-[0.6rem] uppercase tracking-[0.32em] text-ivory-dim"
                                                                        >
                                                                                {c}
                                                                        </span>
                                                                ))}
                                                        </div>
                                                </Reveal>
                                        </div>
                                        <Reveal delay={0.15} className="md:col-span-5">
                                                <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.25)]">
                                                        <img
                                                                src={SCALE_MODEL_IMAGE}
                                                                alt="Parvathi Infra developments"
                                                                className="h-full w-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                                                        <div className="absolute bottom-6 left-6">
                                                                <div className="micro-label">Est. 2019 · Hyderabad</div>
                                                                <div className="mt-1 font-display text-sm tracking-[0.14em] text-ivory">
                                                                        Under {SITE.founder}
                                                                </div>
                                                        </div>
                                                </div>
                                        </Reveal>
                                </div>
                        </section>

                        {/* ============================ VISION / MISSION ============================ */}
                        <section
                                data-testid="about-vision-mission"
                                className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian py-20 md:py-24"
                        >
                                <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-2 md:px-12">
                                        <Reveal>
                                                <div className="micro-label mb-4 text-gold">Vision</div>
                                                <h3 className="font-display text-2xl leading-tight tracking-[0.1em] text-ivory md:text-3xl">
                                                        Creating <span className="gold-foil-text">Landmarks.</span>
                                                        <br />
                                                        Building <span className="gold-foil-text">Legacies.</span>
                                                </h3>
                                                <p className="mt-6 font-serif-elegant text-lg italic leading-relaxed text-ivory-dim">
                                                        To create landmark residential communities that offer lasting value to
                                                        homeowners and investors alike.
                                                </p>
                                        </Reveal>
                                        <Reveal delay={0.1}>
                                                <div className="micro-label mb-4 text-gold">Mission</div>
                                                <h3 className="font-display text-2xl leading-tight tracking-[0.1em] text-ivory md:text-3xl">
                                                        World-class infrastructure.
                                                        <br />
                                                        Uncompromising <span className="gold-foil-text">documentation.</span>
                                                </h3>
                                                <p className="mt-6 font-serif-elegant text-lg italic leading-relaxed text-ivory-dim">
                                                        Deliver premium residential developments with world-class
                                                        infrastructure, clear legal documentation, and sustainable long-term
                                                        value.
                                                </p>
                                        </Reveal>
                                </div>
                        </section>

                        {/* ============================ CORE VALUES ============================ */}
                        <section
                                data-testid="about-values"
                                className="bg-ink py-24 md:py-28"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={2} label="Core Values" />
                                                <h2 className="max-w-3xl font-display text-3xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                        Six principles. <span className="gold-foil-text">Every venture.</span>
                                                </h2>
                                        </Reveal>
                                        <div className="mt-14 grid gap-px bg-[rgba(201,162,75,0.15)] md:grid-cols-2 lg:grid-cols-3">
                                                {CORE_VALUES.map((v, i) => (
                                                        <div
                                                                key={v.title}
                                                                data-testid={`value-${i}`}
                                                                className="group bg-obsidian-2 p-10 transition-colors hover:bg-obsidian"
                                                        >
                                                                <div className="font-display text-[0.7rem] tracking-[0.32em] text-gold">
                                                                        0{String(i + 1).padStart(2, '0')}
                                                                </div>
                                                                <div className="mt-5 font-display text-2xl tracking-[0.14em] text-ivory">
                                                                        {v.title}
                                                                </div>
                                                                <p className="mt-4 font-serif-elegant text-base italic leading-relaxed text-ivory-dim">
                                                                        {v.copy}
                                                                </p>
                                                                <div className="mt-6 h-px w-0 bg-gradient-to-r from-gold to-transparent transition-all duration-700 group-hover:w-full" />
                                                        </div>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* ============================ JOURNEY TIMELINE ============================ */}
                        <section className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian py-24 md:py-28">
                                <div className="mx-auto max-w-[1200px] px-6 md:px-12">
                                        <Reveal>
                                                <SectionIndex n={3} label="Our Journey" />
                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                        Milestones, <span className="gold-foil-text">quietly earned.</span>
                                                </h2>
                                        </Reveal>

                                        <div
                                                data-testid={ABOUT_PAGE.timeline}
                                                className="mt-16 border-l border-[rgba(201,162,75,0.25)] pl-8 md:pl-14"
                                        >
                                                {JOURNEY.map((t, i) => (
                                                        <Reveal key={t.year} delay={i * 0.06}>
                                                                <div className="relative pb-14 last:pb-0">
                                                                        <div className="absolute -left-[42px] top-1.5 h-3 w-3 rounded-full border border-gold bg-obsidian md:-left-[57px]" />
                                                                        <div className="font-display text-lg tracking-[0.28em] text-gold">
                                                                                {t.year}
                                                                        </div>
                                                                        <div className="mt-2 font-display text-2xl tracking-[0.08em] text-ivory md:text-3xl">
                                                                                {t.title}
                                                                        </div>
                                                                        <p className="mt-3 max-w-xl font-serif-elegant text-lg italic text-ivory-dim">
                                                                                {t.copy}
                                                                        </p>
                                                                </div>
                                                        </Reveal>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* ============================ COLLABORATIONS ============================ */}
                        <section
                                data-testid="about-collaborations"
                                className="bg-ink py-24 md:py-28"
                        >
                                <div className="mx-auto grid max-w-[1440px] gap-16 px-6 md:grid-cols-12 md:px-12 lg:px-24">
                                        <div className="md:col-span-5">
                                                <Reveal>
                                                        <SectionIndex n={4} label="Strategic Collaborations" />
                                                        <h2 className="font-display text-3xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                                Trusted by <span className="gold-foil-text">Green Homes.</span>
                                                        </h2>
                                                        <p className="mt-6 max-w-md font-serif-elegant text-lg italic leading-relaxed text-ivory-dim">
                                                                Across five key investment corridors, our collaborations with
                                                                Green Homes marketed more than{' '}
                                                                <span className="not-italic text-ivory">90,000 sq. yards</span> in a
                                                                single year — a testament to execution and customer trust.
                                                        </p>
                                                </Reveal>
                                        </div>
                                        <Reveal delay={0.12} className="md:col-span-7">
                                                <div className="border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-10 md:p-14">
                                                        <div className="micro-label mb-6 text-gold">Collaboration Locations</div>
                                                        <ul className="grid gap-4 sm:grid-cols-2">
                                                                {COLLABORATION_LOCATIONS.map((loc, i) => (
                                                                        <li
                                                                                key={loc}
                                                                                data-testid={`collab-loc-${i}`}
                                                                                className="flex items-start gap-4 border-b border-[rgba(201,162,75,0.15)] pb-4 last:border-0"
                                                                        >
                                                                                <span className="mt-3 h-px w-6 bg-gold" />
                                                                                <div className="font-display text-base tracking-[0.14em] text-ivory md:text-lg">
                                                                                        {loc}
                                                                                </div>
                                                                        </li>
                                                                ))}
                                                        </ul>
                                                        <div className="mt-8 flex items-baseline gap-4">
                                                                <span className="font-display text-4xl md:text-5xl">
                                                                        <span className="gold-foil-text">90,000+</span>
                                                                </span>
                                                                <span className="text-sm text-ivory-dim">Sq. Yds. marketed in one year</span>
                                                        </div>
                                                </div>
                                        </Reveal>
                                </div>
                        </section>

                        {/* ============================ PAST PROJECTS ============================ */}
                        <section
                                data-testid="about-past-projects"
                                className="border-t border-[rgba(201,162,75,0.15)] bg-obsidian py-24 md:py-28"
                        >
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <Reveal>
                                                <SectionIndex n={5} label="Past Ventures" />
                                                <h2 className="font-display text-3xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                        Delivered. <span className="gold-foil-text">Independently.</span>
                                                </h2>
                                        </Reveal>
                                        <div className="mt-14 grid gap-8 md:grid-cols-3">
                                                {PAST_PROJECTS.map((p, i) => (
                                                        <Reveal key={p.id} delay={i * 0.08}>
                                                                <div
                                                                        data-testid={`past-project-${p.id}`}
                                                                        className="group h-full border border-[rgba(201,162,75,0.2)] bg-ink p-8 transition-colors hover:border-gold"
                                                                >
                                                                        <div className="font-display text-[0.7rem] tracking-[0.32em] text-gold">
                                                                                {p.status}
                                                                        </div>
                                                                        <div className="mt-4 font-display text-xl tracking-[0.14em] text-ivory md:text-2xl">
                                                                                {p.title}
                                                                        </div>
                                                                        <div className="mt-2 text-[0.65rem] uppercase tracking-[0.28em] text-ivory-dim">
                                                                                {p.sub}
                                                                        </div>
                                                                        <p className="mt-5 font-serif-elegant text-base italic leading-relaxed text-ivory-dim">
                                                                                {p.copy}
                                                                        </p>
                                                                </div>
                                                        </Reveal>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* ============================ CTA ============================ */}
                        <section className="relative overflow-hidden border-t border-[rgba(201,162,75,0.15)]">
                                <div className="absolute inset-0">
                                        <img src={STOCK.architecture} alt="" className="h-full w-full object-cover opacity-20" />
                                        <div className="absolute inset-0 bg-ink/85" />
                                </div>
                                <div className="relative mx-auto max-w-[1000px] px-6 py-24 md:px-12 md:py-28">
                                        <Reveal>
                                                <SectionIndex n={6} label="Speak with Us" />
                                                <h2 className="font-display text-3xl tracking-[0.12em] text-ivory md:text-5xl">
                                                        Meet the studio.
                                                </h2>
                                        </Reveal>
                                        <div className="mt-12">
                                                <LeadForm source="about_cta" />
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
