import { createApp } from "./utils/createApp";
const PORT = process.env.PORT || 8002;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
