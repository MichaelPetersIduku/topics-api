import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import logger from "../../util/logger/logger";
import User from "./user.model";
import bcrypt from "bcrypt";
import { SmsService } from "../../@core/common/sms.service";
import randomatic from "randomatic";

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

  public registerUser = async (meta, req): Promise<IResponse> => {
    const {
      fName,
      sName,
      email,
      xMobile,
      dob,
      sex,
      password,
      wallet,
    } = req.body;
    try {
      wallet.availableBalance = 0.0;
      wallet.ledgerBalance = 0.0;
      //check if user exists
      const userExists = await User.findOne({ $or: [{ xMobile }, { email }] });
      if (userExists) return this.failureResponse("User already exist");
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        fName,
        sName,
        email,
        xMobile,
        dob,
        sex,
        password: hashedPassword,
        wallet,
      });
      if (!user) return this.failureResponse("Failed to register user");
      return this.successResponse("User created successfully");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public sendSMS = async (meta, req): Promise<IResponse> => {
    const { to, message } = req.body;
    try {
      const data = await new SmsService().sendMessage(
        to,
        message,
        "com.quickpay"
      );
      return this.successResponse("Message sent successfully", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public sendOTP = async (meta, req): Promise<IResponse> => {
    const { to } = req.body;
    const otp = randomatic("0", 6);
    console.log(otp);
    try {
      const data = await new SmsService().sendMessage(
        to,
        `${otp} is your registration OTP for QuickPay \r\n Use it to verify your phone number. Thank you`,
        "com.quickpay"
      );

      return this.successResponse("OTP sent successfully", { otp, data });
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public loginUser = async (meta, req): Promise<IResponse> => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return this.failureResponse("User does not exist");
      const isUserValid = await this.validateUserPassword(user, password);
      const { status, message, data } = isUserValid;
      if (!status) return this.failureResponse(message, data);
      return this.successResponse("Logged in successfully", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public getUserByxMobile = async (meta, req): Promise<IResponse> => {
    const { xMobile } = req.query;
    try {
      const user: any = await User.findOne({ xMobile });
      if (!user) return this.failureResponse("User not found");
      delete user.password;
      return this.successResponse("User found", user);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };
}
