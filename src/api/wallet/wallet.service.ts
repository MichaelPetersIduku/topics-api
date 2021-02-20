import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import logger from "../../util/logger/logger";
import User from "../user/user.model";

export class WalletService extends UniversalsService {
  public wallet = (meta, req): Promise<IResponse> => {
    const { body } = req;
    logger.info(JSON.stringify(body));
    try {
      return this.successResponse("Welcome to wallet API");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public updateWallet = async (meta, req): Promise<IResponse> => {
    const { wallet, email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return this.failureResponse("User does not exist");
      const newUser = await User.findOneAndUpdate(
        { email },
        { $set: { wallet } },
        { new: true, projection: { password: 0 } }
      );
      console.log(newUser);
      return this.successResponse("Wallet updated", newUser);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };
}
