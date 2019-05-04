import express from "express";
import bodyParser from "body-parser";
import compression from "compression";

import UserRouter from "./routes/user";

import fpaTokenAuthenticator from "./helpers/fpaTokenMiddleware";

const port = process.env.PORT || 3000;
const app = express();

// initialize express third module
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

// initialize routes
app.use("/users", UserRouter);

app.post("/auth", fpaTokenAuthenticator, (req, res) => {
  console.log("!!!!");
  res.status(200).json({
    result: req.params,
  });
});

app.get("/", (_req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log("Server is now running at PORT: ", port);
});
