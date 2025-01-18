const { Server, WebSocket } = require("ws");
const { parentPort, isMainThread, workerData } = require("worker_threads");
const { randomBytes } = require("crypto");

if (workerData && workerData.node == "Wss") {
  const wss = new Server({ port: 1514 });
  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      message = JSON.parse(message.toString());
      let data = {
        start: message.data,
        end: Date.now(),
        data: Date.now() - message.data,
        n: message.n,
        bytesData: message.bytesData.data.length
      };
      parentPort.postMessage(data);
      ws.send(data.n + 1);
    });
  });
} else {
  const ws = new WebSocket("ws://localhost:1514");
  ws.on("open", function open() {
    let randomDataToSend = randomBytes(Math.floor(Math.random()*150556))
    ws.send(JSON.stringify({ data: Date.now(), n: 0, bytesData: randomDataToSend}));
  });
  ws.on("message", function incoming(data) {
    let randomDataToSend = randomBytes(Math.floor(Math.random()*150556))
    ws.send(JSON.stringify({ data: Date.now(), n: parseInt(data.toString()), bytesData: randomDataToSend}));
  });
}
