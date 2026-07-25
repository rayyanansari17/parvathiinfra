'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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

export default function ShellClient({ children }) {
        const pathname = usePathname();
        // The virtual tour and the 3D site model are both self-contained,
        // full-viewport experiences with their own preloader and their own top
        // bar (including an Exit control), and the 3D route is a fixed-position
        // canvas rather than document flow. Rendering the site chrome alongside
        // either would stack two preloaders and leave the footer/chatbot sitting
        // under their fixed UI.
        const IMMERSIVE_ROUTE_PREFIXES = ['/the-view/walkthrough', '/the-view/experience'];
        const isTour = IMMERSIVE_ROUTE_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
        // The tour drives its own GSAP ScrollTrigger scrub/pin/snap over native
        // scroll; Lenis's smoothed wheel handling fights that timing.
        useLenis(!isTour);
        const [brochureOpen, setBrochureOpen] = useState(false);

        useEffect(() => {
                window.scrollTo({ top: 0, behavior: 'auto' });
        }, [pathname]);

        useEffect(() => {
                const openB = () => setBrochureOpen(true);
                window.addEventListener('brochure:open', openB);
                return () => window.removeEventListener('brochure:open', openB);
        }, []);

        return (
                <div className="relative min-h-screen bg-ink text-ivory">
                        {!isTour && <Preloader />}
                        <CustomCursor />
                        {!isTour && <Navigation />}
                        <main>
                                {children}
                        </main>
                        {!isTour && (
                                <>
                                        <Footer />
                                        <Chatbot />
                                        <WhatsAppFloat />
                                        <BrochureModal
                                                open={brochureOpen}
                                                onClose={() => setBrochureOpen(false)}
                                        />
                                </>
                        )}
                </div>
        );
}
