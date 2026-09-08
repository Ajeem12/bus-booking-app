import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const api = {
  getSheets: () => axios.get(`${API_BASE}/trip-sheets`).then((r) => r.data),
  getSheet: (id) =>
    axios.get(`${API_BASE}/trip-sheets/${id}`).then((r) => r.data),
  createSheet: (data) =>
    axios.post(`${API_BASE}/trip-sheets`, data).then((r) => r.data),
  updateSheet: (id, data) =>
    axios.put(`${API_BASE}/trip-sheets/${id}`, data).then((r) => r.data),
  deleteSheet: (id) =>
    axios.delete(`${API_BASE}/trip-sheets/${id}`).then((r) => r.data),
  addBooking: (data) =>
    axios.post(`${API_BASE}/bookings`, data).then((r) => r.data),
  getBookingSuggestions: () =>
    axios.get(`${API_BASE}/bookings/suggestions`).then((r) => r.data),
  updateBooking: (id, data) =>
    axios.put(`${API_BASE}/bookings/${id}`, data).then((r) => r.data),
  deleteBooking: (id) =>
    axios.delete(`${API_BASE}/bookings/${id}`).then((r) => r.data),
};
