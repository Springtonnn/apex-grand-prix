import {
  TeamState,
  SeasonRecord,
  RaceResultRecord,
  DriverSeatSeasonStats,
  ConstructorTeamStanding,
  DriverStanding,
  LogoShape,
} from '../types/game';
import { PRESET_TEAMS } from '../data/presetTeams';
import { getFixedWorldTourCalendar } from '../data/circuitPool';

export const F1_POINTS_MAP = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export function getF1Points(position: number): number {
  if (position >= 1 && position <= 10) {
    return F1_POINTS_MAP[position - 1];
  }
  return 0;
}

/**
 * Generates initial season records if none exist.
 * Clean, genuine records for the active live Season (marked 'in-progress').
 * Never contains mock/fake historical seasons.
 */
export function initializeSeasonRecords(teamState: TeamState): SeasonRecord[] {
  if (teamState.seasonRecords && teamState.seasonRecords.length > 0) {
    // Sanitize any existing records: filter out mock/fake past seasons (e.g. seasonNumber <= 0 or fake 2025/2024 records)
    const sanitized = teamState.seasonRecords.filter((r) => {
      if (r.seasonNumber <= 0) return false;
      if (r.title && (r.title.includes('2024') || r.title.includes('2025')) && r.seasonNumber === 1 && r.year !== 2026) return false;
      if (r.raceLogs && r.raceLogs.some((log) => log.gpId?.startsWith('gp-hist') || log.gpId?.startsWith('gp-24'))) return false;
      return true;
    });

    if (sanitized.length > 0) {
      return sanitized;
    }
  }

  const currentSeasonNum = teamState.currentSeasonNumber || 1;
  const initialStandings = buildInitialConstructorStandings(teamState, 0, 0, 0);
  const myIndex = initialStandings.findIndex((t) => t.isPlayerTeam);
  const initialRank = myIndex >= 0 ? myIndex + 1 : 1;

  // Active Season (Season 1 or current)
  const activeSeason: SeasonRecord = {
    seasonNumber: currentSeasonNum,
    year: 2026 + (currentSeasonNum - 1),
    title: `Season ${currentSeasonNum} (${2026 + currentSeasonNum - 1})`,
    isCompleted: false,
    status: 'in-progress',
    finalStandingPosition: undefined,
    raceLogs: [],
    driver1Stats: {
      seat: 'seat1',
      currentDriverName: teamState.driver1.name,
      currentDriverFlag: teamState.driver1.nationality.flag,
      currentDriverAvatar: teamState.driver1.avatarSeed || teamState.driver1.name,
      points: 0,
      wins: 0,
      podiums: 0,
      standingRank: 1,
    },
    driver2Stats: {
      seat: 'seat2',
      currentDriverName: teamState.driver2.name,
      currentDriverFlag: teamState.driver2.nationality.flag,
      currentDriverAvatar: teamState.driver2.avatarSeed || teamState.driver2.name,
      points: 0,
      wins: 0,
      podiums: 0,
      standingRank: 2,
    },
    constructorPoints: 0,
    constructorRank: initialRank,
    wins: 0,
    podiums: 0,
    constructorStandings: initialStandings,
  };

  return [activeSeason];
}

export interface GridTeamInfo {
  teamName: string;
  logoShape?: LogoShape;
  primaryColor?: string;
  secondaryColor?: string;
  isPlayerTeam: boolean;
  driver1: {
    id: string;
    name: string;
    flag: string;
    overall: number;
    avatarSeed?: string;
  };
  driver2: {
    id: string;
    name: string;
    flag: string;
    overall: number;
    avatarSeed?: string;
  };
}

export interface GridDriverInfo {
  id: string;
  name: string;
  teamName: string;
  teamColor?: string;
  flag: string;
  overall: number;
  avatarSeed?: string;
  isPlayerTeam: boolean;
  driverSeat?: 'driver1' | 'driver2';
}

/**
 * Returns the exact 10 teams on the championship grid:
 * The player's team plus 9 unique rival teams from PRESET_TEAMS.
 */
export function getGridTeams(teamState: TeamState): GridTeamInfo[] {
  const playerTeamNameLower = (teamState.teamName || 'Apex GP Racing').toLowerCase();

  const rivals = PRESET_TEAMS.filter(
    (p) => p.name.toLowerCase() !== playerTeamNameLower && p.id !== teamState.teamPresetId
  ).slice(0, 9);

  return [
    {
      teamName: teamState.teamName,
      logoShape: teamState.logoShape || 'shield',
      primaryColor: teamState.primaryColor || '#DC2626',
      secondaryColor: teamState.secondaryColor || '#15151E',
      isPlayerTeam: true,
      driver1: {
        id: teamState.driver1.id || 'driver-1',
        name: teamState.driver1.name,
        flag: teamState.driver1.nationality.flag,
        overall: teamState.driver1.overall,
        avatarSeed: teamState.driver1.avatarSeed || teamState.driver1.name,
      },
      driver2: {
        id: teamState.driver2.id || 'driver-2',
        name: teamState.driver2.name,
        flag: teamState.driver2.nationality.flag,
        overall: teamState.driver2.overall,
        avatarSeed: teamState.driver2.avatarSeed || teamState.driver2.name,
      },
    },
    ...rivals.map((r) => ({
      teamName: r.name,
      logoShape: r.logoShape,
      primaryColor: r.primaryColor,
      secondaryColor: r.secondaryColor,
      isPlayerTeam: false,
      driver1: {
        id: r.driver1.id,
        name: r.driver1.name,
        flag: r.driver1.nationality.flag,
        overall: r.driver1.overall,
        avatarSeed: r.driver1.avatarSeed || r.driver1.name,
      },
      driver2: {
        id: r.driver2.id,
        name: r.driver2.name,
        flag: r.driver2.nationality.flag,
        overall: r.driver2.overall,
        avatarSeed: r.driver2.avatarSeed || r.driver2.name,
      },
    })),
  ];
}

/**
 * Returns the exact 20 drivers on the championship grid (2 per team).
 */
export function getGridDrivers(teamState: TeamState): GridDriverInfo[] {
  const teams = getGridTeams(teamState);
  const drivers: GridDriverInfo[] = [];

  teams.forEach((t) => {
    drivers.push({
      id: t.driver1.id,
      name: t.driver1.name,
      teamName: t.teamName,
      teamColor: t.primaryColor,
      flag: t.driver1.flag,
      overall: t.driver1.overall,
      avatarSeed: t.driver1.avatarSeed,
      isPlayerTeam: t.isPlayerTeam,
      driverSeat: t.isPlayerTeam ? 'driver1' : undefined,
    });
    drivers.push({
      id: t.driver2.id,
      name: t.driver2.name,
      teamName: t.teamName,
      teamColor: t.primaryColor,
      flag: t.driver2.flag,
      overall: t.driver2.overall,
      avatarSeed: t.driver2.avatarSeed,
      isPlayerTeam: t.isPlayerTeam,
      driverSeat: t.isPlayerTeam ? 'driver2' : undefined,
    });
  });

  return drivers;
}

/**
 * Calculates unified constructor and driver standings for a given season record
 * based on actual completed race results. If no races have been run, all start at 0.
 */
export function calculateSeasonStandings(
  teamState: TeamState,
  targetSeason?: SeasonRecord
): {
  constructorStandings: ConstructorTeamStanding[];
  driverStandings: DriverStanding[];
} {
  const teams = getGridTeams(teamState);
  const gridDrivers = getGridDrivers(teamState);

  // If no target season provided, find the active in-progress season
  const activeSeason =
    targetSeason ||
    teamState.seasonRecords?.find(
      (r) => r.seasonNumber === (teamState.currentSeasonNumber || 1) && !r.isCompleted
    ) ||
    teamState.seasonRecords?.find((r) => r.status === 'in-progress') ||
    teamState.seasonRecords?.[0];

  const raceLogs = activeSeason?.raceLogs || [];

  // Map to accumulate points, wins, podiums for constructors
  const teamStatsMap = new Map<string, { points: number; wins: number; podiums: number }>();
  teams.forEach((t) => {
    teamStatsMap.set(t.teamName.toLowerCase(), { points: 0, wins: 0, podiums: 0 });
  });

  // Map to accumulate points, wins, podiums for drivers
  const driverStatsMap = new Map<string, { points: number; wins: number; podiums: number }>();
  gridDrivers.forEach((d) => {
    driverStatsMap.set(d.id, { points: 0, wins: 0, podiums: 0 });
  });

  // If races have been logged, calculate from finished results
  if (raceLogs.length > 0) {
    raceLogs.forEach((log) => {
      if (log.fullGridResults && log.fullGridResults.length > 0) {
        log.fullGridResults.forEach((res) => {
          // Driver accumulation
          const dStat = driverStatsMap.get(res.driverId) || { points: 0, wins: 0, podiums: 0 };
          dStat.points += res.points;
          if (res.position === 1) dStat.wins += 1;
          if (res.position <= 3) dStat.podiums += 1;
          driverStatsMap.set(res.driverId, dStat);

          // Team accumulation
          const tStat = teamStatsMap.get(res.teamName.toLowerCase());
          if (tStat) {
            tStat.points += res.points;
            if (res.position === 1) tStat.wins += 1;
            if (res.position <= 3) tStat.podiums += 1;
            teamStatsMap.set(res.teamName.toLowerCase(), tStat);
          }
        });
      } else {
        // Fallback for logs without fullGridResults: use Seat 1 & Seat 2
        const pTeamStat = teamStatsMap.get(teamState.teamName.toLowerCase());
        if (pTeamStat) {
          pTeamStat.points += (log.seat1Points || 0) + (log.seat2Points || 0);
          if (log.seat1Position === 1 || log.seat2Position === 1) pTeamStat.wins += 1;
          if (log.seat1Position <= 3) pTeamStat.podiums += 1;
          if (log.seat2Position <= 3) pTeamStat.podiums += 1;
          teamStatsMap.set(teamState.teamName.toLowerCase(), pTeamStat);
        }

        const d1 = gridDrivers.find((d) => d.driverSeat === 'driver1');
        if (d1) {
          const dStat = driverStatsMap.get(d1.id) || { points: 0, wins: 0, podiums: 0 };
          dStat.points += log.seat1Points || 0;
          if (log.seat1Position === 1) dStat.wins += 1;
          if (log.seat1Position <= 3) dStat.podiums += 1;
          driverStatsMap.set(d1.id, dStat);
        }

        const d2 = gridDrivers.find((d) => d.driverSeat === 'driver2');
        if (d2) {
          const dStat = driverStatsMap.get(d2.id) || { points: 0, wins: 0, podiums: 0 };
          dStat.points += log.seat2Points || 0;
          if (log.seat2Position === 1) dStat.wins += 1;
          if (log.seat2Position <= 3) dStat.podiums += 1;
          driverStatsMap.set(d2.id, dStat);
        }
      }
    });
  }

  // Build Constructor Standings
  const constructorStandings: ConstructorTeamStanding[] = teams.map((t) => {
    const stat = teamStatsMap.get(t.teamName.toLowerCase()) || { points: 0, wins: 0, podiums: 0 };
    return {
      teamName: t.teamName,
      logoShape: t.logoShape,
      primaryColor: t.primaryColor,
      secondaryColor: t.secondaryColor,
      points: stat.points,
      wins: stat.wins,
      podiums: stat.podiums,
      isPlayerTeam: t.isPlayerTeam,
    };
  });

  // Sort constructors
  constructorStandings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.podiums !== a.podiums) return b.podiums - a.podiums;
    if (a.isPlayerTeam) return -1;
    if (b.isPlayerTeam) return 1;
    return a.teamName.localeCompare(b.teamName);
  });

  // Build Driver Standings
  const driverStandings: DriverStanding[] = gridDrivers.map((d) => {
    const stat = driverStatsMap.get(d.id) || { points: 0, wins: 0, podiums: 0 };
    return {
      driverId: d.id,
      driverName: d.name,
      teamName: d.teamName,
      teamColor: d.teamColor,
      flag: d.flag,
      avatarSeed: d.avatarSeed,
      points: stat.points,
      wins: stat.wins,
      podiums: stat.podiums,
      isPlayerTeam: d.isPlayerTeam,
    };
  });

  // Sort drivers
  driverStandings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.podiums !== a.podiums) return b.podiums - a.podiums;
    if (a.isPlayerTeam && !b.isPlayerTeam) return -1;
    if (!a.isPlayerTeam && b.isPlayerTeam) return 1;
    const aRating = gridDrivers.find((g) => g.id === a.driverId)?.overall || 0;
    const bRating = gridDrivers.find((g) => g.id === b.driverId)?.overall || 0;
    if (bRating !== aRating) return bRating - aRating;
    return a.driverName.localeCompare(b.driverName);
  });

  return {
    constructorStandings,
    driverStandings,
  };
}

/**
 * Builds realistic constructor standings for 10 teams based on current race progress.
 * If 0 races completed, all teams start at 0 points.
 */
export function buildInitialConstructorStandings(
  teamState: TeamState,
  playerPoints: number,
  playerWins: number,
  playerPodiums: number
): ConstructorTeamStanding[] {
  // If 0 races have finished, all teams start at 0 points
  const teams = getGridTeams(teamState);

  if (playerPoints === 0 && playerWins === 0 && playerPodiums === 0) {
    const list: ConstructorTeamStanding[] = teams.map((t) => ({
      teamName: t.teamName,
      logoShape: t.logoShape,
      primaryColor: t.primaryColor,
      secondaryColor: t.secondaryColor,
      points: 0,
      wins: 0,
      podiums: 0,
      isPlayerTeam: t.isPlayerTeam,
    }));

    list.sort((a, b) => {
      if (a.isPlayerTeam) return -1;
      if (b.isPlayerTeam) return 1;
      return a.teamName.localeCompare(b.teamName);
    });

    return list;
  }

  // Calculate with calculateSeasonStandings if raceLogs exist
  return calculateSeasonStandings(teamState).constructorStandings;
}

/**
 * Appends a new race log to the active season record and updates all stats
 */
export function recordCompletedRaceToSeason(
  teamState: TeamState,
  logEntry: RaceResultRecord
): {
  updatedRecords: SeasonRecord[];
  driverStandings?: DriverStanding[];
  isSeasonCompleted: boolean;
  newTrophies: number;
} {
  const records = initializeSeasonRecords(teamState);
  const currentSeasonNum = teamState.currentSeasonNumber || 1;

  // Find active season index
  let activeIndex = records.findIndex((r) => r.seasonNumber === currentSeasonNum && !r.isCompleted);
  if (activeIndex === -1) {
    activeIndex = records.findIndex((r) => r.status === 'in-progress');
  }

  if (activeIndex === -1) {
    // If not found, create active season
    const fresh: SeasonRecord = {
      seasonNumber: currentSeasonNum,
      year: 2026 + (currentSeasonNum - 1),
      title: `Season ${currentSeasonNum} (${2026 + currentSeasonNum - 1})`,
      isCompleted: false,
      status: 'in-progress',
      raceLogs: [],
      driver1Stats: {
        seat: 'seat1',
        currentDriverName: teamState.driver1.name,
        currentDriverFlag: teamState.driver1.nationality.flag,
        currentDriverAvatar: teamState.driver1.avatarSeed || teamState.driver1.name,
        points: 0,
        wins: 0,
        podiums: 0,
        standingRank: 1,
      },
      driver2Stats: {
        seat: 'seat2',
        currentDriverName: teamState.driver2.name,
        currentDriverFlag: teamState.driver2.nationality.flag,
        currentDriverAvatar: teamState.driver2.avatarSeed || teamState.driver2.name,
        points: 0,
        wins: 0,
        podiums: 0,
        standingRank: 2,
      },
      constructorPoints: 0,
      constructorRank: 1,
      wins: 0,
      podiums: 0,
    };
    records.unshift(fresh);
    activeIndex = 0;
  }

  const active = { ...records[activeIndex] };

  // IDEMPOTENCY GUARD: If this round is already logged in active season, do not add duplicate!
  const alreadyLogged = active.raceLogs.some((r) => r.round === logEntry.round);
  if (alreadyLogged) {
    const standings = calculateSeasonStandings(teamState, active);
    return {
      updatedRecords: records,
      driverStandings: standings.driverStandings,
      isSeasonCompleted: active.isCompleted,
      newTrophies: teamState.trophies,
    };
  }

  const updatedLogs = [...active.raceLogs, logEntry];

  // Calculate Seat 1 stats
  const seat1Pts = updatedLogs.reduce((sum, r) => sum + r.seat1Points, 0);
  const seat1Wins = updatedLogs.filter((r) => r.seat1Position === 1).length;
  const seat1Podiums = updatedLogs.filter((r) => r.seat1Position <= 3).length;

  // Calculate Seat 2 stats
  const seat2Pts = updatedLogs.reduce((sum, r) => sum + r.seat2Points, 0);
  const seat2Wins = updatedLogs.filter((r) => r.seat2Position === 1).length;
  const seat2Podiums = updatedLogs.filter((r) => r.seat2Position <= 3).length;

  const totalConstructorPts = seat1Pts + seat2Pts;
  const totalWins = seat1Wins + seat2Wins;
  const totalPodiums = seat1Podiums + seat2Podiums;

  active.raceLogs = updatedLogs;

  // Calculate unified standings from updated logs
  const standings = calculateSeasonStandings(teamState, active);
  const myTeamIndex = standings.constructorStandings.findIndex((t) => t.isPlayerTeam);
  const constructorRank = myTeamIndex >= 0 ? myTeamIndex + 1 : 1;

  // Driver ranking calculation
  const d1StandingIndex = standings.driverStandings.findIndex(
    (d) => d.driverId === (teamState.driver1.id || 'driver-1') || d.driverName === teamState.driver1.name
  );
  const d2StandingIndex = standings.driverStandings.findIndex(
    (d) => d.driverId === (teamState.driver2.id || 'driver-2') || d.driverName === teamState.driver2.name
  );
  const d1Rank = d1StandingIndex >= 0 ? d1StandingIndex + 1 : 1;
  const d2Rank = d2StandingIndex >= 0 ? d2StandingIndex + 1 : 2;

  active.driver1Stats = {
    seat: 'seat1',
    currentDriverName: teamState.driver1.name,
    currentDriverFlag: teamState.driver1.nationality.flag,
    currentDriverAvatar: teamState.driver1.avatarSeed || teamState.driver1.name,
    points: seat1Pts,
    wins: seat1Wins,
    podiums: seat1Podiums,
    standingRank: d1Rank,
  };
  active.driver2Stats = {
    seat: 'seat2',
    currentDriverName: teamState.driver2.name,
    currentDriverFlag: teamState.driver2.nationality.flag,
    currentDriverAvatar: teamState.driver2.avatarSeed || teamState.driver2.name,
    points: seat2Pts,
    wins: seat2Wins,
    podiums: seat2Podiums,
    standingRank: d2Rank,
  };
  active.constructorPoints = totalConstructorPts;
  active.constructorRank = constructorRank;
  active.wins = totalWins;
  active.podiums = totalPodiums;
  active.constructorStandings = standings.constructorStandings;

  let isSeasonCompleted = false;
  let newTrophies = teamState.trophies;

  // If this was the final round of the season
  if (logEntry.round >= teamState.totalRaces) {
    isSeasonCompleted = true;
    active.isCompleted = true;
    active.status = 'completed';
    active.finalStandingPosition = constructorRank;

    // If team won the constructor championship, add 1 trophy!
    if (constructorRank === 1) {
      newTrophies += 1;
    }
  }

  records[activeIndex] = active;

  return {
    updatedRecords: records,
    driverStandings: standings.driverStandings,
    isSeasonCompleted,
    newTrophies,
  };
}

/**
 * Advance to next season
 */
export function advanceToNextSeason(teamState: TeamState): TeamState {
  const currentNum = teamState.currentSeasonNumber || 1;
  const nextSeasonNum = currentNum + 1;
  const records = initializeSeasonRecords(teamState);

  // Keep the authentic fixed 18-circuit World Tour calendar for the upcoming season
  const nextSeasonCircuits = getFixedWorldTourCalendar(nextSeasonNum);

  // Mark all current seasons as completed and archive its calendar
  const updatedRecords = records.map((r) => {
    if (r.seasonNumber === currentNum) {
      return {
        ...r,
        isCompleted: true,
        status: 'completed' as const,
        finalStandingPosition: r.finalStandingPosition || r.constructorRank || 1,
        seasonCircuits: r.seasonCircuits || teamState.seasonCircuits,
      };
    }
    return r;
  });

  // Create new active season record
  const newSeason: SeasonRecord = {
    seasonNumber: nextSeasonNum,
    year: 2026 + (nextSeasonNum - 1),
    title: `Season ${nextSeasonNum} (${2026 + nextSeasonNum - 1})`,
    isCompleted: false,
    status: 'in-progress',
    raceLogs: [],
    seasonCircuits: nextSeasonCircuits,
    driver1Stats: {
      seat: 'seat1',
      currentDriverName: teamState.driver1.name,
      currentDriverFlag: teamState.driver1.nationality.flag,
      currentDriverAvatar: teamState.driver1.avatarSeed || teamState.driver1.name,
      points: 0,
      wins: 0,
      podiums: 0,
      standingRank: 1,
    },
    driver2Stats: {
      seat: 'seat2',
      currentDriverName: teamState.driver2.name,
      currentDriverFlag: teamState.driver2.nationality.flag,
      currentDriverAvatar: teamState.driver2.avatarSeed || teamState.driver2.name,
      points: 0,
      wins: 0,
      podiums: 0,
      standingRank: 2,
    },
    constructorPoints: 0,
    constructorRank: 1,
    wins: 0,
    podiums: 0,
    constructorStandings: buildInitialConstructorStandings(teamState, 0, 0, 0),
  };

  updatedRecords.unshift(newSeason);

  return {
    ...teamState,
    currentSeasonNumber: nextSeasonNum,
    currentRound: 1,
    totalRaces: 18,
    seasonCircuits: nextSeasonCircuits,
    seasonRecords: updatedRecords,
  };
}

/**
 * Calculates Career Totals across all seasons
 */
export function calculateCareerTotals(teamState: TeamState) {
  const records = initializeSeasonRecords(teamState);

  // Sum wins and podiums across all records
  let careerWins = 0;
  let careerPodiums = 0;
  let careerPoints = 0;
  let championshipsWon = 0;

  records.forEach((season) => {
    careerWins += season.wins || 0;
    careerPodiums += season.podiums || 0;
    careerPoints += season.constructorPoints || 0;
    if (season.isCompleted && season.finalStandingPosition === 1) {
      championshipsWon += 1;
    }
  });

  return {
    seasonsContested: records.length,
    worldChampionships: championshipsWon,
    raceWins: careerWins,
    podiums: careerPodiums,
    totalPoints: careerPoints,
  };
}
