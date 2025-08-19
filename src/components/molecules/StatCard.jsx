import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className = "" 
}) => {
  const colorVariants = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-emerald-500 to-emerald-600",
    warning: "from-amber-500 to-amber-600",
    danger: "from-red-500 to-red-600"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 font-display">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
                className={trend === "up" ? "text-emerald-500" : "text-red-500"}
              />
              <span className={`text-sm ml-1 ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorVariants[color]} rounded-lg flex items-center justify-center shadow-lg`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;