'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Clock, FileText, Tag, Link as LinkIcon, Upload } from 'lucide-react';
import { Dropdown } from '../assets/Dropdown';
import axios from 'axios';

const AddWorkModal = ({ isOpen, onClose }) => {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    workType: '',
    workDesc: '',
    startDate: '',
    endDate: '',
    status: 'Pending',
    priority: 'Medium',
    tags: [],
    workLink: [''],
    workFiles: []
  });

  // Fetch project details when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProjectDetails();
    }
  }, [isOpen]);

  const fetchProjectDetails = async () => {
    try {
      const pathSegments = window.location.pathname.split('/');
      const projectId = pathSegments[pathSegments.length - 1];
      
      if (!projectId) throw new Error("Project ID not found in URL");
      
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found in localStorage");
      
      const response = await axios.get(
        `http://localhost:5000/api/v1/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setProjectDetails(response.data);
    } catch (error) {
      console.error("Error fetching project details:", error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      workLink: [...prev.workLink, '']
    }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.workLink];
    newLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      workLink: newLinks
    }));
  };

  const handleRemoveLink = (index) => {
    const newLinks = formData.workLink.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      workLink: newLinks
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these files to a server
    // and then store the file URLs in the formData
    const newFiles = files.map(file => ({
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date()
    }));
    
    setFormData(prev => ({
      ...prev,
      workFiles: [...prev.workFiles, ...newFiles]
    }));
  };

  const handleRemoveFile = (index) => {
    const newFiles = formData.workFiles.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      workFiles: newFiles
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const pathSegments = window.location.pathname.split('/');
      const projectId = pathSegments[pathSegments.length - 1];
      
      const response = await axios.post(
        `http://localhost:5000/api/v1/work/${projectId}`,
        {
          ...formData,
          project: projectId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Reset form and close modal on success
      setFormData({
        workType: '',
        workDesc: '',
        startDate: '',
        endDate: '',
        status: 'Pending',
        priority: 'Medium',
        tags: [],
        workLink: [''],
        workFiles: []
      });
      
      onClose();
      // You might want to add a success notification here
    } catch (error) {
      console.error("Error creating work:", error);
      // You might want to add an error notification here
    } finally {
      setLoading(false);
    }
  };

  // Dropdown options
  const workTypeOptions = [
    { value: 'Design', label: 'Design' },
    { value: 'Development', label: 'Development' },
    { value: 'Testing', label: 'Testing' },
    { value: 'Documentation', label: 'Documentation' },
    { value: 'Research', label: 'Research' },
    { value: 'Meeting', label: 'Meeting' },
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'On Hold', label: 'On Hold' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ];

  const tagOptions = [
    { value: 'UI', label: 'UI' },
    { value: 'Backend', label: 'Backend' },
    { value: 'Frontend', label: 'Frontend' },
    { value: 'Database', label: 'Database' },
    { value: 'API', label: 'API' },
    { value: 'Bug', label: 'Bug' },
    { value: 'Feature', label: 'Feature' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={onClose}
          />
          
          {/* Sidebar Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed top-[66px] right-0 h-[calc(100vh-66px)] w-full max-w-md bg-white dark:bg-gray-800 border-l border-blue-100 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Add New Work
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Project Info */}
              {projectDetails && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200">
                    {projectDetails.name}
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    {projectDetails.description}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Work Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Work Type
                  </label>
                  <Dropdown
                    options={workTypeOptions}
                    placeholder="Select work type"
                    value={formData.workType}
                    onChange={(value) => handleDropdownChange('workType', value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="workDesc"
                    value={formData.workDesc}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <Dropdown
                      options={statusOptions}
                      placeholder="Select status"
                      value={formData.status}
                      onChange={(value) => handleDropdownChange('status', value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <Dropdown
                      options={priorityOptions}
                      placeholder="Select priority"
                      value={formData.priority}
                      onChange={(value) => handleDropdownChange('priority', value)}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <Dropdown
                    options={tagOptions}
                    placeholder="Select tags"
                    value={formData.tags}
                    onChange={(value) => handleDropdownChange('tags', value)}
                    multiple={true}
                  />
                </div>

                {/* Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Links
                  </label>
                  <div className="space-y-2">
                    {formData.workLink.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="url"
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)}
                            placeholder="https://example.com"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                          <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                        {formData.workLink.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add another link
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attachments
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOC, DOCX, PNG, JPG (MAX. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>

                  {/* File List */}
                  {formData.workFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.workFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">
                              {file.fileName}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating...' : 'Create Work'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export {AddWorkModal};