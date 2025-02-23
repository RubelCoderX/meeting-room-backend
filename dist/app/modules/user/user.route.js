"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/signup", user_controller_1.userController.createUserFromDB);
router.post("/login", user_controller_1.userController.loginUser);
router.get("/", (0, auth_1.default)(client_1.UserRole.admin), user_controller_1.userController.getAllUsersFromDB);
router.post("/refresh-token", user_controller_1.userController.refreshTokenFromDb);
router.get("/profile", (0, auth_1.default)(client_1.UserRole.admin, client_1.UserRole.user), user_controller_1.userController.getMyProfile);
router.delete("/:id", user_controller_1.userController.userDeleteFromDB);
exports.userRoutes = router;
