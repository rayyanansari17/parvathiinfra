'use client';

import { useMemo, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { pctToWorld, terrainWorldY } from '@/lib/site3dGeometry';

// Deterministic PRNG so the canopy of trees doesn't reshuffle every
// render (mulberry32).
function mulberry32(seed) {
        let a = seed;
        return () => {
                a |= 0;
                a = (a + 0x6d2b79f5) | 0;
                let t = Math.imul(a ^ (a >>> 15), a | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
}

function samplePolylineOffsets(pointsPct, world, spacingM, offsetM) {
        const worldPts = pointsPct.map((p) => pctToWorld(p, world));
        const out = [];
        for (let i = 0; i < worldPts.length - 1; i += 1) {
                const a = worldPts[i];
                const b = worldPts[i + 1];
                const dx = b.x - a.x;
                const dz = b.z - a.z;
                const len = Math.hypot(dx, dz);
                if (len < 1e-6) continue;
                const ux = dx / len;
                const uz = dz / len;
                const px = -uz;
                const pz = ux;
                const steps = Math.max(1, Math.floor(len / spacingM));
                for (let s = 0; s <= steps; s += 1) {
                        const t = s / steps;
                        const x = a.x + ux * len * t;
                        const z = a.z + uz * len * t;
                        out.push({ x: x + px * offsetM, z: z + pz * offsetM });
                        out.push({ x: x - px * offsetM, z: z - pz * offsetM });
                }
        }
        return out;
}

function samplePolygonPerimeter(poly, world, spacingM, insetM) {
        const worldPts = poly.map((p) => pctToWorld(p, world));
        const out = [];
        for (let i = 0; i < worldPts.length; i += 1) {
                const a = worldPts[i];
                const b = worldPts[(i + 1) % worldPts.length];
                const dx = b.x - a.x;
                const dz = b.z - a.z;
                const len = Math.hypot(dx, dz);
                if (len < 1e-6) continue;
                const ux = dx / len;
                const uz = dz / len;
                // inward normal (polygon assumed roughly clockwise in this scene)
                const nx = uz;
                const nz = -ux;
                const steps = Math.max(1, Math.floor(len / spacingM));
                for (let s = 0; s < steps; s += 1) {
                        const t = s / steps;
                        out.push({ x: a.x + ux * len * t + nx * insetM, z: a.z + uz * len * t + nz * insetM });
                }
        }
        return out;
}

// Instanced low-poly trees (two draw calls total: trunks + canopies)
// along the entry avenue, the CC roads and just inside the perimeter
// wall. Positions are procedural (from site3d.json spacing knobs), never
// downloaded assets.
export default function Trees({ site3d, world, boundary, anchors, gateLevel }) {
        const trunkRef = useRef(null);
        const canopyRef = useRef(null);
        const cfg = site3d.trees;

        const points = useMemo(() => {
                const pts = [
                        ...samplePolylineOffsets(site3d.roads.avenue.points, world, cfg.avenueSpacingM, site3d.roads.avenue.widthM / 2 + 2.2),
                        ...samplePolylineOffsets(site3d.roads.ccRoadEW.points, world, cfg.roadSpacingM, site3d.roads.ccRoadEW.widthM / 2 + 2),
                        ...samplePolylineOffsets(site3d.roads.ccRoadNS.points, world, cfg.roadSpacingM, site3d.roads.ccRoadNS.widthM / 2 + 2),
                        ...samplePolygonPerimeter(boundary, world, cfg.perimeterSpacingM, 3.5),
                ];
                const rand = mulberry32(41);
                return pts.map((p) => {
                        const xPct = (p.x / world.widthM + 0.5) * 100;
                        const yPct = (p.z / world.depthM + 0.5) * 100;
                        const y = terrainWorldY(xPct, yPct, anchors, gateLevel, world.verticalExaggeration);
                        const scale = 0.75 + rand() * 0.6;
                        const rot = rand() * Math.PI * 2;
                        return { x: p.x, y, z: p.z, scale, rot };
                });
        }, [site3d, world, boundary, anchors, gateLevel, cfg]);

        useLayoutEffect(() => {
                if (!trunkRef.current || !canopyRef.current) return;
                const m = new THREE.Matrix4();
                points.forEach((p, i) => {
                        const trunkH = cfg.trunkHeightM * p.scale;
                        m.compose(
                                new THREE.Vector3(p.x, p.y + trunkH / 2, p.z),
                                new THREE.Quaternion().setFromEuler(new THREE.Euler(0, p.rot, 0)),
                                new THREE.Vector3(1, p.scale, 1),
                        );
                        trunkRef.current.setMatrixAt(i, m);

                        const canopyH = cfg.canopyHeightM * p.scale;
                        m.compose(
                                new THREE.Vector3(p.x, p.y + trunkH + canopyH * 0.45, p.z),
                                new THREE.Quaternion().setFromEuler(new THREE.Euler(0, p.rot, 0)),
                                new THREE.Vector3(p.scale, p.scale, p.scale),
                        );
                        canopyRef.current.setMatrixAt(i, m);
                });
                trunkRef.current.instanceMatrix.needsUpdate = true;
                canopyRef.current.instanceMatrix.needsUpdate = true;
                trunkRef.current.computeBoundingSphere();
                canopyRef.current.computeBoundingSphere();
        }, [points, cfg]);

        if (points.length === 0) return null;

        return (
                <group data-testid="exp3d-trees">
                        <instancedMesh ref={trunkRef} args={[undefined, undefined, points.length]} castShadow>
                                <cylinderGeometry args={[0.09, 0.13, 1, 6]} />
                                <meshStandardMaterial color="#3a2c1c" roughness={0.9} />
                        </instancedMesh>
                        <instancedMesh ref={canopyRef} args={[undefined, undefined, points.length]} castShadow>
                                <coneGeometry args={[site3d.trees.canopyRadiusM, 1, 7]} />
                                <meshStandardMaterial color="#2f3a26" roughness={0.85} />
                        </instancedMesh>
                </group>
        );
}
