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
import { sendMqttData } from "../services/Socket";

function ChartComponent({ updateData, lines}) {
  const dispatch = useDispatch();

  const chartData = useSelector((state) => state.chartData);
  useEffect(() => {
    const mqttData = {
      temperature: null,
      humidity: null,
      light: null,
      dust: null,
    };
    sendMqttData((topic, value) => {
      console.log("socket được gọi");
      if (topic === "temperature" || topic === "humidity" || topic === "light" || topic === "dust") {
        mqttData[topic] = value;
        if (mqttData.temperature !== null && mqttData.humidity !== null && mqttData.light !== null && mqttData.dust !== null) {
          const currentTimeLabel = getCurrentTimeLabel();
          updateData(mqttData.temperature, mqttData.humidity, mqttData.light, mqttData.dust);
          const newDataPoint = {
            time: currentTimeLabel,
            temperature: mqttData.temperature,
            humidity: mqttData.humidity,
            light: mqttData.light,
            dust: mqttData.dust,
          };
          dispatch(addDataPoint(newDataPoint));
          mqttData.temperature = null;
          mqttData.humidity = null;
          mqttData.light = null;
          mqttData.dust = null;
        }
      }
    });
  }, []);
  
  const getCurrentTimeLabel = () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div id="chartComponent">
      <LineChart width={400} height={200} data={chartData} margin={{ right: 30 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveEnd" />
        <YAxis type="number" domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
        <Tooltip />
        <Legend verticalAlign="top" />
        {lines.map(line => (
          <Line key={line.dataKey} {...line} />
        ))}
      </LineChart>
    </div>
  );
}

export default ChartComponent;
// useEffect(() => {
  //   const updateAndStartInterval = () => {
  //       updateDataAndLabels();
  //       const intervalId = setInterval(updateDataAndLabels, 5000);
  //       return () => {
  //           clearInterval(intervalId);
  //       };
  //   };
  //   const intervalId = updateAndStartInterval();

  //   return () => {
  //       clearInterval(intervalId);
  //   };
  // }, []);
  // const updateDataAndLabels = async () => {
  //   try {
  //     const mqttData = await getMqttDataFromBackend();
  //     const currentTimeLabel = getCurrentTimeLabel();
  //     updateData(mqttData.temperature, mqttData.humidity, mqttData.light, mqttData.dust);
      
  //     const newDataPoint = {
  //       // time: currentTimeLabel,
  //       time: mqttData.time,
  //       temperature: mqttData.temperature,
  //       humidity: mqttData.humidity,
  //       light: mqttData.light,
  //       dust: mqttData.dust,
  //     };

  //     dispatch(addDataPoint(newDataPoint));

  //     console.log("Received MQTT data from backend:", mqttData);
  //   } catch (error) {
  //     console.error("Error fetching MQTT data from backend:", error);
  //   }
  // };

  // return (
    
  //     <div id="chartComponent">
  //       <LineChart
  //         width={400}
  //         height={200}
  //         data={chartData}
  //         margin={{ right: 30 }}
  //       >
  //         <CartesianGrid strokeDasharray="3 3" />
  //         <XAxis
  //           dataKey="time"
  //           tick={{ fontSize: 12 }}
  //           interval="preserveEnd"
  //         />
  //         <YAxis
  //           type="number"
  //           domain={[0, 100]}
  //           ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
  //         />
  //         <Tooltip />
  //         <Legend verticalAlign="top" />
  //         <Line
  //           type="monotone"
  //           dataKey="temperature"
  //           name="Nhiệt độ"
  //           stroke="rgba(255, 99, 132, 1)"
  //           fill="rgba(255, 99, 132, 0.2)"
  //         />
  //         <Line
  //           type="monotone"
  //           dataKey="humidity"
  //           name="Độ ẩm"
  //           stroke="rgba(54, 162, 235, 1)"
  //           fill="rgba(54, 162, 235, 0.2)"
  //         />
  //         <Line
  //           type="monotone"
  //           dataKey="light"
  //           name="Ánh sáng"
  //           stroke="rgba(245, 230, 83, 1)"
  //           fill="rgba(255, 249, 222, 1)"
  //         />
  //       </LineChart>
  //     </div>
  //      ); 