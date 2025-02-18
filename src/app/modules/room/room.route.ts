import express from "express";
import { roomController } from "./room.controller";

const router = express.Router();

router.post("/create-room", roomController.createRoom);
router.get("/get-rooms", roomController.getAllRooms);
router.patch("/update-room/:id", roomController.updateRoom);
router.get("/get-room/:id", roomController.getSingleRoom);
router.delete("/delete-room/:id", roomController.deleteRoom);

export const roomRoutes = router;
