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
| **보안 (Network Restrictions)** | 개발자 공인 IP CIDR 화이트리스트 | DB 직접 연결(5432/6543) 제한 (`scripts/supabase.sh network-allow-ip`, `network-restrictions get`) |
| **보안 (CORS & URL)** | 허용 Origin 명시 | `site_url`: `https://initbtn.github.io/resume-vuejs/`<br>`uri_allow_list`: `http://localhost:5173,https://initbtn.github.io/**` |
| **warming** | pass / gpg-agent | 자격 증명 캐시 상태 점검 후 실행 |
| **Vue 구조(②)** | SFC 는 UI 렌더링만 맡고, 데이터 fetch·구독·타이머 같은 부수효과와 상태는 composable(`use*`)로 뺀다(SRP). 새 변종은 기존 `v-if`·분기를 고치지 않고 공통 props·emit 계약을 따르는 컴포넌트를 레지스트리에 등록한다(OCP). 같은 계약을 따르는 컴포넌트는 서로 바꿔 끼울 수 있다(LSP). 컴포넌트에는 쓰는 props 만 좁게 넘기고 store·응답 객체째 넘기지 않는다(ISP). 컴포넌트는 I/O 클라이언트를 직접 만들거나 import 하지 않고 composable·provide/inject·props 로 받는다(DIP) | SFC 는 UI, 부수효과·상태는 composable |
| **Vue 스타일(②)** | 인라인 `style`·`:style` 0개. 스타일은 클래스(Tailwind 유틸리티 또는 컴포넌트 클래스)로만 쓰고, 색·간격 값은 토큰(CSS 변수·Tailwind 설정)에서 가져온다. 동적 값이 필요하면 클래스를 바꾸거나 CSS 변수로 넘긴다 | 인라인 style 0개, 토큰 기반 클래스 |
| **하드코딩·상수(②)** | 매직 넘버·색·URL·키·문구를 코드에 흩뿌려 박지 않는다. 같은 값이 둘 이상의 자리에 쓰이면 한 곳(상수·토큰·설정)에서 정의해 참조한다. 환경마다 다른 값은 설정·env 로 받고 시크릿은 코드에 두지 않는다 | 중복 값은 한 곳에서 정의 |

