import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api from "./api";
import SeatGrid from "./components/SeatGrid";
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";  
import "./App.css";

function BookingPage({ username }) {
  const [seats, setSeats] = useState([]);
  const [count, setCount] = useState(1);
  const [recentlyBooked, setRecentlyBooked] = useState([]);

  const fetchSeats = async () => {
    const res = await api.get("/seats");
    setSeats(res.data);
  };

  const bookSeats = async () => {
    try {
      const res = await api.post("/seats/book", { count, username });
      setRecentlyBooked(res.data.booked);
      fetchSeats();
    } catch (err) {
      alert(err.response?.data?.error || "Booking failed");
    }
  };

  const reset = async () => {
    await api.post("/seats/reset");
    setRecentlyBooked([]);
    fetchSeats();
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const bookedCount = seats.filter((seat) => seat.status === "booked").length;
  const availableCount = seats.filter((seat) => seat.status === "available").length;

  return (
    <div className="app">
      <h1 className="app-title">🚆 Train Seat Booking</h1>
      <div className="controls">
        <div className="recently-booked-display">
          <span>
            <strong>Book Seats</strong>
          </span>
          <div className="selected-seat-list">
            {recentlyBooked.map((num) => (
              <div key={num} className="selected-seat">
                {num}
              </div>
            ))}
          </div>
          <input
            type="number"
            min="1"
            max="7"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="input-count"
            placeholder="Enter count"
          />
          <div className="button-row">
            <button onClick={bookSeats} className="book-button">
              Book
            </button>
            <button onClick={reset} className="reset-button">
              Reset
            </button>
          </div>
        </div>
      </div>

      <SeatGrid seats={seats} recentlyBooked={recentlyBooked} />

      <div className="legend-bar">
        <div className="legend-item booked">Booked Seats = {bookedCount}</div>
        <div className="legend-item available">
          Available Seats = {availableCount}
        </div>
        {recentlyBooked.length > 0 && (
          <div className="legend-item recently-booked">
            Just Booked = {recentlyBooked.length}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookingPage username=""/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
