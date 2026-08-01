/**
 * Vite dev server 中间件：把 EditPanel 提交的扁平 path 覆盖写回 config.yaml
 *
 * 为什么需要这个：
 * - 浏览器无法直接写服务器文件，必须借由 dev server 暴露写入端点
 * - 用 yaml 包的 AST 编辑（parseDocument + setIn）而非 js-yaml 的 dump，
 *   是为了保留原文件的注释与排版，避免每次写入都把 config.yaml 重新格式化
 * - 仅在 configureServer 中挂载，生产构建时此插件不参与打包，
 *   静态站点定位不受影响
 *
 * 调用约定：
 * - POST /__save_cfg，body 为 { "hero.title": "新值", ... } 的扁平 path JSON
 * - POST /__delete_cfg_item，body 为 { "arrayPath": "projects", "index": 1 }
 *   deleteIn 会自动收缩数组，后续项索引前移
 */
import { parseDocument } from 'yaml';
import fs from 'node:fs';
import path from 'node:path';

const CONFIG_PATH = path.resolve(process.cwd(), 'config.yaml');

/**
 * 把 "hero.stats.0.value" 这类点分路径切成 setIn 接受的 segments
 * 纯数字段转成 number：setIn 用数字索引定位数组项，用字符串会变成对象 key
 */
function pathToSegments(flatPath) {
  return flatPath.split('.').map(seg => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

/** 读取请求体为字符串，流式拼接避免大 body 一次性占用内存 */
async function readBody(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body;
}

/**
 * yaml 写入并发锁：串行化所有写操作
 * 避免快速连续请求读到中间状态导致 yaml 损坏
 */
let yamlWriteLock = Promise.resolve();
function lockYaml(fn) {
  const result = yamlWriteLock.then(fn, fn);
  yamlWriteLock = result.catch(() => {});
  return result;
}

/**
 * 路径白名单：只允许编辑面板已知的字段路径写入 config.yaml
 * 防止意外或恶意请求污染配置文件
 */
const ALLOWED_PATTERNS = [
  /^site\.(author|title|description)$/,
  /^hero\.(badgeText|title|subtitle|image|description)$/,
  /^hero\.primaryAction\.text$/,
  /^hero\.skills\.\d+$/,
  /^hero\.stats\.\d+\.(value|label)$/,
  /^projects\.\d+\.(title|desc|lang|stars|year|license)$/,
  /^sites\.\d+\.(title|desc|tag)$/,
  /^articles\.\d+\.(title|desc|category|date)$/,
  /^theme\.(light|dark)\.(background|foreground|card|border|primary|accent)$/,
];

function isPathAllowed(flatPath) {
  return ALLOWED_PATTERNS.some(p => p.test(flatPath));
}

export function cfgWriterPlugin() {
  return {
    name: 'cfg-writer',
    configureServer(server) {
      // POST /__save_cfg：逐个 path 写入 yaml，setIn 自动创建缺失中间节点
      server.middlewares.use('/__save_cfg', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        try {
          const overrides = JSON.parse((await readBody(req)) || '{}');

          // 路径白名单校验：拒绝未知路径写入
          const rejected = Object.keys(overrides).filter(p => !isPathAllowed(p));
          if (rejected.length > 0) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: `Disallowed paths: ${rejected.join(', ')}` }));
            return;
          }

          // 并发锁：串行化 yaml 读写，避免快速连续请求导致文件损坏
          await lockYaml(async () => {
            const yamlText = fs.readFileSync(CONFIG_PATH, 'utf8');
            const doc = parseDocument(yamlText);

            for (const [flatPath, value] of Object.entries(overrides)) {
              doc.setIn(pathToSegments(flatPath), value);
            }

            fs.writeFileSync(CONFIG_PATH, doc.toString());
          });
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: String(err?.message || err) }));
        }
      });

      // POST /__delete_cfg_item：删除 yaml 中数组的指定索引项
      // deleteIn 会自动收缩数组，后续项索引前移，无需手动重排
      server.middlewares.use('/__delete_cfg_item', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        try {
          const { arrayPath, index } = JSON.parse((await readBody(req)) || '{}');
          if (!arrayPath || typeof index !== 'number') {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'arrayPath and index are required' }));
            return;
          }

          // arrayPath 可能是 "projects" 或 "hero.skills"，拆成 segments 再追加 index
          const segments = [...pathToSegments(arrayPath), index];

          // 并发锁：串行化 yaml 读-改-写，确保读到最新状态
          const deleted = await lockYaml(() => {
            const yamlText = fs.readFileSync(CONFIG_PATH, 'utf8');
            const doc = parseDocument(yamlText);
            const result = doc.deleteIn(segments);
            if (result) fs.writeFileSync(CONFIG_PATH, doc.toString());
            return result;
          });

          if (!deleted) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: `Item ${arrayPath}[${index}] not found in config.yaml` }));
            return;
          }

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: String(err?.message || err) }));
        }
      });

      // POST /__upload_image：接收 base64 图片，写入 public/photos/，返回可访问路径
      // 用 base64+JSON 而非 multipart，避免引入 formidable 等额外依赖
      server.middlewares.use('/__upload_image', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        try {
          const { base64, ext } = JSON.parse((await readBody(req)) || '{}');
          if (!base64 || !ext) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'base64 and ext are required' }));
            return;
          }

          // 白名单校验扩展名，防止写入任意类型文件
          const allowed = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];
          const safeExt = String(ext).toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!allowed.includes(safeExt)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: `Unsupported extension: ${ext}` }));
            return;
          }

          // 确保目录存在（首次上传时创建）
          const dir = path.resolve(process.cwd(), 'public/photos');
          fs.mkdirSync(dir, { recursive: true });

          // 大小限制：防止大图片占用过多内存和磁盘
          const buf = Buffer.from(base64, 'base64');
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB
          if (buf.length > MAX_SIZE) {
            res.statusCode = 413;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: `Image too large (max 5MB, got ${(buf.length / 1024 / 1024).toFixed(1)}MB)` }));
            return;
          }

          // 时间戳命名避免冲突，用 photo- 前缀保持通用（不限 hero 字段）
          const filename = `photo-${Date.now()}.${safeExt}`;
          fs.writeFileSync(path.join(dir, filename), buf);

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, path: `/photos/${filename}` }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: String(err?.message || err) }));
        }
      });
    },
  };
}
