import amqp, { Channel, ChannelModel } from "amqplib";

export class RabbitmqProducer {
  connection!: ChannelModel;
  channel!: Channel;
  private connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await amqp.connect(
        `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@rabbitmq:5672`,
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
    if (!this.channel) {
      await this.connect()
    }

    await this.channel.assertQueue(queue, {
      durable: true
    })

    console.log(`✅ Queue "${queue}" has been created!`);
  }

  async sendToQueue(queue: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.createQueue(queue)

      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
