# 05 静态资源、OSS 与 CDN 部署

## 资源现状

资源体积是当前线上体验的主要瓶颈。

当前近似体积分布：

| 区域 | 文件数 | 体积 |
| --- | ---: | ---: |
| `resources/img` | 14,056 | 约 4.25GB |
| `resources/data` | 716 | 约 210MB |
| `resources/fonts` | 56 | 约 26MB |
| `src/app/gallery` | 125 | 约 428MB |
| `src/app/js` | 417 | 约 1.85MB |

最大热点是：

- `resources/img/frames`
- 约 4.22GB
- 10,889 个文件
- `*Thumb.png` 缩略图约 76MB
- 非缩略图高清 frame PNG 约 4.34GB

最大 frame 家族：

- `m15`：约 955MB。
- `custom`：约 942MB。
- `modal`：约 254MB。
- `8th`：约 186MB。
- `showcaseMagnified`：约 144MB。
- `saga`：约 137MB。

补充风险：

- `resources/.git` 本身约 4.1GB，不应进入线上发布包。
- `dist/` 当前约 4.84GB，约 15,547 个文件。
- `dist` 中 `.png` 是绝对主因，约 4.86GB，超过 11,000 个文件。

## 部署形态

项目适合部署为静态站点：

```text
dist/
  -> OSS bucket
  -> CDN
  -> browser
```

但不建议把所有 `dist/` 文件无差别作为首要站点资源暴露。`dist/` 是兼容输出，
里面包含平台文件和大资源，线上发布应根据产品需求做过滤或分桶。

当前已经有独立发布集生成入口：

```powershell
npm run build:release
```

该命令读取现有 `dist/`，生成：

- `release/site`：OSS 主站发布集。
- `release/assets-hires`：高清 frame 冷资源集。
- `release/platform`：Docker、launcher、上传和服务配置等平台集。
- `manifests/release-manifest.json`：每个发布集的文件数、体积和 sha256 清单。

部署边界文件：

- `deploy/oss/release-policy.json`：OSS/CDN cache、CORS、过滤规则的可版本化策略。
- `deploy/oss/README.md`：发布顺序和 target 说明。

## 推荐资源分层

推荐拆成三类：

1. 应用壳资源
   - HTML
   - CSS
   - JS
   - favicon/core 小文件
   - 必要字体

2. 热资源
   - mana symbols
   - set symbols
   - frame thumbnails
   - gallery 需要的首屏/缩略图

3. 冷资源
   - 高清 frame PNG
   - 大型 gallery 原图
   - 用户较少触发的导出/launcher 文件

部署时可以是：

```text
主站 CDN:
  /index.html
  /creator/
  /css/
  /js/
  /fonts/
  /img/frames/**/*Thumb.png
  /img/manaSymbols/
  /img/setSymbols/

资源 CDN:
  /img/frames/**/*.png  非 Thumb 高清资源
  /gallery/img/         大图，视业务决定
```

当前 Phase 1 的实际规则先只拆高清 frame PNG：`gallery/img` 仍留在
`release/site`，避免在尚未引入 gallery asset base 前破坏 Gallery 页面引用。

## Creator Asset Base

Creator 的 `fixUri()` 支持可选全局配置：

```html
<script>
globalThis.CARD_FORGER_ASSETS = {
  frameHiresBase: 'https://assets.example.com',
  frameThumbnailBase: '',
  assetBase: ''
};
</script>
```

部署注意：

- 这段配置必须在 `/js/creator-23.js` 之前执行。
- 不设置配置时，legacy public path 行为不变。
- 推荐第一步只设置 `frameHiresBase`，并把 `release/assets-hires` 同步到该 CDN。
- `frameHiresBase` 只改写 `/img/frames/**/*.png` 中非 `*Thumb.png` 的高清 frame；
  frame thumbnails、SVG frame、脚本和其他资源默认仍从主站加载。
- 如果配置 `assetBase`，`/js/frames/*.js` 等 legacy 脚本也会被改写，部署前必须确认
  CDN 上存在完整 public path。

## CORS 要求

高清 frame 会进入 canvas。资源 CDN 必须返回 CORS header，否则图片能显示但 canvas
导出可能失败。

建议：

```http
Access-Control-Allow-Origin: https://你的主站域名
```

开发或纯公开资源也可以用：

```http
Access-Control-Allow-Origin: *
```

前端代码中已经存在 `crossOrigin = 'anonymous'` 的使用。

## 缓存策略

建议 CDN/OSS 缓存：

| 类型 | Cache-Control |
| --- | --- |
| HTML | `no-cache` 或短 `max-age` |
| CSS/JS | 文件名稳定时需发布后刷新 CDN；若改成 hash 文件名可 `immutable` |
| fonts | `public, max-age=31536000, immutable` |
| symbols | `public, max-age=31536000, immutable` |
| frame thumbnails | `public, max-age=31536000, immutable` |
| 高清 frame PNG | `public, max-age=31536000, immutable` |

当前 `css/style-9.css`、`js/creator-23.js` 这类文件名不是 content hash。长缓存时必须
配合 CDN 刷新或版本化 URL。

## app.conf / .htaccess / serve.mjs

- `platform/app.conf` 和 `platform/docker/app.conf` 是 Nginx 静态服务配置。
- `platform/.htaccess` 是 Apache 风格缓存和错误页配置。
- `scripts/serve.mjs` 是本地 Node 静态服务器。

`platform/app.conf` 的关键语义：

- Nginx 监听 `4242`。
- 根目录为 `/usr/share/nginx/html`。
- HTML、manifest、XML、JSON 不缓存。
- CSS/JS 缓存一年。
- 带扩展名路径必须真实存在。
- 无扩展名路径回退到 `/index.html`。

`platform/.htaccess` 的关键语义：

- 404 页面指向 `core/404.html`。
- `png/svg/ttf/ico` 一年缓存。
- CSS 一月缓存。
- JS 存在一周和一天两段重复规则。
- CORS header 示例存在但被注释。

`scripts/serve.mjs` 的关键语义：

- 默认 `127.0.0.1:4242`。
- 只服务 `dist`。
- 有路径穿越保护和 MIME 映射。
- 不提供生产级缓存、压缩、CORS 或 CDN 行为模拟。

这些文件说明历史部署方式和本地测试方式，但 OSS/CDN 不会自动理解 Nginx 或
Apache 配置。上 OSS 后要在 OSS/CDN 控制台中重新配置：

- 默认首页。
- 404 页面。
- cache header。
- gzip/brotli。
- CORS。
- HTTPS。

`platform/upload.bat` 使用 `ossutil sync` 上传发布目录到 OSS，并排除
`.git/.github/node_modules/out/.next` 等目录。它说明历史 OSS 发布方式，但纯静态线上
发布仍建议单独维护过滤规则，避免把 launcher、Docker 文件和冷资源全部放到主站。

## dist 中不一定要公开的文件

因为 `scripts/build.mjs` 会把 `platform/` 复制到 `dist/`，输出中会包含：

- `Dockerfile`
- `docker-compose.yml`
- `launcher.exe`
- `launcher-linux`
- `launcher-macos`
- `upload.bat`
- `Makefile`

如果这些不是线上产品的一部分，部署同步脚本应排除它们。

`npm run build:release` 已将这些文件拆入 `release/platform`，因此 OSS 主站发布时应
同步 `release/site`，不要同步完整 `dist`。需要本地 Docker、launcher 或历史 OSS
上传脚本时，再单独取 `release/platform`。

## OSS/CDN 发布规则建议

可执行/可版本化策略源位于 `deploy/oss/release-policy.json`。下面是该策略的人类可读
摘要。

主站同步：

- 来源目录：`release/site`
- 排除：不需要额外排除平台文件，脚本已经拆分。
- HTML：短缓存或 `no-cache`。
- CSS/JS：当前文件名不是 content hash，长缓存必须配合 CDN 刷新。
- fonts、symbols、frame thumbnails：可长缓存。

高清资源同步：

- 来源目录：`release/assets-hires`
- CDN/OSS 必须配置 CORS，否则高清 frame 进入 canvas 后可能导致导出失败。
- 推荐长缓存：`public, max-age=31536000, immutable`。
- 如果配置 `frameHiresBase`，资源 CDN 的对象路径必须保留 `img/frames/...`，和
  `release/assets-hires` 内部路径一致。

平台包：

- 来源目录：`release/platform`
- 不作为 OSS 主站 public root 的默认内容。

## 图片优化优先级

优先级从高到低：

1. 高清 frame 冷资源化，不参与首屏。
2. frame 缩略图懒加载或虚拟列表。
3. 高频 frame 的小范围预热。
4. gallery 大图缩略图化。
5. PNG lossless 压缩。
6. 评估 WebP/AVIF，但高清 frame 有透明通道和 canvas 质量要求，不能盲转。
