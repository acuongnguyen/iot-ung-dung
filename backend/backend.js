const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const http = require("http");
const { Server: SocketIoServer } = require("socket.io");
const { connect: MqttClient } = require("mqtt");

const app = express();
// Middleware để phân tích dữ liệu JSON từ các yêu cầu POST
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://172.20.10.7:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
const port = process.env.PORT || 3002;

// Tạo một máy chủ HTTP mới
const server = http.createServer(app);

// Kết nối tới MQTT Broker sử dụng Paho MQTT
const mqttClient = MqttClient("ws://172.20.10.7:9001");

// Kết nối đến cơ sở dữ liệu MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Cuong668@",
  database: "iot",
});

db.connect((err) => {
  if (err) {
    console.error("Error Connect", err);
  } else {
    console.log("Connected MySQL.");
  }
});

// tạo một máy chủ WebSocket
const io = new SocketIoServer(server);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT Broker");
  mqttClient.subscribe("led1");
  mqttClient.subscribe("led2");
  mqttClient.subscribe("temperature");
  mqttClient.subscribe("humidity");
  mqttClient.subscribe("light");
});

mqttClient.on("error", (err) => {
  console.error("MQTT Error:", err);
});

let dataMqtt = {
  temperature: null,
  humidity: null,
  light: null,
};

mqttClient.on("message", (topic, message) => {
  if (topic === "temperature") {
    console.log(`${topic}: ${message.toString()}`);
    dataMqtt.temperature = message.toString();
  } else if (topic === "humidity") {
    console.log(`${topic}: ${message.toString()}`);
    dataMqtt.humidity = message.toString();
  } else if (topic === "light") {
    console.log(`${topic}: ${message.toString()}`);
    dataMqtt.light = message.toString();
  } else if (topic === "led1" || topic === "led2") {
    console.log(`${topic}: ${message.toString()}`);
    const ledState = message.toString();
    // io.emit("mqttData", { topic, ledState });
    console.log(ledState, `${topic}`);
    updateLedStateInDatabase(topic, ledState);
  }
  if (
    dataMqtt.temperature !== null &&
    dataMqtt.humidity !== null &&
    dataMqtt.light !== null
  ) {
    // lưu
    insertDataSSInDatabase(
      dataMqtt.temperature,
      dataMqtt.humidity,
      dataMqtt.light
    );
    dataMqtt.temperature = null;
    dataMqtt.humidity = null;
    dataMqtt.light = null;
  }
});

// api để bật tắt LED
app.post("/led", (req, res) => {
  const { topic, action } = req.body;

  if (topic === "led1" || topic === "led2") {
    if (action === "on" || action === "off") {
      mqttClient.publish(topic, action);
      // Gửi thông tin LED qua WebSocket khi thay đổi
      // io.emit("ledState", { topic, action });
      res.send(`${topic} turned ${action}`);
    } else {
      res.status(400).send("Error Action");
    }
  } else {
    res.status(400).send("Error Topic");
  }
});

// api để lấy dữ liệu MQTT từ cơ sở dữ liệu và trả về cho FE
app.get("/mqtt-data-db", (req, res) => {
  const sql = "SELECT * FROM sensor ORDER BY date DESC LIMIT 1";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu MQTT:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.length > 0) {
        const databaseTime = result[0].date;
        const dateTime = new Date(databaseTime);
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const seconds = dateTime.getSeconds();
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        const mqttData = {
          time: formattedTime,
          temperature: result[0].temperature,
          humidity: result[0].humidity,
          light: result[0].lux,
        };
        res.json(mqttData);
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    }
  });
});

//api lấy đữ liệu từ db hiển thị datasensor
app.get("/mqtt-data", (req, res) => {
  const sql = "SELECT * FROM sensor ORDER BY date DESC LIMIT 100";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu MQTT:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const mqttData = result.map((row) => ({
        id: row.id,
        idss: row.idss,
        date: formatTimestamp(row.date),
        temperature: row.temperature,
        humidity: row.humidity,
        light: row.lux,
      }));
      res.json(mqttData);
    }
  });
});

//api lấy dữ liệu từ db hiển thị activity history
app.get("/led-data", (req, res) => {
  const sql = "SELECT * FROM action ORDER BY timestamp DESC LIMIT 100";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const ledData = result.map((row) => ({
        id: row.id,
        idss: row.idss,
        state: row.state,
        date: formatTimestamp(row.timestamp),
      }));
      res.json(ledData);
    }
  });
});

// hàm thêm mới trạng thái đèn vào db
function updateLedStateInDatabase(topic, action) {
  const ledId = topic === "led1" ? 1 : topic === "led2" ? 2 : null;

  if (ledId !== null) {
    const sql =
      "INSERT INTO action (idss, state, timestamp) VALUES (?, ?, NOW())";
    const values = [ledId, action];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Lỗi cập nhật trạng thái đèn (${topic}):`, err);
      } else {
        console.log(
          `Đã cập nhật trạng thái đèn (${topic}) trong cơ sở dữ liệu.`
        );
      }
    });
  }
}

//hàm thêm mới dữ liệu cảm biến vào db
function insertDataSSInDatabase() {
  const sql =
    "INSERT INTO sensor (idss, date, temperature, humidity, lux) VALUES (?, NOW(), ?, ?, ?)";
  const values = [
    "DHT11",
    dataMqtt.temperature,
    dataMqtt.humidity,
    dataMqtt.light,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật dữ liệu MQTT vào cơ sở dữ liệu:", err);
    } else {
      console.log("Đã cập nhật dữ liệu MQTT vào cơ sở dữ liệu.");
    }
  });
}
// hàm định dạng lại ngày giờ
function formatTimestamp(timestamp) {
  const dateObject = new Date(timestamp);
  const formattedDate = `${dateObject.getFullYear()}-${(
    dateObject.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateObject
      .getDate()
      .toString()
      .padStart(2, "0")} ${dateObject
        .getHours()
        .toString()
        .padStart(2, "0")}:${dateObject
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${dateObject.getSeconds().toString().padStart(2, "0")}`;
  return formattedDate;
}

// khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
