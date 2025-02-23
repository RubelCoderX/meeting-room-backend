"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlots = exports.addMinutes = exports.getTimeInMinutes = void 0;
const getTimeInMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};
exports.getTimeInMinutes = getTimeInMinutes;
const addMinutes = (time, minutes) => {
    const [hours, currentMinutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + currentMinutes + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
        .toString()
        .padStart(2, "0")}`;
};
exports.addMinutes = addMinutes;
const generateSlots = (startTime, endTime) => {
    let slots = [];
    let currentTime = startTime;
    while (currentTime < endTime) {
        const nextTime = (0, exports.addMinutes)(currentTime, 30);
        slots.push({ startTime: currentTime, endTime: nextTime });
        currentTime = nextTime;
    }
    return slots;
};
exports.generateSlots = generateSlots;
