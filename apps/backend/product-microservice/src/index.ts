import { createApp } from "./utils/createApp";
const PORT = process.env.PORT;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
