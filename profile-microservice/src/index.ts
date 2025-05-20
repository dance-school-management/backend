import { createApp } from "./utils/createApp";
import { createGrpcServer } from "./grpc/productServer";
const PORT = process.env.PORT || 8001;
const app = createApp();

createGrpcServer();
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
