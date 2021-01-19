import { Request, Response } from "express";

export class UniversalsController {
  protected controllerErrorHandler = (
    req: Request,
    res: Response,
    error: any
  ) => {
    const { originalUrl, method, ip } = req;
    console.log(
      "warn",
      `URL:${originalUrl} - METHOD:${method} - IP:${ip} - ERROR:${error}`
    );
    return res
      .status(500)
      .json({ status: false, message: "Internal server error", data: null });
  };

  protected controllerResponseHandler = async (
    response: any,
    res: Response
  ): Promise<any> => {
    const { statusCode, status, message, data } = response;
    return res.status(statusCode).json({ status, message, data });
  };
}
