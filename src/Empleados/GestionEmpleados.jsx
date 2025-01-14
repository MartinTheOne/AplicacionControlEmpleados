import { useState } from "react";
import Empleados from "./Empleados"
import NuevoEmpleado from "./NuevoEmpleado";

export default function GestionEmpleados() {
  const [activeTab, setActiveTab] = useState("Empleados");

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center mt-20">
      <div className="container">
        <div className="mb-4">
          <ul className="flex border-b justify-center">
            <li className="">
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "Empleados"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("Empleados")}
              >
                Ver Empleados
              </button>
              <button
                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${
                  activeTab === "Agregar Empleado"
                    ? "text-white bg-slate-500"
                    : "text-gray-500 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("Agregar Empleado")}
              >
                Agregar Empleado
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="p-4 w-full max-w-3xl bg-gray-100 rounded-lg ">
        {activeTab === "Empleados" && <Empleados />}
        {activeTab === "Agregar Empleado" && <NuevoEmpleado />}
      </div>
    </div>
  );
}
