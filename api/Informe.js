import { connectToDatabase } from "./db";

export default async function Informe(req, res) {
    const client = await connectToDatabase();
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("informes");

    if (req.method === "GET") {
        try {
            const { supervisorId } = req.query;

            if (!supervisorId) {
                return res.status(400).json({ error: 'El campo supervisorId es obligatorio' });
            }

            // Buscar dentro del array "registros" por el supervisorId
            const informes = await collect.find({ "registros.supervisorId": supervisorId }).toArray();

            res.status(200).json({ informes });
        } catch (error) {
            console.error('Error al traer informes:', error);
            res.status(500).json({ error: 'Error al traer informes' });
        }
    } else {
        res.status(405).json({ error: "Método no permitido" });
    }
}
