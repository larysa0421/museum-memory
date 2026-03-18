-- Museum Memory · 数据库初始化脚本
-- 在 Supabase Dashboard → SQL Editor 中运行此脚本

-- ─── 1. 博物馆表 ─────────────────────────────────────────────
create table if not exists museums (
  id           bigint generated always as identity primary key,
  name         text not null,
  city         text not null,
  latitude     double precision not null,
  longitude    double precision not null,
  visited_at   date,
  tags         text[] default '{}',
  created_at   timestamptz default now()
);

-- ─── 2. 记忆表（每个博物馆对应一条记忆） ──────────────────────
create table if not exists memories (
  id           bigint generated always as identity primary key,
  museum_id    bigint references museums(id) on delete cascade unique,
  content      text default '',
  links        jsonb default '[]',   -- [{ url, title }]
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- 更新时间自动维护
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists memories_updated_at on memories;
create trigger memories_updated_at
  before update on memories
  for each row execute function update_updated_at();

-- ─── 3. 照片表 ───────────────────────────────────────────────
create table if not exists photos (
  id            bigint generated always as identity primary key,
  memory_id     bigint references memories(id) on delete cascade,
  url           text not null,
  storage_path  text not null,
  created_at    timestamptz default now()
);

-- ─── 4. Row Level Security（RLS）─────────────────────────────
-- MVP 阶段：允许所有操作（个人使用，无多用户需求）
-- 如后续需要账号隔离，在此修改策略

alter table museums  enable row level security;
alter table memories enable row level security;
alter table photos   enable row level security;

-- 允许匿名用户完整 CRUD（MVP 单用户模式）
create policy "allow all museums"  on museums  for all using (true) with check (true);
create policy "allow all memories" on memories for all using (true) with check (true);
create policy "allow all photos"   on photos   for all using (true) with check (true);

-- ─── 5. Storage Bucket ───────────────────────────────────────
-- 在 Supabase Dashboard → Storage → New bucket 中手动创建：
--   Bucket name: photos
--   Public bucket: ✅ 勾选（允许公开访问图片 URL）
--
-- 或者运行以下 SQL（需要 service_role 权限）：
-- insert into storage.buckets (id, name, public)
-- values ('photos', 'photos', true)
-- on conflict do nothing;

-- Storage 访问策略（在 Dashboard → Storage → Policies 中设置）：
-- Policy name: allow all
-- Allowed operations: SELECT, INSERT, UPDATE, DELETE
-- Policy definition: true

-- ─── 6. 示例数据（可选，用于测试） ───────────────────────────
-- 取消注释以插入一条示例数据：
/*
insert into museums (name, city, latitude, longitude, visited_at, tags)
values ('台北故宫博物院', '台北', 25.1025, 121.5482, '2024-06-15', array['历史', '艺术']);

insert into memories (museum_id, content, links)
values (
  (select id from museums where name = '台北故宫博物院'),
  '走进翠玉白菜的展厅时，忽然明白了为什么人们会跨越千里只为看它一眼。
那一抹绿，仿佛把整个夏天都封存在了玉石里。',
  '[{"url": "https://www.npm.gov.tw", "title": "台北故宫博物院官网"}]'
);
*/
