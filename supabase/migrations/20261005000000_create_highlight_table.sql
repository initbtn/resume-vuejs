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
('User-Centered Development', '조선·해양 현장, 교육, 보험 서비스 등 다양한 도메인을 경험하며 사용자의 입장에서 불편을 먼저 살피고, 화면과 오류 처리까지 사용자 관점에서 고민하며 개발하려 노력합니다', ARRAY['User Perspective', 'Diverse Experience', 'UX Details'], 0),
('Partner Communication', '작은 팀에서 보험사·보험협회·PG·본인인증·블록체인 등 외부 파트너와의 소통을 직접 맡아 정산, 클레임, 시스템 연계를 조율하며 협업하는 법을 배우고 있습니다', ARRAY['External Collaboration', 'Coordination', 'Communication'], 1),
('Documentation & Records', '팀 업무와 개인 프로젝트 모두에서 이슈와 PR로 작업의 이유와 과정을 기록해, 동료가 읽고 이어받을 수 있는 흔적을 남기려 노력합니다', ARRAY['Documentation', 'Issue Tracking', 'Knowledge Sharing'], 2);
