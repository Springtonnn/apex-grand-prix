import React from 'react';

export interface CircuitAtmosphereItem {
  round: number;
  name: string;
  circuitName: string;
  city: string;
  country: string;
  flag: string;
  continent: string;
  primaryAccent: string;
  secondaryAccent: string;
  trackType: string;
  renderArtwork: () => React.ReactNode;
}

export const CIRCUITS_PART_1: CircuitAtmosphereItem[] = [
  // =========================================================================
  // 1. MELBOURNE, AUSTRALIA - ALBERT PARK CIRCUIT
  // =========================================================================
  {
    round: 1,
    name: 'Australian Grand Prix',
    circuitName: 'Albert Park Circuit',
    city: 'Melbourne',
    country: 'Australia',
    flag: '🇦🇺',
    continent: 'Oceania',
    primaryAccent: '#0d9488',
    secondaryAccent: '#14b8a6',
    trackType: 'Street / Park Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="melSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02070a" />
            <stop offset="45%" stopColor="#04161a" />
            <stop offset="75%" stopColor="#082326" />
            <stop offset="100%" stopColor="#02090c" />
          </linearGradient>
          <linearGradient id="melWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#062226" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#031518" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#010608" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="melEurekaGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <pattern id="melWindowGrid" width="6" height="10" patternUnits="userSpaceOnUse">
            <rect width="2" height="4" fill="#5eead4" opacity="0.3" />
            <rect x="3" width="2" height="4" fill="#14b8a6" opacity="0.15" />
          </pattern>
          <pattern id="melWaterCaustics" width="80" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,4 Q20,1 40,4 T80,4" fill="none" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.18" />
          </pattern>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#melSky)" />

        {/* Southern Cross Constellation */}
        <g opacity="0.75">
          <circle cx="210" cy="95" r="1.8" fill="#ffffff" />
          <circle cx="280" cy="65" r="1.5" fill="#ffffff" />
          <circle cx="340" cy="115" r="2.2" fill="#5eead4" />
          <circle cx="260" cy="155" r="1.9" fill="#ffffff" />
          <circle cx="270" cy="120" r="1.1" fill="#ffffff" />
          {/* Pointer stars */}
          <circle cx="430" cy="140" r="2.4" fill="#ffffff" />
          <circle cx="490" cy="165" r="2.0" fill="#2dd4bf" />
        </g>

        {/* Distant Melbourne Skyline Silhouette Layer (Background Depth) */}
        <path
          d="M0,460 L0,360 L35,360 L35,330 L65,330 L65,370 L110,370 L110,310 L145,310 L145,350 L190,350 L190,290 L220,290 L220,240 L245,240 L245,340 L310,340 L310,270 L345,270 L345,330 L400,330 L400,280 L440,280 L440,350 L500,350 L500,310 L540,310 L540,340 L600,340 L600,260 L640,260 L640,350 L710,350 L710,300 L760,300 L760,340 L820,340 L820,280 L860,280 L860,330 L930,330 L930,300 L970,300 L970,350 L1050,350 L1050,290 L1090,290 L1090,340 L1160,340 L1160,310 L1210,310 L1210,350 L1290,350 L1290,280 L1340,280 L1340,340 L1440,340 L1440,460 Z"
          fill="#030d12"
          opacity="0.8"
        />

        {/* Detailed Iconic Melbourne Landmarks (Midground Architecture) */}
        {/* 1. Rialto Towers (525 Collins St - Twin interlocking faceted towers) */}
        <g transform="translate(180, 180)">
          <path d="M0,260 L0,80 L35,60 L35,260 Z" fill="#061920" stroke="#0d9488" strokeWidth="1" />
          <path d="M35,260 L35,30 L65,15 L65,260 Z" fill="#08222c" stroke="#14b8a6" strokeWidth="1.2" />
          <rect x="5" y="85" width="25" height="170" fill="url(#melWindowGrid)" />
          <rect x="40" y="35" width="20" height="220" fill="url(#melWindowGrid)" />
          <line x1="50" y1="15" x2="50" y2="0" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="50" cy="0" r="2" fill="#ef4444" />
        </g>

        {/* 2. 120 Collins Street (Gothic Pyramid Spire & 4 Lateral Pylons) */}
        <g transform="translate(300, 140)">
          <path d="M0,300 L0,110 L10,110 L10,70 L25,40 L40,70 L40,110 L50,110 L50,300 Z" fill="#04161d" stroke="#0d9488" strokeWidth="1" />
          <polygon points="12,70 25,20 38,70" fill="#0a2c38" stroke="#2dd4bf" strokeWidth="1" />
          <line x1="25" y1="20" x2="25" y2="-15" stroke="#5eead4" strokeWidth="2" />
          <circle cx="25" cy="-15" r="2.5" fill="#f59e0b" />
          <rect x="8" y="120" width="34" height="170" fill="url(#melWindowGrid)" opacity="0.8" />
        </g>

        {/* 3. Eureka Tower (Southbank - 297m Landmark with Gold Crown & Red Rebel Stripe) */}
        <g transform="translate(420, 80)">
          {/* Main Tower Core with Articulated Setbacks */}
          <path
            d="M0,360 L0,120 L8,120 L8,80 L18,80 L18,40 L45,40 L45,80 L55,80 L55,120 L62,120 L62,360 Z"
            fill="#051c24"
            stroke="#14b8a6"
            strokeWidth="1.4"
          />
          {/* Faceted 24-Carat Gold Crown Glass Penthouse */}
          <polygon points="18,40 28,10 45,10 45,40" fill="url(#melEurekaGold)" stroke="#fbbf24" strokeWidth="1.2" />
          <polygon points="28,10 37,2 45,2 45,10" fill="#fef08a" opacity="0.9" />
          {/* Eureka Stockade Red Line running down tower */}
          <line x1="45" y1="40" x2="45" y2="350" stroke="#ef4444" strokeWidth="3" opacity="0.9" />
          {/* Communications Mast & Warning Light */}
          <line x1="37" y1="2" x2="37" y2="-35" stroke="#f8fafc" strokeWidth="2.5" />
          <circle cx="37" cy="-35" r="3" fill="#dc2626" />
          <circle cx="37" cy="-35" r="8" fill="#dc2626" opacity="0.25" />
          {/* Window Apertures Matrix */}
          <rect x="6" y="130" width="48" height="220" fill="url(#melWindowGrid)" opacity="0.95" />
        </g>

        {/* 4. Bolte Bridge Cable-Stayed Pylons (Docklands) */}
        <g transform="translate(740, 200)">
          {/* West Pylon (140m hollow silver column) */}
          <path d="M0,240 L10,30 L22,30 L32,240 Z" fill="#08232c" stroke="#2dd4bf" strokeWidth="1.2" />
          {/* East Pylon */}
          <path d="M70,240 L80,30 L92,30 L102,240 Z" fill="#08232c" stroke="#2dd4bf" strokeWidth="1.2" />
          {/* Red beacon lights on bridge tips */}
          <circle cx="16" cy="28" r="2.5" fill="#ef4444" />
          <circle cx="86" cy="28" r="2.5" fill="#ef4444" />
          {/* Radiating Stay Cables */}
          {[60, 90, 120, 150, 180, 210].map((cy, i) => (
            <g key={i}>
              <line x1="16" y1="35" x2={-40 + i * 15} y2="240" stroke="#5eead4" strokeWidth="1" opacity="0.45" />
              <line x1="86" y1="35" x2={60 + i * 15} y2="240" stroke="#5eead4" strokeWidth="1" opacity="0.45" />
            </g>
          ))}
          {/* Bridge Deck with Road Lights */}
          <rect x="-60" y="235" width="240" height="8" fill="#041217" stroke="#14b8a6" strokeWidth="1" />
          <line x1="-60" y1="236" x2="180" y2="236" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.75" />
        </g>

        {/* 5. Victorian Arts Centre Spire (Open-work steel lattice tower) */}
        <g transform="translate(630, 170)">
          <path d="M18,270 L26,70 L30,10 L34,70 L42,270" fill="none" stroke="#2dd4bf" strokeWidth="2.5" />
          {/* Lattice Cross-Bracing Rings */}
          {[20, 50, 90, 140, 190, 240].map((y, idx) => (
            <ellipse key={idx} cx="30" cy={y} rx={5 + idx * 2.4} ry={2 + idx * 0.8} fill="none" stroke="#5eead4" strokeWidth="1.5" opacity="0.8" />
          ))}
          <circle cx="30" cy="8" r="3" fill="#fef08a" />
        </g>

        {/* Albert Park Lake (High-detail water body with realistic reflection caustics) */}
        <ellipse cx="720" cy="530" rx="800" ry="140" fill="url(#melWater)" />
        <rect x="0" y="440" width="1440" height="160" fill="url(#melWaterCaustics)" opacity="0.9" />

        {/* Waterfront Promenade & Palm Trees with Detailed Fan Fronds */}
        <g fill="#020e12" stroke="#041b22" strokeWidth="1">
          {/* Palm 1 */}
          <path d="M120,540 Q130,440 148,390" fill="none" stroke="#020e12" strokeWidth="8" strokeLinecap="round" />
          <path d="M148,390 C120,380 90,395 70,410 C100,390 130,388 148,390 Z" fill="#03161c" />
          <path d="M148,390 C130,370 100,365 80,375 C110,368 135,375 148,390 Z" fill="#03161c" />
          <path d="M148,390 C160,365 190,360 215,370 C185,365 162,375 148,390 Z" fill="#03161c" />
          <path d="M148,390 C175,380 205,390 225,410 C195,392 168,390 148,390 Z" fill="#03161c" />

          {/* Palm 2 */}
          <path d="M1280,550 Q1265,450 1245,400" fill="none" stroke="#020e12" strokeWidth="8" strokeLinecap="round" />
          <path d="M1245,400 C1270,390 1300,405 1320,420 C1290,400 1260,398 1245,400 Z" fill="#03161c" />
          <path d="M1245,400 C1260,380 1290,375 1310,385 C1280,378 1255,385 1245,400 Z" fill="#03161c" />
          <path d="M1245,400 C1230,375 1200,370 1175,380 C1205,375 1228,385 1245,400 Z" fill="#03161c" />
          <path d="M1245,400 C1220,390 1190,400 1170,420 C1200,402 1225,400 1245,400 Z" fill="#03161c" />
        </g>

        {/* Albert Park Grand Prix Asphalt Track Ribbon with FIA 3D Serrated Curb */}
        <g>
          {/* Asphalt Surface */}
          <path
            d="M-50,680 C320,590 620,620 950,570 C1180,535 1360,590 1490,570"
            fill="none"
            stroke="#050d12"
            strokeWidth="90"
          />
          {/* Inner Asphalt Edge */}
          <path
            d="M-50,680 C320,590 620,620 950,570 C1180,535 1360,590 1490,570"
            fill="none"
            stroke="#0d9488"
            strokeWidth="2"
            opacity="0.35"
          />
          {/* FIA Red and White 3D Serrated Curb Profile */}
          <path
            d="M720,580 C880,560 1060,545 1220,555"
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
          />
          <path
            d="M720,580 C880,560 1060,545 1220,555"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeDasharray="20 20"
          />
          {/* FIA Track Safety Barrier & Mesh Catch Fence */}
          <path
            d="M710,565 C870,545 1050,530 1210,540"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
          />
          {[750, 830, 910, 990, 1070, 1150].map((px) => (
            <line key={px} x1={px} y1="560" x2={px} y2="520" stroke="#334155" strokeWidth="2.5" />
          ))}
          {/* Track Marshal Post Digital Flag Display */}
          <rect x="990" y="500" width="28" height="18" rx="3" fill="#020617" stroke="#475569" strokeWidth="1.5" />
          <rect x="993" y="503" width="22" height="12" rx="1" fill="#10b981" />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 2. SUZUKA, JAPAN - SUZUKA INTERNATIONAL RACING COURSE
  // =========================================================================
  {
    round: 2,
    name: 'Japanese Grand Prix',
    circuitName: 'Suzuka International Racing Course',
    city: 'Suzuka',
    country: 'Japan',
    flag: '🇯🇵',
    continent: 'Asia',
    primaryAccent: '#e11d48',
    secondaryAccent: '#fb7185',
    trackType: 'Figure-8 Heritage Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="szkSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080205" />
            <stop offset="50%" stopColor="#19040d" />
            <stop offset="85%" stopColor="#2a0815" />
            <stop offset="100%" stopColor="#070205" />
          </linearGradient>
          <radialGradient id="fujiVolcanoGlow" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#881337" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fujiSnowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#9f1239" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#szkSky)" />
        <ellipse cx="620" cy="340" rx="460" ry="320" fill="url(#fujiVolcanoGlow)" />

        {/* Majestic Mount Fuji with Authentic Volcanic Ridges and Hoei Crater */}
        <g transform="translate(180, 110)">
          {/* Main Volcanic Silhouette with natural erosion contours */}
          <path
            d="M-40,490 C120,440 260,340 370,180 C400,135 425,120 445,120 C455,122 470,123 480,120 C500,120 525,135 555,180 C665,340 805,440 965,490 Z"
            fill="#0f0308"
            stroke="#4c0519"
            strokeWidth="1.5"
          />
          {/* Crater Rim Profile (Notched Summit with Hoei Crater Vent) */}
          <path
            d="M425,120 L440,126 L455,122 L468,128 L482,121 L500,120"
            fill="none"
            stroke="#fb7185"
            strokeWidth="2"
          />
          {/* Hoei Crater (lateral volcanic hump on south-east flank) */}
          <path d="M720,380 C745,365 765,375 790,410" fill="none" stroke="#e11d48" strokeWidth="2" opacity="0.6" />

          {/* Intricate Snow Fluting and Glacial Gullies on Fuji Summit */}
          <path
            d="M425,120 L445,120 L460,123 L480,120 L500,120 
               C520,150 540,195 560,250 L535,225 L525,270 L505,230 L495,290 L480,220 L465,300 L450,225 L435,280 L420,220 L395,260 
               C405,200 415,150 425,120 Z"
            fill="url(#fujiSnowGrad)"
            opacity="0.92"
          />
          {/* Secondary branching ice crevasses */}
          <path d="M465,300 L460,360 L450,400" fill="none" stroke="#fecdd3" strokeWidth="1.5" opacity="0.75" />
          <path d="M495,290 L510,350 L525,390" fill="none" stroke="#fecdd3" strokeWidth="1.4" opacity="0.75" />
          <path d="M435,280 L425,340 L410,380" fill="none" stroke="#fecdd3" strokeWidth="1.2" opacity="0.6" />
        </g>

        {/* Foothills with Layered Japanese Cedar and Pine Silhouettes */}
        <g fill="#080206" opacity="0.95">
          <path d="M0,600 Q200,480 440,530 Q700,580 960,510 Q1200,460 1440,580 L1440,810 L0,810 Z" />
          {/* Pine tree spires on ridge */}
          {[120, 160, 210, 260, 310, 360, 420, 780, 830, 880, 940, 990, 1060].map((tx) => (
            <polygon key={tx} points={`${tx},520 ${tx + 6},500 ${tx + 12},520`} fill="#040103" />
          ))}
        </g>

        {/* Suzuka Iconic 50-Meter Giant Ferris Wheel (Intricate Dual-Rim Truss & 24 Cabins) */}
        <g transform="translate(1120, 330)">
          {/* Heavy Inverted-V Lattice Support Legs with Cross Struts */}
          <line x1="0" y1="0" x2="-85" y2="240" stroke="#be123c" strokeWidth="7" />
          <line x1="0" y1="0" x2="85" y2="240" stroke="#be123c" strokeWidth="7" />
          <line x1="-42" y1="120" x2="42" y2="120" stroke="#fda4af" strokeWidth="3" />
          <line x1="-63" y1="180" x2="63" y2="180" stroke="#fda4af" strokeWidth="3" />
          <line x1="-21" y1="60" x2="21" y2="60" stroke="#fda4af" strokeWidth="2.5" />

          {/* Outer Wheel Truss Ring & Inner Structural Ring */}
          <circle cx="0" cy="0" r="165" fill="none" stroke="#e11d48" strokeWidth="6" />
          <circle cx="0" cy="0" r="145" fill="none" stroke="#fb7185" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="125" fill="none" stroke="#e11d48" strokeWidth="3.5" />
          {/* Zig-zag truss bracing between rims */}
          <circle cx="0" cy="0" r="145" fill="none" stroke="#fda4af" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.8" />

          {/* Heavy Central Planetary Drive Hub */}
          <circle cx="0" cy="0" r="30" fill="#4c0519" stroke="#fda4af" strokeWidth="4" />
          <circle cx="0" cy="0" r="14" fill="#be123c" stroke="#fff" strokeWidth="2" />

          {/* 24 Radial Cable Spokes with Articulated Observation Pods */}
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = Math.cos(rad) * 165;
            const y1 = Math.sin(rad) * 165;
            const x2 = Math.cos(rad) * 30;
            const y2 = Math.sin(rad) * 30;
            return (
              <g key={deg}>
                <line x1={x2} y1={y2} x2={x1} y2={y1} stroke="#fda4af" strokeWidth="1.6" opacity="0.75" />
                {/* Cabin Gondola with Capsule Window */}
                <rect
                  x={x1 - 6}
                  y={y1 - 6}
                  width="12"
                  height="14"
                  rx="3"
                  fill="#881337"
                  stroke="#fb7185"
                  strokeWidth="1.2"
                />
                <circle cx={x1} cy={y1} r="2.2" fill="#fef08a" opacity="0.95" />
              </g>
            );
          })}
        </g>

        {/* Traditional 5-Tier Japanese Pagoda (Suzuka Circuit Park Heritage) */}
        <g transform="translate(180, 380)">
          {/* Vertical Pagoda Spire (Sorin 9 Sacred Rings) */}
          <line x1="0" y1="-80" x2="0" y2="0" stroke="#fb7185" strokeWidth="3" />
          {[ -70, -62, -54, -46, -38, -30, -22, -14, -6 ].map((sy, i) => (
            <ellipse key={i} cx="0" cy={sy} rx={3.5 + i * 0.4} ry="1.2" fill="#fef08a" />
          ))}
          <circle cx="0" cy="-82" r="3.5" fill="#fef08a" />

          {/* 5 Distinct Tiers with Swept Flared Eaves (Taruki rafter corbels) */}
          {[
            { w: 32, h: 18, y: 0, eaves: 46 },
            { w: 38, h: 22, y: 22, eaves: 56 },
            { w: 44, h: 26, y: 48, eaves: 68 },
            { w: 50, h: 30, y: 78, eaves: 80 },
            { w: 58, h: 36, y: 112, eaves: 94 },
          ].map((tier, idx) => (
            <g key={idx} transform={`translate(0, ${tier.y})`}>
              {/* Wooden Balustrade & Core */}
              <rect x={-tier.w / 2} y="8" width={tier.w} height={tier.h} fill="#2a0815" stroke="#be123c" strokeWidth="1" />
              {/* Japanese Flared Swept Curved Eaves */}
              <path
                d={`M${-tier.eaves / 2},8 Q${-tier.eaves / 3},0 0,0 Q${tier.eaves / 3},0 ${tier.eaves / 2},8 L${tier.eaves / 2 - 4},12 Q0,6 ${-tier.eaves / 2 + 4},12 Z`}
                fill="#4c0519"
                stroke="#fda4af"
                strokeWidth="1.2"
              />
            </g>
          ))}
          {/* Stone Base Platform */}
          <polygon points="-55,160 55,160 65,190 -65,190" fill="#18040d" stroke="#881337" strokeWidth="1.5" />
        </g>

        {/* Suzuka Figure-8 Overpass Bridge Track Ribbon & Degner Kerbs */}
        <g>
          {/* Track Roadbed */}
          <path
            d="M-50,650 C260,560 520,680 820,580 C1080,490 1280,560 1490,530"
            fill="none"
            stroke="#0a0306"
            strokeWidth="80"
          />
          {/* FIA Red and White Curbs */}
          <path
            d="M480,630 C640,650 780,620 920,570"
            fill="none"
            stroke="#e11d48"
            strokeWidth="10"
          />
          <path
            d="M480,630 C640,650 780,620 920,570"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 3. SINGAPORE - MARINA BAY STREET CIRCUIT
  // =========================================================================
  {
    round: 3,
    name: 'Singapore Grand Prix',
    circuitName: 'Marina Bay Street Circuit',
    city: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    continent: 'Asia',
    primaryAccent: '#a855f7',
    secondaryAccent: '#c084fc',
    trackType: 'Night Street Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="sgSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040108" />
            <stop offset="45%" stopColor="#120421" />
            <stop offset="85%" stopColor="#1e0638" />
            <stop offset="100%" stopColor="#05010a" />
          </linearGradient>
          <linearGradient id="sgWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#130424" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#030005" stopOpacity="1" />
          </linearGradient>
          <pattern id="sgFacadeWindows" width="8" height="6" patternUnits="userSpaceOnUse">
            <rect width="3" height="2" fill="#fef08a" opacity="0.65" />
            <rect x="4" width="3" height="2" fill="#c084fc" opacity="0.4" />
          </pattern>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#sgSky)" />

        {/* Marina Bay Sands 3 Iconic Curved Towers & Cantilever SkyPark */}
        <g transform="translate(240, 110)">
          {/* Tower 1 (West - Tapered Outward Flare) */}
          <path
            d="M30,360 L50,110 L95,110 L105,360 Z"
            fill="#16062a"
            stroke="#a855f7"
            strokeWidth="1.2"
          />
          <rect x="52" y="115" width="40" height="235" fill="url(#sgFacadeWindows)" />

          {/* Tower 2 (Center - Straight Column with Interior Atrium Canyon) */}
          <path
            d="M140,360 L145,100 L195,100 L200,360 Z"
            fill="#1a0733"
            stroke="#c084fc"
            strokeWidth="1.4"
          />
          <rect x="148" y="105" width="44" height="245" fill="url(#sgFacadeWindows)" />

          {/* Tower 3 (East - Tapered Outward Flare) */}
          <path
            d="M235,360 L245,110 L290,110 L310,360 Z"
            fill="#16062a"
            stroke="#a855f7"
            strokeWidth="1.2"
          />
          <rect x="248" y="115" width="40" height="235" fill="url(#sgFacadeWindows)" />

          {/* 340-Meter SkyPark Cantilevered Surfboard Ship Hull */}
          <path
            d="M5,105 C75,70 180,68 340,90 C395,98 440,110 455,115 C440,128 360,132 5,124 Z"
            fill="#3b0764"
            stroke="#fef08a"
            strokeWidth="2"
          />
          {/* Cantilever Prow Observation Deck Railing (65-meter overhang) */}
          <path d="M335,90 L450,114" stroke="#67e8f9" strokeWidth="2.5" />
          {/* World-Famous 150m Infinity Pool Glowing Water Edge */}
          <line x1="45" y1="88" x2="310" y2="82" stroke="#38bdf8" strokeWidth="3" opacity="0.95" />
          <line x1="45" y1="88" x2="310" y2="82" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          {/* Tropical Palm Trees along SkyPark Deck */}
          {[60, 95, 130, 165, 200, 235, 270, 305].map((px) => (
            <circle key={px} cx={px} cy="82" r="3.5" fill="#10b981" opacity="0.8" />
          ))}
        </g>

        {/* Gardens by the Bay - Giant Futuristic Supertrees (Organic Trumpet Trunks) */}
        <g transform="translate(860, 190)">
          {/* Supertree 1 (Center 50-meter Giant) */}
          <path
            d="M130,360 C128,260 115,190 90,140 C110,120 150,120 170,140 C145,190 132,260 130,360 Z"
            fill="#2e0854"
            stroke="#d8b4fe"
            strokeWidth="2"
          />
          {/* Radial Inverted Conical Canopy Ribs */}
          <ellipse cx="130" cy="120" rx="90" ry="24" fill="none" stroke="#f472b6" strokeWidth="2.5" />
          <ellipse cx="130" cy="120" rx="65" ry="16" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="6 6" />
          {/* Kinetic Branching Fern Vines */}
          {[40, 70, 100, 130, 160, 190, 220].map((bx, i) => (
            <line key={i} x1="130" y1="140" x2={bx} y2="105" stroke="#f472b6" strokeWidth="1.8" opacity="0.8" />
          ))}

          {/* Supertree 2 (East 35-meter Tree) */}
          <path
            d="M270,360 C268,280 258,220 235,180 C250,165 290,165 305,180 C282,220 272,280 270,360 Z"
            fill="#1f0538"
            stroke="#a855f7"
            strokeWidth="1.8"
          />
          <ellipse cx="270" cy="165" rx="65" ry="18" fill="none" stroke="#c084fc" strokeWidth="2" />
          {[195, 225, 255, 285, 315, 345].map((bx, i) => (
            <line key={i} x1="270" y1="180" x2={bx} y2="150" stroke="#e879f9" strokeWidth="1.5" opacity="0.75" />
          ))}

          {/* OCBC Skyway Suspended Aerial Walkway between Supertrees */}
          <path
            d="M130,220 C180,245 220,240 270,230"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          {/* Vertical Tension Suspension Cables */}
          {[160, 190, 220, 245].map((sx, i) => (
            <line key={i} x1={sx} y1="135" x2={sx} y2="238" stroke="#7dd3fc" strokeWidth="1" opacity="0.6" />
          ))}
        </g>

        {/* Singapore Flyer (Giant 165m Observation Wheel in Far Distance) */}
        <g transform="translate(1320, 240)" opacity="0.6">
          <circle cx="0" cy="0" r="110" fill="none" stroke="#a855f7" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="18" fill="#1e0638" stroke="#c084fc" strokeWidth="2" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line key={deg} x1="0" y1="0" x2={Math.cos(rad) * 110} y2={Math.sin(rad) * 110} stroke="#d8b4fe" strokeWidth="1" />
            );
          })}
        </g>

        {/* Marina Bay Night Water Basin with Shimmering Light Caustics */}
        <ellipse cx="720" cy="540" rx="800" ry="130" fill="url(#sgWaterGrad)" />

        {/* Official 2,000-Lux Night Grand Prix Floodlight Gantries */}
        {[100, 340, 580, 820, 1060, 1300].map((lx) => (
          <g key={lx} opacity="0.95">
            {/* Structural Steel Lattice Mast */}
            <line x1={lx} y1="360" x2={lx} y2="550" stroke="#334155" strokeWidth="4.5" />
            <line x1={lx - 12} y1="550" x2={lx} y2="400" stroke="#475569" strokeWidth="2" />
            <line x1={lx + 12} y1="550" x2={lx} y2="400" stroke="#475569" strokeWidth="2" />
            {/* Angled 16-LED Floodlight Bank Head */}
            <polygon
              points={`${lx - 24},350 ${lx + 24},350 ${lx + 18},364 ${lx - 18},364`}
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="1.5"
            />
            {/* Volumetric Downward Light Cone */}
            <polygon
              points={`${lx - 20},364 ${lx + 20},364 ${lx + 120},640 ${lx - 120},640`}
              fill="#fef08a"
              opacity="0.04"
            />
          </g>
        ))}

        {/* Marina Bay Street Circuit Road Ribbon with Cyan & White Kerbing */}
        <g>
          <path
            d="M-50,680 C340,580 640,640 980,570 C1220,520 1380,580 1490,560"
            fill="none"
            stroke="#050108"
            strokeWidth="85"
          />
          <path
            d="M520,615 C720,635 900,595 1080,565"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="10"
          />
          <path
            d="M520,615 C720,635 900,595 1080,565"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 4. SAKHIR, BAHRAIN - BAHRAIN INTERNATIONAL CIRCUIT
  // =========================================================================
  {
    round: 4,
    name: 'Bahrain Grand Prix',
    circuitName: 'Bahrain International Circuit',
    city: 'Sakhir',
    country: 'Bahrain',
    flag: '🇧🇭',
    continent: 'Asia',
    primaryAccent: '#f59e0b',
    secondaryAccent: '#fbbf24',
    trackType: 'Desert Night Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="bhrSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080301" />
            <stop offset="45%" stopColor="#240f03" />
            <stop offset="85%" stopColor="#3b1704" />
            <stop offset="100%" stopColor="#090301" />
          </linearGradient>
          <pattern id="bhrDuneRipples" width="60" height="12" patternUnits="userSpaceOnUse">
            <path d="M0,6 Q30,1 60,6" fill="none" stroke="#d97706" strokeWidth="0.8" opacity="0.25" />
          </pattern>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#bhrSky)" />

        {/* Wind-Swept Desert Barchan Dunes (Layered Parallax Ridges) */}
        <path
          d="M0,520 Q320,380 680,470 Q1050,560 1440,430 L1440,810 L0,810 Z"
          fill="#1c0b02"
        />
        <rect x="0" y="420" width="1440" height="200" fill="url(#bhrDuneRipples)" />
        <path
          d="M0,580 Q280,480 720,530 Q1120,590 1440,510 L1440,810 L0,810 Z"
          fill="#140702"
        />

        {/* The Iconic Sakhir VIP Tower (8-Story Circular Helical Solar-Louvered Facade) */}
        <g transform="translate(680, 160)">
          {/* Central Glass Cylinder Core */}
          <rect x="-45" y="40" width="90" height="280" fill="#2d1203" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Rooftop Cantilevered Panoramic VIP Lounge */}
          <ellipse cx="0" cy="40" rx="65" ry="18" fill="#451a03" stroke="#fef08a" strokeWidth="2.5" />
          <ellipse cx="0" cy="40" rx="42" ry="12" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="0" cy="22" r="3" fill="#ef4444" />

          {/* 8 Helical Outer Louver Ribbons (Spiral Sunshade Blades) */}
          {[
            { y: 70, rx: 62 },
            { y: 105, rx: 60 },
            { y: 140, rx: 58 },
            { y: 175, rx: 56 },
            { y: 210, rx: 54 },
            { y: 245, rx: 52 },
            { y: 280, rx: 50 },
            { y: 315, rx: 48 },
          ].map((ring, idx) => (
            <g key={idx}>
              <ellipse cx="0" cy={ring.y} rx={ring.rx} ry="14" fill="none" stroke="#f59e0b" strokeWidth="3" />
              <ellipse cx="0" cy={ring.y + 4} rx={ring.rx - 4} ry="12" fill="none" stroke="#fef08a" strokeWidth="1.2" opacity="0.75" />
              {/* Vertical Louver Struts */}
              <line x1={-ring.rx + 10} y1={ring.y} x2={-ring.rx + 10} y2={ring.y + 35} stroke="#d97706" strokeWidth="1.5" />
              <line x1={ring.rx - 10} y1={ring.y} x2={ring.rx - 10} y2={ring.y + 35} stroke="#d97706" strokeWidth="1.5" />
            </g>
          ))}
          {/* Sakhir Tower Illuminated Base Entrance */}
          <polygon points="-55,320 55,320 70,360 -70,360" fill="#1c0b02" stroke="#b45309" strokeWidth="2" />
        </g>

        {/* High-Intensity 1,500W Stadium Floodlight Gantries */}
        {[180, 420, 980, 1260].map((lx) => (
          <g key={lx}>
            <line x1={lx} y1="320" x2={lx} y2="540" stroke="#475569" strokeWidth="5" />
            <polygon points={`${lx - 28},310 ${lx + 28},310 ${lx + 20},325 ${lx - 20},325`} fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
            <polygon points={`${lx - 24},325 ${lx + 24},325 ${lx + 140},630 ${lx - 140},630`} fill="#fef08a" opacity="0.04" />
          </g>
        ))}

        {/* Sakhir Turn 1 Michael Schumacher Hairpin Asphalt with Curb */}
        <g>
          <path
            d="M-50,690 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#0a0401"
            strokeWidth="90"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 5. BANGKOK, THAILAND - BANGKOK RIVERSIDE STREET CIRCUIT
  // =========================================================================
  {
    round: 5,
    name: 'Thailand Grand Prix',
    circuitName: 'Bangkok City Circuit',
    city: 'Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    continent: 'Asia',
    primaryAccent: '#f59e0b',
    secondaryAccent: '#eab308',
    trackType: 'Riverside Street Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="bkkSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050209" />
            <stop offset="45%" stopColor="#1e0b1c" />
            <stop offset="80%" stopColor="#2e1029" />
            <stop offset="100%" stopColor="#080309" />
          </linearGradient>
          <linearGradient id="bkkGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#bkkSky)" />

        {/* Rama VIII Cable-Stayed Bridge (Single Inverted-Y Tower with 84 Fan Cables) */}
        <g transform="translate(180, 130)">
          {/* 160m Asymmetric Inverted-Y Tower Pylon */}
          <path d="M70,390 L105,40 L125,40 L160,390" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" />
          <polygon points="102,40 115,10 128,40" fill="url(#bkkGoldGrad)" stroke="#fef08a" strokeWidth="1.5" />
          <circle cx="115" cy="8" r="4.5" fill="#fef08a" />
          {/* Cross Strut under Tower Apex */}
          <line x1="88" y1="200" x2="142" y2="200" stroke="#eab308" strokeWidth="5" />
          {/* Dual Fan-Plane Stay Cables radiating down to Bridge Deck */}
          {[50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380].map((cy, idx) => (
            <line
              key={idx}
              x1="115"
              y1={45 + idx * 8}
              x2={115 + idx * 24}
              y2="385"
              stroke="#fef08a"
              strokeWidth="1.4"
              opacity="0.65"
            />
          ))}
          {/* Bridge Deck Span with Vehicle Glow */}
          <rect x="-40" y="380" width="460" height="10" fill="#080309" stroke="#f59e0b" strokeWidth="1" />
          <line x1="-40" y1="382" x2="420" y2="382" stroke="#ef4444" strokeWidth="2" strokeDasharray="8 12" />
        </g>

        {/* Wat Arun (Temple of Dawn 82m Central Prang with Intricate Stupa Tiers) */}
        <g transform="translate(740, 180)">
          {/* Central Prang Outer Profile with Stepped Mondop Tiers */}
          <path
            d="M-55,340 L-45,280 L-35,280 L-30,220 L-22,220 L-18,150 L-12,150 L-6,70 L0,20 L6,70 L12,150 L18,150 L22,220 L30,220 L35,280 L45,280 L55,340 Z"
            fill="#291206"
            stroke="#f59e0b"
            strokeWidth="1.8"
          />
          {/* Ornate Gold Finial with Trident (Trishula) on Apex */}
          <polygon points="-4,20 0,-15 4,20" fill="url(#bkkGoldGrad)" stroke="#fef08a" strokeWidth="1" />
          <circle cx="0" cy="-18" r="3.5" fill="#fef08a" />

          {/* Intricate Terraces and Porcelain Niches */}
          {[70, 110, 150, 190, 230, 270].map((ty, idx) => (
            <g key={idx}>
              <line x1={-30 + idx * 4} y1={ty} x2={30 - idx * 4} y2={ty} stroke="#fbbf24" strokeWidth="2" />
              <rect x={-10 + idx * 1.5} y={ty + 4} width={20 - idx * 3} height="8" rx="2" fill="#78350f" stroke="#fef08a" strokeWidth="0.8" />
            </g>
          ))}

          {/* 4 Flanking Minor Prangs (Mondop) */}
          <path d="M-90,340 L-75,200 L-60,340 Z" fill="#1f0c04" stroke="#f59e0b" strokeWidth="1.2" />
          <polygon points="-78,200 -75,175 -72,200" fill="url(#bkkGoldGrad)" />
          <path d="M60,340 L75,200 L90,340 Z" fill="#1f0c04" stroke="#f59e0b" strokeWidth="1.2" />
          <polygon points="72,200 75,175 78,200" fill="url(#bkkGoldGrad)" />
        </g>

        {/* King Power Mahanakhon (78-Story Skyscraper with 3D Pixelated Spiral Ribbon) */}
        <g transform="translate(1140, 150)">
          {/* Main Tower Glass Prism */}
          <rect x="0" y="50" width="75" height="340" fill="#120c24" stroke="#818cf8" strokeWidth="1.5" />
          {/* Roof SkyWalk Glass Cantilever Platform */}
          <rect x="-8" y="44" width="90" height="10" rx="2" fill="#312e81" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="-8" y1="45" x2="82" y2="45" stroke="#fef08a" strokeWidth="2" />

          {/* Authentic Pixelated Glass Cutout Blocks spiraling up facade */}
          {[
            { x: 10, y: 90, w: 18, h: 14 },
            { x: 26, y: 102, w: 20, h: 16 },
            { x: 42, y: 116, w: 22, h: 18 },
            { x: 48, y: 150, w: 24, h: 20 },
            { x: 30, y: 180, w: 22, h: 18 },
            { x: 12, y: 210, w: 20, h: 18 },
            { x: 6, y: 250, w: 24, h: 22 },
            { x: 28, y: 280, w: 22, h: 20 },
            { x: 44, y: 310, w: 24, h: 22 },
          ].map((pixel, i) => (
            <rect
              key={i}
              x={pixel.x}
              y={pixel.y}
              width={pixel.w}
              height={pixel.h}
              fill="#06030c"
              stroke="#fbbf24"
              strokeWidth="1.2"
            />
          ))}
        </g>

        {/* Chao Phraya River Surface with Wavelet Reflections */}
        <ellipse cx="720" cy="540" rx="800" ry="120" fill="#0b030d" opacity="0.9" />

        {/* Bangkok Riverside Street Circuit Road Ribbon with Curbs */}
        <g>
          <path
            d="M-50,680 C340,580 660,640 980,570 C1220,520 1380,580 1490,560"
            fill="none"
            stroke="#070208"
            strokeWidth="85"
          />
          <path
            d="M540,615 C720,635 900,595 1100,565"
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
          />
          <path
            d="M540,615 C720,635 900,595 1100,565"
            fill="none"
            stroke="#ffffff"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },
];
