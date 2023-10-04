import { Client as MqttClient } from "paho-mqtt";
import io from "socket.io-client";
const socket = io("http://172.20.10.11:3002", {
  cors: {
    origin: "http://172.20.10.11:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let mqttClient;

// kiểm tra xem bạn đang chạy trong môi trường trình duyệt hay Node.js
if (typeof window !== "undefined") {
  mqttClient = new MqttClient("172.20.10.11", 9001, "", "");
} else {
  const mqtt = require("mqtt");
  mqttClient = mqtt.connect("mqtt://172.20.10.11:1883");
}

mqttClient.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log("Kết nối MQTT bị mất:", responseObject.errorMessage);
  }
};

mqttClient.connect({
  onSuccess: () => {
    console.log("Kết nối MQTT thành công");
    mqttClient.subscribe("led1");
    mqttClient.subscribe("led2");
    mqttClient.subscribe("temperature");
    mqttClient.subscribe("humidity");
  },
  onFailure: (err) => {
    console.error("Kết nối MQTT thất bại:", err.errorMessage);
  },
});

socket.on("mqttData", (data) => {
  console.log("Received MQTT data update:", data);
});

mqttClient.onMessageArrived = (message) => {
  const topic = message.destinationName;
  const payload = message.payloadString;

  if (topic === "led1" || topic === "led2") {
    const ledState = payload;
    // Xử lý trạng thái LED ở đây
    console.log(`${topic.toUpperCase()} is ${ledState}`);
  }
};

let led1State = false;
let led2State = false;

function setupSocketListeners(callback) {
  mqttClient.onMessageArrived = (message) => {
    const topic = message.destinationName;
    if (topic === "led1") {
      const payload = message.payloadString;
      // Kiểm tra trạng thái hiện tại của led1 trước khi thay đổi
      if (payload === "on" && !led1State) {
        led1State = true;
        // Thực hiện điều khiển led1
        console.log("Turn on LED1");
        // Gọi callback nếu cần
        callback("led1", "on");
      } else if (payload === "off" && led1State) {
        led1State = false;
        // Thực hiện điều khiển led1
        console.log("Turn off LED1");
        // Gọi callback nếu cần
        callback("led1", "off");
      }
    } else if (topic === "led2") {
      const payload = message.payloadString;
      // Kiểm tra trạng thái hiện tại của led2 trước khi thay đổi
      if (payload === "on" && !led2State) {
        led2State = true;
        // Thực hiện điều khiển led2
        console.log("Turn on LED2");
        // Gọi callback nếu cần
        callback("led2", "on");
      } else if (payload === "off" && led2State) {
        led2State = false;
        // Thực hiện điều khiển led2
        console.log("Turn off LED2");
        // Gọi callback nếu cần
        callback("led2", "off");
      }
    }
  };
}

export function sendMqttLedCommand(topic, action) {
  mqttClient.send(topic, action);
}

export { setupSocketListeners };
