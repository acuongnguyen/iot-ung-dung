const { connect: MqttClient } = require("mqtt");
// Tạo kết nối tới MQTT Broker sử dụng Paho MQTT
const mqttClient = MqttClient("ws://172.20.10.11:9001");
const database = require("./database");

// hàm thêm mới trạng thái đèn vào db
function updateLedStateInDatabase(topic, action) {  
  const sql =
    "INSERT INTO action (idss, state, timestamp) VALUES (?, ?, NOW())";
  const values = [topic, action];
  database.query(sql, values, (err) => {
    if (err) {
      console.error(`Lỗi cập nhật trạng thái đèn (${topic}):`, err);
    } else {
      console.log(
      `Đã cập nhật trạng thái đèn (${topic}) trong cơ sở dữ liệu.`
      );
    }
  });    
}
  
//hàm thêm mới dữ liệu cảm biến vào db
function insertDataSSInDatabase(temperature, humidity, light) {
  const sql =
    "INSERT INTO sensor (idss, date, temperature, humidity, lux) VALUES (?, NOW(), ?, ?, ?)";
    const values = ["DHT11", temperature, humidity, light];
  
    database.query(sql, values, (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật dữ liệu MQTT vào cơ sở dữ liệu:", err);
    } else {
      console.log("Đã cập nhật dữ liệu MQTT vào cơ sở dữ liệu.");
    }
  });
}

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
module.exports =  mqttClient ;