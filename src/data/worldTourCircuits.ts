// =============================================================================
// AUTHENTIC WORLD TOUR 18-GRAND-PRIX CIRCUITS DATABASE
// Fixed, deterministic, non-random corner-by-corner 3D track geometry,
// real-world environmental design, and authentic visual identities for all 18 rounds.
// =============================================================================

import { buildPattern } from './obstaclePatterns';

export interface TrackSectionDef {
  numSegments: number;
  curve: number; // Curvature: 0 = straight, positive = right, negative = left (-5.0 to +5.0)
  propPattern?: {
    frequency: number;
    type: string;
    offset: number;
    text?: string;
  };
}

export interface TrackObstacleDef {
  segIndex: number;
  type: string;
  offset: number; // -0.7 to +0.7
}

export interface TrackBoosterPadDef {
  segIndex: number;
  offset: number; // -0.44 to +0.44
}

export interface WorldTourCircuitDef {
  round: number;
  id: string;
  name: string;
  circuitName: string;
  city: string;
  country: string;
  flag: string;
  environmentName: string;
  environmentDescription: string;

  // Sky & Lighting
  skyGradient: [string, string, string, string]; // 4 color stops (0%, 35%, 70%, 100%)
  celestialFeature?: 'desert_sun' | 'clouds' | 'stars_night' | 'heat_haze';

  // Horizon & Parallax Identity
  horizonType:
    | 'melbourne_lake'
    | 'suzuka_ferris'
    | 'singapore_night'
    | 'sakhir_desert'
    | 'bangkok_river'
    | 'capetown_beach'
    | 'catalunya_arid'
    | 'monaco_harbor'
    | 'monza_royal_park'
    | 'austria_alps'
    | 'spa_ardennes'
    | 'zandvoort_dunes'
    | 'silverstone_plains'
    | 'montreal_island'
    | 'cota_texas'
    | 'vegas_strip'
    | 'mexico_altitude'
    | 'interlagos_lakes'
    | 'yas_marina';

  horizonGlow: string;
  farHorizonColor: string;
  nearHorizonColor: string;

  // Track Surfaces
  roadColors: { dark: string; light: string };
  groundColors: { dark: string; light: string };
  rumbleColors: { dark: string; light: string };
  laneColors: { dark: string; light: string };

  // Roadside Propping
  propsL3: string[]; // Deep distance background
  propsL2: string[]; // Mid-distance trackside

  // FIXED CORNER-BY-CORNER TRACK GEOMETRY (Authentic to real Grand Prix)
  sections: TrackSectionDef[];

  // FIXED OBSTACLES (Repeatable & tactical)
  obstacles: TrackObstacleDef[];

  // FIXED STRATEGIC BOOSTER PADS (4 per circuit on authentic straights)
  boosterPads: TrackBoosterPadDef[];
}

export const WORLD_TOUR_CIRCUITS: WorldTourCircuitDef[] = [
  // ---------------------------------------------------------------------------
  // ROUND 1: AUSTRALIAN GRAND PRIX (Albert Park - Melbourne)
  // ---------------------------------------------------------------------------
  {
    round: 1,
    id: 'gp-1',
    name: 'Australian Grand Prix',
    circuitName: 'Albert Park Circuit',
    city: 'Melbourne',
    country: 'Australia',
    flag: '🇦🇺',
    environmentName: 'Albert Park Lakeside',
    environmentDescription: 'Lush green parkland circling Albert Park Lake with Melbourne skyline',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd', '#e0f2fe'],
    celestialFeature: 'clouds',
    horizonType: 'melbourne_lake',
    horizonGlow: 'rgba(56, 189, 248, 0.75)',
    farHorizonColor: '#1e293b',
    nearHorizonColor: '#0f4c2c',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#14532d', light: '#166534' }, // Lush park lawn
    rumbleColors: { dark: '#dc2626', light: '#f8fafc' },
    laneColors: { dark: '#f8fafc', light: 'transparent' },
    propsL3: ['green_tree', 'pine_tree'],
    propsL2: ['green_tree', 'grandstand', 'track_light'],
    sections: [
      { numSegments: 120, curve: 0 }, // Pit Straight
      { numSegments: 45, curve: 2.8 }, // Turn 1 & 2 Chicane Right
      { numSegments: 40, curve: -2.6 }, // Turn 2 Left Exit
      { numSegments: 60, curve: 0 }, // Straight to Turn 3
      { numSegments: 45, curve: 3.5 }, // Turn 3 Tight Right
      { numSegments: 35, curve: -2.8 }, // Turn 4 Left
      { numSegments: 80, curve: 0 }, // Lakeside Straight
      { numSegments: 55, curve: 2.4 }, // Turn 6-7 Sweeper
      { numSegments: 45, curve: 0 },
      { numSegments: 75, curve: -2.2 }, // Turn 9-10 Fast Lakeside Left
      { numSegments: 110, curve: 0 }, // Back DRS Straight
      { numSegments: 45, curve: 3.2 }, // Turn 11-12 High Speed Chicane Right
      { numSegments: 45, curve: -3.0 }, // Left Flick
      { numSegments: 50, curve: 0 },
      { numSegments: 50, curve: 2.9 }, // Turn 13 Right
      { numSegments: 50, curve: 0 },
      { numSegments: 50, curve: 3.0 }, // Final Turn onto Main Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 140, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 142, type: 'traffic_cone', offset: 0.0 },
        { segIndex: 300, type: 'road_barrier', offset: 0.45 },
        { segIndex: 560, type: 'oil_slick', offset: -0.25 },
        { segIndex: 780, type: 'tire_stack', offset: 0.52 },
        ...buildPattern('A', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 85, offset: 0.0 },
      { segIndex: 330, offset: 0.44 },
      { segIndex: 610, offset: -0.44 },
      { segIndex: 830, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 2: JAPANESE GRAND PRIX (Suzuka Circuit)
  // ---------------------------------------------------------------------------
  {
    round: 2,
    id: 'gp-2',
    name: 'Japanese Grand Prix',
    circuitName: 'Suzuka Racing Circuit',
    city: 'Suzuka',
    country: 'Japan',
    flag: '🇯🇵',
    environmentName: 'Suzuka Forest & Giant Ferris Wheel',
    environmentDescription: 'Legendary figure-8 layout with S-curves, Degner, 130R and Ferris Wheel',
    skyGradient: ['#1e1b4b', '#2563eb', '#60a5fa', '#fed7aa'],
    celestialFeature: 'clouds',
    horizonType: 'suzuka_ferris',
    horizonGlow: 'rgba(251, 146, 60, 0.8)',
    farHorizonColor: '#172554',
    nearHorizonColor: '#064e3b',
    roadColors: { dark: '#1e2430', light: '#293242' },
    groundColors: { dark: '#064e3b', light: '#047857' }, // Japanese cedar forest
    rumbleColors: { dark: '#dc2626', light: '#ffffff' },
    laneColors: { dark: '#ffffff', light: 'transparent' },
    propsL3: ['pine_tree', 'green_tree'],
    propsL2: ['pine_tree', 'green_tree', 'grandstand'],
    sections: [
      { numSegments: 130, curve: 0 }, // Main Pit Straight
      { numSegments: 65, curve: 2.8 }, // Turn 1 & 2 Sweeper
      { numSegments: 35, curve: -3.2 }, // S-Curve 1 Left
      { numSegments: 35, curve: 3.2 }, // S-Curve 2 Right
      { numSegments: 35, curve: -3.2 }, // S-Curve 3 Left
      { numSegments: 35, curve: 3.0 }, // S-Curve 4 Right
      { numSegments: 60, curve: -2.2 }, // Dunlop Curve Uphill Sweeper
      { numSegments: 40, curve: 0 },
      { numSegments: 35, curve: 3.8 }, // Degner 1 Sharp Right
      { numSegments: 30, curve: 4.2 }, // Degner 2 Right
      { numSegments: 45, curve: 0 }, // Under the Crossover Bridge
      { numSegments: 70, curve: -4.5 }, // Legendary Suzuka Hairpin Left
      { numSegments: 55, curve: 0 },
      { numSegments: 75, curve: 2.2 }, // 200R Sweeper
      { numSegments: 55, curve: -3.6 }, // Spoon Curve 1 Left
      { numSegments: 45, curve: -3.8 }, // Spoon Curve 2 Left Exit
      { numSegments: 120, curve: 0 }, // Back Straight (DRS Flat Out!)
      { numSegments: 75, curve: -2.6 }, // Legendary 130R High-Speed Sweeper
      { numSegments: 35, curve: 4.0 }, // Casio Triangle Chicane Right
      { numSegments: 35, curve: -3.8 }, // Chicane Left onto Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 160, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 380, type: 'tire_stack', offset: -0.48 },
        { segIndex: 510, type: 'oil_slick', offset: 0.15 },
        { segIndex: 820, type: 'road_barrier', offset: -0.42 },
        ...buildPattern('A', 1, this),
        ...buildPattern('F', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 90, offset: 0.0 },
      { segIndex: 430, offset: -0.44 },
      { segIndex: 780, offset: 0.44 },
      { segIndex: 910, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 3: SINGAPORE NIGHT GRAND PRIX (Marina Bay Street Circuit)
  // ---------------------------------------------------------------------------
  {
    round: 3,
    id: 'gp-3',
    name: 'Singapore Night Grand Prix',
    circuitName: 'Marina Bay Street Circuit',
    city: 'Marina Bay',
    country: 'Singapore',
    flag: '🇸🇬',
    environmentName: 'Marina Bay Illuminated Night Circuit',
    environmentDescription: 'Stunning night street circuit under thousands of floodlights and city skyline',
    skyGradient: ['#020617', '#0f172a', '#1e1b4b', '#4c1d95'],
    celestialFeature: 'stars_night',
    horizonType: 'singapore_night',
    horizonGlow: 'rgba(168, 85, 247, 0.85)',
    farHorizonColor: '#090d16',
    nearHorizonColor: '#1e1b4b',
    roadColors: { dark: '#111827', light: '#1f2937' },
    groundColors: { dark: '#064e3b', light: '#047857' },
    rumbleColors: { dark: '#0284c7', light: '#f8fafc' },
    laneColors: { dark: '#38bdf8', light: 'transparent' },
    propsL3: ['city_building', 'palm_tree'],
    propsL2: ['city_building', 'track_light', 'palm_tree'],
    sections: [
      { numSegments: 115, curve: 0 }, // Pit Straight
      { numSegments: 45, curve: -3.8 }, // Turn 1 Left
      { numSegments: 40, curve: 3.5 }, // Turn 2 Right
      { numSegments: 40, curve: -3.5 }, // Turn 3 Left
      { numSegments: 95, curve: 0 }, // Republic Boulevard Straight
      { numSegments: 50, curve: 4.0 }, // Turn 7 90-degree Right
      { numSegments: 90, curve: 0 }, // Raffles Boulevard (High Speed!)
      { numSegments: 50, curve: -4.2 }, // Turn 14 Stamford 90-degree Left
      { numSegments: 85, curve: 0 }, // Padang Straight
      { numSegments: 45, curve: -3.2 }, // Turn 11-12 Anderson Bridge
      { numSegments: 45, curve: 3.4 }, // Turn 13 Hairpin
      { numSegments: 80, curve: 0 }, // Esplanade Waterfront
      { numSegments: 50, curve: 3.6 }, // Bay Chicane Right
      { numSegments: 50, curve: -3.6 }, // Bay Chicane Left
      { numSegments: 60, curve: 0 },
      { numSegments: 40, curve: -3.2 }, // Final Complex Left
      { numSegments: 40, curve: -3.0 }, // Final Corner onto Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 130, type: 'road_barrier', offset: -0.45 },
        { segIndex: 320, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 520, type: 'tire_stack', offset: -0.5 },
        { segIndex: 780, type: 'oil_slick', offset: 0.2 },
        ...buildPattern('A', 2, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 270, offset: 0.44 },
      { segIndex: 560, offset: -0.44 },
      { segIndex: 820, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 4: BAHRAIN GRAND PRIX (Bahrain International Circuit - Sakhir)
  // ---------------------------------------------------------------------------
  {
    round: 4,
    id: 'gp-4',
    name: 'Bahrain Grand Prix',
    circuitName: 'Bahrain International Circuit',
    city: 'Sakhir',
    country: 'Bahrain',
    flag: '🇧🇭',
    environmentName: 'Sakhir Desert & Oasis Dunes',
    environmentDescription: 'Blazing sunny daytime desert with sand dunes, giant cacti and sandstone mesas',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd', '#fef08a'],
    celestialFeature: 'desert_sun',
    horizonType: 'sakhir_desert',
    horizonGlow: 'rgba(245, 158, 11, 0.85)',
    farHorizonColor: '#9a3412',
    nearHorizonColor: '#d97706',
    roadColors: { dark: '#3b4252', light: '#454d5d' },
    groundColors: { dark: '#c29236', light: '#dca54c' }, // Endless desert sand
    rumbleColors: { dark: '#ea580c', light: '#fef3c7' },
    laneColors: { dark: '#fef3c7', light: 'transparent' },
    propsL3: ['cactus', 'desert_rock', 'palm_tree'],
    propsL2: ['cactus', 'desert_rock', 'palm_tree', 'grandstand'],
    sections: [
      { numSegments: 140, curve: 0 }, // 1.1km Pit Straight
      { numSegments: 60, curve: 4.5 }, // Turn 1 Heavy Braking Hairpin Right
      { numSegments: 35, curve: -2.8 }, // Turn 2 Left
      { numSegments: 35, curve: 2.6 }, // Turn 3 Right Acceleration
      { numSegments: 75, curve: 0 }, // Straight to Turn 4
      { numSegments: 50, curve: 3.6 }, // Turn 4 Downhill Right
      { numSegments: 40, curve: -3.0 }, // Turn 5-6 High Speed Esses
      { numSegments: 40, curve: 3.0 },
      { numSegments: 40, curve: -3.2 },
      { numSegments: 50, curve: 0 },
      { numSegments: 55, curve: -4.2 }, // Tricky Downhill Off-Camber Turn 9-10 Hairpin
      { numSegments: 130, curve: 0 }, // Long DRS Back Straight!
      { numSegments: 55, curve: 3.4 }, // Turn 11 Left sweeper into Turn 12
      { numSegments: 50, curve: 0 },
      { numSegments: 45, curve: 3.8 }, // Turn 14 Right onto straight
      { numSegments: 45, curve: 3.0 }, // Turn 15 Final Corner
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 165, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 280, type: 'tire_stack', offset: 0.52 },
        { segIndex: 490, type: 'road_barrier', offset: -0.45 },
        { segIndex: 720, type: 'oil_slick', offset: 0.18 },
        ...buildPattern('C', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 95, offset: 0.0 },
      { segIndex: 320, offset: -0.44 },
      { segIndex: 650, offset: 0.44 },
      { segIndex: 860, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 5: THAILAND GRAND PRIX (Bangkok River Street Circuit - พ.ศ. 2571 / 2028)
  // ---------------------------------------------------------------------------
  {
    round: 5,
    id: 'gp-5',
    name: 'Thailand Grand Prix',
    circuitName: 'Bangkok River Street Circuit',
    city: 'Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    environmentName: 'Chao Phraya Riverfront & Royal Rattanakosin Metropolis',
    environmentDescription: 'Spectacular twilight river circuit passing Wat Arun, Rama VIII Bridge, and futuristic Bangkok skyline (F1 Thailand Grand Prix พ.ศ. 2571)',
    skyGradient: ['#1e1b4b', '#4c1d95', '#b45309', '#f59e0b'],
    celestialFeature: 'heat_haze',
    horizonType: 'bangkok_river',
    horizonGlow: 'rgba(245, 158, 11, 0.9)',
    farHorizonColor: '#312e81',
    nearHorizonColor: '#1e1b4b',
    roadColors: { dark: '#181e28', light: '#222c3d' },
    groundColors: { dark: '#042f2e', light: '#064e3b' }, // Lush tropical riverbank palms
    rumbleColors: { dark: '#dc2626', light: '#2563eb' }, // Thai Tri-color curbs (Red, White & Blue)
    laneColors: { dark: '#facc15', light: 'transparent' }, // Golden center line
    propsL3: ['city_building', 'palm_tree'],
    propsL2: ['city_building', 'palm_tree', 'green_tree'],
    sections: [
      { numSegments: 140, curve: 0 }, // Ratchadamnoen Avenue Start/Finish Straight (High Speed DRS)
      { numSegments: 50, curve: 3.6 }, // Turn 1 Democracy Monument Right
      { numSegments: 45, curve: -3.2 }, // Turn 2 Royal Avenue Left
      { numSegments: 90, curve: 0 }, // Sanam Luang Grand Straight past Royal Palace
      { numSegments: 55, curve: 4.2 }, // Turn 4 Chao Phraya Riverbank Chicane
      { numSegments: 45, curve: -4.0 }, // Turn 5 Wat Pho Sweeper
      { numSegments: 120, curve: 0 }, // Chao Phraya Riverside Boulevard facing Wat Arun (DRS Zone 2)
      { numSegments: 65, curve: 2.8 }, // Sweeping Turn 7 Rama VIII Approach
      { numSegments: 50, curve: 0 }, // Rama VIII Suspension Bridge Flyover
      { numSegments: 50, curve: -4.2 }, // Turn 9 Golden Mount Hairpin
      { numSegments: 80, curve: 0 }, // Rattanakosin City Boulevard
      { numSegments: 50, curve: 3.2 }, // Turn 11 Temple of Dawn S-Bend
      { numSegments: 50, curve: -3.0 }, // Turn 12 Final Sweeper
      { numSegments: 75, curve: 0 }, // Victory Podium Main Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 160, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 350, type: 'road_barrier', offset: -0.42 },
        { segIndex: 580, type: 'oil_slick', offset: 0.15 },
        { segIndex: 810, type: 'tire_stack', offset: 0.5 },
        ...buildPattern('F', 1, this),
        ...buildPattern('C', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 95, offset: 0.0 }, // Sanam Luang Straight
      { segIndex: 390, offset: 0.44 }, // Chao Phraya Riverside
      { segIndex: 630, offset: -0.44 }, // Rama VIII Bridge Deck
      { segIndex: 840, offset: 0.0 }, // Main Finish Straight
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 6: SPANISH GRAND PRIX (Circuit de Barcelona-Catalunya)
  // ---------------------------------------------------------------------------
  {
    round: 6,
    id: 'gp-6',
    name: 'Spanish Grand Prix',
    circuitName: 'Circuit de Barcelona-Catalunya',
    city: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    environmentName: 'Catalunya Arid Scrub & Montserrat Foothills',
    environmentDescription: 'Sun-baked Mediterranean dry woodland with golden straw and stone pines',
    skyGradient: ['#1e3a5f', '#38bdf8', '#cbd5e1', '#fde68a'],
    celestialFeature: 'heat_haze',
    horizonType: 'catalunya_arid',
    horizonGlow: 'rgba(202, 138, 4, 0.75)',
    farHorizonColor: '#451a03',
    nearHorizonColor: '#713f12',
    roadColors: { dark: '#333740', light: '#3e434e' },
    groundColors: { dark: '#6b4f1d', light: '#856427' }, // Sun-scorched straw
    rumbleColors: { dark: '#b91c1c', light: '#e2e8f0' },
    laneColors: { dark: '#fef08a', light: 'transparent' },
    propsL3: ['dry_tree', 'arid_pine'],
    propsL2: ['dry_tree', 'arid_pine', 'grandstand'],
    sections: [
      { numSegments: 140, curve: 0 }, // 1.05km Main Straight
      { numSegments: 45, curve: 3.4 }, // Turn 1 Elf Chicane Right
      { numSegments: 40, curve: -3.2 }, // Turn 2 Left
      { numSegments: 80, curve: 3.0 }, // Turn 3 Long Sweeping Renault Right
      { numSegments: 50, curve: 0 },
      { numSegments: 50, curve: 4.2 }, // Turn 4 Repsol Hairpin Right
      { numSegments: 45, curve: -3.2 }, // Turn 5 Seat Left Downhill
      { numSegments: 40, curve: 0 },
      { numSegments: 50, curve: -2.8 }, // Turn 7-8 Uphill Chicane
      { numSegments: 40, curve: 2.8 },
      { numSegments: 55, curve: 3.5 }, // Turn 9 Campsa Fast Uphill Right
      { numSegments: 120, curve: 0 }, // Back Straight (DRS!)
      { numSegments: 55, curve: -4.5 }, // Turn 10 La Caixa Hairpin Left
      { numSegments: 50, curve: 0 },
      { numSegments: 45, curve: 3.0 }, // Turn 13-14 Fast Sweepers
      { numSegments: 50, curve: 3.2 },
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 160, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 320, type: 'tire_stack', offset: 0.5 },
        { segIndex: 510, type: 'road_barrier', offset: -0.45 },
        { segIndex: 780, type: 'oil_slick', offset: 0.15 },
        ...buildPattern('D', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 90, offset: 0.0 },
      { segIndex: 340, offset: -0.44 },
      { segIndex: 680, offset: 0.44 },
      { segIndex: 880, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 7: MONACO GRAND PRIX (Circuit de Monaco - Monte Carlo)
  // ---------------------------------------------------------------------------
  {
    round: 7,
    id: 'gp-7',
    name: 'Monaco Grand Prix',
    circuitName: 'Circuit de Monaco',
    city: 'Monte Carlo',
    country: 'Monaco',
    flag: '🇲🇨',
    environmentName: 'Monte Carlo French Riviera & Yacht Harbor',
    environmentDescription: 'Glamorous coastal harbor with superyachts, Riviera sea and cliffside villas',
    skyGradient: ['#0369a1', '#38bdf8', '#bae6fd', '#fef08a'],
    celestialFeature: 'clouds',
    horizonType: 'monaco_harbor',
    horizonGlow: 'rgba(56, 189, 248, 0.85)',
    farHorizonColor: '#0369a1',
    nearHorizonColor: '#1e293b',
    roadColors: { dark: '#1e2430', light: '#293242' },
    groundColors: { dark: '#047857', light: '#059669' },
    rumbleColors: { dark: '#dc2626', light: '#ffffff' },
    laneColors: { dark: '#ffffff', light: 'transparent' },
    propsL3: ['city_building', 'palm_tree'],
    propsL2: ['palm_tree', 'safety_fence', 'grandstand'],
    sections: [
      { numSegments: 90, curve: 0 }, // Pit Straight
      { numSegments: 45, curve: 4.5 }, // Sainte-Devote Sharp Right
      { numSegments: 75, curve: -1.8 }, // Beau Rivage Uphill
      { numSegments: 55, curve: -3.5 }, // Massenet Long Left
      { numSegments: 40, curve: 3.4 }, // Casino Square Right
      { numSegments: 45, curve: 0 }, // Downhill to Mirabeau
      { numSegments: 45, curve: 4.0 }, // Mirabeau Haute Right
      { numSegments: 70, curve: -5.0 }, // Iconic Grand Hotel Hairpin (Slowest & Most Dramatic!)
      { numSegments: 45, curve: 3.6 }, // Mirabeau Bas Right
      { numSegments: 45, curve: 4.0 }, // Portier Right into Tunnel
      { numSegments: 110, curve: 1.2 }, // The Famous Tunnel (Flat out!)
      { numSegments: 40, curve: -3.8 }, // Nouvelle Chicane Left
      { numSegments: 40, curve: 3.8 }, // Chicane Right
      { numSegments: 60, curve: -2.8 }, // Tabac Left Sweeper along the yachts!
      { numSegments: 45, curve: -3.5 }, // Swimming Pool Chicane 1
      { numSegments: 45, curve: 3.5 }, // Swimming Pool Chicane 2
      { numSegments: 45, curve: 4.2 }, // La Rascasse Tight Right
      { numSegments: 40, curve: 3.5 }, // Anthony Noghes onto Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 110, type: 'road_barrier', offset: 0.45 },
        { segIndex: 280, type: 'traffic_cone', offset: -0.3 },
        { segIndex: 510, type: 'oil_slick', offset: 0.15 },
        { segIndex: 720, type: 'tire_stack', offset: -0.45 },
        ...buildPattern('B', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 60, offset: 0.0 },
      { segIndex: 320, offset: 0.44 },
      { segIndex: 540, offset: -0.44 },
      { segIndex: 790, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 8: ITALIAN GRAND PRIX (Autodromo Nazionale Monza)
  // ---------------------------------------------------------------------------
  {
    round: 8,
    id: 'gp-8',
    name: 'Italian Grand Prix',
    circuitName: 'Autodromo Nazionale Monza',
    city: 'Monza',
    country: 'Italy',
    flag: '🇮🇹',
    environmentName: 'Temple of Speed in Royal Historic Park',
    environmentDescription: 'Ancient Lombardy royal park pines and long high-speed flat-out straights',
    skyGradient: ['#1e3a5f', '#2563eb', '#60a5fa', '#fed7aa'],
    celestialFeature: 'clouds',
    horizonType: 'monza_royal_park',
    horizonGlow: 'rgba(251, 146, 60, 0.8)',
    farHorizonColor: '#172554',
    nearHorizonColor: '#14532d',
    roadColors: { dark: '#1f2937', light: '#374151' },
    groundColors: { dark: '#14532d', light: '#166534' }, // Royal park forest
    rumbleColors: { dark: '#dc2626', light: '#f8fafc' },
    laneColors: { dark: '#f8fafc', light: 'transparent' },
    propsL3: ['pine_tree', 'green_tree'],
    propsL2: ['pine_tree', 'grandstand', 'track_light'],
    sections: [
      { numSegments: 160, curve: 0 }, // Massive 1.2km Main Pit Straight (360+ km/h!)
      { numSegments: 35, curve: 4.6 }, // Variante del Rettifilo Chicane Right
      { numSegments: 35, curve: -4.4 }, // Chicane Left
      { numSegments: 100, curve: 1.8 }, // Curva Grande Flat-Out Sweeper
      { numSegments: 75, curve: 0 },
      { numSegments: 35, curve: -4.2 }, // Variante della Roggia Chicane Left
      { numSegments: 35, curve: 4.0 }, // Chicane Right
      { numSegments: 50, curve: 0 },
      { numSegments: 50, curve: 3.4 }, // Curva di Lesmo 1 Right
      { numSegments: 45, curve: 0 },
      { numSegments: 50, curve: 3.6 }, // Curva di Lesmo 2 Right
      { numSegments: 110, curve: 0 }, // Curva del Serraglio Straight
      { numSegments: 35, curve: -3.8 }, // Variante Ascari Chicane Left
      { numSegments: 35, curve: 3.8 }, // Ascari Right
      { numSegments: 35, curve: -3.8 }, // Ascari Left Exit
      { numSegments: 110, curve: 0 }, // Back Straight (DRS!)
      { numSegments: 80, curve: 2.8 }, // Curva Parabolica (Alboreto) Sweeping Right
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 180, type: 'road_barrier', offset: -0.45 },
        { segIndex: 380, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 620, type: 'oil_slick', offset: -0.2 },
        { segIndex: 880, type: 'tire_stack', offset: 0.5 },
        ...buildPattern('D', 2, this),
        ...buildPattern('E', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 100, offset: 0.0 },
      { segIndex: 320, offset: 0.44 },
      { segIndex: 690, offset: -0.44 },
      { segIndex: 940, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 9: AUSTRIAN GRAND PRIX (Red Bull Ring - Spielberg)
  // ---------------------------------------------------------------------------
  {
    round: 9,
    id: 'gp-9',
    name: 'Austrian Grand Prix',
    circuitName: 'Red Bull Ring',
    city: 'Spielberg',
    country: 'Austria',
    flag: '🇦🇹',
    environmentName: 'Styrian Alpine Mountain Peaks & Meadows',
    environmentDescription: 'Dramatic alpine elevation with snow-capped peaks, lush pastures and mountain pines',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd', '#e0f2fe'],
    celestialFeature: 'clouds',
    horizonType: 'austria_alps',
    horizonGlow: 'rgba(56, 189, 248, 0.75)',
    farHorizonColor: '#1e1b4b',
    nearHorizonColor: '#15803d',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#15803d', light: '#16a34a' }, // Alpine emerald grass
    rumbleColors: { dark: '#dc2626', light: '#ffffff' },
    laneColors: { dark: '#ffffff', light: 'transparent' },
    propsL3: ['pine_tree'],
    propsL2: ['pine_tree', 'grandstand'],
    sections: [
      { numSegments: 120, curve: 0 }, // Main Straight
      { numSegments: 50, curve: 3.8 }, // Turn 1 Niki Lauda Kurve Uphill Right
      { numSegments: 130, curve: 0 }, // Steep Uphill Blast to Turn 3
      { numSegments: 65, curve: 4.8 }, // Turn 3 Remus Uphill Hairpin Right
      { numSegments: 120, curve: 0 }, // Steep Downhill Straight
      { numSegments: 50, curve: 3.6 }, // Turn 4 Downhill Right
      { numSegments: 45, curve: 0 },
      { numSegments: 55, curve: -3.2 }, // Turn 6 Rauch Left Sweeper
      { numSegments: 50, curve: -3.0 }, // Turn 7 Wurth Left
      { numSegments: 45, curve: 0 },
      { numSegments: 45, curve: 3.4 }, // Turn 9 Jochen Rindt Right
      { numSegments: 45, curve: 3.2 }, // Turn 10 Final Corner onto Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 140, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 340, type: 'tire_stack', offset: -0.45 },
        { segIndex: 520, type: 'road_barrier', offset: 0.45 },
        { segIndex: 680, type: 'oil_slick', offset: -0.2 },
        ...buildPattern('A', 2, this),
        ...buildPattern('C', 1, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 260, offset: 0.44 },
      { segIndex: 480, offset: -0.44 },
      { segIndex: 690, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 10: BELGIAN GRAND PRIX (Circuit de Spa-Francorchamps)
  // ---------------------------------------------------------------------------
  {
    round: 10,
    id: 'gp-10',
    name: 'Belgian Grand Prix',
    circuitName: 'Circuit de Spa-Francorchamps',
    city: 'Spa',
    country: 'Belgium',
    flag: '🇧🇪',
    environmentName: 'Ardennes Ancient Forest & Misty Valleys',
    environmentDescription: 'Dramatic 7km roller-coaster through misty Ardennes pines featuring Eau Rouge',
    skyGradient: ['#0f172a', '#1e293b', '#334155', '#64748b'],
    celestialFeature: 'clouds',
    horizonType: 'spa_ardennes',
    horizonGlow: 'rgba(148, 163, 184, 0.7)',
    farHorizonColor: '#0b1329',
    nearHorizonColor: '#064e3b',
    roadColors: { dark: '#1f242d', light: '#2b333e' },
    groundColors: { dark: '#0c3820', light: '#14532d' }, // Deep Ardennes forest
    rumbleColors: { dark: '#dc2626', light: '#facc15' },
    laneColors: { dark: '#f8fafc', light: 'transparent' },
    propsL3: ['pine_tree'],
    propsL2: ['pine_tree', 'safety_fence', 'grandstand'],
    sections: [
      { numSegments: 95, curve: 0 }, // Pit Straight
      { numSegments: 55, curve: 4.8 }, // La Source Hairpin Right
      { numSegments: 70, curve: 0 }, // Downhill plunge to Eau Rouge
      { numSegments: 35, curve: -2.8 }, // Eau Rouge Left
      { numSegments: 40, curve: 3.2 }, // Raidillon Uphill Crest Right
      { numSegments: 160, curve: 0 }, // Kemmel Straight (Flat Out 360+ km/h!)
      { numSegments: 45, curve: 3.6 }, // Les Combes Chicane Right
      { numSegments: 40, curve: -3.5 }, // Chicane Left
      { numSegments: 45, curve: 3.2 }, // Malmedy Right
      { numSegments: 60, curve: 4.2 }, // Rivage Hairpin Right Downhill
      { numSegments: 40, curve: -3.0 }, // Speakers Corner Left
      { numSegments: 85, curve: -3.4 }, // Pouhon Legendary Double-Apex Left Sweeper
      { numSegments: 50, curve: 0 },
      { numSegments: 40, curve: 3.2 }, // Fagnes Chicane Right
      { numSegments: 40, curve: -3.2 }, // Fagnes Left
      { numSegments: 50, curve: 2.8 }, // Stavelot Right
      { numSegments: 130, curve: 0 }, // Courbe Paul Frere & Blanchimont Flat-Out
      { numSegments: 40, curve: -4.2 }, // Bus Stop Chicane Left
      { numSegments: 40, curve: 4.0 }, // Bus Stop Right onto Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 120, type: 'road_barrier', offset: -0.45 },
        { segIndex: 380, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 650, type: 'oil_slick', offset: -0.18 },
        { segIndex: 940, type: 'tire_stack', offset: 0.5 },
        ...buildPattern('E', 2, this),
      ];
    },
    boosterPads: [
      { segIndex: 70, offset: 0.0 },
      { segIndex: 300, offset: 0.44 },
      { segIndex: 720, offset: -0.44 },
      { segIndex: 970, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 11: DUTCH GRAND PRIX (Circuit Zandvoort)
  // ---------------------------------------------------------------------------
  {
    round: 11,
    id: 'gp-11',
    name: 'Dutch Grand Prix',
    circuitName: 'Circuit Zandvoort',
    city: 'Zandvoort',
    country: 'Netherlands',
    flag: '🇳🇱',
    environmentName: 'North Sea Coastal Sand Dunes',
    environmentDescription: 'Coastal sand dunes, marram beach grasses and dramatic banked corners',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd', '#fde68a'],
    celestialFeature: 'clouds',
    horizonType: 'zandvoort_dunes',
    horizonGlow: 'rgba(251, 146, 60, 0.8)',
    farHorizonColor: '#0284c7',
    nearHorizonColor: '#b45309',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#c29236', light: '#15803d' }, // Sand dunes meeting green grass
    rumbleColors: { dark: '#ea580c', light: '#ffffff' },
    laneColors: { dark: '#ffffff', light: 'transparent' },
    propsL3: ['green_tree'],
    propsL2: ['green_tree', 'grandstand'],
    sections: [
      { numSegments: 110, curve: 0 }, // Pit Straight
      { numSegments: 60, curve: 4.5 }, // Tarzanbocht Banked Hairpin Right
      { numSegments: 40, curve: -2.8 }, // Gerlachbocht Left
      { numSegments: 55, curve: -4.0 }, // Hugenholtz Banked Curve Left
      { numSegments: 85, curve: 0 }, // Hunserug Straight
      { numSegments: 60, curve: 3.2 }, // Scheivlak Fast Crest Right Sweeper
      { numSegments: 45, curve: -2.8 }, // Mastersbocht
      { numSegments: 45, curve: 0 },
      { numSegments: 40, curve: 3.6 }, // Hans Ernst Chicane Right
      { numSegments: 40, curve: -3.4 }, // Hans Ernst Left
      { numSegments: 60, curve: 0 },
      { numSegments: 55, curve: 4.2 }, // Kumhobocht Right
      { numSegments: 75, curve: 3.0 }, // Arie Luyendyk Steeply Banked Final Corner (Flat Out!)
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 130, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 320, type: 'tire_stack', offset: 0.5 },
        { segIndex: 490, type: 'road_barrier', offset: -0.42 },
        { segIndex: 680, type: 'oil_slick', offset: 0.15 },
        ...buildPattern('B', 2, this),
      ];
    },
    boosterPads: [
      { segIndex: 75, offset: 0.0 },
      { segIndex: 280, offset: 0.44 },
      { segIndex: 510, offset: -0.44 },
      { segIndex: 710, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 12: BRITISH GRAND PRIX (Silverstone Circuit)
  // ---------------------------------------------------------------------------
  {
    round: 12,
    id: 'gp-12',
    name: 'British Grand Prix',
    circuitName: 'Silverstone Circuit',
    city: 'Silverstone',
    country: 'United Kingdom',
    flag: '🇬🇧',
    environmentName: 'Historic British Airfield & English Plains',
    environmentDescription: 'Historic open English airfield plains with Copse, Maggotts, Becketts and Stowe',
    skyGradient: ['#1e3a5f', '#38bdf8', '#cbd5e1', '#e2e8f0'],
    celestialFeature: 'clouds',
    horizonType: 'silverstone_plains',
    horizonGlow: 'rgba(56, 189, 248, 0.7)',
    farHorizonColor: '#1e293b',
    nearHorizonColor: '#166534',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#14532d', light: '#166534' }, // English grass
    rumbleColors: { dark: '#dc2626', light: '#f8fafc' },
    laneColors: { dark: '#f8fafc', light: 'transparent' },
    propsL3: ['green_tree'],
    propsL2: ['green_tree', 'grandstand', 'safety_fence'],
    sections: [
      { numSegments: 110, curve: 0 }, // Hamilton Straight
      { numSegments: 50, curve: 3.2 }, // Abbey Right
      { numSegments: 40, curve: -2.8 }, // Farm Left
      { numSegments: 45, curve: 4.2 }, // Village Tight Right
      { numSegments: 55, curve: -4.8 }, // The Loop Hairpin Left
      { numSegments: 40, curve: 2.6 }, // Aintree Left onto straight
      { numSegments: 110, curve: 0 }, // Wellington Straight
      { numSegments: 50, curve: -3.2 }, // Brooklands Left
      { numSegments: 60, curve: 3.4 }, // Luffield Long Right
      { numSegments: 50, curve: 0 }, // Woodcote Straight
      { numSegments: 65, curve: 3.2 }, // Copse Legendary High-Speed Blind Right!
      { numSegments: 40, curve: 0 },
      { numSegments: 35, curve: -3.8 }, // Maggotts Left
      { numSegments: 35, curve: 4.0 }, // Becketts Right
      { numSegments: 35, curve: -3.8 }, // Becketts Left
      { numSegments: 35, curve: 3.2 }, // Chapel Right Exit
      { numSegments: 120, curve: 0 }, // Hangar Straight (DRS!)
      { numSegments: 60, curve: 3.5 }, // Stowe Fast Right
      { numSegments: 40, curve: -3.8 }, // Vale Chicane Left
      { numSegments: 40, curve: 3.5 }, // Club Corner onto Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 140, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 380, type: 'road_barrier', offset: -0.45 },
        { segIndex: 640, type: 'oil_slick', offset: 0.2 },
        { segIndex: 900, type: 'tire_stack', offset: -0.48 },
        ...buildPattern('A', 2, this),
        ...buildPattern('C', 2, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 310, offset: 0.44 },
      { segIndex: 730, offset: -0.44 },
      { segIndex: 930, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 13: CANADIAN GRAND PRIX (Circuit Gilles Villeneuve - Montreal)
  // ---------------------------------------------------------------------------
  {
    round: 13,
    id: 'gp-13',
    name: 'Canadian Grand Prix',
    circuitName: 'Circuit Gilles Villeneuve',
    city: 'Montreal',
    country: 'Canada',
    flag: '🇨🇦',
    environmentName: 'St. Lawrence River & Notre Dame Island',
    environmentDescription: 'Man-made river island park with Olympic basin and the Wall of Champions',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd', '#e0f2fe'],
    celestialFeature: 'clouds',
    horizonType: 'montreal_island',
    horizonGlow: 'rgba(56, 189, 248, 0.75)',
    farHorizonColor: '#0369a1',
    nearHorizonColor: '#166534',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#14532d', light: '#166534' },
    rumbleColors: { dark: '#dc2626', light: '#ffffff' },
    laneColors: { dark: '#ffffff', light: 'transparent' },
    propsL3: ['green_tree'],
    propsL2: ['green_tree', 'safety_fence', 'grandstand'],
    sections: [
      { numSegments: 110, curve: 0 }, // Pit Straight
      { numSegments: 45, curve: -3.5 }, // Turn 1 Left
      { numSegments: 55, curve: 4.5 }, // Turn 2 Virage Senna Hairpin Right
      { numSegments: 60, curve: 0 },
      { numSegments: 40, curve: 3.5 }, // Turn 3-4 Chicane Right
      { numSegments: 40, curve: -3.5 }, // Chicane Left
      { numSegments: 55, curve: 0 },
      { numSegments: 40, curve: -3.2 }, // Turn 6-7 Chicane Left
      { numSegments: 40, curve: 3.2 }, // Right
      { numSegments: 70, curve: 0 },
      { numSegments: 40, curve: 3.4 }, // Turn 8-9 Chicane Right
      { numSegments: 40, curve: -3.4 }, // Left
      { numSegments: 55, curve: 0 },
      { numSegments: 65, curve: 4.8 }, // Turn 10 Casino Hairpin Right
      { numSegments: 140, curve: 0 }, // Droit du Casino Straight (Flat Out!)
      { numSegments: 40, curve: 3.8 }, // Turn 13-14 Wall of Champions Chicane Right
      { numSegments: 40, curve: -3.8 }, // Left exit alongside the wall
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 130, type: 'road_barrier', offset: -0.45 },
        { segIndex: 320, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 510, type: 'oil_slick', offset: -0.15 },
        { segIndex: 820, type: 'tire_stack', offset: 0.5 },
        ...buildPattern('E', 2, this),
        ...buildPattern('F', 2, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 260, offset: -0.44 },
      { segIndex: 610, offset: 0.44 },
      { segIndex: 840, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 14: UNITED STATES GRAND PRIX (Circuit of the Americas - Austin)
  // ---------------------------------------------------------------------------
  {
    round: 14,
    id: 'gp-14',
    name: 'United States Grand Prix',
    circuitName: 'Circuit of the Americas',
    city: 'Austin',
    country: 'United States',
    flag: '🇺🇸',
    environmentName: 'Texas Hill Country & Observation Tower',
    environmentDescription: 'Steep hill climb to blind crest Turn 1, flowing Esses and 251ft COTA Tower',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd', '#fef08a'],
    celestialFeature: 'clouds',
    horizonType: 'cota_texas',
    horizonGlow: 'rgba(251, 146, 60, 0.75)',
    farHorizonColor: '#1e3a5f',
    nearHorizonColor: '#15803d',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#15803d', light: '#16a34a' },
    rumbleColors: { dark: '#1e40af', light: '#dc2626' }, // Blue & Red
    laneColors: { dark: '#f8fafc', light: 'transparent' },
    propsL3: ['green_tree'],
    propsL2: ['green_tree', 'grandstand'],
    sections: [
      { numSegments: 110, curve: 0 }, // Pit Straight
      { numSegments: 60, curve: -4.8 }, // Steep Climb to Blind Crest Turn 1 Hairpin Left!
      { numSegments: 45, curve: 0 }, // Downhill plunge
      { numSegments: 35, curve: 3.5 }, // Turn 3-6 High Speed Esses Right
      { numSegments: 35, curve: -3.5 }, // Left
      { numSegments: 35, curve: 3.5 }, // Right
      { numSegments: 35, curve: -3.5 }, // Left
      { numSegments: 50, curve: 0 },
      { numSegments: 45, curve: 3.6 }, // Turn 9-10 Complex
      { numSegments: 60, curve: -4.5 }, // Turn 11 Hairpin Left
      { numSegments: 140, curve: 0 }, // 1km Back Straight (DRS!)
      { numSegments: 45, curve: -3.8 }, // Turn 12 Heavy Braking Left
      { numSegments: 40, curve: 3.4 }, // Turn 13-15 Stadium Complex
      { numSegments: 40, curve: -3.4 },
      { numSegments: 85, curve: 3.2 }, // Turn 16-18 Multi-Apex Carousel Right
      { numSegments: 45, curve: -3.6 }, // Turn 19-20 Final Corners
      { numSegments: 40, curve: -3.2 },
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 140, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 320, type: 'tire_stack', offset: 0.5 },
        { segIndex: 510, type: 'road_barrier', offset: -0.45 },
        { segIndex: 780, type: 'oil_slick', offset: 0.18 },
        ...buildPattern('B', 2, this),
        ...buildPattern('D', 2, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 280, offset: 0.44 },
      { segIndex: 610, offset: -0.44 },
      { segIndex: 860, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 15: LAS VEGAS GRAND PRIX (Las Vegas Strip Circuit)
  // ---------------------------------------------------------------------------
  {
    round: 15,
    id: 'gp-15',
    name: 'Las Vegas Grand Prix',
    circuitName: 'Las Vegas Strip Circuit',
    city: 'Las Vegas',
    country: 'United States',
    flag: '🇺🇸',
    environmentName: 'The Strip Night Neon Spectacle',
    environmentDescription: 'Dazzling night race past mega-casinos, the Sphere and 2km flat-out on The Strip',
    skyGradient: ['#030712', '#1e1b4b', '#701a75', '#f43f5e'],
    celestialFeature: 'stars_night',
    horizonType: 'vegas_strip',
    horizonGlow: 'rgba(236, 72, 153, 0.85)',
    farHorizonColor: '#0a0a14',
    nearHorizonColor: '#1e1b4b',
    roadColors: { dark: '#111827', light: '#1f2937' },
    groundColors: { dark: '#0f172a', light: '#1e293b' }, // Neon city asphalt
    rumbleColors: { dark: '#eab308', light: '#f43f5e' }, // Gold & Neon Pink
    laneColors: { dark: '#facc15', light: 'transparent' },
    propsL3: ['city_building'],
    propsL2: ['city_building', 'track_light'],
    sections: [
      { numSegments: 110, curve: 0 }, // Pit Straight
      { numSegments: 50, curve: 4.2 }, // Turn 1-2 Hairpin Right
      { numSegments: 40, curve: -3.5 },
      { numSegments: 80, curve: 0 }, // Koval Lane
      { numSegments: 55, curve: 3.8 }, // Turn 5-9 The Sphere Complex Right
      { numSegments: 45, curve: -3.8 }, // Left around the Sphere
      { numSegments: 45, curve: 3.5 },
      { numSegments: 60, curve: 0 }, // Sands Avenue
      { numSegments: 50, curve: -4.0 }, // Turn 12 onto The Strip (90-deg Left)
      { numSegments: 180, curve: 0 }, // LAS VEGAS STRIP (2km Flat Out 350+ km/h past Bellagio!)
      { numSegments: 40, curve: -3.6 }, // Turn 14-16 Chicane Left
      { numSegments: 40, curve: 3.6 }, // Right
      { numSegments: 75, curve: 0 }, // Harmon Avenue
      { numSegments: 45, curve: -3.8 }, // Final Turn onto Main Straight
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 130, type: 'road_barrier', offset: 0.45 },
        { segIndex: 300, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 560, type: 'tire_stack', offset: 0.5 },
        { segIndex: 820, type: 'oil_slick', offset: -0.2 },
        ...buildPattern('A', 3, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 250, offset: -0.44 },
      { segIndex: 580, offset: 0.44 },
      { segIndex: 840, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 16: MEXICO CITY GRAND PRIX (Autódromo Hermanos Rodríguez)
  // ---------------------------------------------------------------------------
  {
    round: 16,
    id: 'gp-16',
    name: 'Mexico City Grand Prix',
    circuitName: 'Autódromo Hermanos Rodríguez',
    city: 'Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    environmentName: 'Magdalena Mixhuca & Foro Sol Stadium',
    environmentDescription: 'High-altitude parkland with 1.2km straight, flowing Esses and baseball stadium',
    skyGradient: ['#0369a1', '#0284c7', '#38bdf8', '#fed7aa'],
    celestialFeature: 'clouds',
    horizonType: 'mexico_altitude',
    horizonGlow: 'rgba(251, 146, 60, 0.75)',
    farHorizonColor: '#1e3a5f',
    nearHorizonColor: '#14532d',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#14532d', light: '#166534' },
    rumbleColors: { dark: '#15803d', light: '#dc2626' }, // Mexican Green & Red
    laneColors: { dark: '#ffffff', light: 'transparent' },
    propsL3: ['green_tree'],
    propsL2: ['green_tree', 'grandstand'],
    sections: [
      { numSegments: 150, curve: 0 }, // 1.2km Main Pit Straight
      { numSegments: 40, curve: 4.0 }, // Turn 1-3 Chicane Right
      { numSegments: 40, curve: -3.8 }, // Left
      { numSegments: 40, curve: 3.5 }, // Right exit
      { numSegments: 90, curve: 0 }, // Straight to Turn 4
      { numSegments: 45, curve: -4.0 }, // Turn 4-5 Complex Left
      { numSegments: 45, curve: 3.8 }, // Right
      { numSegments: 60, curve: 0 },
      { numSegments: 35, curve: 3.2 }, // Middle Flowing Esses Right
      { numSegments: 35, curve: -3.2 }, // Left
      { numSegments: 35, curve: 3.2 }, // Right
      { numSegments: 35, curve: -3.2 }, // Left
      { numSegments: 55, curve: 0 },
      { numSegments: 50, curve: 4.2 }, // Turn 12 into Foro Sol Stadium!
      { numSegments: 45, curve: -3.8 }, // Stadium Hairpin Left
      { numSegments: 45, curve: 3.6 }, // Stadium Exit Right onto Peraltada
      { numSegments: 75, curve: 2.8 }, // Peraltada Final Curve
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 160, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 340, type: 'road_barrier', offset: 0.45 },
        { segIndex: 580, type: 'oil_slick', offset: -0.2 },
        { segIndex: 780, type: 'tire_stack', offset: 0.5 },
        ...buildPattern('B', 3, this),
      ];
    },
    boosterPads: [
      { segIndex: 90, offset: 0.0 },
      { segIndex: 300, offset: 0.44 },
      { segIndex: 610, offset: -0.44 },
      { segIndex: 830, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 17: BRAZILIAN GRAND PRIX (Autódromo de Interlagos - São Paulo)
  // ---------------------------------------------------------------------------
  {
    round: 17,
    id: 'gp-17',
    name: 'Brazilian Grand Prix',
    circuitName: 'Autódromo de Interlagos',
    city: 'São Paulo',
    country: 'Brazil',
    flag: '🇧🇷',
    environmentName: 'Interlagos Lakes & São Paulo Rolling Hills',
    environmentDescription: 'Natural amphitheater with Senna S, Curva do Sol and undulating parkland',
    skyGradient: ['#0284c7', '#38bdf8', '#bae6fd', '#fde68a'],
    celestialFeature: 'clouds',
    horizonType: 'interlagos_lakes',
    horizonGlow: 'rgba(250, 204, 21, 0.8)',
    farHorizonColor: '#1e3a5f',
    nearHorizonColor: '#15803d',
    roadColors: { dark: '#252a33', light: '#303642' },
    groundColors: { dark: '#15803d', light: '#16a34a' },
    rumbleColors: { dark: '#facc15', light: '#15803d' }, // Brazilian Yellow & Green
    laneColors: { dark: '#f8fafc', light: 'transparent' },
    propsL3: ['green_tree'],
    propsL2: ['green_tree', 'grandstand'],
    sections: [
      { numSegments: 110, curve: 0 }, // Pit Straight
      { numSegments: 45, curve: -4.6 }, // Iconic Senna S Downhill Left!
      { numSegments: 45, curve: 4.2 }, // Senna S Turn 2 Right
      { numSegments: 60, curve: -2.4 }, // Curva do Sol Left
      { numSegments: 110, curve: 0 }, // Reta Oposta (Back Straight DRS!)
      { numSegments: 50, curve: -3.8 }, // Descida do Lago Turn 4 Left
      { numSegments: 45, curve: -3.0 }, // Turn 5 Left
      { numSegments: 60, curve: 0 },
      { numSegments: 55, curve: 4.2 }, // Ferradura Turn 6-7 Long Right
      { numSegments: 45, curve: 0 },
      { numSegments: 45, curve: 3.5 }, // Curva do Laranjinha Right
      { numSegments: 40, curve: -3.4 }, // Pinheirinho Left
      { numSegments: 40, curve: 3.2 }, // Bico de Pato Hairpin Right
      { numSegments: 45, curve: -3.6 }, // Mergulho Left
      { numSegments: 50, curve: -4.0 }, // Junção Uphill Left
      { numSegments: 100, curve: -1.6 }, // Subida dos Boxes Uphill Banked Sweeper onto Straight!
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 130, type: 'traffic_cone', offset: 0.35 },
        { segIndex: 310, type: 'road_barrier', offset: -0.45 },
        { segIndex: 540, type: 'oil_slick', offset: 0.15 },
        { segIndex: 760, type: 'tire_stack', offset: -0.5 },
        ...buildPattern('C', 3, this),
        ...buildPattern('D', 2, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 270, offset: 0.44 },
      { segIndex: 560, offset: -0.44 },
      { segIndex: 820, offset: 0.0 },
    ],
  },

  // ---------------------------------------------------------------------------
  // ROUND 18: ABU DHABI GRAND PRIX (Yas Marina Circuit - FINALE)
  // ---------------------------------------------------------------------------
  {
    round: 18,
    id: 'gp-18',
    name: 'Abu Dhabi Grand Prix (Finale)',
    circuitName: 'Yas Marina Circuit',
    city: 'Abu Dhabi',
    country: 'UAE',
    flag: '🇦🇪',
    environmentName: 'Yas Marina Sunset Marina & Yas Hotel',
    environmentDescription: 'Twilight luxury finale featuring superyachts, turquoise marina and glowing Yas Hotel',
    skyGradient: ['#0b0f19', '#311042', '#9d174d', '#ea580c'],
    celestialFeature: 'heat_haze',
    horizonType: 'yas_marina',
    horizonGlow: 'rgba(234, 88, 12, 0.85)',
    farHorizonColor: '#180828',
    nearHorizonColor: '#0369a1',
    roadColors: { dark: '#1e2430', light: '#293242' },
    groundColors: { dark: '#064e3b', light: '#047857' },
    rumbleColors: { dark: '#38bdf8', light: '#f8fafc' }, // Yas Marina Cyan-Blue & White
    laneColors: { dark: '#38bdf8', light: 'transparent' },
    propsL3: ['city_building', 'palm_tree'],
    propsL2: ['city_building', 'palm_tree', 'grandstand'],
    sections: [
      { numSegments: 110, curve: 0 }, // Pit Straight
      { numSegments: 45, curve: -3.8 }, // Turn 1 90-degree Left
      { numSegments: 60, curve: 0 },
      { numSegments: 45, curve: 3.2 }, // Turn 2-3 Chicane Right
      { numSegments: 45, curve: -3.2 }, // Left
      { numSegments: 65, curve: -4.8 }, // Turn 5 Hairpin Left
      { numSegments: 150, curve: 0 }, // 1.2km Main Back Straight (350+ km/h!)
      { numSegments: 40, curve: -3.8 }, // Turn 6-7 Chicane Left
      { numSegments: 40, curve: 3.8 }, // Right
      { numSegments: 95, curve: 0 }, // Second Straight
      { numSegments: 60, curve: -3.8 }, // Turn 9 Sweeping Left around the Marina
      { numSegments: 50, curve: 0 }, // Marina Promenade
      { numSegments: 45, curve: 3.6 }, // Turn 12-14 Complex under Yas Hotel!
      { numSegments: 45, curve: 3.4 },
      { numSegments: 40, curve: -3.2 },
      { numSegments: 45, curve: 3.6 }, // Final Corners onto Straight
      { numSegments: 45, curve: 3.0 },
    ],
    get obstacles(): TrackObstacleDef[] {
      return [
        { segIndex: 130, type: 'road_barrier', offset: 0.45 },
        { segIndex: 320, type: 'traffic_cone', offset: -0.35 },
        { segIndex: 560, type: 'tire_stack', offset: 0.5 },
        { segIndex: 820, type: 'oil_slick', offset: -0.2 },
        ...buildPattern('A', 3, this),
        ...buildPattern('B', 3, this),
        ...buildPattern('C', 3, this),
        ...buildPattern('D', 3, this),
        ...buildPattern('E', 3, this),
        ...buildPattern('F', 3, this),
      ];
    },
    boosterPads: [
      { segIndex: 80, offset: 0.0 },
      { segIndex: 280, offset: 0.44 },
      { segIndex: 610, offset: -0.44 },
      { segIndex: 840, offset: 0.0 },
    ],
  },
];

/**
 * Retrieve the authentic World Tour circuit definition by round number (1-18)
 * or by matching GP ID / name. 100% deterministic and fixed across all save files.
 */
export function getWorldTourCircuit(roundNumber?: number, gpId?: string): WorldTourCircuitDef {
  if (roundNumber && roundNumber >= 1 && roundNumber <= 18) {
    return WORLD_TOUR_CIRCUITS[roundNumber - 1];
  }
  if (gpId) {
    const found = WORLD_TOUR_CIRCUITS.find(
      (c) => c.id === gpId || c.id === `gp-${gpId}` || gpId.includes(c.id)
    );
    if (found) return found;
  }
  // Default to Round 1 (Albert Park)
  return WORLD_TOUR_CIRCUITS[0];
}
