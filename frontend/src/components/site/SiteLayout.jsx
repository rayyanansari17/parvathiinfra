import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '@/components/site/Navigation';
import Footer from '@/components/site/Footer';
import Chatbot from '@/components/site/Chatbot';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import CustomCursor from '@/components/site/CustomCursor';
import Preloader from '@/components/site/Preloader';
import BrochureModal from '@/components/site/BrochureModal';
import { useLenis } from '@/hooks/useLenis';

// Global brochure modal is exposed via window event.
export const openBrochureModal = () => {
        window.dispatchEvent(new CustomEvent('brochure:open'));
};

export default function SiteLayout() {
        useLenis();
        const location = useLocation();
        const [brochureOpen, setBrochureOpen] = useState(false);

        useEffect(() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
        }, [location.pathname]);

        useEffect(() => {
                const openB = () => setBrochureOpen(true);
                window.addEventListener('brochure:open', openB);
                return () => window.removeEventListener('brochure:open', openB);
        }, []);

        return (
                <div className="relative min-h-screen bg-ink text-ivory">
                        <Preloader />
                        <CustomCursor />
                        <Navigation />
                        <main>
                                <Outlet />
                        </main>
                        <Footer />
                        <Chatbot />
                        <WhatsAppFloat />
                        <BrochureModal open={brochureOpen} onClose={() => setBrochureOpen(false)} />
                </div>
        );
}
