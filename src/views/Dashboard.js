import React, { useEffect, useState } from "react";
import Gauge from "../components/Gauge";
import ChartComponent from "../components/ChartComponent";
import LightBulb from "../components/LightBulb";
import "../styles/style.css";
import "../styles/style.css";
import io from "socket.io-client";
const socket = io("http://192.168.0.117:3000");
function Dashboard({
  currentTemperature,
  currentHumidity,
  currentLight,
  currentDust,
  updateData,
  led1On,
  toggleLed1,
  led2On,
  toggleLed2,
}) {
  return (
    <div>
      <div id="gauge">
      <div id="gauge4">
          <div id="WEB_GAUGE2" className="widgets--widget">
            <div className="widgets--widget-limited-line gauge-widget">
              <div className="widgets--widget-label">
                <div className="widgets--widget-limited-line">
                  Độ Bụi
                </div>
              </div>
              <Gauge label="Độbụi" percentage={currentDust} />
            </div>
          </div>
        </div>
        <div id="gauge1">
          <div id="WEB_GAUGE2" className="widgets--widget">
            <div className="widgets--widget-limited-line gauge-widget">
              <div className="widgets--widget-label">
                <div className="widgets--widget-limited-line">
                  Nhiệt Độ (°C)
                </div>
              </div>
              <Gauge label="Nhiệtđộ" percentage={currentTemperature} />
            </div>
          </div>
        </div>
        <div id="gauge2">
          <div id="WEB_GAUGE2" className="widgets--widget">
            <div className="widgets--widget-limited-line gauge-widget">
              <div className="widgets--widget-label">
                <div className="widgets--widget-limited-line">Độ Ẩm (%)</div>
              </div>
              <Gauge label="Độẩm" percentage={currentHumidity} />
            </div>
          </div>
        </div>
        <div id="gauge3">
          <div id="WEB_GAUGE2" className="widgets--widget">
            <div className="widgets--widget-limited-line gauge-widget">
              <div className="widgets--widget-label">
                <div className="widgets--widget-limited-line">
                  Ánh Sáng (Lux)
                </div>
              </div>
              <Gauge label="Ánhsáng" percentage={currentLight} />
            </div>
          </div>
        </div>
        
      </div>
      <div id="chart">
        {/* <ChartComponent updateData={updateData} />
        <ChartComponent updateData={updateData} /> */}
        <ChartComponent 
          updateData={updateData}
          lines={[
            {
              type: "monotone",
              dataKey: "dust",
              name: "Độ bụi",
              stroke: "rgba(255, 99, 132, 1)",
              fill: "rgba(255, 99, 132, 0.2)"
            }
          ]}
        />
        <ChartComponent 
          updateData={updateData}
          lines={[
            {
              type: "monotone",
              dataKey: "temperature",
              name: "Nhiệt độ",
              stroke: "rgba(255, 99, 132, 1)",
              fill: "rgba(255, 99, 132, 0.2)"
            },
            {
              type: "monotone",
              dataKey: "humidity",
              name: "Độ ẩm",
              stroke: "rgba(54, 162, 235, 1)",
              fill: "rgba(54, 162, 235, 0.2)",
            },
            {
              type: "monotone",
              dataKey: "light",
              name: "Ánh sáng",
              stroke: "rgba(245, 230, 83, 1)",
              fill: "rgba(255, 249, 222, 1)"
            }
          ]}
          />
      </div>
      
      <div id="led1">
        <LightBulb
          hue="xanh"
          isOn={led1On}
          topic="led1"
          toggleSwitch={toggleLed1}
        />
      </div>
      <div id="led2">
        <LightBulb
          hue="đỏ"
          isOn={led2On}
          topic="led2"
          toggleSwitch={toggleLed2}
        />
      </div>
    </div>
  );
}

export default Dashboard;
