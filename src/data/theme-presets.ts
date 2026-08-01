/**
 * 预设色板：一组完整主题方案，点击后同时覆盖 light/dark 多个字段
 *
 * 独立成模块的原因：frontmatter（服务端模板渲染）与 <script>（客户端交互）
 * 都需要访问同一份数据。Astro 的 define:vars 仅支持 is:inline 脚本，
 * 模块脚本引用 frontmatter 常量会因未定义而报错，
 * 故抽出为共享模块，两端 import 同一来源，避免双份定义漂移。
 */

export interface ThemePreset {
  name: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: '原版青绿',
    light: { background: '#faf8f5', foreground: '#26221d', card: '#ffffff', border: '#e4ded4', primary: '#1a8c8c', accent: '#b0631b' },
    dark:  { background: '#1a1714', foreground: '#f2eee8', card: '#26221d', border: '#3a352e', primary: '#4cbfbd', accent: '#e29744' }
  },
  {
    name: '海洋蓝',
    light: { background: '#f6f9fc', foreground: '#1e293b', card: '#ffffff', border: '#dbe4ef', primary: '#2563eb', accent: '#db2777' },
    dark:  { background: '#0f172a', foreground: '#e2e8f0', card: '#1e293b', border: '#334155', primary: '#60a5fa', accent: '#f472b6' }
  },
  {
    name: '森林墨绿',
    light: { background: '#f5f7f2', foreground: '#1f2a1c', card: '#ffffff', border: '#dde5d6', primary: '#15803d', accent: '#a16207' },
    dark:  { background: '#141a12', foreground: '#e8efe2', card: '#1f2a1c', border: '#2f3b2a', primary: '#4ade80', accent: '#fbbf24' }
  },
  {
    name: '紫罗兰',
    light: { background: '#faf8fc', foreground: '#2a1f3d', card: '#ffffff', border: '#e4dae8', primary: '#7c3aed', accent: '#db2777' },
    dark:  { background: '#17121f', foreground: '#ede2f2', card: '#2a1f3d', border: '#3a2f4d', primary: '#a78bfa', accent: '#f472b6' }
  },
  {
    name: '复古红棕',
    light: { background: '#faf5f0', foreground: '#2d1f15', card: '#ffffff', border: '#e8d9c9', primary: '#b91c1c', accent: '#92400e' },
    dark:  { background: '#1a1410', foreground: '#f0e4d6', card: '#2d1f15', border: '#3d2b1f', primary: '#f87171', accent: '#fbbf24' }
  },
  {
    // 莫兰迪色系：低饱和高灰调，静谧高级
    name: '莫兰迪雾蓝',
    light: { background: '#f5f3f0', foreground: '#3a3530', card: '#ffffff', border: '#e0dcd5', primary: '#B4C7E7', accent: '#D4C1D9' },
    dark:  { background: '#1f1d1a', foreground: '#e8e4df', card: '#2a2724', border: '#3a3530', primary: '#8FA8C9', accent: '#B4A0BF' }
  },
  {
    // 陶土赤陶：2026 流行撞色，暖橙 + 冷蓝绿
    name: '陶土赤陶',
    light: { background: '#faf6f2', foreground: '#3a2a20', card: '#ffffff', border: '#e8dcd0', primary: '#E07A5F', accent: '#3D5A80' },
    dark:  { background: '#1a1612', foreground: '#ede4dc', card: '#2a221c', border: '#3a2e26', primary: '#F0997A', accent: '#6B8AAB' }
  },
  {
    // WGSN 2026 年度色：柔和数字感紫色
    name: '数字薰衣草',
    light: { background: '#faf8fc', foreground: '#2a2438', card: '#ffffff', border: '#e4dae8', primary: '#9B59B6', accent: '#E8D5F2' },
    dark:  { background: '#18121f', foreground: '#ede2f2', card: '#241d2e', border: '#342a3e', primary: '#B57EDC', accent: '#D4BFE0' }
  },
  {
    // 潘通焙茶绿方向：柔和茶调 + 暖棕点缀
    name: '焙茶暖棕',
    light: { background: '#f5f3ee', foreground: '#2a2620', card: '#ffffff', border: '#e0dccd', primary: '#A9B6A7', accent: '#C19A6B' },
    dark:  { background: '#1a1814', foreground: '#e8e4dc', card: '#24221c', border: '#343028', primary: '#C2D0C0', accent: '#D4B080' }
  }
];
