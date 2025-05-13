import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Check, ChevronDown, X } from 'lucide-react';

interface Props {
  courses?: string[];
  onFilter: (course: string) => void;
  placeholder?: string;
  className?: string;
}

const FilterBar: React.FC<Props> = ({ 
  courses = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Biology',
  'Chemistry',
  'Engineering',
  'Economics',
  'Psychology',
  'Art History',
  'Literature'
], 
  onFilter, 
  placeholder = "Filter Course",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered courses based on query
  const filteredCourses = query === '' 
    ? courses 
    : courses.filter(course => 
        course.toLowerCase().includes(query.toLowerCase())
      );

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFilterChange = (course: string) => {
    setSelectedCourse(course);
    setIsOpen(false);
    onFilter(course);
  };

  const clearSelection = () => {
    setSelectedCourse(null);
    setQuery('');
    onFilter('');
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full max-w-xs ${className}`}
    >
      {/* Input Container */}
      <motion.div 
        className="relative"
        initial={false}
        animate={{ 
          borderColor: isOpen ? '#3b82f6' : '#d1d5db',
          boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none'
        }}
      >
        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={selectedCourse || query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedCourse(null);
          }}
          onClick={() => setIsOpen(true)}
          className="w-full pl-10 pr-16 py-2 border-2 rounded-lg 
            outline-none bg-white"
        />

        {/* Filter Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Filter className="h-5 w-5 text-gray-400" />
        </div>

        {/* Clear and Dropdown Icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
          {(selectedCourse || query) && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={clearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronDown 
              className={`h-5 w-5 transition-transform duration-200 
                ${isOpen ? 'rotate-180' : ''}`} 
            />
          </motion.button>
        </div>
      </motion.div>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white border-2 border-gray-200 
              rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredCourses.length === 0 ? (
              <div className="py-2 px-4 text-gray-500 text-center">
                No courses found
              </div>
            ) : (
              filteredCourses.map((course) => (
                <motion.div
                  key={course}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFilterChange(course)}
                  className={`
                    px-4 py-2 cursor-pointer flex justify-between items-center
                    ${selectedCourse === course ? 'bg-blue-50 text-blue-800' : 'hover:bg-gray-100'}
                  `}
                >
                  <span>{course}</span>
                  {selectedCourse === course && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;