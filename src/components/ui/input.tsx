import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/utils/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Ô nhập có style chung, hỗ trợ ref và React Hook Form.
 * @remarks Nhận props HTML input. Tự thêm label/id và validation; dùng AuthField khi cần hiện/ẩn mật khẩu. Handler và useForm đặt trong Client Component.
 * @example
 * import { Input } from "@/components/ui/input";
 * <label htmlFor="email">Email</label>
 * <Input id="email" type="email" name="email" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded border border-input bg-background px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
