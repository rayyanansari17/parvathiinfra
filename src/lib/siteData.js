// Central site data / constants · safe to import anywhere.
// Content sourced from the Parvathi Infra Developers Premium Website Brief.

export const SITE = {
        brand: 'Parvathi Infra Developers',
        tagline: 'Creating Landmarks. Building Trust.',
        subTagline: 'Premium HMDA & FCDA (HMDA) Approved Developments with High-Quality Infrastructure.',
        flagship: 'THE VIEW',
        founder: 'Mr. C. Gautham Yadav',
        establishedYear: '2019',
        phoneDisplay: '+91 96666 01828',
        phoneLink: 'tel:+919666601828',
        phones: [
                { display: '+91 96666 01828', link: 'tel:+919666601828' },
                { display: '+91 96666 01829', link: 'tel:+919666601829' },
        ],
        website: 'www.parvathiinfra.com',
        websiteUrl: 'https://www.parvathiinfra.com',
        whatsappNumber: '919666601829',
        whatsappLink: 'https://wa.me/919666601829?text=Hello%20Parvathi%20Infra%20-%20I%20am%20interested%20in%20your%20developments',
        email: 'info@parvathiinfra.com',
        emails: {
                info: 'info@parvathiinfra.com',
                sales: 'sales@parvathiinfra.com',
                admin: 'admin@parvathiinfra.com',
        },
        officeAddress:
                'Brindavan Colony, Ootapally Village, near Tondupally Toll Gate, Shamshabad, Telangana',
        siteAddress: 'Karkalphad Village, Kadthal Mandal, Rangareddy District, Telangana',
        socials: {
                instagram: 'https://www.instagram.com/parvathiinfra_developers?igsh=MWw2Y2t0ODdqcjd1dg==',
                facebook: 'https://www.facebook.com/share/1DH6LdW53K/?mibextid=wwXIfr',
        },
};

// Six pillars of the company, hero highlights on Home.
export const PARVATHI_HIGHLIGHTS = [
        { k: '2019', label: 'Established' },
        { k: '8+', label: 'Years of Real Estate Expertise' },
        { k: '2 Lakh+', label: 'Sq. Yards Developed & Marketed' },
        { k: 'Multiple', label: 'Successful Ventures' },
        { k: 'HMDA & FCDA (HMDA)', label: 'Approved Projects' },
        { k: 'Landmark', label: 'Developments with High-Quality Infrastructure' },
];

// Core operating values, 6 pillars.
export const CORE_VALUES = [
        { title: 'Integrity',      copy: 'Straight dealings, always. Every document reads the same to us as it does to you.' },
        { title: 'Trust',          copy: 'Earned across 2 Lakh+ sq. yards of delivered ventures, never claimed lightly.' },
        { title: 'Transparency',   copy: 'Clear title, clear approvals, clear conversations. No fine print in the shadows.' },
        { title: 'Excellence',     copy: 'Wide roads, underground services, avenue plantation. The fundamentals, done exactingly.' },
        { title: 'Innovation',     copy: 'Modern master planning, thoughtful landscaping and infrastructure that ages well.' },
        { title: 'Customer First', copy: 'From the site visit to the sale-deed, and years after, our concierge stays close.' },
];

// Our Journey, verbatim from the brief.
export const JOURNEY = [
        {
                year: '2019',
                title: 'Company Established',
                copy: 'Parvathi Infra Developers is founded in Hyderabad under the leadership of Mr. C. Gautham Yadav.',
        },
        {
                year: '2019–2022',
                title: 'Strategic Collaborations',
                copy: 'Landmark residential ventures with Green Homes across Chilkoor Village, Moinabad, Shankarpally, Jadcherla and Kadthal, over 90,000 sq. yards marketed in a single year.',
        },
        {
                year: '2023 →',
                title: 'Independent Premium Developments',
                copy: 'Over 2 Lakh+ sq. yards successfully developed and marketed independently, culminating in flagship venture: THE VIEW at Kadthal.',
        },
];

// Past & delivered projects (excludes flagship THE VIEW).
export const PAST_PROJECTS = [
        {
                id: 'airport-town',
                title: 'AIRPORT TOWN',
                sub: 'Shamshabad Corridor · Delivered',
                status: 'Delivered',
                copy: 'A tranquil residential township minutes from Rajiv Gandhi International Airport, drawn for families who value the pause between arrival and unpacking.',
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
                copy: 'A rare hillside venture carved along a natural ridgeline, panoramic vantages, curated plots, and a mountain that becomes your neighbour.',
        },
];

// Strategic collaborations locations (with Green Homes).
export const COLLABORATION_LOCATIONS = [
        'Chilkoor Village',
        'Moinabad',
        'Shankarpally',
        'Jadcherla',
        'Kadthal (Bengaluru Highway Corridor)',
];

// Kadthal / NH-44 connectivity for THE VIEW.
export const CONNECTIVITY = [
        { time: 'On',  unit: 'NH-44', place: 'Bengaluru Highway (Direct Access)' },
        { time: '~5', unit: 'min', place: 'Maisigandi Maisamma Temple' },
        { time: '~5', unit: 'min', place: 'Pyramid Meditation Centre' },
        { time: '~30', unit: 'min', place: 'Rajiv Gandhi International Airport' },
        { time: 'Near', unit: '',   place: 'Industrial & Logistics Hubs' },
        { time: 'Adj.', unit: '',   place: 'Proposed Fourth City Growth Corridor*' },
];

// THE VIEW project highlights, 24 interactive feature cards. `icon` maps to a
// lucide-react icon in ProjectHighlights.jsx. Copy is authoritative (not OCR).
export const PROJECT_HIGHLIGHTS = [
        { icon: 'Trees', name: 'Landscaping', desc: 'Curated green pockets and avenue planting throughout the community.' },
        { icon: 'ToyBrick', name: "Children's Play Area", desc: 'A safe, dedicated space for younger residents.' },
        { icon: 'Tent', name: 'Gazebos', desc: 'Shaded seating pavilions across the landscaped zones.' },
        { icon: 'Armchair', name: 'Sitting Area', desc: 'Quiet corners designed for evening conversation.' },
        { icon: 'Landmark', name: 'Open Dayas with Granite Work', desc: 'Elevated granite platforms for gathering and rest.' },
        { icon: 'FileCheck', name: 'Clear Title', desc: 'Fully verified ownership with transparent documentation.' },
        { icon: 'Sofa', name: 'Granite Chairs', desc: 'Durable, elegant seating integrated into the landscape.' },
        { icon: 'Droplet', name: 'Water Connection for Each Plot', desc: 'Individual water line provisioned to every plot.' },
        { icon: 'Accessibility', name: 'Senior Citizens Area', desc: 'A calm, accessible space designed for elders.' },
        { icon: 'PartyPopper', name: 'Party Lawn', desc: 'An open lawn for celebrations and community gatherings.' },
        { icon: 'DoorOpen', name: 'Elegant Entrance Gate', desc: 'A grand architectural arrival statement.' },
        { icon: 'Lightbulb', name: 'Street Lights on All Roads', desc: 'Designer lighting along every internal road.' },
        { icon: 'Compass', name: '100% Vastu Layout', desc: 'Every plot planned in accordance with Vastu principles.' },
        { icon: 'Hammer', name: 'Ready to Construction', desc: 'Begin building immediately, no waiting.' },
        { icon: 'Waves', name: 'Underground Drainage System', desc: 'Fully concealed drainage for a clean streetscape.' },
        { icon: 'Droplets', name: 'Underground Water Line', desc: 'Piped water infrastructure laid below ground.' },
        { icon: 'Hash', name: 'Numbering of Each Plot', desc: 'Clearly marked and demarcated plot identification.' },
        { icon: 'ShieldCheck', name: '24x7 Security System with Security Room', desc: 'Round-the-clock manned security at the entrance.' },
        { icon: 'Container', name: 'Overhead Tank', desc: 'Dedicated overhead storage ensuring consistent supply.' },
        { icon: 'Sprout', name: 'Plantation for Each Plot', desc: 'A tree planted for every plot in the community.' },
        { icon: 'Route', name: 'All 30 Feet CC Roads', desc: 'Wide concrete roads throughout the layout.' },
        { icon: 'Zap', name: 'Open Power', desc: 'Electrical infrastructure provisioned across the site.' },
        { icon: 'LandPlot', name: 'Open Space', desc: 'Over 10% of the land dedicated to open green space.' },
        { icon: 'Cctv', name: 'CC Camera at Entrance Gate', desc: 'Surveillance coverage at the point of entry.' },
];

// Categorised connectivity for THE VIEW, grouped for the tabbed block. `icon`
// maps to a lucide-react icon in ConnectivityTabs.jsx.
export const CONNECTIVITY_GROUPS = [
        {
                key: 'roads',
                label: 'Roads & Transport',
                icon: 'Milestone',
                rows: [
                        { place: 'Srisailam Highway', time: 1 },
                        { place: 'Regional Ring Road (RRR)', time: 6 },
                        { place: 'Ratan TATA Greenfield Road', time: 12 },
                        { place: '6-Lane NH to Tirupati', time: 15 },
                        { place: 'Proposed Kandukur Metrorail', time: 18 },
                        { place: 'ORR Exit 14', time: 37 },
                        { place: 'RGI Airport', time: 45 },
                ],
        },
        {
                key: 'employment',
                label: 'Employment & Business',
                icon: 'Building2',
                rows: [
                        { place: 'Amazon Data Center', time: 25 },
                        { place: 'Prestigious 4th City', time: 25 },
                        { place: 'Fab City', time: 35 },
                        { place: 'Foxconn', time: 50 },
                ],
        },
        {
                key: 'spiritual',
                label: 'Spiritual & Leisure',
                icon: 'Sparkles',
                rows: [
                        { place: 'Maisigandi Temple', time: 3 },
                        { place: 'Maheshwara Maha Pyramid', time: 12 },
                ],
        },
        {
                key: 'education',
                label: 'Education',
                icon: 'GraduationCap',
                rows: [{ place: 'MGM School', time: 30 }],
        },
        {
                key: 'civic',
                label: 'Civic',
                icon: 'Landmark',
                rows: [{ place: 'Collectorate Office', time: 50 }],
        },
];

// THE VIEW amenities, kept intact from previous version.
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
                copy: 'Tree-lined avenues that grow into a canopy, the neighbourhood’s slow luxury.',
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
                copy: 'Underground drainage and water lines, infrastructure you never have to see.',
                image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
        },
        {
                title: 'Clear Legal Documentation',
                copy: 'HMDA & FCDA (HMDA) approved, clear title on every plot, read before you sign.',
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
        'HMDA & FCDA (HMDA) Approved',
        'Clear Legal Documentation',
];

// Stats now reflect Parvathi Infra (not just THE VIEW).
export const STATS = [
        { value: '2019',    suffix: 'Est.',      label: 'Company Founded' },
        { value: '8+',      suffix: 'Years',     label: 'Real Estate Expertise' },
        { value: '2L+',     suffix: 'Sq. Yds',   label: 'Developed & Marketed' },
        { value: '90k+',    suffix: 'Sq. Yds',   label: 'Marketed in a Single Year' },
];

// Approvals & credentials, used in the marquee.
export const APPROVALS = [
        'HMDA Approved',
        'FCDA (HMDA) Approved',
        'Clear Legal Title',
        '100% Vastu Compliant',
        'RERA Registered',
        'Premium Infrastructure',
        'Landmark Developments',
];

export const FAQS = [
        {
                q: 'Is THE VIEW approved?',
                a: 'Yes. THE VIEW is an HMDA and FCDA (HMDA) Approved Premium Venture at Kadthal, with clear legal title on every plot, the first FCDA (HMDA) approved venture, and the only FCDA (HMDA) approved venture in Kadthal.',
        },
        {
                q: 'Where exactly is THE VIEW located?',
                a: 'THE VIEW is located at Kadthal, directly on NH-44 (Bengaluru Highway) with excellent connectivity to Rajiv Gandhi International Airport and industrial & logistics hubs.',
        },
        {
                q: 'What are the location advantages?',
                a: 'Direct NH-44 access, ~30 min to RGI Airport, ~5 km to Maisigandi Maisamma Temple, ~5 km to the Pyramid Meditation Centre, and adjacent to the proposed Fourth City growth corridor.',
        },
        {
                q: 'What infrastructure does the layout include?',
                a: 'A premium entrance gate, wide blacktop roads, underground drainage & water lines, modern street lighting, and avenue plantation. The fundamentals, done exactingly.',
        },
        {
                q: 'What other projects have Parvathi Infra delivered?',
                a: 'Airport Town (Shamshabad Corridor), Metro City, and Arokah: The Mountain View, alongside strategic collaborations with Green Homes across Chilkoor, Moinabad, Shankarpally, Jadcherla and Kadthal.',
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
