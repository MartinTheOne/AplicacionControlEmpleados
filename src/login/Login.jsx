import React, { useState } from 'react';
import notyf from '../notificacion/notify';

export default function Login({ onLoginSuccess }) {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado
    if (!user || !password) {
      alert('Completa todos los campos');
      return;
    }
    const response = await fetch('/api/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, password }),
    });
    const data = await response.json();

    if (data.message === 'User logged in') {
      localStorage.setItem('token', data.token);
      notyf.success('Inicio de sesión exitoso');
      onLoginSuccess();
    } else {
      notyf.error('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl text-center font-bold text-gray-800">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} method='POST'>
          <div className="mt-6">
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Usuario</label>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none"
                onChange={(e) => setUser(e.target.value)}
                value={user}
              />
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              type="submit"
              className="w-full px-2 py-2 transition-transform duration-300 hover:scale-105 text-white hover:bg-blue-700 bg-blue-500 rounded-lg"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
