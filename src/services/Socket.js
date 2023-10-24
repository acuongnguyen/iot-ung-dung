import { Client as MqttClient } from "paho-mqtt";
import io from "socket.io-client";
const socket = io("http://172.16.10.81:3002", {
  cors: {
    origin: "http://172.16.10.81:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let mqttClient;

if (typeof window !== "undefined") {
  mqttClient = new MqttClient("172.16.10.81", 9001, "", "");
} else {
  const mqtt = require("mqtt");
  mqttClient = mqtt.connect("mqtt://172.16.10.81:1883");
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
    mqttClient.subscribe("light");
    mqttClient.subscribe("dust");
  },
  onFailure: (err) => {
    console.error("Kết nối MQTT thất bại:", err.errorMessage);
  },
});

mqttClient.onMessageArrived = (message) => {
  const topic = message.destinationName;
  const payload = message.payloadString;

  if (topic === "led1" || topic === "led2") {
    const ledState = payload;
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
      if (payload === "on" && !led1State) {
        led1State = true;
        console.log("Turn on LED1");
        callback("led1", "on");
      } else if (payload === "off" && led1State) {
        led1State = false;
        console.log("Turn off LED1");
        callback("led1", "off");
      }
    } else if (topic === "led2") {
      const payload = message.payloadString;
      if (payload === "on" && !led2State) {
        led2State = true;
        console.log("Turn on LED2");
        callback("led2", "on");
      } else if (payload === "off" && led2State) {
        led2State = false;
        console.log("Turn off LED2");
        callback("led2", "off");
      }
    }
  };
}

export function sendMqttData(callback) {
  mqttClient.onMessageArrived = (message) => {
    const topic = message.destinationName;
    if(topic === "temperature"){
      const value = message.payloadString;
      callback("temperature", value);
      console.log(`${topic.toUpperCase()} have value ${value}`);
    } else if(topic === "humidity"){
      const value = message.payloadString;
      callback("humidity", value);
      console.log(`${topic.toUpperCase()} have value ${value}`);
    } else if(topic === "light" ) {
      const value = message.payloadString;
      callback("light", value);
      console.log(`${topic.toUpperCase()} have value ${value}`);
    }else if(topic === "dust"){
      const value = message.payloadString;
      callback("dust", value);
      console.log(`${topic.toUpperCase()} have value ${value}`);
    }
  }
}

export { setupSocketListeners };
