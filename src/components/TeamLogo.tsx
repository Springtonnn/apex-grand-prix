import React, { useMemo } from 'react';
import { LogoShape } from '../types/game';

export interface TeamLogoProps {
  teamName: string;
  shape?: LogoShape;
  primaryColor?: string;
  secondaryColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export interface LogoShapeOption {
  id: LogoShape;
  name: string;
  subtitle: string;
  description: string;
}

export const LOGO_SHAPE_OPTIONS: LogoShapeOption[] = [
  { id: 'shield', name: 'Shield', subtitle: 'Classic Guard', description: 'Traditional racing shield with speed cuts' },
  { id: 'hexagon', name: 'Hexagon', subtitle: 'Aero Hex', description: 'High-tech angular aerodynamic badge' },
  { id: 'circle-badge', name: 'Circle Badge', subtitle: 'Dual Ring', description: 'Double outer ring with telemetry ticks' },
  { id: 'chevron', name: 'Chevron', subtitle: 'Speed V', description: 'Aggressive racing chevron with sharp cuts' },
  { id: 'diamond', name: 'Diamond', subtitle: 'Facet Gem', description: 'Facet diamond geometry with metallic bevel' },
  { id: 'crest', name: 'Crest', subtitle: 'Royal Crown', description: 'European Grand Prix crowned crest' },
  { id: 'roundel', name: 'Roundel', subtitle: 'Speed Ribbon', description: 'Dual roundel with speed ribbon bar' },
  { id: 'wing-badge', name: 'Wing Badge', subtitle: 'Aero Wing', description: 'Supercar aero wing emblem with central pod' },
];

export const PRESET_TEAM_SHAPES: Record<string, LogoShape> = {
  'stellar-velocity': 'hexagon',
  'Stellar Velocity Racing': 'hexagon',
  'rosso-corsa': 'crest',
  'Rosso Corsa Motorsport': 'crest',
  'bullhorn-energy': 'shield',
  'Bullhorn Energy Racing': 'shield',
  'vortex-papaya': 'chevron',
  'Vortex Papaya Racing': 'chevron',
  'falcon-wing': 'wing-badge',
  'Falcon Wing Racing': 'wing-badge',
  'azure-storm': 'circle-badge',
  'Azure Storm Racing': 'circle-badge',
  'ironclad-racing': 'diamond',
  'Ironclad Racing': 'diamond',
  'thunder-gold': 'roundel',
  'Thunder Gold Motorsport': 'roundel',
  'silverline-racing': 'shield',
  'Silverline Racing': 'shield',
  'crimson-bulls': 'hexagon',
  'Crimson Bulls Racing': 'hexagon',
};

export function getPresetTeamShape(nameOrId: string): LogoShape {
  if (!nameOrId) return 'shield';
  const clean = nameOrId.trim();
  if (PRESET_TEAM_SHAPES[clean]) return PRESET_TEAM_SHAPES[clean];
  const lower = clean.toLowerCase();
  for (const [key, shape] of Object.entries(PRESET_TEAM_SHAPES)) {
    if (key.toLowerCase() === lower) return shape;
  }
  return 'shield';
}

export function getTeamAbbreviation(name: string): string {
  if (!name || !name.trim()) return 'APX';
  const clean = name.trim();
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length >= 3) {
    return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  }
  if (words.length === 2) {
    const w1 = words[0];
    const w2 = words[1];
    return (w1.slice(0, 2) + w2.slice(0, 1)).toUpperCase();
  }
  return clean.slice(0, 3).toUpperCase();
}

/**
 * Universal logo renderer function callable directly or via <TeamLogo />
 */
export function renderTeamLogo({
  shape,
  teamName = 'Apex GP',
  primaryColor = '#DC2626',
  secondaryColor = '#111827',
  size = 'md',
  className = '',
}: {
  shape?: LogoShape;
  teamName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}): React.ReactElement {
  const resolvedShape: LogoShape = shape || getPresetTeamShape(teamName);
  const abbrev = getTeamAbbreviation(teamName);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-11 h-11 text-[13px]',
    lg: 'w-14 h-14 text-[16px]',
    xl: 'w-20 h-20 text-[22px]',
    '2xl': 'w-28 h-28 text-[30px]',
  }[size];

  // Hash code for unique SVG gradient IDs
  let hash = 0;
  const str = `${teamName}-${resolvedShape}-${primaryColor}-${secondaryColor}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const gradId = `logo-grad-${Math.abs(hash).toString(36)}`;

  // Vertical baseline offset for initials per shape
  const textY = {
    shield: 52,
    hexagon: 50,
    'circle-badge': 50,
    chevron: 48,
    diamond: 50,
    crest: 53,
    roundel: 50,
    'wing-badge': 52,
  }[resolvedShape];

  // Font size calculation per abbreviation length
  const fontSize = abbrev.length >= 4 ? 24 : abbrev.length === 3 ? 29 : 34;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-lg select-none transform transition-transform hover:scale-105 ${sizeClasses} ${className}`}
      title={`${teamName} (${resolvedShape})`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full block drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Primary -> Secondary Gradient */}
          <linearGradient id={`${gradId}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>

          {/* Secondary -> Primary Accent Gradient */}
          <linearGradient id={`${gradId}-accent`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.88" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.45" />
          </linearGradient>

          {/* High-End Metallic Sheen on Borders */}
          <linearGradient id={`${gradId}-sheen`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.08" />
          </linearGradient>

          {/* Drop shadow filter for monogram text */}
          <filter id={`${gradId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* 1. SHIELD */}
        {resolvedShape === 'shield' && (
          <g>
            <path
              d="M 50 6 L 88 18 C 88 48 82 76 50 95 C 18 76 12 48 12 18 Z"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <path
              d="M 50 14 L 80 24 C 80 48 74 68 50 85 C 26 68 20 48 20 24 Z"
              fill={`url(#${gradId}-accent)`}
              stroke={secondaryColor}
              strokeWidth="1.5"
              opacity="0.65"
            />
            <path
              d="M 18 44 L 82 24 L 78 33 L 20 52 Z"
              fill="rgba(255, 255, 255, 0.22)"
            />
            <path
              d="M 32 78 L 50 85 L 68 78"
              stroke={primaryColor}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 2. HEXAGON */}
        {resolvedShape === 'hexagon' && (
          <g>
            <polygon
              points="50,6 92,28 92,72 50,94 8,72 8,28"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <polygon
              points="50,15 84,33 84,67 50,85 16,67 16,33"
              fill={`url(#${gradId}-accent)`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <path
              d="M 24 28 L 50 14 L 76 28"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 24 72 L 50 86 L 76 72"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="12" y1="50" x2="88" y2="50"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </g>
        )}

        {/* 3. CIRCLE BADGE */}
        {resolvedShape === 'circle-badge' && (
          <g>
            <circle
              cx="50" cy="50" r="44"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <circle
              cx="50" cy="50" r="39"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <circle
              cx="50" cy="50" r="32"
              fill={`url(#${gradId}-accent)`}
              stroke={secondaryColor}
              strokeWidth="2"
              opacity="0.8"
            />
            <line x1="50" y1="7" x2="50" y2="14" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="86" x2="50" y2="93" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="7" y1="50" x2="14" y2="50" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="86" y1="50" x2="93" y2="50" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {/* 4. CHEVRON */}
        {resolvedShape === 'chevron' && (
          <g>
            <polygon
              points="50,4 94,30 80,92 50,98 20,92 6,30"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <polygon
              points="50,15 82,36 70,82 50,87 30,82 18,36"
              fill={`url(#${gradId}-accent)`}
              stroke={secondaryColor}
              strokeWidth="1.5"
              opacity="0.65"
            />
            <path
              d="M 12 36 L 50 56 L 88 36"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 25 81 L 50 90 L 75 81"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 5. DIAMOND */}
        {resolvedShape === 'diamond' && (
          <g>
            <polygon
              points="50,4 96,50 50,96 4,50"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <polygon
              points="50,4 50,96 96,50"
              fill="rgba(255, 255, 255, 0.08)"
            />
            <polygon
              points="50,17 83,50 50,83 17,50"
              fill={`url(#${gradId}-accent)`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <path
              d="M 30 50 L 50 30 L 70 50 L 50 70 Z"
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
            />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </g>
        )}

        {/* 6. CREST */}
        {resolvedShape === 'crest' && (
          <g>
            <path
              d="M 10 20 L 28 10 L 50 18 L 72 10 L 90 20 L 90 48 C 90 74 70 88 50 96 C 30 88 10 74 10 48 Z"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <path
              d="M 18 26 L 32 18 L 50 24 L 68 18 L 82 26 L 82 48 C 82 68 66 80 50 87 C 34 80 18 68 18 48 Z"
              fill={`url(#${gradId}-accent)`}
              stroke={secondaryColor}
              strokeWidth="1.5"
              opacity="0.65"
            />
            <path
              d="M 26 32 C 38 37 62 37 74 32"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 36 76 C 44 82 56 82 64 76"
              fill="none"
              stroke={primaryColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 7. ROUNDEL */}
        {resolvedShape === 'roundel' && (
          <g>
            <circle
              cx="50" cy="50" r="45"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <circle
              cx="50" cy="50" r="37"
              fill={`url(#${gradId}-accent)`}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              opacity="0.75"
            />
            <rect
              x="4" y="37" width="92" height="26" rx="4"
              fill={secondaryColor}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="1.5"
              opacity="0.95"
            />
            <line x1="4" y1="41" x2="96" y2="41" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
            <line x1="4" y1="59" x2="96" y2="59" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
          </g>
        )}

        {/* 8. WING BADGE */}
        {resolvedShape === 'wing-badge' && (
          <g>
            <path
              d="M 50 24 C 68 24 84 16 97 10 C 95 34 82 56 50 86 C 18 56 5 34 3 10 C 16 16 32 24 50 24 Z"
              fill={`url(#${gradId}-bg)`}
              stroke={`url(#${gradId}-sheen)`}
              strokeWidth="3"
            />
            <path
              d="M 12 26 C 26 34 40 40 50 42 C 60 40 74 34 88 26"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="2"
            />
            <path
              d="M 22 42 C 32 48 42 54 50 56 C 58 54 68 48 78 42"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.5"
            />
            <path
              d="M 50 28 L 68 38 L 62 68 L 50 78 L 38 68 L 32 38 Z"
              fill={`url(#${gradId}-accent)`}
              stroke={secondaryColor}
              strokeWidth="2"
              opacity="0.92"
            />
          </g>
        )}

        {/* Team Monogram / Abbreviation */}
        <text
          x="50"
          y={textY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFFFFF"
          fontFamily="'Rajdhani', 'Chakra Petch', sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize={fontSize}
          letterSpacing="0.05em"
          filter={`url(#${gradId}-shadow)`}
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.85)' }}
        >
          {abbrev}
        </text>
      </svg>
    </div>
  );
}

/**
 * React Component Wrapper around renderTeamLogo
 */
export const TeamLogo: React.FC<TeamLogoProps> = (props) => {
  return renderTeamLogo(props);
};
