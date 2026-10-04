import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { CIRCUITS_PART_1, CircuitAtmosphereItem } from './circuitBackdrops/circuitsPart1';
import { CIRCUITS_PART_2 } from './circuitBackdrops/circuitsPart2';
import { CIRCUITS_PART_3 } from './circuitBackdrops/circuitsPart3';
import { CIRCUITS_PART_4 } from './circuitBackdrops/circuitsPart4';

export type CircuitAtmosphereInfo = CircuitAtmosphereItem;

export const CIRCUIT_ATMOSPHERES: CircuitAtmosphereInfo[] = [
  ...CIRCUITS_PART_1,
  ...CIRCUITS_PART_2,
  ...CIRCUITS_PART_3,
  ...CIRCUITS_PART_4,
];

interface CircuitAtmosphereBackgroundProps {
  className?: string;
  /** Initial round to display. If not specified, starts from 0 or last active */
  forcedRound?: number;
  /** Auto cycle duration in milliseconds. Defaults to 10000ms (10 seconds) */
  autoCycleIntervalMs?: number;
  /** Show circuit name indicator badge in the bottom-right corner */
  showBadge?: boolean;
  /** Whether a race is in progress. When true, background rotation is frozen and cannot be changed */
  isRacing?: boolean;
}

export const CircuitAtmosphereBackground: React.FC<CircuitAtmosphereBackgroundProps> = ({
  className = '',
  forcedRound,
  autoCycleIntervalMs = 10000,
  showBadge = true,
  isRacing = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  // Sync forcedRound if passed as prop (especially during active race)
  useEffect(() => {
    if (forcedRound !== undefined) {
      const targetIndex = CIRCUIT_ATMOSPHERES.findIndex((c) => c.round === forcedRound);
      if (targetIndex !== -1) {
        setCurrentIndex(targetIndex);
      }
    }
  }, [forcedRound]);

  // Main 10-Second Cycling Timer for Menus (Completely frozen during races: "ระหว่างแข่งห้ามเปลี่ยน")
  useEffect(() => {
    if (isPaused || isRacing) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgressPercent(0);
      return;
    }

    const stepMs = 50;
    const totalSteps = autoCycleIntervalMs / stepMs;
    let stepCount = 0;

    setProgressPercent(0);

    progressIntervalRef.current = setInterval(() => {
      stepCount++;
      const pct = Math.min(100, (stepCount / totalSteps) * 100);
      setProgressPercent(pct);
    }, stepMs);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CIRCUIT_ATMOSPHERES.length);
      stepCount = 0;
      setProgressPercent(0);
    }, autoCycleIntervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, isRacing, autoCycleIntervalMs]);

  const targetIndex =
    forcedRound !== undefined
      ? CIRCUIT_ATMOSPHERES.findIndex((c) => c.round === forcedRound)
      : -1;
  const activeIndex = targetIndex !== -1 ? targetIndex : currentIndex;
  const currentCircuit = CIRCUIT_ATMOSPHERES[activeIndex] || CIRCUIT_ATMOSPHERES[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRacing || forcedRound !== undefined) return; // Locked during race or forced stage
    setCurrentIndex((prev) => (prev - 1 + CIRCUIT_ATMOSPHERES.length) % CIRCUIT_ATMOSPHERES.length);
    setProgressPercent(0);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRacing || forcedRound !== undefined) return; // Locked during race or forced stage
    setCurrentIndex((prev) => (prev + 1) % CIRCUIT_ATMOSPHERES.length);
    setProgressPercent(0);
  };

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRacing || forcedRound !== undefined) return; // Locked during race or forced stage
    setIsPaused((prev) => !prev);
  };

  const isLocked = isRacing || forcedRound !== undefined;

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {/* Carbon Deep Black Base Layer */}
      <div className="absolute inset-0 bg-[#030508]" />

      {/* Crossfading Circuit Artwork Slides */}
      {CIRCUIT_ATMOSPHERES.map((circuit, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={circuit.round}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {circuit.renderArtwork()}
          </div>
        );
      })}

      {/* Atmospheric Dense Dark Gradient Overlays (Deep black, moody & translucent so UI is clearly readable) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030508]/55 via-[#030508]/35 to-[#030508]/70 pointer-events-none" />

      {/* Radial Vignette for cinematic focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,5,8,0.3)_60%,rgba(2,3,5,0.75)_100%)] pointer-events-none" />

      {/* Sleek F1 Broadcast Telemetry Watermark & 10s Cycle Indicator */}
      {showBadge && (
        <div className="pointer-events-auto absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#080d16]/85 border border-slate-800/80 shadow-2xl backdrop-blur-md select-none text-[11px] font-mono text-slate-400 group transition hover:border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{currentCircuit.flag}</span>
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
                  {currentCircuit.round <= 18 ? `R${String(currentCircuit.round).padStart(2, '0')}` : 'F1'} • {currentCircuit.city}
                </span>
                {isLocked ? (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-600/90 text-white tracking-wider uppercase border border-red-500/60 leading-none">
                    {isRacing ? 'RACE LOCKED' : 'CURRENT GP'}
                  </span>
                ) : (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-ping"
                    style={{ backgroundColor: currentCircuit.primaryAccent }}
                  />
                )}
              </div>
              <span className="text-[9px] text-slate-500 truncate max-w-[130px] sm:max-w-[200px]">
                {isRacing
                  ? 'ล็อกฉากหลังสนามแข่งปัจจุบัน (ไม่เปลี่ยนขณะแข่ง)'
                  : forcedRound !== undefined
                  ? `สนามแข่งขันรอบที่ ${currentCircuit.round} (${currentCircuit.circuitName})`
                  : currentCircuit.circuitName}
              </span>
            </div>
          </div>

          {/* 10-Second Animated Progress Bar */}
          <div className="w-10 sm:w-14 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-75"
              style={{
                width: isLocked ? '100%' : `${progressPercent}%`,
                backgroundColor: isLocked ? (isRacing ? '#ef4444' : currentCircuit.primaryAccent) : currentCircuit.primaryAccent,
              }}
            />
          </div>

          {/* Quick Manual Navigation Controls (Hidden or replaced with locked tag during active racing or forced stage) */}
          {!isLocked ? (
            <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition">
              <button
                onClick={handlePrev}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="Previous Circuit Background"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              <button
                onClick={togglePause}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title={isPaused ? 'Resume 10s Rotation' : 'Pause Background Rotation'}
              >
                {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3" />}
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="Next Circuit Background"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="text-[9px] font-mono font-bold text-red-400 uppercase tracking-widest pl-1">
              {isRacing ? 'ON TRACK' : 'CHAMPIONSHIP'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
