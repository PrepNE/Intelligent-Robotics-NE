import PlateLogService from "../services/platelog.service";
import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";


export default class PlateLogController {

    public static findAllPlateLogs = catchAsync(async (req: Request , res: Response) => {
        const result = await PlateLogService.getAllPlateLogs();
        res.status(200).json(result);
    })
}