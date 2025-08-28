"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus,
  FolderOpen,
  User,
  LogOut,
  Mail,
  ChevronDown,
  ChevronUp,
  Settings
} from "lucide-react";
import { ThreeDotsDropdown } from "../assets/Dropdown";
import ProjectModal from "../assets/Modal";
import { FaCoffee } from "react-icons/fa";
import { CalfFolder, CalfFolderOpen } from "../utils/Icon";

const Sidebar = () => {
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
      setProjects(res.data.data || []);
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
                            label: "Configure",
                            icon: <svg
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <circle cx="12" cy="12" r="3" />
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .7.4 1.31 1 1.51.62.22 1.31.09 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.42.51-.55 1.2-.33 1.82.2.6.81 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.7 0-1.31.4-1.51 1z" />
                            </svg>

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
          <ProjectModal
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

export default Sidebar;