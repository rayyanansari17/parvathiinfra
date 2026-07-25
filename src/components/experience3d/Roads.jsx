'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { buildRibbonAttributes, terrainWorldY } from '@/lib/site3dGeometry';

function Ribbon({ points, widthM, world, anchors, gateLevel, lift }) {
        const geometry = useMemo(() => {
                const heightFn = (xPct, yPct) => terrainWorldY(xPct, yPct, anchors, gateLevel, world.verticalExaggeration);
                const { positions, colors, indices } = buildRibbonAttributes(points, widthM, world, heightFn, lift);
                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geo.setIndex(indices);
                geo.computeVertexNormals();
                return geo;
        }, [points, widthM, world, anchors, gateLevel, lift]);

        return (
                <mesh geometry={geometry} receiveShadow>
                        <meshStandardMaterial vertexColors roughness={0.85} metalness={0.05} />
                </mesh>
        );
}

// Road ribbons: the highway frontage plus the internal CC road network,
// all traced from site3d.json road centrelines/widths.
export default function Roads({ site3d, world, anchors, gateLevel }) {
        const { roads } = site3d;
        return (
                <group data-testid="exp3d-roads">
                        <Ribbon points={roads.highway.points} widthM={roads.highway.widthM} world={world} anchors={anchors} gateLevel={gateLevel} lift={0.06} />
                        <Ribbon points={roads.avenue.points} widthM={roads.avenue.widthM} world={world} anchors={anchors} gateLevel={gateLevel} lift={0.1} />
                        <Ribbon points={roads.ccRoadEW.points} widthM={roads.ccRoadEW.widthM} world={world} anchors={anchors} gateLevel={gateLevel} lift={0.1} />
                        <Ribbon points={roads.ccRoadNS.points} widthM={roads.ccRoadNS.widthM} world={world} anchors={anchors} gateLevel={gateLevel} lift={0.1} />
                </group>
        );
}
