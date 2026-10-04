import React from 'react';

export interface GroundTrophy {
  id: string;
  round: number;
  circuitName: string;
  gpName: string;
  country: string;
  flag: string;
  position: 1 | 2 | 3;
  driverName: string;
}

interface TeamCelebrationGraphicProps {
  teamName: string;
  primaryColor?: string;
  secondaryColor?: string;
  driver1Name: string;
  driver2Name: string;
  driver1Flag?: string;
  driver2Flag?: string;
  strategistName?: string;
  pitCrewName?: string;
  groundTrophies: GroundTrophy[];
  selectedTrophyId?: string | null;
  onSelectTrophy?: (trophy: GroundTrophy) => void;
  isChampagneSpraying?: boolean;
  winningDriverName?: string;
  cinematicPhase?: string;
}

export const TeamCelebrationGraphic: React.FC<TeamCelebrationGraphicProps> = ({
  teamName,
  primaryColor = '#DC2626',
  secondaryColor = '#111827',
  driver1Name,
  driver2Name,
  driver1Flag = '🇬🇧',
  driver2Flag = '🇲🇨',
  strategistName = 'Alex Vance',
  pitCrewName = 'Marco Rossi',
  groundTrophies,
  selectedTrophyId,
  onSelectTrophy,
  isChampagneSpraying = true,
}) => {
  const d1Short = driver1Name.split(' ')[0] || 'Driver 1';
  const d2Short = driver2Name.split(' ')[0] || 'Driver 2';

  return (
    <div className="w-full relative overflow-hidden select-none bg-[#05080e] rounded-2xl">
      <svg
        viewBox="0 0 1200 700"
        className="w-full h-auto drop-shadow-2xl"
        style={{ maxHeight: '74vh' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* =================================================================== */}
          {/* CSS KEYFRAME ANIMATIONS (SAFE INNER GROUPS)                         */}
          {/* =================================================================== */}
          <style>{`
            @keyframes bobA { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
            @keyframes bobB { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
            @keyframes bobC { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
            @keyframes armFistUpA { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
            @keyframes armFistUpB { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
            @keyframes wrenchRock { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-18deg); } }
            @keyframes flagClothWave { 0%, 100% { transform: rotate(0deg) skewY(0deg); } 50% { transform: rotate(8deg) skewY(4deg); } }
            @keyframes sprayWave { 0%, 100% { opacity: 0.8; stroke-width: 10px; } 50% { opacity: 1; stroke-width: 14px; } }
            @keyframes bubbleDrift1 { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-120px, -60px); opacity: 0; } }
            @keyframes bubbleDrift2 { 0% { transform: translate(0, 0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-150px, -80px); opacity: 0; } }
            @keyframes cupShineSweep { 0%, 100% { transform: translateX(-40px); opacity: 0.15; } 50% { transform: translateX(40px); opacity: 0.9; } }
            @keyframes spotPulseLeft { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            @keyframes spotPulseRight { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
            @keyframes carEngineVibe { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-1px); } }
            @keyframes neonGlow { 0%, 100% { opacity: 0.45; } 50% { opacity: 0.8; } }
            @keyframes rainLedFlash { 0%, 48%, 100% { opacity: 1; fill: #ef4444; } 50%, 98% { opacity: 0.1; fill: #7f1d1d; } }
            @keyframes confettiDrift { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-7px); } }

            .anim-car-inner { animation: carEngineVibe 0.22s linear infinite; }
            .anim-neon-pulse { animation: neonGlow 2.5s ease-in-out infinite; }
            .anim-rain-led { animation: rainLedFlash 0.5s step-end infinite; }
            .anim-bob-a { animation: bobA 3.2s ease-in-out infinite; }
            .anim-bob-b { animation: bobB 2.8s ease-in-out infinite; }
            .anim-bob-c { animation: bobC 3.0s ease-in-out infinite; }
            .anim-fist-d1 { animation: armFistUpA 1.8s ease-in-out infinite; }
            .anim-fist-d2 { animation: armFistUpB 1.9s ease-in-out infinite; }
            .anim-fist-eng { animation: armFistUpA 1.6s ease-in-out infinite; }
            .anim-wrench-rock { animation: wrenchRock 2.2s ease-in-out infinite; transform-origin: 0px 0px; }
            .anim-flag-cloth { animation: flagClothWave 2.8s ease-in-out infinite; transform-origin: 0px 0px; }
            .anim-spray-flow { animation: sprayWave 1.2s ease-in-out infinite; }
            .anim-bubble-1 { animation: bubbleDrift1 1.8s linear infinite; }
            .anim-bubble-2 { animation: bubbleDrift2 2.2s linear infinite 0.7s; }
            .anim-cup-gleam { animation: cupShineSweep 3.2s ease-in-out infinite; }
            .anim-spotlight-l { animation: spotPulseLeft 4s ease-in-out infinite; }
            .anim-spotlight-r { animation: spotPulseRight 4s ease-in-out infinite; }
            .anim-confetti-float { animation: confettiDrift 3.5s ease-in-out infinite; }
          `}</style>

          {/* =================================================================== */}
          {/* 3D METALLIC REALISTIC TROPHY GRADIENTS                              */}
          {/* =================================================================== */}
          {/* High-Definition 3D Gold Cylinder for Realistic Chalice Bowl */}
          <linearGradient id="realGoldCylinder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="12%" stopColor="#B45309" />
            <stop offset="28%" stopColor="#F59E0B" />
            <stop offset="48%" stopColor="#FEF08A" />
            <stop offset="55%" stopColor="#FFFFFF" />
            <stop offset="68%" stopColor="#FDE047" />
            <stop offset="85%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Gold Handle Curved Gradient */}
          <linearGradient id="goldHandleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Deep Marble Pedestal Gradient */}
          <linearGradient id="marblePedestal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="25%" stopColor="#1C2541" />
            <stop offset="50%" stopColor="#3A506B" />
            <stop offset="75%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>

          {/* High-Definition 3D Silver Cylinder for P2 Cups */}
          <linearGradient id="realSilverCylinder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="15%" stopColor="#64748B" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="85%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* High-Definition 3D Bronze Cylinder for P3 Cups */}
          <linearGradient id="realBronzeCylinder" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C2D12" />
            <stop offset="15%" stopColor="#C2410C" />
            <stop offset="35%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#FFEDD5" />
            <stop offset="65%" stopColor="#FED7AA" />
            <stop offset="85%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          {/* Team Livery Gradient */}
          <linearGradient id="teamLiveryGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>

          {/* Fabric Suit Sleeve Gradients */}
          <linearGradient id="sleeveFabricPrim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="25%" stopColor={primaryColor} />
            <stop offset="65%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="sleeveFabricDark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="80%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Hair Gradients */}
          <linearGradient id="hairDarkBrown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#291102" />
            <stop offset="100%" stopColor="#120600" />
          </linearGradient>
          <linearGradient id="hairBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="hairChestnut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9a3412" />
            <stop offset="60%" stopColor="#7c2d12" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>
          <linearGradient id="hairBlonde" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>

          {/* Carbon Fiber Texture Pattern */}
          <pattern id="carbonWeave" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#0f172a" />
            <rect width="3" height="3" fill="#1e293b" />
            <rect x="3" y="3" width="3" height="3" fill="#1e293b" />
          </pattern>

          {/* Spotlights */}
          <linearGradient id="spotLightL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="spotLightR" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>

          {/* Champagne Spray Gradient */}
          <linearGradient id="champagneSprayGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#FDE047" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
          </linearGradient>

          {/* Tarmac Floor Gradient */}
          <linearGradient id="tarmacFloorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#182234" />
            <stop offset="35%" stopColor="#0f1624" />
            <stop offset="100%" stopColor="#070a10" />
          </linearGradient>
        </defs>

        {/* =================================================================== */}
        {/* 1. BACKGROUND: HIGH-TECH PADDOCK GARAGE & CELEBRATION FLOODLIGHTS   */}
        {/* =================================================================== */}
        <rect x="0" y="0" width="1200" height="470" fill="#090d16" />

        {/* Structural Garage Wall Panels */}
        <g stroke="#1e293b" strokeWidth="1.5" opacity="0.6">
          <line x1="120" y1="0" x2="120" y2="470" />
          <line x1="260" y1="0" x2="260" y2="470" />
          <line x1="400" y1="0" x2="400" y2="470" />
          <line x1="600" y1="0" x2="600" y2="470" />
          <line x1="800" y1="0" x2="800" y2="470" />
          <line x1="940" y1="0" x2="940" y2="470" />
          <line x1="1080" y1="0" x2="1080" y2="470" />
          <line x1="0" y1="130" x2="1200" y2="130" />
          <line x1="0" y1="260" x2="1200" y2="260" />
        </g>

        {/* Garage Hazard Dado Striping */}
        <g opacity="0.4">
          <rect x="0" y="455" width="1200" height="15" fill="#eab308" />
          {Array.from({ length: 50 }).map((_, i) => (
            <polygon
              key={`h-stripe-${i}`}
              points={`${i * 25},470 ${i * 25 + 13},455 ${i * 25 + 21},455 ${i * 25 + 8},470`}
              fill="#0f172a"
            />
          ))}
        </g>

        {/* Overhead Gantry Lights */}
        <rect x="0" y="0" width="1200" height="26" fill="#06090e" />
        <rect x="60" y="24" width="1080" height="6" fill="#334155" />
        {[180, 320, 460, 600, 740, 880, 1020].map((lx) => (
          <g key={`head-light-${lx}`}>
            <rect x={lx - 16} y="22" width="32" height="10" rx="3" fill="#cbd5e1" />
            <ellipse cx={lx} cy="30" rx="12" ry="4" fill="#fef08a" />
          </g>
        ))}

        {/* Dynamic Sweeping Stadium Spotlights */}
        <g className="anim-spotlight-l">
          <polygon points="180,25 -20,470 380,470" fill="url(#spotLightL)" />
        </g>
        <g className="anim-spotlight-r">
          <polygon points="1020,25 820,470 1220,470" fill="url(#spotLightR)" />
        </g>

        {/* Giant Backlit Team Victory Header Banner */}
        <g transform="translate(600, 85)" textAnchor="middle">
          <rect
            x="-400"
            y="-40"
            width="800"
            height="80"
            rx="14"
            fill="#090d14"
            stroke={primaryColor}
            strokeWidth="3"
            opacity="0.96"
          />
          <rect x="-392" y="-32" width="784" height="64" rx="10" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="8 5" opacity="0.8" />
          <text x="-330" y="10" fontSize="28">🏆</text>
          <text x="330" y="10" fontSize="28">🏆</text>
          <text x="0" y="-10" fill="#FBBF24" fontSize="13" fontFamily="'Chakra Petch', monospace" fontWeight="bold" letterSpacing="4">
            ★ FIA FORMULA 1 WORLD CHAMPIONS 2026 ★
          </text>
          <text x="0" y="23" fill="#FFFFFF" fontSize="27" fontFamily="'Rajdhani', sans-serif" fontWeight="900" letterSpacing="3">
            {teamName.toUpperCase()}
          </text>
        </g>

        {/* =================================================================== */}
        {/* 2. THE HIGH-DETAIL FORMULA 1 CAR (PARKED IN REAR CENTER)            */}
        {/* =================================================================== */}
        <g id="highDetailF1Car" transform="translate(600, 310)">
          <g className="anim-car-inner">
            <ellipse cx="0" cy="90" rx="340" ry="24" fill={primaryColor} className="anim-neon-pulse" />

            <rect x="-200" y="-60" width="400" height="15" rx="3" fill="#020617" stroke="#475569" strokeWidth="1.5" />
            <rect x="-180" y="-50" width="360" height="10" rx="2" fill="url(#teamLiveryGrad)" />
            <rect x="-10" y="-66" width="20" height="16" rx="2" fill="#eab308" stroke="#000000" strokeWidth="1" />
            <path d="M-210,-72 L-190,-72 L-190,-5 L-210,0 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="1.2" />
            <path d="M210,-72 L190,-72 L190,-5 L210,0 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="1.2" />
            {[-55, -40, -25].map((sy) => (
              <line key={`slit-l-${sy}`} x1="-205" y1={sy} x2="-195" y2={sy} stroke="#cbd5e1" strokeWidth="1.5" />
            ))}
            {[-55, -40, -25].map((sy) => (
              <line key={`slit-r-${sy}`} x1="195" y1={sy} x2="205" y2={sy} stroke="#cbd5e1" strokeWidth="1.5" />
            ))}

            <g transform="translate(-250, -20)">
              <rect x="0" y="0" width="50" height="105" rx="12" fill="#090d14" stroke="#1e293b" strokeWidth="2" />
              <rect x="6" y="8" width="8" height="88" rx="4" fill="#ef4444" />
              <text x="10" y="55" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" transform="rotate(-90, 10, 55)">
                P-ZERO
              </text>
            </g>
            <g transform="translate(200, -20)">
              <rect x="0" y="0" width="50" height="105" rx="12" fill="#090d14" stroke="#1e293b" strokeWidth="2" />
              <rect x="36" y="8" width="8" height="88" rx="4" fill="#ef4444" />
              <text x="40" y="55" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" transform="rotate(90, 40, 55)">
                P-ZERO
              </text>
            </g>

            <path
              d="M-175,45 L-130,-15 L-65,-30 L65,-30 L130,-15 L175,45 L130,70 L-130,70 Z"
              fill="url(#teamLiveryGrad)"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <rect x="-160" y="60" width="320" height="12" fill="url(#carbonWeave)" stroke="#334155" strokeWidth="1" />
            <ellipse cx="-100" cy="20" rx="20" ry="12" fill="#020617" stroke="#475569" strokeWidth="1.5" />
            <ellipse cx="100" cy="20" rx="20" ry="12" fill="#020617" stroke="#475569" strokeWidth="1.5" />

            <ellipse cx="0" cy="2" rx="46" ry="28" fill="#020617" stroke="#64748b" strokeWidth="1.5" />
            <g transform="translate(0, 14)">
              <rect x="-18" y="-6" width="36" height="14" rx="3" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="-12" cy="0" r="1.8" fill="#22c55e" />
              <circle cx="-6" cy="0" r="1.8" fill="#22c55e" />
              <circle cx="0" cy="0" r="1.8" fill="#eab308" />
              <circle cx="6" cy="0" r="1.8" fill="#ef4444" />
              <circle cx="12" cy="0" r="1.8" fill="#3b82f6" />
            </g>
            <path
              d="M-40,16 C-28,-22, 28,-22, 40,16 L0,-16 Z"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <line x1="0" y1="-16" x2="0" y2="12" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />

            <path
              d="M-42,50 L-18,88 L18,88 L42,50 Z"
              fill={primaryColor}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <line x1="0" y1="88" x2="0" y2="98" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <circle cx="0" cy="64" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <text x="0" y="70" fill="#DC2626" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="middle">1</text>

            <path d="M-230,76 L230,76 L210,92 L-210,92 Z" fill={primaryColor} stroke="#ffffff" strokeWidth="1.5" />
            <path d="M-215,84 L215,84" stroke="#f59e0b" strokeWidth="3.5" />
            <rect x="-238" y="62" width="10" height="32" rx="2" fill="url(#carbonWeave)" stroke="#94a3b8" strokeWidth="1" />
            <rect x="228" y="62" width="10" height="32" rx="2" fill="url(#carbonWeave)" stroke="#94a3b8" strokeWidth="1" />

            <g transform="translate(-200, 32)">
              <rect x="0" y="0" width="42" height="70" rx="9" fill="#090d14" stroke="#1e293b" strokeWidth="2" />
              <circle cx="21" cy="35" r="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="21" cy="35" r="5" fill="#f59e0b" />
            </g>
            <g transform="translate(158, 32)">
              <rect x="0" y="0" width="42" height="70" rx="9" fill="#090d14" stroke="#1e293b" strokeWidth="2" />
              <circle cx="21" cy="35" r="14" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="21" cy="35" r="5" fill="#f59e0b" />
            </g>

            <rect x="-9" y="85" width="18" height="10" rx="3" fill="#000000" stroke="#475569" strokeWidth="1" />
            <circle cx="0" cy="90" r="4" className="anim-rain-led" />
          </g>
        </g>

        {/* =================================================================== */}
        {/* 3. TARMAC STAGE FLOOR                                               */}
        {/* =================================================================== */}
        <polygon points="0,465 1200,465 1200,700 0,700" fill="url(#tarmacFloorGrad)" />
        <line x1="80" y1="540" x2="1120" y2="540" stroke="#eab308" strokeWidth="2" strokeDasharray="14 10" opacity="0.5" />

        {/* =================================================================== */}
        {/* 4. THE FULL TEAM: HAIR ON EVERYONE + SLEEVES ON ARMS + FACES!       */}
        {/* =================================================================== */}

        {/* ------------------------------------------------------------------- */}
        {/* 1. MECHANIC 1 (FAR LEFT) - Hair, Sleeved Arm with Wrench, Face      */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-mech-1" transform="translate(180, 400)">
          <g className="anim-bob-a">
            {/* Overalls Body */}
            <rect x="-22" y="44" width="44" height="92" rx="9" fill="url(#sleeveFabricDark)" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="44" x2="0" y2="105" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="-16" y="55" width="14" height="12" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <rect x="-20" y="132" width="17" height="52" rx="4" fill="#0f172a" />
            <rect x="3" y="132" width="17" height="52" rx="4" fill="#0f172a" />
            <rect x="-24" y="178" width="22" height="12" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="0.8" />
            <rect x="2" y="178" width="22" height="12" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="0.8" />

            {/* Complete Face with Natural Skin Tone */}
            <ellipse cx="0" cy="22" rx="17" ry="19" fill="#fcd34d" stroke="#d97706" strokeWidth="1" />
            {/* FULL HAIR: Stylish Brown Wavy Hair under Team Cap */}
            <path d="M-19,16 Q-22,30 -16,34 Q-14,24 -17,16 Z" fill="url(#hairDarkBrown)" />
            <path d="M19,16 Q22,30 16,34 Q14,24 17,16 Z" fill="url(#hairDarkBrown)" />
            {/* Team Cap with Realistic Visor */}
            <path d="M-18,17 Q0,-2 18,17 Q12,5 -18,17 Z" fill={primaryColor} />
            <path d="M-10,15 L18,11 L25,16 L-8,19 Z" fill="#000000" opacity="0.4" />
            {/* Complete Facial Features */}
            {/* Eyebrows */}
            <path d="M-10,15 Q-6,12 -2,15" stroke="#451a03" strokeWidth="2" fill="none" />
            <path d="M2,15 Q6,12 10,15" stroke="#451a03" strokeWidth="2" fill="none" />
            {/* Eyes with Pupils and Catchlights */}
            <ellipse cx="-6" cy="20" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="-5" cy="19" r="1" fill="#ffffff" />
            <ellipse cx="6" cy="20" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="7" cy="19" r="1" fill="#ffffff" />
            {/* Nose */}
            <path d="M0,21 L-1.5,25 L1.5,25" stroke="#b45309" strokeWidth="1.2" fill="none" />
            {/* Smiling Mouth with Teeth */}
            <path d="M-7,27 Q0,35 7,27 Z" fill="#b91c1c" />
            <path d="M-5,27 Q0,30 5,27" stroke="#ffffff" strokeWidth="2.5" fill="none" />

            {/* SLEEVED ARM with Wrench (Full Fabric Sleeve + Glove) */}
            {/* Upper Sleeve & Forearm Sleeve */}
            <path d="M-20,55 L-36,18 L-30,-20" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
            <path d="M-20,55 L-36,18 L-30,-20" stroke={primaryColor} strokeWidth="3" fill="none" strokeDasharray="6 4" />
            {/* Glove Cuff & Hand */}
            <rect x="-35" y="-23" width="10" height="7" rx="2" fill="#1e293b" />
            <circle cx="-30" cy="-21" r="5" fill="#fcd34d" />
            {/* Wrench with Animation */}
            <g transform="translate(-30, -25)">
              <g className="anim-wrench-rock">
                <rect x="-4" y="-22" width="8" height="44" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
                <circle cx="0" cy="-22" r="9" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
              </g>
            </g>

            {/* Right Arm with Sleeve Resting on Hip */}
            <path d="M20,55 L35,80 L22,95" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="22" cy="95" r="5" fill="#fcd34d" />
            <text x="0" y="124" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">MECH 1</text>
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 2. RACE ENGINEER (LEFT) - Wavy Hair, Sleeved Double Fists, Face     */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-engineer" transform="translate(285, 385)">
          <g className="anim-bob-b">
            {/* Jumper Body */}
            <rect x="-24" y="44" width="48" height="94" rx="9" fill="url(#sleeveFabricDark)" stroke={primaryColor} strokeWidth="1.8" />
            <path d="M-24,44 L0,78 L24,44" fill="none" stroke={primaryColor} strokeWidth="3.5" />
            <rect x="-16" y="86" width="32" height="10" rx="2" fill="#000000" opacity="0.7" />
            <text x="0" y="93.5" fill="#38BDF8" fontSize="6.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ENG-DATA</text>
            <rect x="-21" y="134" width="18" height="54" rx="4" fill="#0f172a" />
            <rect x="3" y="134" width="18" height="54" rx="4" fill="#0f172a" />
            <rect x="-25" y="180" width="23" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />
            <rect x="2" y="180" width="23" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />

            {/* Complete Face */}
            <ellipse cx="0" cy="20" rx="17" ry="19" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            {/* FULL HAIR: Stylish Modern Messy/Wavy Hair */}
            <path d="M-18,14 Q-12,-4 0,-4 Q12,-4 18,14 Q12,2 0,2 Q-12,2 -18,14 Z" fill="url(#hairBlack)" />
            <path d="M-18,14 Q-22,24 -16,28" stroke="#0f172a" strokeWidth="3" fill="none" />
            <path d="M18,14 Q22,24 16,28" stroke="#0f172a" strokeWidth="3" fill="none" />
            {/* Facial Features */}
            <path d="M-11,13 Q-6,9 -1,13" stroke="#0f172a" strokeWidth="2" fill="none" />
            <path d="M1,13 Q6,9 11,13" stroke="#0f172a" strokeWidth="2" fill="none" />
            <ellipse cx="-6" cy="18" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="-5" cy="17" r="1" fill="#ffffff" />
            <ellipse cx="6" cy="18" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="7" cy="17" r="1" fill="#ffffff" />
            {/* Big Shouting Victory Smile with Teeth */}
            <ellipse cx="0" cy="27" rx="7" ry="6" fill="#991b1b" stroke="#fde68a" strokeWidth="1" />
            <rect x="-5" y="23" width="10" height="3" rx="1" fill="#ffffff" />

            {/* SLEEVED ARMS: Double Fist Pumps with Full Team Fabric Sleeves */}
            <g className="anim-fist-eng">
              {/* Left Sleeved Arm */}
              <path d="M-22,55 L-40,16 L-34,-16" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
              <path d="M-22,55 L-40,16 L-34,-16" stroke={primaryColor} strokeWidth="3" fill="none" />
              <circle cx="-34" cy="-18" r="6" fill="#fde68a" stroke="#d97706" strokeWidth="1" />

              {/* Right Sleeved Arm */}
              <path d="M22,55 L40,16 L34,-16" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
              <path d="M22,55 L40,16 L34,-16" stroke={primaryColor} strokeWidth="3" fill="none" />
              <circle cx="34" cy="-18" r="6" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            </g>
            <text x="0" y="124" fill="#38BDF8" fontSize="8" fontFamily="monospace" textAnchor="middle">ENGINEER</text>
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 3. KNEELING MECHANIC LEFT - Hair, Sleeved Arms, Complete Face       */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-kneeling-left" transform="translate(370, 445)">
          <g className="anim-bob-c">
            <rect x="-20" y="35" width="40" height="70" rx="7" fill="url(#sleeveFabricDark)" stroke="#475569" strokeWidth="1.5" />
            <path d="M-18,95 L-35,128 L-10,142" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" />
            <path d="M18,95 L30,138 L5,142" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" />

            {/* Complete Face */}
            <ellipse cx="0" cy="16" rx="15" ry="16" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            {/* FULL HAIR: Stylish Crop Haircut */}
            <path d="M-15,10 Q-10,-4 0,-4 Q10,-4 15,10 Q8,0 -15,10 Z" fill="url(#hairDarkBrown)" />
            <path d="M-15,10 Q-18,18 -14,22" stroke="#451a03" strokeWidth="2.5" fill="none" />
            <path d="M15,10 Q18,18 14,22" stroke="#451a03" strokeWidth="2.5" fill="none" />
            {/* Eyes & Cheerful Smile */}
            <ellipse cx="-5" cy="15" rx="2.5" ry="2.8" fill="#1e293b" />
            <ellipse cx="5" cy="15" rx="2.5" ry="2.8" fill="#1e293b" />
            <path d="M-5,22 Q0,28 5,22 Z" fill="#b91c1c" />
            <path d="M-3,22 Q0,24 3,22" stroke="#ffffff" strokeWidth="1.5" fill="none" />

            {/* SLEEVED ARMS: Celebrating Open Arms with Sleeves */}
            <path d="M-18,45 L-42,28 L-52,14" stroke="url(#sleeveFabricDark)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="-52" cy="14" r="5" fill="#fde68a" />
            <path d="M18,45 L40,32 L50,18" stroke="url(#sleeveFabricDark)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="18" r="5" fill="#fde68a" />
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 4. CHIEF STRATEGIST (LEFT OF DRIVER 1) - Hair, Headset, Sleeves     */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-strategist" transform="translate(445, 370)">
          <g className="anim-bob-a">
            {/* Paddock Jacket */}
            <rect x="-24" y="44" width="48" height="98" rx="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="-12,44 0,66 12,44" fill={primaryColor} />
            <rect x="-20" y="138" width="18" height="54" rx="4" fill="#0f172a" />
            <rect x="2" y="138" width="18" height="54" rx="4" fill="#0f172a" />
            <rect x="-24" y="184" width="23" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />
            <rect x="2" y="184" width="23" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />

            {/* Complete Face */}
            <ellipse cx="0" cy="20" rx="17" ry="19" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
            {/* FULL HAIR: Professional Side-Part Haircut */}
            <path d="M-17,14 Q-8,-4 0,-4 Q10,-2 17,14 Q8,2 0,0 Q-10,2 -17,14 Z" fill="url(#hairDarkBrown)" />
            <path d="M-17,14 Q-20,24 -15,26" stroke="#451a03" strokeWidth="2.5" fill="none" />
            {/* Pitwall Radio Headset with Antenna */}
            <rect x="-20" y="12" width="6" height="16" rx="2" fill="#38bdf8" />
            <rect x="14" y="12" width="6" height="16" rx="2" fill="#38bdf8" />
            <path d="M-18,12 C-18,-4, 18,-4, 18,12" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="-19" y1="12" x2="-25" y2="-6" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M-16,24 L-4,28" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            {/* Facial Features */}
            <path d="M-10,14 Q-6,11 -2,14" stroke="#451a03" strokeWidth="2" fill="none" />
            <path d="M2,14 Q6,11 10,14" stroke="#451a03" strokeWidth="2" fill="none" />
            <ellipse cx="-6" cy="19" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="-5" cy="18" r="1" fill="#ffffff" />
            <ellipse cx="6" cy="19" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="7" cy="18" r="1" fill="#ffffff" />
            <path d="M-6,27 Q0,34 6,27 Z" fill="#b91c1c" />
            <path d="M-4,27 Q0,30 4,27" stroke="#ffffff" strokeWidth="2" fill="none" />

            {/* SLEEVED ARMS: Full Paddock Jacket Sleeves */}
            {/* Left Arm holding Tablet */}
            <path d="M-22,55 L-36,92 L-18,98" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" />
            <circle cx="-18" cy="98" r="5" fill="#fed7aa" />
            <rect x="-42" y="80" width="22" height="28" rx="3" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" />
            <path d="M-38,98 L-32,90 L-26,94 L-22,86" stroke="#22c55e" strokeWidth="1.5" fill="none" />

            {/* Right Arm Pumping Fist with Full Sleeve */}
            <path d="M22,55 L40,30 L48,-2" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" />
            <circle cx="48" cy="-4" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
            <text x="0" y="126" fill="#38BDF8" fontSize="8" fontFamily="monospace" textAnchor="middle">
              {strategistName.split(' ')[0].toUpperCase()}
            </text>
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 5 & 6. (CENTER): THE TWO DRIVERS - FULL SUIT SLEEVES, HAIR, FACES   */}
        {/* ------------------------------------------------------------------- */}

        {/* DRIVER 1 (CENTER-LEFT) */}
        <g id="char-driver-1" transform="translate(535, 350)">
          <g className="anim-bob-b">
            {/* Racing Suit Torso */}
            <rect x="-26" y="44" width="52" height="106" rx="9" fill="url(#sleeveFabricPrim)" stroke="#ffffff" strokeWidth="2" />
            <rect x="-28" y="44" width="10" height="16" rx="2" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
            <rect x="18" y="44" width="10" height="16" rx="2" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
            <rect x="-20" y="60" width="16" height="8" rx="1.5" fill="#ffffff" />
            <rect x="4" y="60" width="16" height="8" rx="1.5" fill="#f59e0b" />
            <rect x="-26" y="106" width="52" height="8" fill="#1e293b" />
            <rect x="-6" y="105" width="12" height="10" rx="1.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <line x1="-12" y1="44" x2="-12" y2="106" stroke="#ffffff" strokeWidth="2.5" />

            {/* Suit Legs */}
            <rect x="-23" y="146" width="20" height="62" rx="5" fill={primaryColor} stroke="#ffffff" strokeWidth="1" />
            <rect x="3" y="146" width="20" height="62" rx="5" fill={primaryColor} stroke="#ffffff" strokeWidth="1" />
            <line x1="-13" y1="146" x2="-13" y2="204" stroke="#ffffff" strokeWidth="2" />
            <line x1="13" y1="146" x2="13" y2="204" stroke="#ffffff" strokeWidth="2" />
            <rect x="-27" y="200" width="26" height="14" rx="4" fill="#0f172a" stroke="#ffffff" strokeWidth="1.2" />
            <rect x="2" y="200" width="26" height="14" rx="4" fill="#0f172a" stroke="#ffffff" strokeWidth="1.2" />

            {/* Complete Face */}
            <ellipse cx="0" cy="18" rx="18" ry="20" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.2" />
            {/* FULL HAIR: Stylish Champion Haircut with Volume and Textured Bangs */}
            <path d="M-18,12 Q-10,-6 0,-6 Q12,-6 18,12 Q8,0 -2,0 Q-10,0 -18,12 Z" fill="url(#hairDarkBrown)" />
            <path d="M-18,12 Q-22,22 -16,26" stroke="#451a03" strokeWidth="3" fill="none" />
            <path d="M18,12 Q22,22 16,26" stroke="#451a03" strokeWidth="3" fill="none" />
            {/* Eyes, Eyebrows & Champion Smile */}
            <path d="M-11,12 Q-6,8 -1,12" stroke="#451a03" strokeWidth="2" fill="none" />
            <path d="M1,12 Q6,8 11,12" stroke="#451a03" strokeWidth="2" fill="none" />
            <ellipse cx="-6" cy="17" rx="3.2" ry="3.8" fill="#1e293b" />
            <circle cx="-5" cy="16" r="1.2" fill="#ffffff" />
            <ellipse cx="6" cy="17" rx="3.2" ry="3.8" fill="#1e293b" />
            <circle cx="7" cy="16" r="1.2" fill="#ffffff" />
            <path d="M-8,24 Q0,35 8,24 Z" fill="#b91c1c" />
            <path d="M-6,24 Q0,29 6,24" stroke="#ffffff" strokeWidth="3" fill="none" />

            {/* FULL SLEEVED ARMS IN TEAM RACING SUIT */}
            {/* Left Arm Raised High: Full Sleeve in Team Primary Color with Sponsor Stripe + Racing Glove */}
            <g className="anim-fist-d1">
              <path d="M-26,55 L-48,18 L-50,-26" stroke="url(#sleeveFabricPrim)" strokeWidth="14" strokeLinecap="round" />
              <path d="M-26,55 L-48,18 L-50,-26" stroke="#ffffff" strokeWidth="3" fill="none" />
              {/* Racing Glove at wrist */}
              <rect x="-56" y="-32" width="12" height="12" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
              <circle cx="-50" cy="-26" r="6" fill="#fed7aa" />
            </g>

            {/* Right Arm: Full Racing Suit Sleeve Reaching to Grip Trophy Handle */}
            <path d="M22,60 L45,65 L66,70" stroke="url(#sleeveFabricPrim)" strokeWidth="14" strokeLinecap="round" />
            <path d="M22,60 L45,65 L66,70" stroke="#ffffff" strokeWidth="3" fill="none" />
            {/* Leather Racing Glove Wrapping Firmly on Cup Handle */}
            <rect x="60" y="64" width="10" height="12" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="66" cy="70" r="5" fill="#f59e0b" />

            <rect x="-35" y="126" width="70" height="15" rx="3" fill="#000000" opacity="0.88" />
            <text x="0" y="137" fill="#FFD700" fontSize="10" fontFamily="'Rajdhani', sans-serif" fontWeight="bold" textAnchor="middle">
              👑 {d1Short}
            </text>
          </g>
        </g>

        {/* DRIVER 2 (CENTER-RIGHT) */}
        <g id="char-driver-2" transform="translate(665, 350)">
          <g className="anim-bob-b">
            {/* Racing Suit Torso */}
            <rect x="-26" y="44" width="52" height="106" rx="9" fill="url(#sleeveFabricPrim)" stroke="#ffffff" strokeWidth="2" />
            <rect x="-28" y="44" width="10" height="16" rx="2" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
            <rect x="18" y="44" width="10" height="16" rx="2" fill="#000000" stroke="#f59e0b" strokeWidth="1" />
            <rect x="-20" y="60" width="16" height="8" rx="1.5" fill="#ffffff" />
            <rect x="4" y="60" width="16" height="8" rx="1.5" fill="#f59e0b" />
            <rect x="-26" y="106" width="52" height="8" fill="#1e293b" />
            <rect x="-6" y="105" width="12" height="10" rx="1.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            <line x1="12" y1="44" x2="12" y2="106" stroke="#ffffff" strokeWidth="2.5" />

            {/* Suit Legs */}
            <rect x="-23" y="146" width="20" height="62" rx="5" fill={primaryColor} stroke="#ffffff" strokeWidth="1" />
            <rect x="3" y="146" width="20" height="62" rx="5" fill={primaryColor} stroke="#ffffff" strokeWidth="1" />
            <line x1="-13" y1="146" x2="-13" y2="204" stroke="#ffffff" strokeWidth="2" />
            <line x1="13" y1="146" x2="13" y2="204" stroke="#ffffff" strokeWidth="2" />
            <rect x="-27" y="200" width="26" height="14" rx="4" fill="#0f172a" stroke="#ffffff" strokeWidth="1.2" />
            <rect x="2" y="200" width="26" height="14" rx="4" fill="#0f172a" stroke="#ffffff" strokeWidth="1.2" />

            {/* Complete Face */}
            <ellipse cx="0" cy="18" rx="18" ry="20" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
            {/* FULL HAIR: Stylish Modern Fade Haircut */}
            <path d="M-18,12 Q-10,-6 0,-6 Q12,-6 18,12 Q8,0 -2,0 Q-10,0 -18,12 Z" fill="url(#hairBlack)" />
            <path d="M-18,12 Q-22,22 -16,26" stroke="#020617" strokeWidth="3" fill="none" />
            <path d="M18,12 Q22,22 16,26" stroke="#020617" strokeWidth="3" fill="none" />
            {/* Facial Features */}
            <path d="M-11,12 Q-6,8 -1,12" stroke="#020617" strokeWidth="2" fill="none" />
            <path d="M1,12 Q6,8 11,12" stroke="#020617" strokeWidth="2" fill="none" />
            <ellipse cx="-6" cy="17" rx="3.2" ry="3.8" fill="#1e293b" />
            <circle cx="-5" cy="16" r="1.2" fill="#ffffff" />
            <ellipse cx="6" cy="17" rx="3.2" ry="3.8" fill="#1e293b" />
            <circle cx="7" cy="16" r="1.2" fill="#ffffff" />
            <path d="M-8,24 Q0,35 8,24 Z" fill="#b91c1c" />
            <path d="M-6,24 Q0,29 6,24" stroke="#ffffff" strokeWidth="3" fill="none" />

            {/* FULL SLEEVED ARMS IN TEAM RACING SUIT */}
            {/* Left Arm: Full Racing Suit Sleeve Reaching to Grip Right Trophy Handle */}
            <path d="M-22,60 L-45,65 L-66,70" stroke="url(#sleeveFabricPrim)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-22,60 L-45,65 L-66,70" stroke="#ffffff" strokeWidth="3" fill="none" />
            {/* Leather Racing Glove Wrapping Firmly on Cup Handle */}
            <rect x="-70" y="64" width="10" height="12" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="-66" cy="70" r="5" fill="#f59e0b" />

            {/* Right Arm Raised High: Full Sleeve in Team Primary Color + Racing Glove */}
            <g className="anim-fist-d2">
              <path d="M26,55 L48,18 L50,-26" stroke="url(#sleeveFabricPrim)" strokeWidth="14" strokeLinecap="round" />
              <path d="M26,55 L48,18 L50,-26" stroke="#ffffff" strokeWidth="3" fill="none" />
              <rect x="44" y="-32" width="12" height="12" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="1" />
              <circle cx="50" cy="-26" r="6" fill="#fde68a" />
            </g>

            <rect x="-35" y="126" width="70" height="15" rx="3" fill="#000000" opacity="0.88" />
            <text x="0" y="137" fill="#FFFFFF" fontSize="10" fontFamily="'Rajdhani', sans-serif" fontWeight="bold" textAnchor="middle">
              {d2Short}
            </text>
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* THE REALISTIC 3D FORMULA 1 WORLD CHAMPIONSHIP TROPHY CUP            */}
        {/*    - Authentic fluted chalice goblet with realistic cylindrical 3D  */}
        {/*    - Sculpted ornate volumetric handles                             */}
        {/*    - Tiered dark marble plinth base with gold plaque                */}
        {/* ------------------------------------------------------------------- */}
        <g id="grand-cup-held" transform="translate(600, 385)">
          <g className="anim-bob-b">
            {/* Radiant Ambient Spotlight Glow behind Cup */}
            <circle cx="0" cy="30" r="85" fill="#fef08a" opacity="0.45" />

            {/* REALISTIC 3D ORNATE SCULPTED HANDLES (Left & Right) */}
            {/* Left Volumetric Curved Handle */}
            <path
              d="M-38,6 C-88,6 -88,78 -35,82 C-55,62 -52,28 -30,18 Z"
              fill="url(#goldHandleGrad)"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            <path
              d="M-42,14 C-76,18 -76,68 -38,74"
              stroke="#FEF08A"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Right Volumetric Curved Handle */}
            <path
              d="M38,6 C88,6 88,78 35,82 C55,62 52,28 30,18 Z"
              fill="url(#goldHandleGrad)"
              stroke="#78350F"
              strokeWidth="2.5"
            />
            <path
              d="M42,14 C76,18 76,68 38,74"
              stroke="#FEF08A"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* REALISTIC 3D CHALICE GOBLET (FLUTED BODY) */}
            {/* Upper Flared Rim with Cylindrical Lip */}
            <ellipse cx="0" cy="-6" rx="46" ry="10" fill="url(#realGoldCylinder)" stroke="#FEF08A" strokeWidth="2" />
            <ellipse cx="0" cy="-8" rx="42" ry="7" fill="#78350F" opacity="0.6" />

            {/* Main Trophy Chalice Bowl */}
            <path
              d="M-46,-6 C-46,45 -34,80 0,94 C34,80 46,45 46,-6 Z"
              fill="url(#realGoldCylinder)"
              stroke="#78350F"
              strokeWidth="2.5"
            />

            {/* Embossed Relief Laurel Wreath Ribbon wrapping the bowl */}
            <path
              d="M-40,40 C-20,54 20,54 40,40 C20,48 -20,48 -40,40 Z"
              fill="#FEF08A"
              stroke="#B45309"
              strokeWidth="1.5"
            />
            <circle cx="0" cy="46" r="14" fill="url(#realGoldCylinder)" stroke="#78350F" strokeWidth="1.5" />
            <polygon
              points="0,36 3.5,44 12,44 5,49 8,57 0,52 -8,57 -5,49 -12,44 -3.5,44"
              fill="#FFFFFF"
            />

            {/* Specular Light Sweep Glint */}
            <g className="anim-cup-gleam">
              <ellipse cx="0" cy="38" rx="10" ry="46" fill="#FFFFFF" opacity="0.75" transform="rotate(-25, 0, 38)" />
            </g>

            {/* Trumpet Stem & Collar Rings */}
            <rect x="-12" y="94" width="24" height="12" rx="3" fill="url(#realGoldCylinder)" stroke="#78350F" strokeWidth="1" />
            <ellipse cx="0" cy="94" rx="14" ry="4" fill="#FEF08A" />
            <rect x="-8" y="106" width="16" height="14" fill="url(#realGoldCylinder)" stroke="#78350F" strokeWidth="1" />
            <ellipse cx="0" cy="120" rx="20" ry="5" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />

            {/* HEAVY MULTI-TIERED MARBLE PEDESTAL BASE */}
            <polygon points="-36,125 36,125 44,142 -44,142" fill="url(#marblePedestal)" stroke="#FEF08A" strokeWidth="2" />
            <rect x="-46" y="142" width="92" height="18" rx="2" fill="#0B132B" stroke="#B45309" strokeWidth="1.5" />

            {/* Engraved Championship Gold Plaque on Marble */}
            <rect x="-38" y="145" width="76" height="12" rx="2" fill="url(#realGoldCylinder)" stroke="#78350F" strokeWidth="1" />
            <text x="0" y="154" fill="#451a03" fontSize="7.5" fontWeight="900" fontFamily="monospace" textAnchor="middle">
              WORLD CHAMPION 2026
            </text>

            {/* Star Sparkle Glints */}
            <text x="-36" y="0" fontSize="22">✨</text>
            <text x="30" y="-8" fontSize="22">✨</text>
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 7. PIT CREW CHIEF - Hair under Cap, Sleeved Arms, Face              */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-crew-chief" transform="translate(755, 370)">
          <g className="anim-bob-a">
            {/* Overalls */}
            <rect x="-24" y="44" width="48" height="98" rx="9" fill="url(#sleeveFabricDark)" stroke={primaryColor} strokeWidth="2" />
            <rect x="-20" y="138" width="18" height="54" rx="4" fill="#0f172a" />
            <rect x="2" y="138" width="18" height="54" rx="4" fill="#0f172a" />
            <rect x="-24" y="184" width="23" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />
            <rect x="2" y="184" width="23" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />

            {/* Complete Face */}
            <ellipse cx="0" cy="20" rx="17" ry="19" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            {/* FULL HAIR: Stylish Crop Hair under Cap with Sideburns */}
            <path d="M-17,14 Q-8,-4 0,-4 Q10,-4 17,14 Q8,2 -17,14 Z" fill="url(#hairBlack)" />
            <path d="M-17,14 Q-20,24 -15,26" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            <path d="M17,14 Q20,24 15,26" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            {/* Team Cap with 3D Visor */}
            <path d="M-16,14 Q0,-2 16,14 Z" fill={primaryColor} />
            <path d="M-6,12 L18,10 L24,14 L-4,16 Z" fill="#000000" opacity="0.4" />
            {/* Headset */}
            <rect x="-19" y="12" width="5" height="15" rx="2" fill="#eab308" />
            <rect x="14" y="12" width="5" height="15" rx="2" fill="#eab308" />
            {/* Complete Facial Features */}
            <path d="M-10,14 Q-6,11 -2,14" stroke="#0f172a" strokeWidth="2" fill="none" />
            <path d="M2,14 Q6,11 10,14" stroke="#0f172a" strokeWidth="2" fill="none" />
            <ellipse cx="-6" cy="19" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="-5" cy="18" r="1" fill="#ffffff" />
            <ellipse cx="6" cy="19" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="7" cy="18" r="1" fill="#ffffff" />
            <path d="M-6,26 Q0,33 6,26 Z" fill="#b91c1c" />
            <path d="M-4,26 Q0,29 4,26" stroke="#ffffff" strokeWidth="2" fill="none" />

            {/* SLEEVED ARMS: Team Fabric Sleeves */}
            {/* Left Arm around Driver 2 with Sleeve */}
            <path d="M-22,55 L-48,50 L-68,55" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="-68" cy="55" r="5" fill="#fde68a" />
            {/* Right Arm Thumbs Up with Sleeve */}
            <path d="M22,55 L44,38 L48,12" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="48" cy="9" r="6" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            <text x="0" y="126" fill="#eab308" fontSize="8" fontFamily="monospace" textAnchor="middle">
              {pitCrewName.split(' ')[0].toUpperCase()}
            </text>
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 8. KNEELING MECHANIC RIGHT - Hair, Sleeved Arms, Complete Face      */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-kneeling-right" transform="translate(830, 445)">
          <g className="anim-bob-c">
            <rect x="-20" y="35" width="40" height="70" rx="7" fill="url(#sleeveFabricDark)" stroke="#475569" strokeWidth="1.5" />
            <path d="M-18,95 L-30,138 L-5,142" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" />
            <path d="M18,95 L35,128 L10,142" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" />

            {/* Complete Face */}
            <ellipse cx="0" cy="16" rx="15" ry="16" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
            {/* FULL HAIR: Stylish Modern Side-Part Haircut */}
            <path d="M-15,10 Q-8,-4 0,-4 Q10,-4 15,10 Q6,0 -15,10 Z" fill="url(#hairDarkBrown)" />
            <path d="M-15,10 Q-18,18 -14,22" stroke="#451a03" strokeWidth="2.5" fill="none" />
            <path d="M15,10 Q18,18 14,22" stroke="#451a03" strokeWidth="2.5" fill="none" />
            {/* Facial Features */}
            <ellipse cx="-5" cy="15" rx="2.5" ry="2.8" fill="#1e293b" />
            <ellipse cx="5" cy="15" rx="2.5" ry="2.8" fill="#1e293b" />
            <path d="M-5,22 Q0,28 5,22 Z" fill="#b91c1c" />
            <path d="M-3,22 Q0,24 3,22" stroke="#ffffff" strokeWidth="1.5" fill="none" />

            {/* SLEEVED ARMS: Peace/Victory Sign with Sleeves */}
            <path d="M-18,45 L-36,28 L-44,14" stroke="url(#sleeveFabricDark)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="-44" cy="14" r="5" fill="#fed7aa" />
            <path d="M18,45 L36,28 L46,14" stroke="url(#sleeveFabricDark)" strokeWidth="12" strokeLinecap="round" />
            <circle cx="46" cy="14" r="5" fill="#fed7aa" />
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 9. CHAMPAGNE MECHANIC - Hair, Full Sleeved Arms, Complete Face      */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-champagne-mech" transform="translate(910, 385)">
          <g className="anim-bob-a">
            <rect x="-22" y="44" width="44" height="94" rx="9" fill="url(#sleeveFabricDark)" stroke={primaryColor} strokeWidth="1.8" />
            <rect x="-20" y="134" width="17" height="54" rx="4" fill="#0f172a" />
            <rect x="3" y="134" width="17" height="54" rx="4" fill="#0f172a" />
            <rect x="-24" y="180" width="22" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />
            <rect x="2" y="180" width="22" height="12" rx="3" fill="#020617" stroke="#ffffff" strokeWidth="0.8" />

            {/* Complete Face */}
            <ellipse cx="0" cy="20" rx="17" ry="19" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
            {/* FULL HAIR: Hair Tufts and Strands peeking under backward cap */}
            <path d="M-17,14 Q-22,24 -15,28" stroke="#451a03" strokeWidth="3" fill="none" />
            <path d="M17,14 Q22,24 15,28" stroke="#451a03" strokeWidth="3" fill="none" />
            <path d="M-17,16 Q0,-2 17,16" fill={primaryColor} />
            <rect x="-18" y="14" width="12" height="6" rx="2" fill={primaryColor} />
            {/* Facial Features */}
            <path d="M-10,14 Q-6,10 -2,14" stroke="#451a03" strokeWidth="2" fill="none" />
            <path d="M2,14 Q6,10 10,14" stroke="#451a03" strokeWidth="2" fill="none" />
            <ellipse cx="-6" cy="19" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="-5" cy="18" r="1" fill="#ffffff" />
            <ellipse cx="6" cy="19" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="7" cy="18" r="1" fill="#ffffff" />
            <path d="M-7,26 Q0,35 7,26 Z" fill="#b91c1c" />
            <path d="M-5,26 Q0,30 5,26" stroke="#ffffff" strokeWidth="2" fill="none" />

            {/* SLEEVED ARMS: Holding Magnum Champagne Bottle */}
            <path d="M-18,55 L-34,35 L-42,15" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="-42" cy="15" r="5" fill="#fde68a" />
            <path d="M18,55 L0,40 L-26,24" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="-26" cy="24" r="5" fill="#fde68a" />

            <g transform="translate(-42, 10) rotate(-45)">
              <rect x="-9" y="10" width="18" height="38" rx="4" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
              <rect x="-4" y="-8" width="8" height="18" fill="#14532d" />
              <rect x="-5" y="-6" width="10" height="10" fill="#facc15" />
              <circle cx="0" cy="-26" r="5" fill="#b45309" />
            </g>

            <g transform="translate(-56, -8)">
              <path
                d="M0,0 Q-40,-50 -100,-40 Q-160,-30 -220,-80 Q-280,-130 -350,-100"
                fill="none"
                stroke="url(#champagneSprayGrad)"
                strokeLinecap="round"
                className="anim-spray-flow"
              />
              <circle cx="-60" cy="-35" r="4" fill="#FEF08A" className="anim-bubble-1" />
              <circle cx="-140" cy="-45" r="5" fill="#FFFBEB" className="anim-bubble-2" />
            </g>

            <text x="0" y="124" fill="#22C55E" fontSize="8" fontFamily="monospace" textAnchor="middle">CHAMPAGNE</text>
          </g>
        </g>

        {/* ------------------------------------------------------------------- */}
        {/* 10. CHECKERED FLAG MECHANIC - Full Hair, Sleeved Arm, Complete Face */}
        {/* ------------------------------------------------------------------- */}
        <g id="char-flag-mech" transform="translate(1015, 395)">
          <g className="anim-bob-b">
            <rect x="-22" y="44" width="44" height="92" rx="9" fill="url(#sleeveFabricDark)" stroke="#475569" strokeWidth="1.5" />
            <rect x="-20" y="132" width="17" height="52" rx="4" fill="#0f172a" />
            <rect x="3" y="132" width="17" height="52" rx="4" fill="#0f172a" />
            <rect x="-24" y="176" width="22" height="12" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="0.8" />
            <rect x="2" y="176" width="22" height="12" rx="3" fill="#1e293b" stroke="#ffffff" strokeWidth="0.8" />

            {/* Complete Face */}
            <ellipse cx="0" cy="22" rx="16" ry="18" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
            {/* FULL HAIR: Stylish Modern Textured Haircut */}
            <path d="M-16,14 Q-8,-4 0,-4 Q10,-4 16,14 Q6,2 -16,14 Z" fill="url(#hairDarkBrown)" />
            <path d="M-16,14 Q-20,24 -15,28" stroke="#451a03" strokeWidth="2.5" fill="none" />
            <path d="M16,14 Q20,24 15,28" stroke="#451a03" strokeWidth="2.5" fill="none" />
            {/* Facial Features */}
            <path d="M-10,15 Q-6,11 -2,15" stroke="#451a03" strokeWidth="2" fill="none" />
            <path d="M2,15 Q6,11 10,15" stroke="#451a03" strokeWidth="2" fill="none" />
            <ellipse cx="-6" cy="21" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="-5" cy="20" r="1" fill="#ffffff" />
            <ellipse cx="6" cy="21" rx="3" ry="3.5" fill="#1e293b" />
            <circle cx="7" cy="20" r="1" fill="#ffffff" />
            <path d="M-6,28 Q0,36 6,28 Z" fill="#b91c1c" />
            <path d="M-4,28 Q0,32 4,28" stroke="#ffffff" strokeWidth="2" fill="none" />

            {/* SLEEVED ARM: Arm Raising Flag Pole has Full Fabric Sleeve */}
            <path d="M-18,55 L-30,24 L-25,-12" stroke="url(#sleeveFabricDark)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="-25" cy="-12" r="5" fill="#fed7aa" />
            <line x1="-25" y1="60" x2="-25" y2="-95" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />

            <g transform="translate(-25, -95)">
              <g className="anim-flag-cloth">
                <rect x="0" y="0" width="86" height="58" fill="#ffffff" stroke="#1e293b" strokeWidth="1.2" />
                {[0, 1, 2].map((row) =>
                  [0, 1, 2, 3].map((col) => {
                    const isBlack = (row + col) % 2 === 0;
                    if (!isBlack) return null;
                    return (
                      <rect
                        key={`ch-flag-${row}-${col}`}
                        x={col * 21.5}
                        y={row * 19.3}
                        width="21.5"
                        height="19.3"
                        fill="#0f172a"
                      />
                    );
                  })
                )}
              </g>
            </g>

            <text x="0" y="125" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle">CHECKERED</text>
          </g>
        </g>

        {/* =================================================================== */}
        {/* 5. "และมีถ้วยจากแต่ละสนามอยู่บนพื้น"                                */}
        {/*    REALISTIC 3D CHALICE TROPHIES FOR ALL CIRCUITS ON THE GROUND     */}
        {/* =================================================================== */}
        <g id="floor-trophies-row" transform="translate(0, 560)">
          {/* Ground Reflector Line */}
          <rect x="30" y="0" width="1140" height="2.5" fill="#eab308" opacity="0.75" />

          {groundTrophies.slice(0, 14).map((trophy, idx) => {
            const tx = 95 + idx * 78;
            const isSelected = selectedTrophyId === trophy.id;
            const cupCylinderGrad =
              trophy.position === 1
                ? 'url(#realGoldCylinder)'
                : trophy.position === 2
                ? 'url(#realSilverCylinder)'
                : 'url(#realBronzeCylinder)';

            const handleGrad =
              trophy.position === 1
                ? 'url(#goldHandleGrad)'
                : trophy.position === 2
                ? 'url(#realSilverCylinder)'
                : 'url(#realBronzeCylinder)';

            const rimStroke =
              trophy.position === 1
                ? '#FEF08A'
                : trophy.position === 2
                ? '#FFFFFF'
                : '#FED7AA';

            return (
              <g
                key={trophy.id}
                transform={`translate(${tx}, 0)`}
                className="cursor-pointer group"
                onClick={() => onSelectTrophy?.(trophy)}
              >
                {/* Spotlight on Selected Ground Trophy */}
                {isSelected && (
                  <ellipse cx="0" cy="85" rx="36" ry="10" fill="#f59e0b" opacity="0.7" />
                )}

                {/* Ground Shadow underneath the Base */}
                <ellipse cx="0" cy="82" rx="22" ry="5.5" fill="#000000" opacity="0.7" />

                {/* REALISTIC 3D GROUND TROPHY MODEL */}
                <g transform="translate(0, 16)">
                  {/* Two Curved Metallic Handles */}
                  <path
                    d="M-15,10 C-28,10 -28,32 -13,34 C-19,26 -17,16 -9,14 Z"
                    fill={handleGrad}
                    stroke="#1e293b"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M15,10 C28,10 28,32 13,34 C19,26 17,16 9,14 Z"
                    fill={handleGrad}
                    stroke="#1e293b"
                    strokeWidth="0.8"
                  />

                  {/* Chalice Flared Lip Rim */}
                  <ellipse cx="0" cy="5" rx="16" ry="3.5" fill={cupCylinderGrad} stroke={rimStroke} strokeWidth="1" />

                  {/* 3D Cylindrical Chalice Goblet Body */}
                  <path
                    d="M-16,5 C-16,26 -12,36 0,40 C12,36 16,26 16,5 Z"
                    fill={cupCylinderGrad}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />

                  {/* Center Laurel Line */}
                  <ellipse cx="0" cy="22" rx="4" ry="4" fill="#ffffff" opacity="0.4" />

                  {/* Stem & Knurled Collar */}
                  <rect x="-3.5" y="40" width="7" height="10" fill={cupCylinderGrad} stroke="#1e293b" strokeWidth="0.8" />
                  <ellipse cx="0" cy="50" rx="9" ry="2.5" fill={cupCylinderGrad} stroke={rimStroke} strokeWidth="0.8" />

                  {/* Weighted Solid Marble Pedestal Base */}
                  <polygon
                    points="-14,52 14,52 18,65 -18,65"
                    fill={isSelected ? '#090d16' : '#1e293b'}
                    stroke={trophy.position === 1 ? '#FEF08A' : trophy.position === 2 ? '#FFFFFF' : '#FB923C'}
                    strokeWidth={isSelected ? 2 : 1}
                  />

                  {/* Position Plaque on Base */}
                  <text
                    x="0"
                    y="63"
                    fill={trophy.position === 1 ? '#FFD700' : trophy.position === 2 ? '#FFFFFF' : '#FB923C'}
                    fontSize="7.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    P{trophy.position}
                  </text>
                </g>

                {/* Circuit Round & Name Label directly on Tarmac */}
                <text
                  x="0"
                  y="92"
                  fill="#94a3b8"
                  fontSize="7.5"
                  fontFamily="'Chakra Petch', monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  R{trophy.round}
                </text>
                <text
                  x="0"
                  y="102"
                  fill="#cbd5e1"
                  fontSize="7"
                  fontFamily="'Rajdhani', sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {trophy.circuitName.slice(0, 8)}
                </text>
              </g>
            );
          })}
        </g>

        {/* =================================================================== */}
        {/* 6. CONGRATULATORY CONFETTI (ANIMATED)                               */}
        {/* =================================================================== */}
        <g id="confetti-layer" className="anim-confetti-float" opacity="0.9">
          {[
            { x: 90, y: 130, r: 25, c: '#FFD700' },
            { x: 230, y: 80, r: -40, c: '#EF4444' },
            { x: 350, y: 150, r: 15, c: '#3B82F6' },
            { x: 490, y: 100, r: -20, c: '#10B981' },
            { x: 630, y: 70, r: 35, c: '#FFD700' },
            { x: 750, y: 140, r: -15, c: '#FFFFFF' },
            { x: 870, y: 110, r: 45, c: '#F59E0B' },
            { x: 1000, y: 85, r: -30, c: '#EC4899' },
            { x: 1130, y: 150, r: 10, c: '#3B82F6' },
            { x: 150, y: 310, r: 30, c: '#FFD700' },
            { x: 290, y: 280, r: -15, c: '#EF4444' },
            { x: 430, y: 340, r: 20, c: '#FFFFFF' },
            { x: 800, y: 310, r: -25, c: '#10B981' },
            { x: 950, y: 330, r: 40, c: '#FFD700' },
            { x: 1090, y: 290, r: -10, c: '#F59E0B' },
          ].map((cf, idx) => (
            <rect
              key={`confetti-${idx}`}
              x={cf.x}
              y={cf.y}
              width="10"
              height="18"
              rx="2.5"
              fill={cf.c}
              transform={`rotate(${cf.r}, ${cf.x + 5}, ${cf.y + 9})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
