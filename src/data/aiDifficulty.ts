/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const AI_DIFFICULTY = {
  aiTopSpeedBase: 300,
  aiTopSpeedPerRound: 0.45, // Round 18 reaches approx ~308 km/h
  blockStrength: 0.7, // 0 to 1 scale
  blockReactionSec: 0.35, // Delay before AI maneuvers to block player line
  nitroRechargePlayer: 5.25, // Player base recharge rate (%/s) - reduced 25% (was 7)
  nitroRechargePlayerSlipstream: 10.5, // Player drafting recharge rate (%/s) - reduced 25% (was 14)
  aiNitroRecharge: 14, // AI nitro recharge rate (%/s) - unchanged
  rubberBandStartM: 250, // Gap ahead before gentle speed trim (-6 km/h max) to keep AI visible

  // AI Rubber-Band Cheat System (ข้อ 1)
  cheatLevel: 1, // 0 = disabled, 1 = normal, 2 = extreme (multiplier: 0 / 1.0 / 1.5)
  chaserBonusMin: 4, // km/h above player speed
  chaserBonusMax: 14, // km/h above player speed
  leaderBonusMin: 6, // km/h added to leading AI within leaderRangeM
  leaderBonusMax: 16, // km/h added to leading AI within leaderRangeM
  leaderRangeM: 250, // Distance ahead of player for leader sprint bonus
  slipstreamCheatMax: 10, // Additional slipstream boost km/h at heat = 1
  cornerGripCheatMax: 0.5, // Reduces corner speed loss by up to 50%
  freeNitroRangeM: 150, // Range within player where AI nitro doesn't fall below 40%
  collisionAiScrub: 0.95, // AI speed retention on collision at heat = 1
  collisionPlayerScrubExtra: 0.90, // Additional player speed multiplier on collision at heat = 1
  lastLapSprintBonus: 10, // Final lap sprint km/h added to top 2 closest AI
  cheatSpeedHardCap: 345, // Absolute speed hard cap for cheat boosts
};
