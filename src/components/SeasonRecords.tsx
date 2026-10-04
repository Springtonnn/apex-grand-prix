import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Flag,
  Calendar,
  Sparkles,
  RotateCw,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Shield,
} from 'lucide-react';
import { TeamState, SeasonRecord, RaceResultRecord } from '../types/game';
import { TeamLogo } from './TeamLogo';
import { PersonAvatar } from './PersonAvatar';
import { renderFlag } from './CountryFlag';
import { formatMoney } from '../utils/calculations';
import { sound } from '../utils/audio';
import {
  initializeSeasonRecords,
  calculateCareerTotals,
  advanceToNextSeason,
  calculateSeasonStandings,
} from '../utils/seasonRecordsManager';
import { ChampionshipStandingsCard } from './ChampionshipStandingsCard';
import { VictoryCelebrationCutscene } from './VictoryCelebrationCutscene';

interface SeasonRecordsProps {
  teamState: TeamState;
  onUpdateTeamState: React.Dispatch<React.SetStateAction<TeamState>>;
  onChangeView: (view: 'main-menu' | 'team-management' | 'championship' | 'records' | 'help-tutorial') => void;
}

export const SeasonRecords: React.FC<SeasonRecordsProps> = ({
  teamState,
  onUpdateTeamState,
  onChangeView,
}) => {
  const allSeasons = useMemo(() => {
    return initializeSeasonRecords(teamState);
  }, [teamState]);

  // Tab mode: 'standings' | 'race-logs' | 'seasons-archive'
  const [activeTab, setActiveTab] = useState<'standings' | 'race-logs' | 'seasons-archive'>('standings');
  const [showCelebrationCutscene, setShowCelebrationCutscene] = useState(false);

  // Selected season for logs and archive
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(() => {
    const active = allSeasons.find((s) => s.status === 'in-progress');
    return active ? active.seasonNumber : allSeasons[0]?.seasonNumber || 1;
  });

  const selectedSeason = useMemo(() => {
    return allSeasons.find((s) => s.seasonNumber === selectedSeasonNumber) || allSeasons[0];
  }, [allSeasons, selectedSeasonNumber]);

  const careerTotals = useMemo(() => {
    return calculateCareerTotals(teamState);
  }, [teamState, allSeasons]);

  // Handle advancing to next season
  const handleStartNextSeason = () => {
    sound.playTrophy();
    const updated = advanceToNextSeason(teamState);
    onUpdateTeamState(updated);
    setSelectedSeasonNumber(updated.currentSeasonNumber || 1);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* ========================================================================= */}
      {/* 1. CAREER LEGACY HEADER (CONCISE & SLEEK)                                 */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#17202d]/75 via-[#121824]/75 to-[#0c1017]/75 backdrop-blur-md border border-amber-500/30 p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left: Team Brand */}
          <div className="flex items-center gap-3.5">
            <TeamLogo
              teamName={teamState.teamName}
              shape={teamState.logoShape}
              primaryColor={teamState.primaryColor}
              secondaryColor={teamState.secondaryColor}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  RECORDS & STANDINGS
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  SEASON {teamState.currentSeasonNumber || 1} • {teamState.teamName}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-racing text-white tracking-wide uppercase mt-1">
                CHAMPIONSHIP STANDINGS & RECORDS
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                คะแนนสะสมชิงแชมป์โลก, ประวัติผลการแข่งขันแต่ละสนาม และสถิติตลอดกาลของทีม
              </p>
            </div>
          </div>

          {/* Right: 4 Concise Career Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            {/* World Titles */}
            <div className="bg-[#0b0e14]/75 backdrop-blur-xs border border-amber-500/40 px-3.5 py-2.5 rounded-xl text-center shadow-md">
              <span className="text-[10px] uppercase font-mono text-amber-400/90 font-bold flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                TITLES
              </span>
              <span className="text-xl sm:text-2xl font-black font-racing text-amber-300 block">
                {careerTotals.worldChampionships}
              </span>
              <span className="text-[9px] text-amber-500/80 font-mono">WORLD CHAMPION</span>
            </div>

            {/* Race Wins */}
            <div className="bg-[#0b0e14]/75 backdrop-blur-xs border border-red-500/30 px-3.5 py-2.5 rounded-xl text-center shadow-md">
              <span className="text-[10px] uppercase font-mono text-red-400 font-bold flex items-center justify-center gap-1">
                <Flag className="w-3 h-3 text-red-400" />
                WINS
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-red-400 block">
                {careerTotals.raceWins}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">P1 VICTORIES</span>
            </div>

            {/* Podiums */}
            <div className="bg-[#0b0e14]/75 backdrop-blur-xs border border-emerald-500/30 px-3.5 py-2.5 rounded-xl text-center shadow-md">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center justify-center gap-1">
                <Medal className="w-3 h-3 text-emerald-400" />
                PODIUMS
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-300 block">
                {careerTotals.podiums}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">TOP 3 FINISHES</span>
            </div>

            {/* Total Seasons */}
            <div className="bg-[#0b0e14]/75 backdrop-blur-xs border border-slate-800/80 px-3.5 py-2.5 rounded-xl text-center shadow-md">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-blue-400" />
                SEASONS
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-white block">
                {careerTotals.seasonsContested}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">CONTESTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB SWITCHER: STANDINGS vs RACE LOGS vs SEASONS ARCHIVE               */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111722]/70 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800/70">
        <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-racing uppercase tracking-wider">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('standings');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === 'standings'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-black shadow-lg shadow-red-950 border border-red-500/50'
                : 'bg-[#141b25]/70 hover:bg-[#1a2332]/90 text-slate-300 hover:text-white border border-slate-800/80 backdrop-blur-xs'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>STANDINGS (ตารางคะแนน)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('race-logs');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === 'race-logs'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-black shadow-lg shadow-red-950 border border-red-500/50'
                : 'bg-[#141b25]/70 hover:bg-[#1a2332]/90 text-slate-300 hover:text-white border border-slate-800/80 backdrop-blur-xs'
            }`}
          >
            <Flag className="w-4 h-4 text-red-400" />
            <span>RACE LOGS (ประวัติการแข่ง)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('seasons-archive');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === 'seasons-archive'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white font-black shadow-lg shadow-red-950 border border-red-500/50'
                : 'bg-[#141b25]/70 hover:bg-[#1a2332]/90 text-slate-300 hover:text-white border border-slate-800/80 backdrop-blur-xs'
            }`}
          >
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>SEASONS ARCHIVE (ฤดูกาล)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          {careerTotals.worldChampionships > 0 && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowCelebrationCutscene(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-yellow-500/25 hover:from-amber-500/40 hover:to-yellow-500/40 text-amber-300 font-racing font-bold text-xs uppercase tracking-wider border border-amber-500/50 shadow-md cursor-pointer transition"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>VICTORY CUTSCENE 🏆</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onChangeView('championship');
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-racing font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer transition"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>GO TO RACE →</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OFFICIAL CHAMPIONSHIP STANDINGS (Constructors & Drivers)          */}
      {/* ========================================================================= */}
      {activeTab === 'standings' && (
        <div className="animate-in fade-in space-y-6">
          <ChampionshipStandingsCard
            teamState={teamState}
            defaultExpanded={true}
            onOpenCalendar={() => onChangeView('championship')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RACE-BY-RACE LOGS (CONCISE, CLEAN, HIGH-READABILITY)               */}
      {/* ========================================================================= */}
      {activeTab === 'race-logs' && (
        <div className="animate-in fade-in space-y-4">
          <div className="bg-[#10151f]/75 backdrop-blur-md border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header Strip */}
            <div className="bg-[#141b25]/75 backdrop-blur-xs px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-racing font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Flag className="w-4 h-4 text-amber-400" />
                  <span>RACE-BY-RACE TELEMETRY LOG</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ผลการแข่งขันอย่างเป็นทางการของ {teamState.teamName} ในฤดูกาลที่ {selectedSeason.seasonNumber}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="bg-[#0c1017] px-3 py-1.5 rounded-lg border border-slate-800">
                  {selectedSeason.raceLogs.length} / {teamState.totalRaces} Races Completed
                </span>
              </div>
            </div>

            {/* Empty State */}
            {selectedSeason.raceLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-mono space-y-3">
                <Clock className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-300">ยังไม่มีประวัติการแข่งในฤดูกาลนี้</p>
                <p className="text-xs text-slate-500">
                  เข้าสู่หน้า <strong className="text-red-400">CHAMPIONSHIP</strong> เพื่อเริ่มแข่งขันสนามแรก
                </p>
                <button
                  onClick={() => {
                    sound.playClick();
                    onChangeView('championship');
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition inline-flex items-center gap-2 mt-2"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>START FIRST RACE →</span>
                </button>
              </div>
            ) : (
              /* Compact, High-Legibility Log Table */
              <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#0c1017] text-slate-400 uppercase border-b border-slate-800 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4">ROUND</th>
                      <th className="py-3 px-4">GRAND PRIX & CIRCUIT</th>
                      <th className="py-3 px-4">RACE WINNER (ผู้ชนะสนาม)</th>
                      <th className="py-3 px-4">SEAT 1 ({teamState.driver1.name})</th>
                      <th className="py-3 px-4">SEAT 2 ({teamState.driver2.name})</th>
                      <th className="py-3 px-4 text-center">POINTS EARNED</th>
                      <th className="py-3 px-4 text-right">PRIZE WON</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedSeason.raceLogs.map((log) => {
                      const hasWin = log.seat1Position === 1 || log.seat2Position === 1;
                      const hasPodium =
                        log.seat1Position <= 3 || log.seat2Position <= 3;

                      const p1Winner = log.fullGridResults?.find((d) => d.position === 1);
                      const winnerName =
                        log.winnerName ||
                        p1Winner?.driverName ||
                        (log.seat1Position === 1 ? log.seat1DriverName : 'Min Werstappen');
                      const winnerTeam =
                        log.winnerTeam ||
                        p1Winner?.teamName ||
                        (log.seat1Position === 1 ? teamState.teamName : 'Red Bullion Racing');
                      const winnerFlag =
                        log.winnerFlag ||
                        p1Winner?.flag ||
                        (log.seat1Position === 1 ? log.seat1DriverFlag : '🇳🇱');
                      const isPlayerWinner = p1Winner?.isPlayer || log.seat1Position === 1;

                      return (
                        <tr
                          key={log.round}
                          className={`transition ${
                            hasWin
                              ? 'bg-amber-500/10 hover:bg-amber-500/15 border-l-4 border-amber-400'
                              : hasPodium
                              ? 'bg-slate-700/20 hover:bg-slate-700/30 border-l-4 border-slate-400'
                              : 'hover:bg-slate-800/30'
                          }`}
                        >
                          {/* Round */}
                          <td className="py-3.5 px-4 font-bold text-slate-300">
                            R{log.round}
                          </td>

                          {/* Grand Prix Name & Flag */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span>{renderFlag(log.flag, 'sm')}</span>
                              <div>
                                <span className="font-bold text-white block">
                                  {log.gpName}
                                </span>
                                <span className="text-[10px] text-slate-400">{log.circuitName}</span>
                              </div>
                              {hasWin && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50">
                                  🏆 WIN
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Race Winner Column (Directly matching Claim menu) */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-black px-2 py-0.5 rounded text-xs inline-flex items-center gap-1 ${
                                  isPlayerWinner
                                    ? 'bg-amber-400 text-black border border-amber-300 shadow-xs'
                                    : 'bg-slate-800 text-amber-300 border border-slate-700'
                                }`}
                              >
                                <span>🥇</span>
                                <span>P1</span>
                              </span>
                              <span>{renderFlag(winnerFlag, 'sm')}</span>
                              <div>
                                <span
                                  className={`font-bold block truncate max-w-[140px] ${
                                    isPlayerWinner ? 'text-amber-300 font-racing' : 'text-white'
                                  }`}
                                >
                                  {winnerName} {isPlayerWinner ? '(YOU)' : ''}
                                </span>
                                <span className="text-[10px] text-slate-400 truncate max-w-[140px] block">
                                  {winnerTeam}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Seat 1 Result */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-black px-2 py-0.5 rounded text-xs ${
                                  log.seat1Position === 1
                                    ? 'bg-amber-400 text-black'
                                    : log.seat1Position <= 3
                                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                                    : log.seat1Position <= 10
                                    ? 'bg-slate-800 text-slate-200'
                                    : 'text-slate-500'
                                }`}
                              >
                                P{log.seat1Position}
                              </span>
                              <span className="text-slate-300 truncate max-w-[120px]">
                                {log.seat1DriverName}
                              </span>
                              {log.seat1Points > 0 && (
                                <span className="text-amber-400 font-bold">+{log.seat1Points} pts</span>
                              )}
                            </div>
                          </td>

                          {/* Seat 2 Result */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-black px-2 py-0.5 rounded text-xs ${
                                  log.seat2Position === 1
                                    ? 'bg-amber-400 text-black'
                                    : log.seat2Position <= 3
                                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                                    : log.seat2Position <= 10
                                    ? 'bg-slate-800 text-slate-200'
                                    : 'text-slate-500'
                                }`}
                              >
                                P{log.seat2Position}
                              </span>
                              <span className="text-slate-300 truncate max-w-[120px]">
                                {log.seat2DriverName}
                              </span>
                              {log.seat2Points > 0 && (
                                <span className="text-amber-400 font-bold">+{log.seat2Points} pts</span>
                              )}
                            </div>
                          </td>

                          {/* Total Points */}
                          <td className="py-3.5 px-4 text-center font-bold text-amber-300 text-sm">
                            +{log.totalPoints} PTS
                          </td>

                          {/* Prize Money */}
                          <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                            +{formatMoney(log.prizeMoneyWon)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SEASONS ARCHIVE & CAREER OVERVIEW                                   */}
      {/* ========================================================================= */}
      {activeTab === 'seasons-archive' && (
        <div className="animate-in fade-in space-y-6">
          <div className="bg-[#10151f]/75 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-racing font-bold text-white uppercase tracking-wider">
                  ALL SEASONS ARCHIVE • ประวัติศาสตร์ทุกฤดูกาล
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ประวัติผลงานสะสมของทีม {teamState.teamName} ในแต่ละฤดูกาล
                </p>
              </div>

              {selectedSeason.isCompleted &&
                selectedSeason.seasonNumber === (teamState.currentSeasonNumber || 1) && (
                  <button
                    onClick={handleStartNextSeason}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-racing font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer transition active:scale-95 flex items-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>START SEASON {(teamState.currentSeasonNumber || 1) + 1} →</span>
                  </button>
                )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#0c1017] text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">SEASON</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">FINAL FINISH</th>
                    <th className="py-3 px-4 text-center">RACES</th>
                    <th className="py-3 px-4 text-center">WINS</th>
                    <th className="py-3 px-4 text-center">PODIUMS</th>
                    <th className="py-3 px-4 text-right">POINTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {allSeasons.map((s) => {
                    const isChampion = s.isCompleted && s.finalStandingPosition === 1;
                    return (
                      <tr
                        key={s.seasonNumber}
                        className={`transition hover:bg-slate-800/30 ${
                          isChampion ? 'bg-amber-500/10' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold text-white">
                          {s.title || `Season ${s.seasonNumber}`}
                        </td>
                        <td className="py-3.5 px-4">
                          {s.status === 'in-progress' ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                              IN PROGRESS
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                              COMPLETED
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {isChampion ? (
                            <span className="text-amber-300 font-bold flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5" />
                              <span>🏆 WORLD CHAMPION</span>
                            </span>
                          ) : s.finalStandingPosition === 2 ? (
                            <span className="text-slate-300 font-bold">🥈 RUNNER-UP</span>
                          ) : s.finalStandingPosition === 3 ? (
                            <span className="text-amber-500 font-bold">🥉 P3 FINISH</span>
                          ) : (
                            <span className="text-slate-400">P{s.finalStandingPosition || s.constructorRank}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-300">
                          {s.raceLogs.length}
                        </td>
                        <td className="py-3.5 px-4 text-center text-red-400 font-bold">
                          {s.wins}
                        </td>
                        <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">
                          {s.podiums}
                        </td>
                        <td className="py-3.5 px-4 text-right text-white font-bold text-sm">
                          {s.constructorPoints} PTS
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Victory Celebration Cutscene Modal */}
      {showCelebrationCutscene && (
        <VictoryCelebrationCutscene
          teamState={teamState}
          onClose={() => setShowCelebrationCutscene(false)}
          forceShowcaseTrophies={careerTotals.podiums === 0}
        />
      )}
    </div>
  );
};
