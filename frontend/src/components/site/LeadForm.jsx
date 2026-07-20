import { useState } from 'react';
import { submitLead } from '@/lib/api';
import { LEAD } from '@/constants/testIds';

export default function LeadForm({ variant = 'dark', source = 'website', title, subtitle }) {
        const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
        const [submitting, setSubmitting] = useState(false);
        const [done, setDone] = useState(false);
        const [error, setError] = useState('');

        const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

        const submit = async (e) => {
                e.preventDefault();
                if (!form.name.trim() || !form.phone.trim()) {
                        setError('Name and phone are required.');
                        return;
                }
                setError('');
                setSubmitting(true);
                try {
                        await submitLead({ ...form, source, project_interested: 'THE VIEW' });
                        setDone(true);
                } catch {
                        setError('Something went wrong. Please try again or WhatsApp us.');
                } finally {
                        setSubmitting(false);
                }
        };

        const inputCls =
                'w-full border-b border-[rgba(201,162,75,0.25)] bg-transparent px-1 py-3 text-sm text-ivory placeholder:text-ivory-dim/60 focus:border-gold focus:outline-none transition-colors';

        if (done) {
                return (
                        <div
                                data-testid={LEAD.successState}
                                className="border border-[rgba(201,162,75,0.4)] bg-obsidian-2 p-10 text-center"
                        >
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold text-gold">
                                        ✓
                                </div>
                                <div className="font-display text-xl tracking-[0.18em] text-ivory">
                                        THANK YOU
                                </div>
                                <p className="mt-3 font-serif-elegant text-lg italic text-ivory-dim">
                                        Our concierge will reach out shortly to arrange your private preview.
                                </p>
                        </div>
                );
        }

        return (
                <form
                        data-testid={LEAD.form}
                        onSubmit={submit}
                        className={`space-y-6 ${variant === 'light' ? '' : ''}`}
                >
                        {title && (
                                <div>
                                        <div className="micro-label mb-2">Enquire</div>
                                        <h3 className="font-display text-2xl tracking-[0.14em] text-ivory md:text-3xl">
                                                {title}
                                        </h3>
                                        {subtitle && (
                                                <p className="mt-3 font-serif-elegant text-lg italic text-ivory-dim">
                                                        {subtitle}
                                                </p>
                                        )}
                                </div>
                        )}
                        <div className="grid gap-6 md:grid-cols-2">
                                <input
                                        data-testid={LEAD.nameInput}
                                        value={form.name}
                                        onChange={update('name')}
                                        placeholder="Full name"
                                        className={inputCls}
                                        required
                                />
                                <input
                                        data-testid={LEAD.phoneInput}
                                        value={form.phone}
                                        onChange={update('phone')}
                                        placeholder="Phone"
                                        className={inputCls}
                                        required
                                />
                        </div>
                        <input
                                data-testid={LEAD.emailInput}
                                value={form.email}
                                onChange={update('email')}
                                placeholder="Email (optional)"
                                type="email"
                                className={inputCls}
                        />
                        <textarea
                                data-testid={LEAD.messageInput}
                                value={form.message}
                                onChange={update('message')}
                                placeholder="Tell us what you’re looking for…"
                                rows={3}
                                className={`${inputCls} resize-none`}
                        />
                        {error && <p className="text-xs text-red-400/90">{error}</p>}
                        <div className="pt-2">
                                <button
                                        data-testid={LEAD.submitButton}
                                        type="submit"
                                        disabled={submitting}
                                        className="group inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3 text-[0.7rem] uppercase tracking-[0.32em] text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                                >
                                        <span>{submitting ? 'Sending…' : 'Request Private Preview'}</span>
                                        <span className="h-px w-6 bg-ink transition-all group-hover:w-10" />
                                </button>
                        </div>
                </form>
        );
}
