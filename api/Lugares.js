import { connectToDatabase } from './db';

export default async function Luagres(req, res) {
  try {
    const client = await connectToDatabase();
    const db = client.db("AplicacionInformeEmpleados");
    const collect = db.collection("lugares")


    if(req.method=="GET"){
      try {
        const { supervisorId}=req.query;
        const Lugares=await collect.find({supervisorId:supervisorId}).toArray();

        res.status(200).json({Lugares});
      } catch (error) {
        console.error('Error al traer lugares:', error);
        res.status(500).json({ error: 'Error al traer lugares' });
      }
     
    }

    else if(req.method=="POST"){
      try {
        const { nombre, direccion,precio,supervisorId } = req.body;
        if (!nombre || !direccion || !precio|| !supervisorId) res.status(400).json({ error: "faltan llenar campos" })

        const lugarExiste=await collect.findOne({nombre,supervisorId})

        if(lugarExiste){
            return res.status(400).json({ error: 'El lugar ya existe' });
        }

        const NuevoLugar = {nombre, direccion,precio,supervisorId }
            const resul =await collect.insertOne(NuevoLugar);
    
        return res.status(201).json({
              message: 'Lugar agregado exitosamente',
              empleadoId: resul.insertedId,
            });

    
      } catch (error) {
        console.error('Error al traer lugar:', error);
        res.status(500).json({ error: 'Error al traer lugar' });
      }
     
    }

    else if(req.method=="PUT"){
      try {
        const empleados= collect.find().toArray();
        res.status(200).json({empleados });
      } catch (error) {
        console.error('Error al traer empleados:', error);
        res.status(500).json({ error: 'Error al traer empleados' });
      }
     
    }

    else if(req.method=="DELETE"){
      try {
        const empleados= collect.find().toArray();
        res.status(200).json({empleados });
      } catch (error) {
        console.error('Error al traer empleados:', error);
        res.status(500).json({ error: 'Error al traer empleados' });
      }
     
    }

    
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
 
}
