// Central site data / constants · safe to import anywhere.
// Content sourced from the Parvathi Infra Developers Premium Website Brief.

export const SITE = {
        brand: 'Parvathi Infra Developers',
        tagline: 'Creating Landmarks. Building Trust.',
        subTagline: 'Premium HMDA & FCDA Approved Developments with High-Quality Infrastructure.',
        flagship: 'THE VIEW',
        founder: 'Mr. C. Goutham Yadav',
        establishedYear: '2019',
        phoneDisplay: '+91 90000 00000',
        phoneLink: 'tel:+919000000000',
        whatsappNumber: '919000000000', // TODO: replace with real number
        whatsappLink: 'https://wa.me/919000000000?text=Hello%20Parvathi%20Infra%20-%20I%20am%20interested%20in%20your%20developments',
        email: 'info@parvathiinfra.com',
        emails: {
                info: 'info@parvathiinfra.com',
                sales: 'sales@parvathiinfra.com',
                admin: 'admin@parvathiinfra.com',
        },
        officeAddress:
                'Brindavan Colony, Ootapally Village, near Tondupally Toll Gate, Shamshabad, Telangana',
        siteAddress: 'Kothur, on NH-44 (Bengaluru Highway), Telangana',
};

// Six pillars of the company — hero highlights on Home.
export const PARVATHI_HIGHLIGHTS = [
        { k: '2019', label: 'Established' },
        { k: '8+', label: 'Years of Real Estate Expertise' },
        { k: '2 Lakh+', label: 'Sq. Yards Developed & Marketed' },
        { k: 'Multiple', label: 'Successful Ventures' },
        { k: 'HMDA & FCDA', label: 'Approved Projects' },
        { k: 'Landmark', label: 'Developments with High-Quality Infrastructure' },
];

// Core operating values — 6 pillars.
export const CORE_VALUES = [
        { title: 'Integrity',      copy: 'Straight dealings, always. Every document reads the same to us as it does to you.' },
        { title: 'Trust',          copy: 'Earned across 2 Lakh+ sq. yards of delivered ventures — never claimed lightly.' },
        { title: 'Transparency',   copy: 'Clear title, clear approvals, clear conversations. No fine print in the shadows.' },
        { title: 'Excellence',     copy: 'Wide roads, underground services, avenue plantation — the fundamentals, done exactingly.' },
        { title: 'Innovation',     copy: 'Modern master planning, thoughtful landscaping and infrastructure that ages well.' },
        { title: 'Customer First', copy: 'From the site visit to the sale-deed — and years after — our concierge stays close.' },
];

// Our Journey — verbatim from the brief.
export const JOURNEY = [
        {
                year: '2019',
                title: 'Company Established',
                copy: 'Parvathi Infra Developers is founded in Hyderabad under the leadership of Mr. C. Goutham Yadav.',
        },
        {
                year: '2019–2022',
                title: 'Strategic Collaborations',
                copy: 'Landmark residential ventures with Green Homes across Chilkoor Village, Moinabad, Shankarpally, Jadcherla and Kothur — over 90,000 sq. yards marketed in a single year.',
        },
        {
                year: '2023 →',
                title: 'Independent Premium Developments',
                copy: 'Over 2 Lakh+ sq. yards successfully developed and marketed independently, culminating in flagship venture — THE VIEW at Kothur.',
        },
];

// Past & delivered projects (excludes flagship THE VIEW).
export const PAST_PROJECTS = [
        {
                id: 'airport-town',
                title: 'AIRPORT TOWN',
                sub: 'Shamshabad Corridor · Delivered',
                status: 'Delivered',
                copy: 'A tranquil residential township minutes from Rajiv Gandhi International Airport — drawn for families who value the pause between arrival and unpacking.',
        },
        {
                id: 'metro-city',
                title: 'METRO CITY',
                sub: 'Growth Corridor · Delivered',
                status: 'Delivered',
                copy: 'A masterplanned plotted community along a rapidly growing corridor, delivered with wide avenues, underground services and generous green pockets.',
        },
        {
                id: 'arokah',
                title: 'AROKAH · THE MOUNTAIN VIEW',
                sub: 'Hillside Venture',
                status: 'Delivered',
                copy: 'A rare hillside venture carved along a natural ridgeline — panoramic vantages, curated plots, and a mountain that becomes your neighbour.',
        },
];

// Strategic collaborations locations (with Green Homes).
export const COLLABORATION_LOCATIONS = [
        'Chilkoor Village',
        'Moinabad',
        'Shankarpally',
        'Jadcherla',
        'Kothur (Bengaluru Highway Corridor)',
];

// Kothur / NH-44 connectivity for THE VIEW.
export const CONNECTIVITY = [
        { time: 'On',  unit: 'NH-44', place: 'Bengaluru Highway (Direct Access)' },
        { time: '~5', unit: 'min', place: 'Maisigandi Maisamma Temple' },
        { time: '~5', unit: 'min', place: 'Pyramid Meditation Centre' },
        { time: '~30', unit: 'min', place: 'Rajiv Gandhi International Airport' },
        { time: 'Near', unit: '',   place: 'Industrial & Logistics Hubs' },
        { time: 'Adj.', unit: '',   place: 'Proposed Fourth City Growth Corridor*' },
];

// THE VIEW amenities — kept intact from previous version.
export const AMENITIES = [
        {
                title: 'Premium Entrance',
                copy: 'A signature stone gate that sets the tone the moment you arrive.',
                image: 'https://images.pexels.com/photos/33529500/pexels-photo-33529500.jpeg',
        },
        {
                title: 'Wide Blacktop Roads',
                copy: 'Generous carriageways engineered to age gracefully under Telangana skies.',
                image: 'https://images.unsplash.com/photo-1757439402375-2f2a4ab0dc75',
        },
        {
                title: 'Avenue Plantation',
                copy: 'Tree-lined avenues that grow into a canopy — the neighbourhood’s slow luxury.',
                image: 'https://images.pexels.com/photos/2747599/pexels-photo-2747599.jpeg',
        },
        {
                title: 'Landscaped Green Spaces',
                copy: 'Manicured green pockets, gazebos, and granite seating woven through the layout.',
                image: 'https://images.pexels.com/photos/5688203/pexels-photo-5688203.jpeg',
        },
        {
                title: 'Modern Street Lighting',
                copy: 'Warm, low-glare street lighting for a safe, elegant nightscape.',
                image: 'https://images.pexels.com/photos/1094072/pexels-photo-1094072.jpeg',
        },
        {
                title: 'Underground Utilities',
                copy: 'Underground drainage and water lines — infrastructure you never have to see.',
                image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
        },
        {
                title: 'Clear Legal Documentation',
                copy: 'HMDA & FCDA approved, clear title on every plot — read before you sign.',
                image: 'https://images.pexels.com/photos/26729557/pexels-photo-26729557.jpeg',
        },
        {
                title: 'Excellent Connectivity',
                copy: 'Direct access to NH-44, minutes to RGI Airport, industrial and logistics hubs.',
                image: 'https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg',
        },
];

export const INFRASTRUCTURE = [
        'Premium Entrance Gate',
        'Wide Blacktop Roads',
        'Underground Drainage',
        'Underground Water Line',
        'Modern Street Lighting',
        'Avenue Plantation per Plot',
        'HMDA & FCDA Approved',
        'Clear Legal Documentation',
];

// Stats now reflect Parvathi Infra (not just THE VIEW).
export const STATS = [
        { value: '2019',    suffix: 'Est.',      label: 'Company Founded' },
        { value: '8+',      suffix: 'Years',     label: 'Real Estate Expertise' },
        { value: '2L+',     suffix: 'Sq. Yds',   label: 'Developed & Marketed' },
        { value: '90k+',    suffix: 'Sq. Yds',   label: 'Marketed in a Single Year' },
];

// Approvals & credentials — used in the marquee.
export const APPROVALS = [
        'HMDA Approved',
        'FCDA Approved',
        'Clear Legal Title',
        '100% Vastu Compliant',
        'RERA Registered',
        'Premium Infrastructure',
        'Landmark Developments',
];

export const FAQS = [
        {
                q: 'Is THE VIEW approved?',
                a: 'Yes. THE VIEW is an HMDA and FCDA Approved Premium Venture at Kothur, with clear legal title on every plot.',
        },
        {
                q: 'Where exactly is THE VIEW located?',
                a: 'THE VIEW is located at Kothur, directly on NH-44 (Bengaluru Highway) with excellent connectivity to Rajiv Gandhi International Airport and industrial & logistics hubs.',
        },
        {
                q: 'What are the location advantages?',
                a: 'Direct NH-44 access, ~30 min to RGI Airport, ~5 km to Maisigandi Maisamma Temple, ~5 km to the Pyramid Meditation Centre, and adjacent to the proposed Fourth City growth corridor.',
        },
        {
                q: 'What infrastructure does the layout include?',
                a: 'A premium entrance gate, wide blacktop roads, underground drainage & water lines, modern street lighting, and avenue plantation — the fundamentals, done exactingly.',
        },
        {
                q: 'What other projects have Parvathi Infra delivered?',
                a: 'Airport Town (Shamshabad Corridor), Metro City, and Arokah — The Mountain View, alongside strategic collaborations with Green Homes across Chilkoor, Moinabad, Shankarpally, Jadcherla and Kothur.',
        },
        {
                q: 'How do I book a site visit?',
                a: 'Share your details via the enquiry form, request the brochure, or write to us at info@parvathiinfra.com. Our team will arrange a chauffeured site visit at your convenience.',
        },
];

export const BROCHURE_PAGES = Array.from({ length: 7 }, (_, i) =>
        `/assets/brochure/page-${String(i + 1).padStart(2, '0')}.png`,
);

export const LOGO_IMAGE = '/assets/logo-parvathi.png';
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
