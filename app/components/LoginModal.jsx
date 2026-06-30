"use client";

import { useEffect } from "react";
import { XIcon } from "./icons";
import "../css/login.css";
import "../css/common.scss";

function KakaoIcon() {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M12 3C6.925 3 2.857 6.262 2.857 10.286c0 2.568 1.614 4.826 4.074 6.153l-1.04 3.856a.214.214 0 0 0 .32.234l4.497-2.966A11.45 11.45 0 0 0 12 17.57c5.075 0 9.143-3.262 9.143-7.286C21.143 6.262 17.075 3 12 3Z"
        fill="rgba(0,0,0,.85)"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleMockLogin = () => {
    const user = { name: "테스트계정", profileBg: "#FFB3C6", profileImg: "profile_img" };
    localStorage.setItem("masileng_user", JSON.stringify(user));
    window.dispatchEvent(new Event("masileng_auth"));
    onClose();
  };

  return (
    <div
      className="common-popup-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="common-popup-modal popup-xs login-modal">
        <div className="common-popup-header">
          <div />
          <button
            className="common-popup-close"
            type="button"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="common-popup-body">
          <img
            src="/logo.svg"
            alt="마실랭"
            style={{ height: 36, alignSelf: "center" }}
          />
          <p
            className="common-body-lg-light"
            style={{ textAlign: "center", color: "var(--font-sub2)" }}
          >
            칵테일 라이프의 새로운 기준
          </p>
          <div className="flex flex-col">
            <img
              src="/character_illust/cheers_1.png"
              alt=""
              className="login-cheers-img"
            />
            <button
              className="btn-kakao"
              style={{marginBottom:16}}
              type="button"
              onClick={() => alert("카카오 로그인은 준비 중입니다.")}
            >
              <KakaoIcon />
              카카오로 로그인
            </button>
            <button
              className="btn-google"
              type="button"
              onClick={() => alert("Google 로그인은 준비 중입니다.")}
            >
              <GoogleIcon />
              Google로 로그인
            </button>
          </div>

          <button
            type="button"
            onClick={handleMockLogin}
            style={{
              fontSize: 13,
              color: "var(--font-placeholder)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              alignSelf: "center",
            }}
          >
            테스트 계정으로 로그인
          </button>
          <p
            className="common-body-sm-light text-center"
            style={{ color: "var(--font-sub2)" }}
          >
            © 마실랭 2026
          </p>
        </div>
      </div>
    </div>
  );
}
