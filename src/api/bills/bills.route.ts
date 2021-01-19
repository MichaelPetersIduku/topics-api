import express from "express";
import { BillsController } from "./bills.controller";

export const billsRouter = express.Router();

billsRouter.get("/", new BillsController().bills);
