import { Router } from "express";
import { inputValidator } from "../../util/middleware";
import { getUserByIdSchema } from "../user/user.validator";
import { CardsController } from "./cards.controller";
import { addCardSchema, resolveCardAccountSchema } from "./cards.validator";

export const cardsRouter = Router();

cardsRouter.get("/", new CardsController().cards);

cardsRouter.post(
  "/add",
  inputValidator({ body: addCardSchema }),
  new CardsController().addCard
);

cardsRouter.post(
  "/resolve",
  inputValidator({ body: resolveCardAccountSchema }),
  new CardsController().resolveCardAccount
);

cardsRouter.delete(
  "/remove",
  inputValidator({ body: resolveCardAccountSchema }),
  new CardsController().deleteCard
);

cardsRouter.get(
  "/getUserCards",
  inputValidator({ query: getUserByIdSchema }),
  new CardsController().getAllUserCards
);
