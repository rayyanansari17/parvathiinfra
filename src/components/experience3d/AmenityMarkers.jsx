'use client';

import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { pctToWorld, terrainWorldY } from '@/lib/site3dGeometry';

export const AMENITY_DEFS = [
        {
                code: 'A',
                key: 'gate',
                name: 'Grand Entrance',
                image: '/assets/tour/03-arch-front.jpg',
                body: 'The signature stone and timber arch, the address’s first statement.',
                heightM: 6.8,
                viewpoint: 'gate',
        },
        {
                code: 'D',
                key: 'clubhouse',
                name: 'Clubhouse',
                image: '/assets/tour/06-clubhouse.jpg',
                body: 'A 2,220 sq.ft clubhouse with lounge, gym and indoor games.',
                heightM: 7.6,
                viewpoint: 'clubhouse',
        },
        {
                code: 'H',
                key: 'amphitheatre',
                name: 'Amphitheatre',
                image: '/assets/tour/08-amphitheatre.jpg',
                body: 'An open-air stone amphitheatre for cultural and social gatherings.',
                heightM: 3,
                viewpoint: 'amphitheatre',
        },
        {
                code: 'I',
                key: 'viewpoint',
                name: 'View Point',
                image: '/assets/tour/09-viewpoint.jpg',
                body: 'The panoramic terrace on the highest ridge, the view the address is named for.',
                heightM: 2.6,
                viewpoint: 'viewpoint',
        },
];

// Floating gold labels at the amenity zone + entrance. Click opens the
// same style side panel as a plot, but with the matching photoreal
// render from the scroll tour's asset set.
export default function AmenityMarkers({ site3d, world, anchors, gateLevel, onSelect }) {
        const markers = useMemo(
                () =>
                        AMENITY_DEFS.map((def) => {
                                const posCfg = site3d.amenities[def.key === 'gate' ? 'gate' : def.key].pos;
                                const { x, z } = pctToWorld(posCfg, world);
                                const y = terrainWorldY(posCfg.x, posCfg.y, anchors, gateLevel, world.verticalExaggeration);
                                return { ...def, x, y: y + def.heightM, z };
                        }),
                [site3d, world, anchors, gateLevel],
        );

        return (
                <group data-testid="exp3d-amenity-markers">
                        {markers.map((m) => (
                                <Html key={m.code} position={[m.x, m.y, m.z]} center distanceFactor={undefined} zIndexRange={[10, 0]}>
                                        <button
                                                type="button"
                                                data-testid={`exp3d-amenity-${m.code}`}
                                                onClick={() => onSelect(m)}
                                                className="pointer-events-auto flex h-8 items-center gap-1.5 rounded-full border border-gold bg-ink/85 px-3 text-[0.58rem] font-display uppercase tracking-[0.18em] text-gold shadow-[0_0_12px_rgba(201,162,75,0.55)] backdrop-blur-sm transition-transform hover:scale-105 whitespace-nowrap"
                                        >
                                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                                                {m.name}
                                        </button>
                                </Html>
                        ))}
                </group>
        );
}
