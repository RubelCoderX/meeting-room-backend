import express from "express";
import { slotController } from "./slots.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/create-slot", auth(UserRole.admin), slotController.createSlot);
router.get("/", auth(UserRole.admin), slotController.getAllSlots);
router.get("/:id", slotController.getSingleSlot);
router.delete("/:id", auth(UserRole.admin), slotController.deleteSlot);

export const slotRoutes = router;
