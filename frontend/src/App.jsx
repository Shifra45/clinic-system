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
    <nav className="bg-blue-700 text-white p-4 flex gap-6 items-center">
      <Link to="/" className="font-bold">🏥 Klinik</Link>
      <Link to="/patients">Pasien</Link>
      {(user.role === 'admin' || user.role === 'receptionist') && <Link to="/registrations">Daftar</Link>}
      <Link to="/queues">Antrean</Link>
      {user.role === 'doctor' && <Link to="/examination">Pemeriksaan</Link>}
      <div className="ml-auto flex items-center gap-4">
        <span>{user.name} ({user.role})</span>
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
          <Route path="/patients" element={<ProtectedRoute><PatientPage /></ProtectedRoute>} />
          <Route path="/registrations" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><RegistrationPage /></ProtectedRoute>} />
          <Route path="/queues" element={<ProtectedRoute><QueuePage /></ProtectedRoute>} />
          <Route path="/examination" element={<ProtectedRoute allowedRoles={['doctor']}><ExaminationPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;