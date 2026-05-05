import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[0_10px_24px_rgb(17_24_39_/_0.16)] hover:bg-slate-800 hover:shadow-[0_14px_30px_rgb(17_24_39_/_0.18)]",
        secondary: "border border-border bg-card text-slate-900 hover:border-slate-400 hover:bg-white",
        ghost: "text-slate-700 hover:bg-[#ece7da] hover:text-slate-950",
        destructive: "bg-destructive text-white hover:bg-red-700",
        accent: "bg-accent text-accent-foreground shadow-[0_10px_24px_rgb(0_109_119_/_0.2)] hover:bg-[#00525a]"
      },
      size: {
        default: "h-11",
        sm: "h-10 px-3",
        lg: "h-12 px-5",
        icon: "h-11 w-11 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
