# 🛠️ 技术设计文档 (TDD) - Museum Memory
> **版本**: v1.0 (MVP) | **目标**: 构建一个零成本、高性能的响应式 Web 应用

---

## 1. 技术栈选型 (Tech Stack)

| 层次 | 选型 | 理由 |
| :--- | :--- | :--- |
| **开发工具** | **Lovable.dev** | AI 辅助生成代码，集成度高，适合快速原型开发。 |
| **前端框架** | **React + Tailwind** | 响应式设计首选，样式灵活，shadcn/ui 组件库视觉高级。 |
| **地图方案** | **Leaflet.js + OSM** | 完全免费，无需 API Key，适合 MVP 阶段零成本启动。 |
| **后端/数据库** | **Supabase** | 提供托管的 PostgreSQL，自带 Storage 用于存储博物馆照片。 |
| **部署/CDN** | **Vercel** | 与 GitHub 深度集成，全球加速，个人项目永久免费。 |

---

## 2. 数据库建模 (Data Architecture)

基于功能需求，设计以下三张核心表：

### 🏛️ 博物馆表 (`museums`)
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | UUID | 主键，自动生成 |
| `name` | text | 博物馆名称（如：台北故宫博物院） |
| `city` | text | 所在城市 |
| `lat`, `lng` | float | 经纬度坐标，用于地图打点 |
| `tags` | text[] | 主题标签数组（历史、艺术等） |

### 📖 记忆条目表 (`memories`)
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | UUID | 主键 |
| `museum_id` | UUID | 外键，关联博物馆 |
| `diary_text` | text | 文字感悟内容 |
| `links` | text[] | 外部参考链接数组 |
| `visit_date` | date | 参观日期 |

### 🖼️ 照片表 (`photos`)
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `id` | UUID | 主键 |
| `memory_id` | UUID | 外键，关联记忆条目 |
| `storage_path` | text | Supabase Storage 中的文件存储路径 |

---

## 3. 核心功能实现逻辑

### 📍 地图渲染流程
1. **初始化**：加载 Leaflet.js 并设置 OpenStreetMap 瓦片图。
2. **取数**：从 Supabase `museums` 表读取所有经纬度数据。
3. **交互**：在地图上生成 Marker。点击 Marker 后通过 `id` 路由跳转至详情页。

### 📸 照片存储逻辑
- **前端压缩**：上传前通过 JS 进行简单压缩，确保单张图片 < 2MB。
- **云端存储**：调用 Supabase Storage API 存入名为 `museum-photos` 的 Bucket。
- **引用读取**：数据库只存路径，页面加载时根据路径获取公开 URL 渲染。

---

## 4. 视觉与交互实现 (UI/UX Implementation)
* **配色方案**：
  * 背景: `#FAF7F2` (米色)
  * 文字: `#4A3728` (深棕色)
* **字体引入**：
  * 标题/正文使用 Google Fonts 的衬线字体（如 `Noto Serif SC`）以增强人文气质。
* **自适应**：
  * 地图组件在手机端自动占满 100% 视口高度，菜单采用侧边栏或底部抽屉形式。

---

## 5. 开发节奏与检查点
- [ ] **Phase 1**: 环境联通（Lovable 连接 Supabase）。
- [ ] **Phase 2**: 数据库建表与基础 CRUD（增删改查）功能。
- [ ] **Phase 3**: 地图组件与位置标注功能。
- [ ] **Phase 4**: UI 细节润色与上线部署。

---
*Technical Design for Museum Memory MVP.*
