import { IResponse } from "./response";
import fetch from "node-fetch";
import logger from "../../util/logger/logger";
import bcrypt from "bcrypt";
import User from "../../api/user/user.model";

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
    logger.log(
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

  protected validateUserPassword = async (user, xpassword) => {
    const { password } = user;
    const isValidPassword = await bcrypt.compare(xpassword, password);
    if (!isValidPassword) return this.failureResponse("Password is invalid");
    delete user.password;
    return this.successResponse("Password is valid", user);
  };

  protected isUserValid4Transaction = async (xMobile, password, amount) => {
    try {
      const user: any = await User.findOne({ xMobile });
      if (!user) return this.failureResponse("User not found");
      const validateUserPassword = await this.validateUserPassword(
        user,
        password
      );
      const { status, message, data } = validateUserPassword;
      if (!status) return this.failureResponse(message, data);
      const { wallet } = user;
      const hasSufficientFunds = await this.checkWalletBalance(wallet, amount);
      const hasFundStatus = hasSufficientFunds.status;
      const hasFundsMessage = hasSufficientFunds.message;
      const hasFundsData = hasSufficientFunds.data;
      if (!hasFundStatus)
        return this.failureResponse(hasFundsMessage, hasFundsData);
      return this.successResponse("User valid for transaction", user);
    } catch (error) {
      return this.serviceErrorHandler(null, error);
    }
  };

  protected checkWalletBalance = async (wallet, amount) => {
    try {
      const { availableBalance } = wallet;
      if (availableBalance / 100 < amount)
        return this.failureResponse("insufficient funds");
      return this.successResponse("Sufficient funds");
    } catch (error) {
      return this.serviceErrorHandler(null, error);
    }
  };

  protected debitWallet = (wallet, amount) => {
    wallet.availableBalance = wallet.availableBalance * 1 - amount * 100;
    wallet.ledgerBalance = wallet.ledgerBalance * 1 - amount * 100;
    wallet.isLocked = false;
    return wallet;
  };

  protected creditWallet = (wallet, amount) => {
    wallet.availableBalance = wallet.availableBalance * 1 + amount * 100;
    wallet.ledgerBalance = wallet.ledgerBalance * 1 + amount * 100;
    wallet.isLocked = false;
    return wallet;
  };
}
