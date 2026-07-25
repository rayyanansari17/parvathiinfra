'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Real project renders, not stock photography, each paired with a short
// caption chip so the stack reads as a preview of the site rather than a
// generic decorative image pile.
const CARDS = [
        { src: '/assets/tour/01-aerial-site.jpg', label: 'Aerial Site' },
        { src: '/assets/tour/03-arch-front.jpg', label: 'The Arch' },
        { src: '/assets/tour/05-avenue.jpg', label: 'The Avenue' },
        { src: '/assets/tour/06-clubhouse.jpg', label: 'The Clubhouse' },
        { src: '/assets/tour/08-amphitheatre.jpg', label: 'Amphitheatre' },
        { src: '/assets/tour/09-viewpoint.jpg', label: 'The View Point' },
];

const AUTOPLAY_DELAY = 3500;

function CardDrag({ children, onSendToBack, sensitivity, disableDrag }) {
        const x = useMotionValue(0);
        const y = useMotionValue(0);
        const rotateX = useTransform(y, [-100, 100], [22, -22]);
        const rotateY = useTransform(x, [-100, 100], [-22, 22]);

        if (disableDrag) {
                return <div className="absolute inset-0">{children}</div>;
        }

        const handleDragEnd = (_, info) => {
                if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
                        onSendToBack();
                } else {
                        x.set(0);
                        y.set(0);
                }
        };

        return (
                <motion.div
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        style={{ x, y, rotateX, rotateY }}
                        drag
                        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        dragElastic={0.6}
                        onDragEnd={handleDragEnd}
                >
                        {children}
                </motion.div>
        );
}

/**
 * A fanned pile of real site renders in the hero's empty space. Auto-cycles,
 * pauses on hover, and lets a visitor drag (desktop) or tap (mobile) the top
 * card to the back of the pile to browse through the rest.
 */
export default function HeroStack({ className = '' }) {
        const [isMobile, setIsMobile] = useState(false);
        const [reducedMotion, setReducedMotion] = useState(false);
        const [paused, setPaused] = useState(false);
        const [order, setOrder] = useState(() => CARDS.map((_, i) => i));

        useEffect(() => {
                const check = () => setIsMobile(window.innerWidth < 768);
                check();
                window.addEventListener('resize', check);
                return () => window.removeEventListener('resize', check);
        }, []);

        useEffect(() => {
                const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
                setReducedMotion(mq.matches);
                const onChange = (e) => setReducedMotion(e.matches);
                mq.addEventListener?.('change', onChange);
                return () => mq.removeEventListener?.('change', onChange);
        }, []);

        const sendToBack = (id) => {
                setOrder((prev) => {
                        const next = prev.filter((i) => i !== id);
                        next.unshift(id);
                        return next;
                });
        };

        useEffect(() => {
                if (reducedMotion || paused) return undefined;
                const interval = setInterval(() => {
                        setOrder((prev) => {
                                const topId = prev[prev.length - 1];
                                const next = prev.filter((i) => i !== topId);
                                next.unshift(topId);
                                return next;
                        });
                }, AUTOPLAY_DELAY);
                return () => clearInterval(interval);
        }, [reducedMotion, paused]);

        const disableDrag = isMobile;

        if (reducedMotion) {
                const card = CARDS[0];
                return (
                        <div className={`relative aspect-[4/3] w-full ${className}`}>
                                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[rgba(201,162,75,0.35)] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                                        <img src={card.src} alt={card.label} className="h-full w-full object-cover" />
                                        <div className="pointer-events-none absolute inset-0 grain-overlay" />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 rounded-sm bg-ink/70 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-gold backdrop-blur-sm">
                                                {card.label}
                                        </div>
                                </div>
                        </div>
                );
        }

        return (
                <div
                        data-testid="hero-stack"
                        className={`relative aspect-[4/3] w-full ${className}`}
                        style={{ perspective: 900 }}
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                >
                        {order.map((id, index) => {
                                const card = CARDS[id];
                                // Deterministic per-card jitter (not Math.random) so server and
                                // client render the same rotation and hydration never mismatches.
                                const jitter = ((id * 37) % 11) - 5;
                                const depth = order.length - index - 1;
                                const isTop = index === order.length - 1;
                                return (
                                        <CardDrag
                                                key={card.src}
                                                onSendToBack={() => sendToBack(id)}
                                                sensitivity={140}
                                                disableDrag={disableDrag}
                                        >
                                                <motion.div
                                                        data-testid={isTop ? 'hero-stack-top-card' : undefined}
                                                        className="absolute inset-0 origin-[85%_85%] cursor-pointer overflow-hidden rounded-2xl border border-[rgba(201,162,75,0.35)] shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
                                                        onClick={() => sendToBack(id)}
                                                        animate={{
                                                                rotateZ: depth * 3.5 + jitter,
                                                                scale: 1 - depth * 0.055,
                                                                x: depth * 10,
                                                                y: -depth * 10,
                                                        }}
                                                        whileHover={
                                                                isTop
                                                                        ? { y: -8, scale: 1.02, transition: { duration: 0.3 } }
                                                                        : undefined
                                                        }
                                                        initial={false}
                                                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                                >
                                                        <img
                                                                src={card.src}
                                                                alt={card.label}
                                                                draggable={false}
                                                                className="pointer-events-none h-full w-full select-none object-cover"
                                                        />
                                                        <div className="pointer-events-none absolute inset-0 grain-overlay" />
                                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                                                        <div className="pointer-events-none absolute bottom-4 left-4 rounded-sm bg-ink/70 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-gold backdrop-blur-sm">
                                                                {card.label}
                                                        </div>
                                                </motion.div>
                                        </CardDrag>
                                );
                        })}
                </div>
        );
}
