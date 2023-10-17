import React from "react";
import "../styles/datasensor.css";
import { getLedDataFromBackend } from "../services/apiService";

class ActivityHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityHistory: [],
      filteredData: [],
      currentPage: 1,
      itemsPerPage: 10,
      startDate: "",
      endDate: "",
      filterLed: "",
      filterState: "",
      sortOrder: "asc",
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

  handleFilterLedChange = (e) => {
    this.setState({ filterLed: e.target.value });
  };

  handleFilterStateChange = (e) => {
    this.setState({ filterState: e.target.value });
  };

  fetchSensorData = () => {
    const { startDate, endDate } = this.state;
    getLedDataFromBackend(startDate, endDate)
      .then((data) => {
        if (Array.isArray(data)) {
          this.setState({ activityHistory: data }, () => { 
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
      activityHistory,
      filterLed,
      filterState,
    } = this.state;

    let filteredData = activityHistory;
    if (startDate && endDate) {
      filteredData = activityHistory.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
        );
      });
    }
    if (filterLed) {
      filteredData = filteredData.filter((item) =>
        item.idss.toLowerCase().includes(filterLed.toLowerCase())
      );
    }
    if (filterState) {
      filteredData = filteredData.filter((item) =>
        item.state.toLowerCase() === filterState.toLowerCase()
      );
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
      filterLed,
      filterState,
      sortOrder,
    } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentActivityHistory = filteredData.slice(
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
          <label htmlFor="filterLed">Sensor Name:</label>
            <select
              id="filterLed"
              name="filterLed"
              onChange={this.handleFilterLedChange}
              value={filterLed}
            >
              <option value="">All</option>
              <option value="led1">led1</option>
              <option value="led2">led2</option>
            </select>
            <label htmlFor="filterState">State:</label>
            <select
              id="filterState"
              name="filterState"
              onChange={this.handleFilterStateChange}
              value={filterState}
            >
              <option value="">All</option>
              <option value="on">On</option>
              <option value="off">Off</option>
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
                <th>Device</th>
                <th>State</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentActivityHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.idss}</td>
                  <td>{item.state}</td>
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
export default ActivityHistory;
