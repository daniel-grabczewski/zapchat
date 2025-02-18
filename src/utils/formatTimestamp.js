export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Just now';

  // Convert the Firestore timestamp to a JavaScript Date
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
  const now = new Date();

  // Check if the date is today
  if (date.toDateString() === now.toDateString()) {
    // Format as "hh:mmam/pm"
    return date
      .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      .toLowerCase();
  }

  // Calculate one week ago from now
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  // If the date is within the past week (but not today), format as "Day hh:mmam/pm"
  if (date > oneWeekAgo) {
    const weekday = date.toLocaleDateString([], { weekday: 'short' }); // e.g. "Tue"
    const time = date
      .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      .toLowerCase();
    return `${weekday} ${time}`;
  }

  // Otherwise, format as "Mon dd, yyyy, hh:mmam/pm"
  const month = date.toLocaleDateString([], { month: 'short' }); // e.g. "Feb"
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date
    .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
    .toLowerCase();
  return `${month} ${day}, ${year}, ${time}`;
};
