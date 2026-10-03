/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { Navigation, MainView } from './components/Navigation';
import { MainMenu } from './components/MainMenu';
import { TeamManagement } from './components/TeamManagement';
import { Championship } from './components/Championship';
import { SeasonRecords } from './components/SeasonRecords';
import { HelpTutorial } from './components/HelpTutorial';
import { SaveSlotScreen } from './components/SaveSlotScreen';
import { TeamSelectionScreen, SelectedTeamConfig } from './components/TeamSelectionScreen';
import { SponsorModal } from './components/SponsorModal';
import { IntroCutscene } from './components/IntroCutscene';
import { VictoryCelebrationCutscene } from './components/VictoryCelebrationCutscene';
import { HomelessBankruptCutscene } from './components/HomelessBankruptCutscene';
import { CircuitAtmosphereBackground } from './components/CircuitAtmosphereBackground';
import { TeamState } from './types/game';
import { sound } from './utils/audio';
import {
  getActiveSlotId,
  setActiveSlotId,
  loadSlot,
  saveToSlot,
  deleteSlot,
  createFreshTeamState,
  createTeamStateFromConfig,
  getSlotStorageKey,
} from './utils/saveManager';

export default function App() {
  // Active Slot tracking
  const [activeSlotId, setActiveSlotIdState] = useState<number | null>(() => getActiveSlotId());

  // Audio mute state
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());

  // Initial State resolution
  const [teamState, setTeamState] = useState<TeamState>(() => {
    // 1. Try to load from active slot if one is actively selected
    const active = getActiveSlotId();
    if (active) {
      const slotData = loadSlot(active);
      if (slotData && slotData.teamState) {
        if (slotData.isMuted !== undefined) {
          sound.setIsMuted(slotData.isMuted);
        }
        return slotData.teamState;
      }
    }

    // 2. Default fresh initialization in memory (does NOT create or claim any slot automatically)
    return createFreshTeamState();
  });

  // Track if user has entered an active career
  const [hasStartedCareer, setHasStartedCareer] = useState<boolean>(() => {
    const active = getActiveSlotId();
    return active !== null && loadSlot(active) !== null;
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<MainView>('main-menu');
  const [teamTab, setTeamTab] = useState<'drivers' | 'strategist' | 'pitcrew' | 'car' | 'academy'>('drivers');
  const [championshipSubTab, setChampionshipSubTab] = useState<'race-day' | 'standings' | 'calendar' | 'auto-race'>('race-day');

  // Sponsor / Budget Injection Modal
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  // Victory Celebration Cutscene Modal / Fullscreen
  const [showCelebrationCutscene, setShowCelebrationCutscene] = useState(false);

  // Homeless & Bankrupt Cutscene Modal / Fullscreen test control
  const [showHomelessCutscene, setShowHomelessCutscene] = useState(false);

  // Full-screen Save Slot Screen control
  const [showSaveSlotScreen, setShowSaveSlotScreen] = useState<boolean>(false);
  const [isSaveSlotOverlay, setIsSaveSlotOverlay] = useState<boolean>(false);
  const [saveSlotSessionId, setSaveSlotSessionId] = useState<number>(0);

  // Full-screen Choose Your Team Screen control (slot ID being configured)
  const [teamSelectionSlotId, setTeamSelectionSlotId] = useState<number | null>(null);

  // Intro Cutscene State: plays on initial load, then goes directly to SaveSlotScreen
  const [showIntro, setShowIntro] = useState(true);
  const [introSkipPressStart, setIntroSkipPressStart] = useState(false);
  const isIntroReplayRef = useRef<boolean>(false);
  const returnViewAfterReplayRef = useRef<MainView>('main-menu');

  // Auto-save to active slot whenever teamState changes
  useEffect(() => {
    const currentActive = getActiveSlotId();
    if (!currentActive || !activeSlotId || currentActive !== activeSlotId) return;

    // Safety Guard: NEVER auto-save into a slot that does not exist in localStorage (was deleted)
    const key = getSlotStorageKey(currentActive);
    if (!localStorage.getItem(key)) return;

    try {
      saveToSlot(currentActive, teamState, isMuted);
    } catch (e) {
      console.warn('Auto-save error:', e);
    }
  }, [teamState, activeSlotId, isMuted]);

  // Periodic Auto-Save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentActive = getActiveSlotId();
      if (!currentActive || !activeSlotId || currentActive !== activeSlotId) return;

      const key = getSlotStorageKey(currentActive);
      if (!localStorage.getItem(key)) return;

      try {
        saveToSlot(currentActive, teamState, isMuted);
      } catch (e) {
        console.warn('Periodic auto-save error:', e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeSlotId, teamState, isMuted]);

  // Window beforeunload auto-save
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentActive = getActiveSlotId();
      if (!currentActive || !activeSlotId || currentActive !== activeSlotId) return;

      const key = getSlotStorageKey(currentActive);
      if (!localStorage.getItem(key)) return;

      try {
        saveToSlot(currentActive, teamState, isMuted);
      } catch (e) {
        // ignore beforeunload errors
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeSlotId, teamState, isMuted]);

  // Intro replay trigger
  const handleReplayIntro = () => {
    if (showIntro) return;
    sound.stopCutsceneAudio();
    isIntroReplayRef.current = true;
    returnViewAfterReplayRef.current = currentView;
    setIntroSkipPressStart(true);
    setShowIntro(true);
  };

  // Completion of Intro Cutscene
  const handleIntroComplete = () => {
    setShowIntro(false);
    setIntroSkipPressStart(false);

    if (isIntroReplayRef.current) {
      // Replay completed: return to previous view
      isIntroReplayRef.current = false;
      setCurrentView(returnViewAfterReplayRef.current || 'main-menu');
    } else {
      // First launch: show standalone full-screen Save Slot Screen (no game UI underneath)
      setIsSaveSlotOverlay(false);
      setTeamSelectionSlotId(null);
      setShowSaveSlotScreen(true);
    }
  };

  // Open Save Slot Screen from in-game (TopBar / MainMenu / TeamManagement)
  const handleOpenSaveSlots = () => {
    setActiveSlotIdState(getActiveSlotId());
    setSaveSlotSessionId((prev) => prev + 1);
    setIsSaveSlotOverlay(true);
    setTeamSelectionSlotId(null);
    setShowSaveSlotScreen(true);
  };

  // Close Save Slot Screen and re-sync active slot and team state from localStorage (Single Source of Truth)
  const handleCloseSaveSlots = () => {
    setShowSaveSlotScreen(false);
    const freshActiveId = getActiveSlotId();
    setActiveSlotIdState(freshActiveId);

    if (freshActiveId) {
      // Re-read current slot data from localStorage to ensure Main Hub, TopBar, and Nav are 100% in sync
      const slotData = loadSlot(freshActiveId);
      if (slotData && slotData.teamState) {
        setTeamState(slotData.teamState);
        if (slotData.isMuted !== undefined) {
          setIsMuted(slotData.isMuted);
          sound.setIsMuted(slotData.isMuted);
        }
        setHasStartedCareer(true);
      }
    } else {
      // Active slot was deleted while in Save Manager
      setHasStartedCareer(false);
    }
  };

  const handleViewChange = (view: MainView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    const currentActive = getActiveSlotId();
    if (currentActive && hasStartedCareer) {
      const key = getSlotStorageKey(currentActive);
      if (localStorage.getItem(key)) {
        saveToSlot(currentActive, teamState, muted);
      }
    }
  };

  const handleAddFunds = (amount: number, description: string, sponsorId?: string) => {
    setTeamState((prev) => ({
      ...prev,
      budget: prev.budget + amount,
      claimedSponsors: sponsorId
        ? Array.from(new Set([...(prev.claimedSponsors || []), sponsorId]))
        : (prev.claimedSponsors || []),
    }));
  };

  const handleOpenTeamTab = (tab: 'drivers' | 'strategist' | 'pitcrew' | 'car' | 'academy') => {
    setTeamTab(tab);
    setCurrentView('team-management');
  };

  // Handle Loading a Game from SaveSlotScreen
  const handleLoadGame = (loadedState: TeamState, slotId: number, isMutedSaved: boolean) => {
    setTeamState(loadedState);
    setActiveSlotIdState(slotId);
    setActiveSlotId(slotId);
    setIsMuted(isMutedSaved);
    sound.setIsMuted(isMutedSaved);
    setHasStartedCareer(true);
    setTeamSelectionSlotId(null);
    setShowSaveSlotScreen(false);
    setCurrentView('main-menu');
  };

  // Handle Starting a New Career in a chosen Slot -> Open Choose Your Team screen
  const handleStartNewGame = (slotId: number) => {
    setShowSaveSlotScreen(false);
    setTeamSelectionSlotId(slotId);
  };

  // Handle Resetting career after Bankruptcy & Homeless cutscene ("เริ่มเกมใหม่ทั้งหมด")
  const handleResetFromBankruptcy = () => {
    sound.playCash();
    const currentActive = getActiveSlotId() || 1;
    deleteSlot(currentActive);
    const fresh = createFreshTeamState();
    fresh.totalCarCrashesCount = 0;
    fresh.totalP12FinishesCount = 0;
    fresh.isBankruptHomeless = false;
    fresh.bankruptHomelessReason = null;
    setTeamState(fresh);
    setTeamSelectionSlotId(currentActive);
    setShowSaveSlotScreen(false);
    setCurrentView('main-menu');
  };

  // Handle returning from Team Selection back to Save Slot Screen
  const handleBackToSaveSlots = () => {
    setTeamSelectionSlotId(null);
    setShowSaveSlotScreen(true);
  };

  // Handle confirming team selection (preset or custom) and launching career
  const handleSelectTeam = (config: SelectedTeamConfig) => {
    if (!teamSelectionSlotId) return;

    const slotId = teamSelectionSlotId;
    const newTeamState = createTeamStateFromConfig(config);

    setTeamState(newTeamState);
    setActiveSlotIdState(slotId);
    setActiveSlotId(slotId);
    saveToSlot(slotId, newTeamState, isMuted);
    setHasStartedCareer(true);
    setTeamSelectionSlotId(null);
    setShowSaveSlotScreen(false);
    setCurrentView('main-menu');
  };

  // Handle deleting a slot: if currently active slot is deleted, clear active slot and stop auto-saving
  const handleDeleteSlot = (slotId: number) => {
    const freshActive = getActiveSlotId();
    setActiveSlotIdState(freshActive);
    if (activeSlotId === slotId || freshActive === null) {
      setActiveSlotIdState(null);
      setActiveSlotId(null);
      setHasStartedCareer(false);
    }
  };

  // Handle saving current state to a slot from SaveSlotScreen
  const handleSaveToSlot = (slotId: number) => {
    setActiveSlotIdState(slotId);
    setActiveSlotId(slotId);
    setHasStartedCareer(true);
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white relative overflow-x-hidden">
      {/* Dynamic 5-Second Cycling Circuit Atmosphere Background ("แก้ไข background ที่เป็น tiles พื้นหลังหน้าต่างๆ ให้เป็นหน้า background ของสถานที่ต่างๆในสนามแข่ง และเป็นเวลาทุก 5 วิไปเรื่อยๆ") */}
      <CircuitAtmosphereBackground />

      {/* 1. Intro Cutscene on Launch & Replay */}
      {showIntro && (
        <IntroCutscene
          onComplete={handleIntroComplete}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          skipPressStart={introSkipPressStart}
        />
      )}

      {/* 2. Standalone Full-Screen Save Slot Screen */}
      {showSaveSlotScreen && teamSelectionSlotId === null && (
        <SaveSlotScreen
          key={`saveslot-session-${saveSlotSessionId}-${activeSlotId || 'none'}`}
          currentTeamState={teamState}
          activeSlotId={activeSlotId}
          isMuted={isMuted}
          onLoadGame={handleLoadGame}
          onStartNewGame={handleStartNewGame}
          onDeleteSlot={handleDeleteSlot}
          onSaveToSlot={handleSaveToSlot}
          onClose={handleCloseSaveSlots}
          isOverlayMode={isSaveSlotOverlay}
        />
      )}

      {/* 2b. Standalone Full-Screen Choose Your Team Screen */}
      {teamSelectionSlotId !== null && (
        <TeamSelectionScreen
          slotId={teamSelectionSlotId}
          onSelectTeam={handleSelectTeam}
          onBack={handleBackToSaveSlots}
        />
      )}

      {/* 3. Main Game Interface (Hidden during initial Save Slot selection & Team Selection) */}
      {(!showSaveSlotScreen || isSaveSlotOverlay) && teamSelectionSlotId === null && (
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Top Header Bar */}
          <TopBar
            budget={teamState.budget}
            teamName={teamState.teamName}
            logoShape={teamState.logoShape}
            primaryColor={teamState.primaryColor}
            secondaryColor={teamState.secondaryColor}
            currentRound={teamState.currentRound}
            totalRaces={teamState.totalRaces}
            onOpenSponsorModal={() => setIsSponsorModalOpen(true)}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />

          {/* Main Navigation: Main Menu, Team Management, Championship, Records, Help Tutorial + Utility Icons */}
          <Navigation
            currentView={currentView}
            onChangeView={handleViewChange}
            onOpenSaveSlots={handleOpenSaveSlots}
            onReplayIntro={handleReplayIntro}
            activeSlotId={activeSlotId}
          />

          {/* Main Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
            {currentView === 'main-menu' && (
              <MainMenu
                teamState={teamState}
                onChangeView={handleViewChange}
                onOpenTab={handleOpenTeamTab}
                onReplayIntro={handleReplayIntro}
                onOpenSaveSlots={handleOpenSaveSlots}
                isIntroActive={showIntro}
                onOpenChampionshipSubTab={(sub) => {
                  setChampionshipSubTab(sub);
                  handleViewChange('championship');
                }}
              />
            )}

            {currentView === 'team-management' && (
              <TeamManagement
                teamState={teamState}
                onUpdateTeamState={setTeamState}
                activeTab={teamTab}
                onTabChange={(tab) => setTeamTab(tab)}
                onOpenSaveSlots={handleOpenSaveSlots}
              />
            )}

            {currentView === 'championship' && (
              <Championship
                teamState={teamState}
                onUpdateTeamState={setTeamState}
                onChangeView={handleViewChange}
                initialSubTab={championshipSubTab}
              />
            )}

            {currentView === 'records' && (
              <SeasonRecords
                teamState={teamState}
                onUpdateTeamState={setTeamState}
                onChangeView={handleViewChange}
              />
            )}

            {currentView === 'help-tutorial' && <HelpTutorial />}
          </main>

          {/* Sponsor Cash Injection Modal */}
          <SponsorModal
            isOpen={isSponsorModalOpen}
            onClose={() => setIsSponsorModalOpen(false)}
            onAddFunds={handleAddFunds}
            currentBudget={teamState.budget}
            claimedSponsors={teamState.claimedSponsors || []}
          />

          {/* Final Victory Celebration Cutscene Modal */}
          {showCelebrationCutscene && (
            <VictoryCelebrationCutscene
              teamState={teamState}
              onClose={() => setShowCelebrationCutscene(false)}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              forceShowcaseTrophies={true}
            />
          )}

          {/* Homeless & Bankrupt Cutscene Modal ("ทำรถพังเกิน 20 ครั้ง หรือได้อันดับที่ 12 3 ครั้ง" หรือปุ่มเทส) */}
          {(showHomelessCutscene ||
            teamState.isBankruptHomeless ||
            (teamState.totalCarCrashesCount || 0) >= 20 ||
            (teamState.totalP12FinishesCount || 0) >= 3) && (
            <HomelessBankruptCutscene
              teamState={teamState}
              onResetCareer={() => {
                setShowHomelessCutscene(false);
                handleResetFromBankruptcy();
              }}
              onSimulateDismiss={() => {
                setShowHomelessCutscene(false);
                setTeamState((prev) => ({
                  ...prev,
                  isBankruptHomeless: false,
                }));
              }}
            />
          )}

          {/* Footer */}
          <footer className="border-t border-slate-800/80 bg-[#0a0d13]/90 py-4 px-4 text-center text-xs text-slate-500 font-mono">
            <p>Apex Grand Prix Manager • 2026 Season • 6 Career Slots Available</p>
          </footer>
        </div>
      )}
    </div>
  );
}
