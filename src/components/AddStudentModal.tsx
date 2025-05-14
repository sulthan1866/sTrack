import React, {  useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, Mail, Book, Calendar, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import {type Student} from '../App';
import { AVAILABLE_COURSES } from '../services/studentService';

interface Props {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const AddStudentModal: React.FC<Props> = ({ setStudents }:Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    course: '',
    age: '',
    profileImage: ''
  });

  // Validate inputs
  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (!form.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error('Invalid email format');
      return false;
    }

    if (!form.course) {
      toast.error('Please select a course');
      return false;
    }

    if (form.age && (isNaN(Number(form.age)) || Number(form.age) < 16 || Number(form.age) > 100)) {
      toast.error('Please enter a valid age (16-100)');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newStudent: Student = {
      id: uuidv4(),
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course,
      joined: new Date(),
      age: Number(form.age),
      ...(form.profileImage && { profileImage: form.profileImage })
    };

    setStudents((prev) => [...prev, newStudent]);
    toast.success('Student added successfully');
    setOpen(false);
  };

  const openModal = () => {
    // Add your admin check logic here if needed
    setOpen(true);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openModal}
        className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 dark:bg-indigo-900 dark:text-gray-200  transition-colors"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Student
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setOpen(false)}
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
                Add New Student
              </h2>

              {/* Name Input */}
              <div className="mb-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500  dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
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
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500  dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
                  />
                </div>
              </div>

              {/* Course Selection */}
              <div className="mb-4">
                <div className="relative">
                  <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500  dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
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
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    min="16"
                    max="100"
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500  dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
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
                    value={form.profileImage}
                    onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500  dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-indigo-700"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-900 dark:hover:bg-green-800"
                >
                  Add Student
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AddStudentModal;