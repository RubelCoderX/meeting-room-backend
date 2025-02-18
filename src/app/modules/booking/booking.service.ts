import prisma from "../../shared/prisma";
import { Booking } from "@prisma/client";

const createBooking = async (booking: Booking): Promise<Booking> => {
  const { roomId, startTime, endTime } = booking;

  // Check if the room is already booked in the given time slot
  const existingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      OR: [{ startTime: { lt: endTime }, endTime: { gt: startTime } }],
    },
  });

  // If an overlapping booking exists, prevent double booking
  if (existingBooking) {
    throw new Error("Room is already booked for this time slot.");
  }

  // Create a new booking
  return await prisma.booking.create({
    data: booking,
  });
};

const getAllBookings = async (): Promise<Booking[]> => {
  return await prisma.booking.findMany();
};

const getSingleBooking = async (id: string): Promise<Booking | null> => {
  return await prisma.booking.findUnique({
    where: { id },
  });
};
const updateBooking = async (
  id: string,
  updatedData: Partial<Booking>
): Promise<Booking | null> => {
  // Check if the booking exists
  const existingBooking = await prisma.booking.findUnique({ where: { id } });

  if (!existingBooking) {
    throw new Error("Booking not found.");
  }

  // If updating time, check for conflicts
  if (updatedData.startTime && updatedData.endTime) {
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId: existingBooking.roomId,
        id: { not: id },
        OR: [
          {
            startTime: { lt: updatedData.endTime },
            endTime: { gt: updatedData.startTime },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new Error("Room is already booked for this updated time slot.");
    }
  }

  // Update the booking
  return await prisma.booking.update({
    where: { id },
    data: updatedData,
  });
};

const deleteBooking = async (id: string): Promise<Booking | null> => {
  // Check if the booking exists
  const existingBooking = await prisma.booking.findUnique({
    where: { id },
  });

  if (!existingBooking) {
    throw new Error("Booking not found");
  }

  // Delete the booking if it exists
  return await prisma.booking.delete({
    where: { id },
  });
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};
