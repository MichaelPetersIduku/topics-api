import { Router } from "express";
import { inputValidator } from "../../util/middleware";
import { UserController } from "./user.controller";

export const userRouter = Router();

userRouter.get("/", new UserController().users);
