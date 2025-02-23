import catchAsync from "../../../utils/catchAsync";
import SendResponse from "../../../utils/sendResponse";
import config from "../../config";
import { userService } from "./user.service";
import httpStatus from "http-status";

const createUserFromDB = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  SendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await userService.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      user: result.userData,
      accessToken: accessToken,
    },
  });
});

const getAllUsersFromDB = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers();
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await userService.getMyProfile(email);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const refreshTokenFromDb = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // if (!refreshToken) {
  //   return SendResponse(res, {
  //     statusCode: httpStatus.UNAUTHORIZED,
  //     success: false,
  //     message: "Refresh token is missing",
  //     data: undefined,
  //   });
  // }

  const result = await userService.refreshTokenIntoDB(refreshToken);
  const { createAccessToken, createRefreshToken } = result;

  res.cookie("refreshToken", createRefreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
  });

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed successfully",
    data: { accessToken: createAccessToken },
  });
});

const userDeleteFromDB = catchAsync(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const userController = {
  createUserFromDB,
  loginUser,
  getMyProfile,
  refreshTokenFromDb,
  getAllUsersFromDB,
  userDeleteFromDB,
};
