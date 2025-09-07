'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiChevronDown, FiExternalLink, FiFile, FiCalendar, FiClock, FiAlertCircle, FiCheckCircle, FiPauseCircle, FiXCircle, FiEdit3 } from 'react-icons/fi';

const WorkTableComponent = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const fetchWorks = async () => {
    try {
      setLoading(true);
      setError('');
      
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

  const deleteWork = async (workId) => {
    if (!confirm('Are you sure you want to delete this work item?')) return;
    
    try {
      const token = localStorage.getItem("token");
      const pathSegments = window.location.pathname.split("/");
      const projectId = pathSegments[pathSegments.length - 1];

      const response = await fetch(
        `http://localhost:5000/api/v1/work/${projectId}/${workId}`,
        {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove the deleted work from state
      setWorks(works.filter(work => work._id !== workId));
    } catch (err) {
      setError(err.message || "Failed to delete work");
    }
  };

  const updateWorkStatus = async (workId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const pathSegments = window.location.pathname.split("/");
      const projectId = pathSegments[pathSegments.length - 1];

      const response = await fetch(
        `http://localhost:5000/api/v1/work/${projectId}/${workId}`,
        {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the work status in state
      setWorks(works.map(work => 
        work._id === workId ? { ...work, status: newStatus } : work
      ));
    } catch (err) {
      setError(err.message || "Failed to update work status");
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedWorks = [...works].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'TODO':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'In Progress':
        return <FiEdit3 className="text-blue-500" />;
      case 'Completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'On Hold':
        return <FiPauseCircle className="text-orange-500" />;
      case 'Removed':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiAlertCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800';
      case 'Removed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = ["TODO", "In Progress", "Completed", "On Hold", "Removed"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 bg-red-100 p-4 rounded-lg">
          Error: {error}
          <button 
            onClick={fetchWorks}
            className="ml-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Project Works</h1>
          <div className="flex space-x-3">
            <button
              onClick={fetchWorks}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiClock className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {works.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No works found for this project.</p>
            <button 
              onClick={fetchWorks}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('_id')}
                    >
                      #
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('workType')}
                    >
                      Work Type
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Description
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('startDate')}
                    >
                      Time
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    >
                      Links & Files
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('priority')}
                    >
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedWorks.map((work, index) => (
                    <motion.tr 
                      key={work._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {work.workType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="line-clamp-2" title={work.workDesc}>
                          {work.workDesc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1 text-gray-400" size={14} />
                            <span>{formatDate(work.startDate)}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <FiClock className="mr-1 text-gray-400" size={14} />
                            <span>{formatTime(work.startDate)} - {formatTime(work.endDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-2">
                          {work.workLink && work.workLink.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title={link}
                            >
                              <FiExternalLink size={16} />
                            </a>
                          ))}
                          {work.workFiles && work.workFiles.map((file, fileIndex) => (
                            <a
                              key={fileIndex}
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
                              title={file.fileName}
                            >
                              <FiFile size={16} />
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === work._id ? null : work._id)}
                            className={`inline-flex items-center justify-between px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}
                          >
                            <span className="flex items-center">
                              {getStatusIcon(work.status)}
                              <span className="ml-1">{work.status}</span>
                            </span>
                            <FiChevronDown size={14} className="ml-1" />
                          </button>
                          
                          <AnimatePresence>
                            {activeDropdown === work._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                              >
                                {statusOptions.map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => {
                                      updateWorkStatus(work._id, status);
                                      setActiveDropdown(null);
                                    }}
                                    className={`flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${getStatusColor(status)}`}
                                  >
                                    {getStatusIcon(status)}
                                    <span className="ml-2">{status}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          work.priority === 'High' ? 'bg-red-100 text-red-800' :
                          work.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {work.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteWork(work._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete work item"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkTableComponent;