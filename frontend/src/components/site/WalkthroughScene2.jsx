import { useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Scene 2 · A cinematic 3D flythrough down the THE VIEW boulevard.
 *
 * The camera dollies forward through the community, past twin rows of
 * villa walls, repeating flag pairs, secondary wall arches at intervals
 * and toward a distant clubhouse landmark. Pure CSS 3D transforms +
 * framer-motion; no <video>.
 */
const DURATION_SEC = 9;

// Villa wall segments — a row on each side of the boulevard.
// Each entry: (Z depth from camera). We render two mirrored walls per Z.
const WALL_ZS = [-1800, -1400, -1000, -600, -200, 200, 600, 1000, 1400, 1800];

// Flag pairs — same story, sparser.
const FLAG_ZS = [-1500, -900, -300, 300, 900, 1500];

// Wall arch checkpoints (three total).
const ARCH_ZS = [-1600, -300, 1100];

// Lamppost pairs
const LAMP_ZS = [-2000, -1600, -1200, -800, -400, 0, 400, 800, 1200, 1600, 2000];

export default function WalkthroughScene2({ onFinished }) {
        useEffect(() => {
                const t = setTimeout(() => onFinished?.(), DURATION_SEC * 1000 + 200);
                return () => clearTimeout(t);
        }, [onFinished]);

        return (
                <div
                        data-testid="walkthrough-scene-2"
                        className="relative h-full w-full overflow-hidden bg-[#050505]"
                        style={{ perspective: '1300px', perspectiveOrigin: '50% 55%' }}
                >
                        {/* Sky · deep obsidian with a warm horizon rim */}
                        <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                        background:
                                                'radial-gradient(ellipse 90% 55% at 50% 66%, rgba(232,201,120,0.32) 0%, rgba(191,149,63,0.10) 32%, transparent 62%), radial-gradient(ellipse 100% 55% at 50% 20%, rgba(20,15,10,0.9) 0%, #050505 70%), linear-gradient(180deg,#060403 0%,#0A0806 55%,#050403 100%)',
                                }}
                        />

                        {/* Star / dust field */}
                        <div className="pointer-events-none absolute inset-0">
                                {Array.from({ length: 46 }).map((_, i) => {
                                        const left = ((i * 977) % 100) + 0.3;
                                        const top = ((i * 631) % 55) + 3;
                                        const size = 1 + (i % 3);
                                        const delay = (i % 9) * 0.28;
                                        return (
                                                <span
                                                        key={i}
                                                        className="absolute rounded-full bg-[#E8C978]"
                                                        style={{
                                                                left: `${left}%`,
                                                                top: `${top}%`,
                                                                width: size,
                                                                height: size,
                                                                opacity: 0.65,
                                                                animation: `wtSparkle 3.6s ${delay}s ease-in-out infinite`,
                                                        }}
                                                />
                                        );
                                })}
                        </div>

                        {/* Camera dolly · everything sits inside a preserve-3d wrapper */}
                        <motion.div
                                className="absolute inset-0"
                                style={{
                                        transformStyle: 'preserve-3d',
                                        transformOrigin: '50% 55%',
                                }}
                                initial={{ z: -2000 }}
                                animate={{ z: 1700 }}
                                transition={{ duration: DURATION_SEC, ease: 'linear' }}
                        >
                                {/* Marble/onyx ground */}
                                <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                                width: '5200px',
                                                height: '4400px',
                                                marginLeft: '-2600px',
                                                marginTop: '-2200px',
                                                transform: 'rotateX(76deg) translateZ(-40px) translateY(500px)',
                                                background:
                                                        'radial-gradient(ellipse at 50% 40%, rgba(30,25,18,0.9) 0%, rgba(8,7,6,0.98) 45%, #050403 85%), repeating-linear-gradient(115deg, rgba(201,162,75,0.05) 0px, transparent 3px, transparent 70px), repeating-linear-gradient(65deg, rgba(232,201,120,0.03) 0px, transparent 2px, transparent 110px)',
                                                boxShadow: 'inset 0 0 260px 40px rgba(0,0,0,0.85)',
                                        }}
                                />

                                {/* Gold boulevard runner */}
                                <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                                width: '260px',
                                                height: '4400px',
                                                marginLeft: '-130px',
                                                marginTop: '-2200px',
                                                transform: 'rotateX(76deg) translateZ(-28px) translateY(520px)',
                                                background:
                                                        'linear-gradient(180deg, rgba(191,149,63,0) 0%, rgba(191,149,63,0.28) 25%, rgba(232,201,120,0.42) 50%, rgba(170,119,28,0.28) 75%, rgba(191,149,63,0) 100%)',
                                                filter: 'blur(1px)',
                                                boxShadow: '0 0 60px 10px rgba(201,162,75,0.22)',
                                        }}
                                />

                                {/* Center golden dividing line pulse — light strip down the middle */}
                                <div
                                        className="absolute left-1/2 top-1/2"
                                        style={{
                                                width: '4px',
                                                height: '4400px',
                                                marginLeft: '-2px',
                                                marginTop: '-2200px',
                                                transform: 'rotateX(76deg) translateZ(-25px) translateY(520px)',
                                                background:
                                                        'linear-gradient(180deg, transparent 0%, #C9A24B 20%, #FCF6BA 50%, #C9A24B 80%, transparent 100%)',
                                                boxShadow: '0 0 12px rgba(232,201,120,0.7)',
                                        }}
                                />

                                {/* --- Villa walls — twin rows down the boulevard --- */}
                                {WALL_ZS.map((z) => (
                                        <VillaWallPair key={`wall-${z}`} z={z} />
                                ))}

                                {/* --- Flag pairs --- */}
                                {FLAG_ZS.map((z) => (
                                        <FlagPair key={`flag-${z}`} z={z} />
                                ))}

                                {/* --- Lamppost pairs --- */}
                                {LAMP_ZS.map((z) => (
                                        <LampPostPair key={`lamp-${z}`} z={z} />
                                ))}

                                {/* --- Wall arch checkpoints --- */}
                                {ARCH_ZS.map((z) => (
                                        <WallArch key={`arch-${z}`} z={z} />
                                ))}

                                {/* --- Distant clubhouse landmark --- */}
                                <Clubhouse z={2400} />

                                {/* Foreground fog for depth */}
                                <div
                                        className="pointer-events-none absolute inset-x-0 bottom-0"
                                        style={{
                                                height: '35%',
                                                background:
                                                        'linear-gradient(180deg, transparent 0%, rgba(5,5,5,0.75) 65%, #050505 100%)',
                                        }}
                                />
                        </motion.div>

                        {/* Vignette + grain */}
                        <div className="pointer-events-none absolute inset-0 grain-overlay" />
                        <div
                                className="pointer-events-none absolute inset-0"
                                style={{
                                        background:
                                                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
                                }}
                        />

                        {/* Cinematic letterbox */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-[8vh] bg-[#020202]" />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-[#020202]" />

                        {/* Caption */}
                        <div className="absolute left-6 top-8 z-10 text-[0.6rem] uppercase tracking-[0.44em] text-ivory-dim/80 md:left-10 md:top-10">
                                Scene 02 · Down the Boulevard · Kadthal
                        </div>
                        <div className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-center">
                                <div className="font-serif-elegant text-lg italic text-ivory-dim md:text-2xl">
                                        45 exclusive villa plots,
                                </div>
                                <div className="mt-1 font-display text-[0.65rem] uppercase tracking-[0.44em] text-gold">
                                        approach the clubhouse
                                </div>
                        </div>

                        <style>{`
                                @keyframes wtSparkle {
                                        0%, 100% { opacity: 0.15; transform: scale(1); }
                                        50%      { opacity: 0.85; transform: scale(1.4); }
                                }
                                @keyframes wtFlagWave {
                                        0%   { transform: perspective(600px) rotateY(-3deg) skewY(-1.5deg); }
                                        50%  { transform: perspective(600px) rotateY(8deg) skewY(1.5deg); }
                                        100% { transform: perspective(600px) rotateY(-3deg) skewY(-1.5deg); }
                                }
                                @keyframes wtLampFlicker {
                                        0%, 100% { opacity: 0.85; }
                                        45%      { opacity: 1; }
                                        55%      { opacity: 0.75; }
                                }
                        `}</style>
                </div>
        );
}

// ------------------------------------------------------------------
// Villa wall pair — short obsidian wall with gold-topped cap and a
// small plot-number plaque, mirrored across the boulevard.
// ------------------------------------------------------------------
function VillaWallPair({ z }) {
        const height = 130;
        const width = 260;
        return (
                <>
                        <div
                                className="absolute left-1/2 top-1/2"
                                style={{
                                        width,
                                        height,
                                        marginLeft: -(230 + width),
                                        marginTop: -(height / 2) - 20,
                                        transform: `translate3d(0, 0, ${z}px)`,
                                        transformStyle: 'preserve-3d',
                                }}
                        >
                                <WallSlab />
                        </div>
                        <div
                                className="absolute left-1/2 top-1/2"
                                style={{
                                        width,
                                        height,
                                        marginLeft: 230,
                                        marginTop: -(height / 2) - 20,
                                        transform: `translate3d(0, 0, ${z}px)`,
                                        transformStyle: 'preserve-3d',
                                }}
                        >
                                <WallSlab />
                        </div>
                </>
        );
}

function WallSlab() {
        return (
                <div
                        className="relative h-full w-full"
                        style={{
                                background:
                                        'linear-gradient(180deg,#0F0D0B 0%,#161311 50%,#0A0908 100%)',
                                borderTop: '2px solid transparent',
                                boxShadow:
                                        'inset 0 4px 0 rgba(232,201,120,0.5), inset 0 0 40px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.5)',
                        }}
                >
                        {/* gold cap */}
                        <div
                                className="absolute inset-x-0 top-0 h-1"
                                style={{
                                        background:
                                                'linear-gradient(90deg,#8A6D2F 0%,#FCF6BA 45%,#B38728 55%,#8A6D2F 100%)',
                                }}
                        />
                        {/* vertical inlay */}
                        <div
                                className="absolute left-1/2 top-3 bottom-3 w-[2px] -translate-x-1/2"
                                style={{
                                        background:
                                                'linear-gradient(180deg, transparent 0%, #C9A24B 20%, #FCF6BA 50%, #C9A24B 80%, transparent 100%)',
                                        boxShadow: '0 0 6px rgba(201,162,75,0.6)',
                                }}
                        />
                        {/* plaque */}
                        <div
                                className="absolute left-1/2 top-4 -translate-x-1/2 border border-[rgba(201,162,75,0.5)] bg-[#080706] px-2 py-0.5 text-[8px] tracking-[0.28em] text-ivory"
                                style={{ fontFamily: 'Cinzel, serif' }}
                        >
                                P · I
                        </div>
                </div>
        );
}

// ------------------------------------------------------------------
// Flag pair — twin flagpoles with waving Parvathi Infra crest, mirrored.
// ------------------------------------------------------------------
function FlagPair({ z }) {
        return (
                <>
                        <MiniFlag
                                style={{
                                        left: '50%',
                                        top: '50%',
                                        transform: `translate3d(-360px, -160px, ${z}px)`,
                                }}
                                side="left"
                        />
                        <MiniFlag
                                style={{
                                        left: '50%',
                                        top: '50%',
                                        transform: `translate3d(360px, -160px, ${z}px) rotateY(180deg)`,
                                }}
                                side="right"
                        />
                </>
        );
}

function MiniFlag({ style, side = 'left' }) {
        return (
                <div
                        className="absolute"
                        style={{
                                ...style,
                                width: 90,
                                height: 320,
                                marginLeft: -45,
                                marginTop: -160,
                                transformStyle: 'preserve-3d',
                        }}
                >
                        {/* pole */}
                        <div
                                className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2"
                                style={{
                                        background:
                                                'linear-gradient(180deg,#3A2E19 0%,#B38728 35%,#FCF6BA 55%,#B38728 75%,#3A2E19 100%)',
                                        boxShadow: '0 0 6px rgba(201,162,75,0.45)',
                                }}
                        />
                        <div
                                className="absolute left-1/2 -top-2 h-4 w-2 -translate-x-1/2"
                                style={{
                                        clipPath: 'polygon(50% 0, 100% 60%, 50% 100%, 0 60%)',
                                        background: 'linear-gradient(180deg,#FCF6BA,#BF953F 60%,#8A6D2F)',
                                }}
                        />
                        {/* fabric */}
                        <div
                                className="absolute left-1/2 top-4"
                                style={{
                                        width: 62,
                                        height: 78,
                                        marginLeft: side === 'left' ? '2px' : '-64px',
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
                                                boxShadow: 'inset 0 0 22px rgba(0,0,0,0.6)',
                                                clipPath:
                                                        side === 'left'
                                                                ? 'polygon(0 0, 100% 4%, 96% 96%, 0 100%)'
                                                                : 'polygon(0 4%, 100% 0, 100% 100%, 4% 96%)',
                                        }}
                                >
                                        <div
                                                className="absolute inset-x-0 top-0 h-[2px]"
                                                style={{
                                                        background:
                                                                'linear-gradient(90deg,#8A6D2F,#FCF6BA,#8A6D2F)',
                                                }}
                                        />
                                        <svg viewBox="0 0 62 78" className="absolute inset-0 h-full w-full">
                                                <defs>
                                                        <linearGradient id={`mfG-${side}-${style.transform}`} x1="0" y1="0" x2="1" y2="1">
                                                                <stop offset="0%" stopColor="#FCF6BA" />
                                                                <stop offset="60%" stopColor="#BF953F" />
                                                                <stop offset="100%" stopColor="#6B4E1C" />
                                                        </linearGradient>
                                                </defs>
                                                <path
                                                        d="M12 52 L31 22 L50 52 Z"
                                                        fill="none"
                                                        stroke={`url(#mfG-${side}-${style.transform})`}
                                                        strokeWidth="1"
                                                />
                                                <circle
                                                        cx="31"
                                                        cy="40"
                                                        r="2"
                                                        fill={`url(#mfG-${side}-${style.transform})`}
                                                />
                                                <text
                                                        x="31"
                                                        y="68"
                                                        textAnchor="middle"
                                                        fontFamily="Cinzel, serif"
                                                        fontSize="6"
                                                        letterSpacing="2"
                                                        fill="#F5F1E8"
                                                >
                                                        P·I
                                                </text>
                                        </svg>
                                </div>
                        </div>
                </div>
        );
}

// ------------------------------------------------------------------
// Lamppost pair — thin vertical pole with a warm glowing lantern top.
// ------------------------------------------------------------------
function LampPostPair({ z }) {
        return (
                <>
                        <Lamp side="left" z={z} />
                        <Lamp side="right" z={z} />
                </>
        );
}
function Lamp({ side, z }) {
        return (
                <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                                width: 3,
                                height: 220,
                                marginLeft: side === 'left' ? -180 : 178,
                                marginTop: -70,
                                transform: `translate3d(0,0,${z}px)`,
                        }}
                >
                        <div
                                className="h-full w-full"
                                style={{
                                        background:
                                                'linear-gradient(180deg,#1A150F 0%,#3A2E19 40%,#1A150F 100%)',
                                }}
                        />
                        <div
                                className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full"
                                style={{
                                        background:
                                                'radial-gradient(circle,#FCF6BA 0%,#BF953F 45%,#6B4E1C 100%)',
                                        boxShadow:
                                                '0 0 22px 6px rgba(232,201,120,0.7), 0 0 60px 12px rgba(191,149,63,0.35)',
                                        animation: 'wtLampFlicker 2.6s ease-in-out infinite',
                                }}
                        />
                </div>
        );
}

// ------------------------------------------------------------------
// Wall arch checkpoint — smaller version of the entrance arch, placed
// at intervals along the boulevard.
// ------------------------------------------------------------------
function WallArch({ z }) {
        return (
                <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                                width: 520,
                                height: 260,
                                marginLeft: -260,
                                marginTop: -220,
                                transform: `translate3d(0, 0, ${z}px)`,
                        }}
                >
                        <svg viewBox="0 0 520 260" className="h-full w-full">
                                <defs>
                                        <linearGradient id={`archStone-${z}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0F0D0B" />
                                                <stop offset="55%" stopColor="#1B1815" />
                                                <stop offset="100%" stopColor="#0A0908" />
                                        </linearGradient>
                                        <linearGradient id={`archGold-${z}`} x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#8A6D2F" />
                                                <stop offset="20%" stopColor="#BF953F" />
                                                <stop offset="50%" stopColor="#FCF6BA" />
                                                <stop offset="80%" stopColor="#B38728" />
                                                <stop offset="100%" stopColor="#8A6D2F" />
                                        </linearGradient>
                                </defs>
                                {/* pillars */}
                                <rect x="30" y="80" width="46" height="180" fill={`url(#archStone-${z})`} stroke={`url(#archGold-${z})`} strokeWidth="1" />
                                <rect x="444" y="80" width="46" height="180" fill={`url(#archStone-${z})`} stroke={`url(#archGold-${z})`} strokeWidth="1" />
                                {/* arch beam */}
                                <path
                                        d="M20 100 L20 60 Q20 10 260 10 Q500 10 500 60 L500 100 Z"
                                        fill={`url(#archStone-${z})`}
                                        stroke={`url(#archGold-${z})`}
                                        strokeWidth="1.2"
                                />
                                {/* Inner opening line */}
                                <path
                                        d="M60 100 L60 66 Q60 42 260 42 Q460 42 460 66 L460 100"
                                        fill="none"
                                        stroke={`url(#archGold-${z})`}
                                        strokeWidth="0.7"
                                        opacity="0.6"
                                />
                                {/* keystone */}
                                <path
                                        d="M244 12 L276 12 L282 44 L238 44 Z"
                                        fill={`url(#archGold-${z})`}
                                        opacity="0.9"
                                />
                                {/* PARVATHI INFRA wordmark */}
                                <text
                                        x="260"
                                        y="70"
                                        textAnchor="middle"
                                        fontFamily="Cinzel, serif"
                                        fontSize="9"
                                        letterSpacing="4"
                                        fill="#F5F1E8"
                                >
                                        PARVATHI INFRA
                                </text>
                                <text
                                        x="260"
                                        y="92"
                                        textAnchor="middle"
                                        fontFamily="Cinzel, serif"
                                        fontSize="14"
                                        letterSpacing="5"
                                        fill="transparent"
                                        stroke={`url(#archGold-${z})`}
                                        strokeWidth="0.5"
                                >
                                        THE VIEW
                                </text>
                        </svg>
                </div>
        );
}

// ------------------------------------------------------------------
// Clubhouse — a stylised distant landmark with lit windows.
// ------------------------------------------------------------------
function Clubhouse({ z }) {
        return (
                <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                                width: 700,
                                height: 340,
                                marginLeft: -350,
                                marginTop: -220,
                                transform: `translate3d(0, 0, ${z}px)`,
                        }}
                >
                        <svg viewBox="0 0 700 340" className="h-full w-full">
                                <defs>
                                        <linearGradient id="clubGold" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#8A6D2F" />
                                                <stop offset="50%" stopColor="#FCF6BA" />
                                                <stop offset="100%" stopColor="#8A6D2F" />
                                        </linearGradient>
                                        <linearGradient id="clubBody" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#181614" />
                                                <stop offset="100%" stopColor="#0A0908" />
                                        </linearGradient>
                                        <radialGradient id="clubGlow" cx="0.5" cy="1" r="0.9">
                                                <stop offset="0%" stopColor="rgba(232,201,120,0.35)" />
                                                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                                        </radialGradient>
                                </defs>
                                {/* halo */}
                                <ellipse cx="350" cy="310" rx="330" ry="70" fill="url(#clubGlow)" />
                                {/* podium */}
                                <rect x="60" y="240" width="580" height="12" fill="url(#clubGold)" opacity="0.85" />
                                {/* main volume */}
                                <rect x="100" y="120" width="500" height="120" fill="url(#clubBody)" stroke="url(#clubGold)" strokeWidth="1.2" />
                                {/* central portico */}
                                <rect x="280" y="80" width="140" height="160" fill="url(#clubBody)" stroke="url(#clubGold)" strokeWidth="1.4" />
                                {/* roof line */}
                                <line x1="90" y1="120" x2="610" y2="120" stroke="url(#clubGold)" strokeWidth="1" />
                                {/* portico roof detail */}
                                <path d="M280 80 L350 40 L420 80" fill="none" stroke="url(#clubGold)" strokeWidth="1.4" />
                                <circle cx="350" cy="46" r="3" fill="#FCF6BA" />
                                {/* windows */}
                                {[130, 180, 230, 430, 480, 530].map((x, i) => (
                                        <rect
                                                key={i}
                                                x={x}
                                                y={150}
                                                width={26}
                                                height={50}
                                                fill="#FCF6BA"
                                                opacity="0.85"
                                        >
                                                <animate
                                                        attributeName="opacity"
                                                        values="0.75;1;0.8;0.95;0.75"
                                                        dur={`${4 + (i % 3)}s`}
                                                        repeatCount="indefinite"
                                                />
                                        </rect>
                                ))}
                                {/* central door */}
                                <rect x="335" y="150" width="30" height="90" fill="#E8C978" opacity="0.9" />
                                <text
                                        x="350"
                                        y="26"
                                        textAnchor="middle"
                                        fontFamily="Cinzel, serif"
                                        fontSize="9"
                                        letterSpacing="4"
                                        fill="#F5F1E8"
                                >
                                        CLUBHOUSE
                                </text>
                        </svg>
                </div>
        );
}
