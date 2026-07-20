import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, SectionIndex } from '@/components/site/Reveal';
import { BROCHURE_PAGES, MASTER_PLAN_IMAGE, SCALE_MODEL_IMAGE, STOCK } from '@/lib/siteData';
import { GALLERY_PAGE } from '@/constants/testIds';

const IMAGES = [
        { src: STOCK.pool, cat: 'Amenities', title: 'Signature Pool' },
        { src: MASTER_PLAN_IMAGE, cat: 'Master Plan', title: 'Layout' },
        { src: STOCK.clubhouse, cat: 'Amenities', title: 'Clubhouse Lounge' },
        { src: SCALE_MODEL_IMAGE, cat: 'Master Plan', title: 'Scale Model' },
        { src: STOCK.bar, cat: 'Amenities', title: 'Private Bar' },
        { src: STOCK.hills, cat: 'Site', title: 'Ridgeline View' },
        { src: STOCK.architecture, cat: 'Editorial', title: 'Architectural Study' },
        { src: STOCK.heroFallback, cat: 'Editorial', title: 'Villa at Dusk' },
        ...BROCHURE_PAGES.map((src, i) => ({
                src,
                cat: 'Brochure',
                title: `Brochure · Page ${String(i + 1).padStart(2, '0')}`,
        })),
];

const CATS = ['All', 'Amenities', 'Master Plan', 'Site', 'Editorial', 'Brochure'];

export default function Gallery() {
        const [cat, setCat] = useState('All');
        const [active, setActive] = useState(null);

        const filtered = IMAGES.filter((i) => cat === 'All' || i.cat === cat);

        return (
                <div data-testid={GALLERY_PAGE.root} className="bg-ink pt-28">
                        <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32 lg:px-24">
                                <Reveal>
                                        <SectionIndex n={1} label="Gallery" />
                                        <h1 className="font-display text-4xl leading-tight tracking-[0.08em] text-ivory md:text-6xl lg:text-7xl">
                                                A slow, <span className="gold-foil-text italic font-serif-elegant">deliberate</span> visual archive.
                                        </h1>
                                        <p className="mt-6 max-w-2xl font-serif-elegant text-xl italic text-ivory-dim">
                                                Site photography, artist impressions and layout studies.
                                        </p>
                                </Reveal>

                                <div className="mt-12 flex flex-wrap gap-2">
                                        {CATS.map((c) => (
                                                <button
                                                        key={c}
                                                        type="button"
                                                        data-testid={`gallery-filter-${c.toLowerCase().replace(' ', '-')}`}
                                                        onClick={() => setCat(c)}
                                                        className={`border px-5 py-2 text-[0.65rem] uppercase tracking-[0.28em] transition-colors ${
                                                                cat === c
                                                                        ? 'border-gold bg-gold text-ink'
                                                                        : 'border-[rgba(201,162,75,0.3)] text-ivory-dim hover:border-gold hover:text-ivory'
                                                        }`}
                                                >
                                                        {c}
                                                </button>
                                        ))}
                                </div>

                                <div
                                        data-testid={GALLERY_PAGE.grid}
                                        className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3"
                                >
                                        {filtered.map((img, i) => (
                                                <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setActive(img)}
                                                        data-testid={`gallery-item-${i}`}
                                                        className="group mb-6 block w-full break-inside-avoid overflow-hidden border border-[rgba(201,162,75,0.2)] text-left"
                                                >
                                                        <div className="relative overflow-hidden">
                                                                <img
                                                                        src={img.src}
                                                                        alt={img.title}
                                                                        className="w-full transition-transform duration-[1.6s] group-hover:scale-105"
                                                                        loading="lazy"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                                                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                                                        <div className="micro-label">{img.cat}</div>
                                                                        <div className="mt-1 font-display text-sm tracking-[0.14em] text-ivory">
                                                                                {img.title}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </button>
                                        ))}
                                </div>
                        </section>

                        <AnimatePresence>
                                {active && (
                                        <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 backdrop-blur-md p-6"
                                                onClick={() => setActive(null)}
                                        >
                                                <button
                                                        className="absolute right-6 top-6 text-ivory-dim hover:text-ivory"
                                                        onClick={() => setActive(null)}
                                                        aria-label="Close"
                                                >
                                                        <X size={28} />
                                                </button>
                                                <motion.img
                                                        initial={{ scale: 0.95 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0.95 }}
                                                        src={active.src}
                                                        alt={active.title}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="max-h-[85vh] max-w-[90vw] object-contain border border-[rgba(201,162,75,0.4)]"
                                                />
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </div>
        );
}
