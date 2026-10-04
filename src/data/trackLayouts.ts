export interface TrackLayoutData {
  id: string;
  name: string;
  circuitType: 'Street Circuit' | 'Race Circuit' | 'Road Circuit';
  corners: number;
  lapLengthKm: number;
  path: string; // SVG path string in viewBox 0 0 160 100
  startFinish: { x: number; y: number; angle: number }; // Line pos & rotation angle in degrees
  arrow: { x: number; y: number; angle: number }; // Direction chevron position & angle
  drsZones?: number;
}

/**
 * Top-down SVG track layout vectors for all 30 circuits in the global championship pool.
 * Standardized viewBox: 0 0 160 100
 * Each circuit is meticulously crafted with authentic geometry:
 * - Street Circuits: sharp 90-degree angular turns, city-block straights, tight hairpins.
 * - Race Circuits: pronounced long high-speed straights, chicanes, sweeping multi-apex carousels.
 * - Road Circuits: undulating, flowing terrain curves with variable radius arcs.
 * Reflecting the exact corner counts, distinct proportions, start/finish line and driving direction.
 */
export const TRACK_LAYOUTS_30: Record<string, TrackLayoutData> = {
  // =========================================================================
  // EUROPE (5 CIRCUITS)
  // =========================================================================

  // 1. Silverstone Grand Circuit (Race Circuit, 18 corners, 5.891 km)
  // Distinctive UK layout: Hamilton pit straight, Abbey, Village/Loop hairpin, Wellington straight, Brooklands,
  // Luffield, Woodcote, Copse, Maggotts-Becketts-Chapel high-speed S-curves, Hangar straight, Stowe, Vale, Club.
  'pool-eu-1': {
    id: 'pool-eu-1',
    name: 'Silverstone Grand Circuit',
    circuitType: 'Race Circuit',
    corners: 18,
    lapLengthKm: 5.891,
    path: 'M 24 82 L 40 82 L 48 86 L 56 82 L 68 84 L 84 84 L 110 84 C 122 84, 134 76, 130 64 L 126 52 L 138 44 C 146 36, 142 22, 128 20 L 108 24 L 96 34 L 84 32 L 74 42 L 56 42 L 44 48 L 32 46 C 20 46, 16 58, 24 66 L 36 68 L 28 76 Z',
    startFinish: { x: 80, y: 84, angle: 0 },
    arrow: { x: 96, y: 84, angle: 0 },
    drsZones: 2,
  },

  // 2. Monza Temple of Speed (Race Circuit, 11 corners, 5.793 km)
  // Massive main straight, Rettifilo chicane (T1-T2), Curva Grande (T3), Roggia chicane (T4-T5),
  // Lesmo 1 & 2 (T6-T7), Serraglio straight, Ascari chicane (T8-T10), Parabolica high-speed loop (T11).
  'pool-eu-2': {
    id: 'pool-eu-2',
    name: 'Monza Temple of Speed',
    circuitType: 'Race Circuit',
    corners: 11,
    lapLengthKm: 5.793,
    path: 'M 22 82 L 130 82 C 146 82, 150 68, 144 48 C 138 32, 124 26, 112 26 L 90 26 L 86 18 L 76 18 L 74 26 L 52 26 C 42 26, 38 34, 40 42 L 44 46 L 36 48 L 22 56 C 14 62, 14 74, 22 82 Z',
    startFinish: { x: 70, y: 82, angle: 0 },
    arrow: { x: 90, y: 82, angle: 0 },
    drsZones: 3,
  },

  // 3. Spa Ardennes Circuit (Road Circuit, 19 corners, 7.004 km)
  // Flowing Ardennes elevation: La Source hairpin, downhill to Eau Rouge & Raidillon uphill crest,
  // Kemmel straight, Les Combes chicane, Malmedy, Bruxelles hairpin, Pouhon double left,
  // Fagnes, Stavelot, Blanchimont sweeper, Bus Stop chicane.
  'pool-eu-3': {
    id: 'pool-eu-3',
    name: 'Spa Ardennes Circuit',
    circuitType: 'Road Circuit',
    corners: 19,
    lapLengthKm: 7.004,
    path: 'M 26 76 C 16 72, 18 58, 28 54 L 46 44 C 52 38, 58 28, 70 20 L 102 16 C 118 14, 136 18, 144 28 C 148 38, 140 48, 128 54 L 112 62 C 104 66, 104 74, 112 80 C 116 84, 110 88, 100 86 L 74 82 C 66 80, 58 72, 48 72 L 36 74 Z',
    startFinish: { x: 88, y: 84, angle: 8 },
    arrow: { x: 74, y: 82, angle: 188 },
    drsZones: 2,
  },

  // 4. Catalunya Ring (Race Circuit, 14 corners, 4.675 km)
  // Long main straight, Elf chicane, Renault sweeping turn 3, Repsol hairpin, Seat hairpin,
  // Campsa blind uphill right, back straight, La Caixa, stadium complex.
  'pool-eu-4': {
    id: 'pool-eu-4',
    name: 'Catalunya Ring',
    circuitType: 'Race Circuit',
    corners: 14,
    lapLengthKm: 4.675,
    path: 'M 24 80 L 134 80 C 144 80, 146 68, 138 58 L 122 44 C 116 38, 118 28, 126 24 C 130 20, 126 16, 116 18 L 84 22 C 72 24, 68 32, 72 40 L 76 48 C 78 54, 70 60, 62 60 L 42 60 C 32 60, 26 66, 20 72 Z',
    startFinish: { x: 78, y: 80, angle: 0 },
    arrow: { x: 96, y: 80, angle: 0 },
    drsZones: 2,
  },

  // 5. Monaco Harbor Street Circuit (Street Circuit, 19 corners, 3.337 km)
  // Tight city street barrier track: Sainte-Dévote 90° right, Beau Rivage climb, Massenet, Casino square,
  // Mirabeau, Fairmont tight hairpin (tightest in racing), Portier, Tunnel curve, Nouvelle chicane,
  // Tabac, swimming pool chicanes, Rascasse hairpin, Anthony Noghès.
  'pool-eu-5': {
    id: 'pool-eu-5',
    name: 'Monaco Harbor Street Circuit',
    circuitType: 'Street Circuit',
    corners: 19,
    lapLengthKm: 3.337,
    path: 'M 22 78 L 34 50 L 44 44 L 58 48 L 74 54 L 84 50 L 88 38 L 94 26 L 106 24 L 114 30 L 108 40 L 98 46 L 96 54 L 104 58 L 132 62 L 140 72 L 134 82 L 118 82 L 108 72 L 94 66 L 78 72 L 68 84 L 46 84 L 28 84 Z',
    startFinish: { x: 34, y: 84, angle: 0 },
    arrow: { x: 24, y: 81, angle: 245 },
    drsZones: 1,
  },

  // =========================================================================
  // ASIA (5 CIRCUITS)
  // =========================================================================

  // 6. Suzuka Speed Park (Race Circuit, 18 corners, 5.807 km)
  // Iconic crossover figure-eight layout: First sector snake S-curves (T1-T6), Degner 1 & 2,
  // hairpin, Spoon curve double apex, back straight, 130R high speed sweeper, Casio triangle.
  'pool-as-1': {
    id: 'pool-as-1',
    name: 'Suzuka Speed Park',
    circuitType: 'Race Circuit',
    corners: 18,
    lapLengthKm: 5.807,
    path: 'M 30 76 C 22 72, 24 58, 34 52 L 48 44 L 58 48 L 68 40 L 82 52 L 96 66 C 104 74, 114 74, 122 66 L 136 50 C 144 42, 142 26, 128 22 C 116 18, 104 24, 98 32 L 86 48 L 74 54 L 62 46 L 46 32 C 38 24, 26 26, 22 36 C 18 48, 24 64, 30 76 Z',
    startFinish: { x: 30, y: 76, angle: 25 },
    arrow: { x: 42, y: 47, angle: 330 },
    drsZones: 1,
  },

  // 7. Marina Bay Night Circuit (Street Circuit, 23 corners, 4.94 km)
  // Singapore street grid: Sheares complex, Republic Boulevard, Turn 7 right angle, Padang straight,
  // Anderson Bridge hairpin, Esplanade waterfront chicane, Raffles Avenue street block turns.
  'pool-as-2': {
    id: 'pool-as-2',
    name: 'Marina Bay Night Circuit',
    circuitType: 'Street Circuit',
    corners: 23,
    lapLengthKm: 4.94,
    path: 'M 20 82 L 20 44 L 32 44 L 32 30 L 46 30 L 46 22 L 72 22 L 72 32 L 92 32 L 92 22 L 126 22 L 126 36 L 140 36 L 140 64 L 128 64 L 128 82 L 96 82 L 96 72 L 80 72 L 80 82 L 56 82 L 56 74 L 40 74 L 40 82 Z',
    startFinish: { x: 86, y: 82, angle: 0 },
    arrow: { x: 68, y: 82, angle: 180 },
    drsZones: 3,
  },

  // 8. Shanghai International Park (Race Circuit, 16 corners, 5.451 km)
  // Shaped like Chinese character "上": Snail turn tightening spiral (T1-T4), hairpin T6,
  // high-speed Esses T7-T8, long sweeper T11-T13, 1.2km back straight into T14 hairpin, final turn T16.
  'pool-as-3': {
    id: 'pool-as-3',
    name: 'Shanghai International Park',
    circuitType: 'Race Circuit',
    corners: 16,
    lapLengthKm: 5.451,
    path: 'M 28 80 L 138 80 C 148 80, 150 68, 142 62 L 76 44 C 66 40, 64 28, 74 20 C 86 12, 102 16, 102 28 C 102 40, 88 46, 76 46 L 46 46 C 34 46, 30 36, 38 26 C 46 18, 62 16, 68 24 L 56 40 L 42 48 L 32 56 L 22 66 C 16 72, 18 80, 28 80 Z',
    startFinish: { x: 80, y: 80, angle: 0 },
    arrow: { x: 100, y: 80, angle: 0 },
    drsZones: 2,
  },

  // 9. Sakhir Desert Circuit (Race Circuit, 15 corners, 5.412 km)
  // Bahrain: 4 long high-speed straights, downhill T1-T2 hairpin, fast uphill T4 sweeper,
  // downhill blind lockup turns 9/10, back straight, sweeping turn 11-12, final turns 13-15.
  'pool-as-4': {
    id: 'pool-as-4',
    name: 'Sakhir Desert Circuit',
    circuitType: 'Race Circuit',
    corners: 15,
    lapLengthKm: 5.412,
    path: 'M 24 84 L 130 84 C 140 84, 146 76, 142 64 L 128 36 C 124 26, 114 20, 104 24 L 84 32 L 72 26 L 62 16 C 56 10, 44 12, 40 22 L 36 48 L 28 58 L 18 66 C 12 72, 16 84, 24 84 Z',
    startFinish: { x: 76, y: 84, angle: 0 },
    arrow: { x: 92, y: 84, angle: 0 },
    drsZones: 3,
  },

  // 10. Yas Island Circuit (Race Circuit, 16 corners, 5.281 km)
  // Abu Dhabi: Fast T1-T3, North hairpin T5, longest back straight, chicane T6-T7,
  // second back straight, Marina hotel complex with tight left-right twists under the bridge.
  'pool-as-5': {
    id: 'pool-as-5',
    name: 'Yas Island Circuit',
    circuitType: 'Race Circuit',
    corners: 16,
    lapLengthKm: 5.281,
    path: 'M 22 78 L 126 78 C 136 78, 144 70, 142 56 L 140 38 C 138 24, 126 18, 114 18 L 88 18 L 82 28 L 74 30 L 52 38 L 44 48 L 42 62 L 34 68 L 22 78 Z',
    startFinish: { x: 74, y: 78, angle: 0 },
    arrow: { x: 92, y: 78, angle: 0 },
    drsZones: 2,
  },

  // =========================================================================
  // NORTH AMERICA (5 CIRCUITS)
  // =========================================================================

  // 11. Americas Grand Circuit (Race Circuit, 20 corners, 5.513 km)
  // Austin COTA: Steep uphill crest Turn 1 hairpin, rapid downhill snake Esses (T2-T6),
  // blind crest T9, hairpin T11 onto 1km back straight, stadium amphitheater Carousel (T16-T18).
  'pool-na-1': {
    id: 'pool-na-1',
    name: 'Americas Grand Circuit',
    circuitType: 'Race Circuit',
    corners: 20,
    lapLengthKm: 5.513,
    path: 'M 22 82 L 20 64 L 28 44 L 40 26 C 46 16, 58 18, 62 28 L 68 44 L 76 58 L 86 52 L 96 42 L 106 32 L 118 36 L 140 44 C 148 54, 144 70, 132 78 L 114 84 L 92 84 L 80 76 L 68 76 L 56 84 L 38 84 Z',
    startFinish: { x: 90, y: 84, angle: 0 },
    arrow: { x: 74, y: 82, angle: 180 },
    drsZones: 2,
  },

  // 12. Neon Strip Circuit (Street Circuit, 17 corners, 6.201 km)
  // Las Vegas Strip: MSG Sphere chicane complex, Koval Lane, sharp 90° onto the massive 1.9km
  // Las Vegas Boulevard straight, Harmon Avenue chicane, final high-speed sweeps.
  'pool-na-2': {
    id: 'pool-na-2',
    name: 'Neon Strip Circuit',
    circuitType: 'Street Circuit',
    corners: 17,
    lapLengthKm: 6.201,
    path: 'M 18 80 L 140 80 C 148 80, 150 72, 144 64 L 128 46 L 116 46 L 104 54 L 88 54 L 76 42 L 64 22 C 58 12, 42 14, 38 26 L 32 44 L 24 58 L 14 68 Z',
    startFinish: { x: 78, y: 80, angle: 0 },
    arrow: { x: 96, y: 80, angle: 0 },
    drsZones: 2,
  },

  // 13. Miami Bayfront Circuit (Street Circuit, 19 corners, 5.412 km)
  // Miami Hard Rock stadium: dual long straights along turnpike canal, sweeping marina turns 4-8,
  // tight slow-speed flyover chicane turns 14-15 under elevated highway, hairpin turn 17.
  'pool-na-3': {
    id: 'pool-na-3',
    name: 'Miami Bayfront Circuit',
    circuitType: 'Street Circuit',
    corners: 19,
    lapLengthKm: 5.412,
    path: 'M 24 78 L 128 78 C 138 78, 144 70, 140 58 L 126 34 L 112 22 L 96 22 L 80 34 L 68 38 L 56 32 L 48 20 C 40 12, 28 16, 26 28 L 22 46 L 28 56 L 20 68 Z',
    startFinish: { x: 76, y: 78, angle: 0 },
    arrow: { x: 94, y: 78, angle: 0 },
    drsZones: 3,
  },

  // 14. Maple Leaf Park Circuit (Race Circuit, 14 corners, 4.361 km)
  // Montreal Île Notre-Dame island track: Narrow elongated profile with two hairpin ends!
  // Virage Senna S-curves, long run down Olympic basin, chicanes 3-4 and 6-7, hairpin l'Épingle (T10),
  // Droit du Casino straight, Wall of Champions chicane (T13-T14).
  'pool-na-4': {
    id: 'pool-na-4',
    name: 'Maple Leaf Park Circuit',
    circuitType: 'Race Circuit',
    corners: 14,
    lapLengthKm: 4.361,
    path: 'M 18 52 C 16 38, 28 26, 42 26 L 68 26 L 74 34 L 84 26 L 118 26 C 134 26, 146 38, 142 54 C 138 70, 126 78, 112 78 L 84 78 L 78 70 L 68 78 L 38 78 C 24 78, 18 66, 18 52 Z',
    startFinish: { x: 80, y: 78, angle: 0 },
    arrow: { x: 62, y: 78, angle: 180 },
    drsZones: 2,
  },

  // 15. Mexico Altitude Circuit (Race Circuit, 17 corners, 4.304 km)
  // Mexico City: 1.3km high-altitude straight, Moisés Solana chicane (T1-T3), Lake S-curves (T4-T6),
  // rhythmic fast Esses (T7-T11), and the famous Foro Sol baseball stadium bowl (T12-T16).
  'pool-na-5': {
    id: 'pool-na-5',
    name: 'Mexico Altitude Circuit',
    circuitType: 'Race Circuit',
    corners: 17,
    lapLengthKm: 4.304,
    path: 'M 22 76 L 138 76 C 146 76, 148 66, 140 58 L 118 42 L 108 42 L 108 26 C 114 18, 120 12, 110 12 L 84 18 L 76 28 L 74 38 L 78 48 L 68 56 L 52 56 L 42 62 L 26 66 Z',
    startFinish: { x: 80, y: 76, angle: 0 },
    arrow: { x: 98, y: 76, angle: 0 },
    drsZones: 2,
  },

  // =========================================================================
  // SOUTH AMERICA (5 CIRCUITS)
  // =========================================================================

  // 16. Interlagos Heritage Circuit (Race Circuit, 15 corners, 4.309 km)
  // São Paulo natural bowl: Downhill Senna S (T1-T2), Curva do Sol, Reta Oposta straight,
  // Descida do Lago, Ferradura double apex, Pinheirinho, Bico de Pato hairpin, Junção uphill climb.
  'pool-sa-1': {
    id: 'pool-sa-1',
    name: 'Interlagos Heritage Circuit',
    circuitType: 'Race Circuit',
    corners: 15,
    lapLengthKm: 4.309,
    path: 'M 26 72 C 18 64, 22 50, 32 42 L 52 26 C 62 18, 78 20, 86 30 L 94 42 C 100 50, 112 52, 120 44 L 130 34 C 138 26, 146 32, 142 44 L 132 68 C 126 82, 110 88, 96 84 L 66 76 C 56 74, 50 80, 40 80 C 30 80, 24 76, 26 72 Z',
    startFinish: { x: 74, y: 78, angle: 8 },
    arrow: { x: 58, y: 75, angle: 188 },
    drsZones: 2,
  },

  // 17. Rio Coastal Circuit (Street Circuit, 16 corners, 4.82 km)
  // Copacabana coastal boulevard straight, Marina da Glória chicane, 90° parkway grid corners,
  // esplanade curves with Sugarloaf Mountain backdrop.
  'pool-sa-2': {
    id: 'pool-sa-2',
    name: 'Rio Coastal Circuit',
    circuitType: 'Street Circuit',
    corners: 16,
    lapLengthKm: 4.82,
    path: 'M 20 78 L 136 78 C 146 78, 148 68, 142 58 L 126 40 L 112 40 L 102 48 L 88 48 L 80 36 L 68 24 C 60 14, 46 16, 42 26 L 36 44 L 28 54 L 18 66 Z',
    startFinish: { x: 78, y: 78, angle: 0 },
    arrow: { x: 96, y: 78, angle: 0 },
    drsZones: 2,
  },

  // 18. Buenos Aires Grand Park (Road Circuit, 15 corners, 4.259 km)
  // Flowing Argentine road circuit around Lake Lugano: Curvón broad high-speed sweeper (T1-T2),
  // flowing lakeside curves (T3-T5), Curva del Ombú (T6), Ascari chicane (T7-T8),
  // Tobogán undulating Esses (T9-T11), Horquilla hairpin (T12-T13), sweeping lake arc (T14-T15).
  // Noticeable organic rhythmic curves with 15 clearly visible bends.
  'pool-sa-3': {
    id: 'pool-sa-3',
    name: 'Buenos Aires Grand Park',
    circuitType: 'Road Circuit',
    corners: 15,
    lapLengthKm: 4.259,
    path: 'M 28 78 C 18 70, 20 54, 30 46 L 46 36 C 52 30, 60 34, 68 28 L 82 18 C 94 12, 108 14, 116 24 L 128 38 C 136 46, 144 48, 142 58 L 138 68 C 134 78, 122 84, 112 80 L 98 76 C 90 74, 84 80, 76 80 L 58 76 C 48 76, 42 84, 34 82 Z',
    startFinish: { x: 88, y: 78, angle: 0 },
    arrow: { x: 72, y: 78, angle: 180 },
    drsZones: 2,
  },

  // 19. Andes Highland Circuit (Race Circuit, 18 corners, 5.12 km)
  // Santiago foothills: High elevation gradient, downhill pit straight, uphill hairpin T3,
  // hillside serpentine esses T5-T9, long ridge straight, switchback T12-T14, downhill carousel.
  'pool-sa-4': {
    id: 'pool-sa-4',
    name: 'Andes Highland Circuit',
    circuitType: 'Race Circuit',
    corners: 18,
    lapLengthKm: 5.12,
    path: 'M 24 82 L 130 82 C 140 82, 146 72, 140 60 L 126 44 L 114 44 L 106 32 L 96 32 L 88 20 C 82 12, 70 14, 64 22 L 58 36 L 50 44 L 42 40 L 32 48 L 22 62 Z',
    startFinish: { x: 76, y: 82, angle: 0 },
    arrow: { x: 94, y: 82, angle: 0 },
    drsZones: 2,
  },

  // 20. Bogota City Circuit (Street Circuit, 20 corners, 4.54 km)
  // High-density colonial city grid: square city block corners (90° turns), plaza perimeter chicane,
  // Carrera 7 boulevard straight, central fountain monument hairpin.
  'pool-sa-5': {
    id: 'pool-sa-5',
    name: 'Bogota City Circuit',
    circuitType: 'Street Circuit',
    corners: 20,
    lapLengthKm: 4.54,
    path: 'M 22 80 L 54 80 L 54 70 L 76 70 L 76 80 L 132 80 L 132 58 L 120 58 L 120 44 L 108 44 L 108 30 L 86 30 L 86 20 L 64 20 L 64 34 L 48 34 L 48 48 L 32 48 L 32 64 L 22 64 Z',
    startFinish: { x: 94, y: 80, angle: 0 },
    arrow: { x: 112, y: 80, angle: 0 },
    drsZones: 2,
  },

  // =========================================================================
  // AFRICA (5 CIRCUITS)
  // =========================================================================

  // 21. Kyalami Heritage Circuit (Race Circuit, 16 corners, 4.529 km)
  // South Africa: Crowthorne downhill right (T1), Jukskei sweep, Sunset fast sweeper,
  // Clubhouse left, The Esses (T6-T7), Leeukop hairpin, Mineshaft downhill plunge.
  'pool-af-1': {
    id: 'pool-af-1',
    name: 'Kyalami Heritage Circuit',
    circuitType: 'Race Circuit',
    corners: 16,
    lapLengthKm: 4.529,
    path: 'M 24 78 C 16 72, 18 58, 28 48 L 48 32 C 58 22, 74 24, 84 34 L 98 48 C 106 56, 118 56, 126 48 L 136 38 C 142 32, 148 40, 144 50 L 132 72 C 124 86, 106 88, 92 82 L 56 74 C 46 72, 40 80, 32 80 C 26 80, 22 78, 24 78 Z',
    startFinish: { x: 78, y: 79, angle: 8 },
    arrow: { x: 62, y: 76, angle: 188 },
    drsZones: 2,
  },

  // 22. Cape Coastal Circuit (Street Circuit, 18 corners, 4.86 km)
  // Cape Town Waterfront: Table Bay harbor straight, sharp lighthouse chicane, coastal esplanade
  // 90-degree boulevard turns, V&A marina technical complex.
  'pool-af-2': {
    id: 'pool-af-2',
    name: 'Cape Coastal Circuit',
    circuitType: 'Street Circuit',
    corners: 18,
    lapLengthKm: 4.86,
    path: 'M 20 80 L 132 80 L 132 66 L 142 66 L 142 50 L 128 36 L 114 36 L 106 24 L 92 24 L 84 34 L 68 34 L 58 22 L 44 22 L 36 36 L 36 52 L 26 52 L 20 66 Z',
    startFinish: { x: 74, y: 80, angle: 0 },
    arrow: { x: 92, y: 80, angle: 0 },
    drsZones: 2,
  },

  // 23. Casablanca Street Circuit (Street Circuit, 15 corners, 4.712 km)
  // Morocco: Historic Ain-Diab corniche straight, Sidi Abderrahmane 180° hairpin,
  // boulevard high-speed sweeps, and medina square chicanes.
  'pool-af-3': {
    id: 'pool-af-3',
    name: 'Casablanca Street Circuit',
    circuitType: 'Street Circuit',
    corners: 15,
    lapLengthKm: 4.712,
    path: 'M 20 78 L 136 78 C 144 78, 148 68, 140 60 L 122 42 L 122 26 L 110 16 C 100 16, 96 24, 96 32 L 86 44 L 72 44 L 62 32 L 48 32 L 38 48 L 26 60 Z',
    startFinish: { x: 78, y: 78, angle: 0 },
    arrow: { x: 96, y: 78, angle: 0 },
    drsZones: 1,
  },

  // 24. Cairo Desert Ring (Race Circuit, 14 corners, 5.21 km)
  // Giza Desert: Two massive high-speed straights connected by 14 sharp, distinct corners:
  // Turn 1-2 chicane, Turn 4 oasis hairpin, high-G sweeper Turns 6-8, Dune back straight,
  // Turn 9-10 chicane, technical pyramid complex Turns 11-14.
  'pool-af-4': {
    id: 'pool-af-4',
    name: 'Cairo Desert Ring',
    circuitType: 'Race Circuit',
    corners: 14,
    lapLengthKm: 5.21,
    path: 'M 22 80 L 134 80 L 144 70 L 138 56 L 124 56 L 114 42 L 114 24 L 98 24 L 84 38 L 58 38 L 48 24 L 34 24 L 24 40 L 22 62 Z',
    startFinish: { x: 78, y: 80, angle: 0 },
    arrow: { x: 96, y: 80, angle: 0 },
    drsZones: 2,
  },

  // 25. Lagos Waterfront Circuit (Street Circuit, 17 corners, 4.65 km)
  // Nigeria: Victoria Island Lekki bridge straight, lagoon marina chicanes, banking boulevard turns,
  // and commercial skyscraper 90-degree corners.
  'pool-af-5': {
    id: 'pool-af-5',
    name: 'Lagos Waterfront Circuit',
    circuitType: 'Street Circuit',
    corners: 17,
    lapLengthKm: 4.65,
    path: 'M 22 82 L 134 82 L 142 72 L 134 60 L 134 46 L 122 46 L 122 32 L 108 32 L 98 20 L 82 20 L 74 34 L 58 34 L 50 48 L 38 48 L 30 62 L 22 72 Z',
    startFinish: { x: 78, y: 82, angle: 0 },
    arrow: { x: 96, y: 82, angle: 0 },
    drsZones: 2,
  },

  // =========================================================================
  // OCEANIA (5 CIRCUITS)
  // =========================================================================

  // 26. Albert Park Circuit (Street Circuit, 14 corners, 5.278 km)
  // Melbourne: Semi-permanent street circuit around Albert Park lake. Fast Turns 1-2 chicane,
  // lakeside sweeping Turns 3-5, long run down Lakeside Drive, fast sweeps Turns 9-10, Clark chicane T11-T12.
  'pool-oc-1': {
    id: 'pool-oc-1',
    name: 'Albert Park Circuit',
    circuitType: 'Street Circuit',
    corners: 14,
    lapLengthKm: 5.278,
    path: 'M 24 78 L 40 78 L 48 70 L 58 78 L 120 78 C 132 78, 142 68, 138 54 L 128 36 L 116 24 C 104 16, 92 18, 82 26 L 68 40 L 52 44 L 38 52 L 24 64 Z',
    startFinish: { x: 86, y: 78, angle: 0 },
    arrow: { x: 104, y: 78, angle: 0 },
    drsZones: 4,
  },

  // 27. Sydney Harbour Circuit (Street Circuit, 19 corners, 4.98 km)
  // Sydney: Circular Quay and harbour bridge street layout. 19 sharp turns weaving around harbour piers,
  // opera house precinct, and botanical gardens parkway.
  'pool-oc-2': {
    id: 'pool-oc-2',
    name: 'Sydney Harbour Circuit',
    circuitType: 'Street Circuit',
    corners: 19,
    lapLengthKm: 4.98,
    path: 'M 22 80 L 132 80 L 140 70 L 140 56 L 128 56 L 128 42 L 116 42 L 116 28 L 98 28 L 98 18 L 82 18 L 72 30 L 60 30 L 52 44 L 42 44 L 36 56 L 28 56 L 22 68 Z',
    startFinish: { x: 78, y: 80, angle: 0 },
    arrow: { x: 96, y: 80, angle: 0 },
    drsZones: 2,
  },

  // 28. Gold Coast Street Circuit (Street Circuit, 15 corners, 4.47 km)
  // Surfers Paradise: Ocean beach boulevard flat-out straight, violent curb-hopping chicanes,
  // 90° avenue turns between high-rise skyscrapers.
  'pool-oc-3': {
    id: 'pool-oc-3',
    name: 'Gold Coast Street Circuit',
    circuitType: 'Street Circuit',
    corners: 15,
    lapLengthKm: 4.47,
    path: 'M 18 80 L 142 80 L 142 64 L 132 64 L 132 48 L 120 48 L 108 34 L 88 34 L 76 44 L 62 26 L 46 26 L 36 40 L 26 56 L 18 68 Z',
    startFinish: { x: 80, y: 80, angle: 0 },
    arrow: { x: 100, y: 80, angle: 0 },
    drsZones: 2,
  },

  // 29. Auckland Bay Circuit (Street Circuit, 16 corners, 4.81 km)
  // Waitematā harbor waterfront: Quay Street straight, Wynyard Quarter dockside hairpin,
  // Viaduct basin technical chicanes, parkway curves.
  'pool-oc-4': {
    id: 'pool-oc-4',
    name: 'Auckland Bay Circuit',
    circuitType: 'Street Circuit',
    corners: 16,
    lapLengthKm: 4.81,
    path: 'M 22 78 L 130 78 L 140 68 L 134 54 L 120 54 L 110 40 L 110 24 L 92 24 L 82 36 L 70 36 L 60 22 L 44 22 L 36 38 L 30 52 L 22 66 Z',
    startFinish: { x: 76, y: 78, angle: 0 },
    arrow: { x: 94, y: 78, angle: 0 },
    drsZones: 2,
  },

  // 30. Perth Outback Circuit (Race Circuit, 13 corners, 4.38 km)
  // Wanneroo / Barbagallo rollercoaster layout: Short, punchy, undulating 13-corner track.
  // Kolb corner downhill plunge into the sand bowl, Basin right-hander, uphill main straight with crest.
  'pool-oc-5': {
    id: 'pool-oc-5',
    name: 'Perth Outback Circuit',
    circuitType: 'Race Circuit',
    corners: 13,
    lapLengthKm: 4.38,
    path: 'M 24 80 L 126 80 C 136 80, 142 70, 138 58 L 124 38 C 118 28, 108 22, 96 28 L 76 40 L 62 32 L 52 18 C 46 10, 32 12, 30 24 L 22 54 L 18 68 Z',
    startFinish: { x: 74, y: 80, angle: 0 },
    arrow: { x: 92, y: 80, angle: 0 },
    drsZones: 2,
  },
};

const KEYWORD_MAP: Record<string, string> = {
  melbourne: 'pool-oc-1',
  australia: 'pool-oc-1',
  albert: 'pool-oc-1',
  suzuka: 'pool-as-1',
  japan: 'pool-as-1',
  bahrain: 'pool-as-4',
  sakhir: 'pool-as-4',
  shanghai: 'pool-as-3',
  china: 'pool-as-3',
  miami: 'pool-na-3',
  monaco: 'pool-eu-5',
  'monte carlo': 'pool-eu-5',
  montreal: 'pool-na-4',
  canada: 'pool-na-4',
  'maple leaf': 'pool-na-4',
  barcelona: 'pool-eu-4',
  catalunya: 'pool-eu-4',
  spain: 'pool-eu-4',
  silverstone: 'pool-eu-1',
  britain: 'pool-eu-1',
  british: 'pool-eu-1',
  spa: 'pool-eu-3',
  ardennes: 'pool-eu-3',
  belgium: 'pool-eu-3',
  monza: 'pool-eu-2',
  italy: 'pool-eu-2',
  singapore: 'pool-as-2',
  'marina bay': 'pool-as-2',
  austin: 'pool-na-1',
  americas: 'pool-na-1',
  cota: 'pool-na-1',
  mexico: 'pool-na-5',
  interlagos: 'pool-sa-1',
  'são paulo': 'pool-sa-1',
  'sao paulo': 'pool-sa-1',
  brazil: 'pool-sa-1',
  'las vegas': 'pool-na-2',
  vegas: 'pool-na-2',
  'neon strip': 'pool-na-2',
  'abu dhabi': 'pool-as-5',
  yas: 'pool-as-5',
  'buenos aires': 'pool-sa-3',
  argentina: 'pool-sa-3',
  cairo: 'pool-af-4',
  egypt: 'pool-af-4',
  rio: 'pool-sa-2',
  santiago: 'pool-sa-4',
  chile: 'pool-sa-4',
  andes: 'pool-sa-4',
  bogota: 'pool-sa-5',
  bogotá: 'pool-sa-5',
  colombia: 'pool-sa-5',
  kyalami: 'pool-af-1',
  johannesburg: 'pool-af-1',
  'south africa': 'pool-af-1',
  'cape town': 'pool-af-2',
  'cape coastal': 'pool-af-2',
  casablanca: 'pool-af-3',
  morocco: 'pool-af-3',
  lagos: 'pool-af-5',
  nigeria: 'pool-af-5',
  sydney: 'pool-oc-2',
  'gold coast': 'pool-oc-3',
  surfers: 'pool-oc-3',
  auckland: 'pool-oc-4',
  'new zealand': 'pool-oc-4',
  perth: 'pool-oc-5',
  outback: 'pool-oc-5',
};

/**
 * Helper to retrieve track layout data by circuit ID or fallback to standard shape.
 */
export function getTrackLayout(circuitIdOrName?: string): TrackLayoutData {
  if (!circuitIdOrName) {
    return TRACK_LAYOUTS_30['pool-eu-1'];
  }

  // 1. Exact match by pool ID
  if (TRACK_LAYOUTS_30[circuitIdOrName]) {
    return TRACK_LAYOUTS_30[circuitIdOrName];
  }

  // 2. Match if season circuit ID contains pool ID (e.g. "s1-r1-pool-eu-1")
  const matchedKey = Object.keys(TRACK_LAYOUTS_30).find((key) =>
    circuitIdOrName.includes(key)
  );
  if (matchedKey && TRACK_LAYOUTS_30[matchedKey]) {
    return TRACK_LAYOUTS_30[matchedKey];
  }

  // 3. Fallback match by keyword / city / country
  const lower = circuitIdOrName.toLowerCase();
  for (const [kw, poolId] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(kw)) {
      return TRACK_LAYOUTS_30[poolId];
    }
  }

  // 4. Fallback match by circuit name
  const nameMatch = Object.values(TRACK_LAYOUTS_30).find(
    (t) =>
      lower.includes(t.name.toLowerCase()) ||
      t.name.toLowerCase().includes(lower)
  );
  if (nameMatch) {
    return nameMatch;
  }

  return TRACK_LAYOUTS_30['pool-eu-1'];
}
