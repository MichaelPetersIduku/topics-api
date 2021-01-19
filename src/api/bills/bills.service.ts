import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";

export class BillsService extends UniversalsService {
  public processBills = (meta, body): Promise<IResponse> => {
    console.log(meta, body);
    try {
      return this.successResponse("Welcome to bills API", body);
    } catch (error) {
      return this.serviceErrorHandler(meta, error);
    }
  };
}
