"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Maximize, Pause, Play, X } from "lucide-react";
import { StartLink } from "./start-link";
import { useI18n } from "@/providers/i18n-provider";
import { StoryHandwriting } from "./story-handwriting";
import type { StoryLettering } from "@/config/story-lettering";

const poster = "/jobbod/video/jobbod-team-poster.jpg";

export function StoryVideo({ lettering }: { lettering: StoryLettering }) {
  const { t } = useI18n();
  const frame = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewPaused, setPreviewPaused] = useState(false);
  const [watching, setWatching] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !motion.matches && !previewPaused && !watching) {
        setPreviewReady(true);
        void preview.current?.play().catch(() => {});
      } else preview.current?.pause();
    }, { threshold: 0.15 });
    observer.observe(element);
    const previewVideo = preview.current;
    const fullVideo = film.current;
    return () => { observer.disconnect(); previewVideo?.pause(); fullVideo?.pause(); };
  }, [previewPaused, watching]);

  useEffect(() => {
    if (previewPaused || watching) preview.current?.pause();
    else if (previewReady) void preview.current?.play().catch(() => {});
  }, [previewPaused, previewReady, watching]);

  const togglePreview = () => {
    if (!previewReady) { setPreviewReady(true); setPreviewPaused(false); }
    else setPreviewPaused(paused => !paused);
  };
  const watch = () => { setError(false); setWatching(true); };
  const fullscreen = async () => {
    if (frame.current?.requestFullscreen) {
      try { await frame.current.requestFullscreen(); } catch { watch(); }
    } else {
      const video = film.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
      if (video?.webkitEnterFullscreen) video.webkitEnterFullscreen();
      else watch();
    }
  };

  return <section className="story-section" aria-label={t("story.section_aria")}>
    <div className="story-frame" ref={frame} data-watching={watching}>
      <video ref={preview} className="story-preview" src={previewReady ? "/jobbod/video/jobbod-team-preview.mp4" : undefined} poster={poster} autoPlay muted loop playsInline preload="none" aria-hidden="true" />
      {watching ? <>
        <video ref={film} className="story-film" src="/jobbod/video/jobbod-team-150s.mp4" poster={poster} controls autoPlay playsInline preload="metadata" aria-label={t("story.video_aria")} onError={() => setError(true)} />
        <button className="story-close story-icon-button" aria-label={t("story.close_video")} onClick={() => setWatching(false)}><X size={20} /></button>
        {error && <p className="story-error" role="alert">{t("story.error")} <button onClick={() => { setError(false); film.current?.load(); }}>{t("story.retry")}</button></p>}
      </> : <>
        <div className="story-copy"><p className="eyebrow">{t("story.eyebrow")}</p><StoryHandwriting key={lettering.lines[0].text} lettering={lettering} /><div className="story-actions"><StartLink>{t("story.start_with_bob")} <ArrowUpRight size={16} aria-hidden="true" /></StartLink><a href="#faq">{t("story.learn_more")} <ArrowDown size={15} /></a></div></div>
        <button type="button" className="story-play" onClick={watch}><Play size={16} fill="currentColor" /> {t("story.play_video")}</button>
        <button type="button" className="story-pause story-icon-button" aria-label={previewPaused || !previewReady ? t("story.play_bg") : t("story.pause_bg")} onClick={togglePreview}>{previewPaused || !previewReady ? <Play size={18} /> : <Pause size={18} />}</button>
      </>}
    </div>
    <div className="story-caption"><span>{t("story.caption")}</span><span>{t("story.duration")}</span><button type="button" onClick={() => void fullscreen()}><Maximize size={16} /> {t("story.fullscreen")}</button></div>
  </section>;
}
