-- Migration: 20261005000000_create_highlight_table.sql
-- Description: 핵심 역량 3단 카드(Highlight) CMS 편집용 테이블 + RLS

CREATE TABLE IF NOT EXISTS public.highlight (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.highlight ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.highlight;
CREATE POLICY "Allow public read access for anon" ON public.highlight
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.highlight;
CREATE POLICY "Allow authenticated write access" ON public.highlight
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

TRUNCATE TABLE public.highlight RESTART IDENTITY;
INSERT INTO public.highlight (title, description, keywords, order_index) VALUES
('Startup to Enterprise', '5인 스타트업부터 대기업까지, 다양한 규모의 조직에서 성장한 풀스택 커리어', ARRAY['Adaptability', 'Growth', 'Leadership'], 0),
('Product-Driven Architecture', '비즈니스 요구사항 구체화부터 대규모 시스템 설계, 성능 최적화, 성과 측정까지 전 과정을 주도', ARRAY['System Design', 'Optimization', 'Business Impact'], 1),
('Knowledge Sharing', '400여 개 기술 포스트, 다수의 외부 발표와 멘토링으로 개발 커뮤니티에 꾸준히 기여', ARRAY['Blog', 'Mentoring', 'Open Source'], 2);
