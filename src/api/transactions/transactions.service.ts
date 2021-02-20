import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import logger from "../../util/logger/logger";
import Transactions from "./transactions.model";

export class TransactionsService extends UniversalsService {
  public transactions = (meta, req): Promise<IResponse> => {
    const { body } = req;
    logger.info(JSON.stringify(body));
    try {
      return this.successResponse("Welcome to transactions API");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public addTransactions = async (meta, req): Promise<IResponse> => {
    const { body } = req;
    try {
      const transaction = await Transactions.create(body);
      return this.successResponse("Successful", transaction);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public getUserTransactions = async (meta, req): Promise<IResponse> => {
    const { uid } = req.query;
    try {
      const cards = await Transactions.find({ uid });
      return this.successResponse("Transactions fetched", cards);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };
}
