import React from 'react';

interface CityGraphicBackdropProps {
  round: number;
  className?: string;
}

export const CityGraphicBackdrop: React.FC<CityGraphicBackdropProps> = ({ round, className = '' }) => {
  return (
    <div className={`w-full h-full absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-35 group-hover:opacity-60 transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fading bottom mask so text inside the card is always 100% readable */}
          <linearGradient id={`grad-card-${round}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="65%" stopColor="#000000" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* =================================================================== */}
        {/* ROUND 1: MELBOURNE, AUSTRALIA (Albert Park Lake & Eureka Skyline)   */}
        {/* =================================================================== */}
        {round === 1 && (
          <g>
            <rect width="200" height="120" fill="#042f2e" />
            {/* Distant Melbourne Skyline */}
            <path
              d="M0,120 L0,70 L25,70 L25,48 L35,48 L35,28 L38,20 L40,28 L40,75 L60,75 L60,52 L75,52 L75,38 L85,38 L85,75 L110,75 L110,42 L118,42 L118,32 L120,18 L122,32 L122,75 L145,75 L145,55 L160,55 L160,70 L180,70 L180,60 L200,60 L200,120 Z"
              fill="#0d9488"
              opacity="0.6"
            />
            {/* Albert Park Lake Palms & Water Line */}
            <ellipse cx="60" cy="100" rx="90" ry="16" fill="#14b8a6" opacity="0.3" />
            <path d="M165,120 Q168,85 174,75 Q160,72 152,78 Q174,74 176,68 Q182,72 192,75 Z" fill="#2dd4bf" opacity="0.7" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 2: SUZUKA, JAPAN (Giant Ferris Wheel, Pagoda & Mount Fuji)    */}
        {/* =================================================================== */}
        {round === 2 && (
          <g>
            <rect width="200" height="120" fill="#4c0519" />
            {/* Mount Fuji Slope in background */}
            <polygon points="40,120 120,25 125,25 200,120" fill="#f43f5e" opacity="0.25" />
            <polygon points="110,38 120,25 125,25 136,38 130,42 122,39 116,42" fill="#ffffff" opacity="0.6" />
            {/* Suzuka Iconic Ferris Wheel */}
            <g transform="translate(48, 62)">
              <circle cx="0" cy="0" r="26" fill="none" stroke="#fb7185" strokeWidth="2" opacity="0.8" />
              <circle cx="0" cy="0" r="16" fill="none" stroke="#fb7185" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
              <line x1="-26" y1="0" x2="26" y2="0" stroke="#fb7185" strokeWidth="1.2" opacity="0.6" />
              <line x1="0" y1="-26" x2="0" y2="26" stroke="#fb7185" strokeWidth="1.2" opacity="0.6" />
              <line x1="-18" y1="-18" x2="18" y2="18" stroke="#fb7185" strokeWidth="1" opacity="0.6" />
              <line x1="-18" y1="18" x2="18" y2="-18" stroke="#fb7185" strokeWidth="1" opacity="0.6" />
              <line x1="0" y1="0" x2="-14" y2="35" stroke="#fda4af" strokeWidth="2.5" />
              <line x1="0" y1="0" x2="14" y2="35" stroke="#fda4af" strokeWidth="2.5" />
            </g>
            {/* Japanese Pagoda Silhouette */}
            <path
              d="M150,120 L150,85 L142,85 L156,76 L144,76 L157,68 L147,68 L158,58 L158,48 L159,48 L159,58 L170,68 L160,68 L173,76 L161,76 L175,85 L167,85 L167,120 Z"
              fill="#e11d48"
              opacity="0.8"
            />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 3: SINGAPORE (Marina Bay Sands & Supertree Grove)             */}
        {/* =================================================================== */}
        {round === 3 && (
          <g>
            <rect width="200" height="120" fill="#3b0764" />
            {/* Marina Bay Sands (3 towers with curved Skypark surfboard roof) */}
            <g transform="translate(20, 20)">
              {/* 3 Towers */}
              <rect x="25" y="32" width="12" height="68" fill="#a855f7" opacity="0.8" />
              <rect x="45" y="30" width="12" height="70" fill="#c084fc" opacity="0.9" />
              <rect x="65" y="32" width="12" height="68" fill="#a855f7" opacity="0.8" />
              {/* SkyPark curved ship on top */}
              <path d="M15,30 C30,22, 70,22, 92,28 C85,34, 25,36, 15,30 Z" fill="#e9d5ff" opacity="0.9" />
            </g>
            {/* Supertree Grove Silhouettes */}
            <path d="M140,120 L140,78 Q130,55 120,48 Q140,55 140,78 Q140,55 160,48 Q150,55 140,78 Z" fill="#d8b4fe" opacity="0.75" />
            <path d="M172,120 L172,85 Q164,65 156,60 Q172,65 172,85 Q172,65 188,60 Q180,65 172,85 Z" fill="#c084fc" opacity="0.6" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 4: SAKHIR, BAHRAIN (World Trade Center Wind Turbines & Desert)*/}
        {/* =================================================================== */}
        {round === 4 && (
          <g>
            <rect width="200" height="120" fill="#451a03" />
            {/* Desert Dunes */}
            <path d="M0,90 Q60,65 130,85 Q170,95 200,80 L200,120 L0,120 Z" fill="#78350f" opacity="0.5" />
            <path d="M0,105 Q70,85 150,100 L200,92 L200,120 L0,120 Z" fill="#92400e" opacity="0.6" />
            {/* Bahrain World Trade Center Twin Spire Towers */}
            <g transform="translate(110, 15)">
              <polygon points="20,105 32,20 38,105" fill="#f59e0b" opacity="0.85" />
              <polygon points="52,105 40,20 34,105" fill="#d97706" opacity="0.7" />
              <polygon points="56,105 44,20 50,105" fill="#f59e0b" opacity="0.85" />
              {/* Sky bridges with wind turbines */}
              <line x1="33" y1="45" x2="43" y2="45" stroke="#fef08a" strokeWidth="2" />
              <line x1="34" y1="62" x2="44" y2="62" stroke="#fef08a" strokeWidth="2" />
              <line x1="35" y1="79" x2="45" y2="79" stroke="#fef08a" strokeWidth="2" />
              <circle cx="38" cy="45" r="3" fill="#ffffff" />
              <circle cx="39" cy="62" r="3" fill="#ffffff" />
              <circle cx="40" cy="79" r="3" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 5: BANGKOK, THAILAND (Wat Arun, Rama VIII Bridge & Mahanakhon) */}
        {/* =================================================================== */}
        {round === 5 && (
          <g>
            <rect width="200" height="120" fill="#1e1b4b" />
            {/* Chao Phraya River Twilight Glow */}
            <ellipse cx="100" cy="112" rx="100" ry="14" fill="#b45309" opacity="0.4" />
            {/* Rama VIII Cable-Stayed Bridge Silhouette */}
            <g transform="translate(15, 18)">
              {/* Inverted-Y Bridge Tower */}
              <line x1="28" y1="95" x2="35" y2="22" stroke="#f59e0b" strokeWidth="2.5" />
              <line x1="42" y1="95" x2="35" y2="22" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="35" cy="20" r="2.5" fill="#fef08a" />
              {/* Golden Stay Cables */}
              <line x1="35" y1="32" x2="65" y2="92" stroke="#fde047" strokeWidth="1" opacity="0.7" />
              <line x1="35" y1="45" x2="80" y2="92" stroke="#fde047" strokeWidth="1" opacity="0.6" />
              <line x1="35" y1="58" x2="95" y2="92" stroke="#fde047" strokeWidth="1" opacity="0.5" />
            </g>
            {/* King Power Mahanakhon 3D Pixelated Skyscraper */}
            <g transform="translate(155, 20)">
              <rect x="0" y="25" width="22" height="75" fill="#312e81" opacity="0.8" />
              <rect x="9" y="8" width="4" height="17" fill="#f59e0b" />
              {/* Pixel cutouts */}
              <rect x="2" y="38" width="6" height="5" fill="#fef08a" />
              <rect x="12" y="46" width="7" height="6" fill="#fef08a" />
              <rect x="5" y="62" width="8" height="6" fill="#fef08a" />
              <rect x="11" y="74" width="7" height="6" fill="#fef08a" />
            </g>
            {/* Wat Arun (Temple of Dawn) Central Prang & Satellite Chedis */}
            <g transform="translate(85, 24)">
              {/* Central Grand Prang */}
              <polygon points="20,95 24,18 36,18 40,95" fill="#f59e0b" opacity="0.95" />
              {/* Pointed Spire Trident (Nopphasun) */}
              <polygon points="27,18 30,5 33,18" fill="#fef08a" />
              <circle cx="30" cy="5" r="2" fill="#ffffff" />
              {/* Tiered Architectural Horizontal Bands */}
              <rect x="18" y="42" width="24" height="3" fill="#b45309" />
              <rect x="21" y="62" width="18" height="3" fill="#b45309" />
              <rect x="23" y="78" width="14" height="3" fill="#b45309" />
              {/* 2 Satellite Corner Chedis */}
              <polygon points="5,95 8,42 15,42 18,95" fill="#d97706" opacity="0.8" />
              <polygon points="10,42 11.5,30 13,42" fill="#fef08a" />
              <polygon points="42,95 45,42 52,42 55,95" fill="#d97706" opacity="0.8" />
              <polygon points="47,42 48.5,30 50,42" fill="#fef08a" />
            </g>
            {/* Chao Phraya River Water Shimmer */}
            <line x1="10" y1="106" x2="45" y2="106" stroke="#fde047" strokeWidth="1.5" opacity="0.6" />
            <line x1="60" y1="110" x2="110" y2="110" stroke="#fde047" strokeWidth="1.5" opacity="0.7" />
            <line x1="130" y1="107" x2="185" y2="107" stroke="#fde047" strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 6: BARCELONA, SPAIN (Sagrada Família Spires & Catalan Coast)  */}
        {/* =================================================================== */}
        {round === 6 && (
          <g>
            <rect width="200" height="120" fill="#431407" />
            {/* Sagrada Família Spires Silhouette */}
            <g transform="translate(70, 20)">
              {/* Central Tower */}
              <polygon points="25,100 30,15 35,100" fill="#ea580c" opacity="0.9" />
              <polygon points="38,100 42,22 46,100" fill="#f97316" opacity="0.8" />
              <polygon points="12,100 16,25 20,100" fill="#f97316" opacity="0.8" />
              <polygon points="48,100 52,32 55,100" fill="#ea580c" opacity="0.7" />
              <polygon points="4,100 7,32 10,100" fill="#ea580c" opacity="0.7" />
              {/* Basilica Spire Crosses */}
              <circle cx="30" cy="14" r="2.5" fill="#fef08a" />
              <circle cx="16" cy="24" r="2" fill="#fef08a" />
              <circle cx="42" cy="21" r="2" fill="#fef08a" />
            </g>
            {/* Montjuïc hills */}
            <path d="M0,120 Q40,85 90,95 Q140,105 200,90 L200,120 Z" fill="#9a3412" opacity="0.5" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 7: MONTE CARLO, MONACO (Casino Domes, Yachts & Harbor Hills)  */}
        {/* =================================================================== */}
        {round === 7 && (
          <g>
            <rect width="200" height="120" fill="#172554" />
            {/* Mediterranean Cliffside Hills */}
            <path d="M0,120 L0,40 Q60,35 120,60 Q170,50 200,75 L200,120 Z" fill="#1e3a8a" opacity="0.5" />
            {/* Monte Carlo Casino Domes */}
            <g transform="translate(30, 48)">
              <rect x="30" y="24" width="45" height="35" fill="#3b82f6" opacity="0.8" />
              <ellipse cx="38" cy="24" rx="8" ry="10" fill="#60a5fa" opacity="0.9" />
              <ellipse cx="68" cy="24" rx="8" ry="10" fill="#60a5fa" opacity="0.9" />
              <ellipse cx="53" cy="18" rx="10" ry="12" fill="#93c5fd" opacity="0.95" />
            </g>
            {/* Luxury Yacht Masts in Port Hercule */}
            <line x1="135" y1="110" x2="135" y2="65" stroke="#fef08a" strokeWidth="1.5" opacity="0.75" />
            <polygon points="135,68 148,88 135,88" fill="#fef08a" opacity="0.4" />
            <line x1="165" y1="110" x2="165" y2="72" stroke="#fef08a" strokeWidth="1.5" opacity="0.75" />
            <polygon points="165,75 176,92 165,92" fill="#fef08a" opacity="0.4" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 8: MONZA, ITALY (Milan Duomo Gothic Spires & Royal Park)      */}
        {/* =================================================================== */}
        {round === 8 && (
          <g>
            <rect width="200" height="120" fill="#052e16" />
            {/* Milan Cathedral Duomo Spires */}
            <g transform="translate(45, 25)">
              <polygon points="50,95 55,10 60,95" fill="#22c55e" opacity="0.9" />
              <polygon points="40,95 44,25 48,95" fill="#4ade80" opacity="0.8" />
              <polygon points="62,95 66,25 70,95" fill="#4ade80" opacity="0.8" />
              <polygon points="30,95 34,38 38,95" fill="#16a34a" opacity="0.75" />
              <polygon points="72,95 76,38 80,95" fill="#16a34a" opacity="0.75" />
              <polygon points="20,95 24,50 28,95" fill="#15803d" opacity="0.65" />
              <polygon points="82,95 86,50 90,95" fill="#15803d" opacity="0.65" />
              {/* Madonnina Golden Spire Top */}
              <circle cx="55" cy="9" r="2.5" fill="#fef08a" />
            </g>
            {/* Royal Park Tree Silhouettes */}
            <path d="M0,120 Q30,95 70,110 Q120,90 200,105 L200,120 Z" fill="#14532d" opacity="0.7" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 9: AUSTRIAN ALPS (Spielberg, Jagged Snow Alps & Bull Horns)   */}
        {/* =================================================================== */}
        {round === 9 && (
          <g>
            <rect width="200" height="120" fill="#022c22" />
            {/* Majestic Austrian Alps Peaks */}
            <polygon points="-10,120 40,25 80,120" fill="#047857" opacity="0.6" />
            <polygon points="40,25 48,45 35,45" fill="#ffffff" opacity="0.7" />
            <polygon points="50,120 110,15 160,120" fill="#059669" opacity="0.7" />
            <polygon points="110,15 120,40 102,40" fill="#ffffff" opacity="0.85" />
            <polygon points="130,120 180,30 220,120" fill="#10b981" opacity="0.5" />
            <polygon points="180,30 188,50 174,50" fill="#ffffff" opacity="0.7" />
            {/* Bull of Spielberg Sculpture Silhouette */}
            <path d="M140,90 Q150,75 165,70 Q155,80 152,90 Z" fill="#f59e0b" opacity="0.9" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 10: SPA-FRANCORCHAMPS (Eau Rouge Incline & Ardennes Forest)   */}
        {/* =================================================================== */}
        {round === 10 && (
          <g>
            <rect width="200" height="120" fill="#090d16" />
            {/* Steep Ardennes Pine Forest Ridge */}
            <polygon points="0,120 0,60 40,50 80,75 130,30 180,45 200,35 200,120" fill="#1e293b" opacity="0.7" />
            {/* Famous Eau Rouge Climbing Red-White Kerb S-Curve */}
            <path
              d="M10,120 Q60,95 90,80 Q120,65 140,35"
              fill="none"
              stroke="#ef4444"
              strokeWidth="5"
              opacity="0.8"
            />
            <path
              d="M12,120 Q62,95 92,80 Q122,65 142,35"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              opacity="0.9"
            />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 11: ZANDVOORT (Dutch Windmills, North Sea Dunes & Lighthouse) */}
        {/* =================================================================== */}
        {round === 11 && (
          <g>
            <rect width="200" height="120" fill="#451a03" />
            {/* Coastal Dunes */}
            <path d="M0,120 Q50,75 110,85 Q160,80 200,95 L200,120 Z" fill="#78350f" opacity="0.6" />
            {/* Traditional Dutch Windmill */}
            <g transform="translate(60, 45)">
              <polygon points="12,65 18,20 28,20 34,65" fill="#f59e0b" opacity="0.9" />
              <circle cx="23" cy="20" r="4" fill="#d97706" />
              {/* Rotating Blades */}
              <line x1="-5" y1="-8" x2="51" y2="48" stroke="#fef08a" strokeWidth="2.5" opacity="0.9" />
              <line x1="-5" y1="48" x2="51" y2="-8" stroke="#fef08a" strokeWidth="2.5" opacity="0.9" />
            </g>
            {/* Zandvoort Coastal Lighthouse */}
            <polygon points="160,105 163,55 169,55 172,105" fill="#ef4444" opacity="0.8" />
            <polygon points="163,70 169,70 168.5,80 163.5,80" fill="#ffffff" opacity="0.9" />
            <circle cx="166" cy="53" r="3" fill="#fef08a" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 12: SILVERSTONE, UK (Big Ben, London Eye & Silverstone Wing)  */}
        {/* =================================================================== */}
        {round === 12 && (
          <g>
            <rect width="200" height="120" fill="#0f172a" />
            {/* Silverstone Wing Paddock Curved Roof */}
            <path d="M10,85 C50,60 110,60 150,75 L150,85 Z" fill="#38bdf8" opacity="0.75" />
            {/* Big Ben Clock Tower Silhouette */}
            <g transform="translate(130, 25)">
              <rect x="25" y="30" width="16" height="65" fill="#0284c7" opacity="0.9" />
              <polygon points="23,30 33,8 43,30" fill="#0284c7" opacity="0.9" />
              <circle cx="33" cy="38" r="4" fill="#fef08a" opacity="0.95" />
            </g>
            {/* London Eye Wheel */}
            <circle cx="65" cy="55" r="22" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 13: MONTREAL, CANADA (Biosphère Dome & St Lawrence River)     */}
        {/* =================================================================== */}
        {round === 13 && (
          <g>
            <rect width="200" height="120" fill="#082f49" />
            {/* Montreal Biosphère Geodesic Dome */}
            <g transform="translate(80, 45)">
              <circle cx="30" cy="30" r="28" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.85" />
              <path d="M2,30 Q30,8 58,30 Q30,52 2,30 Z" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
              <line x1="30" y1="2" x2="30" y2="58" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
              <line x1="2" y1="30" x2="58" y2="30" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
            </g>
            {/* River & Olympic Tower Silhouette */}
            <path d="M0,120 Q50,95 100,105 Q150,115 200,100 L200,120 Z" fill="#0284c7" opacity="0.4" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 14: AUSTIN, USA (COTA 251-ft Red Tower & Texas Capitol)       */}
        {/* =================================================================== */}
        {round === 14 && (
          <g>
            <rect width="200" height="120" fill="#431407" />
            {/* COTA Iconic Observation Tower with Red Ribbons */}
            <g transform="translate(100, 15)">
              <line x1="30" y1="95" x2="30" y2="15" stroke="#ef4444" strokeWidth="4" />
              <ellipse cx="30" cy="18" rx="14" ry="4" fill="#fef08a" />
              {/* Sweeping red veil ribbons */}
              <path d="M30,18 Q50,45 65,95" fill="none" stroke="#dc2626" strokeWidth="3" opacity="0.9" />
              <path d="M30,18 Q55,55 75,95" fill="none" stroke="#ea580c" strokeWidth="2.5" opacity="0.8" />
            </g>
            {/* Texas Capitol Dome Silhouette */}
            <path d="M20,110 L20,80 L28,80 L35,62 L42,80 L50,80 L50,110 Z" fill="#f97316" opacity="0.7" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 15: LAS VEGAS, USA (The Sphere, Strip Casinos & Neon Glow)   */}
        {/* =================================================================== */}
        {round === 15 && (
          <g>
            <rect width="200" height="120" fill="#4a044e" />
            {/* The Vegas Sphere (Glowing illuminated dome) */}
            <g transform="translate(30, 42)">
              <ellipse cx="35" cy="35" rx="30" ry="26" fill="#ec4899" opacity="0.85" />
              <ellipse cx="35" cy="35" rx="24" ry="20" fill="#f43f5e" opacity="0.9" />
              <ellipse cx="35" cy="35" rx="16" ry="12" fill="#fef08a" opacity="0.95" />
            </g>
            {/* Las Vegas Strip Casino Towers & Replica Eiffel Tower */}
            <polygon points="120,120 128,45 136,120" fill="#a21caf" opacity="0.8" />
            <rect x="145" y="35" width="22" height="80" fill="#c026d3" opacity="0.75" />
            <rect x="175" y="55" width="18" height="60" fill="#e879f9" opacity="0.65" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 16: MEXICO CITY (Angel of Independence & Aztec Pyramid)       */}
        {/* =================================================================== */}
        {round === 16 && (
          <g>
            <rect width="200" height="120" fill="#451a03" />
            {/* Aztec Stepped Pyramid Base */}
            <polygon points="10,120 25,85 75,85 90,120" fill="#b45309" opacity="0.75" />
            <polygon points="30,85 40,65 60,65 70,85" fill="#d97706" opacity="0.85" />
            {/* Angel of Independence Column */}
            <g transform="translate(130, 15)">
              <rect x="22" y="30" width="8" height="75" fill="#f59e0b" opacity="0.9" />
              <ellipse cx="26" cy="30" rx="9" ry="3" fill="#fef08a" />
              {/* Winged Golden Angel */}
              <circle cx="26" cy="20" r="4" fill="#fef08a" />
              <path d="M26,20 Q12,12 10,22 Q20,20 26,22 Z" fill="#fef08a" />
              <path d="M26,20 Q40,12 42,22 Q32,20 26,22 Z" fill="#fef08a" />
            </g>
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 17: SÃO PAULO, BRAZIL (Ponte Estaiada X-Bridge & Skyline)     */}
        {/* =================================================================== */}
        {round === 17 && (
          <g>
            <rect width="200" height="120" fill="#052e16" />
            {/* São Paulo Dense High-Rise Skyline */}
            <path
              d="M0,120 L0,70 L20,70 L20,55 L35,55 L35,75 L50,75 L50,45 L65,45 L65,80 L90,80 L90,60 L110,60 L110,120 Z"
              fill="#166534"
              opacity="0.6"
            />
            {/* Ponte Estaiada X-Tower Cable-Stayed Bridge */}
            <g transform="translate(120, 20)">
              {/* X-Shaped Pylon Tower */}
              <line x1="20" y1="95" x2="45" y2="15" stroke="#22c55e" strokeWidth="4" />
              <line x1="45" y1="95" x2="20" y2="15" stroke="#22c55e" strokeWidth="4" />
              {/* Fan of Bridge Stay Cables */}
              <line x1="32" y1="45" x2="5" y2="90" stroke="#86efac" strokeWidth="1" opacity="0.8" />
              <line x1="32" y1="55" x2="10" y2="90" stroke="#86efac" strokeWidth="1" opacity="0.8" />
              <line x1="32" y1="45" x2="60" y2="90" stroke="#86efac" strokeWidth="1" opacity="0.8" />
              <line x1="32" y1="55" x2="55" y2="90" stroke="#86efac" strokeWidth="1" opacity="0.8" />
            </g>
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 18: ABU DHABI, UAE (Yas Viceroy LED Grid & Grand Mosque)      */}
        {/* =================================================================== */}
        {round === 18 && (
          <g>
            <rect width="200" height="120" fill="#083344" />
            {/* Yas Viceroy Hotel Grid Canopy (Spans across track) */}
            <path
              d="M10,95 Q50,30 110,40 Q150,48 190,95 L190,110 Q140,65 100,58 Q50,50 10,110 Z"
              fill="#06b6d4"
              opacity="0.8"
            />
            {/* Sheikh Zayed Grand Mosque Domes & Minarets */}
            <g transform="translate(50, 45)">
              <ellipse cx="40" cy="40" rx="14" ry="16" fill="#67e8f9" opacity="0.9" />
              <ellipse cx="20" cy="45" rx="9" ry="11" fill="#22d3ee" opacity="0.8" />
              <ellipse cx="60" cy="45" rx="9" ry="11" fill="#22d3ee" opacity="0.8" />
              {/* Slender Minarets */}
              <line x1="5" y1="65" x2="5" y2="20" stroke="#cffafe" strokeWidth="2" />
              <line x1="75" y1="65" x2="75" y2="20" stroke="#cffafe" strokeWidth="2" />
            </g>
          </g>
        )}

        {/* Universal Dark Gradient Overlay to ensure Card Text Contrast */}
        <rect width="200" height="120" fill={`url(#grad-card-${round})`} />
      </svg>
    </div>
  );
};
