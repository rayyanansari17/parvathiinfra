const BASE = 'https://www.parvathiinfra.com';

// Public, indexable routes. API routes are intentionally excluded.
const ROUTES = [
        { path: '/', priority: 1.0, changeFrequency: 'weekly' },
        { path: '/the-view', priority: 0.9, changeFrequency: 'weekly' },
        { path: '/the-view/walkthrough', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/the-view/experience', priority: 0.6, changeFrequency: 'monthly' },
        { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/gallery', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
];

export default function sitemap() {
        const now = new Date();
        return ROUTES.map((r) => ({
                url: `${BASE}${r.path}`,
                lastModified: now,
                changeFrequency: r.changeFrequency,
                priority: r.priority,
        }));
}
