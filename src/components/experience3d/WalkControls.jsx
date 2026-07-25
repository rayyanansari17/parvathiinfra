'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { pctToWorld, terrainWorldY, pointInPolygon } from '@/lib/site3dGeometry';

const KEY_MAP = {
        KeyW: 'f',
        ArrowUp: 'f',
        KeyS: 'b',
        ArrowDown: 'b',
        KeyA: 'l',
        ArrowLeft: 'l',
        KeyD: 'r',
        ArrowRight: 'r',
};

// First-person walk mode: WASD/arrows + drag-look on desktop, joystick +
// drag-look on mobile (the joystick vector is written into joystickRef by
// the on-screen <Joystick> UI component, which lives outside the canvas).
// Movement is clamped to the sanctioned boundary and the camera always
// rides the interpolated terrain height at eye level, so walking north
// means walking up the real slope.
export default function WalkControls({ active, site3d, world, anchors, gateLevel, boundary, joystickRef, startAt }) {
        const { camera, gl, invalidate } = useThree();
        const keys = useRef({ f: false, b: false, l: false, r: false });
        const yaw = useRef(Math.PI);
        const pitch = useRef(0);
        const drag = useRef(null);
        const started = useRef(false);

        useEffect(() => {
                if (!active) {
                        started.current = false;
                        return undefined;
                }

                if (!started.current) {
                        started.current = true;
                        const at = pctToWorld(startAt, world);
                        const y = terrainWorldY(startAt.x, startAt.y, anchors, gateLevel, world.verticalExaggeration);
                        camera.position.set(at.x, y + site3d.walk.eyeHeightM, at.z);
                        yaw.current = Math.PI; // face north, into the site
                        pitch.current = 0;
                        camera.rotation.order = 'YXZ';
                        camera.rotation.set(0, yaw.current, 0);
                        invalidate();
                }

                const onKeyDown = (e) => {
                        const dir = KEY_MAP[e.code];
                        if (dir) keys.current[dir] = true;
                };
                const onKeyUp = (e) => {
                        const dir = KEY_MAP[e.code];
                        if (dir) keys.current[dir] = false;
                };
                const dom = gl.domElement;
                const onPointerDown = (e) => {
                        drag.current = { x: e.clientX, y: e.clientY };
                };
                const onPointerMove = (e) => {
                        if (!drag.current) return;
                        const dx = e.clientX - drag.current.x;
                        const dy = e.clientY - drag.current.y;
                        drag.current = { x: e.clientX, y: e.clientY };
                        yaw.current -= dx * 0.0045;
                        pitch.current = Math.max(-1.0, Math.min(1.0, pitch.current - dy * 0.0035));
                        invalidate();
                };
                const onPointerUp = () => {
                        drag.current = null;
                };

                window.addEventListener('keydown', onKeyDown);
                window.addEventListener('keyup', onKeyUp);
                dom.addEventListener('pointerdown', onPointerDown);
                window.addEventListener('pointermove', onPointerMove);
                window.addEventListener('pointerup', onPointerUp);

                return () => {
                        window.removeEventListener('keydown', onKeyDown);
                        window.removeEventListener('keyup', onKeyUp);
                        dom.removeEventListener('pointerdown', onPointerDown);
                        window.removeEventListener('pointermove', onPointerMove);
                        window.removeEventListener('pointerup', onPointerUp);
                };
        }, [active, gl, camera, invalidate, site3d, world, anchors, gateLevel, startAt]);

        useFrame((_, delta) => {
                if (!active) return;
                invalidate();

                const joy = joystickRef?.current ?? { x: 0, y: 0 };
                let fwd = 0;
                let strafe = 0;
                if (keys.current.f) fwd += 1;
                if (keys.current.b) fwd -= 1;
                if (keys.current.r) strafe += 1;
                if (keys.current.l) strafe -= 1;
                fwd += -joy.y;
                strafe += joy.x;
                fwd = Math.max(-1, Math.min(1, fwd));
                strafe = Math.max(-1, Math.min(1, strafe));

                camera.rotation.order = 'YXZ';
                camera.rotation.set(pitch.current * 0.6, yaw.current, 0);

                if (fwd !== 0 || strafe !== 0) {
                        const speed = site3d.walk.speedMps * Math.min(delta, 0.05);
                        const dirX = Math.sin(yaw.current);
                        const dirZ = Math.cos(yaw.current);
                        const rightX = Math.cos(yaw.current);
                        const rightZ = -Math.sin(yaw.current);
                        const nx = camera.position.x - dirX * fwd * speed + rightX * strafe * speed;
                        const nz = camera.position.z - dirZ * fwd * speed + rightZ * strafe * speed;

                        const xPct = (nx / world.widthM + 0.5) * 100;
                        const yPct = (nz / world.depthM + 0.5) * 100;
                        if (pointInPolygon(xPct, yPct, boundary)) {
                                camera.position.x = nx;
                                camera.position.z = nz;
                        }
                }

                const xPct = (camera.position.x / world.widthM + 0.5) * 100;
                const yPct = (camera.position.z / world.depthM + 0.5) * 100;
                const groundY = terrainWorldY(xPct, yPct, anchors, gateLevel, world.verticalExaggeration);
                camera.position.y = groundY + site3d.walk.eyeHeightM;
        });

        return null;
}
