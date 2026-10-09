import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "destructive"
    | "purple"
    | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-blue-50 text-[#0066FF] border border-blue-200/80 font-medium",
    secondary:
      "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium",
    warning:
      "bg-amber-50 text-amber-700 border border-amber-200 font-medium",
    destructive:
      "bg-rose-50 text-rose-700 border border-rose-200 font-medium",
    purple:
      "bg-purple-50 text-purple-700 border border-purple-200 font-medium",
    outline:
      "bg-transparent text-slate-600 border border-slate-300 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
