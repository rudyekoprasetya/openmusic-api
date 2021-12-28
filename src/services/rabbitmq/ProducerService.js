const amqp = require('amqplib');

const ProducerService = {
    sendMessage: async (queue, message) => {
        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        //buat channel
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, {
            durable: true,
        });

        //kirim pesan
        await channel.sendToQueue(queue, Buffer.from(message));

        setTimeout(() => {
            connection.close();
        }, 1000);
    },
};

module.exports = ProducerService;