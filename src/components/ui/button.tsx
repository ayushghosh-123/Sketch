import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400 shadow-sm shadow-sky-500/20",
        destructive: "bg-red-600 text-white hover:bg-red-500 shadow-sm shadow-red-500/20",
        outline: "border border-slate-700 bg-slate-900/50 text-slate-200 hover:bg-slate-800 hover:text-white",
        secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/50",
        ghost: "hover:bg-slate-800 text-slate-300 hover:text-white",
        link: "text-sky-400 underline-offset-4 hover:underline",
        cyber: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 border border-cyan-400/30",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
