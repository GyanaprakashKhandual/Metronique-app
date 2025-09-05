'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Filter, Calendar, Clock, Tag, Link, FileText, Search } from 'lucide-react'

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

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'On Hold']
  const priorityOptions = ['Low', 'Medium', 'High', 'Critical']
  const timeRangeOptions = [
    'Less than 1 hour',
    '1-4 hours', 
    '4-8 hours',
    '8+ hours'
  ]

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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
            className="fixed left-0 top-0 w-80 bg-white shadow-2xl z-50 min-h-screen max-h-screen overflow-hidden"
            style={{ marginTop: '60px' }} // mt-15 equivalent
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Filter size={20} className="text-blue-600" />
                  Filters
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Work Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Search size={16} className="text-blue-600" />
                    Work Type
                  </label>
                  <input
                    type="text"
                    value={filters.workType}
                    onChange={(e) => handleFilterChange('workType', e.target.value)}
                    placeholder="Enter work type..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Priorities</option>
                    {priorityOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag size={16} className="text-blue-600" />
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={filters.newTag}
                      onChange={(e) => handleFilterChange('newTag', e.target.value)}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTag}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.tags.map(tag => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Start Date</label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">End Date</label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    Total Time
                  </label>
                  <select
                    value={filters.totalTimeRange}
                    onChange={(e) => handleFilterChange('totalTimeRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Any duration</option>
                    {timeRangeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Has Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Link size={16} className="text-blue-600" />
                    Work Link
                  </label>
                  <select
                    value={filters.hasLink}
                    onChange={(e) => handleFilterChange('hasLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All</option>
                    <option value="true">Has link</option>
                    <option value="false">No link</option>
                  </select>
                </div>

                {/* Has Files */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    Files
                  </label>
                  <select
                    value={filters.hasFiles}
                    onChange={(e) => handleFilterChange('hasFiles', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All</option>
                    <option value="true">Has attachments</option>
                    <option value="false">No attachments</option>
                  </select>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-blue-100 p-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  onClick={() => console.log('Apply filters:', filters)}
                >
                  Apply Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Clear All
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FilterSidebar