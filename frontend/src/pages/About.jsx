import { Reveal, SectionIndex } from '@/components/site/Reveal';
import LeadForm from '@/components/site/LeadForm';
import { STOCK, SCALE_MODEL_IMAGE } from '@/lib/siteData';
import { ABOUT_PAGE } from '@/constants/testIds';

const TIMELINE = [
        {
                year: '2004',
                title: 'The Foundation',
                copy: 'Parvathi Infra Developers is founded in Shamshabad with a singular idea · earth is a canvas, not a commodity.',
        },
        {
                year: '2011',
                title: 'First Gated Layout',
                copy: 'Delivered our first HMDA-approved gated layout on the outskirts of Hyderabad · a benchmark for quiet luxury living.',
        },
        {
                year: '2017',
                title: 'Estate Craftsmanship',
                copy: 'Introduced landscape-first master planning: every plot begins with a tree, a wind study and a Vastu compass.',
        },
        {
                year: '2022',
                title: 'The Southern Corridor',
                copy: 'Anticipated the Srisailam Highway boom and acquired a rare ridgeline canvas near Kadthal.',
        },
        {
                year: '2025',
                title: 'THE VIEW Unveiled',
                copy: '45 exclusive villa plots. 3.6 acres. A flagship venture that redefines what a scenic address means in Telangana.',
        },
];

export default function About() {
        return (
                <div data-testid={ABOUT_PAGE.root} className="bg-ink pt-28">
                        <section className="relative overflow-hidden">
                                <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 py-24 md:grid-cols-12 md:px-12 md:py-32 lg:px-24">
                                        <div className="md:col-span-7">
                                                <Reveal>
                                                        <SectionIndex n={1} label="About Parvathi Infra" />
                                                        <h1
                                                                data-testid={ABOUT_PAGE.heroTitle}
                                                                className="font-display text-4xl leading-[1.05] tracking-[0.06em] text-ivory md:text-6xl lg:text-7xl"
                                                        >
                                                                Two decades. One{' '}
                                                                <span className="gold-foil-text italic font-serif-elegant">
                                                                        obsession.
                                                                </span>
                                                        </h1>
                                                        <p className="mt-8 max-w-xl font-serif-elegant text-xl italic leading-relaxed text-ivory-dim md:text-2xl">
                                                                We build only what we would live in ourselves · layouts you can
                                                                walk barefoot, paperwork that holds up to a magnifying glass,
                                                                and communities that feel like they’ve always been there.
                                                        </p>
                                                </Reveal>
                                        </div>
                                        <Reveal delay={0.15} className="md:col-span-5">
                                                <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.25)]">
                                                        <img
                                                                src={SCALE_MODEL_IMAGE}
                                                                alt="Parvathi Infra scale model"
                                                                className="h-full w-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                                                        <div className="absolute bottom-6 left-6">
                                                                <div className="micro-label">Since 2004 · Shamshabad</div>
                                                        </div>
                                                </div>
                                        </Reveal>
                                </div>
                        </section>

                        {/* Philosophy */}
                        <section className="border-y border-[rgba(201,162,75,0.15)] bg-obsidian py-32 md:py-40">
                                <div className="mx-auto max-w-[1200px] px-6 md:px-12">
                                        <Reveal>
                                                <SectionIndex n={2} label="Philosophy" />
                                                <p className="font-serif-elegant text-3xl italic leading-[1.35] text-ivory md:text-4xl">
                                                        “A great layout is invisible. You feel the breeze before you see the
                                                        boulevard. You hear the temple bell before the traffic. The plot
                                                        remembers you before you unpack.”
                                                </p>
                                                <div className="mt-8 flex items-center gap-4">
                                                        <div className="h-px w-16 bg-gold" />
                                                        <span className="micro-label">The Parvathi Studio</span>
                                                </div>
                                        </Reveal>

                                        <div className="mt-24 grid gap-10 md:grid-cols-3">
                                                {[
                                                        {
                                                                title: 'Landscape First',
                                                                copy: 'Every master plan starts with existing trees, wind studies, and sunrise vectors · never a bulldozer.',
                                                        },
                                                        {
                                                                title: 'Honest Paperwork',
                                                                copy: 'TG RERA, HMDA, clear title. Every clause is drafted for the buyer, not around them.',
                                                        },
                                                        {
                                                                title: 'Post-Sale Trust',
                                                                copy: 'We remain your neighbour, not just your developer. Our concierge is on call for a decade.',
                                                        },
                                                ].map((v) => (
                                                        <Reveal key={v.title}>
                                                                <div className="border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-10">
                                                                        <div className="font-display text-xl tracking-[0.14em] text-ivory">
                                                                                {v.title}
                                                                        </div>
                                                                        <p className="mt-4 font-serif-elegant text-lg italic text-ivory-dim">
                                                                                {v.copy}
                                                                        </p>
                                                                </div>
                                                        </Reveal>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        {/* Timeline */}
                        <section className="bg-ink py-32 md:py-40">
                                <div className="mx-auto max-w-[1200px] px-6 md:px-12">
                                        <Reveal>
                                                <SectionIndex n={3} label="Chronicle" />
                                                <h2 className="font-display text-3xl tracking-[0.14em] text-ivory md:text-5xl">
                                                        Milestones, <span className="gold-foil-text">quietly earned.</span>
                                                </h2>
                                        </Reveal>

                                        <div
                                                data-testid={ABOUT_PAGE.timeline}
                                                className="mt-20 border-l border-[rgba(201,162,75,0.25)] pl-8 md:pl-14"
                                        >
                                                {TIMELINE.map((t, i) => (
                                                        <Reveal key={t.year} delay={i * 0.05}>
                                                                <div className="relative pb-16 last:pb-0">
                                                                        <div className="absolute -left-[42px] top-1.5 h-3 w-3 rounded-full border border-gold bg-ink md:-left-[57px]" />
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

                        {/* CTA */}
                        <section className="relative overflow-hidden border-t border-[rgba(201,162,75,0.15)]">
                                <div className="absolute inset-0">
                                        <img src={STOCK.architecture} alt="" className="h-full w-full object-cover opacity-20" />
                                        <div className="absolute inset-0 bg-ink/85" />
                                </div>
                                <div className="relative mx-auto max-w-[1000px] px-6 py-32 md:px-12">
                                        <Reveal>
                                                <SectionIndex n={4} label="Speak with Us" />
                                                <h2 className="font-display text-3xl tracking-[0.12em] text-ivory md:text-5xl">
                                                        Meet the studio.
                                                </h2>
                                        </Reveal>
                                        <div className="mt-14">
                                                <LeadForm source="about_cta" />
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
