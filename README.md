# Train Seat Booking System

A full-stack train seat reservation system built using **React.js**, **Node.js (Express)**, and **PostgreSQL**. Users can sign up, log in, and reserve seats with intelligent booking logic that ensures seats are allocated efficiently across rows.

---

## Tech Stack

- **Frontend**: React.js  
- **Backend**: Node.js + Express.js  
- **Database**: PostgreSQL  

##  Features

- User **Signup** and **Login** with secure authentication
- Reserve up to **7 seats at a time**
- Smart seat allocation:
  - Fill seats in a single row when possible
  - Otherwise fill **adjacent** or **nearest available** seats
  - Bottom-up strategy after last row (with 3 seats) is filled
- Prevent double booking — no two users can book the same seat
- View all booked and available seats visually
- Admin-style **Reset** button for demo/testing
- Fully responsive UI

  ## 🎟️ Seat Booking Routes

| Endpoint             | Method | Description                              |
|----------------------|--------|------------------------------------------|
| `/api/seats`         | GET    | Fetch all seats with current status      |
| `/api/seats/book`    | POST   | Book `n` seats with seat selection logic |
| `/api/seats/reset`   | POST   | Reset all seat statuses to available     |


![image](https://github.com/user-attachments/assets/7f7354b1-5d40-4a1f-82d8-5e34ed239d15)
