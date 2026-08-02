/**
 * 主题色阶派生
 *
 * 从一个主色 hex 派生 9 档色阶（50/100/.../900），生成完整调色板。
 * 算法：hex → HSL，按档位调整亮度 L（亮档提高 L，深档降低 L），保持 H、S 大体不变。
 *
 * 同时派生中性色阶（从中性 900 = 前景色派生），用于浅背景/边框等。
 *
 * 导出 window.themeDerive，由 DefaultLayout.astro（SSG）和 theme-apply.js（dev）共同使用。
 */
(function () {
  /** hex (#rgb / #rrggbb) → {h,s,l} 三元组，h/s/l 均为 0-1 */
  function hexToHsl(hex) {
    var m = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (m) hex = '#' + m[1] + m[1] + m[2] + m[2] + m[3] + m[3];
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return { h: h, s: s, l: l };
  }

  /** hsl → hex（无 alpha） */
  function hslToHex(h, s, l) {
    var r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    var toHex = function (x) {
      var v = Math.round(x * 255).toString(16);
      return v.length === 1 ? '0' + v : v;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }

  /**
   * 派生主色 50-900 色阶
   * 基准：原色对应 600 档，50 最浅，900 最深
   */
  function derivePrimaryScale(primaryHex) {
    var base = hexToHsl(primaryHex);
    // 各档目标亮度（经验值，向纯白/纯黑逼近）
    var lightnessByStop = {
      50: 0.97, 100: 0.93, 200: 0.86, 300: 0.74, 400: 0.62,
      500: 0.52, 600: base.l, 700: Math.max(0.30, base.l - 0.10),
      800: Math.max(0.22, base.l - 0.18), 900: Math.max(0.16, base.l - 0.24)
    };
    var out = {};
    for (var stop in lightnessByStop) {
      // 高亮档降低饱和度避免过艳，深档略提饱和避免发灰
      var s = base.s;
      if (+stop <= 300) s = base.s * 0.85;
      out[stop] = hslToHex(base.h, s, lightnessByStop[stop]);
    }
    return out;
  }

  /**
   * 派生中性色阶（暖灰）
   * 基准：前景色对应 900 档，50 最浅
   */
  function deriveNeutralScale(foregroundHex) {
    var base = hexToHsl(foregroundHex);
    var lightnessByStop = {
      50: 0.97, 100: 0.93, 200: 0.86, 300: 0.74, 400: 0.62,
      500: 0.52, 600: 0.42, 700: 0.34, 800: 0.26, 900: base.l
    };
    var out = {};
    for (var stop in lightnessByStop) {
      out[stop] = hslToHex(base.h, base.s * 0.5, lightnessByStop[stop]);
    }
    return out;
  }

  /**
   * 派生点缀色色阶
   * 与主色同算法，独立调用以保持暖色调性
   */
  function deriveAccentScale(accentHex) {
    return derivePrimaryScale(accentHex);
  }

  /**
   * 把一个 palette（6 色）+ 派生色阶写入 CSS 变量
   * target = ':root' 或 '.dark'
   */
  function applyPalette(root, scope, palette) {
    var p = derivePrimaryScale(palette.primary);
    var n = deriveNeutralScale(palette.foreground);
    var a = deriveAccentScale(palette.accent);
    var set = function (name, val) {
      root.style.setProperty('--personal-' + name, val);
    };
    // 语义关键色
    set('background', palette.background);
    set('foreground', palette.foreground);
    set('card', palette.card);
    set('border', palette.border);
    set('grid', palette.grid);
    set('primary', palette.primary);
    set('primary-foreground', palette.card);
    set('accent', palette.accent);
    set('accent-foreground', palette.card);
    set('surface', palette.card);
    set('muted', palette.background);
    set('muted-foreground', n[500]);
    // 主色阶
    for (var s in p) set('primary-' + s, p[s]);
    // 中性色阶
    for (var k in n) set('neutral-' + k, n[k]);
    // 点缀色阶
    for (var ka in a) set('accent-' + ka, a[ka]);
  }

  window.themeDerive = {
    hexToHsl: hexToHsl,
    hslToHex: hslToHex,
    derivePrimaryScale: derivePrimaryScale,
    deriveNeutralScale: deriveNeutralScale,
    deriveAccentScale: deriveAccentScale,
    applyPalette: applyPalette
  };
})();
