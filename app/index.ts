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

io.of("/fpa").on("connection", socket => {
  socket.on("fpa_channel_join", data => {
    // SDK가 서버로부터 받은 channelId의 챗방에 접속
    socket.join(data.channelId);
  });

  socket.on("auth_send", msg => {
    // 유저가 지문인식후 결과을 전송 했을때 챗방에 재전송함
    socket.to(msg.channelId).emit("auth_send", msg);
  });
});

// initialize express third module
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use((req, _res, next) => {
  (req as any).io = clientIO(`http://localhost:${port}/fpa`);
  next();
});

// initialize routes
app.use("/users", UserRouter);
app.use("/auth", AuthRouter);
app.use("/otid", OTIDRouter);
app.use("/third-party", ThirdParty);

app.get("/", (_req, res) => {
  res.send("hello world");
});


// server run
server.listen(port, () => {
  console.log("Server is now running at PORT: ", port);
});
