import React, { useMemo } from 'react';

export interface PersonAvatarProps {
  seed: string;
  role?: 'driver' | 'strategist' | 'pitcrew' | 'scout' | 'academy';
  isTeamDriver?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
  teamPrimaryColor?: string;
  teamSecondaryColor?: string;
  teamName?: string;
}

// Deterministic 32-bit hash function from string
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

// Pseudo random generator with deterministic seed
class PRNG {
  private s: number;
  constructor(seedNumber: number) {
    this.s = seedNumber || 1;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  seed,
  role = 'driver',
  isTeamDriver = false,
  size = 'md',
  className = '',
  style,
  teamPrimaryColor,
  teamSecondaryColor,
  teamName,
}) => {
  // Generate safe sanitized ID for SVG defs to avoid spaces or special character issues
  const safeId = useMemo(() => {
    const hash = hashString(seed || 'racer-apex').toString(36);
    return `av-${hash}`;
  }, [seed]);

  const avatarData = useMemo(() => {
    const prng = new PRNG(hashString(seed || 'racer-apex'));

    const skinTones = [
      { skin: '#ffd8b8', shadow: '#e5b691', lip: '#d28c74' }, // fair
      { skin: '#f5c69d', shadow: '#d89e70', lip: '#bf7656' }, // peach
      { skin: '#e4a572', shadow: '#be7b47', lip: '#9b5832' }, // olive/tan
      { skin: '#c38253', shadow: '#9a5c31', lip: '#7b4020' }, // bronze
      { skin: '#8f522b', shadow: '#6b3715', lip: '#52240b' }, // deep brown
      { skin: '#54301a', shadow: '#391d0d', lip: '#301507' }, // dark ebony
    ];

    const hairColors = [
      { base: '#151515', highlight: '#333333' }, // jet black
      { base: '#362112', highlight: '#553924' }, // dark espresso
      { base: '#613b1f', highlight: '#84542f' }, // chestnut
      { base: '#b58145', highlight: '#dcb073' }, // golden blond
      { base: '#993f1d', highlight: '#c45e33' }, // auburn red
      { base: '#707780', highlight: '#9ba2ab' }, // silver grey
    ];

    // F1 Racing Suits Liveries
    // 1. Player Official Team Suit (customizable per chosen constructor)
    const effectivePrimary = teamPrimaryColor || '#111827';
    const effectiveSecondary = teamSecondaryColor || '#dc2626';
    const effectiveBadge = (teamName ? teamName.split(/\s+/)[0] : 'APEX').slice(0, 5).toUpperCase();

    const playerTeamSuit = {
      primary: effectivePrimary,
      secondary: effectiveSecondary,
      accent: '#ffffff',
      trim: effectiveSecondary,
      collarColor: effectiveSecondary,
      shoulderStrapColor: effectiveSecondary,
      sponsorName: effectiveBadge,
    };

    // 2. Multi-color F1 suits for rival/available/academy drivers
    const rivalDriverSuits = [
      {
        primary: '#1e3a8a', // Cobalt Blue
        secondary: '#0284c7', // Cyan
        accent: '#ffffff',
        trim: '#facc15',
        collarColor: '#1e3a8a',
        shoulderStrapColor: '#0284c7',
        sponsorName: 'VELOX',
      },
      {
        primary: '#064e3b', // British Racing Green
        secondary: '#047857', // Emerald
        accent: '#34d399',
        trim: '#fbbf24',
        collarColor: '#064e3b',
        shoulderStrapColor: '#047857',
        sponsorName: 'AERO',
      },
      {
        primary: '#c2410c', // Papaya Racing
        secondary: '#ea580c', // Bright Orange
        accent: '#ffffff',
        trim: '#38bdf8',
        collarColor: '#ea580c',
        shoulderStrapColor: '#c2410c',
        sponsorName: 'TURBO',
      },
      {
        primary: '#991b1b', // Scuderia Scarlet
        secondary: '#7f1d1d', // Dark Maroon
        accent: '#ffffff',
        trim: '#171717',
        collarColor: '#991b1b',
        shoulderStrapColor: '#ffffff',
        sponsorName: 'CORSA',
      },
      {
        primary: '#334155', // Silver Arrow Slate
        secondary: '#0f766e', // Teal Accent
        accent: '#f8fafc',
        trim: '#2dd4bf',
        collarColor: '#334155',
        shoulderStrapColor: '#0f766e',
        sponsorName: 'SILVER',
      },
      {
        primary: '#854d0e', // Solar Racing
        secondary: '#eab308', // Racing Yellow
        accent: '#ffffff',
        trim: '#000000',
        collarColor: '#eab308',
        shoulderStrapColor: '#000000',
        sponsorName: 'KINETIC',
      },
      {
        primary: '#581c87', // Royal Violet
        secondary: '#7c3aed', // Purple
        accent: '#f472b6',
        trim: '#ffffff',
        collarColor: '#7c3aed',
        shoulderStrapColor: '#581c87',
        sponsorName: 'ZENITH',
      },
      {
        primary: '#0369a1', // Azure Alpine
        secondary: '#e11d48', // Neon Pink
        accent: '#ffffff',
        trim: '#38bdf8',
        collarColor: '#0369a1',
        shoulderStrapColor: '#e11d48',
        sponsorName: 'FLOW',
      },
    ];

    // Non-driver uniforms
    const strategistSuits = [
      { blazer: '#0f172a', shirt: '#f8fafc', tie: '#9333ea' },
      { blazer: '#1e293b', shirt: '#e0f2fe', tie: '#dc2626' },
      { blazer: '#18181b', shirt: '#ffffff', tie: '#f59e0b' },
    ];

    const pitCrewSuits = [
      { polo: '#18181b', hiVis: '#eab308', cap: '#dc2626' },
      { polo: '#0f172a', hiVis: '#22c55e', cap: '#1e293b' },
      { polo: '#1e1b4b', hiVis: '#f97316', cap: '#3b82f6' },
    ];

    const scoutSuits = [
      { jacket: '#334155', lanyard: '#ef4444', badge: '#ffffff' },
      { jacket: '#1e293b', lanyard: '#3b82f6', badge: '#ffffff' },
      { jacket: '#292524', lanyard: '#10b981', badge: '#ffffff' },
    ];

    const skin = prng.pick(skinTones);
    const hair = prng.pick(hairColors);

    // Pick livery based on role & team membership
    const isDriverRole = role === 'driver' || role === 'academy';
    const suit = isDriverRole
      ? (isTeamDriver ? playerTeamSuit : prng.pick(rivalDriverSuits))
      : null;

    const strategistOutfit = role === 'strategist' ? prng.pick(strategistSuits) : null;
    const pitCrewOutfit = role === 'pitcrew' ? prng.pick(pitCrewSuits) : null;
    const scoutOutfit = role === 'scout' ? prng.pick(scoutSuits) : null;

    const hairStyle = prng.range(0, 6);
    const eyeColor = prng.pick(['#2b4c7e', '#3a6639', '#533722', '#1a1a1a']);
    const facialHair = prng.range(0, 4);

    const hasGlasses = role === 'strategist' ? prng.next() > 0.35 : prng.next() > 0.82;
    const hasHeadset = role === 'strategist' || role === 'pitcrew' || prng.next() > 0.7;
    const hasCapOrVisor = role === 'pitcrew' ? true : (isDriverRole ? prng.next() > 0.85 : false);

    return {
      skin,
      hair,
      suit,
      strategistOutfit,
      pitCrewOutfit,
      scoutOutfit,
      hairStyle,
      eyeColor,
      facialHair,
      hasGlasses,
      hasHeadset,
      hasCapOrVisor,
    };
  }, [seed, role, isTeamDriver, teamPrimaryColor, teamSecondaryColor, teamName]);

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }[size];

  const {
    skin,
    hair,
    suit,
    strategistOutfit,
    pitCrewOutfit,
    scoutOutfit,
    hairStyle,
    eyeColor,
    facialHair,
    hasGlasses,
    hasHeadset,
    hasCapOrVisor,
  } = avatarData;

  const isDriverRole = role === 'driver' || role === 'academy';

  return (
    <div
      className={`relative rounded-xl overflow-hidden shrink-0 border border-slate-700/80 bg-gradient-to-b from-[#1a2332] to-[#0c1017] shadow-inner flex items-center justify-center ${sizeClasses} ${className}`}
      style={style}
      title={seed}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`bg-${safeId}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#253246" />
            <stop offset="100%" stopColor="#0b0f16" />
          </radialGradient>

          {suit && (
            <linearGradient id={`suit-${safeId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={suit.primary} />
              <stop offset="100%" stopColor={suit.secondary} />
            </linearGradient>
          )}

          <linearGradient id={`hair-${safeId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hair.highlight} />
            <stop offset="100%" stopColor={hair.base} />
          </linearGradient>
        </defs>

        {/* Studio Lighting Backdrop */}
        <rect width="100" height="100" fill={`url(#bg-${safeId})`} />

        {/* ========================================================================= */}
        {/* BODY & ATTIRE RENDERING */}
        {/* ========================================================================= */}

        {/* 1. F1 RACING SUIT FOR ALL DRIVERS (Team, Available, Academy) */}
        {isDriverRole && suit && (
          <g id="racing-suit">
            {/* Base Racing Suit Torso & Long Sleeves */}
            <path
              d="M 10 100 L 12 84 Q 18 76 34 73 L 50 77 L 66 73 Q 82 76 88 84 L 90 100 Z"
              fill={`url(#suit-${safeId})`}
            />

            {/* Long Sleeve Seams & Athletic Side Panels */}
            <path d="M 27 76 L 22 100" stroke={suit.secondary} strokeWidth="3" opacity="0.9" />
            <path d="M 73 76 L 78 100" stroke={suit.secondary} strokeWidth="3" opacity="0.9" />
            <path d="M 28 76 L 24 100" stroke={suit.accent} strokeWidth="1" opacity="0.8" />
            <path d="M 72 76 L 76 100" stroke={suit.accent} strokeWidth="1" opacity="0.8" />

            {/* High Mandarin Racing Collar */}
            <path
              d="M 36 67 L 50 71 L 64 67 L 65 77 L 50 81 L 35 77 Z"
              fill={suit.collarColor}
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* Stand-up Collar Piping & Neck Flap */}
            <path d="M 37 68 Q 50 72 63 68" stroke={suit.accent} strokeWidth="1.2" fill="none" />
            {/* Collar Velcro Closure Tab */}
            <rect x="50" y="74" width="13" height="4.5" rx="1" fill={suit.secondary} stroke="#0f172a" strokeWidth="0.6" />
            <circle cx="60" cy="76.2" r="1" fill={suit.trim || suit.accent} />

            {/* F1 Extraction Shoulder Straps / Epaulettes */}
            <g id="shoulder-straps">
              {/* Left Epaulette */}
              <rect
                x="17"
                y="74"
                width="13"
                height="6.5"
                rx="1.5"
                fill={suit.shoulderStrapColor}
                stroke="#0f172a"
                strokeWidth="0.8"
                transform="rotate(-12 23 77)"
              />
              <path d="M 18 76 L 28 74" stroke={suit.accent} strokeWidth="1" transform="rotate(-12 23 77)" />
              <path d="M 19 79 L 29 77" stroke={suit.accent} strokeWidth="1" transform="rotate(-12 23 77)" />

              {/* Right Epaulette */}
              <rect
                x="70"
                y="74"
                width="13"
                height="6.5"
                rx="1.5"
                fill={suit.shoulderStrapColor}
                stroke="#0f172a"
                strokeWidth="0.8"
                transform="rotate(12 76 77)"
              />
              <path d="M 72 74 L 82 76" stroke={suit.accent} strokeWidth="1" transform="rotate(12 76 77)" />
              <path d="M 71 77 L 81 79" stroke={suit.accent} strokeWidth="1" transform="rotate(12 76 77)" />
            </g>

            {/* Chest Athletic Chevron / Racing Stripes */}
            <path
              d="M 28 86 L 50 94 L 72 86"
              stroke={suit.secondary}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 30 88 L 50 95 L 70 88"
              stroke={suit.accent}
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />

            {/* Front Center Zipper with Pull Tab */}
            <path d="M 50 81 L 50 100" stroke={suit.accent} strokeWidth="2" strokeDasharray="2 1" />
            <rect x="49" y="81.5" width="2" height="4" rx="0.5" fill="#e2e8f0" stroke="#475569" strokeWidth="0.4" />

            {/* SPONSOR & TEAM BRANDING ON CHEST */}
            {isTeamDriver ? (
              // APEX GRAND PRIX OFFICIAL TEAM BRANDING
              <g id="apex-team-branding">
                {/* Left Chest: Official APEX GP Crest Badge */}
                <rect
                  x="20"
                  y="86"
                  width="18"
                  height="7"
                  rx="1.5"
                  fill="#0b0f17"
                  stroke="#dc2626"
                  strokeWidth="0.8"
                />
                {/* Red Triangle Chevron Logo */}
                <polygon points="23,90.5 25.5,87.5 28,90.5" fill="#dc2626" />
                <text
                  x="30"
                  y="90.8"
                  fill="#ffffff"
                  fontSize="3.4"
                  fontFamily="sans-serif"
                  fontWeight="900"
                  letterSpacing="0.3"
                >
                  APEX
                </text>

                {/* Right Chest: F1 Technical Partner Badges */}
                <rect x="68" y="87" width="13" height="4" rx="1" fill="#ffffff" opacity="0.9" />
                <circle cx="71" cy="89" r="1.3" fill="#dc2626" />
                <rect x="73" y="88.2" width="6.5" height="1.6" fill="#1e293b" />
                <circle cx="83" cy="89" r="2.2" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
              </g>
            ) : (
              // INDEPENDENT / RIVAL F1 SPONSOR PATCHES
              <g id="rival-sponsor-branding">
                {/* Left Chest Sponsor Patch */}
                <rect
                  x="22"
                  y="86"
                  width="16"
                  height="6"
                  rx="1"
                  fill="#ffffff"
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  opacity="0.95"
                />
                <rect x="23" y="87" width="14" height="4" rx="0.5" fill={suit.primary} />
                <text
                  x="30"
                  y="89.8"
                  fill="#ffffff"
                  fontSize="2.6"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {suit.sponsorName}
                </text>

                {/* Right Chest Badge */}
                <circle cx="73" cy="88" r="3.2" fill="#ffffff" opacity="0.9" />
                <circle cx="73" cy="88" r="2.2" fill={suit.secondary} />
                <rect x="65" y="93" width="15" height="2.5" rx="0.5" fill="#ffffff" opacity="0.8" />
              </g>
            )}
          </g>
        )}

        {/* 2. STRATEGIST: FORMAL RACE OPS TEAM SUIT & TIE */}
        {role === 'strategist' && strategistOutfit && (
          <g id="strategist-suit">
            {/* Dark Tactical Team Blazer */}
            <path
              d="M 12 100 L 14 84 Q 18 76 34 74 L 50 78 L 66 74 Q 82 76 86 84 L 88 100 Z"
              fill={strategistOutfit.blazer}
            />
            {/* Crisp Collared Dress Shirt Inside */}
            <polygon points="38,74 50,91 62,74" fill={strategistOutfit.shirt} />
            {/* Dress Shirt Collar Points */}
            <polygon points="38,73 45,81 48,74" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
            <polygon points="62,73 55,81 52,74" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />

            {/* Silk Necktie */}
            <polygon points="48.5,78 51.5,78 52.5,83 47.5,83" fill={strategistOutfit.tie} />
            <polygon points="48,83 52,83 53.5,100 46.5,100" fill={strategistOutfit.tie} />
            {/* Tie Knot Highlight */}
            <circle cx="50" cy="80.5" r="1.2" fill="#ffffff" opacity="0.3" />

            {/* Blazer Lapels */}
            <polygon points="32,74 44,89 36,100 24,84" fill={strategistOutfit.blazer} stroke="#0f172a" strokeWidth="0.8" />
            <polygon points="68,74 56,89 64,100 76,84" fill={strategistOutfit.blazer} stroke="#0f172a" strokeWidth="0.8" />

            {/* Telemetry Lapel Pin / Radio Clip */}
            <rect x="33" y="85" width="2.5" height="5" rx="0.5" fill="#cbd5e1" />
            <circle cx="34.2" cy="86" r="0.8" fill="#22c55e" />
          </g>
        )}

        {/* 3. PIT CREW: MECHANIC WORKWEAR OVERALLS WITH HI-VIS SAFETY STRIPES */}
        {role === 'pitcrew' && pitCrewOutfit && (
          <g id="pitcrew-suit">
            {/* Durable Mechanic Work Polo / Overalls */}
            <path
              d="M 12 100 L 14 84 Q 18 76 34 74 L 50 78 L 66 74 Q 82 76 86 84 L 88 100 Z"
              fill={pitCrewOutfit.polo}
            />
            {/* Work Polo Collar */}
            <path d="M 36 73 L 50 78 L 64 73 L 58 69 L 50 73 L 42 69 Z" fill="#27272a" />

            {/* High-Visibility Reflective Safety Stripe */}
            <path d="M 13 83 Q 50 89 87 83 L 88 88 Q 50 94 12 88 Z" fill={pitCrewOutfit.hiVis} />
            <path d="M 13 85 Q 50 91 87 85" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 1.5" />

            {/* Tool Pocket & Team ID on chest */}
            <rect x="23" y="90" width="14" height="9" rx="1" fill="#27272a" stroke="#3f3f46" strokeWidth="0.6" />
            <rect x="26" y="88" width="8" height="2" fill="#71717a" />
            <circle cx="73" cy="94" r="3" fill="#dc2626" />
            <text x="73" y="95.2" fill="#ffffff" fontSize="3" fontWeight="bold" textAnchor="middle">PIT</text>
          </g>
        )}

        {/* 4. SCOUT: PADDOCK FIELD JACKET & VIP PADDOCK PASS LANYARD */}
        {role === 'scout' && scoutOutfit && (
          <g id="scout-suit">
            {/* Paddock Field Jacket */}
            <path
              d="M 12 100 L 14 84 Q 18 76 34 74 L 50 78 L 66 74 Q 82 76 86 84 L 88 100 Z"
              fill={scoutOutfit.jacket}
            />
            {/* Inner T-shirt */}
            <polygon points="40,74 50,86 60,74" fill="#0f172a" />

            {/* Jacket Collar Flaps */}
            <polygon points="34,74 44,84 38,90 30,78" fill="#1e293b" />
            <polygon points="66,74 56,84 62,90 70,78" fill="#1e293b" />

            {/* VIP Grand Prix Paddock Pass Lanyard */}
            <path d="M 40 74 L 50 88 L 60 74" stroke={scoutOutfit.lanyard} strokeWidth="1.8" fill="none" />
            {/* Lanyard Metal Clip */}
            <rect x="48.5" y="87" width="3" height="3" rx="0.5" fill="#cbd5e1" />
            {/* Paddock Accreditation Badge Card */}
            <rect x="45" y="89" width="10" height="11" rx="1.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.6" />
            <rect x="46.5" y="90.5" width="4" height="4.5" rx="0.5" fill="#0284c7" />
            <rect x="46.5" y="96.5" width="7" height="2" rx="0.3" fill="#ef4444" />
          </g>
        )}

        {/* Neck */}
        <path
          d="M 40 56 L 40 76 Q 50 80 60 76 L 60 56 Z"
          fill={skin.shadow}
        />

        {/* Head / Face Base */}
        <g id="face">
          {/* Ears */}
          <circle cx="28" cy="50" r="6" fill={skin.shadow} />
          <circle cx="72" cy="50" r="6" fill={skin.shadow} />
          <circle cx="28" cy="50" r="3.5" fill={skin.skin} />
          <circle cx="72" cy="50" r="3.5" fill={skin.skin} />

          {/* Jaw & Cheeks */}
          <path
            d="M 30 42 Q 30 68 50 70 Q 70 68 70 42 Q 70 24 50 24 Q 30 24 30 42 Z"
            fill={skin.skin}
          />
          {/* Chin highlight / shadow */}
          <path
            d="M 43 65 Q 50 68 57 65"
            stroke={skin.shadow}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Nose */}
          <path
            d="M 49 46 L 50 54 L 54 54"
            stroke={skin.shadow}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Mouth */}
          <path
            d="M 44 60 Q 50 64 56 60"
            stroke={skin.lip}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes & Eyebrows */}
          {/* Left Eye */}
          <ellipse cx="40" cy="45" rx="4" ry="2.6" fill="#ffffff" />
          <circle cx="41" cy="45" r="1.8" fill={eyeColor} />
          <circle cx="41.7" cy="44.3" r="0.6" fill="#ffffff" />
          <path
            d="M 35 40 Q 40 37 46 40"
            stroke={hair.base}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Eye */}
          <ellipse cx="60" cy="45" rx="4" ry="2.6" fill="#ffffff" />
          <circle cx="59" cy="45" r="1.8" fill={eyeColor} />
          <circle cx="59.7" cy="44.3" r="0.6" fill="#ffffff" />
          <path
            d="M 54 40 Q 60 37 65 40"
            stroke={hair.base}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Facial Hair */}
        {facialHair === 1 && (
          // Stubble
          <path
            d="M 39 57 Q 50 68 61 57 Q 50 72 39 57"
            fill={hair.base}
            opacity="0.25"
          />
        )}
        {facialHair === 2 && (
          // Goatee
          <g opacity="0.8">
            <path d="M 46 62 Q 50 63 54 62" stroke={hair.base} strokeWidth="1.5" />
            <path d="M 47 66 Q 50 70 53 66 Z" fill={hair.base} />
          </g>
        )}
        {facialHair === 3 && (
          // Mustache
          <path
            d="M 42 58 Q 50 56 58 58 Q 50 62 42 58 Z"
            fill={hair.base}
            opacity="0.85"
          />
        )}
        {facialHair === 4 && (
          // Neat trim beard
          <path
            d="M 33 48 Q 32 68 50 72 Q 68 68 67 48 Q 62 67 50 69 Q 38 67 33 48 Z"
            fill={hair.base}
            opacity="0.75"
          />
        )}

        {/* Hairstyles */}
        <g id="hair">
          {hairStyle === 0 && (
            // Short fade / racer cut
            <path
              d="M 28 36 Q 28 20 50 18 Q 72 20 72 36 Q 66 22 50 22 Q 34 22 28 36 Z"
              fill={`url(#hair-${safeId})`}
            />
          )}
          {hairStyle === 1 && (
            // Slicked back pompadour
            <path
              d="M 28 38 Q 26 14 50 13 Q 74 14 72 38 Q 68 18 50 17 Q 32 18 28 38 Z"
              fill={`url(#hair-${safeId})`}
            />
          )}
          {hairStyle === 2 && (
            // Spiky modern cut
            <path
              d="M 28 36 L 33 22 L 40 26 L 47 16 L 54 24 L 62 18 L 68 25 L 72 36 Q 65 24 50 23 Q 35 24 28 36 Z"
              fill={`url(#hair-${safeId})`}
            />
          )}
          {hairStyle === 3 && (
            // Curly / volume
            <g fill={`url(#hair-${safeId})`}>
              <circle cx="34" cy="24" r="9" />
              <circle cx="50" cy="19" r="10" />
              <circle cx="66" cy="24" r="9" />
              <circle cx="28" cy="33" r="7" />
              <circle cx="72" cy="33" r="7" />
            </g>
          )}
          {hairStyle === 4 && (
            // Side parted classic
            <path
              d="M 28 38 Q 28 17 44 16 Q 72 17 72 38 Q 64 22 48 22 Q 32 23 28 38 Z"
              fill={`url(#hair-${safeId})`}
            />
          )}
          {hairStyle === 5 && (
            // Buzz cut
            <path
              d="M 30 38 Q 30 22 50 21 Q 70 22 70 38 Q 66 26 50 25 Q 34 26 30 38 Z"
              fill={hair.base}
              opacity="0.9"
            />
          )}
          {hairStyle === 6 && (
            // Top knot / racer bun
            <g fill={`url(#hair-${safeId})`}>
              <path d="M 28 36 Q 28 20 50 18 Q 72 20 72 36 Q 66 22 50 22 Q 34 22 28 36 Z" />
              <circle cx="50" cy="12" r="6" />
            </g>
          )}
        </g>

        {/* Glasses / Visor */}
        {hasGlasses && (
          <g id="glasses" stroke="#cbd5e1" strokeWidth="1.8" fill="none">
            <rect x="34" y="41" width="13" height="8" rx="2" fill="rgba(148, 163, 184, 0.15)" />
            <rect x="53" y="41" width="13" height="8" rx="2" fill="rgba(148, 163, 184, 0.15)" />
            <path d="M 47 44 L 53 44" />
            <path d="M 34 44 L 27 43" />
            <path d="M 66 44 L 73 43" />
          </g>
        )}

        {/* Trackside Telemetry / Pit Comms Headset */}
        {hasHeadset && (
          <g id="headset">
            {/* Padded Headband */}
            <path
              d="M 25 45 Q 24 16 50 15 Q 76 16 75 45"
              stroke="#0f172a"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Left Ear Cushion */}
            <rect
              x="21"
              y="42"
              width="7"
              height="15"
              rx="3"
              fill={role === 'pitcrew' ? '#eab308' : '#dc2626'}
              stroke="#0f172a"
              strokeWidth="1"
            />
            {/* Right Ear Cushion */}
            <rect
              x="72"
              y="42"
              width="7"
              height="15"
              rx="3"
              fill={role === 'pitcrew' ? '#eab308' : '#dc2626'}
              stroke="#0f172a"
              strokeWidth="1"
            />
            {/* Boom Microphone */}
            <path
              d="M 24 53 Q 22 66 38 67"
              stroke="#475569"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="39" cy="67" r="2.5" fill="#1e293b" />
          </g>
        )}

        {/* Racing Cap for Mechanics / Pit Crew */}
        {hasCapOrVisor && role === 'pitcrew' && pitCrewOutfit && (
          <g id="cap">
            {/* Cap Crown */}
            <path
              d="M 28 32 Q 28 17 50 16 Q 72 17 72 32 Z"
              fill={pitCrewOutfit.cap}
            />
            {/* Visor Brim */}
            <path
              d="M 24 33 Q 50 37 76 33 L 73 29 Q 50 32 27 29 Z"
              fill="#18181b"
              stroke="#0f172a"
              strokeWidth="0.8"
            />
            {/* Apex Racing Crew Emblem on Cap */}
            <circle cx="50" cy="24" r="3.5" fill="#ffffff" opacity="0.9" />
            <polygon points="48,25 50,22 52,25" fill="#dc2626" />
          </g>
        )}

        {/* High-Tech Role Badge */}
        <g id="role-tag" opacity="0.85">
          <circle
            cx="16"
            cy="16"
            r="5"
            fill={isTeamDriver ? '#dc2626' : '#0f172a'}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          <text
            x="16"
            y="19"
            fontSize="6"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
            fill="#ffffff"
          >
            {isTeamDriver
              ? 'APX'
              : role === 'driver'
              ? 'F1'
              : role === 'strategist'
              ? 'AI'
              : role === 'pitcrew'
              ? 'PIT'
              : role === 'academy'
              ? 'AC'
              : 'SC'}
          </text>
        </g>
      </svg>
    </div>
  );
};
