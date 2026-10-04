/**
 * APEX GRAND PRIX - WebGL High-Performance Sprite & Texture Atlas Renderer
 * Automatically caches roadside props (trees, billboards, barriers, lights, buildings)
 * into a GPU WebGL Texture Atlas and renders them as GPU textured quads.
 */

import { WebGLRaceRenderer } from './WebGLRaceRenderer';

export interface RoadsideSpriteData {
  type: string;
  offset: number;
  scale: number;
  text?: string;
  variant?: number;
  color?: string;
  hit?: boolean;
  playerHitUntil?: number;
}

interface AtlasSlot {
  u0: number;
  v0: number;
  u1: number;
  v1: number;
  w: number;
  h: number;
  anchorX: number; // Normalized center X (usually 0.5)
  anchorY: number; // Normalized bottom Y (usually 1.0)
}

export class SpriteRenderer {
  private atlasCanvas: HTMLCanvasElement;
  private atlasCtx: CanvasRenderingContext2D;
  private atlasTexture: WebGLTexture | null = null;
  private isTextureDirty: boolean = false;

  private atlasWidth = 2048;
  private atlasHeight = 2048;
  private currentX = 2;
  private currentY = 2;
  private rowHeight = 0;

  private cache: Map<string, AtlasSlot> = new Map();

  // Dynamic car offscreen canvas for real-time cars and dynamic effects
  private dynamicCanvas: HTMLCanvasElement;
  public dynamicCtx: CanvasRenderingContext2D;
  private dynamicTexture: WebGLTexture | null = null;

  constructor() {
    this.atlasCanvas = document.createElement('canvas');
    this.atlasCanvas.width = this.atlasWidth;
    this.atlasCanvas.height = this.atlasHeight;
    const ctx = this.atlasCanvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) throw new Error('Could not get 2d context for atlas');
    this.atlasCtx = ctx;

    this.dynamicCanvas = document.createElement('canvas');
    this.dynamicCanvas.width = 1280;
    this.dynamicCanvas.height = 720;
    const dynCtx = this.dynamicCanvas.getContext('2d');
    if (!dynCtx) throw new Error('Could not get 2d context for dynamic canvas');
    this.dynamicCtx = dynCtx;
  }

  public initTextures(renderer: WebGLRaceRenderer) {
    if (!renderer.gl) return;
    this.atlasTexture = renderer.createTextureFromCanvas(this.atlasCanvas);
    this.dynamicTexture = renderer.createTextureFromCanvas(this.dynamicCanvas);
    this.isTextureDirty = false;
  }

  public getAtlasTexture(): WebGLTexture | null {
    return this.atlasTexture;
  }

  public getDynamicTexture(): WebGLTexture | null {
    return this.dynamicTexture;
  }

  public clearDynamicCanvas() {
    this.dynamicCtx.clearRect(0, 0, this.dynamicCanvas.width, this.dynamicCanvas.height);
  }

  public resize(width: number, height: number, renderer: WebGLRaceRenderer) {
    if (this.dynamicCanvas.width !== width || this.dynamicCanvas.height !== height) {
      this.dynamicCanvas.width = width;
      this.dynamicCanvas.height = height;
      if (renderer.gl && this.dynamicTexture) {
        renderer.gl.deleteTexture(this.dynamicTexture);
        this.dynamicTexture = renderer.createTextureFromCanvas(this.dynamicCanvas);
      }
    }
  }

  public syncDynamicTexture(renderer: WebGLRaceRenderer) {
    if (!renderer.gl || !this.dynamicTexture) return;
    renderer.updateTexture(this.dynamicTexture, this.dynamicCanvas);
  }

  /**
   * Allocate a slot in the atlas canvas
   */
  private allocateSlot(w: number, h: number): { x: number; y: number } | null {
    const pad = 4;
    const allocW = w + pad * 2;
    const allocH = h + pad * 2;

    if (this.currentX + allocW > this.atlasWidth) {
      this.currentX = 2;
      this.currentY += this.rowHeight + pad;
      this.rowHeight = 0;
    }

    if (this.currentY + allocH > this.atlasHeight) {
      console.warn('Sprite atlas full! Cannot allocate slot for sprite');
      return null;
    }

    const x = this.currentX + pad;
    const y = this.currentY + pad;

    this.currentX += allocW;
    if (allocH > this.rowHeight) {
      this.rowHeight = allocH;
    }

    return { x, y };
  }

  /**
   * Get or bake a roadside prop into the texture atlas
   */
  public getOrBakeProp(
    sprite: RoadsideSpriteData,
    drawPropFn: (ctx: CanvasRenderingContext2D, sprite: any, x: number, y: number, w: number, scale: number, screenW: number, screenH: number) => void
  ): AtlasSlot | null {
    const cacheKey = `${sprite.type}_${sprite.variant || 0}_${sprite.text || ''}_${sprite.color || ''}`;
    let slot = this.cache.get(cacheKey);
    if (slot) return slot;

    // Standard high-res raster bounding box for prop baking (256x256 or 384x384)
    const bakeW = 280;
    const bakeH = 340;
    const pos = this.allocateSlot(bakeW, bakeH);
    if (!pos) return null;

    this.atlasCtx.save();
    // Render prop into allocated area with baseline at bottom center
    const centerX = pos.x + bakeW / 2;
    const bottomY = pos.y + bakeH - 10;

    this.atlasCtx.translate(0, 0);
    // Call original vector prop rendering into this atlas slot
    try {
      // Mock dummy parameters so prop draws into slot centered around (centerX, bottomY)
      // scale = 1.0, w1 = 100
      drawPropFn(this.atlasCtx, sprite, centerX, bottomY, 100, 1.0 / 3800, 1280, 720);
    } catch (e) {
      console.error('Error baking prop to atlas:', e);
    }
    this.atlasCtx.restore();

    slot = {
      u0: pos.x / this.atlasWidth,
      v0: pos.y / this.atlasHeight,
      u1: (pos.x + bakeW) / this.atlasWidth,
      v1: (pos.y + bakeH) / this.atlasHeight,
      w: bakeW,
      h: bakeH,
      anchorX: 0.5,
      anchorY: (bakeH - 10) / bakeH,
    };

    this.cache.set(cacheKey, slot);
    this.isTextureDirty = true;
    return slot;
  }

  public updateAtlasIfNeeded(renderer: WebGLRaceRenderer) {
    if (this.isTextureDirty && this.atlasTexture && renderer.gl) {
      renderer.updateTexture(this.atlasTexture, this.atlasCanvas);
      this.isTextureDirty = false;
    }
  }

  public renderPropWebGL(
    renderer: WebGLRaceRenderer,
    slot: AtlasSlot,
    baseX: number,
    baseY: number,
    scale: number,
    alpha: number = 1.0
  ) {
    const s = Math.min(8.5, Math.max(0.08, scale * 3800));
    const renderW = slot.w * (s / 3.0);
    const renderH = slot.h * (s / 3.0);

    const x = baseX - renderW * slot.anchorX;
    const y = baseY - renderH * slot.anchorY;

    renderer.addTexturedQuad(
      x,
      y,
      renderW,
      renderH,
      slot.u0,
      slot.v0,
      slot.u1,
      slot.v1,
      alpha
    );
  }

  public renderDynamicOverlay(renderer: WebGLRaceRenderer) {
    if (!this.dynamicTexture) return;
    renderer.setTexture(this.dynamicTexture);
    renderer.addTexturedQuad(0, 0, renderer.currentWidth, renderer.currentHeight, 0, 0, 1, 1, 1.0);
    renderer.flush();
    renderer.setTexture(null);
  }

  public dispose() {
    this.cache.clear();
  }
}
