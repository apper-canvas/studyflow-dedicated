import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, setIsOpen }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "CheckSquare" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "TrendingUp" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="GraduationCap" size={20} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-bold text-gray-900 font-display">StudyFlow</h1>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <ApperIcon
                          name={item.icon}
                          size={20}
                          className={`mr-3 flex-shrink-0 ${
                            isActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"
                          }`}
                        />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;