-- Migration: 20260926000000_create_resume_tables.sql
-- Description: Create 8 domain tables for resume-vuejs with Row Level Security (RLS)

-- 1. Profile
CREATE TABLE IF NOT EXISTS public.profile (
  id text PRIMARY KEY DEFAULT 'default',
  name text NOT NULL,
  position text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  github text NOT NULL,
  location text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Introduce
CREATE TABLE IF NOT EXISTS public.introduce (
  id text PRIMARY KEY DEFAULT 'default',
  contents text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Skill
CREATE TABLE IF NOT EXISTS public.skill (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category text NOT NULL,
  items text[] NOT NULL DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Experience
CREATE TABLE IF NOT EXISTS public.experience (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company text NOT NULL,
  position text NOT NULL,
  period text NOT NULL,
  description text,
  projects jsonb NOT NULL DEFAULT '[]'::jsonb,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Project
CREATE TABLE IF NOT EXISTS public.project (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  period text NOT NULL,
  "where" text,
  description text,
  achievements text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  link text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Education
CREATE TABLE IF NOT EXISTS public.education (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  institution text NOT NULL,
  course text NOT NULL,
  period text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Etc (Certifications)
CREATE TABLE IF NOT EXISTS public.etc (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  issuer text NOT NULL,
  date text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Footer
CREATE TABLE IF NOT EXISTS public.footer (
  id text PRIMARY KEY DEFAULT 'default',
  sign text NOT NULL,
  since integer NOT NULL DEFAULT 2026,
  github text NOT NULL,
  "originalRepo" text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ========================================================
-- Row Level Security (RLS) Policies
-- Public read-only access for anon role
-- Full access for authenticated & service_role
-- ========================================================

-- Enable RLS
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.introduce ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer ENABLE ROW LEVEL SECURITY;

-- 1. Profile policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.profile;
CREATE POLICY "Allow public read access for anon" ON public.profile
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.profile;
CREATE POLICY "Allow authenticated write access" ON public.profile
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 2. Introduce policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.introduce;
CREATE POLICY "Allow public read access for anon" ON public.introduce
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.introduce;
CREATE POLICY "Allow authenticated write access" ON public.introduce
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 3. Skill policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.skill;
CREATE POLICY "Allow public read access for anon" ON public.skill
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.skill;
CREATE POLICY "Allow authenticated write access" ON public.skill
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 4. Experience policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.experience;
CREATE POLICY "Allow public read access for anon" ON public.experience
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.experience;
CREATE POLICY "Allow authenticated write access" ON public.experience
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 5. Project policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.project;
CREATE POLICY "Allow public read access for anon" ON public.project
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.project;
CREATE POLICY "Allow authenticated write access" ON public.project
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 6. Education policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.education;
CREATE POLICY "Allow public read access for anon" ON public.education
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.education;
CREATE POLICY "Allow authenticated write access" ON public.education
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 7. Etc policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.etc;
CREATE POLICY "Allow public read access for anon" ON public.etc
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.etc;
CREATE POLICY "Allow authenticated write access" ON public.etc
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- 8. Footer policies
DROP POLICY IF EXISTS "Allow public read access for anon" ON public.footer;
CREATE POLICY "Allow public read access for anon" ON public.footer
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.footer;
CREATE POLICY "Allow authenticated write access" ON public.footer
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
