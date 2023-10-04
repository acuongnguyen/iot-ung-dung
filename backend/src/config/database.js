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

// // hàm thêm mới trạng thái đèn vào db
// function updateLedStateInDatabase(topic, action) {  
//   const sql =
//     "INSERT INTO action (idss, state, timestamp) VALUES (?, ?, NOW())";
//   const values = [topic, action];
//   database.query(sql, values, (err, result) => {
//     if (err) {
//       console.error(`Lỗi cập nhật trạng thái đèn (${topic}):`, err);
//     } else {
//       console.log(
//       `Đã cập nhật trạng thái đèn (${topic}) trong cơ sở dữ liệu.`
//       );
//     }
//   });    
// }
  
// //hàm thêm mới dữ liệu cảm biến vào db
// function insertDataSSInDatabase(temperature, humidity, light) {
//   const sql =
//     "INSERT INTO sensor (idss, date, temperature, humidity, lux) VALUES (?, NOW(), ?, ?, ?)";
//     const values = ["DHT11", temperature, humidity, light];
  
//     database.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Lỗi cập nhật dữ liệu MQTT vào cơ sở dữ liệu:", err);
//     } else {
//       console.log("Đã cập nhật dữ liệu MQTT vào cơ sở dữ liệu.");
//     }
//   });
// }
module.exports = database;