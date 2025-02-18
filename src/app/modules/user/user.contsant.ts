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
