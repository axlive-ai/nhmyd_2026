'use strict';

/**
 * NH마이데이터 2026 고도화 UI 퍼블리싱 Gulp 빌드 (2023년 소스 기반)
 * ─────────────────────────────────────────────────────
 *  $ npm install        최초 1회 패키지 설치
 *  $ gulp               개발 서버 시작 (HTML 빌드 + 라이브리로드)
 *  $ gulp build         HTML 빌드만 실행 (배포용)
 *  $ gulp html          HTML 빌드만 (단일 실행)
 * ─────────────────────────────────────────────────────
 *  소스 구조
 *    src/_include/      @@include 공통 파셜 (head, footer, header …)
 *    src/pub/[메뉴]/    원본 HTML (@@include 태그 사용)
 *
 *  빌드 결과
 *    pub/[메뉴]/        완성된 HTML (현재와 동일한 경로, SVN 관리 대상)
 */

const fs          = require('fs');
const path        = require('path');
const { Transform } = require('stream');
const gulp        = require('gulp');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const del         = require('del');

/* ── 경로 ── */
const paths = {
  src: {
    html    : 'src/pub/**/*.html',
    include : 'src/_include/**/*.html',
  },
  dist  : 'pub',           // 빌드 출력 (project/pub/)
  watch : {
    css : 'css/**/*.css',
    js  : 'js/**/*.js',
  },
};

/**
 * src/pub 아래의 .html 파일 상대경로를 재귀적으로 수집.
 * (예: 'ae/MSAE1100P.html')
 */
function collectSrcHtmlFiles(dir, base, results) {
  base = base || dir;
  results = results || [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSrcHtmlFiles(full, base, results);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(path.relative(base, full));
    }
  }
  return results;
}

/**
 * clean()이 실제로 지울 pub/ 대상 목록을 계산.
 * clean()과 clean:dry() 양쪽에서 공유해서 "미리보기 = 실제 동작"을 보장한다.
 */
function computeCleanTargets() {
  const srcDir   = path.join(__dirname, 'src/pub');
  const relFiles = collectSrcHtmlFiles(srcDir);
  return relFiles.map(function (rel) {
    return path.posix.join(paths.dist, rel.split(path.sep).join('/'));
  });
}

/**
 * 빌드된 HTML 삭제.
 *
 * 메뉴 폴더 전체(pub/ae/**, pub/ar/** ...)를 지우지 않고, 현재 src/pub에
 * 실제로 존재하는 파일에 "대응하는 pub/ 결과물만" 정확히 지운다.
 *
 * 895개 레거시 페이지 중 극히 일부만 @@include 방식(src/pub)으로 마이그레이션된
 * 상태이므로, 메뉴 폴더 전체를 지우면 아직 옮기지 않은 레거시 페이지까지
 * 함께 삭제되는 사고가 발생한다 (실제로 발생했던 문제). 마이그레이션이 끝난
 * 파일만 정확히 지우고 다시 생성하도록 범위를 좁힌다.
 *
 * 안전장치: 삭제 전에 항상 대상 목록/개수를 콘솔에 출력한다. `npm run build`
 * 실행 시 이 로그를 보고 개수가 예상과 다르면 바로 Ctrl+C로 중단할 수 있다.
 * 실행 전 미리 확인하고 싶으면 `npm run build:check`(clean:dry)로 삭제 없이
 * 목록만 먼저 볼 수 있다.
 */
function clean() {
  const targets = computeCleanTargets();
  console.log('[clean] ' + targets.length + '개 파일을 삭제 후 재생성합니다:');
  targets.forEach(function (t) { console.log('  - ' + t); });

  if (targets.length === 0) {
    return Promise.resolve([]);
  }
  return del(targets, { force: true });
}

/**
 * clean 미리보기 (실제 삭제 없음).
 * 사용법: `npx gulp clean:dry` 또는 `npm run build:check`
 */
function cleanDry(done) {
  const targets = computeCleanTargets();
  console.log('[clean:dry] 실제로 삭제하지 않고 미리보기만 합니다. 대상 ' + targets.length + '개:');
  targets.forEach(function (t) { console.log('  - ' + t); });
  done();
}

/**
 * LF → CRLF 통일.
 *
 * gulp-file-include(및 대부분의 node 빌드 도구)는 기본적으로 LF로 결과물을
 * 낸다. 하지만 레거시 895개 페이지는 전부 CRLF(Windows)로 작성돼 있어서,
 * 이 변환 없이 그대로 두면 마이그레이션한 페이지마다 실제 내용 변경 여부와
 * 무관하게 SVN diff가 파일 전체 줄 단위로 깨져서 나온다. 레거시 컨벤션에
 * 맞춰 항상 CRLF로 출력해서 diff를 실제 콘텐츠 변경만 보이게 유지한다.
 */
function toCRLF() {
  return new Transform({
    objectMode: true,
    transform(file, _enc, cb) {
      if (file.isBuffer()) {
        const normalized = file.contents
          .toString('utf8')
          .replace(/\r\n/g, '\n')   // 우선 LF로 통일한 뒤
          .replace(/\n/g, '\r\n');  // CRLF로 변환
        file.contents = Buffer.from(normalized, 'utf8');
      }
      cb(null, file);
    },
  });
}

/* ── HTML 빌드 : @@include 처리 ── */
function html() {
  return gulp.src(paths.src.html, { base: 'src/pub' })
    .pipe(fileinclude({
      prefix   : '@@',
      basepath : 'src/_include',   // @@include 기준 경로
      indent   : true,
      context  : {
        // 전역 변수 (@@VAR_NAME 으로 사용)
        BUILD_ENV : 'pub',
      },
    }))
    .pipe(toCRLF())               // 레거시(CRLF)와 동일한 줄바꿈으로 통일
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
}

/* ── 개발 서버 ── */
function serve(done) {
  browserSync.init({
    server: {
      baseDir   : './',            // project/ 폴더 루트
    },
    startPath : '/pub/pubList.html',
    port      : 3000,
    notify    : false,
    open      : true,
  });
  done();
}

/* ── 감시 ── */
function watch() {
  // HTML 소스 / include 변경 → 재빌드
  gulp.watch([paths.src.html, paths.src.include], html);

  // CSS / JS 변경 → 리로드
  gulp.watch(paths.watch.css).on('change', browserSync.reload);
  gulp.watch(paths.watch.js).on('change', browserSync.reload);
}

/* ── 태스크 등록 ── */
exports.clean        = clean;
exports['clean:dry'] = cleanDry;
exports.html         = html;
exports.serve        = serve;
exports.watch        = watch;
exports.build        = gulp.series(clean, html);
exports.default      = gulp.series(html, serve, watch);
