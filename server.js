const http = require("http");
const { Server } = require("socket.io");

const PORT = 3000;

console.log("Hello World");
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Listen on the specified port
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
  const auth = socket.handshake.auth;
  console.log(auth.token);
  if (auth.token === "JetsonNanoNodeClientToken") {
    //valid nodeClient
    socket.join("nodeClient"); //this client is a nodeClient, put in appropriate room
  } else if (auth.token === "webDashboardClientToken") {
    //valid reactClient
    socket.join("reactClient"); //this client is a reactClient, put in appropriate room
  } else {
    //you do not belong here. Go away!
    socket.disconnect();
    console.log("YOU HAVE BEEN DISCONNECTED!!!");
  }
  console.log(`Someone connected with the ID: ${socket.id}`);
  socket.emit("welcome", "Welcome to our socket.io server!");

  socket.on("sensorData", (data) => {
    io.to("reactClient").emit("sensorData", data);
    console.log(data);
  });

  socket.on("control-instructions", (data) => {
    io.to("nodeClient").emit("control-instructions", data);
    console.log(data);
  });

  socket.on("disconnect", (reason) => {
    //a nodeClient just disconnected. Let the front end know!
    // io.to("reactClient").emit("connectedOrNot", {
    //   machineMacA,
    //   isAlive: false,
    // });
    console.log(`Someone disconnected with the ID: ${socket.id}`);
  });
});
