"use client";

import { useEffect, useId, useRef } from "react";
import type { StoryLettering } from "@/config/story-lettering";

export function StoryHandwriting({ lettering }: { lettering: StoryLettering }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const played = useRef(false);
  const id = useId();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ink = Array.from(svg.querySelectorAll<SVGPathElement>("[data-ink]"));
    const brushes = Array.from(svg.querySelectorAll<SVGPathElement>("[data-brush]"));
    const lines = Array.from(svg.querySelectorAll<SVGGElement>("[data-line]"));
    const lineBounds = lines.map(line => line.getBBox());
    const glyphBounds = ink.map(path => path.getBBox());
    const lineIndices = ink.map(path => Number(path.parentElement!.dataset.line));
    const pen = svg.querySelector<SVGGElement>("[data-pen]")!;
    let frame = 0;
    let visible = false;
    let started = false;
    let disposed = false;
    let introObserver: MutationObserver | undefined;

    function finish() {
      cancelAnimationFrame(frame);
      ink.forEach(path => { path.removeAttribute("mask"); path.style.visibility = ""; });
      lines.forEach(line => line.removeAttribute("transform"));
      pen.style.opacity = "0";
      svg!.dataset.writing = "complete";
    }

    if (motion.matches || played.current) {
      finish();
      return;
    }

    const lengths = brushes.map(path => path.getTotalLength());
    const samples = brushes.map((path, index) => Array.from({ length: 65 }, (_, step) => {
      const point = path.getPointAtLength(lengths[index] * step / 64);
      return { x: point.x, y: point.y };
    }));
    const shifts = lineBounds.map(bounds => bounds.width / 2);
    lines.forEach((line, index) => line.setAttribute("transform", `translate(${shifts[index]} 0)`));
    brushes.forEach((path, index) => {
      path.style.strokeDasharray = String(lengths[index]);
      path.style.strokeDashoffset = String(lengths[index]);
      ink[index].style.visibility = "hidden";
    });
    svg.dataset.writing = "waiting";

    function begin() {
      if (disposed || started || !visible || motion.matches) return;
      const intro = document.querySelector(".intro-loader-overlay");
      if (intro) {
        if (!introObserver) {
          introObserver = new MutationObserver(() => {
            if (!intro.isConnected) { introObserver?.disconnect(); begin(); }
          });
          introObserver.observe(intro.parentElement!, { childList: true });
        }
        return;
      }
      started = true;
      played.current = true;
      svg!.dataset.writing = "writing";
      const durations = lengths.map(length => Math.min(240, Math.max(130, length * .75)));
      const offsets = durations.map((_, index) => durations.slice(0, index).reduce((sum, duration) => sum + duration, 0));
      let index = 0;
      let startedAt: number | undefined;
      let previousTime: number | undefined;
      let penPosition: { x: number; y: number } | undefined;
      const visibleEnds = lineBounds.map(bounds => bounds.x);
      function reveal(index: number) {
        ink[index].style.visibility = "visible";
        ink[index].setAttribute("mask", `url(#${id}-${index})`);
      }
      reveal(0);
      function draw(now: number) {
        if (disposed) return;
        if (motion.matches) { finish(); return; }
        startedAt ??= now;
        const elapsed = now - startedAt;
        const delta = Math.min(50, now - (previousTime ?? now - 16));
        previousTime = now;
        while (elapsed >= offsets[index] + durations[index]) {
          ink[index].removeAttribute("mask");
          const line = lineIndices[index];
          visibleEnds[line] = Math.max(visibleEnds[line], glyphBounds[index].x + glyphBounds[index].width);
          index++;
          if (index === brushes.length) { finish(); return; }
          if (lineIndices[index] !== line) lines[line].removeAttribute("transform");
          reveal(index);
        }
        const progress = Math.min(1, (elapsed - offsets[index]) / durations[index]);
        brushes[index].style.strokeDashoffset = String(lengths[index] * (1 - progress));
        const line = lineIndices[index];
        const nextEnd = Math.max(visibleEnds[line], glyphBounds[index].x + glyphBounds[index].width);
        const edge = visibleEnds[line] + (nextEnd - visibleEnds[line]) * progress;
        const targetShift = (lineBounds[line].x + lineBounds[line].width - edge) / 2;
        const follow = 1 - Math.exp(-delta / 55);
        shifts[line] += (targetShift - shifts[line]) * follow;
        lines[line].setAttribute("transform", `translate(${shifts[line]} 0)`);
        const sample = progress * 64;
        const low = Math.min(63, Math.floor(sample));
        const mix = sample - low;
        const from = samples[index][low];
        const to = samples[index][low + 1];
        const point = { x: from.x + (to.x - from.x) * mix + shifts[line], y: from.y + (to.y - from.y) * mix };
        penPosition ??= point;
        penPosition.x += (point.x - penPosition.x) * follow;
        penPosition.y += (point.y - penPosition.y) * follow;
        pen.setAttribute("transform", `translate(${penPosition.x} ${penPosition.y}) rotate(-28)`);
        pen.style.opacity = "1";
        frame = requestAnimationFrame(draw);
      }
      frame = requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) begin();
    }, { threshold: .5 });
    observer.observe(svg);
    const onMotionChange = () => {
      if (motion.matches) { started = true; played.current = true; finish(); }
    };
    motion.addEventListener("change", onMotionChange);
    return () => {
      disposed = true;
      finish();
      observer.disconnect();
      introObserver?.disconnect();
      motion.removeEventListener("change", onMotionChange);
    };
  }, [id, lettering]);

  const glyphs = lettering.lines.flatMap(line => line.glyphs);
  return <h2 id="story-heading" aria-label={lettering.lines.map(line => line.text).join(" ")}>
    <svg ref={svgRef} className="story-lettering" viewBox={`0 0 ${lettering.width} ${lettering.height}`} style={{ maxWidth: `${lettering.width * .72}px` }} aria-hidden="true" focusable="false">
      <defs>
        {glyphs.map((d, index) => <mask key={index} id={`${id}-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width={lettering.width} height={lettering.height} style={{ maskType: "alpha" }}>
          <path data-brush d={d} fill="none" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </mask>)}
      </defs>
      {lettering.lines.map((line, lineIndex) => <g key={lineIndex} data-line={lineIndex}>
        {line.glyphs.map((d, index) => <path key={index} data-ink d={d} fill="currentColor" />)}
      </g>)}
      <g data-pen className="story-writing-pen">
        <path d="M0 0 1-12 7-8Z" fill="#fffdf6" />
        <path d="m1-12 10-23a3.5 3.5 0 0 1 6 3L7-8Z" fill="var(--primary)" stroke="#fffdf6" strokeWidth="1.2" />
        <path d="M0 0 3-6" stroke="#fffdf6" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  </h2>;
}
