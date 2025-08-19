import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ className, children, error, ...props }, ref) => {
  const baseStyles = "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none";
  
  const variants = {
    default: "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
    error: "border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50"
  };

  return (
    <div className="relative">
      <select
        className={cn(baseStyles, error ? variants.error : variants.default, className)}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;