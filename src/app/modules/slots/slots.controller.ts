import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import SendResponse from "../../../utils/sendResponse";
import { slotServices } from "./slots.service";

const createSlot = catchAsync(async (req: Request, res: Response) => {
  const result = await slotServices.createSlotIntoDB(req.body);
  SendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Slot created successfully",
    data: result,
  });
});

const getAllSlots = catchAsync(async (req: Request, res: Response) => {
  const result = await slotServices.getAllSlotsFromDB();
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Slots retrieved successfully",
    data: result,
  });
});

const getSingleSlot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await slotServices.getSingleSlotFromDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Slot retrieved successfully",
    data: result,
  });
});

const deleteSlot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await slotServices.deleteSlotFromDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Slot deleted successfully",
    data: result,
  });
});

export const slotController = {
  createSlot,
  getAllSlots,
  getSingleSlot,
  deleteSlot,
};
