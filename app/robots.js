const BASE = 'https://www.parvathiinfra.com';

export default function robots() {
        return {
                rules: {
                        userAgent: '*',
                        allow: '/',
                        disallow: '/api/',
                },
                sitemap: `${BASE}/sitemap.xml`,
                host: BASE,
        };
}
