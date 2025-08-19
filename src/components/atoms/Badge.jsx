import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    secondary: "bg-secondary-100 text-secondary-800 border border-secondary-200",
    accent: "bg-accent-100 text-accent-800 border border-accent-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    high: "bg-red-100 text-red-800 border border-red-200",
    medium: "bg-amber-100 text-amber-800 border border-amber-200",
    low: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    completed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    pending: "bg-amber-100 text-amber-800 border border-amber-200",
    "in-progress": "bg-blue-100 text-blue-800 border border-blue-200"
  };

  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;