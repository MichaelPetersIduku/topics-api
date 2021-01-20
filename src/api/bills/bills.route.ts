import express from "express";
import { inputValidator } from "../../util/middleware";
import { BillsController } from "./bills.controller";
import {
  airtimeSchema,
  productSchema,
  variationsSchema,
} from "./bills.validators";

export const billsRouter = express.Router();

billsRouter.get("/", new BillsController().bills);

billsRouter.post(
  "/airtime",
  inputValidator({ body: airtimeSchema }),
  new BillsController().airtimePurchase
);

billsRouter.get(
  "/variations",
  inputValidator({ query: variationsSchema }),
  new BillsController().getVariations
);

billsRouter.post(
  "/products",
  inputValidator({ body: productSchema }),
  new BillsController().productsPurchase
);
