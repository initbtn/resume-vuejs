# Change-flow 어댑터 — resume-vuejs (C tier)

`change-flow` 스킬이 `resume-vuejs` 저장소를 대상으로 돌 때 참조하는 프로젝트별 파라미터 어댑터 정의입니다.

---

## 파라미터 명세

| 키 | `resume-vuejs` 설정값 | 설명 |
| :--- | :--- | :--- |
| **issue(◦)** | **필수 (issue-first)** | 모든 기능 추가, 버그, 인프라 변경은 GitHub 이슈 선등록 후 착수. PR 생성 시 `closes #N`으로 연결 |
| **착수 표시(◦)** | **켠다 (기본값)** | 작업 시작 시 `gh issue edit <N> --add-assignee @me`로 착수 표기 |
| **worktree(①)** | **브랜치/worktree 격리** | `git checkout -b <type>/<description>` 또는 worktree 분기 후 작업 |
| **토큰(⓪⑤⑥⑧)** | `GH_TOKEN="$(pass show github.com/initbtn)"` | GitHub API 및 원격 푸시 자격 증명 |
| **TDD & verify(③)** | **TDD 필수 (Iron Law)**<br>`npm run test:run`<br>`npm run type-check`<br>`npm run build` | 1. 실패하는 테스트(RED) 선행 작성 후 구현(GREEN)<br>2. TypeScript 타입 검사 통과<br>3. Vite 번들링 빌드 검증 필수 |
| **커밋 컨벤션(④)** | `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:` | 한국어 또는 표준 영문 메시지, forward-only |
| **PR(⑥)** | PR 템플릿 준수, `closes #N` 필수 | 검증 증거(테스트 통과, 빌드 결과) 필수 포함 |
| **merge 모델(⑧)** | **squash-only** | 단독 owner, 사람 머지 게이트 준수 (사용자 명시 "머지해" 승인 시 실행) |
| **cleanup(⑨)** | 로컬/원격 브랜치 삭제 및 `main` 동기화 | 머지 완료 후 즉시 브랜치 정리 및 `git reset --hard origin/main` |
| **배포(⑩)** | **GitHub Actions CI/CD $\rightarrow$ GitHub Pages** | `main` 브랜치 머지 시 `.github/workflows/deploy.yml`을 통해 자동 빌드 및 `gh-pages` 브랜치로 무중단 배포 |
| **warming** | pass / gpg-agent | 자격 증명 캐시 상태 점검 후 실행 |
