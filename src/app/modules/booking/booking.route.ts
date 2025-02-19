import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-booking",
  auth(UserRole.USER),
  bookingController.createBooking
);
router.get(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  bookingController.getAllBookings
);
router.get(
  "/get-booking/:id",
  auth(UserRole.USER),
  bookingController.getSingleBooking
);
router.patch("/:id", auth(UserRole.USER), bookingController.updateBooking);
router.delete(
  "/delete-booking/:id",
  auth(UserRole.USER),
  bookingController.deleteBooking
);

export const bookingRoutes = router;
