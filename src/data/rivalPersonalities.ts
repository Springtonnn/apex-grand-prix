export type DriverPersonalityKey =
  | 'apex_predator'
  | 'corner_virtuoso'
  | 'slingshot_hunter'
  | 'legendary_precision'
  | 'iron_wall'
  | 'tenacious_fighter'
  | 'smooth_operator'
  | 'ice_cold'
  | 'underdog_raider'
  | 'straight_line_rocket'
  | 'veteran_battler';

export interface DriverPersonalityProfile {
  key: DriverPersonalityKey;
  driverId: string;
  driverName: string;
  driverTag: string;
  teamName: string;
  number: number;
  icon: string;
  title: string;
  titleTh: string;
  tagline: string;
  skillName: string;
  skillNameTh: string;
  skillDescription: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

export const DRIVER_PERSONALITIES: Record<string, DriverPersonalityProfile> = {
  'ai-1': {
    key: 'apex_predator',
    driverId: 'ai-1',
    driverName: 'Min Werstappen',
    driverTag: 'WER',
    teamName: 'Red Bullion Racing',
    number: 1,
    icon: '🦁',
    title: 'Apex Predator',
    titleTh: 'Relentless Apex Hunter',
    tagline: 'Extreme late braking, razor apex cuts, and zero lift-off in wheel-to-wheel combat.',
    skillName: 'APEX DIVE-BOMB',
    skillNameTh: 'Lightning Apex Dive',
    skillDescription: 'Brakes deeper than normal, slicing through the inside apex with high momentum and explosive exit drive.',
    badgeBg: 'rgba(30, 58, 138, 0.95)',
    badgeBorder: '#3b82f6',
    badgeText: '#93c5fd',
  },
  'ai-2': {
    key: 'corner_virtuoso',
    driverId: 'ai-2',
    driverName: 'Charl Leclerk',
    driverTag: 'CLK',
    teamName: 'Scuderia Cavallo',
    number: 16,
    icon: '🐎',
    title: 'Corner Virtuoso',
    titleTh: 'High-Speed Aero Master',
    tagline: 'Full throttle through high-speed sweepers, maximizing downforce to the absolute edge.',
    skillName: 'CORNER BLITZ',
    skillNameTh: 'High-Speed Sweeper Glide',
    skillDescription: 'Carries +12 km/h higher cornering speed by clipping edge-to-edge kerb racing lines.',
    badgeBg: 'rgba(185, 28, 28, 0.95)',
    badgeBorder: '#ef4444',
    badgeText: '#fca5a5',
  },
  'ai-3': {
    key: 'slingshot_hunter',
    driverId: 'ai-3',
    driverName: 'Londo Morris',
    driverTag: 'MOR',
    teamName: 'MacLaren Racing',
    number: 4,
    icon: '⚡',
    title: 'Slingshot Hunter',
    titleTh: 'Slipstream Hunter',
    tagline: 'Stalks the rear wing of rivals, harnessing turbulent slipstream before slingshotting ahead.',
    skillName: 'SLINGSHOT SURGE',
    skillNameTh: 'Slingshot Slipstream Burst',
    skillDescription: 'Gains +22 km/h slipstream tow when drafting within 70 meters of car ahead.',
    badgeBg: 'rgba(194, 65, 12, 0.95)',
    badgeBorder: '#f97316',
    badgeText: '#fed7aa',
  },
  'ai-4': {
    key: 'legendary_precision',
    driverId: 'ai-4',
    driverName: 'Louis Hammerton',
    driverTag: 'HAM',
    teamName: 'Silver Arrow GP',
    number: 44,
    icon: '👑',
    title: 'Legendary Precision',
    titleTh: 'Legendary Precision',
    tagline: 'Flawless line management, instinctive hazard evasion, and ruthless Hammer Time counter-attacks.',
    skillName: 'HAMMER TIME',
    skillNameTh: 'Hammer Time Counter-Attack',
    skillDescription: 'When overtaken, triggers Hammer Time unleashing +14 km/h surge to immediately reclaim position.',
    badgeBg: 'rgba(15, 118, 110, 0.95)',
    badgeBorder: '#00d2be',
    badgeText: '#99f6e4',
  },
  'ai-5': {
    key: 'iron_wall',
    driverId: 'ai-5',
    driverName: 'Ferdinand Alonzy',
    driverTag: 'ALZ',
    teamName: 'Aston Sovereign F1',
    number: 14,
    icon: '🛡️',
    title: 'The Iron Wall',
    titleTh: 'Iron Fortress',
    tagline: 'Tenacious racecraft, proactive defensive weaving, and rock-solid defense under braking.',
    skillName: 'DEFENSIVE WEAVE',
    skillNameTh: 'Defensive Line Block',
    skillDescription: 'Detects approaching pursuers and covers the inside line, reducing collision drag by 40% without losing rhythm.',
    badgeBg: 'rgba(6, 78, 59, 0.95)',
    badgeBorder: '#10b981',
    badgeText: '#a7f3d0',
  },
  'ai-6': {
    key: 'tenacious_fighter',
    driverId: 'ai-6',
    driverName: 'Jorge Rustell',
    driverTag: 'RUS',
    teamName: 'Silver Arrow GP',
    number: 63,
    icon: '🥊',
    title: 'Tenacious Fighter',
    titleTh: 'Tenacious Brawler',
    tagline: 'Never yields in side-by-side duels, locking wheels without ever lifting off throttle.',
    skillName: 'SIDE-BY-SIDE BRAWL',
    skillNameTh: 'No-Lift Side-by-Side Brawl',
    skillDescription: 'Maintains flat-out acceleration during side-by-side duels, fiercely claiming track position.',
    badgeBg: 'rgba(51, 65, 85, 0.95)',
    badgeBorder: '#94a3b8',
    badgeText: '#e2e8f0',
  },
  'ai-7': {
    key: 'smooth_operator',
    driverId: 'ai-7',
    driverName: 'Carlo Sainzo',
    driverTag: 'SNZ',
    teamName: 'Scuderia Cavallo',
    number: 55,
    icon: '🧠',
    title: 'Smooth Operator',
    titleTh: 'Cunning Opportunist',
    tagline: 'Calculates every move with racecraft finesse, dodging traffic jams and seizing clear air.',
    skillName: 'SMOOTH UNDERCUT',
    skillNameTh: 'Stealth Traffic Slice',
    skillDescription: 'Reads traffic bottlenecks ahead and switches lanes smoothly to avoid deceleration.',
    badgeBg: 'rgba(133, 77, 14, 0.95)',
    badgeBorder: '#eab308',
    badgeText: '#fef08a',
  },
  'ai-8': {
    key: 'ice_cold',
    driverId: 'ai-8',
    driverName: 'Oskar Pastri',
    driverTag: 'PAS',
    teamName: 'MacLaren Racing',
    number: 81,
    icon: '🧊',
    title: 'Ice Cold',
    titleTh: 'Ice-Cold Iceman',
    tagline: 'Zero panic under pressure, instant collision recovery, and razor-sharp composure.',
    skillName: 'ICE RECOVERY',
    skillNameTh: 'Instant Kinetic Recovery',
    skillDescription: 'Cuts collision stun duration and speed penalty by 50%, returning to race pace instantly.',
    badgeBg: 'rgba(7, 89, 133, 0.95)',
    badgeBorder: '#38bdf8',
    badgeText: '#bae6fd',
  },
  'ai-9': {
    key: 'underdog_raider',
    driverId: 'ai-9',
    driverName: 'Piero Gaslynn',
    driverTag: 'GAS',
    teamName: 'Alpina Blue GP',
    number: 10,
    icon: '🔥',
    title: 'Underdog Raider',
    titleTh: 'Aggressive Booster Raider',
    tagline: 'Eyes locked on speed pads, charging hard into gaps and chaining booster surges.',
    skillName: 'BOOSTER RUSH',
    skillNameTh: 'Speed Pad Target Lock',
    skillDescription: 'Anticipates upcoming booster pads and homes into them with pinpoint accuracy.',
    badgeBg: 'rgba(157, 23, 77, 0.95)',
    badgeBorder: '#ec4899',
    badgeText: '#fbcfe8',
  },
  'ai-10': {
    key: 'straight_line_rocket',
    driverId: 'ai-10',
    driverName: 'Alex Alboon',
    driverTag: 'ABN',
    teamName: 'Wilkins Heritage F1',
    number: 23,
    icon: '🚀',
    title: 'Straight-Line Rocket',
    titleTh: 'Straight-Line Speed Demon',
    tagline: 'Ultra-low aerodynamic drag setup, creating blistering top speed on long straights.',
    skillName: 'STRAIGHT-LINE MISSILE',
    skillNameTh: 'Terminal Velocity Rocket',
    skillDescription: 'Terminal straight-line velocity boosted by +12 km/h while fiercely hugging the inside line.',
    badgeBg: 'rgba(29, 78, 216, 0.95)',
    badgeBorder: '#60a5fa',
    badgeText: '#bfdbfe',
  },
  'ai-11': {
    key: 'veteran_battler',
    driverId: 'ai-11',
    driverName: 'Niko Hulken',
    driverTag: 'HLK',
    teamName: 'Haas Apex Team',
    number: 27,
    icon: '⚓',
    title: 'Veteran Battler',
    titleTh: 'Seasoned Veteran Guardian',
    tagline: 'Consistent lap delivery, rock-steady lines, and unbreakable defense.',
    skillName: 'VETERAN HOLD',
    skillNameTh: 'Master Defensive Line',
    skillDescription: 'Holds an impenetrable racing groove with zero unforced errors or track excursion.',
    badgeBg: 'rgba(71, 85, 105, 0.95)',
    badgeBorder: '#cbd5e1',
    badgeText: '#f8fafc',
  },
};

export function getDriverPersonality(aiIdOrTag: string): DriverPersonalityProfile {
  if (DRIVER_PERSONALITIES[aiIdOrTag]) {
    return DRIVER_PERSONALITIES[aiIdOrTag];
  }
  const byTag = Object.values(DRIVER_PERSONALITIES).find(
    (p) => p.driverTag.toLowerCase() === aiIdOrTag.toLowerCase()
  );
  if (byTag) return byTag;

  // Fallback
  return {
    key: 'tenacious_fighter',
    driverId: aiIdOrTag,
    driverName: 'Challenger Rival',
    driverTag: 'RIV',
    teamName: 'F1 Rival Team',
    number: 99,
    icon: '🏎️',
    title: 'Tenacious Challenger',
    titleTh: 'Feisty Challenger',
    tagline: 'Fierce competitor ready to battle for every point and podium.',
    skillName: 'TACTICAL SPRINT',
    skillNameTh: 'Aggressive Pace Lock',
    skillDescription: 'Hangs on to the racing pack with relentless pace.',
    badgeBg: 'rgba(15, 23, 42, 0.95)',
    badgeBorder: '#94a3b8',
    badgeText: '#e2e8f0',
  };
}
