import { createServer } from "http";
import { Server, Socket } from "socket.io";
import express from "express";
import path from "path";

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

io.on("error", () => {
  console.log("error");
});

io.on("connection", (socket: Socket) => {
  // Player events
  socket.on("join_room", (id) => {
    socket.join(id);
  });

  socket.on("play", (id) => {
    socket.to(id).emit("play_socket");
  });

  socket.on("pause", (id) => {
    socket.to(id).emit("pause_socket");
  });

  socket.on("seeked", (id, currentTime) => {
    socket.to(id).emit("seeked_socket", currentTime);
  });

  // Chat events
  socket.on("message", (id, data) => {
    socket.to(id).emit("message_socket", data);
  });
});

httpServer.listen(process.env.PORT || 3001);
