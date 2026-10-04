import { Driver, CarStats, DriverStanding, LogoShape } from '../types/game';
import { calcDriverPrice } from '../utils/calculations';

export interface PresetTeam {
  id: string;
  name: string;
  motto: string;
  logoShape: LogoShape;
  primaryColor: string;
  secondaryColor: string;
  budget: number;
  carTier: 'Tier 1 • Championship Contender' | 'Tier 2 • Midfield Challenger' | 'Tier 3 • Underdog Constructor';
  carStats: CarStats;
  driver1: Driver;
  driver2: Driver;
}

export const PRESET_TEAMS: PresetTeam[] = [
  {
    id: 'stellar-velocity',
    name: 'Stellar Velocity Racing',
    motto: 'Precision German engineering with aerodynamic perfection.',
    logoShape: 'hexagon',
    primaryColor: '#C0C0C0', // Silver
    secondaryColor: '#00D2BE', // Mint Green
    budget: 180_000_000,
    carTier: 'Tier 1 • Championship Contender',
    carStats: {
      engine: 81,
      aero: 82,
      brakes: 79,
      suspension: 80,
      chassis: 80,
    },
    driver1: {
      id: 'driver-noah-kessler',
      name: 'Noah Kessler',
      age: 27,
      nationality: { name: 'Germany', code: 'DE', flag: '🇩🇪' },
      overall: 91,
      pace: 92,
      raceCraft: 91,
      experience: 90,
      salary: 1_400_000,
      avatarSeed: 'Noah Kessler-stellar-velocity',
    },
    driver2: {
      id: 'driver-kaito-shirai',
      name: 'Kaito Shirai',
      age: 25,
      nationality: { name: 'Japan', code: 'JP', flag: '🇯🇵' },
      overall: 88,
      pace: 89,
      raceCraft: 88,
      experience: 87,
      salary: 1_100_000,
      avatarSeed: 'Kaito Shirai-stellar-velocity',
    },
  },
  {
    id: 'rosso-corsa',
    name: 'Rosso Corsa Motorsport',
    motto: 'Historic Italian passion with legendary straight-line power.',
    logoShape: 'crest',
    primaryColor: '#DC2626', // Red
    secondaryColor: '#15151E', // Black
    budget: 170_000_000,
    carTier: 'Tier 1 • Championship Contender',
    carStats: {
      engine: 82,
      aero: 80,
      brakes: 80,
      suspension: 79,
      chassis: 80,
    },
    driver1: {
      id: 'driver-enzo-bellandi',
      name: 'Enzo Bellandi',
      age: 26,
      nationality: { name: 'Italy', code: 'IT', flag: '🇮🇹' },
      overall: 92,
      pace: 93,
      raceCraft: 92,
      experience: 91,
      salary: 1_450_000,
      avatarSeed: 'Enzo Bellandi-rosso-corsa',
    },
    driver2: {
      id: 'driver-marcus-whitfield',
      name: 'Marcus Whitfield',
      age: 24,
      nationality: { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
      overall: 87,
      pace: 88,
      raceCraft: 87,
      experience: 86,
      salary: 1_050_000,
      avatarSeed: 'Marcus Whitfield-rosso-corsa',
    },
  },
  {
    id: 'bullhorn-energy',
    name: 'Bullhorn Energy Racing',
    motto: 'Uncompromising high-downforce agility and relentless pace.',
    logoShape: 'shield',
    primaryColor: '#0F1C3F', // Dark Navy
    secondaryColor: '#EE1D23', // Crimson Red
    budget: 150_000_000,
    carTier: 'Tier 1 • Championship Contender',
    carStats: {
      engine: 80,
      aero: 81,
      brakes: 78,
      suspension: 79,
      chassis: 78,
    },
    driver1: {
      id: 'driver-diego-fontaine',
      name: 'Diego Fontaine',
      age: 28,
      nationality: { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
      overall: 90,
      pace: 91,
      raceCraft: 90,
      experience: 89,
      salary: 1_300_000,
      avatarSeed: 'Diego Fontaine-bullhorn-energy',
    },
    driver2: {
      id: 'driver-rhys-okonkwo',
      name: 'Rhys Okonkwo',
      age: 23,
      nationality: { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
      overall: 85,
      pace: 86,
      raceCraft: 85,
      experience: 84,
      salary: 900_000,
      avatarSeed: 'Rhys Okonkwo-bullhorn-energy',
    },
  },
  {
    id: 'vortex-papaya',
    name: 'Vortex Papaya Racing',
    motto: 'Fast-paced innovation with razor-sharp cornering dynamics.',
    logoShape: 'chevron',
    primaryColor: '#FF8700', // Papaya Orange
    secondaryColor: '#0090FF', // Blue
    budget: 140_000_000,
    carTier: 'Tier 2 • Midfield Challenger',
    carStats: {
      engine: 74,
      aero: 74,
      brakes: 72,
      suspension: 73,
      chassis: 73,
    },
    driver1: {
      id: 'driver-milo-andersson',
      name: 'Milo Andersson',
      age: 25,
      nationality: { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
      overall: 88,
      pace: 89,
      raceCraft: 88,
      experience: 87,
      salary: 1_100_000,
      avatarSeed: 'Milo Andersson-vortex-papaya',
    },
    driver2: {
      id: 'driver-felix-duarte',
      name: 'Felix Duarte',
      age: 22,
      nationality: { name: 'Portugal', code: 'PT', flag: '🇵🇹' },
      overall: 83,
      pace: 84,
      raceCraft: 83,
      experience: 82,
      salary: 750_000,
      avatarSeed: 'Felix Duarte-vortex-papaya',
    },
  },
  {
    id: 'falcon-wing',
    name: 'Falcon Wing Racing',
    motto: 'Efficient aero efficiency and tactical endurance strategy.',
    logoShape: 'wing-badge',
    primaryColor: '#00A0DE', // Sky Blue
    secondaryColor: '#F8FAFC', // White
    budget: 110_000_000,
    carTier: 'Tier 2 • Midfield Challenger',
    carStats: {
      engine: 72,
      aero: 73,
      brakes: 72,
      suspension: 72,
      chassis: 71,
    },
    driver1: {
      id: 'driver-ryo-tanaka',
      name: 'Ryo Tanaka',
      age: 26,
      nationality: { name: 'Japan', code: 'JP', flag: '🇯🇵' },
      overall: 84,
      pace: 85,
      raceCraft: 84,
      experience: 83,
      salary: 800_000,
      avatarSeed: 'Ryo Tanaka-falcon-wing',
    },
    driver2: {
      id: 'driver-theo-marchetti',
      name: 'Theo Marchetti',
      age: 23,
      nationality: { name: 'France', code: 'FR', flag: '🇫🇷' },
      overall: 81,
      pace: 82,
      raceCraft: 81,
      experience: 80,
      salary: 650_000,
      avatarSeed: 'Theo Marchetti-falcon-wing',
    },
  },
  {
    id: 'azure-storm',
    name: 'Azure Storm Racing',
    motto: 'French flair engineered with high-frequency telemetry.',
    logoShape: 'circle-badge',
    primaryColor: '#005BA9', // Blue
    secondaryColor: '#F596C8', // Pink
    budget: 100_000_000,
    carTier: 'Tier 2 • Midfield Challenger',
    carStats: {
      engine: 73,
      aero: 71,
      brakes: 72,
      suspension: 72,
      chassis: 72,
    },
    driver1: {
      id: 'driver-pablo-herrera',
      name: 'Pablo Herrera',
      age: 27,
      nationality: { name: 'Spain', code: 'ES', flag: '🇪🇸' },
      overall: 83,
      pace: 84,
      raceCraft: 83,
      experience: 82,
      salary: 750_000,
      avatarSeed: 'Pablo Herrera-azure-storm',
    },
    driver2: {
      id: 'driver-nikolai-petrov',
      name: 'Nikolai Petrov',
      age: 24,
      nationality: { name: 'Russia', code: 'RU', flag: '🇷🇺' },
      overall: 80,
      pace: 81,
      raceCraft: 80,
      experience: 79,
      salary: 600_000,
      avatarSeed: 'Nikolai Petrov-azure-storm',
    },
  },
  {
    id: 'ironclad-racing',
    name: 'Ironclad Racing',
    motto: 'Robust chassis reliability built for gritty wheel-to-wheel battles.',
    logoShape: 'diamond',
    primaryColor: '#1E1E1E', // Black
    secondaryColor: '#9B0000', // Dark Red
    budget: 90_000_000,
    carTier: 'Tier 2 • Midfield Challenger',
    carStats: {
      engine: 72,
      aero: 71,
      brakes: 71,
      suspension: 71,
      chassis: 70,
    },
    driver1: {
      id: 'driver-hugo-lindqvist',
      name: 'Hugo Lindqvist',
      age: 26,
      nationality: { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
      overall: 82,
      pace: 83,
      raceCraft: 82,
      experience: 81,
      salary: 700_000,
      avatarSeed: 'Hugo Lindqvist-ironclad',
    },
    driver2: {
      id: 'driver-aiden-mercer',
      name: 'Aiden Mercer',
      age: 22,
      nationality: { name: 'Australia', code: 'AU', flag: '🇦🇺' },
      overall: 79,
      pace: 80,
      raceCraft: 79,
      experience: 78,
      salary: 550_000,
      avatarSeed: 'Aiden Mercer-ironclad',
    },
  },
  {
    id: 'thunder-gold',
    name: 'Thunder Gold Motorsport',
    motto: 'Swiss prestige with luxurious golden livery and sharp brakes.',
    logoShape: 'roundel',
    primaryColor: '#F0F4F8', // White
    secondaryColor: '#D4AF37', // Gold
    budget: 80_000_000,
    carTier: 'Tier 3 • Underdog Constructor',
    carStats: {
      engine: 64,
      aero: 63,
      brakes: 64,
      suspension: 63,
      chassis: 62,
    },
    driver1: {
      id: 'driver-rafael-costa',
      name: 'Rafael Costa',
      age: 25,
      nationality: { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
      overall: 81,
      pace: 82,
      raceCraft: 81,
      experience: 80,
      salary: 650_000,
      avatarSeed: 'Rafael Costa-thunder-gold',
    },
    driver2: {
      id: 'driver-owen-fitzgerald',
      name: 'Owen Fitzgerald',
      age: 23,
      nationality: { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
      overall: 78,
      pace: 79,
      raceCraft: 78,
      experience: 77,
      salary: 500_000,
      avatarSeed: 'Owen Fitzgerald-thunder-gold',
    },
  },
  {
    id: 'silverline-racing',
    name: 'Silverline Racing',
    motto: 'Historic British pedigree re-engineering for the modern era.',
    logoShape: 'shield',
    primaryColor: '#1E41B0', // Blue
    secondaryColor: '#FFFFFF', // White
    budget: 70_000_000,
    carTier: 'Tier 3 • Underdog Constructor',
    carStats: {
      engine: 63,
      aero: 62,
      brakes: 62,
      suspension: 62,
      chassis: 61,
    },
    driver1: {
      id: 'driver-karim-haddad',
      name: 'Karim Haddad',
      age: 24,
      nationality: { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
      overall: 79,
      pace: 80,
      raceCraft: 79,
      experience: 78,
      salary: 550_000,
      avatarSeed: 'Karim Haddad-silverline',
    },
    driver2: {
      id: 'driver-lucas-meyer',
      name: 'Lucas Meyer',
      age: 21,
      nationality: { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
      overall: 76,
      pace: 77,
      raceCraft: 76,
      experience: 75,
      salary: 420_000,
      avatarSeed: 'Lucas Meyer-silverline',
    },
  },
  {
    id: 'crimson-bulls',
    name: 'Crimson Bulls Racing',
    motto: 'Young ambitious underdog squad eager to shake up the hierarchy.',
    logoShape: 'hexagon',
    primaryColor: '#DC2626', // Red
    secondaryColor: '#D4AF37', // Gold
    budget: 60_000_000,
    carTier: 'Tier 3 • Underdog Constructor',
    carStats: {
      engine: 62,
      aero: 61,
      brakes: 61,
      suspension: 61,
      chassis: 60,
    },
    driver1: {
      id: 'driver-tomas-novak',
      name: 'Tomas Novak',
      age: 23,
      nationality: { name: 'Czechia', code: 'CZ', flag: '🇨🇿' },
      overall: 77,
      pace: 78,
      raceCraft: 77,
      experience: 76,
      salary: 450_000,
      avatarSeed: 'Tomas Novak-crimson-bulls',
    },
    driver2: {
      id: 'driver-sione-fifita',
      name: 'Sione Fifita',
      age: 20,
      nationality: { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
      overall: 74,
      pace: 75,
      raceCraft: 74,
      experience: 73,
      salary: 360_000,
      avatarSeed: 'Sione Fifita-crimson-bulls',
    },
  },
];

// Ensure all preset drivers strictly derive their salary and buyoutCost from the central formula
PRESET_TEAMS.forEach((team) => {
  const p1 = calcDriverPrice(team.driver1.overall, {
    seed: team.driver1.avatarSeed || team.driver1.id,
    age: team.driver1.age,
    pace: team.driver1.pace,
    experience: team.driver1.experience,
  });
  team.driver1.salary = p1.salary;
  team.driver1.buyoutCost = p1.buyout;

  const p2 = calcDriverPrice(team.driver2.overall, {
    seed: team.driver2.avatarSeed || team.driver2.id,
    age: team.driver2.age,
    pace: team.driver2.pace,
    experience: team.driver2.experience,
  });
  team.driver2.salary = p2.salary;
  team.driver2.buyoutCost = p2.buyout;
});

/**
 * Builds realistic championship standings with the player's team and rival teams
 */
export function buildChampionshipStandingsForTeam(
  playerTeamName: string,
  driver1: Driver,
  driver2: Driver
): DriverStanding[] {
  // Pool of rival AI drivers (all start with 0 points at season start)
  const rivalGrid = [
    { driverId: 'ai-max', driverName: 'Min Werstappen', teamName: 'Apex Redline GP', flag: '🇳🇱', points: 0, wins: 0, podiums: 0 },
    { driverId: 'ai-charles', driverName: 'Charl Chevalier', teamName: 'Scuderia Modena', flag: '🇲🇨', points: 0, wins: 0, podiums: 0 },
    { driverId: 'ai-george', driverName: 'Jorge Rustell-Smith', teamName: 'Silver Arrow Works', flag: '🇬🇧', points: 0, wins: 0, podiums: 0 },
    { driverId: 'ai-lando', driverName: 'Londo Norwood', teamName: 'Papaya Racing', flag: '🇬🇧', points: 0, wins: 0, podiums: 0 },
    { driverId: 'ai-fernando', driverName: 'Ferdinand Alvarez', teamName: 'Aston Green GP', flag: '🇪🇸', points: 0, wins: 0, podiums: 0 },
    { driverId: 'ai-oscar', driverName: 'Oskar Pierson', teamName: 'Papaya Racing', flag: '🇦🇺', points: 0, wins: 0, podiums: 0 },
    { driverId: 'ai-pierre', driverName: 'Pierre Girard', teamName: 'Bleu Alpine Sport', flag: '🇫🇷', points: 0, wins: 0, podiums: 0 },
    { driverId: 'ai-yuki', driverName: 'Yuki Morimoto', teamName: 'Toro Racing Bulls', flag: '🇯🇵', points: 0, wins: 0, podiums: 0 },
  ];

  // Exclude teams that might share the player's team name
  const filteredRivals = rivalGrid.filter((r) => r.teamName.toLowerCase() !== playerTeamName.toLowerCase());

  return [
    filteredRivals[0],
    {
      driverId: driver1.id,
      driverName: driver1.name,
      teamName: playerTeamName,
      flag: driver1.nationality.flag,
      points: 0,
      wins: 0,
      podiums: 0,
      isPlayerTeam: true,
    },
    filteredRivals[1],
    {
      driverId: driver2.id,
      driverName: driver2.name,
      teamName: playerTeamName,
      flag: driver2.nationality.flag,
      points: 0,
      wins: 0,
      podiums: 0,
      isPlayerTeam: true,
    },
    filteredRivals[2],
    filteredRivals[3],
    filteredRivals[4],
    filteredRivals[5],
    filteredRivals[6],
    filteredRivals[7],
  ].filter(Boolean) as DriverStanding[];
}
