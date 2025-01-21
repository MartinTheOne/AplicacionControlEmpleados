import { useState } from "react";
import notyf from "../../notificacion/notify";
import { EyeClosedIcon,EyeIcon } from "lucide-react"


const AgregarUsuario = () => {
    const [user, setUser] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPasword] = useState("");
    const [role, setRole] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [verPass, setVerPass] = useState("password")
    const GuardarDatos = async () => {
        if (!user || !correo || !password|| !role) return notyf.error("Complete todos los campos!!");

        if ((password.length < 8)) return notyf.error("La contraseña debe tener al menos 8 digitos")

        try {
            setIsDisabled(true);
            const Guardar = await fetch("/api/Usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user,
                    correo,
                    password,
                    role
                    
                }),
            });

            if (Guardar.status == 201) {
                notyf.success("Guardado con éxito!!");
                setCorreo("")
                setUser("")
                setPasword("")
                setRole("")
                localStorage.removeItem("usuarios");
            } else if (Guardar.status == 400) {
                notyf.error("Error al guardar usuario");
            }

        } catch (error) {
            console.log("Error al guardar empleado:", error);
        }
        setTimeout(() => {
            setIsDisabled(false);
        }, 2000);
    };

    return (
        <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono">
            <div className="flex flex-col items-center gap-4 bg-slate-300 h-[470px] w-[330px] rounded-xl p-4 text-[15px]">
                <div className="w-[300px] flex flex-col items-center mt-5">
                    <div className="w-full text-center">
                        <p className="mb-2 text-sm">Ingrese el Nombre completo</p>
                    </div>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="text"
                        placeholder="nombre..."
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </div>

                <div className="w-[300px] flex flex-col items-center mt-3">
                    <p className="mb-2">Ingrese el correo</p>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="email"
                        placeholder="correo..."
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                </div>

                <div className="w-[300px] flex flex-col items-center mt-3">
                    <p className="mb-2">Ingrese la contraseña</p>
                    <div className="flex items-center ml-8">
                        <input
                            className="rounded-md p-2 w-[220px]"
                            type={verPass}
                            placeholder="contraseña..."
                            value={password}
                            onChange={(e) => setPasword(e.target.value)}
                        />

                        {verPass=="password"?<EyeIcon className="cursor-pointer ml-2  " onClick={()=>setVerPass("text")}/>:<EyeClosedIcon className="cursor-pointer ml-2"onClick={()=>setVerPass("password")} />}
                    </div>
                </div>

                <div className="mt-6">
                    <select name="" id="" defaultValue="" className="rounded-md p-2 w-[220px] cursor-pointer" 
                    onChange={(e)=>setRole(e.target.value)}
                    >
                        <option value="" disabled>Seleccione un rol</option>
                        <option value="supervisor">supervisor</option>
                        <option value="admin">admin</option>
                    </select>
                </div>


                <div className="flex justify-center mt-5">
                    <button
                        className={`border border-white py-2 px-4 rounded-xl ${!isDisabled ? 'hover:bg-white duration-300 hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
                        onClick={() => GuardarDatos()}
                        disabled={isDisabled}
                    >
                        {!isDisabled ? "Guardar" : "Guardando..."}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgregarUsuario;
