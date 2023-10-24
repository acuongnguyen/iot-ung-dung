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

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://172.16.10.81:3000",
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
          dust: result[0].dust,
        };
        res.json(mqttData);
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    }
  });
});
  
// //api lấy đữ liệu từ database hiển thị datasensor
app.get('/mqtt-data', (req, res) => {
  const { startDate, endDate, lastItemIndex, itemsPerPage, searchHour, searchMinute, searchSecond, searchTemperature, searchHumidity, searchLight } = req.query;
  const parsedLastItemIndex = parseInt(lastItemIndex, 10);
  const parsedItemsPerPage = parseInt(itemsPerPage, 10);
  const offset = parsedLastItemIndex;
  console.log("parsedLastItemIndex", parsedLastItemIndex, " itemsPerPage", parsedItemsPerPage);
  if (
    isNaN(parsedLastItemIndex) ||
    isNaN(parsedItemsPerPage) ||
    parsedLastItemIndex < 0 ||
    parsedItemsPerPage <= 0
  ) {
    res.status(400).json({ error: 'Invalid lastItemIndex or itemsPerPage' });
    return;
  }

  let sql;
  const params = [];
  const values = [parsedItemsPerPage, offset];

  if (startDate && endDate) {
    sql = 'SELECT * FROM sensor WHERE date >= ? AND date <= ?';
    params.push(startDate, endDate);
  } else {
    sql = 'SELECT * FROM sensor WHERE 1=1';
  }

  if (searchHour) {
    sql += ' AND HOUR(date) = ?'; 
    params.push(parseInt(searchHour, 10));
  }

  if (searchMinute) {
    sql += ' AND MINUTE(date) = ?'; 
    params.push(parseInt(searchMinute, 10));
  }

  if (searchSecond) {
    sql += ' AND SECOND(date) = ?'; 
    params.push(parseInt(searchSecond, 10));
  }

  if (searchTemperature) {
    sql += ' AND temperature = ?';
    params.push(parseFloat(searchTemperature));
  }
  
  if (searchHumidity) {
    sql += ' AND humidity = ?';
    params.push(parseFloat(searchHumidity));
  }
  
  if (searchLight) {
    sql += ' AND lux = ?';
    params.push(parseFloat(searchLight)); 
  }
  
  sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';

  params.push(parsedItemsPerPage, offset);

  database.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error querying MQTT SENSOR data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
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


//api lấy dữ liệu từ database hiển thị activity history
app.get('/led-data', (req, res) => {
  const { startDate, endDate } = req.query;
  let sql = "SELECT * FROM action ORDER BY timestamp DESC LIMIT 10000";
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