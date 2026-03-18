# Museum Memory · 博物馆专属记忆

> 记录你在博物馆里，那些只属于你的瞬间

## 技术栈

- **前端**：React 18 + Vite + Tailwind CSS
- **地图**：Leaflet.js + OpenStreetMap（免费，无需 API Key）
- **数据库 & 存储**：Supabase（免费套餐）
- **部署**：Vercel（免费套餐）

---

## 快速开始

### 第一步：克隆 & 安装依赖

```bash
npm install
```

### 第二步：创建 Supabase 项目

1. 前往 [supabase.com](https://supabase.com) 注册并新建项目
2. 进入 **SQL Editor**，粘贴并运行 `supabase-schema.sql` 中的全部内容
3. 进入 **Storage → New bucket**，创建名为 `photos` 的 bucket，勾选 **Public**
4. 在 Storage 的 **Policies** 中，为 `photos` bucket 添加允许所有操作的策略

### 第三步：配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 Supabase 项目信息：

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...（你的 anon key）
```

> 在 Supabase Dashboard → Settings → API 中可以找到这两个值

### 第四步：启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173)

---

## 页面路由

| 路径 | 说明 |
|------|------|
| `/` | 首页地图，展示所有已记录的博物馆 |
| `/add` | 添加新博物馆（在地图上点击选位置） |
| `/museum/:id` | 博物馆记忆页面（查看模式） |
| `/museum/:id/edit` | 编辑记忆（照片、感悟、链接、标签） |

---

## 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel

# 在 Vercel 项目设置中添加环境变量：
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

---

## 数据结构

```
museums
  id, name, city, latitude, longitude, visited_at, tags[], created_at

memories
  id, museum_id (→museums), content, links (jsonb), created_at, updated_at

photos
  id, memory_id (→memories), url, storage_path, created_at
```

---

## 开发说明

- 文字感悟支持**自动保存**：停止输入 2 秒后自动保存到 Supabase
- 照片上传至 Supabase Storage，建议单张控制在 5MB 以内
- 免费套餐存储空间：1GB（约 500 张照片）

---

*Museum Memory MVP v1.0 · 2026年3月*
