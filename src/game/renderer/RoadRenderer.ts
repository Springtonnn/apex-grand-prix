/**
 * APEX GRAND PRIX - WebGL High-Performance Road & Grandstand Renderer
 * Converts pseudo-3D raster scanlines and 3D continuous grandstands into GPU batched polygons.
 */

import { WebGLRaceRenderer } from './WebGLRaceRenderer';

export interface ProjectedSegmentItem {
  seg: any;
  x1: number;
  y1: number;
  w1: number;
  scale: number;
  x2: number;
  y2: number;
  w2: number;
}

const GRANDSTAND_TIERS = [
  { inOff: 0.08, outOff: 0.42, h: 0.22, capH: 0.36 },
  { inOff: 0.42, outOff: 0.78, h: 0.40, capH: 0.58 },
  { inOff: 0.78, outOff: 1.15, h: 0.62, capH: 0.82 },
  { inOff: 1.15, outOff: 1.55, h: 0.86, capH: 1.08 },
  { inOff: 1.55, outOff: 1.98, h: 1.12, capH: 1.36 },
];

const CROWD_SECTION_COLORS = [
  ['#dc2626', '#b91c1c'],
  ['#2563eb', '#1d4ed8'],
  ['#ea580c', '#c2410c'],
  ['#16a34a', '#15803d'],
  ['#9333ea', '#7e22ce'],
  ['#0284c7', '#0369a1'],
];

export function renderRoadSegmentsWebGL(
  renderer: WebGLRaceRenderer,
  projectedSegments: ProjectedSegmentItem[],
  projectedCount: number,
  screenWidth: number,
  screenHeight: number,
  timestamp: number,
  trackSegmentsLength: number
) {
  // Render back-to-front (from horizon to camera)
  for (let i = projectedCount - 1; i >= 0; i--) {
    const item = projectedSegments[i];
    const seg = item.seg;
    const { x1, y1, w1, x2, y2, w2 } = item;

    // Draw road and curb scanlines only if forward-facing and has height (y1 > y2)
    if (y1 > y2) {
      // 1. Grass (full screen width between consecutive scanlines)
      renderer.addRect(0, y2, screenWidth, y1 - y2, seg.color.grass);

      // 2. Rumble Strips (Kerbs: 1.22x road width)
      const rumbleW1 = w1 * 1.22;
      const rumbleW2 = w2 * 1.22;
      renderer.addTrapezoid(
        x1 - rumbleW1, y1,
        x1 + rumbleW1, y1,
        x2 + rumbleW2, y2,
        x2 - rumbleW2, y2,
        seg.color.rumble
      );

      // 3. Asphalt Road Surface
      renderer.addTrapezoid(
        x1 - w1, y1,
        x1 + w1, y1,
        x2 + w2, y2,
        x2 - w2, y2,
        seg.color.road
      );

      // 4. Center Dashed Line
      if (seg.color.lane && seg.color.lane !== 'transparent') {
        const laneW1 = w1 * 0.05;
        const laneW2 = w2 * 0.05;
        renderer.addTrapezoid(
          x1 - laneW1, y1,
          x1 + laneW1, y1,
          x2 + laneW2, y2,
          x2 - laneW2, y2,
          seg.color.lane
        );
      }

      // 4b. Formula 1 High-Energy Yellow Booster Pad / Speed Pad
      if (seg.boostPad) {
        const padOffset = seg.boostPad.offset;
        const padW = seg.boostPad.width || 0.52;
        const padX1 = x1 + padOffset * w1;
        const padX2 = x2 + padOffset * w2;
        const halfW1 = (w1 * padW) / 2;
        const halfW2 = (w2 * padW) / 2;

        const pulse = (Math.sin(timestamp * 0.011 + seg.index * 0.35) + 1) * 0.5;
        const glowOpacity = 0.65 + pulse * 0.32;

        // Dark Racing Amber-Carbon Base Pad
        renderer.addTrapezoid(
          padX1 - halfW1, y1,
          padX1 + halfW1, y1,
          padX2 + halfW2, y2,
          padX2 - halfW2, y2,
          '#1a1300'
        );

        // Glowing Outer Border Framing
        const borderThick1 = halfW1 * 0.12;
        const borderThick2 = halfW2 * 0.12;
        renderer.addTrapezoid(
          padX1 - halfW1, y1,
          padX1 - halfW1 + borderThick1, y1,
          padX2 - halfW2 + borderThick2, y2,
          padX2 - halfW2, y2,
          '#fbbf24',
          glowOpacity
        );
        renderer.addTrapezoid(
          padX1 + halfW1 - borderThick1, y1,
          padX1 + halfW1, y1,
          padX2 + halfW2, y2,
          padX2 + halfW2 - borderThick2, y2,
          '#fbbf24',
          glowOpacity
        );

        // Inner Brilliant Yellow Pad Core
        const coreW1 = halfW1 * 0.78;
        const coreW2 = halfW2 * 0.78;
        renderer.addTrapezoid(
          padX1 - coreW1, y1,
          padX1 + coreW1, y1,
          padX2 + coreW2, y2,
          padX2 - coreW2, y2,
          '#eab308'
        );

        // Pulsing Forward Direction Chevrons (Triple Arrows)
        const numChevrons = 3;
        for (let c = 0; c < numChevrons; c++) {
          const cPhase = ((timestamp * 0.006 + seg.index * 0.15 + c * 0.33) % 1);
          const cY = y2 + (y1 - y2) * cPhase;
          const cNextY = Math.min(y1, cY + (y1 - y2) * 0.22);
          const cFrac = (cY - y2) / Math.max(1, y1 - y2);
          const cW = (halfW2 + (halfW1 - halfW2) * cFrac) * 0.65;
          const cMidX = padX2 + (padX1 - padX2) * cFrac;
          const cAlpha = Math.sin(cPhase * Math.PI) * 0.95;

          renderer.addTrapezoid(
            cMidX - cW, cNextY,
            cMidX + cW, cNextY,
            cMidX + cW * 0.75, cY,
            cMidX - cW * 0.75, cY,
            '#fef08a',
            cAlpha
          );
        }

        // Ambient Golden Ground Halo
        const haloW1 = halfW1 * 1.55;
        const haloW2 = halfW2 * 1.55;
        renderer.addTrapezoid(
          padX1 - haloW1, y1,
          padX1 + haloW1, y1,
          padX2 + haloW2, y2,
          padX2 - haloW2, y2,
          '#facc15',
          0.18 + pulse * 0.14
        );
      }

      // 5. Pit Lane Zone & Pit Wall
      if (seg.isPitLaneZone) {
        const isDarkPit = Math.floor(seg.index / 2) % 2 === 0;
        let pitOffL = 1.12;
        let pitOffR = 1.78;

        if (seg.pitLaneType === 'entry') {
          const entryProg = Math.min(1, Math.max(0, (seg.index - (trackSegmentsLength - 100)) / 25));
          pitOffL = 1.05 + entryProg * 0.15;
          pitOffR = 1.20 + entryProg * 0.58;
        } else if (seg.pitLaneType === 'exit') {
          const exitProg = seg.index >= trackSegmentsLength - 15 ? 0 : Math.min(1, Math.max(0, seg.index / 38));
          pitOffL = 1.20 - exitProg * 0.20;
          pitOffR = 1.78 - exitProg * 0.65;
        }

        const pX1_L = x1 + w1 * pitOffL;
        const pX1_R = x1 + w1 * pitOffR;
        const pX2_L = x2 + w2 * pitOffL;
        const pX2_R = x2 + w2 * pitOffR;

        // Pit Lane Dark Asphalt Surface
        renderer.addTrapezoid(
          pX1_L, y1,
          pX1_R, y1,
          pX2_R, y2,
          pX2_L, y2,
          isDarkPit ? '#141a24' : '#1d2432'
        );

        // Outer Yellow Pit Boundary Line
        const bW1 = (pX1_R - pX1_L) * 0.05;
        const bW2 = (pX2_R - pX2_L) * 0.05;
        renderer.addTrapezoid(
          pX1_R - bW1, y1,
          pX1_R, y1,
          pX2_R, y2,
          pX2_R - bW2, y2,
          '#eab308'
        );

        // Concrete Pit Wall Barrier dividing Main Track and Pit Lane
        if (seg.pitLaneType === 'box' || seg.pitLaneType === 'lane') {
          const wallX1_L = x1 + w1 * 1.11;
          const wallX1_R = x1 + w1 * 1.19;
          const wallX2_L = x2 + w2 * 1.11;
          const wallX2_R = x2 + w2 * 1.19;
          const wallH1 = w1 * 0.11;
          const wallH2 = w2 * 0.11;

          // Wall base
          renderer.addTrapezoid(wallX1_L, y1, wallX1_R, y1, wallX2_R, y2, wallX2_L, y2, '#334155');
          // Wall top cap
          renderer.addTrapezoid(wallX1_L, y1 - wallH1, wallX1_R, y1 - wallH1, wallX2_R, y2 - wallH2, wallX2_L, y2 - wallH2, '#94a3b8');
        }

        // Yellow Box Markings for Team Pit Boxes
        if (seg.index >= trackSegmentsLength - 68 && seg.index <= trackSegmentsLength - 20) {
          const relPitSeg = trackSegmentsLength - seg.index;
          if (relPitSeg % 4 === 0 || relPitSeg % 4 === 1) {
            const boxW1 = (pX1_R - pX1_L) * 0.72;
            const boxW2 = (pX2_R - pX2_L) * 0.72;
            const boxC1 = (pX1_L + pX1_R) / 2;
            const boxC2 = (pX2_L + pX2_R) / 2;
            renderer.addTrapezoid(
              boxC1 - boxW1 / 2, y1,
              boxC1 + boxW1 / 2, y1,
              boxC2 + boxW2 / 2, y2,
              boxC2 - boxW2 / 2, y2,
              '#ca8a04'
            );
          }
        }
      }
    }

    // 5c. Continuous 3D Polygonal Grandstand (Left & Right)
    if (seg.hasGrandstand) {
      render3DGrandstandWebGL(renderer, x1, y1, w1, x2, y2, w2, seg.index, -1);
      render3DGrandstandWebGL(renderer, x1, y1, w1, x2, y2, w2, seg.index, 1);
    }
  }
}

function render3DGrandstandWebGL(
  renderer: WebGLRaceRenderer,
  rawX1: number,
  y1: number,
  w1: number,
  rawX2: number,
  y2: number,
  w2: number,
  segIndex: number,
  side: -1 | 1
) {
  if (w1 < 0.3) return;

  const x1 = Math.round(rawX1);
  const x2 = Math.round(rawX2);
  const effY1 = y1;

  const s = side;
  const isAlt = segIndex % 2 === 0;
  const isQuadAlt = Math.floor(segIndex / 2) % 2 === 0;

  const baseOffset = s < 0 ? 1.40 : 1.90;

  const barrierH1 = Math.max(2.2, w1 * 0.16);
  const barrierH2 = Math.max(2.2, w2 * 0.16);
  const wallTopH1 = Math.max(7.5, w1 * 1.05);
  const wallTopH2 = Math.max(7.5, w2 * 1.05);
  const roofFrontH1 = Math.max(10, w1 * 1.45);
  const roofFrontH2 = Math.max(10, w2 * 1.45);
  const roofBackH1 = Math.max(14, w1 * 1.85);
  const roofBackH2 = Math.max(14, w2 * 1.85);

  // 1. FRONT CRASH BARRIER / SAFETY WALL
  const bInX1 = Math.round(x1 + s * (w1 * baseOffset));
  const bInX2 = Math.round(x2 + s * (w2 * baseOffset));
  const bOutX1 = Math.round(x1 + s * (w1 * (baseOffset + 0.08)));
  const bOutX2 = Math.round(x2 + s * (w2 * (baseOffset + 0.08)));

  const barrierColor = isAlt ? '#334155' : '#1e293b';
  renderer.addTrapezoid(bInX1, effY1, bInX1, effY1 - barrierH1, bInX2, y2 - barrierH2, bInX2, y2, barrierColor);
  renderer.addTrapezoid(bInX1, effY1 - barrierH1, bOutX1, effY1 - barrierH1, bOutX2, y2 - barrierH2, bInX2, y2 - barrierH2, '#94a3b8');

  // Sponsor ribbon along barrier face
  const stripeH1 = barrierH1 * 0.35;
  const stripeH2 = barrierH2 * 0.35;
  const stripeCol = isQuadAlt ? '#dc2626' : '#ffffff';
  renderer.addTrapezoid(bInX1, effY1, bInX1, effY1 - stripeH1, bInX2, y2 - stripeH2, bInX2, y2, stripeCol);

  const sectionIdx = (Math.floor(segIndex / 6) + (s < 0 ? 0 : 3)) % CROWD_SECTION_COLORS.length;
  const [crowdPrimary, crowdSecondary] = CROWD_SECTION_COLORS[sectionIdx];

  // 2. SEATING TERRACES (3-TIER LOD SYSTEM)
  if (w1 < 24) {
    // DISTANT LOD (< 24): Solid spectator bank + back wall
    const topTier = GRANDSTAND_TIERS[GRANDSTAND_TIERS.length - 1];
    const tInX1 = Math.round(x1 + s * (w1 * (baseOffset + GRANDSTAND_TIERS[0].inOff)));
    const tInX2 = Math.round(x2 + s * (w2 * (baseOffset + GRANDSTAND_TIERS[0].inOff)));
    const tOutX1 = Math.round(x1 + s * (w1 * (baseOffset + topTier.outOff)));
    const tOutX2 = Math.round(x2 + s * (w2 * (baseOffset + topTier.outOff)));

    const blockColor = isAlt ? crowdPrimary : crowdSecondary;
    renderer.addTrapezoid(tInX1, effY1 - barrierH1, tOutX1, effY1 - wallTopH1, tOutX2, y2 - wallTopH2, tInX2, y2 - barrierH2, blockColor);

    const backX1 = Math.round(x1 + s * (w1 * (baseOffset + topTier.outOff + 0.05)));
    const backX2 = Math.round(x2 + s * (w2 * (baseOffset + topTier.outOff + 0.05)));
    renderer.addTrapezoid(tOutX1, effY1 - wallTopH1, backX1, effY1, backX2, y2, tOutX2, y2 - wallTopH2, isAlt ? '#090d16' : '#0f172a');
  } else if (w1 < 60) {
    // MID LOD (24 <= w1 < 60): 2 seating tiers
    const numMidTiers = 2;
    for (let t = 0; t < numMidTiers; t++) {
      const tier = GRANDSTAND_TIERS[t];
      const prevH1 = t === 0 ? barrierH1 * 0.5 : GRANDSTAND_TIERS[t - 1].capH * w1;
      const prevH2 = t === 0 ? barrierH2 * 0.5 : GRANDSTAND_TIERS[t - 1].capH * w2;

      const tInX1 = Math.round(x1 + s * (w1 * (baseOffset + tier.inOff)));
      const tInX2 = Math.round(x2 + s * (w2 * (baseOffset + tier.inOff)));
      const tOutX1 = Math.round(x1 + s * (w1 * (baseOffset + tier.outOff)));
      const tOutX2 = Math.round(x2 + s * (w2 * (baseOffset + tier.outOff)));

      const stepH1 = w1 * tier.h;
      const stepH2 = w2 * tier.h;
      const capH1 = w1 * tier.capH;
      const capH2 = w2 * tier.capH;

      const riserColor = isAlt ? '#1e293b' : '#0f172a';
      renderer.addTrapezoid(tInX1, effY1 - prevH1, tInX1, effY1 - stepH1, tInX2, y2 - stepH2, tInX2, y2 - prevH2, riserColor);

      const seatColor = isAlt ? crowdPrimary : crowdSecondary;
      renderer.addTrapezoid(tInX1, effY1 - stepH1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, tInX2, y2 - stepH2, seatColor);
    }

    const midTopTier = GRANDSTAND_TIERS[numMidTiers - 1];
    const backX1 = Math.round(x1 + s * (w1 * (baseOffset + midTopTier.outOff)));
    const backX2 = Math.round(x2 + s * (w2 * (baseOffset + midTopTier.outOff)));
    renderer.addTrapezoid(backX1, effY1, backX1, effY1 - wallTopH1, backX2, y2 - wallTopH2, backX2, y2, isAlt ? '#090d16' : '#0f172a');
  } else {
    // CLOSE-UP FULL DETAIL (w1 >= 60): 5 distinct tiers + VIP glass hospitality
    for (let t = 0; t < GRANDSTAND_TIERS.length; t++) {
      const tier = GRANDSTAND_TIERS[t];
      const prevH1 = t === 0 ? barrierH1 * 0.5 : GRANDSTAND_TIERS[t - 1].capH * w1;
      const prevH2 = t === 0 ? barrierH2 * 0.5 : GRANDSTAND_TIERS[t - 1].capH * w2;

      const tInX1 = Math.round(x1 + s * (w1 * (baseOffset + tier.inOff)));
      const tInX2 = Math.round(x2 + s * (w2 * (baseOffset + tier.inOff)));
      const tOutX1 = Math.round(x1 + s * (w1 * (baseOffset + tier.outOff)));
      const tOutX2 = Math.round(x2 + s * (w2 * (baseOffset + tier.outOff)));

      const stepH1 = w1 * tier.h;
      const stepH2 = w2 * tier.h;
      const capH1 = w1 * tier.capH;
      const capH2 = w2 * tier.capH;

      const riserColor = isAlt ? '#1e293b' : '#0f172a';
      renderer.addTrapezoid(tInX1, effY1 - prevH1, tInX1, effY1 - stepH1, tInX2, y2 - stepH2, tInX2, y2 - prevH2, riserColor);

      if (t === 2) {
        // TIER 2: VIP Panoramic Hospitality Suite (Glass)
        const glassColor = isAlt ? '#0369a1' : '#0284c7';
        renderer.addTrapezoid(tInX1, effY1 - stepH1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, tInX2, y2 - stepH2, glassColor);

        const loungeX1 = Math.round(tInX1 + (tOutX1 - tInX1) * 0.45);
        const loungeX2 = Math.round(tInX2 + (tOutX2 - tInX2) * 0.45);
        const loungeY1 = (effY1 - stepH1) + ((effY1 - capH1) - (effY1 - stepH1)) * 0.45;
        const loungeY2 = (y2 - stepH2) + ((y2 - capH2) - (y2 - stepH2)) * 0.45;
        renderer.addTrapezoid(loungeX1, loungeY1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, loungeX2, loungeY2, 'rgba(254, 240, 138, 0.65)');
      } else {
        const seatColor = isAlt ? crowdPrimary : crowdSecondary;
        renderer.addTrapezoid(tInX1, effY1 - stepH1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, tInX2, y2 - stepH2, seatColor);
      }
    }

    // Back wall
    const topTier = GRANDSTAND_TIERS[GRANDSTAND_TIERS.length - 1];
    const backX1 = Math.round(x1 + s * (w1 * (baseOffset + topTier.outOff)));
    const backX2 = Math.round(x2 + s * (w2 * (baseOffset + topTier.outOff)));
    renderer.addTrapezoid(backX1, effY1, backX1, effY1 - wallTopH1, backX2, y2 - wallTopH2, backX2, y2, isAlt ? '#090d16' : '#0f172a');
  }

  // 4. CANTILEVER CANOPY ROOF
  const topTier = GRANDSTAND_TIERS[GRANDSTAND_TIERS.length - 1];
  const roofFrontOff = baseOffset + 0.05;
  const roofBackOff = baseOffset + topTier.outOff + 0.18;

  const rfX1 = Math.round(x1 + s * (w1 * roofFrontOff));
  const rfX2 = Math.round(x2 + s * (w2 * roofFrontOff));
  const rbX1 = Math.round(x1 + s * (w1 * roofBackOff));
  const rbX2 = Math.round(x2 + s * (w2 * roofBackOff));

  // Underside Shadow
  renderer.addTrapezoid(rfX1, effY1 - roofFrontH1, rbX1, effY1 - roofBackH1, rbX2, y2 - roofBackH2, rfX2, y2 - roofFrontH2, '#050811');

  // Aerodynamic Top Metallic Canopy
  const roofThick1 = Math.max(1.8, w1 * 0.045);
  const roofThick2 = Math.max(1.8, w2 * 0.045);
  const roofTopColor = isAlt ? '#f1f5f9' : '#cbd5e1';
  renderer.addTrapezoid(
    rfX1, effY1 - (roofFrontH1 + roofThick1),
    rbX1, effY1 - (roofBackH1 + roofThick1),
    rbX2, y2 - (roofBackH2 + roofThick2),
    rfX2, y2 - (roofFrontH2 + roofThick2),
    roofTopColor
  );

  // Front Fascia
  renderer.addTrapezoid(
    rfX1, effY1 - (roofFrontH1 + roofThick1),
    rfX1, effY1 - roofFrontH1,
    rfX2, y2 - roofFrontH2,
    rfX2, y2 - (roofFrontH2 + roofThick2),
    '#94a3b8'
  );
}
