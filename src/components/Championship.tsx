import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Play,
  Zap,
  Flag,
  CloudRain,
  Sun,
  Award,
  CheckCircle,
  Calendar,
  Gamepad2,
  Sparkles,
  MapPin,
  ArrowRight,
  Shield,
  Layers,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { TeamState, GrandPrix, RaceResultRecord } from '../types/game';
import { INITIAL_GRAND_PRIX } from '../data/initialData';
import {
  calculateCarOverall,
  calculatePitStopDuration,
  formatMoney,
} from '../utils/calculations';
import { sound } from '../utils/audio';
import { renderFlag } from './CountryFlag';
import { TrackLayoutPreview } from './TrackLayoutPreview';
import { OutRunRaceEngine, ConfettiCelebration } from './OutRunRaceEngine';
import {
  recordCompletedRaceToSeason,
  getGridDrivers,
} from '../utils/seasonRecordsManager';
import { SeasonRouteWorldMap } from './SeasonRouteWorldMap';
import { getWorldTourCircuit } from '../data/worldTourCircuits';
import { calculateCircuitFit } from '../utils/raceEffects';
import { VictoryCelebrationCutscene } from './VictoryCelebrationCutscene';
import { CityGraphicBackdrop } from './CityGraphicBackdrop';

interface ChampionshipProps {
  teamState: TeamState;
  onUpdateTeamState: (updater: (prev: TeamState) => TeamState) => void;
  onChangeView?: (view: 'main-menu' | 'team-management' | 'championship' | 'records' | 'help-tutorial') => void;
  initialSubTab?: 'race-day' | 'standings' | 'calendar' | 'auto-race';
}

interface SimDriverState {
  id: string;
  name: string;
  team: string;
  flag: string;
  overall: number;
  position: number;
  gapToLeader: number;
  tireWear: number;
  tireCompound: 'Soft' | 'Medium' | 'Hard' | 'Wet';
  hasPitted: boolean;
  pitStopTime?: number;
  isPlayer: boolean;
  driverSeat?: 'driver1' | 'driver2';
}

export const Championship: React.FC<ChampionshipProps> = ({
  teamState,
  onUpdateTeamState,
  onChangeView,
  initialSubTab,
}) => {
  const circuits =
    teamState.seasonCircuits && teamState.seasonCircuits.length === 18
      ? teamState.seasonCircuits
      : INITIAL_GRAND_PRIX;
  const currentGpIndex = Math.min(teamState.currentRound - 1, circuits.length - 1);
  const activeGp = circuits[currentGpIndex] || circuits[0];

  // Section references for smooth scrolling
  const raceSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const calendarSectionRef = useRef<HTMLDivElement>(null);

  // Playable OutRun Arcade Race state
  const [isPlayingOutRun, setIsPlayingOutRun] = useState<boolean>(false);
  const [outRunMode, setOutRunMode] = useState<'grand-prix' | 'practice'>('grand-prix');

  // Race Finish & Financial Report state
  const [raceFinished, setRaceFinished] = useState(false);
  const [showCelebrationCutscene, setShowCelebrationCutscene] = useState(false);
  const [lastRaceCelebration, setLastRaceCelebration] = useState<{
    round: number;
    gpName: string;
    posD1: number;
    posD2: number;
    netIncome: number;
    ptsTotal: number;
  } | null>(null);
  const [financialReport, setFinancialReport] = useState<{
    prizeD1: number;
    prizeD2: number;
    posD1: number;
    posD2: number;
    salaries: number;
    netIncome: number;
  } | null>(null);
  const [dnfRetryNotice, setDnfRetryNotice] = useState<{
    round: number;
    gpName: string;
    reason: string;
  } | null>(null);

  const finalizedRoundsRef = useRef<Set<number>>(new Set());

  // Sync finalizedRoundsRef with existing race logs
  useEffect(() => {
    const set = new Set<number>();
    const activeSec =
      teamState.seasonRecords?.find(
        (r) => r.seasonNumber === (teamState.currentSeasonNumber || 1) && !r.isCompleted
      ) ||
      teamState.seasonRecords?.find((r) => r.status === 'in-progress') ||
      teamState.seasonRecords?.[0];
    (activeSec?.raceLogs || []).forEach((l) => set.add(l.round));
    (teamState.seasonCircuits || []).forEach((c) => {
      if (c.finalized || c.isCompleted) set.add(c.round);
    });
    finalizedRoundsRef.current = set;
  }, [teamState.seasonRecords, teamState.seasonCircuits, teamState.currentSeasonNumber]);

  // Redirect or scroll to initial section if requested
  useEffect(() => {
    if (initialSubTab === 'race-day' || initialSubTab === 'auto-race') {
      setIsPlayingOutRun(false);
      setTimeout(() => {
        raceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else if (initialSubTab === 'standings') {
      onChangeView?.('records');
    } else if (initialSubTab === 'calendar' && mapSectionRef.current) {
      setTimeout(() => {
        mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [initialSubTab, onChangeView]);

  // Whenever isPlayingOutRun becomes true, ensure page scrolls directly to the game canvas
  useEffect(() => {
    if (isPlayingOutRun && raceSectionRef.current) {
      setTimeout(() => {
        raceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [isPlayingOutRun]);

  const activeSeason =
    teamState.seasonRecords?.find(
      (r) => r.seasonNumber === (teamState.currentSeasonNumber || 1) && !r.isCompleted
    ) ||
    teamState.seasonRecords?.find((r) => r.status === 'in-progress') ||
    teamState.seasonRecords?.[0];

  const raceLogs = activeSeason?.raceLogs || [];
  const completedRoundNumbers = raceLogs.map((l) => l.round);

  // Prize money calculation per position
  const getPrizeForPosition = (pos: number, circuitPurse?: number): number => {
    const baseP1 = Math.max(18_000_000, circuitPurse || 18_000_000);
    const scale = baseP1 / 18_000_000;

    let baseAmount: number;
    switch (pos) {
      case 1: baseAmount = 18_000_000; break;
      case 2: baseAmount = 14_000_000; break;
      case 3: baseAmount = 11_000_000; break;
      case 4: baseAmount = 8_800_000; break;
      case 5: baseAmount = 7_200_000; break;
      case 6: baseAmount = 5_600_000; break;
      case 7: baseAmount = 4_500_000; break;
      case 8: baseAmount = 3_600_000; break;
      case 9: baseAmount = 2_800_000; break;
      case 10: baseAmount = 2_000_000; break;
      case 11:
      case 12:
      case 13:
      case 14:
      case 15: baseAmount = 1_000_000; break;
      default: baseAmount = 600_000; break;
    }

    return Math.round((baseAmount * scale) / 25_000) * 25_000;
  };

  const getPointsForPosition = (pos: number): number => {
    const pts = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
    return pts[pos - 1] || 0;
  };

  // Finalize race calculations & prize distribution
  const finishRace = (finalDriversSnapshot: SimDriverState[], returnDirectlyToHub = false, bonusPrize = 0) => {
    const roundToFinalize = activeGp.round;

    if (finalizedRoundsRef.current.has(roundToFinalize)) {
      console.warn(`Round ${roundToFinalize} is already finalized. Skipping duplicate finish.`);
      return;
    }
    finalizedRoundsRef.current.add(roundToFinalize);

    sound.playCash();

    const p1Driver = finalDriversSnapshot.find((d) => d.driverSeat === 'driver1');
    const p2Driver = finalDriversSnapshot.find((d) => d.driverSeat === 'driver2');

    const posD1 = p1Driver ? p1Driver.position : 8;
    const posD2 = p2Driver ? p2Driver.position : 10;

    const circuitPurse = activeGp.firstPlacePrize || 18_000_000;
    const prizeD1 = getPrizeForPosition(posD1, circuitPurse);
    const prizeD2 = getPrizeForPosition(posD2, circuitPurse);
    const totalPrizeWon = prizeD1 + prizeD2 + bonusPrize;

    const totalSalaries =
      teamState.driver1.salary +
      teamState.driver2.salary +
      teamState.strategist.salary +
      teamState.pitCrew.salary;

    const netIncome = totalPrizeWon - totalSalaries;

    setFinancialReport({
      prizeD1,
      prizeD2,
      posD1,
      posD2,
      salaries: totalSalaries,
      netIncome,
    });

    const ptsD1 = getPointsForPosition(posD1);
    const ptsD2 = getPointsForPosition(posD2);

    if (returnDirectlyToHub) {
      setRaceFinished(false);
      setIsPlayingOutRun(false);
      onChangeView?.('championship');
      setLastRaceCelebration({
        round: roundToFinalize,
        gpName: activeGp.name,
        posD1,
        posD2,
        netIncome,
        ptsTotal: ptsD1 + ptsD2,
      });
      setTimeout(() => {
        raceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      setRaceFinished(true);
    }

    onUpdateTeamState((prev) => {
      const ptsD1 = getPointsForPosition(posD1);
      const ptsD2 = getPointsForPosition(posD2);

      const raceLogEntry: RaceResultRecord = {
        round: roundToFinalize,
        gpId: activeGp.id,
        gpName: activeGp.name,
        circuitName: activeGp.circuitName,
        country: activeGp.country,
        flag: activeGp.flag,
        seat1DriverName: prev.driver1.name,
        seat1DriverFlag: prev.driver1.nationality.flag,
        seat1DriverAvatar: prev.driver1.avatarSeed || prev.driver1.name,
        seat1Position: posD1,
        seat1Points: ptsD1,
        seat2DriverName: prev.driver2.name,
        seat2DriverFlag: prev.driver2.nationality.flag,
        seat2DriverAvatar: prev.driver2.avatarSeed || prev.driver2.name,
        seat2Position: posD2,
        seat2Points: ptsD2,
        totalPoints: ptsD1 + ptsD2,
        prizeMoneyWon: totalPrizeWon,
        dateTimestamp: Date.now(),
        fullGridResults: finalDriversSnapshot.map((d) => ({
          driverId: d.id,
          driverName: d.name,
          teamName: d.team,
          flag: d.flag,
          position: d.position,
          points: getPointsForPosition(d.position),
          isPlayer: d.isPlayer,
        })),
      };

      const { updatedRecords, driverStandings, newTrophies } = recordCompletedRaceToSeason(
        prev,
        raceLogEntry
      );

      const updatedCircuits = (prev.seasonCircuits || circuits).map((c) => {
        if (c.round === roundToFinalize) {
          return { ...c, isCompleted: true, finalized: true };
        }
        return c;
      });

      const activeSec =
        updatedRecords.find(
          (r) => r.seasonNumber === (prev.currentSeasonNumber || 1) && !r.isCompleted
        ) || updatedRecords.find((r) => r.status === 'in-progress');
      const finalizedCount = activeSec?.raceLogs?.length || 0;
      const nextRound = Math.min(prev.totalRaces, finalizedCount + 1);

      // Track 12th place (P12) finishes ("หรือได้อันดับที่ 12 3 ครั้ง")
      const isP12 = posD1 === 12;
      const nextP12Count = isP12
        ? (prev.totalP12FinishesCount || 0) + 1
        : (prev.totalP12FinishesCount || 0);
      const isBankruptP12 = nextP12Count >= 3;

      return {
        ...prev,
        budget: prev.budget + netIncome,
        championshipStandings: driverStandings || prev.championshipStandings,
        currentRound: nextRound,
        trophies: newTrophies,
        seasonRecords: updatedRecords,
        seasonCircuits: updatedCircuits,
        totalP12FinishesCount: nextP12Count,
        isBankruptHomeless: isBankruptP12 ? true : prev.isBankruptHomeless,
        bankruptHomelessReason: isBankruptP12 ? 'p12_finishes' : prev.bankruptHomelessReason,
      };
    });
  };

  // Handle Interactive OutRun 3D Race Completion ("ถ้าแพ้ ก็ให้ต้องแข่งด่านนั้นใหม่")
  const handleInteractiveOutRunFinish = (result: {
    playerPosition: number;
    bestLapTimeMs: number;
    totalTimeMs: number;
    topSpeedKmH: number;
    cleanLapsCount: number;
    isDnf?: boolean;
    isLoss?: boolean;
    bonusPrize?: number;
  }) => {
    setIsPlayingOutRun(false);

    if (outRunMode === 'practice') {
      sound.playTrophy();
      return;
    }

    // If player suffered a DNF or defeat ("ถ้าแพ้ ก็ให้ต้องแข่งด่านนั้นใหม่"):
    // Track car wreck count ("ทำรถพังเกิน 20 ครั้ง")
    if (result.isDnf || result.isLoss) {
      sound.playCrashImpact();
      setFinancialReport(null);
      setRaceFinished(false);
      setLastRaceCelebration(null);

      const nextCrashes = (teamState.totalCarCrashesCount || 0) + 1;
      const isBankruptCrashes = nextCrashes >= 20;

      onUpdateTeamState((prev) => ({
        ...prev,
        totalCarCrashesCount: nextCrashes,
        isBankruptHomeless: isBankruptCrashes ? true : prev.isBankruptHomeless,
        bankruptHomelessReason: isBankruptCrashes ? 'crashes' : prev.bankruptHomelessReason,
      }));

      if (!isBankruptCrashes) {
        setDnfRetryNotice({
          round: activeGp.round,
          gpName: activeGp.name,
          reason: `รถพังไฟไหม้และหยุดทำงาน (ENGINE FIRE DNF) • สถิติรถพังสะสม ${nextCrashes}/20 ครั้ง • คุณต้องแข่งสนามนี้ใหม่เพื่อผ่านไปยังรอบถัดไป`,
        });
        setTimeout(() => {
          raceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
      return;
    }

    setDnfRetryNotice(null);

    const carOvr = calculateCarOverall(teamState.car);
    const d1Rating = teamState.driver1.overall * 0.5 + carOvr * 0.5;
    const d2Rating = teamState.driver2.overall * 0.5 + carOvr * 0.5;
    const allGridDrivers = getGridDrivers(teamState);

    const baseGrid: SimDriverState[] = allGridDrivers.map((d, index) => {
      let rating = d.overall;
      if (d.driverSeat === 'driver1') {
        rating = d1Rating;
      } else if (d.driverSeat === 'driver2') {
        rating = d2Rating;
      } else {
        rating = d.overall * 0.5 + (82 + (index % 4) * 2) * 0.5;
      }

      return {
        id: d.id,
        name: d.name,
        team: d.teamName,
        flag: d.flag,
        overall: rating,
        position: index + 1,
        gapToLeader: 0,
        tireWear: 82,
        tireCompound: 'Soft' as const,
        hasPitted: true,
        pitStopTime: 2.8,
        isPlayer: d.isPlayerTeam,
        driverSeat: d.driverSeat,
      };
    });

    const targetPos = Math.max(1, Math.min(20, result.playerPosition));
    const d1 = baseGrid.find((d) => d.driverSeat === 'driver1') || baseGrid[0];
    const otherDrivers = baseGrid.filter((d) => d.driverSeat !== 'driver1');

    otherDrivers.sort((a, b) => (b.overall + Math.random() * 2) - (a.overall + Math.random() * 2));

    const finalGrid: SimDriverState[] = [];
    let otherIdx = 0;
    for (let p = 1; p <= 20; p++) {
      if (p === targetPos) {
        finalGrid.push({
          ...d1,
          position: p,
          gapToLeader: p === 1 ? 0 : Number(((p - 1) * 1.5 + Math.random() * 0.4).toFixed(1)),
        });
      } else if (otherIdx < otherDrivers.length) {
        finalGrid.push({
          ...otherDrivers[otherIdx],
          position: p,
          gapToLeader: p === 1 ? 0 : Number(((p - 1) * 1.5 + Math.random() * 0.4).toFixed(1)),
        });
        otherIdx++;
      }
    }

    finishRace(finalGrid, true, result.bonusPrize || 0);
  };

  // Calculate dynamic race laps: increases as season nears finale, capped at 5 laps max
  const calculatedLaps = (() => {
    const round = teamState.currentRound;
    if (round <= 4) return 2;
    if (round <= 9) return 3;
    if (round <= 14) return 4;
    return 5; // Capped at 5 laps for final stages
  })();

  const p1Prize = getPrizeForPosition(1, activeGp.firstPlacePrize);
  const p2Prize = getPrizeForPosition(2, activeGp.firstPlacePrize);
  const p3Prize = getPrizeForPosition(3, activeGp.firstPlacePrize);

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* ======================================================================= */}
      {/* 1. RACE CONTROL & NEXT GRAND PRIX HERO SECTION                          */}
      {/* ======================================================================= */}
      <div ref={raceSectionRef} className="space-y-6 scroll-mt-20">
        {/* =================================================================== */}
        {/* PLAYABLE OUTRUN PSEUDO-3D RASTER ROAD ENGINE                        */}
        {/* =================================================================== */}
        {isPlayingOutRun && (
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c1017]/75 backdrop-blur-md p-3 rounded-2xl border border-slate-800/70 shadow-xl">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40">
                  <Gamepad2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-racing font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>LIVE INTERACTIVE RACE</span>
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-mono font-bold">
                      {outRunMode === 'practice' ? 'FREE PRACTICE' : 'CHAMPIONSHIP GP'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    OutRun Pseudo-3D Engine • {teamState.driver1.name} (Driver 1) • {activeGp.name} • {calculatedLaps} LAPS
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.stopOutRunEngine();
                  sound.stopRaceMusic();
                  setIsPlayingOutRun(false);
                }}
                className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition cursor-pointer backdrop-blur-xs"
              >
                RETURN TO RACE HUB
              </button>
            </div>

            <OutRunRaceEngine
              teamState={teamState}
              activeGp={activeGp}
              lapsCount={calculatedLaps}
              onRaceCompleted={handleInteractiveOutRunFinish}
              onExit={() => setIsPlayingOutRun(false)}
            />
          </div>
        )}

        {/* Post-Race Celebration & Prize Acknowledgment Banner */}
        {lastRaceCelebration && !isPlayingOutRun && !raceFinished && (
          <div className="relative">
            {lastRaceCelebration.posD1 <= 3 && (
              <ConfettiCelebration rank={lastRaceCelebration.posD1} />
            )}
            <div className="bg-gradient-to-r from-emerald-950/90 via-[#0e1724] to-[#121c2c] border-2 border-emerald-500/60 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black font-racing uppercase text-white flex items-center gap-2">
                  <span>ROUND {lastRaceCelebration.round} COMPLETE • PRIZE CLAIMED!</span>
                  <span className="text-xs bg-emerald-600 text-white font-mono px-2 py-0.5 rounded font-bold">
                    +{lastRaceCelebration.ptsTotal} PTS
                  </span>
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  {teamState.driver1.name} finished P{lastRaceCelebration.posD1} ({lastRaceCelebration.gpName}) • Net Earnings: <strong className="text-emerald-400">+{formatMoney(lastRaceCelebration.netIncome)}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {lastRaceCelebration.posD1 <= 3 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowCelebrationCutscene(true);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500/25 to-yellow-500/25 hover:from-amber-500/40 hover:to-yellow-500/40 text-amber-300 rounded-xl text-xs font-racing font-bold uppercase tracking-wider border border-amber-500/50 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span>VIEW CUTSCENE 🏆</span>
                </button>
              )}
              <button
                onClick={() => setRaceFinished(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer"
              >
                STATEMENT
              </button>
              <button
                onClick={() => setLastRaceCelebration(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-racing font-bold uppercase tracking-wider transition cursor-pointer shadow-md"
              >
                CONTINUE TO ROUND {teamState.currentRound} ✓
              </button>
            </div>
          </div>
        </div>
      )}

        {/* DNF Defeat Notice Banner ("ถ้าแพ้ ก็ให้ต้องแข่งด่านนั้นใหม่") */}
        {!isPlayingOutRun && dnfRetryNotice && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950 via-[#1c0d12] to-red-950 border-2 border-red-500 shadow-2xl shadow-red-950/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">🔥</span>
              <div>
                <h4 className="text-sm sm:text-base font-racing font-black text-red-300 uppercase tracking-wide flex items-center gap-2">
                  <span>การแข่งขันล้มเหลว (DNF) • ต้องแข่งสนามนี้ใหม่</span>
                  <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                    RETRY REQUIRED
                  </span>
                </h4>
                <p className="text-xs font-mono text-red-200/90 mt-0.5">
                  {dnfRetryNotice.gpName} (ROUND {dnfRetryNotice.round}): {dnfRetryNotice.reason}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                sound.resumeAudio();
                setDnfRetryNotice(null);
                setOutRunMode('grand-prix');
                setIsPlayingOutRun(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-lg shadow-red-950 shrink-0 flex items-center justify-center gap-2 border border-red-400"
            >
              <RotateCcw className="w-4 h-4 text-white" />
              <span>แข่งสนามนี้ใหม่ (RETRY) →</span>
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* SINGLE UNIFIED HERO RACE CARD: CIRCUIT DETAILS + DRIVE + P1-P3 PRIZES */}
        {/* =================================================================== */}
        {!isPlayingOutRun && !raceFinished && (
          <div className="bg-gradient-to-br from-[#18212f] via-[#121824] to-[#0c1017] border-2 border-red-500/50 p-6 sm:p-7 rounded-3xl shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute -right-24 -top-24 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Sub-Row: Circuit Identity & Track Layout Silhouette */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {renderFlag(activeGp.country || activeGp.flag, 'md')}
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-950/70 px-2.5 py-0.5 rounded border border-red-500/40">
                    ROUND {teamState.currentRound} OF {teamState.totalRaces}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    {activeGp.weather === 'Dry' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    {activeGp.weather} Track
                  </span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/40 font-bold">
                    🏁 OFFICIAL RACE: {calculatedLaps} LAPS
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-racing text-white uppercase tracking-wide mt-1.5">
                  {activeGp.name}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {activeGp.circuitName} • Track Length: {activeGp.lapLengthKm} km • Dynamic Finale Scale: {calculatedLaps} Laps (Capped at 5 Laps)
                </p>

                {/* Real-World Environment Design & Atmosphere */}
                {(() => {
                  const tourDef = getWorldTourCircuit(activeGp.round, activeGp.id);
                  return (
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-mono font-bold mt-2 flex-wrap">
                      <span className="bg-amber-950/70 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{tourDef.environmentName}</span>
                      </span>
                      <span className="text-slate-300 font-normal italic">
                        "{tourDef.environmentDescription}"
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Track Layout Silhouette Preview & Circuit Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-col items-center justify-center w-28 sm:w-32 h-20 bg-[#090e18] border border-slate-800 rounded-xl p-1.5 relative overflow-hidden shrink-0 shadow-inner">
                  <TrackLayoutPreview
                    circuitId={activeGp.id}
                    circuitName={activeGp.name}
                    path={activeGp.trackLayoutPath}
                    width={100}
                    height={60}
                    showStartFinish={true}
                    showDirectionArrow={true}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Sub-Row: Drive Details (Left) + P1, P2, P3 Podium Prizes & Drive Action (Right) */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Left Column: Take The Wheel Details & Team Specs */}
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[11px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    PLAYABLE 3D ARCADE RACE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/40 uppercase">
                    OUTRUN PSEUDO-3D RASTER ROAD ENGINE
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-racing uppercase tracking-wide text-white">
                  TAKE THE WHEEL: DRIVE YOUR TEAM'S F1 CAR
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
                  ควบคุมพวงมาลัยด้วยตัวคุณเอง สู้กับแรงเหวี่ยงหนีศูนย์กลางในโค้ง เปิดระบบ DRS Boost บนทางตรง และสู้เพื่อตำแหน่ง P1 บนสนามแข่ง! จำนวนรอบแข่งจะเพิ่มขึ้นอัตโนมัติเมื่อเข้าสู่ช่วงท้ายของฤดูกาล (จำกัดสูงสุด 5 รอบ)
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-1.5 bg-[#0e141f]/75 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Driver:</span>
                    <strong className="text-white">
                      {teamState.driver1.name} (OVR {teamState.driver1.overall})
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0e141f]/75 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Car Engine & Aero:</span>
                    <strong className="text-red-400">
                      {teamState.car.engine} PWR • {teamState.car.aero} AERO
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0e141f]/75 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Distance:</span>
                    <span className="text-amber-300 font-bold">{calculatedLaps} LAPS</span>
                  </div>
                  {(() => {
                    const fitInfo = calculateCircuitFit(teamState.car, activeGp.round || 1);
                    return (
                      <div className="flex items-center gap-1.5 bg-[#0e141f]/75 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400">Circuit Fit:</span>
                        <strong className={fitInfo.circuitFitPct >= 100 ? 'text-emerald-400' : 'text-amber-400'}>
                          {fitInfo.circuitFitPct}% ({fitInfo.circuitFit} vs {fitInfo.benchmark} OVR)
                        </strong>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Column: P1, P2, P3 Podium Prizes & Drive Action Button */}
              <div className="bg-[#0b0f17]/80 backdrop-blur-md border-2 border-slate-800/80 hover:border-slate-700/80 p-5 rounded-2xl flex flex-col gap-3 min-w-[280px] lg:w-[340px] shrink-0 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>PODIUM PRIZES (รางวัลที่ 1 - 3)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">OFFICIAL</span>
                </div>

                {/* 🥇 1st Place (P1 Winner) */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-900/15 to-transparent border border-amber-500/50 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/30 border border-amber-400/60 text-amber-300 font-racing font-black text-xs flex items-center justify-center shrink-0">
                      🥇
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block leading-tight">
                        P1 WINNER
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">+25 PTS • Trophy</span>
                    </div>
                  </div>
                  <span className="text-base sm:text-lg font-black font-mono text-amber-300">
                    {formatMoney(p1Prize)}
                  </span>
                </div>

                {/* 🥈 2nd Place (P2 Runner-up) */}
                <div className="p-2 rounded-xl bg-gradient-to-r from-slate-400/10 via-slate-800/20 to-transparent border border-slate-600/40 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-400/20 border border-slate-400/50 text-slate-200 font-racing font-black text-xs flex items-center justify-center shrink-0">
                      🥈
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-300 block leading-tight">
                        P2 RUNNER-UP
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">+18 PTS</span>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-black font-mono text-slate-200">
                    {formatMoney(p2Prize)}
                  </span>
                </div>

                {/* 🥉 3rd Place (P3 Podium) */}
                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-800/15 via-slate-900/30 to-transparent border border-amber-700/40 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-800/25 border border-amber-700/50 text-amber-500 font-racing font-black text-xs flex items-center justify-center shrink-0">
                      🥉
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-500 block leading-tight">
                        P3 PODIUM
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">+15 PTS</span>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-black font-mono text-amber-400">
                    {formatMoney(p3Prize)}
                  </span>
                </div>

                {/* Action Buttons: DRIVE RACE & FREE PRACTICE */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      sound.playClick();
                      sound.resumeAudio();
                      setDnfRetryNotice(null);
                      setOutRunMode('grand-prix');
                      setIsPlayingOutRun(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-500 text-white font-racing font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-red-950/80 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border border-red-400/40"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>DRIVE RACE ({calculatedLaps} LAPS) →</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      sound.resumeAudio();
                      setOutRunMode('practice');
                      setIsPlayingOutRun(true);
                    }}
                    className="w-full py-2 bg-[#121824] hover:bg-[#182030] text-amber-300 font-racing font-bold text-xs uppercase tracking-wider rounded-xl border border-amber-500/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>FREE PRACTICE / HOT LAP</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post-Race Financial Report & Statement */}
        {raceFinished && financialReport && (
          <div className="bg-[#121824] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-racing uppercase text-white tracking-wide">
                    RACE COMPLETE • FINANCIAL & POINTS REPORT
                  </h3>
                  <p className="text-xs text-slate-400">
                    เงินรางวัลเข้าบัญชีสโมสรเรียบร้อยหลังหักค่าเหนื่อยนักแข่งและทีมงาน
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 font-mono uppercase block">NET RACE BALANCE</span>
                <span
                  className={`text-3xl font-black font-mono ${
                    financialReport.netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {financialReport.netIncome >= 0 ? '+' : ''}
                  {formatMoney(financialReport.netIncome)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prize Breakdown */}
              <div className="bg-[#0e131b] p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  PRIZE MONEY WON
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-300">
                      {teamState.driver1.name} (Finished P{financialReport.posD1}):
                    </span>
                    <strong className="text-emerald-400">+{formatMoney(financialReport.prizeD1)}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-300">
                      {teamState.driver2.name} (Finished P{financialReport.posD2}):
                    </span>
                    <strong className="text-emerald-400">+{formatMoney(financialReport.prizeD2)}</strong>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span className="text-slate-200">Total Prize Money:</span>
                    <span className="text-emerald-300">
                      +{formatMoney(financialReport.prizeD1 + financialReport.prizeD2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Salaries Breakdown */}
              <div className="bg-[#0e131b] p-5 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">
                  STAFF SALARIES EXPENSE
                </span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">{teamState.driver1.name} (Driver 1):</span>
                    <span className="text-red-400">-{formatMoney(teamState.driver1.salary)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">{teamState.driver2.name} (Driver 2):</span>
                    <span className="text-red-400">-{formatMoney(teamState.driver2.salary)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">AI Strategist & Pit Crew:</span>
                    <span className="text-red-400">
                      -{formatMoney(teamState.strategist.salary + teamState.pitCrew.salary)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span className="text-slate-200">Total Event Expenses:</span>
                    <span className="text-red-400">-{formatMoney(financialReport.salaries)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky bottom-2 bg-[#121824]/95 backdrop-blur-md py-2.5 px-3 rounded-2xl border border-slate-700/80 shadow-2xl z-20">
              <div className="flex items-center gap-2">
                {onChangeView && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onChangeView('records');
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-racing font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>VIEW STANDINGS & RECORDS →</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  sound.playCash();
                  setRaceFinished(false);
                  setFinancialReport(null);
                  setIsPlayingOutRun(false);
                  onChangeView?.('championship');
                  setTimeout(() => {
                    raceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 60);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border border-emerald-400/50 text-white font-racing font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-950/80 cursor-pointer ml-auto flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>CLAIM PRIZES & RETURN TO CHAMPIONSHIP →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* 2. SEASON ROUTE WORLD MAP (ARROW INDICATES NEXT RACE DESTINATION)       */}
      {/* ======================================================================= */}
      <div ref={mapSectionRef} className="scroll-mt-20">
        <SeasonRouteWorldMap
          circuits={circuits}
          currentRound={teamState.currentRound}
          completedRoundNumbers={completedRoundNumbers}
        />
      </div>

      {/* ======================================================================= */}
      {/* 3. SEASON 18-ROUND PROGRESSION STRIP (COMPACT CALENDAR TRACKER)        */}
      {/* ======================================================================= */}
      <div
        ref={calendarSectionRef}
        className="scroll-mt-20 bg-[#090d14] border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h3 className="text-lg font-black font-racing uppercase tracking-wide text-white">
              SEASON 18-ROUND PROGRESSION TRACKER
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {completedRoundNumbers.length} / {circuits.length} Rounds Completed
          </span>
        </div>

        {/* 18 Circuit Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {circuits.map((c) => {
            const isCompleted = completedRoundNumbers.includes(c.round);
            const isNext = c.round === teamState.currentRound;
            const log = raceLogs.find((l) => l.round === c.round);

            return (
              <div
                key={c.id || c.round}
                className={`relative group p-2.5 rounded-xl border transition flex flex-col justify-between overflow-hidden ${
                  isNext
                    ? 'bg-gradient-to-br from-red-950/80 to-[#121926] border-red-500/80 shadow-md shadow-red-950 ring-1 ring-red-500/50'
                    : isCompleted
                    ? 'bg-[#0f1520] border-emerald-500/40 text-slate-300'
                    : 'bg-[#0b0f16] border-slate-800/80 text-slate-500'
                }`}
              >
                {/* Subtle City Landmark Graphic Background for all 18 Stages */}
                <CityGraphicBackdrop round={c.round} />

                {/* Foreground Card Header & Text Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold text-slate-200">R{c.round}</span>
                    <span>{renderFlag(c.country || c.flag, 'sm')}</span>
                  </div>
                  <h5 className="font-racing font-bold text-xs uppercase tracking-wide text-white truncate drop-shadow-sm">
                    {c.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{c.city || c.country}</p>
                </div>

                {/* Foreground Card Footer Status */}
                <div className="relative z-10 mt-2 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  {isNext ? (
                    <span className="text-red-400 font-bold flex items-center gap-1 animate-pulse">
                      ● NEXT
                    </span>
                  ) : isCompleted ? (
                    <span className="text-emerald-400 font-bold">
                      {log ? `P${log.seat1Position} / P${log.seat2Position}` : '✓ FINISHED'}
                    </span>
                  ) : (
                    <span className="text-slate-500">UPCOMING</span>
                  )}
                  <span className="text-slate-400 font-bold">{c.totalLaps}L</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Victory Celebration Cutscene Modal */}
      {showCelebrationCutscene && (
        <VictoryCelebrationCutscene
          teamState={teamState}
          onClose={() => setShowCelebrationCutscene(false)}
          forceShowcaseTrophies={false}
        />
      )}
    </div>
  );
};
