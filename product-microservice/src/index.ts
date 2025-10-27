import { createApp } from "./utils/createApp";
import { createGrpcServer } from "./grpc/server";
import { RabbitmqProducer } from "./rabbitmq/producer";
const PORT = process.env.PORT || 8001;
const app = createApp();

export const rmqProducer = new RabbitmqProducer();

createGrpcServer();
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
