# 🐔 Crazy Duck

Gioco di "Caccia alle anatre" nel browser con HTML5 Canvas e Vanilla JavaScript.

## 🎮 Come giocare

1. Avvia un server HTTP locale (richiesto per il supporto delle lingue):
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
2. Apri `http://localhost:8000` in un browser moderno
3. Clicca su **"INIZIA PARTITA"**
4. Mira con il mouse e spara con il pulsante sinistro
5. Fai il punteggio massimo in 90 secondi!

## 🎯 Tipi di bersagli

| Tipo | Punti | Descrizione |
|------|-------|-------------|
| 🐔 Normale | 10 | Vola lentamente in linea retta |
| ⚡ Veloce | 20 | Vole veloce, a zigzag |
| 🪂 Cadente | 30 | Cade con paracadute dall'alto |
| 🛸 UFO | 50 | Vola molto velocemente |

## 🎮 Controlli

- **Mouse** — mirare
- **Pulsante sinistro** — sparare

## 📋 Impostazioni di gioco

- **Tempo di round:** 90 secondi
- **Munizioni:** 60 colpi
- **Obiettivo:** fare il punteggio massimo

## 🛠️ Tecnologie

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (suoni sintetizzati)
- CSS3
- Supabase (classifica online)

## 🌐 Classifica online

Il gioco permette di salvare i punteggi nel database cloud Supabase. Configurazione:

1. Crea un progetto su https://supabase.com
2. Esegui lo script SQL da `SUPABASE_SETUP.md`
3. Inserisci le tue chiavi in `index.html` (classe `DatabaseManager`)

Istruzioni dettagliate in **SUPABASE_SETUP.md**

## 📝 Caratteristiche

- Grafica procedurale (nessun asset esterno)
- Sistema di particelle (piume all'impatto)
- Classifica (backup localStorage)
- Design responsive (100% finestra)
- Effetti sonori tramite Web Audio API

## 📄 Licenza

MIT

## 🌍 Traduzioni

- [English](../README.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Français](README.fr.md)
- [Nederlands](README.nl.md)
- [Русский](README.ru.md)
- [Українська](README.ua.md)
- [Polski](README.pl.md)
- [Ελληνικά](README.el.md)
- [العربية](README.ar.md)
- [Türkçe](README.tr.md)
- [日本語](README.ja.md)
- [中文](README.zh.md)
- [हिन्दी](README.hi.md)
