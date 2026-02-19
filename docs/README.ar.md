# 🐔 Crazy Duck

لعبة "صيد البط" في المتصفح باستخدام HTML5 Canvas و Vanilla JavaScript.

## 🎮 كيفية اللعب

1. قم بتشغيل خادم HTTP محلي (مطلوب لدعم اللغات):
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
2. افتح `http://localhost:8000` في أي متصفح حديث
3. انقر على **"ابدأ اللعبة"**
4. صوب بالماوس وأطلق النار بالزر الأيسر
5. سجل أكبر عدد من النقاط في 90 ثانية!

## 🎯 أنواع الأهداف

| النوع | النقاط | الوصف |
|-------|--------|-------|
| 🐔 عادي | 10 | يطير ببطء في خط مستقيم |
| ⚡ سريع | 20 | يطير بسرعة، نمط متعرج |
| 🪂 ساقط | 30 | يسقط بمظلة من الأعلى |
| 🛸 جسم طائر | 50 | يطير بسرعة كبيرة |

## 🎮 التحكم

- **الماوس** — التصويب
- **الزر الأيسر** — إطلاق النار

## 📋 إعدادات اللعبة

- **وقت الجولة:** 90 ثانية
- **الذخيرة:** 60 طلقة
- **الهدف:** تسجيل أقصى عدد من النقاط

## 🛠️ التقنيات

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (أصوات مركبة)
- CSS3
- Supabase (لوحة المتصدرين عبر الإنترنت)

## 🌐 لوحة المتصدرين عبر الإنترنت

تدعم اللعبة حفظ النتائج في قاعدة بيانات Supabase السحابية. للإعداد:

1. أنشئ مشروعًا على https://supabase.com
2. قم بتشغيل نص SQL من `SUPABASE_SETUP.md`
3. أدخل مفاتيحك في `index.html` (فئة `DatabaseManager`)

تعليمات مفصلة في **SUPABASE_SETUP.md**

## 📝 الميزات

- رسومات إجرائية (بدون أصول خارجية)
- نظام الجسيمات (ريش عند الإصابة)
- لوحة المتصدرين (نسخة احتياطية في localStorage)
- تصميم متجاوب (100% النافذة)
- مؤثرات صوتية عبر Web Audio API

## 📄 الترخيص

MIT

## 🌍 الترجمات

- [English](../README.md)
- [Deutsch](README.de.md)
- [Español](README.es.md)
- [Français](README.fr.md)
- [Italiano](README.it.md)
- [Nederlands](README.nl.md)
- [Русский](README.ru.md)
- [Українська](README.ua.md)
- [Polski](README.pl.md)
- [Ελληνικά](README.el.md)
- [Türkçe](README.tr.md)
- [日本語](README.ja.md)
- [中文](README.zh.md)
- [हिन्दी](README.hi.md)
