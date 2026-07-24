'use client';

import Link from 'next/link';
import { Reveal, SectionIndex } from '@/components/site/Reveal';
import { STOCK, MASTER_PLAN_IMAGE, PAST_PROJECTS } from '@/lib/siteData';
import { PROJECTS_PAGE } from '@/constants/testIds';

const PROJECTS = [
        {
                id: 'the-view',
                title: 'THE VIEW',
                sub: 'Kothur · Flagship · HMDA & FCDA (HMDA) Approved',
                status: 'Now Selling',
                img: MASTER_PLAN_IMAGE,
                to: '/the-view',
                testid: PROJECTS_PAGE.projectCardTheView,
                copy: 'Our flagship at Kothur, on NH-44 (Bengaluru Highway). HMDA & FCDA (HMDA) approved with clear legal title, wide blacktop roads, underground services and avenue plantation.',
        },
        {
                id: PAST_PROJECTS[0].id,
                title: PAST_PROJECTS[0].title,
                sub: PAST_PROJECTS[0].sub,
                status: PAST_PROJECTS[0].status,
                img: STOCK.architecture,
                to: '/contact',
                copy: PAST_PROJECTS[0].copy,
        },
        {
                id: PAST_PROJECTS[1].id,
                title: PAST_PROJECTS[1].title,
                sub: PAST_PROJECTS[1].sub,
                status: PAST_PROJECTS[1].status,
                img: STOCK.clubhouse,
                to: '/contact',
                copy: PAST_PROJECTS[1].copy,
        },
        {
                id: PAST_PROJECTS[2].id,
                title: PAST_PROJECTS[2].title,
                sub: PAST_PROJECTS[2].sub,
                status: PAST_PROJECTS[2].status,
                img: STOCK.hills,
                to: '/contact',
                copy: PAST_PROJECTS[2].copy,
        },
];

export default function Projects() {
        return (
                <div data-testid={PROJECTS_PAGE.root} className="bg-ink pt-28">
                        <section className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28 lg:px-24">
                                <Reveal>
                                        <SectionIndex n={1} label="Portfolio" />
                                        <h1 className="max-w-4xl font-display text-4xl leading-[1.05] tracking-[0.06em] text-ivory md:text-6xl lg:text-7xl">
                                                Every project is a{' '}
                                                <span className="gold-foil-text italic font-serif-elegant">landmark.</span>
                                        </h1>
                                        <p className="mt-6 max-w-2xl font-serif-elegant text-xl italic text-ivory-dim md:text-2xl">
                                                A slow, deliberate portfolio. We build few. We build well.
                                        </p>
                                </Reveal>
                        </section>

                        <section className="border-t border-[rgba(201,162,75,0.15)] bg-ink pb-24 md:pb-28">
                                <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                                                {PROJECTS.map((p, i) => (
                                                        <Reveal key={p.id} delay={i * 0.08}>
                                                                <Link
                                                                        href={p.to}
                                                                        data-testid={p.testid || `projects-card-${p.id}`}
                                                                        className="group block h-full"
                                                                >
                                                                        <div className="relative aspect-[4/5] w-full overflow-hidden border border-[rgba(201,162,75,0.2)]">
                                                                                <img
                                                                                        src={p.img}
                                                                                        alt={p.title}
                                                                                        className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-110"
                                                                                />
                                                                                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                                                                                <span className="absolute right-5 top-5 border border-[rgba(201,162,75,0.5)] bg-ink/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.28em] text-gold backdrop-blur-md">
                                                                                        {p.status}
                                                                                </span>
                                                                                <div className="absolute bottom-6 left-6 right-6">
                                                                                        <div className="micro-label mb-2">{p.sub}</div>
                                                                                        <div className="font-display text-xl tracking-[0.14em] text-ivory md:text-2xl">
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
