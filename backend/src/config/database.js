const mysql = require("mysql");

// Kết nối đến cơ sở dữ liệu MySQL
const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Cuong668@",
  database: "iot",
});

database.connect((err) => {
  if (err) {
    console.error("Error Connect", err);
  } else {
    console.log("Connected MySQL.");
  }
});
module.exports = database;