"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Pause, 
  X,
  ExternalLink,
  Edit3,
  Trash2,
  Filter,
  Search
} from "lucide-react";


const statusConfig = {
  "TODO": { 
    color: "bg-slate-100 text-slate-700", 
    icon: Clock,
    borderColor: "border-slate-200",
    bgGradient: "from-slate-50 to-slate-100"
  },
  "In Progress": { 
    color: "bg-blue-100 text-blue-700", 
    icon: AlertCircle,
    borderColor: "border-blue-200",
    bgGradient: "from-blue-50 to-blue-100"
  },
  "Completed": { 
    color: "bg-green-100 text-green-700", 
    icon: CheckCircle2,
    borderColor: "border-green-200",
    bgGradient: "from-green-50 to-green-100"
  },
  "On Hold": { 
    color: "bg-yellow-100 text-yellow-700", 
    icon: Pause,
    borderColor: "border-yellow-200",
    bgGradient: "from-yellow-50 to-yellow-100"
  },
  "Removed": { 
    color: "bg-red-100 text-red-700", 
    icon: X,
    borderColor: "border-red-200",
    bgGradient: "from-red-50 to-red-100"
  }
};

const priorityConfig = {
  "High": "text-red-600 bg-red-50 border-red-200",
  "Medium": "text-orange-600 bg-orange-50 border-orange-200",
  "Low": "text-green-600 bg-green-50 border-green-200"
};

export default function ProjectWorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        // Extract projectId from URL
        const pathSegments = window.location.pathname.split("/");
        const projectId = pathSegments[pathSegments.length - 1];
        
        if (!projectId) throw new Error("Project ID not found in URL");

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found in localStorage");

        // API call using fetch
        const response = await fetch(
          `http://localhost:5000/api/v1/work/${projectId}`,
          {
            method: 'GET',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setWorks(data.works || []);
      } catch (err) {
        setError(err.message || "Failed to fetch works");
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // Filter works
  const filteredWorks = works.filter(work => {
    const matchesSearch = work.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         work.workDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !selectedPriority || work.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  // Group works by status
  const groupedWorks = filteredWorks.reduce((acc, work) => {
    if (!acc[work.status]) acc[work.status] = [];
    acc[work.status].push(work);
    return acc;
  }, {});

  const handleDragStart = (e, work) => {
    setDraggedItem(work);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      setWorks(prev => prev.map(work => 
        work._id === draggedItem._id 
          ? { ...work, status: newStatus }
          : work
      ));
    }
    setDraggedItem(null);
  };

  const getStatusCount = (status) => {
    return groupedWorks[status]?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-full mx-auto">

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {Object.entries(statusConfig).map(([status, config], index) => {
            const Icon = config.icon;
            const statusWorks = groupedWorks[status] || [];
            
            return (
              <motion.div
                key={status}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Column Header */}
                <div className={`bg-gradient-to-r ${config.bgGradient} p-4 border-b ${config.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-800">{status}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                      {getStatusCount(status)}
                    </span>
                  </div>
                </div>

                {/* Drop Zone */}
                <div
                  className="min-h-[500px] p-4 space-y-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  <AnimatePresence>
                    {statusWorks.map((work) => (
                      <motion.div
                        key={work._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, work)}
                        className="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-all duration-200 hover:border-blue-300"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.05, rotate: 2 }}
                      >
                        {/* Priority Badge */}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityConfig[work.priority]}`}>
                            {work.priority}
                          </span>
                          <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Edit3 className="w-3 h-3 text-gray-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Trash2 className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        {/* Work Title */}
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {work.workType}
                        </h4>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {work.workDesc}
                        </p>

                        {/* Tags */}
                        {work.tags && work.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {work.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {work.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{work.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Links */}
                        {work.workLink && work.workLink.length > 0 && (
                          <div className="mb-3">
                            <a
                              href={work.workLink[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View Link
                            </a>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{work.assignee || 'Unassigned'}</span>
                          </div>
                          {work.dueDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(work.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}