# Change-flow 어댑터 — resume-vuejs (C tier)

`change-flow` 스킬이 `resume-vuejs` 저장소를 대상으로 돌 때 참조하는 프로젝트별 파라미터 어댑터 정의입니다.

## 파라미터

| 키 | `resume-vuejs` 설정값 | 설명 |
| :--- | :--- | :--- |
| **issue(◦)** | **버그·기능 추가 = 필수**, 사소한 수정 선택 | GitHub 이슈 선등록 (`publish-issue`), PR 시 `closes #N` 연결 |
| **착수 표시(◦)** | **켠다** | `gh issue edit <N> --add-assignee @me` |
| **라벨(◦)** | `enhancement`, `bug`, `refactor`, `testing`, `documentation` | 이슈 성격별 표준 라벨 자동 부여 (`gh issue edit <N> --add-label <라벨>`) |
| **우선순위(◦)** | **Project 1 `Priority`** (`PVTSSF_lAHOB44Dic4Bkrc3zhjdiMU`)<br>`P0 - Blocker` · `P1 - High` · `P2 - Normal` · `P3 - Low` | 착수 시 이슈 중요도에 따라 우선순위 단일선택 옵션 부여 |
| **부모이슈·진행률(◦)** | `Parent issue` (`PVTF_lAHOB44Dic4Bkrc3zhjbMi4`)<br>`Sub-issues progress` (`PVTF_lAHOB44Dic4Bkrc3zhjbMi8`) | 상위 에픽/마일스톤 트래커 이슈를 부모로 지정 시 하위 서브이슈 진행률 자동 집계 |
| **작업순서·일정(◦⑧)** | `Start date` (`PVTF_lAHOB44Dic4Bkrc3zhjbNFw`)<br>`Target date` (`PVTF_lAHOB44Dic4Bkrc3zhjbNGU`) | 착수 시 `Start date = 오늘(YYYY-MM-DD)`, `Target date = 목표일` 배정<br>선행 마일스톤(v1.0.0 #3) 완료 후 후속 마일스톤(v1.1.0 #4) 순차 착수 |
| **프로젝트(◦)** | **Project 1 (`resume-vuejs`)** (owner: `@me`)<br>Status: `Todo` $\rightarrow$ `In Progress` $\rightarrow$ `Done` | `PVT_kwHOB44Dic4Bkrc3` (보드 자동 전이 및 Table/Board/Roadmap 동기화) |
| **마일스톤** | **버전 차수별 사용** (`v1.0.0`, `v1.1.0` 등) | repo 스코프 마일스톤 연결 |
| **worktree(①)** | 브랜치 분기 (`feat/*`, `fix/*`) | 표준 Git 피처 브랜치 격리 |
| **토큰(⓪⑤⑥⑧)** | `GH_TOKEN="$(pass show github.com/initbtn)"` | GitHub API 및 인증 토큰 동적 주입 |
| **verify(③)** | `npm run test:run`<br>`npm run type-check`<br>`npm run build` | 1. Vitest 단위 테스트 통과<br>2. TypeScript 정적 타입 검사<br>3. Vite 프로덕션 빌드 성공 |
| **커밋(④)** | `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` | 한국어, forward-only |
| **PR(⑥)** | PR 본문에 검증 증거(테스트/빌드 결과) 첨부 | `closes #N` 필수 |
| **merge 모델(⑧)** | **squash-only** | 단독 owner, 사람 머지 게이트 준수 (명시 승인 시에만) |
| **cleanup(⑨)** | 로컬 및 원격 피처 브랜치 정리 | 머지 후 `main` 브랜치 동기화 |
| **배포(⑩)** | GitHub Actions $\rightarrow$ GitHub Pages (`gh-pages`) | `main` 머지 시 자동 빌드 배포 |
| **Supabase 배선** | pass on-demand 자격증명 주입 | `token`: `pass show supabase.com/token-min2spapa`<br>`db-pass`: `pass show supabase.com/passward-db`<br>`ref`: `rhkrhkxrnpfnrqxwjojo` |
| **warming** | pass / gpg-agent | 자격 증명 캐시 상태 점검 후 실행 |
