import React from 'react';

export default function TripHeaderForm({ header, setHeader, onSave }) {
  const update = (field) => (e) => setHeader({ ...header, [field]: e.target.value });

  return (
    <div className="card">
      <h2>ऊपर की जानकारी</h2>
      <div className="form-grid">
        <label>
          दिनांक
          <input type="text" value={header.trip_date} onChange={update('trip_date')} placeholder="dd/mm/yy" />
        </label>
        <label>
          बस सर्विस नाम
          <input type="text" value={header.service_name} onChange={update('service_name')} />
        </label>
        <label>
          गाड़ी नंबर
          <input type="text" value={header.vehicle_number} onChange={update('vehicle_number')} />
        </label>
        <label>
          हेल्पर नाम
          <input type="text" value={header.helper_name} onChange={update('helper_name')} />
        </label>
        <label>
          रूट (से - तक)
          <input type="text" value={header.route} onChange={update('route')} />
        </label>
        <label>
          ड्राइवर नाम
          <input type="text" value={header.driver_name} onChange={update('driver_name')} />
        </label>
      </div>
      <button onClick={onSave}>जानकारी सेव करें</button>
    </div>
  );
}
