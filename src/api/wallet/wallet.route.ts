import { Router } from "express";
import { inputValidator } from "../../util/middleware";
import { WalletController } from "./wallet.controller";
import { updateWalletSchema } from "./wallet.validators";

export const walletRouter = Router();

walletRouter.get("/", new WalletController().wallet);

walletRouter.post(
  "/updateWallet",
  inputValidator({ body: updateWalletSchema }),
  new WalletController().updateWallet
);
