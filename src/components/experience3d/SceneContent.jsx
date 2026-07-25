'use client';

import { useMemo } from 'react';
import Terrain from './Terrain';
import Roads from './Roads';
import BoundaryWall from './BoundaryWall';
import Trees from './Trees';
import PlotPads from './PlotPads';
import Landmarks from './Landmarks';
import AmenityMarkers from './AmenityMarkers';
import CameraRig from './CameraRig';
import WalkControls from './WalkControls';
import { buildElevationAnchors, buildAllPlots3D } from '@/lib/site3dGeometry';

export default function SceneContent({
        site3d,
        plotsData,
        mode,
        viewpointKey,
        flightNonce,
        reducedMotion,
        hoveredId,
        selectedId,
        onHoverPlot,
        onSelectPlot,
        onSelectAmenity,
        joystickRef,
}) {
        const { world, boundary } = site3d;
        const gateLevel = plotsData.project.gateLevel;

        const anchors = useMemo(() => buildElevationAnchors(plotsData, site3d), [plotsData, site3d]);
        const plots3D = useMemo(() => buildAllPlots3D(plotsData, site3d, anchors), [plotsData, site3d, anchors]);
        const startAt = site3d.walk.startAt;

        return (
                <>
                        <color attach="background" args={['#0A0A0A']} />
                        <fog attach="fog" args={['#0A0A0A', 90, 340]} />

                        {/* Warm low "gold hour" sun */}
                        <hemisphereLight args={['#3a3428', '#0A0A0A', 0.5]} />
                        <ambientLight intensity={0.28} color="#C9A24B" />
                        <directionalLight
                                position={[-90, 55, 70]}
                                intensity={1.7}
                                color="#F3D9A0"
                                castShadow
                                shadow-mapSize={[1024, 1024]}
                                shadow-camera-left={-140}
                                shadow-camera-right={140}
                                shadow-camera-top={140}
                                shadow-camera-bottom={-140}
                                shadow-camera-far={300}
                                shadow-bias={-0.0006}
                        />
                        <directionalLight position={[60, 30, -60]} intensity={0.35} color="#8AA0C9" />

                        <Terrain world={world} boundary={boundary} anchors={anchors} gateLevel={gateLevel} />
                        <Roads site3d={site3d} world={world} anchors={anchors} gateLevel={gateLevel} />
                        <BoundaryWall boundary={boundary} world={world} anchors={anchors} gateLevel={gateLevel} />
                        <Trees site3d={site3d} world={world} boundary={boundary} anchors={anchors} gateLevel={gateLevel} />
                        <Landmarks site3d={site3d} world={world} anchors={anchors} gateLevel={gateLevel} />
                        <PlotPads
                                plots3D={plots3D}
                                world={world}
                                plotsCfg={site3d.plots}
                                gateLevel={gateLevel}
                                hoveredId={hoveredId}
                                selectedId={selectedId}
                                onHover={onHoverPlot}
                                onSelect={onSelectPlot}
                        />
                        <AmenityMarkers site3d={site3d} world={world} anchors={anchors} gateLevel={gateLevel} onSelect={onSelectAmenity} />

                        <CameraRig
                                site3d={site3d}
                                world={world}
                                anchors={anchors}
                                gateLevel={gateLevel}
                                mode={mode}
                                viewpointKey={viewpointKey}
                                flightNonce={flightNonce}
                                reducedMotion={reducedMotion}
                        />
                        <WalkControls
                                active={mode === 'walk'}
                                site3d={site3d}
                                world={world}
                                anchors={anchors}
                                gateLevel={gateLevel}
                                boundary={boundary}
                                joystickRef={joystickRef}
                                startAt={startAt}
                        />
                </>
        );
}
