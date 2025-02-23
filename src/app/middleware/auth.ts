// import { NextFunction, Request, Response } from "express";
// import httpStatus from "http-status";
// import AppError from "../errors/AppError";
// import config from "../config";
// import jwt from "jsonwebtoken";

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

import httpStatus from "http-status";
import AppError from "../errors/AppError";

import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import catchAsync from "../../utils/catchAsync";

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route!"
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "JWT token is invalid!");
    }

    const { role } = decoded;

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route!"
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
export default auth;
