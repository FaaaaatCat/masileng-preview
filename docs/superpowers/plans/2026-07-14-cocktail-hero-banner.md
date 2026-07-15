# 칵테일 홈 배너 리뉴얼 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 칵테일 홈 히어로 배너를 코랄 배경 + 실제 앱 스크린샷(`main_phone.png`) + 실제 QR(`download_qr.png`) 구성으로 교체하고 모바일 반응형을 지원한다.

**Architecture:** `app/page/MasilengHome.jsx`의 `AppHero` 함수 컴포넌트를 재작성하고(하드코딩 SVG QR·폰 목업 DOM 삭제), `app/css/banner.scss`의 `.cocktail-main-banner` 섹션을 새 레이아웃으로 재작성한다. 클래스 네이밍 체계(`.cocktail-main-banner-*`)는 유지한다.

**Tech Stack:** Next.js (App Router), SCSS, 기존 CSS 변수(`--coral`, `--r-md` 등)

## Global Constraints

- 스타일 우선순위: 공통 변수 → Tailwind → 인라인(단일 속성) → 커스텀 클래스 순으로 우선 적용
- 데스크탑 콘텐츠는 가로 1200px(`max-width: 1200px`) 안에 들어와야 함
- 모바일(≤768px)에서 배너가 보여야 하며, 로고 행이 콘텐츠 바로 위에 붙어야 함 (기존 `display: none` 제거 — 단, `.sliding-banner-wrap`, `.challenge-main-banner`의 모바일 숨김은 유지)
- 흰색 로고는 별도 파일 생성 없이 `/logo.svg`에 `filter: brightness(0) invert(1)` 적용
- 검증은 3000 포트에 이미 떠 있는 개발 서버를 재사용 (새 서버 띄우지 말 것 — Next 폴더 락)

---

### Task 1: AppHero 컴포넌트 + 배너 스타일 재작성

**Files:**
- Modify: `app/page/MasilengHome.jsx:16-227` (`PHONE_ITEMS` 상수와 `AppHero` 함수 전체 교체)
- Modify: `app/css/banner.scss:131-300` (`.cocktail-main-banner` 섹션 전체 교체)
- Modify: `app/css/banner.scss:361-371` (모바일 숨김 목록에서 `.cocktail-main-banner` 제거)

**Interfaces:**
- Consumes: `public/main_phone.png` (984×984 RGBA, 투명 배경), `public/download_qr.png` (126×143, 흰 배경 + "앱 다운로드 QR" 라벨 포함), `public/logo.svg`
- Produces: `AppHero()` — props 없는 함수 컴포넌트, `MasilengHome`에서 기존과 동일하게 `<AppHero />`로 호출됨 (호출부 변경 없음)

- [ ] **Step 1: `MasilengHome.jsx`의 `PHONE_ITEMS` 상수(16-17행)와 `AppHero` 함수(19-227행)를 아래 코드로 교체**

`PHONE_ITEMS` 주석·상수를 삭제하고 `AppHero`를 다음으로 교체:

```jsx
// ─────────────────────────────────────────────
// 앱 배너 히어로
// ─────────────────────────────────────────────
function AppHero() {
  return (
    <div className="cocktail-main-banner">
      <div className="cocktail-main-banner-inner">
        {/* 상단: 로고 + 다운로드 링크 */}
        <div className="cocktail-main-banner-top">
          <img
            src="/logo.svg"
            alt="마실랭"
            className="cocktail-main-banner-logo"
          />
          <span className="cocktail-main-banner-download">앱 다운로드 하기</span>
        </div>

        {/* 본문: 폰 스크린샷 + 텍스트/QR */}
        <div className="cocktail-main-banner-body">
          <div className="cocktail-main-banner-phone-wrap">
            <img
              src="/main_phone.png"
              alt="마실랭 앱 화면"
              className="cocktail-main-banner-phone"
            />
          </div>
          <div className="cocktail-main-banner-right">
            <h1 className="cocktail-main-banner-title">
              내 손안의 레시피
              <br />
              마실랭
            </h1>
            <p className="cocktail-main-banner-desc">지금 시작하세요</p>
            <img
              src="/download_qr.png"
              alt="앱 다운로드 QR"
              className="cocktail-main-banner-qr"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

`CARDS`·`COCKTAILS` import는 `CocktailPage`에서 계속 사용하므로 유지한다.

- [ ] **Step 2: `banner.scss`의 `.cocktail-main-banner` 섹션(131-300행)을 아래로 교체**

```scss
/* ─────────────────────────────────────────────
   Cocktail Main Banner (칵테일 홈)
───────────────────────────────────────────── */
.cocktail-main-banner {
  position: relative;
  overflow: hidden;
  background: var(--coral);

  &-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 28px 40px 0;
  }

  &-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-logo {
    height: 28px;
    filter: brightness(0) invert(1);
  }

  &-download {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
  }

  &-body {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 90px;
  }

  &-phone-wrap {
    flex: 0 0 auto;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  &-phone {
    display: block;
    width: 480px;
    margin-bottom: -110px;
  }

  &-right {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 0 70px;
  }

  &-title {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.25;
    letter-spacing: -0.03em;
    color: #fff;
  }

  &-desc {
    margin-top: 14px;
    font-size: 18px;
    font-weight: 500;
    color: #fff;
  }

  &-qr {
    margin-top: 28px;
    width: 126px;
    border-radius: var(--r-md);
    display: block;
  }

  @media (max-width: 768px) {
    &-inner {
      padding: 14px 20px 0;
    }

    &-logo { height: 20px; }

    &-download { font-size: 12px; }

    &-body { gap: 28px; }

    &-phone {
      width: 200px;
      margin-bottom: -50px;
    }

    &-right { padding: 16px 0 24px; }

    &-title { font-size: 22px; }

    &-desc {
      margin-top: 6px;
      font-size: 12px;
    }

    &-qr {
      margin-top: 12px;
      width: 78px;
      border-radius: var(--r-sm);
    }
  }
}
```

- [ ] **Step 3: `banner.scss` 최하단 모바일 숨김 블록에서 `.cocktail-main-banner` 제거**

기존:

```scss
@media (max-width: 768px) {
  .cocktail-main-banner,
  .sliding-banner-wrap,
  .challenge-main-banner {
    display: none;
  }
}
```

변경 후:

```scss
@media (max-width: 768px) {
  .sliding-banner-wrap,
  .challenge-main-banner {
    display: none;
  }
}
```

주석 `모바일: 메인 배너 3종 숨김 (칵테일 홈 · 슬라이딩 · 도전!마실랭)`도 `모바일: 메인 배너 2종 숨김 (슬라이딩 · 도전!마실랭)`으로 갱신.

- [ ] **Step 4: 브라우저 검증 (데스크탑)**

3000 포트의 기존 개발 서버 재사용. `http://localhost:3000` 접속 → 새로고침.

확인 항목:
- 코랄 배경 풀와이드 배너, 내부 콘텐츠 1200px 중앙 정렬
- 좌상단 흰색 로고(색상 반전 적용), 우상단 흰색 "앱 다운로드 하기"
- 좌측 폰 스크린샷(하단 잘림), 우측 "내 손안의 레시피 / 마실랭" + "지금 시작하세요" + QR
- 콘솔 에러 없음

시안 대비 폰 크기/여백이 어긋나면 `-phone` `width`·`margin-bottom`, `-body` `gap` 값을 조정.

- [ ] **Step 5: 브라우저 검증 (모바일 375px)**

뷰포트 375px로 리사이즈 후 확인:
- 배너가 표시됨 (기존엔 숨김이었음)
- 로고 행이 콘텐츠 바로 위에 붙음 (여백 최소)
- 폰·타이틀·QR 축소판이 가로 배치 유지
- 슬라이딩 배너·도전 배너는 여전히 모바일에서 숨김

- [ ] **Step 6: Commit**

```bash
git add app/page/MasilengHome.jsx app/css/banner.scss
git commit -m "칵테일 홈 배너 리뉴얼 (앱 스크린샷 + QR 이미지, 모바일 반응형)"
```
