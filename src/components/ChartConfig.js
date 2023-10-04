import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

// đăng ký các scale cần thiết
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

// kiểm tra xem Chart.defaults.global đã được định nghĩa
if (
  typeof Chart.defaults !== "undefined" &&
  typeof Chart.defaults.global !== "undefined"
) {
  Chart.defaults.global.defaultFontFamily = "Arial";
  Chart.defaults.global.defaultFontSize = 12;
}

export default Chart;
