/**
 * 悬浮导航滚动状态切换
 *
 * 监听页面滚动，根据滚动距离切换 #site-nav 的 data-scrolled 属性，
 * 配合 .site-nav 的 CSS 状态样式实现：
 * - 顶部时背景更透、阴影弱（融入 Hero）
 * - 滚动后背景更实、阴影强（强化悬浮感）
 *
 * 用 rAF 节流避免 scroll 事件高频触发造成的性能问题；
 * passive 监听器不阻塞滚动。
 */
(function () {
  var nav = document.getElementById('site-nav');
  if (!nav) return;

  // 滚动超过该阈值才切换状态，避免微小抖动导致频繁切换
  var THRESHOLD = 8;
  var ticking = false;

  function update() {
    ticking = false;
    var scrolled = window.scrollY > THRESHOLD;
    // 只在状态变化时写 DOM，减少不必要的属性更新
    if (nav.getAttribute('data-scrolled') !== String(scrolled)) {
      nav.setAttribute('data-scrolled', String(scrolled));
    }
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // 首次进入页面可能已停在滚动位置（如刷新后），同步一次初始状态
  update();
})();
