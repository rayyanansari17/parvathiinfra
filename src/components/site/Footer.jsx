import Link from 'next/link';
import { SITE } from '@/lib/siteData';
import { FOOTER } from '@/constants/testIds';

export default function Footer() {
        return (
                <footer
                        data-testid={FOOTER.root}
                        className="relative border-t border-[rgba(201,162,75,0.2)] bg-ink text-ivory"
                >
                        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-24">
                                <div className="grid gap-16 md:grid-cols-4">
                                        <div className="md:col-span-2">
                                                <div className="font-display text-2xl tracking-[0.18em] text-ivory">
                                                        PARVATHI <span className="text-gold">INFRA</span>
                                                </div>
                                                <p className="mt-6 max-w-md font-serif-elegant text-lg italic leading-relaxed text-ivory-dim">
                                                        Crafting scenic addresses across Telangana with obsessive
                                                        attention to detail, honest paperwork and generations of trust.
                                                </p>
                                        </div>

                                        <div>
                                                <div className="micro-label mb-4">Navigate</div>
                                                <ul className="space-y-3">
                                                        {[
                                                                { to: '/', label: 'Home' },
                                                                { to: '/about', label: 'About Us' },
                                                                { to: '/projects', label: 'Projects' },
                                                                { to: '/the-view', label: 'The View' },
                                                                { to: '/gallery', label: 'Gallery' },
                                                                { to: '/contact', label: 'Contact' },
                                                        ].map((l) => (
                                                                <li key={l.to}>
                                                                        <Link
                                                                                href={l.to}
                                                                                className="gold-underline text-sm text-ivory-dim hover:text-ivory"
                                                                        >
                                                                                {l.label}
                                                                        </Link>
                                                                </li>
                                                        ))}
                                                </ul>
                                        </div>

                                        <div>
                                                <div className="micro-label mb-4">Reach Us</div>
                                                <ul className="space-y-3 text-sm text-ivory-dim">
                                                        <li>{SITE.officeAddress}</li>
                                                        <li>
                                                                <a href={`mailto:${SITE.email}`} className="gold-underline">
                                                                        {SITE.email}
                                                                </a>
                                                        </li>
                                                        <li>
                                                                <a href={SITE.phoneLink} className="gold-underline">
                                                                        {SITE.phoneDisplay}
                                                                </a>
                                                        </li>
                                                </ul>
                                        </div>
                                </div>

                                <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[rgba(201,162,75,0.15)] pt-8 text-xs uppercase tracking-[0.28em] text-ivory-dim/70 md:flex-row md:items-center">
                                        <div>© {new Date().getFullYear()} Parvathi Infra Developers. All rights reserved.</div>
                                        <div className="flex gap-6">
                                                <span>TG RERA Approved</span>
                                                <span>HMDA</span>
                                                <span>Clear Title</span>
                                        </div>
                                </div>
                        </div>
                </footer>
        );
}
