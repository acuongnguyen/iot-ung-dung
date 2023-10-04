import React from "react";
import "../styles/profile.css";
import avtImage from "../asserts/images/avt.jpg";
function Profile() {
  // Để hiển thị thông tin cá nhân, bạn có thể sử dụng các biến state hoặc props.
  const userInfo = {
    fullName: "Nguyễn Mạnh Cường",
    studentID: "B20DCCN102",
    email: "cuongvp2302@gmail.com",
    phone: "0386105647",
    // Thêm các trường thông tin cá nhân khác ở đây
  };

  return (
    <div id="container">
      <div className="profile-container">
        <div className="image">
          <a href="https://www.facebook.com/NMC23/">
            <img src={avtImage} alt="Avatar" className="profile-avatar" />
          </a>
        </div>
        <div className="container-profile">
          <h1 className="profile-title">About me</h1>
          <ul className="profile-info">
            <li className="profile-info-item">
              <strong>Họ và Tên:</strong> {userInfo.fullName}
            </li>
            <li className="profile-info-item">
              <strong>Mã Sinh Viên:</strong> {userInfo.studentID}
            </li>
            <li className="profile-info-item">
              <strong>Email:</strong> {userInfo.email}
            </li>
            <li className="profile-info-item">
              <strong>Phone:</strong> {userInfo.phone}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Profile;
