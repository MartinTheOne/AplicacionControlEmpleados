import { connectToDatabase } from "./db";


export default  async function Informe (req, res) {

    const client = await connectToDatabase();
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("informes");

    if (req.method == "GET") {
        try {
            const informes = await collect.find().toArray();
            res.status(200).json({ informes });
        } catch (error) {
            console.error('Error al traer informes:', error);
            res.status(500).json({ error: 'Error al traer informes' });
        }
       
    }

}