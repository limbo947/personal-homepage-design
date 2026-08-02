/**
 * 主题覆盖应用脚本（仅 dev 期加载）
 *
 * 与 cfg-apply.js 类似，但专门处理 theme.* 路径的覆盖。
 * localStorage 中 theme 覆盖键为 'site-theme-overrides'，
 * 结构扁平：{ "theme.light.primary": "#xxx", "theme.dark.accent": "#xxx", ... }
 *
 * 应用逻辑：
 * 1. 读取 SSG 注入的初始 theme（<script id="theme-init"> 数据块）
 * 2. 合并 localStorage 中的覆盖
 * 3. 用 themeDerive 的派生算法生成 :root / .dark 的 CSS 变量规则并注入 style 元素
 *
 * 暴露 window.applyThemeOverrides 供 EditPanel 调用
 */
(function () {
  var STORAGE_KEY = 'site-theme-overrides';

  /** 从 SSG 注入的数据块读取初始主题（兜底为 DEFAULT_SITE_CONFIG 等效值） */
  function readBaseTheme() {
    var node = document.getElementById('theme-init');
    if (!node) return null;
    try {
      return JSON.parse(node.textContent || '{}');
    } catch (e) {
      return null;
    }
  }

  /** 读 localStorage 覆盖（容错：隐私模式或解析失败返回空对象） */
  function readOverrides() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      return JSON.parse(raw) || {};
    } catch (e) {
      return {};
    }
  }

  /** 从扁平覆盖表合并出完整 theme 对象（覆盖表 key 形如 "theme.light.primary"） */
  function mergeTheme(base, overrides) {
    if (!base) return null;
    var merged = JSON.parse(JSON.stringify(base));
    var walk = function (obj, prefix) {
      for (var k in obj) {
        var path = prefix ? prefix + '.' + k : k;
        if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
          walk(obj[k], path);
        } else if (Object.prototype.hasOwnProperty.call(overrides, 'theme.' + path)) {
          obj[k] = overrides['theme.' + path];
        }
      }
    };
    walk(merged, '');
    return merged;
  }

  /** 应用主题：合并 base + overrides 后写入 :root 和 .dark */
  function applyThemeOverrides() {
    var base = readBaseTheme();
    if (!base) return;
    var overrides = readOverrides();
    var theme = mergeTheme(base, overrides);
    if (!theme || !window.themeDerive) return;

    // 亮色写入 :root 规则，暗色写入 .dark 规则，两者都用 style 元素而非元素内联样式：
    // 内联样式特异性最高，会把 .dark 规则压死，导致暗色模式下仍显示亮色变量
    // 按 light → dark 顺序插入，保证暗色规则在后、同特异性下级联获胜
    if (theme.light) upsertStyle('theme-light-inline', buildPaletteCss(':root', theme.light));
    if (theme.dark) upsertStyle('theme-dark-inline', buildPaletteCss('.dark', theme.dark));
  }

  /** 创建或更新指定 id 的 style 元素，用于注入选择器内的变量覆盖 */
  function upsertStyle(id, css) {
    var style = document.getElementById(id);
    if (!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }

  /** 生成指定选择器内的变量覆盖 CSS（含派生色阶），供 :root 与 .dark 复用 */
  function buildPaletteCss(selector, palette) {
    if (!window.themeDerive) return '';
    var p = window.themeDerive.derivePrimaryScale(palette.primary);
    var n = window.themeDerive.deriveNeutralScale(palette.foreground);
    var a = window.themeDerive.deriveAccentScale(palette.accent);
    var isDark = selector === '.dark';
    var lines = [selector + ' {'];
    // 全部变量加 !important：Astro 的组件样式在 dev 期晚于本脚本注入，
    // 同级选择器下后加载者会覆盖运行时变量，加 important 保证运行时主题优先
    var decl = function (name, val) { lines.push('  --personal-' + name + ': ' + val + ' !important;'); };
    decl('background', palette.background);
    decl('foreground', palette.foreground);
    decl('card', palette.card);
    decl('border', palette.border);
    decl('grid', palette.grid);
    decl('primary', palette.primary);
    // 前景色取卡片色（亮色）或背景色（暗色提亮主色配深色按钮文字），
    // 与 global.css 的 :root / html.dark 定义保持一致，避免 dev/生产按钮文字色不同
    decl('primary-foreground', isDark ? palette.background : palette.card);
    decl('accent', palette.accent);
    decl('accent-foreground', isDark ? palette.background : palette.card);
    decl('surface', palette.card);
    decl('muted', palette.background);
    decl('muted-foreground', n[500]);
    for (var s in p) decl('primary-' + s, p[s]);
    for (var k in n) decl('neutral-' + k, n[k]);
    for (var ka in a) decl('accent-' + ka, a[ka]);
    lines.push('}');
    return lines.join('\n');
  }

  window.applyThemeOverrides = applyThemeOverrides;

  // 脚本在 head 中同步加载，theme-init 与 theme-derive.js 均在其之前解析完毕
  // 直接执行避免 FOUC；applyPalette 操作 document.documentElement，此时已可用
  applyThemeOverrides();
})();
