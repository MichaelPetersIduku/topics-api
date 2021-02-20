import joi from "joi";

export const addTransactionSchema = joi.object({
  amount: joi.number().required(),
  beneficiary: joi
    .object({
      fullName: joi.string().required(),
      uid: joi.string().required(),
      xMobile: joi.string().required(),
    })
    .required(),
  narration: joi.string().required(),
  type: joi.string().required(),
  uid: joi.string().required(),
});
