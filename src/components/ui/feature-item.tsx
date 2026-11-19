import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type FeatureItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
};

/**
 * Hiển thị một mục tính năng hoặc giá trị nổi bật gồm biểu tượng, tiêu đề và mô tả.
 * @remarks Nhận icon dưới dạng ReactNode (ví dụ icon Lucide), title và description. Dùng trong danh sách giới thiệu, onboarding hoặc thẻ thông tin.
 * @example
 * import { FeatureItem } from "@/components/ui/feature-item";
 * import { UserRound } from "lucide-react";
 * <FeatureItem icon={<UserRound size={20} />} title="Mục tiêu" description="Tổng hợp hồ sơ" />
 */
export function FeatureItem({
  icon,
  title,
  description,
  className,
}: FeatureItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3.5 py-3.5 sm:py-4 transition-colors",
        className,
      )}
    >
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-[#20211e]">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="m-0 text-[15px] font-semibold tracking-tight text-[#20211e]">
          {title}
        </h3>
        <p className="m-0 text-[13.5px] leading-relaxed text-[#6a7580]">
          {description}
        </p>
      </div>
    </div>
  );
}
