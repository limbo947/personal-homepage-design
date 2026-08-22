<div align="center">
  <h1>个人主页模板</h1>
  <p>
    一个配置驱动、可实时可视化编辑的个人主页模板。
  </p>
  <p>
    所有内容集中在 <code>config.yaml</code>，改文案不用进组件；
    dev 模式打开编辑面板即可增删改，一键固化回配置文件。
  </p>
  <p>
    <img src="https://img.shields.io/badge/Astro-7.1.6-BC52EE?style=flat-square&logo=astro&logoColor=white" alt="Astro" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.3.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node-%3E%3D22.12-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js >= 22.12" />
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License" />
  </p>
</div>

## 关于

基于 Astro 静态站点生成（SSG）模式的个人主页模板：当前首页由个人简介与精选项目组成（上线网站、近期文章板块已预留，在 `src/pages/index.astro` 中注释隐藏，需要时取消注释即可恢复）。全站内容由 `config.yaml` 驱动，dev 模式下所有字段都可在浏览器中可视化编辑并固化回配置文件。

改编自 [FlecHome](https://github.com/talen8/FlecHome)，将技术栈从 Nuxt 迁移到 Astro（默认零 JS、产物更轻量），并新增了设计 token 体系与可视化编辑面板。

## 特性

- **配置驱动** — 所有展示内容集中在根目录 `config.yaml`，改文案不用进组件
- **实时编辑** — dev 模式右下角齿轮按钮弹出面板，编辑/增删所有字段，一键固化回 YAML（AST 级写回，保留注释与排版）
- **主题配色编辑** — 6 语义色 × 明暗两组，9 套预设一键换肤，色阶由主色 HSL 自动派生
- **图片上传** — Hero 照片可在面板内上传（≤ 5MB，自动写入 `public/photos/`），也可从已有图库中选择；现有照片已转 WebP 压缩，体积约减 67%
- **设计 token** — 颜色/字号/间距/阴影以 `--personal-*` 变量集中管理，换肤不改组件
- **SEO 内建** — 自动生成 canonical / Open Graph / Twitter Card / JSON-LD，随附 `robots.txt` 与 `sitemap.xml`
- **轻量构建** — 纯静态产物（默认零 JS 渲染），部署简单、加载快速

## 技术栈

- [Astro](https://astro.build) — 静态站点生成
- [Tailwind CSS v4](https://tailwindcss.com) — 样式，本地构建
- TypeScript — 类型安全的配置数据结构
- [Lucide](https://lucide.dev) — 图标库
- js-yaml / yaml — 配置解析与 dev 期 AST 级编辑

## 环境要求

- **Node.js ≥ 22.12**（`package.json` 的 `engines` 声明）。仓库已带 `.nvmrc`（`22`），使用 nvm 时执行 `nvm use` 即可自动切换到对应版本。

## 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 开发，访问 http://localhost:4321
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果
```

## 配置说明

编辑项目根目录的 `config.yaml` 来定制站点内容：

```yaml
# 站点基础信息
site:
  title: 个人主页
  description: 站点描述
  author: 你的名字
  url: https://example.com     # 站点绝对地址（SEO canonical / Open Graph 依赖，必填）

# 首页首屏
hero:
  badgeText: VibeCoding
  title: 你的名字
  subtitle: 前景可待 · 未来可期
  image: ''                    # 首屏照片，留空显示占位图标
  skills: [Vue.js, TypeScript]
  stats:                       # 统计数字
    - value: '4'
      label: 精选项目

# 精选项目 / 上线网站 / 近期文章
projects: []
sites: []
articles: []

# 页脚
footer:
  motto: 页脚格言
  icp: []                      # 备案信息（国内部署时补充）

# 主题配色（light / dark 各 6 语义色）
theme:
  light:
    primary: '#1a8c8c'
```

> 完整字段见根目录 `config.yaml`；修改默认配色只需改 `theme` 块，色阶会自动派生。

## 实时编辑（dev only）

页面右下角齿轮按钮弹出编辑面板：

- **编辑** — 修改字段后点「保存并应用」即时刷新，覆盖值存 `localStorage`，仅影响当前浏览器
- **增删** — 数组分组支持添加/删除项目、站点、文章、技能；删除数组项会经 dev server 直接写回 `config.yaml`（自动收缩数组，后续项索引前移）
- **固化** — 点软盘按钮把当前所有修改 AST 级写回 `config.yaml`（保留注释与排版），Vite HMR 自动刷新

**图片上传**：Hero 照片字段可选本地文件上传（≤ 5MB，扩展名限 png/jpg/webp/gif/svg），或从已有图库中挑选；路径自动回填，固化后随构建打包。

**主题配色**：顶部「配色预设」一键切换整套主题（9 套），下方「配色·亮色/暗色」可精细微调 6 个语义色；生产环境由 `theme-apply.js` 应用 config.yaml 主题，无需重新构建。

> 编辑面板相关端点（`/__save_cfg`、`/__delete_cfg_item`、`/__upload_image`、`/__list_photos`）由 Vite 插件 `scripts/cfg-writer-plugin.mjs` 仅在 dev server 挂载，生产构建不参与打包。

## 部署

```bash
npm run build
```

将 `dist/` 目录托管到任意静态服务（Vercel、Cloudflare Pages、Nginx 等）即可。

**本项目使用 EdgeOne Pages 部署**：GitHub 集成后，推送代码到 `main` 分支即自动拉取并执行 `npm run build` 部署到生产环境（无需手动上传 `dist/`），自定义域名 `ysalo.cn` / `www.ysalo.cn`。

## 目录结构

```
config.yaml               # 站点集中配置（文案/项目/文章/导航/主题配色…改这里即可）
design.md                 # 设计规范文档（视觉风格/设计令牌/组件规格）
astro.config.mjs          # Astro + Tailwind v4 Vite 插件 + cfgWriterPlugin（dev 端点）
scripts/
└── cfg-writer-plugin.mjs # Vite 插件：dev server 暴露 YAML 写入/删除/图片上传端点
src/
├── pages/                # 路由（新增 .astro 即新页面）
├── layouts/              # 页面骨架（DefaultLayout）
├── components/           # 可复用组件（含 EditPanel 编辑面板）
├── data/config.ts        # YAML 解析 + 默认兜底，导出 typed siteConfig
├── data/theme-presets.ts # 预设色板共享模块
├── types/index.ts        # 配置数据结构类型定义
└── styles/global.css     # 设计 token + Tailwind 入口
public/
├── fonts/                # 自托管字体
├── photos/               # 上传图片存放处（当前为 WebP 格式）
├── scripts/              # 客户端脚本（覆盖/滚动/主题应用）
├── robots.txt            # 搜索引擎抓取规则
└── sitemap.xml           # 站点地图
```

## 许可证

[MIT License](LICENSE)

## 致谢

本项目改编自 [FlecHome](https://github.com/talen8/FlecHome)，感谢其提供的配置驱动等基础思路。
