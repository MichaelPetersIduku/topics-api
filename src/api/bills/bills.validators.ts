import joi from "joi";

export const airtimeSchema = joi.object({
  serviceID: joi.string().required().allow("mtn", "glo", "airtel", "etisalat"),
  amount: joi.string().required(),
  phone: joi.string().length(11).required(),
  password: joi.string().min(6).max(6).required(),
  xMobile: joi.string().min(11).max(11).required(),
});

export const variationsSchema = joi.object({
  serviceID: joi.string().required(),
});

export const productSchema = joi.object({
  serviceID: joi.string().required(),
  billersCode: joi.string().required(),
  variationCode: joi.string().required(),
  amount: joi.string().required(),
  phone: joi.string().required(),
  password: joi.string().min(6).max(6).required(),
  xMobile: joi.string().min(11).max(11).required(),
});
