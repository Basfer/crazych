# 🐔 Crazy Duck

Przeglądarkowa gra "Polowanie na kaczki" zbudowana z HTML5 Canvas i Vanilla JavaScript.

## 🎮 Jak grać

1. Uruchom lokalny serwer HTTP (wymagane dla obsługi języków):
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
2. Otwórz `http://localhost:8000` w dowolnej nowoczesnej przeglądarce
3. Kliknij **"ROZPOCZNIJ"**
4. Celuj myszką i strzelaj lewym przyciskiem
5. Zdobądź jak najwięcej punktów w 90 sekund!

## 🎯 Typy celów

| Typ | Punkty | Opis |
|-----|--------|------|
| 🐔 Zwykła | 10 | Leci powoli prosto |
| ⚡ Szybka | 20 | Leci szybko, zygzakiem |
| 🪂 Spadająca | 30 | Spada ze spadochronem z góry |
| 🛸 UFO | 50 | Leci bardzo szybko |

## 🎮 Sterowanie

- **Myszka** — celowanie
- **Lewy przycisk** — strzał

## 📋 Ustawienia gry

- **Czas rundy:** 90 sekund
- **Amunicja:** 60 strzałów
- **Cel:** zdobyć jak najwięcej punktów

## 🛠️ Technologie

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (syntetyzowane dźwięki)
- CSS3
- Supabase (ranking online)

## 🌐 Ranking online

Gra obsługuje zapisywanie wyników w bazie danych Supabase. Konfiguracja:

1. Utwórz projekt na https://supabase.com
2. Uruchom skrypt SQL z `SUPABASE_SETUP.md`
3. Wstaw swoje klucze do `index.html` (klasa `DatabaseManager`)

Szczegółowe instrukcje w **SUPABASE_SETUP.md**

## 📝 Funkcje

- Grafika proceduralna (bez zewnętrznych zasobów)
- System cząsteczek (pióra przy trafieniu)
- Ranking (kopia zapasowa w localStorage)
- Responsywny design (100% okna)
- Efekty dźwiękowe przez Web Audio API

## 📄 Licencja

MIT

## 🌍 Tłumaczenia

- [English](../README.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Français](README.fr.md)
- [Italiano](README.it.md)
- [Nederlands](README.nl.md)
- [Русский](README.ru.md)
- [Українська](README.ua.md)
- [Ελληνικά](README.el.md)
- [العربية](README.ar.md)
- [Türkçe](README.tr.md)
- [日本語](README.ja.md)
- [中文](README.zh.md)
- [हिन्दी](README.hi.md)
