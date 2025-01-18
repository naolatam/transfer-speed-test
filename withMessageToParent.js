const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const { randomBytes } = require("crypto");

// ws.js

parentPort.on("message", (message) => {
  if (message.node === "scrap") {
    let randomBytesToSend = randomBytes(Math.floor(Math.random() * 150556));
    parentPort.postMessage({
      node: "ws",
      data: Date.now(),
      n: message.n,
      bytesData: randomBytesToSend,
    });
  } else {
    parentPort.postMessage({
      start: message.data,
      end: Date.now(),
      data: Date.now() - message.data,
      n: message.n,
      bytesData: message.bytesData.length
    });
  }
});
