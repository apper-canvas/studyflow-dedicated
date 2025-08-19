import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  const baseStyles = "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200";
  
  const variants = {
    default: "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
    error: "border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50"
  };

  return (
    <input
      type={type}
      className={cn(baseStyles, error ? variants.error : variants.default, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;