import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
        {message}. Don't worry, this happens sometimes. Please try again.
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
      
      <div className="mt-6 text-xs text-gray-400">
        If this problem persists, please check your connection and try again later.
      </div>
    </motion.div>
  );
};

export default Error;