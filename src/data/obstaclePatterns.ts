import type { TrackObstacleDef, TrackSectionDef, TrackBoosterPadDef, WorldTourCircuitDef } from './worldTourCircuits';

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 * Seeded with round number, pattern kind, and level to guarantee 100% reproducible results.
 */
function createSeededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type PatternKind = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type PatternLevel = 1 | 2 | 3;

interface SectionInfo {
  index: number;
  startSeg: number;
  endSeg: number;
  numSegments: number;
  curve: number;
}

/**
 * Builds deterministic, tactical obstacle layouts for World Tour circuits.
 *
 * Pattern Kinds:
 * - A (Slalom): Continuous alternating left/right traffic cones spaced 6-8 segments on straights.
 * - B (Narrow Gate): Paired road barriers with a passable corridor (left/center/right alternating).
 * - C (Oil Slick Field): Triple oil slicks spanning 3 lanes, leaving exactly 1 clean passable lane.
 * - D (Tempting Boost Trap): Tire stacks placed 3-6 segments downstream of strategic booster pads.
 * - E (End-of-Straight Trap): Road barriers and cones placed at the braking zones of high-speed straights.
 * - F (Half-Road Closure): Alternating fallen trees covering half the track width with safe margins.
 */
export function buildPattern(
  kind: PatternKind,
  level: PatternLevel,
  circuit: Pick<WorldTourCircuitDef, 'round' | 'sections' | 'boosterPads'>
): TrackObstacleDef[] {
  if (!circuit || !circuit.sections || circuit.sections.length === 0) {
    return [];
  }

  // 1. Calculate section spans and total circuit segments
  let cumulativeSegs = 0;
  const sectionInfos: SectionInfo[] = circuit.sections.map((sec, idx) => {
    const start = cumulativeSegs;
    cumulativeSegs += sec.numSegments;
    return {
      index: idx,
      startSeg: start,
      endSeg: cumulativeSegs,
      numSegments: sec.numSegments,
      curve: sec.curve,
    };
  });
  const totalSegments = cumulativeSegs;

  // 2. Safe zone: Exclude first 150 segments (start grid) and final 100 segments (pit lane zone)
  const safeStart = 150;
  const safeEnd = Math.max(safeStart + 80, totalSegments - 100);

  // Helper to check booster pad proximity (must not be within 2 segments for non-D patterns)
  const isNearBoosterPad = (seg: number): boolean => {
    if (!circuit.boosterPads) return false;
    return circuit.boosterPads.some((pad) => Math.abs(seg - pad.segIndex) <= 2);
  };

  // Seeded deterministic RNG: reproducible across every race session
  const seed = circuit.round * 10007 + kind.charCodeAt(0) * 101 + level * 17;
  const rng = createSeededRng(seed);

  // Target item counts per pattern level
  const targetCounts: Record<PatternLevel, number> = {
    1: 6,
    2: 12,
    3: 20,
  };
  const targetCount = targetCounts[level];

  const obstacles: TrackObstacleDef[] = [];
  const usedSegments = new Set<number>();

  switch (kind) {
    // -------------------------------------------------------------------------
    // Pattern A: Slalom (traffic_cone)
    // Cones alternating left and right, spaced 6-8 segments on straights.
    // -------------------------------------------------------------------------
    case 'A': {
      // Find straight sections in safe zone (curve == 0, or gentle sweeps if straights are scarce)
      const straightSections = sectionInfos.filter(
        (sec) => sec.curve === 0 && sec.endSeg > safeStart && sec.startSeg < safeEnd
      );
      const candidateSections = straightSections.length > 0
        ? straightSections
        : sectionInfos.filter((sec) => Math.abs(sec.curve) <= 1.5 && sec.endSeg > safeStart && sec.startSeg < safeEnd);

      if (candidateSections.length === 0) break;

      const spacing = 7;
      let leftSide = rng() > 0.5;
      let secIdx = 0;
      let curSeg = Math.max(safeStart + 5, candidateSections[0].startSeg + 6);

      while (obstacles.length < targetCount && secIdx < candidateSections.length) {
        const sec = candidateSections[secIdx];
        if (curSeg + spacing < Math.min(safeEnd - 4, sec.endSeg - 4)) {
          curSeg += spacing;
          if (!isNearBoosterPad(curSeg) && !usedSegments.has(curSeg)) {
            usedSegments.add(curSeg);
            const offset = leftSide ? -0.38 : 0.38;
            obstacles.push({
              segIndex: curSeg,
              type: 'traffic_cone',
              offset,
            });
            leftSide = !leftSide;
          }
        } else {
          secIdx++;
          if (secIdx < candidateSections.length) {
            curSeg = Math.max(safeStart + 5, candidateSections[secIdx].startSeg + 6);
          }
        }
      }
      break;
    }

    // -------------------------------------------------------------------------
    // Pattern B: Narrow Gate (road_barrier)
    // Pairs of road barriers on the same segment leaving an open passable channel.
    // Alternates between Left, Center, and Right open channels.
    // -------------------------------------------------------------------------
    case 'B': {
      const numGates = Math.max(1, Math.round(targetCount / 2));
      const step = Math.floor((safeEnd - safeStart - 40) / (numGates + 1));
      let channelPhase = Math.floor(rng() * 3);

      for (let g = 0; g < numGates; g++) {
        let baseSeg = safeStart + 20 + g * step + Math.floor(rng() * 10);
        baseSeg = Math.min(safeEnd - 10, Math.max(safeStart + 5, baseSeg));

        // Shift away from booster pads if needed
        while (isNearBoosterPad(baseSeg) && baseSeg < safeEnd - 5) {
          baseSeg += 3;
        }

        if (usedSegments.has(baseSeg) || baseSeg >= safeEnd) continue;
        usedSegments.add(baseSeg);

        // 3 Distinct Passable Gate Modes (with minimum 0.64 corridor width for car width 0.25)
        if (channelPhase % 3 === 0) {
          // Center open channel (safe from -0.37 to +0.37)
          obstacles.push({ segIndex: baseSeg, type: 'road_barrier', offset: -0.55 });
          obstacles.push({ segIndex: baseSeg, type: 'road_barrier', offset: 0.55 });
        } else if (channelPhase % 3 === 1) {
          // Left open channel (safe from -0.85 to -0.28)
          obstacles.push({ segIndex: baseSeg, type: 'road_barrier', offset: -0.10 });
          obstacles.push({ segIndex: baseSeg, type: 'road_barrier', offset: 0.65 });
        } else {
          // Right open channel (safe from +0.28 to +0.85)
          obstacles.push({ segIndex: baseSeg, type: 'road_barrier', offset: -0.65 });
          obstacles.push({ segIndex: baseSeg, type: 'road_barrier', offset: 0.10 });
        }
        channelPhase++;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // Pattern C: Oil Slick Field (oil_slick)
    // 3 oil slicks in a single row across 4 lanes, leaving 1 clean passable lane.
    // -------------------------------------------------------------------------
    case 'C': {
      const numRows = Math.max(1, Math.round(targetCount / 3));
      const step = Math.floor((safeEnd - safeStart - 30) / (numRows + 1));
      const laneOffsets = [-0.54, -0.18, 0.18, 0.54];
      let openLaneCycle = Math.floor(rng() * 4);

      for (let r = 0; r < numRows; r++) {
        let baseSeg = safeStart + 25 + r * step + Math.floor(rng() * 8);
        baseSeg = Math.min(safeEnd - 8, Math.max(safeStart + 5, baseSeg));

        while (isNearBoosterPad(baseSeg) && baseSeg < safeEnd - 5) {
          baseSeg += 3;
        }

        if (usedSegments.has(baseSeg) || baseSeg >= safeEnd) continue;
        usedSegments.add(baseSeg);

        const openLaneIdx = openLaneCycle % 4;
        openLaneCycle++;

        for (let l = 0; l < 4; l++) {
          if (l === openLaneIdx) continue; // Leave this lane 100% clean and passable
          obstacles.push({
            segIndex: baseSeg,
            type: 'oil_slick',
            offset: laneOffsets[l],
          });
        }
      }
      break;
    }

    // -------------------------------------------------------------------------
    // Pattern D: Tempting Boost Trap (tire_stack)
    // Tire stacks placed 3-6 segments downstream of booster pads at pad offset.
    // -------------------------------------------------------------------------
    case 'D': {
      const pads = circuit.boosterPads && circuit.boosterPads.length > 0
        ? circuit.boosterPads
        : [{ segIndex: Math.floor(totalSegments * 0.35), offset: 0.0 }];

      // Stacks per pad based on level
      const stacksPerPad = level === 1 ? 1.5 : level === 2 ? 3 : 5;
      const stepDelays = [4, 8, 12, 16, 20];

      let placed = 0;
      for (let pIdx = 0; pIdx < pads.length && placed < targetCount; pIdx++) {
        const pad = pads[pIdx];
        const countForThisPad = Math.ceil(stacksPerPad);

        for (let sIdx = 0; sIdx < countForThisPad && placed < targetCount; sIdx++) {
          const trapSeg = pad.segIndex + stepDelays[sIdx % stepDelays.length];
          if (trapSeg < totalSegments && trapSeg > 10 && !usedSegments.has(trapSeg)) {
            usedSegments.add(trapSeg);
            obstacles.push({
              segIndex: trapSeg,
              type: 'tire_stack',
              offset: pad.offset,
            });
            placed++;
          }
        }
      }
      break;
    }

    // -------------------------------------------------------------------------
    // Pattern E: End-of-Straight Trap (road_barrier & traffic_cone)
    // Traps placed at the braking zones of long straights preceding sharp turns.
    // -------------------------------------------------------------------------
    case 'E': {
      // Find long straights (numSegments >= 80, curve === 0) followed by sharp turns (|curve| >= 2.5)
      let eligibleStraights = sectionInfos.filter((sec, idx) => {
        if (sec.curve !== 0 || sec.numSegments < 70) return false;
        const nextSec = sectionInfos[(idx + 1) % sectionInfos.length];
        return Math.abs(nextSec.curve) >= 2.2;
      });

      // Fallback: Use longest straights followed by any non-zero turn
      if (eligibleStraights.length === 0) {
        eligibleStraights = sectionInfos
          .filter((sec, idx) => {
            const nextSec = sectionInfos[(idx + 1) % sectionInfos.length];
            return Math.abs(sec.curve) <= 0.8 && Math.abs(nextSec.curve) >= 1.5;
          })
          .sort((a, b) => b.numSegments - a.numSegments);
      }

      if (eligibleStraights.length === 0) {
        eligibleStraights = sectionInfos.filter((sec) => sec.numSegments >= 50);
      }

      const clustersCount = Math.max(1, Math.round(targetCount / 3));
      let currentStraightIdx = 0;

      while (obstacles.length < targetCount && currentStraightIdx < eligibleStraights.length * 2) {
        const sec = eligibleStraights[currentStraightIdx % eligibleStraights.length];
        const turnSec = sectionInfos[(sec.index + 1) % sectionInfos.length];
        const turnsRight = turnSec.curve > 0;

        // End of straight braking zone (12 to 20 segments before corner entry)
        const trapSeg1 = Math.min(safeEnd - 4, sec.endSeg - 16);
        const trapSeg2 = Math.min(safeEnd - 2, sec.endSeg - 9);

        // Outside barrier and inside cone configuration leaving corner racing line open
        if (trapSeg1 >= safeStart && !usedSegments.has(trapSeg1) && !isNearBoosterPad(trapSeg1)) {
          usedSegments.add(trapSeg1);
          // Road barrier on the side drivers want to enter from, cone in middle
          obstacles.push({
            segIndex: trapSeg1,
            type: 'road_barrier',
            offset: turnsRight ? -0.45 : 0.45,
          });
          obstacles.push({
            segIndex: trapSeg1,
            type: 'traffic_cone',
            offset: 0.05,
          });
        }

        if (obstacles.length < targetCount && trapSeg2 >= safeStart && !usedSegments.has(trapSeg2) && !isNearBoosterPad(trapSeg2)) {
          usedSegments.add(trapSeg2);
          obstacles.push({
            segIndex: trapSeg2,
            type: 'traffic_cone',
            offset: turnsRight ? -0.25 : 0.25,
          });
        }

        currentStraightIdx++;
      }
      break;
    }

    // -------------------------------------------------------------------------
    // Pattern F: Half-Road Closure (fallen_tree)
    // Fallen trees alternating between left and right side with clear passing width.
    // -------------------------------------------------------------------------
    case 'F': {
      const step = Math.floor((safeEnd - safeStart - 30) / (targetCount + 1));
      let leftSide = rng() > 0.5;

      for (let i = 0; i < targetCount; i++) {
        let baseSeg = safeStart + 15 + i * step + Math.floor(rng() * 8);
        baseSeg = Math.min(safeEnd - 6, Math.max(safeStart + 5, baseSeg));

        while (isNearBoosterPad(baseSeg) && baseSeg < safeEnd - 4) {
          baseSeg += 3;
        }

        if (usedSegments.has(baseSeg) || baseSeg >= safeEnd) continue;
        usedSegments.add(baseSeg);

        // Fallen tree hit width 0.42:
        // offset -0.38 covers [-0.80, +0.04], right lane [+0.15, +0.85] is 100% open
        // offset +0.38 covers [-0.04, +0.80], left lane [-0.85, -0.15] is 100% open
        const offset = leftSide ? -0.38 : 0.38;
        obstacles.push({
          segIndex: baseSeg,
          type: 'fallen_tree',
          offset,
        });
        leftSide = !leftSide;
      }
      break;
    }
  }

  // Sort obstacles by segIndex for clean rendering order
  return obstacles.sort((a, b) => a.segIndex - b.segIndex);
}
