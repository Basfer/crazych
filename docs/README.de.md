# 🐔 Crazy Duck

Browser-basiertes "Entenjagd"-Spiel mit HTML5 Canvas und Vanilla JavaScript.

## 🎮 Spielanleitung

1. Öffnen Sie `index.html` in einem modernen Browser
2. Klicken Sie auf **"SPIEL STARTEN"**
3. Zielen Sie mit der Maus und schießen Sie mit der linken Maustaste
4. Sammeln Sie so viele Punkte wie möglich in 90 Sekunden!

## 🎯 Zieltypen

| Typ | Punkte | Beschreibung |
|-----|--------|--------------|
| 🐔 Normal | 10 | Fliegt langsam geradeaus |
| ⚡ Schnell | 20 | Fliegt schnell, Zickzack-Muster |
| 🪂 Fallend | 30 | Fällt mit Fallschirm von oben |
| 🛸 UFO | 50 | Fliegt sehr schnell |

## 🎮 Steuerung

- **Maus** — Zielen
- **Linke Maustaste** — Schießen

## 📋 Spieleinstellungen

- **Rundenzeit:** 90 Sekunden
- **Munition:** 60 Schuss
- **Ziel:** maximale Punkte erreichen

## 🛠️ Technologien

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (synthetisierte Sounds)
- CSS3
- Supabase (Online-Bestenliste)

## 🌐 Online-Bestenliste

Das Spiel unterstützt das Speichern von Ergebnissen in der Supabase-Cloud-Datenbank. Einrichtung:

1. Erstellen Sie ein Projekt unter https://supabase.com
2. Führen Sie das SQL-Skript aus `SUPABASE_SETUP.md` aus
3. Fügen Sie Ihre Schlüssel in `index.html` ein (Klasse `DatabaseManager`)

Detaillierte Anweisungen in **SUPABASE_SETUP.md**

## 📝 Funktionen

- Procedurale Grafik (keine externen Assets)
- Partikelsystem (Federn bei Treffer)
- Bestenliste (localStorage-Sicherung)
- Responsives Design (100% Fenster)
- Soundeffekte über Web Audio API

## 📄 Lizenz

MIT

## 🌍 Übersetzungen

- [English](../README.md)
- [Русский](README.ru.md)
- [Українська](README.ua.md)
- [Español](README.es.md)
- [Français](README.fr.md)
- [Italiano](README.it.md)
- [Nederlands](README.nl.md)
- [Ελληνικά](README.el.md)
- [Polski](README.pl.md)
- [العربية](README.ar.md)
- [Türkçe](README.tr.md)
- [日本語](README.ja.md)
- [中文](README.zh.md)
- [हिन्दी](README.hi.md)
