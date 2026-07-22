import './globals.css';
import ShellClient from '@/components/site/ShellClient';

export const metadata = {
        title: 'THE VIEW — Parvathi Infra Developers | Luxury Villa Plots, Kadthal',
        description: 'Premium HMDA & FCDA Approved developments with high-quality infrastructure — legally transparent, strategically located, built to appreciate.',
};

export const viewport = {
        themeColor: '#000000',
};

export default function RootLayout({ children }) {
        return (
                <html lang="en">
                        <head>
                                <link rel="preconnect" href="https://fonts.googleapis.com" />
                                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                                <link
                                        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap"
                                        rel="stylesheet"
                                />
                        </head>
                        <body className="App bg-ink">
                                <ShellClient>{children}</ShellClient>
                        </body>
                </html>
        );
}
