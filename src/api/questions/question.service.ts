import { IResponse } from "../../@core/common/response";
import { UniversalsService } from "../../@core/common/universals.service";
import Question from "../../@core/database/models/questions.model";
import Topics from "../../@core/database/models/topics.model";
import escapeStringRegexp from 'escape-string-regexp-node';


export class QuestionsService extends UniversalsService {
  public getQuestions = async (meta, req): Promise<IResponse> => {
    let { q } = req.query;
    q = q.toLowerCase().trim();
    try {
      // Get all topics that matches the query
      const topics = await Topics.find({
        $or: [
          { "children.children.name": { $regex: escapeStringRegexp(q), $options: "i" } },
          { "children.name": { $regex: escapeStringRegexp(q), $options: "i" } },
          { name: { $regex: escapeStringRegexp(q), $options: "i" } },
        ],
      });

      const qRegExp = new RegExp(escapeStringRegexp(q), 'i');

      const topic_ids = topics
        .flatMap((topic) => {
          if (qRegExp.test(topic.name)) return [topic._id];
          const childrenTopicIds = topic.children
            .filter((child) => qRegExp.test(child.name))
            .map((c) => c._id);
          if (childrenTopicIds.length > 0) return childrenTopicIds;
          const grandChildrenTopicIds = topic.children.flatMap((child) => {
            return child.children
              .filter((gchild) => qRegExp.test(gchild.name))
              .map((gc) => gc._id);
          });
          if (grandChildrenTopicIds.length > 0) return grandChildrenTopicIds;
        })
        .filter((i) => i);

      const questions = await Question.find(
        {
          topic_ids: { $in: topic_ids },
        },
        { questionNumber: 1 }
      );

      console.log(topics, "LENGTH", questions, topic_ids, qRegExp.test('chloroplasts and'));

      //   if (!user) return this.failureResponse("Failed to register user");
      return this.successResponse("Successful", questions);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };
}
