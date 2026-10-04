/**
 * APEX GRAND PRIX - WebGL High-Performance Particle, Speed Lines, & Weather Renderer
 * Replaces CPU canvas particle/line drawing with GPU batched vertex buffers.
 */

import { WebGLRaceRenderer } from './WebGLRaceRenderer';

export interface ParticleItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface SpeedLineItem {
  dist: number;
  angle: number;
  length: number;
  speed: number;
  opacity: number;
}

export interface RainDropItem {
  x: number;
  y: number;
  speed: number;
  len: number;
}

export class ParticleRenderer {
  public static renderParticles(
    renderer: WebGLRaceRenderer,
    particles: ParticleItem[],
    dt: number
  ) {
    for (let pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
      const pt = particles[pIdx];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt * 2.2;
      if (pt.life <= 0) {
        particles.splice(pIdx, 1);
        continue;
      }
      const radius = (1.0 - pt.life) * 14 + 4;
      renderer.addCircle(pt.x, pt.y, radius, pt.color);
    }
  }

  public static renderSpeedLines(
    renderer: WebGLRaceRenderer,
    speedLines: SpeedLineItem[],
    speed: number,
    maxSpeed: number,
    boostPadTimer: number,
    drsActive: boolean,
    width: number,
    height: number,
    dt: number
  ) {
    if (speed <= 180 && boostPadTimer <= 0) return;

    const isBoost = boostPadTimer > 0;
    const speedRatio = Math.min(1, (speed - 180) / Math.max(1, maxSpeed - 180));
    const numLines = isBoost
      ? Math.min(speedLines.length, 95)
      : Math.floor(speedRatio * 36);

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const maxDist = Math.max(width, height) * 0.75;
    const thickness = isBoost ? 2.2 : 1.2;

    for (let i = 0; i < numLines; i++) {
      const line = speedLines[i];
      if (!line) continue;

      const speedMultiplier = isBoost ? 2.6 : (0.6 + speedRatio * 1.5);
      line.dist += line.speed * speedMultiplier * dt;

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
      const color = isBoost
        ? (Math.random() > 0.4 ? '#fde047' : '#ffffff')
        : drsActive
        ? '#38bdf8'
        : '#ffffff';

      renderer.addLine(x1, y1, x2, y2, thickness, color, Math.min(1, baseAlpha * (isBoost ? 1.5 : 1.0)));
    }
  }

  public static renderRain(
    renderer: WebGLRaceRenderer,
    rainDrops: RainDropItem[],
    isRaining: boolean,
    rainIntensity: number,
    lateralVx: number,
    width: number,
    height: number,
    timestamp: number,
    dt: number
  ) {
    if (!isRaining) return;

    // Atmospheric storm rain tint
    renderer.addRect(0, 0, width, height, '#0f172a', 0.16 * rainIntensity);

    const rainTurnDrift = lateralVx * 14;

    for (let rIdx = 0; rIdx < rainDrops.length; rIdx++) {
      const drop = rainDrops[rIdx];
      drop.y += drop.speed * dt;
      drop.x += (Math.sin(timestamp * 0.001) * 28 - rainTurnDrift) * dt;
      if (drop.y > height) {
        drop.y = -drop.len;
        drop.x = Math.random() * width;
      }
      if (drop.x < 0) drop.x = width;
      if (drop.x > width) drop.x = 0;

      renderer.addLine(drop.x, drop.y, drop.x - 3, drop.y + drop.len, 1.35, '#bae6fd', 0.55);
    }

    // Asphalt water ripple splashes on ground
    for (let sp = 0; sp < 12; sp++) {
      if (Math.random() < 0.35) {
        const rx = Math.random() * width;
        const ry = height / 2 + Math.random() * (height / 2);
        renderer.addCircle(rx, ry, 5 + Math.random() * 4, '#e0f2fe', 0.4);
      }
    }
  }
}
