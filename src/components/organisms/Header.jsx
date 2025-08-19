import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMobileMenuToggle, onQuickAdd }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden -ml-0.5 -mt-0.5 inline-flex items-center justify-center h-12 w-12 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              onClick={onMobileMenuToggle}
            >
              <ApperIcon name="Menu" size={24} />
            </button>

            <div className="lg:hidden flex items-center ml-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" size={20} className="text-white" />
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900 font-display">StudyFlow</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <motion.div
                initial={false}
                animate={{ width: showSearch ? 300 : 40 }}
                className="relative"
              >
                {showSearch ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search assignments, courses..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200"
                      autoFocus
                      onBlur={() => setShowSearch(false)}
                    />
                    <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Search" size={20} />
                  </button>
                )}
              </motion.div>
            </div>

            <Button
              onClick={onQuickAdd}
              size="md"
              className="hidden sm:flex bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Quick Add
            </Button>

            <button className="sm:hidden w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Search" size={20} />
            </button>

            <button 
              onClick={onQuickAdd}
              className="sm:hidden w-10 h-10 flex items-center justify-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ApperIcon name="Plus" size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;