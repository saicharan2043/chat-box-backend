const express = require("express");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");
const app = express();

dotenv.config({
  path: "./data/config.env",
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://live-chatting-app.netlify.app",
  },
});

// Socket.oi
io.on("connection", (socket) => {
  socket.on("user-details", (userdetails) => {
    userdetails["socketId"] = socket.id;
    userdetails["msg"] = userdetails.username + " joined";
    socket.broadcast.emit("new-user", userdetails);
    socket.on("disconnect", () => {
      userdetails["msg"] = userdetails.username + " disconnected";
      socket.broadcast.emit("disconnect-user", userdetails);
    });
  });
  socket.on("send-massage", (massage) => {
    socket.broadcast.emit("receive-msg", massage);
  });
});

app.get("/", (req, resp) => {
  resp.sendFile("./index.html", { root: __dirname });
});

server.listen(process.env.PORT, () =>
  console.log(`server is running port ${process.env.PORT}`)
);
