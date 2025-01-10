import { useState } from "react";
import notyf from "../notificacion/notify";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Informe = () => {
    const [loading, setLoading] = useState(false);
    const [fechaIni, setFechaIni] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [registroDiario, setRegistroDiario] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);

    const isValidDate = (date) => {
        const parsedDate = new Date(date);
        return parsedDate instanceof Date && !isNaN(parsedDate);
    };

    const GenerarInforme = async () => {


        const fechahoy = new Date().toISOString().split('T')[0];
        if (!fechaFin || !fechaIni || fechaIni > fechaFin || fechaFin > fechahoy || !isValidDate(fechaIni) || !isValidDate(fechaFin)) return notyf.error("Ingrese fechas válidas");

        setIsDisabled(true);
        setLoading(true);
        try {
            const response = await fetch(`/api/RegistrosDiarios?fechaIni=${fechaIni}&fechaFin=${fechaFin}`);
            if (response.ok) {
                const data = await response.json();
                setRegistroDiario(data.RegistrosDiarios);
                notyf.success("Informe generado con exito!!");
                localStorage.removeItem("informes");
            } else if(response.status == 404){
                notyf.error("No se encontraron registros diarios");
            }
            else{
                notyf.error("Error al obtener los registros");
                console.error("Error al obtener los registros de la API");
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al conectar con la API:", error);
        }
        setTimeout(() => {
            setIsDisabled(false);
        }, 5000);
    };

    const generarPDF = () => {
        try {
            if (!registroDiario || registroDiario.length === 0) {
                notyf.error("No hay datos para generar el PDF");
                return;
            }

            const doc = new jsPDF();
            
            // Configuración de estilos
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            
            // Título
            doc.text("Informe de Registros Diarios", 105, 20, { align: "center" });
            
            // Información del período
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Período: ${fechaIni} al ${fechaFin}`, 20, 35);
            
            // Calcular totales
            const totalHoras = registroDiario.reduce((sum, reg) => sum + reg.horas, 0);
            const totalMonto = registroDiario.reduce((sum, reg) => sum + reg.total, 0);
            
            // Ordenar registros por fecha, empleado y lugar
            const registrosOrdenados = [...registroDiario].sort((a, b) => {
                const fechaComparacion = a.fecha.localeCompare(b.fecha);
                if (fechaComparacion !== 0) return fechaComparacion;
                
                const empleadoComparacion = a.empleado.nombre.localeCompare(b.empleado.nombre);
                if (empleadoComparacion !== 0) return empleadoComparacion;
                
                return a.lugar.nombre.localeCompare(b.lugar.nombre);
            });
            
            // Crear tabla de registros
            const tableColumns = [
                { header: 'Fecha', dataKey: 'fecha' },
                { header: 'Empleado', dataKey: 'empleado' },
                { header: 'Lugar', dataKey: 'lugar' },
                { header: 'Precio/Hora', dataKey: 'precioHora' },
                { header: 'Horas', dataKey: 'horas' },
                { header: 'Total', dataKey: 'total' },
            ];

            const tableData = registrosOrdenados.map(registro => ({
                fecha: new Date(registro.fecha).toISOString().split('T')[0],
                empleado: registro.empleado.nombre,
                lugar: registro.lugar.nombre,
                precioHora: `$${registro.precioLugar.toLocaleString()}`,
                horas: registro.horas,
                total: `$${registro.total.toLocaleString()}`
            }));
            
            // Generar tabla
            doc.autoTable({
                columns: tableColumns,
                body: tableData,
                startY: 45,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                },
                headStyles: {
                    fillColor: [66, 66, 66],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });
            
            // Agregar resumen al final
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.setFont("helvetica", "bold");
            doc.text(`Total de Horas: ${totalHoras}`, 20, finalY);
            doc.text(`Monto Total: $${totalMonto.toLocaleString()}`, 20, finalY + 7);

            // Agregar resumen por empleado
            const resumenPorEmpleado = registrosOrdenados.reduce((acc, reg) => {
                const key = reg.empleado.nombre;
                if (!acc[key]) {
                    acc[key] = {
                        horas: 0,
                        total: 0,
                        presentismo: "",
                        boleto: ""
                    };
                }
                acc[key].horas += reg.horas;
                acc[key].total += reg.total;
                acc[key].presentismo = reg.presentismo == " " ? "" : reg.presentismo;
                acc[key].boleto = reg.boleto == " " ? "" : reg.boleto;
                return acc;
            }, {});

            // Agregar resumen por empleado al PDF
            doc.setFontSize(14);
            doc.text("Resumen por Empleado", 20, finalY + 20);
            doc.setFontSize(10);
            let yPos = finalY + 30;
            Object.entries(resumenPorEmpleado).forEach(([empleado, datos]) => {
                doc.text(`${empleado}: (${datos.horas}hs - $${datos.total.toLocaleString()}) - Presentismo: ${datos.presentismo} -  Boleto interUrbano: ${datos.boleto}`, 20, yPos);
                yPos += 7;
            });
            
            // Agregar pie de página
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            for(let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
            }
            
            // Guardar PDF
            doc.save(`Informe_${fechaIni}_${fechaFin}.pdf`);
            notyf.success("PDF generado exitosamente!");
        } catch (error) {
            console.error("Error al generar PDF:", error);
            notyf.error("Error al generar el PDF");
        }
    };

    return (
        <div className="App flex flex-col items-center min-h-screen h-screen overflow-hidden font-mono">
            <div className="m-4 mt-[50px]">
                <h2 className="text-[30px] text-center">INFORME</h2>
            </div>
            <div className="flex flex-col items-center gap-4 bg-slate-300 h-[500px] w-[330px] rounded-xl p-4 text-[15px]">
                <div className="w-[300px] flex flex-col items-center mt-5">
                    <div className="w-full text-center">
                        <p className="mb-2">Ingrese fecha de inicio</p>
                    </div>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="date"
                        onChange={(e) => setFechaIni(e.target.value)}
                    />
                </div>

                <div className="w-[300px] flex flex-col items-center mt-3">
                    <p className="mb-2">Ingrese fecha de fin</p>
                    <input
                        className="rounded-md p-2 w-[220px]"
                        type="date"
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>

                <div className="flex justify-center mt-5">
                    <button
                        className="border border-white py-2 px-4 rounded-xl hover:bg-white duration-300 hover:scale-105"
                        onClick={GenerarInforme}
                        disabled={isDisabled}
                    >
                        Generar Informe
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center mt-10">
                    {loading && (
                        <img
                            src="/loanding.svg"
                            alt="Cargando"
                            className="animate-spin"
                            style={{
                                width: '50px',
                                height: '50px',
                            }}
                        />
                    )}
                    {registroDiario.length > 0 && (
                        <button
                            className="bg-slate-700 text-white py-2 w-[220px] rounded-xl hover:bg-slate-900 duration-300 hover:scale-105"
                            onClick={()=>{generarPDF();
                                 setTimeout(() => {
                                setRegistroDiario([])
                            }, 6000);
                        }}
                            disabled={loading}
                        >
                            Descargar PDF
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Informe;