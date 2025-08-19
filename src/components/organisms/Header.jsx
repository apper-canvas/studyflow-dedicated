import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
const Header = ({ onMobileMenuToggle, onQuickAdd }) => {
  const { logout } = useContext(AuthContext)
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} className="text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">StudyFlow</h1>
          </div>
        </div>

<div className="flex items-center space-x-4">
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
            title="Logout"
          >
            <ApperIcon name="LogOut" size={20} />
          </button>
        </div>
</div>
    </header>
  );
};

export default Header;