import React from "react";
import "../styles/style.css";

function Gauge({ label, percentage }) {
  const circumference = 2 * Math.PI * 30;
  const dashOffset = circumference * (1 - percentage / 100);
  const circleStyle = {
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
              <defs>
                <linearGradient id="temperatureGradient" x1="40%" y1="30%" x2="10%" y2="80%">
                  <stop offset="0%" style={{ stopColor: '#DADADA' }} />
                  <stop offset="50%" style={{ stopColor: '#DC7F7F' }} />
                  {/* <stop offset="90%" style={{ stopColor: 'yellow' }} /> */}
                  <stop offset="100%" style={{ stopColor: 'red' }} />
                </linearGradient>
              </defs>
              <defs>
                <linearGradient id="humidityGradient" x1="90%" y1="70%" x2="10%" y2="30%">
                  <stop offset="0%" style={{ stopColor: '#8F7FDC' }} />
                  {/* <stop offset="50%" style={{ stopColor: 'green' }} /> */}
                  <stop offset="100%" style={{ stopColor: 'blue' }} />
                </linearGradient>
                <linearGradient id="lightGradient" x1="70%" y1="0%" x2="-30%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#D6DC7F' }} />
                  {/* <stop offset="50%" style={{ stopColor: '#FF9933' }} /> */}
                  <stop offset="100%" style={{ stopColor: '#FFF700' }} />
                </linearGradient>
                <linearGradient id="dustGradient" x1="70%" y1="0%" x2="-30%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#D8D8D8' }} />
                  {/* <stop offset="50%" style={{ stopColor: 'red' }} /> */}
                  <stop offset="100%" style={{ stopColor: 'black' }} />
                </linearGradient>
              </defs>
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
                className={`ant-progress-circle-path gauge-circle-path ${label}-gradient `}
                r="45"
                cx="0"
                cy="0"
                // stroke="#03030a1a"
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
