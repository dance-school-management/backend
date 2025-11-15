import { createApp } from "./utils/createApp";
import { createGrpcServer } from "./grpc/server";
import { RabbitMQConsumer } from "./rabbitmq/consumer";
import { ENROLL_STUDENTS_AND_INSTRUCTOR_IN_PRIVATE_CLASS_QUEUE } from "./rabbitmq/queues";
import { EnrollStudentsAndInstructorInPrivateClass } from "./rabbitmq/handlers/enrollStudentsAndInstructorInPrivateClass";
const PORT = process.env.PORT || 8001;
const app = createApp();

const rmqConsumer = new RabbitMQConsumer();

rmqConsumer.consume(
  ENROLL_STUDENTS_AND_INSTRUCTOR_IN_PRIVATE_CLASS_QUEUE,
  EnrollStudentsAndInstructorInPrivateClass,
);

createGrpcServer();
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
