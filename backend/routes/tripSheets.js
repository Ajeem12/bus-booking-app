const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Create a new trip sheet
router.post("/", async (req, res) => {
  try {
    const {
      trip_date,
      service_name,
      vehicle_number,
      helper_name,
      route,
      driver_name,
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO trip_sheets (trip_date, service_name, vehicle_number, helper_name, route, driver_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        trip_date,
        service_name,
        vehicle_number,
        helper_name,
        route,
        driver_name,
      ],
    );
    res.json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all trip sheets (summary)
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM trip_sheets ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one trip sheet with its bookings
router.get("/:id", async (req, res) => {
  try {
    const sheetResult = await pool.query(
      "SELECT * FROM trip_sheets WHERE id = $1",
      [req.params.id],
    );
    const [sheet] = sheetResult.rows;
    if (!sheet) return res.status(404).json({ error: "Not found" });
    const { rows: bookings } = await pool.query(
      "SELECT * FROM bookings WHERE trip_sheet_id = $1 ORDER BY section, sort_order, id",
      [req.params.id],
    );
    res.json({ ...sheet, bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update header info
router.put("/:id", async (req, res) => {
  try {
    const {
      trip_date,
      service_name,
      vehicle_number,
      helper_name,
      route,
      driver_name,
    } = req.body;
    await pool.query(
      `UPDATE trip_sheets SET trip_date=$1, service_name=$2, vehicle_number=$3, helper_name=$4, route=$5, driver_name=$6 WHERE id=$7`,
      [
        trip_date,
        service_name,
        vehicle_number,
        helper_name,
        route,
        driver_name,
        req.params.id,
      ],
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a trip sheet (and its bookings, via FK cascade)
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM trip_sheets WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
