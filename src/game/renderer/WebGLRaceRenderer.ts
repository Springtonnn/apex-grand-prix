/**
 * APEX GRAND PRIX - Unified High-Performance WebGL Race Renderer
 * Offloads road geometry, environment, particles, speed lines, rain, and sprites
 * directly to the GPU using batched vertex arrays and textured quads.
 */

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  attribute vec4 a_color;
  attribute float a_mode; // 0.0 = color only, 1.0 = textured quad

  uniform vec2 u_resolution;

  varying vec2 v_texCoord;
  varying vec4 v_color;
  varying float v_mode;

  void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 clipSpace = (zeroToOne * 2.0) - 1.0;
    gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
    v_texCoord = a_texCoord;
    v_color = a_color;
    v_mode = a_mode;
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;

  uniform sampler2D u_texture;

  varying vec2 v_texCoord;
  varying vec4 v_color;
  varying float v_mode;

  void main() {
    if (v_mode > 0.5) {
      vec4 texColor = texture2D(u_texture, v_texCoord);
      gl_FragColor = texColor * v_color;
    } else {
      gl_FragColor = v_color;
    }
  }
`;

// Helper: Fast color parsing with caching to eliminate runtime string parsing in game loop
const COLOR_CACHE = new Map<string, [number, number, number, number]>();

export function parseColor(colorStr: string): [number, number, number, number] {
  const cached = COLOR_CACHE.get(colorStr);
  if (cached) return cached;

  let r = 1, g = 1, b = 1, a = 1;

  if (colorStr.startsWith('#')) {
    const hex = colorStr.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16) / 255;
      g = parseInt(hex[1] + hex[1], 16) / 255;
      b = parseInt(hex[2] + hex[2], 16) / 255;
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    } else if (hex.length === 8) {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
      a = parseInt(hex.substring(6, 8), 16) / 255;
    }
  } else if (colorStr.startsWith('rgba') || colorStr.startsWith('rgb')) {
    const parts = colorStr.match(/[\d.]+/g);
    if (parts && parts.length >= 3) {
      r = parseFloat(parts[0]) / 255;
      g = parseFloat(parts[1]) / 255;
      b = parseFloat(parts[2]) / 255;
      if (parts.length >= 4) {
        a = parseFloat(parts[3]);
      }
    }
  } else if (colorStr === 'transparent') {
    r = 0; g = 0; b = 0; a = 0;
  }

  const result: [number, number, number, number] = [r, g, b, a];
  COLOR_CACHE.set(colorStr, result);
  return result;
}

export class WebGLRaceRenderer {
  public gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;

  private positionLocation: number = -1;
  private texCoordLocation: number = -1;
  private colorLocation: number = -1;
  private modeLocation: number = -1;
  private resolutionLocation: WebGLUniformLocation | null = null;
  private textureUniformLocation: WebGLUniformLocation | null = null;

  private vertexBuffer: WebGLBuffer | null = null;
  private defaultWhiteTexture: WebGLTexture | null = null;
  private currentBoundTexture: WebGLTexture | null = null;

  // Interleaved floats: [x, y, u, v, r, g, b, a, mode] = 9 floats per vertex
  private static readonly FLOATS_PER_VERTEX = 9;
  private static readonly MAX_VERTICES = 90000;
  private vertexData: Float32Array = new Float32Array(WebGLRaceRenderer.MAX_VERTICES * WebGLRaceRenderer.FLOATS_PER_VERTEX);
  private vertexCount: number = 0;

  public currentWidth: number = 1280;
  public currentHeight: number = 720;

  constructor(canvas: HTMLCanvasElement) {
    this.initGL(canvas);
  }

  private initGL(canvas: HTMLCanvasElement): boolean {
    try {
      const gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: true,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      }) || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

      if (!gl) {
        console.error('WebGL not supported');
        return false;
      }

      this.gl = gl;

      const vertShader = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
      const fragShader = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

      if (!vertShader || !fragShader) return false;

      const program = gl.createProgram();
      if (!program) return false;

      gl.attachShader(program, vertShader);
      gl.attachShader(program, fragShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Failed to link program:', gl.getProgramInfoLog(program));
        return false;
      }

      this.program = program;
      gl.useProgram(program);

      this.positionLocation = gl.getAttribLocation(program, 'a_position');
      this.texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
      this.colorLocation = gl.getAttribLocation(program, 'a_color');
      this.modeLocation = gl.getAttribLocation(program, 'a_mode');
      this.resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      this.textureUniformLocation = gl.getUniformLocation(program, 'u_texture');

      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Create 1x1 white default texture
      this.defaultWhiteTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.defaultWhiteTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([255, 255, 255, 255])
      );
      this.currentBoundTexture = this.defaultWhiteTexture;

      // Setup interleaved layout
      const stride = WebGLRaceRenderer.FLOATS_PER_VERTEX * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(this.positionLocation);
      gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, stride, 0);

      gl.enableVertexAttribArray(this.texCoordLocation);
      gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(this.colorLocation);
      gl.vertexAttribPointer(this.colorLocation, 4, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);

      gl.enableVertexAttribArray(this.modeLocation);
      gl.vertexAttribPointer(this.modeLocation, 1, gl.FLOAT, false, stride, 8 * Float32Array.BYTES_PER_ELEMENT);

      return true;
    } catch (e) {
      console.error('Error init WebGL:', e);
      return false;
    }
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null;
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  public isAvailable(): boolean {
    return this.gl !== null && this.program !== null;
  }

  public resize(width: number, height: number) {
    if (!this.gl) return;
    this.currentWidth = width;
    this.currentHeight = height;
    this.gl.viewport(0, 0, width, height);
  }

  public setTexture(texture: WebGLTexture | null) {
    const texToBind = texture || this.defaultWhiteTexture;
    if (this.currentBoundTexture !== texToBind) {
      this.flush(); // Flush pending geometry before changing active texture unit
      this.currentBoundTexture = texToBind;
      if (this.gl && texToBind) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, texToBind);
      }
    }
  }

  public createTextureFromCanvas(sourceCanvas: HTMLCanvasElement): WebGLTexture | null {
    if (!this.gl) return null;
    const tex = this.gl.createTexture();
    if (!tex) return null;
    this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      sourceCanvas
    );
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    return tex;
  }

  public updateTexture(texture: WebGLTexture, sourceCanvas: HTMLCanvasElement) {
    if (!this.gl) return;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      sourceCanvas
    );
  }

  public beginFrame(clearR: number = 0, clearG: number = 0, clearB: number = 0, clearA: number = 1) {
    if (!this.gl) return;
    this.gl.clearColor(clearR, clearG, clearB, clearA);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.vertexCount = 0;
    this.setTexture(null);
  }

  public flush() {
    if (!this.gl || this.vertexCount === 0) return;

    this.gl.useProgram(this.program);
    if (this.resolutionLocation) {
      this.gl.uniform2f(this.resolutionLocation, this.currentWidth, this.currentHeight);
    }
    if (this.textureUniformLocation) {
      this.gl.uniform1i(this.textureUniformLocation, 0);
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertexData.subarray(0, this.vertexCount * WebGLRaceRenderer.FLOATS_PER_VERTEX),
      this.gl.DYNAMIC_DRAW
    );

    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
    this.vertexCount = 0;
  }

  private pushVertex(
    x: number, y: number,
    u: number, v: number,
    r: number, g: number, b: number, a: number,
    mode: number
  ) {
    if (this.vertexCount >= WebGLRaceRenderer.MAX_VERTICES) {
      this.flush();
    }
    const idx = this.vertexCount * WebGLRaceRenderer.FLOATS_PER_VERTEX;
    this.vertexData[idx] = x;
    this.vertexData[idx + 1] = y;
    this.vertexData[idx + 2] = u;
    this.vertexData[idx + 3] = v;
    this.vertexData[idx + 4] = r;
    this.vertexData[idx + 5] = g;
    this.vertexData[idx + 6] = b;
    this.vertexData[idx + 7] = a;
    this.vertexData[idx + 8] = mode;
    this.vertexCount++;
  }

  // --- GEOMETRY HELPERS (Color Mode: mode = 0) ---

  public addRect(
    x: number,
    y: number,
    w: number,
    h: number,
    colorStr: string,
    alphaMultiplier: number = 1
  ) {
    const [r, g, b, a] = parseColor(colorStr);
    const effA = a * alphaMultiplier;
    if (effA <= 0.001) return;

    const x1 = x;
    const y1 = y;
    const x2 = x + w;
    const y2 = y + h;

    this.pushVertex(x1, y1, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x2, y1, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x1, y2, 0, 0, r, g, b, effA, 0.0);

    this.pushVertex(x2, y1, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x2, y2, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x1, y2, 0, 0, r, g, b, effA, 0.0);
  }

  public addTrapezoid(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    colorStr: string,
    alphaMultiplier: number = 1
  ) {
    const [r, g, b, a] = parseColor(colorStr);
    const effA = a * alphaMultiplier;
    if (effA <= 0.001) return;

    // Triangle 1: (x1, y1) -> (x2, y2) -> (x4, y4)
    this.pushVertex(x1, y1, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x2, y2, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x4, y4, 0, 0, r, g, b, effA, 0.0);

    // Triangle 2: (x2, y2) -> (x3, y3) -> (x4, y4)
    this.pushVertex(x2, y2, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x3, y3, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x4, y4, 0, 0, r, g, b, effA, 0.0);
  }

  public addTriangle(
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    colorStr: string,
    alphaMultiplier: number = 1
  ) {
    const [r, g, b, a] = parseColor(colorStr);
    const effA = a * alphaMultiplier;
    if (effA <= 0.001) return;

    this.pushVertex(x1, y1, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x2, y2, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(x3, y3, 0, 0, r, g, b, effA, 0.0);
  }

  public addVerticalGradientRect(
    x: number,
    y: number,
    w: number,
    h: number,
    topColor: string,
    bottomColor: string
  ) {
    const [tr, tg, tb, ta] = parseColor(topColor);
    const [br, bg, bb, ba] = parseColor(bottomColor);

    const x1 = x;
    const y1 = y;
    const x2 = x + w;
    const y2 = y + h;

    this.pushVertex(x1, y1, 0, 0, tr, tg, tb, ta, 0.0);
    this.pushVertex(x2, y1, 0, 0, tr, tg, tb, ta, 0.0);
    this.pushVertex(x1, y2, 0, 0, br, bg, bb, ba, 0.0);

    this.pushVertex(x2, y1, 0, 0, tr, tg, tb, ta, 0.0);
    this.pushVertex(x2, y2, 0, 0, br, bg, bb, ba, 0.0);
    this.pushVertex(x1, y2, 0, 0, br, bg, bb, ba, 0.0);
  }

  public addLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    thickness: number,
    colorStr: string,
    alphaMultiplier: number = 1
  ) {
    const [r, g, b, a] = parseColor(colorStr);
    const effA = a * alphaMultiplier;
    if (effA <= 0.001) return;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.001) return;

    const nx = (-dy / len) * (thickness * 0.5);
    const ny = (dx / len) * (thickness * 0.5);

    const p1x = x1 + nx;
    const p1y = y1 + ny;
    const p2x = x1 - nx;
    const p2y = y1 - ny;
    const p3x = x2 - nx;
    const p3y = y2 - ny;
    const p4x = x2 + nx;
    const p4y = y2 + ny;

    this.pushVertex(p1x, p1y, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(p2x, p2y, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(p4x, p4y, 0, 0, r, g, b, effA, 0.0);

    this.pushVertex(p2x, p2y, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(p3x, p3y, 0, 0, r, g, b, effA, 0.0);
    this.pushVertex(p4x, p4y, 0, 0, r, g, b, effA, 0.0);
  }

  public addCircle(
    cx: number,
    cy: number,
    radius: number,
    colorStr: string,
    alphaMultiplier: number = 1
  ) {
    const [r, g, b, a] = parseColor(colorStr);
    const effA = a * alphaMultiplier;
    if (effA <= 0.001 || radius <= 0.5) return;

    const segments = 8;
    const step = (Math.PI * 2) / segments;
    for (let i = 0; i < segments; i++) {
      const angle1 = i * step;
      const angle2 = (i + 1) * step;

      const x1 = cx + Math.cos(angle1) * radius;
      const y1 = cy + Math.sin(angle1) * radius;
      const x2 = cx + Math.cos(angle2) * radius;
      const y2 = cy + Math.sin(angle2) * radius;

      this.pushVertex(cx, cy, 0, 0, r, g, b, effA, 0.0);
      this.pushVertex(x1, y1, 0, 0, r, g, b, effA, 0.0);
      this.pushVertex(x2, y2, 0, 0, r, g, b, effA, 0.0);
    }
  }

  // --- TEXTURED QUAD HELPER (mode = 1) ---

  public addTexturedQuad(
    x: number,
    y: number,
    w: number,
    h: number,
    u0: number = 0,
    v0: number = 0,
    u1: number = 1,
    v1: number = 1,
    alpha: number = 1.0
  ) {
    if (alpha <= 0.001 || w <= 0 || h <= 0) return;

    const x1 = x;
    const y1 = y;
    const x2 = x + w;
    const y2 = y + h;

    this.pushVertex(x1, y1, u0, v0, 1, 1, 1, alpha, 1.0);
    this.pushVertex(x2, y1, u1, v0, 1, 1, 1, alpha, 1.0);
    this.pushVertex(x1, y2, u0, v1, 1, 1, 1, alpha, 1.0);

    this.pushVertex(x2, y1, u1, v0, 1, 1, 1, alpha, 1.0);
    this.pushVertex(x2, y2, u1, v1, 1, 1, 1, alpha, 1.0);
    this.pushVertex(x1, y2, u0, v1, 1, 1, 1, alpha, 1.0);
  }

  public dispose() {
    if (!this.gl) return;
    if (this.defaultWhiteTexture) {
      this.gl.deleteTexture(this.defaultWhiteTexture);
      this.defaultWhiteTexture = null;
    }
    if (this.vertexBuffer) {
      this.gl.deleteBuffer(this.vertexBuffer);
      this.vertexBuffer = null;
    }
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    this.gl = null;
  }
}
