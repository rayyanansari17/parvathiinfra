'use client';

import { useRef, useState } from 'react';

// On-screen joystick for walk mode on touch devices. Writes a normalised
// {x,y} vector (-1..1) into `joystickRef.current`, read every frame by
// <WalkControls>. Drag-look for turning happens by dragging anywhere else
// on the canvas (handled in WalkControls itself).
export default function Joystick({ joystickRef }) {
        const baseRef = useRef(null);
        const [active, setActive] = useState(false);
        const [knob, setKnob] = useState({ x: 0, y: 0 });
        const pointerId = useRef(null);

        const RADIUS = 44;

        const update = (clientX, clientY) => {
                const base = baseRef.current;
                if (!base) return;
                const rect = base.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                let dx = clientX - cx;
                let dy = clientY - cy;
                const dist = Math.hypot(dx, dy);
                if (dist > RADIUS) {
                        dx = (dx / dist) * RADIUS;
                        dy = (dy / dist) * RADIUS;
                }
                setKnob({ x: dx, y: dy });
                if (joystickRef) joystickRef.current = { x: dx / RADIUS, y: dy / RADIUS };
        };

        const onPointerDown = (e) => {
                pointerId.current = e.pointerId;
                e.currentTarget.setPointerCapture(e.pointerId);
                setActive(true);
                update(e.clientX, e.clientY);
        };
        const onPointerMove = (e) => {
                if (pointerId.current !== e.pointerId) return;
                update(e.clientX, e.clientY);
        };
        const reset = (e) => {
                if (pointerId.current !== e.pointerId) return;
                pointerId.current = null;
                setActive(false);
                setKnob({ x: 0, y: 0 });
                if (joystickRef) joystickRef.current = { x: 0, y: 0 };
        };

        return (
                <div
                        ref={baseRef}
                        data-testid="exp3d-joystick"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={reset}
                        onPointerCancel={reset}
                        className="pointer-events-auto fixed bottom-28 left-6 z-[86] flex h-24 w-24 touch-none items-center justify-center rounded-full border border-[rgba(201,162,75,0.4)] bg-ink/50 backdrop-blur-md md:hidden"
                >
                        <div
                                className={`h-11 w-11 rounded-full border border-gold bg-gold/25 transition-transform ${active ? '' : 'duration-200'}`}
                                style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
                        />
                </div>
        );
}
