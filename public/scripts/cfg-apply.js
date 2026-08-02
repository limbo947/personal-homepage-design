/**
 * 客户端配置覆盖脚本（同步加载，避免覆盖时文本闪烁）
 *
 * 工作原理：
 * 1. 启动时从 localStorage 读取覆盖对象（{ "hero.title": "新值", ... }）
 * 2. 查询页面中所有带 data-cfg="<路径>" 属性的元素
 * 3. 用覆盖值替换其 textContent
 *
 * 暴露 window.applyCfgOverrides 供编辑面板修改后实时刷新页面
 * 键名需与 src/data/config.ts 的 CFG_OVERRIDE_KEY 保持一致
 */
(function () {
  var STORAGE_KEY = 'site-cfg-overrides';

  function applyCfgOverrides() {
    var raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage 不可用（隐私模式等）时静默退出
      return;
    }
    if (!raw) return;

    var overrides;
    try {
      overrides = JSON.parse(raw);
    } catch (e) {
      console.warn('[cfg] 覆盖配置 JSON 解析失败，已忽略：', e);
      return;
    }

    // 扫描所有标记了 data-cfg 的元素，路径命中覆盖表则替换内容
    // img 元素改 src（图片字段），其他元素改 textContent（文本字段）
    var nodes = document.querySelectorAll('[data-cfg]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var path = el.getAttribute('data-cfg');
      if (!path) continue;
      if (Object.prototype.hasOwnProperty.call(overrides, path)) {
        var val = overrides[path];
        if (el.tagName === 'IMG') {
          // 图片字段：有值设 src 显示图片，空值移除 src 触发 CSS 回退到占位图标
          if (val === '') {
            el.removeAttribute('src');
            el.classList.add('hidden');
          } else {
            el.src = val;
            el.classList.remove('hidden');
          }
        } else {
          if (val === '') {
            // 空值隐藏元素，避免残留空框（如清空技能标签后不显示空 chip）
            el.setAttribute('hidden', '');
          } else {
            // 非空值恢复显示并替换文本（从隐藏恢复的情况）
            el.removeAttribute('hidden');
            el.textContent = val;
          }
        }
      } else {
        // 不在覆盖表中：
        // - SSG 元素（无 data-cfg-dynamic）恢复显示，因为 SSG 渲染了默认值
        // - 动态新增元素保持 hidden，因为值为空等待用户填写
        if (!el.hasAttribute('data-cfg-dynamic')) {
          el.removeAttribute('hidden');
        }
      }
    }

    // 项目卡片 url 覆盖：url 控制 <a> 的 href 与外链图标，无法用 textContent 替换，需单独处理
    // 有值则设 href 让卡片可点击跳转并显示外链图标，空值则移除 href 让卡片不可点击并隐藏图标
    var cards = document.querySelectorAll('[data-cfg-card]');
    for (var c = 0; c < cards.length; c++) {
      var card = cards[c];
      var cardPath = card.getAttribute('data-cfg-card');
      if (!cardPath) continue;
      var urlKey = cardPath + '.url';
      if (Object.prototype.hasOwnProperty.call(overrides, urlKey)) {
        var urlVal = overrides[urlKey];
        var linkIcon = card.querySelector('[data-cfg-link-icon]');
        if (urlVal) {
          card.setAttribute('href', urlVal);
          card.setAttribute('target', '_blank');
          card.setAttribute('rel', 'noopener noreferrer');
          if (linkIcon) linkIcon.classList.remove('hidden');
        } else {
          card.removeAttribute('href');
          card.removeAttribute('target');
          card.removeAttribute('rel');
          if (linkIcon) linkIcon.classList.add('hidden');
        }
      }
    }

    // 级联隐藏：检查所有 data-cfg-row 容器，若其内部所有 data-cfg 元素都已 hidden，
    // 则隐藏整个 row（如清空项目所有字段后整张卡片消失，清空 lang 后图标+文本整行消失）
    var rows = document.querySelectorAll('[data-cfg-row]');
    for (var j = 0; j < rows.length; j++) {
      var row = rows[j];
      var innerCfgs = row.querySelectorAll('[data-cfg]');
      if (innerCfgs.length === 0) continue;
      var allHidden = true;
      for (var k = 0; k < innerCfgs.length; k++) {
        if (!innerCfgs[k].hasAttribute('hidden')) {
          allHidden = false;
          break;
        }
      }
      if (allHidden) {
        row.setAttribute('hidden', '');
      } else {
        row.removeAttribute('hidden');
      }
    }
  }

  // 暴露给编辑面板调用，实现「改完即时刷新」
  window.applyCfgOverrides = applyCfgOverrides;

  // DOM 就绪后立即应用一次；readyState 已是 interactive/complete 时直接执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCfgOverrides);
  } else {
    applyCfgOverrides();
  }
})();
