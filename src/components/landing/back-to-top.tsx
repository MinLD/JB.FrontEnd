"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BackToTopPhase = "idle" | "visible" | "retracting";

export function BackToTop() {
  const [phase, setPhase] = useState<BackToTopPhase>("idle");

  useEffect(() => {
    function updateVisibility() {
      const atTop = window.scrollY <= 4;
      const pastRevealPoint = window.scrollY >= window.innerHeight * 2;

      setPhase(current => {
        if (pastRevealPoint) return "visible";
        if (atTop && current === "visible") return "retracting";
        return current;
      });
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <div className="back-to-top" data-phase={phase} inert={phase !== "visible"}>
      <div className="back-to-top-scene" aria-hidden="true">
        <div className="back-to-top-student">
          <Image src="/jobbod/footer/rope-student.webp" width={300} height={523} sizes="(max-width: 650px) 52px, 70px" alt="" />
        </div>
      </div>
      <div className="back-to-top-bubble">
        <p>Bạn muốn lên trên chứ?</p>
        <a className="back-to-top-link" href="#gioi-thieu">
          Lên đầu trang <span aria-hidden="true">↑</span>
        </a>
      </div>
    </div>
  );
}
