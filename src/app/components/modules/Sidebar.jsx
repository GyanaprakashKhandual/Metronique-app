"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, User, LogOut, Mail, ChevronUp, X, Filter, Calendar, Clock, Tag, Link, FileText, Search, ChevronRight, } from "lucide-react";
import { FiSearch, FiClipboard, FiClock } from 'react-icons/fi';
import { getProjectDetails } from "@/app/script/GetProjectS";
import { FilterDropdown, ThreeDotsDropdown } from "../assets/Dropdown";
import { FaCoffee } from "react-icons/fa";
import { CalfFolder } from "../utils/Icon";
import { AddProjectModal } from "../assets/Modal";


const ProjectSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" or "create"
  const [token, setToken] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Full API Response:", res.data);

      // Sometimes API sends { user: {...} } or just {...}
      const user = res.data?.data || res.data?.user || res.data;

      setUserData(user);

      if (user) {
        console.log("User Email:", user.email || "Not provided");
        console.log("User Name:", user.name || "Not provided");
      } else {
        console.warn("No user data found in response");
      }

    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };


  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchProjects = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/v1/project/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API response:", res.data);
      // FIX: The API returns projects in res.data.projects, not res.data.data
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error("Error fetching projects", err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/auth/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error during logout", err);
    } finally {
      localStorage.removeItem("token");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };

  const handleModalSuccess = () => {
    fetchProjects(); // Refresh the projects list
    setModalOpen(false);
  };

  const sidebarVariants = {
    open: {
      width: 280,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    closed: {
      width: 64,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.1
      }
    }
  };

  const projectItemVariants = {
    hover: {
      backgroundColor: "#f8fafc",
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <>
      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800 flex flex-col border-r border-slate-200/50 relative overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center p-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="open-header"
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center">
                  <FaCoffee className="text-blue-900 w-7 h-7 mr-4" />
                  <h2 className="font-semibold text-xl text-slate-700 tracking-tight">
                    Projects
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#f1f5f9" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-full text-slate-500 hover:text-slate-700 transition-all duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 7l-5 5 5 5V7z" />
                  </svg>
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="closed-header"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, backgroundColor: "#f1f5f9" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-slate-500 hover:text-slate-700 transition-all duration-200"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 7l5 5-5 5V7z" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Create Project Button */}
        <div className="p-4 border-b border-slate-200/60">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.button
                key="create-full"
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
                whileHover={{ backgroundColor: "#3b82f6" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setModalType("create");
                  setModalOpen(true);
                }}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-xl"
              >
                <Plus size={18} />
                Create Project
              </motion.button>
            ) : (
              <motion.button
                key="create-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "#3b82f6",
                  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)"
                }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setModalType("create");
                  setModalOpen(true);
                }}
                className="w-full h-12 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center shadow-sm"
              >
                <Plus size={20} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setHoveredProject(project._id)}
                onHoverEnd={() => setHoveredProject(null)}
                className="mx-2 my-1 rounded-xl border border-transparent hover:border-slate-200/60 transition-all duration-200"
              >
                {isOpen ? (
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <motion.div
                        className="flex-shrink-0"
                      >
                        <CalfFolder size={18} className="text-blue-500" />
                      </motion.div>
                      <span className="font-medium text-slate-700 truncate">
                        {project.projectName}
                      </span>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: hoveredProject === project._id ? 1 : 0.7,
                        scale: hoveredProject === project._id ? 1 : 0.8
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ThreeDotsDropdown
                        options={[
                          {
                            label: "Edit",
                            icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>,
                            onClick: () => {
                              setSelectedProject(project);
                              setModalType("edit");
                              setModalOpen(true);
                            },
                          },
                          {
                            label: "Workspace",
                            icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" /></svg>,
                            onClick: () => router.push(`/app/projects/${project._id}`),
                          },
                          {
                            label: "Delete",
                            icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>,
                            onClick: () => deleteProject(project._id),
                            danger: true
                          }
                        ]}
                      />
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <motion.div
                      whileHover={{
                        color: "#3b82f6"
                      }}
                      className="cursor-pointer"
                      data-tooltip={project.projectName}
                      data-position="top"
                    >
                      <CalfFolder size={20} className="text-slate-500" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Profile Footer */}
        <div className="mt-auto border-t border-slate-200/60 bg-white/80 backdrop-blur-sm sticky bottom-0">
          <AnimatePresence>
            {profileDropdownOpen && isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-0 right-0 mx-2 mb-1 bg-white rounded-lg shadow-lg border border-slate-200/60 overflow-hidden z-10"
              >
                <div className="p-4 border-b border-slate-200/50">
                  <div className="font-medium text-slate-800 truncate">{userData?.name || "User"}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <Mail size={14} />
                    <span className="truncate">{userData?.email || "user@example.com"}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full p-4 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors duration-150"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-100/50 transition-colors duration-150"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              {isOpen && (
                <div className="text-left truncate max-w-[140px]">
                  <div className="text-sm font-medium text-slate-800 truncate">
                    {userData?.name || "User"}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {userData?.email || "user@example.com"}
                  </div>
                </div>
              )}
            </div>

            {isOpen && (
              <motion.div
                animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp size={16} className="text-slate-500" />
              </motion.div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {modalOpen && (
          <AddProjectModal
            type={modalType}
            project={selectedProject}
            token={token}
            onClose={() => setModalOpen(false)}
            onSuccess={handleModalSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
};




const FilterSection = ({ title, icon, children, isExpanded, onToggle, hasValue = false }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <motion.button
        whileHover={{ backgroundColor: "#f8fafc" }}
        onClick={onToggle}
        className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${hasValue ? 'bg-blue-50' : ''}`}
      >
        <div className="flex items-center gap-3">
          {icon && React.cloneElement(icon, {
            size: 16,
            className: `${hasValue ? 'text-blue-600' : 'text-gray-500'}`
          })}
          <span className={`font-medium ${hasValue ? 'text-blue-700' : 'text-gray-700'}`}>
            {title}
          </span>
          {hasValue && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} className="text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 bg-gray-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FilterSidebar = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    workType: '',
    status: '',
    priority: '',
    tags: [],
    startDate: '',
    endDate: '',
    totalTimeRange: '',
    hasLink: '',
    hasFiles: '',
    newTag: ''
  })

  const [expandedSections, setExpandedSections] = useState({
    workType: false,
    status: false,
    priority: false,
    tags: false,
    dateRange: false,
    totalTime: false,
    workLink: false,
    files: false
  })

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'On Hold']
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical']
  const timeRangeOptions = [
    'Less than 1 hour',
    '1-4 hours',
    '4-8 hours',
    '8+ hours'
  ]
  const linkOptions = ['Has link', 'No link']
  const fileOptions = ['Has attachments', 'No attachments']

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const addTag = () => {
    if (filters.newTag.trim() && !filters.tags.includes(filters.newTag.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }))
    }
  }

  const removeTag = (tagToRemove) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const clearFilters = () => {
    setFilters({
      workType: '',
      status: '',
      priority: '',
      tags: [],
      startDate: '',
      endDate: '',
      totalTimeRange: '',
      hasLink: '',
      hasFiles: '',
      newTag: ''
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.workType) count++
    if (filters.status) count++
    if (filters.priority) count++
    if (filters.tags.length > 0) count++
    if (filters.startDate || filters.endDate) count++
    if (filters.totalTimeRange) count++
    if (filters.hasLink) count++
    if (filters.hasFiles) count++
    return count
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-0 top-0 w-80 mt-[66px] bg-white z-50 min-h-screen max-h-screen overflow-hidden border-l border-gray-300"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-3">
                  <Filter size={20} />
                  <div>
                    <h2 className="font-semibold text-lg">Filters</h2>
                    {getActiveFiltersCount() > 0 && (
                      <p className="text-xs text-blue-100">
                        {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
                      </p>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto relative">
                {/* Work Type */}
                <FilterSection
                  title="Work Type"
                  icon={<Search />}
                  isExpanded={expandedSections.workType}
                  onToggle={() => toggleSection('workType')}
                  hasValue={!!filters.workType}
                >
                  <input
                    type="text"
                    value={filters.workType}
                    onChange={(e) => handleFilterChange('workType', e.target.value)}
                    placeholder="Search work type..."
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                  />
                </FilterSection>

                {/* Status */}
                <FilterSection
                  title="Status"
                  icon={<div className="w-4 h-4 rounded bg-green-500" />}
                  isExpanded={expandedSections.status}
                  onToggle={() => toggleSection('status')}
                  hasValue={!!filters.status}
                >
                  <FilterDropdown
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    options={statusOptions}
                    placeholder="Select status"
                  />
                </FilterSection>

                {/* Priority */}
                <FilterSection
                  title="Priority"
                  icon={<div className="w-4 h-4 rounded bg-red-500" />}
                  isExpanded={expandedSections.priority}
                  onToggle={() => toggleSection('priority')}
                  hasValue={!!filters.priority}
                >
                  <FilterDropdown
                    value={filters.priority}
                    onChange={(value) => handleFilterChange('priority', value)}
                    options={priorityOptions}
                    placeholder="Select priority"
                  />
                </FilterSection>

                {/* Tags */}
                <FilterSection
                  title="Tags"
                  icon={<Tag />}
                  isExpanded={expandedSections.tags}
                  onToggle={() => toggleSection('tags')}
                  hasValue={filters.tags.length > 0}
                >
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={filters.newTag}
                        onChange={(e) => handleFilterChange('newTag', e.target.value)}
                        placeholder="Add new tag..."
                        className="flex-1 px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addTag}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Add
                      </motion.button>
                    </div>
                    {filters.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                        {filters.tags.map(tag => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </FilterSection>

                {/* Date Range */}
                <FilterSection
                  title="Date Range"
                  icon={<Calendar />}
                  isExpanded={expandedSections.dateRange}
                  onToggle={() => toggleSection('dateRange')}
                  hasValue={!!filters.startDate || !!filters.endDate}
                >
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">End Date</label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                      />
                    </div>
                  </div>
                </FilterSection>

                {/* Total Time */}
                <FilterSection
                  title="Total Time"
                  icon={<Clock />}
                  isExpanded={expandedSections.totalTime}
                  onToggle={() => toggleSection('totalTime')}
                  hasValue={!!filters.totalTimeRange}
                >
                  <FilterDropdown
                    value={filters.totalTimeRange}
                    onChange={(value) => handleFilterChange('totalTimeRange', value)}
                    options={timeRangeOptions}
                    placeholder="Select time range"
                  />
                </FilterSection>

                {/* Work Link */}
                <FilterSection
                  title="Work Link"
                  icon={<Link />}
                  isExpanded={expandedSections.workLink}
                  onToggle={() => toggleSection('workLink')}
                  hasValue={!!filters.hasLink}
                >
                  <FilterDropdown
                    value={filters.hasLink}
                    onChange={(value) => handleFilterChange('hasLink', value)}
                    options={linkOptions}
                    placeholder="Select link status"
                  />
                </FilterSection>

                {/* Files */}
                <FilterSection
                  title="Files"
                  icon={<FileText />}
                  isExpanded={expandedSections.files}
                  onToggle={() => toggleSection('files')}
                  hasValue={!!filters.hasFiles}
                >
                  <FilterDropdown
                    value={filters.hasFiles}
                    onChange={(value) => handleFilterChange('hasFiles', value)}
                    options={fileOptions}
                    placeholder="Select file status"
                  />
                </FilterSection>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                    onClick={() => console.log('Apply filters:', filters)}
                  >
                    Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    className="w-full py-2.5 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-300"
                  >
                    Clear All
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


const SubWorkSidebar = () => {
  // Retrieve token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [project, setProject] = useState(null);
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      const details = await getProjectDetails();
      if (details) {
        setProject(details);
      }
    };

    fetchProject();
  }, []);

  // Fetch works based on project ID
  useEffect(() => {
    const fetchWorks = async () => {
      if (project?.project?._id) {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:5000/api/v1/work/${project.project._id}`, {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          const worksArray = Array.isArray(data.works) ? data.works : [];
          setWorks(worksArray);
          setFilteredWorks(worksArray);
        } catch (error) {
          console.error('Error fetching works:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWorks();
  }, [project]);

  // Filter works based on search term
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredWorks(works);
    } else {
      const filtered = works.filter(work => 
        work.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.workDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.priority.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWorks(filtered);
    }
  }, [searchTerm, works]);

  // Handle work item selection
  const handleWorkItemClick = (workId) => {
    setSelectedWorkId(workId);
    // You can add additional logic here for what happens when a work item is selected
    console.log('Selected work ID:', workId);
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Project Header */}
      <div className="p-5 border-b border-gray-200">
        <motion.h2 
          className="text-xl font-semibold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {project?.project?.projectName || 'Project'}
        </motion.h2>
        
        {/* Search Bar */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search works..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
      </div>

      {/* Works List */}
      <div className="flex-1 overflow-y-auto p-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {searchTerm ? 'No matching works found' : 'No works available'}
          </div>
        ) : (
          <AnimatePresence>
            {Array.isArray(filteredWorks) && filteredWorks.map((work, index) => (
              <motion.div
                key={work._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`mb-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedWorkId === work._id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleWorkItemClick(work._id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <FiClipboard className="mr-2 text-blue-500" />
                    {work.workType}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(work.priority)}`}>
                    {work.priority}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{work.workDesc}</p>
                
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(work.status)}`}>
                    {work.status}
                  </span>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <FiClock className="mr-1" />
                    {new Date(work.startDate).toLocaleDateString()} - {new Date(work.endDate).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}


export { ProjectSidebar, FilterSidebar, SubWorkSidebar };