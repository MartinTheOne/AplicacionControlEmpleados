import { useState, useEffect } from "react";
import notyf from "../notificacion/notify";
const FormInicio = () => {
  const [SelectEmpl, setSelectEmple] = useState("");
  const [fecha, setFecha] = useState(new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }));
  const [empleados, setEmpleados] = useState([])
  const [lugares, setLugares] = useState([])
  const [horas, setHoras] = useState("")
  const [lugar, setLugar] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const obtenerEmpleados = async () => {
      const empleadosGuardados = localStorage.getItem("empleados");

      if (empleadosGuardados) {
        setEmpleados(JSON.parse(empleadosGuardados));
      } else {
        try {
          const response = await fetch("/api/Empleados");
          if (response.ok) {
            const data = await response.json();
            setEmpleados(data.Empleados);
            localStorage.setItem("empleados", JSON.stringify(data.Empleados));
          } else {
            console.error("Error al obtener los empleados de la API");
          }
        } catch (error) {
          console.error("Error al conectar con la API:", error);
        }
      }
    };

    const obtenerLugares = async () => {
      const lugaresGuardados = localStorage.getItem("lugares");

      if (lugaresGuardados) {
        setLugares(JSON.parse(lugaresGuardados));
      } else {
        try {
          const response = await fetch("/api/Lugares");
          if (response.ok) {
            const data = await response.json();
            setLugares(data.lugares);
            console.log(data.lugares)
            localStorage.setItem("lugares", JSON.stringify(data.lugares));
          } else {
            console.error("Error al obtener los lugares de la API");
          }
        } catch (error) {
          console.error("Error al conectar con la API:", error);
        }
      }
    };
    obtenerLugares();
    obtenerEmpleados();
  }, []);


  const guardarRegistro = async () => {
    if (!SelectEmpl || !horas || !lugar || !fecha) return;
    try {
      setIsDisabled(true);
      const GuardarReg = await fetch("/api/RegistrosDiarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha: fecha,
          docEmpleado: SelectEmpl.documento,
          horas: parseFloat(horas),
          lugar: lugar.nombre,
          precioLugar: parseFloat(lugar.precio)
        }),
      });

      if (GuardarReg.status == 201) {
        notyf.success("Guardado con éxito!!");
        localStorage.removeItem("registroDiario");
      } else {
        notyf.error("Error al guardar");
      }
    } catch (error) {
      console.error("Error en el guardado:", error);
      notyf.error("Error inesperado");
    }
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  }

  return (
    <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono">
      <div className="m-4 mt-[50px]">
        <h2 className="text-[30px] text-center">CONTROL DE EMPLEADOS DIARIO</h2>
      </div>
      <div className="flex flex-col items-center gap-4 bg-slate-300 h-[530px] w-[330px] rounded-xl p-4 text-[15px]">
        <div className="flex justify-center w-full m-5">
          <select
            defaultValue=""
            className="border rounded-md p-2 w-[300px]"
            onChange={(e) => {
              const empleadoSeleccionado = JSON.parse(e.target.value); // Deserializamos el valor
              setSelectEmple(empleadoSeleccionado);
            }}
          >
            <option value="" disabled>
              Seleccione un empleado
            </option>
            {empleados.length > 0 &&
              empleados.map((e) => (
                <option key={e.documento} value={JSON.stringify(e)}>
                  {e.nombre.toUpperCase()}
                </option>
              ))}
          </select>
        </div>

        <div className="w-[300px] flex flex-col items-center">
          <div className="w-full text-center">
            <p className="mb-2 text-sm">
              Ingrese las horas trabajadas de{' '}
              <span className="inline-block font-bold">{SelectEmpl.nombre || ''}</span>
            </p>
          </div>
          <input
            className="rounded-md p-2 w-[220px]"
            type="number"
            placeholder="horas..."
            onChange={(e) => { let hora = e.target.value; if (Number(hora) >= 0) { setHoras(e.target.value) } else setHoras("") }}
            value={horas}
          />
        </div>

        <div className="flex flex-col items-center w-full mt-3">
          <p className="mb-2">Ingrese el lugar de trabajo</p>
          <select
            defaultValue=""
            className="border rounded-md p-2 w-[220px]"
            onChange={(e) => setLugar(JSON.parse(e.target.value))}
          >
            <option value="" disabled>
              Seleccione el lugar
            </option>
            {lugares.length > 0 && lugares.map((l) => (
              <option key={l._id} id={l._id} value={JSON.stringify(l)}>
                {l.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="w-[300px] flex flex-col items-center mt-3">
          <p className="mb-2">Ingrese la fecha</p>
          <input
            className="rounded-md p-2 w-[220px]"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="flex justify-center mt-5">
          <button className="border border-white  py-2 px-4 rounded-xl hover:bg-white duration-300 hover:scale-105"
            onClick={() => guardarRegistro()}
            disabled={isDisabled}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormInicio;
