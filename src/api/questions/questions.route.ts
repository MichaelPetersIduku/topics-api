import { Router } from "express";
import { inputValidator } from "../../util/middleware";
import { QuestionsController } from "./questions.controller";
import { searchQuestionsSchema } from "./questions.validator";

export const questionsRouter = Router();


questionsRouter.get(
  "/search",
  inputValidator({ query: searchQuestionsSchema }),
  new QuestionsController().getQuestions
);