// Hàm định dạng lại ngày giờ
function formatTimestamp(timestamp) {
    const dateObject = new Date(timestamp);
    const formattedDate = `${dateObject.getFullYear()}-${(
      dateObject.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateObject
      .getDate()
      .toString()
      .padStart(2, "0")} ${dateObject
      .getHours()
      .toString()
      .padStart(2, "0")}:${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${dateObject.getSeconds().toString().padStart(2, "0")}`;
    return formattedDate;
  }
  
  module.exports = { formatTimestamp };
  