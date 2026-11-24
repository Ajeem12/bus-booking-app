export function seatQuantity(seatNumber) {
  const match = String(seatNumber || "").match(/[0-9]+|[०-९]+/);
  if (!match) return 1;

  const normalized = match[0].replace(/[०-९]/g, (digit) =>
    String("०१२३४५६७८९".indexOf(digit)),
  );
  const quantity = Number(normalized);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

export function sectionQuantity(rows) {
  return rows.reduce((total, row) => total + seatQuantity(row.seat_number), 0);
}

const sectionLabels = {
  sleeper: "स्लीपर",
  seat: "सीट",
  cabin: "केबिन",
  gali: "गली",
};

export function formatSeatNumber(seatNumber, section) {
  const match = String(seatNumber || "").match(/[0-9]+|[०-९]+/);
  if (!match) return "";

  const label = sectionLabels[section] || section || "";
  return label ? `${match[0]} ${label}` : match[0];
}

export function seatNumberInputValue(seatNumber) {
  const match = String(seatNumber || "").match(/[0-9]+|[०-९]+/);
  return match ? match[0] : "";
}

function tripDateKey(value) {
  const date = String(value || "").trim();
  const isoMatch = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const localMatch = date.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2}|\d{4})$/);
  let year;
  let month;
  let day;

  if (isoMatch) {
    [, year, month, day] = isoMatch;
  } else if (localMatch) {
    [, day, month, year] = localMatch;
    year = Number(year);
    if (year < 100) year += year < 50 ? 2000 : 1900;
  } else {
    return null;
  }

  year = Number(year);
  month = Number(month);
  day = Number(day);
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > new Date(year, month, 0).getDate()
  ) {
    return null;
  }

  return year * 10000 + month * 100 + day;
}

export function sortTripsUpcomingFirst(trips, currentDate = new Date()) {
  const todayKey =
    currentDate.getFullYear() * 10000 +
    (currentDate.getMonth() + 1) * 100 +
    currentDate.getDate();

  return [...trips].sort((first, second) => {
    const firstDate = tripDateKey(first.trip_date);
    const secondDate = tripDateKey(second.trip_date);
    const firstUpcoming = firstDate !== null && firstDate > todayKey;
    const secondUpcoming = secondDate !== null && secondDate > todayKey;

    if (firstUpcoming !== secondUpcoming) return firstUpcoming ? -1 : 1;
    if (firstDate === null && secondDate === null) return 0;
    if (firstDate === null) return 1;
    if (secondDate === null) return -1;

    return secondDate - firstDate;
  });
}
