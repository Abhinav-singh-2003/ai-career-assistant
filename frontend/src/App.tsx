import { BrowserRouter,Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login";
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "./components/ProtectedRoutes";
import Resumes from "./pages/Resumes";

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          {/* Routes requiring login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resumes" element={<Resumes />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />}/>
          <Route path="*" element={<Navigate to="/login" replace/> } />


        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
