"use client";

import { useEffect, useId, useRef } from "react";
import { Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MissionDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    return () => dialog?.close();
  }, []);
  return <>
    <button type="button" className="mission-trigger" onClick={() => ref.current?.showModal()}>Sứ mệnh của chúng tôi</button>
    <dialog ref={ref} className="mission-dialog" aria-labelledby={titleId} onClick={event => { if (event.target === event.currentTarget) ref.current?.close(); }}>
      <article>
        <header><Award size={20} aria-hidden="true" /><h2 id={titleId}>Tuyên ngôn sứ mệnh của JobBod</h2><button type="button" className="mission-close" aria-label="Đóng tuyên ngôn" onClick={() => ref.current?.close()}><X size={18} /></button></header>
        <div className="mission-content">
          <p><strong>Chúng tôi tin rằng: Không sinh viên nào xứng đáng phải “gánh team một mình” trong cô độc.</strong></p>
          <p>Hàng ngày, hàng ngàn sinh viên phải lướt qua hàng trăm bài đăng để tìm một người bạn cùng chí hướng làm đồ án hoặc đi thi hackathon.</p>
          <blockquote>JobBod ra đời để mỗi kỹ năng tìm thấy mảnh ghép còn thiếu, và những cuộc trò chuyện trở thành những cái bắt tay cùng làm dự án thật.</blockquote>
          <p>Một người đồng đội phù hợp. Một khởi đầu có ý nghĩa.</p>
        </div>
        <footer><Button onClick={() => ref.current?.close()}>Đã hiểu</Button></footer>
      </article>
    </dialog>
  </>;
}
