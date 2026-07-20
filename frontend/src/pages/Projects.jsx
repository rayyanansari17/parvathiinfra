import { Link } from 'react-router-dom';
import { Reveal, SectionIndex } from '@/components/site/Reveal';
import { STOCK, MASTER_PLAN_IMAGE, SCALE_MODEL_IMAGE } from '@/lib/siteData';
import { PROJECTS_PAGE } from '@/constants/testIds';

const PROJECTS = [
        {
                id: 'the-view',
                title: 'THE VIEW',
                sub: 'Kadthal · Villa Plots · 3.6 acres',
                status: 'Now Selling',
                img: MASTER_PLAN_IMAGE,
                to: '/the-view',
                testid: PROJECTS_PAGE.projectCardTheView,
                copy: 'Our flagship · 45 exclusive villa plots overlooking the ridgeline near Srisailam Highway. TG RERA, HMDA, 100% Vastu.',
        },
        {
                id: 'archive',
                title: 'STUDIO ARCHIVE',
                sub: 'Selected Land Portfolio · 2011–2023',
                status: 'Completed',
                img: STOCK.hills,
                to: '/contact',
                copy: 'A quiet portfolio of gated layouts and estate plots delivered across the Southern corridor of Telangana.',
        },
        {
                id: 'upcoming',
                title: 'ESTATE 04',
                sub: 'By invitation only',
                status: 'Coming Soon',
                img: STOCK.architecture,
                to: '/contact',
                copy: 'A curated estate of 20 plots along the emerging Fourth City corridor. Registrations open on request.',
        },
];

export default function Projects() {
        return (
                <div data-testid={PROJECTS_PAGE.root} className="bg-ink pt-28">
                        <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32 lg:px-24">
                                <Reveal>
                                        <SectionIndex n={1} label="Portfolio" />
                                        <h1 className="max-w-4xl font-display text-4xl leading-[1.05] tracking-[0.06em] text-ivory md:text-6xl lg:text-7xl">
                                                Every project is a{' '}
                                                <span className="gold-foil-text italic font-serif-elegant">chapter.</span>
                                        </h1>
                                        <p className="mt-6 max-w-2xl font-serif-elegant text-xl italic text-ivory-dim md:text-2xl">
                                                A slow, deliberate portfolio. We build few. We build well.
                                        </p>
                                </Reveal>
                        </section>

                        <section className="border-t border-[rgba(201,162,75,0.15)] bg-ink pb-32 md:pb-40">
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                                                {PROJECTS.map((p, i) => (
                                                        <Reveal key={p.id} delay={i * 0.08}>
                                                                <Link
                                                                        to={p.to}
                                                                        data-testid={p.testid}
                                                                        className="group block"
                                                                >
                                                                        <div className="relative aspect-[4/5] overflow-hidden border border-[rgba(201,162,75,0.2)]">
                                                                                <img
                                                                                        src={p.img}
                                                                                        alt={p.title}
                                                                                        className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
                                                                                />
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                                                                                <span className="absolute right-5 top-5 border border-[rgba(201,162,75,0.5)] bg-ink/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-gold backdrop-blur-md">
                                                                                        {p.status}
                                                                                </span>
                                                                                <div className="absolute bottom-6 left-6 right-6">
                                                                                        <div className="micro-label mb-2">{p.sub}</div>
                                                                                        <div className="font-display text-2xl tracking-[0.14em] text-ivory">
                                                                                                {p.title}
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                        <p className="mt-6 font-serif-elegant text-lg italic text-ivory-dim">
                                                                                {p.copy}
                                                                        </p>
                                                                </Link>
                                                        </Reveal>
                                                ))}
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
