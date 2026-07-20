import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { submitBrochureRequest } from '@/lib/api';
import { BROCHURE } from '@/constants/testIds';

// Gated brochure download modal. Captures a lead then serves the PDF.
export default function BrochureModal({ open, onClose }) {
        const [form, setForm] = useState({ name: '', phone: '', email: '' });
        const [submitting, setSubmitting] = useState(false);
        const [ready, setReady] = useState(false);
        const [error, setError] = useState('');

        const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

        const submit = async (e) => {
                e.preventDefault();
                if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
                        setError('Please fill all fields.');
                        return;
                }
                setError('');
                setSubmitting(true);
                try {
                        await submitBrochureRequest(form);
                        setReady(true);
                } catch {
                        setError('Please try again in a moment.');
                } finally {
                        setSubmitting(false);
                }
        };

        const reset = () => {
                setForm({ name: '', phone: '', email: '' });
                setReady(false);
                setError('');
                onClose?.();
        };

        const inputCls =
                'w-full border-b border-[rgba(201,162,75,0.3)] bg-transparent px-1 py-3 text-sm text-ivory placeholder:text-ivory-dim/60 focus:border-gold focus:outline-none';

        return (
                <AnimatePresence>
                        {open && (
                                <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/85 backdrop-blur-md px-6"
                                        onClick={reset}
                                >
                                        <motion.div
                                                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                                data-testid={BROCHURE.modal}
                                                onClick={(e) => e.stopPropagation()}
                                                className="relative w-full max-w-xl border border-[rgba(201,162,75,0.4)] bg-obsidian p-10 md:p-14"
                                        >
                                                <button
                                                        onClick={reset}
                                                        data-testid={BROCHURE.closeButton}
                                                        className="absolute right-5 top-5 text-ivory-dim hover:text-ivory"
                                                        aria-label="Close"
                                                >
                                                        <X size={20} />
                                                </button>

                                                {!ready ? (
                                                        <>
                                                                <div className="micro-label mb-4">Reserved · By Invitation</div>
                                                                <h3 className="font-display text-3xl tracking-[0.14em] text-ivory">
                                                                        THE VIEW <span className="gold-foil-text">BROCHURE</span>
                                                                </h3>
                                                                <p className="mt-4 font-serif-elegant text-lg italic text-ivory-dim">
                                                                        Please share your details to receive the private brochure ,
                                                                        floor plans, master layout, pricing on request.
                                                                </p>

                                                                <form onSubmit={submit} className="mt-10 space-y-6">
                                                                        <input
                                                                                data-testid={BROCHURE.nameInput}
                                                                                value={form.name}
                                                                                onChange={update('name')}
                                                                                placeholder="Full name"
                                                                                className={inputCls}
                                                                        />
                                                                        <input
                                                                                data-testid={BROCHURE.phoneInput}
                                                                                value={form.phone}
                                                                                onChange={update('phone')}
                                                                                placeholder="Phone"
                                                                                className={inputCls}
                                                                        />
                                                                        <input
                                                                                data-testid={BROCHURE.emailInput}
                                                                                value={form.email}
                                                                                onChange={update('email')}
                                                                                type="email"
                                                                                placeholder="Email"
                                                                                className={inputCls}
                                                                        />
                                                                        {error && (
                                                                                <p className="text-xs text-red-400/90">{error}</p>
                                                                        )}
                                                                        <button
                                                                                data-testid={BROCHURE.submitButton}
                                                                                type="submit"
                                                                                disabled={submitting}
                                                                                className="group inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3 text-[0.7rem] uppercase tracking-[0.32em] text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                                                                        >
                                                                                <span>{submitting ? 'Preparing…' : 'Receive Brochure'}</span>
                                                                                <span className="h-px w-6 bg-ink transition-all group-hover:w-10" />
                                                                        </button>
                                                                </form>
                                                        </>
                                                ) : (
                                                        <div className="text-center">
                                                                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
                                                                        ✓
                                                                </div>
                                                                <h3 className="font-display text-2xl tracking-[0.14em] text-ivory">
                                                                        YOUR BROCHURE IS <span className="gold-foil-text">READY</span>
                                                                </h3>
                                                                <p className="mt-3 font-serif-elegant text-lg italic text-ivory-dim">
                                                                        Thank you, {form.name.split(' ')[0]}. Enjoy your preview.
                                                                </p>
                                                                <a
                                                                        data-testid={BROCHURE.downloadLink}
                                                                        href="/assets/brochure.pdf"
                                                                        download="TheView-Brochure.pdf"
                                                                        className="mt-8 inline-flex items-center gap-3 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3 text-[0.7rem] uppercase tracking-[0.32em] text-ink"
                                                                >
                                                                        <Download size={14} />
                                                                        Download PDF
                                                                </a>
                                                        </div>
                                                )}
                                        </motion.div>
                                </motion.div>
                        )}
                </AnimatePresence>
        );
}
