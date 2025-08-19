import { motion } from "framer-motion";

const Loading = ({ variant = "page" }) => {
  if (variant === "skeleton") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="animate-pulse"
          >
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="animate-pulse"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full mt-4"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center space-y-4"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full"
          ></motion.div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 font-display">Loading StudyFlow</h3>
          <p className="text-sm text-gray-500 mt-1">Getting your academic data ready...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;