# 🐔 Crazy Duck

Browser-based "Duck Hunting" game built with HTML5 Canvas and Vanilla JavaScript.

## 🎮 How to Play

1. Start a local HTTP server (required for language support):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (npx)
   npx http-server -p 8000
   
   # PHP
   php -S localhost:8000
   ```
2. Open `http://localhost:8000` in any modern browser
3. Click **"START GAME"**
4. Aim with the mouse and shoot with the left mouse button
5. Score as many points as possible in 90 seconds!

### 🖱️ Controls

- **Left Mouse Button** — Shoot
- **Right Mouse Button** — Reload (refill ammo to MAX)
- **Mouse Movement** — Aim
- **ESC** — Release mouse cursor

> **🔒 Mouse Capture:** The game uses Pointer Lock API to capture your mouse and prevent browser gestures. Press **ESC** to release the cursor.

## 🎯 Target Types

| Type | Points | Description |
|------|--------|-------------|
| 🐔 Normal | 10 | Flies slowly in a straight line |
| ⚡ Fast | 20 | Flies quickly, zigzag pattern |
| 🪂 Falling | 30 | Falls with parachute from top |
| 🛸 UFO | 50 | Flies very fast |

## 🎮 Controls

- **Mouse** — aiming
- **Left Mouse Button** — shoot

## 📋 Game Settings

- **Round time:** 90 seconds
- **Ammo:** 60 shots
- **Goal:** score maximum points

## 🛠️ Technologies

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (synthesized sounds)
- CSS3
- Supabase (online leaderboard)

## 🌐 Online Leaderboard

The game supports saving scores to Supabase cloud database. To set up:

1. Create a project at https://supabase.com
2. Run the SQL script from `SUPABASE_SETUP.md`
3. Insert your keys in `index.html` (class `DatabaseManager`)

Detailed instructions in **SUPABASE_SETUP.md**

## 📝 Features

- Procedural graphics (no external assets)
- Particle system (feathers on hit)
- Leaderboard (localStorage backup)
- Responsive design (100% window)
- Sound effects via Web Audio API

## 📄 License

MIT

## 🌍 Translations

- [Deutsch](docs/README.de.md)
- [Español](docs/README.es.md)
- [Français](docs/README.fr.md)
- [Italiano](docs/README.it.md)
- [Nederlands](docs/README.nl.md)
- [Русский](docs/README.ru.md)
- [Українська](docs/README.ua.md)
- [Polski](docs/README.pl.md)
- [Ελληνικά](docs/README.el.md)
- [العربية](docs/README.ar.md)
- [Türkçe](docs/README.tr.md)
- [日本語](docs/README.ja.md)
- [中文](docs/README.zh.md)
- [हिन्दी](docs/README.hi.md)
