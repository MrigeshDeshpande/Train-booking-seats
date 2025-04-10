import React from "react";
import "./Seat.css";

const Seat = ({ number, status, isRecent }) => {
  return (
    <div className={`seat ${status} ${isRecent ? "recent" : ""}`}>{number}</div>
  );
};

export default Seat;
