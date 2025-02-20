import httpStatus from "http-status";
import { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import config from "../../config";
import { verifyToken } from "./user.contsant";

const createUser = async (data: User) => {
  // Check if the user already exists with the given email
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists.");
  }

  // Hash the password before saving
  const hashPassword: string = await bcrypt.hash(data.password, 10);

  const userData = {
    ...data,
    password: hashPassword,
    role: UserRole.user,
  };

  // Create and save the new user
  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "email or password is incorrect"
    );
  }
  const jwtPlayload = {
    userId: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    image: userData.profileImg,
    address: userData.address,
  };
  const accessToken = jwt.sign(
    jwtPlayload,
    config.jwt_access_secret as string,
    {
      expiresIn: "365d",
    }
  );
  const refreshToken = jwt.sign(
    jwtPlayload,
    config.jwt_refresh_secret as string,
    { expiresIn: "10d" }
  );

  return {
    userData,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};
const getMyProfile = async (user: User): Promise<Partial<User>> => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.admin) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.user) {
    profileInfo = await prisma.user.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};
const refreshTokenIntoDB = async (token: string) => {
  // Check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email: userEmail } = decoded;
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }

  const jwtPayload = {
    userId: user.id,
    userEmail: user.email,
    name: user.name,
    image: user.profileImg,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10m",
  });

  return { accessToken };
};

export const userService = {
  createUser,
  loginUser,
  getMyProfile,
  refreshTokenIntoDB,
};
