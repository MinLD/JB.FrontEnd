import { cn } from "@/utils/cn";

export type StepItem = {
  id: string | number;
  label: string;
  number?: string | number;
  status?: "active" | "completed" | "upcoming";
};

export type StepperProps = {
  steps: StepItem[];
  ariaLabel?: string;
  currentStep?: string | number;
  className?: string;
  onStepClick?: (step: StepItem) => void;
};

/**
 * Thanh chỉ báo tiến trình nhiều bước (Stepper) dùng trong onboarding, đăng ký và wizard.
 * @remarks ariaLabel cho phép dịch tên điều hướng cho trình đọc màn hình. steps nhận mảng các bước có label, number và status. currentStep xác định bước hiện tại nếu status chưa gán. Có thể truyền onStepClick để tương tác. Hỗ trợ responsive ẩn bớt nhãn không active trên màn hình nhỏ.
 * @example
 * import { Stepper } from "@/components/ui/stepper";
 * <Stepper steps={[{ id: "1", label: "Làm quen" }, { id: "2", label: "Tạo hồ sơ" }]} currentStep="1" />
 */
export function Stepper({
  steps,
  ariaLabel = "Tiến trình các bước",
  currentStep,
  className,
  onStepClick,
}: StepperProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn("flex items-center gap-1.5 sm:gap-2.5 md:gap-3", className)}
    >
      <ol className="m-0 flex list-none items-center gap-1.5 sm:gap-2.5 md:gap-3 p-0">
        {steps.map((step, index) => {
          const stepNumber = step.number ?? String(index + 1).padStart(2, "0");
          const isActive = step.status
            ? step.status === "active"
            : currentStep !== undefined && String(step.id) === String(currentStep);
          const isCompleted = step.status === "completed";
          const isUpcoming = !isActive && !isCompleted;

          return (
            <li
              key={step.id}
              className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3"
            >
              <button
                type="button"
                onClick={() => onStepClick?.(step)}
                disabled={!onStepClick}
                className={cn(
                  "inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[13px] transition-colors outline-none",
                  onStepClick ? "cursor-pointer hover:opacity-85" : "cursor-default",
                  isActive
                    ? "font-semibold text-[#20211e]"
                    : "font-normal text-[#6a7580]",
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex size-5 sm:size-6 items-center justify-center rounded-full text-[10px] sm:text-[11px] transition-all select-none shrink-0",
                    isActive &&
                      "bg-[#f2c744] text-[#20211e] font-bold shadow-xs",
                    isUpcoming &&
                      "border border-[#d8dfe5] bg-white text-[#6a7580] font-normal",
                    isCompleted &&
                      "border border-[#f2c744] bg-[#f2c744]/15 text-[#20211e] font-semibold",
                  )}
                >
                  {stepNumber}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap transition-all",
                    !isActive && "hidden md:inline",
                  )}
                >
                  {step.label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className="h-[1px] w-3 sm:w-5 md:w-7 bg-[#d8dfe5] shrink-0"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
