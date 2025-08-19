import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className={error ? "text-red-600" : ""}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;