import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Award,
  FastForward,
  Play,
  Eye,
} from 'lucide-react';
import { TeamState, SeasonRecord } from '../types/game';
import { TeamLogo } from './TeamLogo';
import { renderFlag } from './CountryFlag';
import { sound } from '../utils/audio';
import { TeamCelebrationGraphic, GroundTrophy } from './TeamCelebrationGraphic';
import { INITIAL_GRAND_PRIX } from '../data/initialData';

export interface VictoryCelebrationCutsceneProps {
  teamState: TeamState;
  onClose: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  celebrationTitle?: string;
  seasonRecord?: SeasonRecord | null;
  forceShowcaseTrophies?: boolean;
}

type CinematicPhase = 'black' | 'reveal' | 'focus-driver' | 'celebrate';

export const VictoryCelebrationCutscene: React.FC<VictoryCelebrationCutsceneProps> = ({
  teamState,
  onClose,
  isMuted = false,
  onToggleMute,
  celebrationTitle = 'APEX GRAND PRIX • OFFICIAL CHAMPIONSHIP VICTORY CELEBRATION',
  seasonRecord,
}) => {
  const [phase, setPhase] = useState<CinematicPhase>('black');
  const [isChampagneSpraying, setIsChampagneSpraying] = useState(false);
  const [selectedTrophy, setSelectedTrophy] = useState<GroundTrophy | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [showDemoTrophiesIfEmpty, setShowDemoTrophiesIfEmpty] = useState(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // Extract Actual Season Records
  const activeRecord = useMemo(() => {
    if (seasonRecord) return seasonRecord;
    return (
      teamState.seasonRecords?.find(
        (r) => r.seasonNumber === (teamState.currentSeasonNumber || 1)
      ) || teamState.seasonRecords?.[0]
    );
  }, [teamState.seasonRecords, teamState.currentSeasonNumber, seasonRecord]);

  // Determine Winning Driver:
  // Use driver with most points/wins in active season, or default to Driver 1
  const winningDriverName = useMemo(() => {
    const d1Pts = activeRecord?.driver1Stats?.points || 0;
    const d2Pts = activeRecord?.driver2Stats?.points || 0;
    if (d2Pts > d1Pts) {
      return teamState.driver2.name;
    }
    return teamState.driver1.name;
  }, [activeRecord, teamState.driver1.name, teamState.driver2.name]);

  // Strict Data Rule: Extract ONLY actual completed podium finishes from race data
  const actualGroundTrophies = useMemo<GroundTrophy[]>(() => {
    const raceLogs = activeRecord?.raceLogs || [];
    const trophies: GroundTrophy[] = [];

    raceLogs.forEach((log) => {
      // Check Seat 1
      if (log.seat1Position >= 1 && log.seat1Position <= 3) {
        trophies.push({
          id: `trophy-s1-r${log.round}`,
          round: log.round,
          circuitName: log.circuitName || log.gpName,
          gpName: log.gpName,
          country: log.country,
          flag: log.flag,
          position: log.seat1Position as 1 | 2 | 3,
          driverName: log.seat1DriverName || teamState.driver1.name,
        });
      }
      // Check Seat 2
      if (log.seat2Position >= 1 && log.seat2Position <= 3) {
        trophies.push({
          id: `trophy-s2-r${log.round}`,
          round: log.round,
          circuitName: log.circuitName || log.gpName,
          gpName: log.gpName,
          country: log.country,
          flag: log.flag,
          position: log.seat2Position as 1 | 2 | 3,
          driverName: log.seat2DriverName || teamState.driver2.name,
        });
      }
    });

    return trophies;
  }, [activeRecord, teamState.driver1.name, teamState.driver2.name]);

  // Optional Demo Trophies (only when test mode has 0 actual completed races and user clicks preview)
  const demoTrophies = useMemo<GroundTrophy[]>(() => {
    const circuits = teamState.seasonCircuits || INITIAL_GRAND_PRIX;
    const demoPositions: (1 | 2 | 3)[] = [1, 2, 1, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1];
    return circuits.slice(0, 14).map((c, idx) => ({
      id: `demo-trophy-${c.round}`,
      round: c.round,
      circuitName: c.circuitName || c.name,
      gpName: c.name,
      country: c.country,
      flag: c.flag,
      position: demoPositions[idx % demoPositions.length],
      driverName: idx % 2 === 0 ? teamState.driver1.name : teamState.driver2.name,
    }));
  }, [teamState.seasonCircuits, teamState.driver1.name, teamState.driver2.name]);

  const displayedTrophies =
    actualGroundTrophies.length > 0
      ? actualGroundTrophies
      : showDemoTrophiesIfEmpty
      ? demoTrophies
      : [];

  // Tally counts
  const trophyStats = useMemo(() => {
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;
    displayedTrophies.forEach((t) => {
      if (t.position === 1) p1++;
      else if (t.position === 2) p2++;
      else if (t.position === 3) p3++;
    });
    return { p1, p2, p3, total: displayedTrophies.length };
  }, [displayedTrophies]);

  // Cinematic Presentation Sequence
  const startCinematicSequence = useCallback(() => {
    clearAllTimers();
    sound.stopCelebrationAudio();
    sound.resumeAudio();

    // 1. Black fade
    setPhase('black');
    setIsChampagneSpraying(false);
    setScreenShake(false);

    // 2. Reveal Full Team (600ms)
    const t1 = setTimeout(() => {
      setPhase('reveal');
    }, 600);
    timersRef.current.push(t1);

    // 3. Slowly Emphasize Center Winning Driver (2000ms)
    const t2 = setTimeout(() => {
      setPhase('focus-driver');
    }, 2000);
    timersRef.current.push(t2);

    // 4. Full Celebration Burst (3400ms)
    const t3 = setTimeout(() => {
      setPhase('celebrate');
      setIsChampagneSpraying(true);
      setScreenShake(true);

      // Audio: Champagne Pop + Fanfare (no duplicate audio!)
      sound.playChampagneSpray();
      sound.playCelebrationFanfare();

      // Stop camera shake after 500ms
      const shakeTimer = setTimeout(() => {
        setScreenShake(false);
      }, 500);
      timersRef.current.push(shakeTimer);
    }, 3400);
    timersRef.current.push(t3);
  }, [clearAllTimers]);

  useEffect(() => {
    startCinematicSequence();

    return () => {
      clearAllTimers();
      sound.stopCelebrationAudio();
    };
  }, [startCinematicSequence, clearAllTimers]);

  // Fast-Forward / Skip Intro
  const handleSkipIntro = () => {
    clearAllTimers();
    setPhase('celebrate');
    setIsChampagneSpraying(true);
    setScreenShake(false);
    sound.stopCelebrationAudio();
    sound.playCelebrationFanfare();
  };

  // Replay
  const handleReplay = () => {
    startCinematicSequence();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#05070a] text-white overflow-y-auto selection:bg-amber-500 selection:text-black">
      {/* Black Fade-In Overlay during Cinematic Stage 1 */}
      {phase === 'black' && (
        <div className="fixed inset-0 z-[100] bg-black pointer-events-none transition-opacity duration-700 opacity-100" />
      )}

      {/* Camera Shake Wrapper on celebration burst */}
      <div className={`flex-1 flex flex-col w-full transition-transform duration-100 ${screenShake ? 'scale-[1.015] translate-y-[-2px]' : ''}`}>
        {/* Subtle Ambient Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-32 left-1/3 w-[600px] h-[500px] bg-amber-500/10 rounded-full blur-[140px]" />
          <div className="absolute -top-32 right-1/3 w-[600px] h-[500px] bg-red-600/10 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040608] via-transparent to-[#040608]/80 pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* TOP BAR: MINIMALIST CONTROLS                                              */}
        {/* ========================================================================= */}
        <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[#090d14]/90 backdrop-blur-md border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <TeamLogo
              teamName={teamState.teamName}
              shape={teamState.logoShape}
              primaryColor={teamState.primaryColor || '#DC2626'}
              secondaryColor={teamState.secondaryColor || '#111827'}
              size="sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  FINAL VICTORY CELEBRATION
                </span>
                <span className="text-xs font-mono text-slate-400">
                  SEASON {teamState.currentSeasonNumber || 1} • {teamState.teamName}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black font-racing uppercase tracking-wider text-white flex items-center gap-2">
                <span>{teamState.teamName} • WORLD CHAMPIONSHIP CELEBRATION</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Skip Intro button during cinematic phases */}
            {phase !== 'celebrate' && (
              <button
                type="button"
                onClick={handleSkipIntro}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-mono transition cursor-pointer"
                title="ข้ามอินโทร (Skip intro to celebration)"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SKIP INTRO</span>
              </button>
            )}

            {/* Replay Button */}
            <button
              type="button"
              onClick={handleReplay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition cursor-pointer"
              title="เล่นคัตซีนใหม่อีกครั้ง (Replay celebration)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">REPLAY</span>
            </button>

            {/* Audio Mute */}
            {onToggleMute && (
              <button
                type="button"
                onClick={onToggleMute}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                title="เปิด/ปิดเสียง (Mute/Unmute audio)"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer"
              title="ปิดคัตซีนกลับสู่เมนูหลัก (Exit to Main Menu)"
            >
              <X className="w-4 h-4" />
              <span>EXIT</span>
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MAIN GRAPHIC CELEBRATION SCENE                                           */}
        {/* ========================================================================= */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-start p-3 sm:p-5 lg:p-6 max-w-7xl mx-auto w-full">
          {/* FRAME CONTAINER FOR THE CROWDED GROUP CELEBRATION */}
          <div className="w-full relative rounded-2xl sm:rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-[#18212e] via-[#101620] to-[#0a0d13] border-4 border-[#243144] shadow-[0_20px_60px_rgba(0,0,0,0.95)] ring-1 ring-amber-400/40 overflow-hidden">
            {/* THE DETAILED CROWDED GROUP CELEBRATION GRAPHIC */}
            <TeamCelebrationGraphic
              teamName={teamState.teamName}
              primaryColor={teamState.primaryColor || '#DC2626'}
              secondaryColor={teamState.secondaryColor || '#111827'}
              driver1Name={teamState.driver1.name}
              driver2Name={teamState.driver2.name}
              driver1Flag={teamState.driver1.nationality.flag}
              driver2Flag={teamState.driver2.nationality.flag}
              winningDriverName={winningDriverName}
              strategistName={teamState.strategist.name}
              pitCrewName={teamState.pitCrew.name}
              groundTrophies={displayedTrophies}
              selectedTrophyId={selectedTrophy?.id}
              onSelectTrophy={(trophy) => setSelectedTrophy(trophy)}
              isChampagneSpraying={isChampagneSpraying}
              cinematicPhase={phase}
            />

            {/* TEAM COMMEMORATIVE PLAQUE BENEATH GRAPHIC */}
            <div className="mt-3 py-3 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#201a12] via-[#2a2214] to-[#201a12] border-2 border-amber-500/60 shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                {/* Left: Team and Title */}
                <div className="flex items-center gap-3">
                  <TeamLogo
                    teamName={teamState.teamName}
                    shape={teamState.logoShape}
                    primaryColor={teamState.primaryColor || '#DC2626'}
                    secondaryColor={teamState.secondaryColor || '#111827'}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                        WORLD CHAMPIONS
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-[11px] font-mono text-slate-300">
                        {teamState.teamName} VICTORY
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black font-racing uppercase tracking-wider text-amber-300 drop-shadow-sm">
                      {teamState.teamName}
                    </h3>
                  </div>
                </div>

                {/* Center: Drivers */}
                <div className="flex items-center gap-3 bg-black/50 px-4 py-2 rounded-xl border border-amber-500/40 font-racing">
                  <span className="text-amber-400 font-black text-sm sm:text-base flex items-center gap-1.5">
                    👑 {teamState.driver1.name} {renderFlag(teamState.driver1.nationality.flag, 'sm')}
                  </span>
                  <span className="text-amber-500 font-bold">&</span>
                  <span className="text-slate-200 font-bold text-sm sm:text-base flex items-center gap-1.5">
                    {teamState.driver2.name} {renderFlag(teamState.driver2.nationality.flag, 'sm')}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/40 whitespace-nowrap ml-2">
                    🏆 CHAMPIONSHIP VICTORY
                  </span>
                </div>

                {/* Right: Key Crew & Podiums Tally */}
                <div className="text-right text-xs font-mono text-slate-300 hidden lg:block">
                  <div>Strategist: <strong className="text-white">{teamState.strategist.name}</strong></div>
                  <div>Pit Crew Chief: <strong className="text-white">{teamState.pitCrew.name}</strong></div>
                  <div className="text-amber-400 font-bold mt-0.5">
                    Ground Trophies: {displayedTrophies.length} ({trophyStats.p1} 🥇, {trophyStats.p2} 🥈, {trophyStats.p3} 🥉)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* GROUND TROPHIES STATUS & INTERACTIVE INSPECTION                         */}
          {/* ======================================================================= */}
          {actualGroundTrophies.length === 0 && (
            <div className="w-full mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>
                  <strong>Game Data Status:</strong> 0 actual race podiums completed yet in this career save.
                </span>
              </div>
              {/* Optional Demo Preview Toggle */}
              <button
                type="button"
                onClick={() => setShowDemoTrophiesIfEmpty((prev) => !prev)}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-racing uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showDemoTrophiesIfEmpty ? 'HIDE DEMO TROPHIES' : 'PREVIEW SAMPLE PODIUM TROPHIES (DEMO)'}</span>
              </button>
            </div>
          )}

          {/* Selected Trophy Callout Popover */}
          {selectedTrophy && (
            <div className="w-full mt-3 p-3.5 rounded-2xl bg-black/90 border-2 border-amber-500/70 shadow-2xl flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {selectedTrophy.position === 1 ? '🥇' : selectedTrophy.position === 2 ? '🥈' : '🥉'}
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-racing font-bold text-white uppercase flex items-center gap-2">
                    <span>ROUND {selectedTrophy.round}: {selectedTrophy.gpName} ({selectedTrophy.circuitName})</span>
                    <span>{renderFlag(selectedTrophy.flag, 'sm')}</span>
                  </h4>
                  <p className="text-xs font-mono text-slate-300">
                    P{selectedTrophy.position} Trophy won by <strong className="text-amber-400">{selectedTrophy.driverName}</strong> • Placed on the floor in front of the team
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTrophy(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="relative z-30 px-4 sm:px-8 py-3 bg-[#070a0f] border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            <span>FIA FORMULA 1 WORLD CHAMPIONSHIP • {teamState.teamName} VICTORY SCENE</span>
          </div>
          <div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              BACK TO MAIN MENU ✓
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
