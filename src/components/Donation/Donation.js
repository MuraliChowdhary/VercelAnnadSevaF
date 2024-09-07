import axios from "axios";
import React, { useEffect, useState } from "react";
import DonateForm from "../DonateForm/DonateForm";
import Maps from "../Maps";
import "../styles/Donation.css";

const DonationComponent = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [requestId, setRequestId] = useState(0);
  const [filter, setFilter] = useState("All");
  const [request, setRequest] = useState();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "https://annadsevabackend.onrender.com/api/request/pending",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching donation requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;

    const lat1 = coords1.lat;
    const lon1 = coords1.long;
    const lat2 = coords2.lat;
    const lon2 = coords2.long;

    const R = 6371; // km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filterRequests = (requests, filter) => {
    const userLocation = JSON.parse(localStorage.getItem("user")).location;
    console.log("User Location:", userLocation);

    switch (filter) {
      case "5km":
        return requests.filter((request) => {
          const distance = haversineDistance(userLocation, request.location);
          console.log(`Distance to ${request.receiverName}:`, distance);
          return distance <= 5;
        });
      case "10km":
        return requests.filter((request) => {
          const distance = haversineDistance(userLocation, request.location);
          console.log(`Distance to ${request.receiverName}:`, distance);
          return distance <= 10;
        });
      case "City":
        return requests.filter((request) => {
          const distance = haversineDistance(userLocation, request.location);
          console.log(`Distance to ${request.receiverName}:`, distance);
          return distance <= 15;
        });
      default:
        return requests;
    }
  };

  const openForm = (id) => {
    setRequestId(id);
    setShowForm(true);
  };

  const filteredRequests = filterRequests(requests, filter);

  return (
    <div className="donation">
      <div className="instant-donate">
        <div className="filter">
          <button
            className="filter-button green-button"
            onClick={() => setFilter("5km")}
          >
            5 Km
          </button>
          <button
            className="filter-button green-button"
            onClick={() => setFilter("10km")}
          >
            10 Km
          </button>
          <button
            className="filter-button green-button"
            onClick={() => setFilter("City")}
          >
            City
          </button>
          <button
            className="filter-button green-button"
            onClick={() => setFilter("All")}
          >
            All
          </button>
        </div>
        <button
          className="instant-donate-button donate-button green-button"
          onClick={() => {
            setShowForm(true);
            setRequestId(0);
            setRequest(null);
          }}
        >
          Donate
        </button>
      </div>
      <div className="flex-donation">
        <div className="map">
          <Maps
            donorLocation={JSON.parse(localStorage.getItem("user")).location}
            requests={filteredRequests}
          />
        </div>
        <div className="donation-requests">
          {filteredRequests.map((request) => (
            <div key={request._id} className="donation-request">
              <h3>{request.receiverName}</h3>
              <p>Location: {request.location.name}</p>
              <p>
                Amount needed: {request.quantity} (feeds approx{" "}
                {request.quantity} people)
              </p>
              <button
                className="donate-button green-button"
                onClick={() => {
                  setShowForm(true);
                  setRequestId(request._id);
                  setRequest(request);
                }}
              >
                Donate
              </button>
            </div>
          ))}
        </div>
      </div>
      {showForm && (
        <DonateForm
          request={request}
          requestId={requestId}
          setShowForm={setShowForm}
        />
      )}
    </div>
  );
};

export default DonationComponent;
