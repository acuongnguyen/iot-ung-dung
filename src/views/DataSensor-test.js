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
      searchHour: "",
      searchMinute: "",
      searchSecond: "",
      filterTemperature: "",
      filterHumidity: "",
      filterLight: "",
      sortOrder: "asc",
      sortCriteria: "date",
      lastItemIndex: 0,
    };
  }

  componentDidMount() {
    this.fetchSensorData();
  }

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
    const { startDate, endDate, itemsPerPage, lastItemIndex  } = this.state;
    const offset = lastItemIndex;
    getSSDataFromBackend(startDate, endDate, itemsPerPage, offset)
      .then((data) => {
        if (Array.isArray(data)) {
          this.setState((prevState) => ({
            sensorData: data,
            lastItemIndex: prevState.lastItemIndex + data.length,
          }), () => {
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
      searchHour,
      searchMinute,
      searchSecond,
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
      filteredData = filteredData.filter((item) => {
        return parseFloat(item.temperature) === parseFloat(filterTemperature);
      });
    }
  
    if (filterHumidity) {
      filteredData = filteredData.filter((item) => {
        return parseFloat(item.humidity) === parseFloat(filterHumidity);
      });
    }
  
    if (filterLight) {
      filteredData = filteredData.filter((item) => {
        return parseFloat(item.light) === parseFloat(filterLight);
      });
    }

    if (searchHour || searchMinute || searchSecond) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          (!searchHour || itemDate.getHours() === parseInt(searchHour, 10)) &&
          (!searchMinute || itemDate.getMinutes() === parseInt(searchMinute, 10)) &&
          (!searchSecond || itemDate.getSeconds() === parseInt(searchSecond, 10))
        );
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
  sortData = (criteria) => {
    const { sortOrder, filteredData, sortCriteria } = this.state;
    const sortedData = [...filteredData];
  
    sortedData.sort((a, b) => {
      let compareA, compareB;
  
      switch (criteria) {
        case "temperature":
          compareA = parseFloat(a.temperature);
          compareB = parseFloat(b.temperature);
          break;
        case "humidity":
          compareA = parseFloat(a.humidity);
          compareB = parseFloat(b.humidity);
          break;
        case "light":
          compareA = parseFloat(a.light);
          compareB = parseFloat(b.light);
          break;
        default:
          compareA = new Date(a.date);
          compareB = new Date(b.date);
      }
  
      if (sortOrder === "asc") {
        return compareA - compareB;
      } else {
        return compareB - compareA;
      }
    });
  
    this.setState((prevState) => ({
      filteredData: sortedData,
      sortOrder: prevState.sortOrder === "asc" ? "desc" : "asc",
      sortCriteria: criteria,
    }));
  };  

  handleNextPage = () => {
    const { itemsPerPage } = this.state;

    // Không cần thay đổi currentPage ở đây
    this.fetchSensorData();
  };
  handlePreviousPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 }, () => {
        this.fetchSensorData();
      });
    }
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
            <label htmlFor="searchHour"> Hour (0-23): </label>
            <input
              type="number"
              id="searchHour"
              name="searchHour"
              min="0"
              max="23"
              onChange={(e) => this.setState({ searchHour: e.target.value })}
              value={this.state.searchHour}
            />

            <label htmlFor="searchMinute"> Minute (0-59): </label>
            <input
              type="number"
              id="searchMinute"
              name="searchMinute"
              min="0"
              max="59"
              onChange={(e) => this.setState({ searchMinute: e.target.value })}
              value={this.state.searchMinute}
            />

            <label htmlFor="searchSecond"> Second (0-59): </label>
            <input
              type="number"
              id="searchSecond"
              name="searchSecond"
              min="0"
              max="59"
              onChange={(e) => this.setState({ searchSecond: e.target.value })}
              value={this.state.searchSecond}
            />

            <button onClick={this.handleFilter}>Search by Time</button>
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
            <label htmlFor="filterTemperature"> Temperature (°C): </label>
            <input
              type="number"
              id="filterTemperature"
              name="filterTemperature"
              onChange={this.handleFilterTemperatureChange}
              value={filterTemperature}
            />
            <label htmlFor="filterHumidity"> Humidity (%): </label>
            <input
              type="number"
              id="filterHumidity"
              name="filterHumidity"
              onChange={this.handleFilterHumidityChange}
              value={filterHumidity}
            />
            <label htmlFor="filterLight"> Light (Lux): </label>
            <input
              type="number"
              id="filterLight"
              name="filterLight"
              onChange={this.handleFilterLightChange}
              value={filterLight}
            />
            <button onClick={this.handleFilter}>Filter</button>
            <div className="sort-buttons">
              <button onClick={() => this.sortData("temperature")}>
                Sort by Temperature
              </button>
              <button onClick={() => this.sortData("humidity")}>
                Sort by Humidity
              </button>
              <button onClick={() => this.sortData("light")}>
                Sort by Light
              </button>
              <button onClick={() => this.sortData("date")}>
                Sort by Date
              </button>
            </div>

            {/* <button onClick={this.sortData}>
              Sort({sortOrder === "asc" ? "Ascending" : "Descending"})
            </button> */}
          </div>

          <table className="sensor-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sensor Name</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Light</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentSensorData.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.idss}</td>
                  <td>{item.temperature}°C</td>
                  <td>{item.humidity}%</td>
                  <td>{item.light} Lux</td>
                  <td>{item.date}</td>
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
          {/* <button
            onClick={() => this.handlePreviousPage(this.state.currentPage)}
            disabled={this.state.currentPage === 1}
          >
            Previous
          </button> */}
          <span className="current-page">{currentPage}</span>
          {/* <button
            onClick={() => this.setState({ currentPage: currentPage + 1 })}
            // disabled={indexOfLastItem >= filteredData.length}
          >
            Next
          </button> */}
          <button
            onClick={this.handleNextPage}
            // disabled={this.state.currentPage * this.state.itemsPerPage > this.state.filteredData.length}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default DataSensor;
