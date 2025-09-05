'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  BarChart3, 
  Grid3X3, 
  Table, 
  Trello, 
  Plus, 
  Filter, 
  Settings, 
  User 
} from 'lucide-react';
import { getProjectDetails } from '@/app/script/Getproject';
import { FaCoffee } from 'react-icons/fa';
import FilterSidebar from './Modal';
import AddWorkModal from './Add';

const ProjectNavbar = () => {
  const [projectData, setProjectData] = useState(null);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectDetails();
        
        console.log("Fetched project data:", data);
        
        if (data) {
          setProjectData(data);
          setError(null);
        } else {
          setError("Failed to load project data");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Error loading project data");
      } finally {
        setLoading(false);
      }
    };
    
    // Add a small delay to ensure the component is mounted and URL is available
    const timer = setTimeout(() => {
      fetchProject();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsViewDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const viewOptions = [
    { icon: BarChart3, label: 'Chart View', value: 'chart' },
    { icon: Grid3X3, label: 'Card View', value: 'card' },
    { icon: Table, label: 'Table View', value: 'table' }
  ];

  const handleViewSelect = (option) => {
    console.log('Selected view:', option.value);
    setIsViewDropdownOpen(false);
  };

  // Debug: Log the current state
  console.log("Navbar state:", { loading, error, projectData });

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-blue-100 px-4 py-3"
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Coffee Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCoffee className="w-8 h-8 text-blue-900" />
          </motion.div>

          {/* Project Name */}
          <div className="hidden sm:block">
            {loading ? (
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            ) : error ? (
              <div className="text-red-500 text-sm">Error loading project</div>
            ) : projectData ? (
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-gray-800 truncate max-w-xs"
              >
                {projectData.projectName || "Unnamed Project"}
              </motion.h1>
            ) : (
              <div className="text-gray-500">No project data</div>
            )}
          </div>
        </div>

        {/* Center Section - Search Bar */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-sm transition-shadow duration-200"
            />
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-2">
          
          {/* View Options Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-white border border-blue-100 rounded-lg hover:shadow-md transition-shadow duration-200 text-gray-700"
            >
              <span className="hidden sm:inline text-sm font-medium">View Options</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isViewDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            <AnimatePresence>
              {isViewDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                >
                  {viewOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      onClick={() => handleViewSelect(option)}
                      className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:text-blue-600 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <option.icon className="w-4 h-4 mr-2" />
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Kanban Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <Trello className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Kanban</span>
          </motion.button>

          {/* Add Work Button */}
          <motion.button
          onClick={() => setIsWorkModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Add Work</span>
          </motion.button>

          {/* Filter Button */}
          <motion.button
          onClick={toggleFilter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white border border-blue-100 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <Filter
            className="w-4 h-4 text-gray-600" />
          </motion.button>

          {/* Settings Button */}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white border border-blue-100 rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <Settings className="w-4 h-4 text-gray-600" />
          </motion.button>

          {/* Profile Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white border border-blue-100 rounded-full hover:shadow-md transition-shadow duration-200"
          >
            <User className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
      </div>


      <FilterSidebar
       isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />
      <AddWorkModal
      isOpen={isWorkModalOpen} 
        onClose={() => setIsWorkModalOpen(false)} 
      />

      {/* Mobile Project Name */}
      <div className="sm:hidden mt-2">
        {loading ? (
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
        ) : error ? (
          <div className="text-red-500 text-sm">Error loading project</div>
        ) : projectData ? (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-gray-800 truncate"
          >
            {projectData.projectName || "Unnamed Project"}
          </motion.h1>
        ) : (
          <div className="text-gray-500 text-sm">No project data</div>
        )}
      </div>
    </motion.nav>
  );
};

export default ProjectNavbar;