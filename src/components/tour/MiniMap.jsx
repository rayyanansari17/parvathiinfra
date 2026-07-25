'use client';

// Bottom-right mini-map: layout-plan thumb with a gold dot at the current
// node's approximate position. Hidden on small screens. Click jumps to the
// Master Plan node (index 9).
export default function MiniMap({ node, onOpen }) {
        if (!node) return null;
        const pos = node.miniMapPos || { x: 50, y: 50 };
        return (
                <button
                        type="button"
                        onClick={onOpen}
                        data-testid="tour-minimap"
                        aria-label="Open master plan"
                        className="pointer-events-auto fixed bottom-24 right-6 z-[84] hidden h-24 w-32 overflow-hidden border border-[rgba(201,162,75,0.4)] bg-ink/70 backdrop-blur-md transition-colors hover:border-gold lg:block"
                >
                        <img
                                src="/assets/tour/10-layout-plan.jpg"
                                alt="Master plan"
                                className="h-full w-full object-cover opacity-80"
                        />
                        <span
                                aria-hidden
                                className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-gold shadow-[0_0_8px_rgba(201,162,75,0.9)]"
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-2 py-1 text-center text-[0.55rem] uppercase tracking-[0.2em] text-ivory-dim">
                                Master Plan
                        </span>
                </button>
        );
}
