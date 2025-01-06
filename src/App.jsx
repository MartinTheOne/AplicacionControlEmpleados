import PagePrincipal from './pages/PagePrincipal';
import './App.css';
import Login from './login/Login';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { exp } = jwtDecode(token); 
        if (exp > Date.now() / 1000) { 
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token'); 
        }
      } catch (error) {
        console.error("Error decodificando el token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <div className="App">
      {isLoggedIn ? (
        <PagePrincipal />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;
