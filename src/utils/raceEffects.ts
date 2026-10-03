/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarStats, CarStatKey } from '../types/game';
import { CIRCUIT_STRATEGIC_DEMANDS, CircuitDemandInfo } from '../data/circuitDemands';
import { DriverPersonalityKey } from '../data/rivalPersonalities';

/**
 * Calculates weighted car overall score
 */
export function calculateCarOverall(car: CarStats): number {
  return Math.round((car.engine + car.aero + car.chassis + car.suspension + car.brakes) / 5);
}

/**
 * Circuit Strategic Fit calculation
 * Weights: primaryFocus = 2.0, secondaryFocus = 1.5, others = 1.0
 */
export function calculateCircuitFit(
  car: CarStats,
  round: number = 1
): {
  circuitFit: number;
  benchmark: number;
  circuitFitDelta: number;
  circuitFitPct: number;
  demandInfo: CircuitDemandInfo;
} {
  const demandInfo = CIRCUIT_STRATEGIC_DEMANDS[round] || CIRCUIT_STRATEGIC_DEMANDS[1];
  const primary = demandInfo.primaryFocus || [];
  const secondary = demandInfo.secondaryFocus || [];

  const allKeys: CarStatKey[] = ['engine', 'aero', 'chassis', 'suspension', 'brakes'];
  let totalScore = 0;
  let totalWeight = 0;

  for (const k of allKeys) {
    let weight = 1.0;
    if (primary.includes(k)) {
      weight = 2.0;
    } else if (secondary.includes(k)) {
      weight = 1.5;
    }
    totalScore += car[k] * weight;
    totalWeight += weight;
  }

  const circuitFit = totalWeight > 0 ? Number((totalScore / totalWeight).toFixed(1)) : 70;
  const benchmark = demandInfo.rivalBenchmarkOvr || 70;
  const circuitFitDelta = Number((circuitFit - benchmark).toFixed(1));
  const circuitFitPct = Math.round((circuitFit / Math.max(1, benchmark)) * 100);

  return {
    circuitFit,
    benchmark,
    circuitFitDelta,
    circuitFitPct,
    demandInfo,
  };
}

/**
 * Real in-engine physics and performance parameters derived from team stats & circuit demands
 */
export interface RaceCarPhysics {
  maxSpeed: number; // km/h (capped at 304)
  baseMaxSpeed: number;
  accelRate: number;
  brakeRate: number;
  handlingRate: number;
  drsSpeedBonus: number;
  boostPadDuration: number;
  slipstreamBoost: number;
  collisionResistance: number;
  pitWarningDistance: number;
  circuitFitSpeedDelta: number;
  circuitFitDelta: number;
}

export function calculateRaceCarPhysics(
  car: CarStats,
  driverOverall: number = 70,
  driverPace: number = 70,
  driverRaceCraft: number = 70,
  strategistDecisions: number = 70,
  strategistStrategy: number = 70,
  round: number = 1
): RaceCarPhysics {
  const { circuitFitDelta } = calculateCircuitFit(car, round);

  // Speed delta bounded: negative up to -8, bonus capped at +3 km/h
  const circuitFitSpeedDelta = Math.max(-8, Math.min(3, Math.round(circuitFitDelta * 0.8)));
  const circuitFitAccelDelta = Math.max(-30, Math.min(30, Math.round(circuitFitDelta * 3.5)));

  // Base top speed formula: 70->99 engine+aero gives approx +10.4 km/h (engine ~7.0 km/h, aero ~3.5 km/h)
  const baseMaxSpeed = Math.round(
    292 +
      (car.engine - 70) * 0.24 +
      (car.aero - 70) * 0.12 +
      (driverPace - 70) * 0.04
  );

  // Max speed capped at 304 km/h
  const maxSpeed = Math.min(304, Math.max(280, baseMaxSpeed + circuitFitSpeedDelta));

  // Acceleration rate based on engine and driver overall
  const accelRate = 420 + (car.engine - 70) * 6.5 + (driverOverall - 70) * 3.2 + circuitFitAccelDelta;

  // Brake rate based on brakes stat
  const brakeRate = 580 + (car.brakes - 70) * 8.5;

  // Handling rate based on chassis and suspension
  const handlingRate = Number(
    (3.6 + (car.chassis - 70) * 0.065 + (car.suspension - 70) * 0.035).toFixed(3)
  );

  // DRS speed bonus: engine power + aero efficiency
  const drsSpeedBonus = Math.round(48 + (car.engine - 70) * 0.10 + (car.aero - 70) * 0.18);

  // Boost pad duration influenced by strategist strategy
  const boostPadDuration = Number((2.4 + (strategistStrategy - 70) * 0.045).toFixed(2));

  // Slipstream boost: base +26 km/h, up to +20% with driver racecraft
  const slipstreamBoost = Number(
    (26 * (1 + ((driverRaceCraft - 70) / 29) * 0.20)).toFixed(1)
  );

  // Resistance to speed loss when colliding with AI cars (higher raceCraft = less speed lost)
  const collisionResistance = Number(
    Math.min(0.40, ((driverRaceCraft - 70) / 29) * 0.40).toFixed(2)
  );

  // Pit warning distance: strategist decisions alerts earlier (500m to 650m)
  const pitWarningDistance = Math.round(500 + (strategistDecisions - 70) * 5.0);

  return {
    maxSpeed,
    baseMaxSpeed,
    accelRate,
    brakeRate,
    handlingRate,
    drsSpeedBonus,
    boostPadDuration,
    slipstreamBoost,
    collisionResistance,
    pitWarningDistance,
    circuitFitSpeedDelta,
    circuitFitDelta,
  };
}

/**
 * Concrete description in Thai of what +1 upgrade point gives in real race performance
 */
export function getCarStatUpgradeImpact(statKey: CarStatKey): {
  shortEffectTh: string;
  perLevelTh: string;
  detailTh: string;
} {
  switch (statKey) {
    case 'engine':
      return {
        shortEffectTh: '+0.24 กม./ชม. ความเร็วสูงสุด',
        perLevelTh: '+0.24 กม./ชม. • อัตราเร่ง +6.5',
        detailTh: 'เพิ่มความเร็วปลายทางตรงและอัตราเร่งออกจากโค้ง',
      };
    case 'aero':
      return {
        shortEffectTh: '+0.12 กม./ชม. & โบนัส DRS +0.18',
        perLevelTh: '+0.12 กม./ชม. • โบนัส DRS/Nitro +0.18',
        detailTh: 'เพิ่มแรงกดและประสิทธิภาพเมื่อเปิดใช้ DRS/Nitro',
      };
    case 'brakes':
      return {
        shortEffectTh: 'เบรกดีขึ้น +8.5 พลังเบรก',
        perLevelTh: '+8.5 พลังหยุด • ลดความเร็วที่เสียก่อนเข้าโค้ง',
        detailTh: 'เบรกลึกแซงคู่แข่งในโค้งหักศอก และคุมจังหวะเบรกแม่นยำ',
      };
    case 'suspension':
      return {
        shortEffectTh: 'รูดเคิร์บไม่เสียความเร็ว & ลดลื่น',
        perLevelTh: 'ทรงตัวนิ่งขึ้น • ลดการลื่นไถลตอนฝนตก',
        detailTh: 'ลดความเร็วที่สูญเสียเมื่อขึ้นขอบทางหรือลงหญ้า และเพิ่มการเกาะถนนบนแทร็กเปียก',
      };
    case 'chassis':
      return {
        shortEffectTh: 'การเลี้ยวฉับไวขึ้น +0.065',
        perLevelTh: '+0.065 ความคล่องตัว • โครงสร้างทนทาน',
        detailTh: 'โยกเปลี่ยนเลนหลบสิ่งกีดขวางได้คมกริบและควบคุมรถนิ่งในโค้ง',
      };
  }
}

/**
 * Evaluates which car stat caused the most time loss in the race
 */
export function diagnoseWeakestStat(
  car: CarStats,
  round: number = 1
): {
  statKey: CarStatKey;
  statNameTh: string;
  adviceTh: string;
} {
  const demandInfo = CIRCUIT_STRATEGIC_DEMANDS[round] || CIRCUIT_STRATEGIC_DEMANDS[1];
  const primary = demandInfo.primaryFocus || [];
  const secondary = demandInfo.secondaryFocus || [];

  // Prioritize primary deficit first, then secondary, then lowest overall
  let maxDeficit = -999;
  let worstKey: CarStatKey = 'engine';

  const allKeys: CarStatKey[] = ['engine', 'aero', 'brakes', 'suspension', 'chassis'];
  for (const k of allKeys) {
    const val = car[k];
    const target = primary.includes(k)
      ? demandInfo.rivalBenchmarkOvr + 4
      : secondary.includes(k)
      ? demandInfo.rivalBenchmarkOvr + 1
      : demandInfo.rivalBenchmarkOvr - 2;

    const deficit = target - val;
    if (deficit > maxDeficit) {
      maxDeficit = deficit;
      worstKey = k;
    }
  }

  const statNames: Record<CarStatKey, string> = {
    engine: 'เครื่องยนต์ (Engine)',
    aero: 'แอร์โรไดนามิกส์ (Aero)',
    brakes: 'ระบบเบรก (Brakes)',
    suspension: 'ระบบช่วงล่าง (Suspension)',
    chassis: 'แชสซี (Chassis)',
  };

  const adviceMap: Record<CarStatKey, string> = {
    engine: '📉 ความเร็วปลายและอัตราเร่งไม่พอ เสียเวลาบนทางตรงยาวเมื่อเทียบกับคู่แข่ง แนะนำอัพเกรด Engine',
    aero: '📉 แรงกดอากาศพลศาสตร์ไม่พอ เสียความเร็วในโค้งไฮสปีด แนะนำอัพเกรด Aero เพื่อสร้างแรงกด',
    brakes: '📉 ระบบเบรกขาดประสิทธิภาพ เสียเวลาในจุดเบรกหนักของสนามนี้มากที่สุด แนะนำอัพเกรด Brakes ก่อนแข่งรอบถัดไป',
    suspension: '📉 การซับแรงกระแทกต่ำ เสียความเร็วจากการรูดเคิร์บและการทรงตัว แนะนำอัพเกรด Suspension',
    chassis: '📉 ความคล่องตัวน้อย โยกเปลี่ยนไลน์แซงและเข้าโค้งยังหน่วง แนะนำอัพเกรด Chassis',
  };

  return {
    statKey: worstKey,
    statNameTh: statNames[worstKey],
    adviceTh: adviceMap[worstKey],
  };
}

/**
 * Stage Bonus Objective definitions
 */
export type StageObjectiveType = 'overtake_3' | 'clean_race' | 'pit_within_time' | 'top_5_finish';

export interface StageObjective {
  type: StageObjectiveType;
  titleTh: string;
  descTh: string;
  icon: string;
  rewardMoney: number;
}

export const ALL_STAGE_OBJECTIVES: StageObjective[] = [
  {
    type: 'overtake_3',
    titleTh: 'แซงให้ได้ 3 คัน',
    descTh: 'แซงคู่แข่งขึ้นหน้าอย่างน้อย 3 คันระหว่างการแข่งขัน',
    icon: '⚡',
    rewardMoney: 600_000,
  },
  {
    type: 'clean_race',
    titleTh: 'ไม่ชนเลย (Clean Race)',
    descTh: 'แข่งจบโดยไม่ชนสิ่งกีดขวางหรือหลุดแทร็กแม้แต่ครั้งเดียว',
    icon: '🛡️',
    rewardMoney: 800_000,
  },
  {
    type: 'pit_within_time',
    titleTh: 'เข้าพิทตามเป้าหมาย',
    descTh: 'เข้าพิทและทำเวลา Pit Stop ได้รวดเร็วไม่เกิน 2.8 วินาที',
    icon: '🔧',
    rewardMoney: 500_000,
  },
  {
    type: 'top_5_finish',
    titleTh: 'จบอันดับ 5 อันดับแรก',
    descTh: 'ขับเข้าเส้นชัยในอันดับ 1 ถึง 5 (P1 - P5)',
    icon: '🏆',
    rewardMoney: 750_000,
  },
];

/**
 * Selects 2 deterministic yet round-specific bonus objectives
 */
export function getStageObjectivesForRound(round: number): StageObjective[] {
  const seed = (round * 7 + 3) % ALL_STAGE_OBJECTIVES.length;
  const obj1 = ALL_STAGE_OBJECTIVES[seed];
  const obj2 = ALL_STAGE_OBJECTIVES[(seed + 2) % ALL_STAGE_OBJECTIVES.length];
  return [obj1, obj2];
}

/**
 * Driver personality speed adjustment.
 * Grants +5 km/h during sections matching personality strength, -3 km/h outside strength.
 */
export function getPersonalitySpeedDelta(
  personalityKey: DriverPersonalityKey,
  segCurve: number,
  distFromPlayerM: number,
  isSideBySide: boolean,
  upcomingPadDistSegs: number = 999
): number {
  const absCurve = Math.abs(segCurve);
  let isStrengthActive = false;

  switch (personalityKey) {
    case 'straight_line_rocket':
      // Strong on straights (|segCurve| < 0.3)
      isStrengthActive = absCurve < 0.3;
      break;
    case 'corner_virtuoso':
      // High-speed sweepers and heavy curves (|segCurve| > 1.0)
      isStrengthActive = absCurve > 1.0;
      break;
    case 'apex_predator':
      // Sharp corners and dive-bombs
      isStrengthActive = absCurve >= 1.4;
      break;
    case 'slingshot_hunter':
      // Drafting behind player
      isStrengthActive = distFromPlayerM > 0 && distFromPlayerM <= 55;
      break;
    case 'iron_wall':
      // Defending lead ahead of player
      isStrengthActive = distFromPlayerM < 0 && Math.abs(distFromPlayerM) <= 60;
      break;
    case 'tenacious_fighter':
      // Side-by-side or close dogfight
      isStrengthActive = isSideBySide || Math.abs(distFromPlayerM) <= 20;
      break;
    case 'legendary_precision':
      // Technical medium chicanes
      isStrengthActive = absCurve >= 0.7 && absCurve <= 1.7;
      break;
    case 'underdog_raider':
      // Pad hunting zone
      isStrengthActive = upcomingPadDistSegs <= 24;
      break;
    case 'smooth_operator':
      // Mid-speed flow sections
      isStrengthActive = absCurve >= 0.4 && absCurve <= 1.4;
      break;
    case 'ice_cold':
      // High-pressure pack battle
      isStrengthActive = Math.abs(distFromPlayerM) <= 40;
      break;
    case 'veteran_battler':
      // Measured pace in turns
      isStrengthActive = absCurve >= 1.0;
      break;
    default:
      isStrengthActive = false;
      break;
  }

  return isStrengthActive ? 5.0 : -3.0;
}

/**
 * Pack Racing speed adjustment for the closest 3 AI rivals within +-150m of player.
 * Regulates rubber band so it pulls target speed towards player by at most +-6 km/h.
 * Damped when circuitFitDelta is high (upgraded player car can pull away).
 */
export function calculatePackRacingAdjustment(
  playerSpeed: number,
  aiTargetSpeed: number,
  distToPlayerM: number,
  isTop3Closest: boolean,
  circuitFitDelta: number
): number {
  if (!isTop3Closest || Math.abs(distToPlayerM) > 150) {
    return 0;
  }
  // Dampen rubber band if player's car exceeds benchmark (higher R&D preparedness)
  const damping = Math.max(0.25, 1.0 - Math.max(0, circuitFitDelta) * 0.08);
  const speedDiff = playerSpeed - aiTargetSpeed;
  const maxAdjustment = 6.0 * damping;
  return Math.max(-maxAdjustment, Math.min(maxAdjustment, speedDiff * 0.35));
}

export interface RaceObjectiveStats {
  overtakesCount: number;
  collisionsCount: number;
  offroadEventsCount: number;
  pitStopSec?: number;
  finalPosition: number;
}

/**
 * Validates whether an individual stage objective was fulfilled
 */
export function evaluateStageObjective(
  objective: StageObjective,
  stats: RaceObjectiveStats
): boolean {
  switch (objective.type) {
    case 'overtake_3':
      return stats.overtakesCount >= 3;
    case 'clean_race':
      return stats.collisionsCount === 0 && stats.offroadEventsCount === 0;
    case 'pit_within_time':
      return stats.pitStopSec !== undefined && stats.pitStopSec > 0 && stats.pitStopSec <= 2.85;
    case 'top_5_finish':
      return stats.finalPosition <= 5;
    default:
      return false;
  }
}

