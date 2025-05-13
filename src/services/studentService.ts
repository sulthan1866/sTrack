import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Papa from 'papaparse';
import { faker } from '@faker-js/faker';
import { type Student } from '../App';
// Available Courses
const AVAILABLE_COURSES = [
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
];

// Function to generate a realistic student
const generateStudent = (index: number): Student => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const course = AVAILABLE_COURSES[index % AVAILABLE_COURSES.length];
  const joinedDate = faker.date.past({ years: 4 });
  
  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ 
      firstName, 
      lastName, 
      provider: 'school.edu' 
    }),
    course,
    joined: joinedDate,
    age: faker.number.int({ min: 18, max: 25 }),
    profileImage: faker.image.avatarGitHub()
  };
};

// Generate mock data
const generateMockStudents = (count: number = 50): Student[] => {
  return Array.from({ length: count }, (_, index) => generateStudent(index));
};

// Create mock data
const mock = new MockAdapter(axios, { delayResponse: 1000 });
const data: Student[] = generateMockStudents();
mock.onGet('/students').reply(200, data);

// Fetch students mock API call
export const fetchStudentsMock = async (): Promise<Student[]> => {
  const resp = await axios.get<Student[]>('/students');
  return resp.data;
};

// Export students to CSV
export const exportStudentsCSV = (students: Student[]) => {
  const csv = Papa.unparse(students);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'students.csv';
  link.click();
};

// Additional utility functions
export const getCourseCounts = (students: Student[]) => {
  return students.reduce((acc, student) => {
    acc[student.course] = (acc[student.course] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getAgeStatistics = (students: Student[]) => {
  const validAges = students.filter(s => s.age).map(s => s.age!);
  
  return {
    averageAge: validAges.length 
      ? validAges.reduce((a, b) => a + b, 0) / validAges.length 
      : 0,
    minAge: Math.min(...validAges),
    maxAge: Math.max(...validAges)
  };
};

export { AVAILABLE_COURSES };