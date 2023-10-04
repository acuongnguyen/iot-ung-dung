import React from "react";
import "../styles/style.css";

function Gauge({ label, percentage, currentTemperature }) {
  const circumference = 2 * Math.PI * 30;
  const dashOffset = circumference * (1 - percentage / 100);

  const getGradientColor = (value, type) => {
    if (type === "Nhiệt độ") {
      if (value < 10) {
        // Dưới 10 độ C, màu trắng đến xanh
        const blueValue = value * 25.5; // Tính giá trị màu xanh
        return `rgb(255, 255, ${blueValue})`;
      } else if (value >= 10 && value < 20) {
        // Từ 10 độ C đến 20 độ C, chuyển từ xanh đến xanh lá cây
        const greenValue = (value - 10) * 22.5; // Tính giá trị màu xanh lá cây
        const blueValue = 255 - (value - 10) * 22.5; // Tính giá trị màu xanh
        return `rgb(0, ${greenValue}, ${blueValue})`;
      } else if (value >= 20 && value < 30) {
        // Từ 20 độ C đến 30 độ C, chuyển từ xanh lá cây đến vàng
        const redValue = (value - 20) * 12.75; // Tính giá trị màu đỏ
        return `rgb(${redValue}, 255, 0)`;
      } else if (value >= 30 && value <= 38) {
        // Từ 30 độ C đến 38 độ C, chuyển từ vàng sang cam
        const greenValue = 255 - (value - 30) * 12.75; // Tính giá trị màu xanh lá cây
        return `rgb(255, ${greenValue}, 0)`;
      } else if (value >= 38 && value < 45) {
        // Từ 38 độ C đến 45 độ C, chuyển từ cam sang đỏ
        const redValue = 255 - (value - 38) * 12.75; // Tính giá trị màu đỏ
        return `rgb(${redValue}, 0, 0)`;
      } else if (value >= 45) {
        // Trên 45 độ C, màu đỏ
        return "red";
      } else {
        // Mặc định
        return "rgba(225, 50, 50, 0.867)";
      }
    } else if (type === "Độ ẩm") {
      if (value < 55) {
        // Dưới 55%, màu vàng
        return "yellow";
      } else if (value >= 55 && value < 65) {
        // Từ 55% đến 65%, chuyển từ màu vàng sang xanh lá
        const greenValue = (value - 55) * 25.5; // Tính giá trị màu xanh lá cây
        return `rgb(255, ${greenValue}, 0)`;
      } else if (value >= 65 && value <= 75) {
        // Từ 65% đến 75%, chuyển từ xanh lá cây sang xanh dương nhạt
        const blueValue = (value - 65) * 25.5; // Tính giá trị màu xanh dương
        const greenValue = 255 - (value - 65) * 25.5; // Tính giá trị màu xanh lá cây
        return `rgb(0, ${greenValue}, ${blueValue})`;
      } else if (value > 75 && value <= 85) {
        // Từ 75% đến 85%, chuyển từ xanh dương nhạt sang xanh đậm
        const greenValue = 255 - (value - 65) * 12.75;
        const blueValue = 255 - (value - 75) * 10; // Tính giá trị màu xanh dương
        return `rgb(0, ${greenValue}, ${blueValue})`;
      } else if (value > 85) {
        // Trên 85%, màu xanh đậm
        return "rgb(5, 5, 121)";
      }
    } else if (type === "Ánh sáng") {
      if (value >= 0 && value <= 100) {
        // Tính giá trị màu từ xám đến vàng dựa trên giá trị ánh sáng từ 0 đến 100
        const yellowValue = (value / 100) * 255; // Tính giá trị màu vàng
        return `rgb(${yellowValue}, ${yellowValue}, 50)`;
      }
    }
    return "transparent";
  };

  const circleStyle = {
    stroke: getGradientColor(percentage, label), // Sử dụng màu sắc dựa trên nhiệt độ
    strokeDasharray: "188.496px, 282.744",
    strokeDashoffset: dashOffset,
    transform: "rotate(150deg)",
    transformOrigin: "0px 0px",
    transition:
      "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, strokeWidth 0.06s ease 0.3s, opacity 0.3s ease 0s",
    fillOpacity: 0,
  };

  return (
    <div className="gauge-widget-content">
      <div className="gauge">
        <div
          className="ant-progress ant-progress-circle ant-progress-status-normal ant-progress-show-info ant-progress-default gauge-progress"
          role="presentation"
        >
          <div className="ant-progress-inner">
            <svg
              className="ant-progress-circle"
              viewBox="-50 -50 100 100"
              role="presentation"
            >
              <circle
                className="ant-progress-circle-trail gauge-circle"
                r="45"
                cx="0"
                cy="0"
                stroke="#03030a1a"
                strokeLinecap="round"
                strokeWidth="10"
                style={{
                  stroke: "rgba(3, 3, 10, 0.1)",
                  strokeDasharray: "188.496px, 282.744",
                  strokeDashoffset: 0,
                  transform: "rotate(150deg)",
                  transformOrigin: "0px 0px",
                  transition:
                    "stroke-dashoffset 0.3s ease 0s, stroke-dasharray 0.3s ease 0s, stroke 0.3s ease 0s, strokeWidth 0.06s ease 0.3s, opacity 0.3s ease 0s",
                  fillOpacity: 0,
                }}
              ></circle>
              <circle
                className="ant-progress-circle-path gauge-circle-path"
                r="45"
                cx="0"
                cy="0"
                stroke="#03030a1a"
                strokeLinecap="round"
                strokeWidth="10"
                style={{
                  ...circleStyle,
                }}
              ></circle>
            </svg>
            <span className="ant-progress-text">
              <div
                className={`gauge-label ${label}`}
                style={{ width: "calc(100% - 40px)" }}
              >
                {percentage}
              </div>
            </span>
          </div>
        </div>
        <div
          className="gauge-range-info"
          style={{ fontSize: "18px", width: "144px" }}
        >
          <div className="gauge-min">0</div>
          <div className="gauge-max">100</div>
        </div>
      </div>
    </div>
  );
}

export default Gauge;
