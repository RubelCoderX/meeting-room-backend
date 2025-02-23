import express from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/signup", userController.createUserFromDB);
router.post("/login", userController.loginUser);
router.get("/", auth(UserRole.admin), userController.getAllUsersFromDB);
router.post("/refresh-token", userController.refreshTokenFromDb);
router.get(
  "/profile",
  auth(UserRole.admin, UserRole.user),
  userController.getMyProfile
);
router.delete("/:id", userController.userDeleteFromDB);

export const userRoutes = router;
