// import jwt, { JwtPayload } from "jsonwebtoken";

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

export const USER_ROLE = {
  user: "user",
  admin: "admin",
} as const;

import { UserRole } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

interface jwtPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  address?: string;
}
