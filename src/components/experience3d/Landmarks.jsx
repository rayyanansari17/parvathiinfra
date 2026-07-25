'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { pctToWorld, terrainWorldY, polygonCentroidPct } from '@/lib/site3dGeometry';

function useGroundY(pos, anchors, gateLevel, world) {
        return useMemo(
                () => terrainWorldY(pos.x, pos.y, anchors, gateLevel, world.verticalExaggeration),
                [pos, anchors, gateLevel, world],
        );
}

// Simple stone-and-timber gate massing: two pillars framing the entry
// avenue with a lintel beam across the top, echoing 03-arch-front.jpg's
// proportions without trying to reproduce it literally.
export function EntranceArch({ site3d, world, anchors, gateLevel }) {
        const cfg = site3d.amenities.gate;
        const { x, z } = pctToWorld(cfg.pos, world);
        const y = useGroundY(cfg.pos, anchors, gateLevel, world);
        const span = cfg.avenueWidthM + cfg.pillarSizeM;
        const h = cfg.pillarHeightM;

        return (
                <group position={[x, y, z]} data-testid="exp3d-gate">
                        {[-1, 1].map((side) => (
                                <mesh key={side} position={[(span / 2) * side, h / 2, 0]} castShadow>
                                        <boxGeometry args={[cfg.pillarSizeM, h, cfg.pillarSizeM]} />
                                        <meshStandardMaterial color="#2a251d" roughness={0.8} />
                                </mesh>
                        ))}
                        <mesh position={[0, h + 0.5, 0]} castShadow>
                                <boxGeometry args={[span + cfg.pillarSizeM * 2, 1, cfg.pillarSizeM * 1.1]} />
                                <meshStandardMaterial color="#4a3623" roughness={0.7} />
                        </mesh>
                        <mesh position={[0, h + 1.15, 0]}>
                                <boxGeometry args={[span - 1, 0.3, 0.15]} />
                                <meshStandardMaterial color="#C9A24B" metalness={0.6} roughness={0.3} emissive="#8A6D2F" emissiveIntensity={0.4} />
                        </mesh>
                </group>
        );
}

export function Clubhouse({ site3d, world, anchors, gateLevel }) {
        const cfg = site3d.amenities.clubhouse;
        const pool = site3d.amenities.pool;
        const { x, z } = pctToWorld(cfg.pos, world);
        const y = useGroundY(cfg.pos, anchors, gateLevel, world);
        const poolWorld = pctToWorld(pool.pos, world);
        const poolY = useGroundY(pool.pos, anchors, gateLevel, world);

        return (
                <group data-testid="exp3d-clubhouse">
                        <mesh position={[x, y + cfg.heightM / 2, z]} castShadow receiveShadow>
                                <boxGeometry args={[cfg.widthM, cfg.heightM, cfg.depthM]} />
                                <meshStandardMaterial color="#e9e2d1" roughness={0.75} />
                        </mesh>
                        <mesh position={[x, y + cfg.heightM + 0.08, z]} castShadow>
                                <boxGeometry args={[cfg.widthM + 0.6, 0.16, cfg.depthM + 0.6]} />
                                <meshStandardMaterial color="#C9A24B" metalness={0.5} roughness={0.35} />
                        </mesh>
                        <mesh position={[poolWorld.x, poolY + 0.05, poolWorld.z]} rotation={[-Math.PI / 2, 0, 0]}>
                                <planeGeometry args={[pool.widthM, pool.depthM]} />
                                <meshPhysicalMaterial color="#1f5f5c" roughness={0.15} metalness={0.1} clearcoat={0.6} />
                        </mesh>
                        <mesh position={[poolWorld.x, poolY + 0.06, poolWorld.z]} rotation={[-Math.PI / 2, 0, 0]}>
                                <ringGeometry args={[Math.min(pool.widthM, pool.depthM) / 2 - 0.15, Math.min(pool.widthM, pool.depthM) / 2, 4]} />
                                <meshStandardMaterial color="#C9A24B" metalness={0.4} roughness={0.4} />
                        </mesh>
                </group>
        );
}

export function Amphitheatre({ site3d, world, anchors, gateLevel }) {
        const cfg = site3d.amenities.amphitheatre;
        const { x, z } = pctToWorld(cfg.pos, world);
        const y = useGroundY(cfg.pos, anchors, gateLevel, world);
        const tiers = cfg.tiers;

        return (
                <group position={[x, y, z]} data-testid="exp3d-amphitheatre">
                        {Array.from({ length: tiers }).map((_, i) => {
                                const outer = cfg.radiusM * (1 - i * (0.65 / tiers));
                                const inner = outer - cfg.radiusM * 0.14;
                                const stepY = i * 0.42;
                                return (
                                        <mesh key={i} position={[0, stepY, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                                                <ringGeometry args={[Math.max(inner, 0.4), Math.max(outer, 0.8), 24, 1, Math.PI * 0.15, Math.PI * 0.7]} />
                                                <meshStandardMaterial color={i % 2 === 0 ? '#d8cdb2' : '#c9bd9e'} roughness={0.9} side={THREE.DoubleSide} />
                                        </mesh>
                                );
                        })}
                </group>
        );
}

export function ViewpointTerrace({ site3d, world, anchors, gateLevel }) {
        const cfg = site3d.amenities.viewpoint;
        const { x, z } = pctToWorld(cfg.pos, world);
        const y = useGroundY(cfg.pos, anchors, gateLevel, world);
        const railPosts = 20;

        return (
                <group position={[x, y, z]} data-testid="exp3d-viewpoint">
                        <mesh position={[0, 0.15, 0]} receiveShadow>
                                <cylinderGeometry args={[cfg.radiusM, cfg.radiusM, 0.3, 28]} />
                                <meshStandardMaterial color="#dcd2ba" roughness={0.8} />
                        </mesh>
                        {Array.from({ length: railPosts }).map((_, i) => {
                                const a = (i / railPosts) * Math.PI * 2;
                                const px = Math.cos(a) * (cfg.radiusM - 0.15);
                                const pz = Math.sin(a) * (cfg.radiusM - 0.15);
                                return (
                                        <mesh key={i} position={[px, 0.9, pz]}>
                                                <cylinderGeometry args={[0.035, 0.035, 1.0, 6]} />
                                                <meshStandardMaterial color="#C9A24B" metalness={0.6} roughness={0.3} />
                                        </mesh>
                                );
                        })}
                        <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
                                <torusGeometry args={[cfg.radiusM - 0.15, 0.035, 8, 40]} />
                                <meshStandardMaterial color="#C9A24B" metalness={0.6} roughness={0.3} />
                        </mesh>
                </group>
        );
}

function FlatPatch({ poly, world, anchors, gateLevel, color }) {
        const centroid = polygonCentroidPct(poly);
        const y = useGroundY(centroid, anchors, gateLevel, world);
        const geometry = useMemo(() => {
                const shape = new THREE.Shape();
                poly.forEach((p, i) => {
                        const w = pctToWorld(p, world);
                        if (i === 0) shape.moveTo(w.x, w.z);
                        else shape.lineTo(w.x, w.z);
                });
                return new THREE.ShapeGeometry(shape);
        }, [poly, world]);

        return (
                <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, y + 0.03, 0]}>
                        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={0.85} />
                </mesh>
        );
}

export function OpenSpacePatch({ site3d, world, anchors, gateLevel }) {
        return <FlatPatch poly={site3d.openSpace} world={world} anchors={anchors} gateLevel={gateLevel} color="#2f4a2c" />;
}

export function SocialInfraPatch({ site3d, world, anchors, gateLevel }) {
        return <FlatPatch poly={site3d.socialInfra} world={world} anchors={anchors} gateLevel={gateLevel} color="#3d4a55" />;
}

export default function Landmarks(props) {
        return (
                <group>
                        <EntranceArch {...props} />
                        <Clubhouse {...props} />
                        <Amphitheatre {...props} />
                        <ViewpointTerrace {...props} />
                        <OpenSpacePatch {...props} />
                        <SocialInfraPatch {...props} />
                </group>
        );
}
