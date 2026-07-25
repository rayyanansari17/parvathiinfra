'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen3D from '@/components/experience3d/ui/LoadingScreen3D';
import WebGLFallback from '@/components/experience3d/WebGLFallback';

const Experience3D = dynamic(() => import('@/components/experience3d/Experience3D'), {
        ssr: false,
        loading: () => <LoadingScreen3D />,
});

function hasWebGL() {
        try {
                const canvas = document.createElement('canvas');
                return Boolean(
                        window.WebGLRenderingContext &&
                                (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
                );
        } catch {
                return false;
        }
}

// The real-time 3D interactive site model. Kept entirely separate from
// /the-view/walkthrough (the 2D scroll tour), which stays untouched.
// WebGL support is checked before the (heavy) three.js bundle is ever
// requested, so unsupported browsers never pay for or attempt to run it.
export default function Experience3DPage() {
        const [webglOk, setWebglOk] = useState(null);

        useEffect(() => {
                setWebglOk(hasWebGL());
        }, []);

        if (webglOk === false) return <WebGLFallback />;
        if (webglOk === null) return <LoadingScreen3D />;
        return <Experience3D />;
}
