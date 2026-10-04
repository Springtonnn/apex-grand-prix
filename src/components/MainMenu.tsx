import React from 'react';
import {
  Trophy,
  Users,
  Wrench,
  Gauge,
  Compass,
  ArrowRight,
  Zap,
  Wind,
  Shield,
  Activity,
  Sparkles,
  Timer,
  ChevronRight,
  Flag,
  Skull,
} from 'lucide-react';
import { TeamState } from '../types/game';
import { calculateCarOverall, formatMoney, calculatePitStopDuration } from '../utils/calculations';
import { sound } from '../utils/audio';
import { MainView } from './Navigation';
import { PersonAvatar } from './PersonAvatar';
import { CountryFlag, renderFlag } from './CountryFlag';
import { TeamLogo } from './TeamLogo';
import { renderHeroCar } from './HeroRaceCar';
import { INITIAL_GRAND_PRIX } from '../data/initialData';

interface MainMenuProps {
  teamState: TeamState;
  onChangeView: (view: MainView) => void;
  onOpenTab: (tab: 'drivers' | 'strategist' | 'pitcrew' | 'car' | 'academy') => void;
  onReplayIntro?: () => void;
  onOpenSaveSlots?: () => void;
  isIntroActive?: boolean;
  onOpenChampionshipSubTab?: (subTab: 'race-day' | 'standings' | 'calendar' | 'auto-race') => void;
  onOpenCelebrationCutscene?: () => void;
  onOpenHomelessCutscene?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  teamState,
  onChangeView,
  onOpenTab,
  onReplayIntro,
  onOpenSaveSlots,
  isIntroActive = false,
  onOpenChampionshipSubTab,
  onOpenCelebrationCutscene,
  onOpenHomelessCutscene,
}) => {
  const carOverall = calculateCarOverall(teamState.car);
  const pitStopPreview = calculatePitStopDuration(teamState.pitCrew.speed, teamState.pitCrew.precision);
  const totalRaces = teamState.totalRaces || 18;
  const nextGp = teamState.currentRound <= totalRaces ? teamState.currentRound : totalRaces;

  const activeCircuits =
    teamState.seasonCircuits && teamState.seasonCircuits.length === 18
      ? teamState.seasonCircuits
      : INITIAL_GRAND_PRIX;

  const currentCircuit =
    activeCircuits.find((c) => c.round === nextGp) || activeCircuits[0];

  const handleRaceNow = () => {
    sound.playClick();
    sound.resumeAudio();
    if (onOpenChampionshipSubTab) {
      onOpenChampionshipSubTab('race-day');
    }
    onChangeView('championship');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* TOP CONTAINER: WELCOME BANNER + RACE NOW + HERO F1 CAR                   */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-slate-800/90 bg-gradient-to-r from-[#131924] via-[#0f141d] to-[#090d13] p-6 sm:p-8 lg:p-9 shadow-2xl">
        {/* Subtle Ambient Glows and Checkered Accent */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-96 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-full bg-checkered-accent opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          {/* Left Column: Team Badge, Header, Subtext, and Big RACE NOW CTA */}
          <div className="max-w-xl xl:max-w-2xl flex-1 z-10 w-full">
            {/* Top Team Badge & Round Tracker */}
            <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-black/40 border border-slate-700/60 text-slate-300 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <TeamLogo
                  teamName={teamState.teamName}
                  shape={teamState.logoShape}
                  primaryColor={teamState.primaryColor || '#DC2626'}
                  secondaryColor={teamState.secondaryColor || '#111827'}
                  size="sm"
                />
                <span className="font-bold text-white tracking-wider font-racing text-sm">
                  {teamState.teamName}
                </span>
              </div>
              <span className="text-slate-600">•</span>
              <span className="text-red-400 font-bold">
                ROUND {teamState.currentRound} OF {teamState.totalRaces}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 hidden sm:inline">PADDOCK HQ</span>
            </div>

            {/* Main Welcome Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-racing uppercase tracking-tight text-white leading-none drop-shadow-md">
              WELCOME BACK, BOSS
            </h1>

            {/* Description Subtext */}
            <p className="mt-3.5 text-slate-300 text-sm sm:text-base leading-relaxed max-w-[56ch]">
              Build your dynasty from the paddock up. Sign elite drivers, engineer a winning car, and outsmart the grid on race day.
            </p>

            {/* Next Race Quick Telemetry Pill */}
            <div className="mt-4 flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18202d] border border-slate-700/60 text-slate-200">
                <Flag className="w-3.5 h-3.5 text-red-500" />
                <span>Next: {currentCircuit.name}</span>
                <span className="text-slate-400">({renderFlag(currentCircuit.country || currentCircuit.flag, 'sm')})</span>
              </span>
              <span className="text-amber-400/90 font-bold hidden sm:inline">
                Purse: {formatMoney(currentCircuit.firstPlacePrize || 18_000_000)}
              </span>
            </div>

            {/* PROMINENT CHAMPIONSHIP & RACE HUB BUTTON + TEST CUTSCENE BUTTON */}
            <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRaceNow}
                className="group relative inline-flex items-center justify-center gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-600 text-white font-black font-racing uppercase tracking-wider text-base sm:text-lg shadow-[0_0_25px_rgba(239,68,68,0.5)] hover:shadow-[0_0_35px_rgba(239,68,68,0.7)] border-2 border-red-400/60 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <Trophy className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>CHAMPIONSHIP & RACE HUB</span>
                <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Requested Test Cutscene Button */}
              {onOpenCelebrationCutscene && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onOpenCelebrationCutscene();
                  }}
                  className="group inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/25 hover:from-amber-500/40 hover:to-yellow-500/40 text-amber-300 hover:text-white font-racing font-black uppercase tracking-wider text-sm sm:text-base border-2 border-amber-400/60 hover:border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-200 cursor-pointer active:scale-95"
                  title="ทดสอบดูหน้าคัตซีนเฉลิมฉลองชัยชนะ (Victory Celebration Cutscene)"
                >
                  <Trophy className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform animate-bounce" />
                  <span>TEST FINAL CUTSCENE</span>
                  <span className="text-[11px] font-mono text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 font-bold hidden xl:inline">
                    ทดสอบคัตซีน 🏆
                  </span>
                </button>
              )}

              {/* Requested Test Homeless / Bankrupt Cutscene Button ("ขอปุ่มเทสไว้หน้า menu ด้วย") */}
              {onOpenHomelessCutscene && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playCrashImpact();
                    onOpenHomelessCutscene();
                  }}
                  className="group inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-red-950/70 via-rose-950/60 to-red-900/70 hover:from-red-900/80 hover:to-rose-900/80 text-rose-300 hover:text-white font-racing font-black uppercase tracking-wider text-sm sm:text-base border-2 border-red-500/70 hover:border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] transition-all duration-200 cursor-pointer active:scale-95"
                  title="ทดสอบดูหน้าคัตซีนคนไร้บ้าน / ล้มละลาย (Homeless & Bankrupt Cutscene)"
                >
                  <Skull className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform animate-pulse" />
                  <span>TEST HOMELESS CUTSCENE</span>
                  <span className="text-[11px] font-mono text-red-200 bg-red-950 px-2 py-0.5 rounded border border-red-500/50 font-bold hidden xl:inline">
                    ทดสอบคนไร้บ้าน 🪑
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Hero F1 Race Car Illustration */}
          <div className="w-full lg:w-[48%] xl:w-[50%] flex items-center justify-center relative select-none mt-2 lg:mt-0">
            {/* Ambient Team Livery Glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
              style={{
                backgroundColor: teamState.primaryColor ? `${teamState.primaryColor}2b` : 'rgba(220, 38, 38, 0.2)',
              }}
            />

            {/* Central High-Definition Team Race Car SVG */}
            <div className="w-full max-w-lg lg:max-w-xl">
              {renderHeroCar(
                teamState.primaryColor || '#DC2626',
                teamState.secondaryColor || '#111827',
                teamState.teamName || 'APEX GP'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM CONTAINER: 4 KEY DEPARTMENT CARDS (CLEAR BUTTONS & BIG STATS)      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* ========================================================================= */}
        {/* CARD 1: CAR PERFORMANCE                                                  */}
        {/* ========================================================================= */}
        <div
          onClick={() => {
            sound.playClick();
            onChangeView('team-management');
            onOpenTab('car');
          }}
          className="bg-[#111722] hover:bg-[#141d2c] border-2 border-slate-800 hover:border-red-500/60 p-5 sm:p-6 rounded-2xl transition duration-200 group cursor-pointer shadow-xl flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-500/15 text-red-400 group-hover:bg-red-500 group-hover:text-white transition">
                  <Gauge className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                  CAR PERFORMANCE
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">R&D HUB</span>
            </div>

            {/* Overall Rating Display */}
            <div className="flex items-baseline gap-2 pb-3 border-b border-slate-800/80">
              <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {carOverall}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">/ 99 OVR</span>
            </div>

            {/* Prominent Large Engine & Aero Stats (As requested: ใหญ่ขึ้น ชัดเจนขึ้น) */}
            <div className="mt-4 space-y-3 font-mono">
              {/* Engine */}
              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">ENGINE</span>
                  </div>
                  <span className="text-lg font-black text-red-400">{teamState.car.engine} <span className="text-[10px] text-slate-500 font-normal">/ 99</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${teamState.car.engine}%` }}
                  />
                </div>
              </div>

              {/* Aero */}
              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AERO</span>
                  </div>
                  <span className="text-lg font-black text-cyan-400">{teamState.car.aero} <span className="text-[10px] text-slate-500 font-normal">/ 99</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${teamState.car.aero}%` }}
                  />
                </div>
              </div>

              {/* Minor stats pill */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span>Chassis: <strong className="text-slate-200">{teamState.car.chassis}</strong></span>
                <span>Brakes: <strong className="text-slate-200">{teamState.car.brakes}</strong></span>
                <span>Susp: <strong className="text-slate-200">{teamState.car.suspension}</strong></span>
              </div>
            </div>
          </div>

          {/* High-Impact Upgrade Car Action Button */}
          <div className="mt-5 pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onChangeView('team-management');
                onOpenTab('car');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-racing font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 border border-red-500/50 transition cursor-pointer active:scale-95"
            >
              <span>UPGRADE CAR</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: ACTIVE DRIVERS                                                   */}
        {/* ========================================================================= */}
        <div
          onClick={() => {
            sound.playClick();
            onChangeView('team-management');
            onOpenTab('drivers');
          }}
          className="bg-[#111722] hover:bg-[#141d2c] border-2 border-slate-800 hover:border-blue-500/60 p-5 sm:p-6 rounded-2xl transition duration-200 group cursor-pointer shadow-xl flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                  DRIVERS
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">2 ACTIVE SEATS</span>
            </div>

            {/* Drivers List with Large Prominent Name and OVR */}
            <div className="space-y-3">
              {/* Driver 1 */}
              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PersonAvatar
                    seed={teamState.driver1.avatarSeed || teamState.driver1.name}
                    role="driver"
                    isTeamDriver={true}
                    teamPrimaryColor={teamState.primaryColor}
                    teamSecondaryColor={teamState.secondaryColor}
                    teamName={teamState.teamName}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CountryFlag
                        code={teamState.driver1.nationality.code}
                        name={teamState.driver1.nationality.name}
                        size="sm"
                      />
                      <span className="font-bold text-white font-racing text-base truncate">
                        {teamState.driver1.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Pace: {teamState.driver1.pace} • Craft: {teamState.driver1.raceCraft}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-black font-mono text-amber-400">
                    {teamState.driver1.overall}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-slate-400">OVR</div>
                </div>
              </div>

              {/* Driver 2 */}
              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <PersonAvatar
                    seed={teamState.driver2.avatarSeed || teamState.driver2.name}
                    role="driver"
                    isTeamDriver={true}
                    teamPrimaryColor={teamState.primaryColor}
                    teamSecondaryColor={teamState.secondaryColor}
                    teamName={teamState.teamName}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <CountryFlag
                        code={teamState.driver2.nationality.code}
                        name={teamState.driver2.nationality.name}
                        size="sm"
                      />
                      <span className="font-bold text-white font-racing text-base truncate">
                        {teamState.driver2.name}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Pace: {teamState.driver2.pace} • Craft: {teamState.driver2.raceCraft}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-black font-mono text-amber-400">
                    {teamState.driver2.overall}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-slate-400">OVR</div>
                </div>
              </div>
            </div>

            {/* Quick telemetry note */}
            <div className="mt-3 px-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Driver Market:</span>
              <span className="text-blue-400 font-semibold">{teamState.availableDrivers.length} Available Agents</span>
            </div>
          </div>

          {/* High-Impact View Driver Market Action Button */}
          <div className="mt-5 pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onChangeView('team-management');
                onOpenTab('drivers');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-racing font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 border border-blue-500/50 transition cursor-pointer active:scale-95"
            >
              <span>VIEW DRIVER MARKET</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: PIT CREW & TACTICS                                               */}
        {/* ========================================================================= */}
        <div
          onClick={() => {
            sound.playClick();
            onChangeView('team-management');
            onOpenTab('pitcrew');
          }}
          className="bg-[#111722] hover:bg-[#141d2c] border-2 border-slate-800 hover:border-amber-500/60 p-5 sm:p-6 rounded-2xl transition duration-200 group cursor-pointer shadow-xl flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                  PIT CREW
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">TACTICS & STOPS</span>
            </div>

            {/* Average Pit Stop Duration Display */}
            <div className="flex items-baseline gap-2 pb-3 border-b border-slate-800/80">
              <span className="text-4xl sm:text-5xl font-black font-mono text-amber-400 tracking-tight">
                ~{pitStopPreview.duration.toFixed(2)}s
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">AVG STOP</span>
            </div>

            {/* Crew Speed & Precision Stats */}
            <div className="mt-4 space-y-3 font-mono">
              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">CREW SPEED</span>
                  <span className="text-base font-black text-amber-400">{teamState.pitCrew.speed} <span className="text-[10px] text-slate-500 font-normal">/ 99</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${teamState.pitCrew.speed}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">PRECISION</span>
                  <span className="text-base font-black text-emerald-400">{teamState.pitCrew.precision} <span className="text-[10px] text-slate-500 font-normal">/ 99</span></span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${teamState.pitCrew.precision}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span className="truncate">Chief: <strong className="text-slate-200">{teamState.pitCrew.name}</strong></span>
                <span className="text-amber-400/90 font-bold">LVL {teamState.pitCrew.level || 1}</span>
              </div>
            </div>
          </div>

          {/* High-Impact Improve Pit Crew Action Button */}
          <div className="mt-5 pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onChangeView('team-management');
                onOpenTab('pitcrew');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-racing font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 border border-amber-500/50 transition cursor-pointer active:scale-95"
            >
              <span>IMPROVE PIT CREW</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 4: ACADEMY & SCOUTING                                               */}
        {/* ========================================================================= */}
        <div
          onClick={() => {
            sound.playClick();
            onChangeView('team-management');
            onOpenTab('academy');
          }}
          className="bg-[#111722] hover:bg-[#141d2c] border-2 border-slate-800 hover:border-emerald-500/60 p-5 sm:p-6 rounded-2xl transition duration-200 group cursor-pointer shadow-xl flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
                  ACADEMY SCOUTING
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-bold">YOUTH NETWORK</span>
            </div>

            {/* Prospects Count Display */}
            <div className="flex items-baseline gap-2 pb-3 border-b border-slate-800/80">
              <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
                {teamState.academyDrivers.length}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold uppercase">PROSPECTS</span>
            </div>

            {/* Scout Network Overview */}
            <div className="mt-4 space-y-3 font-mono">
              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">SCOUTS DEPLOYED</span>
                  <span className="text-base font-black text-emerald-400">
                    {teamState.scouts.length} <span className="text-[10px] text-slate-500 font-normal">/ {teamState.maxScouts} MAX</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (teamState.scouts.length / teamState.maxScouts) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#0b1018] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-300 uppercase">TALENT DISCOVERY</div>
                  <div className="text-[10px] text-emerald-400/90">Global Scouting Grids</div>
                </div>
                <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  S+ TIER ACTIVE
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span>Network Status:</span>
                <span className="text-emerald-400 font-bold">
                  {teamState.scouts.some((s) => s.isAssignedTo) ? 'Active Scanning' : 'Ready to Deploy'}
                </span>
              </div>
            </div>
          </div>

          {/* High-Impact Open Scouting Report Action Button */}
          <div className="mt-5 pt-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                onChangeView('team-management');
                onOpenTab('academy');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-racing font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 border border-emerald-500/50 transition cursor-pointer active:scale-95"
            >
              <span>OPEN SCOUTING REPORT</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
