import React from 'react';

export interface CountryFlagProps {
  code?: string | { code?: string; name?: string; flag?: string } | null;
  name?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

// Mapping of country codes, names, and emoji flags to normalized uppercase 2-letter ISO codes and display names
const COUNTRY_LOOKUP: Record<string, { code: string; name: string }> = {
  // United Kingdom
  gb: { code: 'GB', name: 'United Kingdom' },
  uk: { code: 'GB', name: 'United Kingdom' },
  gbr: { code: 'GB', name: 'United Kingdom' },
  '🇬🇧': { code: 'GB', name: 'United Kingdom' },
  'united kingdom': { code: 'GB', name: 'United Kingdom' },

  // Thailand
  th: { code: 'TH', name: 'Thailand' },
  tha: { code: 'TH', name: 'Thailand' },
  '🇹🇭': { code: 'TH', name: 'Thailand' },
  thailand: { code: 'TH', name: 'Thailand' },

  // France
  fr: { code: 'FR', name: 'France' },
  fra: { code: 'FR', name: 'France' },
  '🇫🇷': { code: 'FR', name: 'France' },
  france: { code: 'FR', name: 'France' },

  // Germany
  de: { code: 'DE', name: 'Germany' },
  deu: { code: 'DE', name: 'Germany' },
  ger: { code: 'DE', name: 'Germany' },
  '🇩🇪': { code: 'DE', name: 'Germany' },
  germany: { code: 'DE', name: 'Germany' },

  // Italy
  it: { code: 'IT', name: 'Italy' },
  ita: { code: 'IT', name: 'Italy' },
  '🇮🇹': { code: 'IT', name: 'Italy' },
  italy: { code: 'IT', name: 'Italy' },

  // Spain
  es: { code: 'ES', name: 'Spain' },
  esp: { code: 'ES', name: 'Spain' },
  '🇪🇸': { code: 'ES', name: 'Spain' },
  spain: { code: 'ES', name: 'Spain' },

  // Netherlands
  nl: { code: 'NL', name: 'Netherlands' },
  nld: { code: 'NL', name: 'Netherlands' },
  ned: { code: 'NL', name: 'Netherlands' },
  '🇳🇱': { code: 'NL', name: 'Netherlands' },
  netherlands: { code: 'NL', name: 'Netherlands' },

  // Brazil
  br: { code: 'BR', name: 'Brazil' },
  bra: { code: 'BR', name: 'Brazil' },
  '🇧🇷': { code: 'BR', name: 'Brazil' },
  brazil: { code: 'BR', name: 'Brazil' },

  // Argentina
  ar: { code: 'AR', name: 'Argentina' },
  arg: { code: 'AR', name: 'Argentina' },
  '🇦🇷': { code: 'AR', name: 'Argentina' },
  argentina: { code: 'AR', name: 'Argentina' },

  // Japan
  jp: { code: 'JP', name: 'Japan' },
  jpn: { code: 'JP', name: 'Japan' },
  '🇯🇵': { code: 'JP', name: 'Japan' },
  japan: { code: 'JP', name: 'Japan' },

  // United States
  us: { code: 'US', name: 'United States' },
  usa: { code: 'US', name: 'United States' },
  '🇺🇸': { code: 'US', name: 'United States' },
  'united states': { code: 'US', name: 'United States' },

  // Australia
  au: { code: 'AU', name: 'Australia' },
  aus: { code: 'AU', name: 'Australia' },
  '🇦🇺': { code: 'AU', name: 'Australia' },
  australia: { code: 'AU', name: 'Australia' },

  // Mexico
  mx: { code: 'MX', name: 'Mexico' },
  mex: { code: 'MX', name: 'Mexico' },
  '🇲🇽': { code: 'MX', name: 'Mexico' },
  mexico: { code: 'MX', name: 'Mexico' },

  // Finland
  fi: { code: 'FI', name: 'Finland' },
  fin: { code: 'FI', name: 'Finland' },
  '🇫🇮': { code: 'FI', name: 'Finland' },
  finland: { code: 'FI', name: 'Finland' },

  // Monaco
  mc: { code: 'MC', name: 'Monaco' },
  mon: { code: 'MC', name: 'Monaco' },
  '🇲🇨': { code: 'MC', name: 'Monaco' },
  monaco: { code: 'MC', name: 'Monaco' },

  // Canada
  ca: { code: 'CA', name: 'Canada' },
  can: { code: 'CA', name: 'Canada' },
  '🇨🇦': { code: 'CA', name: 'Canada' },
  canada: { code: 'CA', name: 'Canada' },

  // Sweden
  se: { code: 'SE', name: 'Sweden' },
  swe: { code: 'SE', name: 'Sweden' },
  '🇸🇪': { code: 'SE', name: 'Sweden' },
  sweden: { code: 'SE', name: 'Sweden' },

  // Belgium
  be: { code: 'BE', name: 'Belgium' },
  bel: { code: 'BE', name: 'Belgium' },
  '🇧🇪': { code: 'BE', name: 'Belgium' },
  belgium: { code: 'BE', name: 'Belgium' },

  // Colombia
  co: { code: 'CO', name: 'Colombia' },
  col: { code: 'CO', name: 'Colombia' },
  '🇨🇴': { code: 'CO', name: 'Colombia' },
  colombia: { code: 'CO', name: 'Colombia' },

  // Singapore
  sg: { code: 'SG', name: 'Singapore' },
  sgp: { code: 'SG', name: 'Singapore' },
  sin: { code: 'SG', name: 'Singapore' },
  '🇸🇬': { code: 'SG', name: 'Singapore' },
  singapore: { code: 'SG', name: 'Singapore' },

  // China
  cn: { code: 'CN', name: 'China' },
  chn: { code: 'CN', name: 'China' },
  '🇨🇳': { code: 'CN', name: 'China' },
  china: { code: 'CN', name: 'China' },

  // South Korea
  kr: { code: 'KR', name: 'South Korea' },
  kor: { code: 'KR', name: 'South Korea' },
  '🇰🇷': { code: 'KR', name: 'South Korea' },
  'south korea': { code: 'KR', name: 'South Korea' },

  // New Zealand
  nz: { code: 'NZ', name: 'New Zealand' },
  nzl: { code: 'NZ', name: 'New Zealand' },
  '🇳🇿': { code: 'NZ', name: 'New Zealand' },
  'new zealand': { code: 'NZ', name: 'New Zealand' },

  // South Africa
  za: { code: 'ZA', name: 'South Africa' },
  zaf: { code: 'ZA', name: 'South Africa' },
  rsa: { code: 'ZA', name: 'South Africa' },
  '🇿🇦': { code: 'ZA', name: 'South Africa' },
  'south africa': { code: 'ZA', name: 'South Africa' },

  // Morocco
  ma: { code: 'MA', name: 'Morocco' },
  mar: { code: 'MA', name: 'Morocco' },
  '🇲🇦': { code: 'MA', name: 'Morocco' },
  morocco: { code: 'MA', name: 'Morocco' },

  // Kenya
  ke: { code: 'KE', name: 'Kenya' },
  ken: { code: 'KE', name: 'Kenya' },
  '🇰🇪': { code: 'KE', name: 'Kenya' },
  kenya: { code: 'KE', name: 'Kenya' },

  // UAE
  ae: { code: 'AE', name: 'UAE' },
  uae: { code: 'AE', name: 'UAE' },
  are: { code: 'AE', name: 'UAE' },
  '🇦🇪': { code: 'AE', name: 'UAE' },
  'united arab emirates': { code: 'AE', name: 'UAE' },

  // Switzerland
  ch: { code: 'CH', name: 'Switzerland' },
  che: { code: 'CH', name: 'Switzerland' },
  sui: { code: 'CH', name: 'Switzerland' },
  '🇨🇭': { code: 'CH', name: 'Switzerland' },
  switzerland: { code: 'CH', name: 'Switzerland' },

  // Austria
  at: { code: 'AT', name: 'Austria' },
  aut: { code: 'AT', name: 'Austria' },
  '🇦🇹': { code: 'AT', name: 'Austria' },
  austria: { code: 'AT', name: 'Austria' },

  // Denmark
  dk: { code: 'DK', name: 'Denmark' },
  dnk: { code: 'DK', name: 'Denmark' },
  '🇩🇰': { code: 'DK', name: 'Denmark' },
  denmark: { code: 'DK', name: 'Denmark' },

  // Poland
  pl: { code: 'PL', name: 'Poland' },
  pol: { code: 'PL', name: 'Poland' },
  '🇵🇱': { code: 'PL', name: 'Poland' },
  poland: { code: 'PL', name: 'Poland' },

  // Portugal
  pt: { code: 'PT', name: 'Portugal' },
  prt: { code: 'PT', name: 'Portugal' },
  por: { code: 'PT', name: 'Portugal' },
  '🇵🇹': { code: 'PT', name: 'Portugal' },
  portugal: { code: 'PT', name: 'Portugal' },

  // Ireland
  ie: { code: 'IE', name: 'Ireland' },
  irl: { code: 'IE', name: 'Ireland' },
  '🇮🇪': { code: 'IE', name: 'Ireland' },
  ireland: { code: 'IE', name: 'Ireland' },

  // Nigeria
  ng: { code: 'NG', name: 'Nigeria' },
  nga: { code: 'NG', name: 'Nigeria' },
  '🇳🇬': { code: 'NG', name: 'Nigeria' },
  nigeria: { code: 'NG', name: 'Nigeria' },

  // Russia
  ru: { code: 'RU', name: 'Russia' },
  rus: { code: 'RU', name: 'Russia' },
  '🇷🇺': { code: 'RU', name: 'Russia' },
  russia: { code: 'RU', name: 'Russia' },

  // Czechia / Czech Republic
  cz: { code: 'CZ', name: 'Czechia' },
  cze: { code: 'CZ', name: 'Czechia' },
  '🇨🇿': { code: 'CZ', name: 'Czechia' },
  czechia: { code: 'CZ', name: 'Czechia' },
  'czech republic': { code: 'CZ', name: 'Czechia' },
};

/**
 * Resolves country code and display name from any input (string code, country name, emoji, or nationality object)
 */
export function resolveCountry(
  identifier?: string | { code?: string; name?: string; flag?: string } | null,
  fallbackName?: string
): { code: string; name: string } {
  if (!identifier && !fallbackName) {
    return { code: 'INT', name: 'International' };
  }

  let rawStr = '';
  let hintName = fallbackName || '';

  if (typeof identifier === 'object' && identifier !== null) {
    rawStr = (identifier.code || identifier.flag || identifier.name || '').trim();
    hintName = hintName || identifier.name || '';
  } else if (typeof identifier === 'string') {
    rawStr = identifier.trim();
  }

  const lookupKey = (rawStr || hintName).toLowerCase();
  if (COUNTRY_LOOKUP[lookupKey]) {
    return COUNTRY_LOOKUP[lookupKey];
  }

  // Check hintName if lookupKey wasn't matched
  if (hintName) {
    const fn = hintName.trim().toLowerCase();
    if (COUNTRY_LOOKUP[fn]) {
      return COUNTRY_LOOKUP[fn];
    }
  }

  const cleanCode = rawStr.toUpperCase().substring(0, 3);
  return {
    code: cleanCode || 'INT',
    name: hintName || rawStr || 'International',
  };
}

/**
 * Renders an inline pure SVG national flag
 */
export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  name,
  className = '',
  size = 'md',
  showTooltip = true,
}) => {
  const resolved = resolveCountry(code, name);
  const countryCode = resolved.code;
  const countryName = resolved.name;

  // Size dimensions (4:3 aspect ratio, exact specifications: lg ~28x19px, md ~24x16px, sm ~20x14px)
  const sizeClasses = {
    sm: 'w-[20px] h-[14px]',
    md: 'w-[24px] h-[16px]',
    lg: 'w-[28px] h-[19px]',
  }[size];

  const tooltipText = `${countryName} (${countryCode})`;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center align-middle rounded-[2.5px] overflow-hidden border border-slate-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.5)] bg-[#141b25] select-none ${sizeClasses} ${className}`}
      title={showTooltip ? tooltipText : undefined}
    >
      <svg
        viewBox="0 0 640 480"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderSvgFlagPaths(countryCode)}
      </svg>
    </span>
  );
};

/**
 * Single function renderer as requested: renderFlag(countryCode, size, name)
 * Supports string code, country name, emoji, or nationality object
 */
export function renderFlag(
  countryInput?: string | { code?: string; name?: string; flag?: string } | null,
  size: 'sm' | 'md' | 'lg' = 'md',
  name?: string
): React.ReactElement {
  return <CountryFlag code={countryInput} name={name} size={size} />;
}

// Pure SVG paths for each supported country
function renderSvgFlagPaths(code: string): React.ReactNode {
  switch (code) {
    // ----------------------------------------------------
    // THAILAND (Red, White, Blue, White, Red: 1:1:2:1:1)
    // ----------------------------------------------------
    case 'TH':
      return (
        <g>
          <rect width="640" height="480" fill="#A51931" />
          <rect y="80" width="640" height="320" fill="#F4F5F8" />
          <rect y="160" width="640" height="160" fill="#2D2A4A" />
        </g>
      );

    // ----------------------------------------------------
    // UNITED KINGDOM (Union Jack)
    // ----------------------------------------------------
    case 'GB':
      return (
        <g>
          <rect width="640" height="480" fill="#012169" />
          {/* White Saltire (St. Andrew) */}
          <path d="M 0 0 L 640 480 M 640 0 L 0 480" stroke="#FFFFFF" strokeWidth="80" />
          {/* Red Saltire (St. Patrick) */}
          <path d="M 0 0 L 320 240 M 640 480 L 320 240 M 640 0 L 320 240 M 0 480 L 320 240" stroke="#C8102E" strokeWidth="26" />
          {/* White St. George Cross Border */}
          <rect x="256" width="128" height="480" fill="#FFFFFF" />
          <rect y="176" width="640" height="128" fill="#FFFFFF" />
          {/* Red St. George Cross */}
          <rect x="276" width="88" height="480" fill="#C8102E" />
          <rect y="196" width="640" height="88" fill="#C8102E" />
        </g>
      );

    // ----------------------------------------------------
    // FRANCE (Vertical Tricolour: Blue, White, Red)
    // ----------------------------------------------------
    case 'FR':
      return (
        <g>
          <rect width="213.3" height="480" fill="#002654" />
          <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
          <rect x="426.7" width="213.3" height="480" fill="#ED2939" />
        </g>
      );

    // ----------------------------------------------------
    // GERMANY (Horizontal Tricolour: Black, Red, Gold)
    // ----------------------------------------------------
    case 'DE':
      return (
        <g>
          <rect width="640" height="160" fill="#000000" />
          <rect y="160" width="640" height="160" fill="#DD0000" />
          <rect y="320" width="640" height="160" fill="#FFCE00" />
        </g>
      );

    // ----------------------------------------------------
    // ITALY (Vertical Tricolour: Green, White, Red)
    // ----------------------------------------------------
    case 'IT':
      return (
        <g>
          <rect width="213.3" height="480" fill="#009246" />
          <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
          <rect x="426.7" width="213.3" height="480" fill="#CE2B37" />
        </g>
      );

    // ----------------------------------------------------
    // SPAIN (Horizontal Red, Yellow, Red + Shield)
    // ----------------------------------------------------
    case 'ES':
      return (
        <g>
          <rect width="640" height="120" fill="#AA151B" />
          <rect y="120" width="640" height="240" fill="#F1BF00" />
          <rect y="360" width="640" height="120" fill="#AA151B" />
          {/* Spanish Coat of Arms Stylized Shield */}
          <g transform="translate(190, 240)">
            <path d="M -30 -35 L 30 -35 L 30 15 C 30 35 0 50 0 50 C 0 50 -30 35 -30 15 Z" fill="#AA151B" stroke="#F1BF00" strokeWidth="4" />
            <rect x="-18" y="-22" width="36" height="28" fill="#F1BF00" />
            <circle cx="0" cy="-5" r="7" fill="#002654" />
            <circle cx="0" cy="-45" r="8" fill="#F1BF00" />
          </g>
        </g>
      );

    // ----------------------------------------------------
    // NETHERLANDS (Horizontal Red, White, Blue)
    // ----------------------------------------------------
    case 'NL':
      return (
        <g>
          <rect width="640" height="160" fill="#AE1C28" />
          <rect y="160" width="640" height="160" fill="#FFFFFF" />
          <rect y="320" width="640" height="160" fill="#21468B" />
        </g>
      );

    // ----------------------------------------------------
    // MONACO (Horizontal Red, White)
    // ----------------------------------------------------
    case 'MC':
      return (
        <g>
          <rect width="640" height="240" fill="#CE1126" />
          <rect y="240" width="640" height="240" fill="#FFFFFF" />
        </g>
      );

    // ----------------------------------------------------
    // JAPAN (White with Crimson Sun)
    // ----------------------------------------------------
    case 'JP':
      return (
        <g>
          <rect width="640" height="480" fill="#FFFFFF" />
          <circle cx="320" cy="240" r="144" fill="#BC002D" />
        </g>
      );

    // ----------------------------------------------------
    // BRAZIL (Green, Yellow Rhombus, Blue Globe with Band)
    // ----------------------------------------------------
    case 'BR':
      return (
        <g>
          <rect width="640" height="480" fill="#009739" />
          <polygon points="320,40 580,240 320,440 60,240" fill="#FEDD00" />
          <circle cx="320" cy="240" r="105" fill="#012169" />
          <path d="M 220 248 Q 320 216 420 258" stroke="#FFFFFF" strokeWidth="16" fill="none" />
          <circle cx="330" cy="285" r="4" fill="#FFFFFF" />
          <circle cx="305" cy="265" r="3" fill="#FFFFFF" />
        </g>
      );

    // ----------------------------------------------------
    // ARGENTINA (Light Blue, White, Light Blue + Sun of May)
    // ----------------------------------------------------
    case 'AR':
      return (
        <g>
          <rect width="640" height="160" fill="#74ACDF" />
          <rect y="160" width="640" height="160" fill="#FFFFFF" />
          <rect y="320" width="640" height="160" fill="#74ACDF" />
          <circle cx="320" cy="240" r="38" fill="#F6B40E" stroke="#85340A" strokeWidth="2" />
          <g stroke="#F6B40E" strokeWidth="3">
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              const x1 = 320 + Math.cos(rad) * 42;
              const y1 = 240 + Math.sin(rad) * 42;
              const x2 = 320 + Math.cos(rad) * 64;
              const y2 = 240 + Math.sin(rad) * 64;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>
        </g>
      );

    // ----------------------------------------------------
    // UNITED STATES (13 Stripes + Blue Canton with Stars)
    // ----------------------------------------------------
    case 'US':
      return (
        <g>
          <rect width="640" height="480" fill="#FFFFFF" />
          {[0, 2, 4, 6, 8, 10, 12].map((i) => (
            <rect key={i} y={(i * 480) / 13} width="640" height={480 / 13} fill="#B22234" />
          ))}
          <rect width="260" height={(7 * 480) / 13} fill="#3C3B6E" />
          <g fill="#FFFFFF">
            {[...Array(24)].map((_, idx) => {
              const col = idx % 6;
              const row = Math.floor(idx / 6);
              return (
                <circle key={idx} cx={30 + col * 40} cy={28 + row * 55} r="4.5" />
              );
            })}
          </g>
        </g>
      );

    // ----------------------------------------------------
    // AUSTRALIA (Blue, Union Jack Canton, Southern Cross)
    // ----------------------------------------------------
    case 'AU':
      return (
        <g>
          <rect width="640" height="480" fill="#00008B" />
          {/* Mini Union Jack in Canton */}
          <g transform="scale(0.5)">
            <rect width="640" height="480" fill="#012169" />
            <path d="M 0 0 L 640 480 M 640 0 L 0 480" stroke="#FFFFFF" strokeWidth="80" />
            <path d="M 0 0 L 320 240 M 640 480 L 320 240 M 640 0 L 320 240 M 0 480 L 320 240" stroke="#C8102E" strokeWidth="26" />
            <rect x="256" width="128" height="480" fill="#FFFFFF" />
            <rect y="176" width="640" height="128" fill="#FFFFFF" />
            <rect x="276" width="88" height="480" fill="#C8102E" />
            <rect y="196" width="640" height="88" fill="#C8102E" />
          </g>
          {/* Commonwealth Star */}
          <circle cx="160" cy="360" r="28" fill="#FFFFFF" />
          {/* Southern Cross */}
          <circle cx="480" cy="110" r="10" fill="#FFFFFF" />
          <circle cx="560" cy="200" r="10" fill="#FFFFFF" />
          <circle cx="510" cy="370" r="10" fill="#FFFFFF" />
          <circle cx="430" cy="240" r="10" fill="#FFFFFF" />
          <circle cx="490" cy="265" r="6" fill="#FFFFFF" />
        </g>
      );

    // ----------------------------------------------------
    // MEXICO (Green, White, Red with Emblem)
    // ----------------------------------------------------
    case 'MX':
      return (
        <g>
          <rect width="213.3" height="480" fill="#006847" />
          <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
          <rect x="426.7" width="213.3" height="480" fill="#CE1126" />
          {/* Golden/Brown Eagle Emblem */}
          <circle cx="320" cy="240" r="36" fill="#8B5A2B" opacity="0.8" />
          <path d="M 305 240 Q 320 220 335 240 L 320 260 Z" fill="#D4AF37" />
        </g>
      );

    // ----------------------------------------------------
    // FINLAND (White with Blue Nordic Cross)
    // ----------------------------------------------------
    case 'FI':
      return (
        <g>
          <rect width="640" height="480" fill="#FFFFFF" />
          <rect x="180" width="90" height="480" fill="#003580" />
          <rect y="195" width="640" height="90" fill="#003580" />
        </g>
      );

    // ----------------------------------------------------
    // CANADA (Red, White with Maple Leaf, Red)
    // ----------------------------------------------------
    case 'CA':
      return (
        <g>
          <rect width="160" height="480" fill="#D80621" />
          <rect x="160" width="320" height="480" fill="#FFFFFF" />
          <rect x="480" width="160" height="480" fill="#D80621" />
          {/* Stylized Canadian Maple Leaf */}
          <g transform="translate(320, 240) scale(1.6)">
            <polygon
              points="0,-60 12,-35 30,-42 22,-20 48,-15 35,5 45,20 18,18 10,42 0,25 -10,42 -18,18 -45,20 -35,5 -48,-15 -22,-20 -30,-42 -12,-35"
              fill="#D80621"
            />
            <rect x="-3" y="15" width="6" height="35" fill="#D80621" />
          </g>
        </g>
      );

    // ----------------------------------------------------
    // SWEDEN (Blue with Yellow Nordic Cross)
    // ----------------------------------------------------
    case 'SE':
      return (
        <g>
          <rect width="640" height="480" fill="#005293" />
          <rect x="180" width="80" height="480" fill="#FECC00" />
          <rect y="200" width="640" height="80" fill="#FECC00" />
        </g>
      );

    // ----------------------------------------------------
    // BELGIUM (Black, Yellow, Red)
    // ----------------------------------------------------
    case 'BE':
      return (
        <g>
          <rect width="213.3" height="480" fill="#000000" />
          <rect x="213.3" width="213.4" height="480" fill="#FDDA24" />
          <rect x="426.7" width="213.3" height="480" fill="#EF3340" />
        </g>
      );

    // ----------------------------------------------------
    // COLOMBIA (Yellow 2x, Blue, Red)
    // ----------------------------------------------------
    case 'CO':
      return (
        <g>
          <rect width="640" height="240" fill="#FCD116" />
          <rect y="240" width="640" height="120" fill="#003893" />
          <rect y="360" width="640" height="120" fill="#CE1126" />
        </g>
      );

    // ----------------------------------------------------
    // SINGAPORE (Red, White with Crescent & 5 Stars)
    // ----------------------------------------------------
    case 'SG':
      return (
        <g>
          <rect width="640" height="240" fill="#EE2737" />
          <rect y="240" width="640" height="240" fill="#FFFFFF" />
          {/* Crescent */}
          <path d="M 150 70 A 55 55 0 1 0 150 170 A 45 45 0 1 1 150 70 Z" fill="#FFFFFF" />
          {/* 5 Stars */}
          <circle cx="165" cy="95" r="5" fill="#FFFFFF" />
          <circle cx="190" cy="105" r="5" fill="#FFFFFF" />
          <circle cx="180" cy="130" r="5" fill="#FFFFFF" />
          <circle cx="150" cy="130" r="5" fill="#FFFFFF" />
          <circle cx="140" cy="105" r="5" fill="#FFFFFF" />
        </g>
      );

    // ----------------------------------------------------
    // CHINA (Red with 5 Golden Stars)
    // ----------------------------------------------------
    case 'CN':
      return (
        <g>
          <rect width="640" height="480" fill="#DE2910" />
          {/* Big Star */}
          <circle cx="110" cy="120" r="36" fill="#FFDE00" />
          {/* 4 Small Stars */}
          <circle cx="210" cy="65" r="11" fill="#FFDE00" />
          <circle cx="245" cy="115" r="11" fill="#FFDE00" />
          <circle cx="245" cy="175" r="11" fill="#FFDE00" />
          <circle cx="210" cy="225" r="11" fill="#FFDE00" />
        </g>
      );

    // ----------------------------------------------------
    // SOUTH KOREA (White with Taegeuk & Trigrams)
    // ----------------------------------------------------
    case 'KR':
      return (
        <g>
          <rect width="640" height="480" fill="#FFFFFF" />
          {/* Taegeuk Symbol */}
          <path d="M 320 160 A 80 80 0 0 1 320 320 A 40 40 0 0 1 320 240 A 40 40 0 0 0 320 160 Z" fill="#CD2E3A" />
          <path d="M 320 320 A 80 80 0 0 1 320 160 A 40 40 0 0 1 320 240 A 40 40 0 0 0 320 320 Z" fill="#0047A0" />
          {/* Corner Trigrams */}
          <rect x="100" y="80" width="50" height="8" fill="#000000" transform="rotate(35 125 84)" />
          <rect x="100" y="95" width="50" height="8" fill="#000000" transform="rotate(35 125 84)" />
          <rect x="490" y="80" width="50" height="8" fill="#000000" transform="rotate(-35 515 84)" />
          <rect x="490" y="95" width="50" height="8" fill="#000000" transform="rotate(-35 515 84)" />
        </g>
      );

    // ----------------------------------------------------
    // NEW ZEALAND (Blue, Union Jack, 4 Red Stars with White Border)
    // ----------------------------------------------------
    case 'NZ':
      return (
        <g>
          <rect width="640" height="480" fill="#00247D" />
          <g transform="scale(0.5)">
            <rect width="640" height="480" fill="#012169" />
            <path d="M 0 0 L 640 480 M 640 0 L 0 480" stroke="#FFFFFF" strokeWidth="80" />
            <path d="M 0 0 L 320 240 M 640 480 L 320 240 M 640 0 L 320 240 M 0 480 L 320 240" stroke="#C8102E" strokeWidth="26" />
            <rect x="256" width="128" height="480" fill="#FFFFFF" />
            <rect y="176" width="640" height="128" fill="#FFFFFF" />
            <rect x="276" width="88" height="480" fill="#C8102E" />
            <rect y="196" width="640" height="88" fill="#C8102E" />
          </g>
          {/* Southern Cross Red with White Border */}
          <circle cx="480" cy="110" r="12" fill="#CC142B" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="550" cy="200" r="12" fill="#CC142B" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="480" cy="350" r="12" fill="#CC142B" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="420" cy="240" r="12" fill="#CC142B" stroke="#FFFFFF" strokeWidth="3" />
        </g>
      );

    // ----------------------------------------------------
    // SOUTH AFRICA (Red, Blue, Green Y-chevron, Black triangle)
    // ----------------------------------------------------
    case 'ZA':
      return (
        <g>
          <rect width="640" height="240" fill="#E03C31" />
          <rect y="240" width="640" height="240" fill="#001489" />
          {/* Green Y band with white borders */}
          <polygon points="0,0 240,240 0,480" fill="#000000" />
          <polygon points="0,0 240,240 0,480" stroke="#FFB81C" strokeWidth="25" fill="none" />
          <path d="M 0 30 L 210 240 L 640 240 M 0 450 L 210 240" stroke="#FFFFFF" strokeWidth="60" fill="none" />
          <path d="M 0 30 L 210 240 L 640 240 M 0 450 L 210 240" stroke="#007749" strokeWidth="38" fill="none" />
        </g>
      );

    // ----------------------------------------------------
    // MOROCCO (Red with Green 5-point Star)
    // ----------------------------------------------------
    case 'MA':
      return (
        <g>
          <rect width="640" height="480" fill="#C1272D" />
          {/* Green Star Pentagram */}
          <polygon
            points="320,150 340,215 410,215 352,255 375,320 320,280 265,320 288,255 230,215 300,215"
            stroke="#006233"
            strokeWidth="8"
            fill="none"
          />
        </g>
      );

    // ----------------------------------------------------
    // KENYA (Black, Red with White Border, Green + Shield)
    // ----------------------------------------------------
    case 'KE':
      return (
        <g>
          <rect width="640" height="150" fill="#000000" />
          <rect y="150" width="640" height="180" fill="#FFFFFF" />
          <rect y="165" width="640" height="150" fill="#922529" />
          <rect y="330" width="640" height="150" fill="#006600" />
          {/* Maasai Shield */}
          <ellipse cx="320" cy="240" rx="36" ry="70" fill="#922529" stroke="#FFFFFF" strokeWidth="4" />
          <ellipse cx="320" cy="240" rx="12" ry="70" fill="#000000" />
        </g>
      );

    // ----------------------------------------------------
    // UNITED ARAB EMIRATES (Red Hoist, Green, White, Black)
    // ----------------------------------------------------
    case 'AE':
      return (
        <g>
          <rect x="160" width="480" height="160" fill="#00732F" />
          <rect x="160" y="160" width="480" height="160" fill="#FFFFFF" />
          <rect x="160" y="320" width="480" height="160" fill="#000000" />
          <rect width="160" height="480" fill="#FF0000" />
        </g>
      );

    // ----------------------------------------------------
    // SWITZERLAND (Red with White Cross)
    // ----------------------------------------------------
    case 'CH':
      return (
        <g>
          <rect width="640" height="480" fill="#D52B1E" />
          <rect x="275" y="130" width="90" height="220" fill="#FFFFFF" />
          <rect x="210" y="195" width="220" height="90" fill="#FFFFFF" />
        </g>
      );

    // ----------------------------------------------------
    // AUSTRIA (Red, White, Red)
    // ----------------------------------------------------
    case 'AT':
      return (
        <g>
          <rect width="640" height="160" fill="#ED2939" />
          <rect y="160" width="640" height="160" fill="#FFFFFF" />
          <rect y="320" width="640" height="160" fill="#ED2939" />
        </g>
      );

    // ----------------------------------------------------
    // DENMARK (Red with White Nordic Cross)
    // ----------------------------------------------------
    case 'DK':
      return (
        <g>
          <rect width="640" height="480" fill="#C60C30" />
          <rect x="180" width="70" height="480" fill="#FFFFFF" />
          <rect y="205" width="640" height="70" fill="#FFFFFF" />
        </g>
      );

    // ----------------------------------------------------
    // POLAND (White, Crimson Red)
    // ----------------------------------------------------
    case 'PL':
      return (
        <g>
          <rect width="640" height="240" fill="#FFFFFF" />
          <rect y="240" width="640" height="240" fill="#DC143C" />
        </g>
      );

    // ----------------------------------------------------
    // PORTUGAL (Green, Red + Armillary Sphere)
    // ----------------------------------------------------
    case 'PT':
      return (
        <g>
          <rect width="256" height="480" fill="#046A38" />
          <rect x="256" width="384" height="480" fill="#DA291C" />
          <circle cx="256" cy="240" r="58" fill="#FFCC29" stroke="#000000" strokeWidth="2" />
          <rect x="242" y="222" width="28" height="36" fill="#FFFFFF" />
          <circle cx="256" cy="240" r="8" fill="#002654" />
        </g>
      );

    // ----------------------------------------------------
    // IRELAND (Green, White, Orange)
    // ----------------------------------------------------
    case 'IE':
      return (
        <g>
          <rect width="213.3" height="480" fill="#169B62" />
          <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
          <rect x="426.7" width="213.3" height="480" fill="#FF883E" />
        </g>
      );

    // ----------------------------------------------------
    // NIGERIA (Green, White, Green)
    // ----------------------------------------------------
    case 'NG':
      return (
        <g>
          <rect width="213.3" height="480" fill="#008751" />
          <rect x="213.3" width="213.4" height="480" fill="#FFFFFF" />
          <rect x="426.7" width="213.3" height="480" fill="#008751" />
        </g>
      );

    // ----------------------------------------------------
    // RUSSIA (White, Blue, Red)
    // ----------------------------------------------------
    case 'RU':
      return (
        <g>
          <rect width="640" height="160" fill="#FFFFFF" />
          <rect y="160" width="640" height="160" fill="#0039A6" />
          <rect y="320" width="640" height="160" fill="#D52B1E" />
        </g>
      );

    // ----------------------------------------------------
    // CZECHIA (White top, Red bottom, Blue chevron)
    // ----------------------------------------------------
    case 'CZ':
      return (
        <g>
          <rect width="640" height="240" fill="#FFFFFF" />
          <rect y="240" width="640" height="240" fill="#D7141A" />
          <polygon points="0,0 320,240 0,480" fill="#11457E" />
        </g>
      );

    // ----------------------------------------------------
    // FALLBACK / INTERNATIONAL NEUTRAL (Slate Box with Globe Icon)
    // ----------------------------------------------------
    default:
      return (
        <g>
          <rect width="640" height="480" fill="#334155" />
          {/* Globe Outline */}
          <circle cx="320" cy="240" r="145" fill="#1e293b" stroke="#94a3b8" strokeWidth="16" />
          {/* Equator Line */}
          <line x1="175" y1="240" x2="465" y2="240" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" />
          {/* Prime Meridian Ellipse */}
          <ellipse cx="320" cy="240" rx="72" ry="145" fill="none" stroke="#94a3b8" strokeWidth="14" />
          {/* Central Meridian */}
          <line x1="320" y1="95" x2="320" y2="385" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" />
          {/* Curved Parallels */}
          <path d="M 210 160 Q 320 200 430 160" fill="none" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
          <path d="M 210 320 Q 320 280 430 320" fill="none" stroke="#94a3b8" strokeWidth="10" strokeLinecap="round" />
        </g>
      );
  }
}
