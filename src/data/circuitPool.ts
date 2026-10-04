import { GrandPrix, ContinentName, CircuitType } from '../types/game';
import { TRACK_LAYOUTS_30 } from './trackLayouts';
import { INITIAL_GRAND_PRIX } from './initialData';

export interface PoolCircuitTemplate {
  id: string;
  name: string;
  circuitName: string;
  city: string;
  country: string;
  continent: ContinentName;
  circuitType: CircuitType;
  lat: number;
  lng: number;
  flag: string;
  totalLaps: number;
  weather: 'Dry' | 'Cloudy' | 'Wet' | 'Changing';
  lapLengthKm: number;
  corners: number;
  difficulty: 'Low' | 'Medium' | 'High';
  firstPlacePrize: number;
  trackLayoutPath?: string;
}

export const CIRCUIT_POOL_30: PoolCircuitTemplate[] = [
  // =========================================================================
  // EUROPE (5 circuits)
  // =========================================================================
  {
    id: 'pool-eu-1',
    name: 'Silverstone Grand Circuit',
    circuitName: 'Silverstone Grand Circuit',
    city: 'Silverstone',
    country: 'United Kingdom',
    continent: 'Europe',
    circuitType: 'Race Circuit',
    lat: 52.0786,
    lng: -1.0169,
    flag: '🇬🇧',
    totalLaps: 12,
    weather: 'Wet',
    lapLengthKm: 5.891,
    corners: 18,
    difficulty: 'Medium',
    firstPlacePrize: 20_250_000,
  },
  {
    id: 'pool-eu-2',
    name: 'Monza Temple of Speed',
    circuitName: 'Monza Temple of Speed',
    city: 'Monza',
    country: 'Italy',
    continent: 'Europe',
    circuitType: 'Race Circuit',
    lat: 45.6156,
    lng: 9.2811,
    flag: '🇮🇹',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 5.793,
    corners: 11,
    difficulty: 'Medium',
    firstPlacePrize: 19_500_000,
  },
  {
    id: 'pool-eu-3',
    name: 'Spa Ardennes Circuit',
    circuitName: 'Spa Ardennes Circuit',
    city: 'Spa',
    country: 'Belgium',
    continent: 'Europe',
    circuitType: 'Road Circuit',
    lat: 50.4372,
    lng: 5.9714,
    flag: '🇧🇪',
    totalLaps: 12,
    weather: 'Changing',
    lapLengthKm: 7.004,
    corners: 19,
    difficulty: 'High',
    firstPlacePrize: 21_000_000,
  },
  {
    id: 'pool-eu-4',
    name: 'Catalunya Ring',
    circuitName: 'Catalunya Ring',
    city: 'Barcelona',
    country: 'Spain',
    continent: 'Europe',
    circuitType: 'Race Circuit',
    lat: 41.57,
    lng: 2.2611,
    flag: '🇪🇸',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 4.675,
    corners: 14,
    difficulty: 'Medium',
    firstPlacePrize: 18_750_000,
  },
  {
    id: 'pool-eu-5',
    name: 'Monaco Harbor Street Circuit',
    circuitName: 'Monaco Harbor Street Circuit',
    city: 'Monte Carlo',
    country: 'Monaco',
    continent: 'Europe',
    circuitType: 'Street Circuit',
    lat: 43.7347,
    lng: 7.4206,
    flag: '🇲🇨',
    totalLaps: 14,
    weather: 'Dry',
    lapLengthKm: 3.337,
    corners: 19,
    difficulty: 'High',
    firstPlacePrize: 23_250_000,
  },

  // =========================================================================
  // ASIA (5 circuits)
  // =========================================================================
  {
    id: 'pool-as-1',
    name: 'Suzuka Speed Park',
    circuitName: 'Suzuka Speed Park',
    city: 'Suzuka',
    country: 'Japan',
    continent: 'Asia',
    circuitType: 'Race Circuit',
    lat: 34.8431,
    lng: 136.5414,
    flag: '🇯🇵',
    totalLaps: 12,
    weather: 'Cloudy',
    lapLengthKm: 5.807,
    corners: 18,
    difficulty: 'High',
    firstPlacePrize: 19_800_000,
  },
  {
    id: 'pool-as-2',
    name: 'Marina Bay Night Circuit',
    circuitName: 'Marina Bay Night Circuit',
    city: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    circuitType: 'Street Circuit',
    lat: 1.2914,
    lng: 103.864,
    flag: '🇸🇬',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 4.94,
    corners: 23,
    difficulty: 'High',
    firstPlacePrize: 22_200_000,
  },
  {
    id: 'pool-as-3',
    name: 'Shanghai International Park',
    circuitName: 'Shanghai International Park',
    city: 'Shanghai',
    country: 'China',
    continent: 'Asia',
    circuitType: 'Race Circuit',
    lat: 31.3389,
    lng: 121.22,
    flag: '🇨🇳',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 5.451,
    corners: 16,
    difficulty: 'Medium',
    firstPlacePrize: 19_500_000,
  },
  {
    id: 'pool-as-4',
    name: 'Sakhir Desert Circuit',
    circuitName: 'Sakhir Desert Circuit',
    city: 'Sakhir',
    country: 'Bahrain',
    continent: 'Asia',
    circuitType: 'Race Circuit',
    lat: 26.0325,
    lng: 50.5106,
    flag: '🇧🇭',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 5.412,
    corners: 15,
    difficulty: 'Medium',
    firstPlacePrize: 19_200_000,
  },
  {
    id: 'pool-as-5',
    name: 'Yas Island Circuit',
    circuitName: 'Yas Island Circuit',
    city: 'Abu Dhabi',
    country: 'UAE',
    continent: 'Asia',
    circuitType: 'Race Circuit',
    lat: 24.4672,
    lng: 54.6031,
    flag: '🇦🇪',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 5.281,
    corners: 16,
    difficulty: 'Medium',
    firstPlacePrize: 24_000_000,
  },

  // =========================================================================
  // NORTH AMERICA (5 circuits)
  // =========================================================================
  {
    id: 'pool-na-1',
    name: 'Americas Grand Circuit',
    circuitName: 'Americas Grand Circuit',
    city: 'Austin',
    country: 'USA',
    continent: 'North America',
    circuitType: 'Race Circuit',
    lat: 30.1328,
    lng: -97.6411,
    flag: '🇺🇸',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 5.513,
    corners: 20,
    difficulty: 'High',
    firstPlacePrize: 21_000_000,
  },
  {
    id: 'pool-na-2',
    name: 'Neon Strip Circuit',
    circuitName: 'Neon Strip Circuit',
    city: 'Las Vegas',
    country: 'USA',
    continent: 'North America',
    circuitType: 'Street Circuit',
    lat: 36.1147,
    lng: -115.1728,
    flag: '🇺🇸',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 6.201,
    corners: 17,
    difficulty: 'Medium',
    firstPlacePrize: 22_500_000,
  },
  {
    id: 'pool-na-3',
    name: 'Miami Bayfront Circuit',
    circuitName: 'Miami Bayfront Circuit',
    city: 'Miami',
    country: 'USA',
    continent: 'North America',
    circuitType: 'Street Circuit',
    lat: 25.9581,
    lng: -80.2389,
    flag: '🇺🇸',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 5.412,
    corners: 19,
    difficulty: 'High',
    firstPlacePrize: 21_300_000,
  },
  {
    id: 'pool-na-4',
    name: 'Maple Leaf Park Circuit',
    circuitName: 'Maple Leaf Park Circuit',
    city: 'Montreal',
    country: 'Canada',
    continent: 'North America',
    circuitType: 'Race Circuit',
    lat: 45.5,
    lng: -73.5228,
    flag: '🇨🇦',
    totalLaps: 13,
    weather: 'Cloudy',
    lapLengthKm: 4.361,
    corners: 14,
    difficulty: 'Medium',
    firstPlacePrize: 19_800_000,
  },
  {
    id: 'pool-na-5',
    name: 'Mexico Altitude Circuit',
    circuitName: 'Mexico Altitude Circuit',
    city: 'Mexico City',
    country: 'Mexico',
    continent: 'North America',
    circuitType: 'Race Circuit',
    lat: 19.4042,
    lng: -99.0907,
    flag: '🇲🇽',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 4.304,
    corners: 17,
    difficulty: 'Medium',
    firstPlacePrize: 20_400_000,
  },

  // =========================================================================
  // SOUTH AMERICA (5 circuits)
  // =========================================================================
  {
    id: 'pool-sa-1',
    name: 'Interlagos Heritage Circuit',
    circuitName: 'Interlagos Heritage Circuit',
    city: 'São Paulo',
    country: 'Brazil',
    continent: 'South America',
    circuitType: 'Race Circuit',
    lat: -23.7036,
    lng: -46.6997,
    flag: '🇧🇷',
    totalLaps: 13,
    weather: 'Changing',
    lapLengthKm: 4.309,
    corners: 15,
    difficulty: 'High',
    firstPlacePrize: 21_000_000,
  },
  {
    id: 'pool-sa-2',
    name: 'Rio Coastal Circuit',
    circuitName: 'Rio Coastal Circuit',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    continent: 'South America',
    circuitType: 'Street Circuit',
    lat: -22.9068,
    lng: -43.1729,
    flag: '🇧🇷',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 4.82,
    corners: 16,
    difficulty: 'Medium',
    firstPlacePrize: 20_100_000,
  },
  {
    id: 'pool-sa-3',
    name: 'Buenos Aires Grand Park',
    circuitName: 'Buenos Aires Grand Park',
    city: 'Buenos Aires',
    country: 'Argentina',
    continent: 'South America',
    circuitType: 'Road Circuit',
    lat: -34.6975,
    lng: -58.4686,
    flag: '🇦🇷',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 4.259,
    corners: 15,
    difficulty: 'Medium',
    firstPlacePrize: 19_500_000,
  },
  {
    id: 'pool-sa-4',
    name: 'Andes Highland Circuit',
    circuitName: 'Andes Highland Circuit',
    city: 'Santiago',
    country: 'Chile',
    continent: 'South America',
    circuitType: 'Race Circuit',
    lat: -33.4489,
    lng: -70.6693,
    flag: '🇨🇱',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 5.12,
    corners: 18,
    difficulty: 'High',
    firstPlacePrize: 19_950_000,
  },
  {
    id: 'pool-sa-5',
    name: 'Bogota City Circuit',
    circuitName: 'Bogota City Circuit',
    city: 'Bogotá',
    country: 'Colombia',
    continent: 'South America',
    circuitType: 'Street Circuit',
    lat: 4.711,
    lng: -74.0721,
    flag: '🇨🇴',
    totalLaps: 12,
    weather: 'Cloudy',
    lapLengthKm: 4.54,
    corners: 20,
    difficulty: 'High',
    firstPlacePrize: 19_200_000,
  },

  // =========================================================================
  // AFRICA (5 circuits)
  // =========================================================================
  {
    id: 'pool-af-1',
    name: 'Kyalami Heritage Circuit',
    circuitName: 'Kyalami Heritage Circuit',
    city: 'Johannesburg',
    country: 'South Africa',
    continent: 'Africa',
    circuitType: 'Race Circuit',
    lat: -25.9986,
    lng: 28.0764,
    flag: '🇿🇦',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 4.529,
    corners: 16,
    difficulty: 'High',
    firstPlacePrize: 20_250_000,
  },
  {
    id: 'pool-af-2',
    name: 'Cape Coastal Circuit',
    circuitName: 'Cape Coastal Circuit',
    city: 'Cape Town',
    country: 'South Africa',
    continent: 'Africa',
    circuitType: 'Street Circuit',
    lat: -33.9249,
    lng: 18.4241,
    flag: '🇿🇦',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 4.86,
    corners: 18,
    difficulty: 'High',
    firstPlacePrize: 20_700_000,
  },
  {
    id: 'pool-af-3',
    name: 'Casablanca Street Circuit',
    circuitName: 'Casablanca Street Circuit',
    city: 'Casablanca',
    country: 'Morocco',
    continent: 'Africa',
    circuitType: 'Street Circuit',
    lat: 33.5731,
    lng: -7.5898,
    flag: '🇲🇦',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 4.712,
    corners: 15,
    difficulty: 'Medium',
    firstPlacePrize: 19_500_000,
  },
  {
    id: 'pool-af-4',
    name: 'Cairo Desert Ring',
    circuitName: 'Cairo Desert Ring',
    city: 'Cairo',
    country: 'Egypt',
    continent: 'Africa',
    circuitType: 'Race Circuit',
    lat: 30.0444,
    lng: 31.2357,
    flag: '🇪🇬',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 5.21,
    corners: 14,
    difficulty: 'Medium',
    firstPlacePrize: 19_350_000,
  },
  {
    id: 'pool-af-5',
    name: 'Lagos Waterfront Circuit',
    circuitName: 'Lagos Waterfront Circuit',
    city: 'Lagos',
    country: 'Nigeria',
    continent: 'Africa',
    circuitType: 'Street Circuit',
    lat: 6.5244,
    lng: 3.3792,
    flag: '🇳🇬',
    totalLaps: 13,
    weather: 'Changing',
    lapLengthKm: 4.65,
    corners: 17,
    difficulty: 'High',
    firstPlacePrize: 19_650_000,
  },

  // =========================================================================
  // OCEANIA (5 circuits)
  // =========================================================================
  {
    id: 'pool-oc-1',
    name: 'Albert Park Circuit',
    circuitName: 'Albert Park Circuit',
    city: 'Melbourne',
    country: 'Australia',
    continent: 'Oceania',
    circuitType: 'Street Circuit',
    lat: -37.8497,
    lng: 144.968,
    flag: '🇦🇺',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 5.278,
    corners: 14,
    difficulty: 'Medium',
    firstPlacePrize: 18_750_000,
  },
  {
    id: 'pool-oc-2',
    name: 'Sydney Harbour Circuit',
    circuitName: 'Sydney Harbour Circuit',
    city: 'Sydney',
    country: 'Australia',
    continent: 'Oceania',
    circuitType: 'Street Circuit',
    lat: -33.8688,
    lng: 151.2093,
    flag: '🇦🇺',
    totalLaps: 13,
    weather: 'Dry',
    lapLengthKm: 4.98,
    corners: 19,
    difficulty: 'High',
    firstPlacePrize: 20_550_000,
  },
  {
    id: 'pool-oc-3',
    name: 'Gold Coast Street Circuit',
    circuitName: 'Gold Coast Street Circuit',
    city: 'Gold Coast',
    country: 'Australia',
    continent: 'Oceania',
    circuitType: 'Street Circuit',
    lat: -27.9866,
    lng: 153.4284,
    flag: '🇦🇺',
    totalLaps: 12,
    weather: 'Dry',
    lapLengthKm: 4.47,
    corners: 15,
    difficulty: 'Medium',
    firstPlacePrize: 19_350_000,
  },
  {
    id: 'pool-oc-4',
    name: 'Auckland Bay Circuit',
    circuitName: 'Auckland Bay Circuit',
    city: 'Auckland',
    country: 'New Zealand',
    continent: 'Oceania',
    circuitType: 'Street Circuit',
    lat: -36.8485,
    lng: 174.7633,
    flag: '🇳🇿',
    totalLaps: 12,
    weather: 'Changing',
    lapLengthKm: 4.81,
    corners: 16,
    difficulty: 'Medium',
    firstPlacePrize: 19_650_000,
  },
  {
    id: 'pool-oc-5',
    name: 'Perth Outback Circuit',
    circuitName: 'Perth Outback Circuit',
    city: 'Perth',
    country: 'Australia',
    continent: 'Oceania',
    circuitType: 'Race Circuit',
    lat: -31.9505,
    lng: 115.8605,
    flag: '🇦🇺',
    totalLaps: 14,
    weather: 'Dry',
    lapLengthKm: 4.38,
    corners: 13,
    difficulty: 'Medium',
    firstPlacePrize: 18_900_000,
  },
];

// Attach trackLayoutPath to all 30 pool circuits
CIRCUIT_POOL_30.forEach((c) => {
  if (TRACK_LAYOUTS_30[c.id]) {
    c.trackLayoutPath = TRACK_LAYOUTS_30[c.id].path;
  }
});

/**
 * Projects latitude (-90 to +90) and longitude (-180 to +180) to 2D SVG canvas (width x height)
 */
export function projectLatLngToSvg(
  lat: number,
  lng: number,
  width: number = 1000,
  height: number = 500
): { x: number; y: number } {
  // Equirectangular projection scaled to viewBox
  const x = ((lng + 180) / 360) * width;
  // In SVG, y=0 is top, y=height is bottom
  const y = ((90 - lat) / 180) * height;
  return {
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
  };
}

/**
 * Generates the authentic, fixed 18-round World Tour Grand Prix calendar.
 * Guaranteed to be 100% fixed, non-random, and identical across all save files.
 */
export function getFixedWorldTourCalendar(seasonNumber: number = 1): GrandPrix[] {
  return INITIAL_GRAND_PRIX.map((gp) => ({
    ...gp,
    id: `s${seasonNumber}-${gp.id}`,
    isCompleted: false,
    finalized: false,
  }));
}

/**
 * Backward compatibility alias for any existing references.
 * Always returns the deterministic, fixed 18-round World Tour calendar.
 */
export const generateRandomSeasonCalendar = getFixedWorldTourCalendar;

/**
 * Ensures teamState has the authentic fixed 18-circuit World Tour calendar.
 * Guaranteed to be deterministic and identical across all save files.
 * If an older save slot had randomized circuits, this migrates it cleanly
 * to the fixed World Tour calendar while preserving completed race counts.
 */
export function getOrInitializeSeasonCircuits(
  seasonCircuits?: GrandPrix[],
  seasonNumber: number = 1
): GrandPrix[] {
  const fixedTemplate = getFixedWorldTourCalendar(seasonNumber);

  if (seasonCircuits && Array.isArray(seasonCircuits) && seasonCircuits.length === 18) {
    const isAuthenticFixedTour = seasonCircuits.every(
      (c, idx) =>
        c.round === idx + 1 &&
        (c.id.includes(fixedTemplate[idx].id) ||
          c.name === fixedTemplate[idx].name ||
          c.circuitName === fixedTemplate[idx].circuitName)
    );

    if (isAuthenticFixedTour) {
      return seasonCircuits.map((c, idx) => ({
        ...fixedTemplate[idx],
        ...c,
        environmentName: fixedTemplate[idx].environmentName,
        environmentDescription: fixedTemplate[idx].environmentDescription,
        trackLayoutPath: fixedTemplate[idx].trackLayoutPath,
      }));
    }

    // Older save had randomized circuits: migrate to fixed 18-stage World Tour
    const completedCount = seasonCircuits.filter((c) => c.isCompleted || c.finalized).length;
    return fixedTemplate.map((c, idx) => ({
      ...c,
      isCompleted: idx < completedCount,
      finalized: idx < completedCount,
    }));
  }

  return fixedTemplate;
}
