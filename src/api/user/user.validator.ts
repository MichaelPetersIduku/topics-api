import joi from "joi";

export const registerUserSchema = joi.object({
  fName: joi.string().required(),
  sName: joi.string().required(),
  email: joi.string().email().required(),
  xMobile: joi.string().max(11).min(11).required(),
  dob: joi.string().required(),
  sex: joi.string().allow("male", "female").required(),
  password: joi.string().max(6).min(6).required(),
  wallet: joi
    .object({
      availableBalance: joi.number().required(),
      ledgerBalance: joi.number().required(),
    })
    .required(),
});

export const smsSchema = joi.object({
  to: joi.string().required(),
  message: joi.string().required(),
});

export const otpSchema = joi.object({
  to: joi.string().required(),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).max(6).required(),
});

export const getUserByxMobileSchema = joi.object({
  xMobile: joi.string().required(),
});

export const getUserByIdSchema = joi.object({
  uid: joi.string().required(),
});
