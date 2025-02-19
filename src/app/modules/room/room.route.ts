import express from "express";
import { roomController } from "./room.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/create-room", auth(UserRole.ADMIN), roomController.createRoom);
router.get("/", auth(UserRole.ADMIN), roomController.getAllRooms);
router.patch(
  "/update-room/:id",
  auth(UserRole.ADMIN),
  roomController.updateRoom
);
router.get("/get-room/:id", auth(UserRole.ADMIN), roomController.getSingleRoom);
router.delete(
  "/delete-room/:id",
  auth(UserRole.ADMIN),
  roomController.deleteRoom
);

export const roomRoutes = router;
