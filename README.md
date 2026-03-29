## Question Tracker

Bu proje artık soruları `localStorage` yerine Supabase veritabanına kaydeder.

## 1) Supabase Kurulumu

Supabase SQL Editor içine [supabase/schema.sql](/Users/mustafa/my-desktop/AKA/3-CS/6-React-Single-Page-Apps(Git kurulu bunlarda)/question tracker/question-tracker/supabase/schema.sql) dosyasındaki SQL'i çalıştırın.

Bu script şu tabloları oluşturur:
- `questions`
- `question_review_status`

## 2) Ortam Değişkenleri

Kök dizinde `.env.local` oluşturun ve aşağıdakileri girin:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Örnek şablon için: [.env.example](/Users/mustafa/my-desktop/AKA/3-CS/6-React-Single-Page-Apps(Git kurulu bunlarda)/question tracker/question-tracker/.env.example)

## 3) Projeyi Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` açın.

## Notlar

- Uygulama istemci tarafında `@supabase/supabase-js` kullanır.
- Supabase bağlantısı [src/app/lib/supabaseClient.ts](/Users/mustafa/my-desktop/AKA/3-CS/6-React-Single-Page-Apps(Git kurulu bunlarda)/question tracker/question-tracker/src/app/lib/supabaseClient.ts) içinde.
- CRUD ve review status sorguları [src/app/lib/questionsApi.ts](/Users/mustafa/my-desktop/AKA/3-CS/6-React-Single-Page-Apps(Git kurulu bunlarda)/question tracker/question-tracker/src/app/lib/questionsApi.ts) içinde.

## Güvenlik

`supabase/schema.sql` içinde anon kullanıcıya tam erişim veren policy var. Bu, hızlı başlangıç için eklendi.
Üretim ortamında kullanıcı bazlı auth + daraltılmış RLS policy önerilir.
