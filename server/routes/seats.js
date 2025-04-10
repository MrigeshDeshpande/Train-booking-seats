import express from 'express';
import db from '../db.js';

/**
 
 * Function Flow:
 * 1. Initializes tracking variables for seat row filling (nextRowToFill starts at 1, totalRows is set to 12).
 * 2. `router.get('/')`: Fetches all seats from the database in order (used for frontend rendering or debugging).
 * 3. `router.post('/book')`: Handles seat booking logic.
 *    - Validates user input (count must be between 1 and 7).
 *    - Filters available seats and sorts them numerically for processing.
 *    - Phase 1: Top-down filling (sequential rows from top to bottom).
 *    - Phase 2: Bottom-up filling (remaining seats are booked starting from the last row upward).
 *    - Updates booked seat statuses in the database and returns the booked seat numbers.
 * 4. `router.post('/reset')`: Resets all seats back to "available" status and resets tracking variables.
 *    - Useful for resetting the system after testing or completing reservations.
 * 5. Export the router to be used in the main server file.
 */

const router = express.Router();

// Track the next row to be filled (starts at 1)
let nextRowToFill = 1;
const totalRows = 12;

// Get all seats
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM seats ORDER BY number');
  res.json(result.rows);
});

// Book seats
router.post('/book', async (req, res) => {
  const { count, username } = req.body;

  if (count < 1 || count > 7) {
    return res.status(400).json({ error: 'You can book between 1 and 7 seats only' });
  }

  const { rows: allSeats } = await db.query('SELECT * FROM seats ORDER BY number');
  const availableSeats = allSeats.filter(seat => seat.status === 'available');

  if (availableSeats.length < count) {
    return res.status(400).json({ error: 'Not enough seats available' });
  }

  const sortedAvailableSeats = [...availableSeats].sort((a, b) => a.number - b.number);

  let selected = [];

  const findConsecutiveSeats = (seats, count) => {
    for (let i = 0; i <= seats.length - count; i++) {
      const chunk = seats.slice(i, i + count);
      const isConsecutive = chunk.every((seat, idx) =>
        idx === 0 || seat.number === chunk[idx - 1].number + 1
      );
      if (isConsecutive) {
        return chunk;
      }
    }
    return [];
  };

  if (nextRowToFill <= totalRows) {
    const rowStart = (nextRowToFill - 1) * 7 + 1;
    const rowEnd = nextRowToFill === totalRows ? 80 : rowStart + 6;
    const rowSeats = sortedAvailableSeats.filter(seat =>
      seat.number >= rowStart && seat.number <= rowEnd
    );
    selected = findConsecutiveSeats(rowSeats, count);
    if (selected.length) nextRowToFill++;
  }

  if (!selected.length) {
    const reversedSeats = [...availableSeats].sort((a, b) => b.number - a.number);
    selected = findConsecutiveSeats(reversedSeats, count);
    if (!selected.length) {
      selected = reversedSeats.slice(0, count);
    }
  }

  const seatNumbers = selected.map(s => s.number);
  await db.query(
    `UPDATE seats SET status = 'booked', username = $1 WHERE number = ANY($2::int[])`,
    [username || null, seatNumbers]
  );

  res.json({ booked: seatNumbers });
});

// Reset all seats
router.post('/reset', async (req, res) => {
  await db.query('UPDATE seats SET status = $1, username = NULL', ['available']);
  nextRowToFill = 1; 
  res.send('All seats reset');
});

export default router;