import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Scene 1 · Cinematic 3D approach through a Parvathi Infra grand entrance arch.
 *
 * Built with pure CSS 3D transforms + framer-motion (no three.js).
 * The `camera` element is translated forward in Z-space so the fixed
 * architecture appears to grow larger and pass over the viewer.
 *
 * onFinished() is called after the full ~6s dolly + gold flash.
 */
export default function WalkthroughScene1({ onFinished }) {
        const [flash, setFlash] = useState(false);

        useEffect(() => {
                const flashT = setTimeout(() => setFlash(true), 5400);
                const doneT = setTimeout(() => onFinished?.(), 6200);
                return () => {
                        clearTimeout(flashT);
                        clearTimeout(doneT);
                };
        }, [onFinished]);

        return (
                <div
                        data-testid="walkthrough-scene-1"
                        className="relative h-full w-full overflow-hidden bg-[#050505]"
                        style={{ perspective: '1400px', perspectiveOrigin: '50% 62%' }}
                >
                        {/* Warm sky / atmosphere backdrop, sits deepest in Z */}
                        <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                        background:
                                                'radial-gradient(ellipse 80% 55% at 50% 68%, rgba(232,201,120,0.28) 0%, rgba(191,149,63,0.08) 30%, transparent 60%), radial-gradient(ellipse 100% 60% at 50% 30%, rgba(20,15,10,0.9) 0%, #050505 70%), linear-gradient(180deg, #060606 0%, #0A0906 55%, #050403 100%)',
                                }}
                        />

                        {/* Distant twinkling stars / dust motes */}
                        <div className="pointer-events-none absolute inset-0">
                                {Array.from({ length: 42 }).map((_, i) => {
                                        const left = ((i * 977) % 100) + Math.random() * 2;
                                        const top = ((i * 631) % 60) + 5;
                                        const size = 1 + (i % 3);
                                        const delay = (i % 8) * 0.35;
                                        return (
                                                <span
                                                        key={i}
                                                        className="absolute rounded-full bg-[#E8C978]"
                                                        style={{
                                                                left: `${left}%`,
                                                                top: `${top}%`,
                                                                width: size,
                                                                height: size,
                                                                opacity: 0.7,
                                                                animation: `wtSparkle 3.6s ${delay}s ease-in-out infinite`,
                                                        }}
                                                />
                                        );
                                })}
                        </div>

                        {/* Ground fog / haze layer at horizon */}
                        <div
                                className="pointer-events-none absolute inset-x-0"
                                style={{
                                        bottom: '18%',
                                        height: '30%',
                                        background:
                                                'linear-gradient(180deg, transparent 0%, rgba(201,162,75,0.14) 45%, rgba(6,6,6,0) 100%)',
                                        filter: 'blur(20px)',
                                }}
                        />

                        {/* Camera dolly — the entire architecture is translated toward the viewer */}
                        <motion.div
                                className="absolute inset-0"
                                style={{
                                        transformStyle: 'preserve-3d',
                                        transformOrigin: '50% 62%',
                                }}
                                initial={{ z: -1500, rotateX: 2 }}
                                animate={{ z: 260, rotateX: 0 }}
                                transition={{ duration: 6.0, ease: [0.42, 0, 0.2, 1] }}
                        >
                                {/* ───────── Marble / onyx ground plane ───────── */}
                                <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                                width: '4200px',
                                                height: '2400px',
                                                marginLeft: '-2100px',
                                                marginTop: '-1200px',
                                                transform: 'rotateX(74deg) translateZ(-40px) translateY(560px)',
                                                background:
                                                        'radial-gradient(ellipse at 50% 50%, rgba(30,25,18,0.9) 0%, rgba(8,7,6,0.98) 45%, #050403 80%), repeating-linear-gradient(115deg, rgba(201,162,75,0.045) 0px, transparent 3px, transparent 60px), repeating-linear-gradient(65deg, rgba(232,201,120,0.03) 0px, transparent 2px, transparent 90px)',
                                                boxShadow: 'inset 0 0 220px 30px rgba(0,0,0,0.8)',
                                        }}
                                />

                                {/* Gold carpet runner leading through the arch */}
                                <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                                width: '340px',
                                                height: '2400px',
                                                marginLeft: '-170px',
                                                marginTop: '-1200px',
                                                transform: 'rotateX(74deg) translateZ(-30px) translateY(600px)',
                                                background:
                                                        'linear-gradient(180deg, rgba(191,149,63,0) 0%, rgba(191,149,63,0.28) 30%, rgba(232,201,120,0.42) 55%, rgba(170,119,28,0.28) 80%, rgba(191,149,63,0) 100%)',
                                                filter: 'blur(1px)',
                                                boxShadow:
                                                        '0 0 60px 10px rgba(201,162,75,0.25), inset 0 0 80px rgba(0,0,0,0.4)',
                                        }}
                                />

                                {/* ───────── Left flag ───────── */}
                                <Flag
                                        side="left"
                                        style={{
                                                left: '50%',
                                                top: '50%',
                                                transform:
                                                        'translate3d(-540px, -260px, 40px)',
                                        }}
                                />
                                {/* ───────── Right flag ───────── */}
                                <Flag
                                        side="right"
                                        style={{
                                                left: '50%',
                                                top: '50%',
                                                transform:
                                                        'translate3d(540px, -260px, 40px) rotateY(180deg)',
                                        }}
                                />

                                {/* ───────── Left pillar ───────── */}
                                <Pillar
                                        style={{
                                                left: '50%',
                                                top: '50%',
                                                transform:
                                                        'translate3d(-290px, -170px, 0) rotateY(0.5deg)',
                                        }}
                                />
                                {/* ───────── Right pillar ───────── */}
                                <Pillar
                                        style={{
                                                left: '50%',
                                                top: '50%',
                                                transform:
                                                        'translate3d(210px, -170px, 0) rotateY(-0.5deg)',
                                        }}
                                        mirror
                                />

                                {/* ───────── Arch header with keystone ───────── */}
                                <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                                width: '580px',
                                                height: '210px',
                                                marginLeft: '-290px',
                                                marginTop: '-540px',
                                                transform: 'translateZ(20px)',
                                        }}
                                >
                                        <svg
                                                viewBox="0 0 580 210"
                                                className="h-full w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                                        >
                                                <defs>
                                                        <linearGradient id="archStone" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#121110" />
                                                                <stop offset="55%" stopColor="#1B1815" />
                                                                <stop offset="100%" stopColor="#0B0A09" />
                                                        </linearGradient>
                                                        <linearGradient id="archGold" x1="0" y1="0" x2="1" y2="0">
                                                                <stop offset="0%" stopColor="#8A6D2F" />
                                                                <stop offset="15%" stopColor="#BF953F" />
                                                                <stop offset="45%" stopColor="#FCF6BA" />
                                                                <stop offset="70%" stopColor="#B38728" />
                                                                <stop offset="100%" stopColor="#8A6D2F" />
                                                        </linearGradient>
                                                        <radialGradient id="keystoneG" cx="0.5" cy="0.5" r="0.5">
                                                                <stop offset="0%" stopColor="#FCF6BA" />
                                                                <stop offset="55%" stopColor="#BF953F" />
                                                                <stop offset="100%" stopColor="#6B4E1C" />
                                                        </radialGradient>
                                                </defs>
                                                {/* Arch body */}
                                                <path
                                                        d="M20 200 L20 150 Q20 20 290 20 Q560 20 560 150 L560 200 Z"
                                                        fill="url(#archStone)"
                                                        stroke="url(#archGold)"
                                                        strokeWidth="1.6"
                                                />
                                                {/* Inner arch opening highlight */}
                                                <path
                                                        d="M60 200 L60 155 Q60 55 290 55 Q520 55 520 155 L520 200"
                                                        fill="none"
                                                        stroke="url(#archGold)"
                                                        strokeWidth="1.2"
                                                        opacity="0.55"
                                                />
                                                {/* Ornamental band */}
                                                <path
                                                        d="M20 90 Q290 -18 560 90"
                                                        fill="none"
                                                        stroke="url(#archGold)"
                                                        strokeWidth="0.8"
                                                        opacity="0.7"
                                                />
                                                {/* Keystone */}
                                                <path
                                                        d="M270 26 L310 26 L318 66 L262 66 Z"
                                                        fill="url(#keystoneG)"
                                                        stroke="#8A6D2F"
                                                        strokeWidth="0.5"
                                                />
                                                {/* Filigree */}
                                                <circle cx="120" cy="90" r="3" fill="url(#archGold)" />
                                                <circle cx="460" cy="90" r="3" fill="url(#archGold)" />
                                                <circle cx="290" cy="46" r="2.4" fill="#FCF6BA" />
                                        </svg>
                                </div>

                                {/* ───────── Central plaque · PARVATHI INFRA · THE VIEW ───────── */}
                                <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                                width: '460px',
                                                marginLeft: '-230px',
                                                marginTop: '-350px',
                                                transform: 'translateZ(55px)',
                                                textAlign: 'center',
                                        }}
                                >
                                        <motion.div
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 1.2, duration: 0.9 }}
                                                className="font-display text-[15px] tracking-[0.55em]"
                                                style={{ color: '#F5F1E8' }}
                                        >
                                                PARVATHI INFRA
                                        </motion.div>
                                        <motion.div
                                                initial={{ opacity: 0, letterSpacing: '0.14em' }}
                                                animate={{ opacity: 1, letterSpacing: '0.32em' }}
                                                transition={{ delay: 1.6, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                                                className="mt-3 font-display"
                                                style={{
                                                        fontSize: '48px',
                                                        background:
                                                                'linear-gradient(92deg,#BF953F 0%,#FCF6BA 30%,#B38728 60%,#FBF5B7 80%,#AA771C 100%)',
                                                        backgroundSize: '200% auto',
                                                        WebkitBackgroundClip: 'text',
                                                        backgroundClip: 'text',
                                                        WebkitTextFillColor: 'transparent',
                                                        filter: 'drop-shadow(0 4px 16px rgba(201,162,75,0.35))',
                                                }}
                                        >
                                                THE VIEW
                                        </motion.div>
                                        <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 2.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                                className="mx-auto mt-4 h-px w-40"
                                                style={{
                                                        background:
                                                                'linear-gradient(90deg,transparent,#C9A24B,transparent)',
                                                        transformOrigin: 'center',
                                                }}
                                        />
                                </div>

                                {/* ───────── Warm uplights at base of pillars ───────── */}
                                <div
                                        className="absolute left-1/2 top-1/2 pointer-events-none"
                                        style={{
                                                width: '520px',
                                                height: '260px',
                                                marginLeft: '-260px',
                                                marginTop: '160px',
                                                transform: 'translateZ(30px)',
                                                background:
                                                        'radial-gradient(circle at 12% 50%, rgba(232,201,120,0.55) 0%, transparent 22%), radial-gradient(circle at 88% 50%, rgba(232,201,120,0.55) 0%, transparent 22%)',
                                                filter: 'blur(24px)',
                                                mixBlendMode: 'screen',
                                        }}
                                />

                                {/* Foreground fog for depth */}
                                <div
                                        className="pointer-events-none absolute inset-x-0 bottom-0"
                                        style={{
                                                height: '38%',
                                                background:
                                                        'linear-gradient(180deg, transparent 0%, rgba(5,5,5,0.7) 60%, #050505 100%)',
                                        }}
                                />
                        </motion.div>

                        {/* Vignette + film grain overlay */}
                        <div className="pointer-events-none absolute inset-0 grain-overlay" />
                        <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                        background:
                                                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
                        }}
                        />

                        {/* Cinematic letterbox bars */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-[#020202]" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-[#020202]" />

                        {/* End-of-scene gold flash */}
                        <motion.div
                                aria-hidden
                                initial={{ opacity: 0 }}
                                animate={{ opacity: flash ? 1 : 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="pointer-events-none absolute inset-0"
                                style={{
                                        background:
                                                'radial-gradient(circle at 50% 55%, rgba(255,236,180,0.9) 0%, rgba(201,162,75,0.4) 30%, rgba(0,0,0,0) 70%)',
                                }}
                        />

                        {/* Scene caption */}
                        <div className="absolute left-6 top-6 z-10 text-[0.6rem] uppercase tracking-[0.44em] text-ivory-dim/80 md:left-10 md:top-10">
                                Scene 01 · The Grand Arrival
                        </div>

                        <style>{`
                                @keyframes wtSparkle {
                                        0%, 100% { opacity: 0.15; transform: scale(1); }
                                        50%      { opacity: 0.9;  transform: scale(1.4); }
                                }
                                @keyframes wtFlagWave {
                                        0%   { transform: perspective(600px) rotateY(-2deg) skewY(-1.5deg); }
                                        50%  { transform: perspective(600px) rotateY(6deg)  skewY(1.5deg); }
                                        100% { transform: perspective(600px) rotateY(-2deg) skewY(-1.5deg); }
                                }
                                @keyframes wtFlagWaveLower {
                                        0%   { transform: skewY(1.2deg); }
                                        50%  { transform: skewY(-1.2deg); }
                                        100% { transform: skewY(1.2deg); }
                                }
                        `}</style>
                </div>
        );
}

// ------------------------------------------------------------------
// Pillar — dark stone with vertical gold inlay, base + capital.
// Constructed from 3 stacked 3D faces to give real thickness in Z.
// ------------------------------------------------------------------
function Pillar({ style, mirror = false }) {
        return (
                <div
                        className="absolute"
                        style={{
                                ...style,
                                width: '80px',
                                height: '500px',
                                marginTop: '-250px',
                                marginLeft: '-40px',
                                transformStyle: 'preserve-3d',
                        }}
                >
                        {/* Side face for real 3D thickness */}
                        <div
                                className="absolute"
                                style={{
                                        left: mirror ? 'auto' : 0,
                                        right: mirror ? 0 : 'auto',
                                        top: 0,
                                        width: '46px',
                                        height: '500px',
                                        transform: mirror
                                                ? 'rotateY(-70deg) translateZ(0)'
                                                : 'rotateY(70deg) translateZ(0)',
                                        transformOrigin: mirror ? 'right center' : 'left center',
                                        background:
                                                'linear-gradient(180deg, #060505 0%, #0E0C0A 45%, #060505 100%)',
                                        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
                                }}
                        />

                        {/* Front face */}
                        <div
                                className="absolute inset-0"
                                style={{
                                        background:
                                                'linear-gradient(180deg, #14110E 0%, #1F1A15 8%, #100D0A 20%, #1B1712 55%, #100D0A 80%, #22190F 92%, #14110E 100%)',
                                        boxShadow:
                                                'inset 0 0 22px rgba(0,0,0,0.85), inset 0 2px 0 rgba(201,162,75,0.18), inset 0 -2px 0 rgba(201,162,75,0.15)',
                                }}
                        >
                                {/* Gold vertical inlay */}
                                <div
                                        className="absolute left-1/2 top-[60px] bottom-[60px] -translate-x-1/2"
                                        style={{
                                                width: '3px',
                                                background:
                                                        'linear-gradient(180deg, transparent 0%, #C9A24B 12%, #FCF6BA 50%, #C9A24B 88%, transparent 100%)',
                                                boxShadow: '0 0 8px rgba(201,162,75,0.7)',
                                        }}
                                />
                                {/* Fluting (thin vertical lines) */}
                                <div
                                        className="absolute inset-y-[70px] left-3 right-3"
                                        style={{
                                                background:
                                                        'repeating-linear-gradient(90deg, transparent 0px, transparent 12px, rgba(201,162,75,0.08) 12px, rgba(201,162,75,0.08) 13px)',
                                        }}
                                />
                        </div>

                        {/* Capital (top block) */}
                        <div
                                className="absolute -left-3 -right-3 top-0 h-[38px]"
                                style={{
                                        background:
                                                'linear-gradient(180deg,#3A2E19 0%,#1B1712 60%,#0F0C09 100%)',
                                        borderTop: '1px solid rgba(232,201,120,0.55)',
                                        borderBottom: '1px solid rgba(201,162,75,0.4)',
                                        boxShadow:
                                                'inset 0 6px 0 rgba(232,201,120,0.14), inset 0 -3px 6px rgba(0,0,0,0.6)',
                                }}
                        />

                        {/* Base (bottom block) */}
                        <div
                                className="absolute -left-4 -right-4 bottom-0 h-[50px]"
                                style={{
                                        background:
                                                'linear-gradient(180deg,#0E0C09 0%,#231C11 55%,#080706 100%)',
                                        borderTop: '1px solid rgba(201,162,75,0.4)',
                                        boxShadow:
                                                'inset 0 -6px 12px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.7)',
                                }}
                        />
                </div>
        );
}

// ------------------------------------------------------------------
// Flag — flagpole + wavy fabric with the Parvathi Infra crest.
// Fabric uses a subtle CSS keyframe wave; crest is an SVG monogram.
// ------------------------------------------------------------------
function Flag({ style, side = 'left' }) {
        return (
                <div
                        className="absolute"
                        style={{
                                ...style,
                                width: '140px',
                                height: '460px',
                                marginLeft: '-70px',
                                marginTop: '-230px',
                                transformStyle: 'preserve-3d',
                        }}
                >
                        {/* Flagpole */}
                        <div
                                className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2"
                                style={{
                                        background:
                                                'linear-gradient(180deg,#3A2E19 0%,#B38728 25%,#FCF6BA 50%,#B38728 75%,#3A2E19 100%)',
                                        boxShadow: '0 0 8px rgba(201,162,75,0.5)',
                                }}
                        />
                        {/* Finial (spear top) */}
                        <div
                                className="absolute left-1/2 -top-3 h-6 w-3 -translate-x-1/2"
                                style={{
                                        clipPath: 'polygon(50% 0, 100% 60%, 50% 100%, 0 60%)',
                                        background:
                                                'linear-gradient(180deg,#FCF6BA,#BF953F 60%,#8A6D2F)',
                                        boxShadow: '0 0 8px rgba(201,162,75,0.7)',
                                }}
                        />
                        {/* Fabric wrapper (waves) */}
                        <div
                                className="absolute left-1/2 top-6"
                                style={{
                                        width: '96px',
                                        height: '120px',
                                        marginLeft: side === 'left' ? '2px' : '-98px',
                                        transformOrigin: side === 'left' ? 'left center' : 'right center',
                                        animation: 'wtFlagWave 3.4s ease-in-out infinite',
                                }}
                        >
                                <div
                                        className="relative h-full w-full overflow-hidden"
                                        style={{
                                                background:
                                                        'linear-gradient(135deg,#0F0D0B 0%,#161311 40%,#0A0908 100%)',
                                                border: '1px solid rgba(201,162,75,0.45)',
                                                boxShadow:
                                                        'inset 0 0 30px rgba(0,0,0,0.6), 0 6px 22px rgba(0,0,0,0.55)',
                                                clipPath:
                                                        side === 'left'
                                                                ? 'polygon(0 0, 100% 4%, 96% 96%, 0 100%)'
                                                                : 'polygon(0 4%, 100% 0, 100% 100%, 4% 96%)',
                                        }}
                                >
                                        {/* Gold fringe top */}
                                        <div
                                                className="absolute inset-x-0 top-0 h-1"
                                                style={{
                                                        background:
                                                                'linear-gradient(90deg,#8A6D2F,#FCF6BA,#8A6D2F)',
                                                }}
                                        />
                                        {/* Crest */}
                                        <svg
                                                viewBox="0 0 96 120"
                                                className="absolute inset-0 h-full w-full"
                                                style={{ animation: 'wtFlagWaveLower 3.4s ease-in-out infinite' }}
                                        >
                                                <defs>
                                                        <linearGradient id={`flagG-${side}`} x1="0" y1="0" x2="1" y2="1">
                                                                <stop offset="0%" stopColor="#FCF6BA" />
                                                                <stop offset="60%" stopColor="#BF953F" />
                                                                <stop offset="100%" stopColor="#6B4E1C" />
                                                        </linearGradient>
                                                </defs>
                                                {/* Triangle motif (ridge / hill) */}
                                                <path
                                                        d="M18 78 L48 32 L78 78 Z"
                                                        fill="none"
                                                        stroke={`url(#flagG-${side})`}
                                                        strokeWidth="1.2"
                                                />
                                                <circle
                                                        cx="48"
                                                        cy="60"
                                                        r="3.4"
                                                        fill={`url(#flagG-${side})`}
                                                />
                                                {/* PI monogram */}
                                                <text
                                                        x="48"
                                                        y="102"
                                                        textAnchor="middle"
                                                        fontFamily="Cinzel, serif"
                                                        fontSize="9"
                                                        letterSpacing="3"
                                                        fill="#F5F1E8"
                                                >
                                                        P · I
                                                </text>
                                        </svg>
                                        {/* Fabric sheen */}
                                        <div
                                                className="pointer-events-none absolute inset-0"
                                                style={{
                                                        background:
                                                                'linear-gradient(120deg, transparent 40%, rgba(232,201,120,0.14) 55%, transparent 70%)',
                                                }}
                                        />
                                </div>
                        </div>
                </div>
        );
}
