'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

/**
 * Full-width cinematic fade carousel for the Gallery page.
 * - Embla + Fade plugin: silky crossfades (no slide)
 * - Autoplay 5.5s, stops on hover / interaction
 * - Gold caption overlay with category, title & counter
 * - Click any slide to open the parent lightbox (via onOpen prop)
 */
export default function GalleryEditorialCarousel({ slides, onOpen }) {
        const [emblaRef, emblaApi] = useEmblaCarousel(
                { loop: true, duration: 45 },
                [
                        Fade(),
                        Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true }),
                ],
        );
        const [selected, setSelected] = useState(0);

        // Stop autoplay before any manual navigation to avoid the plugin
        // race-condition where the first manual click gets swallowed.
        const stopAutoplay = useCallback(() => {
                if (!emblaApi) return;
                const autoplay = emblaApi.plugins()?.autoplay;
                if (autoplay && typeof autoplay.stop === 'function') autoplay.stop();
        }, [emblaApi]);

        const scrollPrev = useCallback(() => {
                if (!emblaApi) return;
                stopAutoplay();
                emblaApi.scrollPrev();
        }, [emblaApi, stopAutoplay]);
        const scrollNext = useCallback(() => {
                if (!emblaApi) return;
                stopAutoplay();
                emblaApi.scrollNext();
        }, [emblaApi, stopAutoplay]);
        const scrollTo = useCallback(
                (i) => {
                        if (!emblaApi) return;
                        stopAutoplay();
                        emblaApi.scrollTo(i);
                },
                [emblaApi, stopAutoplay],
        );

        useEffect(() => {
                if (!emblaApi) return undefined;
                const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
                onSelect();
                emblaApi.on('select', onSelect);
                return () => emblaApi.off('select', onSelect);
        }, [emblaApi]);

        if (!slides || slides.length === 0) return null;

        return (
                <section
                        data-testid="gallery-editorial-carousel"
                        className="relative w-full overflow-hidden border-y border-[rgba(201,162,75,0.15)] bg-obsidian"
                >
                        <div className="overflow-hidden" ref={emblaRef}>
                                <div className="flex">
                                        {slides.map((s, i) => (
                                                <div
                                                        key={i}
                                                        data-testid={`gallery-hero-slide-${i}`}
                                                        className="relative min-w-0 shrink-0 grow-0 basis-full"
                                                >
                                                        <button
                                                                type="button"
                                                                onClick={() => onOpen && onOpen(s)}
                                                                className="group relative block h-[70vh] w-full overflow-hidden md:h-[86vh]"
                                                                aria-label={`Open ${s.title}`}
                                                        >
                                                                <img
                                                                        src={s.src}
                                                                        alt={s.title}
                                                                        className="absolute inset-0 h-full w-full scale-[1.03] object-cover transition-transform duration-[6s] group-hover:scale-100"
                                                                        loading={i === 0 ? 'eager' : 'lazy'}
                                                                />
                                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                                                                <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" />
                                                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-gradient-to-b from-ink/85 to-transparent" />

                                                                {/* Caption — fades with selection to avoid mid-transition text overlap */}
                                                                <div
                                                                        className="absolute bottom-16 left-6 max-w-2xl transition-opacity duration-700 md:bottom-24 md:left-16"
                                                                        style={{ opacity: selected === i ? 1 : 0 }}
                                                                >
                                                                        <div className="micro-label mb-3 text-gold">{s.cat}</div>
                                                                        <h2 className="font-display text-3xl leading-tight tracking-[0.08em] text-ivory md:text-5xl">
                                                                                <span className="gold-foil-text">{s.title}</span>
                                                                        </h2>
                                                                        <div className="mt-6 inline-flex items-center gap-3 font-ui text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim">
                                                                                <Maximize2 size={12} className="text-gold" />
                                                                                Click to enlarge
                                                                        </div>
                                                                </div>
                                                        </button>
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* Prev / Next arrows */}
                        <button
                                type="button"
                                onClick={scrollPrev}
                                data-testid="gallery-hero-prev"
                                aria-label="Previous slide"
                                className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center border border-[rgba(201,162,75,0.4)] bg-ink/50 p-3 text-ivory-dim backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:left-8 md:flex"
                        >
                                <ChevronLeft size={18} />
                        </button>
                        <button
                                type="button"
                                onClick={scrollNext}
                                data-testid="gallery-hero-next"
                                aria-label="Next slide"
                                className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center border border-[rgba(201,162,75,0.4)] bg-ink/50 p-3 text-ivory-dim backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:right-8 md:flex"
                        >
                                <ChevronRight size={18} />
                        </button>

                        {/* Bottom rail */}
                        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 md:bottom-10">
                                {slides.map((_, i) => (
                                        <button
                                                key={i}
                                                type="button"
                                                onClick={() => scrollTo(i)}
                                                data-testid={`gallery-hero-dot-${i}`}
                                                aria-label={`Go to slide ${i + 1}`}
                                                className={`h-[2px] transition-all duration-500 ${
                                                        selected === i ? 'w-12 bg-gold' : 'w-6 bg-white/20 hover:bg-white/40'
                                                }`}
                                        />
                                ))}
                        </div>

                        {/* Counter */}
                        <div className="absolute right-6 top-6 z-10 font-ui text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim md:right-10 md:top-10">
                                <span className="text-gold">{String(selected + 1).padStart(2, '0')}</span>
                                <span className="mx-2 opacity-40">/</span>
                                <span>{String(slides.length).padStart(2, '0')}</span>
                        </div>
                </section>
        );
}
