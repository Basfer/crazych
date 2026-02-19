# 🐔 Crazy Duck

HTML5 Canvas ve Vanilla JavaScript ile tarayıcı tabanlı "Ördek Avı" oyunu.

## 🎮 Nasıl oynanır

1. Yerel bir HTTP sunucusu başlatın (dil desteği için gerekli):
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
2. `http://localhost:8000` adresini modern bir tarayıcıda açın
3. **"OYUNU BAŞLAT"** düğmesine tıklayın
4. Fare ile nişan alın ve sol tıkla ateş edin
5. 90 saniyede maksimum puanı toplayın!

## 🎯 Hedef türleri

| Tür | Puan | Açıklama |
|-----|------|----------|
| 🐔 Normal | 10 | Yavaşça düz uçar |
| ⚡ Hızlı | 20 | Hızlı uçar, zikzak yapar |
| 🪂 Düşen | 30 | Yukarıdan paraşütle düşer |
| 🛸 UFO | 50 | Çok hızlı uçar |

## 🎮 Kontroller

- **Fare** — nişan al
- **Sol tık** — ateş et

## 📋 Oyun ayarları

- **Tur süresi:** 90 saniye
- **Mermi:** 60 atış
- **Hedef:** maksimum puan topla

## 🛠️ Teknolojiler

- HTML5 Canvas
- Vanilla JavaScript (ES6+)
- Web Audio API (sentetik sesler)
- CSS3
- Supabase (çevrimiçi lider tablosu)

## 🌐 Çevrimiçi lider tablosu

Oyun, Supabase bulut veritabanına puan kaydetmeyi destekler. Kurulum:

1. https://supabase.com adresinde bir proje oluşturun
2. `SUPABASE_SETUP.md` dosyasındaki SQL betiğini çalıştırın
3. Anahtarlarınızı `index.html` dosyasına ekleyin (`DatabaseManager` sınıfı)

Detaylı talimatlar **SUPABASE_SETUP.md** dosyasında

## 📝 Özellikler

- Prosedürel grafikler (harici varlık yok)
- Parçacık sistemi (vuruşta tüyler)
- Lider tablosu (localStorage yedeği)
- Duyarlı tasarım (%100 pencere)
- Web Audio API ile ses efektleri

## 📄 Lisans

MIT

## 🌍 Çeviriler

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
- [العربية](README.ar.md)
- [日本語](README.ja.md)
- [中文](README.zh.md)
- [हिन्दी](README.hi.md)
