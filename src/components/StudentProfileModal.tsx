import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, User, Mail, Book, Calendar, Edit, Trash2, Lock } from 'lucide-react';

import { type Student } from '../App';
import { AVAILABLE_COURSES } from '../services/studentService';
import { toast } from 'react-toastify';

interface Props {
  student: Student;
  onClose: () => void;
  onEdit: (updatedStudent: Student) => void;
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

const StudentProfileModal: React.FC<Props> = ({ 
  student, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student>({ ...student });
  // Placeholder image with initials
  const PlaceholderAvatar = () => {
    const initials = getInitials(student.name);
    const bgColor = generateColorFromName(student.name);

    return (
      <div 
        className="flex items-center justify-center w-24 h-24 rounded-full text-white text-4xl font-bold mx-auto mb-4"
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
    );
  };

    // Validate inputs
    const validateForm = () => {
      if (!editedStudent.name.trim()) {
        toast.error('Name is required');
        return false;
      }
  
      if (!editedStudent.email.trim()) {
        toast.error('Email is required');
        return false;
      }
  
      if (!/\S+@\S+\.\S+/.test(editedStudent.email)) {
        toast.error('Invalid email format');
        return false;
      }
  
      if (!editedStudent.course) {
        toast.error('Please select a course');
        return false;
      }
  
      if (!editedStudent.age|| editedStudent.age < 16 || editedStudent.age > 100){
        toast.error('Please enter a valid age (16-100)');
        return false;
      }
  
      return true;
    };

  const handleEdit = () => {
      setIsEditing(true)
  };

  const handleDelete = (studentId:string) => {
      onDelete(studentId);
      onClose();
    
  };

  const handleSaveEdit = () => {
    if(!validateForm()) return;
    onEdit(editedStudent);
    setIsEditing(false);
  };

  // Render password confirmation for edit/delete
  if (isDeleting) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
            {'Delete Student'}
          </h2>
<div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {student.name}
            </label>
           
          </div>
          <div className="flex space-x-4">
            <button
              onClick={!isDeleting ? handleEdit :()=> handleDelete(student.id)}
              className={'flex-1 px-4 py-2 rounded-lg transition-colors bg-red-500 text-white hover:bg-red-600'}
            >
              {'Delete'}
              
            </button>
            <button
              onClick={() => {
                setIsDeleting(false);
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }


  // Render editing view
  if (isEditing) {
    return (
      
        
          
          <AnimatePresence>
        {(
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
                Edit Student Profile
              </h2>

              {/* Name Input */}
              <div className="mb-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editedStudent.name}
                    onChange={(e) => setEditedStudent({ ...editedStudent, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={editedStudent.email}
                    onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
                  />
                </div>
              </div>

              {/* Course Selection */}
              <div className="mb-4">
                <div className="relative">
                  <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={editedStudent.course}
                    onChange={(e) => setEditedStudent({ ...editedStudent, course: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
                  >
                    <option value="">Select Course</option>
                    {AVAILABLE_COURSES.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age Input */}
              <div className="mb-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Age (16-100)"
                    value={editedStudent.age}
                    onChange={(e) => setEditedStudent({ ...editedStudent, age: Number(e.target.value) })}
                    min="16"
                    max="100"
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
                  />
                </div>
              </div>

              {/* Profile Image Input */}
              <div className="mb-6">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Profile Image URL (Optional)"
                    value={editedStudent.profileImage}
                    onChange={(e) => setEditedStudent({ ...editedStudent, profileImage: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-800"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Edit and Delete Buttons */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit()}
            className="text-gray-500 hover:text-blue-600"
          >
            <Edit className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDeleting(true)}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Profile Image or Initials */}
        {student.profileImage ? (
          <img 
            src={student.profileImage} 
            alt={`${student.name}'s profile`} 
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
        ) : (
          <PlaceholderAvatar />
        )}

        {/* Student Details */}
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
          {student.name}
        </h2>

        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{student.email}</span>
          </div>

          {/* Course */}
          <div className="flex items-center space-x-3">
            <Book className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{student.course}</span>
          </div>

          {/* Joined Date */}
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">
              Joined {new Date(student.joined).toLocaleDateString()}
            </span>
          </div>

          {/* Optional Age */}
          {student.age && (
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {student.age} years old
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentProfileModal;