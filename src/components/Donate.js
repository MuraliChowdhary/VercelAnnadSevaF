import React, { useState, useEffect } from "react";
import Maps from "./Maps";
import axios from "axios";
import "./styles/Donate.css";
import DonateForm from "../components/DonateForm/DonateForm";

const Donate = function () {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    foodItems: "",
    quantity: "",
    receiverId: "",
    shelfLife: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [location, setLocation] = useState({
    lat: 0,
    long: 0,
  });

  useEffect(() => {
    fetchRequests();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get(
        "https://annadsevabackend.onrender.com/api/request",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://annadsevabackend.onrender.com/api/request",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("Donation submitted:", response.data);
      // Reset form or handle success
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  const openForm = (requestId) => {
    setFormData({ ...formData, requestId });
    setShowForm(true);
  };

  return (
    <div className="App">
      <h1>Select your Donation</h1>
      <div
        className="donate-main-container"
        style={{
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Maps donorlocation={location} requests={requests} />
        <div className="requests">
          {requests.map((request) => (
            <div key={request.id} className="donation-request">
              <h3>{request.organization}</h3>
              <p>Location: {request.location}</p>
              <p>
                Amount needed: {request.amount} (feeds approx {request.people}{" "}
                people)
              </p>
              <button
                className="donate-button green-button"
                onClick={() => openForm(request.id)}
              >
                Donate
              </button>
            </div>
          ))}
        </div>
        {showForm && (
          <DonateForm
            requestId={formData.requestId}
            setShowForm={setShowForm}
          />
        )}
      </div>
    </div>
  );
};

export default Donate;
