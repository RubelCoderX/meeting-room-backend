"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-booking", (0, auth_1.default)(client_1.UserRole.user), booking_controller_1.bookingController.createBooking);
router.get("/", (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin), booking_controller_1.bookingController.getAllBookings);
router.get("/my-bookings", (0, auth_1.default)(client_1.UserRole.user), booking_controller_1.bookingController.getMyBooking);
router.get("/get-booking/:id", (0, auth_1.default)(client_1.UserRole.user), booking_controller_1.bookingController.getSingleBooking);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.user), booking_controller_1.bookingController.updateBooking);
router.delete("/delete-booking/:id", (0, auth_1.default)(client_1.UserRole.user, client_1.UserRole.admin), booking_controller_1.bookingController.deleteBooking);
exports.bookingRoutes = router;
