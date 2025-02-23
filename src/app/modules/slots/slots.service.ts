import httpStatus from "http-status";
import { Slots } from "@prisma/client";
import { addMinutes, getTimeInMinutes } from "./slots.utils";
import prisma from "../../shared/prisma";
import AppError from "../../errors/AppError";

const createSlotIntoDB = async (payload: Slots) => {
  const { roomId, date, startTime, endTime } = payload;

  // Ensure `startTime` and `endTime` are strings, since the Prisma model expects them as strings
  if (typeof startTime !== "string" || typeof endTime !== "string") {
    throw new Error(
      "Invalid startTime or endTime format. Expected string in HH:MM format."
    );
  }

  const startMinutes = getTimeInMinutes(startTime);
  const endMinutes = getTimeInMinutes(endTime);

  if (endMinutes <= startMinutes) {
    throw new Error("endTime must be after startTime.");
  }

  const slotDuration = 30;
  const slots = [];
  let currentStartTime = startTime;

  while (getTimeInMinutes(currentStartTime) < endMinutes) {
    const currentEndTime = addMinutes(currentStartTime, slotDuration);

    slots.push({
      roomId,
      date,
      startTime: currentStartTime,
      endTime: currentEndTime,
      isBooked: false,
    });

    currentStartTime = currentEndTime;
  }

  const result = await prisma.slots.createMany({
    data: slots,
  });

  return result;
};

const getAllSlotsFromDB = async () => {
  return await prisma.slots.findMany({
    include: {
      room: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
};

const getSingleSlotFromDB = async (id: string) => {
  return await prisma.slots.findUnique({
    where: { id },
    include: {
      room: true,
    },
  });
};

const deleteSlotFromDB = async (id: string) => {
  console.log("id", id);
  // Check if the slot exists
  const existingSlot = await prisma.slots.findUnique({
    where: { id },
  });

  if (!existingSlot) {
    throw new AppError(httpStatus.NOT_FOUND, "Slot not found");
  }

  // If the slot exists, delete it
  return await prisma.slots.delete({
    where: { id },
  });
};

export const slotServices = {
  createSlotIntoDB,
  getAllSlotsFromDB,
  getSingleSlotFromDB,
  deleteSlotFromDB,
};
