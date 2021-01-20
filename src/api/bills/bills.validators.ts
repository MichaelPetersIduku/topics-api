import joi from "joi";

export const airtimeSchema = joi.object({
  serviceID: joi.string().required().allow("mtn", "glo", "airtel", "etisalat"),
  amount: joi.string().required(),
  phone: joi.string().length(11).required(),
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
});
