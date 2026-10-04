import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Flag,
  Sun,
  CloudRain,
  Trophy,
  DollarSign,
  Compass,
  Navigation,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GrandPrix, ContinentName } from '../types/game';
import { CONTINENT_LANDMASSES, getCalibratedCircuitSvgPosition } from '../data/worldMapData';
import { renderFlag } from './CountryFlag';
import { formatMoney } from '../utils/calculations';
import { sound } from '../utils/audio';
import { getWorldTourCircuit } from '../data/worldTourCircuits';

interface SeasonRouteWorldMapProps {
  circuits: GrandPrix[];
  currentRound: number;
  completedRoundNumbers: number[];
  onSelectCircuit?: (circuit: GrandPrix) => void;
  className?: string;
}

export const SeasonRouteWorldMap: React.FC<SeasonRouteWorldMapProps> = ({
  circuits,
  currentRound,
  completedRoundNumbers,
  onSelectCircuit,
  className = '',
}) => {
  const [selectedContinent, setSelectedContinent] = useState<ContinentName | 'All'>('All');
  const [activePinRound, setActivePinRound] = useState<number | null>(currentRound);
  const [hoveredRound, setHoveredRound] = useState<number | null>(null);
  const [isEuropeZoomed, setIsEuropeZoomed] = useState<boolean>(false);

  // Active Next Race Grand Prix
  const currentCircuit = circuits.find((c) => c.round === currentRound) || circuits[0];
  const focusedCircuit =
    circuits.find((c) => c.round === (hoveredRound || activePinRound || currentRound)) ||
    currentCircuit;

  // Previous circuit (where the team traveled from)
  const prevRoundNumber = currentRound > 1 ? currentRound - 1 : circuits.length;
  const prevCircuit = circuits.find((c) => c.round === prevRoundNumber) || circuits[0];

  // Coordinates for all circuits (1 to 18) with calibrated European de-clustering
  const circuitCoords = circuits.map((c) => ({
    round: c.round,
    circuit: c,
    pos: getCalibratedCircuitSvgPosition(
      c.lat || 0,
      c.lng || 0,
      c.continent,
      1000,
      500,
      c.id,
      c.name,
      c.round
    ),
    isCompleted: completedRoundNumbers.includes(c.round),
    isNext: c.round === currentRound,
  }));

  // Dynamic SVG ViewBox: allows instant wide focus on Europe
  const isEuropeFocused = selectedContinent === 'Europe' || isEuropeZoomed;
  const activeViewBox = isEuropeFocused ? '420 40 210 145' : '0 0 1000 500';

  // Find previous and next circuit positions for the directional arrow
  const prevPos = circuitCoords.find((c) => c.round === prevRoundNumber)?.pos || { x: 150, y: 200 };
  const nextPos = circuitCoords.find((c) => c.round === currentRound)?.pos || { x: 500, y: 150 };

  // Calculate curved flight route for the active leg
  const dx = nextPos.x - prevPos.x;
  const dy = nextPos.y - prevPos.y;
  const dist = Math.hypot(dx, dy);
  const midX = (prevPos.x + nextPos.x) / 2;
  // Arc curve upwards
  const arcHeight = Math.min(80, Math.max(30, dist * 0.25));
  const midY = (prevPos.y + nextPos.y) / 2 - arcHeight;
  const activeLegPathD = `M ${prevPos.x} ${prevPos.y} Q ${midX} ${midY} ${nextPos.x} ${nextPos.y}`;

  // Points along the curve for chevrons (t = 0.35, 0.65)
  const getQuadraticPoint = (t: number) => {
    const x = (1 - t) * (1 - t) * prevPos.x + 2 * (1 - t) * t * midX + t * t * nextPos.x;
    const y = (1 - t) * (1 - t) * prevPos.y + 2 * (1 - t) * t * midY + t * t * nextPos.y;
    return { x, y };
  };
  const chevronPoint1 = getQuadraticPoint(0.35);
  const chevronPoint2 = getQuadraticPoint(0.68);

  // Helper for drawing elegant curved geodesic flight arcs between circuits
  const getLegArcD = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const midX = (p1.x + p2.x) / 2;
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const arcHeight = Math.min(55, Math.max(14, dist * 0.16));
    const midY = (p1.y + p2.y) / 2 - arcHeight;
    return `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-slate-800 bg-[#090d15] shadow-2xl ${className}`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 p-5 sm:p-6 space-y-4">
        {/* ===================================================================== */}
        {/* HEADER & DIRECTIONAL FLIGHT BANNER                                    */}
        {/* ===================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
              <Compass className="w-4 h-4 text-red-500 animate-spin-slow" />
              <span>CHAMPIONSHIP WORLD TOUR ROUTE</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-racing text-white tracking-wide uppercase mt-0.5 flex items-center gap-2">
              <span>CALENDAR FLIGHT PATH</span>
              <span className="text-xs bg-red-950/80 text-red-300 border border-red-500/40 px-2.5 py-0.5 rounded font-mono font-bold">
                ROUND {currentRound} OF {circuits.length}
              </span>
            </h3>
          </div>

          {/* Directional Route Banner: From Previous -> NEXT DESTINATION */}
          <div className="bg-[#111723] border border-red-500/40 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg shadow-red-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">FROM:</span>
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1 font-mono">
                {renderFlag(prevCircuit.country || prevCircuit.flag, 'sm')}
                {prevCircuit.name}
              </span>
            </div>

            {/* Glowing Arrow Indicator */}
            <div className="flex items-center text-red-400 animate-pulse font-mono font-black text-sm">
              ➔ ➔ ➔
            </div>

            <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/50 px-3 py-1 rounded-xl">
              <Navigation className="w-3.5 h-3.5 text-red-400 rotate-45" />
              <span className="text-xs text-red-300 font-mono font-bold">NEXT DESTINATION:</span>
              <span className="text-xs font-black text-white flex items-center gap-1 font-racing uppercase tracking-wider">
                {renderFlag(currentCircuit.country || currentCircuit.flag, 'sm')}
                {currentCircuit.name}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* CONTINENT FILTER BAR                                                  */}
        {/* ===================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              REGION:
            </span>
            {(['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'] as const).map(
              (cont) => (
                <button
                  key={cont}
                  onClick={() => {
                    sound.playClick();
                    setSelectedContinent(cont);
                    if (cont === 'Europe') {
                      setIsEuropeZoomed(true);
                    } else if (cont !== 'All') {
                      setIsEuropeZoomed(false);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg uppercase transition cursor-pointer font-bold ${
                    selectedContinent === cont
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-[#121824] hover:bg-[#1a2332] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cont}
                </button>
              )
            )}

            {/* Quick Toggle: Expand European Sector */}
            <button
              onClick={() => {
                sound.playClick();
                setIsEuropeZoomed((prev) => {
                  const next = !prev;
                  if (next) setSelectedContinent('Europe');
                  else setSelectedContinent('All');
                  return next;
                });
              }}
              className={`ml-1 px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                isEuropeFocused
                  ? 'bg-amber-500 hover:bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-950/60'
                  : 'bg-[#151e2e] hover:bg-[#1d2a3f] text-amber-300 border-amber-500/40'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isEuropeFocused ? 'text-black' : 'text-amber-400'}`} />
              <span>{isEuropeFocused ? '🌍 SHOW ALL CONTINENTS (มุมมองโลก)' : '🔍 EXPAND EUROPE (ขยายมุมมองยุโรป)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 border border-amber-300 animate-pulse"></span>
              <strong className="text-white">Next GP (Arrow Target)</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              Upcoming
            </span>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* SVG WORLD MAP CANVAS WITH CONTINUOUS ROUTE & DIRECTIONAL ARROW        */}
        {/* ===================================================================== */}
        <div className="relative w-full aspect-[2/1] max-h-[460px] bg-[#060a11] rounded-2xl overflow-hidden border border-slate-800/90 shadow-inner">
          <svg
            viewBox={activeViewBox}
            className="w-full h-full object-cover select-none transition-all duration-500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Grid Background Pattern */}
              <pattern id="routeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0e1726" strokeWidth="0.5" />
              </pattern>

              {/* Continent Gradients */}
              <linearGradient id="routeContinentFill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#131e2e" />
                <stop offset="100%" stopColor="#0b121c" />
              </linearGradient>

              {/* Active Next Route Arrow Gradient */}
              <linearGradient id="activeRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="1" />
              </linearGradient>

              {/* Arrow Head Marker */}
              <marker
                id="nextRaceArrowHead"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M 1 1 L 7 4 L 1 7 z" fill="#ef4444" stroke="#fef08a" strokeWidth="0.8" />
              </marker>

              {/* Neon Beacon Filter */}
              <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ocean Base */}
            <rect width="1000" height="500" fill="#060910" />
            <rect width="1000" height="500" fill="url(#routeGrid)" />

            {/* Latitude / Longitude lines */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="#131d2c" strokeDasharray="3 4" strokeWidth="0.6" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#131d2c" strokeDasharray="3 4" strokeWidth="0.6" />

            {/* Realistic Continent Landmasses */}
            <g className="continents-group">
              {CONTINENT_LANDMASSES.map((group) => {
                const isContinentActive =
                  selectedContinent === 'All' || selectedContinent === group.continent;
                return (
                  <g
                    key={group.continent}
                    opacity={isContinentActive ? 1 : 0.3}
                    className="transition-opacity duration-300"
                  >
                    {group.paths.map((p) => (
                      <path
                        key={p.id}
                        d={p.d}
                        fill={isContinentActive ? 'url(#routeContinentFill)' : '#090e17'}
                        stroke={isContinentActive ? '#1e2d42' : '#101722'}
                        strokeWidth="1.1"
                      />
                    ))}
                    <text
                      x={group.labelX}
                      y={group.labelY}
                      fill={isContinentActive ? '#1b283d' : '#0c121c'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="pointer-events-none select-none tracking-wider"
                    >
                      {group.name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* =============================================================== */}
            {/* FULL SEASON ROUTE LINES (Connecting Round 1 to 18)              */}
            {/* =============================================================== */}
            <g className="season-route-lines">
              {circuitCoords.map((item, idx) => {
                if (idx === circuitCoords.length - 1) return null;
                const nextItem = circuitCoords[idx + 1];
                const isLegCompleted = item.isCompleted && nextItem.isCompleted;
                const isLegActive = item.round === prevRoundNumber && nextItem.round === currentRound;

                // Don't draw regular line if it's the active leg (drawn separately with arrows)
                if (isLegActive) return null;

                const arcD = getLegArcD(item.pos, nextItem.pos);

                return (
                  <path
                    key={`route-${item.round}-${nextItem.round}`}
                    d={arcD}
                    fill="none"
                    stroke={isLegCompleted ? '#10b981' : '#334155'}
                    strokeWidth={isLegCompleted ? 1.8 : 1.2}
                    strokeDasharray={isLegCompleted ? undefined : '3 4'}
                    opacity={isLegCompleted ? 0.8 : 0.45}
                  />
                );
              })}
            </g>

            {/* =============================================================== */}
            {/* HIGH-VISIBILITY ACTIVE FLIGHT PATH WITH DIRECTIONAL ARROW       */}
            {/* =============================================================== */}
            <g className="active-next-leg">
              {/* Outer Glow Path */}
              <path
                d={activeLegPathD}
                fill="none"
                stroke="#ef4444"
                strokeWidth="6"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
              {/* Core Route Path with Arrow Head */}
              <path
                d={activeLegPathD}
                fill="none"
                stroke="url(#activeRouteGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="6 4"
                markerEnd="url(#nextRaceArrowHead)"
              />

              {/* Directional Chevron 1 */}
              <polygon
                points={`${chevronPoint1.x},${chevronPoint1.y - 4} ${chevronPoint1.x + 6},${chevronPoint1.y} ${chevronPoint1.x},${chevronPoint1.y + 4}`}
                fill="#f59e0b"
                opacity="0.9"
              />
              {/* Directional Chevron 2 */}
              <polygon
                points={`${chevronPoint2.x},${chevronPoint2.y - 4} ${chevronPoint2.x + 6},${chevronPoint2.y} ${chevronPoint2.x},${chevronPoint2.y + 4}`}
                fill="#ef4444"
                opacity="0.9"
              />

              {/* Animated Traveling Pulse Dot along Path */}
              <circle r="4" fill="#fef08a" filter="url(#beaconGlow)">
                <animateMotion path={activeLegPathD} dur="2.4s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* =============================================================== */}
            {/* 18 CIRCUIT PINS PLOTTED ON MAP                                  */}
            {/* =============================================================== */}
            {circuitCoords.map((item) => {
              const { round, circuit, pos, isCompleted, isNext } = item;
              const isFocused =
                activePinRound === round || hoveredRound === round || currentRound === round;
              const isContinentMatch =
                selectedContinent === 'All' || circuit.continent === selectedContinent;
              const opacity = isContinentMatch ? 1 : 0.3;

              return (
                <g
                  key={`pin-${round}`}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ opacity, cursor: 'pointer' }}
                  onClick={() => {
                    sound.playClick();
                    setActivePinRound(round);
                    if (onSelectCircuit) onSelectCircuit(circuit);
                  }}
                  onMouseEnter={() => setHoveredRound(round)}
                  onMouseLeave={() => setHoveredRound(null)}
                >
                  {/* NEXT RACE: Giant Pulsing Radar Beacon */}
                  {isNext && (
                    <>
                      <circle r="20" fill="#ef4444" opacity="0.35" className="animate-ping" />
                      <circle r="12" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                    </>
                  )}

                  {/* Outer Focus Ring */}
                  {isFocused && (
                    <circle
                      r="14"
                      fill="none"
                      stroke={isNext ? '#ef4444' : isCompleted ? '#10b981' : '#f59e0b'}
                      strokeWidth="2"
                    />
                  )}

                  {/* Pin Body */}
                  {isNext ? (
                    // NEXT GRAND PRIX PIN (Target of the arrow)
                    <g filter="url(#beaconGlow)">
                      <polygon
                        points="0,-14 11,0 0,14 -11,0"
                        fill="#dc2626"
                        stroke="#fef08a"
                        strokeWidth="2"
                      />
                      <circle r="3.5" fill="#ffffff" />
                      <text
                        y="-16"
                        textAnchor="middle"
                        fill="#fef08a"
                        fontSize="9"
                        fontWeight="black"
                        fontFamily="monospace"
                      >
                        R{round}
                      </text>
                    </g>
                  ) : isCompleted ? (
                    // COMPLETED PIN
                    <g>
                      <circle r="7.5" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
                      <text
                        y="3"
                        textAnchor="middle"
                        fill="#a7f3d0"
                        fontSize="7"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        ✓
                      </text>
                    </g>
                  ) : (
                    // UPCOMING PIN
                    <g>
                      <circle r="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.2" />
                      <text
                        y="2.5"
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="6"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {round}
                      </text>
                    </g>
                  )}

                  {/* Floating Next GP Target Flag Label */}
                  {isNext && (
                    <g transform="translate(0, 26)">
                      <rect
                        x="-48"
                        y="-8"
                        width="96"
                        height="16"
                        rx="4"
                        fill="#dc2626"
                        stroke="#fef08a"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="7.5"
                        fontWeight="black"
                        fontFamily="monospace"
                      >
                        🎯 NEXT: {circuit.name.substring(0, 10).toUpperCase()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ===================================================================== */}
        {/* SELECTED / HOVERED CIRCUIT INSPECTOR DRAWER                           */}
        {/* ===================================================================== */}
        <div className="bg-[#101622] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-[#17202e] border border-slate-700">
              {renderFlag(focusedCircuit.country || focusedCircuit.flag, 'md')}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded font-bold">
                  ROUND {focusedCircuit.round} OF {circuits.length}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {focusedCircuit.continent}
                </span>
                {focusedCircuit.round === currentRound && (
                  <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 rounded font-black animate-pulse">
                    ⚡ NEXT GRAND PRIX
                  </span>
                )}
                {completedRoundNumbers.includes(focusedCircuit.round) && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono px-2 py-0.5 rounded font-bold">
                    ✓ COMPLETED
                  </span>
                )}
              </div>

              <h4 className="text-lg sm:text-xl font-black font-racing uppercase tracking-wide text-white mt-1">
                {focusedCircuit.name}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                {focusedCircuit.circuitName} • Track Length: {focusedCircuit.lapLengthKm} km • Total Laps: {focusedCircuit.totalLaps}
              </p>

              {/* Real-World Environment & Atmosphere Identity */}
              {(() => {
                const tourDef = getWorldTourCircuit(focusedCircuit.round, focusedCircuit.id);
                return (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-bold">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{tourDef.environmentName}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono italic mt-0.5">
                      "{tourDef.environmentDescription}"
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="flex items-center gap-4 text-right shrink-0">
            <div className="bg-[#0b0f17] border border-slate-800 px-3.5 py-2 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">TRACK CONDITIONS</span>
              <span className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5 justify-end mt-0.5">
                {focusedCircuit.weather === 'Dry' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                )}
                {focusedCircuit.weather} Track
              </span>
            </div>

            <div className="bg-[#0b0f17] border border-emerald-500/40 px-3.5 py-2 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-emerald-400 block">P1 PRIZE PURSE</span>
              <span className="text-base font-black font-mono text-emerald-300">
                {formatMoney(focusedCircuit.firstPlacePrize || 18_000_000)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
