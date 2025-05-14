export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  joined: Date;
  age: number;
  profileImage?: string;
}
// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginForm from './pages/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterForm from './pages/RegisterForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm/>}/>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;