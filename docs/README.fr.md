# 🐔 Crazy Duck

Jeu de "Chasse aux canards" dans le navigateur avec HTML5 Canvas et Vanilla JavaScript.

## 🎮 Comment jouer

1. Démarrez un serveur HTTP local (requis pour le support des langues):
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
2. Ouvrez `http://localhost:8000` dans un navigateur moderne
3. Cliquez sur **"COMMENCER"**
4. Visez avec la souris et tirez avec le bouton gauche
5. Marquez le maximum de points en 90 secondes !

## 🎯 Types de cibles

| Type | Points | Description |
|------|--------|-------------|
| 🐔 Normal | 10 | Vole lentement en ligne droite |
| ⚡ Rapide | 20 | Vole vite, en zigzag |
| 🪂 Tombant | 30 | Tombe avec parachute d'en haut |
| 🛸 OVNI | 50 | Vole très vite |

## 🎮 Contrôles

- **Souris** — viser
- **Clic gauche** — tirer

## 📋 Paramètres du jeu

- **Temps de manche:** 90 secondes
- **Munitions:** 60 tirs
- **Objectif:** marquer le maximum de points

## 🛠️ Technologies

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (sons synthétisés)
- CSS3
- Supabase (classement en ligne)

## 🌐 Classement en ligne

Le jeu permet de sauvegarder les scores dans la base de données cloud Supabase. Configuration:

1. Créez un projet sur https://supabase.com
2. Exécutez le script SQL de `SUPABASE_SETUP.md`
3. Insérez vos clés dans `index.html` (classe `DatabaseManager`)

Instructions détaillées dans **SUPABASE_SETUP.md**

## 📝 Fonctionnalités

- Graphismes procéduraux (pas d'assets externes)
- Système de particules (plumes à l'impact)
- Classement (sauvegarde localStorage)
- Design responsive (100% fenêtre)
- Effets sonores via Web Audio API

## 📄 Licence

MIT

## 🌍 Traductions

- [English](../README.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Italiano](README.it.md)
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
