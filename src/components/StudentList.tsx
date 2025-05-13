import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUp, ArrowDown, FileDown, SortAsc, RefreshCw, Users, 
  Calendar
} from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import StudentCard from './StudentCard';
import { exportStudentsCSV, getCourseCounts } from '../services/studentService';
import {type Student} from '../App'

interface Props {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  filterCourse: string;
  searchTerm: string;
}

const PAGE_SIZE = 12;

const StudentList: React.FC<Props> = ({ 
  students, 
  setStudents,
  filterCourse, 
  searchTerm,
}) => {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [sortKey, setSortKey] = useState<keyof Student>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => 
        (!filterCourse || s.course === filterCourse) &&
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [students, filterCourse, searchTerm]);

  // Sorting logic
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let comparison = 0;
      
      if (sortKey === 'name' || sortKey === 'course') {
        comparison = a[sortKey].localeCompare(b[sortKey]);
      } else if (sortKey === 'joined') {
        comparison = new Date(b.joined).getTime() - new Date(a.joined).getTime();
      } else if (sortKey === 'age' && a.age && b.age) {
        comparison = a.age - b.age;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredStudents, sortKey, sortDirection]);

  // Current page of students
  const currentStudents = sortedStudents.slice(0, displayCount);

  // Course distribution
  const courseCounts = useMemo(() => getCourseCounts(students), [students]);

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Change sort key
  const changeSortKey = (key: keyof Student) => {
    if (key === sortKey) {
      toggleSortDirection();
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const onEditStudent = (updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };
  const onDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  return (
    <div className="container mx-auto px-4">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        {/* Sorting and Filtering Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Sort Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => changeSortKey('name')}
              className={`
                flex items-center px-3 py-2 rounded 
                ${sortKey === 'name' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
              `}
            >
              <SortAsc className="mr-2 h-4 w-4" />
              Name
            </motion.button>
          </div>

          {/* Date Sort */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeSortKey('joined')}
            className={`
              flex items-center px-3 py-2 rounded 
              ${sortKey === 'joined' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
            `}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Joined Date
          </motion.button>

          {/* Sort Direction Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSortDirection}
            className="flex items-center px-3 py-2 bg-gray-200 rounded"
          >
            {sortDirection === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </motion.button>
        </div>

        {/* Export and Reset Actions */}
        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          {/* Export CSV */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => exportStudentsCSV(sortedStudents)}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      {/* Student Stats */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-gray-600" />
            <span className="font-semibold">Total Students: {students.length}</span>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {Object.entries(courseCounts).map(([course, count]) => (
              <span 
                key={course} 
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                {course}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* No Results Handling */}
      {currentStudents.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl">No students found</p>
          
        </div>
      ) : (
        <InfiniteScroll
          dataLength={currentStudents.length}
          next={() => setDisplayCount(prev => prev + PAGE_SIZE)}
          hasMore={currentStudents.length < sortedStudents.length}
          loader={
            <div className="text-center py-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1, 
                  ease: "linear" 
                }}
                className="inline-block"
              >
                <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
              </motion.div>
            </div>
          }
        >
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {currentStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100 
                  }}
                >
                  <StudentCard student={student} onEdit={onEditStudent} onDelete={onDeleteStudent}/>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default StudentList;