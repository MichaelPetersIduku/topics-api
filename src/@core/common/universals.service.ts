import { IResponse } from "./response";

export class UniversalsService {
  protected failureResponse = async (message?, data?): Promise<IResponse> => {
    return {
      statusCode: 400,
      status: false,
      message: message || "failed",
      data: data || null,
    };
  };

  protected successResponse = async (message?, data?): Promise<IResponse> => {
    return {
      statusCode: 200,
      status: true,
      message: message || "Success",
      data,
    };
  };

  protected serviceErrorHandler = async (req, error) => {
    const { originalUrl, method, ip, api } = req;
    console.log(
      "warn",
      `URL:${originalUrl} - METHOD:${method} - IP:${ip || api} - ERROR:${error}`
    );
    return {
      statusCode: 500,
      status: false,
      message: "Internal server error",
      data: null,
    };
  };
}
