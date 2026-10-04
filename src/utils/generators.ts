import {
  Driver,
  Strategist,
  PitCrew,
  Scout,
  ContinentName,
  Nationality,
} from '../types/game';
import { clampStat, MAX_STAT_CAP, calcDriverPrice } from './calculations';

export const MARKET_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes = 300,000 ms

export const ALL_CONTINENTS: ContinentName[] = [
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Africa',
  'Oceania',
];

export const ALL_NATIONALITIES: Nationality[] = [
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Monaco', code: 'MC', flag: '🇲🇨' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Finland', code: 'FI', flag: '🇫🇮' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
];

const FIRST_NAMES = [
  'Lucas', 'Matteo', 'Liam', 'Arthur', 'Maxime', 'Alexander', 'Carlos', 'Tatsuro',
  'Kenji', 'Kimi', 'Noah', 'Somchai', 'Sebastian', 'Oliver', 'Gabriel', 'Julian',
  'Enzo', 'Leonardo', 'Kai', 'Felix', 'Hugo', 'Oscar', 'Theo', 'Danil', 'Marcus',
  'Adrian', 'Valtteri', 'Sergio', 'Nico', 'Esteban', 'Lance', 'Frederik', 'Zane'
];

const LAST_NAMES = [
  'Vance', 'Rossi', 'Lindholm', 'Moreau', 'Sato', 'Chaiyaphum', 'Montoya', 'Santos',
  'Weber', 'Alonzy', 'Ricci', 'Bergman', 'Novak', 'Tanaka', 'Fontaine', 'Dubois',
  'Castillo', 'Nielsen', 'Silva', 'Kowalski', 'Hammerton', 'Werstappen', 'Leclerk',
  'Morris', 'Rustell', 'Gaslynn', 'Oconnor', 'Sainzo', 'Pastri', 'Tsunamoto', 'Alboon'
];

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomDriverName(nat?: Nationality): string {
  if (nat?.name === 'Thailand') {
    const thFirst = ['Alex', 'Somchai', 'Nattapong', 'Krittin', 'Tawan', 'Peerawat'];
    const thLast = ['Vongvanich', 'Srisawat', 'Nakarun', 'Chindawan', 'Suwanarat', 'Panyarachun'];
    return `${getRandomElement(thFirst)} ${getRandomElement(thLast)}`;
  }
  if (nat?.name === 'Japan') {
    const jpFirst = ['Kenji', 'Ryota', 'Shun', 'Tatsuro', 'Kazuki', 'Yuki'];
    const jpLast = ['Takahashi', 'Kobayashi', 'Yamamoto', 'Kato', 'Sato', 'Watanabe'];
    return `${getRandomElement(jpFirst)} ${getRandomElement(jpLast)}`;
  }
  return `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`;
}

// Generate an available driver for the transfer market
export function generateRandomMarketDriver(idOverride?: string): Driver {
  const nat = getRandomElement(ALL_NATIONALITIES);
  const name = generateRandomDriverName(nat);
  const age = 19 + Math.floor(Math.random() * 16); // 19 to 34
  
  // Overall between 76 and 95 (never exceeding MAX_STAT_CAP = 99)
  const baseOvr = 76 + Math.floor(Math.random() * 19);
  const overall = clampStat(baseOvr);
  
  const pace = clampStat(overall + (Math.floor(Math.random() * 7) - 3));
  const raceCraft = clampStat(overall + (Math.floor(Math.random() * 7) - 3));
  const experience = clampStat(Math.min(99, Math.round(age * 2.3 + Math.random() * 15)));

  const id = idOverride || 'mkt-drv-' + Math.random().toString(36).substring(2, 9);
  const pricing = calcDriverPrice(overall, {
    seed: id,
    age,
    pace,
    experience,
  });

  return {
    id,
    name,
    age,
    nationality: nat,
    overall,
    pace,
    raceCraft,
    experience,
    salary: pricing.salary,
    buyoutCost: pricing.buyout,
    avatarSeed: `${name}-${id}`,
    expiresAt: Date.now() + MARKET_REFRESH_INTERVAL_MS,
  };
}

// Generate starting driver for custom constructor teams (overall between 78 and 84)
export function generateStarterDriver(idOverride: string, minOvr: number = 78, maxOvr: number = 84): Driver {
  const nat = getRandomElement(ALL_NATIONALITIES);
  const name = generateRandomDriverName(nat);
  const age = 20 + Math.floor(Math.random() * 8); // 20 to 27
  
  const overall = minOvr + Math.floor(Math.random() * (maxOvr - minOvr + 1));
  const pace = clampStat(overall + (Math.floor(Math.random() * 5) - 2));
  const raceCraft = clampStat(overall + (Math.floor(Math.random() * 5) - 2));
  const experience = clampStat(Math.min(99, Math.round(age * 2.5 + Math.random() * 10)));
  const pricing = calcDriverPrice(overall, {
    seed: idOverride,
    age,
    pace,
    experience,
  });

  return {
    id: idOverride,
    name,
    age,
    nationality: nat,
    overall,
    pace,
    raceCraft,
    experience,
    salary: pricing.salary,
    buyoutCost: pricing.buyout,
    avatarSeed: `${name}-${idOverride}`,
  };
}

// Generate an available strategist
const STRATEGIST_TITLES = [
  'Senior AI Telemetry Tactician',
  'Grand Prix Master Strategist',
  'Lead Race Operations Engineer',
  'Predictive Aerodynamic Tactician',
  'Chief Pit Wall Analyst',
  'High-Speed Data Modeling Director',
];

const STRATEGIST_PERSONALITIES = [
  'Expert in calculating pit windows and deep tire degradation curves.',
  'Legendary track sense; predicts weather shifts and Safety Car timing flawlessly.',
  'Specializes in undercut strategy and surgical pit lane overtaking.',
  'Risk-averse and disciplined; prioritizes clean air and defending track position.',
  'Aggressive tactician; master of intermediate-slick tire calls in changing conditions.',
  'Real-time Monte Carlo simulation specialist optimizing optimum pit windows.',
];

export function generateRandomStrategist(idOverride?: string): Strategist {
  const first = getRandomElement(['Dr. Clara', 'Elena', 'Marcus', 'Hiroshi', 'Guillaume', 'Sofia', 'Matthias', 'Viktor']);
  const last = getRandomElement(['Richter', 'Vasseur', 'Vance', 'Sato', 'Bernard', 'Novak', 'Lindner', 'Kovacs']);
  const name = `${first} ${last}`;
  
  const overall = clampStat(75 + Math.floor(Math.random() * 20)); // 75-94
  const decisions = clampStat(overall + (Math.floor(Math.random() * 7) - 3));
  const strategy = clampStat(overall + (Math.floor(Math.random() * 7) - 3));

  const salary = Math.round((Math.pow(overall / 50, 4) * 50_000) / 20_000) * 20_000;
  const hireCost = Math.round((salary * 2.4) / 50_000) * 50_000;

  const id = idOverride || 'strat-' + Math.random().toString(36).substring(2, 9);

  return {
    id,
    name,
    title: getRandomElement(STRATEGIST_TITLES),
    nationality: getRandomElement(ALL_NATIONALITIES),
    overall,
    decisions,
    strategy,
    salary: Math.max(200_000, salary),
    hireCost: Math.max(400_000, hireCost),
    personality: getRandomElement(STRATEGIST_PERSONALITIES),
    avatarSeed: `${name}-${id}`,
    expiresAt: Date.now() + MARKET_REFRESH_INTERVAL_MS,
  };
}

// Generate an available pit crew squad
const PIT_CREW_NAMES = [
  'Apex Redline World-Class Crew',
  'Titan Hydraulics Squad',
  'Rapid Bay Mechanics',
  'Precision Impact Wheelmen',
  'Sonic Pneumatics Division',
  'Vanguard Quick-Jack Unit',
  'Overdrive Pit Masters',
];

export function generateRandomPitCrew(idOverride?: string): PitCrew {
  const name = getRandomElement(PIT_CREW_NAMES) + ` #${Math.floor(Math.random() * 90 + 10)}`;
  const level = Math.floor(Math.random() * 5) + 1; // 1-5
  
  // Base overall based on level
  const baseOvr = 65 + level * 6 + Math.floor(Math.random() * 5);
  const overall = clampStat(baseOvr);
  const speed = clampStat(overall + (Math.floor(Math.random() * 6) - 2));
  const precision = clampStat(overall + (Math.floor(Math.random() * 6) - 2));

  const salary = Math.round((Math.pow(overall / 45, 3.6) * 35_000) / 25_000) * 25_000;
  const hireCost = Math.round((salary * 3.2) / 50_000) * 50_000;

  const id = idOverride || 'crew-' + Math.random().toString(36).substring(2, 9);

  return {
    id,
    name,
    nationality: getRandomElement(ALL_NATIONALITIES),
    overall,
    precision,
    speed,
    salary: Math.max(180_000, salary),
    hireCost: Math.max(350_000, hireCost),
    level,
    avatarSeed: `${name}-${id}`,
    expiresAt: Date.now() + MARKET_REFRESH_INTERVAL_MS,
  };
}

// Generate a scout candidate for Open Network
const SCOUT_NAMES = [
  'Sir Arthur Sterling',
  'Carlos Mendez-Vega',
  'Devon Mitchell',
  'Amina Khouri',
  'Liam Callaghan',
  'Hans-Dieter Gruber',
  'Takahiro Mori',
  'Camila Barbosa',
  'Dmitri Volkov',
  'Kwame Osei',
];

export function generateRandomScoutCandidate(targetStars?: number, idOverride?: string): Scout {
  const stars = targetStars !== undefined ? targetStars : (Math.floor(Math.random() * 5) + 1);
  const name = getRandomElement(SCOUT_NAMES);
  const specialty = getRandomElement(ALL_CONTINENTS);

  // Chance specified in prompt: 5 stars = 40% (0.40), 1 star = 5% (0.05)
  const highTierChanceTable: Record<number, number> = {
    1: 0.05,
    2: 0.12,
    3: 0.20,
    4: 0.30,
    5: 0.40,
  };
  const highTierChance = highTierChanceTable[stars] || 0.10;

  const salaryTable: Record<number, number> = {
    1: 40_000,
    2: 75_000,
    3: 130_000,
    4: 220_000,
    5: 350_000,
  };
  const hireCostTable: Record<number, number> = {
    1: 120_000,
    2: 240_000,
    3: 420_000,
    4: 750_000,
    5: 1_200_000,
  };

  const id = idOverride || 'cand-scout-' + Math.random().toString(36).substring(2, 9);

  return {
    id,
    name,
    stars,
    salary: salaryTable[stars],
    hireCost: hireCostTable[stars],
    specialty,
    highTierChance,
    isAssignedTo: null,
    avatarSeed: `${name}-${stars}star-${id}`,
    expiresAt: Date.now() + MARKET_REFRESH_INTERVAL_MS,
  };
}
