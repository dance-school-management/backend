import Expo from "expo-server-sdk";
import { RabbitMQConsumer } from "./rabbitmq/consumer";
import { RabbitmqProducer } from "./rabbitmq/producer";
import { createApp } from "./utils/createApp";
import { handleSendPushNotifications } from "./rabbitmq/handlers/handleSendPushNotifications";
import { SEND_PUSH_NOTIFICATION_QUEUE } from "./rabbitmq/queues";

const PORT = process.env.PORT || 8001;
const app = createApp();

export const expo = new Expo();

export const rmqProducer = new RabbitmqProducer();

const rmqConsumer = new RabbitMQConsumer();

rmqConsumer.consume(
  SEND_PUSH_NOTIFICATION_QUEUE,
  handleSendPushNotifications,
);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
