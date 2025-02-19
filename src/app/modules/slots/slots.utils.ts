export const getTimeInMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const addMinutes = (time: string, minutes: number) => {
  const [hours, currentMinutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + currentMinutes + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  return `${newHours.toString().padStart(2, "0")}:${newMinutes
    .toString()
    .padStart(2, "0")}`;
};

export const generateSlots = (startTime: string, endTime: string) => {
  let slots = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    const nextTime = addMinutes(currentTime, 30);
    slots.push({ startTime: currentTime, endTime: nextTime });
    currentTime = nextTime;
  }

  return slots;
};
