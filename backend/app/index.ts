import express from "express";
import bodyParser from "body-parser";

const port = process.env.PORT || 3000;
const app = express();

// initialize express third module
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialize routes
app.get("/", (_req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("Server is now running at PORT: ", port);
});
