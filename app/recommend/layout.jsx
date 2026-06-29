"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RecommendLayout({ children }) {
  const pathname = usePathname();
  const isIntro = pathname === "/recommend";

  return (
    <div className={`recommend-page-root${isIntro ? " intro-start" : ""}`}>
      <div className="recommend-page-wrap">
        <Link href="/" className="recommend-intro-close" aria-label="홈으로">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>
        {children}
      </div>
    </div>
  );
}
