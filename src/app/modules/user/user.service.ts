import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../shared/prisma";
import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError";
import config from "../../config";
const createUser = async (data: any) => {
  const hashpassword: string = await bcrypt.hash(data.password, 10);

  const userData = {
    ...data,
    password: hashpassword,
    role: UserRole.USER,
  };
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
      expiresIn: "10m",
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
export const userService = {
  createUser,
  loginUser,
};
