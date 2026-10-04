import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Zap,
  Trophy,
  Sun,
  CloudRain,
  Cloud,
  ChevronRight,
  MapPin,
  Flag,
  Globe,
  Compass,
  Filter,
  Layers,
} from 'lucide-react';
import { TeamState, GrandPrix, ContinentName } from '../types/game';
import { INITIAL_GRAND_PRIX } from '../data/initialData';
import { renderFlag } from './CountryFlag';
import { formatMoney } from '../utils/calculations';
import { sound } from '../utils/audio';
import { CONTINENT_LANDMASSES, getCalibratedCircuitSvgPosition } from '../data/worldMapData';
import { TrackLayoutPreview } from './TrackLayoutPreview';
import { getWorldTourCircuit } from '../data/worldTourCircuits';
import { CityGraphicBackdrop } from './CityGraphicBackdrop';

interface ChampionshipCalendarProps {
  teamState: TeamState;
  circuits?: GrandPrix[];
  onSelectRace?: (round: number) => void;
  className?: string;
}

export const ChampionshipCalendar: React.FC<ChampionshipCalendarProps> = ({
  teamState,
  circuits = INITIAL_GRAND_PRIX,
  onSelectRace,
  className = '',
}) => {
  const nextRaceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active selected circuit for map popup/focus
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [hoveredRound, setHoveredRound] = useState<number | null>(null);

  // Continent / Status filter
  const [selectedContinent, setSelectedContinent] = useState<ContinentName | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Upcoming'>('All');

  const activeSeason =
    teamState.seasonRecords?.find(
      (r) => r.seasonNumber === (teamState.currentSeasonNumber || 1) && !r.isCompleted
    ) ||
    teamState.seasonRecords?.find((r) => r.status === 'in-progress') ||
    teamState.seasonRecords?.[0];

  const raceLogs = activeSeason?.raceLogs || [];
  const currentRound = teamState.currentRound;

  // Auto-scroll to current/next round on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nextRaceRef.current && containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const rRect = nextRaceRef.current.getBoundingClientRect();
        if (rRect.bottom > cRect.bottom || rRect.top < cRect.top) {
          nextRaceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [currentRound]);

  const completedCount = circuits.filter((c) =>
    raceLogs.some((l) => l.round === c.round)
  ).length;

  // Helper to extract winner details for a round
  const getRoundResult = (roundNumber: number) => {
    const log = raceLogs.find((l) => l.round === roundNumber);
    if (!log) return null;

    let winnerName = log.winnerName || '';
    let winnerFlag = log.winnerFlag || '';
    if (!winnerName && log.fullGridResults && log.fullGridResults.length > 0) {
      const p1 = log.fullGridResults.find((d) => d.position === 1);
      if (p1) {
        winnerName = p1.driverName;
        winnerFlag = p1.flag;
      }
    }
    if (!winnerName) {
      if (log.seat1Position === 1) {
        winnerName = log.seat1DriverName;
        winnerFlag = log.seat1DriverFlag;
      } else if (log.seat2Position === 1) {
        winnerName = log.seat2DriverName;
        winnerFlag = log.seat2DriverFlag;
      } else {
        winnerName = 'Min Werstappen';
        winnerFlag = '🇳🇱';
      }
    }

    return {
      winnerName,
      winnerFlag,
      seat1Pos: log.seat1Position,
      seat2Pos: log.seat2Position,
      seat1Name: log.seat1DriverName,
      seat2Name: log.seat2DriverName,
      prizeMoneyWon: log.prizeMoneyWon,
    };
  };

  // Filtered circuits for list view
  const filteredCircuits = circuits.filter((circuit) => {
    const isCompleted = raceLogs.some((l) => l.round === circuit.round);

    if (statusFilter === 'Completed' && !isCompleted) return false;
    if (statusFilter === 'Upcoming' && isCompleted) return false;
    if (selectedContinent !== 'All' && circuit.continent !== selectedContinent) return false;

    return true;
  });

  const activeFocusCircuit = circuits.find(
    (c) => c.round === (hoveredRound || selectedRound || currentRound)
  );
  const activeFocusResult = activeFocusCircuit ? getRoundResult(activeFocusCircuit.round) : null;

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#090d14]/75 backdrop-blur-md ${className}`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 p-5 sm:p-7 space-y-6">
        {/* ===================================================================== */}
        {/* 1. CALENDAR HEADER & SEASON STATUS                                    */}
        {/* ===================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
              <Calendar className="w-4 h-4 text-red-400" />
              <span>OFFICIAL FIA GRAND PRIX CALENDAR</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-racing text-white tracking-wide uppercase mt-1">
              SEASON CALENDAR
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
              18 Authentic Grand Prix Circuits • Fixed World Tour Championship • Season {teamState.currentSeasonNumber || 1}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="bg-[#111723]/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">COMPLETED</span>
              <span className="text-base sm:text-lg font-mono font-black text-emerald-400">
                {completedCount} / {circuits.length}
              </span>
            </div>

            <div className="bg-[#111723]/90 border border-red-500/40 px-3.5 py-2 rounded-xl text-center shadow-md shadow-red-950/30">
              <span className="text-[10px] font-mono text-red-400 uppercase block">NEXT GRAND PRIX</span>
              <span className="text-base sm:text-lg font-mono font-black text-white">
                Round {Math.min(currentRound, circuits.length)}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. INTERACTIVE WORLD MAP (SVG) WITH 18 SEASON PINS                    */}
        {/* ===================================================================== */}
        <div className="bg-[#0b0f17] border border-slate-800/90 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xl">
          {/* Map Title Bar & Continent Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="font-racing font-bold text-sm sm:text-base uppercase tracking-wider text-slate-200">
                GLOBAL RACE MAP
              </span>
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                • Tap any circuit pin for details
              </span>
            </div>

            {/* Continent Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
              {(['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'] as const).map(
                (cont) => (
                  <button
                    key={cont}
                    onClick={() => {
                      sound.playClick();
                      setSelectedContinent(cont);
                    }}
                    className={`px-2.5 py-1 rounded-lg uppercase transition cursor-pointer font-bold ${
                      selectedContinent === cont
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-[#141b26] hover:bg-[#1a2332] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cont}
                  </button>
                )
              )}
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[2/1] max-h-[380px] bg-[#070b12] rounded-xl overflow-hidden border border-slate-800/80">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full object-cover select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="worldGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#121927" strokeWidth="0.5" opacity="0.8" />
                </pattern>

                {/* Continental Dimensional Fill Gradients */}
                <linearGradient id="continentFill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#152030" />
                  <stop offset="100%" stopColor="#0c1320" />
                </linearGradient>

                <linearGradient id="continentFillActive" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1b283d" />
                  <stop offset="100%" stopColor="#101827" />
                </linearGradient>

                {/* Next Race Glow Filter */}
                <filter id="nextPinGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Deep Oceanic Background */}
              <rect width="1000" height="500" fill="#060910" />
              <rect width="1000" height="500" fill="url(#worldGrid)" />

              {/* Subtle Latitude & Longitude Coordinate Lines (Equator, Prime Meridian, Tropics) */}
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#182538" strokeDasharray="3 4" strokeWidth="0.6" opacity="0.6" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="#182538" strokeDasharray="3 4" strokeWidth="0.6" opacity="0.6" />
              <line x1="0" y1="185" x2="1000" y2="185" stroke="#101927" strokeDasharray="2 5" strokeWidth="0.5" opacity="0.5" />
              <line x1="0" y1="315" x2="1000" y2="315" stroke="#101927" strokeDasharray="2 5" strokeWidth="0.5" opacity="0.5" />

              {/* Latitude / Longitude Subtle Labels */}
              <text x="12" y="247" fill="#223247" fontSize="7.5" fontFamily="monospace">0° EQUATOR</text>
              <text x="12" y="182" fill="#182435" fontSize="7" fontFamily="monospace">23.5°N TROPIC</text>
              <text x="12" y="312" fill="#182435" fontSize="7" fontFamily="monospace">23.5°S TROPIC</text>
              <text x="504" y="14" fill="#223247" fontSize="7.5" fontFamily="monospace">0° GMT</text>

              {/* =============================================================== */}
              {/* REALISTIC, CURVED CONTINENT LANDMASSES (Tactical F1 Theme)       */}
              {/* =============================================================== */}
              <g className="continents-group transition-colors">
                {CONTINENT_LANDMASSES.map((group) => {
                  const isContinentActive =
                    selectedContinent === 'All' || selectedContinent === group.continent;
                  return (
                    <g
                      key={group.continent}
                      className="transition-all duration-300"
                      opacity={isContinentActive ? 1 : 0.3}
                    >
                      {group.paths.map((p) => (
                        <path
                          key={p.id}
                          d={p.d}
                          fill={isContinentActive ? 'url(#continentFill)' : '#0a0f18'}
                          stroke={isContinentActive ? '#22344b' : '#141d29'}
                          strokeWidth="1.1"
                          className="transition-colors duration-200 hover:fill-[#1b273b] hover:stroke-slate-500"
                        />
                      ))}
                      {/* Continent Watermark Label */}
                      <text
                        x={group.labelX}
                        y={group.labelY}
                        fill={isContinentActive ? '#192536' : '#0e141f'}
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="select-none pointer-events-none transition-colors duration-300 tracking-wider"
                      >
                        {group.name}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* =============================================================== */}
              {/* 18 CIRCUIT PINS PLOTTED BY CALIBRATED REAL LAT / LNG            */}
              {/* =============================================================== */}
              {circuits.map((circuit) => {
                const { x, y } = getCalibratedCircuitSvgPosition(
                  circuit.lat || 0,
                  circuit.lng || 0,
                  circuit.continent,
                  1000,
                  500
                );
                const isCompleted = raceLogs.some((l) => l.round === circuit.round);
                const isNext = circuit.round === currentRound && !isCompleted;
                const isFocused = selectedRound === circuit.round || hoveredRound === circuit.round;
                const isContinentMatch =
                  selectedContinent === 'All' || circuit.continent === selectedContinent;

                const opacity = isContinentMatch ? 1 : 0.25;

                return (
                  <g
                    key={circuit.id || `pin-${circuit.round}`}
                    transform={`translate(${x}, ${y})`}
                    style={{ opacity, cursor: 'pointer' }}
                    onClick={() => {
                      sound.playClick();
                      setSelectedRound(circuit.round === selectedRound ? null : circuit.round);
                    }}
                    onMouseEnter={() => setHoveredRound(circuit.round)}
                    onMouseLeave={() => setHoveredRound(null)}
                  >
                    {/* Animated Pulsing Ring for Next Race */}
                    {isNext && (
                      <>
                        <circle r="16" fill="#ef4444" opacity="0.3" className="animate-ping" />
                        <circle r="22" fill="#f59e0b" opacity="0.15" />
                      </>
                    )}

                    {/* Outer Glow / Halo if Focused */}
                    {isFocused && (
                      <circle
                        r="14"
                        fill="none"
                        stroke={isNext ? '#ef4444' : isCompleted ? '#10b981' : '#f59e0b'}
                        strokeWidth="2.5"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Main Pin Body */}
                    {isNext ? (
                      // Next Race Pin: Red / Amber Diamond / Hex Beacon
                      <g filter="url(#nextPinGlow)">
                        <polygon
                          points="0,-12 10,0 0,12 -10,0"
                          fill="#dc2626"
                          stroke="#fef08a"
                          strokeWidth="2"
                        />
                        <circle r="3" fill="#ffffff" />
                        <text
                          y="-14"
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          R{circuit.round}
                        </text>
                      </g>
                    ) : isCompleted ? (
                      // Completed Race Pin: Emerald Green with Check
                      <g>
                        <circle
                          r="8"
                          fill="#065f46"
                          stroke="#34d399"
                          strokeWidth="1.5"
                        />
                        <text
                          y="3"
                          textAnchor="middle"
                          fill="#a7f3d0"
                          fontSize="7.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          ✓
                        </text>
                      </g>
                    ) : (
                      // Upcoming Race Pin: Slate / Gold Dot
                      <g>
                        <circle
                          r="6.5"
                          fill="#1e293b"
                          stroke="#94a3b8"
                          strokeWidth="1.2"
                        />
                        <text
                          y="2.5"
                          textAnchor="middle"
                          fill="#cbd5e1"
                          fontSize="6.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {circuit.round}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Quick Detail Card when Pin Hovered or Selected */}
            {activeFocusCircuit && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-[#0a0f18]/95 backdrop-blur-md border border-slate-700/80 p-3 sm:p-3.5 rounded-2xl shadow-2xl z-30 space-y-2.5 pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      ROUND {activeFocusCircuit.round} OF {circuits.length}
                    </span>
                    <span className="text-xs">{renderFlag(activeFocusCircuit.country || activeFocusCircuit.flag, 'sm')}</span>
                  </div>

                  {raceLogs.some((l) => l.round === activeFocusCircuit.round) ? (
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                      DONE
                    </span>
                  ) : activeFocusCircuit.round === currentRound ? (
                    <span className="text-[10px] font-mono font-bold uppercase text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/60 animate-pulse">
                      NEXT RACE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                      UPCOMING
                    </span>
                  )}
                </div>

                {/* 2-Column: Track Layout Vector on Left + Circuit Details on Right */}
                <div className="flex items-center gap-3 bg-[#060a12]/80 p-2 rounded-xl border border-slate-800/80">
                  {/* Left: Track Layout Silhouette */}
                  <div className="w-24 sm:w-28 h-18 sm:h-20 bg-[#090e18] border border-slate-700/70 rounded-lg p-1 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <TrackLayoutPreview
                      circuitId={activeFocusCircuit.id}
                      circuitName={activeFocusCircuit.name}
                      path={activeFocusCircuit.trackLayoutPath}
                      width={100}
                      height={60}
                      showStartFinish={true}
                      showDirectionArrow={true}
                    />
                    <div className="absolute bottom-1 right-1 text-[7.5px] font-mono font-bold text-slate-400 bg-slate-950/90 px-1 rounded border border-slate-800 uppercase">
                      {activeFocusCircuit.corners ? `${activeFocusCircuit.corners}T` : 'CIRCUIT'}
                    </div>
                  </div>

                  {/* Right: Circuit Names & Specs */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm sm:text-base font-bold font-racing text-white tracking-wide truncate">
                      {activeFocusCircuit.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono truncate">
                      {activeFocusCircuit.city}, {activeFocusCircuit.country}
                    </p>

                    {/* Real-World Environment Design & Atmosphere */}
                    {(() => {
                      const tourDef = getWorldTourCircuit(activeFocusCircuit.round, activeFocusCircuit.id);
                      return (
                        <div className="pt-0.5">
                          <span className="text-[10px] text-amber-300 font-mono font-bold block truncate">
                            📍 {tourDef.environmentName}
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-mono italic block line-clamp-1">
                            "{tourDef.environmentDescription}"
                          </span>
                        </div>
                      );
                    })()}

                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-400 flex-wrap">
                      <span className="text-amber-400/90 font-medium">
                        {activeFocusCircuit.circuitType || 'Race Circuit'}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>{activeFocusCircuit.lapLengthKm} km</span>
                      <span className="text-slate-600">•</span>
                      <span>{activeFocusCircuit.totalLaps} Laps</span>
                    </div>
                  </div>
                </div>

                {activeFocusResult && (
                  <div className="text-xs font-mono pt-1 border-t border-slate-800 flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Winner: {activeFocusResult.winnerName}</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      P{activeFocusResult.seat1Pos} & P{activeFocusResult.seat2Pos}
                    </span>
                  </div>
                )}

                {activeFocusCircuit.round === currentRound && onSelectRace && (
                  <button
                    onClick={() => {
                      sound.playClick();
                      onSelectRace(activeFocusCircuit.round);
                    }}
                    className="w-full mt-1 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-racing font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>RACE NOW →</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Completed Grand Prix</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-500 inline-block transform rotate-45 ring-1 ring-yellow-400"></span>
                <span className="text-amber-300 font-bold">Current Next Race</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span>
                <span>Scheduled / Upcoming</span>
              </span>
            </div>

            <span className="text-[11px] text-slate-500 font-mono">
              Authentic 18-Round World Tour • Consistent Across All Save Files
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. CALENDAR LIST VIEW (18 ROUNDS IN SCHEDULE ORDER)                   */}
        {/* ===================================================================== */}
        <div className="space-y-3">
          {/* List Header & Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-400" />
              <h3 className="font-racing font-bold text-base sm:text-lg text-white uppercase tracking-wide">
                ROUND SCHEDULE (1 TO 18)
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              {(['All', 'Completed', 'Upcoming'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    sound.playClick();
                    setStatusFilter(filter);
                  }}
                  className={`px-3 py-1 rounded-lg uppercase transition cursor-pointer font-bold ${
                    statusFilter === filter
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-[#121722] hover:bg-[#18202d] text-slate-400 border border-slate-800'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Container with Custom Racing Scrollbar */}
          <div
            ref={containerRef}
            className="max-h-[520px] sm:max-h-[580px] overflow-y-auto space-y-3 pr-1 sm:pr-2 racing-scrollbar"
          >
            {filteredCircuits.map((circuit) => {
              const isCompleted = raceLogs.some((l) => l.round === circuit.round);
              const isNext = circuit.round === currentRound && !isCompleted;
              const result = isCompleted ? getRoundResult(circuit.round) : null;
              const isHighlighted = selectedRound === circuit.round;

              return (
                <div
                  key={circuit.id || `gp-${circuit.round}`}
                  ref={isNext ? nextRaceRef : undefined}
                  onClick={() => {
                    setSelectedRound(circuit.round);
                  }}
                  className={`relative rounded-2xl p-3.5 sm:p-4.5 transition duration-200 border flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                    isNext
                      ? 'bg-gradient-to-r from-red-950/80 via-[#181d2a] to-[#121622] border-red-500/80 shadow-xl shadow-red-950/40 ring-1 ring-red-500/50'
                      : isHighlighted
                      ? 'bg-[#151c28] border-amber-500/60 shadow-lg'
                      : isCompleted
                      ? 'bg-[#0e141f]/90 hover:bg-[#131a27] border-slate-800/90'
                      : 'bg-[#0d121b]/60 hover:bg-[#111723]/90 border-slate-800/60 opacity-90'
                  }`}
                >
                  {/* Left Glow Indicator Bar for Next */}
                  {isNext && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l bg-gradient-to-b from-red-500 via-amber-400 to-red-600 z-10" />
                  )}

                  {/* Subtle City Landmark Graphic Background */}
                  <CityGraphicBackdrop round={circuit.round} />

                  {/* Left Section: Round Badge + Flag + Details */}
                  <div className="relative z-10 flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                    {/* Round Badge Box */}
                    <div
                      className={`w-14 sm:w-16 py-2 px-1 rounded-xl text-center shrink-0 border ${
                        isNext
                          ? 'bg-red-600/30 border-red-500/60 text-white'
                          : isCompleted
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                          : 'bg-[#121722] border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase block text-slate-400 font-bold leading-tight">
                        ROUND
                      </span>
                      <span
                        className={`text-lg sm:text-xl font-racing font-black tracking-tight leading-none ${
                          isNext ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {circuit.round}
                      </span>
                    </div>

                    {/* F1 Broadcast-style Track Layout Vector */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-22 sm:w-26 h-16 bg-[#080d16] border border-slate-800/80 rounded-xl p-1 shrink-0 relative overflow-hidden group-hover:border-slate-700/80 transition">
                      <TrackLayoutPreview
                        circuitId={circuit.id}
                        circuitName={circuit.name}
                        path={circuit.trackLayoutPath}
                        width={88}
                        height={52}
                        showStartFinish={true}
                        showDirectionArrow={true}
                      />
                    </div>

                    {/* Circuit Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base sm:text-lg shrink-0">
                          {renderFlag(circuit.country || circuit.flag, 'sm')}
                        </span>
                        <h4
                          className={`text-base sm:text-lg font-racing font-bold tracking-wide truncate ${
                            isNext ? 'text-white' : 'text-slate-100'
                          }`}
                        >
                          {circuit.name}
                        </h4>

                        {/* Circuit Type Pill */}
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400/90 border border-slate-700/80">
                          {circuit.circuitType || 'Race Circuit'}
                        </span>

                        {isNext && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-600/40 text-red-200 border border-red-500/60 animate-pulse">
                            <Zap className="w-3 h-3 text-amber-300" />
                            <span>NEXT RACE</span>
                          </span>
                        )}
                      </div>

                      {/* City, Country, Continent, Track Specs */}
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-200">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{circuit.city ? `${circuit.city}, ${circuit.country}` : circuit.country}</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{circuit.continent || 'Europe'}</span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1">
                          {circuit.weather === 'Dry' ? (
                            <Sun className="w-3 h-3 text-amber-400" />
                          ) : circuit.weather === 'Wet' ? (
                            <CloudRain className="w-3 h-3 text-blue-400" />
                          ) : (
                            <Cloud className="w-3 h-3 text-slate-400" />
                          )}
                          <span>{circuit.weather}</span>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>{circuit.totalLaps} Laps ({circuit.lapLengthKm} km)</span>
                        {circuit.corners && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span>{circuit.corners} Corners</span>
                          </>
                        )}
                      </div>

                      {/* Real-World Environment Design & Atmosphere */}
                      {(() => {
                        const tourDef = getWorldTourCircuit(circuit.round, circuit.id);
                        return (
                          <div className="flex items-center gap-1.5 text-xs text-amber-300/90 font-mono pt-0.5">
                            <span className="font-bold">📍 {tourDef.environmentName}</span>
                            <span className="text-slate-600 hidden sm:inline">•</span>
                            <span className="text-slate-400 text-[11px] italic hidden sm:inline truncate">
                              "{tourDef.environmentDescription}"
                            </span>
                          </div>
                        );
                      })()}

                      {/* Winner Line for Finished Races */}
                      {isCompleted && result && result.winnerName && (
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-0.5 flex-wrap">
                          <span className="flex items-center gap-1.5 font-bold">
                            <span>Winner:</span>
                            {result.winnerFlag && renderFlag(result.winnerFlag, 'sm')}
                            <span className="text-emerald-300">{result.winnerName}</span>
                            <Trophy className="w-3 h-3 text-amber-400" />
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 text-[11px]">
                            Team: P{result.seat1Pos} & P{result.seat2Pos} (+{formatMoney(result.prizeMoneyWon)})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Section: Prize & Status Badge / Action Button */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                    <div className="hidden lg:block text-right pr-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">1ST PRIZE</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {formatMoney(circuit.firstPlacePrize || 18_000_000)}
                      </span>
                    </div>

                    {isCompleted ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 font-mono text-xs font-bold shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>DONE</span>
                      </div>
                    ) : isNext ? (
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold shadow-xs">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>NEXT</span>
                        </div>

                        {onSelectRace && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sound.playClick();
                              onSelectRace(circuit.round);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-racing font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950 flex items-center gap-1.5 cursor-pointer transition"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>RACE →</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 font-mono text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>UPCOMING</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Footer Status Strip */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span>Official 18-Round World Tour Calendar • Consistent Across All Careers</span>
          </div>

          {onSelectRace && currentRound <= circuits.length && (
            <button
              onClick={() => {
                sound.playClick();
                onSelectRace(currentRound);
              }}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>ENTER NEXT GRAND PRIX (ROUND {currentRound})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
