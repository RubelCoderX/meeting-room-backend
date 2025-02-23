"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRoutes = void 0;
const express_1 = __importDefault(require("express"));
const room_controller_1 = require("./room.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-room", (0, auth_1.default)(client_1.UserRole.admin), room_controller_1.roomController.createRoom);
router.get("/", 
// auth(UserRole.admin, UserRole.user),
room_controller_1.roomController.getAllRooms);
router.patch("/update-room/:id", (0, auth_1.default)(client_1.UserRole.admin), room_controller_1.roomController.updateRoom);
router.get("/get-room/:id", room_controller_1.roomController.getSingleRoom);
router.delete("/delete-room/:id", (0, auth_1.default)(client_1.UserRole.admin), room_controller_1.roomController.deleteRoom);
exports.roomRoutes = router;
