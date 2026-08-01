/**
 * 站点配置入口
 *
 * 数据源为同目录的 config.yaml，可视化更直观；
 * 此处负责解析 YAML + 类型断言 + 默认兜底，
 * 让组件层仍以 typed SiteConfig 形式 import，无需关心数据源格式。
 */

import { load } from 'js-yaml';
// 配置文件放在项目根目录，方便非组件层级的快速修改
import rawConfig from '../../config.yaml?raw';
import type { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from '../types';

let parsed: unknown;
try {
  parsed = load(rawConfig);
} catch (err) {
  // YAML 语法错误时退回空配置，避免构建硬失败（错误信息仍会打印到控制台）
  console.error('[config] 解析 config.yaml 失败，使用默认空配置兜底：', err);
  parsed = {};
}

/**
 * 合并默认配置：YAML 缺字段时用 DEFAULT_SITE_CONFIG 补齐，
 * 避免组件访问 undefined 字段导致渲染崩溃
 */
function mergeWithDefaults<T extends Record<string, unknown>>(base: T, override: unknown): T {
  if (!override || typeof override !== 'object') return base;
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    const overrideVal = (override as Record<string, unknown>)[key];
    if (overrideVal !== undefined) {
      // 嵌套对象递归合并；数组与原始值直接覆盖
      if (
        typeof base[key] === 'object' &&
        !Array.isArray(base[key]) &&
        typeof overrideVal === 'object' &&
        !Array.isArray(overrideVal)
      ) {
        result[key] = mergeWithDefaults(base[key] as Record<string, unknown>, overrideVal);
      } else {
        result[key] = overrideVal;
      }
    }
  }
  return result as T;
}

export const siteConfig: SiteConfig = mergeWithDefaults(DEFAULT_SITE_CONFIG, parsed);

/**
 * 客户端覆盖配置的 localStorage 键名
 *
 * 编辑面板写入此键，applyOverrides 脚本读取此键并覆盖 DOM；
 * 统一在此导出避免字符串拼写不一致
 */
export const CFG_OVERRIDE_KEY = 'site-cfg-overrides';
