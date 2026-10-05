-- 관리자 CMS 는 로그인(authenticated) JWT 로 읽고 쓴다. 테이블 권한(GRANT)이 없어 로그인 요청이 모두 403 이었다.
-- authenticated 에 권한을 주되, 같은 프로젝트의 다른 앱(kakao 로그인 사용자)도 authenticated 이므로
-- 쓰기 정책은 USING (true) 가 아니라 관리자 한 명(auth.uid)으로 제한한다. 읽기는 anon·authenticated 모두 허용한다.
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.profile,
  public.introduce,
  public.skill,
  public.experience,
  public.project,
  public.education,
  public.etc,
  public.footer,
  public.highlight
  TO authenticated;

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.profile;
CREATE POLICY "Allow public read access" ON public.profile
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.profile;
CREATE POLICY "Allow admin write access" ON public.profile
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.introduce;
CREATE POLICY "Allow public read access" ON public.introduce
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.introduce;
CREATE POLICY "Allow admin write access" ON public.introduce
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.skill;
CREATE POLICY "Allow public read access" ON public.skill
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.skill;
CREATE POLICY "Allow admin write access" ON public.skill
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.experience;
CREATE POLICY "Allow public read access" ON public.experience
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.experience;
CREATE POLICY "Allow admin write access" ON public.experience
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.project;
CREATE POLICY "Allow public read access" ON public.project
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.project;
CREATE POLICY "Allow admin write access" ON public.project
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.education;
CREATE POLICY "Allow public read access" ON public.education
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.education;
CREATE POLICY "Allow admin write access" ON public.education
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.etc;
CREATE POLICY "Allow public read access" ON public.etc
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.etc;
CREATE POLICY "Allow admin write access" ON public.etc
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.footer;
CREATE POLICY "Allow public read access" ON public.footer
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.footer;
CREATE POLICY "Allow admin write access" ON public.footer
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');

DROP POLICY IF EXISTS "Allow public read access for anon" ON public.highlight;
CREATE POLICY "Allow public read access" ON public.highlight
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated write access" ON public.highlight;
CREATE POLICY "Allow admin write access" ON public.highlight
  FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80') WITH CHECK ((SELECT auth.uid()) = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80');
