import { Router } from "express";
import { inputValidator } from "../../util/middleware";
import { getUserByIdSchema } from "../user/user.validator";
import { TransactionsController } from "./transactions.controller";
import { addTransactionSchema } from "./transactions.validator";

export const transactionsrouter = Router();

transactionsrouter.get("/", new TransactionsController().transactions);

transactionsrouter.post(
  "/add",
  inputValidator({ body: addTransactionSchema }),
  new TransactionsController().addTransactions
);

transactionsrouter.get(
  "/getUserTransactions",
  inputValidator({ query: getUserByIdSchema }),
  new TransactionsController().getUserTransactions
);
