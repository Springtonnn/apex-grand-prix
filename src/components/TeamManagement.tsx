import React, { useState } from 'react';
import {
  Users,
  BrainCircuit,
  Wrench,
  Gauge,
  GraduationCap,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Globe,
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  X,
  RotateCw,
  Save,
  Zap,
  ShieldAlert,
  Flame,
  Target,
  ChevronRight,
  Info,
  Trophy,
  Flag,
} from 'lucide-react';
import {
  getCircuitDemands,
  evaluateCarPreparedness,
  CircuitDemandInfo,
} from '../data/circuitDemands';
import {
  TeamState,
  Driver,
  Strategist,
  PitCrew,
  CarStats,
  CarStatKey,
  AcademyDriver,
  ContinentName,
  Scout,
} from '../types/game';
import {
  calculateCarOverall,
  getCarUpgradeCost,
  calculatePitStopDuration,
  formatMoney,
  MAX_STAT_CAP,
  generateScoutedDriver,
  clampStat,
  calcDriverPrice,
} from '../utils/calculations';
import {
  generateRandomMarketDriver,
  generateRandomStrategist,
  generateRandomPitCrew,
  generateRandomScoutCandidate,
  MARKET_REFRESH_INTERVAL_MS,
} from '../utils/generators';
import { sound } from '../utils/audio';
import { AVAILABLE_SCOUT_CANDIDATES } from '../data/initialData';
import { PersonAvatar } from './PersonAvatar';
import { MarketTimerBadge } from './MarketTimerBadge';
import { CountryFlag, renderFlag } from './CountryFlag';
import {
  CAR_COMPONENT_SPECS,
  ComponentIllustrationSVG,
} from './CarUpgradeIllustrations';
import {
  PitCrewBoxIllustrationSVG,
  PIT_CREW_IMPROVEMENTS,
} from './PitCrewIllustration';
import { getPitQteArrowCount } from './OutRunRaceEngine';
import {
  PitWallStrategistIllustrationSVG,
  STRATEGIST_IMPROVEMENTS,
} from './StrategistIllustration';
import {
  calculateCircuitFit,
  calculateRaceCarPhysics,
  getCarStatUpgradeImpact,
} from '../utils/raceEffects';

interface TeamManagementProps {
  teamState: TeamState;
  onUpdateTeamState: (updater: (prev: TeamState) => TeamState) => void;
  activeTab?: 'drivers' | 'strategist' | 'pitcrew' | 'car' | 'academy';
  onTabChange?: (tab: 'drivers' | 'strategist' | 'pitcrew' | 'car' | 'academy') => void;
  onOpenSaveSlots?: () => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  teamState,
  onUpdateTeamState,
  activeTab: externalActiveTab,
  onTabChange,
  onOpenSaveSlots,
}) => {
  const [internalTab, setInternalTab] = useState<'drivers' | 'strategist' | 'pitcrew' | 'car' | 'academy'>('drivers');
  const activeTab = externalActiveTab || internalTab;

  const setActiveTab = (tab: 'drivers' | 'strategist' | 'pitcrew' | 'car' | 'academy') => {
    sound.playClick();
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  // Drivers sub-tab: 'current' | 'available'
  const [driverSubTab, setDriverSubTab] = useState<'current' | 'available'>('current');

  // Modals
  const [scoutingReportOpen, setScoutingReportOpen] = useState(false);
  const [openNetworkOpen, setOpenNetworkOpen] = useState(false);
  const [selectedPotentialDriver, setSelectedPotentialDriver] = useState<AcademyDriver | null>(null);
  const [promoteCandidate, setPromoteCandidate] = useState<AcademyDriver | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotice = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // ----------------------------------------------------
  // REFRESH HANDLERS
  // ----------------------------------------------------
  const handleRefreshDriver = (driverId: string) => {
    onUpdateTeamState((prev) => ({
      ...prev,
      availableDrivers: prev.availableDrivers.map((d) =>
        d.id === driverId ? generateRandomMarketDriver() : d
      ),
    }));
  };

  const handleRefreshAllDrivers = () => {
    sound.playClick();
    onUpdateTeamState((prev) => ({
      ...prev,
      availableDrivers: prev.availableDrivers.map(() => generateRandomMarketDriver()),
    }));
    showNotice('Driver transfer market refreshed');
  };

  const handleRefreshStrategist = (stratId: string) => {
    onUpdateTeamState((prev) => ({
      ...prev,
      availableStrategists: prev.availableStrategists.map((s) =>
        s.id === stratId ? generateRandomStrategist() : s
      ),
    }));
  };

  const handleRefreshPitCrew = (crewId: string) => {
    onUpdateTeamState((prev) => ({
      ...prev,
      availablePitCrews: prev.availablePitCrews.map((c) =>
        c.id === crewId ? generateRandomPitCrew() : c
      ),
    }));
  };

  const handleRefreshScout = (scoutId: string) => {
    onUpdateTeamState((prev) => ({
      ...prev,
      availableScouts: (prev.availableScouts || []).map((sc) =>
        sc.id === scoutId ? generateRandomScoutCandidate(sc.stars) : sc
      ),
    }));
  };

  // ----------------------------------------------------
  // DRIVER SIGNING
  // ----------------------------------------------------
  const handleSignDriver = (targetDriver: Driver, seat: 'driver1' | 'driver2') => {
    const cost = targetDriver.buyoutCost || 0;
    if (teamState.budget < cost) {
      sound.playClick();
      showNotice(`Insufficient budget (Requires ${formatMoney(cost)})`, 'error');
      return;
    }

    sound.playCash();
    onUpdateTeamState((prev) => {
      const nextAvailable = prev.availableDrivers.map((d) =>
        d.id === targetDriver.id ? generateRandomMarketDriver() : d
      );

      return {
        ...prev,
        budget: prev.budget - cost,
        [seat]: {
          ...targetDriver,
          overall: clampStat(targetDriver.overall),
        },
        availableDrivers: nextAvailable,
      };
    });

    showNotice(`Successfully signed ${targetDriver.name} to Seat ${seat === 'driver1' ? '1' : '2'}!`);
  };

  // ----------------------------------------------------
  // STRATEGIST HIRING
  // ----------------------------------------------------
  const handleHireStrategist = (newStrategist: Strategist) => {
    if (teamState.budget < newStrategist.hireCost) {
      sound.playClick();
      showNotice(`Insufficient budget (Requires ${formatMoney(newStrategist.hireCost)})`, 'error');
      return;
    }

    sound.playCash();
    onUpdateTeamState((prev) => {
      const nextAvailable = prev.availableStrategists.map((s) =>
        s.id === newStrategist.id ? generateRandomStrategist() : s
      );

      return {
        ...prev,
        budget: prev.budget - newStrategist.hireCost,
        strategist: {
          ...newStrategist,
          overall: clampStat(newStrategist.overall),
        },
        availableStrategists: nextAvailable,
      };
    });

    showNotice(`Appointed ${newStrategist.name} as Lead Strategist!`);
  };

  // ----------------------------------------------------
  // PIT CREW HIRING
  // ----------------------------------------------------
  const handleHirePitCrew = (newCrew: PitCrew) => {
    if (teamState.budget < newCrew.hireCost) {
      sound.playClick();
      showNotice(`Insufficient budget (Requires ${formatMoney(newCrew.hireCost)})`, 'error');
      return;
    }

    sound.playWheelGun();
    onUpdateTeamState((prev) => {
      const nextAvailable = prev.availablePitCrews.map((c) =>
        c.id === newCrew.id ? generateRandomPitCrew() : c
      );

      return {
        ...prev,
        budget: prev.budget - newCrew.hireCost,
        pitCrew: {
          ...newCrew,
          overall: clampStat(newCrew.overall),
        },
        availablePitCrews: nextAvailable,
      };
    });

    showNotice(`Successfully hired pit crew: ${newCrew.name}!`);
  };

  // ----------------------------------------------------
  // SCOUT HIRING
  // ----------------------------------------------------
  const handleHireScout = (scoutCandidate: Scout) => {
    if (teamState.scouts.length >= teamState.maxScouts) {
      showNotice(`Scout roster full (${teamState.maxScouts}/${teamState.maxScouts})`, 'error');
      return;
    }
    if (teamState.budget < scoutCandidate.hireCost) {
      sound.playClick();
      showNotice(`Insufficient budget (${formatMoney(scoutCandidate.hireCost)})`, 'error');
      return;
    }

    sound.playCash();
    onUpdateTeamState((prev) => {
      const nextAvailable = (prev.availableScouts || []).map((sc) =>
        sc.id === scoutCandidate.id ? generateRandomScoutCandidate(scoutCandidate.stars) : sc
      );

      return {
        ...prev,
        budget: prev.budget - scoutCandidate.hireCost,
        scouts: [...prev.scouts, { ...scoutCandidate, id: 'scout-' + Date.now() }],
        availableScouts: nextAvailable,
      };
    });

    showNotice(`Successfully hired scout ${scoutCandidate.name}!`);
    setOpenNetworkOpen(false);
  };

  // ----------------------------------------------------
  // CAR UPGRADE
  // ----------------------------------------------------
  const handleUpgradeCarStat = (statKey: CarStatKey) => {
    const currentVal = teamState.car[statKey];
    if (currentVal >= MAX_STAT_CAP) {
      showNotice(`${statKey.toUpperCase()} already at maximum level (99 OVR)!`, 'error');
      return;
    }

    const cost = getCarUpgradeCost(currentVal);
    if (teamState.budget < cost) {
      sound.playClick();
      showNotice(`Insufficient funds for upgrade (Requires ${formatMoney(cost)})`, 'error');
      return;
    }

    sound.playUpgrade();
    onUpdateTeamState((prev) => {
      const newCar: CarStats = {
        ...prev.car,
        [statKey]: clampStat(prev.car[statKey] + 1),
      };
      return {
        ...prev,
        budget: prev.budget - cost,
        car: newCar,
      };
    });

    const spec = CAR_COMPONENT_SPECS[statKey];
    showNotice(`Upgraded ${spec.name} to Level ${currentVal + 1}!`);
  };

  // ----------------------------------------------------
  // ACADEMY PROMOTIONS
  // ----------------------------------------------------
  const handlePromoteAcademyDriver = (seat: 'driver1' | 'driver2') => {
    if (!promoteCandidate) return;

    sound.playUpgrade();
    const pricing = calcDriverPrice(promoteCandidate.overall, {
      seed: promoteCandidate.name,
      age: promoteCandidate.age,
      pace: promoteCandidate.pace,
      experience: promoteCandidate.experience,
    });
    const promoted: Driver = {
      id: 'driver-' + promoteCandidate.id,
      name: promoteCandidate.name,
      age: promoteCandidate.age,
      nationality: promoteCandidate.nationality,
      overall: clampStat(promoteCandidate.overall),
      pace: clampStat(promoteCandidate.pace),
      raceCraft: clampStat(promoteCandidate.raceCraft),
      experience: clampStat(promoteCandidate.experience),
      salary: pricing.salary,
      buyoutCost: pricing.buyout,
      avatarSeed: promoteCandidate.name,
    };

    onUpdateTeamState((prev) => {
      const oldDriver = seat === 'driver1' ? prev.driver1 : prev.driver2;
      const oldPricing = calcDriverPrice(oldDriver.overall, {
        seed: oldDriver.avatarSeed || oldDriver.id,
        age: oldDriver.age,
        pace: oldDriver.pace,
        experience: oldDriver.experience,
      });
      return {
        ...prev,
        [seat]: promoted,
        academyDrivers: prev.academyDrivers.filter((a) => a.id !== promoteCandidate.id),
        availableDrivers: [
          ...prev.availableDrivers,
          {
            ...oldDriver,
            salary: oldPricing.salary,
            buyoutCost: oldPricing.buyout,
            expiresAt: Date.now() + MARKET_REFRESH_INTERVAL_MS,
          },
        ],
      };
    });

    showNotice(`Promoted ${promoteCandidate.name} to Seat ${seat === 'driver1' ? '1' : '2'}!`);
    setPromoteCandidate(null);
  };

  // Scan Continent for new drivers
  const handleScanContinent = (continent: ContinentName) => {
    const scoutsForThisContinent = teamState.scouts.filter((s) => s.specialty === continent || !s.isAssignedTo);
    const bestScout = scoutsForThisContinent.sort((a, b) => b.stars - a.stars)[0] || teamState.scouts[0];

    const stars = bestScout ? bestScout.stars : 1;
    const scanCost = 150_000;

    if (teamState.budget < scanCost) {
      sound.playClick();
      showNotice(`Insufficient budget to deploy scout (${formatMoney(scanCost)})`, 'error');
      return;
    }

    sound.playRadioBeep();
    const newProspect = generateScoutedDriver(continent, stars);

    onUpdateTeamState((prev) => {
      const updatedContinents = { ...prev.continents };
      updatedContinents[continent] = {
        ...updatedContinents[continent],
        scannedDriversCount: updatedContinents[continent].scannedDriversCount + 1,
      };

      return {
        ...prev,
        budget: prev.budget - scanCost,
        continents: updatedContinents,
        academyDrivers: [newProspect, ...prev.academyDrivers],
      };
    });

    showNotice(`Discovered new talent in ${continent}: ${newProspect.name} (${newProspect.overall} OVR)!`);
  };

  const carOverall = calculateCarOverall(teamState.car);
  const pitDurationData = calculatePitStopDuration(teamState.pitCrew.speed, teamState.pitCrew.precision);

  const currentRound = Math.min(18, Math.max(1, teamState.currentRound || 1));
  const currentCircuitDemands = getCircuitDemands(currentRound);
  const preparedness = evaluateCarPreparedness(teamState.car, currentCircuitDemands);

  const circuitFitInfo = calculateCircuitFit(teamState.car, currentRound);
  const physicsImpact = calculateRaceCarPhysics(
    teamState.car,
    teamState.driver1.overall,
    teamState.driver1.pace,
    teamState.driver1.raceCraft,
    teamState.strategist?.decisions ?? 70,
    teamState.strategist?.strategy ?? 70,
    currentRound
  );

  const estimatedTopSpeed = physicsImpact.maxSpeed;
  const estimatedAccel = physicsImpact.accelRate;
  const estimatedBrake = physicsImpact.brakeRate;
  const estimatedHandling = physicsImpact.handlingRate.toFixed(2);

  const currentAvailableScouts = teamState.availableScouts && teamState.availableScouts.length > 0
    ? teamState.availableScouts
    : AVAILABLE_SCOUT_CANDIDATES;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-racing border animate-in slide-in-from-top-4 duration-200 ${
            notification.type === 'error'
              ? 'bg-red-950/95 border-red-500 text-red-200 shadow-red-950/80'
              : 'bg-emerald-950/95 border-emerald-500 text-emerald-200 shadow-emerald-950/80'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Top Header & Budget */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c1017]/65 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-800/60 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-racing font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
              <span>TEAM MANAGEMENT</span>
              <span className="text-xs font-mono font-normal text-slate-400">/ Team HQ & Car Development</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#141d2a]/65 backdrop-blur-xs border border-slate-700/60 text-xs font-mono flex items-center gap-2">
            <span className="text-slate-400">Budget:</span>
            <span className="text-emerald-400 font-bold text-sm">{formatMoney(teamState.budget)}</span>
          </div>

          {onOpenSaveSlots && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenSaveSlots();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17202d]/70 hover:bg-[#1e2a3c] border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-white font-racing text-xs tracking-wider uppercase transition shadow cursor-pointer active:scale-95 backdrop-blur-xs"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>SAVE SLOTS</span>
            </button>
          )}
        </div>
      </div>

      {/* Next Grand Prix Quick Intel & Preparedness Bar */}
      <div
        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shadow-xl transition-all backdrop-blur-md ${
          preparedness.status === 'danger'
            ? 'bg-gradient-to-r from-red-950/60 via-[#181116]/60 to-[#0f141f]/60 border-red-500/50'
            : preparedness.status === 'warning'
            ? 'bg-gradient-to-r from-amber-950/55 via-[#181512]/55 to-[#0f141f]/60 border-amber-500/40'
            : preparedness.status === 'advantage'
            ? 'bg-gradient-to-r from-emerald-950/55 via-[#111915]/55 to-[#0f141f]/60 border-emerald-500/40'
            : 'bg-gradient-to-r from-blue-950/55 via-[#111620]/55 to-[#0f141f]/60 border-blue-500/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl shrink-0 p-1.5 bg-black/40 rounded-xl border border-white/10">
            {currentCircuitDemands.flag}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono font-bold text-[11px] uppercase tracking-wider">
                ROUND {currentRound} / 18
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentCircuitDemands.stageName} (Tier {currentCircuitDemands.stageTier})
              </span>
            </div>
            <h3 className="font-racing font-bold text-base text-white flex items-center gap-2">
              <span>{currentCircuitDemands.circuitName}</span>
              <span className="text-xs font-normal text-slate-400 font-sans">({currentCircuitDemands.country})</span>
            </h3>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Rival Speed Benchmark: <span className="text-amber-400 font-bold">{currentCircuitDemands.rivalSpeedRange}</span> • Rival Benchmark: <span className="text-white font-bold">{currentCircuitDemands.rivalBenchmarkOvr} OVR</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${preparedness.badgeBg} ${preparedness.badgeText} ${preparedness.badgeBorder}`}>
              {preparedness.status === 'danger' && <AlertTriangle className="w-3.5 h-3.5" />}
              {preparedness.status === 'warning' && <ShieldAlert className="w-3.5 h-3.5" />}
              {preparedness.status === 'parity' && <Zap className="w-3.5 h-3.5" />}
              {preparedness.status === 'advantage' && <Trophy className="w-3.5 h-3.5" />}
              <span>{preparedness.title}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Your Car: <span className="text-white font-bold">{carOverall} OVR</span> ({estimatedTopSpeed} km/h)
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('car');
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-racing text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-red-950/60 flex items-center gap-1 cursor-pointer"
          >
            <span>Analysis & Upgrades</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Core Tabs: Clear, Short, Punchy */}
      <div className="bg-[#101520]/60 backdrop-blur-md p-2 rounded-2xl border border-slate-800/60 shadow-xl">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'drivers', emoji: '🏎️', label: 'Drivers', sub: 'Roster & Market', accent: 'from-blue-600 to-blue-800' },
            { id: 'strategist', emoji: '🧠', label: 'Strategist', sub: 'Pit Strategy & Pace', accent: 'from-purple-600 to-purple-800' },
            { id: 'pitcrew', emoji: '⏱️', label: 'Pit Crew', sub: 'Pit Stop Arrows', accent: 'from-amber-600 to-amber-800' },
            { id: 'car', emoji: '⚡', label: 'Car R&D', sub: 'Engine & Aero', accent: 'from-red-600 to-red-800' },
            { id: 'academy', emoji: '🌟', label: 'Academy', sub: 'Scouts & Young Talent', accent: 'from-emerald-600 to-emerald-800' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-3 rounded-xl text-left transition relative cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-br ${tab.accent} text-white shadow-lg shadow-black/50 border border-white/40 scale-[1.02]`
                    : 'bg-[#141c28]/60 hover:bg-[#182333]/80 text-slate-300 hover:text-white border border-slate-800/60 backdrop-blur-xs'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{tab.emoji}</span>
                  <span className="font-racing font-bold text-base tracking-wider">
                    {tab.label}
                  </span>
                </div>
                <div className="text-[11px] opacity-80 truncate">{tab.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DRIVERS                                                            */}
      {/* ========================================================================= */}
      {activeTab === 'drivers' && (
        <div className="space-y-5">
          {/* Tactical Role Briefing */}
          <div className="bg-[#121926]/75 backdrop-blur-md p-3.5 rounded-xl border border-blue-900/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-300 font-mono">
              <span className="text-blue-400 font-bold">Race Day Impact:</span> Driver <span className="text-white font-bold">Pace</span> maximizes vehicle top speed and acceleration, while <span className="text-white font-bold">Racecraft</span> powers aggressive race starts, defensive positioning, and sharp overtakes through corners.
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  setDriverSubTab('current');
                }}
                className={`px-4 py-2 rounded-xl font-racing font-bold text-sm uppercase transition cursor-pointer flex items-center gap-2 ${
                  driverSubTab === 'current'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950 border border-blue-400/50'
                    : 'bg-[#151c28]/80 text-slate-400 hover:text-white border border-slate-800 backdrop-blur-sm'
                }`}
              >
                <span>🏎️ Active Race Drivers (2 Seats)</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setDriverSubTab('available');
                }}
                className={`px-4 py-2 rounded-xl font-racing font-bold text-sm uppercase transition cursor-pointer flex items-center gap-2 ${
                  driverSubTab === 'available'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950 border border-blue-400/50'
                    : 'bg-[#151c28]/80 text-slate-400 hover:text-white border border-slate-800 backdrop-blur-sm'
                }`}
              >
                <span>🌐 Driver Transfer Market ({teamState.availableDrivers.length} Available)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {driverSubTab === 'available' && (
              <button
                onClick={handleRefreshAllDrivers}
                className="px-3 py-1.5 rounded-lg bg-[#182232]/80 hover:bg-[#202d42] border border-blue-500/40 text-blue-300 font-racing text-xs uppercase flex items-center gap-1.5 transition cursor-pointer backdrop-blur-sm"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Refresh Market</span>
              </button>
            )}
          </div>

          {/* Current 2 Drivers */}
          {driverSubTab === 'current' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'SEAT 1 (DRIVER 1)', driver: teamState.driver1, seat: 'driver1' as const },
                { label: 'SEAT 2 (DRIVER 2)', driver: teamState.driver2, seat: 'driver2' as const },
              ].map(({ label, driver, seat }) => (
                <div
                  key={seat}
                  className="bg-gradient-to-b from-[#151d29]/60 to-[#0f141d]/60 backdrop-blur-md border-2 border-slate-800/60 p-5 rounded-2xl shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <PersonAvatar
                        seed={driver.avatarSeed || driver.name || driver.id}
                        role="driver"
                        isTeamDriver={true}
                        teamPrimaryColor={teamState.primaryColor}
                        teamSecondaryColor={teamState.secondaryColor}
                        teamName={teamState.teamName}
                        size="lg"
                        className="ring-2 ring-blue-500/60"
                      />
                      <div>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 font-bold">
                          {label}
                        </span>
                        <h3 className="text-xl font-bold font-racing text-white mt-1 flex items-center gap-2">
                          {renderFlag(driver.nationality, 'md')}
                          <span>{driver.name}</span>
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Age {driver.age} • {driver.nationality.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-3xl font-black font-mono text-amber-400">
                        {Math.min(MAX_STAT_CAP, driver.overall)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">/ 99 OVR</span>
                    </div>
                  </div>

                  {/* 3 Core Stats: Short & Clear */}
                  <div className="grid grid-cols-3 gap-2 my-3 font-mono text-center">
                    <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                      <div className="text-[10px] text-slate-400">⚡ Pace</div>
                      <div className="text-base font-bold text-red-400">{Math.min(MAX_STAT_CAP, driver.pace)}</div>
                    </div>
                    <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                      <div className="text-[10px] text-slate-400">⚔️ Racecraft</div>
                      <div className="text-base font-bold text-blue-400">{Math.min(MAX_STAT_CAP, driver.raceCraft)}</div>
                    </div>
                    <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                      <div className="text-[10px] text-slate-400">🎓 Experience</div>
                      <div className="text-base font-bold text-emerald-400">{Math.min(MAX_STAT_CAP, driver.experience)}</div>
                    </div>
                  </div>

                  {/* Financial info */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">💰 Salary / Race:</span>
                    <span className="text-red-400 font-bold">{formatMoney(driver.salary)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Available Drivers Market */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamState.availableDrivers.map((driver) => {
                const canAfford = teamState.budget >= (driver.buyoutCost || 0);
                return (
                  <div
                    key={driver.id}
                    className="bg-[#141c28]/60 backdrop-blur-md border-2 border-slate-800/60 hover:border-blue-500/60 p-4 rounded-2xl flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5 border-b border-slate-800/80 pb-2">
                        <MarketTimerBadge
                          expiresAt={driver.expiresAt}
                          onExpireOrRefresh={() => handleRefreshDriver(driver.id)}
                        />
                        <div className="text-right">
                          <span className="text-xl font-black font-mono text-amber-400">
                            {Math.min(MAX_STAT_CAP, driver.overall)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono ml-1">OVR</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          seed={driver.avatarSeed || driver.name || driver.id}
                          role="driver"
                          size="md"
                        />
                        <div className="truncate">
                          <h4 className="text-base font-bold font-racing text-white flex items-center gap-1.5 truncate">
                            {renderFlag(driver.nationality, 'md')}
                            <span className="truncate">{driver.name}</span>
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">
                            Age {driver.age} • {driver.nationality.name}
                          </p>
                        </div>
                      </div>

                      {/* 3 Core Stats */}
                      <div className="grid grid-cols-3 gap-2 my-3 bg-[#0d1219] p-2 rounded-xl text-center font-mono">
                        <div>
                          <div className="text-[10px] text-slate-400">⚡ Pace</div>
                          <div className="text-sm font-bold text-red-400">{Math.min(MAX_STAT_CAP, driver.pace)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">⚔️ Racecraft</div>
                          <div className="text-sm font-bold text-blue-400">{Math.min(MAX_STAT_CAP, driver.raceCraft)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400">🎓 Experience</div>
                          <div className="text-sm font-bold text-emerald-400">{Math.min(MAX_STAT_CAP, driver.experience)}</div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs font-mono border-t border-slate-800 pt-2.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">🏷️ Buyout Fee:</span>
                          <span className="text-amber-300 font-bold">{formatMoney(driver.buyoutCost || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">💰 Salary / Race:</span>
                          <span className="text-red-400">{formatMoney(driver.salary)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-800">
                      {!canAfford ? (
                        <div className="w-full py-2 bg-slate-800/60 text-slate-500 border border-slate-700/50 rounded-xl text-xs font-bold text-center">
                          🔒 Insufficient Funds (Short by {formatMoney((driver.buyoutCost || 0) - teamState.budget)})
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSignDriver(driver, 'driver1')}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-racing font-bold tracking-wide transition cursor-pointer text-center active:scale-95"
                          >
                            🏎️ Sign to Seat 1
                          </button>
                          <button
                            onClick={() => handleSignDriver(driver, 'driver2')}
                            className="flex-1 py-2 bg-[#253346] hover:bg-[#2f4057] text-white rounded-xl text-xs font-racing font-bold tracking-wide transition cursor-pointer text-center active:scale-95"
                          >
                            🏎️ Sign to Seat 2
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STRATEGIST / COACH                                                */}
      {/* ========================================================================= */}
      {activeTab === 'strategist' && (
        <div className="space-y-5">
          {/* Tactical Role Briefing */}
          <div className="bg-[#191326]/60 backdrop-blur-md p-3.5 rounded-xl border border-purple-900/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-300 font-mono">
              <span className="text-purple-400 font-bold">Race Day Impact:</span> A higher-rated Lead Strategist extends active boost duration on <span className="text-white font-bold">Booster Speed Pads (+0.040s / level)</span>, surging your vehicle forward longer to pull away or reel in rivals.
            </div>
          </div>

          {/* Active Strategist Card */}
          <div className="bg-gradient-to-r from-[#171b26]/60 via-[#131722]/55 to-[#0d1017]/60 backdrop-blur-md border-2 border-purple-900/40 p-5 sm:p-6 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left: Info */}
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>TEAM LEAD STRATEGIST</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <PersonAvatar
                      seed={teamState.strategist.avatarSeed || teamState.strategist.name}
                      role="strategist"
                      size="lg"
                      className="ring-2 ring-purple-500/60"
                    />
                    <div>
                      <h3 className="text-2xl font-bold font-racing text-white flex items-center gap-2">
                        {renderFlag(teamState.strategist.nationality, 'md')}
                        <span>{teamState.strategist.name}</span>
                      </h3>
                      <p className="text-xs text-purple-400 font-mono">{teamState.strategist.title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-4xl font-black font-mono text-purple-400">
                      {Math.min(MAX_STAT_CAP, teamState.strategist.overall)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-1">/ 99 OVR</span>
                  </div>
                </div>

                {/* 3 Core Stats */}
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">🧠 Decision Making</span>
                    <span className="text-lg font-bold text-white">
                      {Math.min(MAX_STAT_CAP, teamState.strategist.decisions)} / 99
                    </span>
                  </div>
                  <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">📊 Tire Strategy</span>
                    <span className="text-lg font-bold text-white">
                      {Math.min(MAX_STAT_CAP, teamState.strategist.strategy)} / 99
                    </span>
                  </div>
                  <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">💰 Salary / Race</span>
                    <span className="text-lg font-bold text-red-400">
                      {formatMoney(teamState.strategist.salary)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: SVG Schematic */}
              <div className="lg:col-span-5 bg-[#070b10]/45 backdrop-blur-xs p-3 rounded-2xl border border-purple-900/30">
                <PitWallStrategistIllustrationSVG className="w-full h-36" />
              </div>
            </div>
          </div>

          {/* Short & Clear: What Coach Actually Does */}
          <div className="bg-[#10141e]/60 backdrop-blur-md border border-slate-800/60 p-4 rounded-2xl">
            <h4 className="font-racing font-bold text-sm text-purple-300 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>How the Lead Strategist Powers Your Race:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {STRATEGIST_IMPROVEMENTS.map((imp, idx) => (
                <div key={idx} className="bg-[#070b10]/45 backdrop-blur-xs p-3 rounded-xl border border-slate-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-racing font-bold text-white text-xs">
                    <span>{imp.icon}</span>
                    <span>{imp.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{imp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Available Strategists Candidates */}
          <div>
            <h4 className="text-base font-bold font-racing uppercase tracking-wider text-slate-200 mb-3">
              Available Free Agent Strategists
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamState.availableStrategists.map((strat) => {
                const canAfford = teamState.budget >= strat.hireCost;
                return (
                  <div
                    key={strat.id}
                    className="bg-[#141c28]/60 backdrop-blur-md border-2 border-slate-800/60 hover:border-purple-500/50 p-4 rounded-2xl flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5 border-b border-slate-800/80 pb-2">
                        <MarketTimerBadge
                          expiresAt={strat.expiresAt}
                          onExpireOrRefresh={() => handleRefreshStrategist(strat.id)}
                        />
                        <span className="text-lg font-black font-mono text-purple-400">
                          {Math.min(MAX_STAT_CAP, strat.overall)} OVR
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          seed={strat.avatarSeed || strat.name || strat.id}
                          role="strategist"
                          size="md"
                        />
                        <div>
                          <h5 className="text-base font-bold font-racing text-white flex items-center gap-1.5">
                            {renderFlag(strat.nationality, 'md')}
                            <span>{strat.name}</span>
                          </h5>
                          <p className="text-xs text-purple-400 font-mono">{strat.title}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-2.5 text-xs font-mono">
                        <div className="bg-[#0f141d] p-2 rounded-lg text-center">
                          <span className="text-slate-400 text-[10px] block">🧠 Decision</span>
                          <strong className="text-white">{Math.min(MAX_STAT_CAP, strat.decisions)}</strong>
                        </div>
                        <div className="bg-[#0f141d] p-2 rounded-lg text-center">
                          <span className="text-slate-400 text-[10px] block">📊 Strategy</span>
                          <strong className="text-white">{Math.min(MAX_STAT_CAP, strat.strategy)}</strong>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-400">🏷️ Signing Fee:</span>
                          <span className="text-amber-400 font-bold">{formatMoney(strat.hireCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">💰 Salary / Race:</span>
                          <span className="text-red-400">{formatMoney(strat.salary)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => handleHireStrategist(strat)}
                      className={`mt-3.5 w-full py-2.5 rounded-xl text-xs font-racing font-bold tracking-wide uppercase transition cursor-pointer text-center ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `🤝 Hire Strategist (${formatMoney(strat.hireCost)})` : '🔒 Insufficient Funds'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PIT CREW                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'pitcrew' && (
        <div className="space-y-5">
          {/* Tactical Role Briefing */}
          <div className="bg-[#1c1612]/60 backdrop-blur-md p-3.5 rounded-xl border border-amber-900/40 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="text-sm font-mono text-slate-300 flex items-center gap-2 flex-wrap">
              <span className="text-amber-400 font-bold">Race Day Impact:</span>
              <span className="text-lg sm:text-xl font-black font-racing text-white tracking-wide">
                Fewer QTE Arrows
              </span>
            </div>
          </div>

          {/* Active Pit Crew Card */}
          <div className="bg-gradient-to-r from-[#1c1a24]/60 via-[#14151e]/55 to-[#0e1017]/60 backdrop-blur-md border-2 border-amber-900/40 p-5 sm:p-6 rounded-2xl shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left: Info */}
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>ACTIVE PIT CREW</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <PersonAvatar
                      seed={teamState.pitCrew.avatarSeed || teamState.pitCrew.name}
                      role="pitcrew"
                      size="lg"
                      className="ring-2 ring-amber-500/60"
                    />
                    <div>
                      <h3 className="text-2xl font-bold font-racing text-white flex items-center gap-2">
                        {renderFlag(teamState.pitCrew.nationality, 'md')}
                        <span>{teamState.pitCrew.name}</span>
                      </h3>
                      <p className="text-xs text-amber-400 font-mono">TIER {teamState.pitCrew.level}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-4xl font-black font-mono text-amber-400">
                      {Math.min(MAX_STAT_CAP, teamState.pitCrew.overall)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-1">/ 99 OVR</span>
                  </div>
                </div>

                {/* Single Focused Highlight Box: Fewer QTE Arrows */}
                <div className="p-4 rounded-xl bg-amber-950/30 border-2 border-amber-500/50 flex items-center justify-between gap-4 backdrop-blur-xs shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black font-racing text-amber-300 uppercase tracking-wide">
                        Fewer QTE Arrows
                      </h4>
                      <p className="text-xs text-amber-200/80 font-mono">
                        Higher crew rating drastically reduces pit stop arrow inputs
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400">
                      {getPitQteArrowCount(teamState.pitCrew.overall || Math.round((teamState.pitCrew.speed + teamState.pitCrew.precision) / 2))}
                    </span>
                    <span className="text-xs font-mono text-slate-300 ml-1.5 font-bold">Arrows</span>
                  </div>
                </div>

                {/* 3 Core Stats */}
                <div className="grid grid-cols-3 gap-2 font-mono text-center">
                  <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">⏱️ Wheel Gun Speed</span>
                    <span className="text-lg font-bold text-white">
                      {Math.min(MAX_STAT_CAP, teamState.pitCrew.speed)} / 99
                    </span>
                  </div>
                  <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">🎯 Precision</span>
                    <span className="text-lg font-bold text-white">
                      {Math.min(MAX_STAT_CAP, teamState.pitCrew.precision)} / 99
                    </span>
                  </div>
                  <div className="bg-[#070b10]/45 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-400 block">💰 Salary / Race</span>
                    <span className="text-lg font-bold text-red-400">
                      {formatMoney(teamState.pitCrew.salary)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: SVG Illustration */}
              <div className="lg:col-span-5 bg-[#070b10]/45 backdrop-blur-xs p-3 rounded-2xl border border-amber-900/30">
                <PitCrewBoxIllustrationSVG className="w-full h-36" />
              </div>
            </div>
          </div>

          {/* Short & Clear: What Pit Crew Actually Does */}
          <div className="bg-[#10141e]/60 backdrop-blur-md border border-slate-800/60 p-4 rounded-2xl">
            <h4 className="font-racing font-bold text-sm text-amber-300 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Pit Crew Advantages in Live Racing:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PIT_CREW_IMPROVEMENTS.map((imp, idx) => (
                <div key={idx} className="bg-[#070b10]/45 backdrop-blur-xs p-3 rounded-xl border border-slate-800/60 space-y-1">
                  <div className="flex items-center gap-1.5 font-racing font-bold text-white text-xs">
                    <span>{imp.icon}</span>
                    <span>{imp.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{imp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Available Pit Crews Market */}
          <div>
            <h4 className="text-base font-bold font-racing uppercase tracking-wider text-slate-200 mb-3">
              Available Pit Crew Outfits
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teamState.availablePitCrews.map((crew) => {
                const crewTime = calculatePitStopDuration(crew.speed, crew.precision);
                const canAfford = teamState.budget >= crew.hireCost;
                return (
                  <div
                    key={crew.id}
                    className="bg-[#141c28]/60 backdrop-blur-md border-2 border-slate-800/60 hover:border-amber-500/50 p-4 rounded-2xl flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5 border-b border-slate-800/80 pb-2">
                        <MarketTimerBadge
                          expiresAt={crew.expiresAt}
                          onExpireOrRefresh={() => handleRefreshPitCrew(crew.id)}
                        />
                        <span className="text-lg font-black font-mono text-amber-400">
                          {Math.min(MAX_STAT_CAP, crew.overall)} OVR
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <PersonAvatar
                          seed={crew.avatarSeed || crew.name || crew.id}
                          role="pitcrew"
                          size="md"
                        />
                        <div>
                          <h5 className="text-base font-bold font-racing text-white flex items-center gap-1.5">
                            {renderFlag(crew.nationality, 'md')}
                            <span>{crew.name}</span>
                          </h5>
                          <span className="text-xs text-amber-400 font-mono">TIER {crew.level}</span>
                        </div>
                      </div>

                      <div className="my-2.5 bg-[#0d1219] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between px-3 font-mono">
                        <span className="text-sm font-bold text-amber-300 font-racing">
                          Fewer QTE Arrows
                        </span>
                        <span className="text-lg font-black text-cyan-400">
                          {getPitQteArrowCount(crew.overall)}{' '}
                          <span className="text-xs text-slate-300 font-normal">Arrows</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
                        <div className="bg-[#0f141d] p-1.5 rounded-lg text-center">
                          <span className="text-slate-400 text-[10px] block">⏱️ Speed</span>
                          <strong className="text-white">{Math.min(MAX_STAT_CAP, crew.speed)}</strong>
                        </div>
                        <div className="bg-[#0f141d] p-1.5 rounded-lg text-center">
                          <span className="text-slate-400 text-[10px] block">🎯 Precision</span>
                          <strong className="text-white">{Math.min(MAX_STAT_CAP, crew.precision)}</strong>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs font-mono pt-2 border-t border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-400">🏷️ Signing Fee:</span>
                          <span className="text-amber-400 font-bold">{formatMoney(crew.hireCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">💰 Salary / Race:</span>
                          <span className="text-red-400">{formatMoney(crew.salary)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => handleHirePitCrew(crew)}
                      className={`mt-3.5 w-full py-2.5 rounded-xl text-xs font-racing font-bold tracking-wide uppercase transition cursor-pointer text-center ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-md active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `🤝 Hire Pit Crew (${formatMoney(crew.hireCost)})` : '🔒 Insufficient Funds'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CAR UPGRADE & CIRCUIT INTELLIGENCE                                */}
      {/* ========================================================================= */}
      {activeTab === 'car' && (
        <div className="space-y-6">
          {/* Header Banner with Car Overall */}
          <div className="bg-gradient-to-r from-[#201518] via-[#16121a] to-[#0c0e16] border-2 border-red-900/50 p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold mb-1">
                <Gauge className="w-3.5 h-3.5" />
                <span>R&D ENGINEERING FACTORY</span>
              </div>
              <h3 className="text-2xl font-black font-racing text-white uppercase">
                CAR PERFORMANCE UPGRADES
              </h3>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Current Top Speed: <span className="text-amber-400 font-bold">{estimatedTopSpeed} km/h</span> • Acceleration: <span className="text-white font-bold">{estimatedAccel}</span> • Braking Power: <span className="text-white font-bold">{estimatedBrake}</span>
              </p>
            </div>

            <div className="text-right bg-black/40 border border-slate-800 px-5 py-2.5 rounded-xl">
              <span className="text-4xl font-black font-mono text-red-500 leading-none">
                {carOverall}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block font-bold">/ 99 Overall Rating</span>
            </div>
          </div>

          {/* NEXT RACE CIRCUIT INTELLIGENCE & THREAT ASSESSMENT */}
          <div className="bg-[#0f141f] border-2 border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1.5 bg-black/40 rounded-xl border border-white/10">
                  {currentCircuitDemands.flag}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                      NEXT CIRCUIT: ROUND {currentRound} / 18
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentCircuitDemands.stageName} (Tier {currentCircuitDemands.stageTier})
                    </span>
                  </div>
                  <h4 className="text-lg font-black font-racing text-white uppercase mt-0.5">
                    {currentCircuitDemands.circuitName} ({currentCircuitDemands.country})
                  </h4>
                </div>
              </div>

              {/* Preparedness Status Pill */}
              <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${preparedness.badgeBg} ${preparedness.badgeText} ${preparedness.badgeBorder}`}>
                {preparedness.status === 'danger' && <AlertTriangle className="w-4 h-4 animate-bounce" />}
                {preparedness.status === 'warning' && <ShieldAlert className="w-4 h-4" />}
                {preparedness.status === 'parity' && <Zap className="w-4 h-4" />}
                {preparedness.status === 'advantage' && <Trophy className="w-4 h-4" />}
                <span className="font-racing font-bold text-xs uppercase tracking-wider">
                  {preparedness.title}
                </span>
              </div>
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Rival Benchmark */}
              <div className="bg-[#141b27] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                  Rival Speed Benchmark:
                </div>
                <div className="text-xl font-black font-racing text-amber-400 mt-1">
                  {currentCircuitDemands.rivalSpeedRange}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Top Contenders: {currentCircuitDemands.topContenders.join(', ')} ({currentCircuitDemands.rivalBenchmarkOvr} OVR)
                </div>
              </div>

              {/* Player Car Benchmark & Circuit Fit % */}
              <div className="bg-[#141b27] p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold text-slate-400">
                  <span>Your Car Readiness:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    circuitFitInfo.circuitFitPct >= 100
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    Circuit Fit: {circuitFitInfo.circuitFitPct}%
                  </span>
                </div>
                <div className="text-xl font-black font-racing text-white mt-1">
                  {carOverall} OVR • {estimatedTopSpeed} km/h
                </div>
                <div className="text-xs font-mono mt-0.5 flex items-center justify-between">
                  <span>
                    Circuit Synergy: <strong className="text-white">{circuitFitInfo.circuitFit} OVR</strong>
                  </span>
                  {circuitFitInfo.circuitFitDelta >= 0 ? (
                    <span className="text-emerald-400 font-bold">
                      +{circuitFitInfo.circuitFitDelta} pts (+{Math.min(8, Math.round(circuitFitInfo.circuitFitDelta * 0.8))} km/h)
                    </span>
                  ) : (
                    <span className="text-red-400 font-bold">
                      {circuitFitInfo.circuitFitDelta} pts ({Math.max(-8, Math.round(circuitFitInfo.circuitFitDelta * 0.8))} km/h)
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      circuitFitInfo.circuitFitPct >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, circuitFitInfo.circuitFitPct))}%` }}
                  />
                </div>
              </div>

              {/* Track Geometry Demands */}
              <div className="bg-[#141b27] p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                  Circuit Profile & Track Characteristics:
                </div>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {currentCircuitDemands.trackTypeDescription}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {currentCircuitDemands.rivalBehaviorNotice}
                </div>
              </div>
            </div>

            {/* Tactical Advice & Recommended Priority */}
            <div className="bg-[#131722] p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-mono font-bold text-red-400 uppercase">
                    Chief Race Engineer Strategic Briefing:
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {currentCircuitDemands.tacticalAdvice}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                  Recommended Upgrades:
                </span>
                <div className="flex items-center gap-1.5">
                  {currentCircuitDemands.primaryFocus.map((k) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded-lg bg-red-600/30 text-red-300 border border-red-500/50 text-xs font-mono font-bold uppercase"
                    >
                      🔥 {CAR_COMPONENT_SPECS[k].name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5 Components Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {(['engine', 'aero', 'brakes', 'suspension', 'chassis'] as CarStatKey[]).map((key) => {
              const spec = CAR_COMPONENT_SPECS[key];
              const currentVal = teamState.car[key];
              const isMaxed = currentVal >= MAX_STAT_CAP;
              const upgradeCost = getCarUpgradeCost(currentVal);
              const canAfford = teamState.budget >= upgradeCost;

              const isPrimaryFocus = currentCircuitDemands.primaryFocus.includes(key);
              const isSecondaryFocus = currentCircuitDemands.secondaryFocus.includes(key);

              return (
                <div
                  key={key}
                  className={`border-2 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all backdrop-blur-md ${
                    isPrimaryFocus
                      ? 'border-red-500/70 shadow-red-950/40 bg-gradient-to-b from-[#161219]/65 to-[#111722]/60'
                      : isSecondaryFocus
                      ? 'border-amber-500/50 shadow-amber-950/30 bg-[#111722]/60'
                      : 'border-slate-800/70 bg-[#111722]/55 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Circuit Priority Tag */}
                    {isPrimaryFocus && (
                      <div className="mb-2 px-3 py-1 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center justify-between text-xs text-red-200 font-mono font-bold">
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                          CRITICAL COMPONENT FOR {currentCircuitDemands.circuitName}!
                        </span>
                        <span className="text-[10px] bg-red-600/40 text-red-200 px-1.5 py-0.5 rounded uppercase">
                          CRITICAL
                        </span>
                      </div>
                    )}
                    {isSecondaryFocus && (
                      <div className="mb-2 px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/60 flex items-center justify-between text-xs text-amber-200 font-mono font-bold">
                        <span className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-amber-400" />
                          HIGH-IMPACT ADVANTAGE FOR THIS CIRCUIT
                        </span>
                        <span className="text-[10px] bg-amber-600/40 text-amber-200 px-1.5 py-0.5 rounded uppercase">
                          RECOMMENDED
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/50">
                            {spec.code}
                          </span>
                          <span className="text-sm font-bold text-white font-racing uppercase">
                            {spec.name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-bold mt-0.5">
                          {spec.thaiName}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-3xl font-black font-mono text-red-400 leading-none">
                          {currentVal}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">/ 99 OVR</span>
                      </div>
                    </div>

                    {/* Vector Illustration Graphic */}
                    <div className="my-2.5 bg-[#0a0d14] rounded-xl border border-slate-800 p-2 overflow-hidden shadow-inner">
                      <ComponentIllustrationSVG statKey={key} className="w-full h-32" />
                    </div>

                    {/* Progress Bar + Level */}
                    <div className="space-y-1 my-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">Rating Level:</span>
                        <span className="text-white font-bold">
                          {isMaxed ? 'MAX (99 OVR)' : `${currentVal} ➔ ${currentVal + 1} (+1 OVR)`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${(currentVal / MAX_STAT_CAP) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Concrete Racing Stats Impact */}
                    {(() => {
                      const impact = getCarStatUpgradeImpact(key);
                      return (
                        <div className="my-2 bg-[#0b1018] p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                            <span>On-Track Impact:</span>
                            <span className="text-emerald-400 font-bold">{impact.perLevelTh}</span>
                          </div>
                          <div className="text-slate-200 text-xs font-sans">
                            {impact.detailTh}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Key Effects List */}
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                        Key Engineering Benefits:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {spec.keyEffects.map((eff, eIdx) => (
                          <div
                            key={eIdx}
                            className="bg-[#0b1018] px-2.5 py-1.5 rounded-lg border border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-200"
                          >
                            <span className="text-sm shrink-0">{eff.icon}</span>
                            <span className="truncate">{eff.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Clear Upgrade Button */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    {!isMaxed && (
                      <div className="mb-2.5 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300">Racing Advantage (+1 Level):</span>
                        <strong className="text-emerald-400">{getCarStatUpgradeImpact(key).shortEffectTh}</strong>
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={isMaxed || !canAfford}
                      onClick={() => handleUpgradeCarStat(key)}
                      className={`w-full py-3 px-4 rounded-xl font-racing font-bold text-sm uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${
                        isMaxed
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : canAfford
                          ? isPrimaryFocus
                            ? 'bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-950/80 border border-red-400/80 active:scale-95 animate-pulse'
                            : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-950/60 border border-red-400/50 active:scale-95'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      {isMaxed ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span>MAX LEVEL REACHED (99 OVR)</span>
                        </>
                      ) : canAfford ? (
                        <>
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>
                            UPGRADE TO LEVEL {currentVal + 1} ({formatMoney(upgradeCost)})
                          </span>
                          <ArrowRight className="w-4 h-4 ml-1 text-white/80" />
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span>INSUFFICIENT FUNDS (REQUIRES {formatMoney(upgradeCost)})</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SEASON ROADMAP & DIFFICULTY SCALING */}
          <div className="bg-[#0e131d]/60 backdrop-blur-md border-2 border-slate-800/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h4 className="font-racing font-bold text-base text-white uppercase tracking-wider">
                  18-ROUND SEASON ROADMAP & RIVAL PROGRESSION
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Rival teams continually develop R&D packages across every stage
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                {
                  tier: 1,
                  title: 'STAGE 1: OPENING FLYAWAYS',
                  rounds: 'Round 1 - 4',
                  circuits: 'Melbourne, Bahrain, Spain, Monaco',
                  speed: '320 - 342 km/h',
                  recOvr: '70 - 76 OVR',
                  desc: 'Rivals run conservative lines. Upgrade baseline stats to challenge for early podiums.',
                  isActive: currentRound >= 1 && currentRound <= 4,
                  accent: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
                },
                {
                  tier: 2,
                  title: 'STAGE 2: EUROPEAN SUMMER',
                  rounds: 'Round 5 - 9',
                  circuits: 'Canada, Silverstone, Austria, Spa, Zandvoort',
                  speed: '338 - 366 km/h',
                  recOvr: '78 - 86 OVR',
                  desc: 'Teams deploy mid-season aerodynamic packages; speeds escalate dramatically down straights.',
                  isActive: currentRound >= 5 && currentRound <= 9,
                  accent: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
                },
                {
                  tier: 3,
                  title: 'STAGE 3: HIGH-SPEED & ALTITUDE',
                  rounds: 'Round 10 - 14',
                  circuits: 'Monza, Singapore, Suzuka, Austin, Mexico',
                  speed: '364 - 388 km/h',
                  recOvr: '88 - 95 OVR',
                  desc: 'High-speed temples and high altitudes. Top-spec Power Units and Aero packages are mandatory.',
                  isActive: currentRound >= 10 && currentRound <= 14,
                  accent: 'border-red-500/40 bg-red-950/20 text-red-400',
                },
                {
                  tier: 4,
                  title: 'STAGE 4: CHAMPIONSHIP CLIMAX',
                  rounds: 'Round 15 - 18',
                  circuits: 'Interlagos, Las Vegas, Yas Marina, Cape Town',
                  speed: '382 - 405+ km/h',
                  recOvr: '96 - 99 OVR',
                  desc: 'World Championship showdown! Legendary rivals run at peak hyper-speed and ruthless aggression.',
                  isActive: currentRound >= 15 && currentRound <= 18,
                  accent: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
                },
              ].map((st) => (
                <div
                  key={st.tier}
                  className={`p-3.5 rounded-xl border transition-all ${
                    st.isActive
                      ? `${st.accent} ring-2 ring-white/20 shadow-lg scale-[1.02]`
                      : 'border-slate-800 bg-[#121722]/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-racing font-bold text-xs uppercase tracking-wider">
                      {st.title}
                    </span>
                    {st.isActive && (
                      <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-mono font-bold animate-pulse">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-white mb-1">
                    {st.rounds}
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans mb-2 truncate">
                    {st.circuits}
                  </div>
                  <div className="space-y-1 text-[11px] font-mono border-t border-slate-800/80 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rival Speed:</span>
                      <span className="text-amber-400 font-bold">{st.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recommended OVR:</span>
                      <span className="text-white font-bold">{st.recOvr}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ACADEMY & SCOUTING                                                */}
      {/* ========================================================================= */}
      {activeTab === 'academy' && (
        <div className="space-y-5">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#131d27]/65 via-[#101822]/60 to-[#0c1219]/65 backdrop-blur-md border-2 border-emerald-900/40 p-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>DRIVER ACADEMY</span>
              </div>
              <h3 className="text-2xl font-bold font-racing text-white uppercase">
                Academy Drivers ({teamState.academyDrivers.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Deploy global scouts across 6 continents to discover and promote rising stars
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setScoutingReportOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-racing font-bold uppercase tracking-wider text-sm shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>Deploy Global Scouts</span>
            </button>
          </div>

          {/* Academy Drivers List */}
          {teamState.academyDrivers.length === 0 ? (
            <div className="bg-[#121822]/60 backdrop-blur-md border-2 border-slate-800/60 p-8 rounded-2xl text-center space-y-3">
              <div className="text-3xl">🌟</div>
              <p className="text-slate-300 font-racing text-base uppercase font-bold">NO ACADEMY DRIVERS SIGNED YET</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Deploy scouts across the globe to discover prodigies and future champions
              </p>
              <button
                onClick={() => setScoutingReportOpen(true)}
                className="mt-1 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-racing font-bold text-xs rounded-xl uppercase cursor-pointer transition shadow-md active:scale-95"
              >
                🔍 Scout Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamState.academyDrivers.map((prospect) => (
                <div
                  key={prospect.id}
                  className="bg-[#141c28]/60 backdrop-blur-md border-2 border-slate-800/60 hover:border-emerald-500/50 p-4 rounded-2xl flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar
                          seed={prospect.name || prospect.id}
                          role="academy"
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            {renderFlag(prospect.nationality, 'md')}
                            <h4 className="text-base font-bold font-racing text-white">{prospect.name}</h4>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">
                            Age {prospect.age} • {prospect.nationality.name}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black font-mono text-emerald-400">
                          {Math.min(MAX_STAT_CAP, prospect.overall)}
                        </span>
                        <div className="text-[9px] text-slate-500 font-mono font-bold">OVR</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 my-2.5 bg-[#0d1219] p-2 rounded-xl text-center font-mono">
                      <div>
                        <div className="text-[10px] text-slate-400">⚡ Pace</div>
                        <div className="text-xs font-bold text-red-400">{Math.min(MAX_STAT_CAP, prospect.pace)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">⚔️ Racecraft</div>
                        <div className="text-xs font-bold text-blue-400">{Math.min(MAX_STAT_CAP, prospect.raceCraft)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">🎓 Experience</div>
                        <div className="text-xs font-bold text-emerald-400">{Math.min(MAX_STAT_CAP, prospect.experience)}</div>
                      </div>
                    </div>

                    {/* Potential badge */}
                    <div className="bg-[#0f141d] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-300 font-racing">🌟 Potential:</span>
                        <span className="font-mono font-bold text-amber-400 text-xs px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30">
                          Grade {prospect.potentialGrade} ({prospect.potentialMin} - {prospect.potentialMax} OVR)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedPotentialDriver(prospect);
                        }}
                        title="View Details"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Promote Button */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setPromoteCandidate(prospect);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-xl text-xs font-racing tracking-wide uppercase transition cursor-pointer text-center active:scale-95"
                    >
                      🚀 PROMOTE TO MAIN TEAM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SCOUTING REPORT (6 Continents)                                    */}
      {/* ========================================================================= */}
      {scoutingReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10151f] border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-950/70 via-[#18212e] to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-racing uppercase tracking-wide">
                    GLOBAL SCOUTING NETWORK
                  </h3>
                  <p className="text-xs text-slate-400">
                    Dispatch scouts to uncover next-generation talent
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setScoutingReportOpen(false);
                }}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Active Scouts Section */}
              <div className="bg-[#141c28] p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm font-racing uppercase text-slate-200">
                      Active Scouts
                    </h4>
                    <p className="text-xs text-slate-400">
                      Roster: <strong className="text-amber-400 font-mono">{teamState.scouts.length}</strong> / <strong className="font-mono">{teamState.maxScouts}</strong> Scouts
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setOpenNetworkOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-racing text-xs uppercase tracking-wider rounded-lg transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                  >
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Hire Additional Scouts</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {teamState.scouts.map((scout) => (
                    <div
                      key={scout.id}
                      className="bg-[#0e131b] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <PersonAvatar
                          seed={scout.avatarSeed || scout.name || scout.id}
                          role="scout"
                          size="sm"
                        />
                        <div>
                          <span className="font-bold text-xs font-racing text-slate-200">{scout.name}</span>
                          <div className="flex items-center gap-1 text-amber-400 text-xs">
                            {Array.from({ length: scout.stars }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="text-[10px] text-slate-400 ml-1 font-mono">
                              (85+ OVR Chance: {Math.round(scout.highTierChance * 100)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono shrink-0">
                        {scout.specialty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 Continents Grid */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Select a Continent to Scout:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(teamState.continents) as ContinentName[]).map((continentKey) => {
                    const cont = teamState.continents[continentKey];
                    return (
                      <div
                        key={continentKey}
                        className="bg-[#141c28] border-2 border-slate-800 p-3.5 rounded-xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{cont.regionIcon}</span>
                              <div>
                                <h4 className="font-bold text-sm font-racing text-white uppercase">
                                  {cont.name}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-mono">CONTINENT</span>
                              </div>
                            </div>

                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              {cont.scannedDriversCount} Prospects Found
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleScanContinent(continentKey)}
                          className="mt-3 w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-racing font-bold tracking-wider uppercase transition cursor-pointer text-center flex items-center justify-center gap-1 active:scale-95 shadow"
                        >
                          <span>🔍 Scout Region ($150,000)</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OPEN NETWORK (Hire Scouts)                                        */}
      {/* ========================================================================= */}
      {openNetworkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10151f] border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-amber-950/70 via-[#18212e] to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-racing uppercase tracking-wide">
                    Scout Recruitment Agency
                  </h3>
                  <p className="text-xs text-slate-400">
                    Available Budget: <span className="text-emerald-400 font-mono font-bold">{formatMoney(teamState.budget)}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setOpenNetworkOpen(false);
                }}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">
              {currentAvailableScouts.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-[#141c28] hover:bg-[#182333] border border-slate-800 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3">
                    <PersonAvatar
                      seed={cand.avatarSeed || cand.name || cand.id}
                      role="scout"
                      size="md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white font-racing">{cand.name}</h4>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: cand.stars }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Specialty: <span className="text-slate-200 font-semibold">{cand.specialty}</span> • 
                        85+ OVR Chance: <strong className="text-amber-400 font-mono">{Math.round(cand.highTierChance * 100)}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MarketTimerBadge
                      expiresAt={cand.expiresAt}
                      onExpireOrRefresh={() => handleRefreshScout(cand.id)}
                    />

                    <div className="text-right text-xs font-mono">
                      <div className="text-amber-300 font-bold">{formatMoney(cand.hireCost)}</div>
                      <div className="text-slate-500 text-[10px]">Salary: {formatMoney(cand.salary)} / race</div>
                    </div>
                    <button
                      onClick={() => handleHireScout(cand)}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-racing font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer active:scale-95"
                    >
                      Hire Scout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POTENTIAL DETAILS                                                  */}
      {/* ========================================================================= */}
      {selectedPotentialDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111722] border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-base font-racing text-white uppercase">
                  PROSPECT DEVELOPMENT POTENTIAL
                </h3>
              </div>
              <button
                onClick={() => setSelectedPotentialDriver(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-[#0e131b] p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <PersonAvatar
                  seed={selectedPotentialDriver.name || selectedPotentialDriver.id}
                  role="academy"
                  size="md"
                />
                <div>
                  <div className="text-base font-bold text-white font-racing flex items-center gap-1.5">
                    {renderFlag(selectedPotentialDriver.nationality, 'md')}
                    <span>{selectedPotentialDriver.name}</span>
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    Current Overall: <strong className="text-emerald-400 font-mono text-sm">{selectedPotentialDriver.overall} OVR</strong>
                  </div>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/30 p-3 rounded-xl space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-300">Potential Grade:</span>
                  <span className="text-amber-400 font-bold">{selectedPotentialDriver.potentialGrade} TIER</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Projected Peak Rating:</span>
                  <span className="text-amber-300 font-bold">
                    {selectedPotentialDriver.potentialMin} - {Math.min(MAX_STAT_CAP, selectedPotentialDriver.potentialMax)} OVR
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPotentialDriver(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-racing font-bold tracking-wider uppercase transition cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROMOTE CANDIDATE TO SEAT 1 OR SEAT 2                              */}
      {/* ========================================================================= */}
      {promoteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111722] border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-base font-racing text-white uppercase">
                  PROMOTE TO MAIN TEAM SEAT
                </h3>
              </div>
              <button
                onClick={() => setPromoteCandidate(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-[#0e131b] p-3 rounded-xl border border-slate-800">
              <PersonAvatar
                seed={promoteCandidate.name || promoteCandidate.id}
                role="academy"
                size="md"
              />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-white text-base font-racing">
                  {renderFlag(promoteCandidate.nationality, 'md')}
                  <span>{promoteCandidate.name}</span>
                  <span className="text-xs font-mono text-emerald-400">({promoteCandidate.overall} OVR)</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Assign race seat for {promoteCandidate.name}:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => handlePromoteAcademyDriver('driver1')}
                className="p-3.5 rounded-xl bg-[#151d29] hover:bg-blue-950/40 border-2 border-slate-700 hover:border-blue-500 text-left transition cursor-pointer space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <PersonAvatar
                    seed={teamState.driver1.avatarSeed || teamState.driver1.name}
                    role="driver"
                    isTeamDriver={true}
                    size="sm"
                  />
                  <div>
                    <span className="text-[10px] text-blue-400 font-mono font-bold block">🏎️ Assign to Seat 1</span>
                    <div className="font-bold text-white text-xs font-racing truncate">
                      {teamState.driver1.name}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Current: {teamState.driver1.overall} OVR
                </div>
              </button>

              <button
                onClick={() => handlePromoteAcademyDriver('driver2')}
                className="p-3.5 rounded-xl bg-[#151d29] hover:bg-blue-950/40 border-2 border-slate-700 hover:border-blue-500 text-left transition cursor-pointer space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <PersonAvatar
                    seed={teamState.driver2.avatarSeed || teamState.driver2.name}
                    role="driver"
                    isTeamDriver={true}
                    size="sm"
                  />
                  <div>
                    <span className="text-[10px] text-blue-400 font-mono font-bold block">🏎️ Assign to Seat 2</span>
                    <div className="font-bold text-white text-xs font-racing truncate">
                      {teamState.driver2.name}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Current: {teamState.driver2.overall} OVR
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
