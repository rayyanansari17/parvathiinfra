'use client';

// Bottom chapter rail: 10 thumbnails, current node in a gold ring.
export default function ChapterRail({ nodes, index, onJump }) {
        return (
                <div
                        data-testid="tour-chapter-rail"
                        className="pointer-events-auto fixed inset-x-0 bottom-0 z-[85] border-t border-[rgba(201,162,75,0.2)] bg-ink/70 backdrop-blur-md"
                >
                        <div
                                className="scrollbar-none flex gap-2 overflow-x-auto px-3 py-3 md:justify-center md:gap-3 md:px-6 md:py-4"
                                data-lenis-prevent
                        >
                                {nodes.map((n, i) => {
                                        const active = i === index;
                                        return (
                                                <button
                                                        key={n.id}
                                                        type="button"
                                                        onClick={() => onJump(i)}
                                                        data-testid={`tour-chapter-${i}`}
                                                        aria-label={`Jump to ${n.title}`}
                                                        aria-current={active}
                                                        className="group flex shrink-0 flex-col items-center gap-1.5"
                                                >
                                                        <span
                                                                className={`relative block h-11 w-16 overflow-hidden border transition-all md:h-12 md:w-20 ${
                                                                        active
                                                                                ? 'border-gold shadow-[0_0_0_2px_rgba(201,162,75,0.35)]'
                                                                                : 'border-[rgba(201,162,75,0.25)] opacity-60 hover:opacity-100'
                                                                }`}
                                                        >
                                                                <img
                                                                        src={n.image}
                                                                        alt=""
                                                                        aria-hidden
                                                                        className="h-full w-full object-cover"
                                                                        loading="lazy"
                                                                />
                                                        </span>
                                                        <span
                                                                className={`hidden text-center text-[0.55rem] uppercase tracking-[0.16em] transition-colors md:block ${
                                                                        active ? 'text-gold' : 'text-ivory-dim/70 group-hover:text-ivory-dim'
                                                                }`}
                                                        >
                                                                {n.title}
                                                        </span>
                                                </button>
                                        );
                                })}
                        </div>
                </div>
        );
}
