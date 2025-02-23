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
exports.bookingService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../../utils/paginationHelper");
const createBooking = (booking) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, slotId } = booking;
    // Ensure the room isn't booked for the same slot on the same date
    const existingBooking = yield prisma_1.default.booking.findFirst({
        where: {
            roomId,
            slotId,
        },
    });
    if (existingBooking) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Room is already booked for this time slot on the selected date.");
    }
    try {
        return yield prisma_1.default.booking.create({ data: booking });
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create booking.");
    }
});
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.booking.findMany({
        include: {
            user: true,
            room: true,
            slots: true,
        },
    });
});
const myBookings = (user_1, ...args_1) => __awaiter(void 0, [user_1, ...args_1], void 0, function* (user, options = {}) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpar.calculatePagination(options);
    // Validate user existence
    const isAuthenticatedUser = yield prisma_1.default.user.findUnique({
        where: { id: user === null || user === void 0 ? void 0 : user.userId },
    });
    if (!isAuthenticatedUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Data Found");
    }
    // Check for user role authorization
    if (isAuthenticatedUser.role !== (user === null || user === void 0 ? void 0 : user.role)) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized");
    }
    // Fetch user-specific bookings
    const findSpecificBookForUser = yield prisma_1.default.booking.findMany({
        where: { userId: user === null || user === void 0 ? void 0 : user.userId },
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
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No Data Found");
    }
    // Get the total number of bookings
    const total = yield prisma_1.default.booking.count({
        where: { userId: user === null || user === void 0 ? void 0 : user.userId },
    });
    return {
        meta: { page, limit, total },
        data: findSpecificBookForUser,
    };
});
const getSingleBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.booking.findUnique({
        where: { id },
        include: {
            user: true,
            room: true,
            slots: true,
        },
    });
});
const updateBooking = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBooking = yield prisma_1.default.booking.findUnique({ where: { id } });
    if (!existingBooking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found.");
    }
    // Optional: Ensure the updated slot & room aren't causing conflicts
    if (updatedData.roomId || updatedData.slotId) {
        const conflictBooking = yield prisma_1.default.booking.findFirst({
            where: {
                roomId: updatedData.roomId || existingBooking.roomId,
                slotId: updatedData.slotId || existingBooking.slotId,
                NOT: { id },
            },
        });
        if (conflictBooking) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Updated details conflict with an existing booking.");
        }
    }
    return yield prisma_1.default.booking.update({ where: { id }, data: updatedData });
});
const deleteBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingBooking = yield prisma_1.default.booking.findUnique({ where: { id } });
    if (!existingBooking) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Booking not found.");
    }
    return yield prisma_1.default.booking.delete({ where: { id } });
});
exports.bookingService = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
    myBookings,
};
