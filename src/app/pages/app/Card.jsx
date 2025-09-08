'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiChevronDown, FiExternalLink, FiFile, FiClock, FiCalendar } from 'react-icons/fi';
import { ArrowDownGoogle } from '@/app/components/utils/Icon';

const WorkCardView = () => {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);

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

    useEffect(() => {
        fetchWorks();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO':
                return 'bg-gray-200 text-gray-800';
            case 'In Progress':
                return 'bg-blue-200 text-blue-800';
            case 'Completed':
                return 'bg-green-200 text-green-800';
            case 'On Hold':
                return 'bg-yellow-200 text-yellow-800';
            case 'Removed':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const statusOptions = ["TODO", "In Progress", "Completed", "On Hold", "Removed"];

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
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-full mx-auto">

                {works.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No works found for this project.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {works.map((work, index) => (
                            <motion.div
                                key={work._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Card Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {work.workType}
                                        </h3>
                                        <button
                                            onClick={() => deleteWork(work._id)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>

                                    <p className="text-gray-600 mb-4">{work.workDesc}</p>

                                    {/* Status Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === work._id ? null : work._id)}
                                            className={`flex items-center justify-between w-full px-3 py-2 rounded-md ${getStatusColor(work.status)} text-sm font-medium`}
                                        >
                                            <span>{work.status}</span>
                                            <ArrowDownGoogle size={16} />
                                        </button>

                                        {activeDropdown === work._id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                                            >
                                                {statusOptions.map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => {
                                                            updateWorkStatus(work._id, status);
                                                            setActiveDropdown(null);
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${getStatusColor(status)}`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    {/* Tags */}
                                    {work.tags && work.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {work.tags.map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FiCalendar className="mr-2" />
                                            <span>{new Date(work.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FiClock className="mr-2" />
                                            <span>{new Date(work.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Priority */}
                                    <div className="mb-4">
                                        <span className="text-sm font-medium text-gray-700">Priority: </span>
                                        <span className={`text-sm ${work.priority === 'High' ? 'text-red-600' :
                                            work.priority === 'Medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                            {work.priority}
                                        </span>
                                    </div>

                                    {/* Links */}
                                    {work.workLink && work.workLink.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Links:</h4>
                                            <div className="space-y-1">
                                                {work.workLink.map((link, linkIndex) => (
                                                    <a
                                                        key={linkIndex}
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        <FiExternalLink className="mr-1" size={14} />
                                                        {link}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Files */}
                                    {work.workFiles && work.workFiles.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Files:</h4>
                                            <div className="space-y-1">
                                                {work.workFiles.map((file, fileIndex) => (
                                                    <a
                                                        key={fileIndex}
                                                        href={file.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
                                                    >
                                                        <FiFile className="mr-1" size={14} />
                                                        {file.fileName}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export { WorkCardView };