import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Get started by adding your first item", 
  actionLabel = "Add Item",
  onAction,
  icon = "Plus",
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center min-h-[400px] p-8 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 border-2 border-gray-200">
        <ApperIcon name={icon} size={36} className="text-gray-400" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 flex items-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center">
          <ApperIcon name="BookOpen" size={16} className="mr-1" />
          Organize
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="flex items-center">
          <ApperIcon name="Target" size={16} className="mr-1" />
          Track
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="flex items-center">
          <ApperIcon name="TrendingUp" size={16} className="mr-1" />
          Succeed
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;