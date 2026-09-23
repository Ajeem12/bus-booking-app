import React, { useEffect, useState } from "react";
import { api } from "./api";
import TripHeaderForm from "./components/TripHeaderForm";
import BookingForm from "./components/BookingForm";
import BookingTable from "./components/BookingTable";
import PrintSheet from "./components/PrintSheet";

const emptyHeader = {
  trip_date: "",
  service_name: "श्री साईं नाथ बस सर्विस मगरघटा  बेमेतरा",
  vehicle_number: "",
  helper_name: "",
  route: "भाठापारा (छत्तीसगढ़) से पुणे",
  driver_name: "",
};

export default function App() {
  const [sheets, setSheets] = useState([]);
  const [activeSheetId, setActiveSheetId] = useState(null);
  const [header, setHeader] = useState(emptyHeader);
  const [bookings, setBookings] = useState([]);
  const [bookingSuggestions, setBookingSuggestions] = useState([]);
  const [showPrint, setShowPrint] = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const [emptyRows, setEmptyRows] = useState(2);
  const [page, setPage] = useState("dashboard");
  const [copiedBooking, setCopiedBooking] = useState(null);

  useEffect(() => {
    loadSheets();
    loadBookingSuggestions();
  }, []);

  async function loadBookingSuggestions() {
    try {
      const data = await api.getBookingSuggestions();
      setBookingSuggestions(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadSheets() {
    try {
      const data = await api.getSheets();
      setSheets(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadSheet(id) {
    const data = await api.getSheet(id);
    setActiveSheetId(id);
    setHeader({
      trip_date: data.trip_date || "",
      service_name: data.service_name || "",
      vehicle_number: data.vehicle_number || "",
      helper_name: data.helper_name || "",
      route: data.route || "",
      driver_name: data.driver_name || "",
    });
    setBookings(data.bookings || []);
  }

  async function handleCreateOrUpdateHeader() {
    if (!activeSheetId) {
      const result = await api.createSheet(header);
      await loadSheets();
      await loadSheet(result.id);
      setPage("editor");
    } else {
      await api.updateSheet(activeSheetId, header);
      await loadSheets();
    }
  }

  async function handleAddBooking(booking) {
    if (!activeSheetId) {
      alert("पहले ऊपर की जानकारी सेव करें");
      return;
    }
    await api.addBooking({ ...booking, trip_sheet_id: activeSheetId });
    await loadBookingSuggestions();
    await loadSheet(activeSheetId);
  }

  async function handleDeleteBooking(id) {
    await api.deleteBooking(id);
    await loadSheet(activeSheetId);
  }

  async function handleUpdateBooking(id, data) {
    await api.updateBooking(id, data);
    await loadSheet(activeSheetId);
  }

  async function handleReorderBookings(orderedBookings) {
    await Promise.all(
      orderedBookings.map((booking, sort_order) =>
        api.updateBooking(booking.id, { ...booking, sort_order }),
      ),
    );
    await loadSheet(activeSheetId);
  }

  async function handlePasteBooking() {
    if (!activeSheetId || !copiedBooking) return;
    await handleAddBooking({
      ...copiedBooking,
      trip_sheet_id: activeSheetId,
      sort_order: bookings.filter((b) => b.section === copiedBooking.section)
        .length,
    });
  }

  function handleNewSheet() {
    setActiveSheetId(null);
    setHeader(emptyHeader);
    setBookings([]);
    setPage("editor");
  }

  if (showPrint) {
    return (
      <PrintSheet
        header={header}
        bookings={bookings}
        fontSize={fontSize}
        setFontSize={setFontSize}
        emptyRows={emptyRows}
        setEmptyRows={setEmptyRows}
        onClose={() => setShowPrint(false)}
      />
    );
  }

  const openSheet = (id) => {
    if (id) {
      loadSheet(id);
      setPage("editor");
    } else {
      handleNewSheet();
    }
  };

  return (
    <div className="app-container">
      <header className="topbar">
        <div>
          <p className="eyebrow">TRIP DESK / 2026</p>
          <h1>
            बस बुकिंग <span>डेस्क</span>
          </h1>
        </div>
        <nav className="main-nav" aria-label="मुख्य नेविगेशन">
          <button
            className={page === "dashboard" ? "nav-active" : ""}
            onClick={() => setPage("dashboard")}
          >
            होम
          </button>
          <button
            className={page === "editor" ? "nav-active" : ""}
            onClick={() => setPage("editor")}
          >
            बुकिंग एडिटर
          </button>
          {activeSheetId && (
            <button onClick={() => setShowPrint(true)}>प्रिंट शीट</button>
          )}
        </nav>
      </header>

      {page === "dashboard" && (
        <section className="dashboard-page">
          <div className="welcome-panel">
            <div>
              <p className="eyebrow">TODAY'S OPERATIONS</p>
              <h2>अगली यात्रा तैयार है?</h2>
              <p>
                शीट बनाएं, यात्रियों को व्यवस्थित करें और एक साफ PDF तुरंत
                निकालें।
              </p>
            </div>
            <button className="primary-action" onClick={handleNewSheet}>
              + नई शीट बनाएं
            </button>
          </div>
          <div className="section-heading">
            <div>
              <p className="eyebrow">SAVED TRIPS</p>
              <h2>पुरानी शीट</h2>
            </div>
            <span className="count-pill">{sheets.length} शीट</span>
          </div>
          <div className="sheet-grid">
            {sheets.map((sheet) => (
              <button
                className="sheet-tile"
                key={sheet.id}
                onClick={() => openSheet(sheet.id)}
              >
                <span className="tile-date">
                  {sheet.trip_date || "तारीख नहीं"}
                </span>
                <strong>{sheet.vehicle_number || "गाड़ी नंबर नहीं"}</strong>
                <span>{sheet.route || "रूट नहीं दिया गया"}</span>
                <span className="tile-link">खोलें →</span>
              </button>
            ))}
            {sheets.length === 0 && (
              <div className="empty-state">
                अभी कोई पुरानी शीट नहीं है। पहली शीट बनाकर शुरुआत करें।
              </div>
            )}
          </div>
        </section>
      )}

      {page === "editor" && (
        <>
          <div className="page-intro">
            <div>
              <p className="eyebrow">BOOKING WORKSPACE</p>
              <h2>{activeSheetId ? "यात्रा एडिटर" : "नई यात्रा"}</h2>
            </div>
            <div className="sheet-selector">
              <select
                value={activeSheetId || ""}
                onChange={(e) => openSheet(e.target.value)}
              >
                <option value="">-- शीट चुनें --</option>
                {sheets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.trip_date} - {s.vehicle_number}
                  </option>
                ))}
              </select>
              <button onClick={handleNewSheet}>+ नई शीट</button>
            </div>
          </div>
          <TripHeaderForm
            header={header}
            setHeader={setHeader}
            onSave={handleCreateOrUpdateHeader}
          />
          {activeSheetId && (
            <>
              <BookingForm
                onAdd={handleAddBooking}
                bookings={[...bookingSuggestions, ...bookings]}
              />
              <BookingTable
                bookings={bookings}
                onDelete={handleDeleteBooking}
                onUpdate={handleUpdateBooking}
                onReorder={handleReorderBookings}
                onCopy={setCopiedBooking}
              />
              {copiedBooking && (
                <div className="paste-bar">
                  <span>
                    कॉपी की गई एंट्री:{" "}
                    {copiedBooking.passenger_name || "नाम नहीं"}
                  </span>
                  <button onClick={handlePasteBooking}>
                    इस शीट में पेस्ट करें
                  </button>
                  <button
                    className="muted-button"
                    onClick={() => setCopiedBooking(null)}
                  >
                    रद्द
                  </button>
                </div>
              )}
              <button className="print-btn" onClick={() => setShowPrint(true)}>
                प्रिंट / PDF देखें →
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
