import { NextFunction, Request, Response } from "express";
import { UniversalsController } from "../../@core/common/universals.controller";
import { QuestionsService } from "./question.service";

export class QuestionsController extends UniversalsController {

  public getQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { ip, method, originalUrl } = req;
    try {
      const response = await new QuestionsService().getQuestions(
        { ip, method, originalUrl },
        req
      );
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };
}
