import axios from "axios";

const api = axios.create({
  baseURL: "http://172.16.10.81:3002",
});

export const controlLed = (topic, action) => {
  return api.post("/led", { topic, action });
};

export async function getMqttDataFromBackend() {
  try {
    const response = await api.get("/mqtt-data-db");
    const mqttData = response.data;
    return mqttData;
  } catch (error) {
    console.error("Error fetching MQTT data from backend 1:", error);
    throw error;
  }
}

export async function getSSDataFromBackend(startDate, endDate, itemsPerPage, lastItemIndex, searchHour, searchMinute, searchSecond, searchTemperature, searchHumidity, searchLight) {
  try {
    const queryParams = { itemsPerPage, lastItemIndex, searchHour, searchMinute, searchSecond, searchTemperature, searchHumidity, searchLight };
    console.log("lastItemIndex: ", lastItemIndex, " ItemsPerPage: ",itemsPerPage)
    if (startDate && endDate) {
      queryParams.startDate = startDate;
      queryParams.endDate = endDate;
    }
    console.log("startDate: ", startDate, " ", "endDate: ", endDate, "apiService");
    const response = await api.get("/mqtt-data", { params: queryParams });
    const ssData = response.data;
    return ssData;
  } catch (error) {
    console.error("Error fetching MQTT SENSOR data from backend:", error);
    throw error;
  }
}

export async function getLedDataFromBackend(startDate, endDate) {
  try {
    const queryParams = {};
    if (startDate && endDate) {
      queryParams.startDate = startDate;
      queryParams.endDate = endDate;
    }
    const response = await api.get("/led-data", { params: queryParams });
    const ledData = response.data;
    return ledData;
  } catch (error) {
    console.error("Error fetching MQTT LED state data from backend:", error);
    throw error;
  }
}
