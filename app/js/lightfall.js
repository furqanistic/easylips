window.EasyLips = window.EasyLips || {};

(function (App) {
  /**
   * Dither — animated Perlin-noise waves with Bayer ordered-dither posterisation.
   * Self-contained vanilla WebGL 2.0; no dependencies.
   * Adapted from react-bits.dev/backgrounds/dither
   */

  var VERTEX_SHADER = [
    '#version 300 es',
    'in vec2 position;',
    'in vec2 uv;',
    'out vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = vec4(position, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FRAGMENT_SHADER = [
    '#version 300 es',
    'precision highp float;',
    '',
    'uniform vec2  resolution;',
    'uniform float time;',
    'uniform float waveSpeed;',
    'uniform float waveFrequency;',
    'uniform float waveAmplitude;',
    'uniform vec3  waveColor;',
    'uniform vec2  mousePos;',
    'uniform float enableMouseInteraction;',
    'uniform float mouseRadius;',
    'uniform float colorNum;',
    'uniform float pixelSize;',
    'uniform float opacity;',
    '',
    'in  vec2 vUv;',
    'out vec4 fragColor;',
    '',
    'vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }',
    'vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }',
    'vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }',
    'vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }',
    '',
    'float cnoise(vec2 P) {',
    '  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);',
    '  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);',
    '  Pi = mod289(Pi);',
    '  vec4 ix = Pi.xzxz;',
    '  vec4 iy = Pi.yyww;',
    '  vec4 fx = Pf.xzxz;',
    '  vec4 fy = Pf.yyww;',
    '  vec4 i = permute(permute(ix) + iy);',
    '  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;',
    '  vec4 gy = abs(gx) - 0.5;',
    '  vec4 tx = floor(gx + 0.5);',
    '  gx = gx - tx;',
    '  vec2 g00 = vec2(gx.x, gy.x);',
    '  vec2 g10 = vec2(gx.y, gy.y);',
    '  vec2 g01 = vec2(gx.z, gy.z);',
    '  vec2 g11 = vec2(gx.w, gy.w);',
    '  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));',
    '  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;',
    '  float n00 = dot(g00, vec2(fx.x, fy.x));',
    '  float n10 = dot(g10, vec2(fx.y, fy.y));',
    '  float n01 = dot(g01, vec2(fx.z, fy.z));',
    '  float n11 = dot(g11, vec2(fx.w, fy.w));',
    '  vec2 fade_xy = fade(Pf.xy);',
    '  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);',
    '  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);',
    '}',
    '',
    'const int OCTAVES = 4;',
    'float fbm(vec2 p) {',
    '  float value = 0.0;',
    '  float amp = 1.0;',
    '  float freq = waveFrequency;',
    '  for (int i = 0; i < OCTAVES; i++) {',
    '    value += amp * abs(cnoise(p));',
    '    p *= freq;',
    '    amp *= waveAmplitude;',
    '  }',
    '  return value;',
    '}',
    '',
    'float pattern(vec2 p) {',
    '  vec2 p2 = p - time * waveSpeed;',
    '  return fbm(p + fbm(p2));',
    '}',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / resolution.xy;',
    '',
    '  /* quantize to pixelSize blocks for the retro blocky look */',
    '  vec2 uvBlock = pixelSize * floor(gl_FragCoord.xy / pixelSize) / resolution.xy;',
    '  vec2 p = uvBlock - 0.5;',
    '  p.x *= resolution.x / resolution.y;',
    '',
    '  float f = pattern(p);',
    '',
    '  if (enableMouseInteraction > 0.5) {',
    '    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);',
    '    mouseNDC.x *= resolution.x / resolution.y;',
    '    float dist = length(uvBlock - 0.5 - mouseNDC);',
    '    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);',
    '    f -= 0.5 * effect;',
    '  }',
    '',
    '  vec3 col = mix(vec3(0.0), waveColor, clamp(f, 0.0, 1.0));',
    '',
    '  /* 8x8 Bayer ordered-dither matrix */',
    '  const float bayer[64] = float[64](',
    '     0.0, 48.0, 12.0, 60.0,  3.0, 51.0, 15.0, 63.0,',
    '    32.0, 16.0, 44.0, 28.0, 35.0, 19.0, 47.0, 31.0,',
    '     8.0, 56.0,  4.0, 52.0, 11.0, 59.0,  7.0, 55.0,',
    '    40.0, 24.0, 36.0, 20.0, 43.0, 27.0, 39.0, 23.0,',
    '     2.0, 50.0, 14.0, 62.0,  1.0, 49.0, 13.0, 61.0,',
    '    34.0, 18.0, 46.0, 30.0, 33.0, 17.0, 45.0, 29.0,',
    '    10.0, 58.0,  6.0, 54.0,  9.0, 57.0,  5.0, 53.0,',
    '    42.0, 26.0, 38.0, 22.0, 41.0, 25.0, 37.0, 21.0',
    '  );',
    '',
    '  vec2 scaledCoord = floor(gl_FragCoord.xy / pixelSize);',
    '  int bx = int(mod(scaledCoord.x, 8.0));',
    '  int by = int(mod(scaledCoord.y, 8.0));',
    '  float threshold = (bayer[by * 8 + bx] / 64.0) - 0.25;',
    '',
    '  float step = 1.0 / max(colorNum - 1.0, 1.0);',
    '  col += threshold * step;',
    '  col = clamp(col - 0.2, 0.0, 1.0);',
    '  col = floor(col * (colorNum - 1.0) + 0.5) / max(colorNum - 1.0, 1.0);',
    '',
    '  fragColor = vec4(col, opacity);',
    '}',
  ].join('\n');

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error: ', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    var vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program link error: ', gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  function getUniformLocation(gl, prog, name) {
    var loc = gl.getUniformLocation(prog, name);
    if (loc === null) console.warn('Uniform "' + name + '" not found');
    return loc;
  }

  function Dither(options) {
    options = options || {};
    this._canvas       = null;
    this._gl           = null;
    this._program      = null;
    this._raf          = 0;
    this._started      = false;
    this._mouseTarget  = [0, 0];
    this._onPointerMove  = null;
    this._resizeObserver = null;
    this._startTime    = performance.now();
    this._vbo          = null;
    this._uvbo         = null;
    this._uniformLocs  = null;

    this._dpr          = options.dpr || (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    this._waveSpeed     = options.waveSpeed     != null ? options.waveSpeed     : 0.05;
    this._waveFrequency = options.waveFrequency != null ? options.waveFrequency : 3;
    this._waveAmplitude = options.waveAmplitude != null ? options.waveAmplitude : 0.3;
    this._waveColor     = options.waveColor     || [0.5, 0.5, 0.5];
    this._colorNum      = options.colorNum      != null ? options.colorNum      : 4;
    this._pixelSize     = options.pixelSize     != null ? options.pixelSize     : 2;
    this._opacity       = options.opacity       != null ? options.opacity       : 1;
    this._mouseInteraction  = options.mouseInteraction  !== false;
    this._mouseRadius   = options.mouseRadius   != null ? options.mouseRadius   : 1;
    this._mouseDampening = options.mouseDampening != null ? options.mouseDampening : 0.12;
  }

  Dither.prototype._initGL = function () {
    var gl = this._canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      console.warn('WebGL 2.0 not available, trying WebGL 1.0 fallback…');
      gl = this._canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) || this._canvas.getContext('experimental-webgl', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      });
    }
    if (!gl) {
      console.error('WebGL not supported');
      return false;
    }
    this._gl = gl;
    return true;
  };

  Dither.prototype._setupGeometry = function () {
    var gl = this._gl;
    var verts = new Float32Array([-1, -1, 3, -1, -1, 3]);
    var uvs   = new Float32Array([0, 0, 2, 0, 0, 2]);

    this._vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    this._uvbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvbo);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

    this._vertexCount = 3;
  };

  Dither.prototype._setupUniforms = function () {
    var prog = this._program;
    var gl = this._gl;
    var locs = {};
    locs.resolution             = getUniformLocation(gl, prog, 'resolution');
    locs.time                   = getUniformLocation(gl, prog, 'time');
    locs.waveSpeed              = getUniformLocation(gl, prog, 'waveSpeed');
    locs.waveFrequency          = getUniformLocation(gl, prog, 'waveFrequency');
    locs.waveAmplitude          = getUniformLocation(gl, prog, 'waveAmplitude');
    locs.waveColor              = getUniformLocation(gl, prog, 'waveColor');
    locs.mousePos               = getUniformLocation(gl, prog, 'mousePos');
    locs.enableMouseInteraction = getUniformLocation(gl, prog, 'enableMouseInteraction');
    locs.mouseRadius            = getUniformLocation(gl, prog, 'mouseRadius');
    locs.colorNum               = getUniformLocation(gl, prog, 'colorNum');
    locs.pixelSize              = getUniformLocation(gl, prog, 'pixelSize');
    locs.opacity                = getUniformLocation(gl, prog, 'opacity');
    this._uniformLocs = locs;
  };

  Dither.prototype._resize = function () {
    var canvas = this._canvas;
    var gl = this._gl;
    var dpr = this._dpr;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    var bw = Math.floor(w * dpr);
    var bh = Math.floor(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
      gl.viewport(0, 0, bw, bh);
    }
  };

  Dither.prototype._setUniforms = function () {
    var gl = this._gl;
    var l = this._uniformLocs;
    gl.uniform2f(l.resolution, this._canvas.width, this._canvas.height);
    gl.uniform1f(l.time, (performance.now() - this._startTime) * 0.001);
    gl.uniform1f(l.waveSpeed, this._waveSpeed);
    gl.uniform1f(l.waveFrequency, this._waveFrequency);
    gl.uniform1f(l.waveAmplitude, this._waveAmplitude);
    gl.uniform3fv(l.waveColor, this._waveColor);
    gl.uniform2fv(l.mousePos, this._mouseTarget);
    gl.uniform1f(l.enableMouseInteraction, this._mouseInteraction ? 1 : 0);
    gl.uniform1f(l.mouseRadius, this._mouseRadius);
    gl.uniform1f(l.colorNum, this._colorNum);
    gl.uniform1f(l.pixelSize, this._pixelSize);
    gl.uniform1f(l.opacity, this._opacity);
  };

  Dither.prototype._render = function () {
    if (!this._gl || !this._program || !this._started) return;

    this._resize();
    this._setUniforms();

    var gl = this._gl;
    var prog = this._program;
    gl.useProgram(prog);

    var posLoc = gl.getAttribLocation(prog, 'position');
    var uvLoc  = gl.getAttribLocation(prog, 'uv');

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvbo);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this._vertexCount);

    gl.disableVertexAttribArray(posLoc);
    gl.disableVertexAttribArray(uvLoc);
  };

  Dither.prototype.mount = function (container) {
    if (this._started) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'lightfall-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);
    this._canvas = canvas;

    if (!this._initGL()) return;

    this._setupGeometry();
    var prog = createProgram(this._gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!prog) {
      console.error('Failed to create WebGL program');
      return;
    }
    this._program = prog;
    this._setupUniforms();
    this._resize();

    var self = this;
    this._resizeObserver = new ResizeObserver(function () { self._resize(); });
    this._resizeObserver.observe(container);

    if (this._mouseInteraction) {
      this._onPointerMove = function (e) {
        var rect = canvas.getBoundingClientRect();
        var scale = self._dpr;
        self._mouseTarget[0] = (e.clientX - rect.left) * scale;
        self._mouseTarget[1] = (rect.height - (e.clientY - rect.top)) * scale;
      };
      canvas.addEventListener('pointermove', this._onPointerMove);
    }

    this._started = true;
    this._loop();
  };

  Dither.prototype._loop = function () {
    var self = this;
    function frame() {
      if (!self._started) return;
      self._render();
      self._raf = requestAnimationFrame(frame);
    }
    this._raf = requestAnimationFrame(frame);
  };

  Dither.prototype.pause = function () { this._started = false; };
  Dither.prototype.resume = function () {
    if (this._started) return;
    this._startTime = performance.now();
    this._started = true;
    this._loop();
  };

  Dither.prototype.destroy = function () {
    this._started = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    if (this._onPointerMove && this._canvas) {
      this._canvas.removeEventListener('pointermove', this._onPointerMove);
      this._onPointerMove = null;
    }
    if (this._resizeObserver) { this._resizeObserver.disconnect(); this._resizeObserver = null; }
    if (this._canvas && this._canvas.parentElement) {
      this._canvas.parentElement.removeChild(this._canvas);
    }
    if (this._gl) {
      var ext = this._gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      this._gl = null;
    }
    this._canvas  = null;
    this._program = null;
    this._vbo     = null;
    this._uvbo    = null;
  };

  Dither.DARK_THEME = {
    waveSpeed: 0.03,
    waveFrequency: 2,
    waveAmplitude: 0.22,
    waveColor: [0.35, 0.08, 0.06],
    colorNum: 4,
    pixelSize: 3,
    opacity: 0.55,
    mouseInteraction: true,
    mouseRadius: 1,
    mouseDampening: 0.12,
  };

  App.Dither = Dither;
})(window.EasyLips);
