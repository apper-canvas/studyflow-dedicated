import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "CheckSquare" },
    { name: "Calendar", href: "/calendar", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "TrendingUp" }
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white shadow-lg">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                  <ApperIcon name="GraduationCap" size={24} className="text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 font-display">StudyFlow</h1>
                  <p className="text-sm text-gray-500">Academic Manager</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <motion.div 
                      className="flex items-center w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ApperIcon
                        name={item.icon}
                        size={20}
                        className={`mr-3 flex-shrink-0 ${
                          isActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"
                        }`}
                      />
                      <span>{item.name}</span>
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 p-4">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" size={20} className="text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Stay Focused</p>
                  <p className="text-xs text-gray-600">Track your progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;