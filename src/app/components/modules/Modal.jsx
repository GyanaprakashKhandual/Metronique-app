'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Filter, Calendar, Clock, Tag, Link, FileText, Search, ChevronDown, Check, ChevronRight } from 'lucide-react'

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
  )
}

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
                  <CustomDropdown
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
                  <CustomDropdown
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
                  <CustomDropdown
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
                  <CustomDropdown
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
                  <CustomDropdown
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


export default FilterSidebar