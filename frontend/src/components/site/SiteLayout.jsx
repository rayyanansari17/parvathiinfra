import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '@/components/site/Navigation';
import Footer from '@/components/site/Footer';
import Chatbot from '@/components/site/Chatbot';
import WhatsAppFloat from '@/components/site/WhatsAppFloat';
import CustomCursor from '@/components/site/CustomCursor';
import Preloader from '@/components/site/Preloader';
import BrochureModal from '@/components/site/BrochureModal';
import WalkthroughModal from '@/components/site/WalkthroughModal';
import { useLenis } from '@/hooks/useLenis';

// Global brochure modal is exposed via window event.
export const openBrochureModal = () => {
        window.dispatchEvent(new CustomEvent('brochure:open'));
};

export const openWalkthrough = () => {
        window.dispatchEvent(new CustomEvent('walkthrough:open'));
};

export default function SiteLayout() {
        useLenis();
        const location = useLocation();
        const [brochureOpen, setBrochureOpen] = useState(false);
        const [walkthroughOpen, setWalkthroughOpen] = useState(false);

        useEffect(() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
        }, [location.pathname]);

        useEffect(() => {
                const openB = () => setBrochureOpen(true);
                const openW = () => setWalkthroughOpen(true);
                window.addEventListener('brochure:open', openB);
                window.addEventListener('walkthrough:open', openW);
                return () => {
                        window.removeEventListener('brochure:open', openB);
                        window.removeEventListener('walkthrough:open', openW);
                };
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
                        <WalkthroughModal
                                open={walkthroughOpen}
                                onClose={() => setWalkthroughOpen(false)}
                        />
                </div>
        );
}
