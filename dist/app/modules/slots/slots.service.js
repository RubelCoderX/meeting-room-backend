"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const slots_utils_1 = require("./slots.utils");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createSlotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, date, startTime, endTime } = payload;
    // Ensure `startTime` and `endTime` are strings, since the Prisma model expects them as strings
    if (typeof startTime !== "string" || typeof endTime !== "string") {
        throw new Error("Invalid startTime or endTime format. Expected string in HH:MM format.");
    }
    const startMinutes = (0, slots_utils_1.getTimeInMinutes)(startTime);
    const endMinutes = (0, slots_utils_1.getTimeInMinutes)(endTime);
    if (endMinutes <= startMinutes) {
        throw new Error("endTime must be after startTime.");
    }
    const slotDuration = 30;
    const slots = [];
    let currentStartTime = startTime;
    while ((0, slots_utils_1.getTimeInMinutes)(currentStartTime) < endMinutes) {
        const currentEndTime = (0, slots_utils_1.addMinutes)(currentStartTime, slotDuration);
        slots.push({
            roomId,
            date,
            startTime: currentStartTime,
            endTime: currentEndTime,
            isBooked: false,
        });
        currentStartTime = currentEndTime;
    }
    const result = yield prisma_1.default.slots.createMany({
        data: slots,
    });
    return result;
});
const getAllSlotsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.slots.findMany({
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
});
const getSingleSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.slots.findUnique({
        where: { id },
        include: {
            room: true,
        },
    });
});
const deleteSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("id", id);
    // Check if the slot exists
    const existingSlot = yield prisma_1.default.slots.findUnique({
        where: { id },
    });
    if (!existingSlot) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Slot not found");
    }
    // If the slot exists, delete it
    return yield prisma_1.default.slots.delete({
        where: { id },
    });
});
exports.slotServices = {
    createSlotIntoDB,
    getAllSlotsFromDB,
    getSingleSlotFromDB,
    deleteSlotFromDB,
};
