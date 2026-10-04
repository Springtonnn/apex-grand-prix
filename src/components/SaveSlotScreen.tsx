import React, { useState, useEffect } from 'react';
import {
  Save,
  Trash2,
  Plus,
  Clock,
  Trophy,
  CheckCircle,
  AlertTriangle,
  Flame,
  Sparkles,
  X,
} from 'lucide-react';
import { TeamState } from '../types/game';
import {
  TOTAL_SAVE_SLOTS,
  SlotSummary,
  loadAllSlotsFromStorage,
  saveToSlot,
  deleteSlot,
  loadSlot,
  getActiveSlotId,
} from '../utils/saveManager';
import { formatMoney } from '../utils/calculations';
import { sound } from '../utils/audio';
import { CountryFlag } from './CountryFlag';
import { TeamLogo } from './TeamLogo';
import { PersonAvatar } from './PersonAvatar';

interface SaveSlotScreenProps {
  currentTeamState: TeamState | null;
  activeSlotId: number | null;
  isMuted: boolean;
  onLoadGame: (loadedState: TeamState, slotId: number, isMutedSaved: boolean) => void;
  onStartNewGame: (slotId: number) => void;
  onDeleteSlot?: (slotId: number) => void;
  onSaveToSlot?: (slotId: number) => void;
  onClose?: () => void;
  isOverlayMode?: boolean; // True if opened during gameplay from TopBar/MainMenu
}

export const SaveSlotScreen: React.FC<SaveSlotScreenProps> = ({
  currentTeamState,
  activeSlotId,
  isMuted,
  onLoadGame,
  onStartNewGame,
  onDeleteSlot,
  onSaveToSlot,
  onClose,
  isOverlayMode = false,
}) => {
  const [slots, setSlots] = useState<SlotSummary[]>(() => loadAllSlotsFromStorage());
  const [currentActiveSlot, setCurrentActiveSlot] = useState<number | null>(() => getActiveSlotId());
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals for confirmation
  const [deleteConfirmSlot, setDeleteConfirmSlot] = useState<number | null>(null);
  const [overwriteConfirmSlot, setOverwriteConfirmSlot] = useState<number | null>(null);

  const refreshSlotSummaries = () => {
    const list = loadAllSlotsFromStorage();
    setSlots(list);
    setCurrentActiveSlot(getActiveSlotId());
  };

  useEffect(() => {
    refreshSlotSummaries();
  }, [activeSlotId]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Format timestamp into readable date and time
  const formatSaveTimestamp = (ts?: number) => {
    if (!ts) return 'Never';
    const date = new Date(ts);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Load a save slot
  const handleLoadSlot = (slotId: number) => {
    sound.playClick();
    const data = loadSlot(slotId);
    if (!data) {
      showToast(`Cannot load Slot ${slotId}: Save data not found or damaged.`, 'error');
      return;
    }

    showToast(`Loaded Slot ${slotId} successfully!`, 'success');
    onLoadGame(data.teamState, slotId, data.isMuted);
  };

  // Start new game in slot
  const handleNewGameInSlot = (slotId: number) => {
    sound.playClick();
    onStartNewGame(slotId);
  };

  // Save current game into slot (either empty or overwrite)
  const handleSaveCurrentIntoSlot = (slotId: number) => {
    if (!currentTeamState) {
      showToast('No active game session to save.', 'error');
      return;
    }

    sound.playUpgrade();
    const res = saveToSlot(slotId, currentTeamState, isMuted);
    if (res.success) {
      setCurrentActiveSlot(slotId);
      if (onSaveToSlot) {
        onSaveToSlot(slotId);
      }
      const freshList = loadAllSlotsFromStorage();
      setSlots(freshList);
      showToast(`Saved current progress to Slot ${slotId}!`, 'success');
      setOverwriteConfirmSlot(null);
    } else {
      showToast(res.error || 'Failed to save to slot.', 'error');
    }
  };

  // Delete slot: removes from localStorage and immediately refreshes from storage
  const handleDeleteSlot = (slotId: number) => {
    sound.playClick();
    const res = deleteSlot(slotId);
    if (res.success) {
      if (currentActiveSlot === slotId) {
        setCurrentActiveSlot(null);
      }
      if (onDeleteSlot) {
        onDeleteSlot(slotId);
      }
      // Re-read directly from localStorage immediately
      const freshList = loadAllSlotsFromStorage();
      setSlots(freshList);
      showToast(`Slot ${slotId} has been deleted.`, 'info');
      setDeleteConfirmSlot(null);
    } else {
      showToast('Failed to delete slot.', 'error');
    }
  };

  // Handle closing modal
  const handleClose = () => {
    sound.playClick();
    setSlots([]); // Purge any in-memory list to prevent state retention
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070a0f] text-slate-100 flex flex-col font-sans select-none">
      {/* Background Ambience: Vignette, checkered accents and dark red glow */}
      <div className="fixed inset-0 bg-checkered-flag bg-fixed opacity-20 pointer-events-none"></div>
      <div className="fixed inset-0 bg-radial-vignette pointer-events-none"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-red-600/10 blur-[130px] pointer-events-none"></div>

      {/* Clean "X" close icon button for in-game modal mode (only visible during overlay mode) */}
      {isOverlayMode && onClose && (
        <button
          onClick={handleClose}
          className="fixed top-5 right-5 sm:top-6 sm:right-8 z-50 p-2.5 rounded-xl bg-[#141b25]/90 hover:bg-[#1f2a3a] border border-slate-700/80 hover:border-red-500/50 text-slate-400 hover:text-white transition shadow-2xl cursor-pointer active:scale-95 backdrop-blur-md group"
          title="Close Save Manager"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
        </button>
      )}

      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl border shadow-2xl flex items-center gap-3 font-mono text-sm backdrop-blur-md animate-in slide-in-from-top-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500 text-emerald-200 shadow-emerald-950/80'
              : notification.type === 'error'
              ? 'bg-red-950/95 border-red-500 text-red-200 shadow-red-950/80'
              : 'bg-amber-950/95 border-amber-500 text-amber-200 shadow-amber-950/80'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-between">
        {/* Screen Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-mono uppercase tracking-widest shadow-lg shadow-red-950/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>APEX SAVE STATION • 6 CAREER SLOTS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-racing uppercase tracking-tight text-white drop-shadow-md">
            SELECT YOUR CAREER
          </h1>

          <p className="text-slate-400 text-sm sm:text-base font-sans">
            Continue an existing racing career, or start fresh in an open slot.
          </p>
        </div>

        {/* 6 Save Slots Grid (2 rows x 3 columns on wide screens, 1 col on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 my-auto">
          {slots.map((slot) => {
            const isSlotActive = currentActiveSlot === slot.slotId;
            const isEmpty = slot.isEmpty;

            if (isEmpty) {
              return (
                <div
                  key={slot.slotId}
                  className="group relative rounded-2xl border-2 border-dashed border-slate-800/90 hover:border-red-500/60 bg-[#0c1017]/70 hover:bg-[#111722]/90 p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between min-h-[300px] shadow-xl hover:shadow-2xl hover:shadow-red-950/20 backdrop-blur-sm"
                >
                  {/* Slot Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-racing font-bold text-lg text-slate-400 group-hover:text-red-400 tracking-wider">
                        SLOT {slot.slotId.toString().padStart(2, '0')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800/80 text-slate-400 border border-slate-700/50">
                        EMPTY
                      </span>
                    </div>
                  </div>

                  {/* Slot Body (Empty) */}
                  <div className="my-auto py-6 flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full bg-slate-800/60 border border-slate-700/60 group-hover:border-red-500/60 flex items-center justify-center text-slate-400 group-hover:text-red-400 group-hover:scale-110 transition duration-200 mb-3 shadow-inner">
                      <Plus className="w-7 h-7" />
                    </div>
                    <h3 className="font-racing font-bold text-base text-slate-300 group-hover:text-white tracking-wide uppercase">
                      EMPTY SLOT
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-[24ch]">
                      No career data recorded yet in this career slot.
                    </p>
                  </div>

                  {/* Slot Actions */}
                  <div className="space-y-2 pt-3 border-t border-slate-800/60">
                    <button
                      onClick={() => handleNewGameInSlot(slot.slotId)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-racing font-bold text-xs uppercase tracking-wider shadow-md shadow-red-950/60 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>START NEW CAREER</span>
                    </button>

                    {isOverlayMode && currentTeamState && (
                      <button
                        onClick={() => handleSaveCurrentIntoSlot(slot.slotId)}
                        className="w-full py-2 rounded-xl bg-[#14231b] hover:bg-[#1b3024] border border-emerald-500/40 text-emerald-300 font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Save className="w-3.5 h-3.5 text-emerald-400" />
                        <span>SAVE CURRENT GAME HERE</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            // Occupied Slot
            return (
              <div
                key={slot.slotId}
                className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between min-h-[300px] p-5 sm:p-6 shadow-2xl backdrop-blur-md ${
                  isSlotActive
                    ? 'border-emerald-500/80 bg-gradient-to-b from-[#131d1a] via-[#0f1715] to-[#0c1210] shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                    : 'border-slate-800 hover:border-red-600/60 bg-gradient-to-b from-[#141b26] via-[#101620] to-[#0c1017] hover:shadow-2xl hover:shadow-red-950/20'
                }`}
              >
                {/* Slot Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-racing font-bold text-lg text-white tracking-wider">
                      SLOT {slot.slotId.toString().padStart(2, '0')}
                    </span>
                    {isSlotActive ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        ACTIVE SLOT
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700/60">
                        SAVED
                      </span>
                    )}
                  </div>

                  {/* Delete Button (Only Delete, No Download Button) */}
                  <button
                    onClick={() => setDeleteConfirmSlot(slot.slotId)}
                    title="Delete this save"
                    className="w-7 h-7 rounded-lg bg-[#221518] hover:bg-red-900/60 text-slate-400 hover:text-red-300 flex items-center justify-center transition cursor-pointer border border-red-900/40 active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Slot Body: Team info & Driver previews */}
                <div className="py-3 space-y-3">
                  {/* Team Header with Logo and Name */}
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TeamLogo
                        teamName={slot.teamName || 'Apex GP Racing'}
                        shape={slot.logoShape}
                        primaryColor={slot.primaryColor || '#DC2626'}
                        secondaryColor={slot.secondaryColor || '#111827'}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <h3 className="font-racing font-bold text-base sm:text-lg text-white truncate">
                          {slot.teamName || 'Apex GP Racing'}
                        </h3>
                        {slot.primaryColor && slot.secondaryColor && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: slot.primaryColor }}
                            />
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: slot.secondaryColor }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {slot.trophies !== undefined && slot.trophies > 0 && (
                      <div className="flex items-center gap-1 text-amber-400 font-mono text-xs shrink-0">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{slot.trophies}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-[#0c1017]/80 rounded-xl p-2.5 border border-slate-800/80 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Round</span>
                      <span className="text-slate-200 font-bold">
                        Round {slot.currentRound ?? 1} / {slot.totalRaces ?? 8}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Budget</span>
                      <span className="text-emerald-400 font-bold truncate block">
                        {formatMoney(slot.budget ?? 0)}
                      </span>
                    </div>
                  </div>

                  {/* Driver Roster Preview with Country Flags and Team Suits */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Featured Drivers:
                    </span>
                    {slot.driver1 && (
                      <div className="flex items-center justify-between bg-[#121824]/90 px-2.5 py-1.5 rounded-lg border border-slate-800/60 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <PersonAvatar
                            seed={slot.driver1.avatarSeed}
                            role="driver"
                            isTeamDriver={true}
                            teamPrimaryColor={slot.primaryColor}
                            teamSecondaryColor={slot.secondaryColor}
                            teamName={slot.teamName}
                            size="xs"
                          />
                          <CountryFlag code={slot.driver1.nationality} size="sm" />
                          <span className="text-slate-200 font-semibold truncate">
                            {slot.driver1.name}
                          </span>
                        </div>
                        <span className="font-mono text-amber-400 font-bold shrink-0 ml-1">
                          {slot.driver1.overall} OVR
                        </span>
                      </div>
                    )}
                    {slot.driver2 && (
                      <div className="flex items-center justify-between bg-[#121824]/90 px-2.5 py-1.5 rounded-lg border border-slate-800/60 text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <PersonAvatar
                            seed={slot.driver2.avatarSeed}
                            role="driver"
                            isTeamDriver={true}
                            teamPrimaryColor={slot.primaryColor}
                            teamSecondaryColor={slot.secondaryColor}
                            teamName={slot.teamName}
                            size="xs"
                          />
                          <CountryFlag code={slot.driver2.nationality} size="sm" />
                          <span className="text-slate-200 font-semibold truncate">
                            {slot.driver2.name}
                          </span>
                        </div>
                        <span className="font-mono text-amber-400 font-bold shrink-0 ml-1">
                          {slot.driver2.overall} OVR
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 pt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Saved: {formatSaveTimestamp(slot.timestamp)}</span>
                  </div>
                </div>

                {/* Slot Actions */}
                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleLoadSlot(slot.slotId)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-racing font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span>LOAD CAREER →</span>
                  </button>

                  {isOverlayMode && currentTeamState && (
                    <button
                      onClick={() => setOverwriteConfirmSlot(slot.slotId)}
                      className="w-full py-2 rounded-xl bg-[#182333] hover:bg-[#202f45] border border-slate-700 text-slate-200 hover:text-white font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-400" />
                      <span>OVERWRITE WITH CURRENT</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info line */}
        <div className="text-center text-xs font-mono text-slate-500 pt-8">
          Apex Grand Prix Manager • 6-Slot LocalStorage Save Architecture • Auto-Save Enabled
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmSlot !== null && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-red-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-racing font-bold text-xl text-center text-white uppercase tracking-wider">
              Delete Save Slot {deleteConfirmSlot}?
            </h3>
            <p className="text-slate-300 text-sm text-center mt-2 leading-relaxed">
              Delete this save? This cannot be undone. All career progression, drivers, and championship points stored in this slot will be erased permanently.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteConfirmSlot(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleDeleteSlot(deleteConfirmSlot)}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-red-950"
              >
                DELETE SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overwrite Confirmation Modal */}
      {overwriteConfirmSlot !== null && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-amber-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Save className="w-6 h-6" />
            </div>
            <h3 className="font-racing font-bold text-xl text-center text-white uppercase tracking-wider">
              Overwrite Slot {overwriteConfirmSlot}?
            </h3>
            <p className="text-slate-300 text-sm text-center mt-2 leading-relaxed">
              Are you sure you want to overwrite Slot {overwriteConfirmSlot} with your current in-game progress? The previous data saved in this slot will be replaced.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => setOverwriteConfirmSlot(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => handleSaveCurrentIntoSlot(overwriteConfirmSlot)}
                className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-racing font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-950"
              >
                CONFIRM OVERWRITE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
