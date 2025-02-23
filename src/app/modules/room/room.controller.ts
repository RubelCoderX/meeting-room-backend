import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import SendResponse from "../../../utils/sendResponse";
import { roomService } from "./room.service";

const createRoom = catchAsync(async (req, res) => {
  const result = await roomService.createRoomIntoDb(req.body);
  SendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Room Created Successfully",
    data: result,
  });
});

const getAllRooms = catchAsync(async (req, res) => {
  const result = await roomService.getAllRooms(req.query);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rooms fetched successfully",
    data: result,
  });
});

const getSingleRoom = catchAsync(async (req, res) => {
  const result = await roomService.getSingleRoom(req.params.id);
  if (!result) {
    return SendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Room not found",
      data: null,
    });
  }
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room fetched successfully",
    data: result,
  });
});

const updateRoom = catchAsync(async (req, res) => {
  const result = await roomService.updateRoom(req.params.id, req.body);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room Updated Successfully",
    data: result,
  });
});

const deleteRoom = catchAsync(async (req, res) => {
  await roomService.deleteRoom(req.params.id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room deleted successfully",
    data: null,
  });
});

export const roomController = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
