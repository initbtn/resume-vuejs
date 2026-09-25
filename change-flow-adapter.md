# Change-flow 어댑터 — resume-vuejs (C tier)

`change-flow` 스킬이 `resume-vuejs` 저장소를 대상으로 돌 때 참조하는 프로젝트별 파라미터 어댑터 정의입니다.

## 파라미터

| 키 | `resume-vuejs` 설정값 | 설명 |
| :--- | :--- | :--- |
| **issue(◦)** | **버그·기능 추가 = 필수**, 사소한 수정 선택 | GitHub 이슈 선등록 (`publish-issue`), PR 시 `closes #N` 연결 |
| **착수 표시(◦)** | **켠다** | `gh issue edit <N> --add-assignee @me` |
| **프로젝트(◦)** | **없음** (추후 GitHub Projects 연결 시 번호 기재) | 보드 자동 전이 미사용 |
| **마일스톤** | **버전 차수별 사용** (`v1.0.0`, `v1.1.0` 등) | repo 스코프 마일스톤 연결 |
| **worktree(①)** | 브랜치 분기 (`feat/*`, `fix/*`) | 표준 Git 피처 브랜치 격리 |
| **토큰(⓪⑤⑥⑧)** | `GH_TOKEN="$(pass show github.com/initbtn)"` | GitHub API 및 인증 토큰 동적 주입 |
| **verify(③)** | `npm run test:run`<br>`npm run type-check`<br>`npm run build` | 1. Vitest 단위 테스트 통과<br>2. TypeScript 정적 타입 검사<br>3. Vite 프로덕션 빌드 성공 |
| **커밋(④)** | `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` | 한국어, forward-only |
| **PR(⑥)** | PR 본문에 검증 증거(테스트/빌드 결과) 첨부 | `closes #N` 필수 |
| **merge 모델(⑧)** | **squash-only** | 단독 owner, 사람 머지 게이트 준수 (명시 승인 시에만) |
| **cleanup(⑨)** | 로컬 및 원격 피처 브랜치 정리 | 머지 후 `main` 브랜치 동기화 |
| **배포(⑩)** | GitHub Actions $\rightarrow$ GitHub Pages (`gh-pages`) | `main` 머지 시 자동 빌드 배포 |
| **warming** | pass / gpg-agent | 자격 증명 캐시 상태 점검 후 실행 |
