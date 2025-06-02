import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";

export default class AuthController {
  public static login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    // res.cookie("token", result.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.status(200).json(result);
  });

  public static signup = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.signup(req.body);
    res.status(201).json(result);
  });

  public static getLoggedInUser = catchAsync(
    async (req: Request, res: Response) => {
      const result = await AuthService.getUser(req.user.sub);
      res.status(200).json(result);
    }
  );

  public static logout =(req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  };
}
