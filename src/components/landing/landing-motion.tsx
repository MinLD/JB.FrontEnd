"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function enableLetterHops(wordmark: HTMLElement) {
  const letters = Array.from(wordmark.querySelectorAll(".wordmark-letter"));
  const listeners = letters.map(letter => {
    const glyph = letter.querySelector(".wordmark-glyph");
    let hop: Animation | undefined;
    const jump = (event: Event) => {
      const { pointerType } = event as PointerEvent;
      if ((event.type === "pointerdown") !== (pointerType === "touch")) return;

      hop?.cancel();
      hop = glyph?.animate([
        { translate: "0 0", easing: "cubic-bezier(.18,.72,.32,1)" },
        { translate: "0 -32px", offset: 0.38, easing: "cubic-bezier(.4,0,.8,.65)" },
        { translate: "0 3px", offset: 0.76, easing: "ease-out" },
        { translate: "0 0" },
      ], { duration: 610 });
    };

    letter.addEventListener("pointerenter", jump);
    letter.addEventListener("pointerdown", jump);
    return () => {
      letter.removeEventListener("pointerenter", jump);
      letter.removeEventListener("pointerdown", jump);
      hop?.cancel();
    };
  });
  return () => listeners.forEach(dispose => dispose());
}

const arrowDuration = 1.1;
const stepDuration = 1.7;

function animateWorkflow(section: HTMLElement, desktop: boolean, revealed: { current: number }) {
  const viewport = section.querySelector<HTMLElement>(".workflow-viewport");
  const content = section.querySelector<HTMLElement>(".workflow-track");
  const cards = Array.from(section.querySelectorAll<HTMLElement>(".step-card"));
  const arrows = Array.from(section.querySelectorAll<SVGSVGElement>(desktop ? ".step-line" : ".step-line-mobile"));
  if (!viewport || !content || cards.length < 2) return;

  let releaseFrame = 0;
  let released = false;
  const cleanup = () => {
    cancelAnimationFrame(releaseFrame);
    section.removeAttribute("data-workflow-pinned");
    section.removeAttribute("data-workflow-enhanced");
    viewport.style.removeProperty("--workflow-stage-height");
  };
  section.setAttribute("data-workflow-enhanced", "");
  const reveal = gsap.timeline({ paused: true });
  arrows.forEach((arrow, index) => drawConnection(reveal, arrow, cards[index + 1], index * stepDuration));
  reveal.progress(revealed.current);
  if (revealed.current === 1) return cleanup;

  const pinTop = () => Math.ceil(document.querySelector(".site-header .header-bar")?.getBoundingClientRect().bottom ?? 70) + 12;
  const resizeStage = () => {
    const height = Math.min(content.scrollHeight, Math.max(120, window.innerHeight - pinTop() - 32));
    viewport.style.setProperty("--workflow-stage-height", `${height}px`);
  };
  section.setAttribute("data-workflow-pinned", "");
  resizeStage();

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: viewport,
      start: () => `top top+=${pinTop()}`,
      end: () => `+=${Math.max(1000, window.innerHeight * 1.5, content.scrollHeight - viewport.clientHeight + 900)}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: true,
      invalidateOnRefresh: true,
      onRefreshInit: resizeStage,
      onUpdate: trigger => {
        revealed.current = Math.max(revealed.current, trigger.progress);
        reveal.progress(revealed.current);
        if (revealed.current === 1 && !released && !releaseFrame) {
          releaseFrame = requestAnimationFrame(releasePin);
        }
      },
    },
  });
  arrows.forEach((_, index) => {
    const nextCard = cards[index + 1];
    timeline.to(content, {
      y: () => -Math.min(
        Math.max(0, content.scrollHeight - viewport.clientHeight),
        Math.max(0, nextCard.offsetTop + nextCard.offsetHeight + 24 - viewport.clientHeight),
      ),
      duration: arrowDuration,
      ease: "none",
    }, index * stepDuration);
  });
  timeline.to({}, { duration: reveal.duration() }, 0);

  function releasePin() {
    released = true;
    const previousTop = content!.getBoundingClientRect().top;
    timeline.scrollTrigger?.kill(true);
    timeline.kill();
    section.removeAttribute("data-workflow-pinned");
    viewport!.style.removeProperty("--workflow-stage-height");
    gsap.set(content, { clearProps: "transform" });
    // Removing the spacer restores normal flow; keep the same content under the user's eyes.
    window.scrollBy({ top: content!.getBoundingClientRect().top - previousTop, behavior: "instant" });
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  }

  return cleanup;
}

function drawConnection(timeline: gsap.core.Timeline, arrow: SVGSVGElement, nextCard: HTMLElement, position: number) {
  const line = arrow.querySelector<SVGPathElement>("[data-arrow-line]");
  const tip = arrow.querySelector("[data-arrow-tip]");
  const spark = arrow.querySelector("[data-arrow-spark]");
  if (!line || !tip || !spark) return;

  const distance = line.getTotalLength();
  const tracer = { progress: 0 };
  const arrival = position + arrowDuration;
  gsap.set(line, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(tip, { opacity: 0 });
  gsap.set(spark, { opacity: 0 });
  gsap.set(nextCard, { autoAlpha: 0, y: 16, scale: 0.97, "--step-glow": 0 });

  timeline
    .to(line, { strokeDashoffset: 0, stroke: "#dca82d", autoRound: false, duration: arrowDuration, ease: "none" }, position)
    .to(tracer, {
      progress: 1,
      duration: arrowDuration,
      ease: "none",
      onUpdate: () => {
        const point = line.getPointAtLength(tracer.progress * distance);
        spark.setAttribute("cx", String(point.x));
        spark.setAttribute("cy", String(point.y));
      },
    }, position)
    .to(spark, { opacity: 1, duration: 0.12 }, position)
    .to(spark, { opacity: 0, duration: 0.18 }, arrival - 0.12)
    .to(tip, { opacity: 1, stroke: "#dca82d", duration: 0.13 }, arrival - 0.03)
    .to(nextCard, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" }, arrival)
    .to(nextCard, { "--step-glow": 0.25, duration: 0.18 }, arrival)
    .to(nextCard, { "--step-glow": 0, duration: 0.42 }, arrival + 0.18);
}

export function LandingMotion() {
  const workflowRevealed = useRef(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 901px)",
      finePointer: "(hover: hover) and (pointer: fine)",
    }, ({ conditions }) => {
      if (!conditions?.motion) return;
      const cleanups: Array<() => void> = [];

      const section = document.querySelector<HTMLElement>(".workflow-section");
      if (section) {
        const stopWorkflow = animateWorkflow(section, Boolean(conditions.desktop), workflowRevealed);
        if (stopWorkflow) cleanups.push(stopWorkflow);
      }

      const revealGroups = document.querySelectorAll<HTMLElement>([
        ".landing-main .connection-copy", ".landing-main .project-copy",
        ".landing-main .bob-copy",
        ".landing-main .section-heading", ".landing-main .matching-grid",
        ".site-footer .team-group-heading", ".site-footer .founder-card",
        ".site-footer .footer-invitation",
      ].join(", "));

      revealGroups.forEach(group => {
        gsap.from(group, {
          opacity: 0,
          y: 28,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 94%", once: true },
          clearProps: "opacity,transform",
        });
      });

      const bobScene = document.querySelector(".bob-scene");
      if (bobScene) {
        gsap.from(bobScene.querySelectorAll(".bob-character, .bob-greeting"), {
          y: 22,
          opacity: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: bobScene, start: "top 86%", once: true },
          clearProps: "opacity,transform",
        });
      }

      const wordmark = document.querySelector<HTMLElement>(".footer-wordmark");
      if (wordmark) {
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: wordmark, start: "top 91%", once: true },
        });
        reveal
          .fromTo(wordmark.querySelectorAll(".wordmark-glyph"), {
            y: 70,
            rotate: 8,
            scale: 0.85,
            opacity: 0,
            clipPath: "inset(100% -15% 0 -15%)",
          }, {
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            clipPath: "inset(-15% -15% -15% -15%)",
            duration: 0.92,
            stagger: 0.092,
            ease: "power4.out",
            clearProps: "clipPath,opacity,transform",
          });
      }
      const stopLetterHops = wordmark ? enableLetterHops(wordmark) : undefined;
      if (stopLetterHops) cleanups.push(stopLetterHops);

      const preview = document.querySelector<HTMLElement>(".hero-preview");
      const surface = preview?.querySelector<HTMLElement>(".hero-preview-surface");
      if (!conditions.finePointer || !preview || !surface) return () => cleanups.forEach(cleanup => cleanup());

      const lift = gsap.quickTo(surface, "y", { duration: 0.55, ease: "power3.out" });
      const rotateX = gsap.quickTo(surface, "rotationX", { duration: 0.65, ease: "power3.out" });
      const rotateY = gsap.quickTo(surface, "rotationY", { duration: 0.65, ease: "power3.out" });
      const scaleX = gsap.quickTo(surface, "scaleX", { duration: 0.65, ease: "power3.out" });
      const scaleY = gsap.quickTo(surface, "scaleY", { duration: 0.65, ease: "power3.out" });

      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const bounds = preview.getBoundingClientRect();
        const x = gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
        const y = gsap.utils.clamp(0, 1, (event.clientY - bounds.top) / bounds.height);
        lift(-18);
        scaleX(1.018);
        scaleY(1.018);
        rotateX((0.5 - y) * 10);
        rotateY((x - 0.5) * 12);
      };
      const reset = () => {
        lift(0);
        scaleX(1);
        scaleY(1);
        rotateX(0);
        rotateY(0);
      };

      preview.addEventListener("pointermove", move);
      preview.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        preview.removeEventListener("pointermove", move);
        preview.removeEventListener("pointerleave", reset);
      });
      return () => cleanups.forEach(cleanup => cleanup());
    });

    return () => media.revert();
  }, []);

  return null;
}
