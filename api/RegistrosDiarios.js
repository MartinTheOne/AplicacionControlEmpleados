import { connectToDatabase } from "./db";

export default async function RegistroDiarios(req, res) {

    const client = await connectToDatabase();
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("registroDiario");
    const collectEmpleados = db.collection("empleados");
    const collectLugares = db.collection("lugares");
    const collectInformes = db.collection("informes");

    if (req.method == "GET") {
        try {
            const { fechaIni, fechaFin } = req.query;      
            const query = {};
            if (fechaIni && fechaFin) {
                query.fecha = {
                    $gte: new Date(fechaIni),
                    $lte: new Date(fechaFin)
                };
            }

            const ObetenerRegistrosDiarios = await collect.find(query).toArray();

            const empleados = await collectEmpleados.find({
                documento: { $in: ObetenerRegistrosDiarios.map((r) => r.docEmpleado) },
            }).toArray();

            const lugares = await collectLugares.find({
                nombre: { $in: ObetenerRegistrosDiarios.map((l) => l.lugar) }
            }).toArray();

            const RegistrosDetallados= ObetenerRegistrosDiarios.map((r) => {
                const empleado=empleados.find(e=>e.documento==r.docEmpleado);
                const lugar=lugares.find(l=>l.nombre==r.lugar)

                return{
                    ...r,
                    empleado,
                    lugar
                }

            })
            if(!RegistrosDetallados.length>0){
                return res.status(404).json({ error: 'No se encontraron registros diarios' });
            }
            let fechaHoy=new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" })
            const informe = {
                fechaInforme: fechaHoy,
                fechaIni: fechaIni,
                fechaFin: fechaFin,
                registros: RegistrosDetallados,
            }
            const resul= await collectInformes.insertOne(informe)
            if(resul.insertedId){
                return res.status(200).json({ RegistrosDiarios: RegistrosDetallados });
            }
        } catch (error) {
            console.error('Error al traer registros diarios:', error);
            res.status(500).json({ error: 'Error al traer registros diarios' });
        }
    }
    if (req.method == "POST") {
        try {
            const { fecha, docEmpleado, horas, lugar, precioLugar,presentismo,boleto } = req.body;

            if (!fecha || !docEmpleado || !horas || !lugar) {
                return res.status(400).json({ error: 'Faltan datos' });
            }

            const convertirFecha = new Date(fecha);
            let total = parseFloat(horas) * parseFloat(precioLugar)
            const registroDiario = { fecha:convertirFecha, docEmpleado, horas, lugar, precioLugar, total, presentismo, boleto };
            const result = await collect.insertOne(registroDiario);

            res.status(201).json({ message: 'Registro diario guardado', id: result.insertedId });

        } catch (error) {
            console.error('Error al guardar registros diarios:', error);
            res.status(500).json({ error: 'Error al guardar registros diarios' });
        }
       
    }

}

