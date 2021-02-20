import joi from "joi";

export const updateWalletSchema = joi.object({
  email: joi.string().email().required(),
  wallet: joi
    .object({
      availableBalance: joi.number().required(),
      ledgerBalance: joi.number().required(),
    })
    .required(),
});
