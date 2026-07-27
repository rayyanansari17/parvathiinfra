import Link from 'next/link';
import { Instagram, Facebook } from 'lucide-react';
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
 <p className="mt-6 max-w-md font-sans font-light text-base leading-relaxed text-ivory-dim">
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
                                                        {SITE.phones.map((p) => (
                                                                <li key={p.link}>
                                                                        <a href={p.link} className="gold-underline">
                                                                                {p.display}
                                                                        </a>
                                                                </li>
                                                        ))}
                                                </ul>

                                                <div className="micro-label mb-3 mt-8">Follow</div>
                                                <div className="flex items-center gap-3">
                                                        <a
                                                                href={SITE.socials.instagram}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label="Parvathi Infra on Instagram"
                                                                data-testid="footer-instagram"
                                                                className="flex h-10 w-10 items-center justify-center border border-[rgba(201,162,75,0.35)] text-ivory-dim transition-colors hover:border-gold hover:text-gold"
                                                        >
                                                                <Instagram size={17} />
                                                        </a>
                                                        <a
                                                                href={SITE.socials.facebook}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label="Parvathi Infra on Facebook"
                                                                data-testid="footer-facebook"
                                                                className="flex h-10 w-10 items-center justify-center border border-[rgba(201,162,75,0.35)] text-ivory-dim transition-colors hover:border-gold hover:text-gold"
                                                        >
                                                                <Facebook size={17} />
                                                        </a>
                                                </div>
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
