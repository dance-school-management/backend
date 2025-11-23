import amqp, { Channel, ChannelModel } from "amqplib";

import "dotenv/config";

export class RabbitMQConsumer {
  connection!: ChannelModel;
  channel!: Channel;
  private connected!: boolean;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await amqp.connect(
        `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}:${process.env.RMQ_PORT}`,
      );
      
      console.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();
      console.log(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
    }
  }

  async createQueue(queue: string) {
    const MAX_RETRIES = 5;
    let retries = 0;
    while (!this.channel && retries < MAX_RETRIES) {
      await this.connect();
      if (!this.channel) {
        retries++;
        if (retries >= MAX_RETRIES) {
          throw new Error(`Failed to create queue "${queue}" after ${MAX_RETRIES} attempts to connect to RabbitMQ.`);
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }

    await this.channel.assertQueue(queue, {
      durable: true,
    });

    console.log(`✅ Queue "${queue}" has been created!`);
  }

  async consume(
    queue: string,
    handleIncomingNotification: (msg: string) => any,
  ) {
    if (!this.channel) {
      await this.connect();
    }

    await this.createQueue(queue);

    this.channel.consume(
      queue,
      (msg) => {
        console.log("Message received");
        if (!msg) {
          return console.error(`Invalid incoming message`);
        }
        handleIncomingNotification(msg?.content?.toString());
        this.channel.ack(msg);
      },
      {
        noAck: false,
      },
    );
  }
}
