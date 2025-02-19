import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../shared/prisma";
import { Booking } from "@prisma/client";

const createBooking = async (booking: Booking): Promise<Booking> => {
  const { roomId, slotId, date } = booking;

  // Ensure the room isn't booked for the same slot on the same date
  const existingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      slotId,
      date,
    },
  });

  if (existingBooking) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Room is already booked for this time slot on the selected date."
    );
  }

  try {
    return await prisma.booking.create({ data: booking });
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create booking."
    );
  }
};

const getAllBookings = async (): Promise<Booking[]> => {
  return await prisma.booking.findMany({
    include: {
      user: true,
      room: true,
      slots: true,
    },
  });
};

const getSingleBooking = async (id: string): Promise<Booking | null> => {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      room: true,
      slots: true,
    },
  });
};

const updateBooking = async (
  id: string,
  updatedData: Partial<Booking>
): Promise<Booking | null> => {
  const existingBooking = await prisma.booking.findUnique({ where: { id } });

  if (!existingBooking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found.");
  }

  // Optional: Ensure the updated slot & room aren't causing conflicts
  if (updatedData.roomId || updatedData.slotId || updatedData.date) {
    const conflictBooking = await prisma.booking.findFirst({
      where: {
        roomId: updatedData.roomId || existingBooking.roomId,
        slotId: updatedData.slotId || existingBooking.slotId,
        date: updatedData.date || existingBooking.date,
        NOT: { id },
      },
    });

    if (conflictBooking) {
      throw new AppError(
        httpStatus.CONFLICT,
        "Updated details conflict with an existing booking."
      );
    }
  }

  return await prisma.booking.update({ where: { id }, data: updatedData });
};

const deleteBooking = async (id: string): Promise<Booking | null> => {
  const existingBooking = await prisma.booking.findUnique({ where: { id } });

  if (!existingBooking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found.");
  }

  return await prisma.booking.delete({ where: { id } });
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
};
