import { useState } from "react"
import NuevoLugar from "./NuevoLugar";
import Lugares from "./Lugares";

const GestionLugares = () => {
const [activeTab,setActiveTab]=useState("Lugares")
    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center mt-20">
            <div className="container">
                <div className="mb-4">
                    <ul className="flex border-b justify-center">
                        <li className="">
                            <button
                                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${activeTab === "Lugares"
                                        ? "text-white bg-slate-500"
                                        : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                onClick={() => setActiveTab("Lugares")}
                            >
                                Ver Lugares
                            </button>
                            <button
                                className={`py-2 px-6 font-semibold rounded-t mr-2 bg-gray-200 ${activeTab === "Agregar Lugar"
                                        ? "text-white bg-slate-500"
                                        : "text-gray-500 hover:bg-gray-200"
                                    }`}
                                onClick={() => setActiveTab("Agregar Lugar")}
                            >
                                Agregar Lugar
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="p-4 w-full max-w-3xl bg-gray-100 rounded-lg ">
                {activeTab === "Lugares" && <Lugares/>}
                {activeTab === "Agregar Lugar" && <NuevoLugar />}
            </div>
        </div>
    )
}

export default GestionLugares;