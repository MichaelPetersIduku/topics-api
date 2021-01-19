import { NextFunction, Request, Response } from "express";
import { UniversalsController } from "../../@core/common/universals.controller";
import { BillsService } from "./bills.service";

export class BillsController extends UniversalsController {
  public bills = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { ip, method, originalUrl, body } = req;
    try {
      const response = await new BillsService().processBills(
        { ip, method, originalUrl },
        body
      );
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };
}
