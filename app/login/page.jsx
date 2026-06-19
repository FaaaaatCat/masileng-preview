"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../css/login.css";

/* ── 카카오 아이콘 */
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

/* ── 구글 아이콘 */
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

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!id.trim()) { setError("아이디를 입력해주세요."); return; }
    if (!pw.trim()) { setError("비밀번호를 입력해주세요."); return; }
    const user = { name: id.trim() };
    localStorage.setItem("masileng_user", JSON.stringify(user));
    window.dispatchEvent(new Event("masileng_auth"));
    router.push("/");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="login-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          홈으로
        </Link>

        <div className="login-logo">
          <img src="/logo.svg" alt="마실랭" />
        </div>

        <h1 className="login-title">마실랭 로그인</h1>
        <p className="login-sub">칵테일 라이프의 새로운 기준</p>

        {/* 소셜 로그인 */}
        <button className="btn-kakao" type="button" onClick={() => alert("카카오 로그인은 준비 중입니다.")}>
          <KakaoIcon />
          카카오로 로그인
        </button>
        <button className="btn-google btn btn-lined btn-gray-light" type="button" onClick={() => alert("Google 로그인은 준비 중입니다.")}>
          <GoogleIcon />
          Google로 로그인
        </button>

        {/* 구분선 */}
        <div className="login-divider"><span>또는 이메일로 로그인</span></div>

        {/* 폼 */}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => { setId(e.target.value); setError(""); }}
            className="login-input"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            className="login-input"
            autoComplete="current-password"
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn-login-submit btn btn-filled btn-brand">로그인</button>
        </form>

        <p className="login-register">
          아직 회원이 아닌가요?&nbsp;
          <a href="#" onClick={(e) => { e.preventDefault(); alert("회원가입은 준비 중입니다."); }}>가입하기</a>
        </p>
      </div>
    </div>
  );
}
