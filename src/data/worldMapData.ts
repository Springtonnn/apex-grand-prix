import { ContinentName, GrandPrix } from '../types/game';
import { PoolCircuitTemplate, projectLatLngToSvg } from './circuitPool';

export interface ContinentBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Geographical boundary limits for each of the 6 continents.
 * Used for coordinate validation and preventing pins from floating outside.
 */
export const CONTINENT_BOUNDS: Record<ContinentName, ContinentBounds> = {
  Europe: { minLat: 34, maxLat: 72, minLng: -15, maxLng: 45 },
  Asia: { minLat: -11, maxLat: 75, minLng: 34, maxLng: 155 },
  'North America': { minLat: 7, maxLat: 75, minLng: -170, maxLng: -50 },
  'South America': { minLat: -56, maxLat: 13, minLng: -82, maxLng: -34 },
  Africa: { minLat: -36, maxLat: 38, minLng: -18, maxLng: 52 },
  Oceania: { minLat: -48, maxLat: -5, minLng: 110, maxLng: 180 },
};

/**
 * Validates that latitude/longitude falls inside the designated continent boundaries.
 */
export function isCoordinateInContinent(
  lat: number,
  lng: number,
  continent: ContinentName
): boolean {
  const bounds = CONTINENT_BOUNDS[continent];
  if (!bounds) return true;
  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lng >= bounds.minLng &&
    lng <= bounds.maxLng
  );
}

/**
 * Returns calibrated SVG coordinates (x, y) on 1000x500 canvas.
 * Applies Equirectangular projection and calibrated spatial expansion
 * for Europe to ensure circuit pins do not cluster or bunch up.
 */
export function getCalibratedCircuitSvgPosition(
  lat: number,
  lng: number,
  continent?: ContinentName,
  width: number = 1000,
  height: number = 500,
  circuitId?: string,
  circuitName?: string,
  round?: number
): { x: number; y: number } {
  const idLower = (circuitId || '').toLowerCase();
  const nameLower = (circuitName || '').toLowerCase();

  // Thailand Grand Prix (Bangkok, Thailand)
  if (round === 5 || idLower.includes('thailand') || idLower.includes('bangkok') || nameLower.includes('thailand') || nameLower.includes('bangkok')) {
    return { x: 779, y: 212 }; // Bangkok, Thailand (Southeast Asia)
  }

  // Curated European positions with generous breathing room (de-clustered layout):
  if (round === 6 || idLower.includes('spain') || nameLower.includes('barcelona') || nameLower.includes('spanish')) {
    return { x: 456, y: 154 }; // Spain (Iberian Peninsula)
  }
  if (round === 7 || idLower.includes('monaco') || nameLower.includes('monaco') || nameLower.includes('monte carlo')) {
    return { x: 494, y: 144 }; // Monaco (French Riviera)
  }
  if (round === 8 || idLower.includes('italy') || idLower.includes('monza') || nameLower.includes('italian') || nameLower.includes('monza')) {
    return { x: 528, y: 138 }; // Monza (Northern Italy)
  }
  if (round === 9 || idLower.includes('austria') || nameLower.includes('austrian') || nameLower.includes('spielberg') || nameLower.includes('red bull')) {
    return { x: 564, y: 122 }; // Austria (Alpine / Central Europe)
  }
  if (round === 10 || idLower.includes('belgi') || nameLower.includes('spa') || nameLower.includes('belgian')) {
    return { x: 512, y: 112 }; // Belgium (Ardennes)
  }
  if (round === 11 || idLower.includes('dutch') || idLower.includes('netherland') || nameLower.includes('zandvoort') || nameLower.includes('dutch')) {
    return { x: 510, y: 84 }; // Netherlands (North Sea coast)
  }
  if (round === 12 || idLower.includes('brit') || idLower.includes('silverstone') || idLower.includes('uk') || nameLower.includes('british') || nameLower.includes('silverstone')) {
    return { x: 466, y: 92 }; // United Kingdom (British Isles)
  }
  if (idLower.includes('hungar') || nameLower.includes('hungar') || nameLower.includes('budapest')) {
    return { x: 576, y: 114 }; // Hungary (Eastern Europe)
  }

  let base = projectLatLngToSvg(lat, lng, width, height);

  // If continent is Europe and not explicitly matched, expand outwards from Central Europe (528, 114)
  if (continent === 'Europe') {
    const centerX = 528;
    const centerY = 114;
    const expandedX = centerX + (base.x - centerX) * 1.55;
    const expandedY = centerY + (base.y - centerY) * 1.45;
    return {
      x: Math.round(expandedX * 10) / 10,
      y: Math.round(expandedY * 10) / 10,
    };
  }

  // If continent is specified, safeguard against invalid coordinates
  if (continent && CONTINENT_BOUNDS[continent]) {
    const bounds = CONTINENT_BOUNDS[continent];
    const clampedLat = Math.max(bounds.minLat, Math.min(bounds.maxLat, lat));
    const clampedLng = Math.max(bounds.minLng, Math.min(bounds.maxLng, lng));
    if (clampedLat !== lat || clampedLng !== lng) {
      base = projectLatLngToSvg(clampedLat, clampedLng, width, height);
    }
  }

  return base;
}

export interface ContinentPathGroup {
  continent: ContinentName;
  name: string;
  labelX: number;
  labelY: number;
  paths: { id: string; d: string; label?: string }[];
}

/**
 * Mathematically calibrated, organic, and realistic SVG landmass paths
 * for the 1000 x 500 Equirectangular world map projection.
 * Covers all 6 continents + major islands (UK, Japan, New Zealand, Madagascar, Greenland, etc.)
 */
export const CONTINENT_LANDMASSES: ContinentPathGroup[] = [
  // =========================================================================
  // 1. NORTH AMERICA
  // =========================================================================
  {
    continent: 'North America',
    name: 'NORTH AMERICA',
    labelX: 200,
    labelY: 130,
    paths: [
      {
        id: 'na-main',
        label: 'North America Mainland',
        d: 'M 35 75 C 36.7 69.2, 43.3 63.3, 55 60 C 66.7 56.7, 90.8 56.3, 105 55 C 119.2 53.7, 122.5 53.2, 140 52 C 157.5 50.8, 193.3 45.7, 210 48 C 226.7 50.3, 230.8 69.3, 240 75 C 249.2 80.7, 253.3 88.5, 260 90 C 266.7 91.5, 276.7 95.7, 285 95 C 293.3 94.3, 313.3 89.2, 325 90 C 336.7 90.8, 345.8 104.2, 345 110 C 344.2 115.8, 336.7 127.5, 330 130 C 323.3 132.5, 309.2 119.2, 305 120 C 300.8 120.8, 307.2 135.2, 308 140 C 308.8 144.8, 292.8 155.8, 285 160 C 277.2 164.2, 283.8 181.7, 282 185 C 280.2 188.3, 273.2 187.5, 270 185 C 266.8 182.5, 261.2 173.8, 255 172 C 248.8 170.2, 243.8 162.2, 240 160 C 236.2 157.8, 237.5 172.5, 235 175 C 232.5 177.5, 219.2 172.5, 215 175 C 210.8 177.5, 224.2 182.5, 230 185 C 235.8 187.5, 245.8 191.7, 250 195 C 254.2 198.3, 263.3 210.8, 268 215 C 272.7 219.2, 281.3 238.8, 280 240 C 278.7 241.2, 265.8 243.3, 260 242 C 254.2 240.7, 237.5 233.8, 230 230 C 222.5 226.2, 206.7 211.2, 200 205 C 193.3 198.8, 178.8 183.8, 175 180 C 171.2 176.2, 183.3 212.5, 185 215 C 186.7 217.5, 194.2 216.7, 195 215 C 195.8 213.3, 175.8 167.5, 170 160 C 164.2 152.5, 158.8 139.2, 155 135 C 151.2 130.8, 143.3 120.8, 140 115 C 136.7 109.2, 85.0 102.5, 75 100 C 65.0 97.5, 48.3 97.5, 45 95 C 41.7 92.5, 33.3 80.8, 35 75 Z',
      },
      {
        id: 'na-greenland',
        label: 'Greenland',
        d: 'M 365 30 C 378 28, 415 30, 428 36 C 438 42, 425 62, 415 68 C 402 75, 395 86, 386 86 C 376 86, 362 70, 360 58 C 358 45, 356 32, 365 30 Z',
      },
      {
        id: 'na-cuba',
        label: 'Caribbean / Cuba',
        d: 'M 272 192 C 285 194, 302 196, 312 200 C 314 204, 305 206, 292 204 C 280 202, 268 198, 272 192 Z',
      },
    ],
  },

  // =========================================================================
  // 2. SOUTH AMERICA
  // =========================================================================
  {
    continent: 'South America',
    name: 'SOUTH AMERICA',
    labelX: 335,
    labelY: 310,
    paths: [
      {
        id: 'sa-main',
        label: 'South America Mainland',
        d: 'M 275 235 C 277.5 228.3, 283.3 218.3, 290 215 C 296.7 211.7, 317.5 212.5, 325 215 C 332.5 217.5, 345.8 221.7, 350 225 C 354.2 228.3, 366.7 236.7, 370 240 C 373.3 243.3, 385.8 250.8, 390 255 C 394.2 259.2, 408.3 268.3, 410 275 C 411.7 281.7, 402.5 292.5, 400 295 C 397.5 297.5, 389.7 307.8, 388 310 C 386.3 312.2, 385.7 320.3, 385 322 C 384.3 323.7, 377.3 322.8, 375 324 C 372.7 325.2, 360.8 333.2, 358 335 C 355.2 336.8, 351.7 339.8, 350 342 C 348.3 344.2, 346.5 352.5, 345 355 C 343.5 357.5, 339.8 366.8, 338 370 C 336.2 373.2, 331.7 386.7, 330 390 C 328.3 393.3, 326.7 406.7, 325 410 C 323.3 413.3, 318.3 428.3, 315 430 C 311.7 431.7, 301.7 427.5, 300 425 C 298.3 422.5, 295.8 395.0, 295 385 C 294.2 375.0, 295.3 355.0, 295 345 C 294.7 335.0, 293.7 318.3, 292 310 C 290.3 301.7, 280.3 281.7, 278 275 C 275.7 268.3, 270.8 259.2, 270 255 C 269.2 250.8, 272.5 241.7, 275 235 Z',
      },
    ],
  },

  // =========================================================================
  // 3. EUROPE (SPACIOUS & EXPANDED CARTOGRAPHY)
  // =========================================================================
  {
    continent: 'Europe',
    name: 'EUROPE',
    labelX: 522,
    labelY: 70,
    paths: [
      {
        id: 'eu-mainland',
        label: 'Continental Europe, Iberia & Italy',
        // Enlarged, spacious European mainland providing ample room for F1 circuits
        d: 'M 445 150 C 452 142, 465 140, 474 138 C 484 136, 492 122, 500 114 C 506 108, 502 96, 506 88 C 510 82, 526 80, 534 82 C 542 84, 568 76, 578 80 C 588 84, 604 96, 608 104 C 612 112, 598 124, 592 128 C 584 132, 572 142, 565 146 C 558 150, 552 138, 546 136 C 540 134, 544 148, 542 156 C 540 164, 534 172, 528 172 C 524 172, 522 158, 524 148 C 526 138, 516 138, 510 140 C 502 142, 498 146, 492 150 C 486 154, 478 166, 470 172 C 462 176, 444 174, 442 168 C 440 160, 438 154, 445 150 Z',
      },
      {
        id: 'eu-britain',
        label: 'Great Britain',
        // Enlarged British Isles spanning Silverstone comfortably
        d: 'M 458 75 C 468 74, 478 78, 480 84 C 482 90, 482 98, 480 105 C 478 112, 472 118, 465 116 C 458 114, 458 106, 460 98 C 462 92, 455 84, 458 75 Z',
      },
      {
        id: 'eu-ireland',
        label: 'Ireland',
        d: 'M 440 88 C 448 86, 453 88, 453 96 C 453 103, 448 108, 442 108 C 438 108, 436 96, 440 88 Z',
      },
      {
        id: 'eu-scandinavia',
        label: 'Scandinavia',
        d: 'M 515 76 C 526 62, 546 44, 562 40 C 576 36, 586 54, 582 64 C 578 72, 554 84, 548 86 C 542 88, 528 82, 524 80 C 520 78, 512 82, 515 76 Z',
      },
      {
        id: 'eu-italy-sicily',
        label: 'Sicily & Sardinia',
        d: 'M 522 174 C 526 172, 532 173, 532 176 C 532 179, 526 181, 522 179 C 520 177, 520 175, 522 174 Z',
      },
    ],
  },

  // =========================================================================
  // 4. AFRICA
  // =========================================================================
  {
    continent: 'Africa',
    name: 'AFRICA',
    labelX: 520,
    labelY: 280,
    paths: [
      {
        id: 'af-main',
        label: 'Africa Mainland',
        d: 'M 470 146 C 480 144, 495 142, 500 142 C 505 142, 520 142, 525 142 C 530 142, 550 152, 555 154 C 560 156, 582 156, 588 158 C 594 160, 600 164, 602 166 C 604 168, 594 182, 596 185 C 598 188, 606 202, 610 205 C 614 208, 620 218, 625 220 C 630 222, 645 226, 648 230 C 651 234, 638 250, 635 255 C 632 260, 624 266, 620 270 C 616 274, 608 305, 605 310 C 602 315, 592 330, 588 335 C 584 340, 578 350, 575 352 C 572 354, 552 356, 548 355 C 544 354, 539 340, 538 335 C 537 330, 533 300, 532 295 C 531 290, 527 270, 526 265 C 525 260, 526 248, 525 245 C 524 242, 515 238, 512 236 C 509 234, 506 234, 504 234 C 502 234, 488 235, 485 235 C 482 235, 468 232, 465 230 C 462 228, 446 215, 448 210 C 450 205, 456 190, 458 185 C 460 180, 466 168, 468 165 C 470 162, 465 148, 470 146 Z',
      },
      {
        id: 'af-madagascar',
        label: 'Madagascar',
        d: 'M 620 285 C 628 286, 634 288, 635 290 C 636 292, 640 325, 638 330 C 636 335, 624 332, 622 325 C 620 318, 618 290, 620 285 Z',
      },
    ],
  },

  // =========================================================================
  // 5. ASIA
  // =========================================================================
  {
    continent: 'Asia',
    name: 'ASIA',
    labelX: 740,
    labelY: 120,
    paths: [
      {
        id: 'as-main',
        label: 'Asia Mainland, Middle East & Indochina',
        d: 'M 596 166 C 602 175, 608 185, 610 190 C 612 195, 620 220, 625 225 C 630 230, 660 215, 665 210 C 670 205, 660 185, 656 180 C 652 175, 646 172, 644 174 C 642 176, 634 164, 632 162 C 630 160, 645 159, 650 158 C 655 157, 675 168, 680 172 C 685 176, 688 190, 692 195 C 696 200, 695 210, 698 212 C 701 214, 712 235, 715 238 C 718 241, 730 220, 735 215 C 740 210, 750 195, 755 192 C 760 189, 762 192, 765 195 C 768 198, 775 212, 778 215 C 781 218, 779 230, 780 232 C 781 234, 784 240, 786 242 C 788 244, 792 246, 794 248 C 796 250, 792 254, 790 252 C 788 250, 782 250, 780 248 C 778 246, 774 230, 772 225 C 770 220, 782 210, 785 208 C 788 206, 810 210, 815 212 C 820 214, 828 196, 832 192 C 836 188, 838 165, 842 160 C 846 155, 846 144, 848 142 C 850 140, 858 152, 862 156 C 866 160, 858 142, 855 138 C 852 134, 868 130, 872 128 C 876 126, 915 95, 920 92 C 925 89, 940 85, 945 82 C 950 79, 962 62, 965 58 C 968 54, 900 45, 880 42 C 860 39, 800 38, 780 40 C 760 42, 700 44, 680 46 C 660 48, 615 62, 605 65 C 595 68, 620 120, 625 125 C 630 130, 650 140, 655 142 C 660 144, 590 157, 596 166 Z',
      },
      {
        id: 'as-japan',
        label: 'Japan (Honshu, Hokkaido, Kyushu)',
        d: 'M 862 166 C 868 162, 872 160, 875 160 C 878 160, 885 152, 888 148 C 891 144, 893 138, 895 134 C 897 130, 902 120, 905 116 C 908 112, 896 118, 892 122 C 888 126, 878 142, 876 145 C 874 148, 870 152, 868 156 C 866 160, 858 168, 862 166 Z',
      },
      {
        id: 'as-indonesia',
        label: 'Indonesia Archipelago',
        d: 'M 770 248 C 785 252, 810 262, 825 268 C 830 270, 820 275, 805 272 C 790 269, 775 258, 770 248 Z M 810 242 C 822 240, 835 244, 832 255 C 828 260, 815 258, 810 242 Z',
      },
      {
        id: 'as-philippines',
        label: 'Philippines',
        d: 'M 838 212 C 844 210, 846 225, 844 235 C 842 242, 838 245, 836 235 C 834 225, 835 215, 838 212 Z',
      },
    ],
  },

  // =========================================================================
  // 6. OCEANIA
  // =========================================================================
  {
    continent: 'Oceania',
    name: 'OCEANIA',
    labelX: 865,
    labelY: 335,
    paths: [
      {
        id: 'oc-australia',
        label: 'Australia Mainland',
        d: 'M 860 285 C 872 288, 882 292, 885 295 C 888 298, 902 280, 905 278 C 908 276, 915 298, 918 305 C 921 312, 926 320, 928 324 C 930 328, 932 330, 930 332 C 928 334, 928 344, 925 348 C 922 352, 918 360, 915 362 C 912 364, 905 362, 900 362 C 895 362, 888 358, 885 358 C 882 358, 860 360, 855 360 C 850 360, 840 358, 835 358 C 830 358, 820 348, 816 345 C 812 342, 808 335, 810 330 C 812 325, 812 318, 815 312 C 818 306, 835 298, 840 296 C 845 294, 855 284, 860 285 Z',
      },
      {
        id: 'oc-tasmania',
        label: 'Tasmania',
        d: 'M 904 372 C 912 370, 918 374, 916 380 C 914 384, 905 384, 903 378 C 902 374, 900 373, 904 372 Z',
      },
      {
        id: 'oc-nz-north',
        label: 'New Zealand (North Island)',
        d: 'M 978 342 C 984 345, 988 348, 990 350 C 992 352, 998 356, 998 358 C 998 360, 992 364, 986 366 C 980 368, 974 360, 976 358 C 978 356, 974 340, 978 342 Z',
      },
      {
        id: 'oc-nz-south',
        label: 'New Zealand (South Island)',
        d: 'M 980 367 C 982 370, 978 376, 974 380 C 970 384, 962 386, 960 384 C 958 382, 964 372, 968 370 C 972 368, 978 365, 980 367 Z',
      },
      {
        id: 'oc-png',
        label: 'Papua New Guinea',
        d: 'M 870 262 C 885 260, 915 264, 925 272 C 922 278, 895 276, 880 274 C 872 272, 868 264, 870 262 Z',
      },
    ],
  },
];
