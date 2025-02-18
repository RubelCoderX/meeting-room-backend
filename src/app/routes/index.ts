import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { roomRoutes } from "../modules/room/room.route";
import { bookingRoutes } from "../modules/booking/booking.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/room",
    route: roomRoutes,
  },
  {
    path: "/booking",
    route: bookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
