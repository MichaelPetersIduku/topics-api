import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import logger from "../../util/logger/logger";
import Cards from "./cards.model";

export class CardsService extends UniversalsService {
  public cards = (meta, req): Promise<IResponse> => {
    const { body } = req;
    logger.info(JSON.stringify(body));
    try {
      return this.successResponse("Welcome to cards API");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public addCard = async (meta, req): Promise<IResponse> => {
    const { body } = req;
    try {
      const { account_no } = body;
      const cardExists = await Cards.findOne({ account_no });
      if (cardExists)
        return this.failureResponse(
          "Account already exists, please try another card"
        );
      await Cards.create(body);
      return this.successResponse("Card added successfully");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public resolveCardAccount = async (meta, req): Promise<IResponse> => {
    const { account_no } = req.body;
    try {
      const cardExists = await Cards.findOne({ account_no });
      if (cardExists)
        return this.successResponse(
          "Account already exists, please try another card"
        );
      return this.successResponse("Card not found");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public deleteCard = async (meta, req): Promise<IResponse> => {
    const { account_no } = req.body;
    try {
      const card = await Cards.findOneAndDelete({ account_no });
      if (!card) return this.failureResponse("Card was not found");
      return this.successResponse("Card deleted successfully");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public getAllUserCards = async (meta, req): Promise<IResponse> => {
    const { uid } = req.query;
    try {
      const cards = await Cards.find({ uid });
      return this.successResponse("Cards fetched", cards);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };
}
