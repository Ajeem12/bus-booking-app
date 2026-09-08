import React, { useState } from "react";
import { formatSeatNumber, seatNumberInputValue } from "../bookingUtils";

const emptyRow = {
  agent_name: "",
  seat_number: "",
  passenger_name: "",
  boarding_point: "",
  mobile_number: "",
  deposit: "",
  balance: "",
  section: "sleeper",
  marked: false,
};

function AutocompleteInput({ value, onChange, suggestions, ...props }) {
  const [focused, setFocused] = useState(false);
  const query = String(value || "").toLocaleLowerCase();
  const matches = suggestions.filter((suggestion) =>
    String(suggestion).toLocaleLowerCase().startsWith(query),
  );

  return (
    <div className="autocomplete-field">
      <input
        {...props}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && query && matches.length > 0 && (
        <div className="autocomplete-menu">
          {matches.slice(0, 8).map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onMouseDown={() => onChange({ target: { value: suggestion } })}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingForm({ onAdd, bookings = [] }) {
  const [row, setRow] = useState(emptyRow);

  const update = (field) => (e) => setRow({ ...row, [field]: e.target.value });

  const valuesFor = (field) => [
    ...new Set(
      bookings
        .map((booking) =>
          field === "seat_number"
            ? seatNumberInputValue(booking[field])
            : booking[field],
        )
        .filter(Boolean),
    ),
  ];

  const submit = (e) => {
    e.preventDefault();
    if (!row.agent_name && !row.passenger_name) return;
    onAdd({
      ...row,
      seat_number: formatSeatNumber(row.seat_number, row.section),
    });
    setRow(emptyRow);
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2>नई एंट्री जोड़ें</h2>
      <div className="form-grid">
        <AutocompleteInput
          placeholder="एजेंट नाम"
          value={row.agent_name}
          onChange={update("agent_name")}
          suggestions={valuesFor("agent_name")}
        />
        <AutocompleteInput
          placeholder="संख्या (जैसे: 1 या 2)"
          value={row.seat_number}
          onChange={update("seat_number")}
          suggestions={valuesFor("seat_number")}
        />
        <AutocompleteInput
          placeholder="नाम /गाँव"
          value={row.passenger_name}
          onChange={update("passenger_name")}
          suggestions={valuesFor("passenger_name")}
        />
        <AutocompleteInput
          placeholder="बैठने का स्थान"
          value={row.boarding_point}
          onChange={update("boarding_point")}
          suggestions={valuesFor("boarding_point")}
        />
        <AutocompleteInput
          placeholder="मो. नंबर"
          value={row.mobile_number}
          onChange={update("mobile_number")}
          suggestions={valuesFor("mobile_number")}
        />
        <AutocompleteInput
          placeholder="जमा"
          value={row.deposit}
          onChange={update("deposit")}
          suggestions={valuesFor("deposit")}
        />
        <AutocompleteInput
          placeholder="बाकि"
          value={row.balance}
          onChange={update("balance")}
          suggestions={valuesFor("balance")}
        />
        <select value={row.section} onChange={update("section")}>
          <option value="sleeper">स्लीपर सेक्शन</option>
          <option value="seat">सीट सेक्शन</option>
          <option value="cabin">केबिन सेक्शन</option>
        </select>
      </div>
      <button type="submit">+ जोड़ें</button>
    </form>
  );
}
