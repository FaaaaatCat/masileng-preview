"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_ITEMS } from "../data/constants.json";
import {
  UploadIcon,
  ChevronIcon,
  ChevronRightIcon,
  PersonIcon,
  BoxPlusIcon,
  InstagramIcon,
  TagIcon,
  LogoutIcon,
  RocketIcon,
} from "./icons";
import IngredientRequestModal from "./IngredientRequestModal";
import TermsModal from "./TermsModal";
import ProfileAvatar from "./ProfileAvatar";
import LoginModal from "./LoginModal";
import TeamModal from "./TeamModal";

export default function SiteHeader({ activeNav, onNavClick }) {
  const [authUser, setAuthUser] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
  const [ingRequestOpen, setIngRequestOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const dropRef = useRef(null);
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem("masileng_user");
    setAuthUser(null);
    setDropOpen(false);
    window.dispatchEvent(new Event("masileng_auth"));
  };

  const logo = <img src="/logo.svg" alt="마실랭" style={{ height: 26 }} />;

  return (
    <>
      <header className="site-header">
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

            <div style={{ flex: 1 }} />

            <div className="flex items-center gap-3">
              {/* 인풋 */}
              <div className="search-bar">
                <input
                  type="text"
                  className="search-input"
                  placeholder="만들고 싶은 칵테일, 또는 재료를 검색하세요"
                />
                <button className="btn btn-filled btn-brand btn-md">
                  검색
                </button>
              </div>
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
                className="btn btn-filled btn-gradient-1 btn-md"
              >
                <UploadIcon />
                레시피 업로드
              </Link>
            </div>
          </nav>
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
