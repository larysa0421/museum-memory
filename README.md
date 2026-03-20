# 🏛️ Museum Memory (MVP v1.0)

> [cite_start]**“记录你在博物馆里，那些只属于你的瞬间。”** > 这是一个为念旧且有规划的旅行者打造的「私人博物馆记忆库」。[cite: 2, 5, 17]

---

## 🌟 项目愿景 (Product Vision)

[cite_start]针对旅行者照片散落在相册、缺乏深度感悟记录空间的痛点，本项目提供一个整合「照片 + 文字 + 相关资料链接」的系统，通过交互式地图唤起往日回忆。[cite: 13, 14, 15]

- [cite_start]**气质关键词**：干净、温暖、怀旧 [cite: 57]
- [cite_start]**视觉风格**：米白背景 (#FAF7F2)、牛皮纸感、衬线字体 [cite: 57, 151]
- [cite_start]**核心价值**：私人化、情感化、低成本 [cite: 17, 72, 78]

---

## 🛠️ 技术栈选型 (Tech Stack)

[cite_start]本项目采用 **AI 辅助开发 (Lovable)** 模式，旨在以 **$0 成本** 快速上线 MVP。[cite: 96, 195]

| 维度 | 技术方案 | 理由 |
| :--- | :--- | :--- |
| **开发平台** | **Lovable.dev** | [cite_start]自然语言生成 React 代码，内置后端集成 [cite: 100, 101] |
| **前端框架** | **React + Tailwind CSS** | [cite_start]响应式支持极好，shadcn/ui 组件库 [cite: 110, 112, 113] |
| **地图引擎** | **Leaflet + OpenStreetMap** | [cite_start]完全免费，无需 API Key [cite: 111, 114] |
| **后端/数据库** | **Supabase** | [cite_start]提供 PostgreSQL、Storage 及 Auth 服务 [cite: 116, 117, 118] |
| **部署托管** | **Vercel** | [cite_start]自动 HTTPS，全球加速，永久免费 [cite: 122, 125] |

---

## 📊 数据模型 (Data Structure)

[cite_start]数据库包含三张核心表，支撑所有 P0 功能：[cite: 127]

1. [cite_start]**`museums` (博物馆)**: 记录名称、城市、国家、经纬度坐标及标签。[cite: 129]
2. [cite_start]**`memories` (记忆条目)**: 关联博物馆，记录参观日期、长文感悟及外部链接。[cite: 131]
3. [cite_start]**`photos` (照片)**: 关联记忆，存储 Supabase Storage 文件路径。[cite: 133]

---

## ✨ 核心功能 (P0 Roadmap)

- [ ] [cite_start]**交互式地图**：浏览城市标记点，点击查看博物馆列表或详情。[cite: 26, 28, 29]
- [ ] [cite_start]**博物馆记忆页面**：大图展示的照片网格、衬线体感悟区域及资料链接。[cite: 144, 147, 148]
- [ ] [cite_start]**多媒体上传**：支持多图上传至 Supabase Storage (1GB 免费额度)。[cite: 156, 160]
- [ ] [cite_start]**感悟记录**：支持文字编辑与 2 秒自动保存逻辑。[cite: 161, 164]
- [ ] [cite_start]**外链与标签**：支持添加参考链接及预设/自定义主题标签。[cite: 44, 48, 171]

---

## 🚀 快速启动指南

### 1. 环境准备
- [cite_start]注册并连接 **Lovable.dev**, **Supabase**, **GitHub**, **Vercel** 账号。[cite: 176, 177, 178, 179]

### 2. 初始化指令 (Prompt)
在 Lovable 中粘贴以下指令开始构建：
> [cite_start]"创建一个叫 Museum Memory 的网页应用。这是一个私人博物馆记忆库。技术栈：React + Tailwind CSS + Supabase + Leaflet.js。视觉风格：干净温暖怀旧，背景色 #FAF7F2，主字体使用衬线体。请先创建基础结构和首页地图。" [cite: 183]

### 3. 开发规范
- [cite_start]每次只开发一个功能，完成后立即进行手机端响应式测试。[cite: 185, 186]
- [cite_start]每日结束前确认代码已同步至 GitHub 仓库。[cite: 188]

---


## 📂 项目文档索引

为了方便了解详细的设计思路与需求，请参阅以下文档：

* [cite_start]**[📄 产品需求文档 (PRD)](./PRD.md)**：包含用户故事、核心功能 P0 规划及成功指标 [cite: 1, 24, 54]。
* [cite_start]**[🛠️ 技术设计文档 (TDD)](./Tech_Design.md)**：包含技术栈选型（React + Supabase + Leaflet）、数据库建模及开发节奏 [cite: 93, 107, 126, 175]。
* [cite_start]**[🗄️ 数据库脚本](./supabase-schema.sql)**：包含本项目核心表（museums, memories, photos）的 SQL 建表语句 [cite: 128, 130, 132]。

---
[cite_start]**Museum Memory MVP** · 2026年3月 · $0 Cost Project [cite: 96, 223]
