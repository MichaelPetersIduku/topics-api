import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { billsRouter } from "./api/bills/bills.route";
import { connectMongo } from "./@core/database/database.mongo";
import logger from "./util/logger/logger";
import { userRouter } from "./api/user/user.route";
import { walletRouter } from "./api/wallet/wallet.route";
import { transactionsrouter } from "./api/transactions/transactions.route";
import { cardsRouter } from "./api/cards/cards.route";

// create express server
const app: Application = express();

app.set("port", process.env.PORT || 4001);
app.set("env", "production");

app.use(cors());
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

// set up error handler
process.on("uncaughtException", (e: any) => {
  logger.log("error", e);
  process.exit(1);
});

process.on("unhandledRejection", (e: any) => {
  logger.log("error", e);
  process.exit(1);
});

//connect mongo database
connectMongo();

//Routes
app.use("/api/v1/bills", billsRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/wallets", walletRouter);
app.use("/api/v1/transactions", transactionsrouter);
app.use("/api/v1/cards", cardsRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to TEST API, Stella is a good girl, she is 18years old",
  });
});

export default app;
