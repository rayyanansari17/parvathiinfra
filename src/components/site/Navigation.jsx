'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { NAV } from '@/constants/testIds';

const LINKS = [
        { to: '/', label: 'Home', tid: NAV.linkHome },
        { to: '/about', label: 'About', tid: NAV.linkAbout },
        { to: '/projects', label: 'Projects', tid: NAV.linkProjects },
        { to: '/the-view', label: 'The View', tid: NAV.linkTheView },
        { to: '/gallery', label: 'Gallery', tid: NAV.linkGallery },
        { to: '/contact', label: 'Contact', tid: NAV.linkContact },
];

export default function Navigation() {
        const [scrolled, setScrolled] = useState(false);
        const [open, setOpen] = useState(false);
        const pathname = usePathname();

        useEffect(() => {
                const onScroll = () => setScrolled(window.scrollY > 32);
                onScroll();
                window.addEventListener('scroll', onScroll, { passive: true });
                return () => window.removeEventListener('scroll', onScroll);
        }, []);

        useEffect(() => {
                setOpen(false);
        }, [pathname]);

        const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

        return (
                <header
                        data-testid={NAV.root}
                        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
                                scrolled
                                        ? 'bg-ink/80 backdrop-blur-md border-b border-[rgba(201,162,75,0.2)]'
                                        : 'bg-ink/40 backdrop-blur-sm'
                        }`}
                >
                        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 lg:px-16">
                                <Link
                                        href="/"
                                        data-testid={NAV.logo}
                                        className="group flex items-center"
                                >
                                        <img
                                                src="/assets/logo-parvathi-wide.png"
                                                alt="Parvathi Infra Developers"
                                                width={1475}
                                                height={459}
                                                className="h-11 w-auto object-contain sm:h-14 md:h-20"
                                        />
                                </Link>

                                <nav className="hidden items-center gap-9 md:flex">
                                        {LINKS.map((l) => (
                                                <Link
                                                        key={l.to}
                                                        href={l.to}
                                                        data-testid={l.tid}
                                                        className={`gold-underline font-ui text-[0.72rem] uppercase tracking-[0.28em] transition-colors ${
                                                                isActive(l.to) ? 'text-gold' : 'text-ivory-dim hover:text-ivory'
                                                        }`}
                                                >
                                                        {l.label}
                                                </Link>
                                        ))}
                                </nav>

                                <div className="hidden md:block">
                                        <Link
                                                href="/contact"
                                                data-testid={NAV.ctaEnquire}
                                                className="group relative inline-flex items-center gap-3 border border-[rgba(201,162,75,0.4)] px-6 py-2.5 text-[0.7rem] uppercase tracking-[0.32em] text-ivory transition-all hover:border-gold hover:text-gold"
                                        >
                                                <span>Enquire</span>
                                                <span className="h-px w-6 bg-gold transition-all group-hover:w-10" />
                                        </Link>
                                </div>

                                <button
                                        type="button"
                                        data-testid={NAV.mobileToggle}
                                        onClick={() => setOpen((v) => !v)}
                                        className="md:hidden text-ivory"
                                        aria-label="Toggle menu"
                                >
                                        {open ? <X size={22} /> : <Menu size={22} />}
                                </button>
                        </div>

                        {open && (
                                <div
                                        data-testid={NAV.mobileMenu}
                                        className="md:hidden bg-ink/95 border-t border-[rgba(201,162,75,0.15)]"
                                >
                                        <div className="flex flex-col px-6 py-6">
                                                {LINKS.map((l) => (
                                                        <Link
                                                                key={l.to}
                                                                href={l.to}
                                                                data-testid={l.tid + '-mobile'}
                                                                className={`py-3 font-ui text-sm uppercase tracking-[0.28em] ${
                                                                        isActive(l.to) ? 'text-gold' : 'text-ivory-dim'
                                                                }`}
                                                        >
                                                                {l.label}
                                                        </Link>
                                                ))}
                                        </div>
                                </div>
                        )}
                </header>
        );
}
