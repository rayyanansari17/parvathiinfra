// Central site data / constants · safe to import anywhere.

export const SITE = {
        brand: 'Parvathi Infra Developers',
        flagship: 'THE VIEW',
        tagline: 'A Scenic Address for a Selective Few',
        phoneDisplay: '+91 90000 00000',
        phoneLink: 'tel:+919000000000',
        whatsappNumber: '919000000000', // TODO: replace with real number
        whatsappLink: 'https://wa.me/919000000000?text=Hello%20Parvathi%20Infra%20-%20I%20am%20interested%20in%20THE%20VIEW',
        email: 'infraparvathi@gmail.com',
        officeAddress:
                'Brindavan Colony, Ootapally Village, near Tondupally Toll Gate, Shamshabad, Telangana',
        siteAddress: 'Kadthal, near Srisailam Highway, Telangana',
};

export const CONNECTIVITY = [
        { time: '1', unit: 'min', place: 'Srisailam Highway' },
        { time: '6', unit: 'min', place: 'Regional Ring Road' },
        { time: '15', unit: 'min', place: '6-Lane NH to Tirupati' },
        { time: '25', unit: 'min', place: 'Proposed 4th City & Amazon DC' },
        { time: '35', unit: 'min', place: 'Fab City' },
        { time: '45', unit: 'min', place: 'RGI Airport' },
        { time: '50', unit: 'min', place: 'Foxconn' },
];

export const AMENITIES = [
        { title: 'Grand Clubhouse', copy: '2,220 sq.ft. of curated indulgence · lounge, gym & indoor games.' },
        { title: 'Swimming Pool', copy: 'Signature pool and a private kids’ pool wrapped in landscape.' },
        { title: 'Amphitheatre', copy: 'A stage under the stars for cinema evenings and soirées.' },
        { title: 'Landscaped Parks', copy: 'Manicured green pockets with gazebos, granite seating and pathways.' },
        { title: 'Children’s Play Area', copy: 'Safe, soft-scaped play zones for the little ones.' },
        { title: 'Senior Citizens Area', copy: 'Quiet, shaded corners for tranquil mornings.' },
        { title: 'Party Lawn', copy: 'A private lawn for milestone celebrations.' },
        { title: '24×7 Security', copy: 'CC-camera surveillance, gated entry and dedicated patrols.' },
];

export const INFRASTRUCTURE = [
        'Elegant Entrance Gate',
        '30 ft. CC Roads',
        'Underground Drainage',
        'Underground Water Line',
        'Overhead Water Tank',
        'Water Connection per Plot',
        'Plantation per Plot',
        'Street Lights',
];

export const STATS = [
        { value: '3.6', suffix: 'Acres', label: 'Total Extent' },
        { value: '45', suffix: 'Plots', label: 'Villa Plots' },
        { value: '200-388', suffix: 'sq.yd', label: 'Plot Sizes' },
        { value: '100%', suffix: 'Vastu', label: 'Compliant Layout' },
];

export const APPROVALS = ['TG RERA', 'HMDA', 'Clear Title', '100% Vastu'];

export const FAQS = [
        {
                q: 'Is THE VIEW RERA approved?',
                a: 'Yes. THE VIEW is registered with the Telangana State Real Estate Regulatory Authority (TG RERA) and enjoys HMDA approval with clear title on all 45 plots.',
        },
        {
                q: 'What are the available plot sizes?',
                a: 'Plot sizes range from approximately 200 sq. yards to 388 sq. yards. Every plot is 100% Vastu-compliant.',
        },
        {
                q: 'How far is the airport from the site?',
                a: 'RGI Airport is approximately 45 minutes drive. The Srisailam Highway is a 1-minute drive from our entrance gate.',
        },
        {
                q: 'What amenities are included?',
                a: 'A 2,220 sq.ft. clubhouse, swimming pool with kids’ pool, amphitheatre, landscaped parks, party lawn, children’s play zones, senior citizens area, 30 ft. CC roads, underground drainage, and 24×7 security.',
        },
        {
                q: 'How do I book a site visit?',
                a: 'Simply share your details via our concierge chat, request the brochure, or write to us at infraparvathi@gmail.com. Our team will arrange a chauffeured site visit at your convenience.',
        },
];

export const BROCHURE_PAGES = Array.from({ length: 7 }, (_, i) =>
        `/assets/brochure/page-${String(i + 1).padStart(2, '0')}.png`,
);

export const LOGO_IMAGE = '/assets/logo-theview.jpeg';
export const MASTER_PLAN_IMAGE = '/assets/master-plan.jpeg';
export const SCALE_MODEL_IMAGE = '/assets/scale-model.jpeg';

export const STOCK = {
        heroFallback: 'https://images.pexels.com/photos/24805054/pexels-photo-24805054.jpeg',
        pool: 'https://images.unsplash.com/photo-1757439402375-2f2a4ab0dc75',
        clubhouse: 'https://images.pexels.com/photos/33529500/pexels-photo-33529500.jpeg',
        bar: 'https://images.pexels.com/photos/26729557/pexels-photo-26729557.jpeg',
        architecture: 'https://images.pexels.com/photos/2747599/pexels-photo-2747599.jpeg',
        hills: 'https://images.pexels.com/photos/5688203/pexels-photo-5688203.jpeg',
};
