import './App.css';
import Login from './login/Login';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SideBar from './pages/Side_Bar';
import GestionLugares from './Lugares/GestionLugares';
import GestionEmpleados from './Empleados/GestionEmpleados';
import Informe from './Informes/Informe';
import InformePasado from './Informes/InformesPasados';
import FormInicio from './pages/FormInicio';
import Inicio from './pages/Inicio';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import GestionUsuarios from './Jefe/Usuarios/GestionUsuarios';

function App() {
  const [role, setRole] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken?.role || null);
      } catch (error) {
        console.error('Error decoding token:', error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
    setIsInitialized(true);
  };

  useEffect(() => {
    updateRole();
    // Add event listener for storage changes
    window.addEventListener('storage', updateRole);
    return () => window.removeEventListener('storage', updateRole);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <Router>
      <AppContent role={role} updateRole={updateRole} />
    </Router>
  );
}

function AppContent({ role, updateRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const mostrarSide = location.pathname !== '/';

  useEffect(() => {
    // If we're not on the login page and there's no role, redirect to login
    if (location.pathname !== '/' && !role) {
      navigate('/');
    }
  }, [role, location.pathname, navigate]);

  useEffect(() => {
    // Update role when pathname changes
    updateRole();
  }, [location.pathname, updateRole]);

  return (
    <>
      {mostrarSide && role && <SideBar role={role} />}
      <AppRoutes />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/usuarios' element={<GestionUsuarios/>}/>
      <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
      <Route path="/lugares" element={<ProtectedRoute><GestionLugares /></ProtectedRoute>} />
      <Route path="/empleados" element={<ProtectedRoute><GestionEmpleados /></ProtectedRoute>} />
      <Route path="/informe" element={<ProtectedRoute><Informe /></ProtectedRoute>} />
      <Route path="/informesPasados" element={<ProtectedRoute><InformePasado /></ProtectedRoute>} />
      <Route path="/controlEmpleados" element={<ProtectedRoute><FormInicio /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;