import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import notyf from "../notificacion/notify";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const InformePasado = () => {

    const [informes, setInformes] = useState([]);

    useEffect(() => {
        const obtenerInformes = async () => {
            const traerInforme = localStorage.getItem("informes");
            if (traerInforme) {
                setInformes(JSON.parse(traerInforme));
            } else {
                try {
                    const response = await fetch("/api/Informe");
                    if (response.ok) {
                        const data = await response.json();
                        setInformes(data.informes);
                        localStorage.setItem("informes", JSON.stringify(data.informes));
                    } else {
                        console.error("Error al obtener los informes de la API");
                    }
                } catch (error) {
                    console.error("Error al conectar con la API:", error);
                }
            }
        }
        obtenerInformes();
    }, []);

    const TABLE_HEAD = ["Fecha Informe", "Fecha Inicio", "Fecha Fin", "Descargar", "Borrar"];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(informes.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedRows = informes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const generarPDF = (inf) => {
        try {
            if (!inf || !inf.registros || inf.registros.length === 0) {
                notyf.error("No hay datos para generar el PDF");
                return;
            }
            const informeElegido = inf;
            const registro = informeElegido.registros;
            const doc = new jsPDF();

            // Configuración de estilos
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");

            // Título
            doc.text("Informe de Registros Diarios", 105, 20, { align: "center" });

            // Información del período
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Período: ${informeElegido.fechaIni} al ${informeElegido.fechaFin}`, 20, 35);

            // Calcular totales
            const totalHoras = registro.reduce((sum, reg) => sum + (reg.horas || 0), 0);
            const totalMonto = registro.reduce((sum, reg) => sum + (reg.total || 0), 0);

            // Ordenar registros por fecha, empleado y lugar
            const registrosOrdenados = [...registro].sort((a, b) => {
                const fechaComparacion = (a.fecha || "").localeCompare(b.fecha || "");
                if (fechaComparacion !== 0) return fechaComparacion;

                const empleadoComparacion = (a.empleado?.nombre || "").localeCompare(b.empleado?.nombre || "");
                if (empleadoComparacion !== 0) return empleadoComparacion;

                return (a.lugar?.nombre || "").localeCompare(b.lugar?.nombre || "");
            });

            // Crear tabla de registros
            const tableColumns = [
                { header: 'Fecha', dataKey: 'fecha' },
                { header: 'Empleado', dataKey: 'empleado' },
                { header: 'Lugar', dataKey: 'lugar' },
                { header: 'Precio/Hora', dataKey: 'precioHora' },
                { header: 'Horas', dataKey: 'horas' },
                { header: 'Total', dataKey: 'total' }
            ];

            const tableData = registrosOrdenados.map(reg => ({
                fecha: new Date(reg.fecha).toISOString().split('T')[0],
                empleado: reg.empleado?.nombre || "N/A",
                lugar: reg.lugar?.nombre || "N/A",
                precioHora: `$${(reg.precioLugar || 0).toLocaleString()}`,
                horas: reg.horas || 0,
                total: `$${(reg.total || 0).toLocaleString()}`
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
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
            }

            // Guardar PDF
            doc.save(`Informe_${informeElegido.fechaIni}_${informeElegido.fechaFin}.pdf`);
            notyf.success("PDF generado exitosamente!");
        } catch (error) {
            console.error("Error al generar PDF:", error);
            notyf.error("Error al generar el PDF");
        }
    };



    return (
        <div className="h-[900px] bg-gray-100  ">

            <div className="flex justify-center items-center h-[700px] ">
                <div className="w-full max-w-4xl p-4 bg-white shadow-lg rounded-lg">
                    <div className="overflow-x-auto">
                        {(paginatedRows.length > 0) &&
                            <table className="min-w-full table-auto border-collapse text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head}
                                                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paginatedRows.length > 0 && paginatedRows.map((i) => (
                                        <tr
                                            key={i._id}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                {i.fechaInforme}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {i.fechaIni}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {i.fechaFin}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                <span
                                                    className={`cursor-pointer px-6 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                                                    onClick={() => { generarPDF(i); }}>
                                                    PDF
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap space-x-2 flex">
                                                <button
                                                    className="flex items-center text-red-600 hover:text-red-900"
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>}
                            {!(paginatedRows.length>0)&& <div className="flex justify-center items-center h-[300px]"> <h2 className="text-2xl text-gray-500">No hay informes para mostrar</h2></div>}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-4">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        className={`mx-1 px-3 py-1 text-sm ${currentPage === index + 1
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-700"
                                            } rounded`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InformePasado;
