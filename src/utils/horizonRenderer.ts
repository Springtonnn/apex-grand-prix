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
  const haze = ctx.createLinearGradient(0, horizonY - 32, 0, horizonY + 4);
  haze.addColorStop(0, 'transparent');
  haze.addColorStop(0.7, color);
  haze.addColorStop(1, 'transparent');
  ctx.fillStyle = haze;
  ctx.fillRect(0, horizonY - 32, width, 36);
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
  for (let st = 0; st < 64; st++) {
    const sx = ((st * 47 - starOffset) % width + width) % width;
    const sy = (st * 17) % (height * 0.42) + 6;
    const twinkle = 0.4 + 0.6 * Math.sin(timeMs * 0.002 + st * 1.3);
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle.toFixed(2)})`;
    const sz = st % 6 === 0 ? 2.4 : 1.2;
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
 * Radiant desert sun rotating with sky
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

// =============================================================================
// 1. MELBOURNE, AUSTRALIA (Albert Park Lake & Eureka Tower & Rialto & Arts Spire)
// =============================================================================
export function renderMelbourneHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  timeMs: number = 0
) {
  // Layer 1: Albert Park Lake with Shimmering Water Reflections
  const lakeH = 44;
  const lakeGrad = ctx.createLinearGradient(0, horizonY - lakeH, 0, horizonY);
  lakeGrad.addColorStop(0, '#034a6e');
  lakeGrad.addColorStop(0.6, '#0284c7');
  lakeGrad.addColorStop(1, '#7dd3fc');
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, horizonY - lakeH, width, lakeH);

  // Animated Water Wave Caustics
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let w = 0; w < width; w += 32) {
    const rx = ((w - mountainOffset * 0.25 + timeMs * 0.02) % width + width) % width;
    ctx.fillRect(rx, horizonY - 14, 20, 2);
    ctx.fillRect((rx + 14) % width, horizonY - 26, 12, 1.5);
  }

  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.22) % tileW + tileW) % tileW;
  const scrollCity = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 2: Distant Dandenong Mountain Ridges
  ctx.fillStyle = '#062d3a';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const dandenongs = [
      { x: 0, h: 32 }, { x: 140, h: 62 }, { x: 280, h: 44 }, { x: 450, h: 80 },
      { x: 620, h: 52 }, { x: 780, h: 74 }, { x: 940, h: 48 }, { x: 1100, h: 32 }
    ];
    dandenongs.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 3: Iconic Melbourne Architecture & Skyline
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;

    // Eureka Tower (297m, 88 Floors, Faceted Gold Crown & Red Stripe)
    const euX = startX + 180;
    if (euX >= -120 && euX <= width + 120) {
      // Main Blue Glass Tower
      ctx.fillStyle = '#0f2f3d';
      ctx.fillRect(euX - 22, horizonY - 170, 44, 170);
      // Angled Blue Glass Facet
      ctx.fillStyle = '#164e63';
      ctx.beginPath();
      ctx.moveTo(euX, horizonY - 170);
      ctx.lineTo(euX + 22, horizonY - 150);
      ctx.lineTo(euX + 22, horizonY);
      ctx.lineTo(euX, horizonY);
      ctx.closePath();
      ctx.fill();
      // Eureka Gold Plated Crown (Top 10 floors)
      ctx.fillStyle = '#facc15';
      ctx.fillRect(euX - 22, horizonY - 188, 44, 18);
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(euX - 18, horizonY - 188, 12, 18);
      // Eureka Red Stripe
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(euX - 3, horizonY - 170, 6, 170);
      // Spire with Red Aviation Beacon
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(euX, horizonY - 188);
      ctx.lineTo(euX, horizonY - 212);
      ctx.stroke();
      const beaconFlash = (Math.sin(timeMs * 0.005) + 1) * 0.5;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.6 + beaconFlash * 0.4})`;
      ctx.beginPath();
      ctx.arc(euX, horizonY - 212, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Window Grids
      ctx.fillStyle = 'rgba(125, 211, 252, 0.7)';
      for (let r = 0; r < 8; r++) {
        ctx.fillRect(euX - 18, horizonY - 160 + r * 18, 12, 3);
        ctx.fillRect(euX + 6, horizonY - 145 + r * 18, 12, 3);
      }
    }

    // Arts Centre Melbourne Spire (Lattice Tower with White/Gold Neon)
    const acX = startX + 330;
    if (acX >= -80 && acX <= width + 80) {
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(acX - 14, horizonY);
      ctx.lineTo(acX, horizonY - 150);
      ctx.lineTo(acX + 14, horizonY);
      ctx.stroke();
      ctx.lineTo(acX, horizonY - 150);
      ctx.lineWidth = 1;
      ctx.stroke();
      // Lattice struts
      ctx.beginPath();
      ctx.moveTo(acX - 10, horizonY - 50);
      ctx.lineTo(acX + 10, horizonY - 50);
      ctx.moveTo(acX - 6, horizonY - 95);
      ctx.lineTo(acX + 6, horizonY - 95);
      ctx.stroke();
      // Glowing tip
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(acX, horizonY - 150, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rialto Towers (Twin Interlocking Faceted Towers)
    const riX = startX + 460;
    if (riX >= -90 && riX <= width + 90) {
      // South Tower
      ctx.fillStyle = '#083344';
      ctx.fillRect(riX - 25, horizonY - 120, 22, 120);
      ctx.fillStyle = '#0e7490';
      ctx.beginPath();
      ctx.moveTo(riX - 25, horizonY - 120);
      ctx.lineTo(riX - 3, horizonY - 132);
      ctx.lineTo(riX - 3, horizonY - 120);
      ctx.closePath();
      ctx.fill();
      // North Tower (Taller)
      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(riX - 3, horizonY - 155, 26, 155);
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(riX - 3, horizonY - 155);
      ctx.lineTo(riX + 23, horizonY - 170);
      ctx.lineTo(riX + 23, horizonY - 155);
      ctx.closePath();
      ctx.fill();
    }

    // Melbourne Star Giant Observation Wheel
    const stX = startX + 620;
    if (stX >= -90 && stX <= width + 90) {
      const swR = 42;
      const swY = horizonY - 55;
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(stX, swY, swR, 0, Math.PI * 2);
      ctx.stroke();
      // Support Legs
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(stX, swY);
      ctx.lineTo(stX - 22, horizonY);
      ctx.moveTo(stX, swY);
      ctx.lineTo(stX + 22, horizonY);
      ctx.stroke();
      // 7-Point Star Spokes (Australian Commonwealth Star tribute)
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1.2;
      for (let s = 0; s < 7; s++) {
        const ang = (s * Math.PI * 2) / 7 + timeMs * 0.0003;
        ctx.beginPath();
        ctx.moveTo(stX, swY);
        ctx.lineTo(stX + Math.cos(ang) * swR, swY + Math.sin(ang) * swR);
        ctx.stroke();
      }
    }

    // 120 Collins Street (Gothic Pyramid Spire & 4 Lateral Pylons)
    const colX = startX + 780;
    if (colX >= -80 && colX <= width + 80) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(colX - 18, horizonY - 130, 36, 130);
      // Pyramid crown
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(colX - 15, horizonY - 130);
      ctx.lineTo(colX, horizonY - 165);
      ctx.lineTo(colX + 15, horizonY - 130);
      ctx.closePath();
      ctx.fill();
      // Antenna
      ctx.strokeStyle = '#5eead4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(colX, horizonY - 165);
      ctx.lineTo(colX, horizonY - 185);
      ctx.stroke();
    }

    // Lakeside Eucalyptus Gum Trees & Weeping Willows
    ctx.fillStyle = '#065f46';
    for (let t = 0; t < 12; t++) {
      const tx = startX + 40 + t * 90;
      if (tx >= -60 && tx <= width + 60) {
        ctx.beginPath();
        ctx.ellipse(tx, horizonY - 16, 26, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#047857';
        ctx.beginPath();
        ctx.ellipse(tx - 6, horizonY - 20, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#065f46';
      }
    }
  }
}

// =============================================================================
// 2. SUZUKA, JAPAN (Mount Fuji Volcano, 24-Gondola Ferris Wheel, Pagoda, Sakura)
// =============================================================================
export function renderSuzukaHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  timeMs: number = 0
) {
  const farTileW = 1100;
  const { min, max } = getTileRange(width, farTileW);
  const scrollFar = ((mountainOffset * 0.20) % farTileW + farTileW) % farTileW;
  const scrollMid = ((mountainOffset * 0.44) % farTileW + farTileW) % farTileW;

  // Layer 1: Distant Suzuka Mountains & Mount Fuji Volcanic Caldera
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * farTileW - scrollFar;
    const fujiX = startX + 320;
    if (fujiX >= -240 && fujiX <= width + 240) {
      // Fuji Slope
      ctx.fillStyle = '#4a0418';
      ctx.beginPath();
      ctx.moveTo(fujiX - 160, horizonY);
      ctx.lineTo(fujiX - 25, horizonY - 145);
      ctx.lineTo(fujiX + 25, horizonY - 145);
      ctx.lineTo(fujiX + 160, horizonY);
      ctx.closePath();
      ctx.fill();

      // Fuji Snowcap Ridge
      ctx.fillStyle = '#fecdd3';
      ctx.beginPath();
      ctx.moveTo(fujiX - 45, horizonY - 120);
      ctx.lineTo(fujiX - 25, horizonY - 145);
      ctx.lineTo(fujiX + 25, horizonY - 145);
      ctx.lineTo(fujiX + 45, horizonY - 120);
      ctx.lineTo(fujiX + 28, horizonY - 110);
      ctx.lineTo(fujiX + 10, horizonY - 122);
      ctx.lineTo(fujiX - 10, horizonY - 112);
      ctx.lineTo(fujiX - 28, horizonY - 122);
      ctx.closePath();
      ctx.fill();
    }

    // Mie Prefecture Mountain Ridges
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.moveTo(startX, horizonY);
    const peaks = [
      { x: 0, h: 40 }, { x: 120, h: 85 }, { x: 260, h: 55 }, { x: 500, h: 90 },
      { x: 680, h: 60 }, { x: 840, h: 105 }, { x: 980, h: 65 }, { x: 1100, h: 40 }
    ];
    peaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
    ctx.lineTo(startX + 1100, horizonY);
    ctx.closePath();
    ctx.fill();
  }

  // Layer 2: Suzuka Giant Ferris Wheel, Traditional 5-Tier Pagoda & Torii Gate
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * farTileW - scrollMid;

    // Giant Suzuka Ferris Wheel (Rotating with timeMs)
    const fwx = startX + 680;
    if (fwx >= -120 && fwx <= width + 120) {
      const fwy = horizonY - 85;
      const fwRadius = 52;

      // Heavy A-Frame Support Legs
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fwx, fwy);
      ctx.lineTo(fwx - 30, horizonY);
      ctx.moveTo(fwx, fwy);
      ctx.lineTo(fwx + 30, horizonY);
      ctx.stroke();
      // Cross-Brace
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fwx - 16, horizonY - 35);
      ctx.lineTo(fwx + 16, horizonY - 35);
      ctx.stroke();

      // Outer Wheel Rim
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(fwx, fwy, fwRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Concentric Rim
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(fwx, fwy, fwRadius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating Spokes with Multi-colored Gondolas
      const rotAngle = timeMs * 0.00035;
      for (let spk = 0; spk < 16; spk++) {
        const ang = (spk * Math.PI) / 8 + rotAngle;
        const gx = fwx + Math.cos(ang) * fwRadius;
        const gy = fwy + Math.sin(ang) * fwRadius;
        ctx.strokeStyle = '#fecdd3';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fwx, fwy);
        ctx.lineTo(gx, gy);
        ctx.stroke();
        // Colorful Gondola Cabins
        ctx.fillStyle = spk % 3 === 0 ? '#ef4444' : spk % 3 === 1 ? '#38bdf8' : '#facc15';
        ctx.fillRect(gx - 4, gy - 3, 8, 7);
      }
      // Glowing Central Hub
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fwx, fwy, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5-Tier Japanese Wooden Pagoda (Sorin Finial & Curved Tiled Eaves)
    const pagX = startX + 220;
    if (pagX >= -80 && pagX <= width + 80) {
      // Main Base
      ctx.fillStyle = '#4c0519';
      ctx.fillRect(pagX - 16, horizonY - 30, 32, 30);
      // 5 Curved Roof Tiers
      const tiers = [
        { y: 30, w: 46 }, { y: 48, w: 42 }, { y: 64, w: 38 },
        { y: 78, w: 34 }, { y: 92, w: 30 }
      ];
      tiers.forEach((t) => {
        ctx.fillStyle = '#be123c';
        ctx.beginPath();
        ctx.moveTo(pagX - t.w / 2, horizonY - t.y);
        ctx.quadraticCurveTo(pagX, horizonY - t.y - 6, pagX + t.w / 2, horizonY - t.y);
        ctx.lineTo(pagX + t.w / 2 - 4, horizonY - t.y + 5);
        ctx.lineTo(pagX - t.w / 2 + 4, horizonY - t.y + 5);
        ctx.closePath();
        ctx.fill();
      });
      // Golden Sorin Spire
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pagX, horizonY - 92);
      ctx.lineTo(pagX, horizonY - 122);
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(pagX, horizonY - 122, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Japanese Red Shinto Torii Gate
    const torX = startX + 440;
    if (torX >= -60 && torX <= width + 60) {
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(torX - 14, horizonY);
      ctx.lineTo(torX - 12, horizonY - 38);
      ctx.moveTo(torX + 14, horizonY);
      ctx.lineTo(torX + 12, horizonY - 38);
      ctx.stroke();
      // Kasagi top curved beam
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.moveTo(torX - 22, horizonY - 38);
      ctx.quadraticCurveTo(torX, horizonY - 43, torX + 22, horizonY - 38);
      ctx.lineTo(torX + 20, horizonY - 34);
      ctx.lineTo(torX - 20, horizonY - 34);
      ctx.closePath();
      ctx.fill();
    }

    // Cherry Blossom (Sakura) Clouds & Cedar Pines
    ctx.fillStyle = '#fda4af';
    ctx.beginPath();
    ctx.ellipse(startX + 120, horizonY - 18, 28, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(startX + 540, horizonY - 16, 32, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(startX + 880, horizonY - 20, 30, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// =============================================================================
// 3. SINGAPORE (Marina Bay Sands, Gardens by the Bay Supertrees & Singapore Flyer)
// =============================================================================
export function renderSingaporeHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  timeMs: number = 0
) {
  // Layer 1: Marina Bay Water Basin with Mirrored Light Reflections
  const bayH = 46;
  const bayGrad = ctx.createLinearGradient(0, horizonY - bayH, 0, horizonY);
  bayGrad.addColorStop(0, '#0f0524');
  bayGrad.addColorStop(0.7, '#240a4a');
  bayGrad.addColorStop(1, '#4c1d95');
  ctx.fillStyle = bayGrad;
  ctx.fillRect(0, horizonY - bayH, width, bayH);

  // Shimmering Neon Water Caustics
  for (let w = 0; w < width; w += 28) {
    const rx = ((w - mountainOffset * 0.28 + timeMs * 0.015) % width + width) % width;
    ctx.fillStyle = (w % 2 === 0) ? 'rgba(192, 132, 252, 0.4)' : 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(rx, horizonY - 16, 18, 2);
    ctx.fillRect((rx + 12) % width, horizonY - 28, 14, 1.8);
  }

  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollCity = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;

    // Marina Bay Sands (3 Soaring Towers + 340m Cantilevered SkyPark Surfboard)
    const mbsX = startX + 180;
    if (mbsX >= -140 && mbsX <= width + 140) {
      // 3 Towers with Illuminated Glass Louvers
      [-32, 0, 32].forEach((offset) => {
        ctx.fillStyle = '#2e1065';
        ctx.fillRect(mbsX + offset - 11, horizonY - 140, 22, 140);
        ctx.fillStyle = '#7c3aed';
        ctx.fillRect(mbsX + offset - 8, horizonY - 138, 16, 136);
        // Window rows
        ctx.fillStyle = 'rgba(233, 213, 255, 0.85)';
        for (let wr = 0; wr < 9; wr++) {
          ctx.fillRect(mbsX + offset - 6, horizonY - 130 + wr * 13, 12, 2.5);
        }
      });
      // The Massive SkyPark Cantilevered Boat Roof
      ctx.fillStyle = '#e9d5ff';
      ctx.beginPath();
      ctx.moveTo(mbsX - 60, horizonY - 140);
      ctx.quadraticCurveTo(mbsX, horizonY - 158, mbsX + 70, horizonY - 142);
      ctx.quadraticCurveTo(mbsX, horizonY - 145, mbsX - 60, horizonY - 140);
      ctx.closePath();
      ctx.fill();
      // Glowing Infinity Pool Edge
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(mbsX - 45, horizonY - 148);
      ctx.lineTo(mbsX + 45, horizonY - 148);
      ctx.stroke();
      // Rooftop Garden Palm Trees
      ctx.fillStyle = '#22c55e';
      [-30, -10, 10, 30].forEach((px) => {
        ctx.beginPath();
        ctx.arc(mbsX + px, horizonY - 152, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Gardens by the Bay: Supertree Grove (Biomimetic Funnel Canopies with Neon Vines)
    const stX = startX + 420;
    if (stX >= -90 && stX <= width + 90) {
      // Main Supertree
      ctx.fillStyle = '#c026d3';
      ctx.beginPath();
      ctx.moveTo(stX - 6, horizonY);
      ctx.lineTo(stX - 4, horizonY - 65);
      ctx.quadraticCurveTo(stX - 25, horizonY - 95, stX - 35, horizonY - 105);
      ctx.quadraticCurveTo(stX, horizonY - 85, stX + 35, horizonY - 105);
      ctx.quadraticCurveTo(stX + 25, horizonY - 95, stX + 4, horizonY - 65);
      ctx.lineTo(stX + 6, horizonY);
      ctx.closePath();
      ctx.fill();
      // Glowing Canopy Core
      ctx.fillStyle = '#f0abfc';
      ctx.beginPath();
      ctx.ellipse(stX, horizonY - 95, 26, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Flanking Second Supertree
      ctx.fillStyle = '#9333ea';
      ctx.beginPath();
      ctx.moveTo(stX + 50 - 5, horizonY);
      ctx.lineTo(stX + 50 - 3, horizonY - 50);
      ctx.quadraticCurveTo(stX + 50 - 18, horizonY - 75, stX + 50 - 24, horizonY - 82);
      ctx.quadraticCurveTo(stX + 50, horizonY - 68, stX + 50 + 24, horizonY - 82);
      ctx.lineTo(stX + 50 + 5, horizonY);
      ctx.closePath();
      ctx.fill();
      // Connecting OCBC Skyway Bridge
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(stX, horizonY - 70);
      ctx.quadraticCurveTo(stX + 25, horizonY - 60, stX + 50, horizonY - 65);
      ctx.stroke();
    }

    // Singapore Flyer Giant Observation Wheel
    const flyX = startX + 680;
    if (flyX >= -80 && flyX <= width + 80) {
      const flyY = horizonY - 65;
      const flyR = 46;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(flyX, flyY, flyR, 0, Math.PI * 2);
      ctx.stroke();
      // Support Legs
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(flyX, flyY);
      ctx.lineTo(flyX - 20, horizonY);
      ctx.moveTo(flyX, flyY);
      ctx.lineTo(flyX + 20, horizonY);
      ctx.stroke();
      // Spoke lights
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 1;
      for (let s = 0; s < 12; s++) {
        const ang = (s * Math.PI) / 6 + timeMs * 0.0003;
        ctx.beginPath();
        ctx.moveTo(flyX, flyY);
        ctx.lineTo(flyX + Math.cos(ang) * flyR, flyY + Math.sin(ang) * flyR);
        ctx.stroke();
      }
    }

    // ArtScience Museum Glowing White Lotus Petals
    const artX = startX + 850;
    if (artX >= -60 && artX <= width + 60) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(artX, horizonY - 14, 28, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      // Petals
      [-16, -8, 0, 8, 16].forEach((px) => {
        ctx.beginPath();
        ctx.moveTo(artX + px - 4, horizonY - 14);
        ctx.lineTo(artX + px, horizonY - 32);
        ctx.lineTo(artX + px + 4, horizonY - 14);
        ctx.closePath();
        ctx.fill();
      });
    }

    // Dense Financial District Illuminated Skyscrapers
    const cbdBuildings = [
      { x: 30, w: 38, h: 125, col: '#1e1b4b', trim: '#38bdf8' },
      { x: 75, w: 45, h: 160, col: '#311042', trim: '#c084fc' },
      { x: 550, w: 42, h: 145, col: '#1e1b4b', trim: '#67e8f9' },
      { x: 960, w: 40, h: 130, col: '#311042', trim: '#f472b6' },
    ];
    cbdBuildings.forEach((b) => {
      const bx = startX + b.x;
      if (bx >= -60 && bx <= width + 60) {
        ctx.fillStyle = b.col;
        ctx.fillRect(bx, horizonY - b.h, b.w, b.h);
        ctx.fillStyle = b.trim;
        ctx.fillRect(bx, horizonY - b.h, b.w, 3.5);
        ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
        for (let r = 0; r < 6; r++) {
          ctx.fillRect(bx + 5, horizonY - b.h + 15 + r * 18, b.w - 10, 2.5);
        }
      }
    });
  }
}

// =============================================================================
// 4. SAKHIR, BAHRAIN (Bahrain World Trade Center, Wind Turbines, Sakhir VIP Tower)
// =============================================================================
export function renderSakhirHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  timeMs: number = 0
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.24) % tileW + tileW) % tileW;
  const scrollDunes = ((mountainOffset * 0.46) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.68) % tileW + tileW) % tileW;

  // Layer 1: Sandstone Desert Mesas & Distant Horizons
  ctx.fillStyle = '#7c2d12';
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    [120, 480, 840].forEach((mx) => {
      const px = startX + mx;
      if (px >= -140 && px <= width + 140) {
        ctx.beginPath();
        ctx.moveTo(px - 75, horizonY);
        ctx.lineTo(px - 55, horizonY - 60);
        ctx.lineTo(px + 55, horizonY - 60);
        ctx.lineTo(px + 75, horizonY);
        ctx.closePath();
        ctx.fill();
        // Rock strata lines
        ctx.fillStyle = '#9a3412';
        ctx.fillRect(px - 52, horizonY - 45, 104, 4);
        ctx.fillRect(px - 58, horizonY - 28, 116, 4);
        ctx.fillStyle = '#7c2d12';
      }
    });
  }

  // Layer 2: Undulating Arabian Sand Dunes with Wind Drift Crests
  ctx.fillStyle = '#c2410c';
  ctx.beginPath();
  ctx.moveTo(-scrollDunes - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollDunes;
    const dunePeaks = [
      { x: 0, h: 28 }, { x: 160, h: 72 }, { x: 320, h: 36 }, { x: 520, h: 84 },
      { x: 700, h: 42 }, { x: 880, h: 78 }, { x: 1000, h: 34 }, { x: 1100, h: 28 }
    ];
    dunePeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 3: Bahrain World Trade Center (Twin Sail Towers + 3 Rotating Wind Turbines)
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;

    // Bahrain World Trade Center (Twin 240m aerodynamic sail towers)
    const bwtcX = startX + 320;
    if (bwtcX >= -100 && bwtcX <= width + 100) {
      // Left Sail Tower
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(bwtcX - 35, horizonY);
      ctx.lineTo(bwtcX - 12, horizonY - 165);
      ctx.lineTo(bwtcX - 2, horizonY);
      ctx.closePath();
      ctx.fill();
      // Right Sail Tower
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(bwtcX + 35, horizonY);
      ctx.lineTo(bwtcX + 12, horizonY - 165);
      ctx.lineTo(bwtcX + 2, horizonY);
      ctx.closePath();
      ctx.fill();

      // 3 Skybridges with Spinning 3-Bladed Wind Turbines
      [55, 95, 135].forEach((by) => {
        // Skybridge beam
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(bwtcX - 18, horizonY - by - 2, 36, 4);
        // Wind turbine nacelle hub
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bwtcX, horizonY - by, 3.5, 0, Math.PI * 2);
        ctx.fill();
        // 3 rotating blades
        const tbAngle = timeMs * 0.004 + by;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        for (let bl = 0; bl < 3; bl++) {
          const ang = tbAngle + (bl * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.moveTo(bwtcX, horizonY - by);
          ctx.lineTo(bwtcX + Math.cos(ang) * 12, horizonY - by + Math.sin(ang) * 12);
          ctx.stroke();
        }
      });
    }

    // Sakhir 8-Tier Circular VIP Hospitality Tower ("Sakhir Tower")
    const twX = startX + 680;
    if (twX >= -100 && twX <= width + 100) {
      for (let ring = 0; ring < 8; ring++) {
        const ry = horizonY - 16 - ring * 14;
        const rw = 44 - ring * 3;
        ctx.fillStyle = ring % 2 === 0 ? '#ef4444' : '#ffffff';
        ctx.beginPath();
        ctx.ellipse(twX, ry, rw, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Tower core pillar
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(twX - rw / 2 + 4, ry - 6, rw - 8, 6);
      }
      // Rooftop viewing spire
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(twX, horizonY - 128);
      ctx.lineTo(twX, horizonY - 145);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(twX, horizonY - 145, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Date Palm Oasis Groves along Roadside
    ctx.fillStyle = '#15803d';
    for (let p = 0; p < 6; p++) {
      const px = startX + 160 + p * 160;
      if (px >= -40 && px <= width + 40) {
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(px, horizonY);
        ctx.lineTo(px + 4, horizonY - 26);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(px + 4, horizonY - 26, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// =============================================================================
// 5. BANGKOK, THAILAND (Wat Arun, Rama VIII Bridge, Mahanakhon, Chao Phraya River)
// =============================================================================
export function renderBangkokHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  timeMs: number = 0
) {
  // Chao Phraya River Water Band
  const riverH = 48;
  const riverGrad = ctx.createLinearGradient(0, horizonY - riverH, 0, horizonY);
  riverGrad.addColorStop(0, '#1e1b4b');
  riverGrad.addColorStop(0.5, '#312e81');
  riverGrad.addColorStop(0.85, '#78350f');
  riverGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = riverGrad;
  ctx.fillRect(0, horizonY - riverH, width, riverH);

  // Golden River Ripple Reflections
  ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
  for (let w = 0; w < width; w += 35) {
    const waveX = (w - (mountainOffset * 0.28) % width + width) % width;
    ctx.fillRect(waveX, horizonY - 16, 22, 2.5);
    ctx.fillRect((waveX + 18) % width, horizonY - 26, 14, 2);
  }

  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.22) % tileW + tileW) % tileW;
  const scrollCity = ((mountainOffset * 0.46) % tileW + tileW) % tileW;

  // Layer 1: Rama VIII Bridge & Distant Bangkok Metropolis Skyline
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;

    // Rama VIII Cable-Stayed Bridge (Single Inverted-Y Tower with Fan Cables)
    const bridgeX = startX + 240;
    if (bridgeX >= -200 && bridgeX <= width + 200) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(bridgeX - 18, horizonY - 10);
      ctx.lineTo(bridgeX, horizonY - 155);
      ctx.lineTo(bridgeX + 18, horizonY - 10);
      ctx.stroke();

      // Pylon Tip
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bridgeX, horizonY - 157, 4, 0, Math.PI * 2);
      ctx.fill();

      // Golden Stay Cables
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
      ctx.lineWidth = 1.2;
      for (let c = 0; c < 12; c++) {
        const attachY = horizonY - 145 + c * 8;
        const deckX = bridgeX + 30 + c * 16;
        ctx.beginPath();
        ctx.moveTo(bridgeX, attachY);
        ctx.lineTo(deckX, horizonY - 10);
        ctx.stroke();
      }
    }
  }

  // Layer 2: Wat Arun Grand Prang & King Power Mahanakhon
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;

    // King Power Mahanakhon 314m (3D Spiral Pixel Ribbon)
    const mhX = startX + 480;
    if (mhX >= -100 && mhX <= width + 100) {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(mhX - 22, horizonY - 170, 44, 170);
      ctx.fillStyle = '#4338ca';
      ctx.fillRect(mhX - 18, horizonY - 168, 36, 168);
      // Pixel cutouts
      ctx.fillStyle = '#fde047';
      [35, 60, 85, 115, 140].forEach((py, i) => {
        const px = i % 2 === 0 ? mhX - 16 : mhX + 6;
        ctx.fillRect(px, horizonY - py, 14, 12);
      });
      // Glass skywalk
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(mhX - 12, horizonY - 182, 24, 12);
    }

    // Wat Arun (Temple of Dawn) Grand Central Prang (67m Khmer-Style Tiered Spire)
    const waX = startX + 760;
    if (waX >= -120 && waX <= width + 120) {
      // Stepped Terraced Base
      ctx.fillStyle = '#d97706';
      ctx.fillRect(waX - 35, horizonY - 40, 70, 40);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(waX - 28, horizonY - 70, 56, 30);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(waX - 20, horizonY - 105, 40, 35);

      // Grand Prang Curved Spire
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(waX - 14, horizonY - 105);
      ctx.quadraticCurveTo(waX - 6, horizonY - 165, waX, horizonY - 175);
      ctx.quadraticCurveTo(waX + 6, horizonY - 165, waX + 14, horizonY - 105);
      ctx.closePath();
      ctx.fill();

      // Golden Nopphasun Trident Spire
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(waX, horizonY - 175);
      ctx.lineTo(waX, horizonY - 192);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(waX, horizonY - 192, 3, 0, Math.PI * 2);
      ctx.fill();

      // 4 Satellite Corner Chedis
      [-42, 42].forEach((cx) => {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(waX + cx - 8, horizonY - 50, 16, 50);
        ctx.beginPath();
        ctx.moveTo(waX + cx - 7, horizonY - 50);
        ctx.lineTo(waX + cx, horizonY - 85);
        ctx.lineTo(waX + cx + 7, horizonY - 50);
        ctx.closePath();
        ctx.fill();
      });
    }
  }
}

// =============================================================================
// 6. BARCELONA, SPAIN (Sagrada Família, Montserrat Mountains, Torre Glòries)
// =============================================================================
export function renderCatalunyaHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.24) % tileW + tileW) % tileW;
  const scrollMid = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 1: Montserrat "Sawtooth" Mountain Range Monoliths
  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const montserrat = [
      { x: 0, h: 35 }, { x: 90, h: 95 }, { x: 140, h: 135 }, { x: 180, h: 105 },
      { x: 260, h: 50 }, { x: 380, h: 145 }, { x: 420, h: 165 }, { x: 480, h: 125 },
      { x: 600, h: 58 }, { x: 720, h: 120 }, { x: 810, h: 90 }, { x: 950, h: 148 }, { x: 1100, h: 35 }
    ];
    montserrat.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 2: Sagrada Família Spires & Torre Glòries (Agbar)
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMid;

    // Sagrada Família (8 Parabolic Bell Towers + Central Christ Cross)
    const sagX = startX + 340;
    if (sagX >= -120 && sagX <= width + 120) {
      // Central Jesus Christ Tower (172m)
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.moveTo(sagX - 16, horizonY);
      ctx.lineTo(sagX - 8, horizonY - 160);
      ctx.lineTo(sagX + 8, horizonY - 160);
      ctx.lineTo(sagX + 16, horizonY);
      ctx.closePath();
      ctx.fill();
      // Glowing Cross
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sagX, horizonY - 160);
      ctx.lineTo(sagX, horizonY - 180);
      ctx.moveTo(sagX - 8, horizonY - 172);
      ctx.lineTo(sagX + 8, horizonY - 172);
      ctx.stroke();

      // 4 Nativity Facade Towers
      [-36, -20, 20, 36].forEach((tx, idx) => {
        const th = idx === 1 || idx === 2 ? 140 : 120;
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.moveTo(sagX + tx - 7, horizonY);
        ctx.lineTo(sagX + tx - 4, horizonY - th);
        ctx.lineTo(sagX + tx + 4, horizonY - th);
        ctx.lineTo(sagX + tx + 7, horizonY);
        ctx.closePath();
        ctx.fill();
        // Colorful mosaic finial
        ctx.fillStyle = idx % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(sagX + tx, horizonY - th - 3, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Torre Glòries (Bullet-shaped Geyser Tower with Red/Blue LED Gradient)
    const gloX = startX + 680;
    if (gloX >= -60 && gloX <= width + 60) {
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.ellipse(gloX, horizonY, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(gloX - 18, horizonY);
      ctx.quadraticCurveTo(gloX - 18, horizonY - 130, gloX, horizonY - 145);
      ctx.quadraticCurveTo(gloX + 18, horizonY - 130, gloX + 18, horizonY);
      ctx.closePath();
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
    }
  }
}

// =============================================================================
// 7. MONTE CARLO, MONACO (Mediterranean Sea, Casino, Rock of Monaco & Superyachts)
// =============================================================================
export function renderMonacoHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  // Deep Azure Mediterranean Sea
  const oceanH = 48;
  const oceanGrad = ctx.createLinearGradient(0, horizonY - oceanH, 0, horizonY);
  oceanGrad.addColorStop(0, '#0284c7');
  oceanGrad.addColorStop(0.6, '#0369a1');
  oceanGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, horizonY - oceanH, width, oceanH);

  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollMtn = ((mountainOffset * 0.24) % tileW + tileW) % tileW;
  const scrollVillas = ((mountainOffset * 0.50) % tileW + tileW) % tileW;

  // Layer 1: Sheer Maritime Alps Limestone Cliffs (Tête de Chien)
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(-scrollMtn - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMtn;
    const cliffPeaks = [
      { x: 0, h: 50 }, { x: 180, h: 125 }, { x: 360, h: 75 }, { x: 550, h: 140 },
      { x: 740, h: 85 }, { x: 920, h: 130 }, { x: 1100, h: 50 }
    ];
    cliffPeaks.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 2: Monte Carlo Casino Belle Époque Domes, Cliffside Villas & Port Hercule Yachts
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollVillas;

    // Monte Carlo Casino (Copper-Verdigris Domes & Classic Arched Windows)
    const casX = startX + 320;
    if (casX >= -100 && casX <= width + 100) {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(casX - 45, horizonY - 65, 90, 65);
      // Main Center Copper Dome
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(casX, horizonY - 65, 20, Math.PI, 0);
      ctx.fill();
      // Twin Flanking Pavilions
      ctx.beginPath();
      ctx.arc(casX - 32, horizonY - 65, 12, Math.PI, 0);
      ctx.arc(casX + 32, horizonY - 65, 12, Math.PI, 0);
      ctx.fill();
    }

    // Cascading Luxury Cliffside Pastel Apartments
    for (let v = 0; v < 8; v++) {
      const vx = startX + 460 + v * 70;
      if (vx >= -60 && vx <= width + 60) {
        const vh = 45 + (v % 3) * 18;
        ctx.fillStyle = v % 2 === 0 ? '#fed7aa' : '#fecdd3';
        ctx.fillRect(vx, horizonY - vh, 54, vh);
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(vx - 2, horizonY - vh, 58, 4);
      }
    }

    // Superyachts in Port Hercule
    [140, 780, 960].forEach((yx) => {
      const px = startX + yx;
      if (px >= -80 && px <= width + 80) {
        // Hull
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(px - 38, horizonY - 14);
        ctx.lineTo(px + 38, horizonY - 14);
        ctx.lineTo(px + 30, horizonY - 4);
        ctx.lineTo(px - 30, horizonY - 4);
        ctx.closePath();
        ctx.fill();
        // Superstructure cabin
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(px - 18, horizonY - 26, 36, 12);
        // Radar mast
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(px, horizonY - 26);
        ctx.lineTo(px, horizonY - 38);
        ctx.stroke();
      }
    });
  }
}

// =============================================================================
// 8. MONZA, ITALY (Milan Duomo Gothic Spires, Historic Banked Oval, Royal Park)
// =============================================================================
export function renderMonzaHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollAlps = ((mountainOffset * 0.22) % tileW + tileW) % tileW;
  const scrollPark = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 1: Distant Italian Alps & Snow Peaks
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.moveTo(-scrollAlps - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollAlps;
    const alps = [
      { x: 0, h: 45 }, { x: 180, h: 90 }, { x: 340, h: 55 }, { x: 520, h: 105 },
      { x: 700, h: 60 }, { x: 880, h: 95 }, { x: 1100, h: 45 }
    ];
    alps.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 2: Milan Duomo Gothic Spires & Historic Curva Sopraelevata Banking
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollPark;

    // Milan Duomo Gothic Cathedral (Central Spire + Madonnina)
    const duoX = startX + 360;
    if (duoX >= -100 && duoX <= width + 100) {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(duoX - 35, horizonY - 70, 70, 70);
      // Main Center Spire
      ctx.beginPath();
      ctx.moveTo(duoX - 5, horizonY - 70);
      ctx.lineTo(duoX, horizonY - 145);
      ctx.lineTo(duoX + 5, horizonY - 70);
      ctx.closePath();
      ctx.fill();
      // Golden Madonnina Statue
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(duoX, horizonY - 145, 3.5, 0, Math.PI * 2);
      ctx.fill();
      // Satellite Spires
      [-25, -15, 15, 25].forEach((sx) => {
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.moveTo(duoX + sx - 3, horizonY - 70);
        ctx.lineTo(duoX + sx, horizonY - 110);
        ctx.lineTo(duoX + sx + 3, horizonY - 70);
        ctx.closePath();
        ctx.fill();
      });
    }

    // Legendary Curva Sopraelevata High-Banked Concrete Oval (1950s)
    const bnkX = startX + 680;
    if (bnkX >= -100 && bnkX <= width + 100) {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(bnkX - 50, horizonY);
      ctx.quadraticCurveTo(bnkX, horizonY - 75, bnkX + 50, horizonY - 55);
      ctx.lineTo(bnkX + 50, horizonY);
      ctx.closePath();
      ctx.fill();
      // Yellow warning stripes
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bnkX - 25, horizonY - 35);
      ctx.lineTo(bnkX - 15, horizonY - 50);
      ctx.moveTo(bnkX + 10, horizonY - 45);
      ctx.lineTo(bnkX + 20, horizonY - 60);
      ctx.stroke();
    }

    // Parco di Monza Royal Oak Tree Canopy
    ctx.fillStyle = '#14532d';
    for (let t = 0; t < 10; t++) {
      const tx = startX + 40 + t * 110;
      if (tx >= -60 && tx <= width + 60) {
        ctx.beginPath();
        ctx.ellipse(tx, horizonY - 18, 32, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// =============================================================================
// 9. SPIELBERG, AUSTRIA (Red Bull Ring, Styrian Alps & Giant Steel Bull Horn)
// =============================================================================
export function renderAustriaHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.22) % tileW + tileW) % tileW;
  const scrollNear = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 1: Majestic Styrian Alps with Permanent Glacier Snowfields
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const alps = [
      { x: 120, w: 180, h: 145 },
      { x: 420, w: 240, h: 175 },
      { x: 780, w: 210, h: 155 },
      { x: 1020, w: 160, h: 135 },
    ];
    alps.forEach((m) => {
      const mx = startX + m.x;
      if (mx >= -180 && mx <= width + 180) {
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.moveTo(mx - m.w / 2, horizonY);
        ctx.lineTo(mx, horizonY - m.h);
        ctx.lineTo(mx + m.w / 2, horizonY);
        ctx.closePath();
        ctx.fill();
        // Glacier Snowfield
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.moveTo(mx - m.w * 0.22, horizonY - m.h * 0.65);
        ctx.lineTo(mx, horizonY - m.h);
        ctx.lineTo(mx + m.w * 0.22, horizonY - m.h * 0.65);
        ctx.lineTo(mx + m.w * 0.08, horizonY - m.h * 0.55);
        ctx.lineTo(mx - m.w * 0.08, horizonY - m.h * 0.55);
        ctx.closePath();
        ctx.fill();
      }
    });
  }

  // Layer 2: The Bull of Spielberg ("Stier von Spielberg" Arching Steel Bull) & Chalets
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollNear;

    // Giant Steel Bull Sculpture (18m tall with glowing gold horn ring)
    const bullX = startX + 540;
    if (bullX >= -100 && bullX <= width + 100) {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(bullX - 35, horizonY - 20);
      ctx.quadraticCurveTo(bullX - 10, horizonY - 60, bullX + 25, horizonY - 45);
      ctx.lineTo(bullX + 40, horizonY - 55);
      ctx.lineTo(bullX + 30, horizonY - 20);
      ctx.closePath();
      ctx.fill();
      // Glowing Arching Golden Ring Horn
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(bullX + 15, horizonY - 45, 34, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Alpine Timber Chalet
    const chX = startX + 220;
    if (chX >= -60 && chX <= width + 60) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(chX - 22, horizonY - 28, 44, 28);
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(chX - 26, horizonY - 28);
      ctx.lineTo(chX, horizonY - 46);
      ctx.lineTo(chX + 26, horizonY - 28);
      ctx.closePath();
      ctx.fill();
    }
  }
}

// =============================================================================
// 10. SPA-FRANCORCHAMPS, BELGIUM (Eau Rouge / Raidillon 17% Incline & Ardennes)
// =============================================================================
export function renderSpaHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.22) % tileW + tileW) % tileW;
  const scrollMid = ((mountainOffset * 0.46) % tileW + tileW) % tileW;

  // Layer 1: Misty Rolling Ardennes Forest Ridges
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const ardennes = [
      { x: 0, h: 35 }, { x: 180, h: 80 }, { x: 360, h: 48 }, { x: 540, h: 95 },
      { x: 740, h: 54 }, { x: 920, h: 88 }, { x: 1100, h: 35 }
    ];
    ardennes.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 2: Legendary Eau Rouge / Raidillon 17% Uphill Sweeper & Pit Buildings
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMid;

    const eauX = startX + 440;
    if (eauX >= -140 && eauX <= width + 140) {
      // Steep asphalt ribbon climbing uphill into Raidillon
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(eauX - 60, horizonY);
      ctx.quadraticCurveTo(eauX, horizonY - 50, eauX + 50, horizonY - 95);
      ctx.stroke();

      // Red and White Striped High Curbs
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(eauX - 64, horizonY);
      ctx.quadraticCurveTo(eauX - 4, horizonY - 50, eauX + 46, horizonY - 95);
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Radisson Hotel & Pit Gantry at crest
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(eauX + 40, horizonY - 120, 42, 25);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(eauX + 40, horizonY - 122, 42, 3);
    }

    // Dense Ardennes Fir Tree Silhouettes
    ctx.fillStyle = '#0f172a';
    for (let t = 0; t < 12; t++) {
      const tx = startX + 30 + t * 90;
      if (tx >= -40 && tx <= width + 40) {
        ctx.beginPath();
        ctx.moveTo(tx - 16, horizonY);
        ctx.lineTo(tx, horizonY - 45);
        ctx.lineTo(tx + 16, horizonY);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

// =============================================================================
// 11. ZANDVOORT, NETHERLANDS (Dutch Windmill, De Vuurtoren Lighthouse, Dunes)
// =============================================================================
export function renderZandvoortHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.24) % tileW + tileW) % tileW;
  const scrollMid = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 1: Sweeping North Sea Coastal Sand Dunes
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const dunes = [
      { x: 0, h: 22 }, { x: 160, h: 56 }, { x: 340, h: 32 }, { x: 520, h: 68 },
      { x: 720, h: 36 }, { x: 900, h: 62 }, { x: 1100, h: 22 }
    ];
    dunes.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 2: Traditional Dutch Windmill (Molen with 4-Sail Lattice) & Lighthouse
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMid;

    // Traditional Dutch Windmill
    const mlX = startX + 320;
    if (mlX >= -90 && mlX <= width + 90) {
      // Thatched Octagonal Body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(mlX - 22, horizonY);
      ctx.lineTo(mlX - 14, horizonY - 65);
      ctx.lineTo(mlX + 14, horizonY - 65);
      ctx.lineTo(mlX + 22, horizonY);
      ctx.closePath();
      ctx.fill();
      // Cap
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(mlX, horizonY - 65, 15, Math.PI, 0);
      ctx.fill();
      // 4 Large Lattice Sails
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mlX - 42, horizonY - 107);
      ctx.lineTo(mlX + 42, horizonY - 23);
      ctx.moveTo(mlX - 42, horizonY - 23);
      ctx.lineTo(mlX + 42, horizonY - 107);
      ctx.stroke();
    }

    // Zandvoort Coastal Lighthouse (Square Red & White Brick Tower)
    const lhX = startX + 720;
    if (lhX >= -60 && lhX <= width + 60) {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(lhX - 12, horizonY - 95, 24, 95);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(lhX - 12, horizonY - 75, 24, 20);
      ctx.fillRect(lhX - 12, horizonY - 35, 24, 18);
      // Lantern Room
      ctx.fillStyle = '#fde047';
      ctx.fillRect(lhX - 8, horizonY - 108, 16, 13);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(lhX - 12, horizonY - 108);
      ctx.lineTo(lhX, horizonY - 120);
      ctx.lineTo(lhX + 12, horizonY - 108);
      ctx.closePath();
      ctx.fill();
    }
  }
}

// =============================================================================
// 12. SILVERSTONE, UK (Big Ben Spire, London Eye Wheel & Modern Silverstone Wing)
// =============================================================================
export function renderSilverstoneHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.24) % tileW + tileW) % tileW;
  const scrollMid = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 1: Rolling English Northamptonshire Countryside
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const plains = [
      { x: 0, h: 22 }, { x: 180, h: 48 }, { x: 380, h: 28 }, { x: 560, h: 52 },
      { x: 760, h: 32 }, { x: 940, h: 46 }, { x: 1100, h: 22 }
    ];
    plains.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 2: Big Ben Clock Tower, London Eye Wheel & Silverstone Wing
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMid;

    // Big Ben (Elizabeth Tower with Illuminated Dial)
    const bbX = startX + 280;
    if (bbX >= -80 && bbX <= width + 80) {
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(bbX - 16, horizonY - 115, 32, 115);
      // Spire
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(bbX - 18, horizonY - 115);
      ctx.lineTo(bbX, horizonY - 155);
      ctx.lineTo(bbX + 18, horizonY - 115);
      ctx.closePath();
      ctx.fill();
      // Clock face
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bbX, horizonY - 100, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // London Eye Observation Wheel
    const eyX = startX + 460;
    if (eyX >= -80 && eyX <= width + 80) {
      const eyY = horizonY - 60;
      const eyR = 44;
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(eyX, eyY, eyR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(eyX, eyY);
      ctx.lineTo(eyX - 18, horizonY);
      ctx.moveTo(eyX, eyY);
      ctx.lineTo(eyX + 18, horizonY);
      ctx.stroke();
    }

    // Modern Silverstone Wing Paddock (Aerodynamic Wave Roofline)
    const wgX = startX + 740;
    if (wgX >= -120 && wgX <= width + 120) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(wgX - 55, horizonY);
      ctx.quadraticCurveTo(wgX, horizonY - 65, wgX + 55, horizonY - 35);
      ctx.lineTo(wgX + 55, horizonY);
      ctx.closePath();
      ctx.fill();
    }
  }
}

// =============================================================================
// 13. MONTREAL, CANADA (Biosphère Geodesic Dome, Olympic Tower & River)
// =============================================================================
export function renderMontrealHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  // St. Lawrence River Water Gradient
  const riverH = 44;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, horizonY - riverH, width, riverH);

  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollMid = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMid;

    // Montreal Biosphère Geodesic Spherical Dome
    const bioX = startX + 360;
    if (bioX >= -90 && bioX <= width + 90) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(bioX, horizonY - 8, 48, Math.PI, 0);
      ctx.stroke();
      // Internal lattice rings
      ctx.lineWidth = 1.2;
      [18, 32].forEach((r) => {
        ctx.beginPath();
        ctx.arc(bioX, horizonY - 8, r, Math.PI, 0);
        ctx.stroke();
      });
    }

    // Montreal Olympic Leaning Tower (165m Inclined at 45 Degrees)
    const olyX = startX + 680;
    if (olyX >= -100 && olyX <= width + 100) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(olyX - 25, horizonY);
      ctx.lineTo(olyX + 25, horizonY - 145);
      ctx.lineTo(olyX + 38, horizonY - 145);
      ctx.lineTo(olyX, horizonY);
      ctx.closePath();
      ctx.fill();
      // Stadium Bowl
      ctx.fillStyle = '#0369a1';
      ctx.beginPath();
      ctx.ellipse(olyX - 15, horizonY - 15, 38, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// =============================================================================
// 14. AUSTIN, TEXAS, USA (Circuit of The Americas 251ft Tower & Texas Capitol)
// =============================================================================
export function renderCotaHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.24) % tileW + tileW) % tileW;
  const scrollTower = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 1: Texas Hill Country Limestone Bluffs
  ctx.fillStyle = '#431407';
  ctx.beginPath();
  ctx.moveTo(-scrollFar - 20, horizonY);
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const hills = [
      { x: 0, h: 28 }, { x: 160, h: 62 }, { x: 340, h: 36 }, { x: 540, h: 74 },
      { x: 740, h: 42 }, { x: 920, h: 68 }, { x: 1100, h: 28 }
    ];
    hills.forEach((pt) => ctx.lineTo(startX + pt.x, horizonY - pt.h));
  }
  ctx.lineTo(width + 40, horizonY);
  ctx.closePath();
  ctx.fill();

  // Layer 2: COTA 251-ft Red Observation Tower with Cascading Ribbons
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollTower;

    const towX = startX + 480;
    if (towX >= -100 && towX <= width + 100) {
      // Central Elevator Column
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(towX - 7, horizonY - 155, 14, 155);
      // Observation Ring at 230ft
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(towX, horizonY - 145, 26, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      // Cascading Red Steel Ribbon Veils (Dramatic Curving Down to Amphitheater)
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(towX, horizonY - 150);
      ctx.quadraticCurveTo(towX + 60, horizonY - 75, towX + 35, horizonY);
      ctx.stroke();
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(towX, horizonY - 150);
      ctx.quadraticCurveTo(towX + 75, horizonY - 85, towX + 52, horizonY);
      ctx.stroke();
    }
  }
}

// =============================================================================
// 15. LAS VEGAS STRIP, USA (The Sphere, Replica Eiffel Tower, Luxor Pyramid Beam)
// =============================================================================
export function renderVegasHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  timeMs: number = 0
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollCity = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;

    // The Vegas Sphere (Pulsating LED Animated Dome)
    const sphereX = startX + 320;
    if (sphereX >= -110 && sphereX <= width + 110) {
      const pulse = (Math.sin(timeMs * 0.002) + 1) * 0.5;
      const sphereGrad = ctx.createRadialGradient(sphereX, horizonY - 42, 6, sphereX, horizonY - 42, 48);
      sphereGrad.addColorStop(0, pulse > 0.5 ? '#f43f5e' : '#38bdf8');
      sphereGrad.addColorStop(0.5, '#a855f7');
      sphereGrad.addColorStop(1, '#09011f');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(sphereX, horizonY - 12, 48, Math.PI, 0);
      ctx.fill();
      // Glowing concentric ring
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sphereX, horizonY - 12, 34, Math.PI, 0);
      ctx.stroke();
    }

    // Paris Las Vegas Replica Eiffel Tower
    const eifX = startX + 540;
    if (eifX >= -80 && eifX <= width + 80) {
      ctx.fillStyle = '#a21caf';
      ctx.beginPath();
      ctx.moveTo(eifX - 22, horizonY);
      ctx.lineTo(eifX - 4, horizonY - 145);
      ctx.lineTo(eifX + 4, horizonY - 145);
      ctx.lineTo(eifX + 22, horizonY);
      ctx.closePath();
      ctx.fill();
      // Searchlight beam on top
      const searchAng = Math.sin(timeMs * 0.003) * 0.4;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(eifX, horizonY - 145);
      ctx.lineTo(eifX + Math.sin(searchAng) * 60, horizonY - 210);
      ctx.stroke();
    }

    // Luxor Black Glass Pyramid & Vertical Sky Beam
    const luxX = startX + 760;
    if (luxX >= -80 && luxX <= width + 80) {
      ctx.fillStyle = '#090514';
      ctx.beginPath();
      ctx.moveTo(luxX - 42, horizonY);
      ctx.lineTo(luxX, horizonY - 110);
      ctx.lineTo(luxX + 42, horizonY);
      ctx.closePath();
      ctx.fill();
      // Blinding Vertical Sky Beam shooting into space
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(luxX, horizonY - 110);
      ctx.lineTo(luxX, horizonY - 240);
      ctx.stroke();
    }
  }
}

// =============================================================================
// 16. MEXICO CITY (Popocatépetl Volcano, Angel of Independence, Aztec Pyramid)
// =============================================================================
export function renderMexicoHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollFar = ((mountainOffset * 0.22) % tileW + tileW) % tileW;
  const scrollMid = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  // Layer 1: Popocatépetl & Iztaccíhuatl Snowcapped Volcanoes
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollFar;
    const popoX = startX + 320;
    if (popoX >= -180 && popoX <= width + 180) {
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.moveTo(popoX - 140, horizonY);
      ctx.lineTo(popoX, horizonY - 155);
      ctx.lineTo(popoX + 140, horizonY);
      ctx.closePath();
      ctx.fill();
      // Snowcap
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(popoX - 35, horizonY - 115);
      ctx.lineTo(popoX, horizonY - 155);
      ctx.lineTo(popoX + 35, horizonY - 115);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Layer 2: Angel of Independence & Aztec Stepped Pyramid
  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollMid;

    // El Ángel de la Independencia (Winged Victory atop Column)
    const angX = startX + 560;
    if (angX >= -60 && angX <= width + 60) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(angX - 5, horizonY - 130, 10, 130);
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(angX, horizonY - 140, 5, 0, Math.PI * 2);
      ctx.fill();
      // Wings
      ctx.beginPath();
      ctx.moveTo(angX, horizonY - 140);
      ctx.lineTo(angX - 12, horizonY - 155);
      ctx.lineTo(angX, horizonY - 145);
      ctx.lineTo(angX + 12, horizonY - 155);
      ctx.closePath();
      ctx.fill();
    }

    // Ancient Aztec Stepped Pyramid
    const pyrX = startX + 780;
    if (pyrX >= -80 && pyrX <= width + 80) {
      ctx.fillStyle = '#9a3412';
      ctx.beginPath();
      ctx.moveTo(pyrX - 45, horizonY);
      ctx.lineTo(pyrX - 25, horizonY - 45);
      ctx.lineTo(pyrX + 25, horizonY - 45);
      ctx.lineTo(pyrX + 45, horizonY);
      ctx.closePath();
      ctx.fill();
    }
  }
}

// =============================================================================
// 17. SÃO PAULO, BRAZIL (Ponte Estaiada X-Bridge & Interlagos Lakes)
// =============================================================================
export function renderInterlagosHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  // Guarapiranga Lake Water
  const lakeH = 40;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, horizonY - lakeH, width, lakeH);

  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollCity = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;

    // Ponte Estaiada (138m X-Shaped Cable-Stayed Pylon Bridge)
    const brX = startX + 480;
    if (brX >= -120 && brX <= width + 120) {
      // X-Pylon Structure
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 5.5;
      ctx.beginPath();
      ctx.moveTo(brX - 24, horizonY);
      ctx.lineTo(brX + 24, horizonY - 150);
      ctx.moveTo(brX + 24, horizonY);
      ctx.lineTo(brX - 24, horizonY - 150);
      ctx.stroke();
      // Fan of stay cables
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 1.2;
      [40, 70, 100].forEach((cy) => {
        ctx.beginPath();
        ctx.moveTo(brX, horizonY - 90);
        ctx.lineTo(brX - 45, horizonY - cy);
        ctx.moveTo(brX, horizonY - 90);
        ctx.lineTo(brX + 45, horizonY - cy);
        ctx.stroke();
      });
    }

    // Dense São Paulo Megalopolis High-Rises
    ctx.fillStyle = '#166534';
    for (let b = 0; b < 6; b++) {
      const bx = startX + 120 + b * 110;
      if (bx >= -60 && bx <= width + 60) {
        ctx.fillRect(bx, horizonY - 90 - (b % 3) * 25, 45, 90 + (b % 3) * 25);
      }
    }
  }
}

// =============================================================================
// 18. ABU DHABI, UAE (W Hotel Yas Marina LED Canopy & Sheikh Zayed Mosque)
// =============================================================================
export function renderYasMarinaHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  timeMs: number = 0
) {
  // Yas Marina Waters
  const oceanH = 46;
  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, horizonY - oceanH, width, oceanH);

  const tileW = 1100;
  const { min, max } = getTileRange(width, tileW);
  const scrollYm = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollYm;

    // W Abu Dhabi Yas Marina Hotel (217m Curved Diamond LED Grid-Shell Arch)
    const yhX = startX + 420;
    if (yhX >= -140 && yhX <= width + 140) {
      // Hotel Main Towers
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(yhX - 55, horizonY - 85, 110, 85);

      // Shifting LED Grid Canopy
      const pulse = (Math.sin(timeMs * 0.0025) + 1) * 0.5;
      ctx.fillStyle = pulse > 0.5 ? '#38bdf8' : '#a855f7';
      ctx.beginPath();
      ctx.moveTo(yhX - 65, horizonY - 20);
      ctx.quadraticCurveTo(yhX, horizonY - 130, yhX + 65, horizonY - 20);
      ctx.quadraticCurveTo(yhX, horizonY - 80, yhX - 65, horizonY - 20);
      ctx.closePath();
      ctx.fill();
    }

    // Sheikh Zayed Grand Mosque Domes & Slender Minarets
    const mosX = startX + 780;
    if (mosX >= -100 && mosX <= width + 100) {
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(mosX, horizonY - 45, 20, Math.PI, 0);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mosX - 22, horizonY - 35, 12, Math.PI, 0);
      ctx.arc(mosX + 22, horizonY - 35, 12, Math.PI, 0);
      ctx.fill();
      // Minarets
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(mosX - 35, horizonY);
      ctx.lineTo(mosX - 35, horizonY - 85);
      ctx.moveTo(mosX + 35, horizonY);
      ctx.lineTo(mosX + 35, horizonY - 85);
      ctx.stroke();
    }
  }
}

// =============================================================================
// CAPE TOWN & DEFAULT FALLBACK
// =============================================================================
export function renderCapeTownHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number
) {
  const tileW = 960;
  const { min, max } = getTileRange(width, tileW);
  const scrollCity = ((mountainOffset * 0.48) % tileW + tileW) % tileW;

  for (let tile = min; tile <= max; tile++) {
    const startX = tile * tileW - scrollCity;
    const tmX = startX + 480;
    if (tmX >= -200 && tmX <= width + 200) {
      // Table Mountain Flat Mesa
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(tmX - 120, horizonY);
      ctx.lineTo(tmX - 90, horizonY - 120);
      ctx.lineTo(tmX + 90, horizonY - 120);
      ctx.lineTo(tmX + 120, horizonY);
      ctx.closePath();
      ctx.fill();
    }
  }
}

export function renderDefaultHorizon(
  ctx: CanvasRenderingContext2D,
  width: number,
  horizonY: number,
  mountainOffset: number,
  circuitDef: WorldTourCircuitDef,
  isWet: boolean
) {
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
      renderMelbourneHorizon(ctx, width, horizonY, mountainOffset, timeMs);
      break;
    case 'sakhir_desert':
      renderSakhirHorizon(ctx, width, horizonY, mountainOffset, timeMs);
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
      renderSingaporeHorizon(ctx, width, horizonY, mountainOffset, timeMs);
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
      renderBangkokHorizon(ctx, width, horizonY, mountainOffset, timeMs);
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
