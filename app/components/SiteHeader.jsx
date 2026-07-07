"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_ITEMS } from "../data/constants.json";
import {
  UploadIcon,
  SearchIcon,
  ChevronIcon,
  ChevronRightIcon,
  PersonIcon,
  BoxPlusIcon,
  InstagramIcon,
  TagIcon,
  LogoutIcon,
  RocketIcon,
  MenuIcon,
  XIcon,
  GooglePlayIcon,
  AppleIcon,
} from "./icons";
import IngredientRequestModal from "./IngredientRequestModal";
import TermsModal from "./TermsModal";
import ProfileAvatar from "./ProfileAvatar";
import LoginModal from "./LoginModal";
import TeamModal from "./TeamModal";

// 모바일 메뉴 패널 "메뉴" 목록 아이콘 (검색결과 페이지 카테고리 아이콘과 동일한 자산 재사용)
const MOBILE_NAV_ICONS = {
  "칵테일": "https://www.masileng.com/test/ic_cocktail.svg",
  "재료": "https://www.masileng.com/test/ic_ingredient.svg",
  "도전!마실랭": "https://www.masileng.com/test/ic_challenge.svg",
};

export default function SiteHeader({ activeNav, onNavClick, initialSearch = "" }) {
  const [authUser, setAuthUser] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [ingRequestOpen, setIngRequestOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropRef = useRef(null);
  const mobileHeaderRef = useRef(null);
  const sentinelRef = useRef(null);
  const scrollTimer = useRef();
  const router = useRouter();

  const submitSearch = () => {
    const q = searchTerm.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const openMobileSearch = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(true);
  };

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    setSearchTerm("");
  };

  const openMobileMenu = () => {
    setMobileSearchOpen(false);
    setMobileMenuOpen(true);
  };

  // 헤더 위 1px 센티널을 IntersectionObserver로 감시 (masileng.com 방식)
  // scroll 이벤트 대신 센티널의 화면 이탈 여부로 판정 + 60ms 디바운스로 경계 진동 방지
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]; // 여러 건 배달 시 최신 상태 기준
        clearTimeout(scrollTimer.current);
        scrollTimer.current = window.setTimeout(() => {
          setScrolled(!entry.isIntersecting);
        }, 60);
      },
      { rootMargin: "5px 0px" },
    );
    observer.observe(el);
    return () => {
      clearTimeout(scrollTimer.current);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const load = () => {
      const s = localStorage.getItem("masileng_user");
      setAuthUser(s ? JSON.parse(s) : null);
    };
    load();
    window.addEventListener("masileng_auth", load);
    return () => window.removeEventListener("masileng_auth", load);
  }, []);

  useEffect(() => {
    if (!dropOpen) return;
    const h = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [dropOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const h = (e) => {
      if (mobileHeaderRef.current && !mobileHeaderRef.current.contains(e.target))
        setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", h);
    // 패널이 화면 전체를 덮는 동안 뒤 페이지 스크롤 잠금 (모달과 동일 패턴)
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", h);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("masileng_user");
    setAuthUser(null);
    setDropOpen(false);
    window.dispatchEvent(new Event("masileng_auth"));
  };

  const logo = <img src="/logo.svg" alt="마실랭" style={{ height: 26 }} />;

  return (
    <>
      <div className="site-header-sentinel" ref={sentinelRef} aria-hidden="true" />
      <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
        <div className="site-header-inner">
          <nav className="site-nav">
              {onNavClick ? (
                <a
                  href="#"
                  className="site-brand"
                  onClick={(e) => e.preventDefault()}
                >
                  {logo}
                </a>
              ) : (
                <Link href="/" className="site-brand">
                  {logo}
                </Link>
              )}

              <div className="nav-menu">
                {NAV_ITEMS.map((item) =>
                  onNavClick ? (
                    <a
                      key={item}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavClick(item);
                      }}
                      className={`nav-link${activeNav === item ? " active" : ""}`}
                    >
                      {item}
                      {activeNav === item && (
                        <span className="nav-link-underline" />
                      )}
                    </a>
                  ) : (
                    <Link
                      key={item}
                      href={`/?tab=${encodeURIComponent(item)}`}
                      className="nav-link"
                    >
                      {item}
                    </Link>
                  ),
                )}
                <span className="nav-divider" />
                <Link href="/recommend" className="nav-link">
                  추천
                </Link>
                <div className="nav-download-wrap">
                  <div className="nav-link nav-link-download">
                    앱 다운로드
                    <div className="nav-download-flyout">
                      <a
                        className="nav-download-option"
                        href="https://play.google.com/store/apps/details?id=com.padro.my_cocktail_app"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        안드로이드
                      </a>
                      <a
                        className="nav-download-option"
                        href="https://apps.apple.com/us/app/%EB%A7%88%EC%8B%A4%EB%9E%AD-%ED%95%A8%EA%BB%98-%EB%A7%8C%EB%93%A4%EC%96%B4%EA%B0%80%EB%8A%94-%EC%B9%B5%ED%85%8C%EC%9D%BC-%EA%B0%80%EC%9D%B4%EB%93%9C/id1623101096"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        애플
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`search-input${scrolled ? " search-mini" : ""}`}>
                <button
                  className="btn btn-filled btn-brand btn-md"
                  onClick={submitSearch}
                  aria-label="검색"
                >
                  <SearchIcon />
                </button>

                <input
                  type="text"
                  placeholder="만들고 싶은 칵테일, 또는 재료를 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch();
                  }}
                />
              </div>

              <div style={{ flex: 1 }} />

              <div className="flex items-center gap-3">
                {authUser ? (
                  <div className="nav-user-wrap" ref={dropRef}>
                    <button
                      className="btn btn-lined btn-gray-light btn-sm"
                      onClick={() => setDropOpen((v) => !v)}
                    >
                      <ProfileAvatar user={authUser} size={22} />
                      {authUser.name}
                      <ChevronIcon />
                    </button>
                    {dropOpen && (
                      <div className="nav-user-dropdown">
                        <a
                          href="/mypage"
                          className="nav-user-item nav-user-item--mypage"
                          onClick={() => setDropOpen(false)}
                        >
                          <span
                            className="nav-user-item-icon-bg"
                            style={{ color: "#fff" }}
                          >
                            <PersonIcon />
                          </span>
                          내 페이지
                          <ChevronRightIcon />
                        </a>
                        <div className="nav-user-divider" />
                        <a
                          href="#"
                          className="nav-user-item"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropOpen(false);
                            setIngRequestOpen(true);
                          }}
                        >
                          <BoxPlusIcon />
                          재료 요청하기
                        </a>

                        <a
                          href="https://www.instagram.com/masileng/"
                          className="nav-user-item"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setDropOpen(false)}
                        >
                          <InstagramIcon />
                          공식 인스타그램
                        </a>
                        <a
                          href="#"
                          className="nav-user-item"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropOpen(false);
                            setTeamOpen(true);
                          }}
                        >
                          <RocketIcon />
                          마실랭 팀 소개
                        </a>
                        <a
                          href="#"
                          className="nav-user-item"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropOpen(false);
                            setTermsOpen(true);
                          }}
                        >
                          <TagIcon />
                          이용약관
                        </a>
                        <div className="nav-user-divider" />
                        <button
                          className="nav-user-item nav-user-logout"
                          onClick={handleLogout}
                        >
                          <LogoutIcon />
                          로그아웃
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn-lined btn-gray-light btn-md"
                    onClick={() => setLoginOpen(true)}
                  >
                    로그인
                  </button>
                )}
                <Link
                  href="/upload"
                  className="btn btn-filled btn-gradient-1 btn-md nav-upload-btn"
                >
                  <UploadIcon />
                  레시피 업로드
                </Link>
              </div>
          </nav>

          {/* ── 모바일 전용 헤더 (≤768px) ── */}
          <div className="mobile-header" ref={mobileHeaderRef}>
            <div className="mobile-header-bar">
              {mobileSearchOpen ? (
                <div className="mobile-search-row">
                  <SearchIcon />
                  <input
                    type="text"
                    autoFocus
                    placeholder="칵테일 이름 또는 재료를 검색해주세요."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitSearch();
                    }}
                  />
                  <button
                    type="button"
                    className="mobile-header-icon-btn"
                    onClick={closeMobileSearch}
                    aria-label="검색 닫기"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                <>
                  {onNavClick ? (
                    <a
                      href="#"
                      className="site-brand"
                      onClick={(e) => e.preventDefault()}
                    >
                      {logo}
                    </a>
                  ) : (
                    <Link href="/" className="site-brand">
                      {logo}
                    </Link>
                  )}

                  {mobileMenuOpen ? (
                    <button
                      type="button"
                      className="mobile-header-icon-btn mobile-header-close"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="메뉴 닫기"
                    >
                      <XIcon />
                    </button>
                  ) : (
                    <div className="mobile-header-actions">
                      <button
                        type="button"
                        className="mobile-header-icon-btn"
                        onClick={openMobileSearch}
                        aria-label="검색"
                      >
                        <SearchIcon />
                      </button>
                      <button
                        type="button"
                        className="mobile-header-icon-btn"
                        onClick={openMobileMenu}
                        aria-label="메뉴"
                      >
                        <MenuIcon />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {mobileMenuOpen && (
              <div className="mobile-menu-panel">
                {authUser ? (
                  <Link
                    href="/mypage"
                    className="mobile-menu-user-row"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ProfileAvatar user={authUser} size={36} />
                    <span className="mobile-menu-user-name">{authUser.name} 님</span>
                    <ChevronRightIcon />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="mobile-menu-login-row"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginOpen(true);
                    }}
                  >
                    로그인 후 이용 가능합니다
                    <ChevronRightIcon />
                  </button>
                )}

                <div className="mobile-menu-section">
                  <p className="mobile-menu-section-label">메뉴</p>
                  <div className="mobile-menu-list">
                    {NAV_ITEMS.map((item) =>
                      onNavClick ? (
                        <a
                          key={item}
                          href="#"
                          className="mobile-menu-item"
                          onClick={(e) => {
                            e.preventDefault();
                            onNavClick(item);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <img src={MOBILE_NAV_ICONS[item]} alt="" className="mobile-menu-item-icon" />
                          {item}
                        </a>
                      ) : (
                        <Link
                          key={item}
                          href={`/?tab=${encodeURIComponent(item)}`}
                          className="mobile-menu-item"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <img src={MOBILE_NAV_ICONS[item]} alt="" className="mobile-menu-item-icon" />
                          {item}
                        </Link>
                      ),
                    )}
                    <Link
                      href="/recommend"
                      className="mobile-menu-item"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <img src="/recommend.svg" alt="" className="mobile-menu-item-icon" />
                      추천
                    </Link>
                  </div>
                </div>

                {authUser && (
                  <>
                    <div className="mobile-menu-section">
                      <p className="mobile-menu-section-label">추가 기능</p>
                      <div className="mobile-menu-list">
                        <button
                          type="button"
                          className="mobile-menu-item"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setIngRequestOpen(true);
                          }}
                        >
                          <BoxPlusIcon />
                          재료 요청하기
                        </button>
                        <a
                          href="https://www.instagram.com/masileng/"
                          className="mobile-menu-item"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <InstagramIcon />
                          공식 인스타그램
                        </a>
                        <button
                          type="button"
                          className="mobile-menu-item"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setTeamOpen(true);
                          }}
                        >
                          <RocketIcon />
                          마실랭 팀 소개
                        </button>
                        <button
                          type="button"
                          className="mobile-menu-item"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setTermsOpen(true);
                          }}
                        >
                          <TagIcon />
                          이용약관
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mobile-menu-item mobile-menu-logout"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogoutIcon />
                      로그아웃
                    </button>
                  </>
                )}

                <div className="mobile-menu-download-grid">
                  <a
                    className="mobile-menu-download-btn"
                    href="https://play.google.com/store/apps/details?id=com.padro.my_cocktail_app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GooglePlayIcon />
                    구글 플레이 스토어
                  </a>
                  <a
                    className="mobile-menu-download-btn"
                    href="https://apps.apple.com/us/app/%EB%A7%88%EC%8B%A4%EB%9E%AD-%ED%95%A8%EA%BB%98-%EB%A7%8C%EB%93%A4%EC%96%B4%EA%B0%80%EB%8A%94-%EC%B9%B5%ED%85%8C%EC%9D%BC-%EA%B0%80%EC%9D%B4%EB%93%9C/id1623101096"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AppleIcon />
                    애플 스토어
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {ingRequestOpen && (
        <IngredientRequestModal onClose={() => setIngRequestOpen(false)} />
      )}
      {termsOpen && <TermsModal onClose={() => setTermsOpen(false)} />}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {teamOpen && <TeamModal onClose={() => setTeamOpen(false)} />}
    </>
  );
}
