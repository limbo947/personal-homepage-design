import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { cfgWriterPlugin } from './scripts/cfg-writer-plugin.mjs';

// 用 Tailwind v4 官方 Vite 插件替代原 CDN browser 版本，
// 让样式本地构建，离线可用且产物更小
// cfgWriterPlugin 仅在 dev server 中挂载 /__save_cfg 端点，供 EditPanel 写回 config.yaml
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), cfgWriterPlugin()],
  },
});
