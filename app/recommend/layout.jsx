"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RecommendLayout({ children }) {
  const pathname = usePathname();
  const isIntro = pathname === "/recommend";

  return (
    <div className={`recommend-page-root${isIntro ? " intro-start" : ""}`}>
      <div className="recommend-page-wrap">
        {children}
      </div>
    </div>
  );
}
