import { connectToDatabase } from './db';

export default async function Empleados(req, res) {
  try {
    const client = await connectToDatabase();
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("empleados")


    if (req.method == "GET") {
      try {
        const Empleados = await collect.find().toArray();
        res.status(200).json({ Empleados });
      } catch (error) {
        console.error('Error al traer empleados:', error);
        res.status(500).json({ error: 'Error al traer empleados' });
      }

    }

    else if (req.method == "POST") {
      try {
        const { documento, nombre } = req.body;
        
        if (!nombre || !documento) {
          return res.status(400).json({ error: "Faltan llenar campos" });
        }
      
        const empleadoExiste = await collect.findOne({ documento });
        if (empleadoExiste) {
          return res.status(400).json({ error: 'Empleado con este documento ya existe' });
        }
      
        const nuevoEmpleado = { documento, nombre };
        const resul = await collect.insertOne(nuevoEmpleado);
      
        return res.status(201).json({
          message: 'Empleado agregado exitosamente',
          empleadoId: resul.insertedId,
        });
      } catch (error) {
        console.error('Error al agregar empleado:', error);
        res.status(500).json({ error: 'Error al agregar empleado' });
      }      
    }

    else if (req.method == "PUT") {
      try {
        const empleados = collect.find().toArray();
        res.status(200).json({ empleados });
      } catch (error) {
        console.error('Error al traer empleados:', error);
        res.status(500).json({ error: 'Error al traer empleados' });
      }

    }

    else if (req.method == "DELETE") {
      try {
        const empleados = collect.find().toArray();
        res.status(200).json({ empleados });
      } catch (error) {
        console.error('Error al traer empleados:', error);
        res.status(500).json({ error: 'Error al traer empleados' });
      }

    }


  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
  
}
