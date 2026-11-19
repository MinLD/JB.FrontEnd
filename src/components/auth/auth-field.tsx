"use client";
import { useEffect, useId, useRef, useState, type InputHTMLAttributes } from "react";
import type { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { AUTH_LIMITS } from "@/lib/validations/auth";
export function AuthField({
  error,
  label,
  validationAttempt = 0,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
  validationAttempt?: number;
}) {
  const [visible, setVisible] = useState(false);
  const password = props.type === "password";
  const generatedId = useId();
  const id = props.id || generatedId;
  const maxLength =
    props.maxLength ??
    (props.type === "email"
      ? AUTH_LIMITS.emailMax
      : password
        ? AUTH_LIMITS.passwordMax
        : AUTH_LIMITS.nameMax);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [limitAttempt, setLimitAttempt] = useState(0);
  const fieldRef = useRef<HTMLDivElement>(null);
  const visibleError = error || limitError;
  useEffect(() => {
    if (
      !visibleError ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const field = fieldRef.current;
    field?.getAnimations().forEach((animation) => animation.cancel());
    field?.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-5px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(3px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 320, easing: "ease-out" },
    );
  }, [visibleError, validationAttempt, limitAttempt]);
  const rejectLongInput = () => {
    const message = `${label} tối đa ${maxLength} ký tự.`;
    setLimitError(message);
    setLimitAttempt((value) => value + 1);
    toast.error(message, { id: "auth-validation", duration: 4000 });
  };
  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="auth-field" ref={fieldRef}>
        <Input
          {...props}
          id={id}
          type={password && visible ? "text" : props.type}
          placeholder={props.placeholder ?? label}
          maxLength={maxLength}
          onChange={(event) => {
            setLimitError(null);
            props.onChange?.(event);
          }}
          onPaste={(event) => {
            const input = event.currentTarget;
            const nextLength =
              input.value.length -
              ((input.selectionEnd ?? input.value.length) -
                (input.selectionStart ?? input.value.length)) +
              event.clipboardData.getData("text").length;
            if (nextLength > maxLength) {
              event.preventDefault();
              rejectLongInput();
              return;
            }
            props.onPaste?.(event);
          }}
          onBeforeInput={(event) => {
            const input = event.currentTarget;
            const data = (event.nativeEvent as InputEvent).data;
            if (
              data &&
              input.value.length -
                ((input.selectionEnd ?? input.value.length) -
                  (input.selectionStart ?? input.value.length)) +
                data.length >
                maxLength
            ) {
              event.preventDefault();
              rejectLongInput();
              return;
            }
            props.onBeforeInput?.(event);
          }}
          aria-invalid={Boolean(visibleError)}
          aria-describedby={[props["aria-describedby"], visibleError ? `${id}-error` : undefined].filter(Boolean).join(" ") || undefined}
          className="auth-input"
        />
        {password && (
          <button
            type="button"
            className="password-toggle"
            aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setVisible(!visible)}
          >
            {visible ? "Ẩn" : "Hiện"}
          </button>
        )}
      </div>
      {visibleError && (
        <p id={`${id}-error`} className="field-error">
          {visibleError}
        </p>
      )}
    </div>
  );
}
export function showValidationError(errors: FieldErrors) {
  const firstError = Object.values(errors).find(
    (error) => typeof error?.message === "string",
  );
  toast.error(
    typeof firstError?.message === "string"
      ? firstError.message
      : "Vui lòng kiểm tra lại thông tin đã nhập.",
    { id: "auth-validation", duration: 4000 },
  );
}
