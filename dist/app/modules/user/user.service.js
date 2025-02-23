"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const user_contsant_1 = require("./user.contsant");
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user already exists with the given email
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: data.email },
    });
    if (existingUser) {
        throw new Error("User with this email already exists.");
    }
    // Hash the password before saving
    const hashPassword = yield bcrypt_1.default.hash(data.password, 10);
    const userData = Object.assign(Object.assign({}, data), { password: hashPassword, role: client_1.UserRole.user });
    // Create and save the new user
    const result = yield prisma_1.default.user.create({
        data: userData,
    });
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "email or password is incorrect");
    }
    const jwtPlayload = {
        userId: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        image: userData.profileImg,
        address: userData.address,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPlayload, config_1.default.jwt_access_secret, {
        expiresIn: "30d",
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPlayload, config_1.default.jwt_refresh_secret, { expiresIn: "30d" });
    return {
        userData,
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
});
const getMyProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: email,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
    let profileInfo;
    if (userInfo.role === client_1.UserRole.admin) {
        profileInfo = yield prisma_1.default.user.findUnique({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role === client_1.UserRole.user) {
        profileInfo = yield prisma_1.default.user.findUnique({
            where: {
                email: userInfo.email,
            },
        });
    }
    return profileInfo;
});
const refreshTokenIntoDB = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the token is valid
    const decoded = (0, user_contsant_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!!");
    }
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        image: user.profileImg,
        role: user.role,
    };
    const createAccessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: "30d",
    });
    const createRefreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_refresh_secret, {
        expiresIn: "30d",
    });
    return { createAccessToken, createRefreshToken };
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profileImg: true,
            address: true,
        },
    });
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id },
    });
    if (!existingUser) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // If the user exists, delete it
    return yield prisma_1.default.user.delete({
        where: { id },
    });
});
exports.userService = {
    createUser,
    loginUser,
    getMyProfile,
    refreshTokenIntoDB,
    getAllUsers,
    deleteUser,
};
