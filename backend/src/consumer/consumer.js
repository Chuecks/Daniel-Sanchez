const amqp = require('amqplib');
const nodemailer = require('nodemailer');

const COLA_MENSAJES = 'mensajes_daniel';

// Configura el transporte de email con Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

async function enviarEmail(contenido) {
    const mailOptions = {
        from: process.env.GMAIL_USER,          // Tu Gmail
        to: 'danysol99@hotmail.com',       // El Outlook de tu padre
        subject: `Nuevo mensaje de ${contenido.nombre}`,
        html: `
            <h2>Has recibido un nuevo mensaje</h2>
            <p><strong>De:</strong> ${contenido.nombre}</p>
            <p><strong>Email:</strong> ${contenido.email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${contenido.mensaje}</p>
            <p><strong>Fecha:</strong> ${new Date(contenido.fecha).toLocaleString()}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente');
        return true;
    } catch (error) {
        console.error('Error al enviar email:', error);
        return false;
    }
}

async function consumirMensajes() {
    try {
        const conexion = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const canal = await conexion.createChannel();
        
        // Configuración básica de la cola
        await canal.assertQueue(COLA_MENSAJES, { 
            durable: true
        });
        
        // Procesar solo un mensaje a la vez
        canal.prefetch(1);

        console.log('Esperando mensajes...');

        canal.consume(COLA_MENSAJES, async (mensaje) => {
            if (mensaje !== null) {
                try {
                    const contenido = JSON.parse(mensaje.content.toString());
                    console.log('Mensaje recibido:');
                    console.log('De:', contenido.nombre);
                    console.log('Email:', contenido.email);
                    console.log('Mensaje:', contenido.mensaje);
                    
                    // Solo confirmar el mensaje después de enviar el email exitosamente
                    const emailEnviado = await enviarEmail(contenido);
                    if (emailEnviado) {
                        canal.ack(mensaje);
                    } else {
                        // Si falla el envío, rechazar el mensaje para que vuelva a la cola
                        canal.nack(mensaje, false, true);
                    }
                } catch (error) {
                    console.error('Error procesando mensaje:', error);
                    canal.nack(mensaje, false, true);
                }
            }
        });
    } catch (error) {
        console.error('Error en el consumidor:', error);
    }
}

consumirMensajes(); 