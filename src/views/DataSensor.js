import React from "react";
import "../styles/datasensor.css";
import { getSSDataFromBackend } from "../services/apiService";

class DataSensor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorData: [],
      filteredData: [],
      currentPage: 1,
      itemsPerPage: 10,
      startDate: "",
      endDate: "",
      filterTemperature: "",
      filterHumidity: "",
      filterLight: "",
      sortOrder: "asc",
    };
  }

  componentDidMount() {
    this.fetchSensorData();
    // this.interval = setInterval(this.fetchSensorData, 5000);
  }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  handleStartDateChange = (e) => {
    this.setState({ startDate: e.target.value }, () => {
      console.log("startDate: ", this.state.startDate);
    });
  };
  
  handleEndDateChange = (e) => {
    this.setState({ endDate: e.target.value }, () => {
      console.log("endDate: ", this.state.endDate);
    });
  };

  handleFilterTemperatureChange = (e) => {
    this.setState({ filterTemperature: e.target.value });
  };

  handleFilterHumidityChange = (e) => {
    this.setState({ filterHumidity: e.target.value });
  };

  handleFilterLightChange = (e) => {
    this.setState({ filterLight: e.target.value });
  };

  // Gọi API khi tìm kiếm
  fetchSensorData = () => {
    const { startDate, endDate } = this.state;
    getSSDataFromBackend(startDate, endDate)
      .then((data) => {
        if (Array.isArray(data)) {
          this.setState({ sensorData: data }, () => { 
            this.applyFiltersAndSearch();
          });
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching MQTT data from backend:", error);
      });
  };

  applyFiltersAndSearch = () => {
    const {
      startDate,
      endDate,
      sensorData,
      filterTemperature,
      filterHumidity,
      filterLight,
    } = this.state;

    let filteredData = sensorData;
    if (startDate && endDate) {
      filteredData = sensorData.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
        );
      });
    }

    if (filterTemperature) {
      const [minTemp, maxTemp] = filterTemperature.split("-");
      filteredData = filteredData.filter((item) => {
        const temperature = parseFloat(item.temperature);
        return temperature > parseFloat(minTemp) && temperature <= parseFloat(maxTemp);
      });
    }

    if (filterHumidity) {
      const [minHumidity, maxHumidity] = filterHumidity.split("-");
      filteredData = filteredData.filter((item) => {
        const humidity = parseFloat(item.humidity);
        return humidity > parseFloat(minHumidity) && humidity <= parseFloat(maxHumidity);
      });
    }
  
    if (filterLight) {
      const [minLight, maxLight] = filterLight.split("-");
      filteredData = filteredData.filter((item) => {
        const light = parseFloat(item.light);
        return light > parseFloat(minLight) && light <= parseFloat(maxLight);
      });
    }

    this.setState({ filteredData, currentPage: 1 });
  };

  handleFilter = () => {
    this.setState({ sortOrder: "asc" }, () => {
      this.applyFiltersAndSearch();
    });
  };

  handleDateSearch = () => {
    clearInterval(this.interval);
    this.fetchSensorData();
  };
  sortData = () => {
    const { sortOrder, filteredData } = this.state;
    const sortedData = [...filteredData];

    sortedData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    this.setState((prevState) => ({
      filteredData: sortedData,
      sortOrder: prevState.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  render() {
    const {
      filteredData,
      currentPage,
      itemsPerPage,
      startDate,
      endDate,
      filterTemperature,
      filterHumidity,
      filterLight,
      sortOrder,
    } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSensorData = filteredData.slice(
      indexOfFirstItem,
      indexOfLastItem
    );

    return (
      <div>
        <div id="datasensor">
          <div className="search-container">
            <label htmlFor="startDate"> Start Date: </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              onChange={this.handleStartDateChange}
              value={startDate}
            />
            <label htmlFor="endDate"> End Date: </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              onChange={this.handleEndDateChange}
              value={endDate}
            />
            <button onClick={this.handleDateSearch}>Search</button>
          </div>
          <div className="filter-container">
            <label htmlFor="filterTemperature"> Temperature: </label>
            <select
              id="filterTemperature"
              name="filterTemperature"
              onChange={this.handleFilterTemperatureChange}
              value={filterTemperature}
            >
              <option value="">-- Select Temperature Range --</option>
              <option value="10-20">10°C - 20°C</option>
              <option value="20-30">20°C - 30°C</option>
              <option value="30-40">30°C - 40°C</option>
            </select>
            <label htmlFor="filterHumidity"> Humidity: </label>
            <select
              id="filterHumidity"
              name="filterHumidity"
              onChange={this.handleFilterHumidityChange}
              value={filterHumidity}
            >
              <option value="">-- Select Humidity Range --</option>
              <option value="60-70">60% - 70%</option>
              <option value="70-80">70% - 80%</option>
              <option value="80-90">80% - 90%</option>
            </select>
            <label htmlFor="filterLight"> Light: </label>
            <select
              id="filterLight"
              name="filterLight"
              onChange={this.handleFilterLightChange}
              value={filterLight}
            >
              <option value="">-- Select Light Range --</option>
              <option value="0-30">0 Lux - 30 Lux</option>
              <option value="30-70">30 Lux - 70 Lux</option>
              <option value="70-100">70 Lux - 100 Lux</option>
            </select>
            <button onClick={this.handleFilter}>Filter</button>
            <button onClick={this.sortData}>
              Sort({sortOrder === "asc" ? "Ascending" : "Descending"})
            </button>
          </div>
          <table className="sensor-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sensor Name</th>
                <th>Date</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Light</th>
              </tr>
            </thead>
            <tbody>
              {currentSensorData.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.idss}</td>
                  <td>{item.date}</td>
                  <td>{item.temperature}°C</td>
                  <td>{item.humidity}%</td>
                  <td>{item.light} Lux</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button
            onClick={() => this.setState({ currentPage: currentPage - 1 })}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="current-page">{currentPage}</span>
          <button
            onClick={() => this.setState({ currentPage: currentPage + 1 })}
            disabled={indexOfLastItem >= filteredData.length}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default DataSensor;
