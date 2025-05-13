import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentProfileModal from './StudentProfileModal';
import {type Student }from '../App'

interface Props {
  student: Student;
  onEdit: (updatedStudent:Student) => void;
  onDelete: (studentId:string) => void;
}

// Utility function to get initials
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

// Color generator based on student name
const generateColorFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const StudentCard: React.FC<Props> = ({ 
  student, 
  onEdit,
  onDelete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Placeholder image with initials
  const PlaceholderAvatar = () => {
    const initials = getInitials(student.name);
    const bgColor = generateColorFromName(student.name);

    return (
      <div 
        className="flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-bold"
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={() => setIsModalOpen(true)}
        className={`
          relative flex items-center p-4 bg-white dark:bg-gray-800 
          rounded-lg shadow-md cursor-pointer overflow-hidden group
          transition-all duration-300 hover:shadow-lg
        `}
      >
        {/* Profile Image or Initials */}
        <div className="mr-4">
          {student.profileImage ? (
            <img 
              src={student.profileImage} 
              alt={`${student.name}'s profile`} 
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <PlaceholderAvatar />
          )}
        </div>

        {/* Student Details */}
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {student.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {student.course}
          </p>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <StudentProfileModal 
            student={student} 
            onClose={() => setIsModalOpen(false)} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentCard;