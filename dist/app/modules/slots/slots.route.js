"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const slots_controller_1 = require("./slots.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-slot", (0, auth_1.default)(client_1.UserRole.admin), slots_controller_1.slotController.createSlot);
router.get("/", slots_controller_1.slotController.getAllSlots);
router.get("/:id", slots_controller_1.slotController.getSingleSlot);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.admin), slots_controller_1.slotController.deleteSlot);
exports.slotRoutes = router;
