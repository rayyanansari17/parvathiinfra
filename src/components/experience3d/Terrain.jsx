'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { terrainWorldY, siteMask } from '@/lib/site3dGeometry';

// Ground colours: warm sand inside the sanctioned boundary (the site
// reads as an illuminated model), quiet dark earth outside it, fading
// into the obsidian scene fog at distance.
const INSIDE_COLOR = new THREE.Color(0.56, 0.5, 0.4);
const OUTSIDE_COLOR = new THREE.Color(0.04, 0.042, 0.038);

export default function Terrain({ world, boundary, anchors, gateLevel, segments = 84 }) {
        const geometry = useMemo(() => {
                const widthM = world.widthM * world.groundExtentFactor;
                const depthM = world.depthM * world.groundExtentFactor;
                const segX = segments;
                const segZ = segments;

                const positions = new Float32Array((segX + 1) * (segZ + 1) * 3);
                const colors = new Float32Array((segX + 1) * (segZ + 1) * 3);
                const indices = [];

                let p = 0;
                let c = 0;
                for (let iz = 0; iz <= segZ; iz += 1) {
                        for (let ix = 0; ix <= segX; ix += 1) {
                                const x = (ix / segX - 0.5) * widthM;
                                const z = (iz / segZ - 0.5) * depthM;
                                const xPct = (x / world.widthM + 0.5) * 100;
                                const yPct = (z / world.depthM + 0.5) * 100;
                                const y = terrainWorldY(xPct, yPct, anchors, gateLevel, world.verticalExaggeration);
                                positions[p] = x;
                                positions[p + 1] = y;
                                positions[p + 2] = z;
                                p += 3;

                                const mask = siteMask(xPct, yPct, boundary);
                                const col = OUTSIDE_COLOR.clone().lerp(INSIDE_COLOR, mask);
                                colors[c] = col.r;
                                colors[c + 1] = col.g;
                                colors[c + 2] = col.b;
                                c += 3;
                        }
                }

                for (let iz = 0; iz < segZ; iz += 1) {
                        for (let ix = 0; ix < segX; ix += 1) {
                                const a = iz * (segX + 1) + ix;
                                const b = a + 1;
                                const cIdx = a + (segX + 1);
                                const d = cIdx + 1;
                                indices.push(a, cIdx, b, b, cIdx, d);
                        }
                }

                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
                geo.setIndex(indices);
                geo.computeVertexNormals();
                return geo;
        }, [world, boundary, anchors, gateLevel, segments]);

        return (
                <mesh geometry={geometry} receiveShadow data-testid="exp3d-terrain">
                        <meshStandardMaterial vertexColors roughness={0.95} metalness={0.02} />
                </mesh>
        );
}
