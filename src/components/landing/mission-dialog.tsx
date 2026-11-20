"use client";

import { useEffect, useId, useRef } from "react";
import { Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";

export function MissionDialog() {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    return () => dialog?.close();
  }, []);
  return <>
    <button type="button" className="mission-trigger" onClick={() => ref.current?.showModal()}>{t("mission.trigger")}</button>
    <dialog ref={ref} className="mission-dialog" aria-labelledby={titleId} onClick={event => { if (event.target === event.currentTarget) ref.current?.close(); }}>
      <article>
        <header><Award size={20} aria-hidden="true" /><h2 id={titleId}>{t("mission.title")}</h2><button type="button" className="mission-close" aria-label={t("mission.close_aria")} onClick={() => ref.current?.close()}><X size={18} /></button></header>
        <div className="mission-content">
          <p><strong>{t("mission.belief")}</strong></p>
          <p>{t("mission.context")}</p>
          <blockquote>{t("mission.quote")}</blockquote>
          <p>{t("mission.closing")}</p>
        </div>
        <footer><Button onClick={() => ref.current?.close()}>{t("mission.understood")}</Button></footer>
      </article>
    </dialog>
  </>;
}
