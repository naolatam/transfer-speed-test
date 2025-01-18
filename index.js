const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");

if (isMainThread) {
  let data = { wssL: 0, wssN: 0, wssBytes: 0, pL: 0, pN: 0, pBytes: 0 };

  let withWss = new Worker(__filename, {
    workerData: { mode: "wss" },
  });

  withWss.on("message", (message) => {
    data.wssL = message.data;
    data.wssN = message.n;
    data.wssBytes = message.bytesCount

  });

  let withParent = new Worker(__filename, {
    workerData: { mode: "parent" },
  });
  withParent.on("message", (message) => {
    data.pL = message.data;
    data.pN = message.n;
    data.pBytes = message.bytesCount
  });

  setInterval(() => {
    console.log("\x1b[2J");
    console.log("\x1b[0;0H");
    console.log(
      `Latency with websocket: ${data.wssL} | number: ${data.wssN} | Bytes : ${formatBytes(data.wssBytes)}`
    );
    console.log(
      `Latency with parent: ${data.pL} | number: ${data.pN} | Bytes : ${formatBytes(data.pBytes)}`
    );
  }, 5 * 1000);
} else {
  if (workerData.mode == "wss") {
    const thread2 = new Worker("./withWs.js", { workerData: { node: "Wss" } });
    const thread1 = new Worker("./withWs.js");

    let delaySum = 0;
    let bytesSum = 0
    thread2.on("message", (message) => {
      delaySum += message.data;
      bytesSum += message.bytesData
      parentPort.postMessage({
        mode: workerData.mode,
        data: delaySum / message.n,
        n: message.n,
        bytesCount: bytesSum,
      });
    });
  }
  if (workerData.mode == "parent") {
    const thread1 = new Worker("./withMessageToParent.js"); // Websocket
    const thread2 = new Worker("./withMessageToParent.js"); // Scraper

    let delaySum = 0;
    let bytesSum = 0
    thread1.on("message", (message) => {
      delaySum += message.data;
      bytesSum += message.bytesData
      parentPort.postMessage({
        mode: workerData.mode,
        data: delaySum / message.n,
        n: message.n,
        bytesCount: bytesSum,
      });
      thread2.postMessage({ node: "scrap", n: message.n + 1 });
    });

    thread2.on("message", (message) => {
      thread1.postMessage(message);
    });

    thread2.postMessage({ node: "scrap", n: 0 });
  }
}


function formatBytes(bytes, decimals = 2) {
  if(!+bytes) return "0 Bytes"

  const k = 1024
  const dm = decimals
  const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB"]

  const i = Math.floor(Math.log(bytes)/ Math.log(k))
  return `${parseFloat((bytes/Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}