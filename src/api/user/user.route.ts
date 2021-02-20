import { Router } from "express";
import { inputValidator } from "../../util/middleware";
import { UserController } from "./user.controller";
import {
  getUserByxMobileSchema,
  loginSchema,
  otpSchema,
  registerUserSchema,
  smsSchema,
} from "./user.validator";

export const userRouter = Router();

userRouter.get("/", new UserController().users);

userRouter.post(
  "/register",
  inputValidator({ body: registerUserSchema }),
  new UserController().registerUser
);

userRouter.post(
  "/sendSMS",
  inputValidator({ body: smsSchema }),
  new UserController().sendSMS
);

userRouter.post(
  "/sendOTP",
  inputValidator({ body: otpSchema }),
  new UserController().sendOTP
);

userRouter.post(
  "/login",
  inputValidator({ body: loginSchema }),
  new UserController().loginUser
);

userRouter.get(
  "/getUser",
  inputValidator({ query: getUserByxMobileSchema }),
  new UserController().getUserByxMobile
);
