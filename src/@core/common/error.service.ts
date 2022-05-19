import logger from "../../util/logger/logger";

export default class CustomError {
  constructor(private readonly message: string, private readonly status: number) {
    logger.error(message);
  }
}
