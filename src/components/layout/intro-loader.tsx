"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/providers/i18n-provider";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

const LETTERS = [
  {
    id: "J",
    d: "M1.86726 0.584565C4.48127 0.957996 8.02887 1.14471 12.1366 0.584565C13.817 0.397849 15.1241 0.77128 15.3108 1.89157C15.4975 3.01187 14.5639 3.75873 12.8835 3.94544L12.6968 11.6008C12.6968 15.5218 10.2695 18.696 5.78828 18.696C1.86726 18.696 0.000103326 17.2022 0.000103326 14.5882C0.000103326 12.7211 1.30711 11.6008 2.80084 11.9742C4.48127 12.1609 4.85471 13.4679 4.29456 14.9617C3.92113 16.082 4.48127 16.8288 5.60157 16.8288C7.46872 16.8288 7.65544 15.1484 7.65544 12.7211L7.84215 4.13216C6.53515 4.13216 4.66799 4.13216 3.17427 4.13216C1.49383 4.31888 0.373534 3.57201 0.56025 2.265C0.56025 1.14471 1.1204 0.584565 1.86726 0.584565Z"
  },
  {
    id: "o1",
    d: "M20.5388 4.87902C16.6178 4.87902 14.0038 7.49304 14.0038 11.7875C14.0038 16.0819 16.4311 18.696 20.5388 18.696C24.4598 18.696 27.2606 16.0819 27.2606 11.7875C27.2606 7.67975 24.6465 4.87902 20.5388 4.87902ZM20.5388 7.30632C19.2318 7.11961 18.4849 8.2399 18.4849 11.2273C18.4849 14.5882 19.6052 16.4554 20.9122 16.4554C22.2192 16.4554 22.9661 15.1484 22.7794 12.1609C22.5927 8.80004 21.6591 7.49304 20.5388 7.30632Z"
  },
  {
    id: "b1",
    d: "M27.4473 1.14471C29.1277 0.771279 31.7417 -0.162299 32.6753 0.0244169C33.6089 0.0244169 33.7956 0.957994 33.6089 2.45172L33.4222 7.11961C34.7292 5.62588 36.2229 5.06573 37.9034 5.43917C41.0775 5.99931 42.5712 8.42661 42.1978 11.9742C41.8244 16.0819 39.5838 18.696 35.6628 18.696C33.9823 18.696 32.6753 18.1358 31.7417 17.2022C30.8082 18.5092 28.7543 19.0694 27.8207 18.1358C27.0739 17.5757 27.4473 16.6421 28.0074 16.0819C28.3809 15.7085 28.3809 15.1484 28.3809 14.2148L28.5676 4.31887C27.0739 4.50559 26.5137 3.75873 26.7004 2.82515C26.7004 1.89157 26.8871 1.51814 27.4473 1.14471ZM35.2893 7.67975C34.169 7.86647 33.4222 9.17348 33.4222 11.4141C33.4222 14.5882 34.3558 16.2687 35.4761 16.2687C36.7831 16.2687 37.5299 14.5882 37.5299 11.9742C37.5299 8.98676 36.7831 7.67975 35.2893 7.67975Z"
  },
  {
    id: "b2",
    d: "M42.3845 1.14471C44.065 0.771279 46.679 -0.162299 47.6126 0.0244169C48.5461 0.0244169 48.7329 0.957994 48.5461 2.45172L48.3594 7.11961C49.6664 5.62588 51.1602 5.06573 52.8406 5.43917C56.0148 5.99931 57.5085 8.42661 57.1351 11.9742C56.7616 16.0819 54.521 18.696 50.6 18.696C48.9196 18.696 47.6126 18.1358 46.679 17.2022C45.7454 18.5092 43.6915 19.0694 42.758 18.1358C42.0111 17.5757 42.3845 16.6421 42.9447 16.0819C43.3181 15.7085 43.3181 15.1484 43.3181 14.2148L43.5048 4.31887C42.0111 4.50559 41.4509 3.75873 41.6377 2.82515C41.6377 1.89157 41.8244 1.51814 42.3845 1.14471ZM50.2266 7.67975C49.1063 7.86647 48.3594 9.17348 48.3594 11.4141C48.3594 14.5882 49.293 16.2687 50.4133 16.2687C51.7203 16.2687 52.4672 14.5882 52.4672 11.9742C52.4672 8.98676 51.7203 7.67975 50.2266 7.67975Z"
  },
  {
    id: "o2",
    d: "M64.9771 4.87902C61.0561 4.87902 58.4421 7.49304 58.4421 11.7875C58.4421 16.0819 60.8694 18.696 64.9771 18.696C68.8981 18.696 71.6989 16.0819 71.6989 11.7875C71.6989 7.67975 69.0848 4.87902 64.9771 4.87902ZM64.9771 7.30632C63.6701 7.11961 62.9232 8.2399 62.9232 11.2273C62.9232 14.5882 64.0435 16.4554 65.3505 16.4554C66.6575 16.4554 67.4044 15.1484 67.2177 12.1609C67.031 8.80004 66.0974 7.49304 64.9771 7.30632Z"
  },
  {
    id: "d",
    d: "M87.7564 1.14471C86.0759 0.771279 83.4619 -0.162299 82.5283 0.0244169C81.5948 0.0244169 81.4081 0.957994 81.5948 2.45172L81.7815 7.11961C80.4745 5.62588 78.9808 5.06573 77.3003 5.43917C74.1261 5.99931 72.6324 8.42661 73.0059 11.9742C73.3793 16.0819 75.6199 18.696 79.5409 18.696C81.2213 18.696 82.5283 18.1358 83.4619 17.2022C84.3955 18.5092 86.4494 19.0694 87.3829 18.1358C88.1298 17.5757 87.7564 16.6421 87.1962 16.0819C86.8228 15.7085 86.8228 15.1484 86.8228 14.2148L86.6361 4.31887C88.1298 4.50559 88.69 3.75873 88.5032 2.82515C88.5032 1.89157 88.3165 1.51814 87.7564 1.14471ZM79.9143 7.67975C81.0346 7.86647 81.7815 9.17348 81.7815 11.4141C81.7815 14.5882 80.8479 16.2687 79.7276 16.2687C78.4206 16.2687 77.6737 14.5882 77.6737 11.9742C77.6737 8.98676 78.4206 7.67975 79.9143 7.67975Z"
  }
];

export function IntroLoader() {
  const { t } = useI18n();
  const [letterCount, setLetterCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const transitionStartedRef = useRef(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      const timer = setTimeout(() => {
        setIsDone(true);
        const target = document.getElementById("header-brand-logo") || document.querySelector(".brand-link img");
        if (target) (target as HTMLElement).style.opacity = "1";
      }, 50);
      return () => clearTimeout(timer);
    }

    // Sequential letter reveals: J -> o -> b -> b -> o -> d
    const delays = [100, 260, 420, 580, 740, 900];
    const timers: NodeJS.Timeout[] = [];

    delays.forEach((delay, index) => {
      timers.push(
        setTimeout(() => {
          setLetterCount(index + 1);
        }, delay)
      );
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  // When all 6 letters are revealed, launch GSAP Flip transition
  useEffect(() => {
    if (letterCount < 6 || transitionStartedRef.current) return;
    transitionStartedRef.current = true;

    const animationContext = gsap.context(() => {});
    const timer = setTimeout(() => animationContext.add(() => {
      const movingLogo = logoBoxRef.current;
      const bg = bgRef.current;
      const progress = progressRef.current;
      const targetLogo = document.getElementById("header-brand-logo") || document.querySelector(".brand-link img");

      if (!movingLogo || !bg || !targetLogo) {
        setIsDone(true);
        return;
      }

      // Hide target navbar logo initially so moving logo seamlessly replaces it
      gsap.set(targetLogo, { opacity: 0 });

      // Identify landing page elements for staggered entrance
      const staggerSelectors = [
        ".desktop-nav a",
        ".header-actions > *",
        ".hero h1",
        ".hero-description > *",
        ".hero-preview"
      ];
      const staggerTargets = staggerSelectors
        .map(sel => Array.from(document.querySelectorAll(sel)))
        .flat()
        .filter(Boolean);

      // Pre-position stagger elements
      if (staggerTargets.length > 0) {
        gsap.set(staggerTargets, { opacity: 0, y: 24 });
      }

      // Create main GSAP timeline
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(targetLogo, { opacity: 1, clearProps: "transform,translate,scale,rotate" });
          setIsDone(true);
        }
      });

      // 1. Fade out the progress bar smoothly (does not shift layout)
      if (progress) {
        tl.to(progress, {
          opacity: 0,
          scale: 0.95,
          duration: 0.22,
          ease: "power2.out"
        });
      }

      // 2. GSAP Flip Fit from center to navbar target
      const flipTween = Flip.fit(movingLogo, targetLogo, {
        duration: 1.05,
        ease: "power3.inOut",
        absolute: true,
        onComplete: () => {
          gsap.set(targetLogo, { opacity: 1, clearProps: "transform,translate,scale,rotate" });
          gsap.set(movingLogo, { opacity: 0 });
        }
      });
      if (flipTween) {
        tl.add(flipTween as gsap.core.Tween, "<");
      }

      // 3. Fade out preloader background layer as logo approaches navbar
      tl.to(
        bg,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        },
        "-=0.5"
      );

      // 4. Stagger in landing page content as background dissolves
      if (staggerTargets.length > 0) {
        tl.to(
          staggerTargets,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "all"
          },
          "-=0.35"
        );
      }
    }), 220);

    return () => {
      clearTimeout(timer);
      animationContext.revert();
      transitionStartedRef.current = false;
    };
  }, [letterCount]);

  if (isDone) return null;

  return (
    <div
      className="intro-loader-overlay"
      role="status"
      aria-label={t("accessibility.loading")}
    >
      <div ref={bgRef} className="intro-loader-bg" />
      <div className="intro-loader-content">
        <div className="intro-stage-box">
          <div ref={logoBoxRef} className="intro-wordmark-container">
            <svg
              viewBox="0 0 88.5379 18.696"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="intro-wordmark-svg"
              aria-hidden="true"
            >
              <g id="intro-wordmark-paths">
                {LETTERS.map((letter, idx) => (
                  <path
                    key={letter.id}
                    id={`letter-${letter.id}`}
                    d={letter.d}
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#20211E"
                    className="intro-letter-glyph"
                    style={{
                      opacity: letterCount > idx ? 1 : 0,
                      transform: letterCount > idx ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 0.2s ease-out, transform 0.2s ease-out"
                    }}
                  />
                ))}
              </g>
            </svg>
          </div>

          <div ref={progressRef} className="intro-progress-track">
            <div
              className="intro-progress-bar"
              style={{
                width: `${(letterCount / 6) * 100}%`,
                transition: "width 0.16s ease-in-out"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
