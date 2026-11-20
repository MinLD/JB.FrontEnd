"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { FaqItem } from "@/config/landing";

export function Faq({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => (
        <div className="faq-item" key={item.question}>
          <h3>
            <button
              id={`faq-question-${index}`}
              aria-expanded={open === index}
              aria-controls={`faq-answer-${index}`}
              onClick={() => setOpen(open === index ? null : index)}
            >
              <span className="faq-question">{item.question}</span>
              <Plus
                size={18}
                aria-hidden="true"
                className={open === index ? "faq-chevron expanded" : "faq-chevron"}
              />
            </button>
          </h3>
          <div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            aria-hidden={open !== index}
            inert={open !== index}
            data-open={open === index}
            className="faq-answer"
          >
            <div className="faq-answer-inner">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
