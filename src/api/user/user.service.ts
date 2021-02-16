import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import logger from "../../util/logger/logger";

export class UserService extends UniversalsService {
  public users = (meta, req): Promise<IResponse> => {
    const { body } = req;
    logger.info(JSON.stringify(body));
    try {
      return this.successResponse("Welcome to users API");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };
}
