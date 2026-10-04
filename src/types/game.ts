export type Nationality = {
  name: string;
  code: string;
  flag: string;
};

export interface Driver {
  id: string;
  name: string;
  age: number;
  nationality: Nationality;
  overall: number; // Cap at 99
  pace: number; // 0-99
  raceCraft: number; // 0-99
  experience: number; // 0-99
  salary: number; // per race
  buyoutCost?: number;
  avatarSeed: string;
  expiresAt?: number; // timestamp in ms for 5-min market rotation
}

export interface Strategist {
  id: string;
  name: string;
  title: string;
  nationality?: Nationality;
  overall: number; // Cap at 99
  decisions: number; // 0-99 (quickness and accuracy of tactical calls)
  strategy: number; // 0-99 (tire wear models, undercut efficiency)
  salary: number; // per race
  hireCost: number;
  personality: string;
  avatarSeed?: string;
  expiresAt?: number;
}

export interface PitCrew {
  id: string;
  name: string;
  nationality?: Nationality;
  overall: number; // Cap at 99
  precision: number; // 0-99 (avoids costly mistakes, stuck wheel nuts)
  speed: number; // 0-99 (determines base pit stop duration)
  salary: number; // per race
  hireCost: number;
  level: number;
  avatarSeed?: string;
  expiresAt?: number;
}

export interface CarStats {
  engine: number; // 0-99
  aero: number; // 0-99
  brakes: number; // 0-99
  suspension: number; // 0-99
  chassis: number; // 0-99
}

export type CarStatKey = keyof CarStats;

export interface AcademyDriver {
  id: string;
  name: string;
  age: number;
  nationality: Nationality;
  overall: number; // Cap at 99
  pace: number;
  raceCraft: number;
  experience: number;
  potentialGrade: 'S+' | 'S' | 'A' | 'B' | 'C';
  potentialMin: number;
  potentialMax: number;
  continent: ContinentName;
  discoveredAtRound: number;
}

export type ContinentName =
  | 'Europe'
  | 'Asia'
  | 'North America'
  | 'South America'
  | 'Africa'
  | 'Oceania';

export interface ContinentInfo {
  name: ContinentName;
  thaiName: string;
  scannedDriversCount: number;
  regionIcon: string;
  assignedScoutId?: string | null;
}

export interface Scout {
  id: string;
  name: string;
  stars: number; // 1 to 5
  salary: number;
  hireCost: number;
  specialty: ContinentName;
  highTierChance: number; // e.g. 5★ = 0.40 (40%), 1★ = 0.05 (5%)
  isAssignedTo?: ContinentName | null;
  avatarSeed?: string;
  expiresAt?: number;
}

export type CircuitType = 'Street Circuit' | 'Race Circuit' | 'Road Circuit';

export interface GrandPrix {
  id: string;
  round: number;
  name: string;
  circuitName: string;
  city?: string;
  country: string;
  continent?: ContinentName;
  circuitType?: CircuitType;
  lat?: number;
  lng?: number;
  flag: string;
  totalLaps: number;
  weather: 'Dry' | 'Cloudy' | 'Wet' | 'Changing';
  lapLengthKm: number;
  corners?: number;
  difficulty: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
  finalized?: boolean;
  firstPlacePrize: number;
  trackLayoutPath?: string;
  environmentName?: string;
  environmentDescription?: string;
}

export type LogoShape =
  | 'shield'
  | 'hexagon'
  | 'circle-badge'
  | 'chevron'
  | 'diamond'
  | 'crest'
  | 'roundel'
  | 'wing-badge';

export interface RaceResultRecord {
  round: number;
  gpId: string;
  gpName: string;
  circuitName: string;
  country: string;
  flag: string;
  // Seat 1 driver result
  seat1DriverName: string;
  seat1DriverFlag: string;
  seat1DriverAvatar?: string;
  seat1Position: number;
  seat1Points: number;
  // Seat 2 driver result
  seat2DriverName: string;
  seat2DriverFlag: string;
  seat2DriverAvatar?: string;
  seat2Position: number;
  seat2Points: number;
  // Team total from this race
  totalPoints: number;
  prizeMoneyWon: number;
  dateTimestamp: number;
  fullGridResults?: {
    driverId: string;
    driverName: string;
    teamName: string;
    flag: string;
    position: number;
    points: number;
    isPlayer: boolean;
  }[];
}

export interface DriverSeatSeasonStats {
  seat: 'seat1' | 'seat2';
  currentDriverName: string;
  currentDriverFlag: string;
  currentDriverAvatar?: string;
  points: number;
  wins: number;
  podiums: number;
  standingRank: number; // Rank among all 20 drivers
}

export interface ConstructorTeamStanding {
  teamName: string;
  logoShape?: LogoShape;
  primaryColor?: string;
  secondaryColor?: string;
  points: number;
  wins: number;
  podiums: number;
  isPlayerTeam: boolean;
}

export interface SeasonRecord {
  seasonNumber: number;
  year?: number;
  title?: string;
  isCompleted: boolean;
  status: 'in-progress' | 'completed';
  finalStandingPosition?: number; // 1 = World Champion, 2 = Runner-Up, 3 = P3, etc.
  raceLogs: RaceResultRecord[];
  driver1Stats: DriverSeatSeasonStats;
  driver2Stats: DriverSeatSeasonStats;
  constructorPoints: number;
  constructorRank: number; // 1-10
  wins: number;
  podiums: number;
  constructorStandings?: ConstructorTeamStanding[];
  seasonCircuits?: GrandPrix[];
}

export interface TeamState {
  teamName: string;
  logoShape?: LogoShape;
  primaryColor?: string;
  secondaryColor?: string;
  teamType?: 'preset' | 'custom';
  teamPresetId?: string;
  budget: number;
  driver1: Driver;
  driver2: Driver;
  availableDrivers: Driver[];
  strategist: Strategist;
  availableStrategists: Strategist[];
  pitCrew: PitCrew;
  availablePitCrews: PitCrew[];
  car: CarStats;
  academyDrivers: AcademyDriver[];
  continents: Record<ContinentName, ContinentInfo>;
  scouts: Scout[];
  availableScouts: Scout[];
  maxScouts: number;
  championshipStandings: DriverStanding[];
  currentRound: number;
  totalRaces: number;
  trophies: number;
  claimedSponsors?: string[];
  currentSeasonNumber?: number;
  seasonCircuits?: GrandPrix[];
  seasonRecords?: SeasonRecord[];
  totalCarCrashesCount?: number;
  totalP12FinishesCount?: number;
  isBankruptHomeless?: boolean;
  bankruptHomelessReason?: 'crashes' | 'p12_finishes' | null;
}

export interface DriverStanding {
  driverId: string;
  driverName: string;
  teamName: string;
  teamColor?: string;
  avatarSeed?: string;
  flag: string;
  points: number;
  wins: number;
  podiums: number;
  isPlayerTeam: boolean;
}
