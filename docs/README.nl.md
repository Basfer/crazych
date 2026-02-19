# 🐔 Crazy Duck

Browsergebaseerd "Eendenjacht"-spel met HTML5 Canvas en Vanilla JavaScript.

## 🎮 Hoe te spelen

1. Open `index.html` in een moderne browser
2. Klik op **"START SPEL"**
3. Richt met de muis en schiet met de linkermuisknop
4. Scoor zoveel mogelijk punten in 90 seconden!

## 🎯 Doeltypen

| Type | Punten | Beschrijving |
|------|--------|--------------|
| 🐔 Normaal | 10 | Vliegt langzaam rechtuit |
| ⚡ Snel | 20 | Vliegt snel, zigzagpatroon |
| 🪂 Vallend | 30 | Valt met parachute van boven |
| 🛸 UFO | 50 | Vliegt zeer snel |

## 🎮 Besturing

- **Muis** — richten
- **Linkermuisknop** — schieten

## 📋 Spelinstellingen

- **Rondetijd:** 90 seconden
- **Munitie:** 60 schoten
- **Doel:** maximale score behalen

## 🛠️ Technologieën

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (gesynthetiseerde geluiden)
- CSS3
- Supabase (online ranglijst)

## 🌐 Online ranglijst

Het spel ondersteunt het opslaan van scores in de Supabase-cloud-database. Instellen:

1. Maak een project aan op https://supabase.com
2. Voer het SQL-script uit `SUPABASE_SETUP.md` uit
3. Voeg je sleutels toe in `index.html` (klasse `DatabaseManager`)

Gedetailleerde instructies in **SUPABASE_SETUP.md**

## 📝 Functies

- Procedurele graphics (geen externe assets)
- Deeltjessysteem (veren bij treffer)
- Ranglijst (localStorage-back-up)
- Responsief ontwerp (100% venster)
- Geluidseffecten via Web Audio API

## 📄 Licentie

MIT

## 🌍 Vertalingen

- [English](../README.md)
- [Русский](README.ru.md)
- [Українська](README.ua.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Français](README.fr.md)
- [Italiano](README.it.md)
- [Ελληνικά](README.el.md)
- [Polski](README.pl.md)
- [العربية](README.ar.md)
- [Türkçe](README.tr.md)
- [日本語](README.ja.md)
- [中文](README.zh.md)
- [हिन्दी](README.hi.md)
