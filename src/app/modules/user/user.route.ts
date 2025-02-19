import express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/signup", userController.createUserFromDB);
router.post("/login", userController.loginUser);
router.post("/refresh-token", userController.refreshTokenFromDb);
router.get(
  "/profile",
  auth(UserRole.ADMIN, UserRole.USER),
  userController.getMyProfile
);

export const userRoutes = router;
