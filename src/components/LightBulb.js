import { useState, useEffect } from "react";
import "../styles/LightBulb.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { controlLed } from "../services/apiService";

function LightBulb({ hue, topic, isOn, toggleSwitch }) {
  const [switchLabel, setSwitchLabel] = useState(isOn ? "Tắt" : "Bật");

  useEffect(() => {
    setSwitchLabel(isOn ? "Tắt" : "Bật");
  }, [isOn]);

  const handleLedControl = (action) => {
    controlLed(topic, action)
      .then((response) => {
        console.log(`${topic} control response:`, response.data);
      })
      .catch((error) => {
        console.error(`${topic} control error:`, error);
      });
  };

  return (
    <div className={`light-bulb ${isOn ? "on" : "off"}`}>
      <FontAwesomeIcon
        icon={faLightbulb}
        className={`icon ${isOn ? (hue === "xanh" ? "blue" : "red") : "off"}`}
        id={`bulb-icon-${topic}`}
      />
      <br />
      <div className="switch-container">
        <div
          className={`switch ${isOn ? "active" : ""}`}
          onClick={() => {
            toggleSwitch();
            handleLedControl(isOn ? "off" : "on");
          }}
        >
          {switchLabel}
        </div>
      </div>
    </div>
  );
}

export default LightBulb;
