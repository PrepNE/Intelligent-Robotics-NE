import { ServiceAPIResponse } from "../types/service-auth-response";
import { IParkingLog } from "../types/types";
import prisma from "../utils/client";



export default class PlateLogService {


    public static getAllPlateLogs = async (): Promise<ServiceAPIResponse<IParkingLog[]>> => {
        const parkingLogs = await prisma.plateLog.findMany();

        return {
            success: true,
            body:parkingLogs,
            message: "All parking logs retrieved successfully."
        }
    }

}