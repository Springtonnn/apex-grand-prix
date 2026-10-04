import React from 'react';
import { CircuitAtmosphereItem } from './circuitsPart1';

export const CIRCUITS_PART_4: CircuitAtmosphereItem[] = [
  // =========================================================================
  // 16. MEXICO CITY - AUTÓDROMO HERMANOS RODRÍGUEZ
  // =========================================================================
  {
    round: 16,
    name: 'Mexico City Grand Prix',
    circuitName: 'Autódromo Hermanos Rodríguez',
    city: 'Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    continent: 'Americas',
    primaryAccent: '#16a34a',
    secondaryAccent: '#ef4444',
    trackType: 'High-Altitude Stadium Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="mexSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030704" />
            <stop offset="45%" stopColor="#091b10" />
            <stop offset="85%" stopColor="#0f2b1a" />
            <stop offset="100%" stopColor="#040905" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#mexSky)" />

        {/* Popocatépetl & Iztaccíhuatl Twin Volcanoes (5,400m Glaciated Peaks) */}
        <g transform="translate(180, 110)">
          {/* Popocatépetl Volcano Cone */}
          <path
            d="M0,380 C110,320 220,240 310,130 C330,105 345,95 365,95 C385,95 400,105 420,130 C510,240 620,320 730,380 Z"
            fill="#091f13"
            stroke="#16a34a"
            strokeWidth="1.5"
          />
          {/* Snow & Glacier Cap */}
          <polygon points="345,115 365,95 385,115 375,140 355,140" fill="#ffffff" opacity="0.95" />
          {/* Faint Volcano Gas Vapor Plume drifting from Crater */}
          <path d="M365,95 Q380,40 420,10" fill="none" stroke="#f1f5f9" strokeWidth="2.5" strokeDasharray="4 6" opacity="0.4" />
        </g>

        {/* Foro Sol Stadium Amphitheater Grandstand (Legendary Baseball Arena section) */}
        <g transform="translate(680, 160)">
          {/* Colossal Curved Stadium Grandstand Structure */}
          <path
            d="M0,280 C120,120 340,90 560,110 L540,145 C340,130 140,155 30,295 Z"
            fill="#14532d"
            stroke="#4ade80"
            strokeWidth="2"
          />
          {/* Tiered Spectator Stepped Bleachers */}
          {[140, 175, 210, 245].map((by) => (
            <line key={by} x1={60} y1={by} x2={500} y2={by - 30} stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
          ))}
          {/* Stadium Roof Truss Support Pylons */}
          {[120, 220, 320, 420].map((sx) => (
            <line key={sx} x1={sx} y1="120" x2={sx - 15} y2="280" stroke="#86efac" strokeWidth="2.5" />
          ))}
        </g>

        {/* Distant Aztec Step-Pyramid Silhouette (Teotihuacan Sun Pyramid Motif) */}
        <g transform="translate(180, 310)" opacity="0.65">
          <polygon points="-50,90 50,90 40,65 -40,65" fill="#0c2617" stroke="#22c55e" strokeWidth="1" />
          <polygon points="-38,65 38,65 30,40 -30,40" fill="#0f331f" stroke="#22c55e" strokeWidth="1" />
          <polygon points="-28,40 28,40 20,20 -20,20" fill="#144228" stroke="#4ade80" strokeWidth="1" />
          <rect x="-10" y="5" width="20" height="15" fill="#166534" stroke="#fef08a" strokeWidth="1" />
        </g>

        {/* Autódromo Hermanos Rodríguez Stadium Section Asphalt & Green/Red Kerbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#050e07"
            strokeWidth="90"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#16a34a"
            strokeWidth="10"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 17. SÃO PAULO, BRAZIL - AUTÓDROMO JOSÉ CARLOS PACE (INTERLAGOS)
  // =========================================================================
  {
    round: 17,
    name: 'São Paulo Grand Prix',
    circuitName: 'Autódromo José Carlos Pace (Interlagos)',
    city: 'São Paulo',
    country: 'Brazil',
    flag: '🇧🇷',
    continent: 'Americas',
    primaryAccent: '#eab308',
    secondaryAccent: '#16a34a',
    trackType: 'Undulating Natural Amphitheater',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="brSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050401" />
            <stop offset="45%" stopColor="#1a1504" />
            <stop offset="85%" stopColor="#2b2307" />
            <stop offset="100%" stopColor="#070601" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#brSky)" />

        {/* Octávio Frias de Oliveira Cable-Stayed X-Bridge (São Paulo Architectural Icon) */}
        <g transform="translate(680, 110)">
          {/* Unique 138-Meter Crossing X-Pylons */}
          <line x1="-70" y1="360" x2="70" y2="30" stroke="#ca8a04" strokeWidth="8" strokeLinecap="round" />
          <line x1="70" y1="360" x2="-70" y2="30" stroke="#ca8a04" strokeWidth="8" strokeLinecap="round" />
          <circle cx="0" cy="180" r="14" fill="#a16207" stroke="#fef08a" strokeWidth="2.5" />
          {/* Dual Crossing Cable-Stay Fans */}
          {[60, 90, 120, 150, 180, 210, 240, 270, 300].map((cy, i) => (
            <g key={i}>
              <line x1="0" y1="180" x2={-160 + i * 18} y2="350" stroke="#fef08a" strokeWidth="1.2" opacity="0.6" />
              <line x1="0" y1="180" x2={20 + i * 18} y2="350" stroke="#fef08a" strokeWidth="1.2" opacity="0.6" />
            </g>
          ))}
          {/* Dual Curved Curved Road Decks crossing under pylons */}
          <path d="M-180,350 C-60,320 60,340 180,350" fill="none" stroke="#1f1803" strokeWidth="12" />
        </g>

        {/* Christ the Redeemer Silhouette on Corcovado Ridge in Distant Haze */}
        <g transform="translate(240, 240)" opacity="0.6">
          <line x1="0" y1="80" x2="0" y2="20" stroke="#fde047" strokeWidth="4.5" />
          <line x1="-25" y1="32" x2="25" y2="32" stroke="#fde047" strokeWidth="3.5" />
          <circle cx="0" cy="16" r="3.5" fill="#fef08a" />
        </g>

        {/* Famous Senna 'S' Downhill Chicane Asphalt & Brazilian Yellow/Green Curbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#080702"
            strokeWidth="90"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#eab308"
            strokeWidth="10"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#16a34a"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 18. ABU DHABI - YAS MARINA CIRCUIT (FINALE)
  // =========================================================================
  {
    round: 18,
    name: 'Abu Dhabi Grand Prix (Finale)',
    circuitName: 'Yas Marina Circuit',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    continent: 'Middle East',
    primaryAccent: '#06b6d4',
    secondaryAccent: '#3b82f6',
    trackType: 'Twilight Marina Grand Finale',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="ydSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020508" />
            <stop offset="45%" stopColor="#051624" />
            <stop offset="85%" stopColor="#0a253d" />
            <stop offset="100%" stopColor="#03070b" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#ydSky)" />

        {/* W Abu Dhabi Hotel (The Iconic "Grid Shell" Undulating LED Canopy spanning over track) */}
        <g transform="translate(480, 110)">
          {/* Main Dual Hotel Blocks */}
          <rect x="30" y="110" width="160" height="230" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="290" y="110" width="160" height="230" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />

          {/* Undulating Curvilinear Grid Shell Canopy (Parametric Rhomboid Mesh over Track) */}
          <path
            d="M0,180 C80,50 240,40 480,70 C540,80 580,110 600,160 L580,185 C550,140 500,110 460,105 C240,75 90,85 20,200 Z"
            fill="#0369a1"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
          {/* Thousands of Color-Changing LED Diamond Facets */}
          {[80, 140, 200, 260, 320, 380, 440, 500].map((fx) => (
            <ellipse key={fx} cx={fx} cy="100" rx="16" ry="6" fill="#38bdf8" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
          ))}
          {/* Bridge Spanning Over the Racetrack */}
          <rect x="180" y="190" width="120" height="30" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
        </g>

        {/* Yas Marina Basin & Luxury Superyachts with Illuminated Masts */}
        <g transform="translate(180, 360)">
          <path d="M40,100 L240,100 L200,140 L50,140 Z" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="130" y1="100" x2="130" y2="40" stroke="#f8fafc" strokeWidth="2" />
        </g>

        {/* Twilight Marina Turquoise Sea Basin with Light Reflections */}
        <ellipse cx="720" cy="540" rx="800" ry="120" fill="#04121f" opacity="0.9" />

        {/* Yas Marina Circuit Twilight Straight Asphalt & Cyan/White Curbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#020810"
            strokeWidth="90"
          />
          <path
            d="M580,630 C760,650 940,610 1140,575"
            fill="none"
            stroke="#06b6d4"
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
  // 19. PIT LANE & TEAM GARAGE - PADDOCK ENGINEERING BOX
  // =========================================================================
  {
    round: 19,
    name: 'Pit Lane & Team Garage',
    circuitName: 'Paddock Engineering Box',
    city: 'Pit Lane Alley',
    country: 'Global Circuit Paddock',
    flag: '⏱️',
    continent: 'Paddock',
    primaryAccent: '#ef4444',
    secondaryAccent: '#f59e0b',
    trackType: 'Pit Bay Engineering Complex',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="pitSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040609" />
            <stop offset="50%" stopColor="#090f18" />
            <stop offset="100%" stopColor="#04070b" />
          </linearGradient>
        </defs>

        {/* Garage Bay Interior Base */}
        <rect width="1440" height="810" fill="url(#pitSky)" />

        {/* Overhead Heavy Carbon-Fiber Umbilical Suspension Booms */}
        <g transform="translate(720, 60)">
          {/* Main Structural Overhead Beam */}
          <rect x="-650" y="0" width="1300" height="24" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          {/* Left Carbon Umbilical Swing Arm with Pneumatic Airline Couplers */}
          <path d="M-280,24 L-240,180 L-140,240" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          <line x1="-140" y1="240" x2="-140" y2="340" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
          {/* Right Carbon Umbilical Swing Arm */}
          <path d="M280,24 L240,180 L140,240" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
          <line x1="140" y1="240" x2="140" y2="340" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
        </g>

        {/* Tyre Warming Blanket Racks with Digital Temperature Readouts */}
        <g transform="translate(180, 240)">
          <rect x="0" y="40" width="160" height="220" rx="6" fill="#090e17" stroke="#334155" strokeWidth="1.5" />
          {/* 4 Heated Tyres on Rack (Front Left, Front Right, Rear Left, Rear Right) */}
          {[60, 110, 160, 210].map((ty, i) => (
            <g key={i}>
              <rect x="12" y={ty} width="136" height="38" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
              <circle cx="28" cy={ty + 19} r="6" fill="#f59e0b" />
              <rect x="100" y={ty + 12} width="40" height="14" rx="2" fill="#020617" stroke="#10b981" strokeWidth="1" />
            </g>
          ))}
        </g>

        {/* Hydraulic Car Jack & Wheel Gun Gantries */}
        <g transform="translate(1100, 240)">
          <rect x="0" y="40" width="160" height="220" rx="6" fill="#090e17" stroke="#334155" strokeWidth="1.5" />
          <line x1="80" y1="60" x2="80" y2="230" stroke="#eab308" strokeWidth="6" strokeLinecap="round" />
          <circle cx="80" cy="50" r="14" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
        </g>

        {/* Polished Epoxy Pit Lane Concrete Floor with Safety Speed Limit Lines */}
        <g>
          <polygon points="0,520 1440,520 1440,810 0,810" fill="#070c14" />
          {/* High-Visibility Yellow & Black Warning Chevron Border */}
          <line x1="0" y1="520" x2="1440" y2="520" stroke="#eab308" strokeWidth="10" />
          <line x1="0" y1="520" x2="1440" y2="520" stroke="#000000" strokeWidth="10" strokeDasharray="30 30" />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 20. STARTING GRID & 5 RED LIGHTS - START/FINISH GANTRY
  // =========================================================================
  {
    round: 20,
    name: 'Starting Grid & 5 Red Lights',
    circuitName: 'Start/Finish Gantry & Main Straight',
    city: 'Grid Line P1',
    country: 'Championship Starting Grid',
    flag: '🚥',
    continent: 'Grid',
    primaryAccent: '#ef4444',
    secondaryAccent: '#f59e0b',
    trackType: 'Main Straight Start Gantry',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="gridSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#030408" />
            <stop offset="50%" stopColor="#080c14" />
            <stop offset="100%" stopColor="#030508" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#gridSky)" />

        {/* Massive FIA Start/Finish Overhead Steel Tubular Truss Gantry */}
        <g transform="translate(180, 100)">
          {/* Left Vertical Steel Support Pylon */}
          <rect x="0" y="0" width="36" height="340" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
          {/* Right Vertical Steel Support Pylon */}
          <rect x="1044" y="0" width="36" height="340" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
          {/* Heavy Horizontal Overhead Steel Truss Span */}
          <rect x="20" y="20" width="1040" height="65" fill="#1e293b" stroke="#475569" strokeWidth="3" />

          {/* THE FAMOUS 5 FIA STARTING RED LIGHT PODS */}
          <g transform="translate(360, 30)">
            {/* Matte Black Light Pod Enclosure */}
            <rect x="-15" y="-6" width="390" height="52" rx="8" fill="#020617" stroke="#ef4444" strokeWidth="2.5" />
            {/* 5 Distinct Red Light Columns with Glowing Halo Rings */}
            {[0, 1, 2, 3, 4].map((i) => {
              const lx = i * 75 + 30;
              return (
                <g key={i}>
                  {/* Outer Bezel */}
                  <circle cx={lx} cy="20" r="18" fill="#450a0a" stroke="#991b1b" strokeWidth="2" />
                  {/* High-Luminance Red LED Cluster */}
                  <circle cx={lx} cy="20" r="12" fill="#ef4444" />
                  {/* Intense Core Glow */}
                  <circle cx={lx} cy="20" r="6" fill="#fecaca" />
                  <circle cx={lx} cy="20" r="26" fill="#ef4444" opacity="0.2" />
                </g>
              );
            })}
          </g>

          {/* Rolex Official Grand Prix Master Chronometer Clock */}
          <g transform="translate(230, 52)">
            <circle cx="0" cy="0" r="26" fill="#064e3b" stroke="#f59e0b" strokeWidth="3" />
            <circle cx="0" cy="0" r="21" fill="#022c22" />
            <line x1="0" y1="0" x2="0" y2="-12" stroke="#fef08a" strokeWidth="2" />
            <line x1="0" y1="0" x2="10" y2="6" stroke="#fef08a" strokeWidth="2" />
          </g>
        </g>

        {/* Starting Grid Painted Asphalt Boxes (Pole Position 1, 2, 3) */}
        <g transform="translate(720, 520)">
          {/* Main Straight Asphalt Floor */}
          <polygon points="-720,0 720,0 720,290 -720,290" fill="#070b12" />
          {/* Start/Finish Timing Line Chequered Loop */}
          <line x1="-720" y1="10" x2="720" y2="10" stroke="#ffffff" strokeWidth="12" strokeDasharray="24 24" />
          {/* Pole Position Grid Slot (P1 Slot) */}
          <rect x="-180" y="80" width="130" height="90" fill="none" stroke="#f8fafc" strokeWidth="5" />
          <line x1="-180" y1="80" x2="-180" y2="170" stroke="#ef4444" strokeWidth="6" />
          {/* P2 Grid Slot */}
          <rect x="60" y="140" width="130" height="90" fill="none" stroke="#f8fafc" strokeWidth="5" />
          <line x1="60" y1="140" x2="60" y2="230" stroke="#ef4444" strokeWidth="6" />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 21. STRATEGY MISSION CONTROL - TELEMETRY WALL & PIT COMMAND
  // =========================================================================
  {
    round: 21,
    name: 'Strategy Mission Control',
    circuitName: 'Telemetry Wall & Pit Command',
    city: 'Mission Control HQ',
    country: 'Formula 1 Strategy Operations',
    flag: '🧠',
    continent: 'Engineering',
    primaryAccent: '#3b82f6',
    secondaryAccent: '#10b981',
    trackType: 'Real-time Command Room',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="ctrlSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020408" />
            <stop offset="50%" stopColor="#060c18" />
            <stop offset="100%" stopColor="#02050b" />
          </linearGradient>
        </defs>

        {/* Command Room Dark Base */}
        <rect width="1440" height="810" fill="url(#ctrlSky)" />

        {/* 6 Massive Wall-Mounted Ultra-HD Telemetry Command Screens */}
        <g transform="translate(180, 80)">
          {/* Screen 1: Track GPS Live Driver Radar Map */}
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="340" height="190" rx="6" fill="#030712" stroke="#1d4ed8" strokeWidth="2" />
            <path d="M40,140 C60,40 160,30 260,60 C310,120 280,160 210,150 C140,140 80,180 40,140 Z" fill="none" stroke="#3b82f6" strokeWidth="4" />
            <circle cx="260" cy="60" r="5" fill="#ef4444" />
            <circle cx="150" cy="35" r="4" fill="#10b981" />
          </g>

          {/* Screen 2: Real-time Tyre Thermal Degradation Curves */}
          <g transform="translate(365, 0)">
            <rect x="0" y="0" width="340" height="190" rx="6" fill="#030712" stroke="#059669" strokeWidth="2" />
            {/* Degradation Graph Curve */}
            <path d="M20,150 C80,140 160,110 240,60 L320,35" fill="none" stroke="#10b981" strokeWidth="3" />
            <line x1="20" y1="165" x2="320" y2="165" stroke="#334155" strokeWidth="1" />
            <line x1="20" y1="25" x2="20" y2="165" stroke="#334155" strokeWidth="1" />
          </g>

          {/* Screen 3: Driver Lap Delta & Split Sector Times */}
          <g transform="translate(730, 0)">
            <rect x="0" y="0" width="340" height="190" rx="6" fill="#030712" stroke="#d97706" strokeWidth="2" />
            {[25, 55, 85, 115, 145].map((ly) => (
              <g key={ly}>
                <rect x="15" y={ly} width="60" height="16" rx="2" fill="#1e293b" />
                <rect x="85" y={ly} width="235" height="16" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
              </g>
            ))}
          </g>
        </g>

        {/* Ergonomic Curved Carbon-Fiber Mission Control Desk Console */}
        <g transform="translate(720, 500)">
          {/* Desk Arc Profile */}
          <path
            d="M-650,140 C-380,20 380,20 650,140 L620,290 C360,180 -360,180 -620,290 Z"
            fill="#090e17"
            stroke="#1e293b"
            strokeWidth="3"
          />
          {/* Dual Engineer Headset Stations & Intercom Microphones */}
          {[-380, -120, 120, 380].map((hx) => (
            <g key={hx} transform={`translate(${hx}, 80)`}>
              <ellipse cx="0" cy="0" rx="35" ry="12" fill="#020617" stroke="#3b82f6" strokeWidth="1.5" />
              <rect x="-24" y="-8" width="48" height="16" rx="2" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
            </g>
          ))}
        </g>
      </svg>
    ),
  },
];
