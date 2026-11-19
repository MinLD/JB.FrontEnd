"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";

import { cn } from "@/utils/cn";

export type CheckboxProps = ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
>;

/**
 * Checkbox Radix, hỗ trợ bàn phím và trạng thái indeterminate.
 * @remarks Client Component. checked nhận boolean hoặc "indeterminate"; onCheckedChange trả giá trị, không phải event. Gắn label bằng htmlFor/id.
 * @example
 * import { Checkbox } from "@/components/ui/checkbox";
 * <Checkbox id="remember" checked={remember} onCheckedChange={value => setRemember(value === true)} />
 * <label htmlFor="remember">Ghi nhớ tôi</label>
 */
export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer flex size-4 shrink-0 items-center justify-center rounded border border-input bg-background text-primary-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        className,
      )}
      ref={ref}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";
