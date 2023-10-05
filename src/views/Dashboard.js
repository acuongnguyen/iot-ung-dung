import React from "react";
import Gauge from "../components/Gauge";
import ChartComponent from "../components/ChartComponent";
import LightBulb from "../components/LightBulb";
import "../styles/style.css";
import "../styles/style.css";

function Dashboard({
  currentTemperature,
  currentHumidity,
  currentLight,
  updateData,
  led1On,
  toggleLed1,
  led2On,
  toggleLed2,
}) {
  return (
    <div>
      <div id="gauge">
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
      <ChartComponent updateData={updateData} />
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
