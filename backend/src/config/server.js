const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server: SocketIoServer } = require("socket.io");
const app = express();
const mqttClient = require("./mqtt");
const database = require("./database");
const router = require("../routes/routes");
const { formatTimestamp } = require("../utils/utils"); 

const port = process.env.PORT || 3002;
const server = http.createServer(app);
const io = new SocketIoServer(server);

// Middleware để phân tích dữ liệu JSON từ các yêu cầu POST
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://172.20.10.11:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

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
  database.query(sql, (err, result) => {
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
  
//api lấy đữ liệu từ database hiển thị datasensor
app.get('/mqtt-data', (req, res) => {
  const { startDate, endDate } = req.query;
  let sql = "SELECT * FROM sensor ORDER BY date DESC LIMIT 1000";
  
  if (startDate && endDate) {
    sql = `
    SELECT * FROM sensor WHERE date >= ? AND date <= ? ORDER BY date DESC LIMIT 1000
  `;
    database.query(sql, [startDate, endDate], (err, result) => {
      if (err) {
        console.error("Lỗi truy vấn DATA SENSOR MQTT:", err);
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
  } else {
    database.query(sql, (err, result) => {
      if (err) {
        console.error("Lỗi truy vấn DATA SENSOR MQTT:", err);
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
  }
});

//api lấy dữ liệu từ database hiển thị activity history
app.get('/led-data', (req, res) => {
  const { startDate, endDate } = req.query;
  let sql = "SELECT * FROM action ORDER BY timestamp DESC LIMIT 100";
  if (startDate && endDate) {
    sql = `
    SELECT * FROM action WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp  DESC LIMIT 1000
  `;
    database.query(sql, [startDate, endDate], (err, result) => {
      if (err) {
        console.error("Lỗi truy vấn DATA LED MQTT:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const ledData = result.map((row) => ({
          id: row.id,
          idss: row.idss,
          date: formatTimestamp(row.timestamp),
          state: row.state,
        }));
        res.json(ledData);
      }
    });
  } else { 
    database.query(sql, (err, result) => {
    if (err) {
      console.error("Lỗi truy vấn DATA LED MQTT:", err);
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
  }
});

module.exports = { app };