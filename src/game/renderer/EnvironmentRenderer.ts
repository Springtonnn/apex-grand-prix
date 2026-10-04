/**
 * APEX GRAND PRIX - WebGL High-Performance Sky & Horizon Environment Renderer
 * Renders sky gradients directly via GPU vertex buffers, and caches horizon layers
 * to reduce per-frame trigonometric and curve computations.
 */

import { WebGLRaceRenderer } from './WebGLRaceRenderer';
import { WorldTourCircuitDef } from '../../data/worldTourCircuits';
import { drawWorldTourHorizon, drawSoftClouds, drawDesertSun, drawNightSky } from '../../utils/horizonRenderer';

export class EnvironmentRenderer {
  private horizonCanvas: HTMLCanvasElement;
  private horizonCtx: CanvasRenderingContext2D;
  private horizonTexture: WebGLTexture | null = null;
  private lastMountainOffset: number = -99999;
  private lastGpId: string = '';
  private lastWeather: string = '';

  constructor() {
    this.horizonCanvas = document.createElement('canvas');
    this.horizonCanvas.width = 1280;
    this.horizonCanvas.height = 360;
    const ctx = this.horizonCanvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context for horizon canvas');
    this.horizonCtx = ctx;
  }

  public initTexture(renderer: WebGLRaceRenderer) {
    if (!renderer.gl) return;
    this.horizonTexture = renderer.createTextureFromCanvas(this.horizonCanvas);
  }

  public resize(width: number, height: number, renderer: WebGLRaceRenderer) {
    const hHeight = Math.max(180, Math.round(height / 2));
    if (this.horizonCanvas.width !== width || this.horizonCanvas.height !== hHeight) {
      this.horizonCanvas.width = width;
      this.horizonCanvas.height = hHeight;
      this.lastMountainOffset = -99999;
      if (renderer.gl && this.horizonTexture) {
        renderer.gl.deleteTexture(this.horizonTexture);
        this.horizonTexture = renderer.createTextureFromCanvas(this.horizonCanvas);
      }
    }
  }

  /**
   * Render Sky Gradient directly to WebGL vertex buffer
   */
  public renderSkyGradient(
    renderer: WebGLRaceRenderer,
    width: number,
    height: number,
    weather: string,
    circuitDef: WorldTourCircuitDef
  ) {
    const horizonY = height / 2;

    if (weather === 'Wet') {
      renderer.addVerticalGradientRect(0, 0, width, horizonY * 0.6, '#0f172a', '#1e293b');
      renderer.addVerticalGradientRect(0, horizonY * 0.6, width, horizonY * 0.4, '#1e293b', '#334155');
    } else {
      const g = circuitDef.skyGradient;
      const h1 = horizonY * 0.35;
      const h2 = horizonY * 0.35;
      const h3 = horizonY * 0.30;

      renderer.addVerticalGradientRect(0, 0, width, h1, g[0], g[1]);
      renderer.addVerticalGradientRect(0, h1, width, h2, g[1], g[2]);
      renderer.addVerticalGradientRect(0, h1 + h2, width, h3, g[2], g[3]);
    }
  }

  /**
   * Render Horizon (Mountains, skylines, celestial details) into cached texture, then composite to WebGL
   */
  public renderHorizon(
    renderer: WebGLRaceRenderer,
    width: number,
    height: number,
    mountainOffset: number,
    skyOffset: number,
    activeGp: any,
    circuitDef: WorldTourCircuitDef,
    nowMs: number
  ) {
    if (!renderer.gl || !this.horizonTexture) return;

    // Check if horizon needs updating (smooth threshold to save CPU cycles)
    const offsetDiff = Math.abs(mountainOffset - this.lastMountainOffset);
    const gpChanged = this.lastGpId !== activeGp.id || this.lastWeather !== activeGp.weather;

    if (offsetDiff > 0.4 || gpChanged || (nowMs % 200 < 16)) {
      this.lastMountainOffset = mountainOffset;
      this.lastGpId = activeGp.id;
      this.lastWeather = activeGp.weather;

      const hWidth = this.horizonCanvas.width;
      const hHeight = this.horizonCanvas.height;

      this.horizonCtx.clearRect(0, 0, hWidth, hHeight);

      // Celestial Details
      if (activeGp.weather !== 'Wet') {
        if (circuitDef.celestialFeature === 'clouds') {
          drawSoftClouds(this.horizonCtx, hWidth, hHeight * 2, skyOffset);
        } else if (circuitDef.celestialFeature === 'desert_sun') {
          drawDesertSun(this.horizonCtx, hWidth, hHeight * 2, skyOffset);
        } else if (circuitDef.celestialFeature === 'stars_night') {
          drawNightSky(this.horizonCtx, hWidth, hHeight * 2, skyOffset, nowMs);
        }
      }

      // World Tour Horizon Mountains / Buildings
      drawWorldTourHorizon({
        ctx: this.horizonCtx,
        width: hWidth,
        height: hHeight * 2,
        horizonY: hHeight,
        mountainOffset,
        circuitDef,
        isWet: activeGp.weather === 'Wet',
        timeMs: nowMs,
      });

      renderer.updateTexture(this.horizonTexture, this.horizonCanvas);
    }

    // Draw Horizon as WebGL Textured Quad
    renderer.setTexture(this.horizonTexture);
    renderer.addTexturedQuad(0, 0, width, height / 2, 0, 0, 1, 1, 1.0);
    renderer.flush();
    renderer.setTexture(null);
  }

  public dispose() {
    this.horizonTexture = null;
  }
}
