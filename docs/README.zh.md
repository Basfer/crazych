# 🐔 Crazy Duck

使用 HTML5 Canvas 和 Vanilla JavaScript 构建的浏览器"猎鸭游戏"。

## 🎮 如何游玩

1. 在任何现代浏览器中打开 `index.html`
2. 点击 **"开始游戏"**
3. 用鼠标瞄准，左键射击
4. 在 90 秒内获得最高分！

## 🎯 目标类型

| 类型 | 分数 | 描述 |
|------|------|------|
| 🐔 普通 | 10 | 缓慢直线飞行 |
| ⚡ 快速 | 20 | 快速之字形飞行 |
| 🪂 降落 | 30 | 从上方带降落伞降落 |
| 🛸 UFO | 50 | 非常快速飞行 |

## 🎮 控制

- **鼠标** — 瞄准
- **左键** — 射击

## 📋 游戏设置

- **回合时间:** 90 秒
- **弹药:** 60 发
- **目标:** 获得最高分

## 🛠️ 技术

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API（合成音效）
- CSS3
- Supabase（在线排行榜）

## 🌐 在线排行榜

游戏支持将分数保存到 Supabase 云数据库。设置方法：

1. 在 https://supabase.com 创建项目
2. 运行 `SUPABASE_SETUP.md` 中的 SQL 脚本
3. 将密钥插入 `index.html`（`DatabaseManager` 类）

详细说明见 **SUPABASE_SETUP.md**

## 📝 特性

- 程序化图形（无外部资源）
- 粒子系统（击中时的羽毛）
- 排行榜（localStorage 备份）
- 响应式设计（100% 窗口）
- 通过 Web Audio API 的音效

## 📄 许可证

MIT

## 🌍 翻译

- [English](../README.md)
- [Русский](README.ru.md)
- [Українська](README.ua.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Français](README.fr.md)
- [Italiano](README.it.md)
- [Nederlands](README.nl.md)
- [Ελληνικά](README.el.md)
- [Polski](README.pl.md)
- [العربية](README.ar.md)
- [Türkçe](README.tr.md)
- [日本語](README.ja.md)
- [हिन्दी](README.hi.md)
