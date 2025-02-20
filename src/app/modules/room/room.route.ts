import express from "express";
import { roomController } from "./room.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/create-room", auth(UserRole.admin), roomController.createRoom);
router.get(
  "/",
  // auth(UserRole.admin, UserRole.user),
  roomController.getAllRooms
);
router.patch(
  "/update-room/:id",
  auth(UserRole.admin),
  roomController.updateRoom
);
router.get(
  "/get-room/:id",
  auth(UserRole.admin, UserRole.user),
  roomController.getSingleRoom
);
router.delete(
  "/delete-room/:id",
  auth(UserRole.admin),
  roomController.deleteRoom
);

export const roomRoutes = router;
