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

const sectionLabels = { sleeper: "स्लीपर", seat: "सीट", cabin: "केबिन" };

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
