import joi from "joi";

export const searchQuestionsSchema = joi.object({
  q: joi.string().required(),
});

