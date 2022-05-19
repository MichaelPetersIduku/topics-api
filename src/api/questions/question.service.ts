import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import Question from "../../@core/database/models/questions.model";
import Topics from "../../@core/database/models/topics.model";
import logger from "../../util/logger/logger";

export class QuestionsService extends UniversalsService {
  public getQuestions = async (meta, req): Promise<IResponse> => {
    const { q } = req.query;
    try {
      // Get all topics that matches the query
      const topics = await Topics.find({
        $or: [
          { "children.children.name": q },
          { "children.name": q },
          { name: q },
        ],
      });

      const topic_ids = topics.map((topic) => topic._id);

      const questions = await Question.find(
        {
          topic_ids: { $all: topic_ids },
        },
        { questionNumber: 1}
      );

      console.log(topics, "LENGTH", questions);

      //   if (!user) return this.failureResponse("Failed to register user");
      return this.successResponse("Successful", questions);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };
}
