import { ObjectId } from "mongodb";
import { connectToDatabase } from "./db";
import bcrypt from 'bcrypt';

export default async function Usuarios(req, res) {
    try {

        const client=await connectToDatabase();
        const db=client.db("AplicacionInformeEmpleados")
        const collect=db.collection("usuarios")
        
        if (req.method === "GET") {
            try {
                const usuarios = await collect
                .find({}, { projection: { password: 0 } }) 
                .toArray();
                 res.status(200).json({usuarios})
            } catch (error) {
                console.log(error)
                res.status(500).json({error})
            }
        }
    
        else if(req.method==="POST"){
            try {
                const {user,correo,password,role}=req.body;
                
                if(!user||!password||!role||!correo)return res.status(400).json({error:"Faltan datos"})

                const usuarioExiste=await collect.findOne({correo});
                if(usuarioExiste)
                    {
                        return res.status(401).json({ error: 'El lugar ya existe' });
                    } 

                const contrasenaEncrip=await encriptarContrasena(password)
                const usuario={user,correo,password:contrasenaEncrip,role}
                await collect.insertOne(usuario)
    
                res.status(201).json({message:"empleado guardado"})
            } catch (error) {
               res.status(500).json({error})
            }
        }
    
        else if(req.method==="PUT"){
            try {          
                const {usuarioId,...cambios}=req.body;
                if(!usuarioId)return res.status(400).json({error:"Faltan datos"})
        
                const id=ObjectId.createFromHexString(usuarioId)
        
                const editar=await collect.updateOne(
                  {_id:id},
                  {$set:cambios}
                )
                if(editar.matchedCount===0)return res.status(400).json({error:"usuario no encontrado"});
        
                res.status(200).json({message:"usuario actualizado con exito!"})
            } catch (error) {
                res.status(500).json({error})
            }
        }
    
        else if(req.method==="DELETE"){
    
            try {
                const {usuarioId}=req.query;
                if(!usuarioId)return res.status(400).json({error:"Faltan datos"})
                const id=ObjectId.createFromHexString(usuarioId)
        
                const borrar=await collect.deleteOne({_id:id})
    
                if(borrar.deletedCount){
                    return res.status(200).json({message:"empleado borrado"})
                }
                else{
                    res.status(400).json({error:"no se encontro al empleado"})
                }
            } catch (error) {
                res.status(500).json({error})
            }
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
   
}

async function encriptarContrasena(contrasena){
    const salt=await bcrypt.genSalt(12)
    const hash=await bcrypt.hash(contrasena,salt)
    return hash;
}