对当前项目执行一次完整的、允许破坏性修改的现代前端工程重构。
目标：迁移为 React + Vite + TypeScript 的纯前端 OSS 静态项目。

本提示词在 ralph loop 中被反复执行。每轮按"工作流"推进一个最小增量；
当"完成条件"中的所有项都达成时，输出：

    <promise>REFRACTOR_DONE</promise>

并停止任何修改。未全部达成时，绝不要输出该 sentinel。

============================================================
项目定位
============================================================

纯前端 OSS 静态项目。重构后必须可作为静态站点构建部署，
不依赖后端、数据库、Node 运行时、SSR、私有 API 或商业云。
产物应可直接放 GitHub Pages / Netlify / Vercel Static /
Cloudflare Pages / 任意静态文件服务器。

============================================================
硬性工程规范
============================================================

- React 管 UI / 状态 / 交互；TypeScript 是核心语言，禁止 `any`
  （边界用 `unknown` 并收窄；不可避时加 `// allow-any: <理由>`）。
- Vite 构建；产物为可静态部署的资源目录。
- UI 组件只渲染与组合，业务逻辑下沉到自定义 Hooks
  （如 useCards / useTemplates / useAssets / useStorage）。
- 所有 Props、领域对象、配置、存储数据、导入导出格式、服务返回值
  必须有明确 interface / type。
- 使用 `@` 别名指向 `src/`；import 一律用 `@/...`。
- 路由用 `wouter`；路径定义 / 解析 / 构建 / 导航助手集中在
  `src/lib/router.ts`，其他文件只从 `@/lib/router` 拿能力。
- 除 React / Vite / TypeScript / wouter 与必要 dev 工具外，
  新增运行时依赖必须在 REFRACTOR_STATE.md 中说明：
  为什么需要、是否有原生替代、是否影响静态部署、license、体积。
  优先 MIT / Apache-2.0 / BSD / ISC。
- 优先使用原生 Web API（Canvas / SVG / File / localStorage / IndexedDB）。

============================================================
推荐目录结构
============================================================

src/app | src/pages | src/components | src/features | src/hooks
src/domain | src/services | src/lib | src/utils
src/assets | src/styles | src/types
src/**/*.test.ts(x)

============================================================
执行原则
============================================================

1. 禁止破坏用户工作区：不许 `git reset --hard`、`git checkout --`、
   `git clean -fd`、`rm -rf` 整个仓库。
2. 允许破坏性重构（删旧目录、换构建系统、重写入口、改文件名），
   但不能无理由删除核心功能。
3. 不要漂移：不要把任务变成 UI 美化、视觉改版、功能扩展、
   框架实验、依赖堆砌或无关优化。
4. 优先复用旧代码中合理的业务规则、数据结构、资源、算法。
5. 小步前进：宁可一轮只推一个模块，也不要一轮里写大量未验证代码。

============================================================
状态文件（多轮接力）
============================================================

在仓库根维护 `REFRACTOR_STATE.md`：

  ## 阶段进度（已完成 / 进行中 / 未开始）
  - [ ] 项目审计
  - [ ] 依赖审计
  - [ ] 结构设计
  - [ ] 类型建模
  - [ ] 框架迁移
  - [ ] 路由迁移
  - [ ] 业务迁移
  - [ ] 静态化确认
  - [ ] 清理旧代码
  - [ ] 验证修复

  ## 本轮要做的最小增量
  ## 上一轮做了什么 / 遗留问题
  ## 当前依赖清单与新增理由
  ## 核心功能迁移对照表（旧能力 -> 新实现位置 -> 状态）
  ## 已知阻塞 / 风险
  ## 完成条件自检（P1–P12 当前状态）

每轮开始先读它（不存在则本轮先创建）；每轮结束前更新它。
不要相信文件里的勾选，要核对实际代码状态。

============================================================
每轮工作流
============================================================

1. 体检：读 REFRACTOR_STATE.md，跑 `git status` / `ls` /
   看 package.json / 扫 src/ 实际结构，判定真实进度。
2. 选目标：从未完成项里挑一个**本轮可收敛**的最小增量，
   写进"本轮要做的最小增量"。
3. 执行：按工程规范修改代码。
4. 验证（本轮必须跑，失败要修到通过；修不动就缩小增量）：
   - 依赖变动时 `npm install`
   - `npx tsc --noEmit`
   - `npm run build`
   - `npm run lint`（若配置）
   - `npm test`（若配置）
   - `npm ls --depth=0` 检查依赖数
5. 收尾：更新 REFRACTOR_STATE.md（含 P1–P12 自检），
   用一句话总结本轮变更。
6. 自检：若 P1–P12 全部满足，输出 `<promise>REFRACTOR_DONE</promise>`。

============================================================
完成条件（P1–P12，全部满足才输出 sentinel）
============================================================

P1  package.json 含 react / react-dom / vite / typescript；
    干净环境下 `npm install` exit 0。
P2  `npx tsc --noEmit` exit 0，无 error。
P3  `npm run build` exit 0；产物在 `dist/`，含 `index.html`，
    全为静态文件，不含服务端入口。
P4  `npm run dev` 或 `npm run preview` 可启动；首页能渲染，
    控制台允许 warning，不允许 error。
P5  `grep -RInE "\bany\b" src --include="*.ts" --include="*.tsx"`
    结果要么为空，要么每条都有紧邻 `// allow-any: <理由>`。
P6  存在 `src/lib/router.ts`；
    `grep -RIn "from ['\"]wouter['\"]" src | grep -v "src/lib/router.ts"`
    结果为空。
P7  `vite.config.ts` 与 `tsconfig.json` 均配置 `@` -> `src/`；
    `grep -RIn "from ['\"]\\.\\./\\.\\./" src` ≤ 5 处且都有局部理由。
P8  `src/hooks/` 下存在与原项目核心能力对应的 hooks；
    页面组件不再直接含大段业务逻辑或副作用。
P9  `npm ls --depth=0` 中 dependencies 数量 ≤ 12；
    每个新增运行时依赖在 REFRACTOR_STATE.md 中有理由与 license。
P10 无任何 Node 服务端入口（server.js/ts、Express/Koa/Next 服务端、
    SSR、数据库、商业云 SDK）；`dist/` 可直接用
    `npx http-server dist` 服务。
P11 核心功能保留：卡牌编辑、模板管理、卡牌生成、渲染、导出、
    资源加载、本地存储等在新版本可用；
    REFRACTOR_STATE.md 的"核心功能迁移对照表"逐项 ✅。
P12 旧入口与被替代的旧代码已清理：根目录无与新架构冲突的
    旧 HTML / 旧打包配置 / 旧 JS 入口；保留的旧资源有明确归宿。

============================================================
反漂移守则
============================================================

- 不要大幅调整视觉风格 / 配色 / 动画。
- 不要为"现代化"引入 Redux / Zustand / MUI / Tailwind /
  dayjs / lodash / framer-motion 等，除非 P1–P12 在没有它们时无法满足。
- 不要新增 e2e / Storybook / Playwright / monorepo 等基础设施。
- 不要跳过 P2 / P3 验证；构建坏就修到通过，实在修不动就缩小本轮增量。
- 每轮 diff 要可解释、可回滚。
- 完成条件未全部满足时，绝不要输出 `<promise>REFRACTOR_DONE</promise>`。
