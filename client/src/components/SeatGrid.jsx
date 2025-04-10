import React from "react";
import Seat from "./Seat";
import "./SeatGrid.css";

const SeatGrid = ({ seats, recentlyBooked }) => {
  const rows = [];

  for (let i = 0; i < 12; i++) {
    const start = i * 7;
    const count = i === 11 ? 3 : 7;
    const rowSeats = seats.slice(start, start + count);

    rows.push(
      <div key={i} className="seat-row">
        {rowSeats.map((seat) => (
          <Seat
            key={seat.number}
            number={seat.number}
            status={seat.status}
            isRecent={recentlyBooked.includes(seat.number)}
          />
        ))}
      </div>,
    );
  }

  return <div>{rows}</div>;
};

export default SeatGrid;
