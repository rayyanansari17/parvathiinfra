import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Play } from 'lucide-react';
import gsap from 'gsap';
import {
        AERIAL_IMG,
        PLOT_HOTSPOTS,
        PLOT_SIZES,
        AMENITY_HOTSPOTS,
        nearestAmenities,
} from '@/lib/walkthroughData';
import { submitLead } from '@/lib/api';
import { SITE } from '@/lib/siteData';

const FILTERS = [
        { k: 'all',   label: 'All' },
        { k: '166',   label: '166 sq.yd' },
        { k: '200',   label: '200 sq.yd' },
        { k: '250',   label: '250+' },
        { k: '300',   label: '300+' },
        { k: 'available', label: 'Available only' },
];

// Simple deterministic mock status — 20% sold.
const isSold = (n) => n % 5 === 0;

function bucket(size) {
        if (size >= 300) return '300';
        if (size >= 250) return '250';
        if (size >= 190 && size < 220) return '200';
        if (size < 190) return '166';
        return 'other';
}

export default function LayoutExplorer() {
        const [filter, setFilter] = useState('all');
        const [activePlot, setActivePlot] = useState(null);
        const [activeAmenity, setActiveAmenity] = useState(null);
        const [enquiryOpen, setEnquiryOpen] = useState(false);
        const mapRef = useRef(null);
        const [pin, setPin] = useState({ x: 50, y: 50 }); // guided tour pin

        const filteredPlots = useMemo(
                () =>
                        PLOT_HOTSPOTS.filter((p) => {
                                const size = PLOT_SIZES[p.n - 1];
                                if (filter === 'available') return !isSold(p.n);
                                if (filter === '166')  return bucket(size) === '166';
                                if (filter === '200')  return bucket(size) === '200';
                                if (filter === '250')  return bucket(size) === '250';
                                if (filter === '300')  return bucket(size) === '300';
                                return true;
                        }),
                [filter],
        );

        // Guided tour: fly a gold pin from amenity A → I sequentially.
        const startTour = () => {
                const tl = gsap.timeline();
                AMENITY_HOTSPOTS.forEach((a, i) => {
                        tl.to(
                                { x: pin.x, y: pin.y },
                                {
                                        x: a.x,
                                        y: a.y,
                                        duration: 1.2,
                                        ease: 'power3.inOut',
                                        onUpdate: function () {
                                                setPin({ x: this.targets()[0].x, y: this.targets()[0].y });
                                        },
                                },
                                i === 0 ? 0 : '>',
                        ).to({}, { duration: 0.9, onStart: () => setActiveAmenity(a) });
                });
        };

        return (
                <section
                        data-testid="layout-explorer"
                        className="relative w-full border-t border-[rgba(201,162,75,0.15)] bg-obsidian py-24 md:py-32"
                >
                        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
                                <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
                                        <div>
                                                <div className="micro-label mb-3">Interactive Layout</div>
                                                <h2 className="font-display text-3xl leading-tight tracking-[0.1em] text-ivory md:text-5xl">
                                                        Choose your <span className="gold-foil-text">plot</span>.
                                                </h2>
                                                <p className="mt-4 max-w-2xl font-serif-elegant text-lg italic text-ivory-dim">
                                                        45 exclusive villa plots · nine curated amenities. Hover any
                                                        plot for size and status. Click to enquire.
                                                </p>
                                        </div>
                                        <button
                                                type="button"
                                                onClick={startTour}
                                                data-testid="start-guided-tour"
                                                className="group inline-flex items-center gap-3 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-6 py-3 text-[0.7rem] uppercase tracking-[0.32em] text-ink"
                                        >
                                                <Play size={12} /> Start Guided Tour
                                        </button>
                                </div>

                                {/* Filter chips */}
                                <div className="mb-6 flex flex-wrap gap-2">
                                        {FILTERS.map((f) => (
                                                <button
                                                        key={f.k}
                                                        type="button"
                                                        onClick={() => setFilter(f.k)}
                                                        data-testid={`layout-filter-${f.k}`}
                                                        className={`border px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.28em] transition-colors ${
                                                                filter === f.k
                                                                        ? 'border-gold bg-gold text-ink'
                                                                        : 'border-[rgba(201,162,75,0.3)] text-ivory-dim hover:border-gold hover:text-ivory'
                                                        }`}
                                                >
                                                        {f.label}
                                                </button>
                                        ))}
                                </div>

                                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                                        {/* Map */}
                                        <div
                                                ref={mapRef}
                                                className="relative overflow-hidden border border-[rgba(201,162,75,0.25)] bg-ink"
                                        >
                                                <img
                                                        src={AERIAL_IMG}
                                                        alt="THE VIEW · master layout plan"
                                                        className="block w-full"
                                                />

                                                {/* Plot hotspots */}
                                                <div className="pointer-events-none absolute inset-0">
                                                        {filteredPlots.map((p) => {
                                                                const sold = isSold(p.n);
                                                                return (
                                                                        <button
                                                                                key={p.n}
                                                                                type="button"
                                                                                onClick={() => setActivePlot(p)}
                                                                                data-testid={`layout-plot-${p.n}`}
                                                                                aria-label={`Plot ${p.n} · ${PLOT_SIZES[p.n - 1]} sq.yd`}
                                                                                className="pointer-events-auto group absolute border transition-all"
                                                                                style={{
                                                                                        left: `${p.x - p.w / 2}%`,
                                                                                        top: `${p.y - p.h / 2}%`,
                                                                                        width: `${p.w}%`,
                                                                                        height: `${p.h}%`,
                                                                                        borderColor: sold
                                                                                                ? 'rgba(220,50,50,0.7)'
                                                                                                : 'rgba(201,162,75,0.75)',
                                                                                        background: sold
                                                                                                ? 'rgba(160,20,20,0.16)'
                                                                                                : 'rgba(201,162,75,0.08)',
                                                                                }}
                                                                        >
                                                                                <span className="absolute inset-0 flex items-center justify-center font-display text-[0.55rem] tracking-[0.14em] text-ivory-dim opacity-0 transition-opacity group-hover:opacity-100 md:text-[0.65rem]">
                                                                                        {p.n}
                                                                                </span>
                                                                                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden -translate-x-1/2 whitespace-nowrap border border-[rgba(201,162,75,0.5)] bg-ink/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.24em] text-ivory backdrop-blur-md group-hover:block">
                                                                                        Plot {p.n} · {PLOT_SIZES[p.n - 1]} sq.yd ·{' '}
                                                                                        <span className={sold ? 'text-red-400' : 'text-gold'}>
                                                                                                {sold ? 'Sold' : 'Available'}
                                                                                        </span>
                                                                                </span>
                                                                        </button>
                                                                );
                                                        })}
                                                </div>

                                                {/* Amenity pins */}
                                                <div className="pointer-events-none absolute inset-0">
                                                        {AMENITY_HOTSPOTS.map((a) => (
                                                                <button
                                                                        key={a.code}
                                                                        type="button"
                                                                        onClick={() => setActiveAmenity(a)}
                                                                        data-testid={`layout-amenity-${a.code}`}
                                                                        aria-label={`${a.code} · ${a.name}`}
                                                                        className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
                                                                        style={{ left: `${a.x}%`, top: `${a.y}%` }}
                                                                >
                                                                        <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-gold bg-ink text-[0.6rem] font-display tracking-[0.06em] text-gold shadow-[0_0_10px_rgba(201,162,75,0.5)]">
                                                                                {a.code}
                                                                                <span className="absolute inset-0 animate-ping rounded-full border border-gold opacity-40" />
                                                                        </span>
                                                                </button>
                                                        ))}
                                                        {/* Guided-tour pin */}
                                                        <div
                                                                aria-hidden
                                                                className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity"
                                                                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                                                        >
                                                                <MapPin
                                                                        size={22}
                                                                        className="text-gold drop-shadow-[0_0_10px_rgba(201,162,75,0.85)]"
                                                                />
                                                        </div>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-[rgba(201,162,75,0.15)] bg-ink px-5 py-3 text-[0.6rem] uppercase tracking-[0.28em]">
                                                        <div className="flex items-center gap-5 text-ivory-dim">
                                                                <span className="flex items-center gap-2">
                                                                        <span className="h-3 w-3 border border-gold bg-[rgba(201,162,75,0.15)]" />{' '}
                                                                        Available
                                                                </span>
                                                                <span className="flex items-center gap-2">
                                                                        <span className="h-3 w-3 border border-red-500 bg-red-900/40" />{' '}
                                                                        Sold
                                                                </span>
                                                        </div>
                                                        <div className="text-ivory-dim/70">
                                                                Showing {filteredPlots.length} of {PLOT_HOTSPOTS.length} plots
                                                        </div>
                                                </div>
                                        </div>

                                        {/* Right panel · amenity legend + list */}
                                        <div className="space-y-6">
                                                <div className="border border-[rgba(201,162,75,0.25)] bg-obsidian-2 p-6">
                                                        <div className="micro-label mb-4">Amenity Legend</div>
                                                        <ul className="grid grid-cols-2 gap-2">
                                                                {AMENITY_HOTSPOTS.map((a) => (
                                                                        <li key={a.code}>
                                                                                <button
                                                                                        type="button"
                                                                                        onClick={() => setActiveAmenity(a)}
                                                                                        className="group flex w-full items-center gap-2 text-left text-[0.7rem] uppercase tracking-[0.18em] text-ivory-dim hover:text-ivory"
                                                                                >
                                                                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold text-[0.55rem] font-display text-gold">
                                                                                                {a.code}
                                                                                        </span>
                                                                                        <span>{a.name}</span>
                                                                                </button>
                                                                        </li>
                                                                ))}
                                                        </ul>
                                                </div>

                                                {/* Scrollable plot list (mobile-friendly companion) */}
                                                <div className="border border-[rgba(201,162,75,0.25)] bg-obsidian-2 p-6">
                                                        <div className="micro-label mb-4">Plot List</div>
                                                        <div className="max-h-72 overflow-y-auto pr-2" data-lenis-prevent>
                                                                <ul className="grid grid-cols-3 gap-2">
                                                                        {filteredPlots.map((p) => {
                                                                                const sold = isSold(p.n);
                                                                                return (
                                                                                        <li key={p.n}>
                                                                                                <button
                                                                                                        type="button"
                                                                                                        onClick={() => setActivePlot(p)}
                                                                                                        data-testid={`plot-list-${p.n}`}
                                                                                                        className={`flex w-full items-center justify-between border px-2 py-1.5 text-[0.62rem] uppercase tracking-[0.14em] transition-colors ${
                                                                                                                sold
                                                                                                                        ? 'border-red-500/40 text-red-300/80 line-through'
                                                                                                                        : 'border-[rgba(201,162,75,0.3)] text-ivory-dim hover:border-gold hover:text-ivory'
                                                                                                        }`}
                                                                                                >
                                                                                                        <span>{String(p.n).padStart(2, '0')}</span>
                                                                                                        <span className="text-gold">{PLOT_SIZES[p.n - 1]}</span>
                                                                                                </button>
                                                                                        </li>
                                                                                );
                                                                        })}
                                                                </ul>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </div>

                        {/* Plot side panel */}
                        <AnimatePresence>
                                {activePlot && (
                                        <PlotPanel
                                                plot={activePlot}
                                                onClose={() => setActivePlot(null)}
                                                onEnquire={() => setEnquiryOpen(true)}
                                        />
                                )}
                        </AnimatePresence>

                        {/* Amenity side panel */}
                        <AnimatePresence>
                                {activeAmenity && (
                                        <AmenityPanel
                                                amenity={activeAmenity}
                                                onClose={() => setActiveAmenity(null)}
                                        />
                                )}
                        </AnimatePresence>

                        {/* Prefilled enquiry modal */}
                        <AnimatePresence>
                                {enquiryOpen && activePlot && (
                                        <EnquiryModal
                                                plot={activePlot}
                                                onClose={() => setEnquiryOpen(false)}
                                        />
                                )}
                        </AnimatePresence>
                </section>
        );
}

// ------------------------------------------------------------------
// PlotPanel — side drawer with plot detail + Enquire CTA.
// ------------------------------------------------------------------
function PlotPanel({ plot, onClose, onEnquire }) {
        const size = PLOT_SIZES[plot.n - 1];
        const sold = isSold(plot.n);
        const nearby = nearestAmenities(plot.n);
        return (
                <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="plot-panel"
                        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-[rgba(201,162,75,0.35)] bg-obsidian shadow-2xl"
                >
                        <div className="flex items-start justify-between border-b border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <div>
                                        <div className="micro-label">Plot Detail</div>
                                        <div className="mt-2 font-display text-3xl tracking-[0.1em] text-ivory">
                                                <span className="gold-foil-text">
                                                        {String(plot.n).padStart(2, '0')}
                                                </span>
                                        </div>
                                </div>
                                <button
                                        type="button"
                                        onClick={onClose}
                                        data-testid="plot-panel-close"
                                        className="text-ivory-dim hover:text-ivory"
                                >
                                        <X size={20} />
                                </button>
                        </div>
                        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6" data-lenis-prevent>
                                <div className="grid grid-cols-2 gap-4">
                                        <Cell label="Size">{size} sq. yd</Cell>
                                        <Cell label="Facing">{plot.facing}</Cell>
                                        <Cell label="Status">
                                                <span className={sold ? 'text-red-400' : 'text-gold'}>
                                                        {sold ? 'Reserved' : 'Available'}
                                                </span>
                                        </Cell>
                                        <Cell label="Vastu">100% compliant</Cell>
                                </div>
                                <div>
                                        <div className="micro-label mb-3">Nearest Amenities</div>
                                        <ul className="space-y-2 text-sm text-ivory">
                                                {nearby.map((n) => (
                                                        <li key={n} className="flex items-center gap-3">
                                                                <span className="h-px w-6 bg-gold" /> {n}
                                                        </li>
                                                ))}
                                        </ul>
                                </div>
                                <p className="font-serif-elegant text-base italic text-ivory-dim">
                                        A private ridgeline plot with the same registry standard, engineering
                                        and 24×7 security that defines every Parvathi Infra address.
                                </p>
                        </div>
                        <div className="border-t border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <button
                                        type="button"
                                        onClick={onEnquire}
                                        disabled={sold}
                                        data-testid="plot-panel-enquire"
                                        className="group w-full border border-[rgba(201,162,75,0.5)] bg-gold-foil px-6 py-3 text-[0.7rem] uppercase tracking-[0.32em] text-ink disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                        {sold ? 'Reserved' : `Enquire about Plot ${plot.n}`}
                                </button>
                                <a
                                        href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
                                                `Hello Parvathi Infra, I am interested in Plot ${plot.n} (${size} sq.yd) at THE VIEW.`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-testid="plot-panel-whatsapp"
                                        className="mt-4 block text-center gold-underline text-[0.65rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                >
                                        Ask on WhatsApp
                                </a>
                        </div>
                </motion.aside>
        );
}

function Cell({ label, children }) {
        return (
                <div className="border border-[rgba(201,162,75,0.2)] bg-obsidian-2 p-4">
                        <div className="micro-label mb-2">{label}</div>
                        <div className="font-display text-lg tracking-[0.08em] text-ivory">{children}</div>
                </div>
        );
}

// ------------------------------------------------------------------
// AmenityPanel — side drawer with amenity detail.
// ------------------------------------------------------------------
function AmenityPanel({ amenity, onClose }) {
        return (
                <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        data-testid="amenity-panel"
                        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-[rgba(201,162,75,0.35)] bg-obsidian shadow-2xl"
                >
                        <div className="flex items-start justify-between border-b border-[rgba(201,162,75,0.2)] px-6 py-5">
                                <div>
                                        <div className="micro-label">Amenity {amenity.code}</div>
                                        <div className="mt-2 font-display text-2xl tracking-[0.1em] text-ivory">
                                                <span className="gold-foil-text">{amenity.name}</span>
                                        </div>
                                </div>
                                <button
                                        type="button"
                                        onClick={onClose}
                                        data-testid="amenity-panel-close"
                                        className="text-ivory-dim hover:text-ivory"
                                >
                                        <X size={20} />
                                </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-6" data-lenis-prevent>
                                <div className="mb-6 aspect-video overflow-hidden border border-[rgba(201,162,75,0.25)] bg-obsidian-2">
                                        <img
                                                src={AERIAL_IMG}
                                                alt={amenity.name}
                                                className="h-full w-full object-cover opacity-70"
                                        />
                                </div>
                                <p className="font-serif-elegant text-lg italic leading-relaxed text-ivory">
                                        {amenity.blurb}
                                </p>
                        </div>
                </motion.aside>
        );
}

// ------------------------------------------------------------------
// EnquiryModal — prefilled lead capture.
// ------------------------------------------------------------------
function EnquiryModal({ plot, onClose }) {
        const [form, setForm] = useState({ name: '', phone: '', email: '' });
        const [submitting, setSubmitting] = useState(false);
        const [done, setDone] = useState(false);
        const [err, setErr] = useState('');
        const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

        const submit = async (e) => {
                e.preventDefault();
                if (!form.name.trim() || !form.phone.trim()) {
                        setErr('Name and phone are required.');
                        return;
                }
                setErr('');
                setSubmitting(true);
                try {
                        await submitLead({
                                name: form.name,
                                phone: form.phone,
                                email: form.email,
                                project_interested: 'THE VIEW',
                                message: `Interested in Plot ${plot.n} (${PLOT_SIZES[plot.n - 1]} sq.yd)`,
                                source: `walkthrough_plot_${plot.n}`,
                        });
                        setDone(true);
                } catch {
                        setErr('Please try again in a moment.');
                } finally {
                        setSubmitting(false);
                }
        };
        const inputCls =
                'w-full border-b border-[rgba(201,162,75,0.3)] bg-transparent px-1 py-3 text-sm text-ivory placeholder:text-ivory-dim/60 focus:border-gold focus:outline-none';

        return (
                <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 backdrop-blur-md px-6"
                        onClick={onClose}
                >
                        <motion.div
                                initial={{ y: 24, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 24, opacity: 0 }}
                                data-testid="plot-enquiry-modal"
                                onClick={(e) => e.stopPropagation()}
                                className="relative w-full max-w-lg border border-[rgba(201,162,75,0.4)] bg-obsidian p-10 md:p-12"
                        >
                                <button
                                        type="button"
                                        onClick={onClose}
                                        data-testid="plot-enquiry-close"
                                        className="absolute right-5 top-5 text-ivory-dim hover:text-ivory"
                                >
                                        <X size={18} />
                                </button>

                                {!done ? (
                                        <>
                                                <div className="micro-label mb-2">Reserve · By Appointment</div>
                                                <h3 className="font-display text-2xl tracking-[0.12em] text-ivory md:text-3xl">
                                                        Enquire about{' '}
                                                        <span className="gold-foil-text">Plot {plot.n}</span>
                                                </h3>
                                                <p className="mt-3 font-serif-elegant text-base italic text-ivory-dim">
                                                        {PLOT_SIZES[plot.n - 1]} sq.yd · Vastu compliant · 100% approvals in
                                                        order.
                                                </p>
                                                <form onSubmit={submit} className="mt-8 space-y-6">
                                                        <input
                                                                data-testid="plot-enquiry-name"
                                                                value={form.name}
                                                                onChange={update('name')}
                                                                placeholder="Full name"
                                                                className={inputCls}
                                                        />
                                                        <input
                                                                data-testid="plot-enquiry-phone"
                                                                value={form.phone}
                                                                onChange={update('phone')}
                                                                placeholder="Phone"
                                                                className={inputCls}
                                                        />
                                                        <input
                                                                data-testid="plot-enquiry-email"
                                                                value={form.email}
                                                                onChange={update('email')}
                                                                type="email"
                                                                placeholder="Email (optional)"
                                                                className={inputCls}
                                                        />
                                                        {err && <p className="text-xs text-red-400/90">{err}</p>}
                                                        <button
                                                                data-testid="plot-enquiry-submit"
                                                                type="submit"
                                                                disabled={submitting}
                                                                className="w-full border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3 text-[0.7rem] uppercase tracking-[0.32em] text-ink disabled:opacity-60"
                                                        >
                                                                {submitting ? 'Sending…' : `Enquire about Plot ${plot.n}`}
                                                        </button>
                                                </form>
                                        </>
                                ) : (
                                        <div className="py-6 text-center">
                                                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-gold text-gold">
                                                        ✓
                                                </div>
                                                <div className="font-display text-xl tracking-[0.14em] text-ivory">
                                                        THANK YOU
                                                </div>
                                                <p className="mt-3 font-serif-elegant text-lg italic text-ivory-dim">
                                                        Our concierge will call about Plot {plot.n} shortly.
                                                </p>
                                        </div>
                                )}
                        </motion.div>
                </motion.div>
        );
}
