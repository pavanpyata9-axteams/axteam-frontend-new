// Booking ID Generator Utility
// Generates unique booking IDs for tracking and communication

export const generateBookingId = () => {
  // Format: AX-YYYYMMDD-XXXX
  // AX = AXTeam prefix
  // YYYYMMDD = Date
  // XXXX = Random 4-digit number
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generate 4-digit random number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  return `AX-${dateStr}-${randomNum}`;
};

export const validateBookingId = (bookingId) => {
  // Validate booking ID format: AX-YYYYMMDD-XXXX
  const regex = /^AX-\d{8}-\d{4}$/;
  return regex.test(bookingId);
};

export default { generateBookingId, validateBookingId };