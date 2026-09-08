CREATE TABLE IF NOT EXISTS trip_sheets (
  id SERIAL PRIMARY KEY,
  trip_date VARCHAR(20),
  service_name VARCHAR(255) DEFAULT 'श्री साईं नाथ बस सर्विस मगरघटा  बेमेतरा',
  vehicle_number VARCHAR(50),
  helper_name VARCHAR(100),
  route VARCHAR(255),
  driver_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  trip_sheet_id INTEGER NOT NULL,
  agent_name VARCHAR(100),
  seat_number VARCHAR(50),
  passenger_name VARCHAR(100),
  boarding_point VARCHAR(255),
  mobile_number VARCHAR(20),
  deposit VARCHAR(20),
  balance VARCHAR(20),
  section VARCHAR(20) DEFAULT 'sleeper',
  sort_order INTEGER DEFAULT 0,
  marked BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (trip_sheet_id) REFERENCES trip_sheets(id) ON DELETE CASCADE
);
