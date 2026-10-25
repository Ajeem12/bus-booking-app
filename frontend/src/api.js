import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://bus-booking-app-g2zw.onrender.com"
).replace(/\/$/, "");
const API_BASE = `${API_URL}/api`;

const activeRequests = new Map();
let nextRequestId = 0;
let activity = { count: 0, label: "" };
const listeners = new Set();

function publishActivity() {
  activity = {
    count: activeRequests.size,
    label: [...activeRequests.values()].at(-1) || "डेटा लोड हो रहा है",
  };
  listeners.forEach((listener) => listener());
}

export function subscribeApiActivity(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getApiActivity() {
  return activity;
}

async function request(label, send) {
  const requestId = nextRequestId++;
  activeRequests.set(requestId, label);
  publishActivity();

  try {
    const response = await send();
    return response.data;
  } finally {
    activeRequests.delete(requestId);
    publishActivity();
  }
}

export const api = {
  getSheets: () =>
    request("यात्रा शीट लोड हो रही हैं", () =>
      axios.get(`${API_BASE}/trip-sheets`),
    ),
  getSheet: (id) =>
    request("यात्रा शीट खोली जा रही है", () =>
      axios.get(`${API_BASE}/trip-sheets/${id}`),
    ),
  createSheet: (data) =>
    request("नई शीट सेव हो रही है", () =>
      axios.post(`${API_BASE}/trip-sheets`, data),
    ),
  updateSheet: (id, data) =>
    request("शीट अपडेट हो रही है", () =>
      axios.put(`${API_BASE}/trip-sheets/${id}`, data),
    ),
  deleteSheet: (id) =>
    request("शीट हटाई जा रही है", () =>
      axios.delete(`${API_BASE}/trip-sheets/${id}`),
    ),
  addBooking: (data) =>
    request("बुकिंग सेव हो रही है", () =>
      axios.post(`${API_BASE}/bookings`, data),
    ),
  reorderBookings: (data) =>
    request("बुकिंग क्रम अपडेट हो रहा है", () =>
      axios.put(`${API_BASE}/bookings/reorder`, data),
    ),
  moveBookings: (data) =>
    request("बुकिंग दूसरी शीट में भेजी जा रही हैं", () =>
      axios.put(`${API_BASE}/bookings/move`, data),
    ),
  getBookingSuggestions: () =>
    request("बुकिंग सुझाव लोड हो रहे हैं", () =>
      axios.get(`${API_BASE}/bookings/suggestions`),
    ),
  updateBooking: (id, data) =>
    request("बुकिंग अपडेट हो रही है", () =>
      axios.put(`${API_BASE}/bookings/${id}`, data),
    ),
  deleteBooking: (id) =>
    request("बुकिंग हटाई जा रही है", () =>
      axios.delete(`${API_BASE}/bookings/${id}`),
    ),
};
