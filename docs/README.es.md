# 🐔 Crazy Duck

Juego de "Caza de Patos" en navegador con HTML5 Canvas y Vanilla JavaScript.

## 🎮 Cómo jugar

1. Inicia un servidor HTTP local (requerido para soporte de idiomas):
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
2. Abre `http://localhost:8000` en cualquier navegador moderno
3. Haz clic en **"INICIAR JUEGO"**
4. Apunta con el ratón y dispara con el botón izquierdo
5. ¡Consigue la máxima puntuación en 90 segundos!

## 🎯 Tipos de objetivos

| Tipo | Puntos | Descripción |
|------|--------|-------------|
| 🐔 Normal | 10 | Vuela lento en línea recta |
| ⚡ Rápido | 20 | Vuela rápido, en zigzag |
| 🪂 Cayendo | 30 | Cae con paracaídas desde arriba |
| 🛸 OVNI | 50 | Vuela muy rápido |

## 🎮 Controles

- **Ratón** — apuntar
- **Clic izquierdo** — disparar

## 📋 Configuración del juego

- **Tiempo de ronda:** 90 segundos
- **Munición:** 60 disparos
- **Objetivo:** conseguir máxima puntuación

## 🛠️ Tecnologías

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (sonidos sintetizados)
- CSS3
- Supabase (tabla de líderes online)

## 🌐 Tabla de líderes online

El juego permite guardar puntuaciones en la base de datos en la nube Supabase. Configuración:

1. Crea un proyecto en https://supabase.com
2. Ejecuta el script SQL de `SUPABASE_SETUP.md`
3. Inserta tus claves en `index.html` (clase `DatabaseManager`)

Instrucciones detalladas en **SUPABASE_SETUP.md**

## 📝 Características

- Gráficos procedimentales (sin assets externos)
- Sistema de partículas (plumas al impactar)
- Tabla de líderes (copia en localStorage)
- Diseño responsivo (100% ventana)
- Efectos de sonido vía Web Audio API

## 📄 Licencia

MIT

## 🌍 Traducciones

- [English](../README.md)
- [Deutsch](README.de.md)
- [Français](README.fr.md)
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
