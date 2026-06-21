# 🪵 纸质低语 (The Whispering Pages)

> 这是一个将个人博客从 **Next.js** 彻底重构至 **Astro v6** 并运行于 **Cloudflare Workers (Static Assets)** 上的极简主义博客项目。

以温润的纸质媒介为灵感，结合现代 Web 性能最佳实践，本博客旨在构建一个如捧书卷、清净专注的沉浸式阅读空间。

---

## 🎨 设计美学 —— 「纸质低语」

项目严格遵循极简主义设计准则（详见 [agent.md](file:///Users/sunny/Documents/blog/agent.md)），拒绝一切繁杂的视觉污染：

*   **🪵 材质与色调 (Paper & Cozy Ink)**：
    *   **浅色模式 (宣纸温润)**：使用柔和的宣纸底色 (`#faf8f5`)，配以深墨色文字 (`#1e1e1d`) 与烟灰色辅助信息 (`#787870`)。
    *   **深色模式 (碳墨夜空)**：采用碳墨色背景 (`#0d0d0d`) 与碳灰文字 (`#e2e2e0`)，最大化夜间阅读舒适度。
    *   **沉稳黛绿**：仅在极少数需要指示交互的元素（如当前激活的目录项）上使用儒雅的黛绿强调色（浅色 `#3f5246`，深色 `#788a7e`）。
*   **📐 书籍装帧版心 (Editorial Layout)**：
    *   在大屏幕上，主体内容左右两侧绘制有 `0.5px` 的垂直细实线，模拟实体书籍的页边装帧缝线。
    *   首屏抛弃巨大的站点名称，改用富有文学色彩的 **“扉页序言 (Preface)”** 版式，以 `VOL. 01 / PREFACE` 极细徽章配搭简练有温度的段落，开启静心阅读。
*   **📰 非对称编排与左文右图 (Asymmetric Editorial)**：
    *   **年鉴时间轴**：列表日期采用字间距极宽的纤细极小字号放置于左侧。
    *   **精美缩略图**：使用 `4:3` 比例的缩略图画框。图片默认带有微量胶片感 `sepia` 滤镜，Hover 时褪去并平滑放大。
*   **🌀 无感微光交互 (Focus Effects & Micro-Animations)**：
    *   **纯 CSS 聚焦交互**：列表项在鼠标悬停时，当前项微微右偏，同时其余所有项的透明度微妙降至 `0.45`，实现心无旁骛的视线聚焦。
    *   **3D 主题切换**：主题图标在切换时具有 3D 旋转缩放过渡动画，柔和如风。
    *   **动态 TOC 刻度指示线**：目录链接左侧配有微小圆点刻度。随着页面滚动，当前激活的章节刻度将在 `300ms` 内“长高”为一条黛绿色的竖向进度线。

---

## ⚡️ 技术栈与架构 (Tech Stack)

*   **Astro v6**：默认静态（Static By Default），使用最新的 **Content Layer API** 驱动静态内容生成，保障首屏 Zero-JS。
*   **Tailwind CSS v4**：利用 Vite 插件 `@tailwindcss/vite` 构建，原生 CSS 变量设计，产物极其轻量。
*   **Cloudflare Workers (Static Assets)**：部署于 Cloudflare 边缘计算平台，利用全新 Static Assets 架构实现毫秒级全球边缘分发与近乎零费用的托管。
*   **React 19 (局部水合)**：仅用于 `MusicCard`（网易云音乐卡片）交互，使用 `client:visible` 指令，实现按需局部水合。
*   **Giscus (Web Component)**：使用原生 `<giscus-widget>` 挂载评论区，随主题切换实现免刷新无感颜色同步。

---

## 📦 项目结构 (Project Structure)

```text
.
├── .agents/               # 团队/项目级 AI 辅助规则
├── src/
│   ├── components/        # 页面局部组件 (React & Astro)
│   ├── content/           # 博客文章数据层 (.mdx)
│   ├── layouts/           # 页面全局布局
│   ├── middleware.ts      # Astro 路由中间件 (路由兼容性重定向)
│   ├── pages/             # 路由页面 (Astro & API 路由)
│   └── styles/            # 全局样式与自定义 Tailwind 变量
├── wrangler.jsonc         # Cloudflare Wrangler 配置文件
└── astro.config.mjs       # Astro 配置文件
```

---

## 🛠️ 本地开发与运行 (Development)

项目使用 `pnpm` 作为包管理工具，在 Node.js >= 22 环境下运行良好。

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动本地开发服务

```bash
pnpm dev
```

### 3. 本地预览 Cloudflare 构建效果

如果想完全模拟在 Cloudflare 边缘网络上的运行效果，可使用 Wrangler 运行本地预览：

```bash
pnpm build
pnpm preview
```

---

## 🚀 部署发布 (Deployment)

项目配置为使用 Wrangler 自动打包并一键发布至 Cloudflare Workers。

```bash
pnpm deploy
```

发布时，`astro build` 会先在本地将静态页面及静态资源打包至 `dist/`，Wrangler 会自动读取 `wrangler.jsonc` 中配置的 `./dist` 目录进行增量资产上传。

---

## 💡 其它注意事项

*   **路由兼容**：中间件 `src/middleware.ts` 已经实现了从 Next.js 旧路由 `/blog/:slug` 到 `/posts/:slug` 的重定向，对 SEO 友好。
*   **网易云 API**：网易云卡片所需接口在 `src/pages/api/music/[id].ts` 中实现，采用 SSR 动态路由（`prerender = false`），完美配合 Cloudflare Workers 的 Edge 运行时。
