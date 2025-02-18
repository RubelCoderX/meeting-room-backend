import express from "express";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/create-booking", bookingController.createBooking);
router.get("/get-bookings", bookingController.getAllBookings);
router.get("/get-booking/:id", bookingController.getSingleBooking);
router.patch("/:id", bookingController.updateBooking);
router.delete("/delete-booking/:id", bookingController.deleteBooking);

export const bookingRoutes = router;
