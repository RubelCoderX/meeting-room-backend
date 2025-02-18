import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import SendResponse from "../../../utils/sendResponse";
import { bookingService } from "./booking.service";

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
};
