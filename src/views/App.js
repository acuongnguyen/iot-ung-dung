import React, { useState, useEffect } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
  Navigate,
} from "react-router-dom";
import "../styles/style.css";
import avtImage from "../asserts/images/avt.jpg";
import { setupSocketListeners } from "../services/Socket";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import DataSensor from "./DataSensor";
import ActivityHistory from "./ActivityHistory"; 

function App() {
  // khai báo state cho nhiệt độ, độ ẩm và ánh sáng
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [currentLight, setCurrentLight] = useState(0);
  const [currentDust, setCurrentDust] = useState(0);

  const [led1On, setLed1On] = useState(false);
  const [led2On, setLed2On] = useState(false);

  const toggleLed1 = () => {
    setLed1On(!led1On);
  };

  const toggleLed2 = () => {
    setLed2On(!led2On);
  };

  useEffect(() => {
    setupSocketListeners((topic, action) => {
      console.log("socket được gọi");
      if (topic === "led1") {
        if (action === "on") setLed1On(true);
        else if (action === "off") setLed1On(false);
      } else if (topic === "led2") {
        if (action === "on") setLed2On(true);
        else if (action === "off") setLed2On(false);
      }
    });
  }, [led1On, led2On]);

  return (
    <div className="container">
      <div id="header">
        <div id="menu-icon"></div>
        IoT và Ứng dụng
      </div>
      <Router>
        <div id="info">
          <div className="user-info">
            <div className="user-avatar">
              <img src={avtImage} alt="Avatar" />
            </div>
            <div className="user-details">
              <div className="user-name">Nguyễn Mạnh Cường</div>
              <div className="user-email">B20DCCN102</div>
            </div>
          </div>
          <hr width="75%" />
          <div className="user-menu">
            <NavLink to="/" className="menu-item">
              Dashboard
            </NavLink>
            <NavLink to="/profile" className="menu-item">
              Profile
            </NavLink>
            <NavLink to="/datasensor" className="menu-item">
              DataSensor
            </NavLink>
            <NavLink to="/activityhistory" className="menu-item">
              Activity History
            </NavLink>
          </div>
          <hr width="75%" />
        </div>
        <div className="dashboard">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  currentTemperature={currentTemperature}
                  currentHumidity={currentHumidity}
                  currentLight={currentLight}
                  currentDust={currentDust}
                  updateData={(newTemperature, newHumidity, newLight, newDust) => {
                    setCurrentTemperature(newTemperature);
                    setCurrentHumidity(newHumidity);
                    setCurrentLight(newLight);
                    setCurrentDust(newDust);
                  }}
                  led1On={led1On}
                  toggleLed1={toggleLed1}
                  led2On={led2On}
                  toggleLed2={toggleLed2}
                />
              }
            />
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/datasensor" element={<DataSensor />} />
            <Route path="/activityhistory" element={<ActivityHistory />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
