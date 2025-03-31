import express from "express";

const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello ex-mic-1!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
