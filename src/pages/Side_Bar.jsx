import React, { useState } from 'react';
import { Menu, Users, MapPin, ScrollText, X, Joystick,User } from 'lucide-react';
import { Link } from 'react-router-dom';


const SideBar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activate, setActivate] = useState('');

  

  const menuItems = {
    supervisor: [
      { icon: <Users className="w-6 h-6" />, label: 'Empleados', link: '/empleados' },
      { icon: <MapPin className="w-6 h-6" />, label: 'Lugares', link: '/lugares' },
      { icon: <ScrollText className="w-6 h-6" />, label: 'Informe', link: '/informe' },
      { icon: <ScrollText className="w-6 h-6" />, label: 'Informes Pasados', link: '/informesPasados' },
      { icon: <Joystick className="w-6 h-6" />, label: 'Control Empleados', link: "/controlEmpleados" }
    ],
    admin: [
      { icon: <User className="w-6 h-6" />, label: 'Usuarios', link: '/usuarios' },
      { icon: <Joystick className="w-6 h-6" />, label: 'Control Gastos', link: '/controlgastos' },
    ],
  };

  // Obtener los ítems del menú según el rol
  const itemsToDisplay = menuItems[role] || [];

  return (
    <>
      {/* Botón para abrir/cerrar el sidebar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Fondo oscuro al abrir el sidebar en móviles */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40
        transform transition-transform duration-300 ease-in-out font-mono
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Lista de ítems del menú */}
        <div className="flex flex-col p-4 space-y-4 mt-[50px]">
          {itemsToDisplay.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className={`flex items-center font-mono space-x-2 p-2 hover:bg-gray-100 ${
                activate === item.label ? 'bg-gray-100' : ''
              } rounded-md`}
              onClick={() => {
                setActivate(item.label);
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Botón de cerrar sesión */}
        <div className="flex justify-center items-center mt-16">
          <button
            className="items-center font-mono space-x-2 p-2 bg-red-600 rounded-md text-white hover:bg-red-700 hover:scale-105 transition-transform duration-300"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Pie de página */}
        <div className="flex items-center justify-center mt-[180px]">
          <a href="https://port-folio-phi-silk.vercel.app/" target='_blank'><p className="text-[10px] text-blue-500">Hecho por -martin-</p></a>
          
        </div>
      </div>
    </>
  );
};

export default SideBar;
