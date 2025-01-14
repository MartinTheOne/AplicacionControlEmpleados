import React, { useState } from 'react';
import { Menu, Users, MapPin, ScrollText, X, Joystick, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activate, setActivate] = useState('')

  const menuItems = [
    { icon: <Users className="w-6 h-6" />, label: 'Empleados', link: "/empleados" },
    { icon: <MapPin className="w-6 h-6" />, label: 'Lugares', link: "/lugares" },
    { icon: <ScrollText className="w-6 h-6" />, label: 'Informe', link: "/informe" },
    { icon: <ScrollText className="w-6 h-6" />, label: 'Informes Pasados', link: "/informesPasados" },
    { icon: <Joystick className="w-6 h-6" />, label: 'Control Empleados', link: "/controlEmpleados" }
  ];
  

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md hover:bg-gray-100"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40
        transform transition-transform duration-300 ease-in-out font-mono
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col  p-4 space-y-4 mt-[50px]">
          {menuItems.map((item, index) => (
            <Link to={item.link} key={index}
            className={`flex items-center font-mono space-x-2 p-2 hover:bg-gray-100 ${activate == item.label ? "bg-gray-100" : ""}  rounded-md `}
            onClick={() => { setActivate(item.label); setIsOpen(false) }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>

          ))}

        </div>
        <div className='flex justify-center items-center mt-16'>

          <button className=' items-center font-mono space-x-2 p-2 bg-red-600  rounded-md text-white hover:bg-red-700 hover:scale-105 transition-transform duration-300 '
            onClick={() => { localStorage.removeItem('token'); window.location.reload() }}
          > Cerrar Sesion</button>
        </div>
        <div className='flex items-center justify-center mt-[180px]'>
          <p className='text-[10px]'>Hecho por -martin-</p>
        </div>
      </div>
    </>
  );
};

export default SideBar;