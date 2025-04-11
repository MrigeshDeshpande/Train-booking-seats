# Train Seat Booking System

A full-stack train seat reservation system built using **React.js**, **Node.js (Express)**, and **PostgreSQL**. Users can sign up, log in, and reserve seats with intelligent booking logic that ensures seats are allocated efficiently across rows.

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL

## Features

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

  ## Seat Booking Routes

| Endpoint           | Method | Description                              |
| ------------------ | ------ | ---------------------------------------- |
| `/api/seats`       | GET    | Fetch all seats with current status      |
| `/api/seats/book`  | POST   | Book `n` seats with seat selection logic |
| `/api/seats/reset` | POST   | Reset all seat statuses to available     |

##  Authentication API Routes

| Endpoint               | Method | Description              |
|------------------------|--------|--------------------------|
| `/api/auth/signup`     | POST   | Register a new user      |
| `/api/auth/login`      | POST   | Log in and get a JWT     |

# Seat Allocation Logic

The app uses smart logic to pick the best seats based on your request:

### 1.Try a full row first
If there are enough seats together in the same row, it books them.

### 2.Next, check bottom two rows
If your request fits exactly in one of the bottom rows (which have fewer seats), it books there.

### 3.Then go bottom-up
If no row has enough space, it starts filling from the bottom row upwards.

### 4.Prefer seats next to your previous ones
If you've booked before, it tries to place your new seats close to the old ones.

### 5.Partial booking allowed
If not enough seats are available to match your request, it books as many as it can.

### Backend Setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file in the `server` folder:

```env
DATABASE_URL=postgresql://youruser:yourpass@localhost:5432/train_booking
JWT_SECRET=your_jwt_secret
```

Initialize the database:

```sql
-- Connect to your PostgreSQL
CREATE DATABASE train_booking;

-- Then create tables:
CREATE TABLE seats (
  number INTEGER PRIMARY KEY,
  status TEXT DEFAULT 'available',
  username TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

###  Frontend Setup

```bash
cd client
npm install
npm run dev
```
##  Folder Structure

```
train-booking-seats/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── api.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── seats.js
│   └── index.js
```


![image](https://github.com/user-attachments/assets/7f7354b1-5d40-4a1f-82d8-5e34ed239d15)
