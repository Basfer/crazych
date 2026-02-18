# 🔧 Настройка Supabase для Crazy Chicken

## Шаг 1: Создайте проект на Supabase

1. Зайдите на https://supabase.com
2. Нажмите **Start your project**
3. Создайте новый проект или войдите через GitHub

## Шаг 2: Создайте таблицу

В SQL Editor выполните следующий запрос:

```sql
-- Таблица для лидеров
CREATE TABLE highscores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для быстрого поиска топ игроков
CREATE INDEX idx_highscores_score ON highscores(score DESC);

-- Включаем RLS (Row Level Security)
ALTER TABLE highscores ENABLE ROW LEVEL SECURITY;

-- Политика: читать могут все
CREATE POLICY "Anyone can read highscores"
    ON highscores
    FOR SELECT
    USING (true);

-- Политика: записывать могут все (но только новые записи)
CREATE POLICY "Anyone can insert highscores"
    ON highscores
    FOR INSERT
    WITH CHECK (true);

-- Политика: запрещаем обновление и удаление
CREATE POLICY "No updates allowed"
    ON highscores
    FOR UPDATE
    USING (false);

CREATE POLICY "No deletes allowed"
    ON highscores
    FOR DELETE
    USING (false);
```

## Шаг 3: Получите ключи доступа

1. В меню проекта перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (начинается с `eyJ...`)

## Шаг 4: Вставьте ключи в игру

Откройте `index.html` и найдите класс `DatabaseManager` (примерно строка 975):

```javascript
class DatabaseManager {
    constructor() {
        // ВНИМАНИЕ: Эти данные видны в браузере, но RLS защищает базу
        this.supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';  // ← Вставьте ваш URL
        this.supabaseKey = 'YOUR_ANON_KEY';  // ← Вставьте ваш anon key
        // ...
    }
}
```

Замените:
- `'https://YOUR_PROJECT_ID.supabase.co'` на ваш Project URL
- `'YOUR_ANON_KEY'` на ваш anon/public key

## Шаг 5: Проверьте работу

1. Откройте `index.html` в браузере
2. Откройте консоль разработчика (F12)
3. Сыграйте игру и сохраните результат
4. В консоли должно появиться: `Score saved successfully`
5. Проверьте таблицу в Supabase: **Table Editor** → `highscores`

## 🔄 Миграция локальных рекордов

При первом запуске с подключённым Supabase игра **автоматически перенесёт** все локальные рекорды из localStorage в облачную базу:

- ✅ Дубликаты не создаются (проверка по имени и счёту)
- ✅ Миграция происходит один раз за сессию
- ✅ Локальные данные сохраняются как резервная копия

## 🗑️ Очистка локальных рекордов

После миграции вы можете очистить локальные рекорды:

1. Завершите игру и дойдите до экрана **Game Over**
2. Нажмите кнопку **"🗑️ ОЧИСТИТЬ ЛОКАЛЬНЫЕ"**
3. Подтвердите операцию

**Важно:** Сначала сохраните хотя бы один результат в Supabase, чтобы убедиться в подключении!

## 🔒 Безопасность

### Почему это безопасно?

1. **Row Level Security (RLS)** защищает базу на уровне PostgreSQL
2. **Анонимный ключ** имеет ограничения только на запись/чтение из таблицы `highscores`
3. **Запрещены UPDATE и DELETE** — можно только добавлять новые записи
4. Даже если кто-то получит ключ, он не сможет:
   - Изменить существующие результаты
   - Удалить данные
   - Получить доступ к другим таблицам

### Дополнительные меры (опционально)

Если хотите добавить модерацию результатов:

```sql
-- Добавить проверку на разумные значения
CREATE POLICY "Score must be reasonable"
    ON highscores
    FOR INSERT
    WITH CHECK (score >= 0 AND score <= 10000);
```

## 📊 Просмотр результатов

В Supabase: **Table Editor** → `highscores`

Или через API:
```javascript
const { data } = await supabase
    .from('highscores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);
```

## 🚀 Публикация

После настройки:
1. Закоммитьте изменения
2. Запушите на GitHub
3. Включите GitHub Pages

Игра будет работать с общей базой результатов для всех игроков!

## 📱 Индикаторы статуса

На экране **Game Over** вы увидите:
- ✅ **Supabase подключён** — результаты сохраняются в облако
- ⚠️ **Supabase не подключён** — работает только локальное сохранение
- 🌐 **Метка у результатов** — рекорды загружены из облака
