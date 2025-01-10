import { useState } from "react";
import notyf from "../notificacion/notify";

const Empleados = () => {
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); 

  const GuardarDatos = async () => {
    if (!nombre || !documento) return notyf.error("Complete todos los campos!!");

    try {
      setIsDisabled(true);
      const Guardar = await fetch("/api/Empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documento: documento,
          nombre: nombre,
        }),
      });

      if (Guardar.status == 201) {
        notyf.success("Guardado con éxito!!");
        localStorage.removeItem("empleados");
      } else if (Guardar.status == 400) {
        notyf.error("El empleado ya existe!!");
      }

    } catch (error) {
      console.log("Error al guardar empleado:", error);
    }
     setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  };

  return (
    <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono">
      <div className="m-4 mt-[50px]">
        <h2 className="text-[30px] text-center">AGREGAR EMPLEADOS</h2>
      </div>
      <div className="flex flex-col items-center gap-4 bg-slate-300 h-[500px] w-[330px] rounded-xl p-4 text-[15px]">
        <div className="w-[300px] flex flex-col items-center mt-5">
          <div className="w-full text-center">
            <p className="mb-2 text-sm">Ingrese el Nombre completo</p>
          </div>
          <input
            className="rounded-md p-2 w-[220px]"
            type="text"
            placeholder="nombre..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-3">
          <p className="mb-2">Ingrese el documento</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="number"
            placeholder="documento..."
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />
        </div>

        <div className="w-[300px] flex flex-col items-center mt-3">
          <p className="mb-2">Ingrese la fecha Nac</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="date"
          />
        </div>

        <div className="flex justify-center mt-5">
          <button
            className="border border-white py-2 px-4 rounded-xl hover:bg-white duration-300 hover:scale-105"
            onClick={() => GuardarDatos()}
            disabled={isDisabled} 
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Empleados;
