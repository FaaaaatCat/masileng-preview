"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_ITEMS } from "../data/constants.json";
import { UploadIcon } from "./icons";

export default function SiteHeader({ activeNav, onNavClick }) {
  const [authUser, setAuthUser] = useState(null);
  const [dropOpen, setDropOpen] = useState(false);
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
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
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

  const logo = (
    <img src="/logo.svg" alt="마실랭" style={{ height: 26 }} />
  );

  return (
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
                <Link key={item} href="/" className="nav-link">
                  {item}
                </Link>
              ),
            )}
            <span className="nav-divider" />
            {onNavClick ? (
              <a
                href="#"
                className="nav-link"
                onClick={(e) => e.preventDefault()}
              >
                추천
              </a>
            ) : (
              <Link href="/" className="nav-link">
                추천
              </Link>
            )}
            <div className="nav-download-wrap">
              <a
                href="#"
                className="nav-link nav-link-download"
                onClick={(e) => e.preventDefault()}
              >
                앱 다운로드
                <div className="nav-download-flyout">
                  <span className="nav-download-option">안드로이드</span>
                  <span className="nav-download-option">애플</span>
                </div>
              </a>
            </div>
          </div>

          <div className="nav-spacer" />

          <div className="nav-actions">
            {authUser ? (
              <div className="nav-user-wrap" ref={dropRef}>
                <button
                  className="btn-user-name btn-sm"
                  onClick={() => setDropOpen((v) => !v)}
                >
                  {authUser.name} 님
                  <svg
                    viewBox="0 0 10 6"
                    width="10"
                    height="6"
                    fill="currentColor"
                    style={{ marginLeft: 5 }}
                  >
                    <path d="M0 0l5 6 5-6z" />
                  </svg>
                </button>
                {dropOpen && (
                  <div className="nav-user-dropdown">
                    <a
                      href="#"
                      className="nav-user-item"
                      onClick={(e) => e.preventDefault()}
                    >
                      내 페이지
                    </a>
                    <a
                      href="#"
                      className="nav-user-item"
                      onClick={(e) => e.preventDefault()}
                    >
                      재료 요청하기
                    </a>
                    <a
                      href="#"
                      className="nav-user-item"
                      onClick={(e) => e.preventDefault()}
                    >
                      이용약관
                    </a>
                    <div className="nav-user-divider" />
                    <button
                      className="nav-user-item nav-user-logout"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-lined btn-gray-light">
                로그인
              </Link>
            )}
            <Link
              href="/upload"
              className="btn btn-filled btn-gradient-1"
            >
              <UploadIcon />
              레시피 업로드
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
