import React from 'react';
import { getTeamAbbreviation } from './TeamLogo';

export interface HeroRaceCarProps {
  primaryColor?: string;
  secondaryColor?: string;
  teamName?: string;
  className?: string;
}

/**
 * Calculates perceived relative luminance of a hex color (0 to 1)
 */
export function getLuminance(hex: string): number {
  if (!hex) return 0.5;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return 0.5;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Adjusts color brightness by percent (-100 to +100)
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  if (!hex) return hex;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return hex;

  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Universal function to render the high-fidelity Hero F1 Race Car SVG
 * fully themed with the active team's primary and secondary colors.
 */
export function renderHeroCar(
  primaryColor: string = '#DC2626',
  secondaryColor: string = '#111827',
  teamName: string = 'APEX GP',
  className: string = ''
): React.ReactElement {
  // Generate deterministic gradient IDs based on colors
  const safeId = `car-${primaryColor.replace('#', '')}-${secondaryColor.replace('#', '')}`;

  // Calculated color shades for sculpted 3D body curvature
  const bodyDark = adjustColorBrightness(primaryColor, -40);
  const bodyMidDark = adjustColorBrightness(primaryColor, -20);
  const bodyBase = primaryColor;
  const bodyLight = adjustColorBrightness(primaryColor, 25);
  const secondaryLight = adjustColorBrightness(secondaryColor, 20);

  // Dynamic high-contrast text color based on primary background
  const isLightBody = getLuminance(primaryColor) > 0.62;
  const decalTextColor = isLightBody ? '#0a0e17' : '#FFFFFF';
  const decalSubTextColor = isLightBody ? '#1e293b' : '#F1F5F9';
  const numberColor = isLightBody ? '#0f172a' : '#FBBF24';

  // Abbreviation / Sponsor decal text on sidepod
  const teamDecal = getTeamAbbreviation(teamName) || 'APEX';

  return (
    <div
      className={`w-full max-w-[480px] relative z-10 select-none ${className}`}
      style={{
        animation: 'heroCarFloat 3.8s ease-in-out infinite',
      }}
    >
      <svg
        viewBox="0 0 540 170"
        className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Dynamic Team Primary Body Livery Gradient */}
          <linearGradient id={`${safeId}-bodyGrad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={bodyDark} />
            <stop offset="40%" stopColor={bodyMidDark} />
            <stop offset="70%" stopColor={bodyBase} />
            <stop offset="85%" stopColor={bodyLight} />
            <stop offset="100%" stopColor={bodyBase} />
          </linearGradient>

          {/* Dynamic Secondary Livery Gradient */}
          <linearGradient id={`${safeId}-secondaryGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondaryLight} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>

          {/* Accent Racing Stripe Gradient */}
          <linearGradient id={`${safeId}-accentDecal`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="50%" stopColor={secondaryLight} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>

          {/* Titanium Cockpit Halo Gradient */}
          <linearGradient id={`${safeId}-haloGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          {/* Ground Shadow Radial Blur */}
          <radialGradient id={`${safeId}-groundShadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.88" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Decal Text Shadow */}
          <filter id={`${safeId}-textShadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor={isLightBody ? '#FFFFFF' : '#000000'} floodOpacity="0.7" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* GROUND SHADOW & TEAM UNDERGLOW REFLECTION                */}
        {/* ======================================================== */}
        <ellipse cx="270" cy="154" rx="220" ry="8" fill={`url(#${safeId}-groundShadow)`} />
        {/* Underbody Venturi glow matching team primary color */}
        <ellipse
          cx="270"
          cy="152"
          rx="140"
          ry="4"
          fill={primaryColor}
          opacity="0.32"
          className="transition-colors duration-500"
        />

        {/* Aerodynamic Speed Lines Behind (Left side) */}
        <g opacity="0.65">
          <line x1="8" y1="55" x2="65" y2="55" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="6 8" />
          <line x1="2" y1="85" x2="75" y2="85" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="8 10" />
          <line x1="14" y1="115" x2="85" y2="115" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 8" />
        </g>

        {/* ======================================================== */}
        {/* REAR WING (Left Side) with DRS Flap                      */}
        {/* ======================================================== */}
        <rect x="52" y="42" width="42" height="9" rx="2" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
        {/* DRS Upper Flap (Themed with Secondary Color) */}
        <rect x="56" y="36" width="36" height="5" rx="1" fill={secondaryColor} stroke={secondaryLight} strokeWidth="0.5" />
        {/* DRS Hydraulic Actuator */}
        <rect x="72" y="34" width="4" height="8" fill="#FFFFFF" />
        {/* Rear Wing Endplate (Themed with Primary + Secondary border) */}
        <polygon
          points="46,30 68,30 63,85 42,85"
          fill={primaryColor}
          stroke={secondaryColor}
          strokeWidth="1.5"
        />
        {/* Swan-neck Pylon Mount */}
        <path d="M 74 48 Q 90 75 106 86" stroke="#0f172a" strokeWidth="4.5" fill="none" strokeLinecap="round" />

        {/* ======================================================== */}
        {/* SHARK FIN & ENGINE COVER (Left to Center)                */}
        {/* ======================================================== */}
        <polygon points="88,78 185,46 195,82 108,88" fill={`url(#${safeId}-bodyGrad)`} />
        {/* Secondary Color & White Spine Racing Decals */}
        <path d="M 105 80 L 180 50" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 115 83 L 182 54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />

        {/* Car Number on Engine Cover */}
        <text
          x="145"
          y="74"
          fill={numberColor}
          fontSize="13"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="900"
          fontStyle="italic"
        >
          #1
        </text>

        {/* ======================================================== */}
        {/* AIRBOX INTAKE & ROLL HOOP                                */}
        {/* ======================================================== */}
        <path d="M 180 46 Q 206 44 218 78 L 175 78 Z" fill={bodyMidDark} stroke={bodyDark} strokeWidth="1" />
        <ellipse cx="198" cy="54" rx="6.5" ry="5.5" fill="#000000" />

        {/* ======================================================== */}
        {/* DRIVER & COCKPIT HALO PROTECTION                        */}
        {/* ======================================================== */}
        {/* Driver Helmet matching team primary */}
        <circle cx="236" cy="67" r="9.5" fill={primaryColor} stroke={secondaryColor} strokeWidth="1.5" />
        <path d="M 236 64 L 244 66 L 243 71 Z" fill="#0f172a" />
        {/* Titanium Halo Structure */}
        <path d="M 215 72 Q 242 58 262 76" stroke={`url(#${safeId}-haloGrad)`} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        {/* Aero Wing Mirror (Primary color) */}
        <rect x="256" y="68" width="6" height="3" rx="1" fill={primaryColor} stroke="#0f172a" strokeWidth="0.5" />

        {/* ======================================================== */}
        {/* MAIN CHASSIS MONOCOQUE & SCULPTED SIDEPOD               */}
        {/* ======================================================== */}
        {/* Carbon Floor & Undercut Venturi Edge */}
        <path d="M 195 86 Q 245 82 295 94 L 285 120 L 185 120 Z" fill="#0f172a" stroke={secondaryColor} strokeWidth="1.5" />
        {/* Main Upper Bodywork (Primary Team Gradient) */}
        <path
          d="M 85 85 L 180 85 Q 260 76 345 92 L 440 120 L 320 120 L 155 122 L 85 112 Z"
          fill={`url(#${safeId}-bodyGrad)`}
        />
        {/* Sweeping Secondary Racing Pinstripe */}
        <path d="M 180 94 Q 240 88 310 102" stroke={secondaryColor} strokeWidth="3" fill="none" />
        {/* White Accent Sponsor Racing Stripe */}
        <path d="M 185 99 Q 245 93 305 106" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.85" />

        {/* Team Sponsor Decal on Sidepod (Readable & Contrast-Safe) */}
        <text
          x="215"
          y="109"
          fill={decalTextColor}
          fontSize="13"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="900"
          letterSpacing="2"
          filter={`url(#${safeId}-textShadow)`}
        >
          {teamDecal}
        </text>

        {/* ======================================================== */}
        {/* TAPERED NOSE CONE & FRONT WING (Right Side)              */}
        {/* ======================================================== */}
        {/* Low Aero Nose Cone */}
        <polygon points="340,92 485,121 445,125 335,116" fill={`url(#${safeId}-bodyGrad)`} />
        {/* Nose Cone Number */}
        <text
          x="410"
          y="116"
          fill={decalSubTextColor}
          fontSize="10"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="900"
          fontStyle="italic"
        >
          #1
        </text>

        {/* Front Wing Mainplane (Themed with Secondary Color) */}
        <polygon points="435,121 498,123 455,126" fill={secondaryColor} />
        {/* Front Aerodynamic Elements & Carbon Flaps */}
        <rect x="445" y="122" width="50" height="4" rx="1" fill="#0f172a" />
        {/* Front Wing Endplate (Primary + Secondary border) */}
        <polygon points="488,110 508,110 502,129 482,129" fill={primaryColor} stroke={secondaryColor} strokeWidth="1" />
        {/* Upper Cascade Flap */}
        <path d="M 458 119 Q 478 115 492 122" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />

        {/* ======================================================== */}
        {/* WHEELS WITH REALISTIC METALLIC FINISH & ROTATING SPOKES  */}
        {/* ======================================================== */}

        {/* Rear Wheel (Left Side, Radius 33) */}
        <g id="hero-rear-wheel">
          <circle cx="135" cy="122" r="33" fill="#0a0f18" stroke="#1e293b" strokeWidth="2.5" />
          {/* Tire rim pinstripe colored with team primary */}
          <circle cx="135" cy="122" r="28" fill="none" stroke={primaryColor} strokeWidth="2" />
          {/* Metallic dark hub */}
          <circle cx="135" cy="122" r="18" fill="#111827" stroke="#334155" strokeWidth="1" />
          {/* Rotating 5-Spoke Alloy Wheel Rim (Glossy Silver) */}
          <g style={{ transformOrigin: '135px 122px', animation: 'heroWheelSpin 3.2s linear infinite' }}>
            <line x1="135" y1="104" x2="135" y2="140" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="117" y1="122" x2="153" y2="122" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="122" y1="109" x2="148" y2="135" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="148" y1="109" x2="122" y2="135" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Central Gold Wheel Nut */}
          <circle cx="135" cy="122" r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
        </g>

        {/* Front Wheel (Right Side, Radius 30) */}
        <g id="hero-front-wheel">
          <circle cx="415" cy="123" r="30" fill="#0a0f18" stroke="#1e293b" strokeWidth="2.5" />
          {/* Tire rim pinstripe colored with team primary */}
          <circle cx="415" cy="123" r="25" fill="none" stroke={primaryColor} strokeWidth="2" />
          {/* Metallic dark hub */}
          <circle cx="415" cy="123" r="16" fill="#111827" stroke="#334155" strokeWidth="1" />
          {/* Rotating 5-Spoke Alloy Wheel Rim (Glossy Silver) */}
          <g style={{ transformOrigin: '415px 123px', animation: 'heroWheelSpin 3.2s linear infinite' }}>
            <line x1="415" y1="107" x2="415" y2="139" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="399" y1="123" x2="431" y2="123" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="403" y1="111" x2="427" y2="135" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="427" y1="111" x2="403" y2="135" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Central Gold Wheel Nut */}
          <circle cx="415" cy="123" r="5.5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

/**
 * React Component wrapper for Hero Race Car
 */
export const HeroRaceCar: React.FC<HeroRaceCarProps> = ({
  primaryColor = '#DC2626',
  secondaryColor = '#111827',
  teamName = 'APEX GP',
  className = '',
}) => {
  return renderHeroCar(primaryColor, secondaryColor, teamName, className);
};
