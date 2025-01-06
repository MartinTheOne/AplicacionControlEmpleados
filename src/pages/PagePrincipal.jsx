import { useState } from "react";
import FormInicio from "./FormInicio";
import Sidebar from './Side_Bar'; 
import Empleados from "./Empleados";
import Lugares from "./Lugares";
import Informe from "./Informe";
import InformePasado from "./InformesPasados"; 

const Principal = () => {
  const [component, setComponent] = useState("");

  return (
    <div>
      <Sidebar setComponent={setComponent} />
      {component === "Empleados" ? (
        <Empleados />
      ) : component === "Lugares" ? (
        <Lugares />
      ) : component === "Informe" ? (
        <Informe />
      ) : component === "Control Empleados" ? (
        <FormInicio />
      ) : component === "Informes Pasados" ? (
        <InformePasado/>
      ) : (
        ""
      )}
    </div>
  );
};

export default Principal;
