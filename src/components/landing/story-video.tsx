"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Maximize, Pause, Play, X } from "lucide-react";
import { StartLink } from "./start-link";

const poster = "/jobbod/video/connection-story-poster.jpg";

export function StoryVideo() {
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

  return <section className="story-section" aria-label="Câu chuyện về kết nối">
    <div className="story-frame" ref={frame} data-watching={watching}>
      <video ref={preview} className="story-preview" src={previewReady ? "/jobbod/video/connection-story-preview.mp4" : undefined} poster={poster} autoPlay muted loop playsInline preload="none" aria-hidden="true" />
      {watching ? <>
        <video ref={film} className="story-film" src="/jobbod/video/connection-story.mp4" poster={poster} controls autoPlay playsInline preload="metadata" aria-label="Video câu chuyện về kết nối" onError={() => setError(true)} />
        <button className="story-close story-icon-button" aria-label="Đóng video" onClick={() => setWatching(false)}><X size={20} /></button>
        {error && <p className="story-error" role="alert">Chưa phát được video. <button onClick={() => { setError(false); film.current?.load(); }}>Thử lại</button></p>}
      </> : <>
        <div className="story-copy"><p className="eyebrow">MỖI KẾT NỐI, MỘT KHỞI ĐẦU.</p><h2 id="story-heading">Có người cùng mình.<br /><em>Câu chuyện sẽ khác.</em></h2><div className="story-actions"><StartLink>Bắt đầu cùng Bob <ArrowUpRight size={16} aria-hidden="true" /></StartLink><a href="#faq">Tìm hiểu thêm <ArrowDown size={15} /></a></div></div>
        <button type="button" className="story-play" onClick={watch}><Play size={16} fill="currentColor" /> Phát video</button>
        <button type="button" className="story-pause story-icon-button" aria-label={previewPaused || !previewReady ? "Phát nền video" : "Tạm dừng nền video"} onClick={togglePreview}>{previewPaused || !previewReady ? <Play size={18} /> : <Pause size={18} />}</button>
      </>}
    </div>
    <div className="story-caption"><span>Một câu chuyện về kết nối.</span><span>2:26</span><button type="button" onClick={() => void fullscreen()}><Maximize size={16} /> Toàn màn hình</button></div>
  </section>;
}
