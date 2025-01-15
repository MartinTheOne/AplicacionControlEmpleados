import './App.css';
import Login from './login/Login';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SideBar from './pages/Side_Bar';
import GestionLugares from './Lugares/GestionLugares';
import GestionEmpleados from './Empleados/GestionEmpleados';
import Informe from './Informes/Informe';
import InformePasado from './Informes/InformesPasados';
import FormInicio from './pages/FormInicio';
import Inicio from './pages/Inicio';


function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <AppContent token={token} />
    </Router>
  );
}

function AppContent({ token }) {
  const location = useLocation(); 
  const mostrarSide = location.pathname !== '/'; 

  return (
    <>
      {mostrarSide && <SideBar />}
      <AppRoutes token={token} />
    </>
  );
}

function AppRoutes({ token }) {


  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/inicio" element={<ProtectedRoute><Inicio /></ProtectedRoute>} />
      <Route path="/lugares" element={<ProtectedRoute><GestionLugares /></ProtectedRoute> } />
      <Route path="/empleados" element={<ProtectedRoute><GestionEmpleados /></ProtectedRoute>} />
      <Route path="/informe" element={<ProtectedRoute><Informe /></ProtectedRoute>} />
      <Route path="/informesPasados" element={<ProtectedRoute><InformePasado /></ProtectedRoute>} />
      <Route path="/controlEmpleados" element={<ProtectedRoute><FormInicio /></ProtectedRoute>} />

    </Routes>
  );
}

export default App;
