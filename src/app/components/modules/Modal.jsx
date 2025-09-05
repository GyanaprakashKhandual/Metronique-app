'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Filter, Calendar, Clock, Tag, Link, FileText, Search, ChevronDown, Check } from 'lucide-react'

const CustomDropdown = ({ label, icon, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon && React.cloneElement(icon, { size: 16, className: "text-blue-600" })}
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || placeholder}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-gray-400" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
            >
              {options.map((option, index) => (
                <motion.button
                  key={option}
                  whileHover={{ backgroundColor: "#f1f5f9" }}
                  onClick={() => {
                    onChange(option)
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-sm transition-colors"
                >
                  <span>{option}</span>
                  {value === option && <Check size={14} className="text-blue-600" />}
                </motion.button>
              ))}
              {options.length > 0 && (
                <hr className="border-gray-100 my-1" />
              )}
              <motion.button
                whileHover={{ backgroundColor: "#f1f5f9" }}
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 text-sm text-gray-500 transition-colors"
              >
                Clear selection
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
            className="fixed left-0 top-0 w-80 bg-blue-50 shadow-xl z-50 min-h-screen max-h-screen overflow-hidden border-r border-blue-200"
            style={{ marginTop: '60px' }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Filter size={18} className="text-blue-600" />
                  Advanced Filters
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#dbeafe" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-gray-600" />
                </motion.button>
              </div>

              {/* Filters Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
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
                      placeholder="Search work type..."
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                    />
                  </div>

                  {/* Status */}
                  <CustomDropdown
                    label="Status"
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    options={statusOptions}
                    placeholder="Select status"
                  />

                  {/* Priority */}
                  <CustomDropdown
                    label="Priority"
                    value={filters.priority}
                    onChange={(value) => handleFilterChange('priority', value)}
                    options={priorityOptions}
                    placeholder="Select priority"
                  />

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
                      <div className="flex flex-wrap gap-2 mt-2 max-h-20 overflow-y-auto">
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

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="date"
                          value={filters.startDate}
                          onChange={(e) => handleFilterChange('startDate', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          value={filters.endDate}
                          onChange={(e) => handleFilterChange('endDate', e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Time */}
                  <CustomDropdown
                    label="Total Time"
                    icon={<Clock />}
                    value={filters.totalTimeRange}
                    onChange={(value) => handleFilterChange('totalTimeRange', value)}
                    options={timeRangeOptions}
                    placeholder="Select time range"
                  />

                  {/* Work Link and Files Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <CustomDropdown
                      label="Work Link"
                      icon={<Link />}
                      value={filters.hasLink}
                      onChange={(value) => handleFilterChange('hasLink', value)}
                      options={linkOptions}
                      placeholder="Select link status"
                    />

                    <CustomDropdown
                      label="Files"
                      icon={<FileText />}
                      value={filters.hasFiles}
                      onChange={(value) => handleFilterChange('hasFiles', value)}
                      options={fileOptions}
                      placeholder="Select file status"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-blue-200 bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-4">
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
                    onClick={() => console.log('Apply filters:', filters)}
                  >
                    Apply Filters
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

export default FilterSidebar