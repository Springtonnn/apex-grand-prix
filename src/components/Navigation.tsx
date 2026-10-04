import React, { useState, useRef, useEffect } from 'react';
import { Users, Trophy, Home, Award, Save, Play, MoreHorizontal, HelpCircle } from 'lucide-react';
import { sound } from '../utils/audio';

export type MainView = 'main-menu' | 'team-management' | 'championship' | 'records' | 'help-tutorial';

interface NavigationProps {
  currentView: MainView;
  onChangeView: (view: MainView) => void;
  onOpenSaveSlots?: () => void;
  onReplayIntro?: () => void;
  activeSlotId?: number | null;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onChangeView,
  onOpenSaveSlots,
  onReplayIntro,
  activeSlotId,
}) => {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  // Close overflow menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (overflowRef.current && !overflowRef.current.contains(event.target as Node)) {
        setIsOverflowOpen(false);
      }
    }
    if (isOverflowOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOverflowOpen]);

  const navItems = [
    {
      id: 'main-menu' as MainView,
      label: 'Main Menu',
      icon: Home,
    },
    {
      id: 'team-management' as MainView,
      label: 'Team Management',
      icon: Users,
    },
    {
      id: 'championship' as MainView,
      label: 'Championship',
      icon: Trophy,
    },
    {
      id: 'records' as MainView,
      label: 'Records & Standings',
      icon: Award,
    },
  ];

  return (
    <nav className="bg-[#080c14]/70 backdrop-blur-md border-b border-slate-800/60 px-4 lg:px-8 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: 4 Primary Text Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onChangeView(item.id);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-racing text-xs sm:text-sm tracking-wide uppercase transition duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-700/30 border border-red-500/40 font-bold'
                    : 'bg-[#141b25]/60 hover:bg-[#1a2330]/80 text-slate-300 hover:text-white border border-slate-800/60 backdrop-blur-xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : item.id === 'records' ? 'text-amber-400' : 'text-red-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Utility Icons (Separated by subtle vertical divider) */}
        <div className="flex items-center gap-2 pl-2">
          {/* Subtle vertical divider */}
          <div className="hidden sm:block h-5 w-px bg-slate-800/90 mr-1"></div>

          {/* Desktop Utility Icons */}
          <div className="hidden sm:flex items-center gap-1.5">
            {/* Save Slots Utility Button */}
            {onOpenSaveSlots && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenSaveSlots();
                }}
                title={`Career Save Manager • Current: Career Slot ${activeSlotId || 1}`}
                aria-label="Career Save Manager"
                className="relative p-2 rounded-lg bg-[#141b25]/60 hover:bg-[#1c2635]/80 text-slate-400 hover:text-amber-300 border border-slate-800/70 hover:border-amber-500/40 transition cursor-pointer group backdrop-blur-xs"
              >
                <Save className="w-4 h-4 text-amber-400/80 group-hover:text-amber-300 group-hover:scale-105 transition" />
                {activeSlotId && (
                  <span className="absolute -top-1 -right-1 text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded-full leading-none">
                    {activeSlotId}
                  </span>
                )}
              </button>
            )}

            {/* Help Tutorial Button ("?") directly next to Save */}
            <button
              onClick={() => {
                sound.playClick();
                onChangeView('help-tutorial');
              }}
              title="Help Tutorial & Game Guide (วิธีเล่นและคู่มือ)"
              aria-label="Help Tutorial and Game Guide"
              className={`p-2 rounded-lg transition cursor-pointer group flex items-center justify-center ${
                currentView === 'help-tutorial'
                  ? 'bg-blue-600 text-white border border-blue-400 font-bold shadow-md shadow-blue-950'
                  : 'bg-[#141b25]/60 hover:bg-[#1c2635]/80 text-blue-400 hover:text-blue-300 border border-slate-800/70 hover:border-blue-500/40 backdrop-blur-xs'
              }`}
            >
              <HelpCircle className="w-4 h-4 group-hover:scale-110 transition" />
            </button>

            {/* Watch Intro Utility Button */}
            {onReplayIntro && (
              <button
                onClick={() => {
                  sound.playClick();
                  onReplayIntro();
                }}
                title="Watch Intro Cutscene"
                aria-label="Watch Intro Cutscene"
                className="p-2 rounded-lg bg-[#141b25]/60 hover:bg-[#1c2635]/80 text-slate-400 hover:text-white border border-slate-800/70 hover:border-slate-600 transition cursor-pointer group backdrop-blur-xs"
              >
                <Play className="w-4 h-4 text-slate-400 group-hover:text-amber-400 fill-current/20 group-hover:scale-105 transition" />
              </button>
            )}
          </div>

          {/* Mobile Utility Overflow Menu ("...") */}
          <div className="sm:hidden relative" ref={overflowRef}>
            <button
              onClick={() => {
                sound.playClick();
                setIsOverflowOpen(!isOverflowOpen);
              }}
              title="More Utilities"
              aria-label="More utilities menu"
              className="p-2 rounded-lg bg-[#141b25]/60 hover:bg-[#1c2635]/80 border border-slate-800/70 text-slate-400 hover:text-white transition cursor-pointer backdrop-blur-xs"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isOverflowOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#111722]/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                {onOpenSaveSlots && (
                  <button
                    onClick={() => {
                      setIsOverflowOpen(false);
                      sound.playClick();
                      onOpenSaveSlots();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-racing uppercase text-slate-300 hover:text-amber-300 hover:bg-slate-800/60 transition cursor-pointer text-left"
                  >
                    <Save className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>CAREER SLOTS {activeSlotId ? `(SLOT ${activeSlotId})` : ''}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOverflowOpen(false);
                    sound.playClick();
                    onChangeView('help-tutorial');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-racing uppercase text-blue-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer text-left"
                >
                  <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>HELP TUTORIAL (?)</span>
                </button>
                {onReplayIntro && (
                  <button
                    onClick={() => {
                      setIsOverflowOpen(false);
                      sound.playClick();
                      onReplayIntro();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-racing uppercase text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer text-left"
                  >
                    <Play className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>WATCH INTRO</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
