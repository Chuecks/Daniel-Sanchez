const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const COLA_MENSAJES = 'mensajes_daniel';

async function conectarRabbitMQ() {
    try {
        const conexion = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const canal = await conexion.createChannel();
        await canal.assertQueue(COLA_MENSAJES, { durable: true });
        return canal;
    } catch (error) {
        console.error('Error conectando a RabbitMQ:', error);
        throw error;
    }
}

app.post('/enviar-mensaje', async (req, res) => {
    try {
        const { nombre, email, mensaje } = req.body;
        const canal = await conectarRabbitMQ();
        
        const contenidoMensaje = JSON.stringify({
            nombre,
            email,
            mensaje,
            fecha: new Date().toISOString()
        });

        canal.sendToQueue(COLA_MENSAJES, Buffer.from(contenidoMensaje), {
            persistent: true
        });

        res.json({ mensaje: 'Mensaje enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Error al enviar mensaje' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
}); 