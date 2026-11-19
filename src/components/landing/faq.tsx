"use client";
import { useState } from "react";
import Image from "next/image";
import { LANDING_FAQ } from "@/config/landing";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="faq-list">{LANDING_FAQ.map((item, index) => <div className="faq-item" key={item.question}>
    <h3><button id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}>
      <span className="faq-question">{item.question}</span>
      <Image src="/jobbod/design/131-1940-imgChevronRightVector.svg" alt="" width={15} height={15} className={open === index ? "faq-chevron expanded" : "faq-chevron"} />
    </button></h3>
    <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={open !== index} className="faq-answer"><p>{item.answer}</p></div>
  </div>)}</div>;
}
