import { createApp } from "./utils/createApp";
const PORT = process.env.PORT || 8001;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
