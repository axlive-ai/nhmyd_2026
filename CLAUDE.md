# nhmyd_2026 — NH마이데이터 2026 고도화 UI 퍼블리싱

## 프로젝트 개요

농협(NH) 마이데이터 서비스의 UI 퍼블리싱 프로젝트. **소스 자체는 2023년
버전이지만, 2026년부터 이어지는 고도화 작업**이라 프로젝트명/설정은 2026
기준으로 정리함. **폴더명 `nhmyd_2023` → `nhmyd_2026` 변경 완료**
(2026-07-03). 지금까지 버전관리는 **SVN**(.svn) 사용. **Git으로 전환 예정**
(SVN 히스토리는 가져가지 않고 새 저장소로 시작 — 아래 "SVN → Git 이전"
섹션 참고. `git init`은 아직 미실행). 며칠 내 최신 소스로 교체 후 그 위에서
신규 작업을 이어갈 예정.

## 폴더 구조

```
D:\DEV\nhmyd_2026\        (폴더명 nhmyd_2023 → nhmyd_2026 변경 완료, 2026-07-03)
├── .vscode/mcp.json      Figma 원격 MCP 서버 설정 (https://mcp.figma.com/mcp)
├── .editorconfig         들여쓰기/인코딩/EOL 표준화 (2026-07-03 추가)
├── index.html
├── com/                  공통 리소스
├── accessibility/
└── project/              실제 퍼블리싱 작업 폴더
    ├── package.json      devDependencies: gulp, gulp-file-include, browser-sync, del
    ├── .nvmrc            Node 버전 고정 (22, 2026-07-03 추가)
    ├── gulpfile.js       빌드 태스크 정의
    ├── src/
    │   ├── pub/          @@include 방식 신규 소스 (예: ae/MSAE1100P.html)
    │   └── _include/     공통 파셜 (_head, _header, _footer, _meta)
    ├── pub/              빌드 결과물 — SVN 관리 대상, 895개 레거시 HTML 포함
    ├── css/, js/, images/, fonts/  레거시 정적 리소스 (vendor 라이브러리 포함, npm 미사용)
    └── cms/, email/, event/, terms/
```

## 빌드 시스템

```
cd project
npm install         # 최초 1회 (또는 .nvmrc의 Node 버전으로 nvm use 후)
npm start           # = gulp: 개발 서버(browser-sync, :3000) + 라이브리로드
npm run build       # = gulp build: HTML만 빌드 (배포용)
npm run build:check # = gulp clean:dry: 실제 삭제 없이 "이번 build가 지울 pub/
                     #   파일 목록"만 미리 출력. build 전에 습관적으로 먼저
                     #   실행해서 개수가 예상과 맞는지 확인 권장.
```

`gulp-file-include`가 `src/pub/**/*.html`의 `@@include('_header.html')` 등을
`src/_include/`의 공통 파셜로 치환해 `pub/`에 최종 HTML을 생성.

**빌드 안전장치**: `gulpfile.js`의 `clean()`은 메뉴 폴더 전체가 아니라
`src/pub`에 실제로 존재하는 파일에 대응하는 `pub/` 결과물만 지우고, 삭제 전
대상 목록/개수를 콘솔에 항상 출력한다. `npm run build` 로그에서 개수가
예상과 다르면 바로 Ctrl+C.

**줄바꿈(EOL)**: 레거시 895개 파일은 CRLF(Windows)인데 `gulp-file-include`는
기본적으로 LF를 출력한다. 이 차이를 그대로 두면 마이그레이션한 파일마다
실제 내용 변경 여부와 무관하게 SVN diff가 전체 줄 단위로 깨져 보인다. 그래서
`gulpfile.js`의 `html()` 파이프라인에 `toCRLF()` 변환을 추가해 항상
레거시와 동일한 CRLF로 출력하도록 했다 (완전 마이그레이션 후 LF로 전환하는
건 별도 논의 필요).

## 레거시 vs 신규 소스 차이 (중요)

- **레거시(pub/ 895개 파일)**: node_modules 전혀 미사용. 순수 정적 HTML/CSS/JS이며
  jQuery, Swiper, html2canvas, lottie 등은 npm 패키지가 아니라 minified 파일을
  그대로 커밋해서 사용. 각 페이지 head/header/footer는 `@@include` 없이
  파일마다 직접 복사·붙여넣기 되어 있음.
- **신규(src/pub/ae/MSAE1100P.html 1개 존재)**: `@@include` 템플릿 방식.
  gulp-file-include(node_modules) 필요.
- package.json/gulpfile.js는 2026-07-01에 신규 추가된 파일 — 앞으로 헤더/푸터를
  895개 파일 개별 수정 대신 `_include` 파셜 하나만 고치도록 도입한 신규 툴링.

## 현재 상태 (2026-07-03 기준)

- **폴더명 변경 완료**: `nhmyd_2023` → `nhmyd_2026`. `git init`/`git add`/
  첫 커밋은 아직 미실행.
- **주의(Cowork 샌드박스 마운트 한계)**: Cowork 세션의 bash 샌드박스에서
  `project/` 하위 내용(`package.json` 등)이 정상적으로 보이지 않는 현상을
  확인함 (Read 도구로는 정상 조회됨 — Windows 경로 접근은 문제 없음, bash
  마운트만 project/ 서브폴더를 빈 디렉터리로 인식). 원인 불명(대용량
  node_modules/pub 895개 파일로 인한 마운트 동기화 지연 추정). 따라서
  **`git init`/`git add .`/첫 커밋은 Cowork 샌드박스가 아니라 로컬 VS Code
  터미널에서 실행 권장** — npm install과 동일한 이유로 로컬 작업 필요.
- `npm install`은 로컬 VS Code 터미널에서 완료됨 — `node_modules`,
  `package-lock.json` 생성 확인. (Cowork 세션 샌드박스 자체는 네트워크 정책상
  `registry.npmjs.org`가 차단돼 있어 새 패키지 설치는 항상 로컬에서 해야 함.)
- `.vscode/mcp.json`의 Figma MCP는 설정만 등록된 상태. VS Code에서 서버 Start 후
  Figma 계정 OAuth 인증 필요 (인증 여부 미확인).
- **주의(발생했던 사고)**: `npm run build`(= `gulp build`)를 처음 실행했을 때
  `clean()`이 `pub/ae, ar, as, co, cs, fp, hc, ht, lf, ps, st, td` 12개 폴더의
  html을 통째로 지우는 구조였는데, `src/pub`엔 마이그레이션된 파일이
  `ae/MSAE1100P.html` 1개뿐이라 나머지 894개 레거시 페이지가 전부 삭제됨.
  → SVN에 커밋된 적 있는 파일이라면 `svn revert -R pub`로 복구 가능.
  → `gulpfile.js`의 `clean()`을 "src/pub에 실제로 존재하는 파일에 대응하는
  pub/ 결과물만" 지우도록 수정 완료 (아래 빌드 시스템 섹션 참고). 앞으로는
  마이그레이션 안 된 레거시 페이지는 build를 몇 번 돌려도 안전함.

## 개발 환경 표준화 (2026-07-03)

- **Node 버전 고정**: `project/package.json`에 `"engines": { "node": ">=18.18.0" }`
  추가. 실제 검증/권장 버전은 `project/.nvmrc`(22 — 2026-07 기준 Maintenance
  LTS. Active LTS는 24)로 고정. nvm 사용 시 `project` 폴더에서 `nvm use`.
- **`.editorconfig`** (루트에 추가): 레거시 895개 HTML/CSS/JS 컨벤션에 맞춰
  기본 EOL을 CRLF로 지정. 단 `package.json`/`gulpfile.js` 등 node 툴링
  파일은 생태계 관행대로 LF 유지.

## SVN 초기 커밋 체크리스트

지금 `project/package.json`, `gulpfile.js`, `.nvmrc`, `src/`, `.vscode/`,
루트 `.editorconfig`가 전부 SVN에 한 번도 커밋된 적 없는(unversioned) 상태다.
아래 순서로 한 번 깔끔하게 정리해서 커밋하는 걸 권장:

1. `svn status` 로 현재 unversioned(`?`)/missing(`!`) 항목 전체 확인.
2. (앞서 `npm run build` 사고로 pub/의 레거시 파일이 지워졌다면 먼저)
   `svn revert -R pub` 로 복구.
3. `node_modules` 제외 설정:
   ```
   cd project
   svn propset svn:ignore "node_modules" .
   ```
4. 다음 파일들을 새로 추가:
   ```
   svn add package.json package-lock.json gulpfile.js .nvmrc src
   svn add ../.editorconfig
   svn add ../.vscode          (아직 추가 안 됐다면)
   ```
5. 커밋 전 반드시 `svn status`/`svn diff`로 의도한 파일만 올라가는지 확인
   (특히 `node_modules`가 안 끼어 있는지).
6. `svn commit -m "gulp 빌드 툴링 도입: package.json, gulpfile.js, .editorconfig, .nvmrc, src/ 추가"`

## 신규 소스 교체 시 권장 워크플로우

1. **교체 전 백업**: 현재 2023 소스를 SVN에서 태그/브랜치로 복사하거나 zip으로
   백업 — 롤백·diff 기준점 확보.
2. **툴링 파일 보존**: 새 소스를 덮어쓸 때 `package.json`, `gulpfile.js`,
   `.nvmrc`, `.editorconfig`, `.vscode/`는 유지하고 `src/`, `pub/`, `css/`,
   `js/`, `images/` 등 콘텐츠 폴더만 교체.
3. **node_modules는 SVN에서 계속 제외**: 위 "SVN 초기 커밋 체크리스트"에서
   설정한 `svn:ignore`가 유지되는지 확인. 재현성을 위해 `package-lock.json`은
   계속 커밋 대상으로 유지.
4. **교체 후 검증**: `npm install` → `npm run build:check`(삭제 대상 미리보기)
   → 이상 없으면 `npm run build` 실행해 include 시스템이 새 레거시
   페이지에서도 정상 동작하는지 확인.
5. **점진적 마이그레이션**: 895개 레거시 페이지를 한 번에 `@@include`로
   바꾸지 말고, 메뉴 단위(예: ae 폴더)로 소수 페이지부터 전환 → 빌드 결과를
   기존 pub/ HTML과 diff해서 의도치 않은 마크업 변경 없는지 확인 후 확대.
6. **커밋 전 diff 습관화**: `pub/`가 SVN 관리 대상이므로, `gulp build` 결과와
   기존 파일을 비교해 불필요한 공백/포맷 차이로 노이즈 커밋이 생기지 않게 주의
   (EOL은 `toCRLF()`로 이미 레거시와 통일돼 있어 이 문제는 해소된 상태).

## SVN → Git 이전 (다른 PC로 이동, 2026-07-03 결정)

작업 PC가 바뀌면서 새 위치부터는 SVN 대신 **Git**을 쓰기로 함. SVN 커밋
히스토리는 가져가지 않고 **새 저장소로 시작**하기로 결정. 이를 위해 루트에
`.gitignore`, `.gitattributes`를 미리 만들어둠 (폴더와 함께 이동됨).

**이동 절차**

1. 이동 전 현재 PC에서 `svn status`로 미커밋 변경사항 없는지 확인, 가능하면
   먼저 SVN에 커밋 완료.
2. 폴더 복사 시 `project/node_modules/`와 `.svn/`은 제외하고 복사 (용량 절감 +
   새 저장소는 SVN 이력이 필요 없으므로). 압축 프로그램에서 두 폴더만
   제외하거나, 복사 후 새 PC에서 삭제해도 됨.
   **이때 폴더 이름도 `nhmyd_2023` → `nhmyd_2026`으로 함께 변경** (2023년
   소스 기반이지만 2026년부터의 고도화 작업이라 프로젝트명을 2026 기준으로
   정리하기로 함 — package.json/gulpfile.js/CLAUDE.md 등 내부 표기는 이미
   2026으로 반영해둠). Cowork에서 이 폴더를 다시 연결한다면, 이름을 바꾼
   새 경로로 재연결 필요.
   **→ 폴더명 변경 완료 (2026-07-03).** 단, 이번엔 새 PC로 복사하며 이름을
   바꾼 게 아니라 같은 위치에서 폴더명만 바꾼 것이라 `.svn/`이 아직 그대로
   남아있음 (node_modules는 별도 확인 필요) — `.gitignore`에 이미
   `project/node_modules/`, `**/.svn/`이 등록돼 있어 `git init` 시 자동
   제외되므로 무방하나, 원한다면 3번 단계 이후 수동으로 지워도 됨.
3. 새 PC 새 위치에서:
   ```
   git init
   git add .
   git commit -m "초기 커밋: 2023 소스 + gulp 빌드 툴링 베이스라인 (ex-SVN)"
   ```
   `.gitattributes`가 있으므로 이 첫 커밋에서 EOL이 의도한 대로(레거시
   CRLF 유지, 툴링 파일만 LF) 저장되는지 `git show --stat`으로 확인 권장.
4. Node 버전(`.nvmrc`) 맞추고 `npm install` → `npm run build:check` →
   `npm run build`로 정상 동작 재확인 (SVN 때와 동일한 검증 절차).
5. **Figma MCP 재인증 필요**: `.vscode/mcp.json` 설정 파일은 그대로 옮겨지지만
   OAuth 로그인 토큰은 VS Code에 저장되는 것이라, 새 PC에서 Figma 계정으로
   다시 로그인해야 함.
6. 기존 SVN 저장소는 그대로 두고 참고용 백업으로 남겨두는 것을 권장(완전
   삭제하지 말 것).
