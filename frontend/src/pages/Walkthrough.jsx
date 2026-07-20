import { Link } from 'react-router-dom';
import WalkthroughFilm from '@/components/site/WalkthroughFilm';
import LayoutExplorer from '@/components/site/LayoutExplorer';

/**
 * /the-view/walkthrough
 * Two linked modes on one page:
 *   Mode 1 · Cinematic scroll-scrubbed film (WalkthroughFilm)
 *   Mode 2 · Interactive layout explorer (LayoutExplorer)
 */
export default function Walkthrough() {
        return (
                <div data-testid="walkthrough-page" className="bg-ink">
                        <WalkthroughFilm />
                        <LayoutExplorer />

                        {/* Bottom CTA */}
                        <section className="border-t border-[rgba(201,162,75,0.15)] bg-ink py-24 md:py-32">
                                <div className="mx-auto max-w-[900px] px-6 text-center md:px-12">
                                        <div className="micro-label mb-4">The Next Step</div>
                                        <h2 className="font-display text-3xl leading-tight tracking-[0.1em] text-ivory md:text-5xl">
                                                Book a private preview,{' '}
                                                <span className="gold-foil-text">before the city arrives.</span>
                                        </h2>
                                        <p className="mt-6 max-w-xl mx-auto font-serif-elegant text-lg italic text-ivory-dim">
                                                Chauffeured site visits by appointment. A quiet plot chosen for
                                                you before it changes hands.
                                        </p>
                                        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                                                <Link
                                                        to="/contact"
                                                        data-testid="walkthrough-book-visit"
                                                        className="group inline-flex items-center gap-4 border border-[rgba(201,162,75,0.5)] bg-gold-foil px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.32em] text-ink"
                                                >
                                                        Book a Site Visit
                                                        <span className="h-px w-6 bg-ink transition-all group-hover:w-10" />
                                                </Link>
                                                <Link
                                                        to="/the-view"
                                                        className="gold-underline text-[0.7rem] uppercase tracking-[0.32em] text-ivory-dim hover:text-ivory"
                                                >
                                                        ← Back to The View
                                                </Link>
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
