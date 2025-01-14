import { useState } from "react";
import notyf from "../notificacion/notify";
import { jwtDecode } from "jwt-decode";


const NuevoLugar = () => {
    const [precio, setPrecio] = useState('')
    const [nombre, setNombre] = useState('')
    const [direccion, setDireccion] = useState('')
    const [isDisabled, setIsDisabled] = useState(false);

    const token=localStorage.getItem("token");  
    const decodetoken= token? jwtDecode(token):null;
    const supervisorId=decodetoken?.user;

    const GuardarLugar=async()=>{
        if(!nombre||parseFloat(precio)<0||!direccion)return notyf.error("Complete todos los campos!!");

        try {
             setIsDisabled(true)
        const resul=await fetch("/api/Lugares",{
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                precio:precio,
                nombre:nombre,
                direccion:direccion,
                supervisorId:supervisorId
              }),
        })

        if(resul.status==201){
            notyf.success("Guardado con exito!!")
            localStorage.removeItem("lugares");
            setDireccion("")
            setNombre("")
            setPrecio("")
        }
        else if(resul.status==400) notyf.error("El lugar ya existe!!")
        
        } catch (error) {
            console.log("Error al guardar lugar:", error);
        }
        setTimeout(() => {
            setIsDisabled(false)
        }, 5000);
       
    }
    return (
        <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono bg-gray-100">
            <div className="flex flex-col items-center gap-4 bg-slate-300 h-[450px] w-[330px] rounded-xl p-4 text-[15px]">

                <div className="w-[300px] flex flex-col items-center mt-5">
                    <div className="w-full text-center">
                        <p className="mb-2">Ingrese el Nombre del lugar</p>
                    </div>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="text"
                        placeholder="nombre..."
                        value={nombre}
                        onChange={(e)=>setNombre(e.target.value)}
                    />
                </div>

                <div className="w-[300px] flex flex-col items-center mt-3">
                    <p className="mb-2">Ingrese direccion del lugar</p>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="text"
                        placeholder="direccion..."
                        value={direccion}
                        onChange={(e)=>setDireccion(e.target.value)}
                    />
                </div>

                <div className="w-[300px] flex flex-col items-center mt-3">
                    <p className="mb-2">Ingrese el precio por hora</p>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="number"
                        placeholder="precio..."
                        value={precio}
                        onChange={(e) => {
                            const num = parseFloat(e.target.value);
                            setPrecio(num > 0 ? num : '');
                        }}
                        min="0"
                    />
                </div>



                <div className="flex justify-center mt-5">
                    <button className="border border-white py-2 px-4 rounded-xl hover:bg-white duration-300 hover:scale-105"
                    onClick={()=>GuardarLugar()}
                    disabled={isDisabled}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
export default NuevoLugar;