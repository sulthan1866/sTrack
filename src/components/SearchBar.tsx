import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onFilterToggle?: () => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onFilterToggle, 
  placeholder = "Search", 
  className = "" 
}) => {
  const [term, setTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (value: string) => {
    setTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setTerm('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`relative flex items-center bg-white border-2 rounded-lg transition-all duration-300 
        ${isFocused ? 'border-blue-500 shadow-md' : 'border-gray-300'}
        ${className}`}
    >
      {/* Search Icon */}
      <motion.div 
        className="absolute left-3 text-gray-500"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Search className="h-5 w-5" />
      </motion.div>

      {/* Search Input */}
      <input
        ref={inputRef}
        className="w-full pl-10 pr-16 py-2 outline-none bg-transparent text-gray-700"
        placeholder={placeholder}
        value={term}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Clear Search Button */}
      <AnimatePresence>
        {term && (
          <motion.button
            key="clear-btn"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            onClick={clearSearch}
            className="absolute right-12 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Filter Toggle Button */}
      {onFilterToggle && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onFilterToggle}
          className="absolute right-3 text-gray-500 hover:text-blue-600"
        >
          <Filter className="h-5 w-5" />
        </motion.button>
      )}
    </div>
  );
};

export default SearchBar;