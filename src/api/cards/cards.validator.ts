import joi from "joi";

export const addCardSchema = joi.object({
  uid: joi.string().required(),
  bank_code: joi.string().required(),
  account_no: joi.string().max(10).min(10).required(),
  authorization_code: joi.string().required(),
  bin: joi.string().required(),
  last4: joi.string().max(4).min(4).required(),
  exp_month: joi.string().max(2).min(2).required(),
  exp_year: joi.string().max(4).required(),
  channel: joi.string().required(),
  card_type: joi.string().required(),
  bank: joi.string().required(),
  country_code: joi.string().required(),
  brand: joi.string().required(),
  default: joi.boolean().required(),
});

export const resolveCardAccountSchema = joi.object({
  account_no: joi.string().max(10).min(10).required(),
});
