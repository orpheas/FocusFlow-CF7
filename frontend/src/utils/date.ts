export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}





