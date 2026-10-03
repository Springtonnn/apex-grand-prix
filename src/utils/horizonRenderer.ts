/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorldTourCircuitDef } from '../data/worldTourCircuits';

export interface HorizonRenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  horizonY: number;
  mountainOffset: number;
  circuitDef: WorldTourCircuitDef;
  isWet: boolean;
  timeMs: number;
}

/**
 * Atmospheric soft horizon mist: blends the distant skyline/mountains smoothly
 * into the road edge to prevent strobe flickering and motion nausea.
 */
export function drawGroundingHaze(ctx: CanvasRenderingContext2D, width: number, horizonY: number, color: string) {
  const haze = ctx.createLinearGradient(0, horizonY - 30, 0, horizonY + 4);
  haze.addColorStop(0, 'transparent');
  haze.addColorStop(0.7, color);
  haze.addColorStop(1, 'transparent');
  ctx.fillStyle = haze;
  ctx.fillRect(0, horizonY - 30, width, 34);
}

/**
 * Clouds moving smoothly across the sky with track heading (gentle, calm drift)
 */
export function drawSoftClouds(ctx: CanvasRenderingContext2D, width: number, height: number, skyOffset: number) {
  const cloudOffset = ((skyOffset * 0.18) % (width + 300) + (width + 300)) % (width + 300);
  const cloudDefs = [
    { x: 100, y: height * 0.11, w: 170, h: 42 },
    { x: 420, y: height * 0.18, w: 130, h: 36 },
    { x: 720, y: height * 0.09, w: 190, h: 48 },
    { x: 1050, y: height * 0.16, w: 140, h: 38 },
    { x: 1380, y: height * 0.12, w: 120, h: 32 },
  ];

  cloudDefs.forEach((c) => {
    const cx = ((c.x - cloudOffset + width * 2) % (width + 300)) - 150;
    ctx.fillStyle = 'rgba(203, 213, 225, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx, c.y + 6, c.w * 0.48, c.h * 0.46, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - c.w * 0.22, c.y + 8, c.w * 0.32, c.h * 0.38, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + c.w * 0.22, c.y + 7, c.w * 0.34, c.h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    ctx.ellipse(cx, c.y, c.w * 0.46, c.h * 0.44, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - c.w * 0.22, c.y + 2, c.w * 0.32, c.h * 0.38, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + c.w * 0.22, c.y + 1, c.w * 0.34, c.h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Night stars and crescent moon panning with car orientation (calm, subtle)
 */
export function drawNightSky(ctx: CanvasRenderingContext2D, width: number, height: number, skyOffset: number, timeMs: number) {
  const starOffset = ((skyOffset * 0.12) % width + width) % width;
  for (let st = 0; st < 52; st++) {
    const sx = ((st * 47 - starOffset) % width + width) % width;
    const sy = (st * 17) % (height * 0.38) + 8;
    const twinkle = 0.4 + 0.6 * Math.sin(timeMs * 0.002 + st * 1.3);
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle.toFixed(2)})`;
    const sz = st % 6 === 0 ? 2.2 : 1.2;
    ctx.fillRect(sx, sy, sz, sz);
  }

  // Crescent Moon rotating calmly with sky
  const moonX = ((width * 0.82 - skyOffset * 0.10) % width + width) % width;
  const moonY = height * 0.12;
  ctx.fillStyle = 'rgba(254, 243, 199, 0.9)';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#090b14';
  ctx.beginPath();
  ctx.arc(moonX + 6, moonY - 3, 14, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Radiant desert sun rotating with sky (calm, subtle)
 */
export function drawDesertSun(ctx: CanvasRenderingContext2D, width: number, height: number, skyOffset: number) {
  const sunX = ((width * 0.78 - skyOffset * 0.12) % width + width) % width;
  const sunY = height * 0.14;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 70);
  sunGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  sunGlow.addColorStop(0.3, 'rgba(254, 240, 138, 0.8)');
  sunGlow.addColorStop(0.65, 'rgba(251, 146, 60, 0.3)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
  ctx.fill();
}

// Helper to calculate wrapping tile range
function getTileRange(width: number, tileW: number) {
  return {
    min: -2,
    max: Math.ceil(width / tileW) + 2,
  };
}

/**
 * 1. Melbourne: Albert Park Lake, Eureka Tower gold crown & skyline
 */
export function renderMelbourneHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const lakeH = 38;
  const lakeGrad = ctx.createLinearGradient(0, horizonY - lakeH, 0, horizonY);
  lakeGrad.addColorStop(0, '#0369a1');
  lakeGrad.addColorStop(0.65, '#38bdf8');
  lakeGrad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, horizonY - lakeH, width, lakeH);

  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollCity = ((mountainOffset * 0.50) % tileW + tileW) % tileW;
  const scrollWater = ((mountainOffset * 0.28) % width + width) % width;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let w = 0; w < width; w += 36) {
    const rx = (w - scrollWater + width) % width;
    ctx.fillRect(rx, horizonY - 12, 18, 2);
  }

  const buildings = [
    { x: 30, w: 45, h: 105, col: '#1e293b' },
    { x: 85, w: 60, h: 165, col: '#0f172a', isEureka: true },
    { x: 155, w: 50, h: 120, col: '#1e293b' },
    { x: 220, w: 65, h: 140, col: '#0f172a' },
    { x: 305, w: 55, h: 110, col: '#1e293b' },
    { x: 380, w: 70, h: 150, col: '#0f172a' },
    { x: 470, w: 48, h: 95, col: '#1e293b' },
    { x: 535, w: 62, h: 135, col: '#0f172a' },
    { x: 620, w: 58, h: 155, col: '#1e293b' },
    { x: 700, w: 50, h: 115, col: '#0f172a' },
    { x: 770, w: 68, h: 130, col: '#1e293b' },
    { x: 860, w: 54, h: 100, col: '#0f172a' },
  ];

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;
    buildings.forEach((b) => {
      const bx = startX + b.x;
      if (bx >= -100 && bx <= width + 100) {
        ctx.fillStyle = b.col;
        ctx.fillRect(bx, horizonY - b.h, b.w, b.h - 6);
        if (b.isEureka) {
          ctx.fillStyle = '#facc15';
          ctx.fillRect(bx + 4, horizonY - b.h - 10, b.w - 8, 10);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(bx + b.w / 2 - 2, horizonY - b.h - 22, 4, 12);
        }
        ctx.fillStyle = 'rgba(125, 211, 252, 0.7)';
        for (let wr = 0; wr < 5; wr++) {
          ctx.fillRect(bx + 6, horizonY - b.h + 16 + wr * 18, b.w - 12, 3.5);
        }
      }
    });

    ctx.fillStyle = '#15803d';
    for (let t = 0; t < 16; t++) {
      const tx = startX + t * 60;
      if (tx >= -60 && tx <= width + 60) {
        ctx.beginPath();
        ctx.ellipse(tx, horizonY - 14, 22, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/**
 * 2. Bahrain Sakhir: Arabian desert dunes, sandstone mesas & Sakhir VIP Tower
 */
export function renderSakhirHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.26) % tileW + tileW) % tileW;
  const scrollDunes = ((mountainOffset * 0.48) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.68) % tileW + tileW) % tileW;

  // Mesas
  ctx.fillStyle = '#9a3412';
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    [100, 380, 680].forEach((mx) => {
      const px = startX + mx;
      if (px >= -120 && px <= width + 120) {
        ctx.beginPath();
        ctx.moveTo(px - 55, horizonY);
        ctx.lineTo(px - 40, horizonY - 45);
        ctx.lineTo(px + 40, horizonY - 45);
        ctx.lineTo(px + 55, horizonY);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  // Dunes
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.moveTo(-scrollDunes - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollDunes;
    const dunePeaks = [
      { x: 0, h: 22 }, { x: 140, h: 56 }, { x: 280, h: 28 }, { x: 440, h: 68 },
      { x: 600, h: 35 }, { x: 760, h: 62 }, { x: 880, h: 28 }, { x: 960, h: 22 }
    ];
    dunePeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Near crests with Sakhir circular VIP Tower
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(-scrollNear - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const nearPeaks = [
      { x: 0, h: 12 }, { x: 120, h: 32 }, { x: 260, h: 16 }, { x: 420, h: 40 },
      { x: 580, h: 20 }, { x: 740, h: 36 }, { x: 880, h: 16 }, { x: 960, h: 12 }
    ];
    nearPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const twX = startX + 500;
    if (twX >= -80 && twX <= width + 80) {
      for (let ring = 0; ring < 7; ring++) {
        const ry = horizonY - 14 - ring * 11;
        const rw = 38 - ring * 3;
        ctx.fillStyle = ring % 2 === 0 ? '#ef4444' : '#ffffff';
        ctx.beginPath();
        ctx.ellipse(twX, ry, rw, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/**
 * 3. Catalunya: Montserrat rock needles & sun-baked hills
 */
export function renderCatalunyaHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.28) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.52) % tileW + tileW) % tileW;

  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const montserrat = [
      { x: 0, h: 28 }, { x: 80, h: 88 }, { x: 120, h: 118 }, { x: 160, h: 92 },
      { x: 240, h: 44 }, { x: 340, h: 128 }, { x: 380, h: 144 }, { x: 430, h: 112 },
      { x: 540, h: 52 }, { x: 640, h: 108 }, { x: 720, h: 82 }, { x: 850, h: 132 }, { x: 960, h: 28 }
    ];
    montserrat.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(-scrollNear - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const aridHills = [
      { x: 0, h: 14 }, { x: 100, h: 44 }, { x: 220, h: 24 }, { x: 340, h: 52 },
      { x: 480, h: 28 }, { x: 610, h: 48 }, { x: 740, h: 24 }, { x: 860, h: 50 }, { x: 960, h: 14 }
    ];
    aridHills.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();
}

/**
 * 4. Monaco: French Riviera cliffs, pastel cliff villas & Port Hercule yachts
 */
export function renderMonacoHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const oceanH = 48;
  const oceanGrad = ctx.createLinearGradient(0, horizonY - oceanH, 0, horizonY);
  oceanGrad.addColorStop(0, '#0369a1');
  oceanGrad.addColorStop(0.8, '#0284c7');
  oceanGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, horizonY - oceanH, width, oceanH);

  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollMtn = ((mountainOffset * 0.26) % tileW + tileW) % tileW;
  const scrollVillas = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(-scrollMtn - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMtn;
    const cliffPeaks = [
      { x: 0, h: 45 }, { x: 160, h: 110 }, { x: 320, h: 65 }, { x: 480, h: 125 },
      { x: 640, h: 75 }, { x: 800, h: 115 }, { x: 960, h: 45 }
    ];
    cliffPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollVillas;
    for (let v = 0; v < 11; v++) {
      const vx = startX + v * 88;
      const vh = 42 + (v % 3) * 16;
      ctx.fillStyle = v % 2 === 0 ? '#fef3c7' : '#fed7aa';
      ctx.fillRect(vx, horizonY - vh, 68, vh);
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(vx - 2, horizonY - vh, 72, 4);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
      for (let r = 0; r < 2; r++) {
        ctx.fillRect(vx + 8 + r * 28, horizonY - vh + 10, 16, 12);
      }
    }

    [120, 360, 600, 840].forEach((yx) => {
      const px = startX + yx;
      if (px >= -80 && px <= width + 80) {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(px - 36, horizonY - 14);
        ctx.lineTo(px + 36, horizonY - 14);
        ctx.lineTo(px + 28, horizonY - 3);
        ctx.lineTo(px - 28, horizonY - 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px - 15, horizonY - 25, 30, 11);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, horizonY - 25);
        ctx.lineTo(px, horizonY - 36);
        ctx.stroke();
      }
    });
  }
}

/**
 * 5. Montreal: St. Lawrence River & Biosphere Geodesic Dome
 */
export function renderMontrealHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const riverH = 42;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, horizonY - riverH, width, riverH);

  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const bioX = startX + 480;
    if (bioX >= -90 && bioX <= width + 90) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(bioX, horizonY - 8, 46, Math.PI, 0);
      ctx.stroke();
      ctx.lineWidth = 1.2;
      for (let r = 16; r < 46; r += 12) {
        ctx.beginPath();
        ctx.arc(bioX, horizonY - 8, r, Math.PI, 0);
        ctx.stroke();
      }
    }

    [160, 760].forEach((dx) => {
      const px = startX + dx;
      if (px >= -80 && px <= width + 80) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px - 25, horizonY - 90, 50, 90);
        ctx.fillRect(px + 12, horizonY - 118, 32, 118);
        ctx.fillStyle = 'rgba(125, 211, 252, 0.7)';
        ctx.fillRect(px - 18, horizonY - 75, 36, 4);
        ctx.fillRect(px + 18, horizonY - 100, 20, 4);
      }
    });
  }
}

/**
 * 6. Silverstone: Rolling English plains, RAF hangars & modern Wing
 */
export function renderSilverstoneHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.28) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const plains = [
      { x: 0, h: 18 }, { x: 140, h: 38 }, { x: 300, h: 22 }, { x: 480, h: 44 },
      { x: 650, h: 26 }, { x: 810, h: 40 }, { x: 960, h: 18 }
    ];
    plains.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const hX = startX + 320;
    if (hX >= -80 && hX <= width + 80) {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(hX, horizonY - 8, 42, Math.PI, 0);
      ctx.fill();
    }
    const wX = startX + 680;
    if (wX >= -100 && wX <= width + 100) {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(wX - 55, horizonY);
      ctx.lineTo(wX - 35, horizonY - 48);
      ctx.lineTo(wX + 45, horizonY - 32);
      ctx.lineTo(wX + 55, horizonY);
      ctx.closePath();
      ctx.fill();
    }
  }
}

/**
 * 7. Austria: Snow-capped Styrian Alps, emerald fir slopes & giant Bull
 */
export function renderAustriaHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.26) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  const alpinePeaks = [
    { x: 0, h: 45 }, { x: 90, h: 110 }, { x: 160, h: 70 }, { x: 260, h: 155 },
    { x: 370, h: 85 }, { x: 480, h: 170 }, { x: 590, h: 75 }, { x: 700, h: 145 },
    { x: 810, h: 90 }, { x: 900, h: 135 }, { x: 960, h: 45 }
  ];

  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    alpinePeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    alpinePeaks.forEach((pt) => {
      if (pt.h > 80) {
        const peakX = startX + pt.x;
        const peakY = horizonY - pt.h;
        ctx.beginPath();
        ctx.moveTo(peakX, peakY);
        ctx.lineTo(peakX + 26, peakY + 36);
        ctx.lineTo(peakX + 10, peakY + 32);
        ctx.lineTo(peakX - 8, peakY + 38);
        ctx.lineTo(peakX - 24, peakY + 34);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(-scrollNear - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const slopePeaks = [
      { x: 0, h: 22 }, { x: 110, h: 58 }, { x: 230, h: 35 }, { x: 360, h: 68 },
      { x: 500, h: 40 }, { x: 640, h: 62 }, { x: 780, h: 32 }, { x: 900, h: 55 }, { x: 960, h: 22 }
    ];
    slopePeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const bx = startX + 520;
    if (bx >= -80 && bx <= width + 80) {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(bx, horizonY - 45, 24, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx - 12, horizonY - 50);
      ctx.quadraticCurveTo(bx - 20, horizonY - 65, bx - 14, horizonY - 70);
      ctx.moveTo(bx + 12, horizonY - 50);
      ctx.quadraticCurveTo(bx + 20, horizonY - 65, bx + 14, horizonY - 70);
      ctx.stroke();
    }
  }
}

/**
 * 8. Spa: Ardennes misty mountain ridges & pine canopy
 */
export function renderSpaHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.26) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#0b1329';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const ardennes = [
      { x: 0, h: 45 }, { x: 130, h: 85 }, { x: 280, h: 55 }, { x: 450, h: 95 },
      { x: 620, h: 60 }, { x: 780, h: 90 }, { x: 900, h: 52 }, { x: 960, h: 45 }
    ];
    ardennes.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
  ctx.fillRect(0, horizonY - 48, width, 18);

  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.moveTo(-scrollNear - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const nearRidges = [
      { x: 0, h: 22 }, { x: 100, h: 54 }, { x: 220, h: 32 }, { x: 370, h: 62 },
      { x: 530, h: 38 }, { x: 680, h: 58 }, { x: 820, h: 30 }, { x: 960, h: 22 }
    ];
    nearRidges.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();
}

/**
 * 9. Zandvoort: Coastal marram dunes, North Sea lighthouse & wind turbines
 */
export function renderZandvoortHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const seaH = 40;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, horizonY - seaH, width, seaH);

  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollDunes = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(-scrollDunes - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollDunes;
    const dunePeaks = [
      { x: 0, h: 18 }, { x: 120, h: 52 }, { x: 240, h: 28 }, { x: 380, h: 64 },
      { x: 520, h: 34 }, { x: 660, h: 58 }, { x: 800, h: 26 }, { x: 960, h: 18 }
    ];
    dunePeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollDunes;
    const lhX = startX + 440;
    if (lhX >= -60 && lhX <= width + 60) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(lhX - 8, horizonY - 78, 16, 78);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(lhX - 8, horizonY - 55, 16, 14);
      ctx.fillRect(lhX - 8, horizonY - 26, 16, 14);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(lhX - 10, horizonY - 88, 20, 10);
    }
    [200, 720].forEach((tx) => {
      const px = startX + tx;
      if (px >= -60 && px <= width + 60) {
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(px - 2, horizonY - 65, 4, 65);
        ctx.beginPath();
        ctx.arc(px, horizonY - 65, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

/**
 * 10. Monza: Royal Park ancient pines, Alps & clock tower
 */
export function renderMonzaHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.26) % tileW + tileW) % tileW;
  const scrollTrees = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#172554';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const alpPeaks = [
      { x: 0, h: 40 }, { x: 120, h: 75 }, { x: 260, h: 50 }, { x: 410, h: 88 },
      { x: 570, h: 48 }, { x: 720, h: 82 }, { x: 860, h: 52 }, { x: 960, h: 40 }
    ];
    alpPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.moveTo(-scrollTrees - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollTrees;
    for (let p = 0; p < 32; p++) {
      const px = startX + p * 30;
      const treeH = 35 + ((p * 7) % 25);
      ctx.lineTo(px, horizonY - treeH);
      ctx.lineTo(px + 15, horizonY - treeH + 10);
    }
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollTrees;
    const vx = startX + 540;
    if (vx >= -80 && vx <= width + 80) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(vx - 16, horizonY - 72, 32, 72);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(vx - 20, horizonY - 72);
      ctx.lineTo(vx, horizonY - 95);
      ctx.lineTo(vx + 20, horizonY - 72);
      ctx.closePath();
      ctx.fill();
    }
  }
}

/**
 * 11. Singapore: Marina Bay Sands 3 towers, SkyPark rooftop & Singapore Flyer
 */
export function renderSingaporeHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const cityTileW = 960;
  const { min, max } = getTileRange(width, cityTileW);
  const scrollCity = ((mountainOffset * 0.48) % cityTileW + cityTileW) % cityTileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * cityTileW - scrollCity;
    const mbsX = startX + 460;
    if (mbsX >= -140 && mbsX <= width + 140) {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(mbsX - 45, horizonY - 145, 24, 145);
      ctx.fillRect(mbsX - 12, horizonY - 145, 24, 145);
      ctx.fillRect(mbsX + 21, horizonY - 145, 24, 145);

      ctx.fillStyle = '#38bdf8';
      for (let wr = 0; wr < 8; wr++) {
        ctx.fillRect(mbsX - 42, horizonY - 140 + wr * 16, 18, 5);
        ctx.fillRect(mbsX - 9, horizonY - 140 + wr * 16, 18, 5);
        ctx.fillRect(mbsX + 24, horizonY - 140 + wr * 16, 18, 5);
      }

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(mbsX - 60, horizonY - 158, 120, 13, 6);
      ctx.fill();

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mbsX - 50, horizonY - 158);
      ctx.lineTo(mbsX - 120, 0);
      ctx.stroke();
    }

    const flyX = startX + 800;
    if (flyX >= -80 && flyX <= width + 80) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(flyX, horizonY - 65, 42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(flyX, horizonY - 65);
      ctx.lineTo(flyX - 18, horizonY);
      ctx.moveTo(flyX, horizonY - 65);
      ctx.lineTo(flyX + 18, horizonY);
      ctx.stroke();
    }
  }
}

/**
 * 12. Suzuka: Mie mountains & illuminated Ferris wheel
 */
export function renderSuzukaHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number, timeMs: number) {
  const farTileW = 960;
  const { min, max } = getTileRange(width, farTileW);
  const scrollFar = ((mountainOffset * 0.26) % farTileW + farTileW) % farTileW;
  const scrollWheel = ((mountainOffset * 0.48) % farTileW + farTileW) % farTileW;

  const farPeaks = [
    { x: 0, h: 35 }, { x: 120, h: 68 }, { x: 260, h: 45 }, { x: 420, h: 85 },
    { x: 580, h: 50 }, { x: 740, h: 90 }, { x: 880, h: 54 }, { x: 960, h: 35 }
  ];

  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * farTileW - scrollFar;
    farPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const fwx = tile * farTileW - scrollWheel + 480;
    if (fwx >= -120 && fwx <= width + 120) {
      const fwy = horizonY - 80;
      const fwRadius = 45;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(fwx, fwy);
      ctx.lineTo(fwx - 22, horizonY);
      ctx.moveTo(fwx, fwy);
      ctx.lineTo(fwx + 22, horizonY);
      ctx.stroke();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(fwx, fwy, fwRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      for (let spk = 0; spk < 12; spk++) {
        const ang = (spk * Math.PI) / 6 + (timeMs * 0.0003);
        const gx = fwx + Math.cos(ang) * fwRadius;
        const gy = fwy + Math.sin(ang) * fwRadius;
        ctx.beginPath();
        ctx.moveTo(fwx, fwy);
        ctx.lineTo(gx, gy);
        ctx.stroke();
        ctx.fillStyle = spk % 2 === 0 ? '#ef4444' : '#38bdf8';
        ctx.fillRect(gx - 3, gy, 6, 5);
      }
    }
  }
}

/**
 * 13. COTA: Texas Hill Country limestone ridges & 251ft COTA Tower
 */
export function renderCotaHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.28) % tileW + tileW) % tileW;
  const scrollTower = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#1e3a5f';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const hillPeaks = [
      { x: 0, h: 25 }, { x: 120, h: 55 }, { x: 260, h: 32 }, { x: 420, h: 65 },
      { x: 580, h: 35 }, { x: 720, h: 60 }, { x: 860, h: 28 }, { x: 960, h: 25 }
    ];
    hillPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollTower;
    const towX = startX + 500;
    if (towX >= -90 && towX <= width + 90) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(towX - 6, horizonY - 120, 12, 120);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(towX, horizonY - 120, 24, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(towX, horizonY - 125);
      ctx.quadraticCurveTo(towX + 45, horizonY - 60, towX + 25, horizonY);
      ctx.stroke();
    }
  }
}

/**
 * 14. Mexico: Popocatépetl volcanic ridge & Foro Sol stadium
 */
export function renderMexicoHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.26) % tileW + tileW) % tileW;
  const scrollStadium = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#1e3a5f';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const volcanos = [
      { x: 0, h: 30 }, { x: 160, h: 90 }, { x: 260, h: 145 }, { x: 380, h: 65 },
      { x: 540, h: 105 }, { x: 680, h: 50 }, { x: 820, h: 120 }, { x: 960, h: 30 }
    ];
    volcanos.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollStadium;
    const fsX = startX + 440;
    if (fsX >= -120 && fsX <= width + 120) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(fsX - 70, horizonY - 75, 140, 75);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(fsX - 75, horizonY - 82, 150, 7);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(fsX - 60, horizonY - 105, 8, 25);
      ctx.strokeRect(fsX + 52, horizonY - 105, 8, 25);
    }
  }
}

/**
 * 15. Interlagos: Guarapiranga reservoir & lush green amphitheater hills
 */
export function renderInterlagosHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const lakeH = 36;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, horizonY - lakeH, width, lakeH);

  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.28) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.52) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    [240, 680].forEach((sx) => {
      const px = startX + sx;
      if (px >= -80 && px <= width + 80) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px - 30, horizonY - 95, 60, 95);
        ctx.fillRect(px + 15, horizonY - 120, 35, 120);
      }
    });
  }

  ctx.fillStyle = '#15803d';
  ctx.beginPath();
  ctx.moveTo(-scrollNear - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;
    const hills = [
      { x: 0, h: 18 }, { x: 120, h: 52 }, { x: 260, h: 30 }, { x: 410, h: 62 },
      { x: 570, h: 32 }, { x: 720, h: 58 }, { x: 860, h: 25 }, { x: 960, h: 18 }
    ];
    hills.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();
}

/**
 * 16. Las Vegas Strip: The Sphere & neon casino towers
 */
export function renderVegasHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number, timeMs: number) {
  const cityTileW = 960;
  const { min, max } = getTileRange(width, cityTileW);
  const scrollCity = ((mountainOffset * 0.48) % cityTileW + cityTileW) % cityTileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * cityTileW - scrollCity;
    const sphereX = startX + 380;
    if (sphereX >= -100 && sphereX <= width + 100) {
      const pulse = (Math.sin(timeMs * 0.002) + 1) * 0.5;
      const sphereGrad = ctx.createRadialGradient(sphereX, horizonY - 38, 5, sphereX, horizonY - 38, 42);
      sphereGrad.addColorStop(0, pulse > 0.5 ? '#f43f5e' : '#38bdf8');
      sphereGrad.addColorStop(1, pulse > 0.5 ? '#881337' : '#0369a1');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(sphereX, horizonY - 38, 38, Math.PI, 0);
      ctx.fill();
    }

    const casinos = [
      { x: startX + 80, w: 60, h: 140, col: '#4c1d95', trim: '#facc15' },
      { x: startX + 160, w: 75, h: 175, col: '#1e1b4b', trim: '#ec4899' },
      { x: startX + 480, w: 85, h: 160, col: '#311042', trim: '#38bdf8' },
      { x: startX + 680, w: 70, h: 130, col: '#1e293b', trim: '#eab308' },
    ];
    casinos.forEach((c) => {
      if (c.x >= -100 && c.x <= width + 100) {
        ctx.fillStyle = c.col;
        ctx.fillRect(c.x, horizonY - c.h, c.w, c.h);
        ctx.fillStyle = c.trim;
        ctx.fillRect(c.x, horizonY - c.h, c.w, 4);
      }
    });
  }
}

/**
 * 17. Abu Dhabi Yas Marina: Yas Hotel illuminated LED canopy
 */
export function renderYasMarinaHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number, timeMs: number) {
  const oceanH = 45;
  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, horizonY - oceanH, width, oceanH);

  const ymTileW = 960;
  const { min, max } = getTileRange(width, ymTileW);
  const scrollYm = ((mountainOffset * 0.48) % ymTileW + ymTileW) % ymTileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * ymTileW - scrollYm;
    const yhX = startX + 500;
    if (yhX >= -120 && yhX <= width + 120) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(yhX - 50, horizonY - 95, 100, 95);
      const pulse = (Math.sin(timeMs * 0.002) + 1) * 0.5;
      ctx.fillStyle = pulse > 0.5 ? '#38bdf8' : '#a855f7';
      ctx.beginPath();
      ctx.ellipse(yhX, horizonY - 100, 60, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * 18. Bangkok: Chao Phraya River, illuminated Wat Arun Prang, Rama VIII Bridge & modern skyline (F1 Thailand GP 2028)
 */
export function renderBangkokHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  // Chao Phraya River twilight water band
  const riverH = 48;
  const riverGrad = ctx.createLinearGradient(0, horizonY - riverH, 0, horizonY);
  riverGrad.addColorStop(0, '#1e1b4b');
  riverGrad.addColorStop(0.5, '#312e81');
  riverGrad.addColorStop(0.85, '#78350f');
  riverGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = riverGrad;
  ctx.fillRect(0, horizonY - riverH, width, riverH);

  // Golden river ripple reflections
  ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
  for (let w = 0; w < width; w += 35) {
    const waveX = (w - (mountainOffset * 0.28) % width + width) % width;
    ctx.fillRect(waveX, horizonY - 16, 22, 2.5);
    ctx.fillRect((waveX + 18) % width, horizonY - 26, 14, 2);
  }

  const tileW = 1000;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.22) % tileW + tileW) % tileW;
  const scrollCity = ((mountainOffset * 0.46) % tileW + tileW) % tileW;

  // Layer 1: Rama VIII Bridge & Distant Bangkok Metropolis Skyline
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;

    // Rama VIII Cable-Stayed Bridge (Single Inverted-Y Tower with fan cables)
    const bridgeX = startX + 220;
    if (bridgeX >= -200 && bridgeX <= width + 200) {
      // Inverted Y Main Pylon Tower (Golden illuminated)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(bridgeX - 16, horizonY - 10);
      ctx.lineTo(bridgeX, horizonY - 145);
      ctx.lineTo(bridgeX + 16, horizonY - 10);
      ctx.stroke();

      // Pylon Tip
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bridgeX, horizonY - 145, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Golden Stay Cables fanning down to bridge deck
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
      ctx.lineWidth = 1.2;
      for (let c = 1; c <= 8; c++) {
        const anchorY = horizonY - 140 + c * 10;
        const deckX = bridgeX + c * 22;
        ctx.beginPath();
        ctx.moveTo(bridgeX, anchorY);
        ctx.lineTo(deckX, horizonY - 18);
        ctx.stroke();
      }

      // Horizontal Roadway Deck
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(bridgeX - 80, horizonY - 22, 280, 8);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(bridgeX - 80, horizonY - 22, 280, 2);
    }

    // King Power Mahanakhon (Pixelated Icon) & Modern Riverfront Skyline
    const bkkTowers = [
      { x: 30, w: 45, h: 100, color: '#1e1b4b', pixelated: false },
      { x: 80, w: 52, h: 165, color: '#312e81', pixelated: true }, // Mahanakhon Tower
      { x: 138, w: 40, h: 110, color: '#1e1b4b', pixelated: false },
      { x: 440, w: 60, h: 135, color: '#312e81', pixelated: false },
      { x: 508, w: 46, h: 155, color: '#1e1b4b', pixelated: false },
      { x: 560, w: 55, h: 120, color: '#312e81', pixelated: false },
      { x: 880, w: 48, h: 140, color: '#1e1b4b', pixelated: false },
      { x: 935, w: 58, h: 115, color: '#312e81', pixelated: false },
    ];

    bkkTowers.forEach((t) => {
      const tx = startX + t.x;
      if (tx >= -100 && tx <= width + 100) {
        ctx.fillStyle = t.color;
        ctx.fillRect(tx, horizonY - t.h, t.w, t.h - 12);

        // If Mahanakhon, carve out iconic 3D pixelated cutouts
        if (t.pixelated) {
          ctx.fillStyle = '#f59e0b';
          // Glowing spire
          ctx.fillRect(tx + t.w / 2 - 2, horizonY - t.h - 18, 4, 18);
          // Pixel cutouts
          ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
          ctx.fillRect(tx + 8, horizonY - t.h + 25, 12, 10);
          ctx.fillRect(tx + 22, horizonY - t.h + 40, 14, 12);
          ctx.fillRect(tx + 12, horizonY - t.h + 75, 16, 12);
          ctx.fillRect(tx + 26, horizonY - t.h + 95, 14, 12);
        } else {
          // Warm skyscraper window lights
          ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
          for (let row = 0; row < 5; row++) {
            ctx.fillRect(tx + 6, horizonY - t.h + 20 + row * 18, t.w - 12, 3);
          }
        }
      }
    });
  }

  // Layer 2: Iconic Wat Arun (Temple of Dawn) & Royal Grand Palace Golden Spires
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;

    // Wat Arun (Central Prang Pagoda & 4 Satellite Mondops)
    const arunX = startX + 710;
    if (arunX >= -180 && arunX <= width + 180) {
      // Glow behind Wat Arun
      const arunGlow = ctx.createRadialGradient(arunX, horizonY - 65, 5, arunX, horizonY - 65, 80);
      arunGlow.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
      arunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = arunGlow;
      ctx.beginPath();
      ctx.arc(arunX, horizonY - 65, 80, 0, Math.PI * 2);
      ctx.fill();

      // Central Towering Prang
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(arunX - 26, horizonY - 14);
      ctx.lineTo(arunX - 22, horizonY - 45);
      ctx.lineTo(arunX - 16, horizonY - 75);
      ctx.lineTo(arunX - 8, horizonY - 105);
      ctx.lineTo(arunX, horizonY - 130); // Top finial spire
      ctx.lineTo(arunX + 8, horizonY - 105);
      ctx.lineTo(arunX + 16, horizonY - 75);
      ctx.lineTo(arunX + 22, horizonY - 45);
      ctx.lineTo(arunX + 26, horizonY - 14);
      ctx.closePath();
      ctx.fill();

      // Central Spire Golden Trident (Nopphasun)
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(arunX - 1.5, horizonY - 142, 3, 14);
      ctx.beginPath();
      ctx.arc(arunX, horizonY - 142, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Tiered architectural terraces (horizontal bands)
      ctx.fillStyle = '#b45309';
      ctx.fillRect(arunX - 24, horizonY - 35, 48, 4);
      ctx.fillRect(arunX - 19, horizonY - 65, 38, 4);
      ctx.fillRect(arunX - 14, horizonY - 95, 28, 3.5);

      // 4 Satellite Corner Prangs
      [-42, 42].forEach((offset) => {
        const satX = arunX + offset;
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(satX - 12, horizonY - 14);
        ctx.lineTo(satX - 8, horizonY - 50);
        ctx.lineTo(satX, horizonY - 78);
        ctx.lineTo(satX + 8, horizonY - 50);
        ctx.lineTo(satX + 12, horizonY - 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(satX - 1, horizonY - 86, 2, 9);
      });
    }

    // Grand Palace / Wat Phra Kaew Golden Stupa Spires
    const palaceX = startX + 370;
    if (palaceX >= -100 && palaceX <= width + 100) {
      // Golden Bell Stupa (Phra Si Rattana Chedi)
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(palaceX, horizonY - 32, 18, 0, Math.PI, true);
      ctx.lineTo(palaceX + 18, horizonY - 14);
      ctx.lineTo(palaceX - 18, horizonY - 14);
      ctx.closePath();
      ctx.fill();

      // Slender spire reaching high
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(palaceX - 7, horizonY - 32);
      ctx.lineTo(palaceX, horizonY - 88);
      ctx.lineTo(palaceX + 7, horizonY - 32);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(palaceX - 1, horizonY - 96, 2, 9);
    }
  }
}

/**
 * 18. Cape Town: Table Mountain flat plateau with tablecloth cloud & beach promenade
 */
export function renderCapeTownHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number) {
  const oceanH = 46;
  const oceanGrad = ctx.createLinearGradient(0, horizonY - oceanH, 0, horizonY);
  oceanGrad.addColorStop(0, '#0369a1');
  oceanGrad.addColorStop(0.7, '#0284c7');
  oceanGrad.addColorStop(1, '#fde68a');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, horizonY - oceanH, width, oceanH);

  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollMtn = ((mountainOffset * 0.26) % tileW + tileW) % tileW;
  const scrollCity = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  ctx.fillStyle = '#1e293b';
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMtn;
    const px = startX + 480;
    if (px >= -250 && px <= width + 250) {
      ctx.beginPath();
      ctx.moveTo(px - 140, horizonY - 10);
      ctx.lineTo(px - 100, horizonY - 110);
      ctx.lineTo(px + 100, horizonY - 110);
      ctx.lineTo(px + 140, horizonY - 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.roundRect(px - 110, horizonY - 116, 220, 14, 6);
      ctx.fill();
    }
  }

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (let w = 0; w < width; w += 40) {
    const waveX = (w - (mountainOffset * 0.30) % width + width) % width;
    ctx.fillRect(waveX, horizonY - 14, 18, 2);
  }

  ctx.fillStyle = '#fde68a';
  ctx.fillRect(0, horizonY - 8, width, 8);

  const coastalBuildings = [
    { x: 30, w: 55, h: 95, color: '#0f172a' },
    { x: 95, w: 42, h: 140, color: '#1e293b' },
    { x: 150, w: 60, h: 110, color: '#0f172a' },
    { x: 225, w: 48, h: 165, color: '#1e293b' },
    { x: 285, w: 70, h: 85, color: '#0f172a' },
    { x: 670, w: 50, h: 115, color: '#0f172a' },
    { x: 735, w: 62, h: 90, color: '#0f172a' },
    { x: 810, w: 54, h: 145, color: '#1e293b' },
  ];

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;
    coastalBuildings.forEach((b) => {
      const bx = startX + b.x;
      if (bx >= -100 && bx <= width + 100) {
        ctx.fillStyle = b.color;
        ctx.fillRect(bx, horizonY - b.h, b.w, b.h - 8);
        ctx.fillStyle = 'rgba(125, 211, 252, 0.7)';
        ctx.fillRect(bx + 8, horizonY - b.h + 16, b.w - 16, 4);
      }
    });
  }
}

/**
 * Fallback / Standard 2-Layer Authentic Horizon
 */
export function renderDefaultHorizon(ctx: CanvasRenderingContext2D, width: number, horizonY: number, mountainOffset: number, circuitDef: WorldTourCircuitDef, isWet: boolean) {
  const farTileW = 960;
  const { min, max } = getTileRange(width, farTileW);
  const scrollFar = ((mountainOffset * 0.26) % farTileW + farTileW) % farTileW;
  const scrollNear = ((mountainOffset * 0.50) % farTileW + farTileW) % farTileW;

  const farPeaks = [
    { x: 0, h: 35 }, { x: 90, h: 72 }, { x: 180, h: 42 }, { x: 280, h: 105 },
    { x: 390, h: 50 }, { x: 500, h: 115 }, { x: 610, h: 45 }, { x: 710, h: 90 },
    { x: 810, h: 54 }, { x: 890, h: 80 }, { x: 960, h: 35 },
  ];

  ctx.fillStyle = isWet ? '#0d131f' : circuitDef.farHorizonColor;
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * farTileW - scrollFar;
    farPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  const nearPeaks = [
    { x: 0, h: 18 }, { x: 75, h: 50 }, { x: 150, h: 24 }, { x: 230, h: 62 },
    { x: 320, h: 28 }, { x: 420, h: 76 }, { x: 510, h: 34 }, { x: 610, h: 66 },
    { x: 710, h: 26 }, { x: 810, h: 70 }, { x: 900, h: 38 }, { x: 960, h: 18 },
  ];

  ctx.fillStyle = isWet ? '#1e293b' : circuitDef.nearHorizonColor;
  ctx.beginPath();
  ctx.moveTo(-scrollNear - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * farTileW - scrollNear;
    nearPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();
}

/**
 * Master dispatcher for all 18 authentic Grand Prix horizons
 */
export function drawWorldTourHorizon(context: HorizonRenderContext) {
  const { ctx, width, height, horizonY, mountainOffset, circuitDef, isWet, timeMs } = context;

  switch (circuitDef.horizonType) {
    case 'melbourne_lake':
      renderMelbourneHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'sakhir_desert':
      renderSakhirHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'catalunya_arid':
      renderCatalunyaHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'monaco_harbor':
      renderMonacoHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'montreal_island':
      renderMontrealHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'silverstone_plains':
      renderSilverstoneHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'austria_alps':
      renderAustriaHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'spa_ardennes':
      renderSpaHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'zandvoort_dunes':
      renderZandvoortHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'monza_royal_park':
      renderMonzaHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'singapore_night':
      renderSingaporeHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'suzuka_ferris':
      renderSuzukaHorizon(ctx, width, horizonY, mountainOffset, timeMs);
      break;
    case 'cota_texas':
      renderCotaHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'mexico_altitude':
      renderMexicoHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'interlagos_lakes':
      renderInterlagosHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'vegas_strip':
      renderVegasHorizon(ctx, width, horizonY, mountainOffset, timeMs);
      break;
    case 'yas_marina':
      renderYasMarinaHorizon(ctx, width, horizonY, mountainOffset, timeMs);
      break;
    case 'bangkok_river':
      renderBangkokHorizon(ctx, width, horizonY, mountainOffset);
      break;
    case 'capetown_beach':
      renderCapeTownHorizon(ctx, width, horizonY, mountainOffset);
      break;
    default:
      renderDefaultHorizon(ctx, width, horizonY, mountainOffset, circuitDef, isWet);
      break;
  }

  // Soft atmospheric grounding haze
  drawGroundingHaze(ctx, width, horizonY, circuitDef.horizonGlow || 'rgba(255, 255, 255, 0.2)');
}
