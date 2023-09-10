export function convertSecondsToLocalDate(seconds: number): string {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);

  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}
