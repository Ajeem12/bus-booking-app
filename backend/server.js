const express = require('express');
const cors = require('cors');
require('dotenv').config();

const tripSheetsRouter = require('./routes/tripSheets');
const bookingsRouter = require('./routes/bookings');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/trip-sheets', tripSheetsRouter);
app.use('/api/bookings', bookingsRouter);

app.get('/', (req, res) => res.send('Bus Booking API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
