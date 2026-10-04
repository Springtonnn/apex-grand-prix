import { CarStats, ContinentName, AcademyDriver, Nationality } from '../types/game';

// Maximum attribute cap for any driver or component
export const MAX_STAT_CAP = 99;

export function clampStat(value: number): number {
  return Math.min(MAX_STAT_CAP, Math.max(1, Math.round(value)));
}

export interface DriverPriceAnchor {
  overall: number;
  buyout: number;
  salary: number;
}

export const DRIVER_PRICE_ANCHORS: DriverPriceAnchor[] = [
  { overall: 70, buyout: 3_000_000, salary: 600_000 },
  { overall: 75, buyout: 8_000_000, salary: 1_000_000 },
  { overall: 80, buyout: 18_000_000, salary: 1_600_000 },
  { overall: 85, buyout: 38_000_000, salary: 2_400_000 },
  { overall: 90, buyout: 75_000_000, salary: 3_400_000 },
  { overall: 95, buyout: 130_000_000, salary: 4_600_000 },
  { overall: 99, buyout: 200_000_000, salary: 5_800_000 },
];

export interface DriverPriceOptions {
  seed?: string | number;
  age?: number;
  pace?: number;
  experience?: number;
}

export interface DriverPriceResult {
  buyout: number;
  salary: number;
  baseBuyout: number;
  baseSalary: number;
  variancePct: number;
}

/**
 * Calculates official driver buyout fee and salary per race using exponential interpolation.
 * OVR 70  -> Buyout $3,000,000   / Salary $600,000
 * OVR 75  -> Buyout $8,000,000   / Salary $1,000,000
 * OVR 80  -> Buyout $18,000,000  / Salary $1,600,000
 * OVR 85  -> Buyout $38,000,000  / Salary $2,400,000
 * OVR 90  -> Buyout $75,000,000  / Salary $3,400,000
 * OVR 95  -> Buyout $130,000,000 / Salary $4,600,000
 * OVR 99  -> Buyout $200,000,000 / Salary $5,800,000
 * (OVR < 70 drops exponentially down to minimum Buyout $1,000,000 / Salary $300,000)
 *
 * Deterministic variance (+/- 10%) per driver seed, plus slight youth/pace prodigy bonus.
 */
export function calcDriverPrice(
  overall: number,
  options?: DriverPriceOptions
): DriverPriceResult {
  const ovr = clampStat(overall);

  let rawBuyout = 0;
  let rawSalary = 0;

  if (ovr <= DRIVER_PRICE_ANCHORS[0].overall) {
    // Extrapolate backwards exponentially from (70, 75)
    const p0 = DRIVER_PRICE_ANCHORS[0]; // 70
    const p1 = DRIVER_PRICE_ANCHORS[1]; // 75
    const t = (ovr - p0.overall) / (p1.overall - p0.overall);
    rawBuyout = p0.buyout * Math.pow(p1.buyout / p0.buyout, t);
    rawSalary = p0.salary * Math.pow(p1.salary / p0.salary, t);
  } else {
    let matched = false;
    for (let i = 0; i < DRIVER_PRICE_ANCHORS.length - 1; i++) {
      const p0 = DRIVER_PRICE_ANCHORS[i];
      const p1 = DRIVER_PRICE_ANCHORS[i + 1];
      if (ovr >= p0.overall && ovr <= p1.overall) {
        const t = (ovr - p0.overall) / (p1.overall - p0.overall);
        rawBuyout = p0.buyout * Math.pow(p1.buyout / p0.buyout, t);
        rawSalary = p0.salary * Math.pow(p1.salary / p0.salary, t);
        matched = true;
        break;
      }
    }
    if (!matched) {
      const last = DRIVER_PRICE_ANCHORS[DRIVER_PRICE_ANCHORS.length - 1];
      rawBuyout = last.buyout;
      rawSalary = last.salary;
    }
  }

  // Minimum floor enforcement
  const baseBuyout = Math.max(1_000_000, Math.round(rawBuyout));
  const baseSalary = Math.max(300_000, Math.round(rawSalary));

  // Deterministic variance calculation (+/- 10%)
  let variancePct = 0;
  if (options?.seed !== undefined) {
    const str = String(options.seed);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    // Normalized in [-0.07, +0.07]
    const hashVal = ((Math.abs(hash) % 10000) / 5000) - 1;
    variancePct = hashVal * 0.07;
  }

  // Slight prodigy premium for young drivers with low experience but high pace
  if (options?.age && options?.pace && options?.experience) {
    if (options.age < 26 && options.pace > options.experience) {
      const prodigyBonus = Math.min(
        0.05,
        ((options.pace - options.experience) / 100) * ((26 - options.age) / 6)
      );
      variancePct += prodigyBonus;
    }
  }

  // Strictly clamp variance between -10% and +10%
  variancePct = Math.max(-0.10, Math.min(0.10, variancePct));

  // Compute final amounts, rounded to clean F1 contract multiples ($50k for buyout, $25k for salary)
  let buyout = Math.round((baseBuyout * (1 + variancePct)) / 50_000) * 50_000;
  let salary = Math.round((baseSalary * (1 + variancePct)) / 25_000) * 25_000;

  // Strict floor checks
  buyout = Math.max(1_000_000, buyout);
  salary = Math.max(300_000, salary);

  return {
    buyout,
    salary,
    baseBuyout,
    baseSalary,
    variancePct,
  };
}

// Calculate car overall from components
export function calculateCarOverall(car: CarStats): number {
  const avg = (car.engine * 0.25 + car.aero * 0.25 + car.chassis * 0.2 + car.brakes * 0.15 + car.suspension * 0.15);
  return clampStat(avg);
}

// Calculate upgrade cost with exponential scaling
// Yormore upgraded, exponential increase
export function getCarUpgradeCost(currentStat: number): number {
  if (currentStat >= MAX_STAT_CAP) return 0;
  // Base cost starting around $150,000 for level 50, exponentially scaling
  // Formula: base * (factor ^ (current - 45))
  const base = 120_000;
  const factor = 1.13;
  const exponent = Math.max(0, currentStat - 45);
  const cost = base * Math.pow(factor, exponent);
  // Round to nearest 5,000 or 10,000
  return Math.round(cost / 5000) * 5000;
}

// Pit stop duration calculation based on Pit Crew speed and precision
export function calculatePitStopDuration(speed: number, precision: number): {
  duration: number; // in seconds
  hadMistake: boolean;
  message: string;
} {
  // Speed ranges 1-99
  // Perfect 99 speed gives ~2.1s base. Speed 20 gives ~4.2s base
  const clampedSpeed = clampStat(speed);
  const clampedPrecision = clampStat(precision);
  
  // Base time: 4.4 - (speed / 99) * 2.3  => 4.4 down to 2.1
  let baseDuration = 4.4 - (clampedSpeed / 99) * 2.3;
  // Add small random jitter (+/- 0.15s)
  const jitter = (Math.random() * 0.3) - 0.15;
  baseDuration += jitter;

  // Mistake chance inversely proportional to precision
  // Precision 99 -> 1.5% mistake, Precision 30 -> 18% mistake
  const mistakeRisk = (100 - clampedPrecision) * 0.002;
  const hadMistake = Math.random() < mistakeRisk;

  let delay = 0;
  let message = 'Flawless pit stop! Perfect execution.';

  if (hadMistake) {
    // Wheel nut stuck or jack slip
    delay = 1.8 + Math.random() * 2.2;
    message = 'Wheel nut slight cross-thread! Lost +' + delay.toFixed(1) + 's';
  } else if (baseDuration < 2.4) {
    message = '⚡ Lightning-fast pit stop!';
  }

  const finalDuration = Math.max(1.9, Number((baseDuration + delay).toFixed(2)));

  return {
    duration: finalDuration,
    hadMistake,
    message,
  };
}

// Generate an academy driver based on scout stars
export function generateScoutedDriver(continent: ContinentName, scoutStars: number): AcademyDriver {
  // Scout star high tier chance:
  // 1-star: 5% (0.05)
  // 2-star: 12% (0.12)
  // 3-star: 20% (0.20)
  // 4-star: 30% (0.30)
  // 5-star: 40% (0.40)
  const highTierChances: Record<number, number> = {
    1: 0.05,
    2: 0.12,
    3: 0.20,
    4: 0.30,
    5: 0.40,
  };

  const highTierChance = highTierChances[scoutStars] || 0.10;
  const isHighTier = Math.random() < highTierChance;

  let overall: number;
  let potentialGrade: 'S+' | 'S' | 'A' | 'B' | 'C';
  let minPotential: number;
  let maxPotential: number;

  if (isHighTier) {
    // 85 to 94 starting overall
    overall = clampStat(85 + Math.floor(Math.random() * 9));
    potentialGrade = Math.random() > 0.4 ? 'S+' : 'S';
    minPotential = overall + 3;
    maxPotential = 99; // cap at 99
  } else {
    // Standard prospect
    const roll = Math.random();
    if (roll < 0.35) {
      // 60 - 72 (C or B grade)
      overall = clampStat(60 + Math.floor(Math.random() * 13));
      potentialGrade = 'C';
      minPotential = overall + 5;
      maxPotential = Math.min(84, overall + 14);
    } else if (roll < 0.75) {
      // 73 - 80 (B or A grade)
      overall = clampStat(73 + Math.floor(Math.random() * 8));
      potentialGrade = 'B';
      minPotential = overall + 4;
      maxPotential = Math.min(89, overall + 12);
    } else {
      // 81 - 84 (A grade)
      overall = clampStat(81 + Math.floor(Math.random() * 4));
      potentialGrade = 'A';
      minPotential = overall + 4;
      maxPotential = Math.min(94, overall + 10);
    }
  }

  const pace = clampStat(overall + (Math.floor(Math.random() * 7) - 3));
  const raceCraft = clampStat(overall + (Math.floor(Math.random() * 7) - 3));
  const experience = clampStat(Math.floor(overall * 0.65) + Math.floor(Math.random() * 8));

  const nationality = getRandomNationalityForContinent(continent);
  const name = getRandomDriverName(nationality.name);

  return {
    id: 'acad-' + Math.random().toString(36).substring(2, 9),
    name,
    age: 16 + Math.floor(Math.random() * 4), // 16 - 19
    nationality,
    overall: clampStat(overall),
    pace: clampStat(pace),
    raceCraft: clampStat(raceCraft),
    experience: clampStat(experience),
    potentialGrade,
    potentialMin: clampStat(minPotential),
    potentialMax: clampStat(maxPotential),
    continent,
    discoveredAtRound: 1,
  };
}

// Format numbers as currency
export function formatMoney(amount: number): string {
  return '$' + amount.toLocaleString('en-US');
}

export function formatShortMoney(amount: number): string {
  if (amount >= 1_000_000_000) {
    return '$' + (amount / 1_000_000_000).toFixed(1) + 'B';
  }
  if (amount >= 1_000_000) {
    return '$' + (amount / 1_000_000).toFixed(1) + 'M';
  }
  if (amount >= 1_000) {
    return '$' + (amount / 1_000).toFixed(0) + 'K';
  }
  return '$' + amount;
}

// Continent to Nationalities pool
const CONTINENT_NATIONS: Record<ContinentName, Nationality[]> = {
  Europe: [
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
    { name: 'Monaco', code: 'MC', flag: '🇲🇨' },
    { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
    { name: 'Spain', code: 'ES', flag: '🇪🇸' },
    { name: 'Italy', code: 'IT', flag: '🇮🇹' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪' },
    { name: 'France', code: 'FR', flag: '🇫🇷' },
    { name: 'Finland', code: 'FI', flag: '🇫🇮' },
  ],
  Asia: [
    { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵' },
    { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
    { name: 'China', code: 'CN', flag: '🇨🇳' },
    { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  ],
  'North America': [
    { name: 'United States', code: 'US', flag: '🇺🇸' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  ],
  'South America': [
    { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
    { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  ],
  Africa: [
    { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
    { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
    { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
  ],
  Oceania: [
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'New Zealand', code: 'NZ', flag: '🇳🇿' },
  ],
};

function getRandomNationalityForContinent(continent: ContinentName): Nationality {
  const pool = CONTINENT_NATIONS[continent] || CONTINENT_NATIONS['Europe'];
  return pool[Math.floor(Math.random() * pool.length)];
}

const FIRST_NAMES = [
  'Lucas', 'Matteo', 'Liam', 'Arthur', 'Maxime', 'Alexander', 'Carlos', 'Tatsuro',
  'Kenji', 'Kimi', 'Noah', 'Somchai', 'Sebastian', 'Oliver', 'Gabriel', 'Julian',
  'Enzo', 'Leonardo', 'Kai', 'Felix', 'Hugo', 'Oscar', 'Theo', 'Danil'
];

const LAST_NAMES = [
  'Vance', 'Rossi', 'Lindholm', 'Moreau', 'Sato', 'Chaiyaphum', 'Montoya', 'Santos',
  'Weber', 'Alonzy', 'Ricci', 'Bergman', 'Novak', 'Tanaka', 'Fontaine', 'Dubois',
  'Castillo', 'Nielsen', 'Silva', 'Kowalski', 'Hammerton', 'Werstappen'
];

function getRandomDriverName(countryName: string): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  if (countryName === 'Thailand') {
    return 'Alex ' + ['Vongvanich', 'Srisawat', 'Nakarun', 'Chindawan'][Math.floor(Math.random() * 4)];
  }
  if (countryName === 'Japan') {
    return ['Kenji', 'Ryota', 'Shun', 'Tatsuro'][Math.floor(Math.random() * 4)] + ' ' + ['Takahashi', 'Kobayashi', 'Yamamoto', 'Kato'][Math.floor(Math.random() * 4)];
  }
  return `${first} ${last}`;
}
