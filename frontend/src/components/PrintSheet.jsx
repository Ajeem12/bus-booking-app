import React from "react";
import { formatSeatNumber, sectionQuantity } from "../bookingUtils";

const sections = ["sleeper", "seat", "cabin"];

export default function PrintSheet({
  header,
  bookings,
  fontSize,
  setFontSize,
  onClose,
}) {
  return (
    <div className="print-wrapper">
      <div className="no-print controls">
        <button onClick={onClose}>← वापस जाएँ</button>
        <label className="font-slider">
          फॉन्ट साइज़: {fontSize}px
          <input
            type="range"
            min="10"
            max="26"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
        <button onClick={() => window.print()}>
          प्रिंट करें / PDF सेव करें
        </button>
        <span className="hint">
          (Print dialog में "Microsoft Print to PDF" चुनें, Layout: Portrait,
          Paper: A4)
        </span>
      </div>

      <div className="a4-page" style={{ fontSize: `${fontSize}px` }}>
        <table className="header-table">
          <tbody>
            <tr>
              <td className="bold">दिनांक {header.trip_date}</td>
              <td className="center bold" colSpan={2}>
                {header.service_name}
              </td>
              <td className="bold">गाड़ी नंबर- {header.vehicle_number}</td>
            </tr>
            <tr>
              <td className="bold">हेल्पर- {header.helper_name}</td>
              <td className="center bold" colSpan={2}>
                {header.route}
              </td>
              <td className="bold">ड्राइवर नाम- {header.driver_name}</td>
            </tr>
          </tbody>
        </table>

        <table className="data-table">
          <thead>
            <tr>
              <th>एजेंट नाम</th>
              <th>सीट संख्या</th>
              <th>नाम /गाँव</th>
              <th>बैठने का स्थान</th>
              <th>मो. नंबर</th>
              <th>जमा</th>
              <th>बाकि</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sections.map((sec) => {
              const rows = bookings.filter((b) => b.section === sec);
              if (rows.length === 0) return null;
              return (
                <React.Fragment key={sec}>
                  {rows.map((b) => (
                    <tr key={b.id}>
                      <td>{b.agent_name}</td>
                      <td>{formatSeatNumber(b.seat_number, b.section)}</td>
                      <td>{b.passenger_name}</td>
                      <td>{b.boarding_point}</td>
                      <td>{b.mobile_number}</td>
                      <td>{b.deposit}</td>
                      <td>{b.balance}</td>
                      <td>{b.marked ? "✓" : ""}</td>
                    </tr>
                  ))}
                  {(sec === "sleeper" || sec === "seat") &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr
                        className="empty-booking-row"
                        key={`${sec}-empty-${index}`}
                      >
                        {Array.from({ length: 8 }).map((__, cellIndex) => (
                          <td key={`${sec}-empty-${index}-${cellIndex}`}></td>
                        ))}
                      </tr>
                    ))}
                  <tr className="section-total">
                    <td></td>
                    <td>{sectionQuantity(rows)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr className="spacer-row">
                    <td colSpan={8}></td>
                  </tr>
                </React.Fragment>
              );
            })}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={8}>कोई एंट्री नहीं</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
