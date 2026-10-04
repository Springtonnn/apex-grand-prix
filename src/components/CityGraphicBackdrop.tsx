import React from 'react';

interface CityGraphicBackdropProps {
  round: number;
  className?: string;
}

export const CityGraphicBackdrop: React.FC<CityGraphicBackdropProps> = ({ round, className = '' }) => {
  return (
    <div className={`w-full h-full absolute inset-0 overflow-hidden select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-45 group-hover:opacity-75 transition-opacity duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Universal contrast scrim: keeps card typography readable while letting rich art shine */}
          <linearGradient id={`grad-card-${round}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04070d" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#04070d" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#04070d" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#020408" stopOpacity="0.98" />
          </linearGradient>

          {/* Reusable Patterns & Filters */}
          <linearGradient id="melGoldCrown" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="bcnGloriesGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>
          <linearGradient id="yasGridCanopy" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="vegasSpherePulse" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="40%" stopColor="#a855f7" />
            <stop offset="80%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* =================================================================== */}
        {/* ROUND 1: MELBOURNE, AUSTRALIA (Albert Park Lake & Eureka Tower)     */}
        {/* =================================================================== */}
        {round === 1 && (
          <g>
            <rect width="400" height="240" fill="#021c24" />
            {/* Dawn Sky Gradient */}
            <path d="M0,0 L400,0 L400,160 L0,160 Z" fill="url(#melSky)" opacity="0.9" />
            {/* Distant Dandenong Mountain Ranges */}
            <path d="M0,150 Q70,120 150,135 Q240,110 320,130 Q370,115 400,125 L400,190 L0,190 Z" fill="#06323c" opacity="0.6" />
            <path d="M0,165 Q90,140 200,155 Q290,138 400,150 L400,200 L0,200 Z" fill="#0a4652" opacity="0.7" />
            {/* Southern Cross Constellation */}
            <g fill="#ffffff" opacity="0.85">
              <circle cx="65" cy="35" r="1.5" />
              <circle cx="85" cy="22" r="1.8" />
              <circle cx="102" cy="40" r="1.6" />
              <circle cx="82" cy="55" r="1.5" />
              <circle cx="86" cy="42" r="1.1" />
              {/* Pointer Stars */}
              <circle cx="135" cy="48" r="2.0" fill="#5eead4" />
              <circle cx="155" cy="56" r="1.8" />
            </g>
            {/* Melbourne Skyline Silhouettes */}
            {/* Distant Secondary Skyline */}
            <path d="M0,180 L0,115 L25,115 L25,130 L45,130 L45,100 L70,100 L70,125 L105,125 L105,85 L130,85 L130,120 L165,120 L165,95 L190,95 L190,135 L225,135 L225,110 L250,110 L250,140 L310,140 L310,90 L335,90 L335,130 L370,130 L370,105 L400,105 L400,180 Z" fill="#04232a" opacity="0.85" />
            {/* Eureka Tower (88 Floors, Faceted Gold Crown & Red Stripe) */}
            <g transform="translate(195, 38)">
              {/* Tower Body */}
              <rect x="0" y="40" width="34" height="135" fill="#083842" stroke="#0d9488" strokeWidth="0.8" />
              {/* Blue Glass Facet Angle */}
              <polygon points="18,40 34,50 34,175 18,175" fill="#0b4855" />
              {/* 24-Carat Gold Plated Top 10 Floors Crown */}
              <polygon points="0,40 34,40 34,16 0,22" fill="url(#melGoldCrown)" />
              {/* Eureka Red Streak (representing Eureka Stockade flag) */}
              <rect x="15" y="40" width="4" height="135" fill="#ef4444" />
              {/* Communications Spire */}
              <line x1="17" y1="16" x2="17" y2="0" stroke="#fde047" strokeWidth="1.5" />
              <circle cx="17" cy="0" r="1.8" fill="#ef4444" />
              {/* Window Grids */}
              <line x1="5" y1="60" x2="13" y2="60" stroke="#5eead4" strokeWidth="1" opacity="0.8" />
              <line x1="5" y1="80" x2="13" y2="80" stroke="#5eead4" strokeWidth="1" opacity="0.8" />
              <line x1="5" y1="100" x2="13" y2="100" stroke="#5eead4" strokeWidth="1" opacity="0.8" />
              <line x1="5" y1="120" x2="13" y2="120" stroke="#5eead4" strokeWidth="1" opacity="0.8" />
            </g>
            {/* Arts Centre Melbourne Spire (Lattice tower) */}
            <g transform="translate(155, 52)">
              <polygon points="12,120 15,20 17,20 20,120" fill="#0f5c6b" />
              <line x1="16" y1="20" x2="16" y2="0" stroke="#5eead4" strokeWidth="1.5" />
              <line x1="10" y1="60" x2="22" y2="60" stroke="#2dd4bf" strokeWidth="1" />
              <line x1="12" y1="85" x2="20" y2="85" stroke="#2dd4bf" strokeWidth="1" />
              <circle cx="16" cy="0" r="2" fill="#ffffff" />
            </g>
            {/* Rialto Towers (Twin Interlocking Towers) */}
            <g transform="translate(245, 65)">
              <rect x="0" y="30" width="18" height="110" fill="#073038" stroke="#0d9488" strokeWidth="0.8" />
              <polygon points="0,30 18,22 18,30" fill="#0d9488" />
              <rect x="18" y="10" width="22" height="130" fill="#0b434e" stroke="#14b8a6" strokeWidth="0.8" />
              <polygon points="18,10 40,0 40,10" fill="#14b8a6" />
            </g>
            {/* Melbourne Star Observation Wheel */}
            <g transform="translate(85, 105)">
              <circle cx="28" cy="28" r="26" fill="none" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.75" />
              <circle cx="28" cy="28" r="16" fill="none" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
              <line x1="2" y1="28" x2="54" y2="28" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6" />
              <line x1="28" y1="2" x2="28" y2="54" stroke="#2dd4bf" strokeWidth="0.8" opacity="0.6" />
              <line x1="28" y1="28" x2="16" y2="65" stroke="#0d9488" strokeWidth="2" />
              <line x1="28" y1="28" x2="40" y2="65" stroke="#0d9488" strokeWidth="2" />
            </g>
            {/* Albert Park Lake Water Surface with Shimmering Light */}
            <rect x="0" y="185" width="400" height="55" fill="#032027" />
            <path d="M0,185 Q100,182 200,185 T400,185" stroke="#14b8a6" strokeWidth="1.5" fill="none" opacity="0.7" />
            <line x1="25" y1="195" x2="90" y2="195" stroke="#5eead4" strokeWidth="1.2" opacity="0.45" />
            <line x1="180" y1="198" x2="260" y2="198" stroke="#fde047" strokeWidth="1.4" opacity="0.55" />
            <line x1="120" y1="208" x2="210" y2="208" stroke="#2dd4bf" strokeWidth="1.2" opacity="0.4" />
            <line x1="280" y1="205" x2="360" y2="205" stroke="#5eead4" strokeWidth="1.2" opacity="0.45" />
            {/* Australian Eucalyptus & Palm Foliage on Shoreline */}
            <path d="M0,240 L0,205 Q25,188 55,200 Q85,185 120,202 Q160,188 200,205 Q245,190 280,204 Q330,188 365,202 Q385,192 400,205 L400,240 Z" fill="#052e2b" opacity="0.85" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 2: SUZUKA, JAPAN (Mount Fuji, Ferris Wheel, Pagoda & Sakura)  */}
        {/* =================================================================== */}
        {round === 2 && (
          <g>
            <rect width="400" height="240" fill="#3b0716" />
            {/* Twilight Dusk Glow */}
            <ellipse cx="200" cy="80" rx="220" ry="90" fill="#f43f5e" opacity="0.25" />
            {/* Majestic Mount Fuji Volcanic Silhouette */}
            <polygon points="50,220 180,60 215,60 350,220" fill="#6b0e27" opacity="0.85" />
            {/* Mount Fuji Snowcap Ridge */}
            <polygon points="160,85 180,60 215,60 235,85 220,95 205,88 195,95 180,90 170,95" fill="#fecdd3" opacity="0.95" />
            <polygon points="180,90 195,95 188,112 182,105" fill="#ffffff" opacity="0.75" />
            <polygon points="205,88 220,95 214,115 208,104" fill="#ffffff" opacity="0.75" />
            {/* Suzuka Iconic 24-Gondola Ferris Wheel */}
            <g transform="translate(95, 115)">
              {/* Wheel Rims */}
              <circle cx="0" cy="0" r="48" fill="none" stroke="#fb7185" strokeWidth="2.5" opacity="0.9" />
              <circle cx="0" cy="0" r="32" fill="none" stroke="#fda4af" strokeWidth="1.2" opacity="0.75" strokeDasharray="4 3" />
              <circle cx="0" cy="0" r="8" fill="#fda4af" opacity="0.9" />
              {/* Rotating Spokes */}
              {Array.from({ length: 12 }).map((_, i) => {
                const ang = (i * Math.PI) / 6;
                const x2 = Math.cos(ang) * 48;
                const y2 = Math.sin(ang) * 48;
                return (
                  <g key={i}>
                    <line x1="0" y1="0" x2={x2} y2={y2} stroke="#fecdd3" strokeWidth="1" opacity="0.75" />
                    {/* Passenger Gondola Cabin */}
                    <rect x={x2 - 3} y={y2 - 3} width="6" height="6" rx="1.5" fill={i % 2 === 0 ? '#f43f5e' : '#facc15'} />
                  </g>
                );
              })}
              {/* Massive A-Frame Support Legs */}
              <line x1="0" y1="0" x2="-28" y2="75" stroke="#e11d48" strokeWidth="4" />
              <line x1="0" y1="0" x2="28" y2="75" stroke="#e11d48" strokeWidth="4" />
              <line x1="-15" y1="40" x2="15" y2="40" stroke="#fda4af" strokeWidth="2" />
            </g>
            {/* Traditional 5-Tier Japanese Pagoda */}
            <g transform="translate(290, 85)">
              {/* Foundation */}
              <rect x="18" y="90" width="34" height="35" fill="#4c0519" />
              {/* 5 Sweeping Roof Eaves */}
              {[
                { y: 88, w: 46, h: 6 },
                { y: 72, w: 42, h: 5.5 },
                { y: 56, w: 38, h: 5 },
                { y: 42, w: 34, h: 4.5 },
                { y: 30, w: 30, h: 4 },
              ].map((tier, idx) => (
                <g key={idx}>
                  <path d={`M${35 - tier.w / 2},${tier.y} Q35,${tier.y - 4} ${35 + tier.w / 2},${tier.y} L${35 + tier.w / 2 - 4},${tier.y + tier.h} L${35 - tier.w / 2 + 4},${tier.y + tier.h} Z`} fill="#be123c" stroke="#fecdd3" strokeWidth="0.8" />
                  <rect x="25" y={tier.y + 4} width="20" height="8" fill="#58081f" />
                </g>
              ))}
              {/* Golden Sorin Finial Spire with 9 Sacred Rings */}
              <line x1="35" y1="30" x2="35" y2="6" stroke="#fde047" strokeWidth="1.8" />
              <circle cx="35" cy="5" r="2.2" fill="#fde047" />
              <circle cx="35" cy="12" r="1.4" fill="#fde047" />
              <circle cx="35" cy="17" r="1.4" fill="#fde047" />
              <circle cx="35" cy="22" r="1.4" fill="#fde047" />
            </g>
            {/* Red Japanese Shinto Torii Gate */}
            <g transform="translate(235, 160)">
              {/* Main Pillars */}
              <line x1="8" y1="45" x2="10" y2="8" stroke="#e11d48" strokeWidth="3" />
              <line x1="38" y1="45" x2="36" y2="8" stroke="#e11d48" strokeWidth="3" />
              {/* Upper Curved Kasagi Lintel */}
              <path d="M0,8 Q23,4 46,8 L44,12 Q23,9 2,12 Z" fill="#be123c" stroke="#facc15" strokeWidth="0.8" />
              {/* Lower Straight Shimaki Lintel */}
              <rect x="4" y="16" width="38" height="3" fill="#9f1239" />
            </g>
            {/* Cherry Blossom (Sakura) Clouds */}
            <ellipse cx="40" cy="190" rx="35" ry="18" fill="#fda4af" opacity="0.65" />
            <ellipse cx="360" cy="180" rx="38" ry="20" fill="#fecdd3" opacity="0.6" />
            <ellipse cx="375" cy="195" rx="30" ry="15" fill="#fda4af" opacity="0.75" />
            {/* Japanese Cedar (Sugi) Forest Ridge */}
            <path d="M0,240 L0,205 Q50,185 110,198 Q170,180 230,195 Q290,175 350,192 Q380,185 400,195 L400,240 Z" fill="#23040e" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 3: SINGAPORE (Marina Bay Sands, Supertrees & Singapore Flyer) */}
        {/* =================================================================== */}
        {round === 3 && (
          <g>
            <rect width="400" height="240" fill="#17062e" />
            {/* Night Sky Glow & Floodlights */}
            <ellipse cx="200" cy="140" rx="200" ry="90" fill="#9333ea" opacity="0.3" />
            {/* Distant CBD High-Rise Skyline */}
            <path d="M0,200 L0,120 L25,120 L25,140 L45,140 L45,105 L65,105 L65,85 L85,85 L85,130 L115,130 L115,95 L135,95 L135,145 L170,145 L170,110 L195,110 L195,150 L230,150 L230,125 L255,125 L255,155 L310,155 L310,105 L335,105 L335,135 L375,135 L375,115 L400,115 L400,200 Z" fill="#130829" opacity="0.9" />
            {/* Marina Bay Sands (3 Soaring Towers + Cantilevered SkyPark) */}
            <g transform="translate(60, 42)">
              {/* 3 Concave Towers with Illuminated Glass Louvers */}
              <rect x="30" y="42" width="18" height="115" fill="#3b0764" stroke="#c084fc" strokeWidth="0.9" />
              <rect x="58" y="38" width="18" height="119" fill="#4a044e" stroke="#e879f9" strokeWidth="0.9" />
              <rect x="86" y="42" width="18" height="115" fill="#3b0764" stroke="#c084fc" strokeWidth="0.9" />
              {/* Window grid matrix */}
              {Array.from({ length: 9 }).map((_, r) => (
                <g key={r} opacity="0.8">
                  <line x1="33" y1={52 + r * 11} x2="45" y2={52 + r * 11} stroke="#f0abfc" strokeWidth="1.2" />
                  <line x1="61" y1={48 + r * 11} x2="73" y2={48 + r * 11} stroke="#f0abfc" strokeWidth="1.2" />
                  <line x1="89" y1={52 + r * 11} x2="101" y2={52 + r * 11} stroke="#f0abfc" strokeWidth="1.2" />
                </g>
              ))}
              {/* SkyPark 340m Cantilevered Surfboard Terrace */}
              <path d="M12,42 C30,30 95,30 135,38 C125,48 30,50 12,42 Z" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1.2" />
              {/* Infinity Pool Rim Glow */}
              <line x1="35" y1="35" x2="115" y2="35" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
              {/* Rooftop Palm Trees */}
              <circle cx="50" cy="31" r="2.5" fill="#22c55e" />
              <circle cx="70" cy="30" r="2.5" fill="#22c55e" />
              <circle cx="90" cy="31" r="2.5" fill="#22c55e" />
            </g>
            {/* Gardens by the Bay - Supertree Grove (Biomimetic vertical gardens) */}
            <g transform="translate(210, 85)">
              {/* Main Supertree */}
              <path d="M45,120 L45,65 Q30,38 18,30 Q45,45 45,65 Q45,45 72,30 Q60,38 45,65 Z" fill="#d946ef" opacity="0.85" />
              {/* Canopy Foliage Crown */}
              <ellipse cx="45" cy="30" rx="30" ry="10" fill="#a855f7" opacity="0.9" />
              <ellipse cx="45" cy="28" rx="22" ry="7" fill="#f0abfc" opacity="0.8" />
              {/* Secondary Supertree */}
              <path d="M85,120 L85,75 Q72,52 62,45 Q85,55 85,75 Q85,55 108,45 Q98,52 85,75 Z" fill="#c084fc" opacity="0.75" />
              <ellipse cx="85" cy="45" rx="24" ry="8" fill="#9333ea" opacity="0.85" />
              {/* Connecting Aerial Skyway Walkway */}
              <path d="M45,55 Q65,65 85,62" fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.8" />
            </g>
            {/* ArtScience Museum Lotus Flower */}
            <g transform="translate(20, 160)">
              <ellipse cx="30" cy="20" rx="24" ry="10" fill="#e9d5ff" opacity="0.95" />
              <polygon points="12,20 18,6 24,20" fill="#ffffff" />
              <polygon points="22,20 30,3 38,20" fill="#ffffff" />
              <polygon points="36,20 42,6 48,20" fill="#ffffff" />
            </g>
            {/* Singapore Flyer Observation Wheel */}
            <g transform="translate(345, 95)">
              <circle cx="26" cy="26" r="26" fill="none" stroke="#38bdf8" strokeWidth="1.8" opacity="0.8" />
              <circle cx="26" cy="26" r="16" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
              <line x1="26" y1="26" x2="14" y2="65" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="26" y1="26" x2="38" y2="65" stroke="#0284c7" strokeWidth="2.5" />
              {Array.from({ length: 8 }).map((_, i) => {
                const ang = (i * Math.PI) / 4;
                return (
                  <circle key={i} cx={26 + Math.cos(ang) * 26} cy={26 + Math.sin(ang) * 26} r="2" fill="#67e8f9" />
                );
              })}
            </g>
            {/* Shimmering Marina Bay Water Basin */}
            <rect x="0" y="195" width="400" height="45" fill="#0c021f" />
            <line x1="20" y1="202" x2="110" y2="202" stroke="#c084fc" strokeWidth="1.5" opacity="0.6" />
            <line x1="80" y1="210" x2="190" y2="210" stroke="#f472b6" strokeWidth="1.5" opacity="0.7" />
            <line x1="160" y1="218" x2="270" y2="218" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
            <line x1="250" y1="225" x2="380" y2="225" stroke="#e879f9" strokeWidth="1.5" opacity="0.5" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 4: SAKHIR, BAHRAIN (World Trade Center Wind Turbines & Tower) */}
        {/* =================================================================== */}
        {round === 4 && (
          <g>
            <rect width="400" height="240" fill="#381404" />
            {/* Blazing Desert Dusk Sunset */}
            <ellipse cx="200" cy="110" rx="220" ry="85" fill="#f97316" opacity="0.35" />
            {/* Distant Sandstone Mesas & Desert Plateaus */}
            <polygon points="0,170 40,120 110,120 160,170" fill="#5a1e05" opacity="0.75" />
            <polygon points="260,180 300,135 370,135 400,165 400,195 240,195" fill="#5a1e05" opacity="0.7" />
            {/* Undulating Arabian Sand Dunes with Wind Drift Crests */}
            <path d="M0,175 Q90,130 190,165 Q290,135 400,160 L400,210 L0,210 Z" fill="#852b07" opacity="0.8" />
            <path d="M0,190 Q110,150 230,185 Q320,165 400,180 L400,240 L0,240 Z" fill="#a13909" opacity="0.85" />
            {/* Bahrain World Trade Center (Twin Sail Towers + 3 Wind Turbines) */}
            <g transform="translate(195, 30)">
              {/* Left Sail Tower */}
              <polygon points="8,155 24,15 32,155" fill="#f59e0b" stroke="#fef08a" strokeWidth="0.8" />
              {/* Right Sail Tower */}
              <polygon points="56,155 40,15 32,155" fill="#d97706" stroke="#fef08a" strokeWidth="0.8" />
              {/* Reflected Glass Louvers */}
              <line x1="12" y1="60" x2="28" y2="60" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
              <line x1="15" y1="95" x2="30" y2="95" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
              <line x1="34" y1="60" x2="50" y2="60" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
              <line x1="33" y1="95" x2="48" y2="95" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
              {/* 3 Skybridges with Rotating Wind Turbines */}
              {[
                { y: 55 },
                { y: 85 },
                { y: 115 },
              ].map((bridge, idx) => (
                <g key={idx}>
                  <rect x="22" y={bridge.y - 2} width="20" height="4" fill="#fef08a" />
                  <circle cx="32" cy={bridge.y} r="3" fill="#ffffff" />
                  <line x1="32" y1={bridge.y - 7} x2="32" y2={bridge.y + 7} stroke="#ffffff" strokeWidth="1.2" />
                  <line x1="26" y1={bridge.y - 3} x2="38" y2={bridge.y + 3} stroke="#ffffff" strokeWidth="1.2" />
                </g>
              ))}
            </g>
            {/* Sakhir 8-Tier Circular VIP Hospitality Tower */}
            <g transform="translate(85, 75)">
              {/* 8 Tiers with Crimson Fabric Canopies */}
              {Array.from({ length: 8 }).map((_, r) => {
                const tw = 48 - r * 3;
                const ty = 95 - r * 12;
                return (
                  <g key={r}>
                    <ellipse cx="30" cy={ty} rx={tw / 2} ry="5" fill={r % 2 === 0 ? '#ef4444' : '#ffffff'} />
                    <rect x={30 - tw / 2} y={ty} width={tw} height="6" fill={r % 2 === 0 ? '#b91c1c' : '#f8fafc'} />
                  </g>
                );
              })}
              {/* Rooftop observation lantern */}
              <circle cx="30" cy="0" r="3" fill="#fde047" />
              <line x1="30" y1="0" x2="30" y2="-8" stroke="#fde047" strokeWidth="1.5" />
            </g>
            {/* Date Palm Oasis Groves */}
            <g transform="translate(320, 160)">
              <line x1="20" y1="40" x2="16" y2="10" stroke="#78350f" strokeWidth="2.5" />
              <ellipse cx="16" cy="8" rx="14" ry="5" fill="#15803d" />
              <line x1="35" y1="40" x2="38" y2="14" stroke="#78350f" strokeWidth="2.2" />
              <ellipse cx="38" cy="12" rx="12" ry="4" fill="#166534" />
            </g>
            {/* Distant Gas Flare Tower Glow */}
            <line x1="380" y1="170" x2="380" y2="135" stroke="#92400e" strokeWidth="1.5" />
            <circle cx="380" cy="132" r="4" fill="#f97316" />
            <circle cx="380" cy="132" r="8" fill="#ea580c" opacity="0.45" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 5: BANGKOK, THAILAND (Wat Arun, Rama VIII Bridge & Mahanakhon)*/}
        {/* =================================================================== */}
        {round === 5 && (
          <g>
            <rect width="400" height="240" fill="#150f38" />
            {/* Royal Rattanakosin Twilight Sky */}
            <ellipse cx="200" cy="115" rx="220" ry="85" fill="#f59e0b" opacity="0.25" />
            {/* Distant Bangkok Metropolis High-Rises */}
            <path d="M0,195 L0,135 L20,135 L20,115 L40,115 L40,145 L70,145 L70,105 L95,105 L95,150 L125,150 L125,120 L155,120 L155,160 L185,160 L185,130 L210,130 L210,165 L260,165 L260,110 L285,110 L285,155 L320,155 L320,125 L355,125 L355,140 L400,140 L400,195 Z" fill="#1a1447" opacity="0.85" />
            {/* King Power Mahanakhon 314m 3D Pixelated Skyscraper */}
            <g transform="translate(315, 38)">
              {/* Main Glass Tower Body */}
              <rect x="0" y="25" width="34" height="140" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="0.8" />
              {/* Spiral Pixelated Cutout Ribbon */}
              <rect x="0" y="45" width="10" height="10" fill="#fde047" opacity="0.9" />
              <rect x="18" y="55" width="12" height="12" fill="#fde047" opacity="0.9" />
              <rect x="6" y="80" width="14" height="12" fill="#fde047" opacity="0.9" />
              <rect x="20" y="98" width="14" height="14" fill="#fde047" opacity="0.9" />
              <rect x="4" y="125" width="16" height="12" fill="#fde047" opacity="0.9" />
              {/* Glass Skywalk Crown */}
              <rect x="8" y="10" width="18" height="15" fill="#f59e0b" />
              <line x1="17" y1="10" x2="17" y2="0" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="17" cy="0" r="1.8" fill="#ef4444" />
            </g>
            {/* Rama VIII Cable-Stayed Bridge (Inverted-Y Golden Pylon + Fan Cables) */}
            <g transform="translate(25, 32)">
              {/* Inverted-Y Tower (Golden illumination) */}
              <line x1="42" y1="160" x2="55" y2="25" stroke="#f59e0b" strokeWidth="4.5" />
              <line x1="68" y1="160" x2="55" y2="25" stroke="#f59e0b" strokeWidth="4.5" />
              <circle cx="55" cy="22" r="3.5" fill="#fde047" />
              {/* Radiating Stay Cables */}
              {[40, 58, 76, 94, 112, 130, 148].map((cableX, idx) => (
                <line key={idx} x1="55" y1={35 + idx * 8} x2={55 + cableX * 0.9} y2="155" stroke="#fde047" strokeWidth="1" opacity={0.85 - idx * 0.08} />
              ))}
              {/* Road Deck Bridge Beam */}
              <line x1="0" y1="156" x2="200" y2="156" stroke="#d97706" strokeWidth="3" />
            </g>
            {/* Wat Arun (Temple of Dawn) Grand Prang & Satellite Chedis */}
            <g transform="translate(165, 45)">
              {/* Grand Central Prang (Khmer-style tiered spire) */}
              <polygon points="30,150 38,25 58,25 66,150" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />
              {/* Tiered Decorative Porcelain Moldings */}
              <rect x="26" y="55" width="44" height="5" fill="#b45309" />
              <rect x="29" y="80" width="38" height="5" fill="#b45309" />
              <rect x="32" y="105" width="32" height="5" fill="#b45309" />
              <rect x="35" y="130" width="26" height="5" fill="#b45309" />
              {/* Seven-Pronged Golden Trident (Nopphasun) Spire */}
              <polygon points="45,25 48,6 51,25" fill="#fde047" />
              <circle cx="48" cy="5" r="2.5" fill="#ffffff" />
              {/* 4 Satellite Corner Chedis */}
              <polygon points="10,150 14,65 24,65 28,150" fill="#d97706" />
              <polygon points="17,65 19,48 21,65" fill="#fde047" />
              <polygon points="68,150 72,65 82,65 86,150" fill="#d97706" />
              <polygon points="75,65 77,48 79,65" fill="#fde047" />
            </g>
            {/* Chao Phraya River Water Band with Golden Shimmer */}
            <rect x="0" y="190" width="400" height="50" fill="#1b1238" />
            <line x1="20" y1="198" x2="120" y2="198" stroke="#f59e0b" strokeWidth="1.6" opacity="0.75" />
            <line x1="160" y1="205" x2="260" y2="205" stroke="#fde047" strokeWidth="1.8" opacity="0.85" />
            <line x1="80" y1="214" x2="200" y2="214" stroke="#f59e0b" strokeWidth="1.6" opacity="0.7" />
            <line x1="280" y1="222" x2="380" y2="222" stroke="#fde047" strokeWidth="1.6" opacity="0.65" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 6: BARCELONA, SPAIN (Sagrada Família, Montserrat & Glòries)   */}
        {/* =================================================================== */}
        {round === 6 && (
          <g>
            <rect width="400" height="240" fill="#2d0a04" />
            {/* Warm Catalan Sunset Sky */}
            <ellipse cx="200" cy="100" rx="220" ry="85" fill="#ea580c" opacity="0.3" />
            {/* Montserrat Sawtooth Mountain Range Silhouette */}
            <path d="M0,165 Q40,115 80,140 Q130,95 180,135 Q220,90 270,125 Q330,85 370,130 Q390,110 400,125 L400,200 L0,200 Z" fill="#541607" opacity="0.7" />
            {/* Antoni Gaudí's Sagrada Família (8 Parabolic Perforated Towers & Cross) */}
            <g transform="translate(130, 30)">
              {/* Central Jesus Christ Spire (172m) */}
              <polygon points="48,155 58,15 66,15 76,155" fill="#7c2d12" stroke="#f59e0b" strokeWidth="1" />
              {/* Cross on top of Jesus tower */}
              <line x1="62" y1="15" x2="62" y2="2" stroke="#fef08a" strokeWidth="2.2" />
              <line x1="56" y1="8" x2="68" y2="8" stroke="#fef08a" strokeWidth="2.2" />
              {/* 4 Nativity Facade Bell Towers with Parabolic Windows */}
              {[
                { x: 18, h: 105, w: 16, cap: '#ef4444' },
                { x: 36, h: 125, w: 18, cap: '#f59e0b' },
                { x: 72, h: 125, w: 18, cap: '#f59e0b' },
                { x: 92, h: 105, w: 16, cap: '#ef4444' },
              ].map((t, idx) => (
                <g key={idx}>
                  <polygon points={`${t.x},155 ${t.x + 3},${155 - t.h} ${t.x + t.w - 3},${155 - t.h} ${t.x + t.w},155`} fill="#9a3412" stroke="#f97316" strokeWidth="0.8" />
                  {/* Decorative fruit/mosaic pinnacle finial */}
                  <circle cx={t.x + t.w / 2} cy={155 - t.h - 3} r="3" fill={t.cap} />
                  {/* Parabolic window louvers */}
                  <line x1={t.x + 4} y1={155 - t.h + 15} x2={t.x + t.w - 4} y2={155 - t.h + 15} stroke="#fef08a" strokeWidth="1" />
                  <line x1={t.x + 4} y1={155 - t.h + 30} x2={t.x + t.w - 4} y2={155 - t.h + 30} stroke="#fef08a" strokeWidth="1" />
                  <line x1={t.x + 4} y1={155 - t.h + 45} x2={t.x + t.w - 4} y2={155 - t.h + 45} stroke="#fef08a" strokeWidth="1" />
                </g>
              ))}
            </g>
            {/* Torre Glòries (Bullet Geyser Tower with Red-Blue LED Glow) */}
            <g transform="translate(285, 65)">
              <ellipse cx="20" cy="115" rx="18" ry="8" fill="#1e1b4b" />
              <path d="M4,115 C4,45 12,15 20,15 C28,15 36,45 36,115 Z" fill="url(#bcnGloriesGlow)" stroke="#f43f5e" strokeWidth="1" />
              <ellipse cx="20" cy="20" rx="6" ry="8" fill="#f43f5e" opacity="0.8" />
            </g>
            {/* Montjuïc Hill & Calatrava Communications Needle */}
            <g transform="translate(45, 115)">
              <line x1="20" y1="65" x2="35" y2="15" stroke="#ffffff" strokeWidth="2.5" />
              <line x1="35" y1="15" x2="35" y2="0" stroke="#facc15" strokeWidth="1.8" />
              <circle cx="35" cy="0" r="2" fill="#ef4444" />
              <path d="M20,65 Q40,35 60,65" fill="none" stroke="#ffffff" strokeWidth="1.5" />
            </g>
            {/* Catalan Terracotta Rooftops & Umbrella Pines */}
            <path d="M0,240 L0,195 Q80,180 180,192 Q280,175 400,190 L400,240 Z" fill="#3f1307" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 7: MONTE CARLO, MONACO (Casino, Port Hercule Yachts & Cliffs) */}
        {/* =================================================================== */}
        {round === 7 && (
          <g>
            <rect width="400" height="240" fill="#0c1a3b" />
            {/* Mediterranean Maritime Alps Limestone Cliffs */}
            <path d="M0,170 Q70,90 160,115 Q240,75 320,105 Q370,85 400,100 L400,200 L0,200 Z" fill="#172e61" opacity="0.75" />
            {/* Le Rocher (Rock of Monaco) Fortress Palaces */}
            <polygon points="0,185 0,135 60,135 90,185" fill="#1c3b7a" />
            <rect x="25" y="122" width="28" height="15" fill="#93c5fd" opacity="0.8" />
            <line x1="39" y1="122" x2="39" y2="112" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="39" cy="112" r="1.8" fill="#ef4444" />
            {/* Monte Carlo Casino (Belle Époque Copper-Verdigris Domes) */}
            <g transform="translate(130, 85)">
              <rect x="20" y="35" width="80" height="45" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="1" />
              {/* Main Central Copper Dome */}
              <ellipse cx="60" cy="35" rx="18" ry="20" fill="#0284c7" />
              <ellipse cx="60" cy="35" rx="14" ry="16" fill="#38bdf8" />
              <line x1="60" y1="18" x2="60" y2="8" stroke="#fde047" strokeWidth="1.8" />
              <circle cx="60" cy="8" r="2.2" fill="#fde047" />
              {/* Twin Flanking Pavilion Domes */}
              <ellipse cx="32" cy="35" rx="10" ry="12" fill="#0369a1" />
              <ellipse cx="88" cy="35" rx="10" ry="12" fill="#0369a1" />
              {/* Classical Arched Windows */}
              {Array.from({ length: 5 }).map((_, w) => (
                <rect key={w} x={28 + w * 14} y="52" width="8" height="16" rx="3" fill="#fef08a" opacity="0.85" />
              ))}
            </g>
            {/* Cascading Pastel Cliffside Luxury Apartments */}
            {[
              { x: 235, y: 110, w: 32, h: 45, col: '#fed7aa' },
              { x: 270, y: 95, w: 36, h: 60, col: '#fecdd3' },
              { x: 310, y: 115, w: 34, h: 40, col: '#fef08a' },
              { x: 348, y: 100, w: 42, h: 55, col: '#bfdbfe' },
            ].map((villa, idx) => (
              <g key={idx}>
                <rect x={villa.x} y={villa.y} width={villa.w} height={villa.h} fill={villa.col} stroke="#0f172a" strokeWidth="0.8" />
                <polygon points={`${villa.x - 2},${villa.y} ${villa.x + villa.w / 2},${villa.y - 6} ${villa.x + villa.w + 2},${villa.y}`} fill="#c2410c" />
                <rect x={villa.x + 4} y={villa.y + 10} width="8" height="8" fill="#1e293b" />
                <rect x={villa.x + villa.w - 12} y={villa.y + 10} width="8" height="8" fill="#1e293b" />
              </g>
            ))}
            {/* Port Hercule Marina Luxury Superyachts */}
            <rect x="0" y="175" width="400" height="65" fill="#052042" />
            {[
              { x: 70, y: 185, len: 45 },
              { x: 145, y: 195, len: 55 },
              { x: 230, y: 188, len: 50 },
              { x: 310, y: 198, len: 65 },
            ].map((yacht, idx) => (
              <g key={idx}>
                {/* Yacht Sleek White Hull */}
                <polygon points={`${yacht.x},${yacht.y} ${yacht.x + yacht.len},${yacht.y} ${yacht.x + yacht.len - 8},${yacht.y + 14} ${yacht.x + 8},${yacht.y + 14}`} fill="#ffffff" />
                {/* Cabin Deck Tiers */}
                <rect x={yacht.x + 10} y={yacht.y - 8} width={yacht.len - 22} height="8" fill="#e2e8f0" />
                <rect x={yacht.x + 18} y={yacht.y - 14} width={yacht.len - 38} height="6" fill="#f8fafc" />
                {/* Radar Mast */}
                <line x1={yacht.x + yacht.len / 2} y1={yacht.y - 14} x2={yacht.x + yacht.len / 2} y2={yacht.y - 24} stroke="#94a3b8" strokeWidth="1.2" />
                <circle cx={yacht.x + yacht.len / 2} cy={yacht.y - 24} r="1.5" fill="#fde047" />
              </g>
            ))}
            {/* Shimmering Azure Mediterranean Waters */}
            <line x1="20" y1="215" x2="120" y2="215" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
            <line x1="160" y1="222" x2="280" y2="222" stroke="#60a5fa" strokeWidth="1.5" opacity="0.7" />
            <line x1="240" y1="230" x2="360" y2="230" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 8: MONZA, ITALY (Milan Duomo Gothic Spires & Royal Park)      */}
        {/* =================================================================== */}
        {round === 8 && (
          <g>
            <rect width="400" height="240" fill="#042114" />
            {/* Distant Italian Alps & Prealps Silhouette */}
            <polygon points="0,175 60,110 140,150 210,95 280,140 350,105 400,150 400,200 0,200" fill="#0b4029" opacity="0.65" />
            <polygon points="195,105 210,95 225,105" fill="#ffffff" opacity="0.6" />
            {/* Milan Duomo Gothic Cathedral Spires */}
            <g transform="translate(135, 45)">
              {/* Grand Central Spire with Golden Madonnina */}
              <polygon points="60,120 63,15 67,15 70,120" fill="#22c55e" stroke="#4ade80" strokeWidth="0.8" />
              <line x1="65" y1="15" x2="65" y2="0" stroke="#fde047" strokeWidth="2" />
              <circle cx="65" cy="0" r="3" fill="#fde047" />
              {/* Tiered Marble Spires Array */}
              {[
                { x: 30, h: 70 },
                { x: 42, h: 85 },
                { x: 52, h: 100 },
                { x: 78, h: 100 },
                { x: 88, h: 85 },
                { x: 100, h: 70 },
              ].map((sp, idx) => (
                <polygon key={idx} points={`${sp.x},120 ${sp.x + 2},${120 - sp.h} ${sp.x + 6},${120 - sp.h} ${sp.x + 8},120`} fill="#16a34a" stroke="#86efac" strokeWidth="0.8" />
              ))}
              {/* Cathedral Gothic Nave Body */}
              <rect x="25" y="110" width="80" height="25" fill="#14532d" />
              <circle cx="65" cy="95" r="10" fill="none" stroke="#fde047" strokeWidth="1.2" />
            </g>
            {/* Historic Curva Sopraelevata High-Banked Concrete Oval */}
            <g transform="translate(270, 95)">
              <path d="M0,75 Q40,15 85,25 L85,42 Q40,32 0,90 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Vintage Yellow/Black Warning Stripes */}
              <line x1="20" y1="60" x2="30" y2="55" stroke="#facc15" strokeWidth="3" />
              <line x1="45" y1="42" x2="55" y2="38" stroke="#facc15" strokeWidth="3" />
              <line x1="70" y1="28" x2="80" y2="26" stroke="#facc15" strokeWidth="3" />
            </g>
            {/* Parco di Monza Royal Oak Forest Canopy */}
            <path d="M0,240 L0,185 Q40,165 90,178 Q140,160 200,175 Q260,158 320,172 Q370,162 400,175 L400,240 Z" fill="#05331f" />
            <path d="M0,240 L0,205 Q60,185 130,200 Q200,180 270,195 Q340,182 400,198 L400,240 Z" fill="#022113" />
            {/* Italian Tricolore Trackside Banners (Green, White, Red) */}
            <g transform="translate(30, 195)">
              <rect x="0" y="0" width="6" height="15" fill="#22c55e" />
              <rect x="6" y="0" width="6" height="15" fill="#ffffff" />
              <rect x="12" y="0" width="6" height="15" fill="#ef4444" />
            </g>
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 9: AUSTRIAN ALPS (Spielberg, Jagged Snow Alps & Bull Horns)   */}
        {/* =================================================================== */}
        {round === 9 && (
          <g>
            <rect width="400" height="240" fill="#031e18" />
            {/* Spectacular Styrian Alps Glacier Peaks */}
            <polygon points="-20,200 70,60 140,200" fill="#065f46" opacity="0.8" />
            <polygon points="70,60 85,95 60,95" fill="#ffffff" opacity="0.9" />
            <polygon points="80,200 190,40 280,200" fill="#047857" opacity="0.85" />
            <polygon points="190,40 215,85 175,85" fill="#ffffff" opacity="0.95" />
            <polygon points="230,200 320,55 410,200" fill="#065f46" opacity="0.8" />
            <polygon points="320,55 338,90 308,90" fill="#ffffff" opacity="0.9" />
            {/* The Bull of Spielberg ("Stier von Spielberg" Steel & Gold Arch Sculpture) */}
            <g transform="translate(145, 105)">
              {/* Massive Steel Bull Silhouette */}
              <path d="M30,55 Q40,32 55,28 Q70,25 80,38 Q88,32 95,35 Q102,42 98,55 Q85,62 70,60 L65,75 L52,75 L55,60 Q40,62 30,55 Z" fill="#334155" stroke="#f59e0b" strokeWidth="1.2" />
              {/* Arching Golden Ring Horn (18m tall sculpture) */}
              <circle cx="65" cy="40" r="32" fill="none" stroke="#facc15" strokeWidth="3" opacity="0.9" />
              <circle cx="65" cy="40" r="32" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 4" />
            </g>
            {/* Traditional Austrian Timber Chalets */}
            <g transform="translate(45, 160)">
              <rect x="0" y="15" width="35" height="25" fill="#451a03" />
              <polygon points="-4,15 17,0 39,15" fill="#78350f" />
              <rect x="5" y="24" width="25" height="4" fill="#dc2626" />
              <rect x="8" y="20" width="6" height="6" fill="#fef08a" />
              <rect x="21" y="20" width="6" height="6" fill="#fef08a" />
            </g>
            {/* Alpine Cable Car Chairlift Lines */}
            <line x1="280" y1="180" x2="380" y2="100" stroke="#94a3b8" strokeWidth="1" />
            <rect x="325" y="140" width="8" height="6" fill="#ef4444" />
            {/* Austrian Pine Forests on Slopes */}
            <path d="M0,240 L0,195 Q80,180 180,195 Q280,180 400,192 L400,240 Z" fill="#022c22" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 10: SPA-FRANCORCHAMPS (Eau Rouge Incline & Ardennes Forest)   */}
        {/* =================================================================== */}
        {round === 10 && (
          <g>
            <rect width="400" height="240" fill="#090f1d" />
            {/* Misty Ardennes Forest Hills with Drifting Fog */}
            <path d="M0,165 Q80,110 180,140 Q280,95 400,135 L400,200 L0,200 Z" fill="#152033" opacity="0.8" />
            <path d="M0,185 Q110,135 240,160 Q330,130 400,155 L400,220 L0,220 Z" fill="#1e2e47" opacity="0.85" />
            {/* Legendary Eau Rouge / Raidillon 17% Climbing Asphalt Ribbon */}
            <g transform="translate(110, 60)">
              {/* Steep Asphalt Ribbon */}
              <path d="M0,150 Q50,115 80,95 Q110,75 140,40" fill="none" stroke="#334155" strokeWidth="14" />
              {/* High Red-and-White Striped Curbs */}
              <path d="M-4,150 Q46,115 76,95 Q106,75 136,40" fill="none" stroke="#ef4444" strokeWidth="3" />
              <path d="M-4,150 Q46,115 76,95 Q106,75 136,40" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="8 6" />
              {/* Radisson Hotel Crest Structure atop Raidillon */}
              <rect x="125" y="20" width="35" height="25" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
              <polygon points="123,20 142,8 162,20" fill="#0f172a" />
              <circle cx="142" cy="6" r="2" fill="#ef4444" />
            </g>
            {/* Historic Stone Viaduct Bridge */}
            <g transform="translate(20, 155)">
              <rect x="0" y="15" width="80" height="25" fill="#334155" />
              <circle cx="20" cy="40" r="12" fill="#090f1d" />
              <circle cx="60" cy="40" r="12" fill="#090f1d" />
            </g>
            {/* Dense Walloon Pine Forests */}
            <path d="M0,240 L0,195 Q90,175 190,190 Q290,175 400,190 L400,240 Z" fill="#0c1626" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 11: ZANDVOORT (Dutch Windmills, North Sea Dunes & Lighthouse) */}
        {/* =================================================================== */}
        {round === 11 && (
          <g>
            <rect width="400" height="240" fill="#2d1704" />
            {/* North Sea Coastal Sky Glow */}
            <ellipse cx="200" cy="95" rx="220" ry="80" fill="#f59e0b" opacity="0.3" />
            {/* Coastal Marram-Grass Sand Dunes */}
            <path d="M0,175 Q90,125 190,155 Q290,130 400,150 L400,205 L0,205 Z" fill="#602d08" opacity="0.75" />
            <path d="M0,195 Q100,155 210,180 Q320,150 400,175 L400,240 L0,240 Z" fill="#7c3a0b" opacity="0.85" />
            {/* Traditional Dutch Windmill (Molen with 4 Rotating Sails) */}
            <g transform="translate(105, 75)">
              {/* Thatched Octagonal Tower Body */}
              <polygon points="18,105 24,35 44,35 50,105" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
              {/* Rotating Mill Cap */}
              <polygon points="20,35 34,20 48,35" fill="#b45309" />
              <circle cx="34" cy="20" r="5" fill="#d97706" />
              {/* 4 Large Lattice Sails */}
              <line x1="-8" y1="-22" x2="76" y2="62" stroke="#fef08a" strokeWidth="3" />
              <line x1="-8" y1="62" x2="76" y2="-22" stroke="#fef08a" strokeWidth="3" />
              {/* Lattice crossbars */}
              <line x1="8" y1="-6" x2="20" y2="6" stroke="#fde047" strokeWidth="1.5" />
              <line x1="48" y1="34" x2="60" y2="46" stroke="#fde047" strokeWidth="1.5" />
              <line x1="60" y1="-6" x2="48" y2="6" stroke="#fde047" strokeWidth="1.5" />
              <line x1="20" y1="34" x2="8" y2="46" stroke="#fde047" strokeWidth="1.5" />
            </g>
            {/* Zandvoort Coastal Lighthouse (De Zandvoortse Vuurtoren) */}
            <g transform="translate(295, 70)">
              {/* Square Brick Tower with Red-and-White Bands */}
              <polygon points="12,120 16,30 28,30 32,120" fill="#dc2626" />
              <polygon points="15,55 17,30 27,30 29,55" fill="#ffffff" />
              <polygon points="13,85 14,65 30,65 31,85" fill="#ffffff" />
              {/* Lantern Room & Rotating Maritime Beacon */}
              <rect x="18" y="20" width="8" height="10" fill="#fef08a" />
              <polygon points="15,20 22,12 29,20" fill="#1e293b" />
              <circle cx="22" cy="25" r="3" fill="#ffffff" />
            </g>
            {/* Offshore North Sea Wind Turbines */}
            {[
              { x: 30, y: 155, h: 30 },
              { x: 65, y: 160, h: 25 },
              { x: 250, y: 150, h: 32 },
            ].map((wt, idx) => (
              <g key={idx}>
                <line x1={wt.x} y1={wt.y} x2={wt.x} y2={wt.y - wt.h} stroke="#94a3b8" strokeWidth="1.2" />
                <circle cx={wt.x} cy={wt.y - wt.h} r="1.5" fill="#ffffff" />
                <line x1={wt.x} y1={wt.y - wt.h} x2={wt.x - 8} y2={wt.y - wt.h + 8} stroke="#ffffff" strokeWidth="0.8" />
                <line x1={wt.x} y1={wt.y - wt.h} x2={wt.x + 8} y2={wt.y - wt.h + 8} stroke="#ffffff" strokeWidth="0.8" />
              </g>
            ))}
            {/* Dutch Orange Smoke Flares in Fan Stands */}
            <ellipse cx="230" cy="170" rx="35" ry="16" fill="#f97316" opacity="0.65" />
            <ellipse cx="245" cy="165" rx="25" ry="12" fill="#ea580c" opacity="0.5" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 12: SILVERSTONE, UK (Big Ben, London Eye & Silverstone Wing)  */}
        {/* =================================================================== */}
        {round === 12 && (
          <g>
            <rect width="400" height="240" fill="#0d1726" />
            {/* British Twilight Horizon */}
            <path d="M0,175 Q100,145 200,165 Q300,140 400,160 L400,205 L0,205 Z" fill="#142338" opacity="0.8" />
            {/* Silverstone Wing Paddock (Aerodynamic Sweeping Roofline) */}
            <g transform="translate(45, 115)">
              <path d="M0,60 C40,25 110,25 170,45 L170,65 L0,65 Z" fill="#38bdf8" opacity="0.9" />
              <rect x="15" y="45" width="140" height="15" fill="#0284c7" />
              {/* Glass VIP Boxes */}
              {Array.from({ length: 8 }).map((_, b) => (
                <rect key={b} x={25 + b * 15} y="48" width="10" height="8" fill="#bae6fd" />
              ))}
            </g>
            {/* Big Ben (Elizabeth Tower with Glowing Clock Face) */}
            <g transform="translate(255, 38)">
              {/* Gothic Spire Tower */}
              <rect x="25" y="45" width="26" height="120" fill="#0369a1" stroke="#38bdf8" strokeWidth="0.8" />
              <polygon points="21,45 38,12 55,45" fill="#0284c7" />
              <line x1="38" y1="12" x2="38" y2="0" stroke="#fde047" strokeWidth="1.8" />
              <circle cx="38" cy="0" r="2" fill="#fde047" />
              {/* Illuminated Clock Dial */}
              <circle cx="38" cy="58" r="8" fill="#fef08a" stroke="#0284c7" strokeWidth="1.5" />
              <line x1="38" y1="58" x2="38" y2="53" stroke="#0f172a" strokeWidth="1.5" />
              <line x1="38" y1="58" x2="42" y2="58" stroke="#0f172a" strokeWidth="1.5" />
            </g>
            {/* The London Eye Wheel */}
            <g transform="translate(325, 95)">
              <circle cx="32" cy="32" r="30" fill="none" stroke="#60a5fa" strokeWidth="1.8" opacity="0.75" />
              <circle cx="32" cy="32" r="20" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.6" strokeDasharray="3 2" />
              <line x1="32" y1="32" x2="18" y2="72" stroke="#1d4ed8" strokeWidth="2.5" />
              <line x1="32" y1="32" x2="46" y2="72" stroke="#1d4ed8" strokeWidth="2.5" />
            </g>
            {/* WWII RAF Silverstone Airfield Hangar */}
            <g transform="translate(15, 145)">
              <path d="M0,35 Q25,12 50,35 Z" fill="#334155" stroke="#64748b" strokeWidth="1" />
            </g>
            {/* Rolling British Countryside with Hedgerows & Oak Canopies */}
            <path d="M0,240 L0,195 Q90,180 190,195 Q290,180 400,192 L400,240 Z" fill="#0a1a2e" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 13: MONTREAL, CANADA (Biosphère Dome, Olympic Tower & River)  */}
        {/* =================================================================== */}
        {round === 13 && (
          <g>
            <rect width="400" height="240" fill="#061c30" />
            {/* St. Lawrence River Water Gradient */}
            <rect x="0" y="175" width="400" height="65" fill="#02416b" />
            <line x1="20" y1="185" x2="110" y2="185" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
            <line x1="160" y1="195" x2="280" y2="195" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
            <line x1="260" y1="210" x2="380" y2="210" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
            {/* Buckminster Fuller Biosphère (Geodesic Dome Sphere) */}
            <g transform="translate(135, 75)">
              <circle cx="45" cy="45" r="42" fill="none" stroke="#38bdf8" strokeWidth="2.2" opacity="0.9" />
              {/* Geodesic internal lattice rings */}
              <circle cx="45" cy="45" r="28" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.75" />
              <circle cx="45" cy="45" r="14" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.75" />
              <line x1="3" y1="45" x2="87" y2="45" stroke="#7dd3fc" strokeWidth="1.2" />
              <line x1="45" y1="3" x2="45" y2="87" stroke="#7dd3fc" strokeWidth="1.2" />
              <line x1="15" y1="15" x2="75" y2="75" stroke="#7dd3fc" strokeWidth="1" />
              <line x1="15" y1="75" x2="75" y2="15" stroke="#7dd3fc" strokeWidth="1" />
            </g>
            {/* Montreal Olympic Stadium (165m Inclined Leaning Tower) */}
            <g transform="translate(255, 45)">
              {/* Dramatic 45-Degree Inclined Tower Mast */}
              <polygon points="15,130 50,10 62,10 40,130" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="56" cy="8" r="2.5" fill="#fde047" />
              {/* Elliptical Stadium Saucer Roof */}
              <ellipse cx="25" cy="115" rx="35" ry="12" fill="#0369a1" />
            </g>
            {/* Habitat 67 Modular Cube Architecture */}
            <g transform="translate(25, 135)">
              <rect x="0" y="20" width="18" height="18" fill="#1e293b" />
              <rect x="12" y="8" width="18" height="18" fill="#334155" />
              <rect x="25" y="18" width="18" height="18" fill="#1e293b" />
              <rect x="38" y="5" width="18" height="18" fill="#475569" />
            </g>
            {/* Jacques Cartier Steel Truss Bridge Spans */}
            <line x1="0" y1="172" x2="140" y2="172" stroke="#0ea5e9" strokeWidth="2.5" />
            <polygon points="20,172 35,145 50,172" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
            <polygon points="70,172 85,145 100,172" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 14: AUSTIN, USA (COTA 251-ft Red Tower & Texas Capitol)       */}
        {/* =================================================================== */}
        {round === 14 && (
          <g>
            <rect width="400" height="240" fill="#3b0f05" />
            {/* Texas Hill Country Golden Sunset Sky */}
            <ellipse cx="200" cy="100" rx="220" ry="85" fill="#ea580c" opacity="0.35" />
            {/* Rolling Limestone Bluffs Silhouette */}
            <path d="M0,175 Q90,135 190,160 Q290,130 400,155 L400,205 L0,205 Z" fill="#691d09" opacity="0.8" />
            {/* COTA Iconic 251-ft Observation Tower & Cascading Red Ribbons */}
            <g transform="translate(195, 25)">
              {/* Central Steel Elevator Shaft */}
              <line x1="25" y1="165" x2="25" y2="25" stroke="#ef4444" strokeWidth="5.5" />
              {/* Circular Observation Ring Platform */}
              <ellipse cx="25" cy="30" rx="20" ry="6" fill="#fef08a" stroke="#b91c1c" strokeWidth="1.2" />
              {/* Sweeping Cascading Red Veil Ribbons (Curving to Amphitheater) */}
              <path d="M25,28 Q60,75 80,165" fill="none" stroke="#dc2626" strokeWidth="4.5" opacity="0.95" />
              <path d="M25,28 Q70,90 95,165" fill="none" stroke="#ea580c" strokeWidth="3.5" opacity="0.85" />
              <path d="M25,28 Q80,105 110,165" fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.75" />
              {/* Beacon Top */}
              <circle cx="25" cy="20" r="2.5" fill="#fde047" />
            </g>
            {/* Texas State Capitol Dome Silhouette */}
            <g transform="translate(45, 95)">
              <rect x="25" y="45" width="40" height="35" fill="#9a3412" />
              <polygon points="25,45 45,15 65,45" fill="#c2410c" />
              <line x1="45" y1="15" x2="45" y2="4" stroke="#fde047" strokeWidth="1.8" />
              <circle cx="45" cy="4" r="2" fill="#ffffff" />
            </g>
            {/* Austin Downtown Skyline (Frost Bank Faceted Pyramid) */}
            <g transform="translate(310, 85)">
              <rect x="15" y="35" width="28" height="65" fill="#7c2d12" />
              <polygon points="15,35 29,10 43,35" fill="#f59e0b" opacity="0.9" />
            </g>
            {/* Texas Lone Star Red-White-Blue Run-Off Kerbs */}
            <path d="M0,240 L0,195 Q90,180 190,195 Q290,180 400,192 L400,240 Z" fill="#451206" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 15: LAS VEGAS, USA (The Sphere, Strip Casinos & Neon Glow)   */}
        {/* =================================================================== */}
        {round === 15 && (
          <g>
            <rect width="400" height="240" fill="#1e022b" />
            {/* Blazing Las Vegas Night Sky Glow */}
            <ellipse cx="200" cy="115" rx="220" ry="90" fill="#c026d3" opacity="0.35" />
            {/* The Sphere (Massive LED Animated Dome Arena) */}
            <g transform="translate(45, 75)">
              <ellipse cx="55" cy="65" rx="55" ry="48" fill="url(#vegasSpherePulse)" opacity="0.95" />
              {/* Concentric Neon Rings */}
              <ellipse cx="55" cy="65" rx="42" ry="36" fill="none" stroke="#f43f5e" strokeWidth="2.2" />
              <ellipse cx="55" cy="65" rx="28" ry="24" fill="none" stroke="#fde047" strokeWidth="2" />
              <ellipse cx="55" cy="65" rx="14" ry="12" fill="#fef08a" />
            </g>
            {/* Paris Las Vegas Replica Eiffel Tower */}
            <g transform="translate(195, 45)">
              <polygon points="12,145 28,25 34,25 50,145" fill="#a21caf" stroke="#f472b6" strokeWidth="1" />
              <line x1="31" y1="25" x2="31" y2="0" stroke="#fef08a" strokeWidth="2" />
              <circle cx="31" cy="0" r="2.5" fill="#ffffff" />
              {/* Lattice crossbars */}
              <line x1="20" y1="75" x2="42" y2="75" stroke="#fdf4ff" strokeWidth="1.5" />
              <line x1="16" y1="110" x2="46" y2="110" stroke="#fdf4ff" strokeWidth="1.5" />
            </g>
            {/* Luxor Black Glass Pyramid & Piercing Vertical Sky Beam */}
            <g transform="translate(285, 85)">
              <polygon points="0,110 38,20 76,110" fill="#090514" stroke="#c084fc" strokeWidth="1.2" />
              {/* 42.3-Billion-Candela Sky Beam shooting into space */}
              <polygon points="36,20 34,-80 42,-80 40,20" fill="#ffffff" opacity="0.85" />
              <polygon points="32,20 25,-80 51,-80 44,20" fill="#67e8f9" opacity="0.4" />
            </g>
            {/* High Roller 550-ft Observation Wheel */}
            <g transform="translate(345, 95)">
              <circle cx="24" cy="24" r="24" fill="none" stroke="#f43f5e" strokeWidth="1.8" opacity="0.8" />
              <circle cx="24" cy="24" r="14" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.7" />
            </g>
            {/* Strip Casinos & Neon Marquees */}
            <path d="M0,240 L0,200 L400,200 L400,240 Z" fill="#09010f" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 16: MEXICO CITY (Angel of Independence & Aztec Pyramid)       */}
        {/* =================================================================== */}
        {round === 16 && (
          <g>
            <rect width="400" height="240" fill="#2d1204" />
            {/* Distant Snowcapped Popocatépetl & Iztaccíhuatl Volcanoes */}
            <polygon points="0,185 80,105 160,185" fill="#5c1d06" opacity="0.75" />
            <polygon points="80,105 95,125 70,125" fill="#ffffff" opacity="0.85" />
            <polygon points="230,190 320,95 410,190" fill="#5c1d06" opacity="0.75" />
            <polygon points="320,95 338,120 305,120" fill="#ffffff" opacity="0.85" />
            {/* Ancient Aztec Mesoamerican Stepped Pyramid (Teotihuacán) */}
            <g transform="translate(35, 115)">
              {/* Stepped Terraces */}
              <polygon points="0,75 16,45 64,45 80,75" fill="#9a3412" stroke="#ea580c" strokeWidth="0.8" />
              <polygon points="14,45 26,20 54,20 66,45" fill="#c2410c" stroke="#f97316" strokeWidth="0.8" />
              {/* Top Shrine Temple */}
              <rect x="32" y="8" width="16" height="12" fill="#7c2d12" />
              {/* Center Staircase Ramp */}
              <polygon points="35,75 37,8 43,8 45,75" fill="#ea580c" />
            </g>
            {/* El Ángel de la Independencia (Winged Victory on Marble Column) */}
            <g transform="translate(195, 30)">
              {/* Corinthian Marble Column */}
              <rect x="18" y="45" width="10" height="110" fill="#f59e0b" stroke="#fef08a" strokeWidth="0.8" />
              <ellipse cx="23" cy="45" rx="12" ry="4" fill="#fef08a" />
              <rect x="12" y="150" width="22" height="10" fill="#b45309" />
              {/* 24-Karat Gold Winged Victory Angel */}
              <circle cx="23" cy="30" r="5" fill="#fde047" />
              {/* Laurel Crown Arm */}
              <line x1="23" y1="30" x2="29" y2="20" stroke="#fde047" strokeWidth="2" />
              <circle cx="30" cy="18" r="2.5" fill="#fde047" />
              {/* Outstretched Wings */}
              <path d="M23,30 Q8,18 4,32 Q15,30 23,32 Z" fill="#fef08a" />
              <path d="M23,30 Q38,18 42,32 Q31,30 23,32 Z" fill="#fef08a" />
            </g>
            {/* Foro Sol Baseball Stadium Grandstands */}
            <g transform="translate(285, 125)">
              <path d="M0,65 Q45,20 90,65" fill="#451a03" stroke="#dc2626" strokeWidth="3" />
              <polygon points="10,65 15,35 25,65" fill="#ef4444" />
              <polygon points="70,65 75,35 85,65" fill="#ef4444" />
            </g>
            {/* Purple Blooming Jacaranda Trees & Ground */}
            <ellipse cx="145" cy="185" rx="20" ry="14" fill="#a855f7" opacity="0.85" />
            <path d="M0,240 L0,195 Q90,180 190,195 Q290,180 400,192 L400,240 Z" fill="#381005" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 17: SÃO PAULO, BRAZIL (Ponte Estaiada X-Bridge & Skyline)     */}
        {/* =================================================================== */}
        {round === 17 && (
          <g>
            <rect width="400" height="240" fill="#042614" />
            {/* Sprawling São Paulo High-Rise Megalopolis Silhouette */}
            <path d="M0,185 L0,120 L15,120 L15,95 L35,95 L35,135 L60,135 L60,105 L80,105 L80,140 L110,140 L110,85 L135,85 L135,125 L165,125 L165,110 L190,110 L190,145 L220,145 L220,90 L245,90 L245,135 L280,135 L280,115 L310,115 L310,150 L345,150 L345,100 L375,100 L375,130 L400,130 L400,185 Z" fill="#093f24" opacity="0.85" />
            {/* Ponte Estaiada (138m Curved X-Shaped Concrete Pylon Bridge) */}
            <g transform="translate(145, 35)">
              {/* Massive X-Pylon Structure */}
              <line x1="25" y1="155" x2="65" y2="15" stroke="#22c55e" strokeWidth="5.5" />
              <line x1="65" y1="155" x2="25" y2="15" stroke="#22c55e" strokeWidth="5.5" />
              {/* Beacon on top */}
              <circle cx="45" cy="15" r="3" fill="#fde047" />
              {/* Criss-Cross Stay Cables */}
              {[40, 60, 80, 100, 120].map((cableY, idx) => (
                <g key={idx}>
                  <line x1="45" y1="55" x2="5" y2={cableY + 25} stroke="#86efac" strokeWidth="1.2" opacity="0.85" />
                  <line x1="45" y1="55" x2="85" y2={cableY + 25} stroke="#86efac" strokeWidth="1.2" opacity="0.85" />
                </g>
              ))}
            </g>
            {/* Interlagos Lakes Water Shimmer (Guarapiranga Reservoir) */}
            <rect x="0" y="185" width="400" height="55" fill="#032014" />
            <line x1="20" y1="195" x2="120" y2="195" stroke="#22c55e" strokeWidth="1.5" opacity="0.65" />
            <line x1="160" y1="205" x2="280" y2="205" stroke="#facc15" strokeWidth="1.6" opacity="0.7" />
            <line x1="260" y1="215" x2="380" y2="215" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
            {/* Tropical Atlantic Rainforest Palms & Golden Trumpet (Ipê) Trees */}
            <ellipse cx="65" cy="190" rx="18" ry="12" fill="#eab308" opacity="0.8" />
            <ellipse cx="345" cy="185" rx="20" ry="14" fill="#eab308" opacity="0.85" />
          </g>
        )}

        {/* =================================================================== */}
        {/* ROUND 18: ABU DHABI, UAE (Yas Viceroy LED Grid & Grand Mosque)      */}
        {/* =================================================================== */}
        {round === 18 && (
          <g>
            <rect width="400" height="240" fill="#081a2e" />
            {/* Arabian Night Sky with Floodlight Beam Flares */}
            <ellipse cx="200" cy="115" rx="220" ry="85" fill="#06b6d4" opacity="0.25" />
            {/* Sheikh Zayed Grand Mosque (Distant Domes & Minarets) */}
            <g transform="translate(25, 105)">
              {/* Central Grand Domes */}
              <ellipse cx="40" cy="35" rx="18" ry="18" fill="#e0f2fe" opacity="0.9" />
              <ellipse cx="18" cy="40" rx="12" ry="13" fill="#bae6fd" opacity="0.85" />
              <ellipse cx="62" cy="40" rx="12" ry="13" fill="#bae6fd" opacity="0.85" />
              {/* Slender Minarets */}
              <line x1="2" y1="65" x2="2" y2="10" stroke="#f8fafc" strokeWidth="2.5" />
              <circle cx="2" cy="8" r="2" fill="#fde047" />
              <line x1="78" y1="65" x2="78" y2="10" stroke="#f8fafc" strokeWidth="2.5" />
              <circle cx="78" cy="8" r="2" fill="#fde047" />
            </g>
            {/* Ferrari World Aerodynamic Crimson Roof Structure */}
            <g transform="translate(290, 120)">
              <path d="M0,50 Q45,15 90,50 L90,65 Q45,30 0,65 Z" fill="#dc2626" stroke="#facc15" strokeWidth="1.2" />
              <circle cx="45" cy="35" r="5" fill="#fde047" />
            </g>
            {/* W Abu Dhabi Yas Marina Hotel Curved LED "Grid-Shell" Canopy */}
            <g transform="translate(115, 55)">
              {/* Hotel Main Twin Towers */}
              <rect x="25" y="45" width="45" height="75" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
              <rect x="95" y="45" width="45" height="75" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1" />
              {/* Curved 217m Diamond LED Grid-Shell Arch spanning across track */}
              <path d="M5,100 C30,15 135,15 160,100 C130,45 35,45 5,100 Z" fill="url(#yasGridCanopy)" opacity="0.9" />
              {/* Diamond Mesh Pattern Lines */}
              {Array.from({ length: 7 }).map((_, m) => (
                <line key={m} x1={20 + m * 18} y1="35" x2={35 + m * 18} y2="85" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />
              ))}
            </g>
            {/* Yas Marina Mega-Yachts Moored in Harbour */}
            <rect x="0" y="180" width="400" height="60" fill="#031828" />
            {[
              { x: 50, len: 55 },
              { x: 155, len: 65 },
              { x: 260, len: 55 },
            ].map((yacht, idx) => (
              <g key={idx} transform={`translate(${yacht.x}, 188)`}>
                <polygon points={`0,0 ${yacht.len},0 ${yacht.len - 8},12 8,12`} fill="#ffffff" />
                <rect x="12" y="-6" width={yacht.len - 24} height="6" fill="#0284c7" />
                <line x1={yacht.len / 2} y1="-6" x2={yacht.len / 2} y2="-14" stroke="#94a3b8" strokeWidth="1.2" />
                <circle cx={yacht.len / 2} cy="-14" r="1.5" fill="#fde047" />
              </g>
            ))}
            {/* Shimmering Marina Water Reflections */}
            <line x1="20" y1="210" x2="120" y2="210" stroke="#06b6d4" strokeWidth="1.5" opacity="0.75" />
            <line x1="160" y1="218" x2="280" y2="218" stroke="#a855f7" strokeWidth="1.5" opacity="0.8" />
            <line x1="250" y1="228" x2="380" y2="228" stroke="#38bdf8" strokeWidth="1.5" opacity="0.65" />
          </g>
        )}

        {/* Universal Dark Gradient Overlay to ensure Card Text Contrast */}
        <rect width="400" height="240" fill={`url(#grad-card-${round})`} />
      </svg>
    </div>
  );
};
