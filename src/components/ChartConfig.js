import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

if (
  typeof Chart.defaults !== "undefined" &&
  typeof Chart.defaults.global !== "undefined"
) {
  Chart.defaults.global.defaultFontFamily = "Arial";
  Chart.defaults.global.defaultFontSize = 12;
}

export default Chart;
