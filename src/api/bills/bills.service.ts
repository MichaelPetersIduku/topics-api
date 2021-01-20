import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import { config } from "secreta";
import { encode } from "base-64";
import randomize from "randomatic";
const {
  VTPASS_URL_TEST,
  VTPASS_URL_LIVE,
  VTPASS_EMAIL,
  VTPASS_PASSWORD,
} = config;
const VTPASS_URL = VTPASS_URL_LIVE;
const VTPASS_HEADERS = {
  Authorization: `Basic ${encode(`${VTPASS_EMAIL}:${VTPASS_PASSWORD}`)}`,
  "Content-Type": "application/json",
};
export class BillsService extends UniversalsService {
  public processBills = (meta, body): Promise<IResponse> => {
    console.log(meta, body);
    try {
      return this.successResponse("Welcome to bills API", body);
    } catch (error) {
      return this.serviceErrorHandler(meta, error);
    }
  };

  public processAirtimePurchase = async (meta, body): Promise<IResponse> => {
    console.log(body);
    const { serviceID, amount, phone } = body;
    try {
      const body = {
        request_id: randomize("*", "7"),
        serviceID,
        amount,
        phone,
      };
      const response = await this.apiCall(
        `${VTPASS_URL}pay`,
        body,
        VTPASS_HEADERS,
        "POST"
      );
      const responseData = await response.json();
      if (responseData.content.transactions.status === "delivered") {
        return this.successResponse(
          "Airtime purchase was successful",
          responseData
        );
      }
      return this.failureResponse(
        responseData.response_description,
        responseData
      );
    } catch (error) {
      return this.serviceErrorHandler(meta, error);
    }
  };

  public processGetVariations = async (meta, query) => {
    const { serviceID } = query;
    const url = `${VTPASS_URL}service-variations?serviceID=${serviceID}`;
    try {
      const response = await this.apiCall(url, null, VTPASS_HEADERS, "GET");
      const responseData = await response.json();
      if (responseData.response_description === "000") {
        return this.successResponse("Successful", responseData.content);
      } else {
        return this.failureResponse("Failed", responseData);
      }
    } catch (error) {
      return this.serviceErrorHandler(meta, error);
    }
  };

  public processProductsPurchase = async (meta, body) => {
    const { serviceID, billersCode, variationCode, amount, phone } = body;
    const url = `${VTPASS_URL}pay`;
    try {
      const reqBody = {
        request_id: randomize("*", "7"),
        serviceID,
        billersCode,
        variation_code: variationCode,
        amount,
        phone,
      };
      const response = await this.apiCall(url, reqBody, VTPASS_HEADERS, "POST");
      const responseData = await response.json();
      if (responseData.content.transactions.status === "delivered") {
        return this.successResponse(
          responseData.response_description,
          responseData.content
        );
      } else {
        return this.failureResponse(
          responseData.response_description,
          responseData
        );
      }
    } catch (error) {
      return this.serviceErrorHandler(meta, error);
    }
  };
}
