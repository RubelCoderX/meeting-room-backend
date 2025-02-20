import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-booking",
  auth(UserRole.user),
  bookingController.createBooking
);
router.get(
  "/",
  auth(UserRole.user, UserRole.admin),
  bookingController.getAllBookings
);
router.get(
  "/get-booking/:id",
  auth(UserRole.user),
  bookingController.getSingleBooking
);
router.patch("/:id", auth(UserRole.user), bookingController.updateBooking);
router.delete(
  "/delete-booking/:id",
  auth(UserRole.user),
  bookingController.deleteBooking
);

export const bookingRoutes = router;
