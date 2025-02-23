import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../shared/prisma";
import { Booking } from "@prisma/client";
import { paginationHelpar } from "../../../utils/paginationHelper";

const createBooking = async (booking: Booking): Promise<Booking> => {
  const { roomId, slotId } = booking;

  // Ensure the room isn't booked for the same slot on the same date
  const existingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      slotId,
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

const myBookings = async (
  user?: { userId: string; role: string },
  options = {}
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpar.calculatePagination(options);

  // Validate user existence
  const isAuthenticatedUser = await prisma.user.findUnique({
    where: { id: user?.userId },
  });

  if (!isAuthenticatedUser) {
    throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
  }

  // Check for user role authorization
  if (isAuthenticatedUser.role !== user?.role) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  // Fetch user-specific bookings
  const findSpecificBookForUser = await prisma.booking.findMany({
    where: { userId: user?.userId },
    include: {
      room: true,
      user: true,
      slots: true,
    },
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  if (!findSpecificBookForUser.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Data Found");
  }

  // Get the total number of bookings
  const total = await prisma.booking.count({
    where: { userId: user?.userId },
  });

  return {
    meta: { page, limit, total },
    data: findSpecificBookForUser,
  };
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
  if (updatedData.roomId || updatedData.slotId) {
    const conflictBooking = await prisma.booking.findFirst({
      where: {
        roomId: updatedData.roomId || existingBooking.roomId,
        slotId: updatedData.slotId || existingBooking.slotId,
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
  myBookings,
};
