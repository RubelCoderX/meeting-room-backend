import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const SendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  });
};

export default SendResponse;
