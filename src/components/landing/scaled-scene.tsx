"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Scale illustrations only; surrounding content reflows normally. */
export function ScaledScene({ width, height, children, className = "" }: {
  width: number; height: number; children: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const resize = () => setScale(element.clientWidth / width);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);
  return <div ref={ref} className={`scaled-scene ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
    <div className="scaled-scene-inner" style={{ width, height, transform: `scale(${scale})` }}>{children}</div>
  </div>;
}
