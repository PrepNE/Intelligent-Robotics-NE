import { User } from "../generated/prisma";
import { JwtPayload } from "../../utils/jwt";



declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}



export interface IParkingLog {
 id: string;
  plateNumber: string;
  paymentStatus: number;
  entryTimestamp: Date;
  paymentTimestamp: Date | null;
  exitTimestamp: Date | null;
  exitStatus: string | null;
}

export type SafeUser = Omit<User, "password">