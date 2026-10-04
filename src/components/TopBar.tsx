import React from 'react';
import { Plus, Volume2, VolumeX } from 'lucide-react';
import { formatMoney } from '../utils/calculations';
import { sound } from '../utils/audio';
import { TeamLogo } from './TeamLogo';
import { LogoShape } from '../types/game';

interface TopBarProps {
  budget: number;
  teamName: string;
  logoShape?: LogoShape;
  primaryColor?: string;
  secondaryColor?: string;
  currentRound: number;
  totalRaces: number;
  onOpenSponsorModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  budget,
  teamName,
  logoShape,
  primaryColor,
  secondaryColor,
  currentRound,
  totalRaces,
  onOpenSponsorModal,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="border-b border-red-950/30 bg-[#080c14]/75 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Concise Brand Identity */}
        <div className="flex items-center gap-3">
          <TeamLogo
            teamName={teamName}
            shape={logoShape}
            primaryColor={primaryColor || '#DC2626'}
            secondaryColor={secondaryColor || '#111827'}
            size="md"
          />
          <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
            <span className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-white font-racing">
              {teamName}
            </span>
            <span className="text-xs bg-red-600/20 text-red-400 font-mono px-2 py-0.5 rounded border border-red-500/30 font-semibold backdrop-blur-xs">
              PRO MANAGER
            </span>
            <span className="text-slate-600 font-mono text-xs hidden sm:inline">•</span>
            <span className="text-xs font-mono font-medium text-slate-400 flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: primaryColor || '#10B981' }}
              ></span>
              <span>ROUND {currentRound} / {totalRaces}</span>
            </span>
          </div>
        </div>

        {/* Right Info: Clean Team Budget (with + button) & Audio Toggle with refined spacing */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Budget Widget with Plus button */}
          <div className="flex items-center gap-2 bg-[#101620]/65 border border-emerald-500/40 px-3.5 py-1.5 rounded-lg shadow-inner backdrop-blur-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-mono block">
                TEAM BUDGET
              </span>
              <span className={`text-base sm:text-lg font-bold font-mono tracking-tight ${budget < 1_000_000 ? 'text-amber-400' : 'text-emerald-300'}`}>
                {formatMoney(budget)}
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onOpenSponsorModal();
              }}
              title="Add Sponsor Funds"
              className="ml-1 w-8 h-8 rounded-md bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center font-bold transition shadow-md shadow-emerald-900/50 cursor-pointer active:scale-95"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={() => {
              onToggleMute();
              sound.playClick();
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-9 h-9 rounded-lg bg-[#141b24]/65 hover:bg-[#1c2633]/80 border border-slate-700/60 text-slate-300 flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-red-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
