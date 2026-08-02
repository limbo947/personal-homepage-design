/**
 * 站点数据结构类型定义
 *
 * 集中声明所有展示数据的形状，让配置文件与组件之间形成契约：
 * 组件按类型消费数据，配置修改时编译器即可定位遗漏或拼写错误，
 * 避免硬编码时代改一处忘一处的回归问题。
 */

/** 站点基础元信息：用于 <head> 与页头品牌区 */
export interface SiteMeta {
  title: string;
  description: string;
  author: string;
  favicon?: string;
  url?: string;
}

/** 顶部导航菜单项 */
export interface NavItem {
  href: string;
  label: string;
}

/** Hero 区统计数字 */
export interface HeroStat {
  value: string;
  label: string;
}

/**
 * Hero 区社交链接
 *
 * 品牌图标（GitHub/LinkedIn 等）lucide 已移除，需用内联 SVG path；
 * 通用图标仍走 lucide 的 data-lucide 方式，故 svg 与 icon 二选一。
 */
export interface HeroSocial {
  label: string;
  href: string;
  icon?: string;
  svg?: string;
}

/** Hero 区主按钮 */
export interface HeroAction {
  text: string;
  href: string;
}

/** Hero 区配置 */
export interface HeroConfig {
  badgeText: string;
  title: string;
  subtitle: string;
  image?: string;
  description: string;
  skills: string[];
  stats: HeroStat[];
  socials: HeroSocial[];
  primaryAction: HeroAction;
}

/** 项目卡片数据 */
export interface ProjectItem {
  title: string;
  desc: string;
  lang: string;
  stars: string;
  year: string;
  license: string;
  url?: string;
}

/** 上线网站卡片数据 */
export interface SiteItem {
  icon: string;
  tag: string;
  title: string;
  desc: string;
  url?: string;
}

/** 文章卡片数据 */
export interface ArticleItem {
  icon: string;
  category: string;
  title: string;
  desc: string;
  date: string;
  url?: string;
}

/** 页脚备案信息（部署在国内服务器时合规必需） */
export interface FooterRecord {
  label: string;
  url: string;
}

/** 页脚配置 */
export interface FooterConfig {
  motto: string;
  startYear?: number;
  icp?: FooterRecord[];
}

/**
 * 单组语义配色（6 色）
 * 仅暴露语义关键色，50-900 色阶由 theme-derive.js 从主色派生
 */
export interface ThemePalette {
  background: string;
  foreground: string;
  card: string;
  border: string;
  primary: string;
  accent: string;
  grid: string;
}

/** 主题配置：明/暗两组独立调色 */
export interface ThemeConfig {
  light: ThemePalette;
  dark: ThemePalette;
}

/** 站点完整配置的聚合类型 */
export interface SiteConfig {
  site: SiteMeta;
  nav: NavItem[];
  hero: HeroConfig;
  projects: ProjectItem[];
  sites: SiteItem[];
  articles: ArticleItem[];
  footer: FooterConfig;
  theme?: ThemeConfig;
}

/**
 * 默认空配置兜底
 *
 * 未来若改为运行时从远程加载配置（如 GitHub API、CMS），
 * 加载失败时可用此对象避免页面渲染崩溃；
 * 当前静态构建场景下作为字段缺失时的安全底值。
 */
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  site: {
    title: '个人主页',
    description: '',
    author: '',
    favicon: '/favicon.png',
  },
  nav: [],
  hero: {
    badgeText: '',
    title: '',
    subtitle: '',
    image: '',
    description: '',
    skills: [],
    stats: [],
    socials: [],
    primaryAction: { text: '', href: '#' },
  },
  projects: [],
  sites: [],
  articles: [],
  footer: {
    motto: '',
    startYear: new Date().getFullYear(),
    icp: [],
  },
  theme: {
    light: {
      background: '#faf8f5',
      foreground: '#26221d',
      card: '#ffffff',
      border: '#e4ded4',
      primary: '#1a8c8c',
      accent: '#b0631b',
      grid: '#e4ded4',
    },
    dark: {
      background: '#1a1714',
      foreground: '#f2eee8',
      card: '#26221d',
      border: '#3a352e',
      primary: '#4cbfbd',
      accent: '#e29744',
      grid: '#3a352e',
    },
  },
};
