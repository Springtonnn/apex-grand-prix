import { TeamState, Driver, CarStats, LogoShape } from '../types/game';
import { INITIAL_TEAM_STATE, AVAILABLE_SCOUT_CANDIDATES } from '../data/initialData';
import { buildChampionshipStandingsForTeam } from '../data/presetTeams';
import { calculateCarOverall, calcDriverPrice } from './calculations';
import { initializeSeasonRecords } from './seasonRecordsManager';
import { getFixedWorldTourCalendar, getOrInitializeSeasonCircuits } from '../data/circuitPool';

export const SAVE_VERSION = 1;
export const TOTAL_SAVE_SLOTS = 6;
export const SLOT_PREFIX = 'apexgp_slot_';
export const ACTIVE_SLOT_KEY = 'apexgp_active_slot';
export const LEGACY_KEY = 'apex_gp_team_state';

export interface SaveSlotData {
  saveVersion: number;
  slotId: number;
  timestamp: number;
  teamState: TeamState;
  isMuted: boolean;
  notes?: string;
}

export interface SlotSummary {
  slotId: number;
  isEmpty: boolean;
  timestamp?: number;
  teamName?: string;
  logoShape?: LogoShape;
  primaryColor?: string;
  secondaryColor?: string;
  budget?: number;
  currentRound?: number;
  totalRaces?: number;
  trophies?: number;
  driver1?: Driver;
  driver2?: Driver;
  carOverall?: number;
  saveData?: SaveSlotData;
}

export function getSlotStorageKey(slotId: number): string {
  return `${SLOT_PREFIX}${slotId}`;
}

export function getActiveSlotId(): number | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SLOT_KEY);
    if (!raw) return null;
    const num = parseInt(raw, 10);
    return isNaN(num) || num < 1 || num > TOTAL_SAVE_SLOTS ? null : num;
  } catch (e) {
    console.warn('Could not read active slot from localStorage:', e);
    return null;
  }
}

export function setActiveSlotId(slotId: number | null): void {
  try {
    if (slotId === null) {
      localStorage.removeItem(ACTIVE_SLOT_KEY);
    } else {
      localStorage.setItem(ACTIVE_SLOT_KEY, slotId.toString());
    }
  } catch (e) {
    console.warn('Could not save active slot to localStorage:', e);
  }
}

export function normalizeDriverPricing(d: Driver): Driver {
  if (!d) return d;
  const p = calcDriverPrice(d.overall, {
    seed: d.avatarSeed || d.id || d.name,
    age: d.age,
    pace: d.pace,
    experience: d.experience,
  });
  return {
    ...d,
    salary: p.salary,
    buyoutCost: p.buyout,
  };
}

/**
 * Normalizes candidates and timestamps to ensure market countdowns are valid
 */
export function normalizeCandidateItem(item: any, fallbackSeconds: number, now: number = Date.now()) {
  return {
    ...item,
    avatarSeed: item.avatarSeed || `${item.name}-${item.id}`,
    expiresAt:
      typeof item.expiresAt === 'number' && item.expiresAt > now
        ? item.expiresAt
        : now + fallbackSeconds * 1000,
  };
}

/**
 * Creates a fresh, deep-copied initial TeamState with fresh market expiry countdowns
 */
export function createFreshTeamState(): TeamState {
  const now = Date.now();
  const freshState: TeamState = JSON.parse(JSON.stringify(INITIAL_TEAM_STATE));

  freshState.availableDrivers = freshState.availableDrivers.map((d, idx) =>
    normalizeCandidateItem(d, 300 - idx * 20, now)
  );
  freshState.availableStrategists = freshState.availableStrategists.map((s, idx) =>
    normalizeCandidateItem(s, 300 - idx * 30, now)
  );
  freshState.availablePitCrews = freshState.availablePitCrews.map((c, idx) =>
    normalizeCandidateItem(c, 300 - idx * 30, now)
  );
  freshState.availableScouts = AVAILABLE_SCOUT_CANDIDATES.map((s, idx) =>
    normalizeCandidateItem(s, 300 - idx * 25, now)
  );

  freshState.currentSeasonNumber = 1;
  freshState.currentRound = 1;
  freshState.totalRaces = 18;
  freshState.trophies = 0;
  freshState.seasonCircuits = getFixedWorldTourCalendar(1);
  freshState.seasonRecords = initializeSeasonRecords(freshState);

  return freshState;
}

/**
 * Creates a fresh TeamState customized by player's team selection (preset or custom)
 */
export function createTeamStateFromConfig(config: {
  teamName: string;
  logoShape?: LogoShape;
  primaryColor?: string;
  secondaryColor?: string;
  teamType?: 'preset' | 'custom';
  teamPresetId?: string;
  budget: number;
  carStats: CarStats;
  driver1: Driver;
  driver2: Driver;
}): TeamState {
  const fresh = createFreshTeamState();
  fresh.teamName = config.teamName;
  fresh.logoShape = config.logoShape;
  fresh.primaryColor = config.primaryColor;
  fresh.secondaryColor = config.secondaryColor;
  fresh.teamType = config.teamType;
  fresh.teamPresetId = config.teamPresetId;
  fresh.budget = config.budget;
  fresh.car = config.carStats;
  fresh.driver1 = normalizeDriverPricing(config.driver1);
  fresh.driver2 = normalizeDriverPricing(config.driver2);
  fresh.currentRound = 1;
  fresh.totalRaces = 18;
  fresh.trophies = 0;
  fresh.seasonCircuits = getFixedWorldTourCalendar(1);
  fresh.championshipStandings = buildChampionshipStandingsForTeam(
    config.teamName,
    config.driver1,
    config.driver2
  );
  fresh.currentSeasonNumber = 1;
  fresh.seasonRecords = initializeSeasonRecords(fresh);
  return fresh;
}

/**
 * Loads a save slot by ID from localStorage
 */
export function loadSlot(slotId: number): SaveSlotData | null {
  try {
    const key = getSlotStorageKey(slotId);
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const data: SaveSlotData = JSON.parse(raw);

    // Basic structure validation
    if (!data.teamState || !data.teamState.driver1 || !data.teamState.driver2) {
      console.warn(`Save slot ${slotId} data structure is incomplete.`);
      return null;
    }

    const now = Date.now();

    // Ensure candidate arrays exist and have valid countdowns
    if (!data.teamState.availableScouts || data.teamState.availableScouts.length === 0) {
      data.teamState.availableScouts = AVAILABLE_SCOUT_CANDIDATES.map((s, idx) =>
        normalizeCandidateItem(s, 300 - idx * 20, now)
      );
    } else {
      data.teamState.availableScouts = data.teamState.availableScouts.map((sc, idx) =>
        normalizeCandidateItem(sc, 300 - idx * 20, now)
      );
    }

    if (data.teamState.driver1) {
      data.teamState.driver1 = normalizeDriverPricing(data.teamState.driver1);
    }
    if (data.teamState.driver2) {
      data.teamState.driver2 = normalizeDriverPricing(data.teamState.driver2);
    }

    if (data.teamState.availableDrivers) {
      data.teamState.availableDrivers = data.teamState.availableDrivers.map((d, idx) =>
        normalizeDriverPricing(normalizeCandidateItem(d, 300 - idx * 20, now))
      );
    }
    if (data.teamState.availableStrategists) {
      data.teamState.availableStrategists = data.teamState.availableStrategists.map((s, idx) =>
        normalizeCandidateItem(s, 300 - idx * 30, now)
      );
    }
    if (data.teamState.availablePitCrews) {
      data.teamState.availablePitCrews = data.teamState.availablePitCrews.map((c, idx) =>
        normalizeCandidateItem(c, 300 - idx * 30, now)
      );
    }

    // Ensure claimedSponsors is an array
    if (!data.teamState.claimedSponsors) {
      data.teamState.claimedSponsors = [];
    }

    // Ensure season records, 18 total races, and 18-circuit calendar exist
    data.teamState.totalRaces = 18;
    data.teamState.seasonCircuits = getOrInitializeSeasonCircuits(
      data.teamState.seasonCircuits,
      data.teamState.currentSeasonNumber || 1
    );
    if (!data.teamState.currentSeasonNumber) {
      data.teamState.currentSeasonNumber = 1;
    }
    if (!data.teamState.seasonRecords || data.teamState.seasonRecords.length === 0) {
      data.teamState.seasonRecords = initializeSeasonRecords(data.teamState);
    }

    // Strict sync: Current round must always equal completed races count + 1
    const activeSec =
      data.teamState.seasonRecords?.find(
        (r) => r.seasonNumber === (data.teamState.currentSeasonNumber || 1) && !r.isCompleted
      ) ||
      data.teamState.seasonRecords?.find((r) => r.status === 'in-progress') ||
      data.teamState.seasonRecords?.[0];
    const completedRaces = activeSec?.raceLogs?.length || 0;
    data.teamState.currentRound = Math.min(data.teamState.totalRaces || 18, completedRaces + 1);

    return data;
  } catch (e) {
    console.error(`Failed to load save slot ${slotId}:`, e);
    return null;
  }
}

/**
 * Saves current teamState and audio preferences to specified slot
 */
export function saveToSlot(
  slotId: number,
  teamState: TeamState,
  isMuted: boolean
): { success: boolean; error?: string } {
  try {
    if (slotId < 1 || slotId > TOTAL_SAVE_SLOTS) {
      return { success: false, error: 'Invalid slot ID' };
    }

    const saveData: SaveSlotData = {
      saveVersion: SAVE_VERSION,
      slotId,
      timestamp: Date.now(),
      teamState: JSON.parse(JSON.stringify(teamState)),
      isMuted,
    };

    const key = getSlotStorageKey(slotId);
    localStorage.setItem(key, JSON.stringify(saveData));
    setActiveSlotId(slotId);

    return { success: true };
  } catch (e: any) {
    console.error(`Failed to save to slot ${slotId}:`, e);
    return {
      success: false,
      error: e?.name === 'QuotaExceededError' ? 'Storage full (QuotaExceededError)' : 'Failed to write to localStorage',
    };
  }
}

/**
 * Deletes save slot data from localStorage
 */
export function deleteSlot(slotId: number): { success: boolean; error?: string } {
  try {
    const key = getSlotStorageKey(slotId);
    localStorage.removeItem(key);

    // If active slot was deleted, clear active slot pointer immediately in localStorage
    const active = getActiveSlotId();
    if (active === slotId) {
      setActiveSlotId(null);
    }

    // Also remove legacy key to prevent any resurrection
    localStorage.removeItem(LEGACY_KEY);

    return { success: true };
  } catch (e: any) {
    console.error(`Failed to delete slot ${slotId}:`, e);
    return { success: false, error: 'Failed to delete slot' };
  }
}

/**
 * Loads all 6 save slots directly from localStorage (Single Source of Truth).
 * Guaranteed to read fresh data on every call with zero in-memory caching.
 */
export function loadAllSlotsFromStorage(): SlotSummary[] {
  const summaries: SlotSummary[] = [];

  for (let i = 1; i <= TOTAL_SAVE_SLOTS; i++) {
    const key = getSlotStorageKey(i);
    const raw = localStorage.getItem(key);

    if (!raw) {
      summaries.push({
        slotId: i,
        isEmpty: true,
      });
      continue;
    }

    try {
      const data: SaveSlotData = JSON.parse(raw);
      if (!data || !data.teamState || !data.teamState.driver1 || !data.teamState.driver2) {
        summaries.push({
          slotId: i,
          isEmpty: true,
        });
        continue;
      }

      const ts = data.teamState;
      summaries.push({
        slotId: i,
        isEmpty: false,
        timestamp: data.timestamp,
        teamName: ts.teamName,
        logoShape: ts.logoShape,
        primaryColor: ts.primaryColor,
        secondaryColor: ts.secondaryColor,
        budget: ts.budget,
        currentRound: ts.currentRound,
        totalRaces: ts.totalRaces,
        trophies: ts.trophies,
        driver1: ts.driver1,
        driver2: ts.driver2,
        carOverall: ts.car ? calculateCarOverall(ts.car) : undefined,
        saveData: data,
      });
    } catch (e) {
      console.warn(`Failed to parse slot ${i} from localStorage:`, e);
      summaries.push({
        slotId: i,
        isEmpty: true,
      });
    }
  }

  return summaries;
}

/**
 * Retrieves summary metadata for all 6 slots (Alias to loadAllSlotsFromStorage)
 */
export const getAllSlotsSummary = loadAllSlotsFromStorage;


