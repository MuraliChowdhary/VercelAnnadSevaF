// src/components/UserTypeSelection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserTypeSelection.css'; // Import CSS for styling

const UserTypeSelection = () => {
  const navigate = useNavigate();

  const handleSelection = (userType) => {
    if (userType === 'volunteer') {
      navigate(`/volunteer/dashboard`);
    } else {
      navigate(`/${userType}`);
    }
  };

  return (
    <div className="user-type-selection-container">
      <h1 className="title">Select User Type</h1>
      <div className="user-types">
        <div className="user-type-card" onClick={() => handleSelection('donate')}>
          <h2>Donate</h2>
          <p>Contribute to the cause by donating food or resources.</p>
        </div>
        <div className="user-type-card" onClick={() => handleSelection('volunteer')}>
          <h2>Volunteer</h2>
          <p>Help us by volunteering your time and effort.</p>
        </div>
        <div className="user-type-card" onClick={() => handleSelection('request')}>
          <h2>Request</h2>
          <p>Receive food and resources for those in need.</p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
