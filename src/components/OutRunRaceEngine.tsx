import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Trophy,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Flag,
  Zap,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Music,
  Settings,
  X,
} from 'lucide-react';
import { TeamState, GrandPrix } from '../types/game';
import { sound, MusicTrackMetadata } from '../utils/audio';
import { formatMoney, calculatePitStopDuration } from '../utils/calculations';
import { renderFlag } from './CountryFlag';
import { getTrackLayout } from '../data/trackLayouts';
import { getWorldTourCircuit, WorldTourCircuitDef } from '../data/worldTourCircuits';
import { drawWorldTourHorizon, drawSoftClouds, drawDesertSun, drawNightSky } from '../utils/horizonRenderer';
import {
  DRIVER_PERSONALITIES,
  getDriverPersonality,
  DriverPersonalityKey,
  DriverPersonalityProfile,
} from '../data/rivalPersonalities';
import {
  calculateRaceCarPhysics,
  calculateCircuitFit,
  getStageObjectivesForRound,
  evaluateStageObjective,
  diagnoseWeakestStat,
  getPersonalitySpeedDelta,
  calculatePackRacingAdjustment,
  StageObjective,
} from '../utils/raceEffects';

import { AI_DIFFICULTY } from '../data/aiDifficulty';
export { AI_DIFFICULTY };

// Player Car Durability Tuning ("เพิ่มเลือดให้ผู้เล่นอีกนิดหน่อย")
export const PLAYER_MAX_HEALTH = 125;

// Rival Car Durability Tuning: เพิ่มเลือดให้คู่แข่ง 50% ทุกคน (จาก 100 เป็น 150)
export const RIVAL_MAX_HEALTH = 150;

export interface OutRunStandingsDriver {
  pos: number;
  id?: string;
  name: string;
  tag: string;
  team: string;
  flag?: string;
  primaryColor: string;
  timeStr: string;
  timeMs?: number;
  isPlayer: boolean;
  personality?: DriverPersonalityProfile;
}

export interface OutRunRaceEngineProps {
  teamState: TeamState;
  activeGp: GrandPrix;
  lapsCount?: number; // e.g. 2 or 3 laps for interactive race
  onRaceCompleted: (result: {
    playerPosition: number;
    bestLapTimeMs: number;
    totalTimeMs: number;
    topSpeedKmH: number;
    cleanLapsCount: number;
    isDnf?: boolean;
    isLoss?: boolean;
    bonusPrize?: number;
    standings?: OutRunStandingsDriver[];
    winnerName?: string;
    winnerTeam?: string;
    winnerFlag?: string;
  }) => void;
  onExit: () => void;
}

// Stage Environment Themes across the Championship Calendar
export type StageTheme =
  | 'classic_forest'
  | 'coastal_city'
  | 'beach_grassland'
  | 'day_desert'
  | 'modern_city'
  | 'arid_forest';

export function getStageTheme(round: number): StageTheme {
  const r = ((round - 1) % 8) + 1; // Maps rounds 1 to 8
  if (r === 1) return 'classic_forest'; // Stage 1: Classic temperate lush forest & alpine parkland
  if (r === 2) return 'coastal_city'; // Stage 2: Coastal beach and massive skyscrapers
  if (r === 3) return 'beach_grassland'; // Stage 3: Beach bordering lush green grass with beautiful blue sky
  if (r === 4) return 'day_desert'; // Stage 4: Daytime sunny desert with sand dunes & cacti
  if (r === 5) return 'modern_city'; // Stage 5: Modern metropolis with massive skyscrapers & shaded trees
  return 'arid_forest'; // Stages 6-8: Drought-struck sun-baked dry forest
}

// Roadside track props & obstacles for classic OutRun Grand Prix aesthetic
export type RoadsidePropType =
  | 'sponsor_billboard'
  | 'f1_marshal_post'
  | 'grandstand'
  | 'tire_barrier'
  | 'distance_marker'
  | 'track_light'
  | 'palm_tree'
  | 'pine_tree'
  | 'green_tree'
  | 'safety_fence'
  | 'team_pitwall'
  | 'drs_gantry'
  | 'pit_entry_sign'
  | 'pit_box_crew'
  // Stage Theme Custom Scenery
  | 'cactus'
  | 'desert_rock'
  | 'city_building'
  | 'dry_tree'
  | 'arid_pine'
  // Obstacles that slow down or obstruct the car
  | 'traffic_cone'
  | 'road_barrier'
  | 'fallen_tree'
  | 'tire_stack'
  | 'oil_slick';

export interface RoadsideSprite {
  type: RoadsidePropType;
  offset: number; // For roadside: -1.6 to -5.5 or 1.6 to 5.5. For on-track obstacles: -0.75 to +0.75
  scale: number;
  text?: string;
  color?: string;
  isObstacle?: boolean;
  hit?: boolean;
  hitUntil?: number;
  playerHitUntil?: number;
  aiHitUntil?: number;
}

// Calculate accurate, tight collision hitboxes for ALL on-track & roadside objects
// แก้ไข: ปรับ hitbox ให้สมจริง ไม่กว้างเกินจริง เพื่อป้องกันไม่ให้รถชนป้ายใหญ่/สิ่งกีดขวางโดยไม่สมควร
export function getPropHitWidth(type: RoadsidePropType): number {
  switch (type) {
    case 'traffic_cone':
      return 0.14; // Tight cone hitbox so cars can weave closely between cones
    case 'road_barrier':
      return 0.18; // Realistic snug concrete barricade block (cars can comfortably pass through gates)
    case 'fallen_tree':
      return 0.20; // Snug fallen log
    case 'tire_stack':
      return 0.18; // Snug tire pile
    case 'oil_slick':
      return 0.20; // Snug oil slick
    case 'tire_barrier':
      return 0.18;
    case 'sponsor_billboard':
      return 0.10; // Realistic slim pole width for sponsor billboards
    case 'distance_marker':
      return 0.08;
    case 'safety_fence':
      return 0.10;
    case 'team_pitwall':
      return 0; // Pure decorative pit straight wall, non-collidable
    case 'pit_entry_sign':
      return 0; // Overhead / roadside pit signage, non-collidable
    case 'pit_box_crew':
      return 0; // Friendly team pit crew, non-collidable
    case 'f1_marshal_post':
      return 0.10;
    case 'track_light':
      return 0.10;
    case 'grandstand':
      return 0.15; // Set far off-track
    case 'palm_tree':
    case 'pine_tree':
    case 'green_tree':
    case 'dry_tree':
    case 'arid_pine':
      return 0.14; // Tree trunk
    case 'drs_gantry':
      return 0; // Overhead arch spanning over the road, completely non-collidable (cars drive underneath)
    case 'cactus':
      return 0.12;
    case 'desert_rock':
      return 0.18;
    case 'city_building':
      return 0.22;
    default:
      return 0.14;
  }
}

// Hazard prop classification for smart AI navigation & collision safety
export function isHazardProp(type: RoadsidePropType): boolean {
  return (
    type === 'traffic_cone' ||
    type === 'road_barrier' ||
    type === 'fallen_tree' ||
    type === 'tire_stack' ||
    type === 'oil_slick' ||
    type === 'tire_barrier'
  );
}

export interface TrackObstacleThreat {
  dist: number;
  offset: number;
  hitWidth: number;
  type: RoadsidePropType;
  safeMargin: number;
}

export function isLaneSafeFromThreats(
  laneX: number,
  threats: TrackObstacleThreat[],
  checkDist = 4500,
  extraBuffer = 0
): boolean {
  for (let i = 0; i < threats.length; i++) {
    const t = threats[i];
    if (t.dist <= checkDist && Math.abs(laneX - t.offset) < t.hitWidth + t.safeMargin + extraBuffer) {
      return false;
    }
  }
  return true;
}

// Draw authentic Grand Prix roadside props and obstacles scaled in pseudo-3D
function drawRoadsideProp(
  ctx: CanvasRenderingContext2D,
  sprite: RoadsideSprite,
  x1: number,
  y1: number,
  w1: number,
  scale: number,
  screenWidth: number,
  screenHeight: number
) {
  // Deep render distance (can see props across hundreds of segments into the horizon)
  if (scale < 0.000025) return;

  const baseX = x1 + sprite.offset * w1;
  const baseY = y1;

  if (baseX < -1600 || baseX > screenWidth + 1600 || baseY < screenHeight * 0.40 || baseY > screenHeight + 250) return;

  // Prominent, realistic scale for props and obstacles
  const s = Math.min(8.5, Math.max(0.08, scale * 3800 * sprite.scale));

  ctx.save();
  ctx.translate(baseX, baseY);
  ctx.scale(s, s);

  switch (sprite.type) {
    case 'sponsor_billboard': {
      // Grand Prix Sponsor Hoarding Board with high-res realism
      const text = sprite.text || 'PIRELLI';
      const bW = 185;
      const bH = 66;
      const poleH = 40;

      // Ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 5, bW * 0.54, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heavy steel support I-beams
      ctx.fillStyle = '#334155';
      ctx.fillRect(-bW * 0.36, -poleH, 8, poleH);
      ctx.fillRect(bW * 0.36 - 8, -poleH, 8, poleH);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-bW * 0.36 + 2, -poleH, 4, poleH);
      ctx.fillRect(bW * 0.36 - 6, -poleH, 4, poleH);

      // Billboard body styling by brand
      let bgColor = '#eab308'; // Pirelli yellow
      let textColor = '#dc2626';
      let borderCol = '#090b0e';
      let subText = 'MOTORSPORT';

      if (text === 'ROLEX') {
        bgColor = '#064e3b';
        textColor = '#fef08a';
        borderCol = '#eab308';
        subText = 'GENEVE 1905';
      } else if (text === 'ARAMCO') {
        bgColor = '#0284c7';
        textColor = '#ffffff';
        borderCol = '#38bdf8';
        subText = 'WHERE ENERGY IS OPPORTUNITY';
      } else if (text === 'DHL') {
        bgColor = '#ef4444';
        textColor = '#facc15';
        borderCol = '#7f1d1d';
        subText = 'EXCELLENCE. SIMPLY DELIVERED';
      } else if (text === 'HEINEKEN') {
        bgColor = '#15803d';
        textColor = '#ffffff';
        borderCol = '#dc2626';
        subText = 'WHEN YOU DRIVE NEVER DRINK';
      } else if (text === 'CRYPTO' || text === 'MSC') {
        bgColor = '#090b0e';
        textColor = '#38bdf8';
        borderCol = '#64748b';
        subText = 'GLOBAL PARTNER';
      }

      ctx.fillStyle = bgColor;
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(-bW / 2, -poleH - bH, bW, bH, 5);
      ctx.fill();
      ctx.stroke();

      // Outer metallic bevel trim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-bW / 2 + 2, -poleH - bH + 2, bW - 4, bH - 4);

      // Top brand accent strip
      ctx.fillStyle = borderCol;
      ctx.fillRect(-bW / 2, -poleH - bH, bW, 6);
      ctx.fillRect(-bW / 2, -poleH - 6, bW, 6);

      // Brand Title
      ctx.fillStyle = textColor;
      ctx.font = '900 28px "Rajdhani", "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, -poleH - bH * 0.58);

      // Subtitle tagline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 9px "Rajdhani", sans-serif';
      ctx.fillText(subText, 0, -poleH - bH * 0.22);
      break;
    }

    case 'distance_marker': {
      // 150m, 100m, 50m Braking Boards (Bold, authentic F1 style)
      const text = sprite.text || '100';
      const bW = 74;
      const bH = 82;
      const poleH = 26;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 3, bW * 0.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heavy steel post
      ctx.fillStyle = '#475569';
      ctx.fillRect(-4, -poleH, 8, poleH);

      // White reflective board
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#090b0e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(-bW / 2, -poleH - bH, bW, bH, 4);
      ctx.fill();
      ctx.stroke();

      // Top hazard warning band
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-bW / 2 + 4, -poleH - 16, bW - 8, 12);
      ctx.fillStyle = '#090b0e';
      ctx.fillRect(-14, -poleH - 16, 7, 12);
      ctx.fillRect(8, -poleH - 16, 7, 12);

      // Bold braking distance number
      ctx.fillStyle = '#090b0e';
      ctx.font = '900 42px "Rajdhani", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, -poleH - bH / 2 - 6);
      break;
    }

    case 'tire_barrier': {
      // Thick safety tire wall with high contrast F1 safety markings
      const tW = 120;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 3, tW * 0.55, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      const colors = ['#dc2626', '#ffffff', '#dc2626', '#ffffff'];
      for (let col = 0; col < 4; col++) {
        const cx = -tW / 2 + 15 + col * 30;
        ctx.fillStyle = colors[col];
        // Bottom tire
        ctx.beginPath();
        ctx.roundRect(cx - 14, -20, 28, 20, 5);
        ctx.fill();
        // Top tire
        ctx.beginPath();
        ctx.roundRect(cx - 14, -40, 28, 20, 5);
        ctx.fill();

        // Tire hub center
        ctx.fillStyle = '#090b0e';
        ctx.fillRect(cx - 6, -34, 12, 8);
        ctx.fillRect(cx - 6, -14, 12, 8);
      }

      // FIA safety rubber belt wrapper
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(-tW / 2, -26, tW, 9);
      break;
    }

    case 'f1_marshal_post': {
      // Tall elevated FIA Marshal Observation Post
      const pH = 110;
      const pW = 75;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 4, pW * 0.55, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Steel scaffolding legs
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-pW * 0.4, 0);
      ctx.lineTo(-pW * 0.32, -pH * 0.6);
      ctx.moveTo(pW * 0.4, 0);
      ctx.lineTo(pW * 0.32, -pH * 0.6);
      ctx.stroke();

      // Walkway platform
      ctx.fillStyle = '#334155';
      ctx.fillRect(-pW * 0.48, -pH * 0.6 - 5, pW * 0.96, 6);

      // Cabin enclosure
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-pW * 0.38, -pH, pW * 0.76, pH * 0.4);
      // Red slanted weather roof
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-pW * 0.48, -pH);
      ctx.lineTo(0, -pH - 16);
      ctx.lineTo(pW * 0.48, -pH);
      ctx.closePath();
      ctx.fill();

      // Marshal in High-Vis Orange
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(-8, -pH * 0.85, 16, 20);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -pH * 0.85 - 6, 7, 0, Math.PI * 2);
      ctx.fill();

      // Waving bright green safety flag
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.moveTo(10, -pH * 0.85);
      ctx.lineTo(34, -pH * 0.94);
      ctx.lineTo(30, -pH * 0.76);
      ctx.lineTo(10, -pH * 0.8);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'grandstand': {
      // "อัฒจันทร์ มันยังไม่ 3D อะ ให้ใช้หลักการเดียวกับการออกแบบถนน ในการออกแบบ อัฒจันทร์ ไม่ใช่เทคนิคของต้นไม้"
      // Grandstands are rendered exclusively via continuous 3D polygon mesh along road segments
      // in draw3DGrandstandSegment (road design principle), eliminating the tree/billboard sprite technique!
      break;
    }

    case 'track_light': {
      // Towering floodlight gantry with stadium light clusters
      const lH = 190;
      const lW = 55;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 3, 20, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main steel tower
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -lH);
      ctx.stroke();

      // Cross lattices
      ctx.lineWidth = 2;
      for (let y = -25; y > -lH; y -= 30) {
        ctx.beginPath();
        ctx.moveTo(-5, y);
        ctx.lineTo(5, y - 15);
        ctx.moveTo(5, y);
        ctx.lineTo(-5, y - 15);
        ctx.stroke();
      }

      // Top floodlight head
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-lW / 2, -lH - 18, lW, 18);

      // Glowing high-output LED lamps
      ctx.fillStyle = '#fef08a';
      for (let lx = -lW / 2 + 7; lx < lW / 2; lx += 12) {
        ctx.beginPath();
        ctx.arc(lx, -lH - 9, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'palm_tree': {
      // Tall Tropical Palm Tree with sweeping curved trunk & lush foliage
      const treeH = 160;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 30, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Textured palm trunk
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(sprite.offset > 0 ? 16 : -16, -treeH * 0.5, sprite.offset > 0 ? 24 : -24, -treeH);
      ctx.stroke();

      const topX = sprite.offset > 0 ? 24 : -24;
      const topY = -treeH;
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 5;
      const frondAngles = [-1.4, -0.9, -0.4, 0.1, 0.6, 1.1, 1.6, 2.0];
      frondAngles.forEach((ang) => {
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        const endX = topX + Math.cos(ang) * 58;
        const endY = topY + Math.sin(ang) * 42 + 12;
        ctx.quadraticCurveTo(topX + Math.cos(ang) * 35, topY - 18, endX, endY);
        ctx.stroke();
      });

      // Palm coconuts
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(topX - 4, topY + 4, 4, 0, Math.PI * 2);
      ctx.arc(topX + 4, topY + 4, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'pine_tree': {
      // Majestic Alpine Conifer with rich tiered foliage & 3D shadowing
      const treeH = 220;
      const treeW = 110;

      // Ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 5, treeW * 0.46, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thick bark trunk
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-8, -42, 16, 42);

      // 5-Tiered dense evergreen conifer foliage
      const tiers = [
        { y: -35, w: treeW, h: 58, col: '#14532d' },
        { y: -78, w: treeW * 0.85, h: 52, col: '#166534' },
        { y: -118, w: treeW * 0.68, h: 48, col: '#15803d' },
        { y: -154, w: treeW * 0.50, h: 44, col: '#16a34a' },
        { y: -188, w: treeW * 0.32, h: 40, col: '#22c55e' },
      ];

      tiers.forEach((t) => {
        ctx.fillStyle = t.col;
        ctx.beginPath();
        ctx.moveTo(0, t.y - t.h);
        ctx.lineTo(t.w / 2, t.y);
        ctx.lineTo(-t.w / 2, t.y);
        ctx.closePath();
        ctx.fill();

        // 3D shadow side
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.beginPath();
        ctx.moveTo(0, t.y - t.h);
        ctx.lineTo(0, t.y);
        ctx.lineTo(-t.w / 2, t.y);
        ctx.closePath();
        ctx.fill();
      });
      break;
    }

    case 'green_tree': {
      // Full Lush Parkland Oak with grand voluminous canopy
      const treeH = 185;
      const crownR = 68;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 5, crownR * 0.95, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heavy trunk
      ctx.fillStyle = '#5c2c10';
      ctx.fillRect(-10, -55, 20, 55);
      ctx.strokeStyle = '#5c2c10';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(-6, -45);
      ctx.lineTo(-24, -80);
      ctx.moveTo(6, -45);
      ctx.lineTo(24, -80);
      ctx.stroke();

      // Multi-cluster lush foliage canopy
      const puffs = [
        { x: 0, y: -treeH * 0.75, r: crownR * 0.78, col: '#166534' },
        { x: -crownR * 0.42, y: -treeH * 0.62, r: crownR * 0.65, col: '#15803d' },
        { x: crownR * 0.42, y: -treeH * 0.62, r: crownR * 0.65, col: '#16a34a' },
        { x: 0, y: -treeH * 0.52, r: crownR * 0.74, col: '#15803d' },
        { x: -crownR * 0.25, y: -treeH * 0.88, r: crownR * 0.54, col: '#22c55e' },
        { x: crownR * 0.22, y: -treeH * 0.85, r: crownR * 0.52, col: '#4ade80' },
      ];

      puffs.forEach((pf) => {
        ctx.fillStyle = pf.col;
        ctx.beginPath();
        ctx.arc(pf.x, pf.y, pf.r, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'cactus': {
      // Stage 4 Daytime Desert: Giant Saguaro Cactus with ribbed green arms & bloom
      const cactH = 150;
      const cactW = 56;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 25, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main trunk
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.roundRect(-10, -cactH, 20, cactH, 10);
      ctx.fill();

      // Left curved arm
      ctx.beginPath();
      ctx.roundRect(-cactW / 2 - 4, -cactH * 0.70, 12, cactH * 0.36, 6);
      ctx.roundRect(-cactW / 2 - 4, -cactH * 0.42, cactW * 0.46, 12, 6);
      ctx.fill();

      // Right curved arm (higher)
      ctx.beginPath();
      ctx.roundRect(cactW / 2 - 8, -cactH * 0.84, 12, cactH * 0.40, 6);
      ctx.roundRect(0, -cactH * 0.52, cactW * 0.46, 12, 6);
      ctx.fill();

      // Shading & vertical spine ribs
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-4, -cactH + 6);
      ctx.lineTo(-4, 0);
      ctx.moveTo(4, -cactH + 6);
      ctx.lineTo(4, 0);
      ctx.stroke();

      // Desert red bloom flower on top
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, -cactH - 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'desert_rock': {
      // Stage 4 Daytime Desert: Layered Sandstone Rock Boulder Formation
      const rW = 95;
      const rH = 58;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 4, rW * 0.48, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main weathered rock silhouette
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(-rW / 2, 0);
      ctx.lineTo(-rW * 0.38, -rH * 0.72);
      ctx.lineTo(-rW * 0.12, -rH);
      ctx.lineTo(rW * 0.28, -rH * 0.88);
      ctx.lineTo(rW / 2, -rH * 0.35);
      ctx.lineTo(rW * 0.42, 0);
      ctx.closePath();
      ctx.fill();

      // Sunlit desert golden rock facet
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(-rW * 0.12, -rH);
      ctx.lineTo(rW * 0.28, -rH * 0.88);
      ctx.lineTo(rW / 2, -rH * 0.35);
      ctx.lineTo(rW * 0.1, -rH * 0.2);
      ctx.closePath();
      ctx.fill();

      // Sedimentary horizontal strata lines
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-rW * 0.35, -rH * 0.46);
      ctx.lineTo(rW * 0.35, -rH * 0.42);
      ctx.moveTo(-rW * 0.28, -rH * 0.24);
      ctx.lineTo(rW * 0.38, -rH * 0.20);
      ctx.stroke();
      break;
    }

    case 'city_building': {
      // Modern Giant Mega-Skyscraper (Monumental Glass High-Rise)
      // Much larger than before per user request (bW: 230, bH: 520)
      const bW = 230;
      const bH = 520;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 6, bW * 0.62, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // 1. Grand Ground Podium & Entrance Lobby
      const podW = bW * 1.14;
      const podH = 65;
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(-podW / 2, -podH, podW, podH);
      // Podium marble canopy & revolving doors
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-podW / 2 + 10, -podH + 6, podW - 20, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-podW * 0.22, -podH + 24, podW * 0.44, podH - 26);

      // 2. Tower Main Structural Frame (Massive glass facade)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-bW / 2, -bH, bW, bH - podH + 8);

      // Deep reflective architectural blue glass curtain wall
      ctx.fillStyle = '#172033';
      ctx.fillRect(-bW / 2 + 8, -bH + 8, bW - 16, bH - podH - 4);

      // 3. Dense Matrix of Illuminated Office Windows (Cyan, Sapphire & Amber)
      const rows = 20;
      const cols = 8;
      const wW = (bW - 36) / cols;
      const wH = 12;
      const yStart = -bH + 24;
      const yStep = (bH - podH - 40) / rows;

      for (let r = 0; r < rows; r++) {
        const wy = yStart + r * yStep;
        for (let c = 0; c < cols; c++) {
          const wx = -bW / 2 + 16 + c * (wW + 2.5);
          const isLit = ((r * 7 + c * 3 + Math.floor(Math.abs(sprite.offset * 10))) % 3) !== 0;
          ctx.fillStyle = isLit ? (r % 3 === 0 ? '#facc15' : '#38bdf8') : '#080e18';
          ctx.fillRect(wx, wy, wW - 2, wH);
        }
      }

      // 4. Stepped Rooftop Setback Penthouse & Glass Crown
      const crownW = bW * 0.72;
      const crownH = 34;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-crownW / 2, -bH - crownH, crownW, crownH);
      ctx.fillStyle = '#38bdf8'; // Glowing neon crown edge
      ctx.fillRect(-crownW / 2, -bH - crownH, crownW, 4);

      // 5. Tall Sky Spire & Communications Mast with Blinking Aviation Beacon
      const spireH = 50;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(0, -bH - crownH);
      ctx.lineTo(0, -bH - crownH - spireH);
      ctx.stroke();

      // Glowing red aviation beacon
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -bH - crownH - spireH, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'dry_tree': {
      // Stages 6-8 Arid Drought Forest: Sun-baked scrub oak with gnarled branches & olive-gold dry canopy
      const treeH = 175;
      const crownR = 64;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 4, crownR * 0.9, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gnarled weathered trunk & twisting branches
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-9, -52, 18, 52);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-5, -45);
      ctx.lineTo(-28, -82);
      ctx.moveTo(5, -45);
      ctx.lineTo(26, -80);
      ctx.moveTo(-12, -72);
      ctx.lineTo(-38, -105);
      ctx.moveTo(14, -70);
      ctx.lineTo(36, -102);
      ctx.stroke();

      // Parched, drought-stricken foliage clusters (golden-tan, olive, dried straw)
      const dryPuffs = [
        { x: 0, y: -treeH * 0.75, r: crownR * 0.72, col: '#713f12' },
        { x: -crownR * 0.44, y: -treeH * 0.62, r: crownR * 0.58, col: '#854d0e' },
        { x: crownR * 0.44, y: -treeH * 0.62, r: crownR * 0.58, col: '#a16207' },
        { x: 0, y: -treeH * 0.52, r: crownR * 0.68, col: '#854d0e' },
        { x: -crownR * 0.25, y: -treeH * 0.88, r: crownR * 0.48, col: '#a16207' },
        { x: crownR * 0.22, y: -treeH * 0.85, r: crownR * 0.46, col: '#ca8a04' },
      ];
      dryPuffs.forEach((dp) => {
        ctx.fillStyle = dp.col;
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, dp.r, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'arid_pine': {
      // Stages 6-8 Arid Drought Forest: Mediterranean Stone / Umbrella Pine with dried olive canopy
      const treeH = 205;
      const umbW = 125;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 4, umbW * 0.42, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tall slender trunk
      ctx.strokeStyle = '#573412';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(sprite.offset > 0 ? 8 : -8, -treeH * 0.6, 0, -treeH * 0.82);
      ctx.stroke();

      // Spreading top branches
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -treeH * 0.82);
      ctx.lineTo(-umbW * 0.42, -treeH * 0.88);
      ctx.moveTo(0, -treeH * 0.82);
      ctx.lineTo(umbW * 0.42, -treeH * 0.88);
      ctx.stroke();

      // Umbrella-shaped dried olive canopy
      ctx.fillStyle = '#4d5e28'; // Dried olive pine needles
      ctx.beginPath();
      ctx.ellipse(0, -treeH * 0.92, umbW * 0.5, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#657832';
      ctx.beginPath();
      ctx.ellipse(0, -treeH * 0.95, umbW * 0.38, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'safety_fence': {
      // Tall FIA catch fence along track margins
      const fW = 140;
      const fH = 68;

      // Concrete base
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-fW / 2, -16, fW, 16);
      ctx.fillStyle = '#334155';
      ctx.fillRect(-fW / 2, -16, fW, 4);

      // Steel posts & mesh
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      for (let px = -fW / 2; px <= fW / 2; px += 26) {
        ctx.beginPath();
        ctx.moveTo(px, -16);
        ctx.lineTo(px, -fH);
        ctx.stroke();
      }
      ctx.lineWidth = 1.2;
      for (let wy = -24; wy >= -fH; wy -= 11) {
        ctx.beginPath();
        ctx.moveTo(-fW / 2, wy);
        ctx.lineTo(fW / 2, wy);
        ctx.stroke();
      }
      break;
    }

    case 'team_pitwall': {
      // Grand Prix Command Pit Wall & Engineer Stand
      const pwW = 175;
      const pwH = 82;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-pwW / 2, -pwH, pwW, pwH);

      // Canopy roof
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-pwW / 2 - 6, -pwH - 8, pwW + 12, 10);

      // Telemetry screens
      for (let sc = -pwW / 2 + 12; sc < pwW / 2 - 12; sc += 34) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(sc, -pwH + 16, 26, 22);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(sc + 3, -pwH + 19, 20, 16);
      }
      break;
    }

    case 'pit_entry_sign': {
      // Pit Entry Signboard with speed limiter circle & flashing arrow
      const sW = 130;
      const sH = 78;
      // Steel support post
      ctx.fillStyle = '#334155';
      ctx.fillRect(-7, -sH - 24, 14, sH + 24);
      // Dark signboard background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-sW / 2, -sH - 24, sW, sH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-sW / 2, -sH - 24, sW, sH);
      // Header text
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PIT ENTRY', 0, -sH - 6);
      // Red speed limit circle
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(-26, -sH + 22, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('100', -26, -sH + 26);
      // Flashing green arrow
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('➡️', 26, -sH + 28);
      break;
    }

    case 'pit_box_crew': {
      // Pit Crew Team waiting at pit box (with lollipop stop sign and tires)
      const crewH = 68;
      // Mechanics in team racing overalls
      [-36, 0, 36].forEach((mx) => {
        // Red overalls
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(mx - 8, -48, 16, 32);
        // Helmet
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(mx, -54, 7, 0, Math.PI * 2);
        ctx.fill();
        // Legs
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(mx - 7, -16, 6, 16);
        ctx.fillRect(mx + 1, -16, 6, 16);
      });
      // Pirelli Tires stacked
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.arc(-52, -12, 12, 0, Math.PI * 2);
      ctx.arc(52, -12, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Lollipop Stop Sign
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(12, -crewH - 14);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(12, -crewH - 14, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('STOP', 12, -crewH - 10);
      break;
    }

    case 'drs_gantry': {
      // Grand Overhead Bridge Arch (Towering across the entire track from verge to verge)
      // In local coordinates scaled by s, the road edge is at w1 / s.
      const localRoadW = w1 / s;
      const spanX = localRoadW * 1.35; // Tower base safely on grass outside kerbs
      const clearanceY = -(localRoadW * 0.90 + 55); // High overhead clearance above highest F1 car
      const bridgeH = Math.max(36, localRoadW * 0.28 + 18);
      const towerW = Math.max(16, localRoadW * 0.08);

      const isStartFinish = sprite.text === 'START / FINISH';

      // 1. Concrete Foundation Footings on grass
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-spanX - towerW * 0.8, -10, towerW * 1.6, 10);
      ctx.fillRect(spanX - towerW * 0.8, -10, towerW * 1.6, 10);

      // 2. Heavy Steel Lattice Vertical Towers
      // Left Tower
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-spanX - towerW / 2, clearanceY - bridgeH, towerW, -clearanceY + bridgeH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-spanX - towerW / 2, clearanceY - bridgeH, towerW, -clearanceY + bridgeH);

      // Right Tower
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(spanX - towerW / 2, clearanceY - bridgeH, towerW, -clearanceY + bridgeH);
      ctx.strokeRect(spanX - towerW / 2, clearanceY - bridgeH, towerW, -clearanceY + bridgeH);

      // Diagonal cross truss braces on towers
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.8;
      const numTruss = 4;
      const tStep = (-clearanceY + bridgeH) / numTruss;
      for (let t = 0; t < numTruss; t++) {
        const yTop = clearanceY - bridgeH + t * tStep;
        const yBot = yTop + tStep;
        ctx.beginPath();
        // Left tower X-braces
        ctx.moveTo(-spanX - towerW / 2, yTop);
        ctx.lineTo(-spanX + towerW / 2, yBot);
        ctx.moveTo(-spanX + towerW / 2, yTop);
        ctx.lineTo(-spanX - towerW / 2, yBot);
        // Right tower X-braces
        ctx.moveTo(spanX - towerW / 2, yTop);
        ctx.lineTo(spanX + towerW / 2, yBot);
        ctx.moveTo(spanX + towerW / 2, yTop);
        ctx.lineTo(spanX - towerW / 2, yBot);
        ctx.stroke();
      }

      // 3. Overhead Horizontal Bridge Arch (spanning from left tower to right tower)
      const totalSpan = spanX * 2 + towerW;
      ctx.fillStyle = isStartFinish ? '#090b0e' : '#082f49';
      ctx.fillRect(-spanX - towerW / 2, clearanceY - bridgeH, totalSpan, bridgeH);

      // Outer accent border
      ctx.strokeStyle = isStartFinish ? '#dc2626' : '#06b6d4';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(-spanX - towerW / 2, clearanceY - bridgeH, totalSpan, bridgeH);

      if (isStartFinish) {
        // Red top accent bar
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-spanX - towerW / 2, clearanceY - bridgeH, totalSpan, 6);

        // Checkered flag patterns on left and right ends of banner
        const checkW = Math.min(65, spanX * 0.22);
        const checkStep = 8;
        for (let cy = 0; cy < bridgeH - 6; cy += checkStep) {
          for (let cx = 0; cx < checkW; cx += checkStep) {
            const isWhite = (Math.floor(cx / checkStep) + Math.floor(cy / checkStep)) % 2 === 0;
            ctx.fillStyle = isWhite ? '#ffffff' : '#000000';
            // Left end
            ctx.fillRect(-spanX - towerW / 2 + cx, clearanceY - bridgeH + 6 + cy, checkStep, checkStep);
            // Right end
            ctx.fillRect(spanX + towerW / 2 - checkW + cx, clearanceY - bridgeH + 6 + cy, checkStep, checkStep);
          }
        }

        // Center Banner Text
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${Math.max(14, Math.round(bridgeH * 0.44))}px "Rajdhani", "Chakra Petch", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('START / FINISH', 0, clearanceY - bridgeH / 2 + 2);

        // 5 Official FIA Gantry Start Light Pods hanging below bridge
        const podW = 14;
        const podH = 22;
        const podSpacing = 28;
        for (let p = -2; p <= 2; p++) {
          const podX = p * podSpacing;
          // Black pod box
          ctx.fillStyle = '#020617';
          ctx.fillRect(podX - podW / 2, clearanceY, podW, podH);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(podX - podW / 2, clearanceY, podW, podH);
          // Red FIA lamp
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(podX, clearanceY + podH / 2, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // DRS Zone Banner
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(-spanX - towerW / 2, clearanceY - bridgeH, totalSpan, 5);

        // Glowing DRS Zone Text
        ctx.fillStyle = '#38bdf8';
        ctx.font = `900 ${Math.max(14, Math.round(bridgeH * 0.46))}px "Rajdhani", "Chakra Petch", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚡ DRS ZONE ⚡', 0, clearanceY - bridgeH / 2);
      }
      break;
    }

    // =========================================================================
    // ON-TRACK HAZARD OBSTACLES (ENLARGED, CHUNKY, VIVID & IMPACTFUL)
    // =========================================================================
    case 'traffic_cone': {
      // Chunky Fluorescent Orange Safety Cone with reflective 3M collars
      const cW = 48;
      const cH = 78;

      if (sprite.hit) {
        // Tipped-over / knocked down cone with asphalt scuff
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(14, 3, 36, 9, 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.rotate(1.1);
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(-cW * 0.4, -6);
        ctx.lineTo(cW * 0.4, -6);
        ctx.lineTo(cW * 0.12, -cH);
        ctx.lineTo(-cW * 0.12, -cH);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        break;
      }

      // Ground shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, 3, cW * 0.65, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heavy black rubber base
      ctx.fillStyle = '#090b0e';
      ctx.fillRect(-cW / 2, -8, cW, 8);

      // Fluorescent orange cone body
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-cW * 0.45, -8);
      ctx.lineTo(cW * 0.45, -8);
      ctx.lineTo(cW * 0.12, -cH);
      ctx.lineTo(-cW * 0.12, -cH);
      ctx.closePath();
      ctx.fill();

      // 3D shading on left flank
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.moveTo(0, -cH);
      ctx.lineTo(-cW * 0.12, -cH);
      ctx.lineTo(-cW * 0.45, -8);
      ctx.lineTo(0, -8);
      ctx.closePath();
      ctx.fill();

      // Dual reflective white safety bands
      ctx.fillStyle = '#ffffff';
      // Upper ring
      ctx.beginPath();
      ctx.moveTo(-cW * 0.24, -cH * 0.64);
      ctx.lineTo(cW * 0.24, -cH * 0.64);
      ctx.lineTo(cW * 0.17, -cH * 0.83);
      ctx.lineTo(-cW * 0.17, -cH * 0.83);
      ctx.closePath();
      ctx.fill();

      // Lower ring
      ctx.beginPath();
      ctx.moveTo(-cW * 0.35, -cH * 0.26);
      ctx.lineTo(cW * 0.35, -cH * 0.26);
      ctx.lineTo(cW * 0.28, -cH * 0.46);
      ctx.lineTo(-cW * 0.28, -cH * 0.46);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'road_barrier': {
      // Large Construction / Maintenance Barricade with flashing hazard beacon
      const bW = 165;
      const bH = 80;
      const legH = 30;

      if (sprite.hit) {
        ctx.save();
        ctx.rotate(0.28);
        ctx.translate(14, 8);
      }

      // Heavy shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, 4, bW * 0.56, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tubular steel A-frame legs
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-bW * 0.44, 0);
      ctx.lineTo(-bW * 0.36, -legH - bH * 0.4);
      ctx.moveTo(bW * 0.44, 0);
      ctx.lineTo(bW * 0.36, -legH - bH * 0.4);
      ctx.stroke();

      // Main heavy barrier board
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-bW / 2, -legH - bH, bW, bH, 6);
      ctx.clip();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-bW / 2, -legH - bH, bW, bH);

      // Red hazard diagonal chevrons
      ctx.fillStyle = '#dc2626';
      for (let x = -bW - 50; x < bW + 50; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, -legH);
        ctx.lineTo(x + 20, -legH);
        ctx.lineTo(x + 48, -legH - bH);
        ctx.lineTo(x + 28, -legH - bH);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      ctx.strokeStyle = '#090b0e';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(-bW / 2, -legH - bH, bW, bH);

      // Dual flashing amber warning beacons on top
      [-bW * 0.3, bW * 0.3].forEach((bx) => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(bx, -legH - bH - 10, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(bx, -legH - bH - 10, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      if (sprite.hit) {
        ctx.restore();
      }
      break;
    }

    case 'fallen_tree': {
      // Enormous Weathered Fallen Timber Trunk blocking track
      const logW = 215;
      const logH = 42;

      if (sprite.hit) {
        ctx.save();
        ctx.rotate(-0.16);
        ctx.translate(-8, 5);
      }

      // Heavy asphalt shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(0, 5, logW * 0.54, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main log trunk
      ctx.fillStyle = '#5c2c10';
      ctx.beginPath();
      ctx.roundRect(-logW / 2, -logH, logW, logH, 12);
      ctx.fill();

      // Deep wood bark grooves
      ctx.strokeStyle = '#381a08';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-logW * 0.42, -logH * 0.65);
      ctx.lineTo(logW * 0.38, -logH * 0.6);
      ctx.moveTo(-logW * 0.35, -logH * 0.3);
      ctx.lineTo(logW * 0.42, -logH * 0.35);
      ctx.stroke();

      // Cut log tree rings on exposed end
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(-logW / 2 + 8, -logH / 2, 9, logH * 0.46, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sprawling leafy branch clusters
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(logW * 0.3, -logH - 14, 24, 0, Math.PI * 2);
      ctx.arc(logW * 0.44, -logH - 18, 18, 0, Math.PI * 2);
      ctx.arc(-logW * 0.2, -logH - 10, 16, 0, Math.PI * 2);
      ctx.fill();

      if (sprite.hit) {
        ctx.restore();
      }
      break;
    }

    case 'tire_stack': {
      // Large 3-Tier Racing Slick Tire Stack with warning cone on top
      const stW = 105;

      if (sprite.hit) {
        ctx.save();
        ctx.rotate(0.32);
        ctx.translate(12, 6);
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, 4, stW * 0.58, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      const layers = [
        { y: -22, w: 100, h: 22, col: '#18181b', rim: '#eab308' },
        { y: -42, w: 90, h: 20, col: '#090b0e', rim: '#ef4444' },
        { y: -62, w: 82, h: 20, col: '#27272a', rim: '#38bdf8' },
      ];

      layers.forEach((l) => {
        ctx.fillStyle = l.col;
        ctx.beginPath();
        ctx.roundRect(-l.w / 2, l.y, l.w, l.h, 6);
        ctx.fill();

        ctx.strokeStyle = l.rim;
        ctx.lineWidth = 3;
        ctx.strokeRect(-l.w / 2 + 10, l.y + 4, l.w - 20, l.h - 8);
      });

      // Orange cone on top
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(-16, -62);
      ctx.lineTo(16, -62);
      ctx.lineTo(4, -92);
      ctx.lineTo(-4, -92);
      ctx.closePath();
      ctx.fill();

      if (sprite.hit) {
        ctx.restore();
      }
      break;
    }

    case 'oil_slick': {
      // Wide Slippery Oil Patch with multi-color iridescent rainbow sheen
      const oW = 180;
      const oH = 50;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.beginPath();
      ctx.ellipse(0, 0, oW / 2, oH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iridescent rainbow sheen rings
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)'; // Cyan
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, oW * 0.38, oH * 0.38, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)'; // Magenta
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(6, -2, oW * 0.28, oH * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(234, 179, 8, 0.65)'; // Gold
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(-8, 3, oW * 0.18, oH * 0.18, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

export interface BoostPadInfo {
  offset: number; // -0.46 (left lane), 0 (center), +0.46 (right lane)
  width: number;  // road width fraction ~0.34
  padId: number;
}

// Track segment geometry for OutRun raster projection
interface Segment {
  index: number;
  p1: {
    world: { x: number; y: number; z: number };
    camera: { x: number; y: number; z: number };
    screen: { x: number; y: number; w: number; scale: number };
  };
  p2: {
    world: { x: number; y: number; z: number };
    camera: { x: number; y: number; z: number };
    screen: { x: number; y: number; w: number; scale: number };
  };
  curve: number; // Curvature: -3 (hard left) to +3 (hard right)
  color: {
    road: string;
    grass: string;
    rumble: string;
    lane: string;
  };
  isStartFinish: boolean;
  hasGrandstand?: boolean;
  sprites?: RoadsideSprite[];
  boostPad?: BoostPadInfo;
  isPitLaneZone?: boolean;
  pitLaneType?: 'entry' | 'lane' | 'box' | 'exit';
}

// 11 AI Rival F1 Cars racing alongside player with distinctive Driver Personalities
export interface AiCar {
  id: string;
  name: string;
  tag: string;
  teamName: string;
  number: number;
  primaryColor: string;
  secondaryColor: string;
  z: number;
  x: number;
  targetX: number;
  lateralVx: number;
  speed: number;
  baseSpeed: number;
  steerAngle: number;
  overtakeTimer: number;
  lapsCompleted: number;
  aggression: number;
  evadingObstacle: boolean;
  drsActive: boolean;
  contactCooldown: number;
  isBraking: boolean;
  isCatchUpBeast?: boolean;
  catchUpIntensity?: number;
  isTailgating?: boolean;
  isAttacking?: boolean;
  boostTimer?: number;
  boostCooldown?: number;
  lanePreference?: number;
  crashStunTimer?: number;
  slowedTimer?: number;
  mistakeLap?: number;
  spinAngle?: number;
  lastObstacleHitType?: string;
  lastObstacleHitUntil?: number;
  // Driver Personality specific fields
  personalityKey: DriverPersonalityKey;
  personalityActiveTimer?: number;
  personalitySkillName?: string;
  personalitySkillNameTh?: string;
  hammerTimeTimer?: number;
  defendingTimer?: number;
  hasPitted?: boolean;
  pitLap?: number;
  isPitting?: boolean;
  pitStopTimer?: number;
  pitDuration?: number;
  willMissPit?: boolean;
  tireBlown?: boolean;
  pitExitGraceTimer?: number;
  // Dynamic stint pace & randomized pattern fields
  pacePhaseOffset?: number;
  stintTimer?: number;
  stintMode?: 'charging' | 'battling' | 'tire_management' | 'error_recovery' | 'engine_mode_push';
  stintPaceDelta?: number;
  lockupTimer?: number;
  health?: number;
  maxHealth?: number;
  isDnf?: boolean;
  isFire?: boolean;
  hasWetTires?: boolean;
  nitroFuel?: number;
  nitroActive?: boolean;
  nitroTimer?: number;
  nitroDepleted?: boolean;
  blockCooldown?: number;
  blockTimer?: number;
  blockTargetX?: number;
  counterAttackTimer?: number;
}

// Special boss rivals check: Min Werstappen, Louis Hammerton, Alex Alboon
// Requirement: "ทำให้เลือด Min Werstappen, Louis Hammerton, Alex Alboon เป็นเป็นจำนวน 3,000 และมีความเร็ว มากกว่าเดิม 10%"
export function isBossRival(driverId?: string, name?: string): boolean {
  if (!driverId && !name) return false;
  return (
    driverId === 'ai-wer' ||
    driverId === 'ai-ham' ||
    driverId === 'ai-abn' ||
    name === 'Min Werstappen' ||
    name === 'Louis Hammerton' ||
    name === 'Alex Alboon'
  );
}

export function getRivalMaxHealth(driverId?: string, name?: string): number {
  if (isBossRival(driverId, name)) {
    return 3000;
  }
  return RIVAL_MAX_HEALTH; // 150
}

export const PIT_STOP_TASKS: { th: string; en: string; key: string }[] = [
  { th: 'ขันน็อตล้อหน้าซ้าย FL', en: 'FL Wheel Nut', key: 'FL' },
  { th: 'ขันน็อตล้อหน้าขวา FR', en: 'FR Wheel Nut', key: 'FR' },
  { th: 'แม่แรงหน้ายกลอย Jack-F', en: 'Front Jack Lift', key: 'JACK-F' },
  { th: 'ปรับองศาปีกหน้า Aero Flap', en: 'Front Wing Angle', key: 'AERO' },
  { th: 'ขันน็อตล้อหลังซ้าย RL', en: 'RL Wheel Nut', key: 'RL' },
  { th: 'ขันน็อตล้อหลังขวา RR', en: 'RR Wheel Nut', key: 'RR' },
  { th: 'แม่แรงหลังเซตปล่อย Jack-R', en: 'Rear Jack Release', key: 'JACK-R' },
  { th: 'ตรวจเช็กแรงบิดปืนลม Torque', en: 'Torque Check', key: 'TORQUE' },
  { th: 'ทำความสะอาดช่องลม Visor', en: 'Visor & Airbox Tearoff', key: 'VISOR' },
  { th: 'ตรวจเช็กแรงดันลมยาง Tyre PSI', en: 'Tyre Pressure Sensor', key: 'PSI' },
  { th: 'สัญญาณไฟเขียวปล่อยรถ GO!', en: 'Lollipop Green GO', key: 'GO' },
  { th: 'เซ็นเซอร์ออกตัว Pit Release', en: 'Pit Safe Release Sensor', key: 'RELEASE' },
];

export function getPitQteArrowCount(pitCrewSkill: number): number {
  if (pitCrewSkill >= 95) return 4;
  if (pitCrewSkill >= 88) return 5;
  if (pitCrewSkill >= 80) return 6;
  if (pitCrewSkill >= 72) return 7;
  if (pitCrewSkill >= 64) return 8;
  if (pitCrewSkill >= 55) return 9;
  return 10;
}

export function generatePitQteSequence(arrowCount: number): ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] {
  const allDirs: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const seq: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = [];
  for (let i = 0; i < arrowCount; i++) {
    let d: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    do {
      d = allDirs[Math.floor(Math.random() * allDirs.length)];
    } while (seq.length >= 2 && seq[seq.length - 1] === d && seq[seq.length - 2] === d);
    seq.push(d);
  }
  return seq;
}

export const RIVAL_AI_TEMPLATES = [
  // Min Werstappen: Base speed +10% (300 -> 330)
  { id: 'ai-wer', name: 'Min Werstappen', tag: 'WER', teamName: 'Red Bullion Racing', flag: '🇳🇱', number: 1, primaryColor: '#1e3a8a', secondaryColor: '#dc2626', baseSpeed: 330, aggression: 0.98, personalityKey: 'apex_predator' as const },
  { id: 'ai-clk', name: 'Charl Leclerk', tag: 'CLK', teamName: 'Scuderia Cavallo', flag: '🇲🇨', number: 16, primaryColor: '#dc2626', secondaryColor: '#000000', baseSpeed: 299, aggression: 0.96, personalityKey: 'corner_virtuoso' as const },
  { id: 'ai-mor', name: 'Londo Morris', tag: 'MOR', teamName: 'MacLaren Racing', flag: '🇬🇧', number: 4, primaryColor: '#f97316', secondaryColor: '#0284c7', baseSpeed: 298, aggression: 0.95, personalityKey: 'slingshot_hunter' as const },
  // Louis Hammerton: Base speed +10% (297 -> 327)
  { id: 'ai-ham', name: 'Louis Hammerton', tag: 'HAM', teamName: 'Silver Arrow GP', flag: '🇬🇧', number: 44, primaryColor: '#94a3b8', secondaryColor: '#00d2be', baseSpeed: 327, aggression: 0.93, personalityKey: 'legendary_precision' as const },
  { id: 'ai-alz', name: 'Ferdinand Alonzy', tag: 'ALZ', teamName: 'Aston Sovereign F1', flag: '🇪🇸', number: 14, primaryColor: '#064e3b', secondaryColor: '#a3e635', baseSpeed: 296, aggression: 0.94, personalityKey: 'iron_wall' as const },
  { id: 'ai-rus', name: 'Jorge Rustell', tag: 'RUS', teamName: 'Silver Arrow GP', flag: '🇬🇧', number: 63, primaryColor: '#64748b', secondaryColor: '#00d2be', baseSpeed: 295, aggression: 0.90, personalityKey: 'tenacious_fighter' as const },
  { id: 'ai-snz', name: 'Carlo Sainzo', tag: 'SNZ', teamName: 'Scuderia Cavallo', flag: '🇪🇸', number: 55, primaryColor: '#b91c1c', secondaryColor: '#facc15', baseSpeed: 295, aggression: 0.91, personalityKey: 'smooth_operator' as const },
  { id: 'ai-pas', name: 'Oskar Pastri', tag: 'PAS', teamName: 'MacLaren Racing', flag: '🇦🇺', number: 81, primaryColor: '#ea580c', secondaryColor: '#0284c7', baseSpeed: 294, aggression: 0.89, personalityKey: 'ice_cold' as const },
  { id: 'ai-gas', name: 'Piero Gaslynn', tag: 'GAS', teamName: 'Alpina Blue GP', flag: '🇫🇷', number: 10, primaryColor: '#0284c7', secondaryColor: '#f43f5e', baseSpeed: 292, aggression: 0.86, personalityKey: 'underdog_raider' as const },
  // Alex Alboon: Base speed +10% (291 -> 320)
  { id: 'ai-abn', name: 'Alex Alboon', tag: 'ABN', teamName: 'Wilkins Heritage F1', flag: '🇹🇭', number: 23, primaryColor: '#1d4ed8', secondaryColor: '#38bdf8', baseSpeed: 320, aggression: 0.85, personalityKey: 'straight_line_rocket' as const },
  { id: 'ai-hlk', name: 'Niko Hulken', tag: 'HLK', teamName: 'Haas Apex Team', flag: '🇩🇪', number: 27, primaryColor: '#f1f5f9', secondaryColor: '#dc2626', baseSpeed: 290, aggression: 0.84, personalityKey: 'veteran_battler' as const },
];

function initAiCars(round: number = 1, totalLaps: number = 3): AiCar[] {
  // World Tour Seasonal R&D Progression
  const roundIdx = Math.min(18, Math.max(1, round)) - 1; // 0 to 17
  const midLap = totalLaps <= 2 ? 1 : Math.floor(totalLaps / 2) + 1;

  // "รถคันอื่นๆก็มีโอกาสพลาด pits ได้เช่นกัน แต่น้อย"
  const missPitCandidateIdx = (round * 5 + 3) % 11;
  const isRaceWithMissedPit = Math.random() < 0.28;

  return RIVAL_AI_TEMPLATES.map((tmpl, idx) => {
    // Player car sits at world offset ~1380 units ahead of camera.
    // Arrange starting grid from 1600 (P11) to 3400 (P1) ahead of player car (P12)
    const gridZ = 3400 - idx * 180;
    const gridX = idx % 2 === 0 ? -0.32 : 0.32;
    const lanePref = idx % 3 === 0 ? -0.42 : idx % 3 === 1 ? 0.42 : 0.0;

    const scaledBaseSpeed = Math.round(tmpl.baseSpeed - 2 + Math.min(4, roundIdx * 0.3));
    const scaledAggression = Math.min(0.99, tmpl.aggression + Math.min(0.12, roundIdx * 0.01));

    // Realistic tiered pit duration: top teams 1.9s-2.2s, midfield 2.2s-2.5s
    const basePit = idx === 0 ? 1.85 : idx <= 2 ? 1.95 : idx <= 5 ? 2.15 : 2.35;
    const pitDuration = Number((basePit + Math.random() * 0.30).toFixed(2));

    // Disperse AI pit stops across laps & strategies so opponents do not all pit in a single clump:
    let driverPitLap = midLap;
    if (totalLaps >= 4) {
      if (idx % 3 === 0) {
        // Undercut strategy (aggressive early pit)
        driverPitLap = Math.max(1, midLap - 1);
      } else if (idx % 3 === 1) {
        // Standard race strategy
        driverPitLap = midLap;
      } else {
        // Overcut / tire conservation strategy
        driverPitLap = Math.min(totalLaps - 1, midLap + 1);
      }
    } else if (totalLaps === 3) {
      // 3-lap race: early undercut on lap 1 for some aggressive drivers, lap 2 for remainder
      if (idx === 0 || idx === 3 || idx === 8) {
        driverPitLap = 1;
      } else {
        driverPitLap = 2;
      }
    } else {
      driverPitLap = 1;
    }

    return {
      ...tmpl,
      baseSpeed: scaledBaseSpeed,
      aggression: scaledAggression,
      z: gridZ,
      x: gridX,
      targetX: gridX,
      lateralVx: 0,
      speed: 0,
      steerAngle: 0,
      overtakeTimer: Math.random() * 1.5 + 0.6,
      lapsCompleted: 0,
      evadingObstacle: false,
      drsActive: false,
      contactCooldown: 0,
      isBraking: false,
      isCatchUpBeast: false,
      catchUpIntensity: 0,
      isTailgating: false,
      isAttacking: false,
      boostTimer: 0,
      boostCooldown: 0,
      crashStunTimer: 0,
      slowedTimer: 0,
      spinAngle: 0,
      lastObstacleHitType: undefined,
      lastObstacleHitUntil: 0,
      lanePreference: lanePref,
      personalityKey: tmpl.personalityKey,
      personalityActiveTimer: 0,
      personalitySkillName: undefined,
      personalitySkillNameTh: undefined,
      hammerTimeTimer: 0,
      defendingTimer: 0,
      hasPitted: false,
      pitLap: driverPitLap,
      isPitting: false,
      pitStopTimer: 0,
      pitDuration: pitDuration,
      willMissPit: isRaceWithMissedPit && idx === missPitCandidateIdx,
      tireBlown: false,
      pitExitGraceTimer: 0,
      pacePhaseOffset: Math.random() * Math.PI * 2,
      stintTimer: Math.random() * 4 + 2,
      stintMode: idx < 3 ? 'charging' : idx % 2 === 0 ? 'battling' : 'tire_management',
      stintPaceDelta: (Math.random() - 0.45) * 8,
      lockupTimer: 0,
      health: getRivalMaxHealth(tmpl.id, tmpl.name),
      maxHealth: getRivalMaxHealth(tmpl.id, tmpl.name),
      isDnf: false,
      isFire: false,
      hasWetTires: false,
      nitroFuel: 100,
      nitroActive: false,
      nitroTimer: 0,
      nitroDepleted: false,
    };
  });
}

export function getOrdinalSuffix(pos: number): string {
  const rem100 = pos % 100;
  if (rem100 >= 11 && rem100 <= 13) return 'th';
  const rem10 = pos % 10;
  if (rem10 === 1) return 'st';
  if (rem10 === 2) return 'nd';
  if (rem10 === 3) return 'rd';
  return 'th';
}

export function getPrizeEstimate(pos: number, purse?: number): number {
  const baseP1 = Math.max(18_000_000, purse || 18_000_000);
  const scale = baseP1 / 18_000_000;
  let baseAmount = 600_000;
  switch (pos) {
    case 1: baseAmount = 18_000_000; break;
    case 2: baseAmount = 14_000_000; break;
    case 3: baseAmount = 11_000_000; break;
    case 4: baseAmount = 8_800_000; break;
    case 5: baseAmount = 7_200_000; break;
    case 6: baseAmount = 5_600_000; break;
    case 7: baseAmount = 4_500_000; break;
    case 8: baseAmount = 3_600_000; break;
    case 9: baseAmount = 2_800_000; break;
    case 10: baseAmount = 2_000_000; break;
    case 11:
    case 12: baseAmount = 1_000_000; break;
    default: baseAmount = 600_000; break;
  }
  return Math.round((baseAmount * scale) / 25_000) * 25_000;
}

function drawAiCar(
  ctx: CanvasRenderingContext2D,
  car: AiCar,
  screenX: number,
  screenY: number,
  scale: number,
  timestamp: number
) {
  // Proportional full-size F1 competitor car scale
  const carScale = Math.min(3.4, Math.max(0.12, scale * 1750));
  const steer = car.steerAngle;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.scale(carScale, carScale);

  // Responsive car body banking and yaw rotation when turning or spinning from collision
  if (car.spinAngle && car.spinAngle > 0) {
    ctx.rotate((car.spinAngle * Math.PI) / 180);
  } else if (car.crashStunTimer && car.crashStunTimer > 0) {
    const wobble = Math.sin(timestamp * 0.04) * 0.08;
    ctx.rotate(wobble);
  } else {
    ctx.rotate(steer * 0.078);
  }

  // 1. Shadow on asphalt
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(0, 32, 105, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Diffuser & Floor
  ctx.fillStyle = '#090b0e';
  ctx.beginPath();
  ctx.moveTo(-65, 20);
  ctx.lineTo(65, 20);
  ctx.lineTo(55, 32);
  ctx.lineTo(-55, 32);
  ctx.closePath();
  ctx.fill();

  // 3. Wide Slick Rear Tires
  const tireW = 32;
  const tireH = 58;
  const tireDist = 76;

  // Suspension struts
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-28, 6);
  ctx.lineTo(-tireDist + 10, 0);
  ctx.moveTo(28, 6);
  ctx.lineTo(tireDist - 10, 0);
  ctx.stroke();

  // Left Rear Tire
  ctx.fillStyle = '#0d1117';
  ctx.beginPath();
  ctx.roundRect(-tireDist - tireW / 2, 4 - tireH / 2, tireW, tireH, 5);
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-tireDist, 8, tireH / 2 - 4, Math.PI * 0.6, Math.PI * 1.4);
  ctx.stroke();

  // Right Rear Tire
  ctx.fillStyle = '#0d1117';
  ctx.beginPath();
  ctx.roundRect(tireDist - tireW / 2, 4 - tireH / 2, tireW, tireH, 5);
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(tireDist, 8, tireH / 2 - 4, -Math.PI * 0.4, Math.PI * 0.4);
  ctx.stroke();

  // 4. Sidepods
  ctx.fillStyle = car.secondaryColor;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(-58, 8);
  ctx.lineTo(-52, 22);
  ctx.lineTo(-28, 18);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(28, 0);
  ctx.lineTo(58, 8);
  ctx.lineTo(52, 22);
  ctx.lineTo(28, 18);
  ctx.closePath();
  ctx.fill();

  // 5. Engine Cover Spine & Main Bodywork
  ctx.fillStyle = car.primaryColor;
  ctx.beginPath();
  ctx.moveTo(-48 + steer * 3, 18);
  ctx.lineTo(-26 + steer * 2, -8);
  ctx.lineTo(-14 + steer * 1.5, -40);
  ctx.lineTo(14 + steer * 1.5, -40);
  ctx.lineTo(26 + steer * 2, -8);
  ctx.lineTo(48 + steer * 3, 18);
  ctx.lineTo(30, 24);
  ctx.lineTo(-30, 24);
  ctx.closePath();
  ctx.fill();

  // Shark Fin Spine
  ctx.fillStyle = car.secondaryColor;
  ctx.beginPath();
  ctx.moveTo(steer * 2, -40);
  ctx.lineTo(steer * 2.5, -12);
  ctx.lineTo(steer * 2 + 2, -12);
  ctx.lineTo(steer * 2 + 2, -40);
  ctx.closePath();
  ctx.fill();

  // 6. Cockpit, Halo Arch & Helmet
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.arc(steer * 3, -26, 14, Math.PI, 0);
  ctx.stroke();

  // Helmet with visor
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(steer * 3, -24, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = car.primaryColor;
  ctx.beginPath();
  ctx.arc(steer * 3, -24, 9, Math.PI * 0.8, Math.PI * 1.5);
  ctx.fill();
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(steer * 3, -25, 6, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();

  // Airbox Intake & T-Cam
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.ellipse(steer * 2, -40, 7, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#090b0e';
  ctx.fillRect(-3 + steer * 2, -48, 6, 4);

  // 7. Rear Wing & Endplates
  const wingY = -50;
  const wingW = 138;
  const wingH = 15;

  ctx.fillStyle = car.secondaryColor;
  ctx.fillRect(-wingW / 2, wingY - 6, 6, 26);
  ctx.fillRect(wingW / 2 - 6, wingY - 6, 6, 26);

  ctx.fillStyle = car.primaryColor;
  ctx.beginPath();
  ctx.roundRect(-wingW / 2 + 4, wingY, wingW - 8, wingH, 3);
  ctx.fill();

  // DRS Flap Slot: when active, upper aerodynamic flap opens up with cyan DRS glow, attack crimson glow, or purple catch-up flame glow
  if (car.drsActive || car.isCatchUpBeast || car.isAttacking) {
    const isTail = car.isTailgating;
    const isAttack = car.isAttacking;
    const isBeast = car.isCatchUpBeast;
    ctx.fillStyle = isTail || isAttack ? '#ef4444' : isBeast ? '#a855f7' : '#06b6d4';
    ctx.fillRect(-wingW / 3, wingY - 7, (wingW * 2) / 3, 4);
    // Translucent halo ellipse instead of expensive shadowBlur
    const glowCol = isTail || isAttack ? 'rgba(248, 113, 113, 0.45)' : isBeast ? 'rgba(192, 132, 252, 0.45)' : 'rgba(6, 182, 212, 0.45)';
    ctx.fillStyle = glowCol;
    ctx.beginPath();
    ctx.ellipse(0, wingY - 5, (wingW * 0.40), 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isTail || isAttack ? '#fecaca' : isBeast ? '#f0abfc' : '#38bdf8';
    ctx.lineWidth = isBeast || isAttack ? 2.2 : 1.5;
    ctx.strokeRect(-wingW / 3, wingY - 7, (wingW * 2) / 3, 4);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-wingW / 4, wingY + 3, wingW / 2, 3);
  }

  // DUAL AFTERBURNER FLAMES WHEN IN BOOSTER PAD ACTIVE MODE (390-440+ KM/H)
  if (car.boostTimer && car.boostTimer > 0) {
    const flameLen = 28 + Math.random() * 26;
    const flameW = 12 + Math.random() * 6;
    // Central blazing thrust cone
    const flameGrad = ctx.createLinearGradient(0, 24, 0, 24 + flameLen);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.2, '#38bdf8');
    flameGrad.addColorStop(0.5, '#facc15');
    flameGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.ellipse(0, 24 + flameLen * 0.5, flameW * 0.5, flameLen * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Twin side exhaust flames
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(-14, 22 + flameLen * 0.35, 4, flameLen * 0.35, 0, 0, Math.PI * 2);
    ctx.ellipse(14, 22 + flameLen * 0.35, 4, flameLen * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Booster supersonic thrust spark streaks
    for (let spk = 0; spk < 3; spk++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#fef08a';
      ctx.fillRect((Math.random() - 0.5) * 24, 28 + Math.random() * 28, 2.5, 2.5);
    }
  }

  // Turbo Exhaust Afterburner Flames when AI is in secret catch-up mode
  if (car.isCatchUpBeast) {
    const flameLen = 16 + Math.random() * 20;
    const flameW = 9 + Math.random() * 5;
    const flameGrad = ctx.createLinearGradient(0, 24, 0, 24 + flameLen);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.35, car.isTailgating ? '#f43f5e' : '#38bdf8');
    flameGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.ellipse(0, 24 + flameLen * 0.5, flameW * 0.5, flameLen * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hot golden exhaust sparks
    if (Math.random() < 0.6) {
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect((Math.random() - 0.5) * 16, 26 + Math.random() * 14, 2.5, 2.5);
    }
  }

  // AI NITRO BOOST AFTERBURNER FLAMES ("ให้ผู้แข่งขันสามรรถใช้ nitro ได้เช่นกันด้วย")
  if (car.nitroActive) {
    const flameLen = 32 + Math.random() * 24;
    const flameW = 14 + Math.random() * 6;
    const flameGrad = ctx.createLinearGradient(0, 24, 0, 24 + flameLen);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.25, '#06b6d4');
    flameGrad.addColorStop(0.7, '#3b82f6');
    flameGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.ellipse(0, 24 + flameLen * 0.5, flameW * 0.5, flameLen * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Twin side exhaust plumes (Electric Cyan & Violet)
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(-14, 22 + flameLen * 0.4, 5, flameLen * 0.4, 0, 0, Math.PI * 2);
    ctx.ellipse(14, 22 + flameLen * 0.4, 5, flameLen * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Electric plasma sparks
    for (let spk = 0; spk < 3; spk++) {
      ctx.fillStyle = Math.random() > 0.4 ? '#38bdf8' : '#a855f7';
      ctx.fillRect((Math.random() - 0.5) * 22, 28 + Math.random() * 26, 2.5, 2.5);
    }
  }

  // Billowing progressive smoke plumes and raging fire flames ("ยิ่งใกล้พังยิ่งมีควันเยอะขึ้น", "คู่แข่งก็เป็นได้เหมือนกัน", "ถ้ารถคู่แข่งพังก็ให้ขึ้นไฟไหม้ และอยู่เฉยๆ")
  const isAiOnFire = !!(car.isFire || (car.health !== undefined && car.health <= 0));
  const carMaxHp = car.maxHealth || getRivalMaxHealth(car.id, car.name);
  const aiHealth = car.health !== undefined ? car.health : carMaxHp;
  const isStunnedOrSlowed = !!((car.crashStunTimer && car.crashStunTimer > 0) || (car.slowedTimer && car.slowedTimer > 0));

  if (isAiOnFire) {
    // 1. Blazing animated fire flames leaping from engine bay, cockpit, and exhaust!
    ctx.fillStyle = 'rgba(249, 115, 22, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    const flameHeight = 44 + Math.sin(timestamp * 0.05) * 18;
    const flameTongues = [
      { x: -20, yOff: 10, h: flameHeight * 0.85, w: 16, col: '#dc2626' },
      { x: 20, yOff: 10, h: flameHeight * 0.85, w: 16, col: '#dc2626' },
      { x: -8, yOff: -5, h: flameHeight * 1.15, w: 18, col: '#ea580c' },
      { x: 8, yOff: -5, h: flameHeight * 1.15, w: 18, col: '#f97316' },
      { x: 0, yOff: -16, h: flameHeight * 1.4, w: 22, col: '#facc15' },
      { x: (Math.sin(timestamp * 0.06) * 8), yOff: -12, h: flameHeight * 1.0, w: 14, col: '#fef08a' },
    ];
    flameTongues.forEach((f) => {
      ctx.fillStyle = f.col;
      ctx.beginPath();
      ctx.moveTo(f.x - f.w / 2, f.yOff);
      ctx.quadraticCurveTo(f.x + (Math.sin(timestamp * 0.08 + f.x) * 8), f.yOff - f.h * 0.6, f.x, f.yOff - f.h);
      ctx.quadraticCurveTo(f.x - (Math.sin(timestamp * 0.08 + f.x) * 8), f.yOff - f.h * 0.6, f.x, f.yOff - f.h);
      ctx.closePath();
      ctx.fill();
    });

    // 2. Thick black billowing smoke plumes rising high into the sky
    for (let s = 0; s < 6; s++) {
      const sPhase = (timestamp * 0.0035 + s * 0.16) % 1;
      const sRad = 18 + sPhase * 42;
      const sY = -35 - sPhase * 95;
      const sX = (s % 2 === 0 ? 1 : -1) * sPhase * 28 + Math.sin(timestamp * 0.02 + s) * 10;
      ctx.fillStyle = `rgba(15, 23, 42, ${0.92 * (1 - sPhase)})`;
      ctx.beginPath();
      ctx.arc(sX, sY, sRad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Crackling fiery ember sparks shooting up
    for (let e = 0; e < 5; e++) {
      const ePhase = (timestamp * 0.006 + e * 0.2) % 1;
      const eX = Math.sin(timestamp * 0.03 + e * 1.5) * 25;
      const eY = -15 - ePhase * 65;
      ctx.fillStyle = e % 2 === 0 ? '#fbbf24' : '#ef4444';
      ctx.beginPath();
      ctx.arc(eX, eY, 2.5 * (1 - ePhase * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (aiHealth < (carMaxHp * 0.8) || isStunnedOrSlowed) {
    // Progressive smoke plumes based on damage: ("ยิ่งใกล้พังยิ่งมีควันเยอะขึ้น")
    const puffCount = aiHealth < (carMaxHp * 0.25) ? 5 : aiHealth < (carMaxHp * 0.5) ? 4 : isStunnedOrSlowed ? 3 : 2;
    const smokeDarkness = aiHealth < (carMaxHp * 0.25) ? '15, 23, 42' : aiHealth < (carMaxHp * 0.5) ? '30, 41, 59' : '71, 85, 105';
    const smokeOpacity = aiHealth < (carMaxHp * 0.25) ? 0.88 : aiHealth < (carMaxHp * 0.5) ? 0.75 : 0.55;

    for (let s = 0; s < puffCount; s++) {
      const sPhase = (timestamp * 0.003 + s * (1 / puffCount)) % 1;
      const sRad = (aiHealth < (carMaxHp * 0.25) ? 14 : 10) + sPhase * (aiHealth < (carMaxHp * 0.25) ? 28 : 20);
      const sY = -15 - sPhase * (aiHealth < (carMaxHp * 0.25) ? 55 : 38);
      const sX = (s % 2 === 0 ? 1 : -1) * sPhase * 18;
      ctx.fillStyle = `rgba(${smokeDarkness}, ${smokeOpacity * (1 - sPhase)})`;
      ctx.beginPath();
      ctx.arc(sX, sY, sRad, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fiery ember sparks for heavily damaged rival cars (< 30% health)
    if (aiHealth < (carMaxHp * 0.3) && Math.random() < 0.4) {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc((Math.random() - 0.5) * 22, -18 - Math.random() * 25, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 8. Central FIA Rain / Hazard Light
  const isBraking = car.isBraking;
  const blink = isBraking || isStunnedOrSlowed || isAiOnFire || car.isTailgating || Math.sin(timestamp * 0.015) > 0;
  ctx.fillStyle = isAiOnFire
    ? '#ef4444'
    : isStunnedOrSlowed
    ? Math.sin(timestamp * 0.03) > 0 ? '#ef4444' : '#f59e0b'
    : blink ? '#ef4444' : '#581c87';
  ctx.beginPath();
  ctx.roundRect(-6, 18, 12, 6, 2);
  ctx.fill();
  if (blink || isStunnedOrSlowed || isAiOnFire) {
    // Translucent glowing ellipse instead of expensive ctx.shadowBlur
    const haloCol = isAiOnFire
      ? 'rgba(239, 68, 68, 0.45)'
      : isStunnedOrSlowed
      ? 'rgba(245, 158, 11, 0.45)'
      : 'rgba(239, 68, 68, 0.40)';
    ctx.fillStyle = haloCol;
    ctx.beginPath();
    ctx.ellipse(0, 21, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isAiOnFire ? '#ef4444' : isStunnedOrSlowed ? '#f59e0b' : '#ef4444';
    ctx.fillRect(-3, 19, 6, 4);
  }

  // 9. Floating Driver Tag Pill Badge (visible within medium distance) with Driver Personalities
  if (carScale > 0.35) {
    const isStunned = !!(car.crashStunTimer && car.crashStunTimer > 0);
    const isSlowed = !!(car.slowedTimer && car.slowedTimer > 0);
    const isBeast = car.isCatchUpBeast;
    const isTail = car.isTailgating;
    const isSkillActive = !!(car.personalityActiveTimer && car.personalityActiveTimer > 0 && car.personalitySkillName);
    const personality = getDriverPersonality(car.id);

    const badgeW = isAiOnFire ? 104 : isSkillActive ? 108 : isStunned || isSlowed ? 88 : 74;
    ctx.fillStyle = isAiOnFire
      ? 'rgba(127, 29, 29, 0.98)'
      : isStunned
      ? 'rgba(69, 10, 10, 0.96)'
      : isSlowed
      ? 'rgba(65, 30, 5, 0.95)'
      : isSkillActive
      ? personality.badgeBg
      : isTail
      ? 'rgba(40, 10, 15, 0.96)'
      : isBeast
      ? 'rgba(30, 10, 35, 0.95)'
      : 'rgba(9, 11, 14, 0.88)';

    ctx.strokeStyle = isAiOnFire
      ? '#ef4444'
      : isStunned
      ? '#ef4444'
      : isSlowed
      ? '#f59e0b'
      : isSkillActive
      ? personality.badgeBorder
      : isTail
      ? '#ef4444'
      : isBeast
      ? '#c084fc'
      : car.primaryColor;

    ctx.lineWidth = isAiOnFire || isSkillActive || isStunned || isSlowed || isBeast ? 2 : 1.5;
    ctx.beginPath();
    ctx.roundRect(-badgeW / 2, wingY - 26, badgeW, 18, 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isAiOnFire
      ? '#fecaca'
      : isStunned
      ? '#fca5a5'
      : isSlowed
      ? '#fde68a'
      : isSkillActive
      ? personality.badgeText
      : isTail
      ? '#fca5a5'
      : isBeast
      ? '#f0abfc'
      : '#ffffff';
    ctx.font = 'bold 9.5px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const tagText = isAiOnFire
      ? `🔥 ${car.tag} DNF FIRE`
      : isStunned
      ? `💥 ${car.tag} CRASH`
      : isSlowed
      ? `⚠️ ${car.tag} SLOW`
      : isSkillActive
      ? `${personality.icon} ${car.tag} • ${car.personalitySkillName}`
      : isTail
      ? `🔥 ${car.tag} TAIL`
      : isBeast
      ? `⚡ ${car.tag} BOOST`
      : `${personality.icon} ${car.number} ${car.tag}`;
    ctx.fillText(tagText, 0, wingY - 17);
  }

  ctx.restore();
}

// =============================================================================
// CONFETTI CELEBRATION (ฉลองเมื่อเข้าเส้นชัย 3 อันดับแรก)
// 60FPS Metallic Fluttering Ticker-Tape Particles & Podiums
// =============================================================================
interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  wobble: number;
  wobbleSpeed: number;
  tilt: number;
  tiltSpeed: number;
  color: string;
  shape: 'ribbon' | 'rect' | 'circle' | 'star';
}

export const ConfettiCelebration: React.FC<{ rank: number }> = ({ rank }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const palette = [
      '#ffd700', // Metallic Gold
      '#fbbf24', // Amber
      '#f59e0b', // Deep Gold
      '#f8fafc', // Platinum White
      '#ea580c', // Bronze / Copper
      '#06b6d4', // Electric Cyan
      '#38bdf8', // Neon Sky
      '#ef4444', // Ruby Red
      '#10b981', // Emerald Green
      '#ec4899', // Bright Pink
      '#a855f7', // Electric Violet
    ];

    const piecesCount = 170;
    const pieces: ConfettiParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < piecesCount; i++) {
      const isRibbon = Math.random() < 0.35;
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        w: isRibbon ? 5 + Math.random() * 4 : 8 + Math.random() * 8,
        h: isRibbon ? 16 + Math.random() * 16 : 8 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 2.4 + Math.random() * 3.6,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.04 + Math.random() * 0.08,
        tilt: Math.random() * Math.PI * 2,
        tiltSpeed: 0.05 + Math.random() * 0.08,
        color: palette[Math.floor(Math.random() * palette.length)],
        shape: isRibbon ? 'ribbon' : Math.random() < 0.22 ? 'star' : 'rect',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < pieces.length; i++) {
        const p = pieces[i];
        p.wobble += p.wobbleSpeed;
        p.tilt += p.tiltSpeed;
        p.x += Math.sin(p.wobble) * 2.2 + p.vx;
        p.y += p.vy;

        // Recirculate from above for continuous rain while viewing podium
        if (p.y > canvas.height + 25) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.vy = 2.4 + Math.random() * 3.6;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.wobble) * 0.5);
        ctx.scale(1, Math.cos(p.tilt)); // 3D end-over-end flipping

        ctx.fillStyle = p.color;
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          // Shimmering 4-point star
          ctx.beginPath();
          ctx.moveTo(0, -p.h / 2);
          ctx.lineTo(p.w / 4, -p.h / 6);
          ctx.lineTo(p.w / 2, 0);
          ctx.lineTo(p.w / 4, p.h / 6);
          ctx.lineTo(0, p.h / 2);
          ctx.lineTo(-p.w / 4, p.h / 6);
          ctx.lineTo(-p.w / 2, 0);
          ctx.lineTo(-p.w / 4, -p.h / 6);
          ctx.closePath();
          ctx.fill();
        } else {
          // Fluttering rectangular metallic ribbon / flake
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Festive top celebratory podium ribbon */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-black/85 border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.7)] font-racing">
        <span className="text-xl">🏆</span>
        <span className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-300 drop-shadow">
          {rank === 1
            ? '🥇 1ST PLACE WINNER • VICTORY PODIUM!'
            : rank === 2
            ? '🥈 2ND PLACE FINISH • PODIUM CELEBRATION!'
            : '🥉 3RD PLACE FINISH • PODIUM CELEBRATION!'}
        </span>
        <span className="text-xl">🍾</span>
      </div>
    </div>
  );
};

// =============================================================================
// MODULE-SCOPE CONSTANTS & HIGH-PERFORMANCE RENDERING PIPELINE
// =============================================================================

// Format Milliseconds to MM:SS.mmm
export const formatLapTime = (ms: number): string => {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const millis = Math.floor(ms % 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis
    .toString()
    .padStart(3, '0')}`;
};

export const CROWD_SECTION_COLORS: readonly [string, string][] = [
  ['#dc2626', '#b91c1c'], // Ferrari Tifosi Red
  ['#1e3a8a', '#172554'], // Red Bull Navy
  ['#0d9488', '#115e59'], // Mercedes Teal
  ['#ea580c', '#c2410c'], // McLaren Papaya
  ['#15803d', '#166534'], // Aston Martin Green
  ['#eab308', '#ca8a04'], // Pirelli Yellow
  ['#f8fafc', '#cbd5e1'], // White
];

export const GRANDSTAND_TIERS = [
  { inOff: 0.12, outOff: 0.44, h: 0.18, capH: 0.28 },
  { inOff: 0.44, outOff: 0.78, h: 0.28, capH: 0.44 },
  { inOff: 0.78, outOff: 1.14, h: 0.44, capH: 0.62 }, // VIP Suite tier
  { inOff: 1.14, outOff: 1.52, h: 0.62, capH: 0.82 },
  { inOff: 1.52, outOff: 1.94, h: 0.82, capH: 1.04 },
] as const;

export const LAMP_OFFSET_FACTORS = [-0.35, 0, 0.35] as const;

// Polygon Raster rendering helper with bottom extension parameter to prevent subpixel seams
export const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
  color: string,
  extendBottom: number = 0
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1 + extendBottom);
  ctx.lineTo(x2, y2 + extendBottom);
  ctx.lineTo(x3, y3);
  ctx.lineTo(x4, y4);
  ctx.closePath();
  ctx.fill();
};

// 3D Continuous Grandstand Segment Renderer (Module Scope with 3-Level LOD)
export const draw3DGrandstandSegment = (
  ctx: CanvasRenderingContext2D,
  rawX1: number,
  y1: number,
  w1: number,
  rawX2: number,
  y2: number,
  w2: number,
  segIndex: number,
  side: -1 | 1
) => {
  // Relaxed threshold to prevent popping at distance
  if (w1 < 0.3) return;

  // Round x coordinates with Math.round to eliminate subpixel seam gaps
  const x1 = Math.round(rawX1);
  const x2 = Math.round(rawX2);

  // Render grandstand following exact segment elevation even if road scanline is obscured by hill (y1 <= y2)
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

  // 1. FRONT CRASH BARRIER / SAFETY WALL (extended bottom edge by 1px)
  const bInX1 = Math.round(x1 + s * (w1 * baseOffset));
  const bInX2 = Math.round(x2 + s * (w2 * baseOffset));
  const bOutX1 = Math.round(x1 + s * (w1 * (baseOffset + 0.08)));
  const bOutX2 = Math.round(x2 + s * (w2 * (baseOffset + 0.08)));

  const barrierColor = isAlt ? '#334155' : '#1e293b';
  drawPolygon(ctx, bInX1, effY1, bInX1, effY1 - barrierH1, bInX2, y2 - barrierH2, bInX2, y2, barrierColor, 1);
  drawPolygon(ctx, bInX1, effY1 - barrierH1, bOutX1, effY1 - barrierH1, bOutX2, y2 - barrierH2, bInX2, y2 - barrierH2, '#94a3b8');

  // Sponsor ribbon along barrier face
  const stripeH1 = barrierH1 * 0.35;
  const stripeH2 = barrierH2 * 0.35;
  const stripeCol = isQuadAlt ? '#dc2626' : '#ffffff';
  drawPolygon(ctx, bInX1, effY1, bInX1, effY1 - stripeH1, bInX2, y2 - stripeH2, bInX2, y2, stripeCol, 1);

  // Steel mesh posts
  if (segIndex % 2 === 0 && w1 >= 4) {
    const postH1 = barrierH1 * 2.2;
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = Math.max(1, w1 * 0.015);
    ctx.beginPath();
    ctx.moveTo(bInX1, effY1 - barrierH1);
    ctx.lineTo(bInX1, effY1 - postH1);
    ctx.stroke();
  }

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
    drawPolygon(ctx, tInX1, effY1 - barrierH1, tOutX1, effY1 - wallTopH1, tOutX2, y2 - wallTopH2, tInX2, y2 - barrierH2, blockColor, 1);

    const backX1 = Math.round(x1 + s * (w1 * (baseOffset + topTier.outOff + 0.05)));
    const backX2 = Math.round(x2 + s * (w2 * (baseOffset + topTier.outOff + 0.05)));
    drawPolygon(ctx, tOutX1, effY1 - wallTopH1, backX1, effY1, backX2, y2, tOutX2, y2 - wallTopH2, isAlt ? '#090d16' : '#0f172a', 1);
  } else if (w1 < 60) {
    // MID LOD (24 <= w1 < 60): 2 seating tiers, NO VIP glass, NO Jumbotron, NO pillar girders
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

      // Vertical Concrete Riser
      const riserColor = isAlt ? '#1e293b' : '#0f172a';
      drawPolygon(ctx, tInX1, effY1 - prevH1, tInX1, effY1 - stepH1, tInX2, y2 - stepH2, tInX2, y2 - prevH2, riserColor, 1);

      // Standard Spectator Rows
      const seatColor = isAlt ? crowdPrimary : crowdSecondary;
      drawPolygon(ctx, tInX1, effY1 - stepH1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, tInX2, y2 - stepH2, seatColor, 1);
    }

    // Mid LOD back wall
    const midTopTier = GRANDSTAND_TIERS[numMidTiers - 1];
    const backX1 = Math.round(x1 + s * (w1 * (baseOffset + midTopTier.outOff)));
    const backX2 = Math.round(x2 + s * (w2 * (baseOffset + midTopTier.outOff)));
    const backWallColor = isAlt ? '#090d16' : '#0f172a';
    drawPolygon(ctx, backX1, effY1, backX1, effY1 - wallTopH1, backX2, y2 - wallTopH2, backX2, y2, backWallColor, 1);
  } else {
    // CLOSE-UP FULL DETAIL (w1 >= 60): 5 distinct tiers + VIP glass hospitality lounge
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

      // Vertical Concrete Riser
      const riserColor = isAlt ? '#1e293b' : '#0f172a';
      drawPolygon(ctx, tInX1, effY1 - prevH1, tInX1, effY1 - stepH1, tInX2, y2 - stepH2, tInX2, y2 - prevH2, riserColor, 1);

      if (t === 2) {
        // TIER 2: VIP Panoramic Hospitality Suite (Architectural Tinted Glass)
        const glassColor = isAlt ? '#0369a1' : '#0284c7';
        drawPolygon(ctx, tInX1, effY1 - stepH1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, tInX2, y2 - stepH2, glassColor, 1);
        const loungeX1 = Math.round(tInX1 + (tOutX1 - tInX1) * 0.45);
        const loungeX2 = Math.round(tInX2 + (tOutX2 - tInX2) * 0.45);
        const loungeY1 = (effY1 - stepH1) + ((effY1 - capH1) - (effY1 - stepH1)) * 0.45;
        const loungeY2 = (y2 - stepH2) + ((y2 - capH2) - (y2 - stepH2)) * 0.45;
        drawPolygon(ctx, loungeX1, loungeY1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, loungeX2, loungeY2, 'rgba(254, 240, 138, 0.65)', 1);
      } else {
        // Standard Spectator Rows
        const seatColor = isAlt ? crowdPrimary : crowdSecondary;
        drawPolygon(ctx, tInX1, effY1 - stepH1, tOutX1, effY1 - capH1, tOutX2, y2 - capH2, tInX2, y2 - stepH2, seatColor, 1);

        const railH1 = (capH1 - stepH1) * 0.25;
        const railH2 = (capH2 - stepH2) * 0.25;
        drawPolygon(ctx, tInX1, effY1 - stepH1, tInX1, effY1 - stepH1 - railH1, tInX2, y2 - stepH2 - railH2, tInX2, y2 - stepH2, '#64748b', 1);
      }
    }

    // Back wall
    const topTier = GRANDSTAND_TIERS[GRANDSTAND_TIERS.length - 1];
    const backX1 = Math.round(x1 + s * (w1 * (baseOffset + topTier.outOff)));
    const backX2 = Math.round(x2 + s * (w2 * (baseOffset + topTier.outOff)));
    const backWallColor = isAlt ? '#090d16' : '#0f172a';
    drawPolygon(ctx, backX1, effY1, backX1, effY1 - wallTopH1, backX2, y2 - wallTopH2, backX2, y2, backWallColor, 1);

    // GIANT LED JUMBOTRON SCREEN (only for close-up w1 >= 60)
    const jumbMod = segIndex % 16;
    if (jumbMod >= 0 && jumbMod <= 2) {
      const jumbTier = GRANDSTAND_TIERS[3];
      const jumbH_Bot1 = w1 * (jumbTier.h + 0.15);
      const jumbH_Bot2 = w2 * (jumbTier.h + 0.15);
      const jumbH_Top1 = jumbH_Bot1 + w1 * 0.42;
      const jumbH_Top2 = jumbH_Bot2 + w2 * 0.42;

      const jumbX1 = Math.round(x1 + s * (w1 * (baseOffset + jumbTier.inOff + 0.12)));
      const jumbX2 = Math.round(x2 + s * (w2 * (baseOffset + jumbTier.inOff + 0.12)));

      drawPolygon(ctx, jumbX1, effY1 - jumbH_Bot1, jumbX1, effY1 - jumbH_Top1, jumbX2, y2 - jumbH_Top2, jumbX2, y2 - jumbH_Bot2, '#020617', 1);
      const dispBorder1 = w1 * 0.02;
      const dispBorder2 = w2 * 0.02;
      drawPolygon(
        ctx,
        jumbX1 + s * dispBorder1, effY1 - (jumbH_Bot1 + dispBorder1),
        jumbX1 + s * dispBorder1, effY1 - (jumbH_Top1 - dispBorder1),
        jumbX2 + s * dispBorder2, y2 - (jumbH_Top2 - dispBorder2),
        jumbX2 + s * dispBorder2, y2 - (jumbH_Bot2 + dispBorder2),
        isAlt ? '#082f49' : '#0c4a6e',
        1
      );
    }

    // Structural A-Frame Pillar Girders (only for close-up w1 >= 60)
    if (segIndex % 8 === 0) {
      const colW1 = Math.max(2, w1 * 0.04);
      drawPolygon(
        ctx,
        backX1 - colW1, effY1,
        backX1 - colW1, effY1 - roofBackH1,
        backX1 + colW1, effY1 - roofBackH1,
        backX1 + colW1, effY1,
        '#334155',
        1
      );
    }
  }

  // 4. CANTILEVER CANOPY ROOF (Drawn for all LODs)
  const topTier = GRANDSTAND_TIERS[GRANDSTAND_TIERS.length - 1];
  const roofFrontOff = baseOffset + 0.05;
  const roofBackOff = baseOffset + topTier.outOff + 0.18;

  const rfX1 = Math.round(x1 + s * (w1 * roofFrontOff));
  const rfX2 = Math.round(x2 + s * (w2 * roofFrontOff));
  const rbX1 = Math.round(x1 + s * (w1 * roofBackOff));
  const rbX2 = Math.round(x2 + s * (w2 * roofBackOff));

  // Underside Shadow
  drawPolygon(ctx, rfX1, effY1 - roofFrontH1, rbX1, effY1 - roofBackH1, rbX2, y2 - roofBackH2, rfX2, y2 - roofFrontH2, '#050811', 1);

  // Aerodynamic Top Metallic Canopy
  const roofThick1 = Math.max(1.8, w1 * 0.045);
  const roofThick2 = Math.max(1.8, w2 * 0.045);
  const roofTopColor = isAlt ? '#f1f5f9' : '#cbd5e1';
  drawPolygon(
    ctx,
    rfX1, effY1 - (roofFrontH1 + roofThick1),
    rbX1, effY1 - (roofBackH1 + roofThick1),
    rbX2, y2 - (roofBackH2 + roofThick2),
    rfX2, y2 - (roofFrontH2 + roofThick2),
    roofTopColor,
    1
  );

  // Front Fascia Ribbon
  const ribbonH1 = Math.max(2, w1 * 0.09);
  const ribbonH2 = Math.max(2, w2 * 0.09);
  const ribbonColor = isQuadAlt ? '#dc2626' : '#b91c1c';
  drawPolygon(
    ctx,
    rfX1, effY1 - (roofFrontH1 - ribbonH1),
    rfX1, effY1 - (roofFrontH1 + roofThick1),
    rfX2, y2 - (roofFrontH2 + roofThick2),
    rfX2, y2 - (roofFrontH2 - ribbonH2),
    ribbonColor,
    1
  );

  // Floodlight Masts
  if (segIndex % 8 === 0) {
    const mastH1 = roofBackH1 * 1.48;
    const mastTopY1 = effY1 - mastH1;
    const mastW1 = Math.max(2, w1 * 0.045);

    ctx.fillStyle = '#334155';
    ctx.fillRect(rbX1 - mastW1 / 2, mastTopY1, mastW1, mastH1 - roofBackH1);

    const gantryW1 = Math.max(6, w1 * 0.14);
    const gantryH1 = Math.max(3, w1 * 0.05);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(rbX1 - gantryW1 / 2, mastTopY1 - gantryH1, gantryW1, gantryH1);

    const lampRad = Math.max(1.8, w1 * 0.035);
    ctx.fillStyle = '#ffffff';
    for (let l = 0; l < LAMP_OFFSET_FACTORS.length; l++) {
      const lx = gantryW1 * LAMP_OFFSET_FACTORS[l];
      ctx.beginPath();
      ctx.arc(rbX1 + lx, mastTopY1 - gantryH1 / 2, lampRad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(254, 240, 138, 0.32)';
    ctx.beginPath();
    ctx.arc(rbX1, mastTopY1 - gantryH1 / 2, gantryW1 * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
};

// Pre-allocated Projected Segments Pool (reused every frame to eliminate GC allocation spikes)
export interface ProjectedSegmentItem {
  seg: Segment;
  x1: number;
  y1: number;
  w1: number;
  scale: number;
  x2: number;
  y2: number;
  w2: number;
}

export const MAX_PROJECTED_SEGMENTS = 400;
export const projectedSegmentsPool: ProjectedSegmentItem[] = Array.from(
  { length: MAX_PROJECTED_SEGMENTS },
  () => ({
    seg: null as unknown as Segment,
    x1: 0,
    y1: 0,
    w1: 0,
    scale: 0,
    x2: 0,
    y2: 0,
    w2: 0,
  })
);

// Unified HUD Alert Queue Item
export interface HudAlertItem {
  id: string;
  priority: 'critical' | 'rival' | 'info';
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  createdAt: number;
}

// =============================================================================
// MEMOIZED HUD SUBCOMPONENTS (RE-RENDER ONLY WHEN REQUIRED PROPS CHANGE)
// =============================================================================

// 1. Top-Left Rank & Time Display
export const HudRankTime = React.memo<{
  pos: number;
  currentLapTime: number;
  rivalAhead: { tag: string; gapM: number } | null;
  rivalBehind: { tag: string; gapM: number } | null;
  primaryColor: string;
}>(({ pos, currentLapTime, rivalAhead, rivalBehind, primaryColor }) => {
  return (
    <div className="absolute top-2.5 left-3 sm:top-3 sm:left-4 z-20 flex items-start gap-2.5 sm:gap-3 pointer-events-none select-none max-w-[28%]">
      {/* Competitor ladder indicator */}
      <div className="hidden sm:flex flex-col items-center gap-1 bg-black/70 p-1.5 rounded-xl border border-slate-800/80 shadow-lg">
        <div className="w-7 h-7 rounded-full border border-amber-400 bg-[#0d131f] flex items-center justify-center overflow-hidden">
          <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white/60" style={{ backgroundColor: primaryColor || '#dc2626' }} />
        </div>
        <div className="flex flex-col gap-0.5">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const isActive = i === Math.min(6, Math.max(1, Math.ceil((pos / 12) * 6)));
            return (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isActive ? 'bg-amber-400 scale-125' : 'bg-slate-600/50'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span className="text-4xl sm:text-6xl font-black font-racing text-amber-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] tracking-tight">
            {pos}
          </span>
          <span className="text-xl sm:text-2xl font-black font-racing text-amber-300 drop-shadow-md ml-1">
            {getOrdinalSuffix(pos)}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-black/70 rounded-md border border-slate-800 text-[10px] sm:text-xs font-mono font-bold text-white tracking-wider">
            TIME {formatLapTime(currentLapTime)}
          </span>
        </div>

        {(rivalAhead || rivalBehind) && (
          <div className="mt-1 px-2 py-1 bg-black/70 rounded-lg border border-slate-800 text-[10px] font-mono space-y-0.5 max-w-[130px]">
            {rivalAhead && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 text-[9px]">AHEAD</span>
                <span className="font-bold text-red-400">{rivalAhead.tag}</span>
                <span className="text-emerald-400 font-bold">+{rivalAhead.gapM}m</span>
              </div>
            )}
            {rivalBehind && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 text-[9px]">BEHIND</span>
                <span className="font-bold text-amber-400">{rivalBehind.tag}</span>
                <span className="text-red-400 font-bold">-{rivalBehind.gapM}m</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// 2. Circuit Radar Mini-Map
export const HudRadarMap = React.memo<{
  circuitName: string;
  country: string;
  flag: string;
  miniMapSvgPath: string;
  miniMapStartFinish: { x: number; y: number } | null;
  aiPositions: { id: string; tag: string; color: string; progress: number; mapX: number; mapY: number; isCatchUp?: boolean; isTailgating?: boolean; isPitting?: boolean }[];
  playerMapPos: { x: number; y: number };
  playerHasPitted: boolean;
  lap: number;
  totalLaps: number;
  pos: number;
}>(({ circuitName, country, flag, miniMapSvgPath, miniMapStartFinish, aiPositions, playerMapPos, playerHasPitted, lap, totalLaps, pos }) => {
  return (
    <div className="w-28 h-28 sm:w-34 sm:h-34 bg-black/70 rounded-2xl border border-slate-700/80 p-1.5 shadow-2xl relative flex flex-col items-center justify-between pointer-events-none">
      <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 px-1 border-b border-slate-800/80 pb-0.5">
        <span className="font-bold uppercase tracking-wider text-slate-300 truncate max-w-[80px]">
          {circuitName}
        </span>
        <span>{renderFlag(country || flag, 'sm')}</span>
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center p-0.5">
        <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
          <path d={miniMapSvgPath} fill="none" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d={miniMapSvgPath} fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d={miniMapSvgPath} fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" />
          {miniMapStartFinish && (
            <g>
              <circle cx={miniMapStartFinish.x} cy={miniMapStartFinish.y} r="3.5" fill="#ffffff" stroke="#ef4444" strokeWidth="1.5" />
            </g>
          )}
          {aiPositions.map((ai) => (
            <circle
              key={ai.id}
              cx={ai.mapX}
              cy={ai.mapY}
              r={ai.isPitting ? 4.2 : ai.isCatchUp ? 4 : 2.8}
              fill={ai.isPitting ? '#f59e0b' : ai.isTailgating ? '#ef4444' : ai.isCatchUp ? '#c084fc' : ai.color}
              stroke="#ffffff"
              strokeWidth={ai.isPitting || ai.isCatchUp ? 1.5 : 0.8}
            />
          ))}
          <circle cx={playerMapPos.x} cy={playerMapPos.y} r="4.5" fill="#facc15" stroke="#000000" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="w-full flex items-center justify-between text-[8px] font-mono text-slate-400 px-1 pt-0.5 border-t border-slate-800/80">
        <span className="text-amber-400 font-bold">P{pos}/12</span>
        <span className={playerHasPitted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
          {playerHasPitted ? '✓ PITTED' : 'PIT REQ'}
        </span>
        <span className="text-slate-300">L{lap}/{totalLaps}</span>
      </div>
    </div>
  );
});

// 3. Bottom-Right Speedometer with Dominant Speed Number and Compact Muted Secondaries
export const HudSpeedometer = React.memo<{
  speed: number;
  gear: number;
  rpm: number;
  nitroFuel: number;
  nitroDepleted: boolean;
  drsActive: boolean;
  tireBlown: boolean;
  carHealth: number;
  isEngineOnFire: boolean;
  isRaining: boolean;
  hasWetTires: boolean;
  boostPadActive?: boolean;
  isAquaplaning?: boolean;
}>(({ speed, gear, rpm, nitroFuel, nitroDepleted, drsActive, tireBlown, carHealth, isEngineOnFire, isRaining, hasWetTires, boostPadActive, isAquaplaning }) => {
  return (
    <div className="absolute bottom-[148px] right-2 sm:bottom-[158px] sm:right-4 md:bottom-11 md:right-4 z-20 bg-black/75 border border-slate-800/90 rounded-2xl p-2 sm:p-3 shadow-2xl flex items-center gap-2.5 sm:gap-3.5 pointer-events-none max-w-[46%] sm:max-w-[32%] md:max-w-[28%] backdrop-blur-xs">
      {/* Speed & Gear: Big Dominant Focal Point */}
      <div className="text-right">
        <div className="flex items-baseline justify-end gap-1">
          <span className="text-4xl sm:text-5xl font-black font-racing text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {speed}
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">KM/H</span>
        </div>

        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[8px] font-mono uppercase text-slate-500">GEAR</span>
          <span className="text-base sm:text-lg font-black text-amber-400 bg-slate-900/90 px-2 py-0.2 rounded-md border border-amber-500/30">
            {gear}
          </span>
        </div>
      </div>

      {/* LEDs & Compact Secondary Gauges (smaller, muted) */}
      <div className="w-24 sm:w-32 space-y-1">
        {/* F1 Style Shift LEDs */}
        <div className="flex items-center justify-between gap-0.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((led) => {
            const active = rpm >= 5000 + led * 1000;
            const isRed = led >= 8;
            const isYellow = led >= 5 && led < 8;
            return (
              <div
                key={led}
                className={`flex-1 h-1 rounded-xs transition-all duration-75 ${
                  active
                    ? isRed
                      ? 'bg-red-500'
                      : isYellow
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                    : 'bg-slate-800/70'
                }`}
              />
            );
          })}
        </div>

        {/* Compact Nitro Bar */}
        <div className="p-1 rounded-lg bg-slate-950/70 border border-slate-800 text-[8px] font-mono text-slate-400">
          <div className="flex items-center justify-between leading-none mb-0.5">
            <span className="text-slate-400 text-[8px]">{boostPadActive ? '⚡ BOOST' : nitroDepleted ? '🔒 NITRO' : 'NITRO'}</span>
            <span className={boostPadActive ? 'text-amber-400 font-bold' : drsActive ? 'text-cyan-300 font-bold' : nitroDepleted ? 'text-amber-400 font-bold' : 'text-slate-400'}>
              {boostPadActive ? 'ACTIVE' : nitroDepleted ? `LOCK (${nitroFuel}%)` : `${nitroFuel}%`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                boostPadActive ? 'bg-amber-400' : drsActive ? 'bg-cyan-400' : nitroDepleted ? 'bg-amber-500 animate-pulse' : 'bg-cyan-600'
              }`}
              style={{ width: boostPadActive ? '100%' : `${Math.max(0, Math.min(100, nitroFuel))}%` }}
            />
          </div>
          {nitroDepleted && (
            <div className="text-[7px] text-amber-400/90 font-bold tracking-tight text-center mt-0.5">
              🔒 รอรีโหลดเต็ม 100% ถึงจะใช้ได้
            </div>
          )}
        </div>

        {/* Compact Car Health */}
        <div className="px-1 py-0.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[8px] font-mono text-slate-500">
          <div className="flex items-center justify-between leading-none mb-0.5">
            <span className="text-[8px]">{isEngineOnFire ? '🔥 FIRE' : 'HEALTH'}</span>
            <span className={isEngineOnFire ? 'text-red-400 font-bold animate-pulse' : carHealth < 45 ? 'text-amber-400' : carHealth > 100 ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
              {carHealth}%
            </span>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${isEngineOnFire ? 'bg-red-500 animate-pulse' : carHealth < 45 ? 'bg-amber-400' : carHealth > 100 ? 'bg-emerald-500' : 'bg-emerald-600'}`}
              style={{ width: `${Math.max(0, Math.min(100, (carHealth / PLAYER_MAX_HEALTH) * 100))}%` }}
            />
          </div>
        </div>

        {/* Compact Weather & Tire */}
        <div className="flex items-center justify-between text-[7.5px] font-mono px-1 py-0.5 rounded bg-slate-950/70 border border-slate-800 text-slate-500">
          <span>{isRaining ? '🌧️ RAIN' : '☀️ DRY'}</span>
          <span className={isRaining ? (hasWetTires ? 'text-cyan-300' : 'text-amber-400') : 'text-slate-400'}>
            {isRaining ? (hasWetTires ? 'WET' : 'SLICK!') : 'SLICK'}
          </span>
        </div>

        {tireBlown && (
          <div className="text-center py-1 px-1.5 rounded-lg text-[9px] font-mono font-black bg-red-600 text-yellow-300 border border-yellow-300 shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-pulse flex items-center justify-center gap-1">
            <span>💥</span>
            <span>FLAT TIRE (-50% SPD)</span>
          </div>
        )}

        {isAquaplaning && (
          <div className="text-center py-1 px-1.5 rounded-lg text-[9px] font-mono font-black bg-cyan-600 text-white border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.9)] animate-pulse flex items-center justify-center gap-1">
            <span>🌊</span>
            <span>SLIPPING / ลื่น!</span>
          </div>
        )}
      </div>
    </div>
  );
});

// 4. Central Unified Alert Queue (Max 2 simultaneous items, Priority sorted, Auto-expiring)
export const HudAlertQueue = React.memo<{
  alerts: HudAlertItem[];
}>(({ alerts }) => {
  if (alerts.length === 0) return null;
  return (
    <div className="flex flex-col items-end gap-1.5 w-full max-w-[210px] sm:max-w-[240px] pointer-events-none mt-1">
      {alerts.slice(0, 2).map((alert) => {
        const isCritical = alert.priority === 'critical';
        const isRival = alert.priority === 'rival';
        return (
          <div
            key={alert.id}
            className={`w-full px-2.5 py-1.5 rounded-xl border text-[10px] font-mono shadow-lg flex items-center justify-between ${
              isCritical
                ? 'bg-red-950/95 border-red-500 text-red-100 animate-pulse'
                : isRival
                ? 'bg-slate-950/90 border-amber-500/70 text-amber-200'
                : 'bg-black/80 border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs shrink-0">{alert.icon}</span>
              <div className="flex flex-col leading-tight truncate">
                <span className="font-bold truncate uppercase">{alert.title}</span>
                {alert.subtitle && <span className="text-[8px] text-slate-400 truncate">{alert.subtitle}</span>}
              </div>
            </div>
            {alert.badge && (
              <span className={`text-[8px] px-1 py-0.2 rounded font-bold uppercase shrink-0 ml-1 ${
                isCritical ? 'bg-red-600 text-white' : 'bg-slate-800 text-amber-300'
              }`}>
                {alert.badge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

// 5. Center Corridor Warnings (Curve warning, Pit Entry Banner, Flat Tire & Aquaplaning alerts)
export const HudCenterWarnings = React.memo<{
  turnWarning: string | null;
  showPitWindowPrompt?: boolean;
  pitDistanceM?: number | null;
  tireBlown?: boolean;
  isAquaplaning?: boolean;
}>(({ turnWarning, showPitWindowPrompt, pitDistanceM, tireBlown, isAquaplaning }) => {
  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none select-none max-w-[92vw] sm:max-w-2xl">
      {/* 1. Curve warning badge */}
      {turnWarning && (
        <div className="px-4 py-1 rounded-full bg-red-600 text-white font-black text-xs sm:text-sm tracking-widest border border-red-400 shadow-2xl">
          {turnWarning}
        </div>
      )}

      {/* 2. Flat Tire Major Alert ("แจ้งเตือนว่ายางแตกใหญ่กว่านี้ชัดเจนกว่านี้") */}
      {tireBlown && (
        <div className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-gradient-to-r from-red-700 via-rose-700 to-red-700 text-white font-racing font-black text-sm sm:text-base tracking-wide border-2 border-yellow-400 shadow-[0_0_40px_rgba(239,68,68,1)] flex items-center gap-3 animate-pulse">
          <span className="text-2xl sm:text-3xl animate-bounce">💥</span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2.5 leading-tight text-center sm:text-left">
            <span className="text-yellow-300 uppercase tracking-wider font-mono text-sm sm:text-base">
              💥 FLAT TIRE • ยางแตก!
            </span>
            <span className="text-xs sm:text-sm text-red-100 font-bold">
              ความเร็วลดลง 50% • รีบเลี้ยวขวาเข้า PIT เปลี่ยนยางด่วน!
            </span>
          </div>
        </div>
      )}

      {/* 3. Slipping / Aquaplaning Alert ("รวมถึงลื่นด้วย") */}
      {isAquaplaning && (
        <div className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 text-white font-racing font-black text-xs sm:text-sm tracking-wide border-2 border-cyan-200 shadow-[0_0_35px_rgba(6,182,212,0.95)] flex items-center gap-3 animate-pulse">
          <span className="text-xl sm:text-2xl">🌊</span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight text-center sm:text-left">
            <span className="text-yellow-200 uppercase tracking-wider font-mono text-xs sm:text-sm">
              ⚠️ AQUAPLANING • รถลื่นไถล!
            </span>
            <span className="text-[11px] sm:text-xs text-cyan-100 font-bold">
              ถนนเปียกน้ำ ยางสูญเสียการยึดเกาะ • ชะลอความเร็วหรือเข้า PIT เปลี่ยนยาง WET
            </span>
          </div>
        </div>
      )}

      {/* 4. Large Pit Window Countdown Banner ("ให้ข้อความเข้า pits ใหญ่กว่านี้") */}
      {showPitWindowPrompt && (
        <div className="px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-racing font-black text-xs sm:text-base tracking-wide border-2 border-red-300 shadow-[0_0_40px_rgba(239,68,68,1)] flex items-center gap-2 sm:gap-3 animate-pulse max-w-[92vw] sm:max-w-xl mx-auto">
          <span className="text-amber-300 font-mono font-black text-sm sm:text-2xl animate-bounce">▶▶▶</span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight text-center sm:text-left truncate">
            <span className="text-yellow-300 uppercase tracking-wider font-mono text-xs sm:text-base truncate">
              BOX THIS LAP • เข้า PIT
            </span>
            <span className="text-[10px] sm:text-sm text-white font-bold truncate">
              เตรียมชิดขวาเพื่อเลี้ยวเข้า PIT
            </span>
          </div>
          <div className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl bg-black/85 text-amber-300 font-mono text-xs sm:text-base font-black border-2 border-amber-400 shadow-inner shrink-0 ml-auto">
            {pitDistanceM !== null && pitDistanceM !== undefined ? `${pitDistanceM}M` : '500M'}
          </div>
        </div>
      )}
    </div>
  );
});

// 6. Bottom Docked Progress Bar
export const HudProgressBar = React.memo<{
  lap: number;
  lapsCount: number;
  playerProgress: number;
  aiPositions: { id: string; tag: string; color: string; progress: number; isCatchUp?: boolean; isTailgating?: boolean }[];
}>(({ lap, lapsCount, playerProgress, aiPositions }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/80 border-t border-slate-700/80 px-2.5 sm:px-4 py-1.5 flex items-center gap-2 sm:gap-3 pointer-events-none select-none">
      <div className="bg-[#0f141f] border border-slate-700 px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1.5 shrink-0">
        <span className="text-[9px] font-racing font-bold text-slate-400">LAP</span>
        <span className="text-base sm:text-lg font-black font-racing text-white">{lap}</span>
        <span className="text-[10px] font-mono text-slate-500">/{lapsCount}</span>
      </div>

      <div className="px-2 py-0.5 bg-white text-blue-600 font-black text-xs font-racing rounded shadow-md shrink-0 border border-blue-400">
        START
      </div>

      <div className="flex-1 h-5 sm:h-6 bg-slate-950/90 rounded-full border border-slate-600 p-0.5 relative shadow-inner flex items-center overflow-visible">
        {lapsCount > 1 &&
          Array.from({ length: lapsCount - 1 }, (_, i) => {
            const pct = ((i + 1) / lapsCount) * 100;
            return (
              <div key={i} className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none z-0" style={{ left: `${pct}%` }}>
                <div className="w-[1.5px] h-full bg-white/40" />
                <span className="text-[8px] font-mono text-slate-300 font-bold bg-slate-900/90 px-1 rounded -bottom-4 absolute">
                  L{i + 2}
                </span>
              </div>
            );
          })}

        <div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 rounded-full transition-all duration-75 shadow-md shadow-sky-500/50"
          style={{ width: `${Math.max(2, Math.min(100, playerProgress * 100))}%` }}
        />

        {aiPositions.map((ai) => (
          <div
            key={ai.id}
            className={`absolute -top-1 rounded-full border shadow-md transition-all duration-75 ${
              ai.isCatchUp ? 'w-3.5 h-3.5 -top-1.5 border-yellow-300 ring-2 ring-red-500 z-10' : 'w-2.5 h-2.5 border-white'
            }`}
            style={{
              left: `calc(${Math.max(0, Math.min(100, ai.progress * 100))}% - ${ai.isCatchUp ? 7 : 5}px)`,
              backgroundColor: ai.isTailgating ? '#ef4444' : ai.isCatchUp ? '#c084fc' : ai.color,
            }}
          />
        ))}

        <div
          className="absolute -top-6 sm:-top-7 flex flex-col items-center pointer-events-none transition-all duration-75 z-10"
          style={{ left: `calc(${Math.max(0, Math.min(100, playerProgress * 100))}% - 12px)` }}
        >
          <div className="px-1 py-0.2 bg-amber-400 text-black text-[8px] font-black rounded shadow font-mono">
            YOU
          </div>
          <span className="text-emerald-400 text-[10px] font-black -mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            ▼
          </span>
        </div>
      </div>

      <div className="px-2 py-0.5 bg-white text-red-600 font-black text-xs font-racing rounded shadow-md shrink-0 border border-red-400">
        GOAL
      </div>
    </div>
  );
});

export const OutRunRaceEngine: React.FC<OutRunRaceEngineProps> = ({
  teamState,
  activeGp,
  lapsCount = 3,
  onRaceCompleted,
  onExit,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High-level race state
  const [racePhase, setRacePhase] = useState<'countdown' | 'racing' | 'finished' | 'paused'>('countdown');
  const [countdownLights, setCountdownLights] = useState<number>(0); // 0 to 5, 6 = GO!
  const [gantryExiting, setGantryExiting] = useState<boolean>(false);
  const [gantryMounted, setGantryMounted] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const [isMusicOn, setIsMusicOn] = useState(!sound.getIsMusicMuted());
  const [currentTrackInfo, setCurrentTrackInfo] = useState<MusicTrackMetadata>(() => sound.getCurrentMusicTrack());
  const [showTrackToast, setShowTrackToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Pit Stop and Quick Time Event (QTE) interactive state
  const [pitQteActive, setPitQteActive] = useState<boolean>(false);
  const [pitQteIndex, setPitQteIndex] = useState<number>(0);
  const [pitQteSequence, setPitQteSequence] = useState<('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[]>(['UP', 'RIGHT', 'DOWN', 'LEFT']);
  const [pitQteElapsed, setPitQteElapsed] = useState<number>(0);
  const [pitQteTargetDuration, setPitQteTargetDuration] = useState<number>(3.2);
  const [pitQteShake, setPitQteShake] = useState<boolean>(false);
  const [pitQteLockout, setPitQteLockout] = useState<boolean>(false);
  const [pitQteComplete, setPitQteComplete] = useState<boolean>(false);
  const [pitToastMessage, setPitToastMessage] = useState<string | null>(null);
  const [showPitWindowPrompt, setShowPitWindowPrompt] = useState<boolean>(false);
  const [pitDistanceM, setPitDistanceM] = useState<number | null>(null);
  const [playerHasPitted, setPlayerHasPitted] = useState<boolean>(false);
  const [aiPittingIds, setAiPittingIds] = useState<string[]>([]);
  const [showTireBlownAlert, setShowTireBlownAlert] = useState<boolean>(false);
  const [hudCarHealth, setHudCarHealth] = useState<number>(PLAYER_MAX_HEALTH);
  const [hudNitroFuel, setHudNitroFuel] = useState<number>(100);
  const [hudNitroDepleted, setHudNitroDepleted] = useState<boolean>(false);
  const [hudIsRaining, setHudIsRaining] = useState<boolean>(false);
  const [hudHasWetTires, setHudHasWetTires] = useState<boolean>(false);
  const [hudRainAlert, setHudRainAlert] = useState<string | null>(null);
  const [hudIsAquaplaning, setHudIsAquaplaning] = useState<boolean>(false);
  const [isEngineOnFire, setIsEngineOnFire] = useState<boolean>(false);

  // Toggle Sudden Dynamic Rain (Key 'R' or button)
  const toggleRain = useCallback(() => {
    const nextRain = !engineStateRef.current.isRaining;
    engineStateRef.current.isRaining = nextRain;
    engineStateRef.current.rainIntensity = nextRain ? 1 : 0;
    setHudIsRaining(nextRain);
    if (nextRain) {
      sound.playThunderRain();
      setHudRainAlert('🌧️ SUDDEN DOWNPOUR! ฝนเริ่มตกหนักกลางเกม • แทร็กลื่น เลี้ยวจะลื่นตกข้างทางง่ายขึ้น รีบเข้า PIT เพื่อเปลี่ยนยาง WET TIRES!');
      setPitToastMessage('🌧️ ฝนเริ่มตกหนัก! รีบเข้า PIT เปลี่ยนยาง WET TIRES');
      setTimeout(() => setHudRainAlert(null), 6500);
    } else {
      setPitToastMessage('☀️ ฝนหยุดตกแล้ว แทร็กเริ่มแห้ง');
      setTimeout(() => setPitToastMessage(null), 3000);
    }
  }, []);

  // Restart this round from start grid ("ถ้าแพ้ ก็ให้ต้องแข่งด่านนั้นใหม่")
  const restartRace = useCallback(() => {
    sound.stopOutRunEngine();
    sound.stopRaceMusic();
    setRacePhase('countdown');
    setCountdownLights(0);
    setGantryMounted(true);
    setGantryExiting(false);
    setRaceSummary(null);
    setIsEngineOnFire(false);
    setHudCarHealth(PLAYER_MAX_HEALTH);
    setHudIsAquaplaning(false);
    setHudIsRaining(false);
    setHudHasWetTires(false);
    setShowTireBlownAlert(false);
    setPitToastMessage(null);
    setPlayerHasPitted(false);
    setShowPitWindowPrompt(false);
    setPitQteActive(false);

    const eng = engineStateRef.current;
    eng.position = 0;
    eng.playerX = 0;
    eng.speed = 0;
    eng.lap = 1;
    eng.lapTimes = [];
    eng.offroadEventsCount = 0;
    eng.isFinished = false;
    eng.isDnf = false;
    eng.isEngineOnFire = false;
    eng.carHealth = PLAYER_MAX_HEALTH;
    eng.nitroFuel = 100;
    eng.nitroDepleted = false;
    eng.heat = 0;
    eng.debugClosestAiCheatBonus = 0;
    setHudNitroFuel(100);
    setHudNitroDepleted(false);
    eng.fireTimer = 0;
    eng.pitLockoutTimer = 0;
    eng.lastDamageTimestamp = 0;
    eng.hasPitted = false;
    eng.inPitLane = false;
    eng.pitState = 'none';
    eng.aiCars = initAiCars(activeGp.round, lapsCount || 3);
    eng.tireBlown = false;
    eng.hasWetTires = false;
    eng.oilSlipTimer = 0;
    eng.isRaining = false;
    eng.rainIntensity = 0;
    eng.rainScheduled =
      activeGp.weather === 'Wet' ||
      (activeGp.weather === 'Changing' && Math.random() < 0.85) ||
      (activeGp.weather === 'Cloudy' && Math.random() < 0.30) ||
      (activeGp.weather === 'Dry' && Math.random() < 0.10);
    eng.rainStartNormalizedDist = 0.35 + Math.random() * 0.25;
  }, [activeGp.round, activeGp.weather, lapsCount]);

  // Toggle true screen fullscreen or expanded responsive canvas
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen((prev) => !prev);
        });
      } else {
        setIsFullscreen((prev) => !prev);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, []);

  // HUD telemetry state (for React overlay)
  const [hudSpeed, setHudSpeed] = useState<number>(0);
  const [hudGear, setHudGear] = useState<number>(1);
  const [hudRpm, setHudRpm] = useState<number>(1000);
  const [hudLap, setHudLap] = useState<number>(1);
  const [hudCurrentLapTime, setHudCurrentLapTime] = useState<number>(0);
  const [hudBestLapTime, setHudBestLapTime] = useState<number | null>(null);
  const [hudEstimatedPos, setHudEstimatedPos] = useState<number>(12);
  const [hudDrsAvailable, setHudDrsAvailable] = useState<boolean>(true);
  const [hudDrsActive, setHudDrsActive] = useState<boolean>(false);
  const [hudSlipstream, setHudSlipstream] = useState<boolean>(false);
  const [hudRivalAhead, setHudRivalAhead] = useState<{ tag: string; gapM: number } | null>(null);
  const [hudRivalBehind, setHudRivalBehind] = useState<{ tag: string; gapM: number } | null>(null);
  const [hudTurnWarning, setHudTurnWarning] = useState<string | null>(null);
  const [hudBoostPadActive, setHudBoostPadActive] = useState<boolean>(false);
  const [hudBoosterRival, setHudBoosterRival] = useState<{ tag: string; speed: number } | null>(null);
  const [hudAttackingRival, setHudAttackingRival] = useState<{ tag: string; gapM: number; speed: number } | null>(null);
  const [hudCrashedRival, setHudCrashedRival] = useState<{ tag: string; type: string; speed: number } | null>(null);
  const [hudPersonalityAlert, setHudPersonalityAlert] = useState<{
    tag: string;
    driverName: string;
    icon: string;
    skillName: string;
    skillNameTh: string;
    teamColor: string;
    description: string;
  } | null>(null);
  const [showRivalsIntelModal, setShowRivalsIntelModal] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);

  // Unified Alert Queue state
  const [alertQueue, setAlertQueue] = useState<HudAlertItem[]>([]);
  const alertQueueRef = useRef<HudAlertItem[]>([]);

  // Throttling and change-detection refs for 10Hz React HUD synchronization
  const lastHudSyncTimeRef = useRef<number>(0);
  const prevRivalAheadRef = useRef<{ tag: string; gapM: number } | null>(null);
  const prevRivalBehindRef = useRef<{ tag: string; gapM: number } | null>(null);
  const prevPlayerMapPosRef = useRef<{ x: number; y: number }>({ x: 80, y: 50 });
  const prevPlayerProgressRef = useRef<number>(0);
  const prevAiPositionsRef = useRef<any[]>([]);
  const lastAiMapSyncRef = useRef<number>(0);

  // Helper to push prioritized alerts into central queue
  const addHudAlert = useCallback((priority: 'critical' | 'rival' | 'info', title: string, subtitle?: string, icon?: string, badge?: string) => {
    const now = performance.now();
    const id = `${priority}-${title}-${Math.random()}`;
    const newAlert: HudAlertItem = {
      id,
      priority,
      title,
      subtitle,
      icon: icon || (priority === 'critical' ? '⚠️' : priority === 'rival' ? '🏎️' : 'ℹ️'),
      badge,
      createdAt: now,
    };
    alertQueueRef.current = [newAlert, ...alertQueueRef.current.filter((a) => a.title !== title)].slice(0, 6);
  }, []);

  // Secret Catch-Up / Rubberband Pursuit Telemetry state
  const [hudSecretCatchUp, setHudSecretCatchUp] = useState<{
    active: boolean;
    tag: string;
    gapM: number;
    isTailgating: boolean;
    speedKmH: number;
  } | null>(null);
  const lastCatchUpSoundRef = useRef<number>(0);
  const lastTailgateSoundRef = useRef<number>(0);

  // Circuit Mini-Map & Progress State
  const miniMapSvgPathState = useState<string>('');
  const miniMapSvgPath = miniMapSvgPathState[0];
  const setMiniMapSvgPath = miniMapSvgPathState[1];
  const [miniMapStartFinish, setMiniMapStartFinish] = useState<{ x: number; y: number } | null>(null);
  const miniMapPointsRef = useRef<{ x: number; y: number }[]>([]);
  const [hudPlayerMapPos, setHudPlayerMapPos] = useState<{ x: number; y: number }>({ x: 80, y: 50 });
  const [hudPlayerProgress, setHudPlayerProgress] = useState<number>(0);
  const [hudAiPositions, setHudAiPositions] = useState<
    { id: string; tag: string; color: string; progress: number; mapX: number; mapY: number; isCatchUp?: boolean; isTailgating?: boolean; isPitting?: boolean; hasPitted?: boolean }[]
  >([]);

  // Final summary state
  const [raceSummary, setRaceSummary] = useState<{
    position: number;
    bestLapMs: number;
    totalTimeMs: number;
    topSpeed: number;
    offroadEvents: number;
    hasPitted?: boolean;
    missedMandatoryPitPenalty?: boolean;
    standings: OutRunStandingsDriver[];
    isTimedOutLoss?: boolean;
    isDnfFireLoss?: boolean;
    fireDnfReason?: string;
    objectivesSummary?: {
      obj: StageObjective;
      completed: boolean;
    }[];
    bonusPrizeEarned?: number;
    weakestStatDiagnosis?: {
      statKey: string;
      statNameTh: string;
      adviceTh: string;
    };
  } | null>(null);

  // 2 Stage Bonus Objectives for this round
  const stageObjectives = React.useMemo(
    () => getStageObjectivesForRound(activeGp.round || 1),
    [activeGp.round]
  );

  // Real in-engine physics & circuit preparedness calculated via raceEffects
  const driverOverall = teamState.driver1.overall;
  const driverPace = teamState.driver1.pace;
  const driverRaceCraft = teamState.driver1.raceCraft;
  const strategistDecisions = teamState.strategist?.decisions ?? 70;
  const strategistStrategy = teamState.strategist?.strategy ?? 70;
  const pitCrewSpeed = teamState.pitCrew?.speed || 70;
  const pitCrewPrecision = teamState.pitCrew?.precision || 70;
  const pitCrewSkill = teamState.pitCrew?.overall || Math.round((pitCrewSpeed + pitCrewPrecision) / 2) || 60;

  const carPhysics = calculateRaceCarPhysics(
    teamState.car,
    driverOverall,
    driverPace,
    driverRaceCraft,
    strategistDecisions,
    strategistStrategy,
    activeGp.round || 1
  );

  const {
    maxSpeed,
    accelRate,
    brakeRate,
    handlingRate,
    drsSpeedBonus,
    boostPadDuration,
    slipstreamBoost,
    collisionResistance,
    pitWarningDistance,
    circuitFitDelta,
  } = carPhysics;

  // Pit crew speed shortens crash stun recovery
  const crashRecoveryFactor = Math.max(0.30, 1.0 - (pitCrewSpeed - 70) * 0.016);

  // Target benchmark lap time for P1 based on circuit length (scaled with 2x road velocity ~22-26 sec per lap)
  const targetLapSeconds = Math.max(18, Math.round((activeGp.lapLengthKm / 900) * 3600 * 0.95));

  // Keyboard input state
  const keysRef = useRef<{
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    drs: boolean;
  }>({
    up: false,
    down: false,
    left: false,
    right: false,
    drs: false,
  });

  // Previous driving telemetry refs for acoustic gear shifts and exhaust overrun
  const prevGearRef = useRef<number>(1);
  const prevGasRef = useRef<boolean>(false);

  // Mutable Game Engine state (runs at 60fps in requestAnimationFrame loop)
  const engineStateRef = useRef<{
    position: number; // camera world Z position along track
    playerX: number; // -1.0 to 1.0 (0 is center of road, < -1 or > 1 is grass)
    playerZ: number; // offset from camera
    speed: number; // current speed in km/h
    topSpeedRecorded: number;
    gear: number;
    rpm: number;
    lap: number;
    totalLaps: number;
    lapStartTime: number;
    currentLapTimeMs: number;
    bestLapTimeMs: number | null;
    totalRaceTimeMs: number;
    lapTimes: number[];
    offroadTicks: number;
    offroadEventsCount: number;
    drsTimer: number;
    drsActive: boolean;
    boostPadTimer: number;
    lastFrameTime: number;
    steerAngle: number; // -1 (full left) to 1 (full right)
    lateralVx: number; // lateral velocity in road-widths/sec for viscous weighted steering
    cameraShake: { x: number; y: number; intensity: number };
    crashStunTimer: number;
    speedLines: { angle: number; dist: number; length: number; speed: number; opacity: number }[];
    particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[];
    aiCars: AiCar[]; // 11 AI rivals racing on track
    segments: Segment[];
    trackLength: number;
    segmentLength: number;
    rumbleLength: number;
    roadWidth: number;
    baseFov: number;
    currentFov: number;
    cameraHeight: number;
    cameraDepth: number;
    curveUpcomingText: string | null;
    isFinished: boolean;
    skyOffset: number;
    smoothHorizonOffset: number;
    hasPitted: boolean;
    inPitLane: boolean;
    pitState: 'none' | 'entering' | 'servicing' | 'exiting';
    pitStopTimer: number;
    pitDuration: number;
    pitQteIndex: number;
    pitQteFinished: boolean;
    pitQteSequence: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[];
    pitQteLockoutUntil: number;
    pitPenaltyApplied: boolean;
    tireBlown: boolean;
    carHealth: number;
    nitroFuel: number;
    nitroMaxFuel: number;
    nitroDepleted: boolean;
    slipstreamActive: boolean;
    isEngineOnFire: boolean;
    fireTimer: number;
    isDnf: boolean;
    isRaining: boolean;
    rainIntensity: number;
    hasWetTires: boolean;
    rainScheduled: boolean;
    rainStartNormalizedDist: number;
    pitLockoutTimer: number;
    pitBlockedToastShown?: number;
    lastDamageTimestamp?: number;
    lastOffroadDmg?: number;
    rainDrops: { x: number; y: number; speed: number; len: number }[];
    oilSlipTimer: number;
    totalCollisionsCount: number;
    lastAiMistakeTimeMs: number;
    overtakesCount: number;
    lastLockAlertTime?: number;
    heat: number;
    debugClosestAiCheatBonus?: number;
  }>({
    position: 0,
    playerX: 0,
    playerZ: 500,
    speed: 0,
    topSpeedRecorded: 0,
    gear: 1,
    rpm: 1000,
    lap: 1,
    totalLaps: lapsCount,
    lapStartTime: 0,
    currentLapTimeMs: 0,
    bestLapTimeMs: null,
    totalRaceTimeMs: 0,
    lapTimes: [],
    offroadTicks: 0,
    offroadEventsCount: 0,
    drsTimer: 0,
    drsActive: false,
    slipstreamActive: false,
    nitroFuel: 100,
    nitroMaxFuel: 100,
    nitroDepleted: false,
    heat: 0,
    debugClosestAiCheatBonus: 0,
    boostPadTimer: 0,
    oilSlipTimer: 0,
    totalCollisionsCount: 0,
    lastAiMistakeTimeMs: 0,
    overtakesCount: 0,
    lastFrameTime: performance.now(),
    steerAngle: 0,
    lateralVx: 0,
    cameraShake: { x: 0, y: 0, intensity: 0 },
    crashStunTimer: 0,
    speedLines: [],
    particles: [],
    aiCars: initAiCars(activeGp.round, lapsCount || 3),
    segments: [],
    trackLength: 0,
    segmentLength: 200,
    rumbleLength: 3,
    roadWidth: 2200,
    baseFov: 95,
    currentFov: 95,
    cameraHeight: 860,
    cameraDepth: 0.84,
    curveUpcomingText: null,
    isFinished: false,
    skyOffset: 0,
    smoothHorizonOffset: 0,
    hasPitted: false,
    inPitLane: false,
    pitState: 'none',
    pitStopTimer: 0,
    pitDuration: 3.2,
    pitQteIndex: 0,
    pitQteFinished: false,
    pitQteSequence: ['UP', 'RIGHT', 'DOWN', 'LEFT'],
    pitQteLockoutUntil: 0,
    pitPenaltyApplied: false,
    tireBlown: false,
    carHealth: PLAYER_MAX_HEALTH,
    isEngineOnFire: false,
    fireTimer: 0,
    pitLockoutTimer: 0,
    isDnf: false,
    isRaining: false,
    rainIntensity: 0,
    hasWetTires: false,
    rainScheduled:
      activeGp.weather === 'Wet' ||
      (activeGp.weather === 'Changing' && Math.random() < 0.85) ||
      (activeGp.weather === 'Cloudy' && Math.random() < 0.30) ||
      (activeGp.weather === 'Dry' && Math.random() < 0.10),
    rainStartNormalizedDist: 0.35 + Math.random() * 0.25,
    rainDrops: Array.from({ length: 90 }, () => ({
      x: Math.random() * 1280,
      y: Math.random() * 720,
      speed: 400 + Math.random() * 350,
      len: 14 + Math.random() * 18,
    })),
  });

  // Track Builder: builds authentic fixed corner-by-corner 3D circuit for all 18 World Tour rounds!
  // Uses authentic real-world track geometry, surfaces, and deterministic obstacles & booster pads
  const buildTrack = useCallback(() => {
    const segmentLength = 200;
    const segments: Segment[] = [];
    const circuitDef = getWorldTourCircuit(activeGp.round, activeGp.id);

    const addSection = (
      numSegments: number,
      targetCurve: number,
      propPattern?: { frequency: number; type: RoadsidePropType; offset: number; text?: string; color?: string }
    ) => {
      // Smooth curvature ramp: ease in, hold, ease out
      const rampLen = Math.min(25, Math.floor(numSegments * 0.25));
      for (let i = 0; i < numSegments; i++) {
        const segIdx = segments.length;
        const isDark = Math.floor(segIdx / 3) % 2 === 0;

        let curveVal = targetCurve;
        if (targetCurve !== 0) {
          if (i < rampLen) {
            curveVal = targetCurve * (i / rampLen);
          } else if (i > numSegments - rampLen) {
            curveVal = targetCurve * ((numSegments - i) / rampLen);
          }
        }

        // Realistic Grand Prix colors grounded in authentic real-world circuit environments
        const roadColor = isDark ? circuitDef.roadColors.dark : circuitDef.roadColors.light;
        const grassColor = isDark ? circuitDef.groundColors.dark : circuitDef.groundColors.light;
        const rumbleColor = isDark ? circuitDef.rumbleColors.dark : circuitDef.rumbleColors.light;
        const laneColor = isDark ? circuitDef.laneColors.dark : circuitDef.laneColors.light;

        // Procedural Grand Prix roadside props with authentic depth layering!
        const sprites: RoadsideSprite[] = [];
        if (propPattern && i % propPattern.frequency === 0) {
          sprites.push({
            type: propPattern.type,
            offset: propPattern.offset,
            scale: 1.0,
            text: propPattern.text,
            color: propPattern.color,
          });
        }

        // 1. LAYER 3: DEEP BACKGROUND TREE LINES, CITY SKYSCRAPERS & NATURE
        if (segIdx % 4 === 0) {
          const isLeft = (segIdx / 4) % 2 === 0;
          const depthOffset = 3.3 + ((segIdx * 7) % 5) * 0.52;
          const propPool = circuitDef.propsL3.length > 0 ? circuitDef.propsL3 : ['green_tree'];
          const treeType = propPool[(segIdx / 4) % propPool.length] as RoadsidePropType;

          sprites.push({
            type: treeType,
            offset: isLeft ? -depthOffset : depthOffset,
            scale: 1.05 + ((segIdx * 3) % 4) * 0.12,
          });
        }

        // 2. LAYER 2: MID-DISTANCE SCENERY (Offsets 2.3 to 3.0)
        if (segIdx % 12 === 2) {
          const isLeft = (segIdx / 12) % 2 === 0;
          const propPool = circuitDef.propsL2.length > 0 ? circuitDef.propsL2 : ['green_tree'];
          const treeType = propPool[(segIdx / 12) % propPool.length] as RoadsidePropType;

          sprites.push({
            type: treeType,
            offset: isLeft ? -2.45 : 2.45,
            scale: 0.95,
          });
        } else if (segIdx % 22 === 6) {
          // Trackside floodlight towers
          sprites.push({
            type: 'track_light',
            offset: (segIdx / 22) % 2 === 0 ? -2.35 : 2.35,
            scale: 1.0,
          });
        } else if (segIdx % 28 === 18) {
          // FIA Marshal Posts with waving safety flags
          sprites.push({
            type: 'f1_marshal_post',
            offset: 2.15,
            scale: 0.95,
          });
        }

        // 3. LAYER 1: NEAR ROADSIDE SCENERY (Offsets 1.6 to 2.0)
        // Sponsor billboards alternating left & right
        if (segIdx % 16 === 0) {
          const isLeft = (segIdx / 16) % 2 === 0;
          const sponsorTexts = ['PIRELLI', 'ROLEX', 'ARAMCO', 'DHL', 'CRYPTO', 'HEINEKEN', 'MSC'];
          const chosenText = sponsorTexts[(segIdx / 16) % sponsorTexts.length];
          sprites.push({
            type: 'sponsor_billboard',
            offset: isLeft ? -1.82 : 1.82,
            scale: 1.0,
            text: chosenText,
          });
        }

        // Trackside safety catch fencing along straights and fast sweepers
        if (segIdx % 10 === 4 && Math.abs(curveVal) < 1.0) {
          sprites.push({
            type: 'safety_fence',
            offset: -1.95,
            scale: 0.92,
          });
          sprites.push({
            type: 'safety_fence',
            offset: 1.95,
            scale: 0.92,
          });
        }

        // Corner safety tire barriers on curve apices
        if (Math.abs(curveVal) > 1.2 && segIdx % 6 === 0) {
          sprites.push({
            type: 'tire_barrier',
            offset: curveVal > 0 ? -1.55 : 1.55,
            scale: 0.85,
          });
        }

        // Turn braking distance boards (150m, 100m, 50m before hard turns)
        if (Math.abs(targetCurve) > 1.5 && i >= rampLen - 12 && i < rampLen) {
          const mIdx = rampLen - i;
          if (mIdx === 10 || mIdx === 6 || mIdx === 2) {
            sprites.push({
              type: 'distance_marker',
              offset: targetCurve > 0 ? 1.6 : -1.6,
              scale: 0.8,
              text: mIdx === 10 ? '150' : mIdx === 6 ? '100' : '50',
            });
          }
        }

        segments.push({
          index: segIdx,
          p1: {
            world: { x: 0, y: 0, z: segIdx * segmentLength },
            camera: { x: 0, y: 0, z: 0 },
            screen: { x: 0, y: 0, w: 0, scale: 0 },
          },
          p2: {
            world: { x: 0, y: 0, z: (segIdx + 1) * segmentLength },
            camera: { x: 0, y: 0, z: 0 },
            screen: { x: 0, y: 0, w: 0, scale: 0 },
          },
          curve: curveVal,
          color: {
            road: roadColor,
            grass: grassColor,
            rumble: rumbleColor,
            lane: laneColor,
          },
          isStartFinish: false,
          hasGrandstand: false,
          sprites: sprites.length > 0 ? sprites : undefined,
        });
      }
    };

    // Build the authentic fixed corner-by-corner 3D track layout for this specific Grand Prix!
    circuitDef.sections.forEach((sec) => {
      addSection(sec.numSegments, sec.curve, sec.propPattern as any);
    });

    // Mark the first 8 segments as Start/Finish line checkered pattern & place Start/Finish Gantry!
    for (let i = 0; i < 8; i++) {
      if (segments[i]) {
        segments[i].isStartFinish = true;
      }
    }
    if (segments[0]) {
      segments[0].sprites = [{ type: 'drs_gantry', offset: 0, scale: 1.0, text: 'START / FINISH' }];
    }

    // Mark Start/Finish Straight segments with Continuous 3D Polygonal Grandstands
    // ("ให้อัฒจันทร์ render มองเห็นได้ไกลมากกว่านี้ แบบชัดขึ้นจากระยะไกลของผู่แข่ง")
    for (let i = 0; i < segments.length; i++) {
      if (i >= segments.length - 125 || i <= 85) {
        segments[i].hasGrandstand = true;
      }
    }

    // Place DRS Zone overhead gantry entrance on the primary straight
    const drsSeg = Math.min(segments.length - 120, Math.max(280, Math.floor(segments.length * 0.42)));
    if (segments[drsSeg]) {
      segments[drsSeg].sprites = [{ type: 'drs_gantry', offset: 0, scale: 1.0, text: 'DRS ZONE' }];
    }

    // Helper to add an obstacle to a specific track segment
    const placeObstacle = (segIndex: number, type: RoadsidePropType, offset: number, scale = 1.0) => {
      const idx = segIndex % segments.length;
      if (segments[idx]) {
        if (!segments[idx].sprites) segments[idx].sprites = [];
        segments[idx].sprites.push({
          type,
          offset, // -0.75 to +0.75 directly on road surface
          scale,
          isObstacle: true,
          hit: false,
        });
      }
    };

    // Inject FIXED authentic track obstacles across the circuit
    circuitDef.obstacles.forEach((obs) => {
      placeObstacle(obs.segIndex, obs.type as RoadsidePropType, obs.offset);
    });

    // Inject FIXED strategic booster pads (4 wide yellow speed pads placed on authentic straights)
    circuitDef.boosterPads.forEach((pad) => {
      const targetSeg = pad.segIndex % segments.length;
      for (let s = 0; s < 3; s++) {
        const segIdx = (targetSeg + s) % segments.length;
        if (segments[segIdx]) {
          segments[segIdx].boostPad = {
            offset: pad.offset,
            width: 0.52, // Wide footprint covering full racing lane
            padId: targetSeg,
          };
        }
      }
    });

    // 7. Inject Authentic Branching Pit Lane Roadway along the Finish Straight (ถนนแยกออกไปข้างนอกใกล้เส้นชัย)
    // Smoothly straighten the final approach straight (segments.length - 110 to segments.length) and start (0 to 30)
    // so that EVERY circuit has a crystal-clear, straight, wide Pit Lane and finish straight!
    // "แล้วก็บางด่านดันไม่มี pits ซะงั้น" -> Guarantees pit lane & finish straight are 100% visible and accessible on all 18 tracks!
    const straightStart = Math.max(0, segments.length - 110);
    for (let i = straightStart; i < segments.length; i++) {
      if (segments[i]) {
        const prog = Math.min(1, Math.max(0, (i - straightStart) / 25));
        segments[i].curve = segments[i].curve * (1 - prog);
      }
    }
    // Also straighten segments 0 to 30 so the pit exit merges seamlessly onto a straight finish straight
    for (let i = 0; i <= 30; i++) {
      if (segments[i]) {
        const prog = Math.min(1, i / 25);
        segments[i].curve = segments[i].curve * prog;
      }
    }

    const pitStartSeg = segments.length - 85;
    const pitEndSeg = 42;

    for (let i = pitStartSeg; i < segments.length; i++) {
      if (segments[i]) {
        segments[i].isPitLaneZone = true;
        if (i < pitStartSeg + 20) {
          segments[i].pitLaneType = 'entry';
        } else if (i < segments.length - 14) {
          segments[i].pitLaneType = 'box';
        } else {
          segments[i].pitLaneType = 'exit';
        }
      }
    }
    for (let i = 0; i <= pitEndSeg; i++) {
      if (segments[i]) {
        segments[i].isPitLaneZone = true;
        segments[i].pitLaneType = 'exit';
      }
    }

    // Clean up any right-side obstacles, trees, fences or signs that would obstruct the pit lane roadway!
    // "เหมือนว่าตอนเข้า pits มันจะชนวัตถุใน pits ไปมานะ แก้ไขให้ด้วย"
    const pitClearStart = Math.max(0, segments.length - 105);
    const pitClearEnd = 48;

    for (let i = 0; i < segments.length; i++) {
      if (i >= pitClearStart || i <= pitClearEnd) {
        const seg = segments[i];
        if (seg && seg.sprites) {
          // Remove any non-pit sprites on the right verge/pit side (offset > 0.55) so the pit corridor is completely clear
          seg.sprites = seg.sprites.filter((sp) => {
            if (sp.offset > 0.55) {
              return sp.type === 'pit_entry_sign' || sp.type === 'pit_box_crew' || sp.type === 'team_pitwall';
            }
            return true;
          });
        }
      }
    }

    // Authentic Pit Wall along the finish straight separating pit lane from racing line
    for (let w = pitStartSeg + 20; w <= segments.length - 14; w += 8) {
      const wallSeg = segments[w];
      if (wallSeg) {
        if (!wallSeg.sprites) wallSeg.sprites = [];
        wallSeg.sprites.push({
          type: 'team_pitwall',
          offset: 1.15,
          scale: 0.95,
        });
      }
    }

    // Roadside pit signage at pit entrance approach
    const entrySeg1 = segments[pitStartSeg + 3];
    if (entrySeg1) {
      if (!entrySeg1.sprites) entrySeg1.sprites = [];
      entrySeg1.sprites.push({
        type: 'pit_entry_sign',
        offset: 1.55,
        scale: 1.30,
      });
    }
    const entrySeg2 = segments[pitStartSeg + 14];
    if (entrySeg2) {
      if (!entrySeg2.sprites) entrySeg2.sprites = [];
      entrySeg2.sprites.push({
        type: 'pit_entry_sign',
        offset: 1.65,
        scale: 1.25,
      });
    }

    // Pit box garages and pit crew teams waiting in boxes across all team stalls
    for (let sIdx = 0; sIdx < 11; sIdx++) {
      const b = Math.round(segments.length - (66 - sIdx * 4.2));
      const boxSeg = segments[b];
      if (boxSeg) {
        if (!boxSeg.sprites) boxSeg.sprites = [];
        boxSeg.sprites.push({
          type: 'pit_box_crew',
          offset: 1.88,
          scale: 1.05,
          text: sIdx === 6 ? teamState.teamName : undefined,
        });
      }
    }

    // 8. Generate closed-loop 2D circuit coordinates from authentic Grand Prix track layout
    const layout = getTrackLayout(activeGp.id || activeGp.name);
    const normalizedMapPoints: { x: number; y: number }[] = [];
    const mapSvgPath = layout.path;

    if (typeof document !== 'undefined') {
      try {
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svgPath.setAttribute('d', layout.path);
        const totalLen = svgPath.getTotalLength();
        if (totalLen > 0) {
          // Find the offset along svgPath closest to layout.startFinish so segment 0 starts at Start/Finish line!
          let bestOffset = 0;
          let minDistance = Infinity;
          const searchSteps = 120;
          for (let step = 0; step < searchSteps; step++) {
            const testLen = (step / searchSteps) * totalLen;
            const pt = svgPath.getPointAtLength(testLen);
            const distSq = Math.pow(pt.x - layout.startFinish.x, 2) + Math.pow(pt.y - layout.startFinish.y, 2);
            if (distSq < minDistance) {
              minDistance = distSq;
              bestOffset = testLen;
            }
          }

          const sampleCount = 140;
          for (let s = 0; s < sampleCount; s++) {
            const sampleDist = (bestOffset + (s / sampleCount) * totalLen) % totalLen;
            const p = svgPath.getPointAtLength(sampleDist);
            normalizedMapPoints.push({ x: p.x, y: p.y });
          }
        }
      } catch (e) {
        console.warn('SVG path sampling fallback:', e);
      }
    }

    if (normalizedMapPoints.length === 0) {
      for (let s = 0; s < 120; s++) {
        const angle = (s / 120) * Math.PI * 2 - Math.PI / 2;
        normalizedMapPoints.push({
          x: 80 + Math.cos(angle) * 55,
          y: 50 + Math.sin(angle) * 32,
        });
      }
    }

    return {
      segments,
      trackLength: segments.length * segmentLength,
      mapSvgPath,
      mapPoints: normalizedMapPoints,
      startFinish: { x: layout.startFinish.x, y: layout.startFinish.y },
    };
  }, [activeGp.id, activeGp.name, activeGp.country]);

  // Initialize Track & Engine
  useEffect(() => {
    const { segments, trackLength, mapSvgPath, mapPoints, startFinish } = buildTrack();
    engineStateRef.current.segments = segments;
    engineStateRef.current.trackLength = trackLength;
    engineStateRef.current.cameraDepth = 1 / Math.tan(((engineStateRef.current.baseFov / 2) * Math.PI) / 180);
    miniMapPointsRef.current = mapPoints;
    setMiniMapSvgPath(mapSvgPath);
    setMiniMapStartFinish(startFinish);

    // Prepopulate speed lines pool with generous capacity for intense booster warp lines
    const lines = [];
    for (let i = 0; i < 110; i++) {
      lines.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 550 + 40,
        length: Math.random() * 26 + 14,
        speed: Math.random() * 480 + 360,
        opacity: Math.random() * 0.08 + 0.04, // Very faint whisper
      });
    }
    engineStateRef.current.speedLines = lines;
  }, [buildTrack]);

  // Mount effect: resume audio, start engine purr, auto-scroll and focus container
  useEffect(() => {
    sound.resumeAudio();
    sound.startOutRunEngine();
    const t = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      containerRef.current?.focus();
    }, 70);
    return () => clearTimeout(t);
  }, []);

  // Automatically select music track randomly/alternating for this Grand Prix stage
  useEffect(() => {
    const track = sound.selectTrackForStage(activeGp.round);
    setCurrentTrackInfo(track);
    setShowTrackToast(true);
    const toastTimer = setTimeout(() => setShowTrackToast(false), 3800);
    return () => clearTimeout(toastTimer);
  }, [activeGp.id, activeGp.round]);

  // 1. Start Gantry Countdown Sequence
  useEffect(() => {
    if (racePhase === 'countdown') {
      sound.resumeAudio();
      sound.startOutRunEngine();
      let light = 0;
      sound.playCountdownBeep(false);
      setCountdownLights(1);

      const interval = setInterval(() => {
        light++;
        if (light <= 5) {
          setCountdownLights(light);
          sound.playCountdownBeep(false);
        } else if (light === 6) {
          // LIGHTS OUT AND AWAY WE GO!
          setCountdownLights(6);
          sound.playCountdownBeep(true);
          sound.startOutRunEngine();
          sound.startRaceMusic();
          clearInterval(interval);

          // Launch race immediately so cars accelerate on green!
          setRacePhase('racing');
          engineStateRef.current.lapStartTime = performance.now();
          engineStateRef.current.lastFrameTime = performance.now();
        }
      }, 700);

      return () => {
        clearInterval(interval);
      };
    }
  }, [racePhase]);

  // 2. Gantry Green Hold & Slide-Up Tween
  // After turning green for a moment (750ms), smoothly slide the gantry upward off the top edge!
  useEffect(() => {
    if (countdownLights === 6) {
      // Hold green for 750ms so player clearly sees the green go signal, then slide up!
      const exitTimer = setTimeout(() => {
        setGantryExiting(true);
      }, 750);

      // Once slide-up transition finishes (700ms transition), unmount from DOM
      const unmountTimer = setTimeout(() => {
        setGantryMounted(false);
      }, 1600);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(unmountTimer);
      };
    } else if (countdownLights < 6) {
      setGantryMounted(true);
      setGantryExiting(false);
    }
  }, [countdownLights]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      sound.stopOutRunEngine();
      sound.stopRaceMusic();
    };
  }, []);

  // Quick Time Event (QTE) input handler for WASD & Arrow keys ("ผู้เล่นต้องเป็นคนกดเองทั้งหมด ยิ่ง Crew เก่ง ลูกศรยิ่งน้อยลง")
  const handlePitQteInput = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const engine = engineStateRef.current;
    if (!engine || engine.pitState !== 'servicing' || engine.pitQteFinished) return;

    // "ทำให้ผู่้เล่น delay กดลูกศรไม่ได้ 0.25 วินาทีถ้ากดปุ่มลูกศรผิดที่ pit"
    // Check if player is currently in 0.25-second lockout penalty from pressing the wrong arrow!
    const now = performance.now();
    if (engine.pitQteLockoutUntil && now < engine.pitQteLockoutUntil) {
      return; // Locked out! Cannot press arrow keys for 0.25 seconds!
    }

    const expectedDir = engine.pitQteSequence[engine.pitQteIndex];
    if (dir === expectedDir) {
      sound.playWheelGun();
      const nextIdx = engine.pitQteIndex + 1;
      engine.pitQteIndex = nextIdx;
      setPitQteIndex(nextIdx);

      if (nextIdx >= engine.pitQteSequence.length) {
        // All servicing steps completed by the player!
        engine.pitQteFinished = true;
        setPitQteComplete(true);
        sound.playAirJack();
        sound.playEngineRev();
        sound.playBoostPad();

        // If player forgot to pit previously and suffered blown tire, reset car back to 100% normal!
        const wasTireBlown = engine.tireBlown;
        engine.tireBlown = false;
        setShowTireBlownAlert(false);

        // If it is raining, fit WET TIRES!
        const wasFittedWetTires = engine.isRaining && !engine.hasWetTires;
        if (engine.isRaining) {
          engine.hasWetTires = true;
          setHudHasWetTires(true);
        }

        // Repair car damage and extinguish any smoke/fire hazard
        const wasDamaged = engine.carHealth < PLAYER_MAX_HEALTH;
        engine.carHealth = PLAYER_MAX_HEALTH;
        engine.isEngineOnFire = false;
        engine.fireTimer = 0;
        setIsEngineOnFire(false);
        setHudCarHealth(PLAYER_MAX_HEALTH);

        const finalTime = engine.pitStopTimer.toFixed(2);
        if (wasFittedWetTires) {
          setPitToastMessage(`🌧️ FITTED WET TIRES: เปลี่ยนยางเปียกลุยฝน + ซ่อมแซมรถเต็ม ${PLAYER_MAX_HEALTH}% (${finalTime}s)`);
        } else if (wasTireBlown) {
          setPitToastMessage(`⚡ ซ่อมแซมยางแตกเรียบร้อย! รถกลับมาสมบูรณ์ ${PLAYER_MAX_HEALTH}% (${finalTime}s)`);
        } else if (wasDamaged) {
          setPitToastMessage(`🔧 PIT SERVICE & REPAIRS: ซ่อมแซมตัวถังและเครื่องยนต์เต็ม ${PLAYER_MAX_HEALTH}% (${finalTime}s)`);
        } else {
          setPitToastMessage(`⚡ PIT STOP COMPLETED IN ${finalTime}s: ALL ${engine.pitQteSequence.length} STATIONS SECURED!`);
        }
        setTimeout(() => setPitToastMessage(null), 3500);
        setTimeout(() => {
          setPitQteActive(false);
          // Immediate rocket launch out of pit stall, unrestricted racing speed, player controls steering!
          engine.inPitLane = false;
          engine.pitState = 'none';
          engine.hasPitted = true;
          engine.tireBlown = false;
          setShowTireBlownAlert(false);
          setPlayerHasPitted(true);
          engine.speed = Math.max(engine.speed, 245);
          engine.boostPadTimer = 2.0;
          sound.playPitLimiterBeep();
        }, 220);
      }
    } else {
      // Wrong arrow key: 0.25-second (250ms) lockout delay penalty! Player cannot press arrow keys for 0.25s!
      const lockUntil = performance.now() + 250;
      engine.pitQteLockoutUntil = lockUntil;
      setPitQteLockout(true);
      setPitQteShake(true);
      sound.playFumbleError();

      setTimeout(() => {
        setPitQteShake(false);
      }, 200);

      setTimeout(() => {
        setPitQteLockout(false);
      }, 250);
    }
  }, []);

  // Keyboard Event Listeners (WASD, Arrow keys, Shift / Space for Nitro Boost!)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Resume Web Audio context immediately on any user gesture!
      sound.resumeAudio();
      if (!sound.getIsMuted()) {
        sound.startOutRunEngine();
        if (racePhase === 'racing' && !sound.getIsMusicMuted() && !sound.isRaceMusicPlaying()) {
          sound.startRaceMusic();
        }
      }

      // Prevent browser scroll on arrow keys, space, and shift
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight'].includes(e.code)) {
        e.preventDefault();
      }

      // If currently inside Pit Stop QTE, prioritize WASD / Arrow directional input!
      if (engineStateRef.current.pitState === 'servicing') {
        if (e.code === 'KeyW' || e.code === 'ArrowUp') {
          handlePitQteInput('UP');
          return;
        }
        if (e.code === 'KeyS' || e.code === 'ArrowDown') {
          handlePitQteInput('DOWN');
          return;
        }
        if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
          handlePitQteInput('LEFT');
          return;
        }
        if (e.code === 'KeyD' || e.code === 'ArrowRight') {
          handlePitQteInput('RIGHT');
          return;
        }
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.up = true;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keysRef.current.down = true;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
      }
      // "shift to nitro" and Spacebar for Turbo Nitro Boost!
      if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keysRef.current.drs = true;
        if (engineStateRef.current.nitroDepleted && racePhase === 'racing') {
          const now = performance.now();
          if (!engineStateRef.current.lastLockAlertTime || now - engineStateRef.current.lastLockAlertTime > 1400) {
            engineStateRef.current.lastLockAlertTime = now;
            sound.playKerbThump();
            addHudAlert(
              'info',
              '🔒 NITRO ล็อกอยู่!',
              `รอรีโหลดเต็ม 100% (ขณะนี้ ${Math.round(engineStateRef.current.nitroFuel)}%)`,
              '🔒',
              'LOCK'
            );
          }
        }
      }
      if (e.code === 'KeyF') {
        toggleFullscreen();
      }
      if (e.code === 'KeyM') {
        const active = sound.toggleRaceMusic();
        setIsMusicOn(active);
      }
      if (e.code === 'KeyT') {
        const next = sound.toggleNextTrack();
        setCurrentTrackInfo(next);
        setShowTrackToast(true);
        setTimeout(() => setShowTrackToast(false), 3200);
      }
      if (e.code === 'KeyR') {
        toggleRain();
      }
      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (racePhase === 'racing') {
          setRacePhase('paused');
          sound.stopOutRunEngine();
        } else if (racePhase === 'paused') {
          setRacePhase('racing');
          sound.startOutRunEngine();
          engineStateRef.current.lastFrameTime = performance.now();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        keysRef.current.up = false;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keysRef.current.down = false;
      }
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
      if (e.code === 'Space' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        keysRef.current.drs = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [racePhase, handlePitQteInput]);

  // 3D Perspective Projection Function
  const projectPoint = (
    p: { world: { x: number; y: number; z: number }; camera: { x: number; y: number; z: number }; screen: { x: number; y: number; w: number; scale: number } },
    cameraX: number,
    cameraY: number,
    cameraZ: number,
    cameraDepth: number,
    width: number,
    height: number,
    roadWidth: number
  ) => {
    p.camera.x = (p.world.x || 0) - cameraX;
    p.camera.y = (p.world.y || 0) - cameraY;
    p.camera.z = (p.world.z || 0) - cameraZ;

    p.screen.scale = cameraDepth / p.camera.z;
    p.screen.x = Math.round(width / 2 + (p.screen.scale * p.camera.x * width) / 2);
    p.screen.y = Math.round(height / 2 - (p.screen.scale * p.camera.y * height) / 2);
    p.screen.w = Math.round((p.screen.scale * roadWidth * width) / 2);
  };

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;

    const gameLoop = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const engine = engineStateRef.current;
      const dt = Math.min(0.06, (timestamp - engine.lastFrameTime) / 1000);
      engine.lastFrameTime = timestamp;

      const width = canvas.width;
      const height = canvas.height;
      const nowMs = performance.now();

      // Helper to trigger physical crash impact, sound, camera shake, rebound, and debris
      const triggerPropCollision = (sp: RoadsideSprite) => {
        // Complete immunity in pit lane or with friendly pit structures:
        // "เหมือนว่าตอนเข้า pits มันจะชนวัตถุใน pits ไปมานะ แก้ไขให้ด้วย"
        if (
          engine.inPitLane ||
          engine.pitState !== 'none' ||
          sp.type === 'pit_box_crew' ||
          sp.type === 'pit_entry_sign' ||
          sp.type === 'team_pitwall'
        ) {
          return;
        }

        sp.hit = true;
        sp.playerHitUntil = nowMs + 1800; // Solid impact cooldown (ready again next lap or after 1.8s)
        engine.totalCollisionsCount = (engine.totalCollisionsCount || 0) + 1;

        sound.playCrashImpact();

        const pushAwayDir = engine.playerX >= sp.offset ? 1 : -1;

        let damage = 2;
        if (
          sp.type === 'road_barrier' ||
          sp.type === 'fallen_tree' ||
          sp.type === 'grandstand'
        ) {
          damage = Math.round(18 + Math.min(5, (engine.speed / 280) * 5));
          // Concrete / timber / heavy structure: impact scrub with fast recovery
          engine.speed = Math.max(55, engine.speed * 0.44);
          engine.crashStunTimer = 0.38;
          engine.cameraShake.x = pushAwayDir * 26;
          engine.cameraShake.y = (Math.random() - 0.5) * 20;
          engine.lateralVx = pushAwayDir * 4.8;
          engine.playerX += pushAwayDir * 0.09;
        } else if (
          sp.type === 'palm_tree' ||
          sp.type === 'pine_tree' ||
          sp.type === 'green_tree'
        ) {
          damage = Math.round(14 + Math.min(4, (engine.speed / 280) * 4));
          // Tree trunk collision
          engine.speed = Math.max(60, engine.speed * 0.46);
          engine.crashStunTimer = 0.35;
          engine.cameraShake.x = pushAwayDir * 24;
          engine.cameraShake.y = (Math.random() - 0.5) * 18;
          engine.lateralVx = pushAwayDir * 4.4;
          engine.playerX += pushAwayDir * 0.08;
        } else if (
          sp.type === 'track_light' ||
          sp.type === 'f1_marshal_post' ||
          sp.type === 'safety_fence' ||
          sp.type === 'drs_gantry'
        ) {
          damage = Math.round(11 + Math.min(3, (engine.speed / 280) * 3));
          // Steel pole / marshal post / catch fence
          engine.speed = Math.max(65, engine.speed * 0.50);
          engine.crashStunTimer = 0.30;
          engine.cameraShake.x = pushAwayDir * 22;
          engine.cameraShake.y = (Math.random() - 0.5) * 16;
          engine.lateralVx = pushAwayDir * 4.0;
          engine.playerX += pushAwayDir * 0.07;
        } else if (sp.type === 'sponsor_billboard') {
          damage = Math.round(8 + Math.min(3, (engine.speed / 280) * 3));
          // Billboard signage smash
          engine.speed = Math.max(70, engine.speed * 0.58);
          engine.crashStunTimer = 0.25;
          engine.cameraShake.x = pushAwayDir * 20;
          engine.cameraShake.y = (Math.random() - 0.5) * 14;
          engine.lateralVx = pushAwayDir * 3.6;
          engine.playerX += pushAwayDir * 0.06;
        } else if (sp.type === 'tire_barrier' || sp.type === 'tire_stack') {
          damage = Math.round(6 + Math.min(3, (engine.speed / 280) * 2));
          // Rubber safety tire stack
          engine.speed = Math.max(75, engine.speed * 0.65);
          engine.crashStunTimer = 0.22;
          engine.cameraShake.x = pushAwayDir * 18;
          engine.cameraShake.y = (Math.random() - 0.5) * 14;
          engine.lateralVx = pushAwayDir * 3.4;
          engine.playerX += pushAwayDir * 0.05;
        } else if (sp.type === 'oil_slick') {
          damage = 3;
          // Oil slick spinout: momentary slip without killing total speed
          engine.speed = Math.max(65, engine.speed - 42);
          engine.lateralVx = (Math.random() > 0.5 ? 5.2 : -5.2);
          sound.playTireSqueal();
          engine.oilSlipTimer = 2.0;
          engine.cameraShake.x = (Math.random() - 0.5) * 18;
          engine.cameraShake.y = (Math.random() - 0.5) * 14;
        } else {
          damage = 3;
          // Distance boards, cones, etc. (light brush penalty)
          engine.speed = Math.max(80, engine.speed - 24);
          engine.crashStunTimer = 0.12;
          engine.cameraShake.x = pushAwayDir * 14;
          engine.cameraShake.y = (Math.random() - 0.5) * 12;
          engine.lateralVx = pushAwayDir * 2.8;
          engine.playerX += pushAwayDir * 0.04;
        }

        // Apply physical damage to vehicle health ("เพิ่มเลือดและความทนทานให้ผู้เล่นอีกนิดหน่อย")
        if (!engine.isEngineOnFire && racePhase === 'racing') {
          const nowDamageTime = nowMs;
          if (!engine.lastDamageTimestamp || nowDamageTime - engine.lastDamageTimestamp > 240) {
            engine.lastDamageTimestamp = nowDamageTime;
            const durFactor = Math.max(0.68, 1 - ((teamState.car?.chassis || 70) - 50) * 0.006);
            const appliedDamage = Math.max(2, Math.round(damage * durFactor));
            engine.carHealth = Math.max(0, engine.carHealth - appliedDamage);
            setHudCarHealth(Math.round(engine.carHealth));
            if (engine.carHealth <= 0) {
              engine.isEngineOnFire = true;
              engine.fireTimer = 0;
              engine.pitLockoutTimer = 6.0;
              setIsEngineOnFire(true);
              sound.playEngineExplosionFire();
              setPitToastMessage('🔥 รถพังเสียหายจนไฟไหม้!');
            }
          }
        }

        // Flying debris and spark particles matching the struck object
        const pCol =
          sp.type === 'palm_tree' || sp.type === 'green_tree' || sp.type === 'pine_tree'
            ? '#22c55e'
            : sp.type === 'traffic_cone'
            ? '#ea580c'
            : sp.type === 'oil_slick'
            ? '#38bdf8'
            : sp.type === 'fallen_tree'
            ? '#78350f'
            : sp.type === 'sponsor_billboard'
            ? '#f59e0b'
            : '#eab308';
        for (let p = 0; p < 28; p++) {
          engine.particles.push({
            x: width / 2 + (Math.random() * 100 - 50),
            y: height - 145 + Math.random() * 25,
            vx: (Math.random() - 0.5) * 360,
            vy: -Math.random() * 220 - 70,
            life: 1.2,
            color: pCol,
          });
        }
      };

      // =======================================================================
      // 1. PHYSICS & INPUT UPDATE (only when active racing)
      // =======================================================================
      // Live Engine Audio during Starting Grid Countdown (Deep V6 purr & player grid rev-ups)
      if (racePhase === 'countdown') {
        const isGas = keysRef.current.up;
        const gridRpm = isGas ? 7200 : 2800;
        engine.rpm = gridRpm;
        const rpmNorm = isGas ? 0.42 : 0.05;
        sound.updateOutRunEngine(
          rpmNorm,
          0,
          isGas,
          false,
          false,
          false,
          1,
          false,
          false
        );
      }

      if (racePhase === 'racing' || racePhase === 'finished') {
        const isFinished = racePhase === 'finished' || engine.isFinished;
        // Shift to Nitro automatically engages full racing throttle!
        const isGas = isFinished ? true : (keysRef.current.up || (keysRef.current.drs && !engine.nitroDepleted));
        const isBrake = isFinished ? false : keysRef.current.down;
        const isSteerLeft = isFinished ? false : keysRef.current.left;
        const isSteerRight = isFinished ? false : keysRef.current.right;
        const isDrs = isFinished ? false : keysRef.current.drs;

        // Current road segment under car
        const currentSegmentIndex = Math.floor(engine.position / engine.segmentLength) % engine.segments.length;
        const currentSegment = engine.segments[currentSegmentIndex];
        const inPitLaneAsphalt = (
          engine.inPitLane ||
          engine.pitState !== 'none' ||
          (currentSegment?.isPitLaneZone && engine.playerX >= 0.70 && engine.playerX <= 2.10) ||
          (currentSegmentIndex <= 45 && engine.playerX >= 0.70 && engine.playerX <= 2.10)
        );
        const isOffroad = inPitLaneAsphalt ? false : Math.abs(engine.playerX) > 1.0;
        const onKerb = inPitLaneAsphalt ? false : (Math.abs(engine.playerX) > 0.82 && Math.abs(engine.playerX) <= 1.05);

        // Upcoming curve warning (check 35 segments ahead)
        const lookAheadIndex = (currentSegmentIndex + 35) % engine.segments.length;
        const lookAheadSegment = engine.segments[lookAheadIndex];
        if (lookAheadSegment && Math.abs(lookAheadSegment.curve) > 1.2 && !isFinished) {
          if (lookAheadSegment.curve > 2.0) {
            engine.curveUpcomingText = 'SHARP RIGHT >>';
          } else if (lookAheadSegment.curve > 1.2) {
            engine.curveUpcomingText = 'TURN RIGHT >';
          } else if (lookAheadSegment.curve < -2.0) {
            engine.curveUpcomingText = '<< SHARP LEFT';
          } else {
            engine.curveUpcomingText = '< TURN LEFT';
          }
        } else {
          engine.curveUpcomingText = null;
        }

        // DRS / Nitro Boost Logic:
        // "ล็อก nitro ถ้าใช้จนหมด รอโหลดเต็มถึงจะใช้ใหม่ได้"
        const isNitroRequested = isDrs && !engine.nitroDepleted;

        // Nitro Depletion Check: If nitro hits empty, it locks out until fully recharged to 100%!
        if (engine.nitroFuel <= 0.1) {
          if (!engine.nitroDepleted) {
            sound.playTireSqueal();
            addHudAlert('info', '🔒 NITRO หมด!', 'ล็อกจนกว่าจะรีโหลดเต็ม 100%', '🔒', 'LOCK');
          }
          engine.nitroFuel = 0;
          engine.nitroDepleted = true;
          engine.drsActive = false;
        }

        // Recharging Nitro Fuel: Only when nitro is not active
        if (engine.nitroFuel < 100 && racePhase === 'racing' && !engine.isEngineOnFire && !engine.drsActive) {
          const rechargeRate = engine.slipstreamActive
            ? AI_DIFFICULTY.nitroRechargePlayerSlipstream
            : AI_DIFFICULTY.nitroRechargePlayer;
          engine.nitroFuel = Math.min(100, engine.nitroFuel + rechargeRate * dt);
          if (engine.nitroFuel >= 100) {
            engine.nitroFuel = 100;
            if (engine.nitroDepleted) {
              engine.nitroDepleted = false; // UNLOCKED! Fully reloaded to 100%!
              sound.playPitLimiterBeep();
              addHudAlert('info', '⚡ NITRO เต็มแล้ว!', 'พร้อมใช้งาน 100%', '⚡', 'READY');
            }
          }
        }

        // Cannot activate nitro if depleted until fully refilled to 100%!
        const canUseNitro =
          !isFinished &&
          !engine.inPitLane &&
          !engine.isEngineOnFire &&
          engine.speed > 25 &&
          engine.nitroFuel > 0 &&
          !engine.nitroDepleted;

        if (canUseNitro && isNitroRequested) {
          if (!engine.drsActive) {
            // Punchy nitro kick (reduced 25% for player only: kick from +18 to +13.5, ceiling from 350 to 338 km/h)
            const playerNitroCeiling = 338;
            engine.speed = Math.min(playerNitroCeiling, engine.speed + 13.5);
            sound.playBoostPad();
            engine.cameraShake.y = 8;
            engine.cameraShake.x = (Math.random() - 0.5) * 5;
          }
          engine.drsActive = true;
          // Burn nitro fuel: lasts ~2.25 seconds (reduced to half duration from previous ~4.5s)
          engine.nitroFuel = Math.max(0, engine.nitroFuel - 44 * dt);
          if (engine.nitroFuel <= 0.1) {
            engine.nitroFuel = 0;
            if (!engine.nitroDepleted) {
              sound.playTireSqueal();
              addHudAlert('info', '🔒 NITRO หมด!', 'ล็อกจนกว่าจะรีโหลดเต็ม 100%', '🔒', 'LOCK');
            }
            engine.nitroDepleted = true; // Drained! Locked until fully recharged to 100%!
            engine.drsActive = false;
          }
        } else {
          engine.drsActive = false;
        }

        // Player nitro boost speed reduced by 25% (player only)
        const nitroBoostSpeed = Math.round(drsSpeedBonus * 0.75);
        let effectiveMaxSpeed = engine.drsActive
          ? Math.min(338, maxSpeed + nitroBoostSpeed)
          : isOffroad
          ? Math.max(90, Math.min(125 + (teamState.car.suspension - 70) * 0.8, maxSpeed * 0.38)) // Suspension increases offroad speed floor
          : maxSpeed;

        // "เพิ่มบทลงโทษถ้าไม่เข้า pits จะมีข้อแจ้งเตือนประมาณสั้นๆว่า ยางแตกเนื้องอจากไม่ได้เข้า pits ความเร็วจะลด 50% ตลอดทั้งเกม"
        if (engine.tireBlown) {
          effectiveMaxSpeed = Math.round(effectiveMaxSpeed * 0.50);
        }

        // Crash stun recovery timer
        if (engine.crashStunTimer > 0) {
          engine.crashStunTimer -= dt;
        }

        // Boost Pad duration timer & maximum speed ceiling elevation
        if (engine.boostPadTimer > 0) {
          engine.boostPadTimer -= dt;
          const playerBoosterCeiling = 345;
          effectiveMaxSpeed = Math.max(effectiveMaxSpeed, playerBoosterCeiling);
        }

        // Check player driving over a Speed Pad / Boost Pad on road
        if (currentSegment && currentSegment.boostPad && !engine.inPitLane) {
          const padOffset = currentSegment.boostPad.offset;
          const padHalfWidth = (currentSegment.boostPad.width || 0.52) / 2 + 0.12;
          if (Math.abs(engine.playerX - padOffset) < padHalfWidth) {
            if (engine.boostPadTimer < 1.2) {
              engine.boostPadTimer = boostPadDuration;
              const playerBoosterCeiling = 345;
              engine.speed = Math.min(playerBoosterCeiling, Math.max(engine.speed + 35, 330));
              sound.playBoostPad();

              // Explosive burst of glowing golden-yellow speed sparks & thrust particles!
              for (let p = 0; p < 30; p++) {
                engine.particles.push({
                  x: width / 2 + (Math.random() - 0.5) * 80,
                  y: height - 155 + 16 + Math.random() * 20,
                  vx: (Math.random() - 0.5) * 360,
                  vy: Math.random() * 140 + 60,
                  life: 0.9,
                  color: Math.random() > 0.4 ? '#facc15' : '#f59e0b',
                });
              }
            }
          }
        }

        // =====================================================================
        // PIT LANE ENTRY, SPEED LIMITER, SERVICE & EXIT CONTROLS
        // =====================================================================
        const pitEntryStart = Math.max(0, engine.segments.length - 90);
        const pitEntryEnd = Math.max(0, engine.segments.length - 8);
        const playerBoxSeg = Math.max(0, engine.segments.length - 26);
        const middleLap = engine.totalLaps <= 2 ? 1 : Math.floor(engine.totalLaps / 2) + 1;
        // Strictly scheduled on middle lap, but if player hasn't pitted yet or has a blown tire, pit lane remains open so they can pit to repair!
        const isPitAvailable = (!engine.hasPitted || engine.tireBlown) && (engine.lap >= middleLap);

        // Check Mandatory Pit Stop missed penalty: blown tire!
        // "เพิ่มบทลงโทษถ้าไม่เข้า pits จะมีข้อแจ้งเตือนประมาณสั้นๆว่า ยางแตกเนื้องอจากไม่ได้เข้า pits ความเร็วจะลด 50% ตลอดทั้งเกม"
        if (!engine.hasPitted && !engine.inPitLane && !engine.tireBlown) {
          const missedPitDeadline = (engine.lap === middleLap && currentSegmentIndex > engine.segments.length - 10) || engine.lap > middleLap;
          if (missedPitDeadline && racePhase === 'racing') {
            engine.tireBlown = true;
            setShowTireBlownAlert(true);
            sound.playCrashImpact();
            sound.playTireSqueal();
            engine.cameraShake.x = (Math.random() - 0.5) * 26;
            engine.cameraShake.y = 18;
            for (let p = 0; p < 45; p++) {
              engine.particles.push({
                x: width / 2 + (Math.random() - 0.5) * 80,
                y: height - 145 + Math.random() * 25,
                vx: (Math.random() - 0.5) * 320,
                vy: Math.random() * 120 + 30,
                life: 1.2,
                color: Math.random() > 0.5 ? '#ef4444' : '#1f2937',
              });
            }
          }
        }

        if (engine.pitLockoutTimer > 0) {
          engine.pitLockoutTimer = Math.max(0, engine.pitLockoutTimer - dt);
        }

        // Player intentionally steers right onto the branching pit lane road
        // "แล้วก็รถถ้าพังแล้วก็จะเข้า สนามpits ไม่ได้ทันที"
        const isCarBroken = engine.carHealth <= 0 || engine.isEngineOnFire;
        const isPitLockoutActive = isCarBroken && engine.pitLockoutTimer > 0;

        if (!isFinished && isPitAvailable && ((currentSegmentIndex >= pitEntryStart && currentSegmentIndex <= pitEntryEnd) || currentSegmentIndex >= engine.segments.length - 12)) {
          if ((isSteerRight && engine.playerX > 0.52) || engine.playerX > 0.72) {
            if (isPitLockoutActive) {
              // Broken car cannot enter pits immediately! Must wait for recovery/cooldown
              if (!engine.pitBlockedToastShown || nowMs - engine.pitBlockedToastShown > 2400) {
                engine.pitBlockedToastShown = nowMs;
                setPitToastMessage(`⛔ รถพัง! เข้า PIT ทันทีไม่ได้ (รอ ${Math.ceil(engine.pitLockoutTimer)}s)`);
                setTimeout(() => setPitToastMessage(null), 2000);
              }
            } else if (engine.pitState === 'none') {
              engine.inPitLane = true;
              engine.pitState = 'entering';
              sound.playPitLimiterBeep();
            }
          }
        }

        if (engine.inPitLane) {
          if (engine.pitState === 'entering') {
            // "แก้ไขบัคตอนเข้า pits พอเข้าพลาด กลายเป็นว่าค้างอยู่ข้างทางตลอด บังคับเข้าถนนไม่ได้"
            // If player steers left back towards the track very early on the approach, allow them to safely return to the main road!
            if (isSteerLeft && engine.playerX <= 0.95 && currentSegmentIndex < engine.segments.length - 55 && currentSegmentIndex >= engine.segments.length - 90) {
              engine.inPitLane = false;
              engine.pitState = 'none';
            } else if (currentSegmentIndex >= engine.segments.length - 70 || currentSegmentIndex <= 18) {
              // "บางทีเข้า pits ไม่ทัน แล้วพ้นไปนิดเดียวกลายว่า ไม่มี qucik time event"
              // Smoothly and decisively bring car to a full stop in the team pit box!
              // Even if entering fast, late, or rolling past by a little, braking firmly locks the car into the pit box for the QTE!
              engine.speed = Math.max(0, engine.speed - 700 * dt);
              if (engine.speed <= 35 || currentSegmentIndex >= playerBoxSeg || currentSegmentIndex <= 18) {
                engine.speed = 0;
                engine.pitState = 'servicing';
                engine.pitStopTimer = 0;
                // Calculate base duration based on player's hired pit crew speed & precision
                const pitCalc = calculatePitStopDuration(pitCrewSpeed, teamState.pitCrew?.precision || 70);
                const emergencyOverhaulPenalty = isCarBroken ? 4.5 : 0;
                const totalPitDur = pitCalc.duration + emergencyOverhaulPenalty;
                engine.pitDuration = totalPitDur;
                setPitQteTargetDuration(totalPitDur);

                // Setup randomized QTE sequence based on Pit Crew Skill:
                // Elite crew (92+ OVR) -> 4 arrows
                // High crew (84-91 OVR) -> 5 arrows
                // Good crew (76-83 OVR) -> 6 arrows
                // Average crew (68-75 OVR) -> 7 arrows
                // Rookie crew (60-67 OVR) -> 8 arrows
                // Untrained crew (< 60 OVR) -> 9 arrows
                const arrowCount = getPitQteArrowCount(pitCrewSkill);
                const generatedSequence = generatePitQteSequence(arrowCount);

                engine.pitQteSequence = generatedSequence;
                engine.pitQteIndex = 0;
                engine.pitQteFinished = false;
                engine.pitQteLockoutUntil = 0;
                setPitQteSequence(generatedSequence);
                setPitQteIndex(0);
                setPitQteComplete(false);
                setPitQteElapsed(0);
                setPitQteLockout(false);
                setPitQteActive(true);
                sound.playAirJack();
              }
            } else {
              // Smoothly decelerate down from racing speed towards pit limiter speed
              if (engine.speed > 80) {
                engine.speed = Math.max(80, engine.speed - 360 * dt);
              } else {
                engine.speed = Math.min(80, engine.speed + 120 * dt);
              }
            }

            // Settle car into pit lane lateral position while entering
            if (!isSteerLeft) {
              engine.playerX += (1.40 - engine.playerX) * 4.0 * dt;
            }
          } else if (engine.pitState === 'servicing') {
            engine.speed = 0;
            engine.playerX = 1.40;
            // Car remains stationary in pit box while player completes all QTE arrow inputs!
            if (!engine.pitQteFinished) {
              engine.pitStopTimer += dt;
              setPitQteElapsed(engine.pitStopTimer);
            }
          } else if (engine.pitState === 'exiting') {
            // Immediate launch without holding or slowing the player down!
            engine.inPitLane = false;
            engine.pitState = 'none';
            engine.hasPitted = true;
            setPlayerHasPitted(true);
            engine.speed = Math.max(engine.speed, 225);
            sound.playPitLimiterBeep();
          }
        } else if (isFinished) {
          // Throttle & Braking (smooth victory autopilot cruising if finished)
          const targetCruiseSpeed = 195;
          engine.speed += (targetCruiseSpeed - engine.speed) * 1.5 * dt;
        } else if (isGas || engine.drsActive) {
          let accelPower = engine.drsActive ? Math.max(accelRate * 2.4, 520) : accelRate;
          if (engine.boostPadTimer > 0) {
            accelPower *= 1.4; // rocket thrust during Speed Pad boost!
          }
          if (engine.crashStunTimer > 0) {
            accelPower *= 0.15; // heavily restricted while recovering from crash
          }
          if (isOffroad) {
            accelPower *= 0.45; // responsive on grass/verge
          }
          if (engine.tireBlown) {
            accelPower *= 0.50; // 50% power reduction with blown tire
          }
          engine.speed = Math.min(effectiveMaxSpeed, engine.speed + accelPower * dt);

          // Dual electric-blue/cyan/violet supersonic nitro plasma trail particles when boost is active!
          if (engine.drsActive && engine.speed > 50) {
            for (let np = 0; np < 5; np++) {
              engine.particles.push({
                x: width / 2 + (Math.random() - 0.5) * 40 + (np % 2 === 0 ? -22 : 22),
                y: height - 122 + Math.random() * 12,
                vx: (Math.random() - 0.5) * 90,
                vy: Math.random() * 260 + 160,
                life: 0.55,
                color: Math.random() < 0.3 ? '#ffffff' : Math.random() < 0.65 ? '#06b6d4' : Math.random() < 0.85 ? '#38bdf8' : '#a855f7',
              });
            }
          }
        } else if (isBrake) {
          // Brakes: reduces speed lost when braking into upcoming sharp curves according to brakes stat
          const curveBrakeModifier = engine.curveUpcomingText
            ? Math.max(0.72, 1.0 - ((teamState.car.brakes - 70) / 29) * 0.22)
            : 1.0;
          engine.speed = Math.max(0, engine.speed - brakeRate * dt * curveBrakeModifier);
        } else {
          // Natural deceleration / engine braking (suspension reduces offroad drag)
          const offroadDrag = Math.max(160, 360 - (teamState.car.suspension - 70) * 4.5);
          const drag = isOffroad ? offroadDrag : 75;
          engine.speed = Math.max(0, engine.speed - drag * dt);
        }

        // Engine fire failure handling: car loses power and smoothly decelerates to a halt while on fire!
        // "ให้รถให้ค่อยๆช้าลงในคณะี่มีไฟขึ้นและขึ้นหน้าแพ้"
        if (engine.isEngineOnFire) {
          effectiveMaxSpeed = 0;
          engine.speed = Math.max(0, engine.speed - 120 * dt);
          engine.fireTimer += dt;

          // Violent flame and smoke particles
          for (let f = 0; f < 3; f++) {
            engine.particles.push({
              x: width / 2 + (Math.random() - 0.5) * 45,
              y: height - 125 + Math.random() * 20,
              vx: (Math.random() - 0.5) * 160,
              vy: -Math.random() * 180 - 60,
              life: 0.8,
              color: Math.random() < 0.5 ? '#ef4444' : Math.random() < 0.85 ? '#f97316' : '#eab308',
            });
          }

          // When car completely stops (or after 3.8s of flameout): trigger DNF Loss!
          if ((engine.speed <= 2 || engine.fireTimer >= 3.8) && !engine.isDnf && racePhase === 'racing') {
            engine.isDnf = true;
            engine.isFinished = true;
            sound.stopOutRunEngine();
            sound.stopRaceMusic();

            const now = performance.now();
            const totalMs = engine.lapTimes.reduce((acc, t) => acc + t, 0) + (now - engine.lapStartTime);
            const standings = [
              ...engine.aiCars.map((ai, idx) => ({
                pos: idx + 1,
                name: ai.name,
                tag: ai.tag,
                team: ai.teamName,
                primaryColor: ai.primaryColor,
                timeStr: ai.isDnf ? 'DNF (CRASH)' : idx === 0 ? formatLapTime(targetLapSeconds * lapsCount * 1000) : `+${((idx + 1) * 2.1).toFixed(2)}s`,
                isPlayer: false,
                personality: getDriverPersonality(ai.id),
              })),
              {
                pos: 12,
                name: teamState.driver1.name,
                tag: teamState.driver1.name.slice(0, 3).toUpperCase(),
                team: teamState.teamName,
                primaryColor: teamState.primaryColor || '#dc2626',
                timeStr: 'DNF (ENGINE FIRE)',
                isPlayer: true,
              },
            ];

            setRaceSummary({
              position: 12,
              bestLapMs: engine.bestLapTimeMs || 0,
              totalTimeMs: totalMs,
              topSpeed: engine.topSpeedRecorded,
              offroadEvents: engine.offroadEventsCount,
              standings,
              isDnfFireLoss: true,
              fireDnfReason: 'เครื่องยนต์ระเบิดไฟไหม้จากการชนสะสม รถหยุดทำงาน (ENGINE FIRE DNF)',
            });

            setRacePhase('finished');
          }
        }

        // Progressive engine damage smoke: "(ยิ่งใกล้พังยิ่งมีควันเยอะขึ้น)"
        if (!engine.isEngineOnFire && engine.carHealth < (PLAYER_MAX_HEALTH * 0.75) && engine.speed > 35) {
          const dmg = PLAYER_MAX_HEALTH - engine.carHealth;
          const smokeOdds = dmg > (PLAYER_MAX_HEALTH * 0.60) ? 0.70 : dmg > (PLAYER_MAX_HEALTH * 0.35) ? 0.40 : 0.20;
          if (Math.random() < smokeOdds) {
            const isDark = dmg > (PLAYER_MAX_HEALTH * 0.50);
            engine.particles.push({
              x: width / 2 + (Math.random() - 0.5) * 35,
              y: height - 120,
              vx: (Math.random() - 0.5) * (isDark ? 65 : 35),
              vy: -Math.random() * (isDark ? 90 : 50) - 20,
              life: isDark ? 0.85 : 0.65,
              color: isDark ? (Math.random() < 0.25 ? '#f97316' : '#1e293b') : '#94a3b8',
            });
          }
        }

        // Clamp speed if blown tire was active and speed was above effectiveMaxSpeed
        if (engine.tireBlown && engine.speed > effectiveMaxSpeed) {
          engine.speed = Math.max(effectiveMaxSpeed, engine.speed - 160 * dt);
        }

        // Continuous flat tire smoke/sparks
        if (engine.tireBlown && engine.speed > 50 && Math.random() < 0.28) {
          engine.particles.push({
            x: width / 2 + (Math.random() - 0.5) * 45,
            y: height - 135,
            vx: (Math.random() - 0.5) * 120,
            vy: Math.random() * 80 + 30,
            life: 0.6,
            color: Math.random() > 0.4 ? '#475569' : '#ef4444',
          });
        }

        if (engine.speed > engine.topSpeedRecorded) {
          engine.topSpeedRecorded = Math.round(engine.speed);
        }

        // Authentic Pseudo-3D Arcade Steering Physics (OutRun / Pole Position style)
        const speedPercent = engine.speed / maxSpeed;
        const steerSpeedFactor = Math.min(1.0, 0.45 + 0.55 * speedPercent);
        const baseTurnSpeed = 2.45 + (handlingRate - 3.6) * 0.35;
        // Boost turn rate if steering toward the track from off-road, so player can always cleanly steer back onto the road!
        const isSteeringTowardRoad = (engine.playerX > 1.0 && isSteerLeft) || (engine.playerX < -1.0 && isSteerRight);
        const maxTurnRate = baseTurnSpeed * steerSpeedFactor * (isSteeringTowardRoad ? 1.75 : 1.0);

        // Desired lateral acceleration from player input (or smooth centering if finished)
        let targetLateralAcc = 0;
        if (isFinished) {
          targetLateralAcc = (0 - engine.playerX) * 1.8;
        } else if (isSteerLeft) {
          targetLateralAcc = -maxTurnRate;
        } else if (isSteerRight) {
          targetLateralAcc = maxTurnRate;
        }

        // Wet Track Cornering Slip & Aquaplaning:
        // Balanced realistic arcade grip: on wet track without wet tires, high-speed cornering drifts wider,
        // but suspension dampens sliding and maintains responsive steering control!
        let isAquaplaningNow = false;
        if (engine.isRaining && !engine.hasWetTires && !inPitLaneAsphalt && engine.speed > 80) {
          const curveVal = currentSegment?.curve || 0;
          const isCorneringFast = Math.abs(curveVal) > 0.25 || ((isSteerLeft || isSteerRight) && engine.speed > 160);
          if (isCorneringFast) {
            isAquaplaningNow = true;
            // Suspension improves wet road mechanical grip and reduces outward sliding
            const suspensionWetGrip = Math.max(0.45, 1.0 - ((teamState.car.suspension - 70) / 29) * 0.45);
            const curveSlip = -curveVal * 0.42 * (engine.speed / maxSpeed) * suspensionWetGrip;
            targetLateralAcc += curveSlip;

            // Gentle water rooster-tail spray & tire slip sound
            if (Math.random() < 0.20) {
              sound.playTireSqueal();
              for (let w = 0; w < 2; w++) {
                engine.particles.push({
                  x: width / 2 + (Math.random() - 0.5) * 60,
                  y: height - 50,
                  vx: (Math.random() - 0.5) * 45 + curveSlip * 12,
                  vy: -Math.random() * 45 - 20,
                  life: 0.5,
                  color: '#bae6fd',
                });
              }
            }
          }
        }
        if (engine.oilSlipTimer > 0) {
          engine.oilSlipTimer = Math.max(0, engine.oilSlipTimer - dt);
          isAquaplaningNow = true;
        }

        // Smooth progressive lateral inertia with responsive crisp bite
        const steerInertiaRate = 8.5;
        engine.lateralVx += (targetLateralAcc - engine.lateralVx) * steerInertiaRate * dt;

        // Viscous damping when releasing steering
        if (!isSteerLeft && !isSteerRight) {
          engine.lateralVx *= Math.exp(-6.8 * dt);
        }

        // Apply progressive lateral velocity to player road position
        engine.playerX += engine.lateralVx * dt;

        // Steering Wheel Lock Angle with mechanical weight resistance and responsive flick
        const targetSteerAngle = isFinished ? 0 : isSteerLeft ? -1.0 : isSteerRight ? 1.0 : 0;
        const steerResponse = 8.2 - speedPercent * 1.0;
        engine.steerAngle += (targetSteerAngle - engine.steerAngle) * steerResponse * dt;

        // Realistic Centrifugal Drift in Turns & Responsive Dynamic World Panorama Rotation (brakes relieve curve scrub)
        if (currentSegment && currentSegment.curve !== 0) {
          const curveBrakeRelief = Math.max(0.60, 1.0 - ((teamState.car.brakes - 70) / 29) * 0.35);
          const centrifugal = currentSegment.curve * Math.pow(speedPercent, 1.2) * 0.22 * curveBrakeRelief;
          engine.playerX -= centrifugal * dt;
          engine.skyOffset += currentSegment.curve * speedPercent * 88 * dt;
        }

        // Camera Shake calculation
        if (isOffroad && engine.speed > 60) {
          const shakeMag = Math.min(14, (engine.speed / maxSpeed) * 12);
          engine.cameraShake.x = (Math.random() - 0.5) * shakeMag;
          engine.cameraShake.y = (Math.random() - 0.5) * shakeMag;
        } else if (onKerb && engine.speed > 100) {
          engine.cameraShake.x = (Math.random() - 0.5) * 4;
          engine.cameraShake.y = (Math.random() - 0.5) * 4;
        } else if (engine.speed > 280) {
          const buffet = ((engine.speed - 280) / 70) * 2;
          engine.cameraShake.x = (Math.random() - 0.5) * buffet;
          engine.cameraShake.y = (Math.random() - 0.5) * buffet;
        } else {
          engine.cameraShake.x *= 0.8;
          engine.cameraShake.y *= 0.8;
        }

        // Dynamic FOV calculation
        const targetFov = engine.baseFov + speedPercent * 24 + (engine.drsActive ? 14 : 0);
        engine.currentFov += (targetFov - engine.currentFov) * 5 * dt;
        engine.cameraDepth = 1 / Math.tan(((engine.currentFov / 2) * Math.PI) / 180);

        // Bound player position within generous terrain margins (-3.5 to 3.5) so offroad props are strikeable!
        engine.playerX = Math.max(-3.5, Math.min(3.5, engine.playerX));

        // Off-road track logging & high-speed chassis abrasion wear ("ให้รถพังง่ายขึ้นกว่านี้อีกนิดหน่อย")
        if (isOffroad) {
          engine.offroadTicks++;
          if (engine.offroadTicks % 60 === 1) {
            engine.offroadEventsCount++;
          }
          if (engine.speed > 240 && !engine.isEngineOnFire && racePhase === 'racing') {
            const nowMs = timestamp;
            if (!engine.lastOffroadDmg || nowMs - engine.lastOffroadDmg > 1200) {
              engine.lastOffroadDmg = nowMs;
              const wear = Math.max(1, Math.round(2 * (engine.speed / 280)));
              engine.carHealth = Math.max(0, engine.carHealth - wear);
              setHudCarHealth(Math.round(engine.carHealth));
              if (engine.carHealth <= 0) {
                engine.isEngineOnFire = true;
                engine.fireTimer = 0;
                engine.pitLockoutTimer = 6.0;
                setIsEngineOnFire(true);
                sound.playEngineExplosionFire();
                setPitToastMessage('🔥 ลุยพื้นขรุขระเร็วเกินจนไฟไหม้!');
              }
            }
          }
        }

        // Position Progression: convert km/h to world units/sec
        const distanceMoved = (engine.speed * (1000 / 3600)) * dt * 112;
        const prevPosition = engine.position;
        engine.position = (engine.position + distanceMoved) % engine.trackLength;

        // ---------------------------------------------------------------------
        // ON-TRACK & ROADSIDE HAZARD/PROP COLLISION DETECTION (ALL OBJECTS)
        // ---------------------------------------------------------------------
        // In the OutRun pseudo-3D raster projection:
        // The camera is at world Z = engine.position.
        // The player car is rendered on screen at carCenterY = PLAYER_CAR_Y (height - 155).
        // The road segment that projects to carCenterY is at world Z = engine.position + playerCarOffset!
        const canvasH = height || 720;
        const normY = Math.max(0.15, (canvasH - 155 - canvasH / 2) / (canvasH / 2));
        const playerCarOffset = (engine.cameraDepth * engine.cameraHeight) / normY;
        const playerCarWorldZ = (engine.position + playerCarOffset) % engine.trackLength;
        const playerCarSegIdx = Math.floor(playerCarWorldZ / engine.segmentLength) % engine.segments.length;

        // 3D Grandstand Solid Safety Barrier Collision (ป้องกันรถหลุดทะลุอัฒจันทร์)
        const currentCarSeg = engine.segments[playerCarSegIdx];
        if (currentCarSeg && currentCarSeg.hasGrandstand && !engine.isEngineOnFire && racePhase === 'racing') {
          // Left Grandstand Crash Barrier (at X = -1.40)
          if (engine.playerX < -1.38) {
            engine.playerX = -1.36;
            engine.lateralVx = 4.8;
            engine.speed = Math.max(55, engine.speed * 0.70);
            engine.cameraShake.x = 24;
            sound.playCrashImpact();
            if (!engine.lastDamageTimestamp || nowMs - engine.lastDamageTimestamp > 240) {
              engine.lastDamageTimestamp = nowMs;
              const durFactor = Math.max(0.68, 1 - ((teamState.car?.chassis || 70) - 50) * 0.006);
              const appliedDamage = Math.max(3, Math.round(15 * durFactor));
              engine.carHealth = Math.max(0, engine.carHealth - appliedDamage);
              setHudCarHealth(Math.round(engine.carHealth));
              if (engine.carHealth <= 0) {
                engine.isEngineOnFire = true;
                engine.fireTimer = 0;
                engine.pitLockoutTimer = 6.0;
                setIsEngineOnFire(true);
                sound.playEngineExplosionFire();
                setPitToastMessage('🔥 ชนแนวกั้นอัฒจันทร์จนไฟไหม้!');
              }
            }
          } else if (engine.playerX > 1.86 && !engine.inPitLane) {
            // Right Grandstand Crash Barrier (at X = 1.88)
            engine.playerX = 1.84;
            engine.lateralVx = -4.8;
            engine.speed = Math.max(55, engine.speed * 0.70);
            engine.cameraShake.x = -24;
            sound.playCrashImpact();
            if (!engine.lastDamageTimestamp || nowMs - engine.lastDamageTimestamp > 240) {
              engine.lastDamageTimestamp = nowMs;
              const durFactor = Math.max(0.68, 1 - ((teamState.car?.chassis || 70) - 50) * 0.006);
              const appliedDamage = Math.max(3, Math.round(15 * durFactor));
              engine.carHealth = Math.max(0, engine.carHealth - appliedDamage);
              setHudCarHealth(Math.round(engine.carHealth));
              if (engine.carHealth <= 0) {
                engine.isEngineOnFire = true;
                engine.fireTimer = 0;
                engine.pitLockoutTimer = 6.0;
                setIsEngineOnFire(true);
                sound.playEngineExplosionFire();
                setPitToastMessage('🔥 ชนแนวกั้นอัฒจันทร์จนไฟไหม้!');
              }
            }
          }
        }

        // Scan generous segment window around the player car
        for (let sOff = -3; sOff <= 5; sOff++) {
          const chkIdx = (playerCarSegIdx + sOff + engine.segments.length) % engine.segments.length;
          const chkSeg = engine.segments[chkIdx];
          if (chkSeg && chkSeg.sprites) {
            for (let spI = 0; spI < chkSeg.sprites.length; spI++) {
              const sp = chkSeg.sprites[spI];

              // Recover hit state after cooldown so obstacles stay solid on subsequent passes
              if (sp.playerHitUntil && nowMs > sp.playerHitUntil) {
                sp.playerHitUntil = undefined;
              }

              if (!sp.playerHitUntil) {
                let distToCar = chkSeg.p1.world.z - playerCarWorldZ;
                if (distToCar < -engine.trackLength / 2) distToCar += engine.trackLength;
                if (distToCar > engine.trackLength / 2) distToCar -= engine.trackLength;

                // Continuous longitudinal sweep window:
                // Tightened to car's actual front wing (+175) and rear diffuser (-125)
                // plus travel step distanceMoved to prevent jumping through obstacles at high speeds
                const zReachForward = 175;
                const zReachBack = Math.max(125, distanceMoved + 35);

                if (distToCar >= -zReachBack && distToCar <= zReachForward) {
                  // drs_gantry is an overhead bridge spanning across the track:
                  if (sp.type === 'drs_gantry') {
                    continue;
                  }

                  // When inside pit lane, servicing, entering pit entrance, or encountering pit props: completely immune to collisions!
                  if (
                    engine.inPitLane ||
                    engine.pitState !== 'none' ||
                    chkSeg.isPitLaneZone ||
                    (chkIdx >= engine.segments.length - 100 && engine.playerX > 0.50) ||
                    sp.type === 'pit_box_crew' ||
                    sp.type === 'pit_entry_sign' ||
                    sp.type === 'team_pitwall'
                  ) {
                    continue;
                  }

                  // Non-obstacle roadside scenery (billboards, grandstands, marshal posts) should never clip cars on track/kerbs
                  if (!sp.isObstacle && Math.abs(engine.playerX) <= 1.55) {
                    continue;
                  }

                  const hitWidth = getPropHitWidth(sp.type);
                  if (hitWidth <= 0) continue;

                  const lateralDiff = Math.abs(engine.playerX - sp.offset);
                  if (lateralDiff < hitWidth) {
                    triggerPropCollision(sp);
                  }
                }
              }
            }
          }
        }

        // ---------------------------------------------------------------------
        // 11 AI RIVAL F1 CARS SIMULATION & BALANCED COMPETITIVE DYNAMICS
        // ---------------------------------------------------------------------
        let slipstreamActive = false;
        const isWrappingLap = prevPosition > engine.trackLength - 2000 && engine.position < 2000;
        const effectiveLap = isWrappingLap ? engine.lap : Math.max(0, engine.lap - 1);
        // Player's actual car position along the track (accounting for camera-to-car projection offset)
        const playerTotalDistance = effectiveLap * engine.trackLength + engine.position + playerCarOffset;
        let dynamicPlayerPos = 1;
        let closestAheadRival: { tag: string; gapM: number } | null = null;
        let closestBehindRival: { tag: string; gapM: number } | null = null;

        // Calculate player's live position relative to all AI cars:
        let livePlayerPos = 1;
        for (let i = 0; i < engine.aiCars.length; i++) {
          const c = engine.aiCars[i];
          const cDist = c.lapsCompleted * engine.trackLength + c.z;
          if (cDist > playerTotalDistance) {
            livePlayerPos++;
          }
        }

        // ข้อ 2: คำนวณ heat (Rubber-band dynamic heat calculation)
        // heatRaw = (จำนวน AI + 1 - อันดับผู้เล่น) / จำนวน AI (อันดับ 1 = 1.0, อันดับสุดท้าย = 0.0)
        const totalAiCount = Math.max(1, engine.aiCars.length);
        const heatRaw = Math.max(0, Math.min(1.0, (totalAiCount + 1 - livePlayerPos) / totalAiCount));

        if (AI_DIFFICULTY.cheatLevel === 0) {
          engine.heat = 0;
        } else {
          // Smooth lerp towards heatRaw with speed 0.8 per second (no abrupt jumps)
          const lerpAlpha = Math.min(1.0, 0.8 * dt);
          engine.heat = (engine.heat ?? 0) + (heatRaw - (engine.heat ?? 0)) * lerpAlpha;
        }

        const cheatMultiplier = AI_DIFFICULTY.cheatLevel === 0 ? 0 : AI_DIFFICULTY.cheatLevel === 2 ? 1.5 : 1.0;
        const effectiveHeat = (engine.heat ?? 0) * cheatMultiplier;

        // Top 2 AI rivals closest to player in distance (for ข้อ 8 last lap sprint)
        const closestAiCarsSorted = [...engine.aiCars].sort((a, b) => {
          const aDist = Math.abs((a.lapsCompleted * engine.trackLength + a.z) - playerTotalDistance);
          const bDist = Math.abs((b.lapsCompleted * engine.trackLength + b.z) - playerTotalDistance);
          return aDist - bDist;
        });
        const top2ClosestAiIds = new Set(closestAiCarsSorted.slice(0, 2).map((a) => a.id));
        let maxCheatBonusThisFrame = 0;

        // ---------------------------------------------------------------------
        // SECRET RUBBER-BANDING CATCH-UP SYSTEM (ระบบลับเกมเพิ่มความสูสี)
        // If the player is far ahead of everyone else, top pursuers surge at extreme
        // speeds to catch right up to the player's tail ("จี้ตูดเรา")!
        // ---------------------------------------------------------------------
        const pursuerList = engine.aiCars
          .map((ai) => {
            const aiTotDist = ai.lapsCompleted * engine.trackLength + ai.z;
            const gapM = (playerTotalDistance - aiTotDist) / 100;
            return { ai, gapM };
          })
          .filter((p) => p.gapM > 0)
          .sort((a, b) => a.gapM - b.gapM);

        const leadGapBehindM = pursuerList.length > 0 ? pursuerList[0].gapM : 0;
        // Trigger condition: Player has pulled a significant gap ahead (> 90m lead)
        const isPlayerFarAhead = leadGapBehindM > 90;

        const designatedChaserIds = new Set<string>();
        // Top 2 chasers aggressively hunt the player whenever player is ahead
        if (pursuerList.length > 0) {
          designatedChaserIds.add(pursuerList[0].ai.id);
          if (pursuerList.length > 1 && pursuerList[1].gapM - pursuerList[0].gapM < 160) {
            designatedChaserIds.add(pursuerList[1].ai.id);
          }
        }

        for (let aiIdx = 0; aiIdx < engine.aiCars.length; aiIdx++) {
          const ai = engine.aiCars[aiIdx];
          const aiSegIdx = Math.floor(ai.z / engine.segmentLength) % engine.segments.length;
          const aiSeg = engine.segments[aiSegIdx];
          const segCurve = aiSeg?.curve || 0;

          // Update AI Boost Pad, Spin, Crash Stun, Blocking & Counter-attack timers
          if (ai.boostTimer && ai.boostTimer > 0) {
            ai.boostTimer -= dt;
          }
          if (ai.boostCooldown && ai.boostCooldown > 0) {
            ai.boostCooldown -= dt;
          }
          if (ai.crashStunTimer && ai.crashStunTimer > 0) {
            ai.crashStunTimer -= dt;
          }
          if (ai.slowedTimer && ai.slowedTimer > 0) {
            ai.slowedTimer -= dt;
          }
          if (ai.spinAngle && ai.spinAngle > 0) {
            ai.spinAngle = Math.max(0, ai.spinAngle - dt * 680);
          }
          if (ai.personalityActiveTimer && ai.personalityActiveTimer > 0) {
            ai.personalityActiveTimer -= dt;
          }
          if (ai.hammerTimeTimer && ai.hammerTimeTimer > 0) {
            ai.hammerTimeTimer -= dt;
          }
          if (ai.defendingTimer && ai.defendingTimer > 0) {
            ai.defendingTimer -= dt;
          }
          if (ai.blockCooldown && ai.blockCooldown > 0) {
            ai.blockCooldown -= dt;
          }
          if (ai.blockTimer && ai.blockTimer > 0) {
            ai.blockTimer -= dt;
          }
          if (ai.counterAttackTimer && ai.counterAttackTimer > 0) {
            ai.counterAttackTimer -= dt;
          }

          // Oscar Piastri's "Ice Cold" trait: Recovers from stun and slowdown twice as fast!
          if (ai.personalityKey === 'ice_cold') {
            if (ai.crashStunTimer && ai.crashStunTimer > 0) {
              ai.crashStunTimer = Math.max(0, ai.crashStunTimer - dt * 1.0);
            }
            if (ai.slowedTimer && ai.slowedTimer > 0) {
              ai.slowedTimer = Math.max(0, ai.slowedTimer - dt * 1.0);
            }
          }

          const currentRoundIdx = Math.min(18, Math.max(1, activeGp.round)) - 1;

          // Scaled Booster Top Speed for AI
          const boosterTopSpeed = 345;

          // Check AI driving over a Speed Pad / Boost Pad (with generous 0.42 hit margin)
          if (
            aiSeg &&
            aiSeg.boostPad &&
            Math.abs(ai.x - aiSeg.boostPad.offset) < 0.42 &&
            (!ai.crashStunTimer || ai.crashStunTimer <= 0) &&
            (!ai.slowedTimer || ai.slowedTimer <= 0)
          ) {
            if (!ai.boostCooldown || ai.boostCooldown <= 0) {
              ai.boostCooldown = 2.0;
              ai.boostTimer = 2.4;
              ai.speed = Math.min(boosterTopSpeed, Math.max(ai.speed + 45, boosterTopSpeed * 0.95));
              ai.drsActive = true;

              if (ai.personalityKey === 'underdog_raider') {
                ai.personalityActiveTimer = 2.2;
                ai.personalitySkillName = 'BOOSTER RUSH';
                ai.personalitySkillNameTh = 'พุ่งชาร์จบูสเตอร์ทะลวง';
              }

              let relPlayerZ = ai.z - playerCarWorldZ;
              if (relPlayerZ < -engine.trackLength / 2) relPlayerZ += engine.trackLength;
              if (relPlayerZ > engine.trackLength / 2) relPlayerZ -= engine.trackLength;
              if (Math.abs(relPlayerZ) < 650) {
                sound.playBoostPad();
                for (let p = 0; p < 24; p++) {
                  engine.particles.push({
                    x: width / 2 + (ai.x - engine.playerX) * 110,
                    y: height - 90 + Math.random() * 20,
                    vx: (Math.random() - 0.5) * 260,
                    vy: Math.random() * 120 + 40,
                    life: 0.85,
                    color: '#facc15',
                  });
                }
              }
            }
          }

          // -------------------------------------------------------------------
          // A. HIGH-SPEED INTELLIGENT OBSTACLE SENSING & CORRIDOR PATHFINDING (AI ฉลาด หลบสิ่งกีดขวางได้อย่างช่ำชอง)
          // -------------------------------------------------------------------
          let distToPlayer = playerCarWorldZ - ai.z;
          if (distToPlayer < -engine.trackLength / 2) distToPlayer += engine.trackLength;
          if (distToPlayer > engine.trackLength / 2) distToPlayer -= engine.trackLength;

          // Proactive F1 driver situational vision: scan 75 to 85 segments ahead (15,000 - 17,000 world units, ~1.8-2.2s advance notice)
          const lookaheadSegs = ai.personalityKey === 'legendary_precision' ? 85 : ai.personalityKey === 'apex_predator' ? 80 : 75;
          const threatsAhead: TrackObstacleThreat[] = [];

          // Requirement: "แก้ไขเป็น 50 เมตรละกันที่ทะลุได้"
          // If AI is 50+ meters behind the player's screen (distToPlayer >= 5000), it phases cleanly through obstacles!
          const isAiBehindPlayer50m = distToPlayer >= 5000;

          if (!isAiBehindPlayer50m) {
            // 1. Scan on-track track props and hazard obstacles
            for (let sOff = 1; sOff <= lookaheadSegs; sOff++) {
              const chkIdx = (aiSegIdx + sOff) % engine.segments.length;
              const chkSeg = engine.segments[chkIdx];
              if (chkSeg && chkSeg.sprites) {
                for (let spI = 0; spI < chkSeg.sprites.length; spI++) {
                  const sp = chkSeg.sprites[spI];
                  // Only consider genuine on-track hazard obstacles
                  if (Math.abs(sp.offset) < 1.05 && (isHazardProp(sp.type) || sp.isObstacle)) {
                    let dZ = chkSeg.p1.world.z - ai.z;
                    if (dZ < -engine.trackLength / 2) dZ += engine.trackLength;
                    if (dZ > engine.trackLength / 2) dZ -= engine.trackLength;
                    if (dZ > 0 && dZ <= 16000) {
                      const hitW = getPropHitWidth(sp.type);
                      if (hitW <= 0) continue;
                      const safeMargin = sp.type === 'oil_slick' ? 0.28 : sp.type === 'tire_stack' ? 0.25 : sp.type === 'road_barrier' ? 0.24 : 0.20;
                      threatsAhead.push({
                        dist: dZ,
                        offset: sp.offset,
                        hitWidth: hitW,
                        type: sp.type,
                        safeMargin,
                      });
                    }
                  }
                }
              }
            }
          }

          // 2. Also register any stationary wrecked/burning rival cars as obstacle threats!
          for (let oI = 0; oI < engine.aiCars.length; oI++) {
            if (oI === aiIdx) continue;
            const other = engine.aiCars[oI];
            if (other.isFire || other.isDnf) {
              let dZ = other.z - ai.z;
              if (dZ < -engine.trackLength / 2) dZ += engine.trackLength;
              if (dZ > engine.trackLength / 2) dZ -= engine.trackLength;
              if (dZ > 0 && dZ <= 15000) {
                threatsAhead.push({
                  dist: dZ,
                  offset: other.x,
                  hitWidth: 0.34,
                  type: 'road_barrier' as RoadsidePropType,
                  safeMargin: 0.42,
                });
              }
            }
          }

          // Sort threats closest first
          threatsAhead.sort((a, b) => a.dist - b.dist);

          // -------------------------------------------------------------------
          // B. SMART RACING & PROACTIVE BOOSTER HUNTING (TRAP DETECTION)
          // -------------------------------------------------------------------
          let upcomingPadOffset: number | null = null;
          let upcomingPadDistSegs: number = 999;
          const padScanAhead = ai.personalityKey === 'underdog_raider' ? 36 : ai.personalityKey === 'apex_predator' ? 32 : 28;

          for (let f = 1; f <= padScanAhead; f++) {
            const fIdx = (aiSegIdx + f) % engine.segments.length;
            const fSeg = engine.segments[fIdx];
            if (fSeg && fSeg.boostPad) {
              const padOff = fSeg.boostPad.offset;
              const padZ = fSeg.p1.world.z;
              let dPadZ = padZ - ai.z;
              if (dPadZ < -engine.trackLength / 2) dPadZ += engine.trackLength;
              if (dPadZ > engine.trackLength / 2) dPadZ -= engine.trackLength;

              // Trap check: Pattern D places tire stacks/barriers 3-8 segments downstream of booster pads!
              // Smart AI identifies the trap and refuses to drive into it!
              let isTrap = false;
              for (let tI = 0; tI < threatsAhead.length; tI++) {
                const obs = threatsAhead[tI];
                if (obs.dist >= dPadZ - 200 && obs.dist <= dPadZ + 2200) {
                  if (Math.abs(obs.offset - padOff) < obs.hitWidth + 0.32) {
                    isTrap = true;
                    break;
                  }
                }
              }

              if (!isTrap) {
                upcomingPadOffset = padOff;
                upcomingPadDistSegs = f;
                break;
              }
            }
          }

          // Evaluate collision hazards against AI's current lateral line
          let isEvading = false;
          let emergencyBrakeForObstacle = false;

          // Check if AI's current line intersects with any upcoming obstacle danger zone (proactive from 13,500 units)
          const nearestThreat = threatsAhead.find(
            (t) => t.dist < 13500 && Math.abs(ai.x - t.offset) < t.hitWidth + t.safeMargin + 0.16
          );

          if (nearestThreat) {
            isEvading = true;
            ai.evadingObstacle = true;

            // Generate fine-grained candidate passing corridors across playable track width
            const candidateLanes = [
              -0.75, -0.65, -0.55, -0.45, -0.35, -0.25, -0.15, -0.05,
              0.05, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75
            ];

            let bestLane = ai.x;
            let bestScore = -Infinity;

            for (let cI = 0; cI < candidateLanes.length; cI++) {
              const candX = candidateLanes[cI];
              let minClearance = 999;
              let lanePenalty = 0;

              for (let tI = 0; tI < threatsAhead.length; tI++) {
                const threat = threatsAhead[tI];
                const distWeight = Math.max(0.3, (14000 - threat.dist) / 14000);
                const latDist = Math.abs(candX - threat.offset);
                const reqBuffer = threat.hitWidth + threat.safeMargin;

                if (latDist < reqBuffer) {
                  // Direct collision in this candidate corridor! Severe penalty scaled by urgency
                  lanePenalty += (reqBuffer - latDist + 1.5) * 50000 * distWeight;
                } else {
                  const clearance = latDist - reqBuffer;
                  minClearance = Math.min(minClearance, clearance);
                }
              }

              // Smooth steering effort: prefer corridors closest to current car position to avoid erratic twitching
              const steeringEffort = Math.abs(candX - ai.x) * 8;

              // Racing line apex bias
              let curveBonus = 0;
              if (segCurve > 0.35 && candX > 0.15) curveBonus += 10;
              if (segCurve < -0.35 && candX < -0.15) curveBonus += 10;

              // Untrapped booster pad synergy
              let padBonus = 0;
              if (lanePenalty === 0 && upcomingPadOffset !== null && Math.abs(candX - upcomingPadOffset) < 0.22) {
                padBonus += 30;
              }

              const score = (minClearance * 60) - lanePenalty - steeringEffort + curveBonus + padBonus;
              if (score > bestScore) {
                bestScore = score;
                bestLane = candX;
              }
            }

            ai.targetX = bestLane;

            // If an obstacle is close (< 3400 units, ~0.4s) and lateral overlap remains, lift throttle and apply brakes!
            if (nearestThreat.dist < 3400 && Math.abs(ai.x - nearestThreat.offset) < nearestThreat.hitWidth + 0.26) {
              emergencyBrakeForObstacle = true;
            }
          } else {
            ai.evadingObstacle = false;
          }

          const currentAiTotDist = ai.lapsCompleted * engine.trackLength + ai.z;
          const trueGapToPlayerM = (playerTotalDistance - currentAiTotDist) / 100;
          const isDesignatedChaser = designatedChaserIds.has(ai.id);

          // Dynamic Stint Management & Per-Driver Pace Waves
          if (!ai.stintTimer || ai.stintTimer <= 0) {
            ai.stintTimer = 3.0 + Math.random() * 4.5;
            const roll = Math.random();
            if (roll < 0.35) {
              ai.stintMode = 'charging'; // Purple sector surge!
              ai.stintPaceDelta = 16 + Math.random() * 16;
            } else if (roll < 0.65) {
              ai.stintMode = 'battling'; // Intense pack dogfight
              ai.stintPaceDelta = (Math.random() - 0.45) * 12;
            } else if (roll < 0.80) {
              ai.stintMode = 'tire_management'; // Backing off slightly to manage tires
              ai.stintPaceDelta = - (12 + Math.random() * 14);
            } else if (roll < 0.90) {
              ai.stintMode = 'error_recovery'; // Minor lockup or slight wide line
              ai.stintPaceDelta = - (28 + Math.random() * 18);
              ai.lockupTimer = 1.8;
            } else {
              ai.stintMode = 'engine_mode_push'; // Engine mode 1 - Maximum power deployment
              ai.stintPaceDelta = 22 + Math.random() * 14;
            }
          } else {
            ai.stintTimer -= dt;
          }

          if (ai.lockupTimer && ai.lockupTimer > 0) {
            ai.lockupTimer -= dt;
            if (Math.random() < 0.28) {
              engine.particles.push({
                x: width / 2 + (ai.x - engine.playerX) * 110,
                y: height - 90,
                vx: (Math.random() - 0.5) * 60,
                vy: -Math.random() * 40 - 20,
                life: 0.5,
                color: '#cbd5e1',
              });
            }
          }

          // Per-car organic sinusoidal wave with distinct individual frequencies (no two rivals follow identical patterns)
          const totalRaceSec = engine.totalRaceTimeMs / 1000;
          const carFreq = 0.35 + ((ai.number * 7) % 11) * 0.08;
          const organicWave = Math.sin(totalRaceSec * carFreq + (ai.pacePhaseOffset || 0)) * (5.0 + ai.aggression * 8.0);
          const currentLap = engine.lap;
          const isFinalLap = currentLap >= engine.totalLaps;
          let racePhaseBonus = 0;
          if (isFinalLap) {
            if (aiIdx <= 3 || ai.personalityKey === 'apex_predator' || ai.personalityKey === 'legendary_precision') {
              racePhaseBonus = 12 + ai.aggression * 6; // Restored original strong late-game surge
            } else {
              racePhaseBonus = 6 + Math.random() * 6;
            }
          }

          // C. จุดแข็งตามบุคลิก: personalityKey ให้โบนัส +5 กม./ชม. ในช่วงที่ตรงกับจุดแข็ง และ -3 ในช่วงที่ไม่ใช่
          const personalityBonus = getPersonalitySpeedDelta(
            ai.personalityKey,
            segCurve,
            (distToPlayer / 100),
            Math.abs(distToPlayer) <= 45,
            upcomingPadDistSegs
          );

          const baseCarPace = ai.baseSpeed + (ai.stintPaceDelta || 0) + organicWave + racePhaseBonus + personalityBonus;

          // B. ความผิดพลาดของ AI: ต่อรอบ AI แต่ละคันมีโอกาสพลาด 1 ครั้ง (AI อันดับสูงพลาดน้อยกว่า)
          // เมื่อพลาดให้ใช้ slowedTimer ประมาณ 1.0-1.5 วินาที ลดความเร็ว 12-18 กม./ชม. และเบี่ยงแนวไปด้านนอก
          // สุ่มได้แต่ไม่ให้ AI หลายคันพลาดพร้อมกัน
          const aiCurrentLapForMistake = ai.lapsCompleted + 1;
          const canMakeMistake =
            ai.mistakeLap !== aiCurrentLapForMistake &&
            (!ai.slowedTimer || ai.slowedTimer <= 0) &&
            !ai.isPitting &&
            !ai.isFire &&
            !ai.isDnf &&
            (!engine.lastAiMistakeTimeMs || nowMs - engine.lastAiMistakeTimeMs > 4000);

          if (canMakeMistake) {
            const mistakeProbability = aiIdx <= 2 ? 0.04 : aiIdx <= 6 ? 0.10 : 0.18;
            const isChallengingSector = Math.abs(segCurve) > 0.75 || (aiSegIdx % 100 >= 80);
            if (isChallengingSector && Math.random() < mistakeProbability * dt * 2.2) {
              ai.mistakeLap = aiCurrentLapForMistake;
              engine.lastAiMistakeTimeMs = nowMs;
              ai.slowedTimer = 1.0 + Math.random() * 0.5; // 1.0 to 1.5 seconds
              const speedDrop = 12 + Math.random() * 6; // 12 to 18 km/h reduction
              ai.speed = Math.max(50, ai.speed - speedDrop);
              // เบี่ยงแนวไปด้านนอก
              ai.targetX = segCurve > 0 ? 0.88 : segCurve < 0 ? -0.88 : (ai.x >= 0 ? 0.88 : -0.88);
            }
          }

          // -------------------------------------------------------------------
          // COMPETITIVE RACING PACEMAKER & +-100M SPEED EQUALIZATION
          // "ทำให้ขู่แข่งเร็วกว่านี้ให้สูสีกับผู่เล่นรวมถึงแซงอยู่หน้าผู้เล่นสัก +- 100 เมตรก่อนให้ speed เท่าผู่เล่น"
          // "ให้ 300 ไม่มี nitro 350 ถ้ามีใช้ nitro"
          // -------------------------------------------------------------------
          const distFromPlayerM = distToPlayer / 100;
          const gapBehindM = Math.max(0, distFromPlayerM); // meters AI is behind player
          const leadAheadM = Math.max(0, -distFromPlayerM); // meters AI is ahead of player
          const isSideBySide = Math.abs(distToPlayer) <= 45;

          let rivalTargetPace = baseCarPace;
          ai.drsActive = false;
          ai.isBraking = false;
          ai.isAttacking = false;

          // Stint Mode Pace Variations
          if (ai.stintMode === 'charging' || ai.stintMode === 'engine_mode_push') {
            rivalTargetPace += 8 + (ai.aggression * 6);
            ai.drsActive = true;
          } else if (ai.stintMode === 'tire_management') {
            rivalTargetPace -= 6;
          } else if (ai.stintMode === 'error_recovery') {
            rivalTargetPace -= 18;
          }

          // Competitive pacing without slowing down for player (ข้อ 3)
          if (!ai.isFire && !ai.isDnf && !ai.tireBlown) {
            // If AI is leading far ahead (> rubberBandStartM, e.g. 250m), apply gentle trim (max 6 km/h)
            if (leadAheadM > AI_DIFFICULTY.rubberBandStartM) {
              const leadTrim = Math.min(6, (leadAheadM - AI_DIFFICULTY.rubberBandStartM) * 0.04);
              rivalTargetPace = Math.max(ai.baseSpeed - 6, rivalTargetPace - leadTrim);
            } else if (gapBehindM > 0 && gapBehindM <= 100) {
              // Trailing player within ~100m: aggressive competitive surge to challenge & overtake!
              const attackSurge = 4 + ai.aggression * 6;
              const competitiveSpeed = Math.max(baseCarPace, engine.speed + attackSurge);
              rivalTargetPace = Math.max(rivalTargetPace, competitiveSpeed);
            } else if (gapBehindM > 100) {
              // Further back than 100m: strong pursuit pace to close the gap into the battle zone!
              const roundIdx = Math.min(17, Math.max(0, (activeGp.round || 1) - 1));
              const currentAiTopSpeedCap = AI_DIFFICULTY.aiTopSpeedBase + roundIdx * AI_DIFFICULTY.aiTopSpeedPerRound;
              rivalTargetPace = Math.max(rivalTargetPace, Math.min(currentAiTopSpeedCap, ai.baseSpeed + 6));
            }
          }

          if (isSideBySide) {
            // Intense wheel-to-wheel contest
            rivalTargetPace = Math.max(rivalTargetPace, engine.speed + 3 + (ai.aggression * 4));
            if (ai.personalityKey === 'apex_predator') {
              rivalTargetPace += 4.5;
              if (Math.abs(segCurve) > 0.40) {
                ai.targetX = segCurve > 0 ? 0.32 : -0.32;
                ai.personalityActiveTimer = 1.8;
                ai.personalitySkillName = 'APEX DIVE-BOMB';
                ai.personalitySkillNameTh = 'พุ่งเสียบในโค้งสายฟ้า';
              }
            } else if (ai.personalityKey === 'tenacious_fighter') {
              rivalTargetPace += 3.5;
              ai.personalityActiveTimer = 1.6;
              ai.personalitySkillName = 'SIDE-BY-SIDE BRAWL';
              ai.personalitySkillNameTh = 'ดวลเบียดตีคู่ไม่ยก';
            } else if (ai.personalityKey === 'corner_virtuoso' && Math.abs(segCurve) > 0.40) {
              rivalTargetPace += 4.0;
              ai.personalityActiveTimer = 1.8;
              ai.personalitySkillName = 'CORNER BLITZ';
              ai.personalitySkillNameTh = 'สาดโค้งความเร็วสูง';
            }

            if (ai.overtakeTimer <= 0) {
              ai.overtakeTimer = (ai.personalityKey === 'apex_predator' ? 2.0 : 2.6) + Math.random() * 1.2;
              const sideLane = engine.playerX >= 0 ? -0.46 : 0.46;
              ai.targetX = sideLane;
              ai.isAttacking = true;
              ai.drsActive = true;
            }

            if (ai.isAttacking) {
              rivalTargetPace += 4.0;
            }

          } else if (distToPlayer > 0) {
            // AI is behind player: Aerodynamic Slipstream / Draft if following in line
            if (gapBehindM < 50 && Math.abs(ai.x - engine.playerX) < 0.40) {
              // ข้อ 6: Slipstream tow advantage + slipstreamCheatMax * heat
              const slipCheat = effectiveHeat > 0 ? AI_DIFFICULTY.slipstreamCheatMax * effectiveHeat : 0;
              rivalTargetPace += 12 + slipCheat; // Slipstream tow advantage + heat cheat
              ai.drsActive = true;
              if (ai.personalityKey === 'slingshot_hunter') {
                rivalTargetPace += 6;
                ai.personalityActiveTimer = 2.0;
                ai.personalitySkillName = 'SLINGSHOT SURGE';
                ai.personalitySkillNameTh = 'สลิปสตรีมดีดพุ่งแซง';
              }
            }
            // ข้อ 7: Bonus +6 km/h slipstream for 3 seconds after being overtaken
            if (ai.counterAttackTimer && ai.counterAttackTimer > 0) {
              rivalTargetPace += 6;
              ai.drsActive = true;
            }
            if (gapBehindM < 35 && ai.overtakeTimer <= 0) {
              ai.overtakeTimer = 2.0 + Math.random() * 1.2;
              ai.isAttacking = true;
              ai.drsActive = true;
              ai.targetX = engine.playerX >= 0 ? -0.46 : 0.46;
            }
          } else {
            // AI is ahead of player (leadAheadM > 0)
            // ข้อ 5: AI ปิดเลน (Blocking System)
            // เมื่อ AI อยู่ข้างหน้าผู้เล่นไม่เกิน 45 เมตร และผู้เล่นกำลังเข้าใกล้ (engine.speed > ai.speed) และไม่ใช่ isEvading/กำลังเข้าพิท
            const isPlayerClosingIn = engine.speed > ai.speed;
            const canBlock =
              leadAheadM > 0 &&
              leadAheadM <= 45 &&
              isPlayerClosingIn &&
              !isEvading &&
              !ai.isPitting &&
              !isSideBySide &&
              Math.abs(segCurve) <= 1.4 &&
              (!ai.blockCooldown || ai.blockCooldown <= 0);

            if (canBlock) {
              const ironWallBonus = ai.personalityKey === 'iron_wall' ? 1.20 : 1.0;
              const blockProb = Math.min(1.0, AI_DIFFICULTY.blockStrength * ai.aggression * ironWallBonus);
              if (Math.random() < blockProb) {
                ai.blockTimer = AI_DIFFICULTY.blockReactionSec; // 0.35s delay before maneuver
                ai.blockTargetX = Math.max(-0.85, Math.min(0.85, engine.playerX)); // target player's line
                ai.blockCooldown = 2.0; // 2s cooldown so player can fake out left/right
              }
            }

            if (ai.blockTimer && ai.blockTimer > 0) {
              // Reacting... holding initial line for blockReactionSec
            } else if (ai.blockTargetX !== undefined) {
              ai.targetX = ai.blockTargetX;
              ai.blockTargetX = undefined;
            } else if (ai.personalityKey === 'iron_wall' && leadAheadM < 38) {
              ai.targetX = Math.max(-0.62, Math.min(0.62, engine.playerX * 0.85));
              ai.personalityActiveTimer = 1.8;
              ai.personalitySkillName = 'DEFENSIVE WEAVE';
              ai.personalitySkillNameTh = 'โยกบล็อกปิดไลน์สกัดแซง';
            } else if (ai.personalityKey === 'straight_line_rocket' && Math.abs(segCurve) < 0.35) {
              rivalTargetPace += 5.0;
              ai.personalityActiveTimer = 1.8;
              ai.personalitySkillName = 'STRAIGHT-LINE MISSILE';
              ai.personalitySkillNameTh = 'ยิงทางตรงความเร็วสูงสุด';
              ai.targetX = 0.0;
            }
          }

          // AI NITRO BOOST MANAGEMENT ("ให้ผู้แข่งขันสามารถใช้ nitro ได้เช่นกันด้วย")
          // AI manages their own nitro reserves and triggers nitro bursts tactically
          // ข้อ 5: ไนตรัสไม่หมดเมื่อ heat > 0.5 และ AI อยู่ห่างผู้เล่นไม่เกิน freeNitroRangeM เมตร (ทั้งสองทิศ)
          // ข้อ 8: ในรอบสุดท้าย ถ้าอันดับผู้เล่น <= 3 ให้ AI 2 คันที่อยู่ใกล้ผู้เล่นที่สุด ได้ไนตรัสไม่หมดตามข้อ 5 โดยไม่ต้องรอ heat > 0.5
          const absDistToPlayerM = Math.abs(distToPlayer / 100);
          const isTop2Closest = top2ClosestAiIds.has(ai.id);
          const hasFreeNitro =
            effectiveHeat > 0 &&
            ((effectiveHeat > 0.5) || (isFinalLap && livePlayerPos <= 3 && isTop2Closest)) &&
            absDistToPlayerM <= AI_DIFFICULTY.freeNitroRangeM;

          if (hasFreeNitro) {
            if ((ai.nitroFuel ?? 0) < 40) {
              ai.nitroFuel = 40;
            }
            ai.nitroDepleted = false;
          }

          if (!ai.nitroActive) {
            ai.nitroFuel = Math.min(100, (ai.nitroFuel ?? 100) + AI_DIFFICULTY.aiNitroRecharge * dt);
            if ((ai.nitroFuel ?? 0) >= 99.8) {
              ai.nitroFuel = 100;
              ai.nitroDepleted = false; // Fully recharged!
            }
          } else {
            ai.nitroFuel = Math.max(0, (ai.nitroFuel ?? 100) - 24 * dt);
            ai.nitroTimer = (ai.nitroTimer ?? 0) - dt;
            if ((ai.nitroFuel ?? 0) <= 0.05 || (ai.nitroTimer ?? 0) <= 0) {
              ai.nitroActive = false;
              if ((ai.nitroFuel ?? 0) <= 0.05) {
                ai.nitroFuel = 0;
                ai.nitroDepleted = !hasFreeNitro; // Won't lock if free nitro is active!
              }
            }
          }

          if (hasFreeNitro && (ai.nitroFuel ?? 0) < 40) {
            ai.nitroFuel = 40;
            ai.nitroDepleted = false;
          }

          const canAiUseNitro =
            !ai.isPitting &&
            !ai.isFire &&
            !ai.isDnf &&
            !ai.tireBlown &&
            !ai.nitroDepleted &&
            (!ai.crashStunTimer || ai.crashStunTimer <= 0) &&
            (!ai.slowedTimer || ai.slowedTimer <= 0) &&
            Math.abs(segCurve) < 0.65;

          if (canAiUseNitro && !ai.nitroActive && (ai.nitroFuel ?? 0) >= 25) {
            // Player nitrous defense counter (ข้อ 4 & 5):
            // If AI is leading ahead of player within 60m and player engages nitro (engine.drsActive), AI defends!
            // When free nitro is active, defense chance is 100%!
            const isPlayerAttackingWithNitro = leadAheadM > 0 && leadAheadM <= 60 && engine.drsActive;
            const nitroDefenseChance = hasFreeNitro ? 1.0 : (aiIdx <= 3 ? 0.98 : 0.50);
            const counterPlayerNitro = isPlayerAttackingWithNitro && Math.random() < nitroDefenseChance;

            const shouldFireNitro =
              counterPlayerNitro ||
              (gapBehindM > 10 && gapBehindM < 95 && Math.random() < 0.20) || // Use nitro to attack player
              (ai.isAttacking && Math.random() < 0.16) ||
              ((ai.stintMode === 'charging' || ai.stintMode === 'engine_mode_push') && Math.random() < 0.10) ||
              (isSideBySide && Math.random() < 0.14) ||
              (isFinalLap && (aiIdx <= 3 || ai.aggression > 0.9) && Math.random() < 0.18);

            if (shouldFireNitro) {
              ai.nitroActive = true;
              ai.nitroTimer = 2.2 + Math.random() * 1.5;
              ai.drsActive = true;
            }
          }

          if (ai.nitroActive && canAiUseNitro) {
            const nitroSurge = 45 + ai.aggression * 5;
            rivalTargetPace = Math.min(350, Math.max(rivalTargetPace, ai.baseSpeed + nitroSurge));
            ai.drsActive = true;
          }

          // Enforce dynamic top speed cap without nitro (ข้อ 2), 350 km/h with nitro
          // Min Werstappen, Louis Hammerton, Alex Alboon: ความเร็วมากกว่าเดิม 10%
          const isBoss = isBossRival(ai.id, ai.name);
          const roundIdx = Math.min(17, Math.max(0, (activeGp.round || 1) - 1));
          const baseTopSpeedCap = AI_DIFFICULTY.aiTopSpeedBase + roundIdx * AI_DIFFICULTY.aiTopSpeedPerRound;
          const currentAiTopSpeedCap = isBoss ? Math.round(baseTopSpeedCap * 1.10) : baseTopSpeedCap;
          const maxPaceNitro = isBoss ? 385 : 350;
          if (!ai.nitroActive) {
            rivalTargetPace = Math.min(currentAiTopSpeedCap, rivalTargetPace);
          } else {
            rivalTargetPace = Math.min(maxPaceNitro, rivalTargetPace);
          }

          // Corner speed limit with realistic downforce (braking for tight turns)
          // ข้อ 6: ที่สูตรเสียความเร็วในโค้งของ AI ให้คูณส่วนที่ลดความเร็วด้วย (1 - cornerGripCheatMax * heat)
          const downforceFactor = Math.max(0.010, 0.020 - currentRoundIdx * 0.0006);
          const personalityDownforceMod = ai.personalityKey === 'corner_virtuoso'
            ? 0.38
            : ai.personalityKey === 'apex_predator'
            ? 0.70
            : 1.0;
          const rawCornerScrub = Math.min(0.12, Math.abs(segCurve) * downforceFactor * (1.10 - ai.aggression * 0.20) * personalityDownforceMod);
          const cornerScrub = effectiveHeat > 0
            ? rawCornerScrub * (1.0 - AI_DIFFICULTY.cornerGripCheatMax * effectiveHeat)
            : rawCornerScrub;
          let rivalTargetSpeed = Math.abs(segCurve) > 1.4
            ? rivalTargetPace * (1.0 - cornerScrub)
            : rivalTargetPace;

          // BOOSTER PAD ACTIVE INJECTION:
          if (ai.boostTimer && ai.boostTimer > 0 && (!ai.crashStunTimer || ai.crashStunTimer <= 0) && (!ai.slowedTimer || ai.slowedTimer <= 0)) {
            const boosterBoost = 35;
            rivalTargetSpeed = Math.min(345, Math.max(rivalTargetSpeed, ai.baseSpeed + boosterBoost));
            ai.drsActive = true;
          }

          // Enforce dynamic top speed cap without nitro, 350 with nitro (ข้อ 2)
          if (!ai.nitroActive) {
            rivalTargetSpeed = Math.min(currentAiTopSpeedCap, rivalTargetSpeed);
          } else {
            rivalTargetSpeed = Math.min(maxPaceNitro, rivalTargetSpeed);
          }

          // Min Werstappen, Louis Hammerton, Alex Alboon: ความเร็วมากกว่าเดิม 10%
          if (isBoss) {
            rivalTargetSpeed = Math.min(maxPaceNitro, rivalTargetSpeed * 1.10);
          }

          // Pursuer catch-up logic & Chaser cheat surge (ข้อ 3)
          let cheatBonusThisCar = 0;
          if (isDesignatedChaser && trueGapToPlayerM > 0 && (!ai.crashStunTimer || ai.crashStunTimer <= 0) && (!ai.slowedTimer || ai.slowedTimer <= 0)) {
            ai.isCatchUpBeast = true;
            ai.drsActive = true;
            ai.catchUpIntensity = Math.min(1.0, trueGapToPlayerM / 60);

            if (trueGapToPlayerM > 50) {
              ai.isTailgating = false;
              const surgeSpeed = ai.baseSpeed + Math.min(22, 6 + trueGapToPlayerM * 0.05);
              rivalTargetSpeed = Math.max(rivalTargetSpeed, surgeSpeed);
            } else {
              ai.isTailgating = true;
              rivalTargetSpeed = Math.max(rivalTargetSpeed, ai.baseSpeed + 8);
            }

            // ข้อ 3: ตัวไล่ล่าเร่งเกินเพดาน (ทำหลังโค้ดจำกัดเพดานความเร็วปกติเพื่อไม่ให้ถูกตัด)
            if (effectiveHeat > 0) {
              const chaserCheatTarget = engine.speed + AI_DIFFICULTY.chaserBonusMin + (AI_DIFFICULTY.chaserBonusMax - AI_DIFFICULTY.chaserBonusMin) * effectiveHeat;
              const chaserCap = ai.nitroActive ? 350 : AI_DIFFICULTY.cheatSpeedHardCap;
              const newSpeed = Math.min(chaserCap, Math.max(rivalTargetSpeed, chaserCheatTarget));
              cheatBonusThisCar = Math.max(cheatBonusThisCar, newSpeed - rivalTargetSpeed);
              rivalTargetSpeed = newSpeed;
              ai.drsActive = true;
            }
          } else if (!ai.isAttacking) {
            ai.isCatchUpBeast = false;
            ai.isTailgating = false;
          }

          // ข้อ 4: AI ที่นำอยู่หนีผู้เล่น (หลังข้อ 3)
          // เมื่อ AI อยู่ข้างหน้าผู้เล่นภายใน leaderRangeM เมตร และไม่ติดสถานะ crash/slowed/fire/dnf/tireBlown/pitting
          if (effectiveHeat > 0 && leadAheadM > 0 && leadAheadM <= AI_DIFFICULTY.leaderRangeM) {
            const isHealthyLeadingAi = !ai.crashStunTimer && !ai.slowedTimer && !ai.isFire && !ai.isDnf && !ai.tireBlown && !ai.isPitting;
            if (isHealthyLeadingAi && Math.abs(segCurve) <= 1.4) {
              const leaderBonus = AI_DIFFICULTY.leaderBonusMin + (AI_DIFFICULTY.leaderBonusMax - AI_DIFFICULTY.leaderBonusMin) * effectiveHeat;
              const newSpeed = Math.min(AI_DIFFICULTY.cheatSpeedHardCap, rivalTargetSpeed + leaderBonus);
              cheatBonusThisCar = Math.max(cheatBonusThisCar, newSpeed - rivalTargetSpeed);
              rivalTargetSpeed = newSpeed;
            }
          }

          // ข้อ 8: ซิ่งรอบสุดท้าย
          // ในรอบสุดท้าย ถ้าอันดับผู้เล่น <= 3 ให้ AI 2 คันที่อยู่ใกล้ผู้เล่นที่สุด ได้ rivalTargetSpeed += lastLapSprintBonus * heat
          if (effectiveHeat > 0 && isFinalLap && livePlayerPos <= 3 && isTop2Closest) {
            const sprintBonus = AI_DIFFICULTY.lastLapSprintBonus * effectiveHeat;
            const newSpeed = Math.min(AI_DIFFICULTY.cheatSpeedHardCap, rivalTargetSpeed + sprintBonus);
            cheatBonusThisCar = Math.max(cheatBonusThisCar, newSpeed - rivalTargetSpeed);
            rivalTargetSpeed = newSpeed;
          }

          // เมื่อ leadAheadM > rubberBandStartM ให้ rubber band เดิม (ตัดความเร็ว) ทำงานตามปกติ เพื่อไม่ให้ AI หายไปจากผู้เล่น
          if (leadAheadM > AI_DIFFICULTY.rubberBandStartM) {
            const leadTrim = Math.min(6, (leadAheadM - AI_DIFFICULTY.rubberBandStartM) * 0.04);
            rivalTargetSpeed = Math.max(ai.baseSpeed - 6, rivalTargetSpeed - leadTrim);
          }

          // บอทที่อยู่หลังผู้เล่นมากกว่า 100 เมตรได้ความเร็วเพิ่ม 20% ("แล้วก็บอทที่อยู่หลังผู้เล่นมากกว่า 100 เมตรได้ความเร็วเพิ่ม 20%")
          const isBehindPlayerOver100m = (gapBehindM > 100 || trueGapToPlayerM > 100) && !ai.isFire && !ai.isDnf && !ai.tireBlown;
          if (isBehindPlayerOver100m) {
            rivalTargetSpeed = Math.min(360, rivalTargetSpeed * 1.20);
          }

          if (isTop2Closest) {
            maxCheatBonusThisFrame = Math.max(maxCheatBonusThisFrame, cheatBonusThisCar);
          }

          // DRS Straight activation
          const inDrsZone = (aiSegIdx >= 460 && aiSegIdx <= 640) || (aiSegIdx <= 120);
          if (inDrsZone && Math.abs(segCurve) < 0.8 && (!ai.crashStunTimer || ai.crashStunTimer <= 0) && (!ai.slowedTimer || ai.slowedTimer <= 0)) {
            ai.drsActive = true;
            rivalTargetSpeed = Math.max(rivalTargetSpeed, ai.baseSpeed + 16);
          }

          ai.overtakeTimer -= dt;

          if (!isEvading && !ai.isCatchUpBeast) {
            if (upcomingPadOffset !== null) {
              ai.targetX = upcomingPadOffset;
            } else if (ai.isAttacking || isSideBySide) {
              if (isSideBySide && leadAheadM > 0) {
                // When AI is leading side-by-side, hold existing lane firmly instead of yielding to player (ข้อ 5)
                ai.targetX = ai.x;
              } else {
                const attackSide = engine.playerX >= 0 ? -0.48 : 0.48;
                ai.targetX = attackSide;
              }
            } else if (Math.abs(segCurve) > 0.45) {
              ai.targetX = segCurve > 0 ? 0.38 : -0.38;
            } else {
              if (ai.overtakeTimer <= 0) {
                ai.overtakeTimer = 3.5 + Math.random() * 2.0;
                ai.targetX = ai.lanePreference ?? (aiIdx % 2 === 0 ? -0.40 : 0.40);
              }
            }
          }

          // AI vs AI interaction (avoid pileups, enable tactical AI passes)
          for (let oIdx = 0; oIdx < engine.aiCars.length; oIdx++) {
            if (oIdx === aiIdx) continue;
            const otherAi = engine.aiCars[oIdx];
            let aiDist = otherAi.z - ai.z;
            if (aiDist < -engine.trackLength / 2) aiDist += engine.trackLength;
            if (aiDist > engine.trackLength / 2) aiDist -= engine.trackLength;

            if (ai.isPitting || otherAi.isPitting || Math.abs(ai.x) > 1.02 || Math.abs(otherAi.x) > 1.02) {
              continue;
            }

            // Steer around stationary wrecked/burning cars without knocking them
            if (otherAi.isFire || otherAi.isDnf) {
              if (aiDist > 0 && aiDist < 450 && Math.abs(ai.x - otherAi.x) < 0.46) {
                ai.targetX = otherAi.x >= 0 ? -0.52 : 0.52;
              }
              continue;
            }

            if (Math.abs(aiDist) < 42 && Math.abs(ai.x - otherAi.x) < 0.228) {
              if (ai.contactCooldown <= 0 && otherAi.contactCooldown <= 0) {
                ai.contactCooldown = 0.32;
                otherAi.contactCooldown = 0.32;

                const aiPushDir = ai.x >= otherAi.x ? 1 : -1;
                const aiBounceForce = 3.6;
                ai.lateralVx = aiPushDir * aiBounceForce;
                otherAi.lateralVx = -aiPushDir * aiBounceForce;

                ai.x += aiPushDir * 0.04;
                otherAi.x -= aiPushDir * 0.04;

                ai.speed = Math.max(50, ai.speed - 35);
                otherAi.speed = Math.max(50, otherAi.speed - 35);

                const aiMax1 = ai.maxHealth || getRivalMaxHealth(ai.id, ai.name);
                const aiMax2 = otherAi.maxHealth || getRivalMaxHealth(otherAi.id, otherAi.name);
                ai.health = Math.max(0, (ai.health ?? aiMax1) - 6);
                otherAi.health = Math.max(0, (otherAi.health ?? aiMax2) - 6);
                if (ai.health <= 0 && !ai.isDnf) {
                  ai.isFire = true;
                  ai.isDnf = true;
                  ai.speed = 0;
                  ai.lateralVx = 0;
                  setPitToastMessage(`🔥 ${ai.name} (${ai.tag}) รถพังไฟไหม้! RETIRED (DNF)`);
                }
                if (otherAi.health <= 0 && !otherAi.isDnf) {
                  otherAi.isFire = true;
                  otherAi.isDnf = true;
                  otherAi.speed = 0;
                  otherAi.lateralVx = 0;
                  setPitToastMessage(`🔥 ${otherAi.name} (${otherAi.tag}) รถพังไฟไหม้! RETIRED (DNF)`);
                }

                let relPlayerZ = ai.z - playerCarWorldZ;
                if (relPlayerZ < -engine.trackLength / 2) relPlayerZ += engine.trackLength;
                if (relPlayerZ > engine.trackLength / 2) relPlayerZ -= engine.trackLength;
                if (Math.abs(relPlayerZ) < 550) {
                  sound.playKerbThump();
                  for (let p = 0; p < 12; p++) {
                    engine.particles.push({
                      x: width / 2 + (ai.x - engine.playerX) * 110,
                      y: height - 85 + Math.random() * 25,
                      vx: (Math.random() - 0.5) * 260,
                      vy: -Math.random() * 160 - 40,
                      life: 0.8,
                      color: '#f59e0b',
                    });
                  }
                }
              }
            } else if (aiDist > 0 && aiDist < 180 && Math.abs(ai.x - otherAi.x) < 0.38) {
              ai.targetX = otherAi.x >= 0 ? -0.48 : 0.48;
              if (ai.speed > otherAi.speed && (!ai.slowedTimer || ai.slowedTimer <= 0)) {
                rivalTargetSpeed = Math.max(rivalTargetSpeed, ai.baseSpeed + 8);
              }
            }
          }

          // -------------------------------------------------------------------
          // ABSOLUTE SLOWDOWN & CRASH STUN OVERRIDES
          // -------------------------------------------------------------------
          // AI Fire / DNF handling ("ถ้ารถคู่แข่งพังก็ให้ขึ้นไฟไหม้ และอยู่เฉยๆ")
          if (ai.isFire || ai.isDnf) {
            rivalTargetSpeed = 0;
            ai.speed = 0; // Completely stationary - zero movement!
            ai.lateralVx = 0;
            ai.drsActive = false;
            ai.boostTimer = 0;
            ai.isCatchUpBeast = false;
            ai.isAttacking = false;
            ai.isBraking = false;
            ai.targetX = ai.x;

            // Intense blazing animated fire particles & thick black smoke billowing into the sky
            if (Math.random() < 0.55) {
              const sparkScreenX = width / 2 + (ai.x - engine.playerX) * 110;
              engine.particles.push({
                x: sparkScreenX + (Math.random() - 0.5) * 30,
                y: height - 85 + Math.random() * 10,
                vx: (Math.random() - 0.5) * 45,
                vy: -Math.random() * 95 - 40,
                life: 0.85,
                color: Math.random() < 0.35 ? '#ef4444' : Math.random() < 0.65 ? '#f97316' : '#0f172a',
              });
            }
          } else if (emergencyBrakeForObstacle) {
            // Proactive emergency braking to clear on-track obstacle cleanly!
            rivalTargetSpeed = Math.min(rivalTargetSpeed, 120);
            ai.isBraking = true;
            ai.speed = Math.max(80, ai.speed - 480 * dt);
          } else if (ai.health !== undefined && ai.health < 75 && ai.speed > 50 && Math.random() < 0.22) {
            // Damaged AI car smoke
            engine.particles.push({
              x: width / 2 + (ai.x - engine.playerX) * 110,
              y: height - 85,
              vx: (Math.random() - 0.5) * 35,
              vy: -Math.random() * 45 - 20,
              life: 0.55,
              color: ai.health < 40 ? '#334155' : '#94a3b8',
            });
          } else if (ai.crashStunTimer && ai.crashStunTimer > 0) {
            rivalTargetSpeed = 50;
            ai.speed = Math.min(65, ai.speed);
            ai.drsActive = false;
            ai.boostTimer = 0;
            ai.isCatchUpBeast = false;
            ai.isAttacking = false;
            ai.isBraking = true;
            if (Math.random() < 0.45) {
              engine.particles.push({
                x: width / 2 + (ai.x - engine.playerX) * 110,
                y: height - 85,
                vx: (Math.random() - 0.5) * 45,
                vy: -Math.random() * 55 - 25,
                life: 0.95,
                color: '#334155',
              });
            }
          } else if (ai.slowedTimer && ai.slowedTimer > 0) {
            const recoveryCap = 160 + (2.0 - ai.slowedTimer) * 75;
            rivalTargetSpeed = Math.min(rivalTargetSpeed, recoveryCap);
            ai.drsActive = false;
            ai.boostTimer = 0;
            ai.isCatchUpBeast = false;
          }

          // AI Pit Stop Execution:
          // Disperse pit stops across laps, entry points, and dedicated team stalls
          // ("ตอนเข้า้ pits ให้คู่แข่งดูเข้า pits กระจัดกระจายมากกว่านี้มากกว่าการกระจุกอยู่จุดเดียว")
          const midLap = engine.totalLaps <= 2 ? 1 : Math.floor(engine.totalLaps / 2) + 1;
          const targetPitLap = ai.pitLap || midLap;
          const aiCurrentLap = ai.lapsCompleted + 1;

          // Stagger AI pit entry lead-in between segments -84 and -72 so they don't all dive in at one instant
          const aiPitEntryZ = engine.trackLength - (83 - (aiIdx % 6) * 1.8) * 200;

          // Dedicated Team Pit Stall:
          // Distribute the 11 AI cars across 11 distinct pit box stalls from segment -66 to -22
          // Each stall is separated by ~4.2 segments (~840 meters) so cars NEVER bunch up in one spot!
          const stallIdx = aiIdx % 11;
          const aiBoxSeg = engine.segments.length - (66 - stallIdx * 4.2);
          const aiBoxZ = aiBoxSeg * 200;

          const aiCanPit =
            (!ai.hasPitted && aiCurrentLap === targetPitLap) ||
            (ai.tireBlown && !ai.hasPitted && aiCurrentLap >= targetPitLap);

          if (aiCanPit && !ai.isPitting) {
            if (!ai.willMissPit || aiCurrentLap > targetPitLap) {
              if (ai.z >= aiPitEntryZ && ai.z <= engine.trackLength - 300) {
                ai.isPitting = true;
              }
            } else {
              if (ai.z > engine.trackLength - 300 && !ai.tireBlown) {
                ai.tireBlown = true;
                setPitToastMessage(`⚠️ ${ai.name} (${ai.tag}) พลาดการเข้า PIT! ยางแตกความเร็วลด 50%`);
                setTimeout(() => setPitToastMessage(null), 4500);
              }
            }
          }

          if (aiCurrentLap > targetPitLap && !ai.hasPitted && !ai.tireBlown) {
            ai.tireBlown = true;
            setPitToastMessage(`⚠️ ${ai.name} (${ai.tag}) พลาดการเข้า PIT! ยางแตกความเร็วลด 50%`);
            setTimeout(() => setPitToastMessage(null), 4500);
          }

          if (ai.isPitting) {
            if (ai.pitStopTimer && ai.pitStopTimer > 0) {
              // Stationary in dedicated team pit stall
              ai.targetX = 1.48 + (stallIdx % 2 === 0 ? -0.04 : 0.04);
              ai.speed = 0;
              rivalTargetSpeed = 0;
              ai.pitStopTimer -= dt;
              if (ai.pitStopTimer <= 0) {
                // Pit service complete! Fast Rocket Pit Exit!
                ai.hasPitted = true;
                ai.isPitting = false;
                ai.tireBlown = false;
                if (engine.isRaining) {
                  ai.hasWetTires = true;
                }
                ai.health = ai.maxHealth || getRivalMaxHealth(ai.id, ai.name);
                ai.pitExitGraceTimer = 3.6; // Grace period to accelerate & merge without triggering grass offroad drag!
                // Launch out of pits immediately at high speed, no creeping!
                ai.speed = Math.max(ai.speed, 260 + Math.random() * 25);
                ai.boostTimer = 3.0; // Pit exit launch surge!
                ai.drsActive = true;
                ai.targetX = ai.lanePreference ?? (aiIdx % 2 === 0 ? -0.32 : 0.32);
                ai.lateralVx = -2.6;
              }
            } else if (ai.z < aiBoxZ - 180) {
              // Approaching own stall down the pit transit lane
              ai.targetX = 1.38;
              rivalTargetSpeed = Math.min(125, rivalTargetSpeed);
            } else if (ai.z >= aiBoxZ - 180 && ai.z <= aiBoxZ + 220) {
              // Reached designated team pit box stall: stop and begin service
              ai.targetX = 1.48 + (stallIdx % 2 === 0 ? -0.04 : 0.04);
              ai.speed = 0;
              rivalTargetSpeed = 0;
              ai.pitStopTimer = ai.pitDuration || (1.85 + (aiIdx % 4) * 0.22);
            } else if (ai.z > aiBoxZ + 220 && ai.z <= engine.trackLength - 100) {
              // Failsafe: stop for service if rolled past target box so AI NEVER skips pit
              ai.targetX = 1.48;
              ai.speed = 0;
              rivalTargetSpeed = 0;
              ai.pitStopTimer = ai.pitDuration || (1.85 + (aiIdx % 4) * 0.22);
            } else {
              // In pit lane: adhere to realistic 125 km/h pit limiter
              ai.targetX = 1.40;
              rivalTargetSpeed = Math.min(125, rivalTargetSpeed);
            }
          }

          // AI Engine Fire Breakdown & DNF: completely stationary while on fire ("ถ้ารถคู่แข่งพังก็ให้ขึ้นไฟไหม้ และอยู่เฉยๆ")
          if (ai.isFire || ai.isDnf) {
            rivalTargetSpeed = 0;
            ai.speed = 0;
            ai.lateralVx = 0;
            ai.targetX = ai.x;
            ai.drsActive = false;
            ai.boostTimer = 0;
            ai.isCatchUpBeast = false;
            ai.isAttacking = false;
            ai.isBraking = false;
          }

          // Blown tire penalty for AI: 50% speed reduction for rest of race!
          if (ai.tireBlown) {
            rivalTargetSpeed = Math.min(rivalTargetSpeed, ai.baseSpeed * 0.50);
            if (ai.speed > rivalTargetSpeed) {
              ai.speed = Math.max(rivalTargetSpeed, ai.speed - 180 * dt);
            }
            if (Math.random() < 0.22) {
              engine.particles.push({
                x: width / 2 + (ai.x - engine.playerX) * 110,
                y: height - 85,
                vx: (Math.random() - 0.5) * 45,
                vy: -Math.random() * 35 - 20,
                life: 0.65,
                color: Math.random() > 0.5 ? '#1f2937' : '#ef4444',
              });
            }
          }

          // Acceleration & Braking with realistic physics & stun recovery
          let accelMultiplier = 1.0;
          if (ai.isFire || ai.isDnf) {
            accelMultiplier = 0.0; // Engine dead when on fire/DNF
            ai.speed = 0;
          } else if (ai.tireBlown) {
            accelMultiplier = 0.50; // 50% power reduction with blown tire
          } else if (ai.crashStunTimer && ai.crashStunTimer > 0) {
            accelMultiplier = 0.0; // Frozen engine during crash stun!
          } else if (ai.slowedTimer && ai.slowedTimer > 0) {
            accelMultiplier = 0.55; // Smooth recovery back to full racing speed
          } else if (ai.isCatchUpBeast) {
            accelMultiplier = 1.6;
          } else if (ai.boostTimer && ai.boostTimer > 0) {
            accelMultiplier = 1.8;
          } else if (ai.isAttacking) {
            accelMultiplier = 1.35;
          } else if (isBehindPlayerOver100m) {
            accelMultiplier = 1.35;
          }

          if (isBoss) {
            accelMultiplier *= 1.10;
          }

          const roundAccelBonus = currentRoundIdx * 14;
          const accelPower = (480 + roundAccelBonus) * ai.aggression * accelMultiplier;
          const brakePower = 640;
          if (ai.isFire || ai.isDnf) {
            ai.speed = 0;
            ai.isBraking = false;
          } else if (ai.speed < rivalTargetSpeed) {
            ai.speed = Math.min(rivalTargetSpeed, ai.speed + accelPower * dt);
          } else {
            ai.isBraking = (ai.speed - rivalTargetSpeed) > 15;
            ai.speed = Math.max(rivalTargetSpeed, ai.speed - brakePower * dt);
          }

          // AI Kerbs and Off-Road / Grass Drag (AI วิ่งขอบแทร็กหรือหลุดแทร็กจะโดนลดสปีดอย่างแท้จริง)
          // Pit lane asphalt exemption: do NOT penalize AI cars while pitting or merging from pit exit!
          const isAiInPitZone = ai.isPitting || (ai.pitExitGraceTimer !== undefined && ai.pitExitGraceTimer > 0) || (ai.hasPitted && ai.x > 0.85 && ai.z < 65 * 200);
          if (ai.pitExitGraceTimer && ai.pitExitGraceTimer > 0) {
            ai.pitExitGraceTimer -= dt;
          }

          if (!isAiInPitZone && Math.abs(ai.x) > 0.88 && Math.abs(ai.x) <= 1.05) {
            // Kerb rumble drag (Lewis Hamilton has legendary kerb riding skill)
            const kerbDrag = ai.personalityKey === 'legendary_precision' ? 35 : 140;
            ai.speed = Math.max(70, ai.speed - kerbDrag * dt);
          } else if (!isAiInPitZone && Math.abs(ai.x) > 1.05) {
            // Grass / gravel off-road drag: HEAVY SLOWDOWN!
            ai.speed = Math.max(40, ai.speed - 360 * dt);
            ai.slowedTimer = Math.max(ai.slowedTimer || 0, 1.4);
            ai.targetX = ai.x > 0 ? 0.65 : -0.65;
            if (Math.random() < 0.35) {
              engine.particles.push({
                x: width / 2 + (ai.x - engine.playerX) * 110,
                y: height - 85,
                vx: (Math.random() - 0.5) * 60,
                vy: -Math.random() * 40 - 20,
                life: 0.7,
                color: '#15803d',
              });
            }
          }

          // -------------------------------------------------------------------
          // C. SMOOTH & ASSERTIVE LATERAL STEERING (SHARP REACTION ON BOOSTER PAD & OBSTACLES)
          // -------------------------------------------------------------------
          const lateralDiff = ai.targetX - ai.x;
          const isHuntingPad = upcomingPadOffset !== null && upcomingPadDistSegs <= 24;
          const turnMultiplier = (ai.isFire || ai.isDnf)
            ? 0
            : isAiInPitZone
            ? 2.4
            : isHuntingPad
            ? 1.45
            : ai.evadingObstacle
            ? 2.4
            : ai.isAttacking
            ? 1.25
            : 1.0;
          const aiMaxTurnSpeed = (1.35 + (ai.aggression - 0.5) * 0.35) * turnMultiplier;
          const targetLateralVx = Math.max(-aiMaxTurnSpeed, Math.min(aiMaxTurnSpeed, lateralDiff * (ai.evadingObstacle ? 3.4 : isHuntingPad ? 3.0 : 2.2)));
          // Responsive mechanical steering inertia (extra sharp when evading hazards)
          const steerInertiaRate = (ai.isFire || ai.isDnf)
            ? 0
            : ai.evadingObstacle
            ? 12.0
            : isHuntingPad
            ? 7.5
            : 4.5;

          if (ai.isFire || ai.isDnf) {
            ai.lateralVx = 0;
            ai.steerAngle = 0;
          } else {
            ai.lateralVx += (targetLateralVx - ai.lateralVx) * steerInertiaRate * dt;
            ai.x += ai.lateralVx * dt;
            // Generous lateral margin (-1.45 to 1.45) so AI can run wide into rumblestrips, grass, and roadside obstacles!
            ai.x = Math.max(-1.45, Math.min(1.45, ai.x));
            ai.steerAngle = Math.max(-1, Math.min(1, ai.lateralVx * 0.70 + lateralDiff * 0.30));
          }

          // -------------------------------------------------------------------
          // D. WORLD POSITION & LIVE RANK PROGRESSION
          // -------------------------------------------------------------------
          // Stationary when on fire / wrecked DNF ("อยู่เฉยๆ")
          const aiDistanceMoved = (ai.isFire || ai.isDnf) ? 0 : (ai.speed * (1000 / 3600)) * dt * 112;
          const prevAiZ = ai.z;
          ai.z = (ai.isFire || ai.isDnf) ? ai.z : (ai.z + aiDistanceMoved) % engine.trackLength;

          if (prevAiZ > engine.trackLength - 2000 && ai.z < 2000) {
            ai.lapsCompleted++;
          }

          const prevAiTotalDist = ai.lapsCompleted * engine.trackLength + prevAiZ;
          const currentAiTotalDist = ai.lapsCompleted * engine.trackLength + ai.z;
          const prevPlayerTotalDist = effectiveLap * engine.trackLength + prevPosition + playerCarOffset;

          // ข้อ 7: เมื่อ AI ถูกผู้เล่นแซง ให้ตั้ง ai.overtakeTimer = 0.4 และเพิ่มโบนัสสลิปสตรีมของ AI +6 กม./ชม. เป็นเวลา 3 วินาที เพื่อให้ AI พยายามแซงกลับ
          const isJustOvertaken = prevAiTotalDist >= prevPlayerTotalDist && currentAiTotalDist < playerTotalDistance;
          if (isJustOvertaken) {
            ai.overtakeTimer = 0.4;
            ai.counterAttackTimer = 3.0; // 3 seconds counter-attack window
            engine.overtakesCount = (engine.overtakesCount || 0) + 1;
          }

          // Lewis Hamilton: If player overtakes Lewis, trigger Hammer Time counter-attack!
          if (ai.personalityKey === 'legendary_precision' && prevAiZ > playerCarWorldZ && ai.z <= playerCarWorldZ && !ai.hammerTimeTimer) {
            ai.hammerTimeTimer = 5.0;
            ai.personalityActiveTimer = 2.5;
            ai.personalitySkillName = 'HAMMER TIME';
            ai.personalitySkillNameTh = 'เค้นฟอร์มแชมป์โลกสวนกลับ';
          }

          const aiTotalDistance = ai.lapsCompleted * engine.trackLength + ai.z;
          const distanceGap = aiTotalDistance - playerTotalDistance;

          if (distanceGap > 0) {
            dynamicPlayerPos++;
            if (!closestAheadRival || distanceGap < closestAheadRival.gapM * 100) {
              closestAheadRival = { tag: ai.tag, gapM: Math.round(distanceGap / 100) };
            }
          } else {
            const gapBehind = Math.abs(distanceGap);
            if (!closestBehindRival || gapBehind < closestBehindRival.gapM * 100) {
              closestBehindRival = { tag: ai.tag, gapM: Math.round(gapBehind / 100) };
            }
          }

          // -------------------------------------------------------------------
          // E. PLAYER INTERACTION: SLIPSTREAM TOW & PREDICTABLE, STABLE HITBOX
          // -------------------------------------------------------------------
          let relZ = ai.z - playerCarWorldZ;
          if (relZ < -engine.trackLength / 2) relZ += engine.trackLength;
          if (relZ > engine.trackLength / 2) relZ -= engine.trackLength;

          // Slipstream drafting behind rival (+26 km/h base, up to +20% with driver1.raceCraft)
          if (relZ > 40 && relZ < 520 && Math.abs(engine.playerX - ai.x) < 0.32) {
            slipstreamActive = true;
            engine.speed = Math.min(maxSpeed + slipstreamBoost, engine.speed + 110 * dt);
          }

          // Contact cooldown update
          if (ai.contactCooldown > 0) {
            ai.contactCooldown -= dt;
          }

          // -------------------------------------------------------------------
          // PRECISE 1:1 HITBOX & STABLE TIMING (จำจังหวะและระยะชนได้แม่นยำ 100%)
          // True visual car dimensions:
          // - Lateral width: 0.228 road units (matches outside wheel rims and sidepods)
          // - Longitudinal length: -26 to +42 Z units (matches front wing to rear diffuser)
          // Result: When there is daylight between tires, player overtakes cleanly.
          // When tires or chassis touch, collision triggers with predictable knockback.
          // -------------------------------------------------------------------
          const lateralGap = Math.abs(engine.playerX - ai.x);
          const isTouchingZ = relZ >= -26 && relZ <= 42;
          const isTouchingX = lateralGap < 0.228;

          // No collision if player or AI is inside pit lane ("รวมถึงให้รถชนกันไม่ได้หากอยู่ใน pits")
          const isEitherCarInPits = engine.inPitLane || engine.pitState !== 'none' || ai.isPitting || Math.abs(engine.playerX) > 1.02 || Math.abs(ai.x) > 1.02;

          if (!isEitherCarInPits && ai.contactCooldown <= 0 && isTouchingZ && isTouchingX) {
            ai.contactCooldown = 0.38; // Cooldown to allow clean separation
            engine.totalCollisionsCount = (engine.totalCollisionsCount || 0) + 1;

            sound.playKerbThump();
            sound.playCrashImpact();

            const pushDir = engine.playerX >= ai.x ? 1 : -1;
            const speedDiff = Math.abs(engine.speed - ai.speed);
            const bounceStrength = 3.8 + Math.min(2.0, speedDiff * 0.02);

            // Noticeable lateral knockback impulse: the player gets knocked away sideways!
            engine.lateralVx = pushDir * bounceStrength;
            engine.playerX += pushDir * 0.055; // Immediate physical displacement away from rival

            // Rival AI also bounces away in the opposite direction if alive (stationary if on fire)
            const isIronWall = ai.personalityKey === 'iron_wall';
            const knockbackDamp = isIronWall ? 0.60 : 1.0;
            const speedScrubDamp = isIronWall ? 0.50 : 1.0;

            if (!ai.isFire && !ai.isDnf) {
              ai.lateralVx = -pushDir * (bounceStrength * 0.82 * knockbackDamp);
              ai.x -= pushDir * (0.05 * knockbackDamp);
            }

            // Speed scrub from chassis collision (dampened by driver1.raceCraft collision resistance)
            const speedRetain = 0.80 + collisionResistance * 0.12;
            const scrubFlat = 16 * (1 - collisionResistance * 0.5);

            // ข้อ 7: ความเร็วผู้เล่นหลังชน คูณเพิ่มด้วย (1 - (1 - collisionPlayerScrubExtra) * heat)
            const playerScrubMult = effectiveHeat > 0
              ? 1.0 - (1.0 - AI_DIFFICULTY.collisionPlayerScrubExtra) * effectiveHeat
              : 1.0;
            engine.speed = Math.max(75, (engine.speed * speedRetain - scrubFlat) * playerScrubMult);

            // ความเร็ว AI หลังชน: ปรับเป็นเส้นเชื่อมระหว่างค่าเดิมกับ collisionAiScrub ตาม heat
            if (!ai.isFire && !ai.isDnf) {
              const baseAiRetain = isIronWall ? 0.90 : 0.82;
              const targetAiRetain = effectiveHeat > 0
                ? baseAiRetain + (AI_DIFFICULTY.collisionAiScrub - baseAiRetain) * effectiveHeat
                : baseAiRetain;
              ai.speed = Math.max(75, ai.speed * targetAiRetain - (14 * speedScrubDamp * (1 - 0.4 * effectiveHeat)));
            } else {
              ai.speed = 0;
              ai.lateralVx = 0;
            }

            // Short control shock stun (0.24s recovery)
            engine.crashStunTimer = Math.max(engine.crashStunTimer, 0.24);

            // Vehicle damage from collision ("เพิ่มเลือดและความทนทานให้ผู้เล่นอีกนิดหน่อย")
            if (!engine.isEngineOnFire && racePhase === 'racing') {
              if (!engine.lastDamageTimestamp || nowMs - engine.lastDamageTimestamp > 240) {
                engine.lastDamageTimestamp = nowMs;
                const durFactor = Math.max(0.68, 1 - ((teamState.car?.chassis || 70) - 50) * 0.006);
                const pDamage = Math.max(4, Math.round((11 + Math.min(10, speedDiff * 0.10)) * durFactor));
                engine.carHealth = Math.max(0, engine.carHealth - pDamage);
                setHudCarHealth(Math.round(engine.carHealth));
                if (engine.carHealth <= 0) {
                  engine.isEngineOnFire = true;
                  engine.fireTimer = 0;
                  engine.pitLockoutTimer = 6.0;
                  setIsEngineOnFire(true);
                  sound.playEngineExplosionFire();
                  setPitToastMessage('🔥 ชนคู่แข่งจนไฟไหม้!');
                }
              }
            }

            // Damage to AI rival car ("ถ้ารถคู่แข่งพังก็ให้ขึ้นไฟไหม้ และอยู่เฉยๆ")
            if (!ai.isDnf) {
              const aiDamage = Math.max(4, Math.round(8 + Math.min(12, speedDiff * 0.12)));
              const aiMax = ai.maxHealth || getRivalMaxHealth(ai.id, ai.name);
              ai.health = Math.max(0, (ai.health ?? aiMax) - aiDamage);
              if (ai.health <= 0) {
                ai.isFire = true;
                ai.isDnf = true;
                ai.speed = 0;
                ai.lateralVx = 0;
                sound.playEngineExplosionFire();
                setPitToastMessage(`🔥 ${ai.name} (${ai.tag}) รถพังไฟไหม้! RETIRED (DNF)`);
              }
            }

            // Punchy collision camera shake
            engine.cameraShake.x = pushDir * 16;
            engine.cameraShake.y = (Math.random() - 0.5) * 12;

            // Explosive spray of sparks from colliding carbon chassis
            const sparkScreenX = width / 2 + (ai.x - engine.playerX) * 110;
            for (let p = 0; p < 18; p++) {
              engine.particles.push({
                x: sparkScreenX + (Math.random() - 0.5) * 24,
                y: height - 104 + Math.random() * 20,
                vx: pushDir * (Math.random() * 120 + 50) + (Math.random() - 0.5) * 100,
                vy: -Math.random() * 160 - 35,
                life: 0.70,
                color: Math.random() > 0.35 ? '#fbbf24' : '#f97316',
              });
            }
          }

          // AI obstacle collision touch check (AI clips obstacle: gets slowed, stunned, and deflected)
          // USER REQUIREMENT: "แก้ไขเป็น 50 เมตรละกันที่ทะลุได้"
          // When relZ <= -5000, AI car is 50+ meters behind the player's screen: phase cleanly through all obstacles!
          if (relZ <= -5000) {
            continue;
          }

          const checkSegs = [
            aiSegIdx,
            (aiSegIdx + 1) % engine.segments.length,
            (aiSegIdx - 1 + engine.segments.length) % engine.segments.length,
          ];
          for (const sIdx of checkSegs) {
            const currentAiSeg = engine.segments[sIdx];
            if (currentAiSeg && currentAiSeg.sprites) {
              for (let spI = 0; spI < currentAiSeg.sprites.length; spI++) {
                const sp = currentAiSeg.sprites[spI];
                if (ai.lastObstacleHitUntil && nowMs < ai.lastObstacleHitUntil) {
                  continue;
                }
                // drs_gantry is an overhead bridge spanning across the track: cars drive freely underneath
                if (sp.type === 'drs_gantry') continue;
                if (
                  ai.isPitting ||
                  currentAiSeg.isPitLaneZone ||
                  sp.type === 'pit_box_crew' ||
                  sp.type === 'pit_entry_sign' ||
                  sp.type === 'team_pitwall'
                ) {
                  continue;
                }

                // Roadside scenery/props (billboards, grandstands, marshal posts) that are not on-track obstacles:
                // If the car is on the track or rumble strips (Math.abs(ai.x) <= 1.55), it NEVER collides with roadside props!
                if (!sp.isObstacle && Math.abs(ai.x) <= 1.55) {
                  continue;
                }

                const hitW = getPropHitWidth(sp.type);
                if (hitW <= 0) continue;

                const latDiff = Math.abs(ai.x - sp.offset);
                let dZ = currentAiSeg.p1.world.z - ai.z;
                if (dZ < -engine.trackLength / 2) dZ += engine.trackLength;
                if (dZ > engine.trackLength / 2) dZ -= engine.trackLength;

                // Accurate, realistic hitbox check without oversized artificial bloating
                if (Math.abs(dZ) < 65 && latDiff < hitW) {
                  ai.lastObstacleHitUntil = nowMs + 1800;
                  ai.lastObstacleHitType = sp.type;
                  sp.hit = true;

                  let incidentType = 'CLIPPED BARRIER';
                  if (sp.type === 'oil_slick') {
                    incidentType = 'SPUN ON OIL';
                    ai.spinAngle = (Math.random() > 0.5 ? 1 : -1) * 360;
                    ai.speed = Math.max(50, ai.speed * 0.55 - 20);
                    ai.slowedTimer = 1.6;
                    ai.crashStunTimer = 0.5;
                    ai.lateralVx = (Math.random() > 0.5 ? 4.5 : -4.5);
                    if (Math.abs(relZ) < 700) sound.playTireSqueal();
                  } else if (sp.type === 'traffic_cone') {
                    incidentType = 'HIT CONE';
                    ai.speed = Math.max(65, ai.speed - 40);
                    ai.slowedTimer = 0.9;
                    ai.crashStunTimer = 0.2;
                    ai.lateralVx = (ai.x > sp.offset ? 2.5 : -2.5);
                    if (Math.abs(relZ) < 700) sound.playKerbThump();
                  } else if (sp.type === 'tire_stack' || sp.type === 'tire_barrier') {
                    incidentType = 'HIT TIRE STACK';
                    ai.speed = Math.max(40, ai.speed * 0.35);
                    ai.slowedTimer = 1.6;
                    ai.crashStunTimer = 0.5;
                    ai.lateralVx = (ai.x > sp.offset ? 4.0 : -4.0);
                    if (Math.abs(relZ) < 700) sound.playCrashImpact();
                  } else {
                    incidentType = 'CRASHED BARRIER';
                    ai.speed = Math.max(35, ai.speed * 0.28);
                    ai.slowedTimer = 1.8;
                    ai.crashStunTimer = 0.6;
                    ai.lateralVx = (ai.x > sp.offset ? 5.2 : -5.2);
                    if (Math.abs(relZ) < 700) sound.playCrashImpact();
                  }

                  ai.boostTimer = 0;
                  ai.drsActive = false;
                  ai.isCatchUpBeast = false;
                  ai.isAttacking = false;

                  // Damage to AI rival car from obstacle ("ถ้ารถคู่แข่งพังก็ให้ขึ้นไฟไหม้ และอยู่เฉยๆ")
                  if (!ai.isDnf) {
                    const obsDamage =
                      sp.type === 'road_barrier' || sp.type === 'fallen_tree'
                        ? 20
                        : sp.type === 'tire_stack' || sp.type === 'tire_barrier'
                        ? 14
                        : 8;
                    const aiMax = ai.maxHealth || getRivalMaxHealth(ai.id, ai.name);
                    ai.health = Math.max(0, (ai.health ?? aiMax) - obsDamage);
                    // Severe wreck only occurs if car health actually drops to 0!
                    // (Fixed: removed unrealistic 210 km/h 1-hit insta-fire kill that caused all tail-end AI to wipe out)
                    const isSevereWreck = ai.health <= 0;
                    if (isSevereWreck) {
                      ai.health = 0;
                      ai.isFire = true;
                      ai.isDnf = true;
                      ai.speed = 0;
                      ai.lateralVx = 0;
                      if (Math.abs(relZ) < 800) {
                        sound.playEngineExplosionFire();
                      }
                      setPitToastMessage(`🔥 ${ai.name} (${ai.tag}) รถพังไฟไหม้! RETIRED (DNF)`);
                    }
                  }

                  const repelDir = ai.x > sp.offset ? 1 : -1;
                  if (!ai.isFire && !ai.isDnf) {
                    ai.x += repelDir * 0.08;
                  }

                  if (Math.abs(relZ) < 750) {
                    setHudCrashedRival({
                      tag: ai.tag,
                      type: incidentType,
                      speed: Math.round(ai.speed),
                    });
                    const sparkScreenX = width / 2 + (ai.x - engine.playerX) * 110;
                    for (let p = 0; p < 22; p++) {
                      engine.particles.push({
                        x: sparkScreenX + (Math.random() - 0.5) * 30,
                        y: height - 100 + Math.random() * 20,
                        vx: repelDir * (Math.random() * 140 + 40) + (Math.random() - 0.5) * 80,
                        vy: -Math.random() * 180 - 40,
                        life: 0.85,
                        color: sp.type === 'oil_slick' ? '#334155' : p % 2 === 0 ? '#f97316' : '#facc15',
                      });
                    }
                  }
                }
              }
            }
          }
        }

        // Store peak cheat bonus across closest AI rivals for debug HUD (ข้อ 9)
        engine.debugClosestAiCheatBonus = maxCheatBonusThisFrame;

        // Check if ALL AI rivals have finished the race before the player
        const finishedAiCount = engine.aiCars.filter((a) => a.lapsCompleted >= engine.totalLaps).length;
        if (finishedAiCount >= engine.aiCars.length && !engine.isFinished && racePhase === 'racing') {
          // All rivals have crossed the finish line! Player timed out and is forfeited (P12 ที่โหล่)!
          engine.isFinished = true;
          sound.playCrashImpact();

          const now = performance.now();
          const totalMs = engine.lapTimes.reduce((acc, t) => acc + t, 0) + (now - engine.lapStartTime);

          const sortedAis = [...engine.aiCars].sort((a, b) => {
            const distA = a.lapsCompleted * engine.trackLength + a.z;
            const distB = b.lapsCompleted * engine.trackLength + b.z;
            return distB - distA;
          });

          const standings = [
            ...sortedAis.map((ai, idx) => ({
              pos: idx + 1,
              name: ai.name,
              tag: ai.tag,
              team: ai.teamName,
              primaryColor: ai.primaryColor,
              timeStr: idx === 0 ? formatLapTime(targetLapSeconds * lapsCount * 1000) : `+${((idx + 1) * 2.1).toFixed(2)}s`,
              isPlayer: false,
              personality: getDriverPersonality(ai.id),
            })),
            {
              pos: 12,
              name: teamState.driver1.name,
              tag: teamState.driver1.name.slice(0, 3).toUpperCase(),
              team: teamState.teamName,
              primaryColor: teamState.primaryColor || '#dc2626',
              timeStr: 'DNF (TIMED OUT)',
              isPlayer: true,
            },
          ];

          setRaceSummary({
            position: 12,
            bestLapMs: engine.bestLapTimeMs || 0,
            totalTimeMs: totalMs + 10000,
            topSpeed: engine.topSpeedRecorded,
            offroadEvents: engine.offroadEventsCount,
            standings,
            isTimedOutLoss: true,
          });

          sound.stopRaceMusic();
          setRacePhase('finished');
        }

        // Lap Completion Check: crossed start/finish line
        if (!engine.isFinished && prevPosition > engine.trackLength - 2000 && engine.position < 2000) {
          const now = performance.now();
          const lapTime = now - engine.lapStartTime;
          engine.lapTimes.push(lapTime);

          if (!engine.bestLapTimeMs || lapTime < engine.bestLapTimeMs) {
            engine.bestLapTimeMs = lapTime;
          }

          sound.playChequeredFlag();

          if (engine.lap >= engine.totalLaps) {
            // Race Complete!
            engine.isFinished = true;
            let totalMs = engine.lapTimes.reduce((acc, t) => acc + t, 0);
            let missedPitPenalty = false;

            // Enforce Mandatory Pit Stop Rule (ต้องเข้า pit อย่างน้อย 1 ครั้ง)
            if (!engine.hasPitted) {
              totalMs += 30000; // 30s penalty
              missedPitPenalty = true;
              engine.pitPenaltyApplied = true;
            }

            // Compute player's final cumulative race distance accurately!
            const playerFinishedDistance = engine.totalLaps * engine.trackLength + engine.position + playerCarOffset;

            // Build accurate 12-driver classification standings
            const allDrivers = [
              {
                id: teamState.driver1.id || 'driver-1',
                name: teamState.driver1.name,
                tag: teamState.driver1.name.slice(0, 3).toUpperCase(),
                team: teamState.teamName,
                flag: teamState.driver1.nationality?.flag || '🏁',
                primaryColor: teamState.primaryColor || '#dc2626',
                timeMs: totalMs,
                isPlayer: true,
              },
              ...engine.aiCars.map((ai) => {
                const isAiWrecked = !!(ai.isFire || ai.isDnf);
                const aiDist = ai.lapsCompleted * engine.trackLength + ai.z;
                // distDiff: positive means player traveled further (player is AHEAD of AI)
                const distDiff = playerFinishedDistance - aiDist;

                // Time delta estimation: at average speed (~8500 world units/sec)
                const timeDeltaMs = (Math.abs(distDiff) / 8500) * 1000;

                // If distDiff > 0 (player ahead), AI took MORE time (+timeDeltaMs)
                // If distDiff < 0 (AI crossed ahead), AI took LESS time (-timeDeltaMs)
                // If AI wrecked / on fire, it ranks at tail of classification
                const aiTimeMs = isAiWrecked
                  ? 999999999 + (1000000 - aiDist)
                  : distDiff >= 0
                  ? totalMs + Math.max(150, timeDeltaMs)
                  : Math.max(1000, totalMs - timeDeltaMs);

                const tmpl = RIVAL_AI_TEMPLATES.find((t) => t.tag === ai.tag || t.name === ai.name);

                return {
                  id: tmpl?.id || ai.id,
                  name: ai.name,
                  tag: ai.tag,
                  team: ai.teamName,
                  flag: tmpl?.flag || '🏁',
                  primaryColor: ai.primaryColor,
                  timeMs: aiTimeMs,
                  isPlayer: false,
                  isDnf: isAiWrecked,
                };
              }),
            ];

            allDrivers.sort((a, b) => a.timeMs - b.timeMs);
            const standings: OutRunStandingsDriver[] = allDrivers.map((d, idx) => ({
              pos: idx + 1,
              id: d.id,
              name: d.name,
              tag: d.tag,
              team: d.team,
              flag: d.flag,
              primaryColor: d.primaryColor,
              timeStr: (d as any).isDnf
                ? 'DNF (FIRE)'
                : idx === 0
                ? formatLapTime(d.timeMs)
                : `+${((d.timeMs - allDrivers[0].timeMs) / 1000).toFixed(2)}s`,
              timeMs: d.timeMs,
              isPlayer: d.isPlayer,
              personality: d.isPlayer ? undefined : getDriverPersonality(d.tag),
            }));

            const finalPos = standings.find((s) => s.isPlayer)?.pos || 1;

            const finalObjStats = {
              overtakesCount: Math.max(engine.overtakesCount || 0, 12 - finalPos),
              collisionsCount: engine.totalCollisionsCount || 0,
              offroadEventsCount: engine.offroadEventsCount || 0,
              pitStopSec: engine.pitStopTimer,
              finalPosition: finalPos,
            };

            const objectivesSummary = stageObjectives.map((obj) => ({
              obj,
              completed: evaluateStageObjective(obj, finalObjStats),
            }));

            const bonusPrizeEarned = objectivesSummary.reduce(
              (sum, item) => sum + (item.completed ? item.obj.rewardMoney : 0),
              0
            );

            const weakestStatDiagnosis = diagnoseWeakestStat(teamState.car, activeGp.round || 1);

            setRaceSummary({
              position: finalPos,
              bestLapMs: engine.bestLapTimeMs || lapTime,
              totalTimeMs: totalMs,
              topSpeed: engine.topSpeedRecorded,
              offroadEvents: engine.offroadEventsCount,
              hasPitted: engine.hasPitted,
              missedMandatoryPitPenalty: missedPitPenalty,
              standings,
              objectivesSummary,
              bonusPrizeEarned,
              weakestStatDiagnosis,
            });

            sound.stopRaceMusic();
            if (finalPos <= 3) {
              sound.playTrophy();
            }
            setRacePhase('finished');
          } else {
            // Next Lap
            engine.lap++;
            engine.lapStartTime = now;
          }
        }

        // Automatic Gearbox Simulation (1st to 8th gear)
        const gearThresholds = [0, 45, 95, 145, 195, 245, 285, 315];
        let currentGear = 1;
        for (let g = 7; g >= 0; g--) {
          if (engine.speed >= gearThresholds[g]) {
            currentGear = g + 1;
            break;
          }
        }
        engine.gear = currentGear;

        // RPM calculation within current gear
        const prevGearMin = gearThresholds[currentGear - 1] || 0;
        const nextGearMax = gearThresholds[currentGear] || maxSpeed + 25;
        const gearProgress = Math.max(0, Math.min(1, (engine.speed - prevGearMin) / (nextGearMax - prevGearMin)));

        // Rev-Limiter status (at top of gear or max vehicle speed)
        const isRedline = (gearProgress >= 0.96 && isGas) || (engine.speed >= effectiveMaxSpeed * 0.98 && isGas);
        let baseRpm = Math.round(4500 + gearProgress * 10500);
        if (isRedline) {
          // Authentic visual/acoustic tachometer bounce at rev limit
          baseRpm = Math.min(15000, Math.round(14500 + Math.sin(timestamp * 0.05) * 420));
        }
        engine.rpm = baseRpm;

        // Acoustic Gear Shifting Telemetry: Upshift ignition cut & Downshift rev-match
        const prevGear = prevGearRef.current;
        if (currentGear > prevGear) {
          sound.playGearShiftUp(currentGear);
        } else if (currentGear < prevGear) {
          sound.playGearShiftDown(currentGear);
        }
        prevGearRef.current = currentGear;

        // Acoustic Exhaust Overrun Telemetry (burble/pops when lifting off at high RPM)
        const prevGas = prevGasRef.current;
        if (prevGas && !isGas && engine.rpm > 8200) {
          sound.playExhaustOverrun();
        }
        prevGasRef.current = isGas;

        // Particle generation (smoke on hard turns, dust on off-road)
        if (isOffroad && engine.speed > 50) {
          for (let p = 0; p < 2; p++) {
            engine.particles.push({
              x: width / 2 + (Math.random() * 80 - 40) + engine.playerX * 10,
              y: height - 60 + Math.random() * 10,
              vx: (Math.random() - 0.5) * 60,
              vy: -Math.random() * 50 - 20,
              life: 1.0,
              color: 'rgba(34, 197, 94, 0.65)',
            });
          }
        } else if (Math.abs(engine.steerAngle) > 0.65 && engine.speed > 160) {
          // Tire screech smoke
          for (let p = 0; p < 2; p++) {
            engine.particles.push({
              x: width / 2 + (Math.random() * 90 - 45),
              y: height - 55,
              vx: (Math.random() - 0.5) * 40,
              vy: -Math.random() * 30 - 15,
              life: 0.8,
              color: 'rgba(255, 255, 255, 0.5)',
            });
          }
        }

        // Live Audio Synthesizer Update (Order synthesis, dynamic formant filter & aerodynamic rush)
        const rpmNorm = Math.max(0, Math.min(1, (engine.rpm - 1000) / 14000));
        sound.updateOutRunEngine(
          rpmNorm,
          engine.speed,
          isGas,
          isBrake,
          isOffroad,
          onKerb,
          currentGear,
          engine.drsActive,
          isRedline
        );

        // Update Lap Timer
        const currentLapTime = performance.now() - engine.lapStartTime;
        engine.currentLapTimeMs = currentLapTime;

        // Progress bar tracks TOTAL race progress from START to GOAL
        const totalRaceDistance = Math.max(1, engine.totalLaps * engine.trackLength);
        const playerRaceDist = Math.min(totalRaceDistance, effectiveLap * engine.trackLength + engine.position + playerCarOffset);
        const playerRaceProgress = Math.max(0, Math.min(1, playerRaceDist / totalRaceDistance));

        // Dynamic Random Rain Trigger mid-race/mid-lap ("เพิ่มระบบสุ่มฝน กลางlap")
        if (engine.rainScheduled && !engine.isRaining && playerRaceProgress >= engine.rainStartNormalizedDist && racePhase === 'racing') {
          engine.isRaining = true;
          sound.playThunderRain();
          addHudAlert('critical', '🌧️ SUDDEN DOWNPOUR', 'Box for wet tires immediately', '🌧️', 'WET');
          setPitToastMessage('🌧️ ฝนเริ่มตกหนัก! รีบเข้า PIT เปลี่ยนยาง WET TIRES');
        }

        // Advance rain warning radar based on strategist decisions
        if (engine.rainScheduled && !engine.isRaining && racePhase === 'racing') {
          const rainAdvanceNorm = 0.03 + ((strategistDecisions - 70) / 29) * 0.05;
          if (playerRaceProgress >= engine.rainStartNormalizedDist - rainAdvanceNorm && playerRaceProgress < engine.rainStartNormalizedDist) {
            if (!(engine as any).hasAnnouncedRainRadar) {
              (engine as any).hasAnnouncedRainRadar = true;
              addHudAlert('info', '🌧️ STRATEGIST WEATHER RADAR', 'เรดาร์สภาพอากาศ: ฝนกำลังจะตก เตรียมแผนเข้าพิท!', '🌧️', 'RAIN ADV');
            }
          }
        }

        if (engine.isRaining && engine.rainIntensity < 1) {
          engine.rainIntensity = Math.min(1, engine.rainIntensity + dt * 0.40);
        }

        // Mid-Lap Pit Window Calculation (alert distance scales with strategist decisions: pitWarningDistance)
        const midLap = engine.totalLaps <= 2 ? 1 : Math.floor(engine.totalLaps / 2) + 1;
        const isPitDue = ((!engine.hasPitted || engine.tireBlown) && (engine.lap >= midLap)) || (engine.isRaining && !engine.hasWetTires);
        const pitEntryZ = engine.trackLength - 85 * 200;
        let distToPitM = (pitEntryZ - (engine.position % engine.trackLength)) / 100;
        if (distToPitM < 0) distToPitM += engine.trackLength / 100;
        const isMidLapWindow = isPitDue && !engine.inPitLane && distToPitM <= pitWarningDistance && racePhase === 'racing';

        // Check for active booster rival & attacking rival
        const activeBoosterAi = engine.aiCars.find((a) => (a.boostTimer || 0) > 0.4);
        const activeAttackAi = engine.aiCars.find((a) => a.isAttacking);
        const activeIncidentAi = engine.aiCars.find(
          (a) => (a.crashStunTimer && a.crashStunTimer > 0) || (a.slowedTimer && a.slowedTimer > 0.8)
        );
        const activeCatchUpRival = engine.aiCars.find((a) => a.isCatchUpBeast);
        const activePersonalityAi = engine.aiCars.find((a) => {
          if (!a.personalityActiveTimer || a.personalityActiveTimer <= 0.2 || !a.personalitySkillName) {
            return false;
          }
          const aDist = a.lapsCompleted * engine.trackLength + a.z;
          const gapM = Math.abs(playerTotalDistance - aDist) / 100;
          return gapM <= 130;
        });

        // Push priority alerts into central alert queue
        if (engine.isEngineOnFire) {
          addHudAlert('critical', '🔥 ENGINE FIRE! DNF', 'เครื่องยนต์เสียหายหนัก • หยุดทำงาน', '🔥', 'CRITICAL');
        } else if (engine.tireBlown) {
          addHudAlert('critical', '💥 FLAT TIRE • ยางแตก!', 'สปีดลดลง 50% รีบเข้า PIT ด่วน!', '💥', 'FLAT TIRE');
        } else if (isAquaplaningNow) {
          addHudAlert('critical', '🌊 รถลื่นไถล! SLIP', 'ถนนเปียก/คราบน้ำมัน สูญเสียการยึดเกาะ', '🌊', 'SLIP');
        } else if (isMidLapWindow) {
          addHudAlert('critical', '📻 BOX THIS LAP • เข้า PIT', `เตรียมเลี้ยวขวา (${Math.max(0, Math.round(distToPitM))}M)`, '📻', 'PIT');
        } else if (activeIncidentAi) {
          let incType = 'CRASHED BARRIER';
          if (activeIncidentAi.lastObstacleHitType === 'oil_slick' || (activeIncidentAi.spinAngle && activeIncidentAi.spinAngle > 0)) {
            incType = 'SPUN ON OIL';
          } else if (activeIncidentAi.lastObstacleHitType === 'traffic_cone') {
            incType = 'HIT CONE';
          } else if (activeIncidentAi.lastObstacleHitType === 'tire_stack' || activeIncidentAi.lastObstacleHitType === 'tire_barrier') {
            incType = 'HIT TIRE STACK';
          } else if (Math.abs(activeIncidentAi.x) > 1.05) {
            incType = 'IN GRAVEL';
          }
          addHudAlert('rival', `⚠️ ${activeIncidentAi.tag} ${incType}`, `Slowed to ${Math.round(activeIncidentAi.speed)} km/h`, '💥');
        } else if (activeAttackAi) {
          const aDist = activeAttackAi.lapsCompleted * engine.trackLength + activeAttackAi.z;
          const gapM = Math.max(1, Math.round(Math.abs(playerTotalDistance - aDist) / 100));
          addHudAlert('rival', `🏎️ ${activeAttackAi.tag} ATTACKING!`, `Gap ${gapM}m • ${Math.round(activeAttackAi.speed)} km/h`, '🏎️');
        } else if (activeCatchUpRival && activeCatchUpRival.isTailgating) {
          addHudAlert('rival', `🔥 ${activeCatchUpRival.tag} จี้ตูดเราแล้ว!`, 'TAILGATING • DEFEND POSITION', '🔥');
        } else if (activePersonalityAi) {
          const profile = getDriverPersonality(activePersonalityAi.id);
          addHudAlert('rival', `${profile.driverName} - ${profile.skillName}`, profile.tagline, profile.icon);
        }

        // =====================================================================
        // 10Hz (EVERY 100MS) REACT HUD SYNCHRONIZATION WITH CHANGE DETECTION
        // =====================================================================
        if (nowMs - lastHudSyncTimeRef.current >= 100) {
          lastHudSyncTimeRef.current = nowMs;

          // Primitives: only trigger state setter when changed
          const roundSpeed = Math.round(engine.speed);
          setHudSpeed((prev) => (prev !== roundSpeed ? roundSpeed : prev));
          setHudGear((prev) => (prev !== engine.gear ? engine.gear : prev));
          setHudRpm((prev) => (Math.abs(prev - engine.rpm) >= 200 ? engine.rpm : prev));
          setHudLap((prev) => (prev !== engine.lap ? engine.lap : prev));
          setHudCurrentLapTime(currentLapTime);
          setHudBestLapTime((prev) => (prev !== engine.bestLapTimeMs ? engine.bestLapTimeMs : prev));
          setHudEstimatedPos((prev) => (prev !== dynamicPlayerPos ? dynamicPlayerPos : prev));
          setHudDrsActive((prev) => (prev !== engine.drsActive ? engine.drsActive : prev));
          const isBoostActive = engine.boostPadTimer > 0;
          setHudBoostPadActive((prev) => (prev !== isBoostActive ? isBoostActive : prev));
          setHudSlipstream((prev) => (prev !== slipstreamActive ? slipstreamActive : prev));
          setHudTurnWarning((prev) => (prev !== engine.curveUpcomingText ? engine.curveUpcomingText : prev));

          const roundHealth = Math.round(engine.carHealth);
          setHudCarHealth((prev) => (prev !== roundHealth ? roundHealth : prev));
          const roundNitro = Math.round(engine.nitroFuel);
          setHudNitroFuel((prev) => (prev !== roundNitro ? roundNitro : prev));
          setHudNitroDepleted((prev) => (prev !== engine.nitroDepleted ? engine.nitroDepleted : prev));
          setHudIsRaining((prev) => (prev !== engine.isRaining ? engine.isRaining : prev));
          setHudHasWetTires((prev) => (prev !== engine.hasWetTires ? engine.hasWetTires : prev));
          setHudIsAquaplaning((prev) => (prev !== isAquaplaningNow ? isAquaplaningNow : prev));
          setIsEngineOnFire((prev) => (prev !== engine.isEngineOnFire ? engine.isEngineOnFire : prev));

          setShowPitWindowPrompt((prev) => (prev !== isMidLapWindow ? isMidLapWindow : prev));
          const pDistRounded = isMidLapWindow ? Math.max(0, Math.round(distToPitM)) : null;
          setPitDistanceM((prev) => (prev !== pDistRounded ? pDistRounded : prev));
          setPlayerHasPitted((prev) => (prev !== engine.hasPitted ? engine.hasPitted : prev));

          // Object equality comparison for closestAheadRival
          const prevAhead = prevRivalAheadRef.current;
          if (
            (closestAheadRival === null && prevAhead !== null) ||
            (closestAheadRival !== null && (prevAhead === null || prevAhead.tag !== closestAheadRival.tag || prevAhead.gapM !== closestAheadRival.gapM))
          ) {
            prevRivalAheadRef.current = closestAheadRival;
            setHudRivalAhead(closestAheadRival);
          }

          // Object equality comparison for closestBehindRival
          const prevBehind = prevRivalBehindRef.current;
          if (
            (closestBehindRival === null && prevBehind !== null) ||
            (closestBehindRival !== null && (prevBehind === null || prevBehind.tag !== closestBehindRival.tag || prevBehind.gapM !== closestBehindRival.gapM))
          ) {
            prevRivalBehindRef.current = closestBehindRival;
            setHudRivalBehind(closestBehindRival);
          }

          // Mini-Map & Track Progress coordinates comparison
          if (miniMapPointsRef.current.length > 0 && engine.trackLength > 0) {
            const mPoints = miniMapPointsRef.current;
            const pLapNorm = (((engine.position % engine.trackLength) + engine.trackLength) % engine.trackLength) / engine.trackLength;
            const pIdx = Math.floor(pLapNorm * mPoints.length) % mPoints.length;
            const pPt = mPoints[pIdx] || { x: 80, y: 50 };

            if (Math.abs(pPt.x - prevPlayerMapPosRef.current.x) >= 0.5 || Math.abs(pPt.y - prevPlayerMapPosRef.current.y) >= 0.5) {
              prevPlayerMapPosRef.current = pPt;
              setHudPlayerMapPos(pPt);
            }

            if (Math.abs(playerRaceProgress - prevPlayerProgressRef.current) >= 0.003) {
              prevPlayerProgressRef.current = playerRaceProgress;
              setHudPlayerProgress(playerRaceProgress);
            }

            // AI positions array comparison
            const aiMapList = engine.aiCars.map((ai) => {
              const aiLapNorm = (((ai.z % engine.trackLength) + engine.trackLength) % engine.trackLength) / engine.trackLength;
              const aIdx = Math.floor(aiLapNorm * mPoints.length) % mPoints.length;
              const aPt = mPoints[aIdx] || { x: 80, y: 50 };
              const aiRaceDist = Math.min(totalRaceDistance, ai.lapsCompleted * engine.trackLength + ai.z);
              const aiRaceProgress = Math.max(0, Math.min(1, aiRaceDist / totalRaceDistance));

              return {
                id: ai.id,
                tag: ai.tag,
                color: ai.primaryColor,
                progress: aiRaceProgress,
                mapX: Math.round(aPt.x * 10) / 10,
                mapY: Math.round(aPt.y * 10) / 10,
                isCatchUp: ai.isCatchUpBeast,
                isTailgating: ai.isTailgating,
                isPitting: ai.isPitting,
                hasPitted: ai.hasPitted,
              };
            });

            let aiChanged = prevAiPositionsRef.current.length !== aiMapList.length;
            if (!aiChanged) {
              for (let k = 0; k < aiMapList.length; k++) {
                const a = aiMapList[k];
                const b = prevAiPositionsRef.current[k];
                if (
                  a.id !== b.id ||
                  Math.abs(a.mapX - b.mapX) >= 0.8 ||
                  Math.abs(a.mapY - b.mapY) >= 0.8 ||
                  Math.abs(a.progress - b.progress) >= 0.008 ||
                  a.isPitting !== b.isPitting ||
                  a.isCatchUp !== b.isCatchUp ||
                  a.isTailgating !== b.isTailgating
                ) {
                  aiChanged = true;
                  break;
                }
              }
            }

            if (aiChanged) {
              prevAiPositionsRef.current = aiMapList;
              setHudAiPositions(aiMapList);
            }
          }

          // Process and synchronize Alert Queue (2.5s TTL, max 2 items, critical > rival > info)
          const validAlerts = alertQueueRef.current.filter((a) => nowMs - a.createdAt < 2500);
          if (validAlerts.length !== alertQueueRef.current.length) {
            alertQueueRef.current = validAlerts;
          }
          const prioScore: Record<string, number> = { critical: 0, rival: 1, info: 2 };
          const sortedAlerts = [...validAlerts].sort(
            (a, b) => (prioScore[a.priority] ?? 2) - (prioScore[b.priority] ?? 2) || b.createdAt - a.createdAt
          );
          const top2 = sortedAlerts.slice(0, 2);
          const top2Sig = top2.map((a) => a.id).join(';');
          setAlertQueue((prev) => (prev.map((a) => a.id).join(';') !== top2Sig ? top2 : prev));
        }
      }

      // =======================================================================
      // 2. CANVAS RENDERING: RETRO PARALLAX SKY & HORIZON (AUTHENTIC WORLD TOUR)
      // =======================================================================
      ctx.clearRect(0, 0, width, height);

      const circuitDef = getWorldTourCircuit(activeGp.round, activeGp.id);

      // Deep arcade twilight/day sky gradient based on authentic circuit environment
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height / 2);
      if (activeGp.weather === 'Wet') {
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.6, '#1e293b');
        skyGrad.addColorStop(1, '#334155');
      } else {
        skyGrad.addColorStop(0, circuitDef.skyGradient[0]);
        skyGrad.addColorStop(0.35, circuitDef.skyGradient[1]);
        skyGrad.addColorStop(0.70, circuitDef.skyGradient[2]);
        skyGrad.addColorStop(1, circuitDef.skyGradient[3]);
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height / 2);

      // Celestial Sky Details (Clouds, Desert Sun, Twinkling Stars & Moon)
      if (activeGp.weather !== 'Wet') {
        if (circuitDef.celestialFeature === 'clouds') {
          drawSoftClouds(ctx, width, height, engine.skyOffset);
        } else if (circuitDef.celestialFeature === 'desert_sun') {
          drawDesertSun(ctx, width, height, engine.skyOffset);
        } else if (circuitDef.celestialFeature === 'stars_night') {
          drawNightSky(ctx, width, height, engine.skyOffset, nowMs);
        }
      }

      // Camera-Angle Only Horizon Rotation (Independent of Left/Right steering keys or lane position)
      // The background rotates ONLY when the camera follows the road through curves
      const horizonY = height / 2;
      const curSegment = engine.segments.length > 0
        ? engine.segments[Math.floor(engine.position / engine.segmentLength) % engine.segments.length]
        : null;
      // Responsive road curve look-ahead with smooth cinematic damping (camera-only)
      const roadCurveAngle = (curSegment?.curve || 0) * (engine.speed / maxSpeed) * 26;
      const targetMountainOffset = engine.skyOffset + roadCurveAngle;
      engine.smoothHorizonOffset += (targetMountainOffset - engine.smoothHorizonOffset) * Math.min(1.0, 7.5 * dt);
      const mountainOffset = engine.smoothHorizonOffset;

      // Authentic World Tour Horizon with rich details & soothing grounding haze
      drawWorldTourHorizon({
        ctx,
        width,
        height,
        horizonY,
        mountainOffset,
        circuitDef,
        isWet: activeGp.weather === 'Wet',
        timeMs: nowMs,
      });

      // =======================================================================
      // 3. PSEUDO-3D RASTER ROAD PROJECTION (Back-to-Front or Front-to-Back)
      // =======================================================================
      // Elevated player car screen position (lowered slightly per user request)
      const PLAYER_CAR_Y = height - 155;
      const drawDistance = 320; // Extended draw distance for deep landscape horizon
      const baseSegment = Math.floor(engine.position / engine.segmentLength) % engine.segments.length;
      const startPos = engine.position;
      const cameraX = engine.playerX * engine.roadWidth;
      const cameraY = engine.cameraHeight;
      const cameraZ = startPos;

      let dx = -(engine.segments[baseSegment]?.curve || 0) * (engine.position % engine.segmentLength / engine.segmentLength);
      let x = 0;
      let maxY = height; // Clipping plane for scanlines

      // Project all visible segments into pre-allocated pool (zero frame allocations)
      let projectedCount = 0;

      for (let n = 0; n < drawDistance; n++) {
        const segIdx = (baseSegment + n) % engine.segments.length;
        const segment = engine.segments[segIdx];
        const looped = (baseSegment + n) >= engine.segments.length;

        // World coordinates calculation
        const z1 = looped ? segment.p1.world.z + engine.trackLength : segment.p1.world.z;
        const z2 = looped ? segment.p2.world.z + engine.trackLength : segment.p2.world.z;

        // Project point 1
        const camZ1 = z1 - cameraZ;
        if (camZ1 <= 0) continue;

        segment.p1.camera.x = segment.p1.world.x - (cameraX - x);
        segment.p1.camera.y = segment.p1.world.y - cameraY;
        segment.p1.camera.z = camZ1;
        segment.p1.screen.scale = engine.cameraDepth / camZ1;
        segment.p1.screen.x = Math.round(width / 2 + (segment.p1.screen.scale * segment.p1.camera.x * width) / 2);
        segment.p1.screen.y = Math.round(height / 2 - (segment.p1.screen.scale * segment.p1.camera.y * height) / 2);
        segment.p1.screen.w = Math.round((segment.p1.screen.scale * engine.roadWidth * width) / 2);

        // Project point 2
        const camZ2 = z2 - cameraZ;
        segment.p2.camera.x = segment.p2.world.x - (cameraX - x - dx);
        segment.p2.camera.y = segment.p2.world.y - cameraY;
        segment.p2.camera.z = camZ2;
        segment.p2.screen.scale = engine.cameraDepth / camZ2;
        segment.p2.screen.x = Math.round(width / 2 + (segment.p2.screen.scale * segment.p2.camera.x * width) / 2);
        segment.p2.screen.y = Math.round(height / 2 - (segment.p2.screen.scale * segment.p2.camera.y * height) / 2);
        segment.p2.screen.w = Math.round((segment.p2.screen.scale * engine.roadWidth * width) / 2);

        x += dx;
        dx += segment.curve;

        if (projectedCount < MAX_PROJECTED_SEGMENTS) {
          const poolItem = projectedSegmentsPool[projectedCount];
          poolItem.seg = segment;
          poolItem.x1 = segment.p1.screen.x;
          poolItem.y1 = segment.p1.screen.y;
          poolItem.w1 = segment.p1.screen.w;
          poolItem.scale = segment.p1.screen.scale;
          poolItem.x2 = segment.p2.screen.x;
          poolItem.y2 = segment.p2.screen.y;
          poolItem.w2 = segment.p2.screen.w;
          projectedCount++;
        }
      }

      // Render segments from back (horizon) to front (camera)
      for (let i = projectedCount - 1; i >= 0; i--) {
        const item = projectedSegmentsPool[i];
        const seg = item.seg;
        const { x1, y1, w1, x2, y2, w2 } = item;

        // Draw road and curb scanline only if forward-facing and has height (y1 > y2)
        if (y1 > y2) {
          // 1. Grass (full screen width between consecutive scanlines)
          ctx.fillStyle = seg.color.grass;
          ctx.fillRect(0, y2, width, y1 - y2);

          // 2. Rumble Strips (Kerbs: 1.25x road width)
          const rumbleW1 = w1 * 1.22;
          const rumbleW2 = w2 * 1.22;
          drawPolygon(
            ctx,
            x1 - rumbleW1,
            y1,
            x1 + rumbleW1,
            y1,
            x2 + rumbleW2,
            y2,
            x2 - rumbleW2,
            y2,
            seg.color.rumble
          );

          // 3. Asphalt Road Surface
          drawPolygon(ctx, x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, seg.color.road);

          // 4. Center Dashed Line
          if (seg.color.lane !== 'transparent') {
            const laneW1 = w1 * 0.05;
            const laneW2 = w2 * 0.05;
            drawPolygon(
              ctx,
              x1 - laneW1,
              y1,
              x1 + laneW1,
              y1,
              x2 + laneW2,
              y2,
              x2 - laneW2,
              y2,
              seg.color.lane
            );
          }

          // 4b. Formula 1 High-Energy Yellow Booster Pad / Speed Pad (Wider & Brilliant Yellow)
          if (seg.boostPad) {
            const padOffset = seg.boostPad.offset;
            const padW = seg.boostPad.width || 0.52;
            const padX1 = x1 + padOffset * w1;
            const padX2 = x2 + padOffset * w2;
            const halfW1 = (w1 * padW) / 2;
            const halfW2 = (w2 * padW) / 2;

            // Pulsing golden-yellow energy animation cycle
            const pulse = (Math.sin(timestamp * 0.011 + seg.index * 0.35) + 1) * 0.5;
            const glowOpacity = 0.65 + pulse * 0.32;

            // 1. Dark Racing Amber-Carbon Base Pad
            drawPolygon(
              ctx,
              padX1 - halfW1,
              y1,
              padX1 + halfW1,
              y1,
              padX2 + halfW2,
              y2,
              padX2 - halfW2,
              y2,
              '#351a02' // deep dark amber-black base
            );

            // 2. Brilliant Glowing Yellow/Gold Energy Core
            const coreHalfW1 = halfW1 * 0.90;
            const coreHalfW2 = halfW2 * 0.90;
            drawPolygon(
              ctx,
              padX1 - coreHalfW1,
              y1,
              padX1 + coreHalfW1,
              y1,
              padX2 + coreHalfW2,
              y2,
              padX2 - coreHalfW2,
              y2,
              `rgba(234, 179, 8, ${glowOpacity})` // radiant gold
            );

            // 3. Neon Chevron Speed Arrow Strip in perspective (Vibrant white-gold)
            const arrowHalfW1 = halfW1 * 0.54;
            const arrowHalfW2 = halfW2 * 0.54;
            drawPolygon(
              ctx,
              padX1 - arrowHalfW1,
              y1,
              padX1 + arrowHalfW1,
              y1,
              padX2 + arrowHalfW2,
              y2,
              padX2 - arrowHalfW2,
              y2,
              `rgba(254, 240, 138, ${0.85 + pulse * 0.15})` // bright glowing yellow-white
            );

            // 4. Electric Glowing Yellow Border Rails
            const railW1 = halfW1 * 0.10;
            const railW2 = halfW2 * 0.10;
            drawPolygon(
              ctx,
              padX1 - halfW1,
              y1,
              padX1 - halfW1 + railW1,
              y1,
              padX2 - halfW2 + railW2,
              y2,
              padX2 - halfW2,
              y2,
              '#facc15'
            );
            drawPolygon(
              ctx,
              padX1 + halfW1 - railW1,
              y1,
              padX1 + halfW1,
              y1,
              padX2 + halfW2,
              y2,
              padX2 + halfW2 - railW2,
              y2,
              '#facc15'
            );
          }

          // 5. Start/Finish Line Checkered Grid Pattern
          if (seg.isStartFinish) {
            const checks = 12;
            const step1 = (w1 * 2) / checks;
            const step2 = (w2 * 2) / checks;
            for (let c = 0; c < checks; c++) {
              const isWhite = (c + (seg.index % 2)) % 2 === 0;
              const cX1 = x1 - w1 + c * step1;
              const cX2 = x2 - w2 + c * step2;
              drawPolygon(
                ctx,
                cX1,
                y1,
                cX1 + step1,
                y1,
                cX2 + step2,
                y2,
                cX2,
                y2,
                isWhite ? '#ffffff' : '#090b0e'
              );
            }
          }

          // 5b. Authentic Branching Pit Lane Roadway (ถนนแยกออกไปข้างนอกใกล้เส้นชัย)
          if (seg.isPitLaneZone) {
            let pitOffL = 1.20;
            let pitOffR = 1.76;
            const isDarkPit = Math.floor(seg.index / 3) % 2 === 0;

            if (seg.pitLaneType === 'entry') {
              const entryProg = Math.min(1, Math.max(0, (seg.index - (engine.segments.length - 85)) / 20));
              pitOffL = 1.05 + entryProg * 0.15;
              pitOffR = 1.20 + entryProg * 0.58;
            } else if (seg.pitLaneType === 'exit') {
              const exitProg = seg.index >= engine.segments.length - 15 ? 0 : Math.min(1, Math.max(0, seg.index / 38));
              pitOffL = 1.20 - exitProg * 0.20;
              pitOffR = 1.78 - exitProg * 0.65;
            }

            const pX1_L = x1 + w1 * pitOffL;
            const pX1_R = x1 + w1 * pitOffR;
            const pX2_L = x2 + w2 * pitOffL;
            const pX2_R = x2 + w2 * pitOffR;

            // Pit Lane Dark Asphalt Surface
            drawPolygon(
              ctx,
              pX1_L, y1,
              pX1_R, y1,
              pX2_R, y2,
              pX2_L, y2,
              isDarkPit ? '#141a24' : '#1d2432'
            );

            // Outer Yellow Pit Boundary Line
            const bW1 = (pX1_R - pX1_L) * 0.05;
            const bW2 = (pX2_R - pX2_L) * 0.05;
            drawPolygon(
              ctx,
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
              drawPolygon(ctx, wallX1_L, y1, wallX1_R, y1, wallX2_R, y2, wallX2_L, y2, '#334155');
              // Wall top cap
              drawPolygon(ctx, wallX1_L, y1 - wallH1, wallX1_R, y1 - wallH1, wallX2_R, y2 - wallH2, wallX2_L, y2 - wallH2, '#94a3b8');
            }

            // Yellow Box Markings for Team Pit Boxes (painted for all team stalls)
            if (seg.index >= engine.segments.length - 68 && seg.index <= engine.segments.length - 20) {
              const relPitSeg = engine.segments.length - seg.index;
              if (relPitSeg % 4 === 0 || relPitSeg % 4 === 1) {
                const boxW1 = (pX1_R - pX1_L) * 0.72;
                const boxW2 = (pX2_R - pX2_L) * 0.72;
                const boxC1 = (pX1_L + pX1_R) / 2;
                const boxC2 = (pX2_L + pX2_R) / 2;
                drawPolygon(
                  ctx,
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

        // 5c. Continuous 3D Polygonal Grandstand (rendered even if segment is obscured by hill y1 <= y2)
        if (seg.hasGrandstand) {
          // Left Trackside 3D Grandstand
          draw3DGrandstandSegment(ctx, x1, y1, w1, x2, y2, w2, seg.index, -1);
          // Right Trackside 3D Grandstand
          draw3DGrandstandSegment(ctx, x1, y1, w1, x2, y2, w2, seg.index, 1);
        }

        // 6. Draw authentic Grand Prix roadside props for this segment
        // NEVER skip sprites even if scanline is thin near horizon!
        if (seg.sprites && seg.sprites.length > 0 && y1 >= height / 2 - 35 && y1 < height + 160) {
          for (let sIdx = 0; sIdx < seg.sprites.length; sIdx++) {
            const sp = seg.sprites[sIdx];
            drawRoadsideProp(ctx, sp, x1, y1, w1, item.scale, width, height);

            // Real-time Screen-Space direct collision fallback:
            // Tightened to car's actual screen bounds so near-misses and tight slaloms are possible
            const playerCarScreenY = PLAYER_CAR_Y;
            if (racePhase === 'racing' && (!sp.playerHitUntil || nowMs > sp.playerHitUntil)) {
              if (y1 >= playerCarScreenY - 45 && y1 <= playerCarScreenY + 28) {
                if (sp.type === 'drs_gantry') {
                  // Safe clearance underneath gantry overhead arch
                } else if (
                  engine.inPitLane ||
                  engine.pitState !== 'none' ||
                  seg.isPitLaneZone ||
                  (seg.index >= engine.segments.length - 100 && engine.playerX > 0.50) ||
                  sp.type === 'pit_box_crew' ||
                  sp.type === 'pit_entry_sign' ||
                  sp.type === 'team_pitwall'
                ) {
                  // Safe clearance in pit lane - completely immune to collisions inside pit lane!
                } else if (!sp.isObstacle && Math.abs(engine.playerX) <= 1.55) {
                  // Non-obstacle roadside scenery (billboards, grandstands) never clips cars on track
                } else {
                  const spScreenX = x1 + sp.offset * w1;
                  const carScreenX = width / 2;
                  const hitThreshold = w1 * getPropHitWidth(sp.type);
                  if (hitThreshold > 0 && Math.abs(spScreenX - carScreenX) < hitThreshold) {
                    triggerPropCollision(sp);
                  }
                }
              }
            }
          }
        }
      }

      // =======================================================================
      // 4. PARTICLES UPDATE & RENDERING (Tire Smoke / Dust)
      // =======================================================================
      for (let pIdx = engine.particles.length - 1; pIdx >= 0; pIdx--) {
        const pt = engine.particles[pIdx];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt * 2.2;
        if (pt.life <= 0) {
          engine.particles.splice(pIdx, 1);
          continue;
        }
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, (1.0 - pt.life) * 14 + 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // =======================================================================
      // 5. RADIAL SPEED LINES (Intense warp speed streaks, heavily amplified during Booster Pad!)
      // =======================================================================
      if (engine.speed > 180 || engine.boostPadTimer > 0) {
        const isBoost = engine.boostPadTimer > 0;
        const speedRatio = Math.min(1, (engine.speed - 180) / (maxSpeed - 180));
        // Significantly more speed lines during boost (up to 95 intense streaks!)
        const numLines = isBoost
          ? Math.min(engine.speedLines.length, 95)
          : Math.floor(speedRatio * 36);
        const centerX = width / 2;
        const centerY = height / 2 + 10;
        const maxDist = Math.max(width, height) * 0.75;

        ctx.save();
        ctx.lineWidth = isBoost ? 2.2 : 1.0; // Thicker, punchier speed streaks during boost

        for (let i = 0; i < numLines; i++) {
          const line = engine.speedLines[i];
          if (!line) continue;

          // Accelerated radial velocity during boost!
          const speedMultiplier = isBoost ? 2.6 : (0.6 + speedRatio * 1.5);
          line.dist += line.speed * speedMultiplier * dt;

          // When wind streak reaches screen edges, re-spawn near horizon with new random angle
          if (line.dist > maxDist) {
            line.dist = 30 + Math.random() * 60;
            line.angle = Math.random() * Math.PI * 2;
            line.length = Math.random() * (isBoost ? 65 : 26) + (isBoost ? 35 : 14);
            line.speed = Math.random() * 520 + (isBoost ? 650 : 360);
            line.opacity = isBoost ? (Math.random() * 0.28 + 0.18) : (Math.random() * 0.08 + 0.04);
          }

          const distStart = line.dist;
          const streakMultiplier = isBoost ? 2.5 : (0.8 + speedRatio * 1.2);
          const distEnd = line.dist + line.length * streakMultiplier;

          const x1 = centerX + Math.cos(line.angle) * distStart * 1.5;
          const y1 = centerY + Math.sin(line.angle) * distStart * 0.85;
          const x2 = centerX + Math.cos(line.angle) * distEnd * 1.5;
          const y2 = centerY + Math.sin(line.angle) * distEnd * 0.85;

          const baseAlpha = isBoost ? line.opacity : line.opacity * (0.6 + speedRatio * 0.7);
          ctx.strokeStyle = isBoost
            ? (Math.random() > 0.4 ? `rgba(253, 224, 71, ${baseAlpha * 1.4})` : `rgba(255, 255, 255, ${baseAlpha * 1.6})`)
            : engine.drsActive
            ? `rgba(56, 189, 248, ${baseAlpha * 1.25})`
            : `rgba(255, 255, 255, ${baseAlpha})`;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // =======================================================================
      // UNIFIED 60FPS AI RIVAL F1 CARS RENDERING (NO FLICKER, BUTTER-SMOOTH)
      // =======================================================================
      const visibleRivals: {
        car: AiCar;
        distZ: number;
        screenX: number;
        screenY: number;
        scale: number;
      }[] = [];

      for (let ac = 0; ac < engine.aiCars.length; ac++) {
        const rival = engine.aiCars[ac];
        let distZ = rival.z - engine.position;
        if (distZ < -engine.trackLength / 2) distZ += engine.trackLength;
        if (distZ > engine.trackLength / 2) distZ -= engine.trackLength;

        // Virtual chase camera offset behind player
        const camOffsetZ = 220;
        const effDist = distZ + camOffsetZ;

        // Clip only if physically behind chase camera
        if (effDist >= 20 && distZ <= drawDistance * engine.segmentLength) {
          const persFactor = camOffsetZ / effDist;
          let roadCenterX = width / 2;
          let roadLaneW = (width * 0.42) * persFactor;
          let screenY = height / 2 + (PLAYER_CAR_Y - height / 2) * persFactor;
          let carScaleVal = 0.00115 * persFactor;

          if (distZ >= 0) {
            const segProgress = distZ / engine.segmentLength;
            const segIdx0 = Math.floor(segProgress);
            const segIdx1 = Math.min(projectedCount - 1, segIdx0 + 1);
            const frac = Math.max(0, Math.min(1, segProgress - segIdx0));

            const p0 = projectedSegmentsPool[Math.min(projectedCount - 1, Math.max(0, segIdx0))];
            const p1 = projectedSegmentsPool[segIdx1];

            if (p0 && p1) {
              // Smooth, continuous sub-segment fractional interpolation (ZERO jitter / ZERO shaking!)
              roadCenterX = p0.x1 + (p1.x1 - p0.x1) * frac;
              roadLaneW = p0.w1 + (p1.w1 - p0.w1) * frac;
              screenY = p0.y1 + (p1.y1 - p0.y1) * frac;
              carScaleVal = p0.scale + (p1.scale - p0.scale) * frac;
            } else if (p0) {
              roadCenterX = p0.x1;
              roadLaneW = p0.w1;
              screenY = p0.y1;
              carScaleVal = p0.scale;
            }
          } else {
            // Alongside / falling behind chase camera: smooth backward perspective extrapolation
            const base0 = projectedSegmentsPool[0];
            const base1 = projectedSegmentsPool[1] || base0;
            if (base0 && base1) {
              const slopeX = base0.x1 - base1.x1;
              const ratio = Math.abs(distZ) / engine.segmentLength;
              roadCenterX = base0.x1 + slopeX * ratio;
              roadLaneW = base0.w1 * persFactor;
              const horizonY = height / 2;
              const playerY = PLAYER_CAR_Y;
              screenY = horizonY + (playerY - horizonY) * persFactor;
              carScaleVal = 0.00115 * persFactor;
            }
          }

          const screenX = roadCenterX + rival.x * roadLaneW;

          // Generous screen margin (up to height + 200) so rival completely slides down off bottom with zero flicker!
          if (screenY >= height / 2 - 35 && screenY <= height + 200 && screenX >= -400 && screenX <= width + 400) {
            visibleRivals.push({
              car: rival,
              distZ,
              screenX,
              screenY,
              scale: carScaleVal,
            });
          }
        }
      }

      // Sort back-to-front (furthest cars rendered first, closest cars rendered in front)
      visibleRivals.sort((a, b) => b.distZ - a.distZ);

      // Render each AI rival car
      for (let vr = 0; vr < visibleRivals.length; vr++) {
        const item = visibleRivals[vr];
        drawAiCar(ctx, item.car, item.screenX, item.screenY, item.scale, timestamp);
      }

      // =======================================================================
      // 6. HIGH-PRECISION FORMULA 1 CAR RENDERING (Rear Chase View)
      // =======================================================================
      // Proportions accurately matched with competitor AI cars (low, wide, realistic)
      const carScale = 0.82;
      const carCenterX = width / 2 + engine.cameraShake.x;
      const carCenterY = PLAYER_CAR_Y + engine.cameraShake.y;
      const steer = engine.steerAngle; // -1 to 1

      ctx.save();
      ctx.translate(carCenterX, carCenterY);

      // Chassis bounce & vertical suspension vibration
      const bounce = (Math.sin(timestamp * 0.06) * 1.2) * (engine.speed / maxSpeed);
      ctx.translate(0, bounce);

      // Chassis roll & yaw perspective transformation when cornering (authentic dynamic 3/4 turn angle)
      ctx.rotate(steer * 0.065);
      ctx.transform(1, 0, steer * 0.09, 1, 0, 0);

      // Livery colors from player team
      const primaryCol = teamState.primaryColor || '#dc2626';
      const secondaryCol = teamState.secondaryColor || '#0f172a';

      // 1. Soft Dynamic Shadow on asphalt
      const shadowW = (130 + Math.abs(steer) * 12) * carScale;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(steer * 8 * carScale, 36 * carScale, shadowW, 14 * carScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Front Open Wheels & Front Wing Cascades (Visible in perspective when steering!)
      if (Math.abs(steer) > 0.04) {
        const fwDist = 72 * carScale;
        const fwY = -48 * carScale;
        const fwSteerAngle = steer * 0.36; // Front wheels angle into the apex!

        // Left Front Wheel
        ctx.save();
        ctx.translate(-fwDist + steer * 6 * carScale, fwY);
        ctx.rotate(fwSteerAngle);
        ctx.fillStyle = '#090b0e';
        ctx.beginPath();
        ctx.roundRect(-8 * carScale, -18 * carScale, 16 * carScale, 36 * carScale, 4);
        ctx.fill();
        // Yellow Pirelli rim ring
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-6 * carScale, -15 * carScale, 12 * carScale, 30 * carScale);
        ctx.restore();

        // Right Front Wheel
        ctx.save();
        ctx.translate(fwDist + steer * 6 * carScale, fwY);
        ctx.rotate(fwSteerAngle);
        ctx.fillStyle = '#090b0e';
        ctx.beginPath();
        ctx.roundRect(-8 * carScale, -18 * carScale, 16 * carScale, 36 * carScale, 4);
        ctx.fill();
        // Yellow Pirelli rim ring
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-6 * carScale, -15 * carScale, 12 * carScale, 30 * carScale);
        ctx.restore();

        // Front Wing Carbon Tips visible ahead of nosecone
        ctx.fillStyle = secondaryCol;
        ctx.beginPath();
        ctx.roundRect(-fwDist - 12 * carScale + steer * 14 * carScale, fwY - 14 * carScale, (fwDist * 2 + 24) * carScale, 7 * carScale, 2);
        ctx.fill();
      }

      // 3. Wide Ground-Effect Venturi Tunnels & Diffuser
      ctx.fillStyle = '#06080b';
      ctx.beginPath();
      ctx.moveTo(-82 * carScale, 24 * carScale);
      ctx.lineTo(82 * carScale, 24 * carScale);
      ctx.lineTo((72 + steer * 6) * carScale, 36 * carScale);
      ctx.lineTo((-72 + steer * 6) * carScale, 36 * carScale);
      ctx.closePath();
      ctx.fill();

      // Diffuser Vertical Carbon Strakes (Leaning dynamically into the turn)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      for (let st = -54; st <= 54; st += 18) {
        ctx.beginPath();
        ctx.moveTo(st * carScale, 24 * carScale);
        ctx.lineTo((st * 0.88 + steer * 4) * carScale, 36 * carScale);
        ctx.stroke();
      }

      // 4. Wide Slick Rear Wheels & Double Wishbone Suspension
      const tireW = 38 * carScale;
      const tireH = 68 * carScale;
      const tireDist = 92 * carScale;

      // Carbon Suspension Arms
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      // Left wishbones
      ctx.beginPath();
      ctx.moveTo(-35 * carScale, 8 * carScale);
      ctx.lineTo((-tireDist + 12) * carScale, 0);
      ctx.moveTo(-32 * carScale, 20 * carScale);
      ctx.lineTo((-tireDist + 12) * carScale, 18 * carScale);
      // Right wishbones
      ctx.moveTo(35 * carScale, 8 * carScale);
      ctx.lineTo((tireDist - 12) * carScale, 0);
      ctx.moveTo(32 * carScale, 20 * carScale);
      ctx.lineTo((tireDist - 12) * carScale, 18 * carScale);
      ctx.stroke();

      // Left Rear Slick Tire (with lateral camber flex)
      ctx.save();
      ctx.translate(-tireDist, 8);
      ctx.rotate(-steer * 0.025);
      ctx.fillStyle = '#0d1117';
      ctx.beginPath();
      ctx.roundRect(-tireW / 2, -tireH / 2, tireW, tireH, 6);
      ctx.fill();
      ctx.fillStyle = '#1e2530';
      ctx.beginPath();
      ctx.roundRect(-tireW / 4, -tireH / 4, tireW / 2, tireH / 2, 4);
      ctx.fill();
      ctx.fillStyle = '#ef4444'; // Red center wheel nut
      ctx.beginPath();
      ctx.arc(0, 0, 3 * carScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308'; // Pirelli stripe
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, (tireH / 2) - 4, Math.PI * 0.6, Math.PI * 1.4);
      ctx.stroke();
      ctx.restore();

      // Right Rear Slick Tire (with lateral camber flex)
      ctx.save();
      ctx.translate(tireDist, 8);
      ctx.rotate(-steer * 0.025);
      ctx.fillStyle = '#0d1117';
      ctx.beginPath();
      ctx.roundRect(-tireW / 2, -tireH / 2, tireW, tireH, 6);
      ctx.fill();
      ctx.fillStyle = '#1e2530';
      ctx.beginPath();
      ctx.roundRect(-tireW / 4, -tireH / 4, tireW / 2, tireH / 2, 4);
      ctx.fill();
      ctx.fillStyle = '#3b82f6'; // Blue center wheel nut
      ctx.beginPath();
      ctx.arc(0, 0, 3 * carScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#eab308'; // Pirelli stripe
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, (tireH / 2) - 4, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.restore();

      // 5. Asymmetric Sculpted Sidepods & 3/4 Turn Flank Exposure!
      const sidepodW = 68 * carScale;

      // Base Sidepods Undercut
      ctx.fillStyle = secondaryCol;
      // Left sidepod
      ctx.beginPath();
      ctx.moveTo(-36 * carScale, 0);
      ctx.lineTo(-sidepodW, 10 * carScale);
      ctx.lineTo(-sidepodW + 8 * carScale, 26 * carScale);
      ctx.lineTo(-36 * carScale, 22 * carScale);
      ctx.closePath();
      ctx.fill();
      // Right sidepod
      ctx.beginPath();
      ctx.moveTo(36 * carScale, 0);
      ctx.lineTo(sidepodW, 10 * carScale);
      ctx.lineTo(sidepodW - 8 * carScale, 26 * carScale);
      ctx.lineTo(36 * carScale, 22 * carScale);
      ctx.closePath();
      ctx.fill();

      // DYNAMIC 3/4 FLANK: When steering left, outer right sidepod opens into perspective!
      if (steer < -0.05) {
        // Outer Right Radiator Air Scoop & Sculpted Side Flank
        ctx.fillStyle = primaryCol;
        ctx.beginPath();
        ctx.moveTo(sidepodW - 8 * carScale, 26 * carScale);
        ctx.lineTo(sidepodW + 14 * carScale, 14 * carScale);
        ctx.lineTo(sidepodW + 10 * carScale, -12 * carScale);
        ctx.lineTo(36 * carScale, -8 * carScale);
        ctx.closePath();
        ctx.fill();

        // Radiator Inlet Air Vent (Dark mouth with carbon splitter)
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.roundRect(sidepodW - 2 * carScale, -4 * carScale, 12 * carScale, 16 * carScale, 3);
        ctx.fill();

        // Carbon Floor Edge Winglet on Right Flank
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sidepodW + 4 * carScale, 16 * carScale, 8 * carScale, 8 * carScale);
      } else if (steer > 0.05) {
        // Outer Left Radiator Air Scoop & Sculpted Side Flank
        ctx.fillStyle = primaryCol;
        ctx.beginPath();
        ctx.moveTo(-sidepodW + 8 * carScale, 26 * carScale);
        ctx.lineTo(-sidepodW - 14 * carScale, 14 * carScale);
        ctx.lineTo(-sidepodW - 10 * carScale, -12 * carScale);
        ctx.lineTo(-36 * carScale, -8 * carScale);
        ctx.closePath();
        ctx.fill();

        // Radiator Inlet Air Vent (Dark mouth with carbon splitter)
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.roundRect(-sidepodW - 10 * carScale, -4 * carScale, 12 * carScale, 16 * carScale, 3);
        ctx.fill();

        // Carbon Floor Edge Winglet on Left Flank
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-sidepodW - 12 * carScale, 16 * carScale, 8 * carScale, 8 * carScale);
      }

      // 6. Central Engine Cover Spine & Cockpit Tub
      ctx.fillStyle = primaryCol;
      ctx.beginPath();
      ctx.moveTo(-60 * carScale + steer * 5, 22 * carScale);
      ctx.lineTo(-34 * carScale + steer * 3, -8 * carScale);
      ctx.lineTo(-17 * carScale + steer * 2, -46 * carScale); // Air intake top
      ctx.lineTo(17 * carScale + steer * 2, -46 * carScale);
      ctx.lineTo(34 * carScale + steer * 3, -8 * carScale);
      ctx.lineTo(60 * carScale + steer * 5, 22 * carScale);
      ctx.lineTo(38 * carScale, 28 * carScale);
      ctx.lineTo(-38 * carScale, 28 * carScale);
      ctx.closePath();
      ctx.fill();

      // Bodywork Shading Gradient
      const bodyGrad = ctx.createLinearGradient(0, -46 * carScale, 0, 28 * carScale);
      bodyGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
      bodyGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
      bodyGrad.addColorStop(0.7, 'transparent');
      bodyGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Shark Fin Aerodynamic Spine
      ctx.fillStyle = secondaryCol;
      ctx.beginPath();
      ctx.moveTo(steer * 2, -46 * carScale);
      ctx.lineTo(steer * 3, -12 * carScale);
      ctx.lineTo((steer * 2) + 2, -12 * carScale);
      ctx.lineTo((steer * 2) + 2, -46 * carScale);
      ctx.closePath();
      ctx.fill();

      // 7. Cockpit, Halo Safety Structure & Driver Helmet (Turning towards Apex!)
      // Titanium Halo Arch
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 5.5 * carScale;
      ctx.beginPath();
      ctx.arc(steer * 4, -31 * carScale, 17 * carScale, Math.PI, 0);
      ctx.stroke();

      // Central Halo Pylon
      ctx.fillStyle = '#020617';
      ctx.fillRect(-2 * carScale + steer * 4, -31 * carScale, 4 * carScale, 14 * carScale);

      // Driver Helmet (Visor visibly glances into the corner!)
      const helmetX = steer * 6 * carScale;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(helmetX, -28 * carScale, 11 * carScale, 0, Math.PI * 2);
      ctx.fill();
      // Helmet Livery Ring
      ctx.fillStyle = primaryCol;
      ctx.beginPath();
      ctx.arc(helmetX, -28 * carScale, 11 * carScale, Math.PI * 0.8, Math.PI * 1.5);
      ctx.fill();
      // Visor with metallic iridescent glare pointing into apex
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(helmetX + steer * 2, -30 * carScale, 7.5 * carScale, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();

      // 8. Engine Airbox Intake & T-Cam Antenna
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.ellipse(steer * 2.5, -46 * carScale, 9 * carScale, 5 * carScale, 0, 0, Math.PI * 2);
      ctx.fill();
      // FIA T-Cam on top (Yellow for Driver 1)
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-4 * carScale + steer * 2.5, -55 * carScale, 8 * carScale, 4 * carScale);

      // 9. Massive Aerodynamic Rear Wing & DRS Actuator with 3D Depth
      const wingY = -58 * carScale;
      const wingW = 166 * carScale;
      const wingH = 18 * carScale;

      // Asymmetric Rear Wing Endplates in 3D Perspective
      ctx.fillStyle = secondaryCol;
      // Left Endplate (Taller if turning right, foreshortened if turning left)
      const leftPlateH = (32 + steer * 8) * carScale;
      ctx.fillRect(-wingW / 2, wingY - 8, 7 * carScale, leftPlateH);
      // Right Endplate (Taller if turning left, foreshortened if turning right)
      const rightPlateH = (32 - steer * 8) * carScale;
      ctx.fillRect(wingW / 2 - 7 * carScale, wingY - 8, 7 * carScale, rightPlateH);

      // Main Aerofoil Beam
      ctx.fillStyle = primaryCol;
      ctx.beginPath();
      ctx.roundRect(-wingW / 2 + 5 * carScale, wingY, wingW - 10 * carScale, wingH, 3);
      ctx.fill();

      // Top Wing Sponsor Deck
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-wingW / 4 + steer * 4, wingY + 3, wingW / 2, 4);

      // DRS Flap: Hinges upward when active!
      if (engine.drsActive) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fillRect(-wingW / 2 + 8 * carScale, wingY - 12, wingW - 16 * carScale, 10 * carScale);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-wingW / 2 + 10 * carScale, wingY - 10, wingW - 20 * carScale, 6 * carScale);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(-wingW / 2 + 10 * carScale, wingY - 10, wingW - 20 * carScale, 6 * carScale);
      }

      // 10. Central FIA LED Rain/Brake Light
      const isBraking = keysRef.current.down;
      const rainLightBlink = engine.speed < 90 && Math.sin(timestamp * 0.02) > 0;
      const lightActive = isBraking || rainLightBlink;

      ctx.fillStyle = lightActive ? '#ef4444' : '#581c87';
      ctx.beginPath();
      ctx.roundRect(-8 * carScale + steer * 3, 22 * carScale, 16 * carScale, 8 * carScale, 2);
      ctx.fill();

      if (lightActive) {
        // Translucent halo ellipse instead of expensive shadowBlur
        ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.beginPath();
        ctx.ellipse(steer * 3, 26 * carScale, 12 * carScale, 8 * carScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-4 * carScale + steer * 3, 24 * carScale, 8 * carScale, 4 * carScale);
      }

      // 11. Exhaust Pipe Glow & Turbo Exhaust Flames
      ctx.fillStyle = engine.speed > 220 ? '#f97316' : '#1e293b';
      ctx.beginPath();
      ctx.arc(steer * 2, 18 * carScale, 5 * carScale, 0, Math.PI * 2);
      ctx.fill();

      // High RPM Exhaust Flame Spit
      if (keysRef.current.up && engine.rpm > 10500 && Math.random() < 0.45) {
        ctx.fillStyle = Math.random() < 0.6 ? '#f97316' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(steer * 2, 20 * carScale, Math.random() * 10 + 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Boost Pad Plasma Jet Thruster (Blazing golden yellow afterburner flames!)
      if (engine.boostPadTimer > 0) {
        ctx.save();
        // Layered translucent ellipses under flame instead of expensive shadowBlur
        ctx.fillStyle = 'rgba(250, 204, 21, 0.40)';
        ctx.beginPath();
        ctx.ellipse(steer * 2, 22 * carScale, 16 * carScale, 12 * carScale, 0, 0, Math.PI * 2);
        ctx.fill();
        const flameLen = (32 + Math.random() * 24) * carScale;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(steer * 2 - 10 * carScale, 18 * carScale);
        ctx.lineTo(steer * 2, (18 + flameLen) * carScale);
        ctx.lineTo(steer * 2 + 10 * carScale, 18 * carScale);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(steer * 2 - 5 * carScale, 18 * carScale);
        ctx.lineTo(steer * 2, (18 + flameLen * 0.6) * carScale);
        ctx.lineTo(steer * 2 + 5 * carScale, 18 * carScale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Nitro Boost Plasma Jet Thrusters (Glowing cyan/blue supersonic afterburner flames!)
      if (engine.drsActive) {
        ctx.save();
        // Layered translucent ellipses under thrusters instead of expensive shadowBlur
        ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
        ctx.beginPath();
        ctx.ellipse(steer * 2 - 10 * carScale, 22 * carScale, 12 * carScale, 10 * carScale, 0, 0, Math.PI * 2);
        ctx.ellipse(steer * 2 + 10 * carScale, 22 * carScale, 12 * carScale, 10 * carScale, 0, 0, Math.PI * 2);
        ctx.fill();
        const nitroLen = (36 + Math.random() * 26) * carScale;
        // Left exhaust jet
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(steer * 2 - 14 * carScale, 18 * carScale);
        ctx.lineTo(steer * 2 - 10 * carScale, (18 + nitroLen) * carScale);
        ctx.lineTo(steer * 2 - 6 * carScale, 18 * carScale);
        ctx.closePath();
        ctx.fill();

        // Right exhaust jet
        ctx.beginPath();
        ctx.moveTo(steer * 2 + 6 * carScale, 18 * carScale);
        ctx.lineTo(steer * 2 + 10 * carScale, (18 + nitroLen) * carScale);
        ctx.lineTo(steer * 2 + 14 * carScale, 18 * carScale);
        ctx.closePath();
        ctx.fill();

        // Inner core bright cyan-white
        ctx.fillStyle = '#a5f3fc';
        ctx.beginPath();
        ctx.moveTo(steer * 2 - 12 * carScale, 18 * carScale);
        ctx.lineTo(steer * 2 - 10 * carScale, (18 + nitroLen * 0.6) * carScale);
        ctx.lineTo(steer * 2 - 8 * carScale, 18 * carScale);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(steer * 2 + 8 * carScale, 18 * carScale);
        ctx.lineTo(steer * 2 + 10 * carScale, (18 + nitroLen * 0.6) * carScale);
        ctx.lineTo(steer * 2 + 12 * carScale, 18 * carScale);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // 12. Progressive Damage Smoke & Blazing Engine Fire ("ยิ่งใกล้พังยิ่งมีควันเยอะขึ้น", "รถไฟไหม้ และหยุดทำงาน")
      if (engine.isEngineOnFire) {
        // Enormous roaring fire flames leaping from engine cover and sidepods
        ctx.save();
        // Layered translucent glowing ellipse under fire instead of expensive shadowBlur
        ctx.fillStyle = 'rgba(249, 115, 22, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 0, 48 * carScale, 26 * carScale, 0, 0, Math.PI * 2);
        ctx.fill();
        const fireH = (58 + Math.sin(timestamp * 0.05) * 26) * carScale;
        const flames = [
          { x: -32 * carScale, yOff: 14 * carScale, h: fireH * 0.85, w: 24 * carScale, col: '#ef4444' },
          { x: 32 * carScale, yOff: 14 * carScale, h: fireH * 0.85, w: 24 * carScale, col: '#ef4444' },
          { x: 0, yOff: -18 * carScale, h: fireH * 1.35, w: 34 * carScale, col: '#f97316' },
          { x: Math.sin(timestamp * 0.06) * 10 * carScale, yOff: -16 * carScale, h: fireH * 0.95, w: 22 * carScale, col: '#fde047' },
          { x: (Math.sin(timestamp * 0.04) * 8 - 6) * carScale, yOff: 6 * carScale, h: fireH * 0.85, w: 18 * carScale, col: '#ffffff' },
        ];
        for (let fi = 0; fi < flames.length; fi++) {
          const f = flames[fi];
          ctx.fillStyle = f.col;
          ctx.beginPath();
          ctx.moveTo(f.x - f.w / 2, f.yOff);
          ctx.quadraticCurveTo(f.x + (Math.random() - 0.5) * 14 * carScale, f.yOff - f.h * 0.6, f.x, f.yOff - f.h);
          ctx.quadraticCurveTo(f.x + (Math.random() - 0.5) * 14 * carScale, f.yOff - f.h * 0.6, f.x + f.w / 2, f.yOff);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Thick dense black smoke plume billowing up from burning chassis
        for (let s = 0; s < 6; s++) {
          const sPhase = (timestamp * 0.0035 + s * 0.16) % 1;
          const sRad = (24 + sPhase * 48) * carScale;
          const sY = (-35 - sPhase * 105) * carScale;
          const sX = ((s % 2 === 0 ? 1 : -1) * sPhase * 36 + Math.sin(timestamp * 0.02 + s) * 12) * carScale;
          ctx.fillStyle = `rgba(15, 23, 42, ${0.94 * (1 - sPhase)})`;
          ctx.beginPath();
          ctx.arc(sX, sY, sRad, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (engine.carHealth < (PLAYER_MAX_HEALTH * 0.75)) {
        // "ยิ่งใกล้พังยิ่งมีควันเยอะขึ้น" (Progression: 75% light smoke -> 50% dark smoke -> 25% heavy black smoke + sparks)
        const pHealth = engine.carHealth;
        const pHealthPct = (pHealth / PLAYER_MAX_HEALTH) * 100;
        const puffCount = pHealthPct < 25 ? 6 : pHealthPct < 50 ? 4 : 2;
        const smokeDarkness = pHealthPct < 25 ? '15, 23, 42' : pHealthPct < 50 ? '30, 41, 59' : '100, 116, 139';
        const smokeOpacity = pHealthPct < 25 ? 0.90 : pHealthPct < 50 ? 0.75 : 0.55;

        for (let s = 0; s < puffCount; s++) {
          const sPhase = (timestamp * 0.003 + s * (1 / puffCount)) % 1;
          const sRad = ((pHealthPct < 25 ? 18 : 12) + sPhase * (pHealthPct < 25 ? 36 : 24)) * carScale;
          const sY = (-18 - sPhase * (pHealthPct < 25 ? 75 : 48)) * carScale;
          const sX = ((s % 2 === 0 ? 1 : -1) * sPhase * 24 + Math.sin(timestamp * 0.015 + s) * 6) * carScale;
          ctx.fillStyle = `rgba(${smokeDarkness}, ${smokeOpacity * (1 - sPhase)})`;
          ctx.beginPath();
          ctx.arc(sX, sY, sRad, 0, Math.PI * 2);
          ctx.fill();
        }

        // Fiery ember sparks for heavily damaged car (< 30% health)
        if (pHealthPct < 30 && Math.random() < 0.45) {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc((Math.random() - 0.5) * 36 * carScale, (-22 - Math.random() * 35) * carScale, 3 * carScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // =======================================================================
      // 7. FULL-SCREEN DYNAMIC RAIN CANVAS OVERLAY ("เพิ่มระบบสุ่มฝน กลางlap")
      // =======================================================================
      if (engine.isRaining) {
        const rIntensity = engine.rainIntensity;
        // Atmospheric storm rain tint
        ctx.fillStyle = `rgba(15, 23, 42, ${0.16 * rIntensity})`;
        ctx.fillRect(0, 0, width, height);

        // Falling diagonal translucent rain streaks
        ctx.save();
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.55)';
        ctx.lineWidth = 1.35;
        const rainTurnDrift = (engine.lateralVx * 14);
        ctx.beginPath();
        for (let rIdx = 0; rIdx < engine.rainDrops.length; rIdx++) {
          const drop = engine.rainDrops[rIdx];
          drop.y += drop.speed * dt;
          drop.x += (Math.sin(timestamp * 0.001) * 28 - rainTurnDrift) * dt;

          if (drop.y > height) {
            drop.y = -drop.len;
            drop.x = Math.random() * width;
          }
          if (drop.x < 0) drop.x = width;
          if (drop.x > width) drop.x = 0;

          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 3, drop.y + drop.len);
        }
        ctx.stroke();

        // Asphalt water ripple splashes on ground
        ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
        for (let sp = 0; sp < 12; sp++) {
          if (Math.random() < 0.35) {
            const rx = Math.random() * width;
            const ry = height / 2 + Math.random() * (height / 2);
            ctx.beginPath();
            ctx.ellipse(rx, ry, 4 + Math.random() * 6, 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [racePhase, activeGp, maxSpeed, accelRate, brakeRate, handlingRate, targetLapSeconds]);

  // Format Milliseconds to MM:SS.mmm
  const formatLapTime = (ms: number) => {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const millis = Math.floor((ms % 1000));
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis
      .toString()
      .padStart(3, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onClick={() => {
        sound.resumeAudio();
        sound.startOutRunEngine();
      }}
      className={`select-none font-racing outline-none transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen bg-black rounded-none border-0 overflow-hidden'
          : 'relative w-full h-[74vh] min-h-[580px] max-h-[840px] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl focus:ring-2 focus:ring-red-500/50'
      }`}
    >
      {/* 60FPS High-Res Raster Canvas */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full object-cover block"
      />

      {/* ======================================================================= */}
      {/* RETRO ARCADE HUD OVERLAYS (MATCHING USER REFERENCE UI)                   */}
      {/* ======================================================================= */}

      {/* 1. TOP-LEFT: MEMOIZED ARCADE RANK & TIME DISPLAY */}
      <HudRankTime
        pos={hudEstimatedPos}
        currentLapTime={hudCurrentLapTime}
        rivalAhead={hudRivalAhead}
        rivalBehind={hudRivalBehind}
        primaryColor={teamState.primaryColor || '#dc2626'}
      />

      {/* 2. TOP-CENTER CORRIDOR: CURVE WARNING, PIT DISTANCE, FLAT TIRE & SLIPPING ALERTS */}
      <HudCenterWarnings
        turnWarning={hudTurnWarning}
        showPitWindowPrompt={showPitWindowPrompt}
        pitDistanceM={pitDistanceM}
        tireBlown={engineStateRef.current.tireBlown}
        isAquaplaning={hudIsAquaplaning}
      />

      {/* 3. TOP-RIGHT: SETTINGS GEAR BUTTON, CIRCUIT RADAR MAP & CENTRAL ALERT QUEUE */}
      <div className="absolute top-2.5 right-3 sm:top-3 sm:right-4 z-20 flex flex-col items-end gap-2 select-none max-w-[28%] pointer-events-none">
        {/* Unified Top-Right Actions: Single Settings Gear Button & Exit Button */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Single Settings / Quick Menu Button (Opens modal containing Fullscreen, Sound, BGM, Track, Rain, Rivals) */}
          <button
            onClick={() => setShowSettingsMenu((prev) => !prev)}
            className="p-2 rounded-xl bg-black/70 hover:bg-black/90 border border-slate-700/80 text-slate-300 hover:text-white transition cursor-pointer shadow-lg active:scale-95 flex items-center justify-center"
            title="Race Settings & Quick Menu (เมนูตั้งค่า: เสียง เพลง สภาพอากาศ ข้อมูลคู่แข่ง เต็มจอ)"
          >
            <Settings className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => {
              if (isFullscreen && document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
              }
              sound.stopOutRunEngine();
              sound.stopRaceMusic();
              onExit();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white font-mono uppercase tracking-wider transition cursor-pointer shadow-lg active:scale-95"
          >
            PITS
          </button>
        </div>

        {/* Memoized Circuit Radar Mini-Map */}
        <HudRadarMap
          circuitName={activeGp.circuitName || activeGp.name}
          country={activeGp.country || activeGp.flag}
          flag={activeGp.flag}
          miniMapSvgPath={miniMapSvgPath}
          miniMapStartFinish={miniMapStartFinish}
          aiPositions={hudAiPositions}
          playerMapPos={hudPlayerMapPos}
          playerHasPitted={playerHasPitted}
          lap={hudLap}
          totalLaps={lapsCount}
          pos={hudEstimatedPos}
        />

        {/* Unified Central Alert Queue (Max 2 simultaneous items, Priority sorted, Auto-dismiss 2.5s) */}
        <HudAlertQueue alerts={alertQueue} />
      </div>

      {/* 4. BOTTOM-RIGHT: MEMOIZED SPEEDOMETER & SECONDARY TELEMETRY GAUGES */}
      {racePhase !== 'finished' && (
        <HudSpeedometer
          speed={hudSpeed}
          gear={hudGear}
          rpm={hudRpm}
          nitroFuel={hudNitroFuel}
          nitroDepleted={hudNitroDepleted}
          drsActive={hudDrsActive}
          tireBlown={engineStateRef.current.tireBlown}
          carHealth={hudCarHealth}
          isEngineOnFire={isEngineOnFire}
          isRaining={hudIsRaining}
          hasWetTires={hudHasWetTires}
          boostPadActive={hudBoostPadActive}
          isAquaplaning={hudIsAquaplaning}
        />
      )}

      {/* 4.5. BOTTOM-LEFT: DEBUG OVERLAY (?debug=1) (ข้อ 9) */}
      {typeof window !== 'undefined' && window.location.search.includes('debug=1') && racePhase !== 'finished' && (
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-30 pointer-events-none bg-black/85 border border-red-500/60 p-2 rounded-lg text-[9px] font-mono text-white shadow-xl space-y-0.5 select-none">
          <div className="text-red-400 font-bold tracking-wider">🛠️ AI RUBBER-BAND DEBUG</div>
          <div>HEAT: <span className="text-amber-300 font-bold">{(engineStateRef.current.heat ?? 0).toFixed(2)}</span> / 1.00 (x{AI_DIFFICULTY.cheatLevel === 2 ? '1.5' : AI_DIFFICULTY.cheatLevel === 0 ? '0' : '1.0'})</div>
          <div>PLAYER POS: <span className="text-cyan-300 font-bold">P{hudEstimatedPos}</span></div>
          <div>TOP AI CHEAT: <span className="text-emerald-400 font-bold">+{Math.round(engineStateRef.current.debugClosestAiCheatBonus ?? 0)} KM/H</span></div>
        </div>
      )}

      {/* 5A. BOTTOM-LEFT: MOBILE STEERING CONTROLS (ปุ่มเลี้ยวอยู่ซ้าย) */}
      {racePhase !== 'finished' && (
        <div className="touch-controls-coarse absolute bottom-8 left-2 sm:bottom-10 sm:left-4 z-30 flex items-center gap-2 pointer-events-auto touch-none select-none">
          {/* Turn Left Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              sound.resumeAudio();
              if (engineStateRef.current.pitState === 'servicing') {
                handlePitQteInput('LEFT');
                return;
              }
              keysRef.current.left = true;
            }}
            onPointerUp={(e) => { e.preventDefault(); keysRef.current.left = false; }}
            onPointerLeave={(e) => { e.preventDefault(); keysRef.current.left = false; }}
            onPointerCancel={(e) => { e.preventDefault(); keysRef.current.left = false; }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/80 hover:bg-black/90 active:bg-red-600 border-2 border-slate-600/90 active:border-red-400 flex flex-col items-center justify-center text-white transition-transform active:scale-90 shadow-2xl backdrop-blur-md cursor-pointer select-none touch-none"
            aria-label="Steer Left"
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            <span className="text-[8px] font-mono font-bold tracking-wider -mt-1 text-slate-300">LEFT</span>
          </button>

          {/* Turn Right Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              sound.resumeAudio();
              if (engineStateRef.current.pitState === 'servicing') {
                handlePitQteInput('RIGHT');
                return;
              }
              keysRef.current.right = true;
            }}
            onPointerUp={(e) => { e.preventDefault(); keysRef.current.right = false; }}
            onPointerLeave={(e) => { e.preventDefault(); keysRef.current.right = false; }}
            onPointerCancel={(e) => { e.preventDefault(); keysRef.current.right = false; }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/80 hover:bg-black/90 active:bg-red-600 border-2 border-slate-600/90 active:border-red-400 flex flex-col items-center justify-center text-white transition-transform active:scale-90 shadow-2xl backdrop-blur-md cursor-pointer select-none touch-none"
            aria-label="Steer Right"
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3]" />
            <span className="text-[8px] font-mono font-bold tracking-wider -mt-1 text-slate-300">RIGHT</span>
          </button>
        </div>
      )}

      {/* 5B. BOTTOM-RIGHT: MOBILE GAS, NITRO & BRAKE CONTROLS (ปุ่ม Gas/nitro อยู่ด้านขวา) */}
      {racePhase !== 'finished' && (
        <div className="touch-controls-coarse absolute bottom-8 right-2 sm:bottom-10 sm:right-4 z-30 flex items-end gap-2 pointer-events-auto touch-none select-none">
          {/* Secondary Stack: NITRO (up) and BRAKE (down) */}
          <div className="flex flex-col gap-1.5 items-center">
            {/* Turbo Nitro Boost Button */}
            <button
              type="button"
              disabled={hudNitroDepleted}
              onPointerDown={(e) => {
                e.preventDefault();
                if (hudNitroDepleted) return;
                sound.resumeAudio();
                keysRef.current.drs = true;
              }}
              onPointerUp={(e) => { e.preventDefault(); keysRef.current.drs = false; }}
              onPointerLeave={(e) => { e.preventDefault(); keysRef.current.drs = false; }}
              onPointerCancel={(e) => { e.preventDefault(); keysRef.current.drs = false; }}
              className={`w-13 h-12 sm:w-15 sm:h-14 rounded-2xl border-2 flex flex-col items-center justify-center py-0.5 transition-transform active:scale-90 shadow-xl font-bold backdrop-blur-md cursor-pointer select-none touch-none ${
                hudNitroDepleted
                  ? 'bg-black/80 text-amber-400 border-amber-600/50 cursor-not-allowed opacity-80'
                  : hudDrsActive
                  ? 'bg-gradient-to-t from-cyan-600 to-cyan-400 text-white border-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.9)] animate-pulse'
                  : 'bg-black/80 hover:bg-black/95 text-cyan-300 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
              }`}
              aria-label="Nitro Boost"
            >
              <Zap className="w-5 h-5 text-cyan-300 fill-cyan-300/40" />
              <span className="text-[8px] font-mono font-black -mt-0.5">
                {hudNitroDepleted ? 'LOCK' : 'NITRO'}
              </span>
            </button>

            {/* Brake Pedal Button */}
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                sound.resumeAudio();
                if (engineStateRef.current.pitState === 'servicing') {
                  handlePitQteInput('DOWN');
                  return;
                }
                keysRef.current.down = true;
              }}
              onPointerUp={(e) => { e.preventDefault(); keysRef.current.down = false; }}
              onPointerLeave={(e) => { e.preventDefault(); keysRef.current.down = false; }}
              onPointerCancel={(e) => { e.preventDefault(); keysRef.current.down = false; }}
              className="w-13 h-12 sm:w-15 sm:h-14 rounded-2xl bg-black/80 hover:bg-black/90 active:bg-amber-600 border-2 border-amber-600/70 active:border-amber-400 flex flex-col items-center justify-center text-amber-300 transition-transform active:scale-90 shadow-xl backdrop-blur-md cursor-pointer select-none touch-none"
              aria-label="Brake"
            >
              <ArrowDown className="w-4 h-4 stroke-[3]" />
              <span className="text-[8px] font-mono font-bold tracking-wider -mt-0.5">BRAKE</span>
            </button>
          </div>

          {/* Primary Dominant Pedal: GAS (Accelerate) */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              sound.resumeAudio();
              if (engineStateRef.current.pitState === 'servicing') {
                handlePitQteInput('UP');
                return;
              }
              keysRef.current.up = true;
            }}
            onPointerUp={(e) => { e.preventDefault(); keysRef.current.up = false; }}
            onPointerLeave={(e) => { e.preventDefault(); keysRef.current.up = false; }}
            onPointerCancel={(e) => { e.preventDefault(); keysRef.current.up = false; }}
            className="w-16 h-25 sm:w-19 sm:h-29 rounded-2xl bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 active:from-emerald-500 active:to-emerald-300 border-2 border-emerald-300/90 flex flex-col items-center justify-center text-white transition-transform active:scale-95 shadow-[0_0_25px_rgba(16,185,129,0.55)] cursor-pointer select-none touch-none"
            aria-label="Accelerate Gas Pedal"
          >
            <ArrowUp className="w-7 h-7 sm:w-8 sm:h-8 stroke-[3.5] drop-shadow-md" />
            <span className="text-xs sm:text-sm font-mono font-black tracking-widest mt-0.5">GAS</span>
            <span className="text-[7.5px] font-mono text-emerald-200/90 tracking-tighter">คันเร่ง</span>
          </button>
        </div>
      )}

      {/* 6. BOTTOM DOCKED PROGRESS BAR (MEMOIZED) */}
      {racePhase !== 'finished' && (
        <HudProgressBar
          lap={hudLap}
          lapsCount={lapsCount}
          playerProgress={hudPlayerProgress}
          aiPositions={hudAiPositions}
        />
      )}

      {/* 7. SETTINGS & QUICK MENU MODAL (Triggered by the single Gear icon in top-right) */}
      {showSettingsMenu && (
        <div className="absolute inset-0 z-50 bg-black/75 flex items-center justify-center p-4 select-none">
          <div className="relative w-full max-w-sm bg-[#0b0f19] border border-slate-700 rounded-2xl shadow-2xl p-4 text-white font-racing space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase text-white">RACE SETTINGS</h3>
              </div>
              <button
                onClick={() => setShowSettingsMenu(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {/* Fullscreen */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">FULLSCREEN</span>
                <button
                  onClick={toggleFullscreen}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 cursor-pointer"
                >
                  {isFullscreen ? 'EXIT FS' : 'ENABLE'}
                </button>
              </div>

              {/* Master Sound */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">MASTER AUDIO</span>
                <button
                  onClick={() => {
                    const muted = sound.toggleMute();
                    setIsMuted(muted);
                  }}
                  className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${
                    isMuted ? 'bg-red-950/70 border-red-500/60 text-red-300' : 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                  }`}
                >
                  {isMuted ? 'MUTED' : 'UNMUTED'}
                </button>
              </div>

              {/* BGM Music */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">RACE MUSIC (BGM)</span>
                <button
                  onClick={() => {
                    const active = sound.toggleRaceMusic();
                    setIsMusicOn(active);
                  }}
                  className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${
                    isMusicOn && !isMuted ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {isMusicOn && !isMuted ? 'MUSIC ON' : 'MUSIC OFF'}
                </button>
              </div>

              {/* Track Selector */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">BGM TRACK</span>
                <button
                  onClick={() => {
                    const next = sound.toggleNextTrack();
                    setCurrentTrackInfo(next);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-900/70 hover:bg-indigo-800 border border-indigo-500/60 text-indigo-200 font-bold cursor-pointer"
                >
                  TRK {currentTrackInfo.id}: {currentTrackInfo.id === 2 ? 'Shanghai Alice' : 'Neon Apex'}
                </button>
              </div>

              {/* Hidden Rain Toggle (Requirement 4: ซ่อนปุ่มสลับฝนไว้ในเมนูนั้น) */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">WEATHER SIMULATION</span>
                <button
                  onClick={toggleRain}
                  className={`px-2.5 py-1 rounded-lg border font-bold cursor-pointer ${
                    hudIsRaining ? 'bg-sky-950/80 border-sky-400 text-sky-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {hudIsRaining ? '🌧️ RAIN (ON)' : '☀️ DRY (OFF)'}
                </button>
              </div>

              {/* Rivals Intel */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-300">RIVALS DOSSIER</span>
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    setShowRivalsIntelModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-500/60 text-amber-300 font-bold cursor-pointer"
                >
                  🦁 INTEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Right Turn Chevron Prompt when approaching pit ("สัญญาณเตือนลูกศรสีแดง") */}
      {showPitWindowPrompt && racePhase === 'racing' && (
        <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center gap-1 animate-pulse max-w-[85vw]">
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-2xl border-2 border-yellow-300 shadow-[0_0_35px_rgba(239,68,68,0.9)] flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black font-racing animate-bounce leading-none">▶▶▶</span>
            <span className="text-xs sm:text-sm font-racing font-black tracking-wider uppercase mt-0.5">PIT ENTRY</span>
            <span className="text-[10px] sm:text-xs font-mono font-black text-yellow-300">
              {pitDistanceM !== null ? `${pitDistanceM}M • ` : '500M • '}เลี้ยวขวาเข้า PIT
            </span>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* INTERACTIVE PIT STOP QUICK TIME EVENT (QTE) OVERLAY                      */}
      {/* "โดยความเร็วในการเปลี่ยน pits จะขึ้นอยู่กับ pits ที่ผู้เล่นจ้างมา           */}
      {/* และมี quick time movement ให้กด wasd ลูกศร เช่น ซ้าย ขวา หน้า หลัง ยิ่งกดเร็ว ยิ่งได้ออก pits เร็ว" */}
      {/* "แล้วก็ทำให้ quick event มีลูกศรที่ชัดเจนขึ้น"                            */}
      {/* ======================================================================= */}
      {pitQteActive && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm select-none p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div
            className={`relative w-full max-w-sm sm:max-w-md max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#111827] via-[#0f172a] to-[#030712] border-2 ${
              pitQteLockout
                ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.75)]'
                : 'border-amber-500/80 shadow-[0_0_40px_rgba(245,158,11,0.55)]'
            } rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-white font-racing space-y-2 sm:space-y-2.5 my-auto`}
          >
            {/* Header: Pit Crew identity and live stopwatch */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-inner">
                  <span className="text-base sm:text-lg">🔧</span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black uppercase text-white tracking-wide leading-tight">
                    MANDATORY PIT STOP
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    Crew: <span className="text-amber-400 font-bold">{teamState.pitCrew?.name || 'Pro Pit Crew'}</span> ({pitCrewSkill} OVR)
                  </p>
                </div>
              </div>

              {/* Live Stopwatch & Completed Count */}
              <div className="text-right">
                <div className="text-lg sm:text-xl font-black font-mono text-amber-400 tracking-tight">
                  ⏱️ {pitQteElapsed.toFixed(2)}s
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  เสร็จแล้ว {pitQteIndex}/{pitQteSequence.length} ลูกศร
                </div>
              </div>
            </div>

            {/* Combined Single Compact QTE Directive Strip */}
            <div className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-amber-950/70 border border-amber-500/60 text-[10px] font-mono shadow-sm">
              <div className="flex items-center gap-1.5 text-amber-200 truncate">
                <span className="text-amber-400 font-bold">⚡ QTE:</span>
                <span className="truncate">กดลูกศร/WASD ให้ครบเพื่อปล่อยรถออก PIT</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-300 font-bold shrink-0 ml-2">
                <span>{pitQteSequence.length} ลูกศร</span>
              </div>
            </div>

            {/* Dynamic Arrow Stations Grid (Compact Pills) */}
            <div className={`grid gap-1.5 ${
              pitQteSequence.length <= 4
                ? 'grid-cols-2 sm:grid-cols-4'
                : pitQteSequence.length <= 6
                ? 'grid-cols-3'
                : 'grid-cols-4'
            }`}>
              {pitQteSequence.map((reqDir, sIdx) => {
                const isDone = sIdx < pitQteIndex;
                const isActive = sIdx === pitQteIndex;
                const task = PIT_STOP_TASKS[sIdx] || { th: `ขั้นตอนที่ ${sIdx + 1}` };

                const dirMeta =
                  reqDir === 'UP'
                    ? { nameTh: 'หน้า', keys: 'W/↑', color: 'text-cyan-300', bgActive: 'border-cyan-400 bg-cyan-950/90 shadow-[0_0_15px_rgba(6,182,212,0.6)]' }
                    : reqDir === 'DOWN'
                    ? { nameTh: 'หลัง', keys: 'S/↓', color: 'text-amber-300', bgActive: 'border-amber-400 bg-amber-950/90 shadow-[0_0_15px_rgba(245,158,11,0.6)]' }
                    : reqDir === 'LEFT'
                    ? { nameTh: 'ซ้าย', keys: 'A/←', color: 'text-purple-300', bgActive: 'border-purple-400 bg-purple-950/90 shadow-[0_0_15px_rgba(168,85,247,0.6)]' }
                    : { nameTh: 'ขวา', keys: 'D/→', color: 'text-rose-300', bgActive: 'border-rose-400 bg-rose-950/90 shadow-[0_0_15px_rgba(244,63,94,0.6)]' };

                return (
                  <div
                    key={sIdx}
                    className={`p-1.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : isActive
                        ? `${dirMeta.bgActive} text-white ring-1 ring-white/80 animate-pulse scale-[1.01]`
                        : 'bg-slate-900/70 border-slate-700/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono leading-none">
                      <span className="font-bold truncate max-w-[70px] sm:max-w-none">{task.th}</span>
                      {isDone ? (
                        <span className="text-emerald-400 font-bold">✓</span>
                      ) : isActive ? (
                        <span className="text-amber-300 font-bold animate-bounce text-[9px]">⚡</span>
                      ) : (
                        <span className="text-slate-500 text-[8px]">#{sIdx + 1}</span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center justify-center gap-1 py-0.5 rounded-lg bg-black/60 border border-slate-800">
                      {isDone ? (
                        <span className="text-[10px] font-bold text-emerald-300 font-mono">
                          ✓ SECURED
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className={`w-3.5 h-3.5 flex items-center justify-center ${dirMeta.color}`}>
                            {reqDir === 'UP' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <polyline points="5 11 12 4 19 11" />
                              </svg>
                            )}
                            {reqDir === 'DOWN' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="4" x2="12" y2="20" />
                                <polyline points="19 13 12 20 5 13" />
                              </svg>
                            )}
                            {reqDir === 'LEFT' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="20" y1="12" x2="4" y2="12" />
                                <polyline points="11 19 4 12 11 5" />
                              </svg>
                            )}
                            {reqDir === 'RIGHT' && (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <polyline points="13 5 20 12 13 19" />
                              </svg>
                            )}
                          </div>
                          <span className="text-[10px] font-black font-mono tracking-wider">
                            {dirMeta.nameTh} ({dirMeta.keys})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current Active Big Prompt Display with Crystal-Clear Arrow */}
            {!pitQteComplete ? (
              <div className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-slate-900/95 border-2 ${
                pitQteLockout
                  ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)]'
                  : 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
              }`}>
                <span className={`text-[10px] font-mono uppercase font-bold mb-0.5 tracking-wider ${
                  pitQteLockout ? 'text-red-400' : 'text-amber-300'
                }`}>
                  CURRENT PROMPT (กดปุ่มนี้ทันที!)
                </span>
                
                {(() => {
                  const curDir = pitQteSequence[pitQteIndex];
                  const curMeta =
                    curDir === 'UP'
                      ? { nameTh: 'ชี้ขึ้น (หน้า)', keyChar: 'W', arrowSymbol: '↑', color: 'text-cyan-400', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.8)] border-cyan-400' }
                      : curDir === 'DOWN'
                      ? { nameTh: 'ชี้ลง (หลัง)', keyChar: 'S', arrowSymbol: '↓', color: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.8)] border-amber-400' }
                      : curDir === 'LEFT'
                      ? { nameTh: 'ชี้ซ้าย', keyChar: 'A', arrowSymbol: '←', color: 'text-purple-400', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.8)] border-purple-400' }
                      : { nameTh: 'ชี้ขวา', keyChar: 'D', arrowSymbol: '→', color: 'text-rose-400', glow: 'shadow-[0_0_20px_rgba(244,63,94,0.8)] border-rose-400' };

                  return (
                    <div className="flex items-center gap-3 sm:gap-4 mt-0.5">
                      {/* Clear Glowing Direction Arrow */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black/70 border-2 ${
                        pitQteLockout
                          ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                          : curMeta.glow
                      } flex items-center justify-center animate-pulse`}>
                        {curDir === 'UP' && (
                          <svg className="w-8 h-8 sm:w-9 sm:h-9 text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.9)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <polyline points="5 11 12 4 19 11" />
                          </svg>
                        )}
                        {curDir === 'DOWN' && (
                          <svg className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="4" x2="12" y2="20" />
                            <polyline points="19 13 12 20 5 13" />
                          </svg>
                        )}
                        {curDir === 'LEFT' && (
                          <svg className="w-8 h-8 sm:w-9 sm:h-9 text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.9)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="20" y1="12" x2="4" y2="12" />
                            <polyline points="11 19 4 12 11 5" />
                          </svg>
                        )}
                        {curDir === 'RIGHT' && (
                          <svg className="w-8 h-8 sm:w-9 sm:h-9 text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <polyline points="13 5 20 12 13 19" />
                          </svg>
                        )}
                      </div>

                      {/* Prominent Dual Keycaps */}
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5">
                          <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-300 text-white font-mono font-black text-lg sm:text-xl shadow-[0_2px_0_#334155]">
                            {curMeta.keyChar}
                          </div>
                          <span className="text-slate-400 font-mono text-[10px] font-bold uppercase">หรือ</span>
                          <div className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-300 text-white font-mono font-black text-lg sm:text-xl shadow-[0_2px_0_#334155]">
                            {curMeta.arrowSymbol}
                          </div>
                        </div>
                        <span className={`text-[11px] sm:text-xs font-racing font-black tracking-wider mt-0.5 ${curMeta.color}`}>
                          {curMeta.nameTh} / {curDir}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 animate-bounce">
                <span className="text-sm sm:text-base font-black text-emerald-300">
                  ⚡ ALL {pitQteSequence.length} TASKS COMPLETED! LOLLIPOP UP: GO GO GO!
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  Record pit stop completed in {pitQteElapsed.toFixed(2)}s! Launching...
                </span>
              </div>
            )}

            {/* Tactile On-Screen Clickable / Touch Buttons for WASD */}
            <div className="flex items-center justify-center gap-1.5 pt-0.5 pointer-events-auto">
              <button
                onClick={() => handlePitQteInput('LEFT')}
                className="flex-1 py-1.5 sm:py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-purple-600 border border-purple-400/60 text-xs font-bold transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="20" y1="12" x2="4" y2="12" />
                  <polyline points="11 19 4 12 11 5" />
                </svg>
                <span>ซ้าย (A)</span>
              </button>
              <button
                onClick={() => handlePitQteInput('UP')}
                className="flex-1 py-1.5 sm:py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 border border-cyan-400/60 text-xs font-bold transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <polyline points="5 11 12 4 19 11" />
                </svg>
                <span>หน้า (W)</span>
              </button>
              <button
                onClick={() => handlePitQteInput('DOWN')}
                className="flex-1 py-1.5 sm:py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-600 border border-amber-400/60 text-xs font-bold transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="4" x2="12" y2="20" />
                  <polyline points="19 13 12 20 5 13" />
                </svg>
                <span>หลัง (S)</span>
              </button>
              <button
                onClick={() => handlePitQteInput('RIGHT')}
                className="flex-1 py-1.5 sm:py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-rose-600 border border-rose-400/60 text-xs font-bold transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1"
              >
                <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <polyline points="13 5 20 12 13 19" />
                </svg>
                <span>ขวา (D)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* STARTING GANTRY OVERHEAD RIG (โครงเหล็กสะพานไฟสัญญาณด้านบน ไม่มีสีดำทึบบังหน้า) */}
      {/* Tween slide-up when race starts ("เมื่อเริ่มไป ให้ tween ไฟสัญญาณออกตัวออกไปจากหน้าจอ") */}
      {/* ======================================================================= */}
      {gantryMounted && (
        <div
          className={`absolute top-0 left-0 right-0 z-30 flex flex-col items-center pointer-events-none select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            gantryExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          {/* Real Industrial Overhead Steel Gantry clamped to the top edge of screen */}
          <div className="relative flex flex-col items-center">
            {/* 1. Heavy Steel Vertical Support Struts / Mounting I-Beams to screen top */}
            <div className="flex items-center justify-between w-full max-w-[360px] sm:max-w-[460px] px-8">
              <div className="flex flex-col items-center">
                <div className="w-3.5 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-neutral-700 via-neutral-400 to-neutral-800 border-x border-b border-neutral-900 shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />
                </div>
                <div className="w-2.5 h-2 bg-neutral-700 border-x border-neutral-900" />
              </div>

              <div className="flex flex-col items-center">
                <div className="w-3.5 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-neutral-700 via-neutral-400 to-neutral-800 border-x border-b border-neutral-900 shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />
                </div>
                <div className="w-2.5 h-2 bg-neutral-700 border-x border-neutral-900" />
              </div>
            </div>

            {/* 2. Main Overhead Steel Truss Gantry Beam (โครงเหล็กสะพานใหญ่ พาดขวางขอบบน) */}
            <div className="relative flex items-center justify-between gap-4 px-4 sm:px-8 py-1.5 sm:py-2 bg-gradient-to-b from-[#2e3440] via-[#1a1f29] to-[#0d1017] border-b-2 border-x-2 border-neutral-500 rounded-b-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] min-w-[310px] sm:min-w-[460px]">
              {/* Left Hazard Stripes & Bolts */}
              <div className="flex items-center gap-2">
                <div className="w-4 sm:w-6 h-3 rounded-sm bg-[repeating-linear-gradient(45deg,#eab308,#eab308_4px,#18181b_4px,#18181b_8px)] border border-neutral-700 shadow-inner" />
                <div className="hidden sm:flex flex-col gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 border border-neutral-900" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 border border-neutral-900" />
                </div>
              </div>

              {/* Center Gantry Identity */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] sm:text-xs font-mono font-black uppercase tracking-widest text-slate-200 drop-shadow">
                  START GANTRY • FIA SYSTEM
                </span>
              </div>

              {/* Right Hazard Stripes & Bolts */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 border border-neutral-900" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 border border-neutral-900" />
                </div>
                <div className="w-4 sm:w-6 h-3 rounded-sm bg-[repeating-linear-gradient(-45deg,#eab308,#eab308_4px,#18181b_4px,#18181b_8px)] border border-neutral-700 shadow-inner" />
              </div>
            </div>

            {/* 3. Five Hanging Vertical Metal Light Pods (ไฟสัญญาณ 5 ช่อง พร้อมขายึดเหล็ก) */}
            <div className="relative -mt-0.5 flex items-center justify-center gap-2 sm:gap-3 px-3.5 sm:px-6 py-2 bg-gradient-to-b from-[#141822] via-[#0b0e14] to-[#04060a] border-2 border-neutral-700 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.95)]">
              {[1, 2, 3, 4, 5].map((lightIdx) => {
                const isLit = countdownLights >= lightIdx && countdownLights < 6;
                const isAllGreen = countdownLights === 6;
                return (
                  <div key={lightIdx} className="flex flex-col items-center">
                    {/* Steel hanging clamp */}
                    <div className="w-2 h-1.5 bg-neutral-500 rounded-t-sm border-x border-t border-neutral-800" />

                    {/* Light Pod Shroud/Housing */}
                    <div className="flex flex-col items-center gap-1.5 p-1 sm:p-1.5 bg-[#080a0f] rounded-lg border border-neutral-700/80 shadow-inner">
                      {/* Top Lamp */}
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-100 ${
                          isAllGreen
                            ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] ring-2 ring-emerald-300'
                            : isLit
                            ? 'bg-red-600 shadow-[0_0_24px_rgba(239,68,68,1)] ring-2 ring-red-400'
                            : 'bg-red-950/25 border border-neutral-800/80'
                        }`}
                      />
                      {/* Bottom Lamp */}
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-100 ${
                          isAllGreen
                            ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)] ring-2 ring-emerald-300'
                            : isLit
                            ? 'bg-red-600 shadow-[0_0_24px_rgba(239,68,68,1)] ring-2 ring-red-400'
                            : 'bg-red-950/25 border border-neutral-800/80'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4. Compact Digital Race Status Banner Hanging Below Pods */}
            <div className="mt-1 px-4 py-1 rounded-full bg-black/70 border border-neutral-700 shadow-xl flex items-center gap-2">
              <span
                className={`text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider ${
                  countdownLights === 6
                    ? 'text-emerald-400 animate-bounce'
                    : 'text-amber-400'
                }`}
              >
                {countdownLights === 6 ? '⚡ LIGHTS OUT AND AWAY WE GO! ⚡' : 'REV ENGINES & HOLD READY'}
              </span>
            </div>

            {/* 5. Stage Objectives Banner (ข้อ 5: แสดงใน HUD ก่อนออกตัว) */}
            {countdownLights < 6 && stageObjectives.length > 0 && (
              <div className="mt-2 p-2 px-3 rounded-xl bg-black/85 border border-amber-500/40 shadow-xl flex items-center gap-3 font-mono text-[11px] max-w-[92vw]">
                <div className="flex items-center gap-1 text-amber-400 font-bold uppercase shrink-0">
                  <span>🎯</span>
                  <span>เป้าหมายโบนัส:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-slate-200">
                  {stageObjectives.map((obj, oIdx) => (
                    <span key={oIdx} className="bg-neutral-900/90 px-2 py-0.5 rounded border border-neutral-700 flex items-center gap-1">
                      <span>{obj.icon}</span>
                      <span>{obj.titleTh}</span>
                      <strong className="text-emerald-400 font-bold">+{formatMoney(obj.rewardMoney)}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* PAUSE OVERLAY                                                           */}
      {/* ======================================================================= */}
      {racePhase === 'paused' && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30">
          <div className="bg-[#10151f] p-6 rounded-2xl border border-slate-700 shadow-2xl max-w-sm w-full text-center space-y-4">
            <h3 className="text-2xl font-black uppercase text-white tracking-wide">
              RACE PAUSED
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Press RESUME to continue or return to pit lane.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setRacePhase('racing');
                  sound.startOutRunEngine();
                  engineStateRef.current.lastFrameTime = performance.now();
                }}
                className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-sm uppercase rounded-xl transition cursor-pointer"
              >
                RESUME RACE
              </button>

              <button
                onClick={() => {
                  sound.stopOutRunEngine();
                  onExit();
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-racing font-bold text-sm uppercase rounded-xl transition cursor-pointer"
              >
                RETIRE TO PITS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. RACE COMPLETE CELEBRATION / RESULTS OVERLAY                          */}
      {/* NO DARK TINT OVERLAY (ไม่มีสีดำทึบ), DOCKED AS SLEEK SIDE PANEL ON THE RIGHT (UI อยู่ข้างๆ ขวา) */}
      {/* ======================================================================= */}
      {racePhase === 'finished' && raceSummary && (
        <div className="absolute inset-0 z-40 select-none pointer-events-none overflow-hidden bg-transparent">
          {/* Confetti raining down screen when finishing in top 3! */}
          {raceSummary.position <= 3 && !raceSummary.isDnfFireLoss && !raceSummary.isTimedOutLoss && (
            <ConfettiCelebration rank={raceSummary.position} />
          )}
          {/* SIDE PANEL: ALL RESULTS & STATS DOCKED CLEANLY ON THE RIGHT (UI อยู่ข้างๆ ขวา ไม่บังรถ) */}
          <div className="absolute top-2 bottom-2 right-2 sm:top-3 sm:bottom-3 sm:right-5 w-[94vw] max-w-[390px] sm:max-w-[430px] z-50 flex flex-col pointer-events-auto bg-[#080d17]/95 backdrop-blur-md border-2 border-slate-700/90 rounded-2xl p-3 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] animate-in slide-in-from-right-8 duration-500 font-racing max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-1.5rem)] overflow-hidden">
            {/* Header: Giant Rank & Identity (PINNED AT TOP) */}
            <div className="shrink-0 border-b border-slate-800 pb-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg border shadow-md ${
                      raceSummary.isDnfFireLoss
                        ? 'bg-red-500/20 text-red-400 border-red-500/60 shadow-red-950/80 animate-pulse'
                        : raceSummary.position === 1
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {raceSummary.isDnfFireLoss ? (
                      <span className="text-base leading-none">🔥</span>
                    ) : (
                      <Trophy className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xs sm:text-sm font-black uppercase tracking-wide leading-tight ${
                      raceSummary.isDnfFireLoss ? 'text-red-400' : 'text-white'
                    }`}>
                      {raceSummary.isDnfFireLoss
                        ? '🔥 RETIRED • ENGINE FIRE DNF'
                        : raceSummary.position === 1
                        ? 'GRAND PRIX VICTORY'
                        : 'RACE CLASSIFICATION'}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 truncate max-w-[190px]">
                      {activeGp.circuitName || activeGp.name}
                    </p>
                  </div>
                </div>
                <span className="shrink-0">{renderFlag(activeGp.country || activeGp.flag, 'sm')}</span>
              </div>

              {/* Big Finishing Rank & Championship Points */}
              <div className="flex items-baseline justify-between bg-black/60 px-3 py-1.5 rounded-xl border border-slate-800 mt-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl sm:text-5xl font-black font-racing tracking-tight ${
                      raceSummary.isDnfFireLoss
                        ? 'text-red-500 drop-shadow-[0_0_16px_rgba(239,68,68,0.9)] animate-pulse'
                        : raceSummary.isTimedOutLoss
                        ? 'text-red-400'
                        : raceSummary.position === 1
                        ? 'text-amber-400 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]'
                        : raceSummary.position <= 3
                        ? 'text-slate-100 drop-shadow-[0_0_12px_rgba(226,232,240,0.5)]'
                        : raceSummary.position <= 10
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {raceSummary.isDnfFireLoss ? 'DNF' : `P${raceSummary.position}`}
                  </span>
                  <span className={`text-xs font-bold uppercase truncate max-w-[150px] ${
                    raceSummary.isDnfFireLoss ? 'text-red-400 font-black' : 'text-slate-300'
                  }`}>
                    {raceSummary.isDnfFireLoss
                      ? 'ENGINE FIRE (แพ้)'
                      : raceSummary.isTimedOutLoss
                      ? 'TIME EXPIRED'
                      : raceSummary.position === 1
                      ? '1ST WINNER'
                      : raceSummary.position <= 3
                      ? 'PODIUM FINISH'
                      : `POS ${raceSummary.position}/12`}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {raceSummary.isDnfFireLoss ? '+0 PTS' : `+${[25, 18, 15, 12, 10, 8, 6, 4, 2, 1][raceSummary.position - 1] || 0} PTS`}
                </span>
              </div>

              {/* Driver & Team info */}
              <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-white font-bold truncate max-w-[210px]">
                  {teamState.driver1.name} • {teamState.teamName}
                </span>
                <span>RD {activeGp.round}</span>
              </div>

              {/* DNF Engine Fire Reason Banner ("ขึ้นหน้าแพ้") */}
              {raceSummary.isDnfFireLoss && (
                <div className="mt-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-2 border-red-500 text-red-200 text-[10px] font-mono flex items-center gap-2 shadow-lg shadow-red-950/80 animate-pulse">
                  <span className="text-lg">🔥</span>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-red-300 uppercase">
                      รถพังไฟไหม้และหยุดทำงาน • แพ้การแข่งขัน
                    </span>
                    <span className="text-[9px] text-red-200/90 font-thai">
                      {raceSummary.fireDnfReason || 'ชนสะสมจนเครื่องยนต์เสียหายหนัก รถไฟไหม้และหยุดทำงาน'}
                    </span>
                  </div>
                </div>
              )}

              {/* Mandatory Pit Status Badge */}
              {raceSummary.missedMandatoryPitPenalty ? (
                <div className="mt-1.5 px-3 py-1.5 rounded-xl bg-red-950/90 border border-red-500/80 text-red-200 text-[10px] font-mono flex items-center justify-between shadow-md">
                  <span className="font-bold text-red-400">⚠️ +30.0s FIA TIME PENALTY</span>
                  <span className="text-red-300">Missed Mandatory Pit Stop</span>
                </div>
              ) : (
                <div className="mt-1.5 px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 text-[10px] font-mono flex items-center justify-between shadow-md">
                  <span>✓ MANDATORY PIT STOP</span>
                  <span className="font-bold text-emerald-400">COMPLETED</span>
                </div>
              )}
            </div>

            {/* SCROLLABLE STATS & DETAIL BODY (SCROLLS IF NEEDED, KEEPS CLAIM BUTTON VISIBLE) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 py-1.5">
              {/* Prize Purse Ribbon */}
              <div className="flex items-center justify-between bg-[#111724] px-3 py-2 rounded-xl border border-slate-800">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono uppercase text-slate-400 font-bold">RACE PRIZE PURSE</span>
                  <span className="text-xs font-bold text-white truncate max-w-[150px]">
                    {raceSummary.isDnfFireLoss
                      ? 'DNF CONSOLATION FUND'
                      : raceSummary.position === 1
                      ? '1ST PLACE AWARD'
                      : `P${raceSummary.position} PRIZE AWARD`}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-base sm:text-lg font-black font-mono text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                    +{formatMoney((() => {
                      if (raceSummary.isDnfFireLoss) return 250_000;
                      const scale = (activeGp.firstPlacePrize || 18_000_000) / 18_000_000;
                      const pos = raceSummary.position;
                      let base = 600_000;
                      if (pos === 1) base = 18_000_000;
                      else if (pos === 2) base = 14_000_000;
                      else if (pos === 3) base = 11_000_000;
                      else if (pos === 4) base = 8_800_000;
                      else if (pos === 5) base = 7_200_000;
                      else if (pos === 6) base = 5_600_000;
                      else if (pos === 7) base = 4_500_000;
                      else if (pos === 8) base = 3_600_000;
                      else if (pos === 9) base = 2_800_000;
                      else if (pos === 10) base = 2_000_000;
                      else if (pos <= 15) base = 1_000_000;
                      return Math.round((base * scale) / 25_000) * 25_000;
                    })())}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-300">
                    +{[25, 18, 15, 12, 10, 8, 6, 4, 2, 1][raceSummary.position - 1] || 0} PTS
                  </span>
                </div>
              </div>

              {/* Telemetry Stats Grid (Compact 4 Columns) */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
                <div className="bg-[#0f1522] p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-[8px] uppercase block">TOTAL TIME</span>
                  <strong className="text-white text-[10px] sm:text-[11px] font-bold block truncate">
                    {formatLapTime(raceSummary.totalTimeMs)}
                  </strong>
                </div>
                <div className="bg-[#0f1522] p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-[8px] uppercase block">BEST LAP</span>
                  <strong className="text-purple-400 text-[10px] sm:text-[11px] font-bold block truncate">
                    {formatLapTime(raceSummary.bestLapMs)}
                  </strong>
                </div>
                <div className="bg-[#0f1522] p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-[8px] uppercase block">TOP SPEED</span>
                  <strong className="text-emerald-400 text-[10px] sm:text-[11px] font-bold block truncate">
                    {raceSummary.topSpeed} KM/H
                  </strong>
                </div>
                <div className="bg-[#0f1522] p-1.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-[8px] uppercase block">INCIDENTS</span>
                  <strong className={`text-[10px] sm:text-[11px] font-bold block truncate ${
                    raceSummary.offroadEvents === 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {raceSummary.offroadEvents === 0 ? 'CLEAN (0)' : `${raceSummary.offroadEvents} Off`}
                  </strong>
                </div>
              </div>

              {/* Classification List (Top 3 + Player if outside) */}
              {raceSummary.standings && raceSummary.standings.length > 0 && (
                <div className="bg-[#0d131f] px-2.5 py-1.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[8px] font-mono uppercase text-slate-400 font-bold">
                    <span>TOP FINISHERS</span>
                    <span>GAP</span>
                  </div>
                  <div className="space-y-0.5 font-mono text-[10px]">
                    {raceSummary.standings.slice(0, 3).map((driver) => (
                      <div
                        key={driver.tag + driver.pos}
                        className={`flex items-center justify-between px-2 py-0.5 rounded text-[10px] ${
                          driver.isPlayer ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <strong className={driver.pos === 1 ? 'text-amber-400' : 'text-slate-400'}>
                            P{driver.pos}
                          </strong>
                          <span className="shrink-0">{driver.personality?.icon || (driver.isPlayer ? '🏎️' : '🏁')}</span>
                          <span className="truncate max-w-[140px] sm:max-w-[180px]">
                            {driver.name} {driver.isPlayer ? '(YOU)' : `• ${driver.personality?.title || driver.team}`}
                          </span>
                        </span>
                        <span className="text-slate-400 shrink-0 text-[9px]">{driver.timeStr}</span>
                      </div>
                    ))}
                    {/* If player finished beyond P3, show player's row */}
                    {raceSummary.position > 3 && (
                      <div className="flex items-center justify-between px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                        <span className="flex items-center gap-1.5 truncate">
                          <strong className="text-amber-400">P{raceSummary.position}</strong>
                          <span className="shrink-0">🏎️</span>
                          <span className="truncate max-w-[140px] sm:max-w-[180px]">
                            {teamState.driver1.name} (YOU) • {teamState.teamName}
                          </span>
                        </span>
                        <span className="text-amber-300 text-[9px]">{formatLapTime(raceSummary.totalTimeMs)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 🎯 Stage Bonus Objectives Results (ข้อ 5) */}
              {raceSummary.objectivesSummary && raceSummary.objectivesSummary.length > 0 && (
                <div className="bg-[#0e1420] p-2 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <span>🎯</span> STAGE BONUS OBJECTIVES
                    </span>
                    {raceSummary.bonusPrizeEarned && raceSummary.bonusPrizeEarned > 0 ? (
                      <span className="text-emerald-400 font-bold">+{formatMoney(raceSummary.bonusPrizeEarned)}</span>
                    ) : null}
                  </div>
                  <div className="space-y-0.5">
                    {raceSummary.objectivesSummary.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-2 py-0.5 rounded text-[10px] font-mono border ${
                          item.completed
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                            : 'bg-neutral-900/60 border-neutral-800 text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-1 truncate">
                          <span>{item.obj.icon}</span>
                          <span className="truncate">{item.obj.titleTh}</span>
                        </span>
                        <span className={`font-bold shrink-0 ${item.completed ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {item.completed ? `✓ +${formatMoney(item.obj.rewardMoney)}` : '✗ ไม่สำเร็จ'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 📉 Weakest Stat Diagnosis */}
              {raceSummary.weakestStatDiagnosis && (
                <div className="bg-[#1a1215] p-2 rounded-xl border border-red-900/50 text-[10px] font-mono text-red-200">
                  <div className="flex items-center gap-1 text-[9px] text-amber-400 font-bold uppercase mb-0.5">
                    <span>⚙️</span> วินิจฉัยจุดที่ทำให้เสียเวลามากที่สุด:
                  </div>
                  <p className="leading-tight text-slate-200">
                    {raceSummary.weakestStatDiagnosis.adviceTh}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons (ALWAYS PINNED AND VISIBLE AT BOTTOM - ZERO SCROLLING REQUIRED) */}
            <div className="shrink-0 pt-2 border-t border-slate-800 bg-[#080d17] flex flex-col gap-1.5 w-full z-10">
              {raceSummary.isDnfFireLoss ? (
                <button
                  onClick={restartRace}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-racing font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-red-950/80 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border-2 border-red-400/80 animate-pulse"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                  <span>🔁 แข่งด่านนี้ใหม่ (RETRY THIS ROUND) →</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.stopOutRunEngine();
                    sound.stopRaceMusic();
                    sound.playCash();
                    onRaceCompleted({
                      playerPosition: raceSummary.position,
                      bestLapTimeMs: raceSummary.bestLapMs,
                      totalTimeMs: raceSummary.totalTimeMs,
                      topSpeedKmH: raceSummary.topSpeed,
                      cleanLapsCount: lapsCount - Math.min(lapsCount, raceSummary.offroadEvents),
                      isDnf: false,
                      bonusPrize: raceSummary.bonusPrizeEarned || 0,
                      standings: raceSummary.standings,
                      winnerName: raceSummary.standings?.[0]?.name,
                      winnerTeam: raceSummary.standings?.[0]?.team,
                      winnerFlag: raceSummary.standings?.[0]?.flag,
                    });
                  }}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-racing font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-950/80 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border-2 border-emerald-400/60"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>CLAIM REWARDS & ADVANCE TO NEXT ROUND →</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={restartRace}
                  className="flex-1 py-1.5 bg-[#121824] hover:bg-[#182030] text-slate-300 hover:text-white font-racing font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition cursor-pointer text-center"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  RESTART
                </button>

                <button
                  onClick={() => {
                    sound.stopOutRunEngine();
                    sound.stopRaceMusic();
                    if (raceSummary.isDnfFireLoss) {
                      onRaceCompleted({
                        playerPosition: 12,
                        bestLapTimeMs: raceSummary.bestLapMs,
                        totalTimeMs: raceSummary.totalTimeMs,
                        topSpeedKmH: raceSummary.topSpeed,
                        cleanLapsCount: 0,
                        isDnf: true,
                        isLoss: true,
                      });
                    } else {
                      onExit();
                    }
                  }}
                  className="flex-1 py-1.5 bg-[#121824] hover:bg-[#182030] text-slate-300 hover:text-white font-racing font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition cursor-pointer text-center"
                >
                  {raceSummary.isDnfFireLoss ? 'ยอมแพ้กลับสู่ HUB' : 'EXIT TO CHAMPIONSHIP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. RIVALS INTEL MODAL (11 DRIVER PERSONALITIES DOSSIER) */}
      {showRivalsIntelModal && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0b0f19] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🦁</span>
                <div>
                  <h3 className="font-racing font-bold text-base sm:text-lg text-white tracking-wide flex items-center gap-2">
                    <span>11 DRIVER RIVAL PERSONALITIES</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      WORLD TOUR CONTENDERS
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-thai">
                    บุคลิกภาพเฉพาะตัว สไตล์การขับขี่ และไม้ตายเฉพาะตัวของคู่แข่ง F1 ทั้ง 11 คน
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRivalsIntelModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                CLOSE [✕]
              </button>
            </div>

            {/* Drivers Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[calc(92vh-85px)] grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.values(DRIVER_PERSONALITIES).map((p) => (
                <div
                  key={p.driverId}
                  className="p-3.5 rounded-xl border transition-all hover:border-white/50 flex flex-col justify-between"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    borderColor: p.badgeBorder,
                  }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl shrink-0">{p.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-white font-racing tracking-wide">
                              {p.driverName}
                            </span>
                            <span
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
                              style={{ backgroundColor: p.badgeBg, color: p.badgeText, border: `1px solid ${p.badgeBorder}` }}
                            >
                              #{p.number} {p.driverTag}
                            </span>
                            {isBossRival(undefined, p.driverName) && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-xs">
                                ⚡ HP: 3,000 • SPEED +10%
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {p.teamName}
                          </span>
                        </div>
                      </div>

                      {/* Title Badge */}
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold block" style={{ color: p.badgeBorder }}>
                          {p.title}
                        </span>
                        <span className="text-[10px] text-slate-300 font-thai block">
                          {p.titleTh}
                        </span>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="mt-2 text-xs text-slate-200 font-thai bg-slate-900/70 p-2 rounded-lg border border-slate-800/80">
                      "{p.tagline}"
                    </p>
                  </div>

                  {/* Special Skill */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-start gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold shrink-0">
                      ไม้ตาย: {p.skillName}
                    </span>
                    <p className="text-[11px] text-slate-300 font-thai leading-snug">
                      {p.skillDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
