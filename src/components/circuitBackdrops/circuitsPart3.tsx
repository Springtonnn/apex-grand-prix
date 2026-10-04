import React from 'react';
import { CircuitAtmosphereItem } from './circuitsPart1';

export const CIRCUITS_PART_3: CircuitAtmosphereItem[] = [
  // =========================================================================
  // 11. ZANDVOORT, NETHERLANDS - CIRCUIT ZANDVOORT
  // =========================================================================
  {
    round: 11,
    name: 'Dutch Grand Prix',
    circuitName: 'Circuit Zandvoort',
    city: 'Zandvoort',
    country: 'Netherlands',
    flag: '🇳🇱',
    continent: 'Europe',
    primaryAccent: '#f97316',
    secondaryAccent: '#fb923c',
    trackType: 'Steep Banked Dunes',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="zanSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040201" />
            <stop offset="45%" stopColor="#1c0c04" />
            <stop offset="85%" stopColor="#2c1406" />
            <stop offset="100%" stopColor="#070301" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#zanSky)" />

        {/* North Sea Coastal Rolling Sand Dunes with Marram Grass Ridges */}
        <path
          d="M0,480 Q240,360 520,440 Q840,340 1140,430 Q1320,380 1440,450 L1440,810 L0,810 Z"
          fill="#1c0d05"
        />
        <path
          d="M0,540 Q320,440 680,510 Q1060,430 1440,520 L1440,810 L0,810 Z"
          fill="#130803"
        />

        {/* Offshore Modern North Sea Wind Turbines (3-Blade Rotors & Tubular Nacelles) */}
        {[220, 520, 940, 1260].map((wx, idx) => (
          <g key={idx} transform={`translate(${wx}, 210)`} opacity="0.65">
            {/* Tapered Monopile Tower */}
            <polygon points="-4,220 4,220 2,40 -2,40" fill="#475569" stroke="#f97316" strokeWidth="0.8" />
            {/* Nacelle Generator Housing */}
            <rect x="-8" y="34" width="16" height="8" rx="2" fill="#94a3b8" />
            <circle cx="0" cy="38" r="3" fill="#ffffff" />
            {/* 3 Aerodynamic Blades */}
            <line x1="0" y1="38" x2="0" y2="-45" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="38" x2="65" y2="70" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="38" x2="-65" y2="70" stroke="#f1f5f9" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        {/* De Zandvoort Coastal Lighthouse Tower */}
        <g transform="translate(740, 190)">
          <polygon points="-15,220 15,220 10,40 -10,40" fill="#3b1506" stroke="#f97316" strokeWidth="1.2" />
          {/* Lantern Room & Rotating Beam */}
          <rect x="-14" y="24" width="28" height="16" fill="#fef08a" stroke="#d97706" strokeWidth="1" />
          <polygon points="-12,24 0,10 12,24" fill="#ef4444" />
          {/* Light Beam Cone */}
          <polygon points="14,32 400,-20 380,80 14,32" fill="#fef08a" opacity="0.08" />
        </g>

        {/* 18-Degree Extreme Banked Corner Cross-Section (Tarzanbocht & Hugenholtzbocht) */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#080301"
            strokeWidth="90"
          />
          {/* Dutch Orange & Red/White Curbs */}
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#ea580c"
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
  // 12. SILVERSTONE, GREAT BRITAIN - SILVERSTONE CIRCUIT
  // =========================================================================
  {
    round: 12,
    name: 'British Grand Prix',
    circuitName: 'Silverstone Circuit',
    city: 'Silverstone',
    country: 'Great Britain',
    flag: '🇬🇧',
    continent: 'Europe',
    primaryAccent: '#2563eb',
    secondaryAccent: '#ef4444',
    trackType: 'Home of British Motorsport',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="gbSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020409" />
            <stop offset="45%" stopColor="#081024" />
            <stop offset="85%" stopColor="#111f3d" />
            <stop offset="100%" stopColor="#040711" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#gbSky)" />

        {/* The World-Famous "Silverstone Wing" Pit & Paddock Complex */}
        <g transform="translate(240, 140)">
          {/* Sweeping 300-Meter Aerodynamic Cantilevered Wing Roofline */}
          <path
            d="M0,220 C180,90 480,40 840,60 C980,68 1080,90 1140,120 L1120,150 C1060,125 960,105 840,95 C480,75 180,120 10,250 Z"
            fill="#1e293b"
            stroke="#60a5fa"
            strokeWidth="2.5"
          />
          {/* Glazed VIP Paddock Media Cantilever Pods */}
          <rect x="220" y="140" width="240" height="70" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="520" y="130" width="280" height="70" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

          {/* 40 Formula 1 Pit Garage Bays with Illuminated Header Livery Strips */}
          <rect x="140" y="240" width="760" height="90" fill="#090e17" stroke="#334155" strokeWidth="1.5" />
          {[160, 220, 280, 340, 400, 460, 520, 580, 640, 700, 760, 820].map((gx) => (
            <g key={gx}>
              <line x1={gx} y1="240" x2={gx} y2="330" stroke="#1e293b" strokeWidth="3" />
              <rect x={gx + 6} y="246" width="48" height="6" fill="#ef4444" opacity="0.8" />
              <rect x={gx + 8} y="260" width="44" height="65" fill="#020617" stroke="#475569" strokeWidth="1" />
            </g>
          ))}

          {/* Pit Wall Timing Stand with 8 High-Resolution Driver Monitors */}
          <rect x="340" y="340" width="380" height="28" fill="#020617" stroke="#60a5fa" strokeWidth="1.5" />
          {[360, 410, 460, 510, 560, 610, 660].map((mx) => (
            <rect key={mx} x={mx} y="344" width="36" height="20" rx="2" fill="#0f172a" stroke="#22d3ee" strokeWidth="1" />
          ))}
        </g>

        {/* Maggotts, Becketts & Chapel High-Speed S-Curves Asphalt & FIA Kerbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#050a14"
            strokeWidth="90"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#ef4444"
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
  // 13. MONTREAL, CANADA - CIRCUIT GILLES VILLENEUVE
  // =========================================================================
  {
    round: 13,
    name: 'Canadian Grand Prix',
    circuitName: 'Circuit Gilles Villeneuve',
    city: 'Montreal',
    country: 'Canada',
    flag: '🇨🇦',
    continent: 'Americas',
    primaryAccent: '#dc2626',
    secondaryAccent: '#f87171',
    trackType: 'Island Park Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="mtlSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040203" />
            <stop offset="45%" stopColor="#19060b" />
            <stop offset="85%" stopColor="#280911" />
            <stop offset="100%" stopColor="#050102" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#mtlSky)" />

        {/* Buckminster Fuller's Biosphere (Iconic Geodesic Icosahedral Space Frame Sphere) */}
        <g transform="translate(420, 240)">
          {/* Outer Sphere Profile */}
          <circle cx="0" cy="0" r="130" fill="#15050a" stroke="#dc2626" strokeWidth="2.5" />
          {/* Triangular and Hexagonal Wireframe Space Frame Lattice Rings */}
          <circle cx="0" cy="0" r="105" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.8" />
          <circle cx="0" cy="0" r="75" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.75" />
          <circle cx="0" cy="0" r="40" fill="none" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
          {/* Radiating Geodesic Great-Circle Arcs */}
          {[-60, -30, 0, 30, 60].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={-Math.cos(rad) * 130}
                y1={-Math.sin(rad) * 130}
                x2={Math.cos(rad) * 130}
                y2={Math.sin(rad) * 130}
                stroke="#fca5a5"
                strokeWidth="1.2"
                opacity="0.6"
              />
            );
          })}
        </g>

        {/* Montreal Olympic Stadium Inclined Tower (World's Tallest Leaning Tower at 45°) */}
        <g transform="translate(940, 160)">
          {/* 175-meter Inclined Concrete Pylon */}
          <path d="M0,260 L80,30 L115,30 L60,260 Z" fill="#240810" stroke="#dc2626" strokeWidth="2" />
          {/* Retractable Stadium Roof Stay Cables */}
          {[60, 90, 120, 150, 180, 210].map((cy, i) => (
            <line key={i} x1="95" y1="40" x2={-140 + i * 40} y2="250" stroke="#f87171" strokeWidth="1.2" opacity="0.6" />
          ))}
          {/* Donut Stadium Bowl Roof */}
          <ellipse cx="-40" cy="250" rx="160" ry="35" fill="#130408" stroke="#dc2626" strokeWidth="1.5" />
        </g>

        {/* Jacques Cartier Steel Cantilever Truss Bridge */}
        <g transform="translate(180, 280)">
          <path d="M0,80 L80,10 L160,80" fill="none" stroke="#64748b" strokeWidth="3" />
          <path d="M160,80 L240,10 L320,80" fill="none" stroke="#64748b" strokeWidth="3" />
          <line x1="0" y1="80" x2="320" y2="80" stroke="#94a3b8" strokeWidth="3" />
        </g>

        {/* Île Notre-Dame St. Lawrence River Water Basin */}
        <ellipse cx="720" cy="540" rx="800" ry="120" fill="#080205" opacity="0.9" />

        {/* Famous "Wall of Champions" Final Chicane Asphalt & Curbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#080204"
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
  // 14. AUSTIN, TEXAS, USA - CIRCUIT OF THE AMERICAS (COTA)
  // =========================================================================
  {
    round: 14,
    name: 'United States Grand Prix',
    circuitName: 'Circuit of the Americas',
    city: 'Austin',
    country: 'United States',
    flag: '🇺🇸',
    continent: 'Americas',
    primaryAccent: '#dc2626',
    secondaryAccent: '#2563eb',
    trackType: 'Modern Elevation Arena',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="cotaSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040205" />
            <stop offset="45%" stopColor="#180612" />
            <stop offset="85%" stopColor="#25091c" />
            <stop offset="100%" stopColor="#050104" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#cotaSky)" />

        {/* The Iconic 77-Meter COTA Observation Tower (Tubular Steel Column & Red Ribbon Veil) */}
        <g transform="translate(740, 110)">
          {/* Main Elevator Shaft & Double-Helix Staircase Core */}
          <line x1="0" y1="360" x2="0" y2="40" stroke="#64748b" strokeWidth="12" />
          <line x1="-12" y1="360" x2="-12" y2="40" stroke="#475569" strokeWidth="4" />
          <line x1="12" y1="360" x2="12" y2="40" stroke="#475569" strokeWidth="4" />
          {/* Observation Deck Platform with Glass Floor */}
          <polygon points="-45,50 45,50 30,30 -30,30" fill="#1e293b" stroke="#f8fafc" strokeWidth="1.5" />
          <circle cx="0" cy="20" r="3" fill="#ef4444" />

          {/* Dramatic Sculptural Red Ribbon Canopy draping from tower summit down to amphitheater */}
          <path
            d="M0,35 C35,70 95,140 120,240 C140,320 180,360 260,370"
            fill="none"
            stroke="#dc2626"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M0,35 C35,70 95,140 120,240 C140,320 180,360 260,370"
            fill="none"
            stroke="#fef08a"
            strokeWidth="2.5"
            strokeDasharray="6 8"
          />
        </g>

        {/* Turn 1 Steep 41-Meter Blind Crest Elevation Hill Climb */}
        <g>
          {/* Ascending Turn 1 Hill Ribbon */}
          <path
            d="M-50,680 C320,620 560,540 820,380 C980,290 1180,260 1440,250"
            fill="none"
            stroke="#070206"
            strokeWidth="85"
          />
          {/* Texas Stars & Stripes Painted Runoff Kerb */}
          <path
            d="M580,520 C760,430 920,340 1140,285"
            fill="none"
            stroke="#2563eb"
            strokeWidth="10"
          />
          <path
            d="M580,520 C760,430 920,340 1140,285"
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
  // 15. LAS VEGAS, NEVADA, USA - LAS VEGAS STRIP CIRCUIT
  // =========================================================================
  {
    round: 15,
    name: 'Las Vegas Grand Prix',
    circuitName: 'Las Vegas Strip Circuit',
    city: 'Las Vegas',
    country: 'United States',
    flag: '🇺🇸',
    continent: 'Americas',
    primaryAccent: '#f59e0b',
    secondaryAccent: '#ec4899',
    trackType: 'Neon Super-Speedway',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="lvSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050106" />
            <stop offset="45%" stopColor="#1a041f" />
            <stop offset="85%" stopColor="#290730" />
            <stop offset="100%" stopColor="#060107" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#lvSky)" />

        {/* The Las Vegas Sphere (Exosphere Geodesic LED Matrix Dome) */}
        <g transform="translate(420, 260)">
          {/* Giant 112m High Geodesic Spherical Dome */}
          <ellipse cx="0" cy="0" rx="140" ry="115" fill="#1e0524" stroke="#ec4899" strokeWidth="2.5" />
          {/* Intricate Concentric LED Matrix Latitudinal & Longitudinal Rings */}
          <ellipse cx="0" cy="0" rx="115" ry="90" fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="6 6" />
          <ellipse cx="0" cy="0" rx="85" ry="65" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="6 6" />
          <ellipse cx="0" cy="0" rx="55" ry="40" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Animated Digital Pulse Lines across Exosphere */}
          <line x1="-140" y1="0" x2="140" y2="0" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
          <line x1="-120" y1="-40" x2="120" y2="-40" stroke="#38bdf8" strokeWidth="1.5" opacity="0.75" />
          <line x1="-120" y1="40" x2="120" y2="40" stroke="#38bdf8" strokeWidth="1.5" opacity="0.75" />
        </g>

        {/* Paris Las Vegas Half-Scale Eiffel Tower with Riveted Iron Lattice */}
        <g transform="translate(960, 160)">
          <path d="M0,280 L25,120 L30,40 L35,40 L40,120 L65,280" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          {/* Cross-Bracing Girders */}
          {[60, 100, 150, 210].map((ey) => (
            <line key={ey} x1={10} y1={ey} x2={55} y2={ey} stroke="#fef08a" strokeWidth="2" />
          ))}
          {/* Apex Beacon Spotlight Beam */}
          <polygon points="32,40 180,-40 220,-40 32,40" fill="#fef08a" opacity="0.12" />
        </g>

        {/* High Roller 168m Giant Observation Wheel in Distance */}
        <g transform="translate(180, 260)" opacity="0.6">
          <circle cx="0" cy="0" r="105" fill="none" stroke="#ec4899" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="16" fill="#18041c" stroke="#f472b6" strokeWidth="2" />
        </g>

        {/* Bellagio Choreographed Parabolic Fountain Water Plumes */}
        <g transform="translate(680, 360)">
          <path d="M-60,80 Q-30,-20 0,80" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
          <path d="M0,80 Q30,-40 60,80" fill="none" stroke="#38bdf8" strokeWidth="3.5" opacity="0.85" />
          <path d="M60,80 Q90,-20 120,80" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
        </g>

        {/* Las Vegas Strip High-Speed Boulevard Asphalt & Pink/Yellow Curbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#080209"
            strokeWidth="90"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#ec4899"
            strokeWidth="10"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#fef08a"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },
];
