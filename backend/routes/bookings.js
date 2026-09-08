const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Return previous values for the booking form autocomplete fields.
router.get("/suggestions", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT agent_name, seat_number, passenger_name, boarding_point,
              mobile_number, deposit, balance
       FROM bookings
       ORDER BY id DESC`,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a booking row
router.post("/", async (req, res) => {
  try {
    const {
      trip_sheet_id,
      agent_name,
      seat_number,
      passenger_name,
      boarding_point,
      mobile_number,
      deposit,
      balance,
      section,
      sort_order,
      marked,
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO bookings
        (trip_sheet_id, agent_name, seat_number, passenger_name, boarding_point, mobile_number, deposit, balance, section, sort_order, marked)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        trip_sheet_id,
        agent_name,
        seat_number,
        passenger_name,
        boarding_point,
        mobile_number,
        deposit,
        balance,
        section || "sleeper",
        sort_order || 0,
        marked ? 1 : 0,
      ],
    );
    res.json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a booking row
router.put("/:id", async (req, res) => {
  try {
    const {
      agent_name,
      seat_number,
      passenger_name,
      boarding_point,
      mobile_number,
      deposit,
      balance,
      section,
      sort_order,
      marked,
    } = req.body;
    await pool.query(
      `UPDATE bookings SET agent_name=$1, seat_number=$2, passenger_name=$3, boarding_point=$4, mobile_number=$5, deposit=$6, balance=$7, section=$8, sort_order=$9, marked=$10
       WHERE id=$11`,
      [
        agent_name,
        seat_number,
        passenger_name,
        boarding_point,
        mobile_number,
        deposit,
        balance,
        section,
        sort_order || 0,
        marked ? 1 : 0,
        req.params.id,
      ],
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a booking row
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
