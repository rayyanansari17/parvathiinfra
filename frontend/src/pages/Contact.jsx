import { Mail, MapPin, Phone } from 'lucide-react';
import { Reveal, SectionIndex } from '@/components/site/Reveal';
import LeadForm from '@/components/site/LeadForm';
import { SITE } from '@/lib/siteData';
import { CONTACT_PAGE } from '@/constants/testIds';

export default function Contact() {
        return (
                <div data-testid={CONTACT_PAGE.root} className="bg-ink pt-28">
                        <section className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24 lg:px-24">
                                <Reveal>
                                        <SectionIndex n={1} label="Contact" />
                                        <h1 className="max-w-4xl font-display text-4xl leading-tight tracking-[0.06em] text-ivory md:text-6xl lg:text-7xl">
                                                Let’s begin a
                                                <br />
                                                <span className="gold-foil-text italic font-serif-elegant">conversation.</span>
                                        </h1>
                                </Reveal>
                        </section>

                        <section className="border-t border-[rgba(201,162,75,0.15)] bg-ink pb-32">
                                <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-20 md:grid-cols-2 md:px-12 lg:px-24">
                                        <Reveal>
                                                <div className="micro-label mb-4">Enquiry Form</div>
                                                <LeadForm source="contact_page" />
                                        </Reveal>

                                        <Reveal delay={0.1}>
                                                <div className="space-y-10">
                                                        <div>
                                                                <div className="micro-label mb-3">Site Address</div>
                                                                <div className="flex items-start gap-4">
                                                                        <MapPin className="mt-1 text-gold" size={18} />
                                                                        <p
                                                                                data-testid={CONTACT_PAGE.address}
                                                                                className="font-serif-elegant text-lg text-ivory"
                                                                        >
                                                                                {SITE.siteAddress}
                                                                        </p>
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <div className="micro-label mb-3">Office</div>
                                                                <div className="flex items-start gap-4">
                                                                        <MapPin className="mt-1 text-gold" size={18} />
                                                                        <p className="font-serif-elegant text-lg text-ivory">
                                                                                {SITE.officeAddress}
                                                                        </p>
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <div className="micro-label mb-3">Email</div>
                                                                <div className="flex items-start gap-4">
                                                                        <Mail className="mt-1 text-gold" size={18} />
                                                                        <a
                                                                                data-testid={CONTACT_PAGE.email}
                                                                                href={`mailto:${SITE.email}`}
                                                                                className="gold-underline font-serif-elegant text-lg text-ivory"
                                                                        >
                                                                                {SITE.email}
                                                                        </a>
                                                                </div>
                                                        </div>

                                                        <div>
                                                                <div className="micro-label mb-3">WhatsApp</div>
                                                                <div className="flex items-start gap-4">
                                                                        <Phone className="mt-1 text-gold" size={18} />
                                                                        <a
                                                                                href={SITE.whatsappLink}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="gold-underline font-serif-elegant text-lg text-ivory"
                                                                        >
                                                                                Message the concierge
                                                                        </a>
                                                                </div>
                                                        </div>

                                                        <div
                                                                data-testid={CONTACT_PAGE.map}
                                                                className="aspect-video overflow-hidden border border-[rgba(201,162,75,0.25)]"
                                                        >
                                                                <iframe
                                                                        title="Parvathi Infra Office"
                                                                        src="https://www.google.com/maps?q=Shamshabad,+Telangana&output=embed"
                                                                        className="h-full w-full grayscale"
                                                                        loading="lazy"
                                                                />
                                                        </div>
                                                </div>
                                        </Reveal>
                                </div>
                        </section>
                </div>
        );
}
