import catchAsync from "../../../utils/catchAsync";
import SendResponse from "../../../utils/sendResponse";
import config from "../../config";
import { userService } from "./user.service";
import httpStatus from "http-status";

const createUserFromDB = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await userService.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in succesfully!",
    data: {
      user: result.userData,
      accessToken,
    },
  });
});
export const userController = {
  createUserFromDB,
  loginUser,
};
