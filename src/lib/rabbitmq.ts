import { env } from '$env/dynamic/private';
import amqp from 'amqplib';

let { RABBITMQ_URL } = env;
RABBITMQ_URL = RABBITMQ_URL || 'amqp://localhost';

export async function postToQueue(queueName: string, message: string): Promise<void> {
	try {
		// Create a connection to RabbitMQ
		const connection = await amqp.connect(RABBITMQ_URL);

		// Create a channel
		const channel = await connection.createChannel();

		// Make sure the queue exists
		await channel.assertQueue(queueName, { durable: true });

		// Send the message
		channel.sendToQueue(queueName, Buffer.from(message));

		console.log(`Message sent to queue ${queueName}: ${message}`);

		// Close the channel and connection
		await channel.close();
		await connection.close();
	} catch (error) {
		console.error('Error posting message to RabbitMQ:', error);
		throw error;
	}
}
