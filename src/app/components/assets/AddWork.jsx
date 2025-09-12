'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiClock, FiLink, FiTag, FiPlus, FiCalendar } from 'react-icons/fi';
import { Dropdown } from './Dropdown';

const WorkModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    workType: '',
    workDesc: '',
    startDate: '',
    endDate: '',
    status: 'TODO',
    priority: 'Medium',
    tags: [],
    workLink: [''],
    timeLogs: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        workType: '',
        workDesc: '',
        startDate: '',
        endDate: '',
        status: 'TODO',
        priority: 'Medium',
        tags: [],
        workLink: [''],
        timeLogs: []
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.workType.trim()) newErrors.workType = 'Work type is required';
    if (!formData.workDesc.trim()) newErrors.workDesc = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get projectId from URL
      const pathSegments = window.location.pathname.split('/');
      const projectId = pathSegments[pathSegments.length - 1];
      
      if (!projectId) throw new Error("Project ID not found in URL");
      
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found in localStorage");
      
      // Prepare data for API
      const submissionData = {
        ...formData,
        project: projectId,
        // Filter out empty links
        workLink: formData.workLink.filter(link => link.trim() !== '')
      };
      
      const response = await fetch(`http://localhost:5000/api/v1/work/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create work');
      }
      
      const result = await response.json();
      onSubmit(result);
      onClose();
    } catch (error) {
      console.error('Error creating work:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Add New Work</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.submit && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md">
                  {errors.submit}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Type *
                  </label>
                  <input
                    type="text"
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    placeholder="e.g., Design, Development, Testing"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                      errors.workType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.workType && (
                    <p className="mt-1 text-sm text-red-600">{errors.workType}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
<Dropdown
  options={[
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' }
  ]}
  placeholder="Select priority"
  value={formData.priority}
  onChange={(value) => handleDropdownChange('priority', value)}
  variant="default"
  size="md"
  className="w-full"
/>

                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="workDesc"
                  value={formData.workDesc}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe the work to be done..."
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                    errors.workDesc ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.workDesc && (
                  <p className="mt-1 text-sm text-red-600">{errors.workDesc}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Dropdown
  options={[
    { label: 'TODO', value: 'TODO' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Removed', value: 'Removed' }
  ]}
  placeholder="Select status"
  value={formData.status}
  onChange={(value) => handleDropdownChange('status', value)}
  variant="default"
  size="md"
  className="w-full"
/>
</div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                    <FiTag className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Add tags (comma separated)"
                      className="flex-1 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const tag = e.target.value.trim();
                          if (tag && !formData.tags.includes(tag)) {
                            setFormData(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }));
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== index)
                              }));
                            }}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Links
                </label>
                <div className="space-y-2">
                  {formData.workLink.map((link, index) => (
                    <div key={index} className="flex items-center">
                      <div className="relative flex-1">
                        <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => handleLinkChange(index, e.target.value)}
                          placeholder="https://example.com"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>
                      {formData.workLink.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="ml-2 p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiX size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="mt-2 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiPlus size={16} className="mr-1" />
                  Add another link
                </button>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Work'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkModal;