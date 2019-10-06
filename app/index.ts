import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import http from "http";
import socketIO from "socket.io";
import clientIO from "socket.io-client";
import cors from "cors";

import UserRouter from "./routes/user";
import AuthRouter from "./routes/auth";
import OTIDRouter from "./routes/otid";
import ThirdParty from "./routes/thirdParty";

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// initialize express third module
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

io.of("/fpa").on("connection", socket => {
  socket.on("fpa_channel_join", data => {
    console.log("!!!!!!! fpa join: ", data);
    const channelId = data.channelId;
    socket.join(channelId);
  });
  socket.on("auth_send", msg => {
    console.log("!!!!!!!!!!!!!! auth_send", msg);
    io.to(msg.channelId).emit("broadcast", msg.response);
  });
});

// initialize routes
app.use((req, _res, next) => {
  (req as any).io = clientIO(`http://localhost:${port}/fpa`);
  next();
});
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/otid", OTIDRouter);
app.use("/third-party", ThirdParty);

app.get("/", (_req, res) => {
  res.send("hello world");
});

server.listen(port, () => {
  console.log("Server is now running at PORT: ", port);
});
