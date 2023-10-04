import { combineReducers } from "redux";

const initialChartData = [];

function chartData(state = initialChartData, action) {
  switch (action.type) {
    case "ADD_DATA_POINT":
      return [...state, action.payload].slice(-10);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  chartData,
  // Add other reducers if needed
});

export default rootReducer;
