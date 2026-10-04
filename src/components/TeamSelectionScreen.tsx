import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  Users,
  ArrowLeft,
  RotateCcw,
  Check,
  Award,
  Zap,
  DollarSign,
  ChevronRight,
  Flame,
  Gauge,
  Palette,
} from 'lucide-react';
import { PRESET_TEAMS, PresetTeam } from '../data/presetTeams';
import { Driver, CarStats, LogoShape } from '../types/game';
import { TeamLogo, LOGO_SHAPE_OPTIONS } from './TeamLogo';
import { PersonAvatar } from './PersonAvatar';
import { CountryFlag } from './CountryFlag';
import { formatMoney } from '../utils/calculations';
import { sound } from '../utils/audio';
import { generateStarterDriver } from '../utils/generators';
import { renderHeroCar } from './HeroRaceCar';

export interface SelectedTeamConfig {
  teamName: string;
  logoShape: LogoShape;
  primaryColor: string;
  secondaryColor: string;
  teamType: 'preset' | 'custom';
  teamPresetId?: string;
  budget: number;
  carStats: CarStats;
  driver1: Driver;
  driver2: Driver;
}

interface TeamSelectionScreenProps {
  slotId: number;
  onSelectTeam: (config: SelectedTeamConfig) => void;
  onBack: () => void;
}

const PRESET_COLOR_PALETTES = [
  { name: 'Apex Crimson', color: '#DC2626' },
  { name: 'Velocity Orange', color: '#EA580C' },
  { name: 'Monaco Gold', color: '#EAB308' },
  { name: 'Racing Green', color: '#059669' },
  { name: 'Mint Aero', color: '#00D2BE' },
  { name: 'Cobalt Blue', color: '#2563EB' },
  { name: 'Royal Purple', color: '#7C3AED' },
  { name: 'Neon Pink', color: '#EC4899' },
  { name: 'Silver Steel', color: '#9CA3AF' },
  { name: 'Midnight Carbon', color: '#1E293B' },
];

export const TeamSelectionScreen: React.FC<TeamSelectionScreenProps> = ({
  slotId,
  onSelectTeam,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');

  // Custom team form state
  const [customName, setCustomName] = useState<string>('Apex GP Racing');
  const [selectedLogoShape, setSelectedLogoShape] = useState<LogoShape>('hexagon');
  const [primaryColor, setPrimaryColor] = useState<string>('#DC2626');
  const [secondaryColor, setSecondaryColor] = useState<string>('#111827');
  const [customDrivers, setCustomDrivers] = useState<[Driver, Driver]>(() => [
    generateStarterDriver('custom-driver-1'),
    generateStarterDriver('custom-driver-2'),
  ]);
  const [rerollsRemaining, setRerollsRemaining] = useState<number>(3);

  // Validation
  const trimmedName = customName.trim();
  const isNameValid = trimmedName.length >= 3 && trimmedName.length <= 24;

  const handleSelectPreset = (team: PresetTeam) => {
    sound.playUpgrade();
    onSelectTeam({
      teamName: team.name,
      logoShape: team.logoShape,
      primaryColor: team.primaryColor,
      secondaryColor: team.secondaryColor,
      teamType: 'preset',
      teamPresetId: team.id,
      budget: team.budget,
      carStats: team.carStats,
      driver1: team.driver1,
      driver2: team.driver2,
    });
  };

  const handleRerollDrivers = () => {
    if (rerollsRemaining <= 0) return;
    sound.playClick();
    setRerollsRemaining((prev) => prev - 1);
    setCustomDrivers([
      generateStarterDriver('custom-driver-1-' + Date.now()),
      generateStarterDriver('custom-driver-2-' + Date.now()),
    ]);
  };

  const handleCreateCustomTeam = () => {
    if (!isNameValid) return;
    sound.playUpgrade();

    // Standard mid-tier car stats for newly forged team (~72 OVR)
    const customCarStats: CarStats = {
      engine: 73,
      aero: 72,
      brakes: 72,
      suspension: 72,
      chassis: 71,
    };

    onSelectTeam({
      teamName: trimmedName,
      logoShape: selectedLogoShape,
      primaryColor,
      secondaryColor,
      teamType: 'custom',
      budget: 100_000_000,
      carStats: customCarStats,
      driver1: customDrivers[0],
      driver2: customDrivers[1],
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070a0f] text-slate-100 flex flex-col font-sans select-none">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-checkered-flag bg-fixed opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-radial-vignette pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-red-600/10 blur-[130px] pointer-events-none"></div>

      {/* Screen Header */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141b25]/90 hover:bg-[#1f2a3a] border border-slate-700/80 hover:border-slate-500 text-slate-300 hover:text-white font-racing text-xs tracking-wider uppercase transition shadow-md cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-red-400" />
            <span>BACK TO SAVE SLOTS</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NEW CAREER SETUP • SLOT {slotId.toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-racing uppercase tracking-tight text-white drop-shadow-md">
            CHOOSE YOUR TEAM
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            Join one of 10 established constructors with verified rosters, or forge your own privateer racing dynasty from scratch.
          </p>

          {/* 2 Main Tabs */}
          <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-[#0c1017]/90 border border-slate-800 shadow-xl gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('join');
              }}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-racing font-bold text-sm tracking-wider uppercase transition cursor-pointer ${
                activeTab === 'join'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-950/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>JOIN A TEAM (10 TEAMS)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('create');
              }}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-racing font-bold text-sm tracking-wider uppercase transition cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-950/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>CREATE YOUR OWN TEAM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: JOIN A TEAM (10 Established Constructors) */}
        {/* ========================================================================= */}
        {activeTab === 'join' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-200">
            {PRESET_TEAMS.map((team, idx) => {
              return (
                <div
                  key={team.id}
                  className="group relative rounded-2xl border border-slate-800/90 hover:border-slate-700 bg-gradient-to-b from-[#131a24]/95 via-[#0f141d]/95 to-[#0b0e15]/95 p-5 shadow-2xl hover:shadow-red-950/20 transition-all duration-200 flex flex-col justify-between backdrop-blur-md"
                >
                  {/* Top Color Accent Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
                    style={{
                      background: `linear-gradient(90deg, ${team.primaryColor}, ${team.secondaryColor})`,
                    }}
                  />

                  <div>
                    {/* Header Row: Logo, Team Name, Tier & Budget */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <TeamLogo
                          teamName={team.name}
                          shape={team.logoShape}
                          primaryColor={team.primaryColor}
                          secondaryColor={team.secondaryColor}
                          size="lg"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-500 font-bold">
                              #{idx + 1}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60">
                              {team.carTier.split('•')[0].trim()}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                              {LOGO_SHAPE_OPTIONS.find((s) => s.id === team.logoShape)?.name || team.logoShape}
                            </span>
                          </div>
                          <h3 className="text-xl font-racing font-bold text-white tracking-wide leading-tight mt-0.5">
                            {team.name}
                          </h3>
                        </div>
                      </div>

                      {/* Budget Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">
                          STARTING BUDGET
                        </span>
                        <span className="font-mono text-base font-bold text-emerald-400">
                          {formatMoney(team.budget)}
                        </span>
                      </div>
                    </div>

                    {/* Team Color Swatch & Motto */}
                    <div className="flex items-center gap-2 mb-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: team.primaryColor }}
                          title={`Primary: ${team.primaryColor}`}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: team.secondaryColor }}
                          title={`Secondary: ${team.secondaryColor}`}
                        />
                      </div>
                      <span className="text-xs text-slate-400 italic truncate">
                        "{team.motto}"
                      </span>
                    </div>

                    {/* Drivers Preview */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        CONTRACTED DRIVERS (SEATS 1 & 2):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Driver 1 */}
                        <div className="flex items-center justify-between gap-2 bg-[#0a0d13]/80 p-2.5 rounded-xl border border-slate-800/80">
                          <div className="flex items-center gap-2 truncate">
                            <PersonAvatar
                              seed={team.driver1.avatarSeed}
                              role="driver"
                              isTeamDriver={true}
                              teamPrimaryColor={team.primaryColor}
                              teamSecondaryColor={team.secondaryColor}
                              teamName={team.name}
                              size="sm"
                            />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <CountryFlag code={team.driver1.nationality} size="sm" />
                                <span className="font-semibold text-xs text-white truncate">
                                  {team.driver1.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Age {team.driver1.age} • {formatMoney(team.driver1.salary)}/race
                              </span>
                            </div>
                          </div>
                          <span className="font-racing font-bold text-sm text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                            {team.driver1.overall} OVR
                          </span>
                        </div>

                        {/* Driver 2 */}
                        <div className="flex items-center justify-between gap-2 bg-[#0a0d13]/80 p-2.5 rounded-xl border border-slate-800/80">
                          <div className="flex items-center gap-2 truncate">
                            <PersonAvatar
                              seed={team.driver2.avatarSeed}
                              role="driver"
                              isTeamDriver={true}
                              teamPrimaryColor={team.primaryColor}
                              teamSecondaryColor={team.secondaryColor}
                              teamName={team.name}
                              size="sm"
                            />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <CountryFlag code={team.driver2.nationality} size="sm" />
                                <span className="font-semibold text-xs text-white truncate">
                                  {team.driver2.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Age {team.driver2.age} • {formatMoney(team.driver2.salary)}/race
                              </span>
                            </div>
                          </div>
                          <span className="font-racing font-bold text-sm text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                            {team.driver2.overall} OVR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Select Team Button */}
                  <button
                    onClick={() => handleSelectPreset(team)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-racing font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition cursor-pointer active:scale-95"
                  >
                    <span>SELECT {team.name.toUpperCase()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CREATE YOUR OWN TEAM (Custom Constructor) */}
        {/* ========================================================================= */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Column: Form Controls (7 cols) */}
            <div className="lg:col-span-7 bg-[#0f141d]/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              {/* Field 1: Team Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  CONSTRUCTOR NAME (3-24 CHARACTERS) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.slice(0, 24))}
                    placeholder="e.g. Apex Grand Prix Racing"
                    className="w-full px-4 py-3 rounded-xl bg-[#090c12] border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white font-racing text-lg placeholder-slate-600 outline-none transition"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-mono text-slate-500">
                    {customName.length}/24
                  </span>
                </div>
                {!isNameValid && (
                  <p className="text-xs text-amber-400 font-mono mt-1">
                    * Team name must be between 3 and 24 characters (no whitespace only).
                  </p>
                )}
              </div>

              {/* Field 2: Logo Shape Selection (8 Distinct SVG Shapes) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                    LOGO SHAPE (8 Geometric Badges) <span className="text-red-400">*</span>
                  </label>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {LOGO_SHAPE_OPTIONS.find((s) => s.id === selectedLogoShape)?.name} • {LOGO_SHAPE_OPTIONS.find((s) => s.id === selectedLogoShape)?.subtitle}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {LOGO_SHAPE_OPTIONS.map((shapeOpt) => {
                    const isSelected = selectedLogoShape === shapeOpt.id;
                    return (
                      <button
                        key={shapeOpt.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedLogoShape(shapeOpt.id);
                        }}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer group active:scale-95 ${
                          isSelected
                            ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/60 shadow-lg shadow-red-950/60 scale-105'
                            : 'border-slate-800 bg-[#0a0d13]/80 hover:border-slate-600 hover:bg-[#121824]'
                        }`}
                        title={`${shapeOpt.name} (${shapeOpt.subtitle}): ${shapeOpt.description}`}
                      >
                        {/* Live mini SVG emblem preview reflecting colors and initials */}
                        <div className="w-8 h-8 flex items-center justify-center mb-1">
                          <TeamLogo
                            teamName={trimmedName || 'APX'}
                            shape={shapeOpt.id}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            size="sm"
                          />
                        </div>
                        <span
                          className={`text-[10px] font-racing font-bold truncate max-w-full tracking-wide ${
                            isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        >
                          {shapeOpt.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-1.5 italic">
                  {LOGO_SHAPE_OPTIONS.find((s) => s.id === selectedLogoShape)?.description}
                </p>
              </div>

              {/* Field 3: Primary Color */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  PRIMARY LIVERY COLOR
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {PRESET_COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.color}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setPrimaryColor(pal.color);
                      }}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition transform active:scale-95 cursor-pointer ${
                        primaryColor === pal.color
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: pal.color }}
                      title={pal.name}
                    >
                      {primaryColor === pal.color && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  {/* Custom Color Input */}
                  <label
                    className="w-9 h-9 rounded-xl border border-slate-600 hover:border-white/60 bg-[#161e2b] flex items-center justify-center cursor-pointer transition relative overflow-hidden"
                    title="Custom Color Picker"
                  >
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                    <Palette className="w-4 h-4 text-slate-300" />
                  </label>
                  <span className="text-xs font-mono text-slate-400 ml-1">
                    {primaryColor.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Field 3: Secondary Color */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  SECONDARY ACCENT COLOR
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {PRESET_COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.color}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSecondaryColor(pal.color);
                      }}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition transform active:scale-95 cursor-pointer ${
                        secondaryColor === pal.color
                          ? 'ring-2 ring-white scale-110 shadow-lg'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: pal.color }}
                      title={pal.name}
                    >
                      {secondaryColor === pal.color && (
                        <Check className="w-4 h-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  {/* Custom Color Input */}
                  <label
                    className="w-9 h-9 rounded-xl border border-slate-600 hover:border-white/60 bg-[#161e2b] flex items-center justify-center cursor-pointer transition relative overflow-hidden"
                    title="Custom Color Picker"
                  >
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                    />
                    <Palette className="w-4 h-4 text-slate-300" />
                  </label>
                  <span className="text-xs font-mono text-slate-400 ml-1">
                    {secondaryColor.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Field 4: Draft Drivers with Reroll */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    DRAFTED STARTER DRIVERS (MIDFIELD RATING 78-84)
                  </label>
                  <button
                    type="button"
                    onClick={handleRerollDrivers}
                    disabled={rerollsRemaining <= 0}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono uppercase transition cursor-pointer ${
                      rerollsRemaining > 0
                        ? 'bg-[#182332] hover:bg-[#202f44] text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>REROLL DRIVERS ({rerollsRemaining} LEFT)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customDrivers.map((driver, idx) => (
                    <div
                      key={driver.id}
                      className="flex items-center justify-between gap-3 bg-[#0a0d13] p-3 rounded-xl border border-slate-800"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <PersonAvatar
                          seed={driver.avatarSeed}
                          role="driver"
                          isTeamDriver={true}
                          teamPrimaryColor={primaryColor}
                          teamSecondaryColor={secondaryColor}
                          teamName={trimmedName || 'Apex'}
                          size="md"
                        />
                        <div className="truncate">
                          <span className="text-[10px] font-mono text-slate-500 block uppercase">
                            Seat {idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <CountryFlag code={driver.nationality} size="sm" />
                            <span className="font-racing font-bold text-sm text-white truncate">
                              {driver.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Age {driver.age} • Pace {driver.pace} • {formatMoney(driver.salary)}/race
                          </span>
                        </div>
                      </div>
                      <span className="font-racing font-bold text-base text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                        {driver.overall} OVR
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCreateCustomTeam}
                disabled={!isNameValid}
                className={`w-full py-3.5 rounded-xl font-racing font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition ${
                  isNameValid
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white cursor-pointer active:scale-95 shadow-red-950/80'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Flame className="w-5 h-5 text-amber-400" />
                <span>CREATE TEAM & START CAREER →</span>
              </button>
            </div>

            {/* Right Column: Live Interactive Preview (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#131b26] to-[#0b0e14] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  LIVE CONSTRUCTOR PREVIEW
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  TIER 2 • PRIVATEER
                </span>
              </div>

              {/* Team Crest & Name Preview */}
              <div className="flex flex-col items-center justify-center text-center py-4 bg-[#0a0d13]/70 rounded-2xl border border-slate-800/80 p-5 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                />

                <TeamLogo
                  teamName={trimmedName || 'Apex Racing'}
                  shape={selectedLogoShape}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                  size="xl"
                  className="mb-3.5"
                />

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-300 text-[10px] font-mono uppercase tracking-wider mb-2 font-bold">
                  <span>SHAPE: {LOGO_SHAPE_OPTIONS.find((s) => s.id === selectedLogoShape)?.name} ({LOGO_SHAPE_OPTIONS.find((s) => s.id === selectedLogoShape)?.subtitle})</span>
                </div>

                <h2 className="text-2xl font-racing font-bold text-white tracking-wide uppercase">
                  {trimmedName || 'Your Team Name'}
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Starting Budget: <strong className="text-emerald-400">$100,000,000</strong>
                </p>

                {/* Color Swatch Display */}
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className="w-12 h-3.5 rounded-full border border-white/20"
                    style={{
                      background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                    }}
                  />
                  <span className="text-[11px] font-mono text-slate-500">Official Livery</span>
                </div>

                {/* Live Race Car Livery Preview */}
                <div className="w-full flex items-center justify-center mt-3 pt-3 border-t border-slate-800/80">
                  {renderHeroCar(primaryColor, secondaryColor, trimmedName || 'APEX')}
                </div>
              </div>

              {/* Driver Race Suit Live Previews */}
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                  OFFICIAL DRIVER LIVERY PREVIEWS
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {customDrivers.map((drv, idx) => (
                    <div
                      key={drv.id}
                      className="bg-[#0a0d13]/90 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center text-center"
                    >
                      <PersonAvatar
                        seed={drv.avatarSeed}
                        role="driver"
                        isTeamDriver={true}
                        teamPrimaryColor={primaryColor}
                        teamSecondaryColor={secondaryColor}
                        teamName={trimmedName || 'Apex'}
                        size="lg"
                        className="mb-2"
                      />
                      <span className="text-xs font-semibold text-white truncate max-w-full">
                        {drv.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Seat {idx + 1} • {drv.overall} OVR
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-500 bg-[#090c12] p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                💡 <strong>Director's Note:</strong> Your drivers' race suits, team logos, and car graphics will continuously reflect your custom livery across the season and standings!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
