import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "../styles/style.css";
import { useDispatch, useSelector } from "react-redux";
import { addDataPoint } from "../utils/actions";
import { getMqttDataFromBackend } from "../services/apiService";

function ChartComponent({ updateData }) {
  const dispatch = useDispatch();

  const chartData = useSelector((state) => state.chartData);

  useEffect(() => {
    const intervalId = setInterval(updateDataAndLabels, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getCurrentTimeLabel = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  const updateDataAndLabels = async () => {
    try {
      const mqttData = await getMqttDataFromBackend();
      const currentTimeLabel = getCurrentTimeLabel();
      updateData(mqttData.temperature, mqttData.humidity, mqttData.light);
      const newDataPoint = {
        // time: currentTimeLabel,
        time: mqttData.time,
        temperature: mqttData.temperature,
        humidity: mqttData.humidity,
        light: mqttData.light,
      };

      dispatch(addDataPoint(newDataPoint));

      console.log("Received MQTT data from backend:", mqttData);
    } catch (error) {
      console.error("Error fetching MQTT data from backend:", error);
    }
  };

  return (
    <div id="chart">
      <div id="chartComponent">
        <LineChart
          width={800}
          height={400}
          data={chartData}
          margin={{ right: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            interval="preserveEnd"
          />
          <YAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="temperature"
            name="Nhiệt độ"
            stroke="rgba(255, 99, 132, 1)"
            fill="rgba(255, 99, 132, 0.2)"
          />
          <Line
            type="monotone"
            dataKey="humidity"
            name="Độ ẩm"
            stroke="rgba(54, 162, 235, 1)"
            fill="rgba(54, 162, 235, 0.2)"
          />
          <Line
            type="monotone"
            dataKey="light"
            name="Ánh sáng"
            stroke="rgba(245, 230, 83, 1)"
            fill="rgba(255, 249, 222, 1)"
          />
        </LineChart>
      </div>
    </div>
  );
}

export default ChartComponent;
