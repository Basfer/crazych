# 🐔 Crazy Duck

HTML5 Canvas と Vanilla JavaScript を使用したブラウザベースの「カモ狩り」ゲーム。

## 🎮 遊び方

1. 最新のブラウザで `index.html` を開きます
2. **「ゲームスタート」**をクリック
3. マウスで照準を合わせ、左クリックで発射
4. 90 秒で最大得点を獲得！

## 🎯 標的の種類

| 種類 | ポイント | 説明 |
|------|----------|------|
| 🐔 通常 | 10 | ゆっくり直線飛行 |
| ⚡ 高速 | 20 | 速くジグザグに飛行 |
| 🪂 落下 | 30 | 上からパラシュートで落下 |
| 🛸 UFO | 50 | とても速く飛行 |

## 🎮 コントロール

- **マウス** — 照準
- **左クリック** — 発射

## 📋 ゲーム設定

- **ラウンド時間:** 90 秒
- **弾薬:** 60 発
- **目標:** 最大得点を獲得

## 🛠️ 技術

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API（合成サウンド）
- CSS3
- Supabase（オンラインリーダーボード）

## 🌐 オンラインリーダーボード

このゲームは、Supabase クラウドデータベースへのスコア保存をサポートしています。設定方法：

1. https://supabase.com でプロジェクトを作成
2. `SUPABASE_SETUP.md` の SQL スクリプトを実行
3. `index.html` にキーを挿入（`DatabaseManager` クラス）

詳細な手順は **SUPABASE_SETUP.md** を参照

## 📝 機能

- プロシージャルグラフィックス（外部アセットなし）
- パーティクルシステム（ヒット時の羽）
- リーダーボード（localStorage バックアップ）
- レスポンシブデザイン（ウィンドウの 100%）
- Web Audio API によるサウンドエフェクト

## 📄 ライセンス

MIT

## 🌍 翻訳

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
- [中文](README.zh.md)
- [हिन्दी](README.hi.md)
