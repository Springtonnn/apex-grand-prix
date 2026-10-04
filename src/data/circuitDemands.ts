/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarStatKey, CarStats } from '../types/game';

export interface CircuitDemandInfo {
  round: number;
  circuitName: string;
  country: string;
  flag: string;
  stageName: string;
  stageTier: 1 | 2 | 3 | 4;
  rivalSpeedRange: string;
  rivalBenchmarkOvr: number;
  topContenders: string[];
  primaryFocus: CarStatKey[];
  secondaryFocus: CarStatKey[];
  trackTypeDescription: string;
  tacticalAdvice: string;
  rivalBehaviorNotice: string;
}

export const CIRCUIT_STRATEGIC_DEMANDS: Record<number, CircuitDemandInfo> = {
  1: {
    round: 1,
    circuitName: 'Albert Park Circuit',
    country: 'Australia',
    flag: '🇦🇺',
    stageName: 'Opening Flyaways',
    stageTier: 1,
    rivalSpeedRange: '320 - 330 km/h',
    rivalBenchmarkOvr: 70,
    topContenders: ['WER', 'CLK', 'MOR'],
    primaryFocus: ['engine', 'chassis'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'Semi-street parkland circuit, flowing sweeps alternating with high-speed chicanes.',
    tacticalAdvice: 'Season opener: prioritize Engine and Chassis upgrades for punchy chicane exits and agile turn-in.',
    rivalBehaviorNotice: 'Rivals race conservatively in the opening rounds; prime opportunity to secure early podium points.',
  },
  2: {
    round: 2,
    circuitName: 'Bahrain International Circuit',
    country: 'Bahrain',
    flag: '🇧🇭',
    stageName: 'Desert Power & Heavy Braking',
    stageTier: 1,
    rivalSpeedRange: '325 - 335 km/h',
    rivalBenchmarkOvr: 72,
    topContenders: ['WER', 'CLK', 'HAM'],
    primaryFocus: ['brakes', 'engine'],
    secondaryFocus: ['aero'],
    trackTypeDescription: 'Desert circuit with long straights alternating into heavy hairpin braking zones.',
    tacticalAdvice: 'Four heavy braking zones from 325+ km/h. High-grade Brakes allow deep outbraking into Turn 1 and Turn 4.',
    rivalBehaviorNotice: 'Rivals begin unleashing top-end power down straights. Upgrade Brakes to out-maneuver into corners.',
  },
  3: {
    round: 3,
    circuitName: 'Circuit de Barcelona-Catalunya',
    country: 'Spain',
    flag: '🇪🇸',
    stageName: 'Aerodynamic Benchmark',
    stageTier: 1,
    rivalSpeedRange: '330 - 340 km/h',
    rivalBenchmarkOvr: 74,
    topContenders: ['WER', 'MOR', 'CLK'],
    primaryFocus: ['aero', 'suspension'],
    secondaryFocus: ['chassis'],
    trackTypeDescription: 'Benchmark aerodynamic proving ground with demanding high-speed sweeps.',
    tacticalAdvice: 'Long sweeping Turn 3 and high-speed right-handers demand high Aero downforce to prevent understeer.',
    rivalBehaviorNotice: 'Top teams bring major Aero packages here; expect high speeds through technical corners.',
  },
  4: {
    round: 4,
    circuitName: 'Circuit de Monaco',
    country: 'Monaco',
    flag: '🇲🇨',
    stageName: 'Crown Jewel Street Fight',
    stageTier: 1,
    rivalSpeedRange: '332 - 342 km/h',
    rivalBenchmarkOvr: 76,
    topContenders: ['CLK', 'WER', 'MOR'],
    primaryFocus: ['chassis', 'brakes'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'Narrow barrier-lined street track, tight hairpins, and marina chicane.',
    tacticalAdvice: 'Top speed is secondary; razor-sharp Chassis agility and pinpoint Brake modulation dominate Monaco.',
    rivalBehaviorNotice: 'Rivals vigorously defend the racing line; rely on nimble chassis response to dive down inside chicanes.',
  },
  5: {
    round: 5,
    circuitName: 'Bangkok River Street Circuit',
    country: 'Thailand',
    flag: '🇹🇭',
    stageName: 'F1 Thailand Grand Prix (Bangkok 2026)',
    stageTier: 2,
    rivalSpeedRange: '338 - 348 km/h',
    rivalBenchmarkOvr: 78,
    topContenders: ['ABN', 'WER', 'HAM', 'MOR'],
    primaryFocus: ['chassis', 'brakes'],
    secondaryFocus: ['engine', 'aero'],
    trackTypeDescription: 'High-speed street circuit along Chao Phraya River, past Rama VIII Bridge and historic temples.',
    tacticalAdvice: 'Concrete barriers line every apex. Responsive Chassis balance and strong Brakes are paramount across Bangkok.',
    rivalBehaviorNotice: 'Alex Alboon and top outfits run with maximum aggression before the passionate home crowd.',
  },
  6: {
    round: 6,
    circuitName: 'Silverstone Circuit',
    country: 'United Kingdom',
    flag: '🇬🇧',
    stageName: 'Home of High Speed Sweepers',
    stageTier: 2,
    rivalSpeedRange: '344 - 354 km/h',
    rivalBenchmarkOvr: 80,
    topContenders: ['HAM', 'MOR', 'WER'],
    primaryFocus: ['aero', 'suspension'],
    secondaryFocus: ['engine'],
    trackTypeDescription: 'Legendary circuit featuring the high-speed Maggotts-Becketts-Chapel complex.',
    tacticalAdvice: 'Aero downforce and stiff Suspension are critical to carry extreme momentum through the Esses without washing wide.',
    rivalBehaviorNotice: 'Silver Arrow and MacLaren are formidable on home soil. An Aero rating of 80+ is vital to contend.',
  },
  7: {
    round: 7,
    circuitName: 'Red Bull Ring',
    country: 'Austria',
    flag: '🇦🇹',
    stageName: 'Alpine Power Sprint',
    stageTier: 2,
    rivalSpeedRange: '348 - 358 km/h',
    rivalBenchmarkOvr: 82,
    topContenders: ['WER', 'CLK', 'MOR'],
    primaryFocus: ['engine', 'aero'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: 'Short, rapid lap with three steep uphill full-throttle stages.',
    tacticalAdvice: 'Steep climbs brutally punish engine deficits. Prioritize Engine torque to maintain velocity up the hill.',
    rivalBehaviorNotice: 'Min Werstappen and Red Bullion are blisteringly fast here and will mount intense pressure.',
  },
  8: {
    round: 8,
    circuitName: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    flag: '🇧🇪',
    stageName: 'Ardennes High-Speed Rollercoaster',
    stageTier: 2,
    rivalSpeedRange: '354 - 364 km/h',
    rivalBenchmarkOvr: 84,
    topContenders: ['WER', 'CLK', 'MOR', 'HAM'],
    primaryFocus: ['engine', 'aero'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'Iconic Eau Rouge compression and the epic flat-out Kemmel Straight.',
    tacticalAdvice: 'If Engine power falls below 85 OVR, rivals will breeze past with DRS down the long Kemmel Straight.',
    rivalBehaviorNotice: 'Rivals breach 360 km/h and hit Speed Pads with high precision.',
  },
  9: {
    round: 9,
    circuitName: 'Circuit Zandvoort',
    country: 'Netherlands',
    flag: '🇳🇱',
    stageName: 'Banked Dunes & High Grip',
    stageTier: 2,
    rivalSpeedRange: '356 - 366 km/h',
    rivalBenchmarkOvr: 86,
    topContenders: ['WER', 'MOR', 'CLK'],
    primaryFocus: ['suspension', 'chassis'],
    secondaryFocus: ['aero'],
    trackTypeDescription: 'Banked dune corners carving through North Sea coastal dunes.',
    tacticalAdvice: 'Suspension handles enormous lateral loads through the 18-degree banking; stiff damping keeps traction locked.',
    rivalBehaviorNotice: 'Rival drivers push aggressive lines through the sand dune contours.',
  },
  10: {
    round: 10,
    circuitName: 'Autodromo Nazionale Monza',
    country: 'Italy',
    flag: '🇮🇹',
    stageName: 'The Temple of Speed',
    stageTier: 3,
    rivalSpeedRange: '364 - 374 km/h',
    rivalBenchmarkOvr: 88,
    topContenders: ['CLK', 'WER', 'SNZ', 'MOR'],
    primaryFocus: ['engine', 'aero'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: 'Temple of Speed with 80% full-throttle running and the longest straights on the calendar.',
    tacticalAdvice: 'Mandatory upgrade! Push Engine & low-drag Aero to 88+ OVR to exceed 365+ km/h through the speed traps.',
    rivalBehaviorNotice: 'Scuderia Cavallo and Red Bullion deploy peak power unit modes; straight-line velocity is relentless.',
  },
  11: {
    round: 11,
    circuitName: 'Marina Bay Street Circuit',
    country: 'Singapore',
    flag: '🇸🇬',
    stageName: 'Night Street Heat & Precision',
    stageTier: 3,
    rivalSpeedRange: '366 - 376 km/h',
    rivalBenchmarkOvr: 90,
    topContenders: ['CLK', 'MOR', 'WER', 'HAM'],
    primaryFocus: ['chassis', 'brakes'],
    secondaryFocus: ['suspension'],
    trackTypeDescription: 'Night street circuit with 19 technical corners over bumpy, tropical asphalt.',
    tacticalAdvice: 'Requires extreme Chassis agility for rapid directional changes and heavy-duty Brakes to prevent lock-ups.',
    rivalBehaviorNotice: 'Night walls leave zero room for error; one slight mistake will cost valuable positions.',
  },
  12: {
    round: 12,
    circuitName: 'Suzuka International Racing Course',
    country: 'Japan',
    flag: '🇯🇵',
    stageName: 'The Ultimate Driver Test',
    stageTier: 3,
    rivalSpeedRange: '370 - 380 km/h',
    rivalBenchmarkOvr: 92,
    topContenders: ['WER', 'MOR', 'CLK', 'HAM'],
    primaryFocus: ['aero', 'chassis'],
    secondaryFocus: ['engine'],
    trackTypeDescription: 'Figure-eight masterpiece featuring the relentless Esses and iconic 130R flat-out sweeper.',
    tacticalAdvice: 'Aero and Chassis must work in complete harmony to carry momentum through the high-G S-curves.',
    rivalBehaviorNotice: 'Top rivals maintain an average speed of 375 km/h with flawless corner entries and aggressive draft lines.',
  },
  13: {
    round: 13,
    circuitName: 'Circuit of the Americas (COTA)',
    country: 'United States',
    flag: '🇺🇸',
    stageName: 'Texas Elevation & Straightaway Battle',
    stageTier: 3,
    rivalSpeedRange: '374 - 384 km/h',
    rivalBenchmarkOvr: 94,
    topContenders: ['WER', 'HAM', 'CLK', 'MOR'],
    primaryFocus: ['engine', 'suspension'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: 'Blind uphill Turn 1 crest followed by a grueling 1.2-kilometer back straight.',
    tacticalAdvice: 'Upgrade Engine for the long straight and tune Suspension to absorb the notorious Austin bumps.',
    rivalBehaviorNotice: 'Rivals utilize DRS and boost pads with surgical precision; underpowered cars will get overhauled.',
  },
  14: {
    round: 14,
    circuitName: 'Autódromo Hermanos Rodríguez',
    country: 'Mexico',
    flag: '🇲🇽',
    stageName: 'High Altitude Thin Air Challenge',
    stageTier: 3,
    rivalSpeedRange: '378 - 388 km/h',
    rivalBenchmarkOvr: 95,
    topContenders: ['WER', 'CLK', 'MOR', 'PRZ'],
    primaryFocus: ['aero', 'engine'],
    secondaryFocus: ['brakes'],
    trackTypeDescription: '2,200 meters above sea level: thin air reduces natural downforce by 25%.',
    tacticalAdvice: 'Install maximum-spec Aero to regain lost downforce and boost Engine output to offset thin oxygen.',
    rivalBehaviorNotice: 'Top speed on the main straight exceeds 380+ km/h. Low-aero cars will slip and slide out of control.',
  },
  15: {
    round: 15,
    circuitName: 'Autódromo José Carlos Pace (Interlagos)',
    country: 'Brazil',
    flag: '🇧🇷',
    stageName: 'South American Title Showdown',
    stageTier: 4,
    rivalSpeedRange: '382 - 390 km/h',
    rivalBenchmarkOvr: 96,
    topContenders: ['WER', 'HAM', 'MOR', 'CLK'],
    primaryFocus: ['suspension', 'engine'],
    secondaryFocus: ['chassis'],
    trackTypeDescription: 'Anti-clockwise bowl with undulating gradients and the iconic downhill Senna S.',
    tacticalAdvice: 'Downhill turn-in into the Senna S requires lightning-fast Suspension and Engine response to overtake.',
    rivalBehaviorNotice: 'Championship stakes are at peak intensity; rivals will relentlessly divebomb any available opening.',
  },
  16: {
    round: 16,
    circuitName: 'Las Vegas Strip Circuit',
    country: 'United States',
    flag: '🇺🇸',
    stageName: 'Vegas Neon Cold Nights & Hyper-Speed',
    stageTier: 4,
    rivalSpeedRange: '386 - 394 km/h',
    rivalBenchmarkOvr: 97,
    topContenders: ['WER', 'CLK', 'MOR', 'RUS'],
    primaryFocus: ['engine', 'brakes'],
    secondaryFocus: ['aero'],
    trackTypeDescription: 'The Strip straightaway exceeds 385+ km/h beneath neon lights in cool desert air.',
    tacticalAdvice: 'Massive straight requires top-tier Engine (95+ OVR) and supreme Brakes to stop before the hairpin.',
    rivalBehaviorNotice: 'Rivals exceed 385 km/h on the straight; an un-upgraded car will be left behind in seconds.',
  },
  17: {
    round: 17,
    circuitName: 'Yas Marina Circuit',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    stageName: 'Twilight Championship Decider',
    stageTier: 4,
    rivalSpeedRange: '388 - 396 km/h',
    rivalBenchmarkOvr: 98,
    topContenders: ['WER', 'CLK', 'MOR', 'HAM'],
    primaryFocus: ['engine', 'brakes'],
    secondaryFocus: ['chassis'],
    trackTypeDescription: 'Under the twilight spotlights with dual long straights and hotel complex twists.',
    tacticalAdvice: 'Penultimate grand prix of the season: car components should reach 95-98 OVR to fight for championship points.',
    rivalBehaviorNotice: 'Rivals race at title-winning intensity; every DRS zone and boost sector will be exploited.',
  },
  18: {
    round: 18,
    circuitName: 'Cape Town Grand Prix Circuit',
    country: 'South Africa',
    flag: '🇿🇦',
    stageName: 'World Tour Grand Finale',
    stageTier: 4,
    rivalSpeedRange: '392 - 400+ km/h',
    rivalBenchmarkOvr: 99,
    topContenders: ['WER', 'CLK', 'MOR', 'HAM', 'ALZ'],
    primaryFocus: ['engine', 'aero', 'chassis', 'brakes', 'suspension'],
    secondaryFocus: [],
    trackTypeDescription: 'Season finale on Atlantic coastline with ultra-fast bends and beachfront drag straight.',
    tacticalAdvice: 'The World Championship showdown! Maximum upgrades (95-99 OVR in all departments) required for P1!',
    rivalBehaviorNotice: 'All rivals unlock maximum performance, hitting 395-405 km/h with legendary hyper-aggression.',
  },
};

export function getCircuitDemands(roundNumber: number): CircuitDemandInfo {
  const safeRound = Math.min(18, Math.max(1, roundNumber));
  return CIRCUIT_STRATEGIC_DEMANDS[safeRound] || CIRCUIT_STRATEGIC_DEMANDS[1];
}

export function evaluateCarPreparedness(
  car: CarStats,
  demands: CircuitDemandInfo
): {
  playerCarOvr: number;
  benchmarkOvr: number;
  gap: number;
  status: 'advantage' | 'parity' | 'warning' | 'danger';
  title: string;
  desc: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
} {
  const playerCarOvr = Math.round(
    (car.engine + car.aero + car.brakes + car.suspension + car.chassis) / 5
  );
  const benchmarkOvr = demands.rivalBenchmarkOvr;
  const gap = playerCarOvr - benchmarkOvr;

  if (gap >= 4) {
    return {
      playerCarOvr,
      benchmarkOvr,
      gap,
      status: 'advantage',
      title: 'Performance Advantage',
      desc: `Your car (${playerCarOvr} OVR) outclasses the rival average (${benchmarkOvr} OVR). Prime opportunity for P1 victory!`,
      badgeBg: 'bg-emerald-950/80',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/40',
    };
  }

  if (gap >= -1) {
    return {
      playerCarOvr,
      benchmarkOvr,
      gap,
      status: 'parity',
      title: 'Competitive Parity',
      desc: `Your car (${playerCarOvr} OVR) is evenly matched with rivals (${benchmarkOvr} OVR). Precision driving and boost timing will decide the race!`,
      badgeBg: 'bg-blue-950/80',
      badgeText: 'text-blue-400',
      badgeBorder: 'border-blue-500/40',
    };
  }

  if (gap >= -6) {
    return {
      playerCarOvr,
      benchmarkOvr,
      gap,
      status: 'warning',
      title: 'Slightly Underpowered',
      desc: `Your car (${playerCarOvr} OVR) trails rivals (${benchmarkOvr} OVR) by ${Math.abs(gap)} points. R&D upgrades strongly recommended before racing.`,
      badgeBg: 'bg-amber-950/80',
      badgeText: 'text-amber-400',
      badgeBorder: 'border-amber-500/40',
    };
  }

  return {
    playerCarOvr,
    benchmarkOvr,
    gap,
    status: 'danger',
    title: 'Severely Underpowered! Critical Upgrades Needed',
    desc: `Your car (${playerCarOvr} OVR) is outclassed by rivals (${benchmarkOvr} OVR) by ${Math.abs(gap)} points! Rivals will pull away easily. Upgrade now to compete.`,
    badgeBg: 'bg-red-950/80',
    badgeText: 'text-red-400',
    badgeBorder: 'border-red-500/50',
  };
}
