export function generateTimeSlots(trainer) {
  if (!trainer) return [];

  const slots = [];

  function toMinutes(time) {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  function toTime(minutes) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
  }

  const start = toMinutes(trainer.available_from);
  const end = toMinutes(trainer.available_to);

  const lunchStart = toMinutes(trainer.lunch_start);
  const lunchEnd = toMinutes(trainer.lunch_end);

  for (let time = start; time < end; time += 60) {
    if (time >= lunchStart && time < lunchEnd) continue;

    slots.push(toTime(time));
  }

  return slots;
}