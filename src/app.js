const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 8000;

// Conexión a la base de datos MongoDB
const uri = 'mongodb+srv://camilo:bLnRuVtBKoXsczqd@cluster0.ffmtk6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Ruta para guardar datos JSON
app.post('/', async (req, res) => {
    try {
        const json_data = req.body;

        // Conexión a la base de datos
        await client.connect();
        const db = client.db('Cluster0');
        const collection = db.collection('data');

        // Eliminar todos los documentos anteriores en la colección
        await collection.deleteMany({});

        // Insertar los datos JSON en la colección de MongoDB
        const result = await collection.insertOne(json_data);

        res.json({ message: 'JSON data saved successfully', inserted_id: result.insertedId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        // Cerrar la conexión con la base de datos
        await client.close();
    }
});

// Ruta para obtener datos JSON
app.get('/', async (req, res) => {
    try {
        // Conexión a la base de datos
        await client.connect();
        const db = client.db('Cluster0');
        const collection = db.collection('data');

        // Obtener todos los documentos de la colección
        const cursor = collection.find({});
        const json_data = await cursor.toArray();

        res.json(json_data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        // Cerrar la conexión con la base de datos
        await client.close();
    }
});

// Escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
