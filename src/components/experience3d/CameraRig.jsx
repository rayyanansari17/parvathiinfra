'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { pctToWorld, terrainWorldY } from '@/lib/site3dGeometry';

function viewpointVectors(vp, world, anchors, gateLevel) {
        const at = pctToWorld(vp.at, world);
        const target = pctToWorld(vp.target, world);
        const atY = terrainWorldY(vp.at.x, vp.at.y, anchors, gateLevel, world.verticalExaggeration) + vp.eyeHeightM;
        const targetY = terrainWorldY(vp.target.x, vp.target.y, anchors, gateLevel, world.verticalExaggeration) + vp.targetHeightM;
        return {
                position: new THREE.Vector3(at.x, atY, at.z),
                target: new THREE.Vector3(target.x, targetY, target.z),
        };
}

// Reports the live camera position/target on `window.__cam` every rendered
// frame, purely so automated checks (and, harmlessly, curious devs) can
// prove the camera actually moved rather than assuming it from a click.
function CameraDebugHook({ controlsRef }) {
        useFrame(({ camera }) => {
                if (typeof window === 'undefined') return;
                window.__cam = {
                        x: camera.position.x,
                        y: camera.position.y,
                        z: camera.position.z,
                        targetX: controlsRef.current?.target?.x ?? null,
                        targetY: controlsRef.current?.target?.y ?? null,
                        targetZ: controlsRef.current?.target?.z ?? null,
                };
        });
        return null;
}

// Orbit controls + the guided-viewpoint camera flight spine. Walk mode is
// handled by the sibling <WalkControls> component; this rig disables
// itself (via the `enabled` prop) while walking.
export default function CameraRig({ site3d, world, anchors, gateLevel, mode, viewpointKey, flightNonce, reducedMotion }) {
        const controlsRef = useRef(null);
        const tweenRef = useRef(null);
        const { camera, invalidate } = useThree();
        const initialised = useRef(false);

        // Initial framing: whole-site orbit view.
        useEffect(() => {
                if (initialised.current) return;
                initialised.current = true;
                const vp = site3d.camera.viewpoints.wholeSite;
                const { position, target } = viewpointVectors(vp, world, anchors, gateLevel);
                camera.position.copy(position);
                if (controlsRef.current) {
                        controlsRef.current.target.copy(target);
                        controlsRef.current.update();
                }
                invalidate();
                // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() => {
                if (!viewpointKey) return undefined;
                const vp = site3d.camera.viewpoints[viewpointKey];
                if (!vp) return undefined;
                const { position, target } = viewpointVectors(vp, world, anchors, gateLevel);

                if (tweenRef.current) tweenRef.current.kill();

                if (reducedMotion || !controlsRef.current) {
                        camera.position.copy(position);
                        if (controlsRef.current) controlsRef.current.target.copy(target);
                        controlsRef.current?.update();
                        invalidate();
                        return undefined;
                }

                const from = {
                        px: camera.position.x,
                        py: camera.position.y,
                        pz: camera.position.z,
                        tx: controlsRef.current.target.x,
                        ty: controlsRef.current.target.y,
                        tz: controlsRef.current.target.z,
                };
                const to = { px: position.x, py: position.y, pz: position.z, tx: target.x, ty: target.y, tz: target.z };

                tweenRef.current = gsap.to(from, {
                        ...to,
                        duration: 1.6,
                        ease: 'power2.inOut',
                        onUpdate: () => {
                                camera.position.set(from.px, from.py, from.pz);
                                controlsRef.current.target.set(from.tx, from.ty, from.tz);
                                controlsRef.current.update();
                                invalidate();
                        },
                });

                return () => tweenRef.current?.kill();
                // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [viewpointKey, flightNonce, reducedMotion]);

        return (
                <>
                        <OrbitControls
                                ref={controlsRef}
                                makeDefault
                                enabled={mode === 'orbit'}
                                enableDamping
                                dampingFactor={0.08}
                                minDistance={8}
                                maxDistance={260}
                                maxPolarAngle={Math.PI / 2 - 0.02}
                                onChange={() => invalidate()}
                        />
                        <CameraDebugHook controlsRef={controlsRef} />
                </>
        );
}

export { viewpointVectors };
