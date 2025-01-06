const { MongoClient } = require('mongodb');

// URI de conexión (asegúrate de que esté en tu archivo .env o reemplázala directamente aquí)
const uri = 'xd';

// Crear un cliente
const client = new MongoClient(uri);

(async () => {
  try {
    // Intentar conectar
    await client.connect();
    console.log('✅ Conexión exitosa a MongoDB Atlas');

    // Probar acceso a una base de datos y colección
    const database = client.db('test'); // Cambia 'test' por el nombre de tu base de datos
    const collection = database.collection('example'); // Cambia 'example' por el nombre de una colección

    // Insertar un documento de prueba
    const result = await collection.insertOne({ mensaje: 'Hola, MongoDB!' });
    console.log('✅ Documento insertado:', result.insertedId);

    // Leer el documento
    const document = await collection.findOne({ _id: result.insertedId });
    console.log('✅ Documento recuperado:', document);
  } catch (error) {
    console.error('❌ Error al conectar o realizar operaciones con MongoDB:', error);
  } finally {
    // Cerrar la conexión
    await client.close();
    console.log('🔌 Conexión cerrada');
  }
})();
