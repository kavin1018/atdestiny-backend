import { Response } from 'express';

export class ResponseUtil {
    static sendResponse<T>(
        res: Response,
        statusCode: number,
        success: boolean,
        message: string,
        data?: T,
        meta?: any
    ): void {
        res.status(statusCode).json({
            success,
            message,
            data,
            meta,
        });
    }

    static success<T>(
        res: Response,
        message: string,
        data?: T,
        statusCode: number = 200,
        meta?: any
    ): void {
        ResponseUtil.sendResponse(res, statusCode, true, message, data, meta);
    }

    static created<T>(res: Response, message: string, data?: T): void {
        ResponseUtil.sendResponse(res, 201, true, message, data);
    }

    static error(
        res: Response,
        message: string,
        statusCode: number = 500,
        error?: any
    ): void {
        ResponseUtil.sendResponse(res, statusCode, false, message, undefined, error);
    }
}

export default ResponseUtil;
