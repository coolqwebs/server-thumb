const cluster = require("cluster");
const express = require("express");

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const ports = [3000, 8080, 4000, 5000];
  for (let i = 0; i < ports.length; i++) {
    const worker = cluster.fork();
    worker.send({ port: ports[i] });
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  process.on("message", (msg) => {
    const app = express();

    app.get("/", (req, res) => {
      res.send(`Hello, I am on ${msg.port} port`);
    });

    app.listen(msg.port, () => {
      console.log(`Server is running on ${msg.port}`);
    });
  });

  console.log(`Worker ${process.pid} started`);
}
