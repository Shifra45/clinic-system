import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import PatientPage from './pages/PatientPage';
import RegistrationPage from './pages/RegistrationPage';
import QueuePage from './pages/QueuePage';
import ExaminationPage from './pages/ExaminationPage';

const Navigation = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-6">
      <Link to="/">Dashboard</Link>
      <Link to="/patients">Pasien</Link>
      <Link to="/registrations">Daftar</Link>
      <Link to="/queues">Antrean</Link>
      {user.role === 'doctor' && <Link to="/examination">Pemeriksaan</Link>}
      <div className="ml-auto">
        <span className="mr-4">({user.role})</span>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><PatientPage /></ProtectedRoute>} />
          <Route path="/registrations" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><RegistrationPage /></ProtectedRoute>} />
          <Route path="/queues" element={<ProtectedRoute allowedRoles={['admin', 'receptionist', 'doctor']}><QueuePage /></ProtectedRoute>} />
          <Route path="/examination" element={<ProtectedRoute allowedRoles={['doctor']}><ExaminationPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;