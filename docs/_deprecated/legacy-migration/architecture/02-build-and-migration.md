# 02 构建、导入与迁移流水线

## 命令入口

`package.json` 中的主要命令：

- `npm run import:source`
- `npm run build`
- `npm run build:release`
- `npm run next:build`
- `npm run next:dev`
- `npm run verify`
- `npm run verify:release`
- `npm run migration:status`
- `npm run migration:status:strict`
- `npm test`
- `npm run serve`
- `npm run serve:release`

项目要求 Node.js `>=22`。

## 文件分类规则

分类逻辑在 `scripts/lib/project.mjs`。

核心输出区域：

- `app` -> `src/app`
- `resources` -> `resources`
- `platform` -> `platform`

典型分类：

- 顶层页面目录如 `about`、`creator`、`gallery`、`js`、`css` 进入 `src/app/`。
- `fonts`、`img`、`local_art` 进入 `resources/`。
- `data/scripts`、`data/site`、`data/styles` 进入 `src/app/`。
- `data/fonts`、`data/images` 进入 `resources/`。
- `core/404.html` 进入 `src/app/`，其他 `core` 文件进入 `resources/`。
- 其他顶层文件默认进入 `platform/`。

这套分类保证一个 legacy public path 只归属一个源码区域。

## 导入流程

入口：`scripts/import-source.mjs`

流程：

1. 读取 `CARDCONJURER_SOURCE`，否则默认读取 repo 同级的 `../cardconjurer`。
2. 清空 `src/app/`、`resources/`、`platform/`。
3. 清空 `manifests/`。
4. 遍历 legacy source 文件。
5. 用 `classifyRelativePath()` 决定目标区域。
6. 复制文件到对应区域，保留 public relative path。
7. 为每个文件记录 size 和 sha256。
8. 写入 `manifests/source-baseline.json`。

导入命令会重建三个源码区域，不能在不确认的情况下随便运行。

当前 manifest 中记录的分区计数：

- `app`: 693
- `resources`: 14838
- `platform`: 16

## 构建流程

入口：`scripts/build.mjs`

流程：

1. 检查 `src/app/`、`resources/`、`platform/` 存在。
2. 清空 `dist/`。
3. 清空 `out/` 和 `.next/`。
4. 调用 Next.js 的 `next build`，并关闭 telemetry。
5. 把 `src/app/`、`resources/`、`platform/` 的文件复制到 `dist/`。
6. 按 `src/framework/routes.mjs` 把 `out/` 中的框架 HTML 覆盖到 `dist/` 的历史路径。
7. 用 `scripts/lib/creator-compat.mjs` 从 `src/creator/assets/*.mjs` 生成 classic-script
   兼容前导块，并重写 `dist/js/creator-23.js`，让公开入口仍是 legacy
   `/js/creator-23.js`。

构建后的 `dist/` 是历史 public layout 的兼容输出，不是现代 Next 默认输出。
项目故意没有把 `_next` runtime assets 作为主兼容输出的一部分。

`src/app/js/creator-23.js` 仍是 Creator 运行时源码入口，但其中已不再重复实现
asset URL 和 frame preload 纯 helper；这些全局兼容函数由 build 阶段注入到
`dist/js/creator-23.js`。不要手工编辑 `dist/js/creator-23.js`。

## 发布集生成流程

入口：`scripts/build-release.mjs`

配置：`config/release-targets.json`

流程：

1. 读取现有 `dist/`，不重建也不修改 `dist/`。
2. 清空并重建 `release/`。
3. 按发布规则复制文件到：
   - `release/site`
   - `release/assets-hires`
   - `release/platform`
4. 将 `img/frames/**/*.png` 中非 `*Thumb.png` 的高清 frame 放入
   `release/assets-hires`。
5. 将 Docker、launcher、OSS 上传脚本、Nginx/Apache 配置等平台文件放入
   `release/platform`。
6. 其余 legacy-compatible public path 进入 `release/site`。
7. 生成 `manifests/release-manifest.json`，记录每个 target 的文件数、总字节数和
   单文件 sha256。

发布集验证入口：`scripts/verify-release.mjs`

`npm run verify:release` 会检查：

- `release/*` 目标目录存在。
- 实际文件列表、文件数和总字节数与 `manifests/release-manifest.json` 一致。
- 实际文件列表与当前 `dist/` 按 `config/release-targets.json` 分类后的结果一致。
- `release/site` 中没有被规则分类为 `platform` 或 `assets-hires` 的文件。
- `release/assets-hires` 和 `release/platform` 中没有错分文件。
- `deploy/oss/release-policy.json` 中的 target source 与 release 配置一致。

当前一次生成结果：

- `release/site`: 10395 files，约 781.15MB。
- `release/assets-hires`: 5136 files，约 4.05GB。
- `release/platform`: 16 files，约 26.78MB。

`release/site` 是主站发布集，不包含平台文件，也不包含非缩略图高清 frame PNG。
Creator 已支持通过 `globalThis.CARD_FORGER_ASSETS.frameHiresBase` 从主站以外加载
高清 frame；生产部署应把 `release/assets-hires` 按相同 public path 挂载到
CORS-enabled 资源 CDN 或同一静态根。

## 本地静态服务

入口：`scripts/serve.mjs`

行为：

- 默认监听 `127.0.0.1:4242`。
- 通过 `PORT` 和 `HOST` 环境变量覆盖。
- 默认服务 `dist/`。
- 可通过 `--root <path>` 服务 repo 内其他生成目录。
- `npm run serve:release` 服务 `release/site`。
- 简单处理目录路径到 `index.html`。
- 不做生产级 CDN、压缩或缓存策略模拟。

用途是本地手工验证静态输出，而不是生产服务器。

## 验证流程

入口：

- `scripts/verify-baseline.mjs`
- `scripts/lib/verify.mjs`

验证分三层：

1. separation
   - legacy source 中每个应导入文件都在正确区域。
   - 各区域没有重复 public path。
   - 各区域文件仍符合分类规则。

2. manifest
   - `manifests/source-baseline.json` 和 legacy source 文件集一致。
   - manifest 中的 size、sha256、area 仍正确。

3. dist
   - `dist/` 文件集和 legacy source 一致。
   - 文件 hash 相同，除非：
     - 被 `config/intentional-overrides.json` 记录；
     - 被框架 HTML 等价测试判定等价；
     - 被 gallery DOM 等价测试判定等价。

## 迁移状态

入口：

- `scripts/migration-status.mjs`
- `scripts/lib/migration-status.mjs`
- `src/framework/migration-status.mjs`

当前状态：

- legacy HTML entries: 16
- framework inventory routes: 16
- Next.js route handlers: 16
- framework-generated routes: 16
- legacy-source routes: 0
- raw static framework routes: 0
- raw static framework fragments: 0
- deferred HTML entries: 0
- completion: complete

这表示 HTML 入口迁移清单完整，不表示全部 runtime 已现代化。

注意：迁移状态门禁和 baseline 门禁是两件事。`migration:status` 可以 complete，
但 `verify` 仍可能因为未登记的 `dist` hash 差异失败。

## 已知验证问题

当前 `npm run verify` 应通过。此前的 `img/setSymbols/official/mom-*` 和
`img/setSymbols/official/one-*` mismatch 是 SVG raw newline 与 legacy source 不一致，
已对齐回 legacy source；`upload.bat` 是有意让上传脚本发布生成后的 `dist`，已记录到
`config/intentional-overrides.json`。

## 命令副作用

- `npm run import:source` 会清空并重建 `src/app/`、`resources/`、`platform/` 和
  `manifests/`。
- `npm run build` 会清空并重建 `dist/`、`out/` 和 `.next/`。
- `npm test` 会先运行 build，因此也会重建输出目录。
- `npm run migration:status` 是结构性检查，不会重建输出。
- `npm run verify` 会读取 source、manifest 和 `dist`，不负责重建它们。
- `npm run build:release` 会清空并重建 `release/`，并重写
  `manifests/release-manifest.json`。
- `npm run verify:release` 读取 `release/` 和 `manifests/release-manifest.json`，
  不负责重建发布集。
