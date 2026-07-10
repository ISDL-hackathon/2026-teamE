-- ============================================================
-- ISDLove データベーススキーマ（Supabase / PostgreSQL）
-- 共通部：完成済み。Supabase の SQL Editor で実行する。
-- ============================================================

-- ユーザー
create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null check (role in ('B4', 'M1', 'M2', 'FACULTY')),
  bio           text default '',
  avatar_url    text default '',
  created_at    timestamptz not null default now()
);

-- いいね／保留
create table if not exists likes (
  id           uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references users(id),
  to_user_id   uuid not null references users(id),
  action       text not null check (action in ('LIKE', 'HOLD')),
  created_at   timestamptz not null default now(),
  unique (from_user_id, to_user_id)
);

-- マッチ（相互いいね成立ペア）
create table if not exists matches (
  id         uuid primary key default gen_random_uuid(),
  user_a_id  uuid not null references users(id),
  user_b_id  uuid not null references users(id),
  matched_at timestamptz not null default now(),
  unique (user_a_id, user_b_id)
);

-- メッセージ
create table if not exists messages (
  id        uuid primary key default gen_random_uuid(),
  match_id  uuid not null references matches(id),
  sender_id uuid not null references users(id),
  body      text not null,
  sent_at   timestamptz not null default now()
);

-- ランダムマッチング週次割り当て
create table if not exists random_assignments (
  id         uuid primary key default gen_random_uuid(),
  senior_id  uuid not null references users(id),
  b4_id      uuid not null references users(id),
  week_key   text not null,                     -- 例: '2026-W28'
  status     text not null default 'ASSIGNED' check (status in ('ASSIGNED', 'DONE')),
  created_at timestamptz not null default now(),
  unique (senior_id, week_key)                  -- 冪等性の担保
);

-- 通知
create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users(id),
  type       text not null check (type in ('MATCH', 'RANDOM', 'SYSTEM')),
  message    text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- インデックス
create index if not exists idx_likes_from on likes(from_user_id, created_at);
create index if not exists idx_likes_to   on likes(to_user_id);
create index if not exists idx_messages_match on messages(match_id, sent_at);
create index if not exists idx_notifications_user on notifications(user_id, created_at desc);
create index if not exists idx_assignments_week on random_assignments(week_key);
