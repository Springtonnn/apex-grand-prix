import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flag } from 'lucide-react';
import { sound } from '../utils/audio';

interface IntroCutsceneProps {
  onComplete: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  skipPressStart?: boolean;
}

type CutscenePhase =
  | 'press-start'
  | 'lights'
  | 'speed-rush'
  | 'title-reveal'
  | 'fade-out';

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({
  onComplete,
  isMuted,
  onToggleMute,
  skipPressStart = false,
}) => {
  const [phase, setPhase] = useState<CutscenePhase>(skipPressStart ? 'lights' : 'press-start');
  const [activeLightsCount, setActiveLightsCount] = useState<number>(0);
  const [lightsOut, setLightsOut] = useState<boolean>(false);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const handleSkip = () => {
    clearAllTimers();
    sound.stopCutsceneAudio();
    sound.playClick();
    setPhase('fade-out');
    setTimeout(() => {
      onComplete();
    }, 280);
  };

  // If replay mode, start sequence immediately on mount
  useEffect(() => {
    if (skipPressStart) {
      startCutsceneSequence();
    }
  }, [skipPressStart]);

  // Keyboard shortcut listener to skip (Space, Enter, Esc) or start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'press-start') {
        startCutsceneSequence();
        return;
      }
      if (e.code === 'Space' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Clean up audio & timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
      sound.stopCutsceneAudio();
    };
  }, []);

  const startCutsceneSequence = () => {
    clearAllTimers();
    sound.stopCutsceneAudio();
    setPhase('lights');
    setActiveLightsCount(0);
    setLightsOut(false);

    // 1. Column 1 turns red at 1.0s (Starts low engine idle rumble + mechanical thud)
    const t1 = setTimeout(() => {
      setActiveLightsCount(1);
      sound.startEngineIdle();
      sound.playF1LightThud();
    }, 1000);

    // 2. Column 2 turns red at 2.0s
    const t2 = setTimeout(() => {
      setActiveLightsCount(2);
      sound.playF1LightThud();
    }, 2000);

    // 3. Column 3 turns red at 3.0s
    const t3 = setTimeout(() => {
      setActiveLightsCount(3);
      sound.playF1LightThud();
    }, 3000);

    // 4. Column 4 turns red at 4.0s
    const t4 = setTimeout(() => {
      setActiveLightsCount(4);
      sound.playF1LightThud();
    }, 4000);

    // 5. Column 5 turns red at 5.0s
    const t5 = setTimeout(() => {
      setActiveLightsCount(5);
      sound.playF1LightThud();
    }, 5000);

    // Tense holding pause: randomized between 1.2s and 2.5s (1200ms - 2500ms)
    const randomHold = 1200 + Math.floor(Math.random() * 1300);
    const lightsOutTimestamp = 5000 + randomHold;

    // Lights Out! (Sudden explosive engine rev, no beep)
    const tLightsOut = setTimeout(() => {
      setLightsOut(true);
      sound.playLightsOutRev();
    }, lightsOutTimestamp);

    // Scene 2: Speed Rush (F1 screaming Doppler flyby)
    const speedRushTimestamp = lightsOutTimestamp + 420;
    const tSpeedRush = setTimeout(() => {
      setPhase('speed-rush');
      sound.playF1SpeedRush();
    }, speedRushTimestamp);

    // Scene 3: Title Reveal (Checkered flag wipe whoosh + cinematic bass impact)
    const titleTimestamp = speedRushTimestamp + 2650;
    const tTitle = setTimeout(() => {
      setPhase('title-reveal');
      sound.playWhoosh();
      setTimeout(() => {
        sound.playTitleImpact();
      }, 120);
    }, titleTimestamp);

    // Scene 4: Transition to Main Hub (Fade out)
    const fadeTimestamp = titleTimestamp + 2850;
    const tFade = setTimeout(() => {
      setPhase('fade-out');
    }, fadeTimestamp);

    // Cutscene complete
    const tEnd = setTimeout(() => {
      onComplete();
    }, fadeTimestamp + 700);

    timeoutsRef.current = [t1, t2, t3, t4, t5, tLightsOut, tSpeedRush, tTitle, tFade, tEnd];
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] select-none bg-black text-white flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        phase === 'fade-out' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Deep Vignette Gradient with faint checkered texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 48%, rgba(22,29,42,0.5) 0%, rgba(8,10,15,0.92) 65%, #000000 100%)',
        }}
      />
      <div className="absolute inset-0 bg-checkered-flag opacity-10 pointer-events-none" />

      {/* Top Bar Indicators (Audio & Live Simulation Badge) */}
      <div className="absolute top-5 left-5 right-5 z-40 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-[#0c1017]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
          <span>FIA FORMULA SIMULATION • 2026</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="p-2 rounded-full bg-[#0d121b]/80 hover:bg-[#161f2e] text-slate-300 hover:text-white border border-white/10 transition cursor-pointer backdrop-blur-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Sleek, Unobtrusive Skip Button (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-40 pointer-events-auto">
        <button
          type="button"
          onClick={handleSkip}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer backdrop-blur-md active:scale-95"
        >
          <span>SKIP ▸</span>
          <span className="text-[10px] text-slate-500 group-hover:text-slate-300 font-mono">
            ESC / SPACE
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 0. PHASE: PRESS START SCREEN (Clean, Minimal, Premium) */}
      {/* ========================================================================= */}
      {phase === 'press-start' && (
        <div
          onClick={startCutsceneSequence}
          className="relative z-30 flex flex-col items-center justify-center p-8 text-center cursor-pointer w-full h-full animate-in fade-in duration-500 select-none"
        >
          {/* F1 Checkered Emblem Shield */}
          <div className="relative mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-red-600 via-red-950 to-black p-0.5 shadow-2xl shadow-red-900/40 flex items-center justify-center">
              <div className="w-full h-full bg-[#090c12] rounded-2xl flex flex-col items-center justify-center border border-red-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-checkered-accent opacity-20 pointer-events-none" />
                <Flag className="w-9 h-9 sm:w-11 sm:h-11 text-red-500 transform -rotate-12 mb-1 drop-shadow-md" />
                <span className="text-[9px] font-mono font-black tracking-widest text-amber-400">APEX GP</span>
              </div>
            </div>
          </div>

          {/* Game Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-racing uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            APEX GRAND PRIX
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-[0.25em] uppercase mt-3">
            PRO RACING TEAM MANAGEMENT
          </p>

          {/* Delicate, Minimal Pulsing Prompt */}
          <div className="mt-14 px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-slate-300 font-racing font-bold text-xs sm:text-sm tracking-[0.25em] uppercase transition duration-300 animate-pulse">
            PRESS ANY KEY TO BEGIN
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SCENE: START LIGHTS (Realistic F1 Starting Gantry Structure) */}
      {/* ========================================================================= */}
      {phase === 'lights' && (
        <div className="relative z-30 flex flex-col items-center justify-center w-full px-4 animate-in fade-in duration-300">
          {/* Header Telemetry */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-slate-500 block mb-1">
              GRAND PRIX 2026
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-racing font-black text-white tracking-[0.15em] uppercase">
              {lightsOut ? (
                <span className="text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                  LIGHTS OUT AND AWAY WE GO
                </span>
              ) : (
                <span className="text-slate-300">FORMATION COMPLETE</span>
              )}
            </h2>
          </div>

          {/* Realistic Formula 1 Starting Gantry (5 Columns) */}
          <div className="relative flex flex-col items-center">
            <div className="bg-[#090d13] border-2 border-slate-800/90 p-4 sm:p-7 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center justify-center gap-3 sm:gap-7 relative z-10">
              {[0, 1, 2, 3, 4].map((index) => {
                const isLit = !lightsOut && activeLightsCount > index;

                return (
                  <div
                    key={index}
                    className="bg-[#0e141e] border border-slate-800 p-2 sm:p-3 rounded-xl flex flex-col items-center gap-2.5 sm:gap-3.5 w-12 sm:w-16 shadow-inner"
                  >
                    {/* Upper FIA Red Starting Light */}
                    <div
                      className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-all duration-100 flex items-center justify-center relative overflow-hidden ${
                        isLit
                          ? 'bg-[#ff1818] shadow-[0_0_35px_rgba(255,24,24,1)] border-2 border-red-300'
                          : 'bg-[#180404] border-2 border-[#2b0d0d]'
                      }`}
                    >
                      {/* Realistic Halogen Center Glow */}
                      {isLit ? (
                        <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white opacity-95 shadow-[0_0_12px_#ffffff]" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0a0202] opacity-70" />
                      )}
                    </div>

                    {/* Lower FIA Red Starting Light */}
                    <div
                      className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-all duration-100 flex items-center justify-center relative overflow-hidden ${
                        isLit
                          ? 'bg-[#ff1818] shadow-[0_0_35px_rgba(255,24,24,1)] border-2 border-red-300'
                          : 'bg-[#180404] border-2 border-[#2b0d0d]'
                      }`}
                    >
                      {isLit ? (
                        <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-white opacity-95 shadow-[0_0_12px_#ffffff]" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0a0202] opacity-70" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radiant Ambient Red Glow Pool on Asphalt below */}
            <div
              className={`w-80 sm:w-[480px] h-10 rounded-full transition-all duration-300 blur-2xl mt-4 pointer-events-none ${
                !lightsOut && activeLightsCount > 0
                  ? 'bg-red-600/35 opacity-100 scale-100'
                  : 'opacity-0 scale-75'
              }`}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SCENE: SPEED RUSH (F1 Car Doppler Flyby) */}
      {/* ========================================================================= */}
      {phase === 'speed-rush' && (
        <div className="relative z-30 w-full h-full flex flex-col justify-center items-center overflow-hidden">
          {/* Dynamic Horizontal Speed Lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-red-500/80 to-transparent"
                style={{
                  top: `${4 + i * 5.4}%`,
                  left: '-20%',
                  width: `${60 + (i % 5) * 15}%`,
                  animation: `speedLineRush ${0.32 + (i % 4) * 0.1}s linear infinite`,
                  animationDelay: `${i * 0.06}s`,
                }}
              />
            ))}
          </div>

          {/* Asphalt Track Horizon Underneath */}
          <div className="absolute bottom-1/4 w-full h-24 bg-gradient-to-b from-transparent via-[#141a24] to-black opacity-80 border-b-2 border-red-600/60 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
            <div className="w-full h-1 bg-red-600/80 blur-xs" />
          </div>

          {/* Screaming F1 Silhouette zooming across */}
          <div className="relative w-full max-w-5xl h-64 flex items-center overflow-visible">
            <div
              className="absolute left-0 w-80 sm:w-96 drop-shadow-[0_0_35px_rgba(239,68,68,0.85)] filter"
              style={{
                animation: 'f1CarFlyby 2.2s cubic-bezier(0.2, 0.9, 0.3, 1) forwards',
              }}
            >
              {/* Detailed Aerodynamic F1 Race Car SVG */}
              <svg viewBox="0 0 500 160" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7f1d1d" />
                    <stop offset="45%" stopColor="#dc2626" />
                    <stop offset="85%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="exhaustSparks" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>

                {/* Ground Effect Sparks / Jet Stream Trail */}
                <path
                  d="M 50 120 L 0 115 L 20 125 L -40 120"
                  stroke="url(#exhaustSparks)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <circle cx="-10" cy="118" r="3" fill="#fbbf24" opacity="0.8" />
                <circle cx="-30" cy="122" r="2" fill="#ef4444" opacity="0.6" />

                {/* Rear Wing */}
                <rect x="55" y="45" width="40" height="8" rx="2" fill="#111827" />
                <polygon points="52,40 68,40 64,80 48,80" fill="#dc2626" stroke="#111827" strokeWidth="1" />
                <rect x="58" y="55" width="34" height="4" fill="#ffffff" />

                {/* Main Chassis & Monocoque */}
                <path
                  d="M 64 80 L 160 80 Q 230 72 320 85 L 430 115 Q 460 118 475 120 L 440 122 L 310 118 L 140 120 L 64 110 Z"
                  fill="url(#carBodyGrad)"
                />

                {/* Sidepod Inlets */}
                <path
                  d="M 180 88 Q 230 84 280 96 L 275 116 L 175 116 Z"
                  fill="#0f172a"
                  stroke="#dc2626"
                  strokeWidth="1.5"
                />

                {/* Engine Airbox */}
                <path d="M 160 52 Q 185 50 200 78 L 155 78 Z" fill="#991b1b" />
                <ellipse cx="178" cy="58" rx="5" ry="4" fill="#000000" />

                {/* Halo & Helmet */}
                <circle cx="215" cy="70" r="10" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
                <path d="M 215 67 L 225 69 L 223 74 Z" fill="#000000" />
                <path d="M 195 72 Q 225 60 240 76" stroke="#ffffff" strokeWidth="4" fill="none" strokeLinecap="round" />

                {/* Front Wing */}
                <polygon points="430,115 480,121 445,125" fill="#ef4444" />
                <rect x="440" y="118" width="45" height="4" rx="1" fill="#111827" />
                <polygon points="475,110 495,110 490,126 470,126" fill="#dc2626" />

                {/* Livery Decal */}
                <text x="210" y="106" fill="#ffffff" fontSize="14" fontFamily="sans-serif" fontWeight="900" letterSpacing="2">
                  APEX
                </text>

                {/* Pirelli Tyres */}
                <g>
                  <circle cx="115" cy="116" r="32" fill="#0f172a" stroke="#ef4444" strokeWidth="3" />
                  <circle cx="115" cy="116" r="18" fill="#1e293b" />
                  <circle cx="115" cy="116" r="7" fill="#fbbf24" />
                </g>
                <g>
                  <circle cx="395" cy="118" r="30" fill="#0f172a" stroke="#ef4444" strokeWidth="3" />
                  <circle cx="395" cy="118" r="16" fill="#1e293b" />
                  <circle cx="395" cy="118" r="6" fill="#fbbf24" />
                </g>
              </svg>
            </div>
          </div>

          {/* Telemetry Indicator */}
          <div className="mt-6 text-center">
            <span className="text-xl sm:text-3xl font-black font-racing uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-white animate-pulse">
              FULL THROTTLE • 340 KM/H
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SCENE: TITLE REVEAL (Clean English Presentation) */}
      {/* ========================================================================= */}
      {phase === 'title-reveal' && (
        <div className="relative z-30 flex flex-col items-center justify-center p-6 text-center w-full animate-in zoom-in-95 duration-500">
          {/* Checkered Dynamic Wipe Backdrop */}
          <div className="absolute inset-0 bg-checkered-accent opacity-25 pointer-events-none transform -rotate-2 scale-110" />

          {/* Championship Laurel Header */}
          <div className="relative mb-4 flex items-center justify-center gap-3">
            <span className="h-0.5 w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-400" />
            <div className="px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-amber-400 font-mono text-[11px] font-bold tracking-widest uppercase shadow-lg shadow-red-950">
              THE ULTIMATE RACING SIMULATION
            </div>
            <span className="h-0.5 w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          {/* Giant Title: APEX GRAND PRIX */}
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black font-racing uppercase tracking-tight text-white drop-shadow-[0_10px_20px_rgba(220,38,38,0.6)] leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500">
              APEX
            </span>{' '}
            <span className="text-white">GRAND PRIX</span>
          </h1>

          {/* PRO MANAGER Badge */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-800 border-2 border-amber-400/80 text-white font-racing font-black text-lg sm:text-2xl tracking-widest uppercase shadow-2xl shadow-red-600/40">
              PRO MANAGER
            </div>
          </div>

          {/* Subtitle */}
          <p className="mt-4 text-xs sm:text-sm font-mono text-slate-300 tracking-[0.2em] uppercase max-w-lg">
            2026 WORLD CHAMPIONSHIP • FORMULA TEAM ARCHITECTURE
          </p>

          {/* Paddock Entry Indicator */}
          <div className="mt-8 flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0e131d]/90 px-4 py-2 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ENTERING PADDOCK &amp; COMMAND HUB...</span>
          </div>
        </div>
      )}

      {/* Speed Line & Flyby Animations */}
      <style>{`
        @keyframes speedLineRush {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(250%);
            opacity: 0;
          }
        }

        @keyframes f1CarFlyby {
          0% {
            transform: translateX(-120%) scale(0.7);
            filter: blur(4px);
          }
          40% {
            transform: translateX(20%) scale(1.05);
            filter: blur(1px);
          }
          100% {
            transform: translateX(180%) scale(1.15);
            filter: blur(5px);
          }
        }
      `}</style>
    </div>
  );
};
