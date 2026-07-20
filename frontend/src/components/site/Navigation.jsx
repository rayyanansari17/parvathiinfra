import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
        const location = useLocation();

        useEffect(() => {
                const onScroll = () => setScrolled(window.scrollY > 32);
                onScroll();
                window.addEventListener('scroll', onScroll, { passive: true });
                return () => window.removeEventListener('scroll', onScroll);
        }, []);

        useEffect(() => {
                setOpen(false);
        }, [location.pathname]);

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
                                        to="/"
                                        data-testid={NAV.logo}
                                        className="group flex items-center gap-3"
                                >
                                        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                                                <path
                                                        d="M4 24 L16 6 L28 24 Z"
                                                        stroke="url(#navGold)"
                                                        strokeWidth="1.4"
                                                        fill="none"
                                                />
                                                <circle cx="16" cy="18" r="2.2" fill="#C9A24B" />
                                                <defs>
                                                        <linearGradient id="navGold" x1="0" y1="0" x2="1" y2="1">
                                                                <stop offset="0%" stopColor="#BF953F" />
                                                                <stop offset="50%" stopColor="#FCF6BA" />
                                                                <stop offset="100%" stopColor="#AA771C" />
                                                        </linearGradient>
                                                </defs>
                                        </svg>
                                        <div className="leading-tight">
                                                <div className="font-display text-[0.9rem] tracking-[0.28em] text-ivory">
                                                        PARVATHI INFRA
                                                </div>
                                                <div className="text-[0.6rem] tracking-[0.4em] text-gold">
                                                        DEVELOPERS
                                                </div>
                                        </div>
                                </Link>

                                <nav className="hidden items-center gap-9 md:flex">
                                        {LINKS.map((l) => (
                                                <NavLink
                                                        key={l.to}
                                                        to={l.to}
                                                        end={l.to === '/'}
                                                        data-testid={l.tid}
                                                        className={({ isActive }) =>
                                                                `gold-underline font-ui text-[0.72rem] uppercase tracking-[0.28em] transition-colors ${
                                                                        isActive ? 'text-gold' : 'text-ivory-dim hover:text-ivory'
                                                                }`
                                                        }
                                                >
                                                        {l.label}
                                                </NavLink>
                                        ))}
                                </nav>

                                <div className="hidden md:block">
                                        <Link
                                                to="/contact"
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
                                                        <NavLink
                                                                key={l.to}
                                                                to={l.to}
                                                                end={l.to === '/'}
                                                                data-testid={l.tid + '-mobile'}
                                                                className={({ isActive }) =>
                                                                        `py-3 font-ui text-sm uppercase tracking-[0.28em] ${
                                                                                isActive ? 'text-gold' : 'text-ivory-dim'
                                                                        }`
                                                                }
                                                        >
                                                                {l.label}
                                                        </NavLink>
                                                ))}
                                        </div>
                                </div>
                        )}
                </header>
        );
}
