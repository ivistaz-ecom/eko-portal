export function humanDuration(minutes: number) {
  if (minutes % 1440 === 0) {
    const d = minutes / 1440;
    return d === 1 ? '1 day' : `${d} days`;
  }
  if (minutes % 60 === 0) {
    const h = minutes / 60;
    return h === 1 ? '1 hour' : `${h} hours`;
  }
  return `${minutes} minutes`;
}
