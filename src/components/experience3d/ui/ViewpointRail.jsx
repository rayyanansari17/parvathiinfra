'use client';

const ORDER = ['gate', 'avenue', 'clubhouse', 'amphitheatre', 'viewpoint', 'wholeSite'];

// The guided-tour spine: buttons that fly the camera to each named
// viewpoint (site3d.json → camera.viewpoints), plus a small legend.
// Sits bottom-centre, echoing the tour's ChapterRail placement/idiom.
export default function ViewpointRail({ viewpoints, active, onJump }) {
        return (
                <div
                        data-testid="exp3d-viewpoint-rail"
                        className="pointer-events-none fixed inset-x-0 bottom-0 z-[85] flex flex-col items-center gap-3 px-4 pb-4 md:pb-6"
                >
                        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 border border-[rgba(201,162,75,0.3)] bg-ink/70 p-1.5 backdrop-blur-md">
                                {ORDER.map((key) => {
                                        const vp = viewpoints[key];
                                        if (!vp) return null;
                                        return (
                                                <button
                                                        key={key}
                                                        type="button"
                                                        onClick={() => onJump(key)}
                                                        data-testid={`exp3d-viewpoint-${key}`}
                                                        aria-pressed={active === key}
                                                        className={`min-h-[38px] whitespace-nowrap px-3.5 py-2 text-[0.6rem] uppercase tracking-[0.2em] transition-colors ${
                                                                active === key
                                                                        ? 'bg-gold text-ink'
                                                                        : 'text-ivory-dim hover:bg-[rgba(201,162,75,0.12)] hover:text-ivory'
                                                        }`}
                                                >
                                                        {vp.label}
                                                </button>
                                        );
                                })}
                        </div>
                        <div className="pointer-events-auto hidden items-center gap-4 border border-[rgba(201,162,75,0.25)] bg-ink/60 px-4 py-1.5 text-[0.56rem] uppercase tracking-[0.16em] text-ivory-dim backdrop-blur-md md:flex">
                                <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 border border-gold bg-[rgba(201,162,75,0.35)]" /> Villa Plot
                                </span>
                                <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full border border-gold bg-ink" /> Amenity
                                </span>
                                <span className="flex items-center gap-1.5">
                                        <span className="h-1 w-4 bg-[#2a251d]" /> Boundary Wall
                                </span>
                                <span className="flex items-center gap-1.5">
                                        <span className="h-1 w-4 bg-[#3a2c1c]" /> Road
                                </span>
                        </div>
                </div>
        );
}
