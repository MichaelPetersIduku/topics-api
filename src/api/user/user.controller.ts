import { NextFunction, Request, Response } from "express";
import { UniversalsController } from "../../@core/common/universals.controller";
import { UserService } from "./user.service";

export class UserController extends UniversalsController {
  public users = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { ip, method, originalUrl } = req;
    try {
      const response = await new UserService().users(
        { ip, method, originalUrl },
        req
      );
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };
}
