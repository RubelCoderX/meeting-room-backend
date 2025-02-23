"use strict";
// import jwt, { JwtPayload } from "jsonwebtoken";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.USER_ROLE = void 0;
// export interface JwtpayloadData {
//   userId: number;
//   name: string;
//   email: string;
//   role: string;
//   image: string;
//   address: string;
// }
// export const createToken = (
//   jwtPayload: JwtpayloadData,
//   secret: string,
//   expiresIn: string
// ) => {
//   return jwt.sign(jwtPayload, secret, {
//     expiresIn,
//   });
// };
// export const verifyToken = (token: string, secret: string) => {
//   return jwt.verify(token, secret) as JwtPayload;
// };
exports.USER_ROLE = {
    user: "user",
    admin: "admin",
};
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
