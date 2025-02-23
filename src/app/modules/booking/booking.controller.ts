import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import SendResponse from "../../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = catchAsync(async (req, res) => {
  const result = await bookingService.createBooking(req.body);
  SendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking Created Successfully",
    data: result,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings();
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Bookings Retrieved Successfully",
    data: result,
  });
});
const getMyBooking = catchAsync(async (req, res) => {
  const { userId, role } = req.user as JwtPayload;
  const user = { userId, role };

  // Extract pagination options
  const { page = 1, limit = 10, sortBy, sortOrder } = req.query;

  // Ensure valid numbers for pagination
  const options = {
    page: Number(page),
    limit: Number(limit),
    sortBy: sortBy?.toString() || "createAt",
    sortOrder: sortOrder?.toString() || "desc",
  };

  // Fetch user-specific bookings
  const result = await bookingService.myBookings(user, options);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Booking retrieved successfully",
    data: result,
  });
});

const getSingleBooking = catchAsync(async (req, res) => {
  const result = await bookingService.getSingleBooking(req.params.id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single Booking Retrieved Successfully",
    data: result,
  });
});

const updateBooking = catchAsync(async (req, res) => {
  const result = await bookingService.updateBooking(req.params.id, req.body);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking Updated Successfully",
    data: result,
  });
});

const deleteBooking = catchAsync(async (req, res) => {
  const result = await bookingService.deleteBooking(req.params.id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking Deleted Successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getAllBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
  getMyBooking,
};
