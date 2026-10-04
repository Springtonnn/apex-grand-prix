import React from 'react';
import { CircuitAtmosphereItem } from './circuitsPart1';

export const CIRCUITS_PART_2: CircuitAtmosphereItem[] = [
  // =========================================================================
  // 6. BARCELONA, SPAIN - CIRCUIT DE BARCELONA-CATALUNYA
  // =========================================================================
  {
    round: 6,
    name: 'Spanish Grand Prix',
    circuitName: 'Circuit de Barcelona-Catalunya',
    city: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    continent: 'Europe',
    primaryAccent: '#f59e0b',
    secondaryAccent: '#ef4444',
    trackType: 'Aero Technical Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="bcnSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080302" />
            <stop offset="45%" stopColor="#1c0a06" />
            <stop offset="85%" stopColor="#2e1008" />
            <stop offset="100%" stopColor="#0a0302" />
          </linearGradient>
          <linearGradient id="bcnGlories" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#bcnSky)" />

        {/* Montserrat Sawtooth Mountain Range Silhouettes in Far Distance */}
        <path
          d="M0,450 Q180,360 380,410 Q580,330 840,390 Q1120,320 1440,430 L1440,810 L0,810 Z"
          fill="#130704"
          opacity="0.8"
        />

        {/* Antoni Gaudí's Sagrada Família (8 Parabolic Perforated Towers & Spire Finials) */}
        <g transform="translate(480, 100)">
          {/* Central Jesus Tower (172m Spire with Cross) */}
          <path d="M110,380 L115,80 L130,50 L145,80 L150,380 Z" fill="#2d1007" stroke="#f59e0b" strokeWidth="1.5" />
          <polygon points="122,50 130,20 138,50" fill="#fef08a" />
          <line x1="130" y1="20" x2="130" y2="0" stroke="#fef08a" strokeWidth="2.5" />
          <line x1="122" y1="8" x2="138" y2="8" stroke="#fef08a" strokeWidth="2.5" />

          {/* 4 Nativity Facade Bell Towers with Parabolic Openwork Windows */}
          {[
            { x: 30, h: 260, w: 24, finial: '#ef4444' },
            { x: 70, h: 290, w: 26, finial: '#f59e0b' },
            { x: 170, h: 290, w: 26, finial: '#f59e0b' },
            { x: 210, h: 260, w: 24, finial: '#ef4444' },
          ].map((tower, idx) => (
            <g key={idx}>
              {/* Parabolic Tapered Bell Tower */}
              <path
                d={`M${tower.x},380 C${tower.x + 2},${380 - tower.h * 0.6} ${tower.x + 4},${380 - tower.h} ${tower.x + tower.w / 2},${380 - tower.h - 20} C${tower.x + tower.w - 4},${380 - tower.h} ${tower.x + tower.w - 2},${380 - tower.h * 0.6} ${tower.x + tower.w},380 Z`}
                fill="#240c06"
                stroke="#f59e0b"
                strokeWidth="1.2"
              />
              {/* Perforated Openwork Bell Louver Slits */}
              {[60, 100, 140, 180, 220].map((ly, lIdx) => (
                <rect
                  key={lIdx}
                  x={tower.x + 6}
                  y={380 - ly}
                  width={tower.w - 12}
                  height="16"
                  rx="4"
                  fill="#0c0402"
                  stroke="#fbbf24"
                  strokeWidth="0.8"
                />
              ))}
              {/* Venetian Mosaic Colorful Finial on Apex */}
              <circle cx={tower.x + tower.w / 2} cy={380 - tower.h - 24} r="5" fill={tower.finial} stroke="#fef08a" strokeWidth="1" />
            </g>
          ))}
        </g>

        {/* Torre Glòries (Geodesic Bullet-Shaped Skyscraper by Jean Nouvel) */}
        <g transform="translate(940, 180)">
          <path
            d="M10,340 C8,220 18,120 45,50 C55,25 65,15 75,15 C85,15 95,25 105,50 C132,120 142,220 140,340 Z"
            fill="url(#bcnGlories)"
            stroke="#ef4444"
            strokeWidth="1.8"
          />
          {/* Dual-Skin Geodesic Glass Grid Rings */}
          {[50, 90, 135, 185, 240, 300].map((gy, i) => (
            <ellipse key={i} cx="75" cy={gy} rx={45 + i * 3.5} ry="12" fill="none" stroke="#fef08a" strokeWidth="1" opacity="0.6" />
          ))}
          {/* Vertical Louver Ribs */}
          <line x1="75" y1="15" x2="75" y2="340" stroke="#fef08a" strokeWidth="1.2" opacity="0.75" />
          <line x1="45" y1="50" x2="40" y2="340" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
          <line x1="105" y1="50" x2="110" y2="340" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
        </g>

        {/* Montjuïc Communications Tower (Santiago Calatrava Leaning Needle) */}
        <g transform="translate(240, 200)">
          <path d="M60,320 C50,240 20,160 -10,120 L20,135 C40,170 65,240 75,320 Z" fill="#2d1209" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Inclined Sundial Needle Spire */}
          <line x1="-10" y1="120" x2="35" y2="0" stroke="#fef08a" strokeWidth="3" />
          <circle cx="35" cy="0" r="3.5" fill="#fef08a" />
        </g>

        {/* Circuit de Barcelona-Catalunya Scoreboard Tower & Main Straight */}
        <g transform="translate(1180, 240)">
          {/* Iconic Multi-Level Scoreboard Column */}
          <rect x="0" y="60" width="36" height="260" fill="#180703" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Digital Position Numbers running down tower */}
          {[80, 110, 140, 170, 200, 230, 260].map((sy, i) => (
            <rect key={i} x="6" y={sy} width="24" height="18" rx="2" fill="#030101" stroke="#ef4444" strokeWidth="1" />
          ))}
        </g>

        {/* Track Surface & Turn 1 Elf Chicane Red/Yellow Kerbs */}
        <g>
          <path
            d="M-50,690 C340,590 660,650 990,580 C1220,530 1380,590 1490,570"
            fill="none"
            stroke="#0a0302"
            strokeWidth="90"
          />
          <path
            d="M520,630 C720,650 920,610 1120,575"
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
          />
          <path
            d="M520,630 C720,650 920,610 1120,575"
            fill="none"
            stroke="#facc15"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },

  // =========================================================================
  // 7. MONACO - CIRCUIT DE MONACO (MONTE CARLO)
  // =========================================================================
  {
    round: 7,
    name: 'Monaco Grand Prix',
    circuitName: 'Circuit de Monaco',
    city: 'Monte Carlo',
    country: 'Monaco',
    flag: '🇲🇨',
    continent: 'Europe',
    primaryAccent: '#dc2626',
    secondaryAccent: '#f87171',
    trackType: 'Historic Harbor Street Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="mcoSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040206" />
            <stop offset="45%" stopColor="#160614" />
            <stop offset="85%" stopColor="#240a1e" />
            <stop offset="100%" stopColor="#050106" />
          </linearGradient>
          <linearGradient id="mcoCopperDome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="60%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#042f2e" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#mcoSky)" />

        {/* Steep Maritime Alps Cliffs (Tête de Chien Rock Promontory) */}
        <path
          d="M0,420 Q240,280 540,360 Q820,260 1140,340 Q1320,300 1440,380 L1440,810 L0,810 Z"
          fill="#140612"
        />

        {/* Tiered Luxury Cliffside Apartments with Cantilevered Balconies */}
        <g transform="translate(80, 200)">
          {[
            { x: 40, y: 120, w: 90, h: 140 },
            { x: 145, y: 80, w: 110, h: 180 },
            { x: 270, y: 140, w: 85, h: 120 },
            { x: 1120, y: 90, w: 100, h: 170 },
            { x: 1235, y: 130, w: 95, h: 130 },
          ].map((bld, idx) => (
            <g key={idx}>
              <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} fill="#210a1c" stroke="#dc2626" strokeWidth="1" />
              {/* Balcony Railings */}
              {[20, 50, 80, 110].map((by) => (
                <line
                  key={by}
                  x1={bld.x + 4}
                  y1={bld.y + by}
                  x2={bld.x + bld.w - 4}
                  y2={bld.y + by}
                  stroke="#fb7185"
                  strokeWidth="1.2"
                />
              ))}
            </g>
          ))}
        </g>

        {/* Iconic Casino de Monte-Carlo (Beaux-Arts Classical Facade & Turquoise Copper Domes) */}
        <g transform="translate(560, 140)">
          {/* Main Neoclassical Palace Block */}
          <rect x="0" y="110" width="320" height="180" fill="#2d0a22" stroke="#dc2626" strokeWidth="1.5" />
          {/* Portico with Classical Columns and Triangular Pediment */}
          <polygon points="100,110 160,60 220,110" fill="#4c0519" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="110" y="110" width="100" height="8" fill="#fef08a" />
          {[120, 140, 160, 180, 200].map((cx) => (
            <line key={cx} x1={cx} y1="118" x2={cx} y2="180" stroke="#fef08a" strokeWidth="2.5" />
          ))}

          {/* West Turquoise Ribbed Cupola Dome */}
          <path d="M30,110 C30,60 55,40 75,40 C95,40 120,60 120,110 Z" fill="url(#mcoCopperDome)" stroke="#5eead4" strokeWidth="1.5" />
          <line x1="75" y1="40" x2="75" y2="18" stroke="#fef08a" strokeWidth="2.5" />
          <circle cx="75" cy="18" r="3.5" fill="#fef08a" />

          {/* East Turquoise Ribbed Cupola Dome */}
          <path d="M200,110 C200,60 225,40 245,40 C265,40 290,60 290,110 Z" fill="url(#mcoCopperDome)" stroke="#5eead4" strokeWidth="1.5" />
          <line x1="245" y1="40" x2="245" y2="18" stroke="#fef08a" strokeWidth="2.5" />
          <circle cx="245" cy="18" r="3.5" fill="#fef08a" />
        </g>

        {/* Port Hercule Marina & Superyachts (Tri-Deck Luxury Vessels) */}
        <g transform="translate(180, 360)">
          {/* Luxury Mega-Yacht 1 */}
          <path d="M40,110 L280,110 L240,150 L60,150 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M90,80 L230,80 L220,110 L80,110 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
          <path d="M120,55 L190,55 L180,80 L110,80 Z" fill="#334155" stroke="#f8fafc" strokeWidth="1" />
          {/* Radar Arch & Satellite Domes */}
          <line x1="150" y1="55" x2="150" y2="35" stroke="#f8fafc" strokeWidth="2" />
          <circle cx="150" cy="35" r="4" fill="#ffffff" />
          <circle cx="138" cy="42" r="3" fill="#ffffff" />
          <circle cx="162" cy="42" r="3" fill="#ffffff" />
        </g>

        {/* Port Hercule Blue Mediterranean Waters with Reflections */}
        <ellipse cx="720" cy="540" rx="800" ry="120" fill="#070c18" opacity="0.9" />

        {/* Fairmont Hairpin / Nouvelle Chicane Asphalt Ribbon & Kerbing */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#070208"
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
  // 8. MONZA, ITALY - AUTODROMO NAZIONALE MONZA
  // =========================================================================
  {
    round: 8,
    name: 'Italian Grand Prix',
    circuitName: 'Autodromo Nazionale Monza',
    city: 'Monza',
    country: 'Italy',
    flag: '🇮🇹',
    continent: 'Europe',
    primaryAccent: '#16a34a',
    secondaryAccent: '#4ade80',
    trackType: 'Temple of Speed',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="mnzSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020804" />
            <stop offset="45%" stopColor="#081e0e" />
            <stop offset="85%" stopColor="#0d3017" />
            <stop offset="100%" stopColor="#030904" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#mnzSky)" />

        {/* Royal Park of Monza (Centuries-old dense Italian oak forest ridge) */}
        <g fill="#041208">
          <path d="M0,520 Q320,440 680,480 Q1040,430 1440,500 L1440,810 L0,810 Z" />
          {/* Canopy Texture of Royal Oaks */}
          {[60, 140, 220, 300, 380, 460, 540, 620, 700, 780, 860, 940, 1020, 1100, 1180, 1260, 1340].map((ox) => (
            <circle key={ox} cx={ox} cy="460" r="45" fill="#061c0d" opacity="0.8" />
          ))}
        </g>

        {/* The Legendary 1922 Steep Concrete Banking Oval (Pista di Alta Velocità) */}
        <g transform="translate(180, 140)">
          {/* Massive 30-Degree Reinforced Concrete Tilted Banking Arc */}
          <path
            d="M0,320 C180,180 480,120 840,160 C980,180 1100,240 1200,320 L1200,360 C1100,280 980,220 840,200 C480,160 180,220 0,360 Z"
            fill="#0f2615"
            stroke="#16a34a"
            strokeWidth="2"
          />
          {/* Heavy Concrete Support Bents and Pillars underneath Banking */}
          {[120, 260, 400, 540, 680, 820, 960, 1100].map((px) => (
            <g key={px}>
              <line x1={px} y1="200" x2={px} y2="340" stroke="#1f4428" strokeWidth="8" />
              <line x1={px} y1="200" x2={px} y2="340" stroke="#4ade80" strokeWidth="1" opacity="0.6" />
            </g>
          ))}
          {/* Historic Steel Armco Safety Barriers on Upper Rim */}
          <path
            d="M0,320 C180,180 480,120 840,160 C980,180 1100,240 1200,320"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeDasharray="12 6"
            opacity="0.8"
          />
        </g>

        {/* Historic Neoclassical Royal Villa of Monza (Villa Reale) in Far Distance */}
        <g transform="translate(740, 180)" opacity="0.6">
          <rect x="-80" y="80" width="160" height="90" fill="#091f10" stroke="#4ade80" strokeWidth="1" />
          <polygon points="-40,80 0,45 40,80" fill="#143b1e" stroke="#fef08a" strokeWidth="1" />
          <line x1="0" y1="45" x2="0" y2="25" stroke="#fef08a" strokeWidth="2" />
        </g>

        {/* Curva Parabolica & Prima Variante Asphalt Ribbon with Tricolore Kerbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#020804"
            strokeWidth="90"
          />
          {/* Italian Red & White Kerbs */}
          <path
            d="M560,630 C740,650 920,610 1120,575"
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
          />
          <path
            d="M560,630 C740,650 920,610 1120,575"
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
  // 9. SPIELBERG, AUSTRIA - RED BULL RING
  // =========================================================================
  {
    round: 9,
    name: 'Austrian Grand Prix',
    circuitName: 'Red Bull Ring',
    city: 'Spielberg',
    country: 'Austria',
    flag: '🇦🇹',
    continent: 'Europe',
    primaryAccent: '#2563eb',
    secondaryAccent: '#ef4444',
    trackType: 'Alpine Power Circuit',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="atSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#02040a" />
            <stop offset="45%" stopColor="#081024" />
            <stop offset="85%" stopColor="#0d1b3e" />
            <stop offset="100%" stopColor="#03060f" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#atSky)" />

        {/* Sharp Styrian Alps Mountain Peaks (Austrian Alpine Backdrop) */}
        <path
          d="M0,450 L140,240 L280,360 L420,180 L580,310 L760,140 L940,290 L1120,160 L1280,270 L1440,210 L1440,810 L0,810 Z"
          fill="#0c1730"
          stroke="#1e3a8a"
          strokeWidth="1.5"
        />
        {/* Snow-Capped Alpine Ridges */}
        <polygon points="400,200 420,180 440,200 430,225 410,225" fill="#ffffff" opacity="0.9" />
        <polygon points="730,165 760,140 790,165 780,195 745,195" fill="#ffffff" opacity="0.95" />
        <polygon points="1095,180 1120,160 1145,180 1135,210 1105,210" fill="#ffffff" opacity="0.9" />

        {/* Rolling Green Alpine Foothills & Fir Pine Forests */}
        <path
          d="M0,540 Q340,430 720,490 Q1100,420 1440,510 L1440,810 L0,810 Z"
          fill="#060c18"
        />

        {/* Massive 18-Meter Steel Arch Bull of Spielberg Sculpture */}
        <g transform="translate(680, 230)">
          {/* Kinetic Steel Arch Ring (Elliptical Archway) */}
          <ellipse cx="40" cy="80" rx="95" ry="95" fill="none" stroke="#dc2626" strokeWidth="8" />
          <ellipse cx="40" cy="80" rx="85" ry="85" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

          {/* Skeletal Steel Bull Silhouette (Muscular Head & Swept Horns) */}
          <g fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.8">
            {/* Bull Body & Spine */}
            <path d="M-40,110 C-30,60 10,40 50,45 C90,50 110,80 120,110 Z" />
            {/* Bull Head */}
            <polygon points="20,45 60,45 40,15" />
            {/* Arching Golden Horns */}
            <path d="M25,25 C10,0 5,-20 -15,-30" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M55,25 C70,0 75,-20 95,-30" fill="none" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Red Bull Ring Remus Turn 3 Hillside Asphalt with Austrian Red/White Kerbs */}
        <g>
          <path
            d="M-50,680 C360,590 680,660 1020,580 C1240,530 1380,590 1490,570"
            fill="none"
            stroke="#040812"
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
  // 10. SPA-FRANCORCHAMPS, BELGIUM - EAU ROUGE & RAIDILLON
  // =========================================================================
  {
    round: 10,
    name: 'Belgian Grand Prix',
    circuitName: 'Circuit de Spa-Francorchamps',
    city: 'Stavelot',
    country: 'Belgium',
    flag: '🇧🇪',
    continent: 'Europe',
    primaryAccent: '#dc2626',
    secondaryAccent: '#f59e0b',
    trackType: 'Ardennes Forest Rollercoaster',
    renderArtwork: () => (
      <svg viewBox="0 0 1440 810" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="spaSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#040508" />
            <stop offset="45%" stopColor="#0c111a" />
            <stop offset="85%" stopColor="#151d2c" />
            <stop offset="100%" stopColor="#06090e" />
          </linearGradient>
        </defs>

        {/* Sky Base */}
        <rect width="1440" height="810" fill="url(#spaSky)" />

        {/* Dense Ardennes Pine Forest Canopy Hillsides (Multi-Layered Silhouettes) */}
        <g fill="#070c14">
          <path d="M0,480 Q320,380 680,420 Q1060,340 1440,430 L1440,810 L0,810 Z" />
          {/* Individual Pine Tree Spires */}
          {[40, 80, 130, 170, 220, 260, 310, 360, 410, 720, 770, 820, 880, 930, 980, 1040, 1100, 1160, 1220, 1280].map((tx) => (
            <polygon key={tx} points={`${tx},420 ${tx + 8},385 ${tx + 16},420`} fill="#0b1320" />
          ))}
        </g>

        {/* Historic Eau Rouge Chalet Control Tower (Red Brick & Steep Pitched Timber Roof) */}
        <g transform="translate(420, 260)">
          {/* Main Chalet Body */}
          <rect x="0" y="70" width="75" height="90" fill="#2d1008" stroke="#ef4444" strokeWidth="1.2" />
          {/* Steep Ardennes Pitched Roof */}
          <polygon points="-12,70 37,15 87,70" fill="#450a0a" stroke="#f87171" strokeWidth="1.5" />
          {/* Timber Balcony & Windows */}
          <rect x="15" y="85" width="45" height="10" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
          <line x1="37" y1="15" x2="37" y2="-5" stroke="#fef08a" strokeWidth="2" />
        </g>

        {/* Raidillon Covered Grandstand (Curved Steel Cantilever Portal Frames) */}
        <g transform="translate(860, 220)">
          <path
            d="M0,140 C60,40 160,30 280,60 L270,90 C160,65 70,75 20,155 Z"
            fill="#1e293b"
            stroke="#f59e0b"
            strokeWidth="1.8"
          />
          {/* Steel Support Pylons */}
          {[40, 90, 140, 190, 240].map((px) => (
            <line key={px} x1={px} y1="75" x2={px} y2="160" stroke="#475569" strokeWidth="3" />
          ))}
        </g>

        {/* Steep 17% Elevation Uphill Climb of Raidillon & Curbs */}
        <g>
          {/* Ascending Eau Rouge Ribbon */}
          <path
            d="M-50,680 C320,620 540,540 760,410 C920,310 1140,280 1440,270"
            fill="none"
            stroke="#05080d"
            strokeWidth="85"
          />
          {/* Yellow & Red Kerb Edge */}
          <path
            d="M520,555 C700,450 860,355 1060,305"
            fill="none"
            stroke="#eab308"
            strokeWidth="10"
          />
          <path
            d="M520,555 C700,450 860,355 1060,305"
            fill="none"
            stroke="#dc2626"
            strokeWidth="10"
            strokeDasharray="18 18"
          />
        </g>
      </svg>
    ),
  },
];
