"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SendResponse = (res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: true,
        statusCode: data.statusCode,
        message: data.message,
        token: data.token,
        data: data.data,
    });
};
exports.default = SendResponse;
