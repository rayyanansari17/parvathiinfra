'use client';

import { useMemo } from 'react';
import { pctToWorld, terrainWorldY } from '@/lib/site3dGeometry';

const WALL_HEIGHT_M = 1.05;
const WALL_THICK_M = 0.28;
const CAP_HEIGHT_M = 0.14;

// A low perimeter compound wall traced along the sanctioned boundary
// polygon, one box + one gold cap per edge, sitting at the averaged
// terrain height of its two endpoints.
export default function BoundaryWall({ boundary, world, anchors, gateLevel }) {
        const segments = useMemo(() => {
                const segs = [];
                for (let i = 0; i < boundary.length; i += 1) {
                        const a = boundary[i];
                        const b = boundary[(i + 1) % boundary.length];
                        const wa = pctToWorld(a, world);
                        const wb = pctToWorld(b, world);
                        const mx = (wa.x + wb.x) / 2;
                        const mz = (wa.z + wb.z) / 2;
                        const length = Math.hypot(wb.x - wa.x, wb.z - wa.z);
                        const angle = Math.atan2(wb.x - wa.x, wb.z - wa.z);
                        const ya = terrainWorldY(a.x, a.y, anchors, gateLevel, world.verticalExaggeration);
                        const yb = terrainWorldY(b.x, b.y, anchors, gateLevel, world.verticalExaggeration);
                        const y = (ya + yb) / 2;
                        segs.push({ mx, mz, y, length, angle });
                }
                return segs;
        }, [boundary, world, anchors, gateLevel]);

        return (
                <group data-testid="exp3d-boundary-wall">
                        {segments.map((s, i) => (
                                <group key={i} position={[s.mx, s.y, s.mz]} rotation={[0, s.angle, 0]}>
                                        <mesh position={[0, WALL_HEIGHT_M / 2, 0]} castShadow receiveShadow>
                                                <boxGeometry args={[WALL_THICK_M, WALL_HEIGHT_M, s.length]} />
                                                <meshStandardMaterial color="#1c1a16" roughness={0.85} />
                                        </mesh>
                                        <mesh position={[0, WALL_HEIGHT_M + CAP_HEIGHT_M / 2, 0]}>
                                                <boxGeometry args={[WALL_THICK_M + 0.05, CAP_HEIGHT_M, s.length]} />
                                                <meshStandardMaterial color="#C9A24B" roughness={0.4} metalness={0.5} emissive="#8A6D2F" emissiveIntensity={0.15} />
                                        </mesh>
                                </group>
                        ))}
                </group>
        );
}
