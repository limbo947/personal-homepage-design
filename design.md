# 个人主页设计文档

> 本文档为个人主页项目的视觉与组件设计规范，作为开发团队实施与维护的统一参考。
> 所有取值与组件结构均来源于项目实际代码（`src/styles/global.css`、`config.yaml`、`src/components/`）。

---

## 目录

- [1. 设计理念与视觉风格](#1-设计理念与视觉风格)
  - [1.1 设计理念](#11-设计理念)
  - [1.2 视觉风格关键词](#12-视觉风格关键词)
  - [1.3 设计原则](#13-设计原则)
- [2. 色彩方案](#2-色彩方案)
  - [2.1 语义色（亮色 / 暗色）](#21-语义色亮色--暗色)
  - [2.2 主色阶（青绿）](#22-主色阶青绿)
  - [2.3 中性色阶（暖灰）](#23-中性色阶暖灰)
  - [2.4 点缀色阶（暖橙）](#24-点缀色阶暖橙)
  - [2.5 状态色](#25-状态色)
  - [2.6 主题预设](#26-主题预设)
- [3. 字体系统](#3-字体系统)
  - [3.1 字体家族](#31-字体家族)
  - [3.2 字号阶梯](#32-字号阶梯)
  - [3.3 字重](#33-字重)
  - [3.4 行高](#34-行高)
- [4. 设计令牌总览](#4-设计令牌总览)
  - [4.1 间距](#41-间距)
  - [4.2 圆角](#42-圆角)
  - [4.3 阴影](#43-阴影)
  - [4.4 控件尺寸](#44-控件尺寸)
  - [4.5 命名规范](#45-命名规范)
- [5. UI 组件规格](#5-ui-组件规格)
  - [5.1 按钮](#51-按钮)
  - [5.2 表单控件](#52-表单控件)
  - [5.3 导航栏](#53-导航栏)
  - [5.4 卡片](#54-卡片)
  - [5.5 标签 / 徽章](#55-标签--徽章)
  - [5.6 浮动面板（弹窗）](#56-浮动面板弹窗)
  - [5.7 浮动按钮（FAB）](#57-浮动按钮fab)
  - [5.8 Toast 提示](#58-toast-提示)
  - [5.9 Hero 首屏](#59-hero-首屏)
  - [5.10 页脚](#510-页脚)
- [6. 动效与无障碍](#6-动效与无障碍)
  - [6.1 过渡动画](#61-过渡动画)
  - [6.2 装饰动画](#62-装饰动画)
  - [6.3 无障碍](#63-无障碍)

---

## 1. 设计理念与视觉风格

### 1.1 设计理念

本项目以「**温润、克制、有温度**」为核心，将一位前端工程师的个人主页塑造为一张安静而精致的数字名片。整体设计避免冷峻的科技感与饱和度过高的视觉冲击，转而采用暖色调、柔和的阴影与圆角，营造出类似纸本笔记的亲切氛围。

配色采用「**暖纸底色 + 青绿主色 + 暖橙点缀**」的三色结构。青绿传递沉静与专业感，暖橙用于关键交互的视觉引导，暖纸底色则统一全局氛围，让长时间阅读不显疲劳。

### 1.2 视觉风格关键词

| 维度     | 关键词                         |
| -------- | ------------------------------ |
| 氛围     | 暖纸感、柔和、安静、有温度     |
| 色彩     | 暖中性、青绿主色、暖橙点缀     |
| 形状     | 圆角为主、避免硬边             |
| 阴影     | 极浅、暖棕调、悬浮感           |
| 字体     | 单一字族（霞鹜文楷）、人文气息 |
| 交互     | 克制、顺滑、状态明确           |
| 暗色模式 | 暖黑底色、色阶整体提亮一档     |

### 1.3 设计原则

1. **Token 优先**：所有颜色、字号、间距、圆角、阴影均通过 CSS 变量（`--personal-*`）定义，组件直接消费令牌，禁止硬编码自造值。
2. **明暗对偶**：每个语义色与色阶均提供亮色 / 暗色两套取值，组件无需为暗色单独适配即可工作。
3. **配置驱动**：所有展示内容由 `config.yaml` 集中管理，组件只负责渲染，确保数据与表现分离。
4. **克制装饰**：装饰元素（网格、点阵、光晕、浮动图标）服务于氛围而非信息，透明度控制在 40%–70% 之间，避免喧宾夺主。
5. **无障碍内置**：焦点环、`prefers-reduced-motion` 支持、ARIA 标签为默认行为，而非额外补丁。

---

## 2. 色彩方案

色彩系统分为三层：**语义色**（直接表达背景/前景/主色等含义）、**色阶**（9 档供组件按需取用）、**状态色**（success/warning/error/info）。

### 2.1 语义色（亮色 / 暗色）

| 令牌                       | 亮色       | 暗色       | 用途                       |
| -------------------------- | ---------- | ---------- | -------------------------- |
| `--personal-background`    | `#faf8f5`  | `#1a1714`  | 页面底色（暖纸 / 暖黑）    |
| `--personal-foreground`    | `#26221d`  | `#f2eee8`  | 正文色                     |
| `--personal-card`          | `#ffffff`  | `#26221d`  | 卡片表面 / 表面层          |
| `--personal-muted`         | `#f2eee8`  | `#2e2922`  | 弱化背景                   |
| `--personal-muted-foreground` | `#847a6b` | `#a89e8e` | 弱化文字（neutral-500）   |
| `--personal-border`        | `#e4ded4`  | `#3a352e`  | 分隔线 / 描边              |
| `--personal-grid`          | `#e4ded4`  | `#3a352e`  | Hero 背景网格 / 点阵       |
| `--personal-primary`       | `#1a8c8c`  | `#4cbfbd`  | 主色（青绿）               |
| `--personal-primary-foreground` | `#ffffff` | `#1a1714` | 主色上的前景文字         |
| `--personal-accent`        | `#b0631b`  | `#e29744`  | 点缀色（暖橙）             |
| `--personal-accent-foreground`  | `#ffffff` | `#1a1714` | 点缀色上的前景文字       |
| `--personal-surface`       | `#ffffff`  | `#26221d`  | 表面层（等同 card）        |

### 2.2 主色阶（青绿）

主色阶由 [theme-derive.js](file:///d:/workspace/mine/public/scripts/theme-derive.js) 从 `primary` 通过 HSL 亮度调整派生，亮色与暗色互为反转（亮色 50 最浅、900 最深；暗色 50 最深、900 最浅）。

| 档位  | 亮色       | 暗色       |
| ----- | ---------- | ---------- |
| `50`  | `#f0fbfa`  | `#1c4c4c`  |
| `100` | `#d6f3f1`  | `#1c5b5b`  |
| `200` | `#aee7e4`  | `#1a7272`  |
| `300` | `#7dd6d3`  | `#1a8c8c`  |
| `400` | `#4cbfbd`  | `#2aa7a6`  |
| `500` | `#2aa7a6`  | `#4cbfbd`  |
| `600` | `#1a8c8c`  | `#7dd6d3`  |
| `700` | `#1a7272`  | `#aee7e4`  |
| `800` | `#1c5b5b`  | `#d6f3f1`  |
| `900` | `#1c4c4c`  | `#f0fbfa`  |

### 2.3 中性色阶（暖灰）

中性色阶由 `foreground` 派生，保持轻微暖色调，避免冷灰带来的疏离感。

| 档位  | 亮色       | 暗色       |
| ----- | ---------- | ---------- |
| `50`  | `#faf8f5`  | `#26221d`  |
| `100` | `#f2eee8`  | `#2e2922`  |
| `200` | `#e4ded4`  | `#3a352e`  |
| `300` | `#cdc4b6`  | `#524b41`  |
| `400` | `#a89e8e`  | `#6a6155`  |
| `500` | `#847a6b`  | `#847a6b`  |
| `600` | `#6a6155`  | `#a89e8e`  |
| `700` | `#524b41`  | `#cdc4b6`  |
| `800` | `#3a352e`  | `#e4ded4`  |
| `900` | `#26221d`  | `#f2eee8`  |

### 2.4 点缀色阶（暖橙）

| 档位  | 亮色       | 暗色       |
| ----- | ---------- | ---------- |
| `50`  | `#fdf6ee`  | `#613419`  |
| `100` | `#faead4`  | `#733e1a`  |
| `200` | `#f3d2a8`  | `#8c4c19`  |
| `300` | `#ecb471`  | `#b0631b`  |
| `400` | `#e29744`  | `#cf7e25`  |
| `500` | `#cf7e25`  | `#e29744`  |
| `600` | `#b0631b`  | `#ecb471`  |
| `700` | `#8c4c19`  | `#f3d2a8`  |
| `800` | `#733e1a`  | `#faead4`  |
| `900` | `#613419`  | `#fdf6ee`  |

### 2.5 状态色

| 状态     | 令牌                         | 亮色       | 暗色       | 浅底令牌                     | 亮色浅底   | 暗色浅底   |
| -------- | ---------------------------- | ---------- | ---------- | ---------------------------- | ---------- | ---------- |
| Success  | `--personal-success-500`     | `#3a9a4c`  | `#5cc876`  | `--personal-success-100`     | `#dcf1de`  | `#1c4c2e`  |
| Warning  | `--personal-warning-500`     | `#d17f1f`  | `#e29744`  | `--personal-warning-100`     | `#faebcf`  | `#4c3a1c`  |
| Error    | `--personal-error-500`       | `#cd5046`  | `#e26656`  | `--personal-error-100`       | `#fae3e1`  | `#4c1c1a`  |
| Info     | `--personal-info-500`        | `#2a7cbb`  | `#5aa8e8`  | `--personal-info-100`        | `#d6eaf7`  | `#1c2e4c`  |

### 2.6 主题预设

项目内置 9 套完整主题预设（亮色 + 暗色各 7 个语义色），定义于 [theme-presets.ts](file:///d:/workspace/mine/src/data/theme-presets.ts)。

| 预设名称     | 主色基调           | 点缀色基调       |
| ------------ | ------------------ | ---------------- |
| 原版青绿     | 青绿 `#1a8c8c`     | 暖橙 `#b0631b`   |
| 海洋蓝       | 蓝 `#2563eb`       | 品红 `#db2777`   |
| 森林墨绿     | 绿 `#15803d`       | 琥珀 `#a16207`   |
| 紫罗兰       | 紫 `#7c3aed`       | 品红 `#db2777`   |
| 复古红棕     | 红 `#b91c1c`       | 棕 `#92400e`     |
| 莫兰迪雾蓝   | 雾蓝 `#B4C7E7`     | 雾紫 `#D4C1D9`   |
| 陶土赤陶     | 赤陶 `#E07A5F`     | 蓝 `#3D5A80`     |
| 数字薰衣草   | 薰衣草 `#9B59B6`   | 淡紫 `#E8D5F2`   |
| 焙茶暖棕     | 茶绿 `#A9B6A7`     | 棕 `#C19A6B`     |

预设用于编辑面板一键切换整套主题，切换后用户可继续微调单色字段。

---

## 3. 字体系统

### 3.1 字体家族

项目仅使用一种自托管字体，离线可用，避免 CDN 依赖。

| 令牌                    | 字体栈                                                             | 用途       |
| ----------------------- | ------------------------------------------------------------------ | ---------- |
| `--personal-font-display` | `'LXGW WenKai Lite', ui-sans-serif, system-ui, sans-serif`       | 大标题     |
| `--personal-font-heading` | `'LXGW WenKai Lite', ui-sans-serif, system-ui, sans-serif`       | 各级标题   |
| `--personal-font-body`    | `'LXGW WenKai Lite', ui-sans-serif, system-ui, ...Apple-system...` | 正文       |
| `--personal-font-mono`    | `'JetBrains Mono', ui-monospace, monospace`                       | 等宽（代码） |

字体文件位置：[public/fonts/LXGWWenKaiLite-Medium.woff2](file:///d:/workspace/mine/public/fonts/LXGWWenKaiLite-Medium.woff2)

### 3.2 字号阶梯

| 令牌                           | 取值    | 用途         |
| ------------------------------ | ------- | ------------ |
| `--personal-font-size-display` | `48px`  | 首屏大标题   |
| `--personal-font-size-h1`      | `36px`  | 一级标题     |
| `--personal-font-size-h2`      | `28px`  | 二级标题     |
| `--personal-font-size-h3`      | `22px`  | 三级标题     |
| `--personal-font-size-h4`      | `18px`  | 四级标题     |
| `--personal-font-size-body`    | `16px`  | 正文         |
| `--personal-font-size-lead`    | `18px`  | 引导文       |
| `--personal-font-size-caption` | `12px`  | 辅助说明     |
| `--personal-font-size-mono`    | `14px`  | 等宽文字     |

### 3.3 字重

| 令牌                              | 取值 | 用途          |
| --------------------------------- | ---- | ------------- |
| `--personal-font-weight-display`  | `700` | 首屏大标题   |
| `--personal-font-weight-h1`       | `700` | 一级标题     |
| `--personal-font-weight-h2`       | `600` | 二级标题     |
| `--personal-font-weight-h3`       | `600` | 三级标题     |
| `--personal-font-weight-h4`       | `600` | 四级标题     |
| `--personal-font-weight-body`     | `400` | 正文         |
| `--personal-font-weight-lead`     | `400` | 引导文       |
| `--personal-font-weight-caption`  | `400` | 辅助说明     |
| `--personal-font-weight-mono`     | `400` | 等宽文字     |

### 3.4 行高

| 令牌                                | 取值   | 用途          |
| ----------------------------------- | ------ | ------------- |
| `--personal-line-height-display`    | `1.15` | 首屏大标题   |
| `--personal-line-height-h1`         | `1.25` | 一级标题     |
| `--personal-line-height-h2`         | `1.3`  | 二级标题     |
| `--personal-line-height-h3`         | `1.4`  | 三级标题     |
| `--personal-line-height-h4`         | `1.45` | 四级标题     |
| `--personal-line-height-body`       | `1.7`  | 正文         |
| `--personal-line-height-lead`       | `1.7`  | 引导文       |
| `--personal-line-height-caption`    | `1.5`  | 辅助说明     |
| `--personal-line-height-mono`       | `1.6`  | 等宽文字     |

---

## 4. 设计令牌总览

### 4.1 间距

采用 4px 基准网格，8 档间距覆盖从组件内部到区块之间的所有场景。

| 令牌                | 取值    | 典型用途               |
| ------------------- | ------- | ---------------------- |
| `--personal-space-1` | `4px`  | 图标与文字间隙         |
| `--personal-space-2` | `8px`  | 紧凑型组件内部 padding |
| `--personal-space-3` | `12px` | 标签 / 小按钮 padding  |
| `--personal-space-4` | `16px` | 常规组件内部 padding   |
| `--personal-space-5` | `24px` | 卡片之间 gap           |
| `--personal-space-6` | `32px` | 区块内部纵向间距       |
| `--personal-space-7` | `48px` | 区块之间纵向间距       |
| `--personal-space-8` | `64px` | 大区块之间纵向间距     |

### 4.2 圆角

| 令牌                    | 取值     | 用途                          |
| ----------------------- | -------- | ----------------------------- |
| `--personal-radius-sm`  | `6px`    | 小按钮、标签、输入框          |
| `--personal-radius-md`  | `8px`    | 卡片、中等按钮                |
| `--personal-radius-lg`  | `12px`   | 大卡片、面板容器              |
| `--personal-radius-full`| `9999px` | 圆形按钮、圆形徽章、脉冲点    |

### 4.3 阴影

阴影统一使用暖棕色调 `rgba(38, 34, 29, ...)`（暗色模式切换为黑色），避免冷灰阴影破坏暖色氛围。

| 令牌                            | 亮色取值                                       | 暗色取值                                       | 用途             |
| ------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ---------------- |
| `--personal-shadow-card`        | `0 1px 2px rgba(38,34,29,0.05)`                | `0 1px 2px rgba(0,0,0,0.3)`                    | 卡片默认         |
| `--personal-shadow-card-hover`  | `0 2px 6px -1px rgba(38,34,29,0.07)`           | `0 2px 6px -1px rgba(0,0,0,0.4)`               | 卡片悬停         |
| `--personal-shadow-float`       | `0 4px 12px -3px rgba(38,34,29,0.10)`          | `0 4px 12px -3px rgba(0,0,0,0.5)`              | 浮动导航、FAB    |
| `--personal-shadow-modal`       | `0 8px 24px -6px rgba(38,34,29,0.14)`          | `0 8px 24px -6px rgba(0,0,0,0.6)`              | 弹窗、抽屉       |
| `--personal-shadow-overlay`     | `0 16px 40px -10px rgba(38,34,29,0.18)`        | `0 16px 40px -10px rgba(0,0,0,0.7)`            | 全屏遮罩上层     |

### 4.4 控件尺寸

| 令牌                          | 取值    | 用途               |
| ----------------------------- | ------- | ------------------ |
| `--personal-size-button-sm`   | `32px`  | 小按钮高度         |
| `--personal-size-button-md`   | `40px`  | 中按钮 / 输入框    |
| `--personal-size-button-lg`   | `48px`  | 大按钮 / 主 CTA    |
| `--personal-size-input`       | `40px`  | 输入框高度         |
| `--personal-size-icon-sm`     | `16px`  | 小图标             |
| `--personal-size-icon-md`     | `20px`  | 中图标（默认）     |
| `--personal-size-icon-lg`     | `24px`  | 大图标             |

### 4.5 命名规范

- **品牌前缀**：所有令牌统一使用 `--personal-` 前缀，避免与第三方库冲突。
- **语义命名**：优先按用途命名（`background` / `foreground` / `card` / `border`），而非按色相命名。
- **色阶命名**：`{role}-{stop}`，stop 取 50/100/200/.../900。
- **Tailwind 桥接**：通过 `@theme inline` 将 `--personal-*` 映射到 Tailwind 的 `--color-*` 命名空间，使 `bg-background` / `text-primary` / `border-border` 等工具类生效。

---

## 5. UI 组件规格

### 5.1 按钮

项目按钮分为三种主要样式：**主按钮**（实心填充）、**次按钮**（描边）、**图标按钮**（圆形 / 方形）。尺寸分 sm / md / lg 三档。

#### 5.1.1 主按钮（Primary）

参考 [HeroSection.astro](file:///d:/workspace/mine/src/components/HeroSection.astro) 中的主 CTA。

| 属性     | 取值                                                                 |
| -------- | -------------------------------------------------------------------- |
| 尺寸     | 高度 `48px`（lg），内边距 `px-7`（横向 28px）                        |
| 圆角     | `radius-full`（9999px）                                              |
| 背景     | `var(--personal-primary)`                                            |
| 文字     | `var(--personal-primary-foreground)`，字重 600，字号 `font-size-body` |
| 阴影     | `var(--personal-shadow-card)`                                        |
| 过渡     | `transition-colors`                                                  |
| 内部结构 | 文字 + 图标（`arrow-right` 16px），`gap-2`                           |

**状态变化**

| 状态     | 视觉变化                                                        |
| -------- | --------------------------------------------------------------- |
| Default  | 背景 `primary`，阴影 `shadow-card`                              |
| Hover    | 背景 `primary-700`                                              |
| Focus    | `outline-none` + `ring-2 ring-primary`                          |
| Disabled | 未定义（项目内主按钮始终可用）                                   |
| Active   | 未单独定义，沿用 Hover                                           |

#### 5.1.2 次按钮 / 描边按钮

参考 [EditPanel.astro](file:///d:/workspace/mine/src/components/EditPanel.astro) 固化按钮。

| 属性   | 取值                                                |
| ------ | --------------------------------------------------- |
| 尺寸   | 高度 `40px`，方形 `40×40px` 或 `flex-1` 自适应宽度  |
| 圆角   | `radius-md`（8px）                                  |
| 边框   | `1px solid var(--personal-border)`                  |
| 背景   | 透明                                                |
| 文字   | `var(--personal-muted-foreground)`                  |

**状态变化**

| 状态    | 视觉变化                                |
| ------- | --------------------------------------- |
| Default | 边框 `border`，文字 `muted-foreground`  |
| Hover   | 边框 `primary`，文字 `primary`          |
| Focus   | `ring-2 ring-primary`                   |

#### 5.1.3 图标按钮（圆形）

参考 [ThemeToggle.astro](file:///d:/workspace/mine/src/components/ThemeToggle.astro) 与社交链接。

| 属性   | 取值                                              |
| ------ | ------------------------------------------------- |
| 尺寸   | `36×36px`（主题切换）/ `44×44px`（社交链接）      |
| 圆角   | `radius-full`                                     |
| 边框   | `1px solid var(--personal-border)`                |
| 背景   | `var(--personal-card)`                            |
| 图标   | 16–20px，颜色 `var(--personal-muted-foreground)`  |
| 阴影   | `var(--personal-shadow-card)`                     |

**状态变化**

| 状态    | 视觉变化                                    |
| ------- | ------------------------------------------- |
| Default | 文字 `muted-foreground`                     |
| Hover   | 文字 `primary`（部分同时 `border-primary`） |
| Focus   | `ring-2 ring-primary`                       |

#### 5.1.4 添加按钮（虚线描边）

用于编辑面板动态新增数组项。

| 属性   | 取值                                                |
| ------ | --------------------------------------------------- |
| 尺寸   | 高度自适应，`py-2`                                  |
| 圆角   | `radius-md`                                         |
| 边框   | `1px dashed var(--personal-border)`                 |
| 文字   | `var(--personal-muted-foreground)`，字号 `caption`  |
| 图标   | `plus` 14px，与文字 `gap-1`                         |

**状态变化**

| 状态    | 视觉变化                              |
| ------- | ------------------------------------- |
| Default | 虚线 `border`，文字 `muted-foreground`|
| Hover   | 虚线 `primary`，文字 `primary`        |

---

### 5.2 表单控件

表单控件主要出现在编辑面板（dev only）。统一样式如下。

#### 5.2.1 文本输入框（text）

| 属性     | 取值                                                      |
| -------- | --------------------------------------------------------- |
| 尺寸     | 高度自适应（约 40px），`px-3 py-2`                        |
| 圆角     | `radius-md`                                               |
| 边框     | `1px solid var(--personal-border)`                        |
| 背景     | `var(--personal-background)`                              |
| 文字     | `var(--personal-foreground)`，字号 `font-size-body`       |
| 过渡     | `transition-colors`                                       |
| 占位符   | 未显式设置                                                |

**状态变化**

| 状态     | 视觉变化                                |
| -------- | --------------------------------------- |
| Default  | 边框 `border`                           |
| Focus    | `outline-none` + 边框 `primary`         |
| Disabled | 未定义                                  |

#### 5.2.2 多行文本框（textarea）

与文本输入框一致，`rows="2"` 或 `rows="3"`，行高 `line-height-body`（1.7）。

#### 5.2.3 颜色选择器（color）

由原生 `<input type="color">` + hex 文本框联动组成。

| 元素         | 尺寸        | 圆角       | 边框                          |
| ------------ | ----------- | ---------- | ----------------------------- |
| 色块输入     | `32×32px`   | `radius-md`（实际由原生控制）| `1px solid border`            |
| hex 文本框   | `flex-1`    | `radius-md`| `1px solid border`            |
| 字体         | `font-mono` | 字号 `caption` | —                          |

#### 5.2.4 文件上传（file）

使用原生 `<input type="file">`，通过 `file:` 伪元素自定义按钮样式：

| 元素       | 取值                                                |
| ---------- | --------------------------------------------------- |
| 文件名文字 | `var(--personal-muted-foreground)`，字号 `caption`  |
| 选择按钮   | 背景 `primary`，文字 `primary-foreground`，圆角默认 |
| 间距       | `mr-2`（与文件名分隔）                              |

#### 5.2.5 下拉选择（select）

用于从已有图片中选择。

| 属性   | 取值                                                |
| ------ | --------------------------------------------------- |
| 尺寸   | `px-2 py-1`                                         |
| 圆角   | 默认（未指定 radius）                               |
| 边框   | `1px solid var(--personal-border)`                  |
| 背景   | `var(--personal-card)`                              |
| 文字   | `var(--personal-foreground)`，字号 `caption`        |

#### 5.2.6 表单标签

| 属性   | 取值                                                |
| ------ | --------------------------------------------------- |
| 文字   | `var(--personal-foreground)`，字号 `caption`        |
| 间距   | 与控件之间 `gap-1` 或 `gap-1.5`                     |

#### 5.2.7 字段分组标题

编辑面板内的分组小标题。

| 属性   | 取值                                                |
| ------ | --------------------------------------------------- |
| 文字   | `var(--personal-primary)`，字号 `caption`，字重 600 |
| 间距   | 与下方字段 `gap-2` 或 `gap-3`                       |

---

### 5.3 导航栏

参考 [Header.astro](file:///d:/workspace/mine/src/components/Header.astro) 与 [global.css](file:///d:/workspace/mine/src/styles/global.css) 中的 `.site-nav`。

#### 5.3.1 容器规格

| 属性       | 取值                                                                 |
| ---------- | -------------------------------------------------------------------- |
| 定位       | `fixed`，`top-4 inset-x-4`，`mx-auto max-w-6xl`                     |
| 布局       | `flex items-center justify-between`                                  |
| 高度       | 自适应（`py-3`），约 56–64px                                         |
| 圆角       | `radius-lg`（12px）                                                  |
| 边框       | `1px solid var(--personal-border)`（透明度随滚动状态变化）           |
| 背景模糊   | `backdrop-blur-md`                                                   |
| z-index    | `z-50`                                                               |

#### 5.3.2 滚动状态（两态切换）

通过 `data-scrolled` 属性切换，`nav-scroll.js` 监听滚动位置。

| 状态                | 背景透明度         | 阴影                | 边框透明度         |
| ------------------- | ------------------ | ------------------- | ------------------ |
| 顶部（默认）        | `card 72%`         | `shadow-card`       | `border 60%`       |
| 滚动后（scrolled）  | `card 92%`         | `shadow-float`      | `border 100%`      |
| 过渡                | `0.3s ease`        | `0.3s ease`         | `0.3s ease`        |

#### 5.3.3 内部元素

| 元素       | 位置             | 样式                                                                                  |
| ---------- | ---------------- | ------------------------------------------------------------------------------------- |
| 品牌名     | 左侧             | 字号 `body`，字重 600，`hover:text-primary`                                            |
| 菜单项     | 水平居中（md+）  | 字号 `body`，文字 `muted-foreground`，`hover:text-primary`，`gap-7`                   |
| 主题切换   | 右侧             | 圆形图标按钮（见 5.1.3）                                                              |
| 移动端菜单 | 隐藏             | `md:flex` 控制仅 ≥768px 显示菜单项                                                    |

**菜单项状态**

| 状态    | 视觉变化                 |
| ------- | ------------------------ |
| Default | 文字 `muted-foreground`  |
| Hover   | 文字 `primary`           |
| Focus   | `ring-2 ring-primary`    |

---

### 5.4 卡片

项目内有三种卡片变体：**项目卡**、**站点卡**、**文章卡**。共同基础规格如下。

#### 5.4.1 通用规格

| 属性   | 取值                                              |
| ------ | ------------------------------------------------- |
| 圆角   | `radius-lg`（12px），文章卡为 `radius-md`（8px）  |
| 边框   | `1px solid var(--personal-border)`                |
| 背景   | `var(--personal-card)`                            |
| 内边距 | `p-5`（20px）                                     |
| 过渡   | `transition-colors` 或 `transition-[border,shadow]`|

#### 5.4.2 项目卡（ProjectsSection）

[ProjectsSection.astro](file:///d:/workspace/mine/src/components/ProjectsSection.astro)

| 区域     | 规格                                                                 |
| -------- | -------------------------------------------------------------------- |
| 容器     | `flex flex-col`，`<a>` 标签整体可点击                                |
| 头部     | GitHub 图标（20px）+ 标题，`gap-2`                                   |
| 标题     | 字号 `h4`，字重 600，行高 `h3`                                       |
| 描述     | `mt-3`，字号 `mono`（14px），`line-clamp-2`，`flex-1` 占满剩余空间  |
| 元信息   | `mt-auto` 固定底部，`pt-4`，字号 `caption`                          |
| 元信息项 | 图标（14px）+ 文字，`gap-1`，`gap-x-4` 行内分隔                     |
| 元信息字段 | 语言 / Star / 年份 / 协议                                          |

**状态变化**

| 状态    | 视觉变化                                |
| ------- | --------------------------------------- |
| Default | 边框 `border`                           |
| Hover   | 边框 `primary`                          |
| Focus   | `ring-2 ring-primary`（继承自链接默认） |

#### 5.4.3 站点卡（SitesSection）

[SitesSection.astro](file:///d:/workspace/mine/src/components/SitesSection.astro)

| 区域     | 规格                                                                  |
| -------- | --------------------------------------------------------------------- |
| 容器     | `<article>`，不可点击                                                 |
| 头部     | 图标方块 + 标签，`justify-between`                                    |
| 图标方块 | `40×40px`，`radius-md`，背景 `primary-50`，图标 `primary-600`（20px）|
| 标签     | `radius-full`，背景 `muted`，`px-2.5 py-0.5`，字号 `caption`          |
| 标题     | `mt-4`，字号 `h4`，字重 600                                           |
| 描述     | `mt-2`，字号 `mono`，行高 `body`                                      |

**状态变化**

| 状态    | 视觉变化          |
| ------- | ----------------- |
| Default | 边框 `border`     |
| Hover   | 边框 `primary`    |

#### 5.4.4 文章卡（ArticlesSection）

[ArticlesSection.astro](file:///d:/workspace/mine/src/components/ArticlesSection.astro)

| 区域     | 规格                                                                  |
| -------- | --------------------------------------------------------------------- |
| 容器     | `<article>`，`overflow-hidden`                                        |
| 封面占位 | `aspect-ratio 16:9`，背景 `primary-50`，居中图标 `primary-300`（40px）|
| 正文区   | `p-5`                                                                 |
| 标题     | 字号 `h3`，字重 600，行高 `h3`                                        |
| 摘要     | `mt-2`，字号 `body`，`line-clamp-2`                                   |
| 元信息   | `mt-4`，分类 + 日期，`justify-between`，字号 `caption`                |

**状态变化**

| 状态    | 视觉变化                                                              |
| ------- | --------------------------------------------------------------------- |
| Default | 边框 `border`，阴影 `shadow-card`                                     |
| Hover   | 边框 `primary`，阴影 `shadow-card-hover`，封面背景 `primary-100`，标题 `primary-600`，封面图标 `scale-105` |
| 过渡    | `transition-[border-color,box-shadow]`，封面图标 `duration-300`       |

---

### 5.5 标签 / 徽章

#### 5.5.1 Hero 徽章（带脉冲点）

参考 [HeroSection.astro](file:///d:/workspace/mine/src/components/HeroSection.astro)。

| 属性     | 取值                                                                 |
| -------- | -------------------------------------------------------------------- |
| 容器     | `inline-flex items-center gap-2`，`radius-full`，`px-4 py-1.5`       |
| 边框     | `1px solid var(--personal-border)`                                   |
| 背景     | `var(--personal-card)`                                               |
| 阴影     | `var(--personal-shadow-card)`                                        |
| 脉冲点   | `8×8px`，`radius-full`，背景 `success-500`                           |
| 脉冲环   | `::after` 伪元素，`2px solid success-500`，`pulse-ring` 动画 2s 循环 |
| 文字     | `var(--personal-muted-foreground)`，字号 `0.75rem`（12px）           |

#### 5.5.2 技能标签

| 属性   | 取值                                                                 |
| ------ | -------------------------------------------------------------------- |
| 容器   | `radius-md`，`px-3 py-1`                                             |
| 边框   | `1px solid var(--personal-border)`                                   |
| 背景   | `var(--personal-card)`                                               |
| 文字   | `var(--personal-muted-foreground)`，字号 `caption`                   |
| 字体   | `font-display`                                                       |

**状态变化**

| 状态    | 视觉变化                                |
| ------- | --------------------------------------- |
| Default | 边框 `border`，文字 `muted-foreground`  |
| Hover   | 边框 `primary`，文字 `primary-600`      |

#### 5.5.3 分类标签（站点卡）

| 属性   | 取值                                              |
| ------ | ------------------------------------------------- |
| 容器   | `radius-full`，`px-2.5 py-0.5`                    |
| 背景   | `var(--personal-muted)`                           |
| 文字   | `var(--personal-muted-foreground)`，字号 `caption`|

---

### 5.6 浮动面板（弹窗）

参考 [EditPanel.astro](file:///d:/workspace/mine/src/components/EditPanel.astro)，滑入式抽屉。

#### 5.6.1 遮罩层

| 属性   | 取值                                  |
| ------ | ------------------------------------- |
| 定位   | `fixed inset-0`，`z-50`               |
| 背景   | `bg-black/30`（黑色 30% 透明）        |
| 模糊   | `backdrop-blur-sm`                    |
| 显隐   | `hidden` / 移除 `hidden`              |

#### 5.6.2 面板容器

| 属性     | 取值                                                                |
| -------- | ------------------------------------------------------------------- |
| 定位     | `fixed right-0 top-0`，`z-50`                                       |
| 尺寸     | `h-full`，`w-full max-w-md`（最大 448px）                           |
| 布局     | `flex flex-col`                                                     |
| 边框     | `border-l 1px solid var(--personal-border)`                         |
| 背景     | `var(--personal-card)`                                              |
| 阴影     | `var(--personal-shadow-card)`                                       |
| 显隐动画 | `translate-x-full`（隐藏）→ 移除（滑入），`transition-transform duration-300` |

#### 5.6.3 面板结构

| 区域   | 规格                                                                 |
| ------ | -------------------------------------------------------------------- |
| Header | `px-5 py-4`，`border-b`，标题（字号 `h3`，字重 600）+ 关闭按钮（`8×8px` 圆形）|
| Body   | `flex-1 overflow-y-auto`，`px-5 py-4`                                |
| Footer | `px-5 py-4`，`border-t`，主按钮（`flex-1`）+ 固化按钮（方形 40px）   |

#### 5.6.4 关闭按钮状态

| 状态    | 视觉变化                                |
| ------- | --------------------------------------- |
| Default | 文字 `muted-foreground`                 |
| Hover   | 背景 `muted`，文字 `foreground`         |

#### 5.6.5 删除按钮（子组内）

| 状态    | 视觉变化                              |
| ------- | ------------------------------------- |
| Default | 文字 `muted-foreground`               |
| Hover   | 背景 `error-50`（项目实际用 error-50，CSS 中未定义则降级），文字 `error-500` |

---

### 5.7 浮动按钮（FAB）

编辑面板的触发按钮。

| 属性     | 取值                                              |
| -------- | ------------------------------------------------- |
| 定位     | `fixed bottom-6 right-6`，`z-40`                  |
| 尺寸     | `48×48px`                                         |
| 圆角     | `radius-full`                                     |
| 边框     | `1px solid var(--personal-border)`                |
| 背景     | `var(--personal-card)`                            |
| 图标     | `settings-2` 20px，颜色 `muted-foreground`        |
| 阴影     | `var(--personal-shadow-card)`                     |

**状态变化**

| 状态    | 视觉变化                              |
| ------- | ------------------------------------- |
| Default | 边框 `border`，文字 `muted-foreground`|
| Hover   | 边框 `primary`，文字 `primary`        |
| Focus   | `ring-2 ring-primary`                 |

---

### 5.8 Toast 提示

保存成功的短暂反馈。

| 属性     | 取值                                                                |
| -------- | ------------------------------------------------------------------- |
| 定位     | `fixed bottom-6 left-1/2`，`-translate-x-1/2`，`z-[60]`             |
| 圆角     | `radius-full`                                                       |
| 背景     | `var(--personal-foreground)`                                        |
| 文字     | `var(--personal-background)`，字号 `caption`                        |
| 内边距   | `px-4 py-2`                                                         |
| 显隐动画 | `opacity-0 translate-y-4` → 移除，`transition-all duration-300`     |
| 持续时间 | 1500ms                                                              |
| 交互     | `pointer-events-none`                                               |

---


### 5.10 页脚

参考 [Footer.astro](file:///d:/workspace/mine/src/components/Footer.astro)。

| 属性       | 取值                                                                |
| ---------- | ------------------------------------------------------------------- |
| 容器       | `border-t`，背景 `card`，`py-10`                                    |
| 布局       | `flex flex-col items-center gap-2 text-center`，`max-w-6xl px-6`    |
| 版权文字   | 字号 `body`，行高 `body`，`muted-foreground`                        |
| 格言       | 字号 `body`，字重 600，行高 `body`                                  |
| 备案链接   | 字号 `caption`，`muted-foreground`，`hover:text-primary`            |

---

## 6. 动效与无障碍

### 6.1 过渡动画

| 场景             | 属性                         | 时长    | 缓动     |
| ---------------- | ---------------------------- | ------- | -------- |
| 导航栏滚动状态   | `background-color` 等        | `0.3s`  | `ease`   |
| 面板滑入         | `transform`                  | `0.3s`  | 默认     |
| 卡片悬停         | `border-color` / `box-shadow`| 默认    | 默认     |
| 文章封面图标     | `transform`                  | `0.3s`  | 默认     |
| Toast 显隐       | `opacity` / `transform`      | `0.3s`  | 默认     |

### 6.2 装饰动画

| 动画           | 元素             | 时长  | 缓动          | 循环 |
| -------------- | ---------------- | ----- | ------------- | ---- |
| `float`        | Hero 浮动图标    | `4s`  | `ease-in-out` | 无限 |
| `pulse-ring`   | Hero 徽章脉冲点  | `2s`  | `ease-out`    | 无限 |

**`float` 关键帧**

```css
0%, 100% { transform: translateY(0); }
50%      { transform: translateY(-10px); }
```

**`pulse-ring` 关键帧**

```css
0%        { transform: scale(0.55); opacity: 0.9; }
70%, 100% { transform: scale(1.9);  opacity: 0;   }
```

### 6.3 无障碍

#### 6.3.1 焦点环

所有可交互元素（链接、按钮、输入框）默认提供焦点环：

```css
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--personal-primary)]
```

#### 6.3.2 减少动效

全局尊重 `prefers-reduced-motion: reduce`，禁用装饰动画与导航过渡：

```css
@media (prefers-reduced-motion: reduce) {
  .site-nav { transition: none; }
  .photo-float, .pulse-dot::after { animation: none; }
}
```

#### 6.3.3 ARIA 标签

| 元素             | ARIA 属性                          |
| ---------------- | ---------------------------------- |
| 主题切换按钮     | `aria-label="切换主题"`            |
| 编辑面板触发按钮 | `aria-label="编辑配置"`            |
| 面板关闭按钮     | `aria-label="关闭"`                |
| 面板容器         | `aria-hidden`（随显隐切换）        |
| 社交链接         | `aria-label={label}`               |
| 装饰图标         | `aria-hidden="true"`（项目卡）     |

#### 6.3.4 主题闪烁防护

[DefaultLayout.astro](file:///d:/workspace/mine/src/layouts/DefaultLayout.astro) 在 `<head>` 顶部内联同步脚本，在首屏渲染前根据 `localStorage.theme` 与 `prefers-color-scheme` 应用 `html.dark`，避免明暗切换闪烁（FOUC）。

#### 6.3.5 暗色模式策略

通过 `@custom-variant dark (&:where(.dark, .dark *))` 将 Tailwind 的 `dark:` 变体从默认的 `prefers-color-scheme` 改为 `.dark` class 策略，由主题切换按钮控制 `html.dark` 即可让所有 `dark:*` 工具类生效。

---

> 本文档随项目演进持续更新。新增组件或令牌时请同步修订对应章节，保持文档与代码一致。
