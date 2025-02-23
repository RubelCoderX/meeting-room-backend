"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const room_route_1 = require("../modules/room/room.route");
const booking_route_1 = require("../modules/booking/booking.route");
const slots_route_1 = require("../modules/slots/slots.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/room",
        route: room_route_1.roomRoutes,
    },
    {
        path: "/booking",
        route: booking_route_1.bookingRoutes,
    },
    {
        path: "/slot",
        route: slots_route_1.slotRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
