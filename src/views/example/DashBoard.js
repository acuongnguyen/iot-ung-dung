import React, { useState } from "react";
import Chart from "react-apexcharts";

import "../../styles/DashBoard.css";

const Dashboard = () => {
  // Giả định dữ liệu nhiệt độ, độ ẩm, ánh sáng và biểu đồ
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(60);
  const [light, setLight] = useState(800);
  const [chartData, setChartData] = useState({
    options: {
      xaxis: {
        categories: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
      },
    },
    series: [
      {
        name: "Nhiệt độ",
        data: [28, 29, 31, 32, 33, 30],
      },
    ],
  });

  const toggleLight = () => {
    setLight((prevLight) => (prevLight === 0 ? 1000 : 0));
  };

  return (
    <div className="dashboard">
      <div className="data-controls-container">
        <div className="data-section">
          <div className="data-item">
            <div className="block-item"></div>
            <div className="item-data">
              <h2>Nhiệt độ</h2>
              <p>{temperature}°C</p>
            </div>
          </div>
          <div className="data-item">
            <div className="block-item"></div>
            <div className="item-data">
              <h2>Độ ẩm</h2>
              <p>{humidity}%</p>
            </div>
          </div>
          {/* <div className="data-item">
            <div className="block-item"></div>
            <div className="item-data">
              <h2>Ánh sáng</h2>
              <p>{light} lux</p>
            </div>
          </div> */}
        </div>
        <div className="menu-container">
          <div className="menu-content">
            <div className="user-info">
              <h2>Nguyễn Mạnh Cường</h2>
              <p>Email: cuongvp2302@gmail.com</p>
            </div>
            <div className="menu-options">
              <div className="menu-item">Dashboard</div>
              <div className="menu-item">Đăng Xuất</div>
            </div>
          </div>
        </div>
      </div>
      <div className="chart-section">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={450}
          width={750}
        />
      </div>
      <div className="controls-section">
        <button onClick={toggleLight}>
          {light === 0 ? "Bật đèn" : "Tắt đèn"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
