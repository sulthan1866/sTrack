import { useState, useEffect, createContext } from 'react';
import { Bell, Menu, Moon, Sun, User, X } from 'lucide-react';
import StudentList from './components/StudentList';
import FilterBar from './components/FilterBar';
import SearchBar from './components/SearchBar';
import AddStudentModal from './components/AddStudentModal';
import { fetchStudentsMock } from './services/studentService';

export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  joined: Date;
  age: number;
  profileImage?: string;
}

type AuthContextType = {
  isAdmin: boolean;
  checkAdmin: (pw: string) => boolean;
};

export const AuthContext = createContext<AuthContextType>({
  isAdmin: true,
  checkAdmin: (pw: string) => true,
});

const App = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filterCourse, setFilterCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchStudentsMock().then(setStudents);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const checkAdmin = (password:string) => {
    const valid = password === '0000';
    setIsAdmin(valid);
    return valid;
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, checkAdmin }}>
      <div className={`min-h-screen transition-colors ${darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
          {/* Navbar */}
          <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center mr-2">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-gray-900 dark:text-white">EduTrack</span>
                  </div>
                </div>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="relative">
                    <SearchBar onSearch={setSearchTerm} />
                  </div>
                  <FilterBar onFilter={setFilterCourse} />
                  <AddStudentModal setStudents={setStudents} />
                  
                  
                  
                  <button className="ml-4 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {isAdmin ? "A" : "U"}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Mobile menu button */}
                <div className="flex md:hidden items-center">
                  <button
                    className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  >
                    {mobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg pt-2 pb-3 space-y-3 px-4">
                <div className="flex flex-col space-y-3">
                  <SearchBar onSearch={setSearchTerm} />
                  <FilterBar onFilter={setFilterCourse} />
                  <div className="flex justify-between items-center">
                    <AddStudentModal setStudents={setStudents} />
                   
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {students.length} students in total
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center">
                <div className="text-sm text-gray-600 dark:text-gray-300 mr-2">
                  {isAdmin ? 'Admin Mode' : 'User Mode'}
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors ${isAdmin ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`transform transition-transform h-5 w-5 rounded-full bg-white shadow ${isAdmin ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-8">
              <StudentList
                students={students}
                setStudents={setStudents}
                filterCourse={filterCourse}
                searchTerm={searchTerm}
              />
            </div>
          </main>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default App;