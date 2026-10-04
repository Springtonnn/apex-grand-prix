import React, { useEffect, useRef } from 'react';
import { Trophy, Users, Shield, Calendar } from 'lucide-react';
import { TeamState } from '../types/game';
import { TeamLogo } from './TeamLogo';
import { PersonAvatar } from './PersonAvatar';
import { renderFlag } from './CountryFlag';
import { calculateSeasonStandings } from '../utils/seasonRecordsManager';
import { sound } from '../utils/audio';

interface ChampionshipStandingsCardProps {
  teamState: TeamState;
  className?: string;
  defaultExpanded?: boolean;
  onOpenCalendar?: () => void;
}

export const ChampionshipStandingsCard: React.FC<ChampionshipStandingsCardProps> = ({
  teamState,
  className = '',
  onOpenCalendar,
}) => {
  // Unified single source of truth for season standings
  const { constructorStandings, driverStandings } = calculateSeasonStandings(teamState);

  const activeSeason =
    teamState.seasonRecords?.find(
      (r) => r.seasonNumber === (teamState.currentSeasonNumber || 1) && !r.isCompleted
    ) ||
    teamState.seasonRecords?.find((r) => r.status === 'in-progress') ||
    teamState.seasonRecords?.[0];

  const racesCompleted = activeSeason?.raceLogs?.length || 0;

  // Refs for scroll containers and player row targets
  const constructorsContainerRef = useRef<HTMLDivElement>(null);
  const driversContainerRef = useRef<HTMLDivElement>(null);
  const playerTeamRowRef = useRef<HTMLDivElement>(null);
  const playerDriverRowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to player's row if not in initial view
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check constructors scroll container
      if (constructorsContainerRef.current && playerTeamRowRef.current) {
        const cRect = constructorsContainerRef.current.getBoundingClientRect();
        const rRect = playerTeamRowRef.current.getBoundingClientRect();
        // Only scroll if outside currently visible viewport
        if (rRect.bottom > cRect.bottom || rRect.top < cRect.top) {
          playerTeamRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      // Check drivers scroll container
      if (driversContainerRef.current && playerDriverRowRef.current) {
        const cRect = driversContainerRef.current.getBoundingClientRect();
        const rRect = playerDriverRowRef.current.getBoundingClientRect();
        // Only scroll if outside currently visible viewport
        if (rRect.bottom > cRect.bottom || rRect.top < cRect.top) {
          playerDriverRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [teamState.teamName, teamState.currentRound]);

  // Track the first player driver in the list to assign ref
  let hasAssignedPlayerDriverRef = false;

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#090d14]/75 backdrop-blur-md ${className}`}
    >
      {/* ========================================================================= */}
      {/* 1. ABSTRACT RACING CIRCUIT ATMOSPHERE BACKGROUND (SVG + CSS GRADIENTS)   */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="w-full h-full object-cover opacity-35"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Speed line gradient */}
            <linearGradient id="trackRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#ef4444" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>

            {/* Stadium floodlight glows */}
            <radialGradient id="stadiumGlow1" cx="15%" cy="15%" r="60%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="stadiumGlow2" cx="85%" cy="25%" r="65%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="stadiumGlow3" cx="50%" cy="85%" r="55%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Curb Stripe Pattern (Red & White apex rumble strip) */}
            <pattern
              id="apexCurbPattern"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="12" height="24" fill="#dc2626" fillOpacity="0.75" />
              <rect x="12" width="12" height="24" fill="#ffffff" fillOpacity="0.4" />
            </pattern>
          </defs>

          {/* Glowing Floodlights */}
          <rect width="100%" height="100%" fill="url(#stadiumGlow1)" />
          <rect width="100%" height="100%" fill="url(#stadiumGlow2)" />
          <rect width="100%" height="100%" fill="url(#stadiumGlow3)" />

          {/* Abstract Asphalt Racing Track Ribbon Curves */}
          <path
            d="M -150 720 C 250 680, 480 880, 850 560 C 1150 320, 1260 210, 1600 140"
            fill="none"
            stroke="url(#trackRibbonGrad)"
            strokeWidth="90"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M -150 720 C 250 680, 480 880, 850 560 C 1150 320, 1260 210, 1600 140"
            fill="none"
            stroke="#070a0f"
            strokeWidth="70"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Dashed Center Racing Line */}
          <path
            d="M -150 720 C 250 680, 480 880, 850 560 C 1150 320, 1260 210, 1600 140"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeDasharray="16 18"
            opacity="0.75"
          />
          {/* Apex Rumble Strip Curbs along track boundary */}
          <path
            d="M -150 670 C 250 630, 480 830, 850 510 C 1150 270, 1260 160, 1600 90"
            fill="none"
            stroke="url(#apexCurbPattern)"
            strokeWidth="14"
            opacity="0.55"
          />

          {/* Grandstand / Telemetry Grid Lines */}
          <g stroke="#64748b" strokeWidth="1" strokeDasharray="6 8" opacity="0.18">
            <line x1="80" y1="120" x2="520" y2="120" />
            <line x1="80" y1="145" x2="490" y2="145" />
            <line x1="80" y1="170" x2="460" y2="170" />
            <line x1="80" y1="195" x2="430" y2="195" />
            <line x1="920" y1="730" x2="1380" y2="730" />
            <line x1="950" y1="755" x2="1380" y2="755" />
            <line x1="980" y1="780" x2="1380" y2="780" />
            <line x1="1010" y1="805" x2="1380" y2="805" />
          </g>
        </svg>
      </div>

      {/* Dark Semi-Transparent High-Contrast Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090d14]/85 via-[#090d14]/92 to-[#06080e]/98 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 2. CARD HEADER: "STANDINGS" TITLE & CHAMPIONSHIP TELEMETRY                */}
      {/* ========================================================================= */}
      <div className="relative z-10 px-6 sm:px-8 pt-7 pb-5 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-1.5 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400">
              <Trophy className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-red-400">
              WORLD CHAMPIONSHIP
            </span>
            <span className="text-slate-600 font-mono">/</span>
            <span className="text-xs font-mono text-slate-400">
              {racesCompleted === 0
                ? 'SEASON OPENER • 0 RACES COMPLETED'
                : `ROUND ${teamState.currentRound} • ${racesCompleted} OF ${teamState.totalRaces} RACES`}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-racing uppercase tracking-wider text-white flex items-center gap-3">
            <span>STANDINGS</span>
          </h2>
        </div>

        {/* Quick status badge & calendar action */}
        <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
          {onOpenCalendar && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCalendar();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#172235] hover:bg-[#1f2e48] border border-blue-500/40 text-blue-300 hover:text-white font-racing text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>CALENDAR</span>
            </button>
          )}

          <div className="bg-[#121926]/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-inner flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 font-semibold uppercase tracking-wider">
              OFFICIAL CLASSIFICATION
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.5. PROMINENT "YOUR STANDINGS SPOTLIGHT" (WHERE YOU ARE RANKED)          */}
      {/* ========================================================================= */}
      {(() => {
        const playerTeamIndex = constructorStandings.findIndex((t) => t.isPlayerTeam);
        const playerTeamPos = playerTeamIndex >= 0 ? playerTeamIndex + 1 : 1;
        const playerTeamData = constructorStandings[playerTeamIndex] || {
          points: 0,
          wins: 0,
          podiums: 0,
        };
        const p1Team = constructorStandings[0];
        const constructorGap =
          playerTeamPos === 1 ? 0 : (p1Team ? p1Team.points - playerTeamData.points : 0);

        const d1Index = driverStandings.findIndex((d) => d.driverName === teamState.driver1.name);
        const d1Pos = d1Index >= 0 ? d1Index + 1 : 1;
        const d1Data = driverStandings[d1Index] || { points: 0, wins: 0, podiums: 0 };

        const d2Index = driverStandings.findIndex((d) => d.driverName === teamState.driver2.name);
        const d2Pos = d2Index >= 0 ? d2Index + 1 : 2;
        const d2Data = driverStandings[d2Index] || { points: 0, wins: 0, podiums: 0 };

        return (
          <div className="relative z-10 px-5 sm:px-7 pt-5">
            <div className="bg-gradient-to-r from-[#1c121d] via-[#151928] to-[#0e1420] border-2 border-amber-500/50 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </span>
                  <span className="text-xs sm:text-sm font-racing font-black text-amber-400 uppercase tracking-wider">
                    YOUR TEAM CHAMPIONSHIP POSITION • อันดับทีมของคุณในตารางคะแนน
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  LIVE POINTS TABLE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1. CONSTRUCTORS POSITION */}
                <div className="bg-[#0b0f17]/90 border border-amber-500/40 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/50">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">RANK</span>
                      <span className="text-2xl font-black font-racing text-amber-300">
                        P{playerTeamPos}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-amber-400/90 font-bold uppercase block">
                        CONSTRUCTORS
                      </span>
                      <h4 className="text-sm sm:text-base font-black font-racing uppercase tracking-wide text-white truncate">
                        {teamState.teamName}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {playerTeamPos === 1 ? (
                          <strong className="text-emerald-400">🏆 Championship Leader</strong>
                        ) : (
                          <span>Gap to P1: -{constructorGap} pts</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-racing text-amber-300 block">
                      {playerTeamData.points}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">POINTS</span>
                  </div>
                </div>

                {/* 2. DRIVER 1 POSITION */}
                <div className="bg-[#0b0f17]/90 border border-red-500/40 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-900/40 border border-red-500/50">
                      <span className="text-[10px] font-mono text-red-400 uppercase font-bold">DRIVER 1</span>
                      <span className="text-2xl font-black font-racing text-red-200">
                        P{d1Pos}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span>{renderFlag(teamState.driver1.nationality.flag, 'sm')}</span>
                        <h4 className="text-sm sm:text-base font-black font-racing uppercase tracking-wide text-white truncate">
                          {teamState.driver1.name}
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Wins: {d1Data.wins} • Podiums: {d1Data.podiums}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-racing text-red-300 block">
                      {d1Data.points}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">POINTS</span>
                  </div>
                </div>

                {/* 3. DRIVER 2 POSITION */}
                <div className="bg-[#0b0f17]/90 border border-blue-500/40 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-900/40 border border-blue-500/50">
                      <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">DRIVER 2</span>
                      <span className="text-2xl font-black font-racing text-blue-200">
                        P{d2Pos}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span>{renderFlag(teamState.driver2.nationality.flag, 'sm')}</span>
                        <h4 className="text-sm sm:text-base font-black font-racing uppercase tracking-wide text-white truncate">
                          {teamState.driver2.name}
                        </h4>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Wins: {d2Data.wins} • Podiums: {d2Data.podiums}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black font-racing text-blue-300 block">
                      {d2Data.points}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">POINTS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN LAYOUT: CONSTRUCTORS (LEFT) & DRIVERS (RIGHT)               */}
      {/* ========================================================================= */}
      <div className="relative z-10 p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* ======================================================================= */}
        {/* COLUMN 1: CONSTRUCTORS (ALL 10 TEAMS WITH STICKY HEADER & SCROLL)       */}
        {/* ======================================================================= */}
        <div className="bg-[#0b0f17]/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md flex flex-col">
          {/* Sticky Column Header */}
          <div className="sticky top-0 z-20 bg-[#0d121c]/95 backdrop-blur-md px-4 sm:px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <h3 className="text-lg sm:text-xl font-bold font-racing uppercase tracking-wide text-white">
                CONSTRUCTORS
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                10 TEAMS
              </span>
            </div>
          </div>

          {/* Scrollable Constructors List with Matching Height */}
          <div
            ref={constructorsContainerRef}
            className="p-3 sm:p-4 overflow-y-auto space-y-2 h-[410px] sm:h-[430px] racing-scrollbar"
          >
            {constructorStandings.map((cTeam, idx) => {
              const pos = idx + 1;
              const isPlayer = cTeam.isPlayerTeam;
              const primaryColor =
                cTeam.primaryColor || (isPlayer ? teamState.primaryColor : '#DC2626') || '#DC2626';

              return (
                <div
                  key={cTeam.teamName}
                  ref={isPlayer ? playerTeamRowRef : undefined}
                  className={`relative rounded-xl overflow-hidden flex items-center justify-between gap-3 p-2.5 sm:p-3 transition duration-150 border ${
                    isPlayer
                      ? 'bg-gradient-to-r from-red-950/70 via-red-900/40 to-[#0e1420] border-red-500/70 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40'
                      : 'bg-[#111723]/90 hover:bg-[#161e2d] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Left Colored Team Bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l"
                    style={{ backgroundColor: primaryColor }}
                  />

                  {/* Left Details: Pos, Logo, Name & Subtitle */}
                  <div className="flex items-center gap-2.5 sm:gap-3 pl-2 min-w-0 flex-1">
                    {/* Position Tag */}
                    <span
                      className={`w-6 sm:w-7 font-black font-mono text-xs sm:text-sm text-center shrink-0 ${
                        pos === 1
                          ? 'text-amber-400 font-black'
                          : pos === 2
                          ? 'text-slate-200'
                          : pos === 3
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      P{pos}
                    </span>

                    {/* Team Logo */}
                    <div className="shrink-0">
                      <TeamLogo
                        teamName={cTeam.teamName}
                        shape={cTeam.logoShape}
                        primaryColor={primaryColor}
                        secondaryColor={cTeam.secondaryColor || '#15151E'}
                        size="sm"
                      />
                    </div>

                    {/* Team Name & Record Subtitle */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-racing font-bold text-sm sm:text-base tracking-wide truncate ${
                            isPlayer ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {cTeam.teamName}
                        </span>
                        {isPlayer && (
                          <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-600/50 text-red-200 border border-red-500/60 shadow-xs">
                            YOU
                          </span>
                        )}
                      </div>

                      {/* Wins & Podiums Subtitle */}
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span>Wins {cTeam.wins}</span>
                        <span className="text-slate-600" aria-hidden="true">•</span>
                        <span>Podiums {cTeam.podiums}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Points */}
                  <div className="text-right shrink-0 pr-1">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-xl sm:text-2xl font-black font-racing text-amber-300 tracking-tight">
                        {cTeam.points}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-400/80">
                        PTS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column Bottom Status Strip */}
          <div className="px-4 py-2 bg-[#090d14] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Scrollable Grid</span>
            <span className="text-slate-400">10 of 10 Teams Listed</span>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* COLUMN 2: DRIVERS (ALL 20 DRIVERS WITH STICKY HEADER & SCROLL)          */}
        {/* ======================================================================= */}
        <div className="bg-[#0b0f17]/90 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md flex flex-col">
          {/* Sticky Column Header */}
          <div className="sticky top-0 z-20 bg-[#0d121c]/95 backdrop-blur-md px-4 sm:px-5 py-3.5 border-b border-slate-800/90 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-lg sm:text-xl font-bold font-racing uppercase tracking-wide text-white">
                DRIVERS
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                20 DRIVERS
              </span>
            </div>
          </div>

          {/* Scrollable Drivers List with Matching Height */}
          <div
            ref={driversContainerRef}
            className="p-3 sm:p-4 overflow-y-auto space-y-2 h-[410px] sm:h-[430px] racing-scrollbar"
          >
            {driverStandings.map((driver, idx) => {
              const pos = idx + 1;
              const isPlayer = driver.isPlayerTeam;
              const teamColor =
                driver.teamColor || (isPlayer ? teamState.primaryColor : '#DC2626') || '#DC2626';

              let driverRef: React.RefObject<HTMLDivElement | null> | undefined;
              if (isPlayer && !hasAssignedPlayerDriverRef) {
                hasAssignedPlayerDriverRef = true;
                driverRef = playerDriverRowRef;
              }

              return (
                <div
                  key={driver.driverId}
                  ref={driverRef}
                  className={`relative rounded-xl overflow-hidden flex items-center justify-between gap-3 p-2.5 sm:p-3 transition duration-150 border ${
                    isPlayer
                      ? 'bg-gradient-to-r from-red-950/70 via-red-900/40 to-[#0e1420] border-red-500/70 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40'
                      : 'bg-[#111723]/90 hover:bg-[#161e2d] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Left Colored Driver Team Bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l"
                    style={{ backgroundColor: teamColor }}
                  />

                  {/* Left Details: Pos, Avatar, Flag, Name, Team Subtitle */}
                  <div className="flex items-center gap-2.5 sm:gap-3 pl-2 min-w-0 flex-1">
                    {/* Position Tag */}
                    <span
                      className={`w-6 sm:w-7 font-black font-mono text-xs sm:text-sm text-center shrink-0 ${
                        pos === 1
                          ? 'text-amber-400 font-black'
                          : pos === 2
                          ? 'text-slate-200'
                          : pos === 3
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      P{pos}
                    </span>

                    {/* Driver Avatar */}
                    <div className="shrink-0">
                      <PersonAvatar
                        seed={driver.avatarSeed || driver.driverName}
                        role="driver"
                        size="xs"
                      />
                    </div>

                    {/* Driver Name & Team Subtitle */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm shrink-0">
                          {renderFlag(driver.flag, 'sm')}
                        </span>
                        <span
                          className={`font-racing font-bold text-sm sm:text-base tracking-wide truncate ${
                            isPlayer ? 'text-white' : 'text-slate-200'
                          }`}
                        >
                          {driver.driverName}
                        </span>
                        {isPlayer && (
                          <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-red-600/50 text-red-200 border border-red-500/60 shadow-xs">
                            YOU
                          </span>
                        )}
                      </div>

                      {/* Team Name Subtitle */}
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {driver.teamName}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Points */}
                  <div className="text-right shrink-0 pr-1">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-xl sm:text-2xl font-black font-racing text-emerald-400 tracking-tight">
                        {driver.points}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-500/80">
                        PTS
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column Bottom Status Strip */}
          <div className="px-4 py-2 bg-[#090d14] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Scrollable Grid</span>
            <span className="text-slate-400">20 of 20 Drivers Listed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
