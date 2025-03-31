import express from "express";

const app = express();
const port = 8001;

app.get("/", (req, res) => {
  res.send("Hello ex-mic-2!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
