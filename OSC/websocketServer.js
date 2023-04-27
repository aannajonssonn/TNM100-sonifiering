const express = require("express");
const WebSocket = require("ws");
const fs = require('fs');
const url = require('url');
const path = require("path");
const http = require("http");
const ChildProcess = require("child_process");
const _ = require('underscore');
const bodyParser = require("body-parser");

const cors = require('cors')

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "public");

const app = express().use(express.static(PUBLIC));
app.use(bodyParser.json());
app.use(cors())

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
var osc = require("osc");

var udpPort = new osc.UDPPort({
  // This is the port we're listening on.
  localAddress: "127.0.0.1",
  localPort: 57121,

  // This is where sclang is listening for OSC messages.
  remoteAddress: "127.0.0.1",
  remotePort: 57120,
  metadata: true
});

// Open the socket.
udpPort.open();

wss.on("connection", ws => {
  // Send data to websocket client(s)
  ws.send(123);

  // Log data received from client(s)
  ws.on("message", message => {
    data = JSON.parse(message);
    //console.log(Object.keys(data));

    if (Object.keys(data) == "dataset") {
      console.log(data);

      var msg = {
        address: "/dataset",

        args: [
          {
            type: "s",
            value: data.dataset.dataset

          }
        ]
      }
    }

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
  });
});

// Listen for requests
server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});