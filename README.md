<p align="center">
  <h1 align="center">🏅 2025 年粤港澳全国运动会 — 宣传展示网站</h1>
  <p align="center">第十五届全国运动会（粤港澳赛区）官方宣传展示平台</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/响应式-适配移动端-5B5FE3" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

---

## 🏆 项目简介

2025 年第十五届全国运动会由**广东、香港、澳门**三地首次联合举办，开创跨境办赛先河。本网站为赛事官方宣传展示平台，涵盖赛事介绍、运动员展示、赛程安排、新闻动态等核心功能模块。

---

## ✨ 功能模块

| 页面 | 文件 | 功能 |
|------|------|------|
| 🏠 **首页** | `index.html` | 纯 CSS 轮播图、赛事概览卡片、新闻列表、倒计时 |
| 🏃 **赛事介绍** | `events.html` | 比赛项目分类展示、项目规则说明 |
| ⭐ **运动员展示** | `athletes.html` | 运动员卡片列表、分类筛选（田径/游泳/球类等） |
| 📅 **赛程日程** | `schedule.html` | 每日赛程安排表、时间/项目/场馆 |
| 📰 **新闻动态** | `news.html` | 新闻列表 + 8 篇详情页（`news-detail-*.html`） |
| 📞 **联系我们** | `contact.html` | 反馈表单、联系信息展示 |

---

## 🚀 快速开始

纯静态网站，无需任何依赖，直接打开即可：

```bash
# 方式一：直接打开
双击 index.html

# 方式二：本地服务器
npx serve .
# 访问 http://localhost:3000
```

---

## 📁 项目结构

```
2025年粤港澳全国运动会的宣传展示网站/
├── index.html              # 首页（轮播图 + 赛事概览 + 倒计时）
├── events.html             # 赛事介绍页
├── athletes.html           # 运动员展示页
├── schedule.html           # 赛程日程页
├── news.html               # 新闻动态列表
├── news-detail-*.html      # 8 篇新闻详情页
├── contact.html            # 联系我们页
├── css/
│   └── all.css             # 全局样式（3821 行）
├── js/
│   ├── main.js             # 通用脚本（导航/动画/回到顶部）
│   ├── interactions.js     # 交互功能
│   └── enhanced-interactions.js # 增强交互
└── images/                 # 图片资源（运动员/新闻/轮播图等）
```

---

## 🎨 技术亮点

| 特性 | 实现 |
|------|------|
| **纯 CSS 轮播图** | `input[type=radio]` + `:checked` 伪类驱动，零 JS |
| **响应式布局** | 媒体查询断点适配桌面/平板/手机 |
| **滚动动画** | `IntersectionObserver` + `data-animate` 属性驱动淡入 |
| **导航高亮** | JavaScript 监听滚动位置自动切换 `active` |
| **汉堡菜单** | 移动端折叠导航，纯 CSS/JS 实现 |
| **图片懒加载** | 延迟加载优化首屏性能 |
| **新闻筛选** | 按分类过滤新闻列表 |
| **运动员筛选** | 按项目类别筛选运动员 |

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 语义化页面结构 |
| CSS3 | 动画、Flexbox、Grid、媒体查询、渐变 |
| Vanilla JavaScript | DOM 操作、事件处理、交互动效 |
| 响应式设计 | 移动端/平板/桌面三端适配 |

---

## 📄 许可证

MIT License
