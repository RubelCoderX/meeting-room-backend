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
exports.roomService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createRoomIntoDb = (room) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.room.create({
        data: room,
    });
});
const getAllRooms = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const queryCondition = [];
    if (params.searchTerm) {
        queryCondition.push({
            name: {
                contains: params.searchTerm,
                mode: "insensitive",
            },
        });
    }
    // Filter by capacity (e.g., minimum capacity)
    if (params.capacity) {
        queryCondition.push({
            capacity: {
                lte: Number(params.capacity),
            },
        });
    }
    const whereCodeition = { AND: queryCondition };
    return yield prisma_1.default.room.findMany({
        where: whereCodeition,
    });
});
const getSingleRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.room.findUnique({
        where: { id: roomId },
    });
});
// Valid fields based on your Prisma schema
const validFields = ["name", "capacity", "image", "amenities"];
const updateRoom = (roomId, roomData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the room exists
        const existingRoom = yield prisma_1.default.room.findUnique({
            where: { id: roomId },
        });
        if (!existingRoom) {
            throw new Error("Room not found");
        }
        const updateData = Object.fromEntries(Object.entries(roomData).filter(([key]) => validFields.includes(key)));
        if (Object.keys(updateData).length === 0) {
            throw new Error("No valid fields to update");
        }
        // Update the room
        const updatedRoom = yield prisma_1.default.room.update({
            where: { id: roomId },
            data: updateData,
        });
        return updatedRoom;
    }
    catch (error) {
        console.error("Error updating room:", error);
        throw error;
    }
});
exports.default = updateRoom;
// Check if room exists before deleting
const deleteRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRoom = yield prisma_1.default.room.findUnique({
        where: { id: roomId },
    });
    if (!existingRoom) {
        throw new Error("Room not found");
    }
    return yield prisma_1.default.room.delete({
        where: { id: roomId },
    });
});
exports.roomService = {
    createRoomIntoDb,
    getAllRooms,
    getSingleRoom,
    updateRoom,
    deleteRoom,
};
