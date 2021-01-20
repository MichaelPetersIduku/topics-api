import { IResponse } from "./response";
import fetch from "node-fetch";

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

  protected apiCall = async (api, body, headers, method, isXML?: boolean) => {
    try {
      let payLoad = { headers, method };
      if (isXML === true) {
        payLoad["body"] = body;
      } else {
        body ? (payLoad["body"] = JSON.stringify(body)) : payLoad;
      }
      const result = await fetch(api, payLoad);
      return result;
    } catch (error) {
      this.serviceErrorHandler({ api, body, headers, method }, error);
    }
  };
}
