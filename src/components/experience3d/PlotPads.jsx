'use client';

import { useMemo } from 'react';
import { Instances, Instance, Html } from '@react-three/drei';
import * as THREE from 'three';
import { pctToWorld, levelToWorldY, plotFootprintM } from '@/lib/site3dGeometry';

const VERIFIED_COLOR = '#cbb98a';
const UNVERIFIED_COLOR = '#8f8878';
const EDGE_COLOR = new THREE.Color('#C9A24B');

// Interactive plot pads: one instanced draw call for all 41 fills, one
// merged line-segments draw call for all the gold hairline edges, plus
// two small overlay meshes for hover/selection highlight. Footprint size
// comes from each plot's real sqyd (or a neutral default for the
// handful of unverified plots that have no size yet); pad *height*
// (its position on the slope) comes from the plot's real survey level.
export default function PlotPads({ plots3D, world, plotsCfg, gateLevel, hoveredId, selectedId, onHover, onSelect }) {
        const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

        const laidOut = useMemo(
                () =>
                        plots3D.map((p) => {
                                const { x, z } = pctToWorld(p.pos, world);
                                const y = levelToWorldY(p.level, gateLevel, world.verticalExaggeration);
                                const { width, depth } = plotFootprintM(p.footprintSqyd, plotsCfg.aspectRatio);
                                return { plot: p, x, z, width, depth, groundY: y };
                        }),
                [plots3D, world, plotsCfg, gateLevel],
        );

        const edgesGeometry = useMemo(() => {
                const positions = [];
                laidOut.forEach(({ x, z, width, depth, groundY }) => {
                        const y = groundY + plotsCfg.padThicknessM + 0.02;
                        const hw = width / 2;
                        const hd = depth / 2;
                        const corners = [
                                [x - hw, y, z - hd],
                                [x + hw, y, z - hd],
                                [x + hw, y, z + hd],
                                [x - hw, y, z + hd],
                        ];
                        for (let i = 0; i < 4; i += 1) {
                                const a = corners[i];
                                const b = corners[(i + 1) % 4];
                                positions.push(...a, ...b);
                        }
                });
                const geo = new THREE.BufferGeometry();
                geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                return geo;
        }, [laidOut, plotsCfg]);

        const hovered = laidOut.find((l) => l.plot.id === hoveredId);
        const selected = laidOut.find((l) => l.plot.id === selectedId);

        return (
                <group data-testid="exp3d-plots">
                        <Instances geometry={boxGeo} limit={laidOut.length} range={laidOut.length} castShadow receiveShadow>
                                <meshStandardMaterial roughness={0.7} metalness={0.05} />
                                {laidOut.map(({ plot, x, z, width, depth, groundY }) => (
                                        <Instance
                                                key={plot.id}
                                                data-testid={`exp3d-plot-${plot.id}`}
                                                position={[x, groundY + plotsCfg.padThicknessM / 2, z]}
                                                scale={[width, plotsCfg.padThicknessM, depth]}
                                                color={plot.verified ? VERIFIED_COLOR : UNVERIFIED_COLOR}
                                                onPointerOver={(e) => {
                                                        e.stopPropagation();
                                                        onHover(plot.id);
                                                        document.body.style.cursor = 'pointer';
                                                }}
                                                onPointerOut={(e) => {
                                                        e.stopPropagation();
                                                        onHover((cur) => (cur === plot.id ? null : cur));
                                                        document.body.style.cursor = 'auto';
                                                }}
                                                onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSelect(plot);
                                                }}
                                        />
                                ))}
                        </Instances>

                        <lineSegments geometry={edgesGeometry}>
                                <lineBasicMaterial color={EDGE_COLOR} transparent opacity={0.55} />
                        </lineSegments>

                        {hovered && (
                                <>
                                        <mesh
                                                position={[hovered.x, hovered.groundY + plotsCfg.padThicknessM / 2 + 0.03, hovered.z]}
                                                scale={[hovered.width + 0.3, plotsCfg.padThicknessM + 0.1, hovered.depth + 0.3]}
                                                data-testid="exp3d-plot-hover-highlight"
                                        >
                                                <boxGeometry args={[1, 1, 1]} />
                                                <meshStandardMaterial color="#E8C978" emissive="#C9A24B" emissiveIntensity={0.6} transparent opacity={0.45} />
                                        </mesh>
                                        <Html
                                                position={[hovered.x, hovered.groundY + plotsCfg.padThicknessM + 1.4, hovered.z]}
                                                center
                                                zIndexRange={[15, 0]}
                                        >
                                                <div
                                                        data-testid="exp3d-plot-tooltip"
                                                        className="pointer-events-none whitespace-nowrap border border-[rgba(201,162,75,0.5)] bg-ink/90 px-3 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-ivory backdrop-blur-md"
                                                >
                                                        Plot {hovered.plot.id} ·{' '}
                                                        {hovered.plot.sqyd ? `${hovered.plot.sqyd} sq.yd` : 'Size on request'}
                                                </div>
                                        </Html>
                                </>
                        )}
                        {selected && (
                                <mesh
                                        position={[selected.x, selected.groundY + plotsCfg.padThicknessM / 2 + 0.05, selected.z]}
                                        scale={[selected.width + 0.5, plotsCfg.padThicknessM + 0.15, selected.depth + 0.5]}
                                        data-testid="exp3d-plot-selected-highlight"
                                >
                                        <boxGeometry args={[1, 1, 1]} />
                                        <meshStandardMaterial color="#E8C978" emissive="#C9A24B" emissiveIntensity={0.9} transparent opacity={0.35} wireframe />
                                </mesh>
                        )}
                </group>
        );
}
