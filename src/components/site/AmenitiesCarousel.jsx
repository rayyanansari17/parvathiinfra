'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AMENITIES } from '@/lib/siteData';

/**
 * Premium editorial carousel for the AMENITIES section on THE VIEW page.
 * - Embla with 3/2/1 slides across desktop/tablet/mobile
 * - Autoplay (6s), stops on user interaction
 * - Prev/Next gold arrows + numbered pagination
 * - Each card: hi-res image + gold hover glow + numbered index
 */
export default function AmenitiesCarousel() {
        const [emblaRef, emblaApi] = useEmblaCarousel(
                {
                        loop: true,
                        align: 'start',
                        containScroll: 'trimSnaps',
                        dragFree: false,
                        skipSnaps: false,
                },
                [Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })],
        );

        const [selected, setSelected] = useState(0);
        const [snapCount, setSnapCount] = useState(0);

        const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
        const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
        const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

        useEffect(() => {
                if (!emblaApi) return undefined;
                const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
                const onInit = () => setSnapCount(emblaApi.scrollSnapList().length);
                onInit();
                onSelect();
                emblaApi.on('select', onSelect);
                emblaApi.on('reInit', () => {
                        onInit();
                        onSelect();
                });
                return () => {
                        emblaApi.off('select', onSelect);
                };
        }, [emblaApi]);

        return (
                <div className="relative mt-16" data-testid="amenities-carousel">
                        {/* Viewport */}
                        <div className="overflow-hidden" ref={emblaRef} data-testid="amenities-carousel-viewport">
                                <div className="flex -ml-6 md:-ml-8">
                                        {AMENITIES.map((a, i) => (
                                                <div
                                                        key={a.title}
                                                        data-testid={`amenity-slide-${i}`}
                                                        className="min-w-0 shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 md:pl-8 lg:basis-1/3"
                                                >
                                                        <article className="group relative h-full overflow-hidden border border-[rgba(201,162,75,0.22)] bg-obsidian-2 transition-colors duration-500 hover:border-gold">
                                                                {/* Image */}
                                                                <div className="relative aspect-[4/3] overflow-hidden">
                                                                        <img
                                                                                src={a.image}
                                                                                alt={a.title}
                                                                                loading="lazy"
                                                                                className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
                                                                        />
                                                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                                                                        <div className="pointer-events-none absolute inset-0 grain-overlay opacity-30" />
                                                                        <div className="absolute left-6 top-6 font-display text-[0.65rem] tracking-[0.34em] text-gold">
                                                                                0{String(i + 1).padStart(2, '0')}
                                                                        </div>
                                                                </div>
                                                                {/* Copy */}
                                                                <div className="p-8">
                                                                        <h3 className="font-display text-xl leading-snug tracking-[0.14em] text-ivory">
                                                                                <span className="gold-underline">{a.title}</span>
                                                                        </h3>
                                                                        <p className="mt-4 font-serif-elegant text-base italic leading-relaxed text-ivory-dim">
                                                                                {a.copy}
                                                                        </p>
                                                                </div>
                                                                {/* Gold sweep on hover */}
                                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-700 group-hover:scale-x-100" />
                                                        </article>
                                                </div>
                                        ))}
                                </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
                                <div className="flex items-center gap-3">
                                        <button
                                                type="button"
                                                onClick={scrollPrev}
                                                data-testid="amenities-carousel-prev"
                                                aria-label="Previous amenity"
                                                className="group flex h-11 w-11 items-center justify-center border border-[rgba(201,162,75,0.4)] text-ivory-dim transition-colors hover:border-gold hover:text-gold"
                                        >
                                                <ChevronLeft size={16} />
                                        </button>
                                        <button
                                                type="button"
                                                onClick={scrollNext}
                                                data-testid="amenities-carousel-next"
                                                aria-label="Next amenity"
                                                className="group flex h-11 w-11 items-center justify-center border border-[rgba(201,162,75,0.4)] text-ivory-dim transition-colors hover:border-gold hover:text-gold"
                                        >
                                                <ChevronRight size={16} />
                                        </button>
                                        <div className="ml-4 font-ui text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim">
                                                <span className="text-gold">{String(selected + 1).padStart(2, '0')}</span>
                                                <span className="mx-2 opacity-40">/</span>
                                                <span>{String(snapCount || AMENITIES.length).padStart(2, '0')}</span>
                                        </div>
                                </div>

                                <div className="flex items-center gap-2">
                                        {Array.from({ length: snapCount || AMENITIES.length }).map((_, i) => (
                                                <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => scrollTo(i)}
                                                        data-testid={`amenities-dot-${i}`}
                                                        aria-label={`Go to slide ${i + 1}`}
                                                        className={`h-[3px] transition-all duration-500 ${
                                                                selected === i ? 'w-10 bg-gold' : 'w-6 bg-white/15 hover:bg-white/30'
                                                        }`}
                                                />
                                        ))}
                                </div>
                        </div>
                </div>
        );
}
