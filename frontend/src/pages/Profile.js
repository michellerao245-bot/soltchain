import React from 'react';

const Profile = () => {
  return (
    <div className="page-container">
      <h1>User Profile</h1>
      <div className="profile-info">
        <p>Address: 0x...</p>
        <button className="solt-btn">See Your Activity</button>
        <button className="solt-btn">See Your Referrals</button>
      </div>
    </div>
  );
};

export default Profile;