const path = require('path');
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const { Server } = require("socket.io");

app.use(express.static(path.resolve(__dirname, 'dzudo-client/build')));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dzudo-client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const socketIO = new Server({
  maxHttpBufferSize: 100000000,
  cors: {
    origin: "http://localhost:3000"
  }
});

socketIO.on('connection', (socket) => {
  console.log('a user connected');
});

socketIO.listen(4000);
