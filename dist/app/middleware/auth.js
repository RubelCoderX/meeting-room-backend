"use strict";
// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import AppError from "../errors/AppError";
// import config from "../config";
// import jwt from "jsonwebtoken";
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
// const auth = (...roles: string[]) => {
//   return async (
//     req: Request & { user?: any },
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const token = req.headers.authorization;
//       if (!token) {
//         throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
//       }
//       const verifiedUser = jwt.verify(
//         token,
//         config.jwt_access_secret as string
//       );
//       req.user = verifiedUser;
//       if (roles.length && !roles.includes(verifiedUser?.role)) {
//         throw new AppError(httpStatus.UNAUTHORIZED, "Forbidden!");
//       }
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };
// export default auth;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You have no access to this route!");
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "JWT token is invalid!");
        }
        const { role } = decoded;
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You have no access to this route!");
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
