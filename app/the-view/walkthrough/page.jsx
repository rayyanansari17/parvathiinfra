'use client';

import TourShell from '@/components/tour/TourShell';

/**
 * /the-view/walkthrough
 * Full-screen, node-based virtual tour of THE VIEW: ten cinematic scenes
 * culminating in an interactive master-plan / plot picker. Renders as a
 * fixed overlay (z-[80]) covering the global chrome; see TourShell.
 */
export default function Walkthrough() {
        return <TourShell />;
}
