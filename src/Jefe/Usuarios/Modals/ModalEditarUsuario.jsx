import { useState } from "react";
import { Modal, Box } from "@mui/material"
import notyf from "../../../notificacion/notify";
const ModalEditarUsuario = ({ isOpen, onRequestClose, usuario, notificacion }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [correo, setCorreo] = useState("");
    const [role, setRole] = useState("");

    if (!usuario) return null;

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
    };

    const EditarLugar = async () => {
        if (isEditing) return;

        try {
            setIsEditing(true);

            const cambios = {};
            if (correo && correo !== usuario.correo) cambios.correo = correo;
            if (role && role !== usuario.role) cambios.role = role;

            if (Object.keys(cambios).length === 0) {
                notyf.error("No se realizaron cambios.");
                setIsEditing(false);
                return;
            }

            const resul = await fetch("/api/Usuarios", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuarioId: usuario._id, ...cambios }),
            });

            onRequestClose();
            setTimeout(() => {
                cambios._id = usuario._id;
                if (resul.status === 200) {
                    notificacion(200, cambios);
                } else {
                    notificacion(400);
                }
                setIsEditing(false);
            }, 100);
        } catch (error) {
            console.error("Error al editar usuario:", error);
            onRequestClose();
            notificacion(400);
            setIsEditing(false);
        } finally {
            setIsEditing(false);
            setCorreo("")
            setRole("")
        }
    };


    return (
        <Modal
            open={isOpen}
            onClose={() => { setCorreo(""); setRole(""); onRequestClose() }}
        >
            <Box sx={style}>
                <div className="flex flex-col items-center gap-4 bg-slate-300 h-[360px] w-[330px] rounded-xl p-4 text-[15px] font-mono">
                    <p className="font-mono text-[9px] text-center">Si desea cambiar solo un valor  deje el otro campo vacio, el sistema se encargara de no editar eso.</p>

                    <div className="w-[300px] flex flex-col items-center mt-3">
                        <p className="mb-2">Cambiar correo</p>
                        <input
                            className="rounded-md p-2 w-[220px]"
                            type="email"
                            placeholder={usuario.correo}
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>

                    <div className="w-[300px] flex flex-col items-center mt-3">
                        <p className="mb-2">Cambiar rol</p>
                        <select name="" id="" defaultValue="" className="border rounded-md p-2 w-[220px]"
                            onChange={(e) => setRole(e.target.value)}>
                            <option value="" disabled>Seleccione un rol</option>
                            {usuario.role === "supervisor" && (
                                <>
                                    <option value="admin">admin</option>
                                    <option value="sin rol">sin rol</option>
                                </>
                            )}
                            {usuario.role === "admin" && (
                                <>
                                    <option value="supervisor">supervisor</option>
                                    <option value="sin rol">sin rol</option>
                                </>
                            )}
                            {usuario.role === "sin rol" && (
                                <>
                                    <option value="supervisor">supervisor</option>
                                    <option value="admin">admin</option>
                                </>
                            )}

                        </select>
                    </div>



                    <div className="flex justify-center mt-5">
                        <button className={`border border-white py-2 px-4 rounded-xl ${!isEditing ? 'hover:bg-white duration-300 hover:scale-105' : 'opacity-50 cursor-not-allowed'} `}
                            onClick={() => EditarLugar()}
                            disabled={isEditing}
                        >
                            {isEditing ? "Editando..." : "Editar"}
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default ModalEditarUsuario;