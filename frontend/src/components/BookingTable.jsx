import React, { useState } from "react";
import {
  formatSeatNumber,
  sectionQuantity,
  seatNumberInputValue,
} from "../bookingUtils";

const fields = [
  "agent_name",
  "seat_number",
  "passenger_name",
  "boarding_point",
  "mobile_number",
  "deposit",
  "balance",
];
const sections = ["sleeper", "seat", "cabin"];
const sectionLabels = { sleeper: "स्लीपर", seat: "सीट", cabin: "केबिन" };

export default function BookingTable({ bookings, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const startEdit = (booking) => {
    setEditingId(booking.id);
    setDraft({ ...booking });
  };
  const updateDraft = (field, value) => setDraft({ ...draft, [field]: value });
  const saveEdit = async () => {
    await onUpdate(editingId, draft);
    setEditingId(null);
    setDraft(null);
  };

  return (
    <div className="card">
      <h2>सभी एंट्री</h2>
      {sections.map((sec) => {
        const rows = bookings.filter((b) => b.section === sec);
        if (rows.length === 0) return null;
        return (
          <div key={sec} style={{ marginBottom: "20px" }}>
            <h3>
              {sectionLabels[sec]} ({sectionQuantity(rows)})
            </h3>
            <table className="edit-table">
              <thead>
                <tr>
                  <th>एजेंट नाम</th>
                  <th>सीट संख्या</th>
                  <th>नाम /गाँव</th>
                  <th>बैठने का स्थान</th>
                  <th>मो. नंबर</th>
                  <th>जमा</th>
                  <th>बाकि</th>
                  <th>मार्क</th>
                  <th>एक्शन</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <tr key={b.id}>
                    {fields.map((f) => (
                      <td key={f}>
                        {editingId === b.id ? (
                          <input
                            value={
                              f === "seat_number"
                                ? seatNumberInputValue(draft[f])
                                : draft[f] || ""
                            }
                            onChange={(e) => updateDraft(f, e.target.value)}
                          />
                        ) : f === "seat_number" ? (
                          formatSeatNumber(b[f], b.section)
                        ) : (
                          b[f]
                        )}
                      </td>
                    ))}
                    <td>
                      <input
                        className="mark-checkbox"
                        type="checkbox"
                        checked={
                          editingId === b.id
                            ? Boolean(draft.marked)
                            : Boolean(b.marked)
                        }
                        onChange={(e) =>
                          editingId === b.id
                            ? updateDraft("marked", e.target.checked)
                            : onUpdate(b.id, { ...b, marked: e.target.checked })
                        }
                        aria-label="मार्क करें"
                      />
                    </td>
                    <td className="row-actions">
                      {editingId === b.id ? (
                        <>
                          <button onClick={saveEdit}>सेव</button>
                          <button
                            className="muted-button"
                            onClick={() => setEditingId(null)}
                          >
                            रद्द
                          </button>
                        </>
                      ) : (
                        <button onClick={() => startEdit(b)}>एडिट</button>
                      )}
                      <button className="danger" onClick={() => onDelete(b.id)}>
                        हटाएँ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {bookings.length === 0 && <p>अभी तक कोई एंट्री नहीं है।</p>}
    </div>
  );
}
